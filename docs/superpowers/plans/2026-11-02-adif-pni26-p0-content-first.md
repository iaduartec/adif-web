# ADIF PNI26/01 P0 Content-First Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a source-traceable PRL chapter I study unit and restore a verified course-to-practice-to-review flow without integrating the audit branch.

**Architecture:** Reuse the existing source manifest, syllabus inventory, theory registry, original-question repository, per-attempt API, and `OriginalPracticeSession`. Add a clearly labelled original-only onboarding diagnostic because the current eligible official bank is empty; preserve official-history gates. Keep the change in small local commits and do not touch remote data or deployment.

**Tech Stack:** Next.js App Router, TypeScript, React, Zod, Vitest, Playwright, local Supabase mock, JSON/TypeScript content registries.

**Spec:** `docs/superpowers/specs/2026-11-02-p0-content-first-delivery-design.md`

## Global Constraints

- Work only in `/home/kiri_/projects/adif-web/.worktrees/codex-adif-audit`, branch `codex/auditoria-adif-26`, based on `24176b1`.
- Keep `ORIGINAL ≠ OFFICIAL`; never bypass historical source, correction, publication, or rights gates.
- If an ADIF PDF returns 403, record that access result and keep its current edition unresolved unless an accessible primary source verifies it.
- Do not enable PNI26/01 official simulation rules; do not infer them from historical exams.
- Do not modify production data, remote migrations, authentication, RLS, deployment, push, or `main`.
- Preserve the pre-existing worktree change in `AGENTS.md`; do not stage it in any task commit.
- Every functional change follows RED → GREEN → REFACTOR, includes regression coverage, and ends in a scoped local commit.
- Do not label PRL in full or the nine documents academically complete; completion is limited to evidence actually checked.

## Review Focus

1. **Empty official bank:** the server currently returns 0 active official questions from 102 records, so onboarding cannot make a 15-item official diagnostic. Test that the diagnostic uses only reviewed original DTOs, is labelled original, and never reactivates official history (Task 5).
2. **ADIF attachment 403 and prior snapshots:** a previously hashed PDF is evidence of that downloaded version, not proof that the current linked version is unchanged. Test access metadata separately from artifact verification and leave currentness unresolved when needed (Task 1).
3. **Premature answer exposure:** question keys/explanations must stay server-side until training response or block submission is allowed. Test public DTO and active session boundaries (Tasks 3, 5, 6).
4. **Distractor and citation quality:** PRL items must test distinct recall, discrimination, and application objectives and explain every option against an exact primary locator. Add coverage assertions and perform independent academic review (Tasks 2, 3, 7).
5. **Mobile and interrupted requests:** active choices must be visible/tappable at 390×844, while an uncertain request cannot silently lose the selected answer. Test the actual active practice controls and existing retry contract (Tasks 5, 6).

---

### Task 1: Recheck and record the nine official document versions

**Files:**
- Modify: `content/source-manifest.json`
- Modify: `content/theory-source-links.json` only if an official source version changes
- Modify: `lib/content/source-manifest.ts`
- Modify: `docs/STUDY_CONTENT_AUDIT.md`
- Modify: `content/syllabus.ts` only if the checked evidence changes a source/version/locator/status
- Test: `tests/source-manifest.test.ts`
- Test: `tests/syllabus-coverage.test.ts`

**Interfaces:**
- Existing manifest `status`, `verifiedAt`, `sha256`, `hashTarget`, and `consultedLocator` continue to describe the identified artifact/version and its verification evidence.
- Add an optional `latestAccessCheck` to a source entry: `{ checkedAt: string; outcome: "available" | "forbidden" | "unreachable"; httpStatus: number | null }`. This records link availability without changing the meaning of the artifact hash or `verifiedAt`.
- Validate `checkedAt <= manifest.generatedAt`; the new access outcome remains independent of whether an older downloaded artifact is verified.
- `docs/STUDY_CONTENT_AUDIT.md` records, per parent document, ADIF scope evidence, material primary source, source version/date, exact locator, latest access result, and unresolved currentness.

