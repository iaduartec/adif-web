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

- Evidence is insufficient until both 20 unique active-question attempts and 10 reviewed active concepts exist. This is deliberately the same minimum-evidence gate used by the first-simulation branch.
- The active lesson model has no authoritative total reading duration. Server assembly therefore emits ten-minute chunks and treats progress at 95–99% as a five-minute final chunk instead of inventing a total lesson length.

## Commit

- `feat: add deterministic daily planning`

## Review round 1/5 — capacity, action integrity, and append-only persistence

### Findings addressed

- Removed the caller-supplied evidence flag. The pure engine now derives sufficient evidence exactly as `uniqueQuestionCount >= 20 && reviewedConceptCount >= 10`; either lower count selects the insufficient-evidence branch.
- Replaced the single practice task with deterministic, nonoverlapping blocks. Ten-question/12-minute blocks are used when the allocation supports them; five-question/6-minute blocks are used when the session budget needs scaling. Keys contain the diagnostic/new mode, block number, and a stable hash of the exact question IDs.
- Lessons now expose successive stable ten-minute chunks, a known 5–9 minute final remainder, and a 5–9 minute capacity-fill chunk. Allocation continues across all eligible blocks until nothing fits, while the review cap remains absolute.
- Insufficient 60-minute plans continue beyond the mandatory diagnostic and first incomplete lesson with additional new-question and lesson blocks. Seven-day-due official simulations remain eligible even while the evidence sample is below 20/10.
- Yesterday's postponed stable key is promoted for every task family: review, lesson, practice block, and simulation. Debt affects selection as well as output order.
- Action replay no longer deduplicates collisions. An invalid/conflicting stored replacement leaves the original work intact; valid replacements preserve task count. A replacement is invalid if its target is already selected, is another action's original or target, is inactive, is oversized, is repeated, or is the same key.
- Server replacement validation enforces those same conflicts before persistence and reconstructs every candidate from active content and authenticated history.
- Added forward-only migration `202608110005_daily_plan_actions_rpc.sql`. Authenticated direct `INSERT`, `UPDATE`, and `DELETE` are revoked, mutation policies are removed, and the only learner write path is `record_daily_plan_action`, a security-definer RPC that derives `auth.uid()`, requires today's Madrid date, validates action/key shape, and implements immutable identical retries through the unique user/date/task key.
- The mock implements RPC idempotency/conflict behavior and now detects both stored and within-payload duplicate daily actions before any batch row is written.
- Pure date validation performs a UTC calendar round trip, rejecting impossible ISO-looking dates such as `2026-02-31`. Date-dependent action and mock tests freeze time explicitly.

### RED evidence

The first focused review run exited 1 with 15 failures and 6 passes across plan, assembly, and action suites. It demonstrated the one-event evidence gate, single practice/session output, capacity left despite eligible work, conflicting replacements deleting work through deduplication, debt limited to reviews, source-dependent current dates, and acceptance of impossible calendar dates.

The security/mock RED run exited 1 with 3 failures and 13 passes: migration 005 was absent, the action RPC was unknown, and an internally duplicated two-row mock insert committed both rows.

A dedicated server-action RED then resolved `{ ok: true }` for a replacement target already postponed by today's actions. Additional allocator RED tests showed a lower-priority practice block winning over an eligible partial lesson and a ten-question pool not scaling into two stable half blocks.

### GREEN evidence

```text
pnpm exec vitest run tests/daily-plan.test.ts tests/daily-plan-server.test.ts tests/daily-plan-actions.test.ts tests/daily-plan-security-contract.test.ts tests/adaptive-learning-mock.test.ts
# 5 files, 41 tests passed

pnpm typecheck
# exit 0

pnpm test
# 41 files, 295 tests passed
```

### Live PostgreSQL replay

