import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const requiredFiles = [
  "apps/liff/index.html",
  "apps/liff/app-runtime.js",
  "apps/liff/styles.css",
  "apps/liff/config.js",
  "apps/admin/index.html",
  "apps/admin/app.js",
  "apps/admin/styles.css",
  "supabase/functions/line-auth/index.ts",
  "docs/PRODUCTION_GAP_ANALYSIS.md",
];

for (const file of requiredFiles) {
  assert.ok(fs.existsSync(path.join(root, file)), `Missing required file: ${file}`);
  assert.ok(fs.statSync(path.join(root, file)).size > 0, `Required file is empty: ${file}`);
}

const liffRuntime = read("apps/liff/app-runtime.js");
const liffConfig = read("apps/liff/config.js");
const adminRuntime = read("apps/admin/app.js");
const lineAuth = read("supabase/functions/line-auth/index.ts");

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

const adminCapabilities = [
  "viewDeed",
  "viewHospital",
  "openNewsForm",
  "openStudentForm",
  "generateCode",
  "logAudit",
  "queueNotification",
];
for (const functionName of adminCapabilities) {
  assert.ok(adminRuntime.includes(`function ${functionName}`) || adminRuntime.includes(`async function ${functionName}`), `Missing Staff function: ${functionName}`);
}

assert.match(liffConfig, /demoMode\s*:\s*true/, "Public config must remain in demo mode until production gates pass");
assert.ok(lineAuth.includes("https://api.line.me/oauth2/v2.1/verify"), "LINE ID token must be verified by the server");
assert.ok(lineAuth.includes("SUPABASE_SERVICE_ROLE_KEY"), "LINE auth requires server-side service-role secret");
assert.ok(lineAuth.includes("LINE_CHANNEL_ID"), "LINE auth requires server-side LINE channel ID");

const filesToScan = [
  "apps/liff/index.html",
  "apps/liff/app-runtime.js",
  "apps/liff/config.js",
  "apps/admin/index.html",
  "apps/admin/app.js",
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
