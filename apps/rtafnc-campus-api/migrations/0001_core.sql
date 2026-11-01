PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS source_registry (
  source_key TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  provider TEXT NOT NULL,
  source_title TEXT NOT NULL,
  source_mode TEXT NOT NULL DEFAULT 'READ_ONLY',
  sensitivity TEXT NOT NULL DEFAULT 'INTERNAL',
  authoritative INTEGER NOT NULL DEFAULT 0 CHECK (authoritative IN (0,1)),
  production_write_enabled INTEGER NOT NULL DEFAULT 0 CHECK (production_write_enabled IN (0,1)),
  provider_ref TEXT,
  last_verified_at TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sync_runs (
  sync_run_id TEXT PRIMARY KEY,
  source_key TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  status TEXT NOT NULL CHECK (status IN ('RUNNING','PASS','FAIL','SKIPPED')),
  rows_seen INTEGER NOT NULL DEFAULT 0,
  rows_inserted INTEGER NOT NULL DEFAULT 0,
  rows_updated INTEGER NOT NULL DEFAULT 0,
  rows_rejected INTEGER NOT NULL DEFAULT 0,
  checksum TEXT,
  message TEXT,
  FOREIGN KEY (source_key) REFERENCES source_registry(source_key)
);

CREATE TABLE IF NOT EXISTS core_students (
  student_id TEXT PRIMARY KEY,
  cohort INTEGER,
  year_level INTEGER,
  title TEXT,
  first_name TEXT,
  last_name TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  source_key TEXT NOT NULL,
  source_row_hash TEXT,
  source_updated_at TEXT,
  synced_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_key) REFERENCES source_registry(source_key)
);

CREATE INDEX IF NOT EXISTS idx_core_students_cohort ON core_students(cohort);
CREATE INDEX IF NOT EXISTS idx_core_students_year_level ON core_students(year_level);
CREATE INDEX IF NOT EXISTS idx_core_students_status ON core_students(status);

CREATE TABLE IF NOT EXISTS core_staff (
  staff_key TEXT PRIMARY KEY,
  rank_title TEXT,
  first_name TEXT,
  last_name TEXT,
  position_title TEXT,
  unit_code TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  source_key TEXT NOT NULL,
  source_row_hash TEXT,
  source_updated_at TEXT,
  synced_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_key) REFERENCES source_registry(source_key)
);

CREATE INDEX IF NOT EXISTS idx_core_staff_unit_code ON core_staff(unit_code);
CREATE INDEX IF NOT EXISTS idx_core_staff_status ON core_staff(status);

CREATE TABLE IF NOT EXISTS advisor_bindings (
  binding_id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  advisor_staff_key TEXT NOT NULL,
  effective_from TEXT,
  effective_to TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  source_key TEXT NOT NULL,
  synced_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES core_students(student_id),
  FOREIGN KEY (advisor_staff_key) REFERENCES core_staff(staff_key),
  FOREIGN KEY (source_key) REFERENCES source_registry(source_key)
);

CREATE INDEX IF NOT EXISTS idx_advisor_bindings_student ON advisor_bindings(student_id, status);
CREATE INDEX IF NOT EXISTS idx_advisor_bindings_advisor ON advisor_bindings(advisor_staff_key, status);

CREATE TABLE IF NOT EXISTS audit_events (
  event_id TEXT PRIMARY KEY,
  event_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actor_type TEXT NOT NULL,
  actor_key TEXT,
  action TEXT NOT NULL,
  target_type TEXT,
  target_key TEXT,
  source_key TEXT,
  result TEXT NOT NULL,
  detail_json TEXT,
  FOREIGN KEY (source_key) REFERENCES source_registry(source_key)
);

CREATE INDEX IF NOT EXISTS idx_audit_events_time ON audit_events(event_time);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON audit_events(action);
