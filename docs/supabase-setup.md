# Supabase setup

## Create and configure the project

1. Create a Supabase project and copy only its project URL and anon key into the application environment used by the existing Supabase client. Do not commit credentials.
   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required outside Playwright. The application fails closed with a configuration error when either value is missing; the in-memory client is enabled only when the Playwright web server sets `PLAYWRIGHT_TEST=true`.
2. In Supabase Dashboard, open **Authentication → Providers → Google** and follow the official Google provider configuration guide. Configure the approved redirect URLs for this app in both Google Cloud and Supabase.
3. Apply the tracked migration:

   ```bash
   supabase link --project-ref <project-ref>
   supabase db push
   ```

   For local development, start Supabase first and reset the local database instead:

   ```bash
   supabase start
   supabase db reset
   ```

## Database ownership rule

The personal tables are `profiles`, `lesson_progress`, `question_attempts`, `simulation_attempts`, `simulation_answers`, `favorites`, `notes`, `study_goals`, `concept_mastery`, `review_events`, and `daily_plan_actions`.

Every row is owned by `user_id`, which references the Google-authenticated Supabase user in `auth.users`. Profiles, progress, favorites, notes, and study goals retain owner-scoped CRUD. Learning evidence in `concept_mastery`, `review_events`, `question_attempts`, `simulation_attempts`, and `simulation_answers` is owner-readable but may be written only by the validated review, practice, and simulation RPCs. Daily plan actions are owner-readable and append-only through `record_daily_plan_action`; direct authenticated inserts, updates, and deletes are revoked. The RPCs derive identity from `auth.uid()` and validate their respective immutable input contracts.

Daily plans themselves are not stored. The server rebuilds them from active content and owner history. A direct owner call to the daily-action RPC can only add a structurally valid preference for today's Madrid date; active-task and same-or-shorter replacement checks are reapplied when the plan is assembled, so stale keys are ignored and cannot activate content or expand access.

## Generate TypeScript types

After applying migrations, regenerate the checked-in contract from the connected project:

```bash
supabase gen types typescript --linked --schema public > lib/database.types.ts
```

## Test the schema

Run the pgTAP RLS suite against local Supabase:

```bash
supabase test db
```

The focused contract test can be run with the application suite:

```bash
pnpm exec vitest run tests/study-schema-contract.test.ts tests/daily-plan-security-contract.test.ts
```

The pgTAP test covers owner success plus cross-user insert, select, and update denial. Simulation submissions use the tracked `submit_simulation_attempt` RPC so the parent attempt and its answers commit in one transaction under `auth.uid()` ownership. No real user credentials or provider secrets are required.

After applying all migrations to a local or disposable PostgreSQL database with Supabase roles, run the behavioral RPC regression through an administrative connection:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/adaptive_learning_rpc.sql
```

The script runs inside `BEGIN`/`ROLLBACK` and checks RPC-only mutation privileges, private-schema isolation, same-payload retries, changed-payload rejection, atomic simulation children, and inactive-concept rejection. A successful run prints `RPC_BEHAVIOR_OK` and leaves no test rows behind.
