// Copy this file to config.js on the deployment server.
// Do not commit config.js if your deployment workflow injects values at runtime.
// These values are allowed in browser code only after RLS has been verified.

window.RTAFNC_CONFIG = Object.freeze({
  supabaseUrl: "https://YOUR_PROJECT_REF.supabase.co",
  supabasePublishableKey: "YOUR_SUPABASE_PUBLISHABLE_KEY",
  liffId: "YOUR_LIFF_ID",
  lineOaId: "@YOUR_LINE_OA_ID",

  // Keep true until LINE server verification, membership linking,
  // Supabase Auth session, RLS and private storage are complete.
  demoMode: true,
});
