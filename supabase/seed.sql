-- RTAFNC staging seed data
-- Use only in a staging/test Supabase project.
-- Do not run this file in production with real student information.

begin;

insert into public.students (
  id,
  student_code,
  title,
  first_name,
  last_name,
  gender,
  cohort,
  current_year,
  academic_year,
  active_status
)
values (
  '67000000-0000-4000-8000-000000000001'::uuid,
  '6700000',
  'นพอ.',
  'ตัวอย่าง',
  'ระบบทดสอบ',
  'unspecified',
  67,
  2,
  2569,
  'active'
)
on conflict (student_code) do update set
  title = excluded.title,
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  cohort = excluded.cohort,
  current_year = excluded.current_year,
  academic_year = excluded.academic_year,
  active_status = excluded.active_status;

insert into public.good_deed_records (
  id,
  student_id,
  category_code,
  activity_date,
  activity_title,
  activity_location,
  details,
  verifier_name,
  requested_hours,
  approved_hours,
  academic_year,
  semester,
  status,
  submitted_at,
  reviewed_at
)
values
  (
    '67000000-0000-4000-8000-000000000101'::uuid,
    '67000000-0000-4000-8000-000000000001'::uuid,
    'GD01',
    current_date - 14,
    'บริจาคโลหิต ณ โรงพยาบาลตัวอย่าง',
    'โรงพยาบาลตัวอย่าง',
    'รายการสาธิตสำหรับทดสอบ Dashboard',
    'เจ้าหน้าที่ธนาคารเลือด',
    8.00,
    8.00,
    2569,
    1,
    'approved',
    now() - interval '14 days',
    now() - interval '13 days'
  ),
  (
    '67000000-0000-4000-8000-000000000102'::uuid,
    '67000000-0000-4000-8000-000000000001'::uuid,
    'GD03',
    current_date - 4,
    'ช่วยงานกิจกรรมภายใน วพอ.',
    'วิทยาลัยพยาบาลทหารอากาศ',
    'รายการสาธิตที่กำลังรอการตรวจสอบ',
    'อาจารย์ผู้ควบคุมกิจกรรม',
    6.00,
    null,
    2569,
    1,
    'pending',
    now() - interval '4 days',
    null
  )
on conflict (id) do nothing;

insert into public.hospital_visits (
  id,
  student_id,
  visit_date,
  hospital_name,
  symptoms,
  diagnosis,
  treatment_note,
  medication_note,
  medical_leave_days,
  follow_up_date,
  status,
  academic_year,
  semester
)
values
  (
    '67000000-0000-4000-8000-000000000201'::uuid,
    '67000000-0000-4000-8000-000000000001'::uuid,
    current_date - 7,
    'โรงพยาบาลตัวอย่าง',
    'ไข้ ไอ และเจ็บคอ',
    'URI (ข้อมูลสาธิต)',
    'พักผ่อนและติดตามอาการ',
    'ยาตามคำสั่งแพทย์ (ข้อมูลสาธิต)',
    1.0,
    current_date + 2,
    'follow_up',
    2569,
    1
  )
on conflict (id) do nothing;

insert into public.announcements (
  id,
  title,
  body,
  category,
  target_type,
  is_published,
  published_at,
  expires_at
)
values
  (
    '67000000-0000-4000-8000-000000000301'::uuid,
    'เปิดรับสมัครบริจาคโลหิต',
    'ลงทะเบียนผ่านหน้า LIFF และติดตามสถานะได้ในระบบ',
    'good_deed',
    'all',
    true,
    now() - interval '1 day',
    now() + interval '30 days'
  ),
  (
    '67000000-0000-4000-8000-000000000302'::uuid,
    'กิจกรรมจิตอาสาประจำเดือน',
    'นักเรียนสามารถบันทึกกิจกรรมและแนบหลักฐานได้จากเมนูบันทึกความดี',
    'activity',
    'all',
    true,
    now() - interval '12 hours',
    now() + interval '30 days'
  ),
  (
    '67000000-0000-4000-8000-000000000303'::uuid,
    'กำหนดส่งเอกสารประจำชั้นปี',
    'ตรวจสอบรายการเอกสารที่ต้องส่งเพิ่มเติมในเมนูเอกสาร',
    'document',
    'all',
    true,
    now() - interval '2 hours',
    now() + interval '30 days'
  )
on conflict (id) do update set
  title = excluded.title,
  body = excluded.body,
  is_published = excluded.is_published,
  published_at = excluded.published_at,
  expires_at = excluded.expires_at;

insert into public.activation_codes (
  id,
  student_id,
  code_hash,
  expires_at,
  active
)
values (
  '67000000-0000-4000-8000-000000000401'::uuid,
  '67000000-0000-4000-8000-000000000001'::uuid,
  encode(digest(upper(trim('RTAFNC-DEMO-6700000')), 'sha256'), 'hex'),
  now() + interval '30 days',
  true
)
on conflict (code_hash) do update set
  expires_at = excluded.expires_at,
  active = true,
  used_at = null,
  used_by_auth_user_id = null;

commit;

-- Demo activation code for staging only:
-- RTAFNC-DEMO-6700000