- [ ] **Step 1: Add failing manifest tests** for valid and invalid `latestAccessCheck` values, date ordering, and one dated HTTP 403 that leaves `verifiedAt` and the downloaded artifact hash as historical facts rather than rewriting them. Require the nine ADIF document records to have an access check for this audit date.
- [ ] **Step 2: Run** `pnpm exec vitest run tests/source-manifest.test.ts tests/syllabus-coverage.test.ts` and confirm the new assertions fail for missing access-check support.
- [ ] **Step 3: Recheck** the ADIF PNI26/01 page and linked files for the six common and three 26/12PO-specific documents; recheck the relevant BOE consolidated texts and exact source locations. Compare any accessible artifact with the recorded hash/version. If a PDF is forbidden, record HTTP status and date, retain the old snapshot as an old verified version, and do not label the current version verified.
- [ ] **Step 4: Implement** the optional access-check schema and update the nine source records plus audit table from observed evidence. Do not replace a dated version with a guessed “current” version.
- [ ] **Step 5: Run** `pnpm exec vitest run tests/source-manifest.test.ts tests/syllabus-coverage.test.ts tests/source-update-check.test.ts` and `pnpm verify:content`; expect valid manifest, nine separately accounted documents, and no false verification.
- [ ] **Step 6: Review diff** for claims that conflate ADIF scope with law/document content, then commit only this task as `docs(adif): recheck PNI26 syllabus source versions`.

### Task 2: Complete the PRL chapter I theory unit

**Files:**
- Modify: `content/theories/prevencion-riesgos-laborales.ts`
- Modify: `content/claim-review-manifest.json`
- Modify: `content/summaries/prevencion-riesgos-laborales.ts`
- Modify: `content/flashcards.ts`
- Modify: `content/syllabus.ts`
- Create: `tests/prl-study-unit.test.ts`
- Test: `tests/content-validation.test.ts`
- Test: `tests/syllabus-coverage.test.ts`
- Test: `tests/theory-validators.test.ts`

**Interfaces:**
- Use the existing theory contracts `TheorySection`, `TheoryConcept`, `TheoryClaim`, `LegalReference`, and `ClaimEditorialReview`.
- Add four stable PRL concepts after the current `prl-concept-14`: `prl-concept-15` (art. 1: object/nature), `prl-concept-16` (art. 2: scope and exclusions), `prl-concept-17` (art. 3: public-administration scope), and `prl-concept-18` (art. 4: statutory definitions). Adjust this map only if primary-text review shows a clearer objective split; keep IDs stable after publication.
- Add exact references `lprl-31-1995-art1` through `lprl-31-1995-art4` against the verified BOE Ley 31/1995 source version. Do not cite only the ADIF syllabus attachment for legal content.
- Mark only `prl-capitulo-i` as `covered` when every article 1–4 objective is taught and recoverable **and** the exact official scope is supported by an adequately verified ADIF source. If currentness of the ADIF attachment remains blocked, keep the node `partial`/`unresolved` while labelling the didactic unit's source basis and date; keep PRL’s parent/document partial in all cases.

- [ ] **Step 1: Create failing `tests/prl-study-unit.test.ts` assertions** requiring a source-backed concept for articles 1–4, reviewed claims with exact verified BOE references, one recall takeaway and flashcard per article, and a non-covered syllabus state when exact current ADIF scope remains unverified.
- [ ] **Step 2: Run** `pnpm exec vitest run tests/prl-study-unit.test.ts tests/syllabus-coverage.test.ts tests/theory-validators.test.ts` and confirm the new chapter-I coverage assertions fail.
- [ ] **Step 3: Verify** the current BOE Ley 31/1995 consolidated text for articles 1–4 and record its exact version/date. Identify definitions, scope boundaries, statutory exclusions, and likely confusions from those articles only.
- [ ] **Step 4: Implement** the article references, concepts, explanatory claims, review takeaways, a concise recall summary, one practical example, and four or more concise flashcards linked to the article/concept IDs. Keep statutory wording/claims distinguishable from didactic interpretation and examples. Register explicit review metadata for every newly reviewed claim.
- [ ] **Step 5: Run** `pnpm exec vitest run tests/prl-study-unit.test.ts tests/syllabus-coverage.test.ts tests/theory-validators.test.ts` and `pnpm verify:theory && pnpm verify:theory-references && pnpm verify:theory-claims && pnpm verify:theory-copy && pnpm verify:syllabus`; expect all new references exact and the parent PRL still partial.
- [ ] **Step 6: Commit** only theory, summary, flashcards, syllabus, and their tests as `feat(adif): teach PRL chapter I with traceable theory`.

