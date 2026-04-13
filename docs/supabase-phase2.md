# Supabase Phase 2 Activation Guide

## Current adapter status
- `SupabaseSessionStoreAdapter` implemented for create/update/complete in `src/lib/booth/supabaseAdapters.ts`.
- `SupabaseRecordingStoreAdapter` implemented for save/queue/submit status updates.
- `SupabaseEmailAdapter` implemented via edge function invokes:
  - `queue-booth-email`
  - `send-booth-preview-link`

Supabase mode is enabled only when:
- `NEXT_PUBLIC_USE_SUPABASE=true`
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set

## Required tables
- `booth_sessions`
  - `id` text pk
  - `step` text
  - `selected_prompt_id` text
  - `created_at` timestamptz
  - `updated_at` timestamptz
  - `status` text (`active`, `completed`)
  - `first_name` text
  - `onyen` text
  - `email` text
  - `legal_accepted` boolean
  - `completed_prompt_ids` text[]
  - `recordings_json` text
- `booth_recordings`
  - `id` text pk
  - `session_id` text fk -> `booth_sessions.id`
  - `prompt_id` text
  - `duration_seconds` int
  - `blob_url` text
  - `status` text (`local`, `queued`, `submitted`)
  - `created_at` timestamptz
  - `updated_at` timestamptz

Use:
- [schema.sql](/Users/jasonpereira/Jason/UNC/PLCY%20130/Carolina%20Corner/carolina-corner/supabase/schema.sql)
- [policies.sql](/Users/jasonpereira/Jason/UNC/PLCY%20130/Carolina%20Corner/carolina-corner/supabase/policies.sql)

## Planned storage buckets
- `booth-recordings-private` (private, signed URL access)
- `booth-recordings-public-preview` (optional)

## Edge functions
- `queue-booth-email`: stores a queued delivery job in `booth_email_jobs`
- `send-booth-preview-link`: stores a queued preview-link job in `booth_email_jobs`
- Function sources:
  - [queue-booth-email/index.ts](/Users/jasonpereira/Jason/UNC/PLCY%20130/Carolina%20Corner/carolina-corner/supabase/functions/queue-booth-email/index.ts)
  - [send-booth-preview-link/index.ts](/Users/jasonpereira/Jason/UNC/PLCY%20130/Carolina%20Corner/carolina-corner/supabase/functions/send-booth-preview-link/index.ts)

Both functions now:
- Insert a `queued` row in `booth_email_jobs`
- Attempt provider send immediately
- Update row to `sent` or `failed` with metadata

## Email provider env vars
- Required:
  - `EMAIL_FROM`
  - `EMAIL_PROVIDER` (`resend` or `sendgrid`; defaults to `resend`)
- For Resend:
  - `RESEND_API_KEY`
- For SendGrid:
  - `SENDGRID_API_KEY`

## Activation checklist
1. Run `supabase/schema.sql` in your Supabase SQL editor.
2. Run `supabase/policies.sql` in your Supabase SQL editor.
3. Deploy edge functions:
   - `supabase functions deploy queue-booth-email`
   - `supabase functions deploy send-booth-preview-link`
   - Set function secrets (example):
     - `supabase secrets set EMAIL_PROVIDER=resend EMAIL_FROM='Carolina Corner <noreply@yourdomain.com>' RESEND_API_KEY=...`
4. Set `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
   - `NEXT_PUBLIC_USE_SUPABASE=true`
5. Restart `npm run dev`.
