# Supabase Phase 2 Activation Guide

## Planned tables
- `booth_sessions`
  - `id` uuid pk
  - `created_at` timestamptz
  - `updated_at` timestamptz
  - `status` text (`active`, `completed`)
  - `first_name` text
  - `onyen` text
  - `email` text
  - `legal_accepted` boolean
  - `completed_prompt_ids` text[]
- `booth_recordings`
  - `id` uuid pk
  - `session_id` uuid fk -> `booth_sessions.id`
  - `prompt_id` text
  - `duration_seconds` int
  - `storage_path` text
  - `status` text (`local`, `queued`, `submitted`)
  - `created_at` timestamptz

## Planned storage buckets
- `booth-recordings-private` (private, signed URL access)
- `booth-recordings-public-preview` (optional)

## Planned edge functions
- `queue-booth-email` to enqueue delivery payloads
- `send-booth-preview-link` for optional interim links

## Adapter migration strategy
1. Implement methods in `src/lib/booth/supabaseAdapters.ts`.
2. Keep existing interface contracts unchanged.
3. Swap provider wiring from `mockBoothAdapters` to Supabase adapters behind an env flag.
4. Add retries and error surfacing in UI once real network IO is active.
