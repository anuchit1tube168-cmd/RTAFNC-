-- CONTRACT FIXTURE ONLY.
-- The existing Cloudflare D1 database `rtafnc-campus-uat` is authoritative for UAT.
-- This file exists for CI/schema compatibility checks and bootstrap of an empty disposable sandbox.
-- It is NOT wired to Wrangler migrations and must not be applied over the existing UAT database.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS source_registry (
  source_key TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  title TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'google_drive',
  resource_id TEXT NOT NULL,
  resource_url TEXT,
  access_mode TEXT NOT NULL DEFAULT 'READ_ONLY',
  sensitivity TEXT NOT NULL DEFAULT 'INTERNAL',
  status TEXT NOT NULL,
  last_verified_at TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_core_staging (
  student_id TEXT PRIMARY KEY CHECK(length(student_id)=7),
  cohort INTEGER,
  year_level INTEGER CHECK(year_level BETWEEN 1 AND 4),
  rank_prefix TEXT,
  first_name TEXT,
  last_name TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING_VERIFY',
  source_key TEXT NOT NULL,
  source_version TEXT,
  source_row_ref TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(source_key) REFERENCES source_registry(source_key)
);

CREATE INDEX IF NOT EXISTS idx_student_core_year
  ON student_core_staging(year_level,status);

CREATE TABLE IF NOT EXISTS staff_core_staging (
  staff_key TEXT PRIMARY KEY,
  rank TEXT,
  first_name TEXT,
  last_name TEXT,
  position TEXT,
  unit TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING_VERIFY',
  source_key TEXT NOT NULL,
  source_row_ref TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(source_key) REFERENCES source_registry(source_key)
);

CREATE INDEX IF NOT EXISTS idx_staff_core_status
  ON staff_core_staging(status);

CREATE TABLE IF NOT EXISTS advisor_group_assignments_staging (
  student_id TEXT PRIMARY KEY CHECK(length(student_id)=7),
  advisor_group_no INTEGER NOT NULL CHECK(advisor_group_no BETWEEN 1 AND 99),
  academic_year INTEGER NOT NULL,
  identity_match_status TEXT NOT NULL,
  staff_binding_status TEXT NOT NULL,
  source_key TEXT NOT NULL,
  status TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(student_id) REFERENCES student_core_staging(student_id),
  FOREIGN KEY(source_key) REFERENCES source_registry(source_key)
);

CREATE INDEX IF NOT EXISTS idx_advisor_group_no
  ON advisor_group_assignments_staging(advisor_group_no,academic_year);

CREATE TABLE IF NOT EXISTS advisor_bindings_staging (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id TEXT NOT NULL,
  advisor_staff_key TEXT NOT NULL,
  academic_year INTEGER NOT NULL,
  valid_from TEXT,
  valid_to TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING_VERIFY',
  source_key TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, academic_year, advisor_staff_key),
  FOREIGN KEY(source_key) REFERENCES source_registry(source_key)
);

CREATE INDEX IF NOT EXISTS idx_advisor_bindings_student
  ON advisor_bindings_staging(student_id,academic_year);

CREATE TABLE IF NOT EXISTS integration_gates (
  gate_key TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  status TEXT NOT NULL,
  blocker TEXT,
  evidence_source_key TEXT,
  notes TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(evidence_source_key) REFERENCES source_registry(source_key)
);

CREATE TABLE IF NOT EXISTS good_deed_source_profile (
  source_key TEXT PRIMARY KEY,
  deed_count INTEGER NOT NULL,
  distinct_students INTEGER NOT NULL,
  approved_count INTEGER NOT NULL,
  rejected_count INTEGER NOT NULL,
  total_hours REAL NOT NULL,
  event_date_min TEXT,
  event_date_max TEXT,
  duplicate_deed_ids INTEGER NOT NULL,
  missing_student_ids INTEGER NOT NULL,
  invalid_student_ids INTEGER NOT NULL,
  active_roster_match_count INTEGER NOT NULL,
  names_copied INTEGER NOT NULL DEFAULT 0,
  descriptions_copied INTEGER NOT NULL DEFAULT 0,
  approvers_copied INTEGER NOT NULL DEFAULT 0,
  locations_copied INTEGER NOT NULL DEFAULT 0,
  images_copied INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(source_key) REFERENCES source_registry(source_key)
);

CREATE TABLE IF NOT EXISTS sync_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_key TEXT NOT NULL,
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  status TEXT NOT NULL DEFAULT 'STARTED',
  rows_seen INTEGER NOT NULL DEFAULT 0,
  rows_applied INTEGER NOT NULL DEFAULT 0,
  checksum TEXT,
  error TEXT,
  FOREIGN KEY(source_key) REFERENCES source_registry(source_key)
);

CREATE INDEX IF NOT EXISTS idx_sync_runs_source_key ON sync_runs(source_key);
