-- RTAFNC Student System: verified LINE membership and student RLS
-- Run after 0001_core_schema.sql.

begin;

alter table public.line_accounts
  add column if not exists auth_user_id uuid unique;

create table if not exists public.activation_codes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  code_hash text not null unique,
  expires_at timestamptz not null,
  active boolean not null default true,
  used_at timestamptz,
  used_by_auth_user_id uuid,
  created_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_activation_codes_available
  on public.activation_codes(code_hash, active, expires_at)
  where used_at is null;

alter table public.activation_codes enable row level security;
revoke all on public.activation_codes from anon, authenticated;

create or replace function public.current_student_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select la.student_id
  from public.line_accounts la
  where la.auth_user_id = auth.uid()
    and la.active = true
  limit 1;
$$;

revoke all on function public.current_student_id() from public;
grant execute on function public.current_student_id() to authenticated;

-- Student identity
create policy "student reads own profile"
on public.students
for select
to authenticated
using (id = public.current_student_id());

create policy "student reads own line account"
on public.line_accounts
for select
to authenticated
using (student_id = public.current_student_id() and auth_user_id = auth.uid());

-- Good deeds: owner can read and submit. Review is reserved for later staff-role migration.
create policy "student reads own good deeds"
on public.good_deed_records
for select
to authenticated
using (student_id = public.current_student_id());

create policy "student inserts own good deeds"
on public.good_deed_records
for insert
to authenticated
with check (
  student_id = public.current_student_id()
  and status in ('draft', 'pending')
  and reviewed_by is null
  and reviewed_at is null
  and approved_hours is null
);

create policy "student updates editable own good deeds"
on public.good_deed_records
for update
to authenticated
using (
  student_id = public.current_student_id()
  and status in ('draft', 'returned')
)
with check (
  student_id = public.current_student_id()
  and status in ('draft', 'pending')
  and reviewed_by is null
  and reviewed_at is null
  and approved_hours is null
);

-- Hospital: owner-only in this phase. Medical staff access is added separately.
create policy "student reads own hospital visits"
on public.hospital_visits
for select
to authenticated
using (student_id = public.current_student_id());

create policy "student inserts own hospital visits"
on public.hospital_visits
for insert
to authenticated
with check (
  student_id = public.current_student_id()
  and created_by = auth.uid()
);

create policy "student updates own active hospital visits"
on public.hospital_visits
for update
to authenticated
using (
  student_id = public.current_student_id()
  and status in ('recorded', 'follow_up')
)
with check (
  student_id = public.current_student_id()
  and created_by = auth.uid()
  and status in ('recorded', 'follow_up', 'resolved')
);

-- Documents metadata
create policy "student reads own documents"
on public.documents
for select
to authenticated
using (owner_student_id = public.current_student_id());

create policy "student inserts own pending documents"
on public.documents
for insert
to authenticated
with check (
  owner_student_id = public.current_student_id()
  and created_by = auth.uid()
  and status = 'pending'
);

-- News read state
create policy "student reads own news acknowledgements"
on public.news_reads
for select
to authenticated
using (student_id = public.current_student_id());

create policy "student records own news acknowledgement"
on public.news_reads
for insert
to authenticated
with check (student_id = public.current_student_id());

create policy "student updates own news acknowledgement"
on public.news_reads
for update
to authenticated
using (student_id = public.current_student_id())
with check (student_id = public.current_student_id());

-- Activity registration
create policy "student reads own activity registrations"
on public.activity_registrations
for select
to authenticated
using (student_id = public.current_student_id());

create policy "student registers self"
on public.activity_registrations
for insert
to authenticated
with check (student_id = public.current_student_id());

-- Authenticated grants. RLS still controls rows.
grant select on public.students to authenticated;
grant select on public.line_accounts to authenticated;
grant select, insert, update on public.good_deed_records to authenticated;
grant select, insert, update on public.hospital_visits to authenticated;
grant select, insert on public.documents to authenticated;
grant select, insert, update on public.news_reads to authenticated;
grant select, insert on public.activity_registrations to authenticated;

-- Private storage ownership policies. Object path must start with student UUID.
create policy "student uploads own good deed files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'good-deed-files'
  and (storage.foldername(name))[1] = public.current_student_id()::text
);

create policy "student reads own good deed files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'good-deed-files'
  and (storage.foldername(name))[1] = public.current_student_id()::text
);

create policy "student uploads own hospital files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'hospital-files'
  and (storage.foldername(name))[1] = public.current_student_id()::text
);

create policy "student reads own hospital files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'hospital-files'
  and (storage.foldername(name))[1] = public.current_student_id()::text
);

create policy "student uploads own documents"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'student-documents'
  and (storage.foldername(name))[1] = public.current_student_id()::text
);

create policy "student reads own documents files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'student-documents'
  and (storage.foldername(name))[1] = public.current_student_id()::text
);

commit;

-- Important:
-- The line-auth Edge Function uses the service-role key to verify LINE identity,
-- consume a one-time activation code and bind auth.uid() to one student record.
