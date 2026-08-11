# Task 5 report — deterministic daily plan and task actions

## Scope completed

- Added the pure `buildDailyPlan(input)` domain with typed review, lesson, practice, simulation, action, task, and plan contracts.
- Stable keys and deterministic sorting cover postponed debt, overdue date, at-risk state, concept ID, lesson ID, question IDs, and oldest/unattempted official exams.
- Allocation starts with floored 40/35/25 review/lesson/practice budgets, fills unused capacity by priority, and never lets reviews exceed 60% of the available session. Excess review-only time remains explicitly unused.
- Reviews use three minutes per concept. Lessons use ten-minute resumable chunks, a smaller known remainder, or a final 5–9 minute chunk. Practice uses 12 minutes/10 new questions or 6 minutes/5 new questions. Simulations retain their official duration and are selected only when they fit.
- Brand-new users receive a deterministic diagnostic new-question task plus their first incomplete lesson as time permits. Simulation eligibility requires either at least 20 unique attempted questions plus 10 reviewed concepts, or seven Madrid calendar days since the last simulation.
- Added server-only assembly from the authenticated user's `study_goals`, mastery, lesson progress, question attempts, simulation attempts, and recent plan actions, filtered against current active content. Generated plans are not persisted.
- Added authenticated postpone/replace server actions. The server rebuilds the current Madrid-day plan, validates original and replacement keys against active content, enforces same-or-shorter replacements, derives `user_id` from the session, and relies on existing RLS plus `(user_id, plan_date, task_key)` uniqueness.
- Postponement retries and identical replacement retries are idempotent, including duplicate-insert races. A different second action for the same original/date is rejected.
- Extended the Supabase mock to reproduce the daily-action uniqueness violation with SQLSTATE `23505`.

## Strict TDD evidence

### RED 1 — plan domain and actions

```text
pnpm test -- tests/daily-plan.test.ts tests/daily-plan-actions.test.ts
```

Exit 1: both focused suites failed to resolve the absent `lib/adaptive/daily-plan.ts` and `app/actions/daily-plan.ts`. This established the missing domain/action boundary before production code existed.

### GREEN 1 — deterministic allocator

```text
pnpm exec vitest run tests/daily-plan.test.ts
```

Exit 0: 8 initial plan-domain tests passed after the minimal implementation.

### RED/GREEN 2 — authenticated server assembly

```text
pnpm exec vitest run tests/daily-plan-server.test.ts
```

The RED run exited 1 because `lib/adaptive/daily-plan-server.ts` did not exist. After implementation, the GREEN run passed 2 tests covering active-content filtering, Madrid dates, unique history, incomplete lessons, recent actions, and new-user evidence state.

### GREEN 3 — action validation and idempotency

```text
pnpm exec vitest run tests/daily-plan-actions.test.ts
```

Exit 0: 4 tests passed for authenticated ownership, current-day validation, idempotent retries, replacement limits, active alternatives, and duration checks.

### RED/GREEN 4 — mock uniqueness parity

```text
pnpm exec vitest run tests/adaptive-learning-mock.test.ts
```

The RED run had 1 failure and 12 passes because the mock accepted a duplicate user/date/task action. The GREEN run passed all 13 tests and returned a `23505`-coded error without a second row.

### RED/GREEN 5 — lesson chunk boundary

A regression test first failed with a seven-minute lesson despite enough total plan time for the standard ten-minute chunk. The allocator now defers that lesson from its narrow initial category budget to the capacity-fill pass; the focused suite then passed 9/9.

## Verification

```text
pnpm exec vitest run tests/daily-plan.test.ts tests/daily-plan-server.test.ts tests/daily-plan-actions.test.ts tests/adaptive-learning-mock.test.ts
# 4 files, 28 tests passed

pnpm lint
# exit 0; 2 pre-existing Next.js navigation warnings

pnpm typecheck
# exit 0

pnpm test
# 40 files, 282 tests passed

pnpm build
# exit 0; production compilation, TypeScript, page data, and static generation passed

git diff --check
# exit 0
```

## Security and persistence review

- The plan is always computed from active repository content and owner-scoped history; there is no daily-plan table or materialized plan snapshot.
- Browser input never supplies a `user_id`, duration, active-state assertion, or task payload. Only date and stable task keys cross the server-action boundary, then the server reconstructs and validates their tasks.
- Persistence continues through the session-aware Supabase client, so `daily_plan_actions` RLS remains effective. Explicit `user_id` filters/writes match the authenticated user.
- The existing unique constraint is the concurrency authority for one action per original user/date; the action handles an identical `23505` race as an idempotent success.

## Concerns

- `evidenceSufficient` currently becomes true after the first active question attempt or completed recall. The stricter 20-question/10-concept threshold is reserved for first-simulation eligibility; future product calibration may choose a larger diagnostic sample without changing task persistence.
- The active lesson model has no authoritative total reading duration. Server assembly therefore emits ten-minute chunks and treats progress at 95–99% as a five-minute final chunk instead of inventing a total lesson length.

## Commit

- `feat: add deterministic daily planning`
