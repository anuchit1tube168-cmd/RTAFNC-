// Copy this file to config.js only after Supabase RLS and Storage Policies pass testing.
// Public browser code may contain only these non-secret identifiers.
window.RTAFNC_CONFIG = Object.freeze({
  demoMode: true,
  defaultSemester: 1,

  // Public identifiers — not secrets.
  liffId: "YOUR-LIFF-ID",
  lineOaId: "@YOUR_LINE_OA_ID",
  supabaseUrl: "https://YOUR_PROJECT_REF.supabase.co",
  supabasePublishableKey: "YOUR_SUPABASE_PUBLISHABLE_KEY",
});

// Never put these values in browser code or GitHub:
// - Supabase service_role key
// - Database password
// - LINE Channel Secret
// - LINE Channel Access Token
// - Telegram Bot Token
// - Google service-account JSON
