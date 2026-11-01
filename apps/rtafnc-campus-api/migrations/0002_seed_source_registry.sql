INSERT OR REPLACE INTO source_registry (
  source_key, domain, provider, source_title, source_mode, sensitivity,
  authoritative, production_write_enabled, provider_ref, last_verified_at, notes
) VALUES
  ('DRIVE_STUDENT_MASTER_2569','CORE_STUDENT','GOOGLE_DRIVE','ฐานข้อมูลรายชื่อ นพอ. ปีการศึกษา 2569','READ_ONLY','PII',1,0,NULL,NULL,'Use 7-digit student_id as the business key. Provider reference is injected privately at runtime; never commit Drive IDs.'),
  ('DRIVE_HRIS_MASTER_2569','CORE_STAFF','GOOGLE_DRIVE','กำลังพล วพอ — HRIS Credential Pilot + Data Audit v11','READ_ONLY','PII',1,0,NULL,NULL,'Use verified personnel authority and status. No credential secrets are copied to D1.'),
  ('DRIVE_ADVISOR_MASTER_2569','ADVISOR','GOOGLE_DRIVE','MASTER_DB_ระบบอาจารย์ที่ปรึกษา_วพอ_2569','READ_ONLY','PII',1,0,NULL,NULL,'Advisor authorization must bind to verified staff identity; never authorize by display name alone.'),
  ('DRIVE_GOOD_DEED_2569','GOOD_DEED','GOOGLE_DRIVE','ระบบบันทึกความดี_วพอ_2569','READ_ONLY','PII',1,0,NULL,NULL,'Selected source. Legacy passwords are excluded. Good Deed runtime will be separated from CORE.'),
  ('DRIVE_HEALTH_MASTER_2569','HEALTH','GOOGLE_DRIVE','RTAFNC_ONE_HEALTH_MASTER_2569_CLEAN','READ_ONLY','HEALTH_SENSITIVE',1,0,NULL,NULL,'Health remains isolated and production write stays OFF until approved migration and RBAC/E2E gates pass.');