### Task 3: Add original PRL questions that cover the unit objectives

**Files:**
- Modify: `content/original-practice/general-knowledge.json`
- Modify: `tests/prl-study-unit.test.ts`
- Test: `tests/general-knowledge-practice.test.ts`
- Test: `tests/original-practice-schema.test.ts`
- Test: `tests/original-practice-public-dto.test.ts`

**Interfaces:**
- Use the four stable PRL concept IDs and `prl-capitulo-i` node from Task 2.
- Question records keep `domain: "general-knowledge"`, `origin: "original"`, reviewed status/date, exact primary source/version/locator, four unique options, and existing answer-free public DTO behavior.
- Use existing `tags` to identify `recall`, `discrimination`, and `application`; the reviewed set must cover all three cognitive demands and every important mapped concept. No fixed volume target.

- [ ] **Step 1: Add failing assertions** in `tests/prl-study-unit.test.ts` requiring every chapter-I concept to map to at least one eligible original question, all four articles 1–4 to be represented, the reviewed set to cover the three cognitive-demand tags, and every rationale to address the keyed option and each of A–D.
- [ ] **Step 2: Run** `pnpm exec vitest run tests/prl-study-unit.test.ts tests/general-knowledge-practice.test.ts tests/original-practice-schema.test.ts tests/original-practice-public-dto.test.ts` and confirm chapter-I practice coverage assertions fail.
- [ ] **Step 3: Write** only the minimum varied original items needed to cover the objective map. Distractors must represent plausible confusions grounded in the statute, not copied/adapted private or historic bank wording. Each explanation must state why the key is correct and why every option A–D is correct/incorrect as applicable, and cite article/section exactly.
- [ ] **Step 4: Run** `pnpm exec vitest run tests/prl-study-unit.test.ts tests/general-knowledge-practice.test.ts tests/original-practice-schema.test.ts tests/original-practice-public-dto.test.ts`; verify items remain absent from official registries and public DTOs omit keys/explanations before response.
- [ ] **Step 5: Commit** only these questions and tests as `feat(adif): add reviewed original practice for PRL chapter I`.

### Task 4: Provide a direct course-to-practice entry for PRL

**Files:**
- Modify: `components/course/course-theory-reader.tsx`
- Test: `tests/course-reader.test.tsx`
- Test: `tests/lesson-server-rendering.test.tsx`
- Modify: `e2e/study-flow.spec.ts`

**Interfaces:**
- Reuse the existing `OriginalPracticeSession` embedded in the theory view and its existing `course-practice-questions` section.
- Add an accessible `Iniciar práctica` link on the lesson summary that opens the theory view and targets the practice section, only when eligible module questions exist; preserve the original-provenance notice.

- [ ] **Step 1: Add a failing reader test** for the PRL lesson: the named link opens `?view=theory#course-practice-questions` when eligible questions are present and is absent when the lesson has no eligible practice.
- [ ] **Step 2: Run** `pnpm exec vitest run tests/course-reader.test.tsx tests/lesson-server-rendering.test.tsx` and confirm the link contract fails.
- [ ] **Step 3: Update the study-flow E2E** to open the PRL course lesson and follow `Iniciar práctica`; run `pnpm exec playwright test e2e/study-flow.spec.ts` and confirm it fails because the CTA is missing.
- [ ] **Step 4: Add** the link and target using the existing server-rendered lesson data; do not add a second question bank or an official-history route.
- [ ] **Step 5: Run** the focused unit tests, `pnpm verify:content`, and `pnpm exec playwright test e2e/study-flow.spec.ts`; expect the CTA only for a unit with eligible original questions.
- [ ] **Step 6: Commit** as `feat(adif): link PRL lessons to original practice`.

