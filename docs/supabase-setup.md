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

The eight personal tables are `profiles`, `lesson_progress`, `question_attempts`, `simulation_attempts`, `simulation_answers`, `favorites`, `notes`, and `study_goals`.

Every row is owned by `user_id`, which references the Google-authenticated Supabase user in `auth.users`. Row-level security allows a signed-in user to select, insert, update, or delete only rows where `auth.uid()` equals `user_id`. The `simulation_answers` composite foreign key also requires its `user_id` to match the parent `simulation_attempts` owner.

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
pnpm test -- tests/study-schema-contract.test.ts
```

The pgTAP test covers owner success plus cross-user insert, select, and update denial. Simulation submissions use the tracked `submit_simulation_attempt` RPC so the parent attempt and its answers commit in one transaction under `auth.uid()` ownership. No real user credentials or provider secrets are required.
