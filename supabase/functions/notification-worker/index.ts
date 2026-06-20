import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type NotificationEvent = {
  id: string;
  event_type: string;
  student_id: string | null;
  channel?: string | null;
  payload: Record<string, unknown> | null;
  status: string;
  attempts?: number | null;
};

type DeliveryResult = {
  channel: "line" | "telegram";
  recipient: string;
  ok: boolean;
  statusCode: number;
  responseText: string;
};

const MAX_BATCH = 25;
const MAX_ATTEMPTS = 6;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function getRequiredEnv(name: string) {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`missing_${name.toLowerCase()}`);
  return value;
}

function truncate(value: unknown, max = 2_000) {
  return String(value ?? "").slice(0, max);
}

function eventText(event: NotificationEvent) {
  const payload = event.payload ?? {};
  const explicit = truncate(payload.text, 4_000).trim();
  if (explicit) return explicit;

  const title = truncate(payload.title || payload.activity_title || payload.hospital_name || "RTAFNC", 300);
  const note = truncate(payload.note || payload.message || "", 1_500);
  const hours = payload.approved_hours != null ? `\nชั่วโมงอนุมัติ: ${payload.approved_hours}` : "";
  const followUp = payload.follow_up_date ? `\nวันติดตาม: ${payload.follow_up_date}` : "";

  const labels: Record<string, string> = {
    good_deed_approved: "บันทึกความดีได้รับการอนุมัติ",
    good_deed_returned: "บันทึกความดีถูกส่งกลับแก้ไข",
    good_deed_rejected: "บันทึกความดีไม่ได้รับอนุมัติ",
    hospital_follow_up: "มีนัดติดตามอาการ",
    hospital_resolved: "สิ้นสุดการติดตามอาการ",
    hospital_cancelled: "รายการโรงพยาบาลถูกยกเลิก",
    announcement_published: "มีข่าวประชาสัมพันธ์ใหม่",
    activation_code_created: "สร้างรหัสเปิดใช้งานแล้ว",
  };

  const heading = labels[event.event_type] ?? event.event_type;
  return [`RTAFNC: ${heading}`, title, note, hours, followUp].filter(Boolean).join("\n").slice(0, 4_000);
}

async function sendLinePush(lineUserId: string, text: string, retryKey: string): Promise<DeliveryResult> {
  const token = getRequiredEnv("LINE_CHANNEL_ACCESS_TOKEN");
  const response = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Line-Retry-Key": retryKey,
    },
    body: JSON.stringify({
      to: lineUserId,
      messages: [{ type: "text", text: text.slice(0, 5_000) }],
      notificationDisabled: false,
    }),
  });

  return {
    channel: "line",
    recipient: lineUserId,
    ok: response.ok,
    statusCode: response.status,
    responseText: truncate(await response.text(), 2_000),
  };
}

async function sendTelegram(chatId: string, text: string): Promise<DeliveryResult> {
  const token = getRequiredEnv("TELEGRAM_BOT_TOKEN");
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text.slice(0, 4_096),
      disable_notification: false,
      protect_content: true,
      link_preview_options: { is_disabled: true },
    }),
  });

  return {
    channel: "telegram",
    recipient: chatId,
    ok: response.ok,
    statusCode: response.status,
    responseText: truncate(await response.text(), 2_000),
  };
}

function retryDelaySeconds(attempts: number) {
  return Math.min(21_600, 30 * 2 ** Math.max(0, attempts));
}