### Task 5: Make onboarding diagnostic an original-only 15-question session

**Files:**
- Create: `lib/onboarding-diagnostic.ts`
- Modify: `app/onboarding/actions.ts`
- Create: `app/(dashboard)/diagnostico/page.tsx`
- Modify: `components/practice/original-practice-session.tsx`
- Test: `tests/onboarding.test.ts`
- Test: `tests/onboarding-action.test.ts`
- Test: `tests/original-practice-session.test.tsx`
- Modify: `tests/diagnostic-practice.test.tsx`
- Modify: `e2e/onboarding.spec.ts`

**Interfaces:**
- Implement `selectBalancedOriginalDiagnosticQuestions(questions: readonly OriginalPracticeQuestionDto[], limit = 15): OriginalPracticeQuestionDto[]` in `lib/onboarding-diagnostic.ts`. Select deterministically and round-robin across the four domains, exclude duplicates, and return fewer than 15 only if fewer than 15 eligible reviewed DTOs exist.
- Extend `OriginalPracticeSession` with one optional preset object: `{ mode: "training" | "practice"; questionCount: number; autoStart?: boolean; hideConfiguration?: boolean }`. Existing callers retain their current defaults. The onboarding diagnostic passes only its selected 15 original DTOs, block mode, immediate start, and hidden configuration.
- `saveOnboarding` redirects to `/diagnostico` when diagnostic is selected. The route fetches the active original repository, filters through `toPublicPracticeQuestion`, selects the block server-side, and never uses `listOfficialQuestions` or accepts client-supplied answer keys.
- The page identifies the set as a **diagnóstico formativo de preguntas originales, no equivalente a un examen oficial**. It uses existing `/api/attempts` per-user grading; no database change is required.

- [ ] **Step 1: Add failing unit tests** for 15 unique selections, stable round-robin domain balance, exclusion of non-public/reviewed records, and correct fewer-than-15 handling. Add a component test that preset mode opens at `Pregunta 1 de 15` without showing answer keys.
- [ ] **Step 2: Run** `pnpm exec vitest run tests/onboarding.test.ts tests/onboarding-action.test.ts tests/original-practice-session.test.tsx tests/diagnostic-practice.test.tsx` and confirm the new selector/preset tests fail.
- [ ] **Step 3: Implement** the selector, redirect, server-rendered route, and component preset with only answer-free DTOs. If fewer than 15 eligible original items remain at runtime, show a clear unavailable state; never pad with withheld official history or mislabel items.
- [ ] **Step 4: Run** focused tests and verify 15 eligible items still exist in the current repository (the planning snapshot showed 158 reviewed public originals across four domains; recalculate during execution). Test that API correction returns only after the permitted response/submission and saves attempts under the authenticated user.
- [ ] **Step 5: Update E2E** to expect the `/diagnostico` route, the original-only notice, `Pregunta 1 de 15`, and a completed answer submission; verify the test does not need `/api/test/onboarding` beyond the existing mock setup.
- [ ] **Step 6: Run** `pnpm exec playwright test e2e/onboarding.spec.ts` and expect the diagnostic scenario to pass with the local mock.
- [ ] **Step 7: Commit** the scoped diagnostic route, selector, component, and tests as `feat(adif): start a balanced original onboarding diagnostic`.

### Task 6: Restore mobile answer controls and the full study-to-review path

**Files:**
- Modify: `components/practice/original-practice-session.tsx` only if the control structure is the root cause
- Modify: `app/globals.css` only if responsive sizing/layout is the root cause
- Modify: `e2e/mobile.spec.ts`
- Modify: `e2e/study-flow.spec.ts`
- Test: `tests/original-practice-session.test.tsx`

**Interfaces:**
- Mobile assertions target an active original practice from the PRL lesson/diagnostic, not the `/tests` listing. The listing continues to withhold response options and keys where required.
- Active answer labels remain associated with their radio controls and meet a 44 px minimum target at 390×844 without horizontal overflow.
- The study-flow E2E starts from the PRL course lesson, follows `Iniciar práctica`, answers incorrectly, receives a reasoned correction, and opens the saved error/repaso record.

