# Production auth fallback report

## Scope

- Added a proxy short-circuit for the public `/login` route before `updateSession`.
- Kept `/auth/callback` on the normal Supabase path so it can exchange an OAuth code.
- Preserved the existing response-cookie transfer for protected-route redirects.
- Added an inline sign-in error when OAuth returns a missing or malformed non-HTTP(S) redirect URL.

## Root cause addressed

The production Supabase hostname `xyjoetdnzcmgvlhzfpbw.supabase.co` was reported as NXDOMAIN. Previously every matched request, including `/login`, called `updateSession`, which invokes `supabase.auth.getUser()`. The login route now returns `NextResponse.next({ request })` without constructing or calling the Supabase middleware client.

## Regression coverage

- `/login` does not call `updateSession`.
- `/auth/callback` still calls `updateSession`.
- Anonymous protected-route redirects retain refreshed session cookies.
- OAuth initiation shows a safe inline error when its returned URL is unusable.

## Validation

- `pnpm vitest run tests/proxy.test.ts tests/google-sign-in.test.tsx` — 9 tests passed.
- `pnpm test` — 28 files and 180 tests passed.
- `pnpm typecheck` — passed.
- `pnpm lint` — 0 errors; two pre-existing warnings in `components/shell/user-menu.tsx` and `lib/supabase/mock-client.ts`.
- `pnpm build` — passed.
- `git diff --check` — passed.

## Limitations and non-changes

- No Supabase URL, OAuth provider, or environment configuration was changed.
- No blocking DNS or health request was added. A syntactically valid URL whose host later fails DNS resolution remains a browser/network failure; the route itself is now usable because it makes no session request.
