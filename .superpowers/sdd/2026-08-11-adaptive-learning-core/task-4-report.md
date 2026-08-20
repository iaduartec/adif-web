# Task 4 report — onboarding and editable preparation profile

## Scope completed

- Added authenticated `/onboarding` with server-loaded existing preferences and edit mode after completion.
- Added a progressive server action with only the form state UI on the client. It validates weekly minutes (1–1680), at least one day, UI-supported sessions (20/30/45/60), and Madrid-local non-past exam dates.
- Saves a per-user `study_goals` upsert, preserves the original completion timestamp during profile edits, and returns accessible errors with all submitted values retained.
- Routes incomplete authenticated users from dashboard paths to onboarding with their requested path preserved; `/onboarding` remains loop-free and anonymous visitors go to login.
- Adds the preparation-editor link to the account menu.
- Supports the optional diagnostic redirect to a deterministic, round-robin balanced selection of up to 15 official questions across available sections.
- Seeds the Playwright mock as complete for existing legacy E2E and provides a test-only mock reset endpoint to exercise incomplete users.

## TDD evidence

### RED

- `pnpm exec vitest run tests/onboarding.test.ts` initially failed because `lib/onboarding` did not exist.
- `pnpm exec vitest run tests/auth-redirect.test.ts` failed with the authenticated incomplete-user redirect returning `null`.
- `pnpm exec vitest run tests/onboarding-action.test.ts` and `tests/onboarding-form.test.tsx` failed because their server action and form modules did not exist.
- `pnpm exec vitest run tests/diagnostic-practice.test.tsx` failed with `Pregunta 1 de 50`, proving diagnostic ids were not yet applied.
- `pnpm exec playwright test e2e/onboarding.spec.ts` initially failed because the Playwright-only onboarding reset route did not exist.

### GREEN

- Focused unit, action, form, page, navigation, and diagnostic suites passed after each corresponding minimal implementation.
- The first browser run exposed a server-rendering failure in the client component. Root cause: a non-async constant re-export from a module marked `use server` is invalid in Next and also prevented reliable client-state initialization. The constant/type were moved to a client-safe shared state module; the action module now exports only the async server action. The focused E2E suite then passed.

## Verification

```text
pnpm lint                 # exit 0; 2 existing warnings in user-menu/mock-client
pnpm typecheck            # exit 0
pnpm test                 # 36 files, 260 tests passed
pnpm build                # exit 0
pnpm exec playwright test # 4 tests passed
git diff --check          # exit 0
```

## Self-review

- All persistence derives `user_id` from server authentication; no browser-supplied user id is accepted.
- `next` remains relative-only through the existing redirect sanitizer.
- Completion is checked in the proxy and the onboarding route is explicitly excluded from incomplete-user redirects.
- A missing/invalid diagnostic id list is limited to current official question IDs by filtering the repository output.
- The Playwright helper route is inaccessible when the runtime is not in mock mode.

## Concerns

- The diagnostic session uses all currently available official sections. The present official bank may have fewer than 15 questions in an individual section, so the selection is round-robin until each available section is exhausted rather than inventing non-official questions.

## Review round 1/5 — error handling and validation hardening

### Findings addressed

- Middleware now treats a `study_goals` read error as unavailable onboarding state, not incomplete onboarding, so authenticated users remain available instead of being trapped in onboarding. A clean `{ data: null, error: null }` remains incomplete as intended.
- The onboarding page shows an accessible load-error state and never fabricates default preferences after a failed goal read.
- The save action aborts before upsert when its completion-timestamp read fails, retains submitted values in an accessible form error, and therefore cannot clobber an existing timestamp. Upsert errors remain retryable with retained values.
- Preferred-day tokens are validated before numeric conversion and exam dates now round-trip through UTC calendar construction, rejecting blank tokens and dates such as `2026-02-31` before database persistence.
- The Playwright reset endpoint is the sole incomplete-onboarding proxy exception, remains 404 outside mock mode, and also returns 404 under explicit `NODE_ENV` or `VERCEL_ENV` production markers. Every onboarding E2E restores a completed mock state in `afterEach`.

### RED/GREEN evidence

Focused RED run produced the expected failures for malformed day/calendar validation, middleware fail-available behavior, action read-error no-write behavior, and page load-error UI. The initial run was `4 failed, 9 passed` across the four new focused contracts.

After the minimal fixes:

```text
pnpm exec vitest run tests/onboarding.test.ts tests/onboarding-action.test.ts tests/onboarding-page.test.tsx tests/middleware-onboarding.test.ts tests/auth-redirect.test.ts
# 5 files, 25 tests passed

pnpm exec playwright test e2e/onboarding.spec.ts
# 2 passed
```

### Full verification

```text
pnpm lint      # exit 0; 2 existing warnings
pnpm typecheck # exit 0
pnpm test      # 37 files, 266 tests passed
pnpm build     # exit 0
git diff --check # exit 0
```

### Self-review

- Confirmed a query error and an absent goal are distinct in the middleware contract.
- Confirmed the action does not call upsert when completion-state loading fails, and a subsequent retry remains successful without replacing the stored completion time.
- Confirmed diagnostic selection logic was not changed and remains balanced across available official sections.
