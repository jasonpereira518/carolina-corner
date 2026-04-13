# Carolina Corner (Chapel Hill Virtual Booth)

Feature-complete frontend-first prototype of a chapel-focused video booth flow, built with Next.js App Router.

## Stack
- Next.js 16 + React 19 + TypeScript
- Tailwind installed (custom CSS used for visual direction)
- Supabase client scaffolding (inactive in prototype phase)
- Vitest + Testing Library (unit/component tests)
- Playwright (e2e scenarios)

## Run locally
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Test commands
```bash
npm run lint
npm run test
npm run test:e2e
```

## App flow routes
- `/booth/welcome`
- `/booth/user-info`
- `/booth/legal`
- `/booth/decline`
- `/booth/prompts`
- `/booth/prompt/reveal`
- `/booth/prompt/quote`
- `/booth/prompt/preview`
- `/booth/prompt/record`
- `/booth/prompt/review`
- `/booth/email`
- `/booth/goodbye`

## Key architecture
- `src/components/booth/BoothProvider.tsx`: flow state machine + persistence + adapter calls.
- `src/lib/booth/content.ts`: configurable copy, legal text, prompts, and theme contract.
- `src/lib/booth/types.ts`: session/prompt/recording and adapter interfaces.
- `src/lib/booth/supabase.ts`: typed Supabase wrapper.
- `src/lib/booth/supabaseAdapters.ts`: phase-2 adapter skeletons.

## Phase 2 docs
- `docs/supabase-phase2.md`
- `docs/analytics-events.md`

## Supabase activation
1. Copy `.env.example` to `.env.local`.
2. Set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_USE_SUPABASE=true`
3. Apply `supabase/schema.sql` in Supabase SQL editor.
4. Apply `supabase/policies.sql` in Supabase SQL editor.
5. Deploy edge functions:
   - `supabase functions deploy queue-booth-email`
   - `supabase functions deploy send-booth-preview-link`
6. Set Supabase function secrets:
   - `EMAIL_PROVIDER` (`resend` or `sendgrid`)
   - `EMAIL_FROM`
   - `RESEND_API_KEY` (if using Resend) or `SENDGRID_API_KEY` (if using SendGrid)
