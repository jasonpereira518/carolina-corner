alter table public.booth_sessions enable row level security;
alter table public.booth_recordings enable row level security;
alter table public.booth_email_jobs enable row level security;

drop policy if exists "booth_sessions_anon_rw" on public.booth_sessions;
create policy "booth_sessions_anon_rw"
on public.booth_sessions
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "booth_recordings_anon_rw" on public.booth_recordings;
create policy "booth_recordings_anon_rw"
on public.booth_recordings
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "booth_email_jobs_service_insert" on public.booth_email_jobs;
create policy "booth_email_jobs_service_insert"
on public.booth_email_jobs
for insert
to service_role
with check (true);

drop policy if exists "booth_email_jobs_service_select" on public.booth_email_jobs;
create policy "booth_email_jobs_service_select"
on public.booth_email_jobs
for select
to service_role
using (true);

drop policy if exists "booth_email_jobs_service_update" on public.booth_email_jobs;
create policy "booth_email_jobs_service_update"
on public.booth_email_jobs
for update
to service_role
using (true)
with check (true);
