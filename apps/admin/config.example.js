// Public browser configuration for the Staff Console.
// Production access still requires Supabase Auth, user_roles and RLS.
window.RTAFNC_ADMIN_CONFIG = Object.freeze({
  demoMode: true,
  supabaseUrl: "https://YOUR_PROJECT_REF.supabase.co",
  supabasePublishableKey: "YOUR_SUPABASE_PUBLISHABLE_KEY",
});

// Never add server-side credentials or messaging tokens here.
