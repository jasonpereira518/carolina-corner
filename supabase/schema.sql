create extension if not exists pgcrypto;

create table if not exists public.booth_sessions (
  id text primary key,
  step text not null,
  first_name text null,
  onyen text null,
  email text null,
  legal_accepted boolean null,
  selected_prompt_id text null,
  completed_prompt_ids text[] null default '{}',
  recordings_json text null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.booth_recordings (
  id text primary key,
  session_id text not null references public.booth_sessions(id) on delete cascade,
  prompt_id text not null,
  duration_seconds integer not null,
  blob_url text not null,
  status text not null default 'local',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists booth_recordings_session_id_idx
  on public.booth_recordings(session_id);

create table if not exists public.booth_email_jobs (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references public.booth_sessions(id) on delete cascade,
  email text not null,
  type text not null check (type in ('delivery', 'preview')),
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed')),
  provider text null,
  provider_message_id text null,
  error_message text null,
  attempt_count integer not null default 0,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  sent_at timestamptz null,
  updated_at timestamptz not null default now()
);

create index if not exists booth_email_jobs_session_id_idx
  on public.booth_email_jobs(session_id);

alter table public.booth_email_jobs
  add column if not exists provider text null,
  add column if not exists provider_message_id text null,
  add column if not exists error_message text null,
  add column if not exists attempt_count integer not null default 0,
  add column if not exists sent_at timestamptz null,
  add column if not exists updated_at timestamptz not null default now();