A disposable PostgreSQL 16 cluster was initialized from zero with the Supabase auth-role shim and all five migrations applied in order. Under `authenticated`, the new RPC accepted one action, returned the identical retry, rejected a changed action with `23505`, and left exactly one row. Direct authenticated `INSERT`, `UPDATE`, and `DELETE` privilege checks all returned false. The replay ended with:

```text
DAILY_PLAN_RPC_OK
ROLLBACK
```

The cluster was stopped and its temporary directory removed after verification.

### Full round verification

```text
pnpm lint       # exit 0; 2 pre-existing navigation warnings
pnpm typecheck  # exit 0
pnpm test       # 41 files, 295 tests passed
pnpm build      # exit 0
git diff --check # exit 0
```

### Remaining boundary

The database deliberately does not duplicate the TypeScript active-content catalog or duration allocator. An authenticated owner could call the RPC directly with structurally valid but stale task keys; this only writes that owner's non-security-sensitive planning preference. Plan assembly and action replay always require an active candidate, enforce same-or-shorter duration, and preserve the original task for invalid rows, so such a row cannot activate content, expand authorization, or inject an oversized replacement.

## Review round 2/5 — final-plan invariants and simulation cardinality

### Findings addressed

- Added one shared append-invariant check used by both allocation and action replay. Every inserted task must keep the total within available minutes, review work within `floor(60%)`, task keys unique, simulations at one maximum, and lesson blocks in prerequisite order.
- A replacement that fails any final-plan invariant now leaves the original task in place. Later lesson blocks are accepted only when the preceding stable block key is already earlier in the rebuilt plan.
- Simulation allocation now consumes at most one official exam. Remaining capacity can still be filled with independent practice blocks, but additional simulation candidates are skipped.
- Added action-replay coverage proving a second simulation cannot be introduced through a same-duration replacement, plus positive and negative prerequisite replacement cases.

### RED evidence

The focused test run exited 1 with 3 failures and 16 passes. It showed all three review findings directly: three official simulations were selected into one plan, a replacement raised review work from 12 to 15 minutes in a 20-minute plan, and `lesson:lesson-z:block:1` replaced an unrelated lesson even though `lesson:lesson-z` was absent.

### GREEN and full verification

```text
pnpm exec vitest run tests/daily-plan.test.ts
# 1 file, 21 tests passed

pnpm test
# 41 files, 298 tests passed

pnpm typecheck
# exit 0

pnpm lint
# exit 0; 2 pre-existing Next.js navigation warnings

pnpm build
# exit 0; production compilation, TypeScript, page data, and static generation passed

git diff --check
# exit 0
```

### Concerns

- No new persistence or authorization boundary was introduced in this round. The prior owner-only stale-key boundary remains unchanged and harmless because rebuilt plans revalidate candidates and all aggregate invariants.

## Review round 3/5 — atomic replacement replay

### Finding addressed

- Replacement replay no longer builds the result incrementally and drops a later untouched task when the replacement consumes an aggregate invariant first.
- Explicit postponements are removed up front. Each otherwise valid replacement is then proposed in place against the complete remaining plan and committed only if the whole ordered task sequence passes every shared invariant.
- A rejected proposal leaves both its original task and every unrelated original task unchanged. In particular, replacing an earlier lesson with another simulation cannot displace the already selected later official simulation.

### RED evidence

The focused test run exited 1 with 1 failure and 21 passes. The rebuilt plan incorrectly contained only `simulation:exam-b`; it had replaced `lesson:lesson-a` and then silently discarded untouched `simulation:exam-a`.

### GREEN and full verification

```text
pnpm exec vitest run tests/daily-plan.test.ts
# 1 file, 22 tests passed

pnpm test
# 41 files, 299 tests passed

pnpm typecheck
# exit 0

pnpm lint
# exit 0; 2 pre-existing Next.js navigation warnings

pnpm build
# exit 0; production compilation, TypeScript, page data, and static generation passed

git diff --check
# exit 0
```

### Concerns

- No new concerns. Replay remains deterministic and owner-scoped, and invalid replacement preferences continue to fall back to the original computed work.
