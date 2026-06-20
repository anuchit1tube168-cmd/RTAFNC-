-- Atomic activation-code consumption and LINE account linking.
-- Run after the core tables have been created.

create or replace function public.link_line_account_with_activation(
  p_auth_user_id uuid,
  p_line_user_id text,
  p_line_display_name text,
  p_line_picture_url text,
  p_code_hash text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_activation public.activation_codes%rowtype;
  v_student_id uuid;
  v_existing_line public.line_accounts%rowtype;
  v_existing_student public.line_accounts%rowtype;
  v_existing_auth public.line_accounts%rowtype;
  v_now timestamptz := now();
begin
  if p_auth_user_id is null then
    raise exception using errcode = '22023', message = 'missing_auth_user_id';
  end if;

  if nullif(trim(p_line_user_id), '') is null then
    raise exception using errcode = '22023', message = 'missing_line_user_id';
  end if;

  if nullif(trim(p_code_hash), '') is null then
    raise exception using errcode = '22023', message = 'missing_activation_code_hash';
  end if;

  -- Lock the activation row. Only one concurrent transaction can consume it.
  select *
  into v_activation
  from public.activation_codes
  where code_hash = p_code_hash
    and active = true
    and used_at is null
    and expires_at > v_now
  for update
  limit 1;

  if not found then
    raise exception using errcode = 'P0001', message = 'invalid_or_expired_activation_code';
  end if;

  v_student_id := v_activation.student_id;

  select * into v_existing_line
  from public.line_accounts
  where line_user_id = p_line_user_id
  limit 1;

  if found and v_existing_line.student_id <> v_student_id then
    raise exception using errcode = '23505', message = 'line_account_already_linked';
  end if;

  select * into v_existing_student
  from public.line_accounts
  where student_id = v_student_id
  limit 1;

  if found and v_existing_student.line_user_id is not null and v_existing_student.line_user_id <> p_line_user_id then
    raise exception using errcode = '23505', message = 'student_already_linked';
  end if;

  select * into v_existing_auth
  from public.line_accounts
  where auth_user_id = p_auth_user_id
  limit 1;

  if found and v_existing_auth.student_id <> v_student_id then
    raise exception using errcode = '23505', message = 'auth_session_already_linked';
  end if;

  if v_existing_student.id is not null then
    update public.line_accounts
    set line_user_id = p_line_user_id,
        auth_user_id = p_auth_user_id,
        line_display_name = nullif(trim(p_line_display_name), ''),
        line_picture_url = nullif(trim(p_line_picture_url), ''),
        verified_at = v_now,
        last_login_at = v_now,
        active = true
    where id = v_existing_student.id;
  else
    insert into public.line_accounts (
      student_id,
      line_user_id,
      auth_user_id,
      line_display_name,
      line_picture_url,
      verified_at,
      last_login_at,
      active
    ) values (
      v_student_id,
      p_line_user_id,
      p_auth_user_id,
      nullif(trim(p_line_display_name), ''),
      nullif(trim(p_line_picture_url), ''),
      v_now,
      v_now,
      true
    );
  end if;

  update public.activation_codes
  set used_at = v_now,
      used_by_auth_user_id = p_auth_user_id,
      active = false
  where id = v_activation.id;

  return v_student_id;
end;
$$;

revoke all on function public.link_line_account_with_activation(uuid,text,text,text,text) from public;
revoke all on function public.link_line_account_with_activation(uuid,text,text,text,text) from anon;
revoke all on function public.link_line_account_with_activation(uuid,text,text,text,text) from authenticated;
grant execute on function public.link_line_account_with_activation(uuid,text,text,text,text) to service_role;

comment on function public.link_line_account_with_activation(uuid,text,text,text,text)
is 'Atomically consumes one activation code and links one LINE account to one student. Execute from a trusted server only.';
