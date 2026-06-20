-- Apply after the core notification tables exist.

alter table if exists public.notification_events
  add column if not exists channel text,
  add column if not exists payload jsonb not null default '{}'::jsonb,
  add column if not exists status text not null default 'pending',
  add column if not exists attempts integer not null default 0,
  add column if not exists processing_started_at timestamptz,
  add column if not exists processed_at timestamptz,
  add column if not exists next_attempt_at timestamptz,
  add column if not exists last_error text;

alter table if exists public.notification_deliveries
  add column if not exists recipient text,
  add column if not exists status text not null default 'pending',
  add column if not exists response_code integer,
  add column if not exists response_body text,
  add column if not exists attempted_at timestamptz not null default now();

create index if not exists notification_events_queue_idx
  on public.notification_events (status, next_attempt_at, created_at);

create index if not exists notification_events_student_idx
  on public.notification_events (student_id, created_at desc);

create index if not exists notification_deliveries_event_idx
  on public.notification_deliveries (event_id, attempted_at desc);

create index if not exists notification_deliveries_status_idx
  on public.notification_deliveries (status, attempted_at desc);