async function processEvent(
  admin: ReturnType<typeof createClient>,
  event: NotificationEvent,
) {
  const attempts = Number(event.attempts ?? 0);
  const claim = await admin
    .from("notification_events")
    .update({ status: "processing", attempts: attempts + 1, processing_started_at: new Date().toISOString() })
    .eq("id", event.id)
    .in("status", ["pending", "retry"])
    .select("id")
    .maybeSingle();

  if (claim.error) throw claim.error;
  if (!claim.data) return { eventId: event.id, skipped: true, reason: "already_claimed" };

  const channels = new Set<string>();
  const requested = event.channel ?? event.payload?.channel ?? event.payload?.channels;
  if (Array.isArray(requested)) requested.forEach((value) => channels.add(String(value)));
  else if (requested) String(requested).split(",").forEach((value) => channels.add(value.trim()));
  if (!channels.size) channels.add(event.student_id ? "line" : "telegram");
  if (channels.has("both")) { channels.add("line"); channels.add("telegram"); }

  const text = eventText(event);
  const deliveries: Promise<DeliveryResult>[] = [];

  if (channels.has("line") && event.student_id) {
    const { data: lineAccount, error } = await admin
      .from("line_accounts")
      .select("line_user_id,active")
      .eq("student_id", event.student_id)
      .eq("active", true)
      .maybeSingle();
    if (error) throw error;
    if (lineAccount?.line_user_id) {
      const retryKey = /^[0-9a-f-]{36}$/i.test(event.id) ? event.id : crypto.randomUUID();
      deliveries.push(sendLinePush(String(lineAccount.line_user_id), text, retryKey));
    }
  }

  if (channels.has("telegram")) {
    const chatId = truncate(event.payload?.telegram_chat_id || Deno.env.get("TELEGRAM_STAFF_CHAT_ID"), 200).trim();
    if (chatId) deliveries.push(sendTelegram(chatId, text));
  }

  if (!deliveries.length) {
    await admin.from("notification_events").update({
      status: "failed",
      last_error: "no_delivery_target",
      processed_at: new Date().toISOString(),
    }).eq("id", event.id);
    return { eventId: event.id, ok: false, reason: "no_delivery_target" };
  }

  const results = await Promise.allSettled(deliveries);
  const normalized: DeliveryResult[] = results.map((result) => result.status === "fulfilled"
    ? result.value
    : {
      channel: "telegram",
      recipient: "unknown",
      ok: false,
      statusCode: 0,
      responseText: truncate(result.reason instanceof Error ? result.reason.message : result.reason),
    });

  for (const delivery of normalized) {
    const { error } = await admin.from("notification_deliveries").insert({
      event_id: event.id,
      channel: delivery.channel,
      recipient: delivery.recipient,
      status: delivery.ok ? "sent" : "failed",
      response_code: delivery.statusCode,
      response_body: delivery.responseText,
      attempted_at: new Date().toISOString(),
    });
    if (error) console.error("delivery log insert failed", error.message);
  }

  const allSent = normalized.every((delivery) => delivery.ok);
  const nextAttempts = attempts + 1;
  const exhausted = nextAttempts >= MAX_ATTEMPTS;
  const failedMessages = normalized.filter((delivery) => !delivery.ok).map((delivery) => `${delivery.channel}:${delivery.statusCode}`).join(",");
  const nextAttemptAt = new Date(Date.now() + retryDelaySeconds(nextAttempts) * 1_000).toISOString();

  const { error: updateError } = await admin.from("notification_events").update({
    status: allSent ? "sent" : exhausted ? "dead_letter" : "retry",
    processed_at: allSent || exhausted ? new Date().toISOString() : null,
    next_attempt_at: allSent || exhausted ? null : nextAttemptAt,
    last_error: allSent ? null : failedMessages || "delivery_failed",
  }).eq("id", event.id);
  if (updateError) throw updateError;

  return { eventId: event.id, ok: allSent, exhausted, deliveries: normalized.map(({ responseText: _responseText, ...rest }) => rest) };
}

async function processBatch(eventIds?: string[]) {
  const supabaseUrl = getRequiredEnv("SUPABASE_URL");
  const serviceRole = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const admin = createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let query = admin
    .from("notification_events")
    .select("id,event_type,student_id,channel,payload,status,attempts")
    .in("status", ["pending", "retry"])
    .lt("attempts", MAX_ATTEMPTS)
    .order("created_at", { ascending: true })
    .limit(MAX_BATCH);

  if (eventIds?.length) query = query.in("id", eventIds.slice(0, MAX_BATCH));
  else query = query.or(`next_attempt_at.is.null,next_attempt_at.lte.${new Date().toISOString()}`);

  const { data, error } = await query;
  if (error) throw error;

  const output = [];
  for (const event of (data ?? []) as NotificationEvent[]) {
    try {
      output.push(await processEvent(admin, event));
    } catch (error) {
      console.error("notification event failed", event.id, error instanceof Error ? error.message : error);
      await admin.from("notification_events").update({
        status: Number(event.attempts ?? 0) + 1 >= MAX_ATTEMPTS ? "dead_letter" : "retry",
        last_error: truncate(error instanceof Error ? error.message : error),
        next_attempt_at: new Date(Date.now() + retryDelaySeconds(Number(event.attempts ?? 0) + 1) * 1_000).toISOString(),
      }).eq("id", event.id);
      output.push({ eventId: event.id, ok: false, error: "processing_failed" });
    }
  }

  return output;
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const expectedSecret = Deno.env.get("NOTIFICATION_WORKER_SECRET")?.trim();
  const suppliedSecret = request.headers.get("x-worker-secret")?.trim();
  if (!expectedSecret || suppliedSecret !== expectedSecret) {
    return json({ error: "unauthorized" }, 401);
  }

  let eventIds: string[] | undefined;
  try {
    const body = await request.json().catch(() => ({}));
    eventIds = Array.isArray(body.eventIds)
      ? body.eventIds.filter((value: unknown) => typeof value === "string").slice(0, MAX_BATCH)
      : undefined;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const task = processBatch(eventIds).catch((error) => {
    console.error("notification batch failed", error instanceof Error ? error.message : error);
  });
  EdgeRuntime.waitUntil(task);

  return json({ accepted: true, requested_events: eventIds?.length ?? "pending_batch" }, 202);
});
