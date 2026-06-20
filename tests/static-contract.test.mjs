import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const requiredFiles = [
  "apps/liff/index.html",
  "apps/liff/app-runtime.js",
  "apps/liff/interaction-hotfix.js",
  "apps/liff/styles.css",
  "apps/liff/extensions.css",
  "apps/liff/config.js",
  "apps/admin/index.html",
  "apps/admin/app.js",
  "apps/admin/interaction-hotfix.js",
  "apps/admin/styles.css",
  "apps/admin/config.js",
  "supabase/functions/line-auth/index.ts",
  "supabase/functions/notification-worker/index.ts",
  "supabase/migrations/202606200001_atomic_line_linking.sql",
  "supabase/migrations/202606200002_notification_delivery_state.sql",
  "docs/PRODUCTION_GAP_ANALYSIS.md",
  "docs/RLS_TEST_MATRIX.md",
];

for (const file of requiredFiles) {
  assert.ok(fs.existsSync(path.join(root, file)), `Missing required file: ${file}`);
  assert.ok(fs.statSync(path.join(root, file)).size > 0, `Required file is empty: ${file}`);
}

const liffRuntime = read("apps/liff/app-runtime.js");
const liffExtension = read("apps/liff/interaction-hotfix.js");
const liffIndex = read("apps/liff/index.html");
const liffConfig = read("apps/liff/config.js");
const adminRuntime = read("apps/admin/app.js");
const lineAuth = read("supabase/functions/line-auth/index.ts");
const notificationWorker = read("supabase/functions/notification-worker/index.ts");
const atomicLinking = read("supabase/migrations/202606200001_atomic_line_linking.sql");
const notificationState = read("supabase/migrations/202606200002_notification_delivery_state.sql");

const goodDeedCodes = ["GD01", "GD02", "GD03", "GD04", "GD05", "GD06", "GD07", "GD08"];
for (const code of goodDeedCodes) {
  assert.ok(liffRuntime.includes(code), `Student LIFF is missing good-deed category ${code}`);
}

const studentFunctions = [
  "submitGoodForm",
  "submitHospitalForm",
  "validateFiles",
  "uploadAttachments",
  "authenticateMember",
  "loadPrivateData",
  "markNewsRead",
];
for (const functionName of studentFunctions) {
  assert.ok(liffRuntime.includes(`function ${functionName}`) || liffRuntime.includes(`async function ${functionName}`), `Missing Student LIFF function: ${functionName}`);
}

const studentExtensions = [
  "register-activity",
  "cancel-activity",
  "read-staff-news",
  "rtafnc_demo_activity_registrations",
];
for (const extension of studentExtensions) {
  assert.ok(liffExtension.includes(extension), `Missing Student LIFF extension: ${extension}`);
}
assert.ok(liffIndex.includes("extensions.css"), "Student LIFF must load extension styles");

const adminCapabilities = [
  "viewDeed",
  "viewHospital",
  "openNewsForm",
  "openStudentForm",
  "generateCode",
  "logAudit",
  "queueNotification",
  "openImportStudents",
  "auditPage",
];
for (const functionName of adminCapabilities) {
  assert.ok(adminRuntime.includes(`function ${functionName}`) || adminRuntime.includes(`async function ${functionName}`), `Missing Staff function: ${functionName}`);
}

assert.match(liffConfig, /demoMode\s*:\s*true/, "Public config must remain in demo mode until production gates pass");
assert.ok(lineAuth.includes("https://api.line.me/oauth2/v2.1/verify"), "LINE ID token must be verified by the server");
assert.ok(lineAuth.includes("SUPABASE_SERVICE_ROLE_KEY"), "LINE auth requires server-side service-role secret");
assert.ok(lineAuth.includes("LINE_CHANNEL_ID"), "LINE auth requires server-side LINE channel ID");
assert.ok(lineAuth.includes("ALLOWED_ORIGINS"), "LINE auth should support an explicit origin allow-list");
assert.ok(lineAuth.includes("link_line_account_with_activation"), "LINE auth must use the atomic linking RPC");
assert.ok(atomicLinking.includes("for update"), "Atomic activation linking must lock the activation-code row");
assert.ok(atomicLinking.includes("grant execute") && atomicLinking.includes("service_role"), "Atomic linking RPC must be server-only");

const workerContracts = [
  "LINE_CHANNEL_ACCESS_TOKEN",
  "TELEGRAM_BOT_TOKEN",
  "NOTIFICATION_WORKER_SECRET",
  "EdgeRuntime.waitUntil",
  "notification_deliveries",
  "dead_letter",
  "X-Line-Retry-Key",
];
for (const contract of workerContracts) {
  assert.ok(notificationWorker.includes(contract), `Notification worker is missing: ${contract}`);
}
assert.ok(notificationState.includes("next_attempt_at"), "Notification queue migration must support delayed retries");
assert.ok(notificationState.includes("notification_events_queue_idx"), "Notification queue migration must create a queue index");

const filesToScan = [
  "apps/liff/index.html",
  "apps/liff/app-runtime.js",
  "apps/liff/interaction-hotfix.js",
  "apps/liff/config.js",
  "apps/admin/index.html",
  "apps/admin/app.js",
  "apps/admin/interaction-hotfix.js",
  "apps/admin/config.js",
];

const forbiddenPatterns = [
  /service_role\s*[:=]\s*["'][A-Za-z0-9._-]{20,}/i,
  /sk-proj-[A-Za-z0-9_-]{20,}/,
  /LINE_CHANNEL_SECRET\s*[:=]\s*["'][^"']+/i,
  /TELEGRAM_BOT_TOKEN\s*[:=]\s*["'][^"']+/i,
  /postgres(?:ql)?:\/\/[^\s"']+:[^\s"']+@/i,
];

for (const file of filesToScan) {
  const content = read(file);
  for (const pattern of forbiddenPatterns) {
    assert.ok(!pattern.test(content), `Possible secret detected in ${file}: ${pattern}`);
  }
}

console.log("RTAFNC static contract checks passed.");
