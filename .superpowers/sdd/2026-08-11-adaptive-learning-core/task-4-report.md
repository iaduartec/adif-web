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