- [ ] **Step 1: Replace the stale mobile list assertion** that expects 25 hidden `.official-question-options` with behavior tests for visible active-session radio choices and retained answer withholding in the listing. Add assertions for visibility, keyboard selection, 44 px touch target, and no horizontal overflow.
- [ ] **Step 2: Run** `pnpm exec playwright test e2e/mobile.spec.ts` and confirm the active-session accessibility/visibility assertion fails on the current branch.
- [ ] **Step 3: Reproduce and trace** the mobile failure to its root cause, then make the smallest responsive/control correction. Do not expose answers in the listing.
- [ ] **Step 4: Run** `pnpm exec playwright test e2e/mobile.spec.ts` and expect mobile active practice and withheld-list assertions to pass.
- [ ] **Step 5: Extend the study-flow E2E** in `e2e/study-flow.spec.ts` to submit a deliberate wrong PRL response, verify per-option explanation/source, then find the saved item in `/errores` or `/repasos`. Do not route through the empty official bank.
- [ ] **Step 6: Run** `pnpm exec playwright test e2e/study-flow.spec.ts e2e/onboarding.spec.ts e2e/mobile.spec.ts`; expect the three targeted regressions and complete flow to pass.
- [ ] **Step 7: Commit** only mobile behavior and integrated-flow changes as `fix(adif): restore mobile study and review flow`.

### Task 7: Independent review, full verification, and final local commit

**Files:**
- Review: all files changed by Tasks 1–6
- Modify: only files with actionable review findings
- Update: `docs/IMPLEMENTATION_EVIDENCE.md`, `docs/CURRENT_STATE.md`, `docs/STUDY_CONTENT_AUDIT.md`

**Interfaces:**
- Reviewer receives the branch diff and approved design; reviewer does not edit files. The implementer addresses findings in a separate scoped commit before closing.
- Evidence records exact test commands/results, source blockers, academic scope covered, and open issues. Tests/mock builds are not production or deployment evidence.

- [ ] **Step 1: Request an independent adversarial review** of source/currentness handling, PRL claims/keys/distractors, provenance, answer exposure, diagnostic selection, authentication assumptions, mobile accessibility, and regression coverage. Require file/line and reproduction evidence for each finding.
- [ ] **Step 2: Resolve** all critical/important findings with regression coverage and a separate local fix commit; document any unresolved finding as a blocker.
- [ ] **Step 3: Run** the full verification from the audit worktree: `pnpm test --reporter=dot`, `pnpm verify:content`, `pnpm typecheck`, `pnpm lint`, `PLAYWRIGHT_TEST=true pnpm build`, and `pnpm exec playwright test`. Preserve complete outputs and report exact pass/fail counts.
- [ ] **Step 4: Check** `git diff --check`, inspect `git status`, and confirm the `AGENTS.md` change is not staged or included. Confirm branch and base remain `codex/auditoria-adif-26` and `24176b1` ancestry; no remote/production operation occurred.
- [ ] **Step 5: Update** implementation evidence with the exact source/access statuses and verification results. Do not mark all PRL, all nine documents, production auth, remote persistence, or official 2026 simulation complete.
- [ ] **Step 6: Commit** only the final evidence update as `docs(adif): record P0 study delivery verification`.

## Stop Conditions

- If the current ADIF PDF version cannot be compared because access is blocked and no official alternative exists, retain the prior verified snapshot as historical evidence and mark currentness unresolved. Do not claim the current linked PDF is verified.
- If the BOE text for PRL articles 1–4 cannot be rechecked, do not publish new claims/questions as reviewed.
- If fewer than 15 eligible reviewed original DTOs are available, show the unavailable state and stop the onboarding diagnostic task; do not substitute official history. Report the evidence and request a revised scope before changing the diagnostic requirement.
- If the E2E failure implies a persistence, security, or database migration change, stop that change and prepare a separate design for approval; no remote operation is in scope.
- Do not integrate with `main` until the recorded migration blocker is separately resolved and integration is explicitly approved.

