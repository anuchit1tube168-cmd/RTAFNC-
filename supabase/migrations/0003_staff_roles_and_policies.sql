-- RTAFNC Student System: staff role helpers and scoped policies
-- Run after 0002_line_member_auth.sql.

begin;

create or replace function public.has_active_role(required_role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.auth_user_id = auth.uid()
      and ur.role_code = required_role
      and ur.active = true
  );
$$;

create or replace function public.can_access_student(target_student_id uuid, required_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.students s on s.id = target_student_id
    where ur.auth_user_id = auth.uid()
      and ur.active = true
      and ur.role_code = any(required_roles)
      and (
        ur.scope_type = 'global'
        or (ur.scope_type = 'student' and ur.scope_value = target_student_id::text)
        or (ur.scope_type = 'cohort' and ur.scope_value = s.cohort::text)
        or (ur.scope_type = 'study_year' and ur.scope_value = s.current_year::text)
      )
  );
$$;

revoke all on function public.has_active_role(text) from public;
revoke all on function public.can_access_student(uuid, text[]) from public;
grant execute on function public.has_active_role(text) to authenticated;
grant execute on function public.can_access_student(uuid, text[]) to authenticated;

-- Staff may read student profile only within assigned scope.
create policy "staff reads scoped student profiles"
on public.students
for select
to authenticated
using (
  public.can_access_student(
    id,
    array['student_leader','good_deed_reviewer','medical_officer','year_advisor','admin','director']
  )
);

-- Good deed review policies.
create policy "good deed reviewers read scoped records"
on public.good_deed_records
for select
to authenticated
using (
  public.can_access_student(
    student_id,
    array['good_deed_reviewer','year_advisor','admin','director']
  )
);

create policy "good deed reviewers update scoped records"
on public.good_deed_records
for update
to authenticated
using (
  public.can_access_student(
    student_id,
    array['good_deed_reviewer','year_advisor','admin','director']
  )
)
with check (
  public.can_access_student(
    student_id,
    array['good_deed_reviewer','year_advisor','admin','director']
  )
  and status in ('pending','approved','returned','rejected')
);

-- Medical policies are intentionally separate. General admins are not included.
create policy "medical officers read scoped visits"
on public.hospital_visits
for select
to authenticated
using (
  public.can_access_student(
    student_id,
    array['medical_officer','director']
  )
);

create policy "medical officers update scoped visits"
on public.hospital_visits
for update
to authenticated
using (
  public.can_access_student(
    student_id,
    array['medical_officer','director']
  )
)
with check (
  public.can_access_student(
    student_id,
    array['medical_officer','director']
  )
  and status in ('recorded','follow_up','resolved','cancelled')
);

-- Staff document metadata access depends on module.
create policy "staff reads scoped good deed documents"
on public.documents
for select
to authenticated
using (
  module_type = 'good_deed'
  and public.can_access_student(
    owner_student_id,
    array['good_deed_reviewer','year_advisor','admin','director']
  )
);

create policy "medical staff reads scoped hospital documents"
on public.documents
for select
to authenticated
using (
  module_type = 'hospital'
  and public.can_access_student(
    owner_student_id,
    array['medical_officer','director']
  )
);

create policy "staff updates scoped good deed documents"
on public.documents
for update
to authenticated
using (
  module_type = 'good_deed'
  and public.can_access_student(
    owner_student_id,
    array['good_deed_reviewer','year_advisor','admin','director']
  )
)
with check (
  module_type = 'good_deed'
  and public.can_access_student(
    owner_student_id,
    array['good_deed_reviewer','year_advisor','admin','director']
  )
);

create policy "medical staff updates scoped hospital documents"
on public.documents
for update
to authenticated
using (
  module_type = 'hospital'
  and public.can_access_student(
    owner_student_id,
    array['medical_officer','director']
  )
)
with check (
  module_type = 'hospital'
  and public.can_access_student(
    owner_student_id,
    array['medical_officer','director']
  )
);

-- Storage access for reviewers. General users remain owner-only from migration 0002.
create policy "good deed reviewers read scoped evidence"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'good-deed-files'
  and public.can_access_student(
    ((storage.foldername(name))[1])::uuid,
    array['good_deed_reviewer','year_advisor','admin','director']
  )
);

create policy "medical officers read scoped hospital files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'hospital-files'
  and public.can_access_student(
    ((storage.foldername(name))[1])::uuid,
    array['medical_officer','director']
  )
);

-- News and activities management.
create policy "communications staff manage announcements"
on public.announcements
for all
to authenticated
using (
  public.has_active_role('admin') or public.has_active_role('director')
)
with check (
  public.has_active_role('admin') or public.has_active_role('director')
);

create policy "authorized staff manage activities"
on public.activities
for all
to authenticated
using (
  public.has_active_role('admin')
  or public.has_active_role('director')
  or public.has_active_role('year_advisor')
)
with check (
  public.has_active_role('admin')
  or public.has_active_role('director')
  or public.has_active_role('year_advisor')
);

create policy "authenticated users read open activities"
on public.activities
for select
to authenticated
using (status in ('open','closed','completed'));

grant select on public.user_roles to authenticated;
grant select, update on public.good_deed_records to authenticated;
grant select, update on public.hospital_visits to authenticated;
grant select, update on public.documents to authenticated;
grant select, insert, update, delete on public.announcements to authenticated;
grant select, insert, update, delete on public.activities to authenticated;

commit;
