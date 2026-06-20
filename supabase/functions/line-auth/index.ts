import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function configuredOrigins() {
  return (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function corsHeaders(request: Request) {
  const requestOrigin = request.headers.get("Origin") ?? "";
  const allowed = configuredOrigins();
  const allowOrigin = allowed.length === 0
    ? "*"
    : allowed.includes(requestOrigin)
      ? requestOrigin
      : "";

  return {
    ...(allowOrigin ? { "Access-Control-Allow-Origin": allowOrigin } : {}),
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
    "Vary": "Origin",
  };
}

function originAllowed(request: Request) {
  const allowed = configuredOrigins();
  if (allowed.length === 0) return true;
  const origin = request.headers.get("Origin") ?? "";
  return allowed.includes(origin);
}

function json(request: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), "Content-Type": "application/json; charset=utf-8" },
  });
}

async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value.trim().toUpperCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function safeDatabaseError(error: { message?: string; code?: string } | null) {
  const message = String(error?.message ?? "");
  const knownCodes = [
    "invalid_or_expired_activation_code",
    "line_account_already_linked",
    "student_already_linked",
    "auth_session_already_linked",
    "missing_auth_user_id",
    "missing_line_user_id",
    "missing_activation_code_hash",
  ];
  return knownCodes.find((code) => message.includes(code)) ?? "membership_link_failed";
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    if (!originAllowed(request)) return json(request, { error: "origin_not_allowed" }, 403);
    return new Response("ok", { headers: corsHeaders(request) });
  }

  if (request.method !== "POST") {
    return json(request, { error: "method_not_allowed" }, 405);
  }

  if (!originAllowed(request)) {
    return json(request, { error: "origin_not_allowed" }, 403);
  }

  const contentLength = Number(request.headers.get("Content-Length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > 20_000) {
    return json(request, { error: "request_too_large" }, 413);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const lineChannelId = Deno.env.get("LINE_CHANNEL_ID");

    if (!supabaseUrl || !serviceRoleKey || !lineChannelId) {
      return json(request, { error: "server_not_configured" }, 500);
    }

    const authorization = request.headers.get("Authorization") ?? "";
    const accessToken = authorization.replace(/^Bearer\s+/i, "").trim();
    if (!accessToken) {
      return json(request, { error: "missing_supabase_session" }, 401);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: userData, error: userError } = await admin.auth.getUser(accessToken);
    if (userError || !userData.user) {
      return json(request, { error: "invalid_supabase_session" }, 401);
    }

    let body: { idToken?: unknown; activationCode?: unknown };
    try {
      body = await request.json();
    } catch {
      return json(request, { error: "invalid_json" }, 400);
    }

    const idToken = typeof body.idToken === "string" ? body.idToken.trim() : "";
    const activationCode = typeof body.activationCode === "string"
      ? body.activationCode.trim().toUpperCase()
      : "";

    if (!idToken || idToken.length > 8_000) {
      return json(request, { error: "missing_or_invalid_line_id_token" }, 400);
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
    if (!verifyResponse.ok || !lineClaims.sub || String(lineClaims.aud ?? "") !== lineChannelId) {
      return json(request, { error: "line_token_verification_failed" }, 401);
    }

    const authUserId = userData.user.id;
    const lineUserId = String(lineClaims.sub);
    const displayName = typeof lineClaims.name === "string" ? lineClaims.name.slice(0, 200) : "";
    const pictureUrl = typeof lineClaims.picture === "string" ? lineClaims.picture.slice(0, 2_000) : "";
    const now = new Date().toISOString();

    const { data: authAccount, error: authAccountError } = await admin
      .from("line_accounts")
      .select("id,student_id,line_user_id,active")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (authAccountError) throw authAccountError;
    if (authAccount && authAccount.line_user_id !== lineUserId) {
      return json(request, { error: "auth_session_already_linked" }, 409);
    }

    const { data: existingAccount, error: existingError } = await admin
      .from("line_accounts")
      .select("id,student_id,auth_user_id,active")
      .eq("line_user_id", lineUserId)
      .maybeSingle();

    if (existingError) throw existingError;

    let studentId: string;

    if (existingAccount) {
      if (!existingAccount.active) {
        return json(request, { error: "membership_disabled" }, 403);
      }

      if (existingAccount.auth_user_id && existingAccount.auth_user_id !== authUserId) {
        return json(request, { error: "line_account_session_conflict" }, 409);
      }

      studentId = existingAccount.student_id;

      const { error: updateError } = await admin
        .from("line_accounts")
        .update({
          auth_user_id: authUserId,
          line_display_name: displayName || null,
          line_picture_url: pictureUrl || null,
          verified_at: now,
          last_login_at: now,
          active: true,
        })
        .eq("id", existingAccount.id);

      if (updateError) throw updateError;
    } else {
      if (!activationCode) {
        return json(request, { error: "activation_required" }, 409);
      }

      if (activationCode.length < 8 || activationCode.length > 64) {
        return json(request, { error: "invalid_activation_code_format" }, 400);
      }

      const codeHash = await sha256Hex(activationCode);
      const { data: linkedStudentId, error: linkError } = await admin.rpc(
        "link_line_account_with_activation",
        {
          p_auth_user_id: authUserId,
          p_line_user_id: lineUserId,
          p_line_display_name: displayName,
          p_line_picture_url: pictureUrl,
          p_code_hash: codeHash,
        },
      );

      if (linkError || !linkedStudentId) {
        return json(request, { error: safeDatabaseError(linkError) }, 400);
      }

      studentId = String(linkedStudentId);
    }

    const { data: student, error: studentError } = await admin
      .from("students")
      .select("id,student_code,display_name,cohort,current_year,academic_year,active_status,profile_path")
      .eq("id", studentId)
      .single();

    if (studentError) throw studentError;
    if (student.active_status !== "active") {
      return json(request, { error: "student_not_active" }, 403);
    }

    const { error: auditError } = await admin.from("audit_logs").insert({
      actor_auth_user_id: authUserId,
      actor_role: "student",
      action: "line_login_verified",
      entity_type: "line_account",
      entity_id: lineUserId,
      student_id: studentId,
      metadata: { source: "line-auth", token_issuer: lineClaims.iss ?? null },
    });

    if (auditError) console.error("audit insert failed", auditError.message);

    return json(request, {
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
      verified_at: now,
    });
  } catch (error) {
    console.error("line-auth failure", error instanceof Error ? error.message : "unknown");
    return json(request, { error: "internal_error" }, 500);
  }
});
