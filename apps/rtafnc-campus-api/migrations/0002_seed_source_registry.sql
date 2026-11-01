-- SAFE UAT POSTURE DEFAULTS ONLY.
-- Existing rows win because INSERT OR IGNORE is used.
-- This file intentionally does not seed source_registry or provider references.

INSERT OR IGNORE INTO system_config(key, value) VALUES
  ('environment', 'uat'),
  ('production_write', 'false'),
  ('production_write_enabled', 'false'),
  ('source_policy', 'google_drive_master_read_only'),
  ('identity_business_key', 'student_id_7_digits'),
  ('staff_login_enabled', 'false'),
  ('advisor_auth_enabled', 'false'),
  ('health_migration_enabled', 'false'),
  ('legacy_auth_reuse', 'false'),
  ('runtime', 'cloudflare-only');
