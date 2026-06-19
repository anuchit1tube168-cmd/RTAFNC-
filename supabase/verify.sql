-- RTAFNC Supabase verification queries
-- Run after migrations and optional staging seed.

-- 1. Core tables
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'students',
    'line_accounts',
    'user_roles',
    'good_deed_categories',
    'good_deed_records',
    'hospital_visits',
    'announcements',
    'news_reads',
    'activities',
    'activity_registrations',
    'documents',
    'notification_events',
    'notification_deliveries',
    'audit_logs',
    'activation_codes'
  )
order by table_name;

-- 2. RLS must be enabled on every personal-data table
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'students',
    'line_accounts',
    'user_roles',
    'good_deed_records',
    'hospital_visits',
    'documents',
    'news_reads',
    'activity_registrations',
    'notification_events',
    'notification_deliveries',
    'audit_logs',
    'activation_codes'
  )
order by tablename;

-- 3. Exactly 8 active good-deed categories
select code, sort_order, name_th, active
from public.good_deed_categories
order by sort_order;

select count(*) as active_good_deed_category_count
from public.good_deed_categories
where active = true;

-- 4. Storage buckets and privacy settings
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id in (
  'good-deed-files',
  'hospital-files',
  'student-documents',
  'public-news'
)
order by id;

-- 5. Policies by table
select
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
from pg_policies
where schemaname in ('public', 'storage')
  and tablename in (
    'students',
    'line_accounts',
    'good_deed_records',
    'hospital_visits',
    'documents',
    'objects'
  )
order by schemaname, tablename, policyname;

-- 6. Demo data check; returns zero rows if seed.sql was not run
select id, student_code, display_name, cohort, current_year, academic_year, active_status
from public.students
where student_code = '6700000';

select id, category_code, activity_title, requested_hours, approved_hours, status
from public.good_deed_records
where student_id = '67000000-0000-4000-8000-000000000001'::uuid
order by activity_date desc;

select id, visit_date, hospital_name, status, follow_up_date
from public.hospital_visits
where student_id = '67000000-0000-4000-8000-000000000001'::uuid
order by visit_date desc;

-- Expected results:
-- - 15 core tables listed
-- - rowsecurity = true on every personal-data table
-- - active_good_deed_category_count = 8
-- - good-deed-files, hospital-files and student-documents have public = false
-- - public-news has public = true
