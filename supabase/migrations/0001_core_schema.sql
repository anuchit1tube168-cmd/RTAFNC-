-- RTAFNC Student System: core schema
-- Security posture: deny personal-data access by default.
-- Run through Supabase migrations on a new project.

begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.app_settings (
  id integer primary key default 1 check (id = 1),
  app_name text not null default 'RTAFNC Student Portal',
  app_version text not null default '0.1.0',
  maintenance_mode boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.app_settings (id, app_name, app_version)
values (1, 'RTAFNC Student Portal', '0.1.0')
on conflict (id) do nothing;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  student_code text not null unique,
  title text,
  first_name text not null,
  last_name text not null,
  display_name text generated always as (trim(concat_ws(' ', title, first_name, last_name))) stored,
  gender text check (gender in ('female', 'male', 'other', 'unspecified')),
  date_of_birth date,
  cohort smallint,
  current_year smallint check (current_year between 1 and 4),
  academic_year smallint,
  phone text,
  profile_path text,
  active_status text not null default 'active'
    check (active_status in ('active', 'graduated', 'suspended', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.line_accounts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references public.students(id) on delete cascade,
  line_user_id text not null unique,
  line_display_name text,
  line_picture_url text,
  verified_at timestamptz,
  last_login_at timestamptz,
  friend_status text not null default 'unknown'
    check (friend_status in ('unknown', 'friend', 'blocked')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null,
  role_code text not null
    check (role_code in ('student', 'student_leader', 'good_deed_reviewer', 'medical_officer', 'year_advisor', 'admin', 'director')),
  scope_type text not null default 'global'
    check (scope_type in ('global', 'cohort', 'study_year', 'student')),
  scope_value text,
  active boolean not null default true,
  granted_at timestamptz not null default now(),
  unique (auth_user_id, role_code, scope_type, scope_value)
);

create table if not exists public.good_deed_categories (
  code text primary key,
  sort_order smallint not null unique,
  name_th text not null,
  description_th text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.good_deed_categories (code, sort_order, name_th, description_th)
values
  ('GD01', 1, 'บริจาคโลหิต / เกล็ดเลือด / พลาสมา', 'กิจกรรมบริจาคโลหิตและส่วนประกอบของโลหิต'),
  ('GD02', 2, 'โครงการภายนอกที่ออกคำสั่งจาก วพอ.', 'ปฏิบัติงานภายนอกตามคำสั่งของวิทยาลัย'),
  ('GD03', 3, 'ช่วยเหลืองานภายใน วพอ.', 'สนับสนุนงานและกิจกรรมภายในวิทยาลัย'),
  ('GD04', 4, 'เข้ารับการอบรมต่าง ๆ ที่ วพอ. จัด', 'อบรมหรือพัฒนาความรู้ตามที่วิทยาลัยจัด'),
  ('GD05', 5, 'ช่วยงานหน่วยงาน ชุมชน หรือมูลนิธิ', 'กิจกรรมช่วยเหลือสังคมและหน่วยงานภายนอก'),
  ('GD06', 6, 'ทำนุบำรุงศาสนสถาน', 'กิจกรรมดูแลหรือพัฒนาศาสนสถาน'),
  ('GD07', 7, 'งานฟรีทั่วไป', 'งานอาสาทั่วไปที่ไม่รับค่าตอบแทน'),
  ('GD08', 8, 'กิจกรรมแสดงความจงรักภักดีต่อสถาบันพระมหากษัตริย์', 'กิจกรรมถวายความเคารพและแสดงความจงรักภักดี')
on conflict (code) do update set
  sort_order = excluded.sort_order,
  name_th = excluded.name_th,
  description_th = excluded.description_th,
  active = true;

create table if not exists public.good_deed_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  category_code text not null references public.good_deed_categories(code),
  activity_date date not null,
  activity_title text not null,
  activity_location text,
  details text not null,
  verifier_name text,
  requested_hours numeric(6,2) not null check (requested_hours > 0 and requested_hours <= 24),
  approved_hours numeric(6,2) check (approved_hours >= 0 and approved_hours <= 24),
  academic_year smallint not null,
  semester smallint check (semester in (1, 2, 3)),
  status text not null default 'pending'
    check (status in ('draft', 'pending', 'approved', 'returned', 'rejected')),
  reviewer_note text,
  submitted_at timestamptz not null default now(),
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hospital_visits (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  visit_date date not null,
  hospital_name text not null,
  symptoms text not null,
  diagnosis text,
  treatment_note text,
  medication_note text,
  medical_leave_days numeric(5,1) not null default 0 check (medical_leave_days >= 0),
  follow_up_date date,
  status text not null default 'recorded'
    check (status in ('recorded', 'follow_up', 'resolved', 'cancelled')),
  academic_year smallint not null,
  semester smallint check (semester in (1, 2, 3)),
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  category text not null default 'general',
  target_type text not null default 'all'
    check (target_type in ('all', 'cohort', 'study_year', 'student')),
  target_value text,
  cover_path text,
  attachment_path text,
  is_published boolean not null default false,
  published_at timestamptz not null default now(),
  expires_at timestamptz,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news_reads (
  id uuid primary key default gen_random_uuid(),
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  read_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  unique (announcement_id, student_id)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  activity_date date not null,
  registration_open_at timestamptz,
  registration_close_at timestamptz,
  capacity integer check (capacity is null or capacity > 0),
  point_reward integer not null default 0 check (point_reward >= 0),
  good_deed_category_code text references public.good_deed_categories(code),
  status text not null default 'draft'
    check (status in ('draft', 'open', 'closed', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_registrations (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  status text not null default 'registered'
    check (status in ('registered', 'attended', 'absent', 'cancelled')),
  registered_at timestamptz not null default now(),
  checked_in_at timestamptz,
  unique (activity_id, student_id)
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_student_id uuid not null references public.students(id) on delete cascade,
  module_type text not null
    check (module_type in ('good_deed', 'hospital', 'student_document', 'activity', 'generated_report')),
  reference_id uuid,
  document_type text not null,
  title text not null,
  storage_bucket text not null,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  file_size bigint not null check (file_size >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'returned', 'rejected', 'archived')),
  created_by uuid,
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

create table if not exists public.notification_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  student_id uuid references public.students(id) on delete cascade,
  reference_type text,
  reference_id uuid,
  title text not null,
  message text not null,
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  created_at timestamptz not null default now()
);

create table if not exists public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.notification_events(id) on delete cascade,
  channel text not null check (channel in ('in_app', 'line', 'telegram')),
  recipient_id text not null,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'failed', 'skipped')),
  scheduled_at timestamptz not null default now(),
  sent_at timestamptz,
  retry_count smallint not null default 0 check (retry_count >= 0),
  external_message_id text,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_auth_user_id uuid,
  actor_role text,
  action text not null,
  entity_type text not null,
  entity_id text,
  student_id uuid references public.students(id) on delete set null,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists idx_students_student_code on public.students(student_code);
create index if not exists idx_line_accounts_line_user_id on public.line_accounts(line_user_id);
create index if not exists idx_good_deed_records_student_date on public.good_deed_records(student_id, activity_date desc);
create index if not exists idx_good_deed_records_status on public.good_deed_records(status, submitted_at desc);
create index if not exists idx_hospital_visits_student_date on public.hospital_visits(student_id, visit_date desc);
create index if not exists idx_hospital_visits_follow_up on public.hospital_visits(status, follow_up_date);
create index if not exists idx_announcements_feed on public.announcements(is_published, target_type, published_at desc);
create index if not exists idx_documents_owner on public.documents(owner_student_id, module_type, created_at desc);
create index if not exists idx_notification_queue on public.notification_deliveries(status, scheduled_at);
create index if not exists idx_audit_student_time on public.audit_logs(student_id, created_at desc);

create trigger students_updated_at before update on public.students
for each row execute function public.set_updated_at();
create trigger line_accounts_updated_at before update on public.line_accounts
for each row execute function public.set_updated_at();
create trigger good_deed_records_updated_at before update on public.good_deed_records
for each row execute function public.set_updated_at();
create trigger hospital_visits_updated_at before update on public.hospital_visits
for each row execute function public.set_updated_at();
create trigger announcements_updated_at before update on public.announcements
for each row execute function public.set_updated_at();
create trigger activities_updated_at before update on public.activities
for each row execute function public.set_updated_at();
create trigger documents_updated_at before update on public.documents
for each row execute function public.set_updated_at();

alter table public.app_settings enable row level security;
alter table public.students enable row level security;
alter table public.line_accounts enable row level security;
alter table public.user_roles enable row level security;
alter table public.good_deed_categories enable row level security;
alter table public.good_deed_records enable row level security;
alter table public.hospital_visits enable row level security;
alter table public.announcements enable row level security;
alter table public.news_reads enable row level security;
alter table public.activities enable row level security;
alter table public.activity_registrations enable row level security;
alter table public.documents enable row level security;
alter table public.notification_events enable row level security;
alter table public.notification_deliveries enable row level security;
alter table public.audit_logs enable row level security;

-- Anonymous/public access is intentionally limited to master categories
-- and announcements explicitly published to everyone.
revoke all on public.students from anon;
revoke all on public.line_accounts from anon;
revoke all on public.user_roles from anon;
revoke all on public.good_deed_records from anon;
revoke all on public.hospital_visits from anon;
revoke all on public.news_reads from anon;
revoke all on public.activity_registrations from anon;
revoke all on public.documents from anon;
revoke all on public.notification_events from anon;
revoke all on public.notification_deliveries from anon;
revoke all on public.audit_logs from anon;

create policy "read active good deed categories"
on public.good_deed_categories
for select
to anon, authenticated
using (active = true);

create policy "read public published announcements"
on public.announcements
for select
to anon, authenticated
using (
  is_published = true
  and target_type = 'all'
  and published_at <= now()
  and (expires_at is null or expires_at > now())
);

grant usage on schema public to anon, authenticated;
grant select on public.good_deed_categories to anon, authenticated;
grant select on public.announcements to anon, authenticated;

-- Private storage buckets. File-level RLS policies are added only after
-- verified member sessions and staff roles are implemented.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('good-deed-files', 'good-deed-files', false, 10485760, array['image/jpeg','image/png','image/webp','application/pdf']),
  ('hospital-files', 'hospital-files', false, 10485760, array['image/jpeg','image/png','image/webp','application/pdf']),
  ('student-documents', 'student-documents', false, 10485760, array['image/jpeg','image/png','image/webp','application/pdf']),
  ('public-news', 'public-news', true, 5242880, array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do nothing;

commit;

-- NEXT MIGRATION REQUIREMENTS
-- 1. Verify LINE ID token in an Edge Function.
-- 2. Link verified LINE sub to an allow-listed student record.
-- 3. Establish a trusted Supabase Auth session or server-mediated API.
-- 4. Add personal-data RLS policies only after step 3 is tested.
-- 5. Add storage.objects policies for owner paths and medical roles.
-- 6. Log every staff read/update of hospital data in audit_logs.
