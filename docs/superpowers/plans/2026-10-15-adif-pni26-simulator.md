# ADIF Realistic Simulator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a four-block, mobile-usable ADIF 2025 historical simulation with exact timing, scoring, reserves and post-exam review, while keeping 2026 rules gated.

**Architecture:** Version the simulation rules independently from questions. A pure scoring engine computes normalized section results and eliminatory thresholds; a server action validates and persists the submitted answers; the runner never receives correct answers before delivery.

**Tech Stack:** TypeScript, Zod, React, Next.js server actions, Supabase RPC/RLS, Vitest and Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-15-pni26-01-26-12po-design.md`

## Global Constraints

- Mantener Next.js, Supabase, Google OAuth y Vercel existentes.
- Mantener el contenido fuente/versiones en Git y los datos personales de estudio en Supabase.
- No recrear tablas si las actuales cubren los flujos y no migrar sin verificar el estado remoto y preparar respaldo.
- No tratar estimaciones históricas, fuentes secundarias ni contenido generado como autoridad normativa.
- No copiar psicométricos protegidos; psicométricos simulados usan el banco original revisado.
- No desplegar, hacer push ni modificar producción como parte de la especificación o auditoría.
- `adif-2025` is historical configuration; `official-2026` remains unavailable until ADIF rules are verified.
- Preserve legacy official-form route IDs and saved attempts. A new attempt is available only when every question in that form has approved publication status and passes current-validity checks; otherwise return a clear `not_ready` status with source/rights reason while retaining metadata and past results.
- Do not call the historical mode an exact reproduction or enable it until every historical rule constant has verified primary evidence. Any app display precision where ADIF is silent must be labelled as application policy.
- Keep answer keys server-side until the attempt is delivered.

## Review Focus

- Exactly 15 scored questions plus 3 reserve questions per block; the paper carries explicit reserve-to-annulled-question links derived from verified tribunal correction data. A reserve is counted only when the correction record links it to an annulled question; never infer by position.
- Timer boundary at 45 minutes common and 15 minutes specific triggers one submission and no duplicate attempt.
- Fifteen correct answers produce the block maximum; an incorrect answer loses one third of a raw answer; blank is zero. Qualification compares at the exact precision selected by the verified rule configuration before display rounding unless a verified official rule states otherwise.
- The eliminatory minima apply to three tests: psychometric at 40%, English at 40%, and General plus Specific knowledge at 40%; the global minimum is 100/200. General and Specific also appear as separate result lines, but neither has an invented standalone minimum.
- A 2026 mode cannot start while its rule source or `verifiedAt` is absent.

---

### Task 1: Implement the versioned scoring engine

**Files:**
- Create: `lib/practice/scoring.ts`
- Create: `tests/simulation-scoring.test.ts`
- Modify: `lib/content/schema.ts`

**Interfaces:**
- `SimulationRules` is one immutable, versioned JSON value shared by paper builder, scorer, runner and database: `{ modeId: "adif-2025" | "official-2026"; version: string; timingMs: { common: number; specific: number }; questionCounts: { scoredPerSection: number; reservePerSection: number; optionsPerQuestion: number; correctOptionsPerQuestion: number }; minimums: { psychometricPercent: number; englishPercent: number; knowledgePercent: number; globalPoints: number }; blockMaxPoints: Record<SectionId, number>; penalty: { wrongNumerator: number; wrongDenominator: number; blankPoints: number }; normalization: "raw-net-over-annulment-policy-denominator-times-block-maximum"; negativeScorePolicy: "floor-at-zero" | "allow-negative"; annulmentWithoutReservePolicy: "credit-as-correct" | "exclude-and-rescale" | "exclude-without-rescaling" | "unresolved"; minimumComparison: "unrounded" | "rounded"; displayDecimals: number; ruleEvidence: Record<"timing" | "counts" | "block-maxima" | "weights-and-minima" | "penalty-and-blank" | "normalization" | "negative-score-bound" | "reserve-handling" | "annulment-without-reserve", RuleEvidence>; roundingRuleSource?: RuleEvidence }`.
- `RuleEvidence = { sourceId: string; sourceVersion: string; locator: string; verifiedAt: string }`; validation resolves it to a manifest entry with ADIF authority, verified status and SHA-256. If `minimumComparison` is `rounded`, `roundingRuleSource` is required and must validate; when ADIF states no rounding rule, use `unrounded` as a labelled application policy and do not attribute it to ADIF.
- Values have fixed units: timings are milliseconds; counts and point maxima are nonnegative integers; percentage minima are integers from 0–100; `globalPoints` uses points out of 200; and wrong answers subtract `wrongNumerator / wrongDenominator` from raw net while blanks add exactly `blankPoints` (historically 0). For an annulled item without a linked reserve, `credit-as-correct` gives the item one correct credit and retains the original denominator; `exclude-and-rescale` removes it from both raw net and denominator; `exclude-without-rescaling` removes it from raw net but retains the original scored-slot denominator. A linked reserve replaces exactly one annulled scored slot and keeps that slot's denominator. After applying the configured negative-score bound, normalized points equal raw net divided by the denominator selected by this policy, multiplied by that section's verified maximum. Percentage qualification compares the earned-point ratio to the configured percent exactly (`earnedPoints * 100 >= applicableMaximum * minimumPercent`); for Knowledge, use the combined General+Specific maximum and points. The global threshold compares total points with `globalPoints`. If verified source rules require rounding before comparison, apply that documented rule to earned points first. No standalone General or Specific cut score is assumed.
- Every timing, count, minimum, block maximum, penalty, normalization, negative-score and reserve/annulment constant is read from this same versioned config and has matching verified primary evidence. `ruleEvidence` resolves to an ADIF manifest entry with verified status, SHA-256 and exact locator. `minimumComparison: "rounded"` requires a separately verified `roundingRuleSource`; if ADIF is silent, configure `unrounded` and label display rounding as an application-only presentation rule. If a selected paper contains an annulled item without an explicitly linked reserve and the corresponding policy is `unresolved`, creation/finalization returns `not_ready` and produces no qualification result. Never infer an individual General/Specific maximum or a zero floor from the combined 120-point figure.
- The expected 2025 values are common `2700000` ms, Specific `900000` ms, 15 scored plus 3 reserve per section, 4 options with one correct, maxima of 40 psychometric points, 40 English points, and 120 combined General+Specific points, minima of 40% psychometric/English/combined knowledge and 100 global. Individual General and Specific maxima must be read from verified primary evidence; do not invent a split. Treat every expected value as a test fixture until its matching source evidence is verified; the config rejects unverified or conflicting values.
- `scoreSection(sectionPaper: SimulationPaperSection, answers, rules): SectionScore` consumes each question's verified `scored|reserve|annulled` role and explicit reserve replacement relation. It scores only the effective scored slots defined by corrections/rules and selects the normalization denominator from the verified no-reserve annulment policy; a reserve answer substitutes only for the annulled question explicitly linked by verified correction data, and no answer can be counted twice.
- `scoreSimulation(sectionScores, rules): SimulationScore` returns the four displayed section scores plus the three eliminatory test scores (psychometric, English, General+Specific) and passes only if each percentage test meets its exact ratio-derived threshold and the global points minimum passes.

- [ ] **Step 1: Write tests** for all-correct section maxima and 200 total, one wrong penalty, blank zero, all unanswered, all-wrong behavior under the source-verified negative-score policy, `rounded` precision without rounding evidence disabling the mode, 15 active scored slots, reserve substitution only through an explicit correction link, no substitution when no link exists, each verified no-reserve annulment policy including a 14/15 normalized result for `exclude-without-rescaling`, unresolved annulment policy returning `not_ready`, no double counting, each of the three test thresholds, 6/15 correct with no errors yielding exactly 16/40 points and meeting the 40% psychometric or English threshold where verified rules confirm equal item weighting, 48/120 General+Specific meeting exactly 40%, 47.99/120 failing that cut, 100/200 with one failed test, and a passing result. Missing, unverified, hashless, wrong-authority or locator-free rule evidence disables the mode.
- [ ] **Step 2: Run** `pnpm exec vitest run tests/simulation-scoring.test.ts`; expected FAIL.
- [ ] **Step 3: Implement** a validator for every field, evidence link, integer/range/unit constraint, single source version, total 200-point block maximum and 120-point combined knowledge maximum. Require rounding evidence only for rounded qualification comparison; otherwise compare unrounded and apply configured display precision after pass/fail. Compute raw net as correct minus the configured wrong-answer fraction, blanks as configured zero, apply the evidenced negative-score and annulment policies, and normalize using the denominator selected by that policy and the block maximum. For each percentage cut, compare `earnedPoints * 100` to `applicableMaximum * minimumPercent`; compare total points directly with `globalPoints` (100/200 in the expected historical fixture). A selected item with unresolved no-reserve annulment policy yields `not_ready` and no score. Keep raw net and normalized points distinct, combine General+Specific for the knowledge threshold, and share the exact rule JSON/version with the builder, scorer, runner and private database registry.
- [ ] **Step 4: Run** `pnpm exec vitest run tests/simulation-scoring.test.ts`; expected PASS for every exact boundary.
- [ ] **Step 5: Commit** with `git add lib/practice/scoring.ts lib/content/schema.ts tests/simulation-scoring.test.ts && git commit -m "feat: score ADIF simulations by section"`.

### Task 2: Compose historical and gated simulation modes

**Files:**
- Create: `content/simulations/adif-2025.ts`
- Create: `lib/practice/simulation-builder.ts`
- Create: `tests/simulation-builder.test.ts`
- Modify: `lib/content/repository.ts`
- Modify: `app/(dashboard)/simulacros/page.tsx`

**Interfaces:**
- `SimulationModeId = "adif-2025" | "official-2026"`.
- `getSimulationMode(id): SimulationModeConfig`; the 2026 config has `enabled: false` unless verified source metadata is present.
- `buildSimulation(mode, seed, banks): SimulationPaper` creates 4 sections, 15 scored plus 3 reserve each, no duplicate question IDs, provenance intact, and `reserveReplacements: Array<{ annulledQuestionId: QuestionId; reserveQuestionId: QuestionId; correctionSourceId: string; correctionLocator: string }>` sourced from explicit verified correction records and resolved within the exact exam form/session.

- [ ] **Step 1: Write tests** for 72 displayed questions, per-section counts, no duplicate IDs, fixed-seed reproducibility, exact annulled-to-reserve relation by form/session, missing relation not inferred by position, unavailable question bank and 2026 disabled state.
- [ ] **Step 2: Run** `pnpm exec vitest run tests/simulation-builder.test.ts`; expected FAIL.
- [ ] **Step 3: Implement** mode config and builder from the reconciled historical and original-practice repositories. Require 18 distinct, reviewed, currently eligible items per visible block (15 scored plus 3 reserves): Psychometric uses original items only; English uses cleared official items or the reviewed A2 bank; General uses cleared official items or the reviewed common-law bank; Specific uses cleared current-syllabus official items or the reviewed telecom bank. Each fallback bank must have at least 18 eligible records or return a block-specific `not_ready` reason. Never label original items as official. Preserve section provenance, corrected-key state, reserve position, explicit annulment-to-reserve links, and current-syllabus applicability. Return `not_ready` rather than a partial paper if any section lacks 18 eligible items.
- [ ] **Step 4: Add** a historical mode card and an explanatory disabled 2026 card to `/simulacros`.
- [ ] **Step 5: Run** `pnpm exec vitest run tests/simulation-builder.test.ts tests/navigation.test.tsx`; expected PASS and exactly 54 common plus 18 specific displayed questions when all banks are ready, and a not-ready result when a bank is short.
- [ ] **Step 6: Commit** with `git add content/simulations/adif-2025.ts lib/practice/simulation-builder.ts lib/content/repository.ts 'app/(dashboard)/simulacros/page.tsx' tests/simulation-builder.test.ts && git commit -m "feat: add ADIF 2025 simulation mode"`.

### Task 3: Extend the runner for sections, reservations and full timings

**Files:**
- Modify: `components/practice/simulation-runner.tsx`
- Modify: `app/(dashboard)/simulacros/[id]/client.tsx`
- Modify: `tests/simulation-runner.test.tsx`

**Interfaces:**
- Runner receives `paper: SimulationPaper`, `rules: SimulationRules`, `onFinish(result: SubmittedPaper): void`.
- The common part has one shared 45-minute timer across psychometric, English, and General; the specific part has its separate 15-minute timer. Per-section elapsed time is recorded for analysis, not as extra timers. Each section tracks answer, blank, review flag, changed answer and elapsed time; reserves are explicitly labeled.

- [ ] **Step 1: Add failing tests** for section navigation, answer editing, blank status, review flags, 45/15 minute timers, auto-submit once, and no correct answer before finish.
- [ ] **Step 2: Run** `pnpm exec vitest run tests/simulation-runner.test.tsx`; expected FAIL for paper-based props and missing sections.
- [ ] **Step 3: Extend** the existing single-exam runner without breaking its official-exam route. Add a composite-paper path with a 45-minute common timer and 15-minute specific timer, section navigation, one idempotent finish event, and resume-free real-exam behavior; keep an optional draft only for practice mode.
- [ ] **Step 4: Run** the focused test; expected PASS with all four sections and reserve markers accessible by keyboard.
- [ ] **Step 5: Commit** with `git add components/practice/simulation-runner.tsx 'app/(dashboard)/simulacros/[id]/client.tsx' tests/simulation-runner.test.tsx && git commit -m "feat: run timed ADIF mock exams"`.

### Task 4: Validate and persist full simulation submissions

**Files:**
- Modify: `app/actions/simulations.ts`
- Modify: `app/(dashboard)/simulacros/[id]/page.tsx`
- Create: `supabase/migrations/202610150005_composite_simulation_papers.sql`
- Create: `supabase/tests/composite_simulation_submission.sql`
- Create: `scripts/export-simulation-rules.ts`
- Create: `tests/simulation-rules-export.test.ts`
- Modify: `tests/simulations-action.test.ts`
- Modify: `lib/database.types.ts`
- Modify: `lib/supabase/mock-client.ts`
- Modify: `lib/supabase/mock-store.ts`

**Interfaces:**
- `createSimulationPaper(modeId, seed?): Promise<SimulationPaperDescriptor>` chooses eligible questions server-side and persists an owner-scoped durable `paperId` plus exact membership before returning question DTOs without answers, or returns `not_ready`. Creating/loading instructions does not start the clock.
- `startSimulationSection(paperId, sectionGroup): Promise<{ startedAt: string; deadlineAt: string }>` records the server timestamp on the first explicit start of `common` or `specific`; retries return the same deadline, and `specific` cannot start until `common` is finalized. The common group gets 45 minutes and Specific gets 15 minutes. Loading the paper or instruction screen does not start a timer.
- `saveSimulationAnswer(paperId, questionId, answer, markedForReview, clientEventId)` persists each answer change against exact paper membership with owner checks and idempotency. The durable draft stores the latest answer, review flag, and answer-change count; it is the source used for auto-delivery, so a browser request arriving after expiry cannot lose the last acknowledged answers. Reject writes after that group deadline or after its finalization.
- `finalizeSimulationSection(paperId, sectionGroup, clientEventId, clientQuestionElapsedMs)` reads only saved answers and the server clock for grading. It accepts a manual finish before deadline; at or after deadline it finalizes the saved draft automatically, including when called on the next reconnect. Finalizing `common` freezes those answers and unlocks the 15-minute Specific timer; finalizing `specific` computes the complete result. Repeated calls return the same immutable result. Per-question client elapsed values are bounded, stored only as analytics, and never determine score or qualification; group elapsed time is derived from server timestamps.
- Server recomputes correct counts and scores from trusted content/rules; client-supplied score is never authoritative. Builder, runner, scoring engine, and database read the same immutable `ruleSetId`/version. The migration seeds that canonical JSON into `private.simulation_rule_versions` through a deterministic exporter; direct reads/writes are revoked and the RPC loads timing and qualification rules by validated version rather than accepting client constants.
- Keep `simulation_attempts` and `simulation_answers`. Add owner-scoped durable `simulation_papers` plus normalized paper-to-question membership recording group, section, ordinal, scored/reserve role, and explicit reserve replacement link; store per-paper answer drafts, group start/deadline/finalization timestamps, and create paper plus membership transactionally before serving a paper. Revoke direct client insert/update/delete on papers, memberships, answer drafts and finalized results; allow only owner-scoped reads that contain no answer keys. Only the RPCs may mutate this state, and finalized paper membership is immutable. Every `SECURITY DEFINER` RPC fixes `search_path`, checks `auth.uid()` explicitly, revokes execution from `PUBLIC`/`anon`, and grants only the required actions to `authenticated`. The `/simulacros/[id]` route must resolve `adif-2025` through this flow while preserving `getOfficialExam(id)` for legacy form IDs. Persist the mode/rule version and section result needed for stable reports.

- [ ] **Step 1: Add tests** for route selection of `adif-2025` versus legacy form IDs, durable paper creation without starting a timer, explicit start and stable server deadline, ordering common before specific, owner-scoped answer saves, saved-draft auto-finalization at expiry, rejection of late new answer writes, idempotent group finalization/retry, foreign paper/question ID, invalid answer, missing/duplicate membership, server-recomputed score, per-section breakdown, exact three-test qualification, a fully cleared legacy form remaining playable, and a restricted or incomplete form returning `not_ready` without exposing its text or answer key while preserving its history.
- [ ] **Step 2: Run** `pnpm exec vitest run tests/simulations-action.test.ts`; expected FAIL for full-paper submission.
- [ ] **Step 3: Audit** local private answer registry, existing RPC, RLS, and remote-state runbook. Add a forward-only migration for the private immutable simulation-rule version registry, paper membership, rule version and result fields; generate its seed deterministically from the same canonical config and test the JSON parity. Original keys are seeded only by the preceding original-practice plan's migration. Preserve existing attempts and legacy paper IDs. Do not apply it remotely without a verified backup and live-state comparison.
- [ ] **Step 4: Implement** transactional paper creation, timed-group starts, owner-scoped answer autosave, and group finalization RPCs using verified paper membership, server clock/deadlines and rule version, preserving owner checks, exact-answer validation, and idempotency. Update the `[id]` server route to create and render the composite paper for `adif-2025`; preserve legacy form IDs and existing result history, and permit a new legacy attempt only when its full question set is cleared and current, otherwise show the explicit `not_ready` reason without question text or keys.
- [ ] **Step 5: Extend the Playwright Supabase mock** to seed/reset a composite paper and model start, membership, answer draft, deadline and final result state. Use a test-only short-duration clock policy through the same timer transitions, while unit/SQL tests assert the production 45/15-minute values and database-clock boundaries. Browser E2E validates UI/route behavior under the mock; SQL behavioral/RLS tests remain the evidence for database authorization. Assert in SQL that direct authenticated inserts/updates/deletes against paper, membership, answer-draft and result tables fail, owner reads do not expose keys, private rule rows are inaccessible and immutable, and only the intended RPC grants exist. Run `pnpm exec vitest run tests/simulations-action.test.ts tests/study-schema-contract.test.ts tests/simulation-rules-export.test.ts`, `supabase test db`, and (after local `supabase start` / `supabase db reset`) `psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -v ON_ERROR_STOP=1 -f supabase/tests/composite_simulation_submission.sql`; expected PASS for rule JSON parity, expiry finalization, late-answer rejection and conditional legacy-form availability.
- [ ] **Step 6: Commit** with `git add app/actions/simulations.ts 'app/(dashboard)/simulacros/[id]/page.tsx' supabase/migrations/202610150005_composite_simulation_papers.sql supabase/tests/composite_simulation_submission.sql tests/simulations-action.test.ts lib/database.types.ts lib/supabase/mock-client.ts lib/supabase/mock-store.ts && git commit -m "feat: persist composite ADIF simulations"`.

### Task 5: Show complete results and explanations after delivery

**Files:**
- Modify: `components/practice/simulation-results.tsx`
- Modify: `components/dashboard/readiness-statistics.tsx`
- Modify: `lib/adaptive/readiness.ts`
- Modify: `lib/adaptive/readiness-server.ts`
- Modify: `tests/readiness.test.ts`
- Modify: `tests/readiness-server.test.ts`
- Modify: `tests/simulation-runner.test.tsx`
- Create: `e2e/composite-simulation.spec.ts`
- Modify: `lib/supabase/mock-client.ts`
- Modify: `lib/supabase/mock-store.ts`

**Interfaces:**
- Results consume `SimulationScore` plus per-question corrections and metadata.
- No answer key or explanation is rendered until the submit result is confirmed.

- [ ] **Step 1: Add tests** for total score, four section scores, three eliminatory test results, counts, net answers, elapsed/mean time, changed and marked questions, weak nodes, each minimum failure, and answer explanations.
- [ ] **Step 2: Run** the focused results tests; expected FAIL on missing section breakdown.
- [ ] **Step 3: Implement** a compact responsive summary and expandable review list; display official/original badges and source citations on each item. Extend readiness input to include persisted composite results without deriving a pass estimate from incomplete evidence.
- [ ] **Step 4: Add and run** a Playwright flow at 390x844 covering `/simulacros/adif-2025`, all four sections, explicit timer start, automatic group finalization from saved answers at expiry, no answer key before final delivery, and the post-submit score/minimum breakdown. Configure a mock-only short duration so the browser test completes promptly while exercising both timed groups; unit tests retain the actual 45/15-minute constants. The browser flow runs under the Playwright Supabase mock and does not claim to test real RLS; SQL tests cover database authorization. Run `pnpm exec vitest run tests/simulation-runner.test.tsx tests/readiness.test.ts tests/readiness-server.test.ts tests/readiness-dashboard.test.tsx` and `pnpm exec playwright test e2e/composite-simulation.spec.ts`; expected PASS.
- [ ] **Step 5: Commit** with `git add components/practice/simulation-results.tsx components/dashboard/readiness-statistics.tsx lib/adaptive/readiness.ts lib/adaptive/readiness-server.ts tests/readiness.test.ts tests/readiness-server.test.ts tests/simulation-runner.test.tsx e2e/composite-simulation.spec.ts lib/supabase/mock-client.ts lib/supabase/mock-store.ts && git commit -m "feat: show ADIF simulation breakdown"`.
