import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value.trim().toUpperCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const lineChannelId = Deno.env.get("LINE_CHANNEL_ID");

    if (!supabaseUrl || !serviceRoleKey || !lineChannelId) {
      return json({ error: "server_not_configured" }, 500);
    }

    const authorization = request.headers.get("Authorization") ?? "";
    const accessToken = authorization.replace(/^Bearer\s+/i, "").trim();
    if (!accessToken) {
      return json({ error: "missing_supabase_session" }, 401);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: userData, error: userError } = await admin.auth.getUser(accessToken);
    if (userError || !userData.user) {
      return json({ error: "invalid_supabase_session" }, 401);
    }

    const { idToken, activationCode } = await request.json();
    if (!idToken || typeof idToken !== "string") {
      return json({ error: "missing_line_id_token" }, 400);
    }

    const verifyBody = new URLSearchParams({
      id_token: idToken,
      client_id: lineChannelId,
    });

    const verifyResponse = await fetch("https://api.line.me/oauth2/v2.1/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: verifyBody,
    });

    const lineClaims = await verifyResponse.json();
    if (!verifyResponse.ok || !lineClaims.sub) {
      return json({ error: "line_token_verification_failed" }, 401);
    }

    const authUserId = userData.user.id;
    const lineUserId = String(lineClaims.sub);

    const { data: existingAccount, error: existingError } = await admin
      .from("line_accounts")
      .select("id,student_id,active")
      .eq("line_user_id", lineUserId)
      .maybeSingle();

    if (existingError) throw existingError;

    let studentId: string;

    if (existingAccount) {
      if (!existingAccount.active) {
        return json({ error: "membership_disabled" }, 403);
      }

      studentId = existingAccount.student_id;

      const { error: updateError } = await admin
        .from("line_accounts")
        .update({
          auth_user_id: authUserId,
          line_display_name: lineClaims.name ?? null,
          line_picture_url: lineClaims.picture ?? null,
          verified_at: new Date().toISOString(),
          last_login_at: new Date().toISOString(),
          active: true,
        })
        .eq("id", existingAccount.id);

      if (updateError) throw updateError;
    } else {
      if (!activationCode || typeof activationCode !== "string") {
        return json({ error: "activation_required" }, 409);
      }

      const codeHash = await sha256Hex(activationCode);
      const now = new Date().toISOString();

      const { data: activation, error: activationError } = await admin
        .from("activation_codes")
        .select("id,student_id,expires_at,active,used_at")
        .eq("code_hash", codeHash)
        .eq("active", true)
        .is("used_at", null)
        .gt("expires_at", now)
        .maybeSingle();

      if (activationError) throw activationError;
      if (!activation) {
        return json({ error: "invalid_or_expired_activation_code" }, 400);
      }

      studentId = activation.student_id;

      const { data: studentAccount, error: studentAccountError } = await admin
        .from("line_accounts")
        .select("id,line_user_id")
        .eq("student_id", studentId)
        .maybeSingle();

      if (studentAccountError) throw studentAccountError;
      if (studentAccount && studentAccount.line_user_id !== lineUserId) {
        return json({ error: "student_already_linked" }, 409);
      }

      if (studentAccount) {
        const { error: accountUpdateError } = await admin
          .from("line_accounts")
          .update({
            line_user_id: lineUserId,
            auth_user_id: authUserId,
            line_display_name: lineClaims.name ?? null,
            line_picture_url: lineClaims.picture ?? null,
            verified_at: now,
            last_login_at: now,
            active: true,
          })
          .eq("id", studentAccount.id);
        if (accountUpdateError) throw accountUpdateError;
      } else {
        const { error: accountInsertError } = await admin
          .from("line_accounts")
          .insert({
            student_id: studentId,
            line_user_id: lineUserId,
            auth_user_id: authUserId,
            line_display_name: lineClaims.name ?? null,
            line_picture_url: lineClaims.picture ?? null,
            verified_at: now,
            last_login_at: now,
            active: true,
          });
        if (accountInsertError) throw accountInsertError;
      }

      const { error: consumeError } = await admin
        .from("activation_codes")
        .update({
          used_at: now,
          used_by_auth_user_id: authUserId,
          active: false,
        })
        .eq("id", activation.id)
        .is("used_at", null);

      if (consumeError) throw consumeError;
    }

    const { data: student, error: studentError } = await admin
      .from("students")
      .select("id,student_code,display_name,cohort,current_year,academic_year,active_status,profile_path")
      .eq("id", studentId)
      .single();

    if (studentError) throw studentError;
    if (student.active_status !== "active") {
      return json({ error: "student_not_active" }, 403);
    }

    await admin.from("audit_logs").insert({
      actor_auth_user_id: authUserId,
      actor_role: "student",
      action: "line_login_verified",
      entity_type: "line_account",
      entity_id: lineUserId,
      student_id: studentId,
      metadata: { source: "line-auth" },
    });

    return json({
      ok: true,
      member: {
        id: student.id,
        student_code: student.student_code,
        display_name: student.display_name,
        cohort: student.cohort,
        current_year: student.current_year,
        academic_year: student.academic_year,
        profile_path: student.profile_path,
      },
    });
  } catch (error) {
    console.error("line-auth failure", error instanceof Error ? error.message : "unknown");
    return json({ error: "internal_error" }, 500);
  }
});
