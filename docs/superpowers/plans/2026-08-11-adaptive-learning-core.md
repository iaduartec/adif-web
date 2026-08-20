# Adaptive Learning Core Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Add onboarding, concept mastery, spaced review, a deterministic daily plan, and cautious readiness indicators to the ADIF study platform.

**Architecture:** Keep Next.js and Supabase. Store user preferences, mastery, immutable review events, and daily task actions; calculate schedules, plans, and readiness with pure TypeScript functions on the server. Preserve all existing user data and official-content provenance.

**Tech Stack:** TypeScript, React 19, Next.js 16 App Router, Supabase/Postgres, Tailwind CSS, Vitest, Playwright, pnpm.

## Global Constraints

- Use TDD: every production behavior must first have a failing test.
- Preserve existing architecture, content provenance, metadata, semantics, mobile behavior, and user data.
- Reuse shared UI components and minimize client-side JavaScript.
- Dates and daily boundaries use Europe/Madrid.
- Do not add landing pages, payments, notifications, PWA, generative AI, or new English/psychometric content.
- The readiness model is explanatory and must never promise or estimate a probability of passing.
- Run the repository scripts from package.json; do not weaken existing tests or validators.

---

### Task 1: Adaptive learning schema and generated database types

- [ ] Add failing schema-contract tests for new study-goal columns, `concept_mastery`, `review_events`, `daily_plan_actions`, ownership RLS, indexes, constraints, cascade deletion, and idempotency keys.
- [ ] Run the focused contract test and confirm the expected failure.
- [ ] Add one forward-only Supabase migration that extends `study_goals` and creates the three tables with the exact constraints from the approved plan.
- [ ] Update `lib/database.types.ts` to match the migration and extend the mock store/client with compatible tables and defaults.
- [ ] Run focused schema and Supabase mock tests, then commit.

### Task 2: Concept taxonomy and official-question mappings

- [ ] Add failing content-schema tests requiring a unique, non-empty `conceptIds` array whose values resolve to the 87 active theory concepts.
- [ ] Run the focused tests and confirm the expected failure.
- [ ] Extend the official-question schema and public DTO, expose an active concept registry, and map all 102 active official questions to relevant concepts without weakening provenance validation.
- [ ] Update importers and fixtures so imports preserve and validate mappings.
- [ ] Run content validation and `pnpm verify:content`, then commit.

### Task 3: Spaced-review engine and atomic persistence

- [ ] Add failing unit tests for ratings 0-3, initial/repeated intervals, 60-day cap, question evidence, Madrid dates, retired concepts, and 24-hour duplicate-question suppression.
- [ ] Implement `ReviewRating`, `MasteryStatus`, review evidence types, and pure `applyReviewSchedule(current, evidence, today)`.
- [ ] Add failing integration/contract tests for idempotent practice persistence and simulation submission with mastery events.
- [ ] Add transactional Postgres RPCs and server adapters that atomically write attempts, immutable events, and mastery without trusting client-supplied answers or user IDs.
- [ ] Update mocks and existing practice/simulation flows, run focused suites, then commit.

### Task 4: Onboarding and editable preparation profile

- [ ] Add failing tests for new users, existing users, optional exam date/diagnostic, allowed session durations, validation errors, and retry-safe saves.
- [ ] Implement protected `/onboarding`, server-side loading, a progressively enhanced form, and a server action that upserts preferences and completion time.
- [ ] Route authenticated users without completed onboarding from the dashboard to onboarding while preserving the intended destination; do not loop on the onboarding route.
- [ ] Add profile editing from the authenticated navigation/user area using the same form contract.
- [ ] Extend the Playwright mock and add E2E coverage for complete and partially skipped onboarding, then commit.

### Task 5: Deterministic daily-plan engine and task actions

- [ ] Add failing unit tests for priority order, 40/35/25 allocation, 60% review cap, duration limits, insufficient-data fallback, overdue debt, seven-day simulation rule, replacement limit, and postponement priority.
- [ ] Implement `DailyTask`, `DailyPlan`, inputs, stable task keys, and pure `buildDailyPlan(input)` with deterministic tie-breaking.
- [ ] Add server-side data assembly from active content and user history.
- [ ] Add idempotent actions for postponing and replacing tasks, validating that replacements are active and one replacement is allowed per task/day.
- [ ] Run focused engine/action tests and commit.

### Task 6: Readiness model and adaptive dashboard

- [ ] Add failing tests for all four readiness levels, sample-size boundaries, active-content filtering, net score, recent/historical precision, retention, speed, streak, and per-concept/per-lesson aggregation.
- [ ] Implement `ReadinessLevel`, `ReadinessSnapshot`, and pure `calculateReadiness(input)` with the approved thresholds and human-readable criterion explanations.
- [ ] Rebuild the authenticated dashboard in this order: readiness/obstacle, today's session, overdue reviews, at-risk lessons, next simulation, weekly summary, secondary resources.
- [ ] Ensure insufficient evidence is explicit and never rendered as a probability or guarantee.
- [ ] Update navigation and statistics to expose streak and true concept/lesson metrics, run component and accessibility tests, then commit.

### Task 7: Review session, responsive polish, documentation, and final verification

- [ ] Add failing component/E2E tests for hidden answers, four recall ratings, next-review feedback, theory links, save retry, empty/loading/error states, keyboard flow, focus, reduced motion, and 390x844 layout.
- [ ] Implement the protected review session with server-loaded due concepts and a small client interaction boundary for reveal/rating.
- [ ] Add mobile sticky progress/action treatment, 44px targets, and overflow safeguards without regressing desktop hierarchy.
- [ ] Update README and Supabase setup documentation for migration, onboarding, adaptive plan, and readiness semantics.
- [ ] Run `pnpm verify:content`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm exec playwright test`, `pnpm build`, and `git diff --check`; fix only task-caused failures and commit.
