# Task 3 report: secure study data schema

## Status

Implemented and committed as `feat: add secure study data schema`.

## Files

- `supabase/migrations/202608020001_study_schema.sql`
- `supabase/tests/rls.sql`
- `lib/database.types.ts`
- `docs/supabase-setup.md`
- `tests/study-schema-contract.test.ts`

## RED/GREEN evidence

- RED: the focused Vitest schema-contract test was written before the migration. With the migration temporarily moved to an exact, reversible `.red` path, the test failed at `existsSync(migrationPath)` as expected.
- GREEN: after restoring the migration, `pnpm test -- tests/study-schema-contract.test.ts` passed. The Vitest run reported 6 passing files and 20 passing tests.
- Full verification: `pnpm test`, `pnpm lint`, `pnpm typecheck`, and `pnpm build` all exited successfully. The existing Next.js middleware-deprecation warning remains unrelated to this task.

## Database-tool availability

`supabase` CLI and `docker` are unavailable in this environment. Consequently, `supabase test db` could not be run. The pgTAP RLS suite remains checked in at `supabase/tests/rls.sql`, and the focused schema-contract test was used as the permitted local fallback.

## Security self-review

- All eight personal tables use `user_id` with `auth.users(id)` and cascade deletion.
- RLS is enabled on every table, with separate owner-only SELECT, INSERT, UPDATE, and DELETE policies; no permissive `true` policies are used.
- `simulation_answers` has a composite `(attempt_id, user_id)` foreign key to its parent attempt, so ownership cannot be detached by an application-only write.
- The `updated_at` trigger function uses `security invoker` and a fixed `pg_catalog` search path.

## Concerns

The pgTAP test has not been executed against a real local Supabase PostgreSQL instance due to the missing CLI/Docker tooling. Run `supabase start`, `supabase db reset`, and `supabase test db` in an environment with the Supabase toolchain before deploying the migration.
