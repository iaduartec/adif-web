# ADIF PNI26 Adaptive Priorities and Review Loop Implementation Plan

> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task by task. Steps use checkbox syntax for tracking.

**Goal:** Extend the existing adaptive study system with evidence-based topic priority, a durable error-cause notebook, and ratings for mapped flashcards.

**Architecture:** Reuse the existing concept mastery, review events, daily plan, readiness calculation, and Supabase RPCs. Add a pure priority model from current syllabus and mapped historical evidence. Persist only the new user-selected error cause that the current attempt records cannot express.

**Tech Stack:** Next.js App Router, TypeScript, Supabase/Postgres, existing review RPCs, Vitest, Testing Library, pnpm.

**Spec:** docs/superpowers/specs/2026-10-15-pni26-01-26-12po-design.md

## Existing Capabilities to Preserve

- The project already has review scheduling, concept mastery, daily planning, plan actions, readiness statistics, and protected review flows under lib/adaptive.
- Fichas, favorites, practice history, and the error notebook already exist. This plan extends them; it does not replace them.
- Existing dates and daily boundaries use Europe/Madrid. Existing persisted events remain valid and are not rewritten.

## Global Constraints

- Priority is an evidence score with visible reasons, never a probability of appearing or passing.
- Count recurrence by distinct exam year and only where the historical mapping remains applicable to the current syllabus.
- Keep user-selected error causes separate from inferred question category. A suggestion must be labelled as a suggestion and user-overridable.
- Reuse existing Supabase tables and RPCs where their contracts fit. Any required migration is forward-only, has RLS and SQL assertions, and is not applied remotely in this plan.
- Keep source, content status, and inactive-question filtering intact. Do not promote draft content to reviewed.

## Review Focus

- Historical recurrence cannot raise priority when the mapped item is obsolete, changed, or unverified.
- Reasons shown in the UI exactly match the score inputs and threshold.
- Priorities do not become unsupported probability language in the daily plan or statistics.
- Error annotations can only be written by the owner of a failed attempt and cannot mutate the answer record.
- Flashcard ratings use the existing review schedule and cannot create mastery for inactive or unmapped concepts.

### Task 1: Add transparent topic priority calculation

**Files:**
- Create: lib/adaptive/topic-priority.ts
- Create: tests/topic-priority.test.ts
- Consume: content/syllabus.ts and the historical applicability mapping produced by the historical-exams plan

**Interfaces:**
- Produce `calculateTopicPriority(inputs)`: stable targets `{ kind: "syllabus-node" | "a2-topic"; id }` with an integer evidence score, level, and ordered reason codes with user-facing explanations.
- Syllabus-node inputs include current-scope status, applicable exam years, source currency, editorial importance, personal error evidence, review due state, and difficulty. A2-topic inputs use a reviewed topic ID (for example `simple-conditionals`), per-topic error and review evidence, and personal difficulty; they do not accrue official-syllabus scope or recurrence points and never enter the official syllabus progress denominator.

- [ ] Step 1: Add failing tests for one-, two-, and three-year recurrence; repeated forms in one year counting once; changed/obsolete mapping contributing no recurrence; out-of-scope nodes; personal errors; overdue review; exact level boundaries; deterministic reason ordering; and repeated English errors on `simple-conditionals` raising only the corresponding A2-topic practice priority, without changing official syllabus progress.
- [ ] Step 2: Run pnpm exec vitest run tests/topic-priority.test.ts; expected FAIL because the module does not exist.
- [ ] Step 3: Implement a documented additive score: for syllabus nodes, current official scope +3; each applicable distinct exam year +2 up to three years; editorially marked high norm importance +2; repeated personal errors +2; overdue review +2; personal difficulty +1. For A2 topics, score only repeated personal errors +2, overdue review +2, and personal difficulty +1. Levels are very high at 7+, high at 5–6, medium at 3–4, and low below 3. Do not score probability.
- [ ] Step 4: Return reason codes and display strings from the exact contributing inputs. If scope or mapping is unresolved, return an explicit verification reason and suppress unsupported recurrence points.
- [ ] Step 5: Run the focused tests and commit with git add lib/adaptive/topic-priority.ts tests/topic-priority.test.ts && git commit -m "feat: calculate evidence-based ADIF topic priority".

### Task 2: Use priority in the existing daily study plan

**Files:**
- Modify: lib/adaptive/daily-plan.ts
- Modify: lib/adaptive/daily-plan-server.ts
- Modify: tests/daily-plan.test.ts
- Modify: tests/daily-plan-server.test.ts

**Interfaces:**
- Existing lesson and practice tasks gain a priority level and reason list where evidence exists.
- Existing review-first constraints, missed-task actions, time budgets, and readiness evidence gates remain authoritative.

- [ ] Step 1: Add failing tests proving equal-time eligible topics are ordered by transparent priority, overdue reviews retain their current precedence, and unresolved source evidence is shown without a fabricated rank.
- [ ] Step 2: Run pnpm exec vitest run tests/daily-plan.test.ts tests/daily-plan-server.test.ts; expected FAIL for missing priority fields and ordering.
- [ ] Step 3: Feed the new priority model into existing candidate ranking without changing task identity, exact planned-question IDs, or replan/action semantics.
- [ ] Step 4: Verify that every returned priority contains a human-readable reason, A2-topic priority stays outside official syllabus progress, and the score is never serialized or labelled as a chance of appearing.
- [ ] Step 5: Run the focused tests plus tests/readiness.test.ts and commit with git add lib/adaptive/daily-plan.ts lib/adaptive/daily-plan-server.ts tests/daily-plan.test.ts tests/daily-plan-server.test.ts && git commit -m "feat: prioritize daily study by evidence".

### Task 3: Add owner-scoped error-cause annotations

**Files:**
- Create: supabase/migrations/202610150006_question_error_annotations.sql
- Create: supabase/tests/question_error_annotations.sql
- Create: app/actions/error-annotations.ts
- Create: components/practice/error-cause-picker.tsx
- Modify: lib/practice/error-notebook.ts
- Modify: app/(dashboard)/errores/page.tsx
- Create: tests/error-annotations.test.ts
- Create: tests/error-notebook.test.ts
- Modify: lib/database.types.ts

**Interfaces:**
- Causes include GRAMMAR, VOCABULARY, READING, SIGN, CONTEXT, CARELESSNESS, TIME, CONTENT, and UNSURE.
- A typed annotation identifies an owned practice attempt or simulation answer, the question, and a user-confirmed cause.
- Suggested English categories come from reviewed question skill metadata from the original-practice and historical-exams plans. The user can change or clear a suggestion.

- [ ] Step 1: Add failing domain/action tests for practice and simulation errors, successful attempts, foreign attempt IDs, invalid causes, and empty/unclassified history.
- [ ] Step 2: Run pnpm exec vitest run tests/error-annotations.test.ts tests/error-notebook.test.ts; expected FAIL because annotations are not supported.
- [ ] Step 3: Add an owner-scoped annotation table and security-definer RPC that verifies the referenced owner record is incorrect before insert or update. Set a fixed `search_path`, check `auth.uid()` explicitly, revoke execution from `PUBLIC`/`anon`, grant only to `authenticated`, and deny direct client writes to annotations. Keep attempt rows immutable and add SQL assertions for cross-user access, direct insert/update/delete rejection, and valid owner changes.
- [ ] Step 4: Implement the server action and picker. Extend the notebook to combine current active practice and simulation errors, annotation counts, repeat-failure count, last date, selected answer, expected answer, topic, and elapsed time.
- [ ] Step 5: Keep old attempts readable with no cause. Do not infer CARELESSNESS or TIME from latency; only show these as self-reported causes.
- [ ] Step 6: Run focused Vitest, `supabase test db`, and (after local `supabase start` / `supabase db reset`) `psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -v ON_ERROR_STOP=1 -f supabase/tests/question_error_annotations.sql`; document the exact unrun gate otherwise. Commit with git add supabase/migrations/202610150006_question_error_annotations.sql supabase/tests/question_error_annotations.sql app/actions/error-annotations.ts components/practice/error-cause-picker.tsx lib/practice/error-notebook.ts 'app/(dashboard)/errores/page.tsx' tests/error-annotations.test.ts tests/error-notebook.test.ts lib/database.types.ts && git commit -m "feat: record ADIF error causes".

### Task 4: Map flashcards to concepts and rate recall

**Files:**
- Modify: content/flashcards.ts
- Modify: lib/content/schema.ts
- Modify: components/cards/flashcard-deck.tsx
- Create: tests/flashcard-review.test.tsx
- Create: tests/flashcards.test.ts
- Consume: app/actions/reviews.ts recordRecallReview(conceptId, rating, clientEventId)

**Interfaces:**
- Each reviewable card maps to one active theory concept ID and carries source ID/version plus an exact locator for normative facts.
- After revealing a card, offer Otra vez, Difícil, Bien, and Fácil, mapped to the existing review ratings 0–3.
- Persist through the existing recordRecallReview server action and record_recall_review RPC. Do not create a second action, spaced-repetition schedule, or table.

- [ ] Step 1: Add failing tests for missing normative source locators, invalid or inactive concept mappings, hidden ratings before reveal, all four rating mappings, stable idempotency key on retry, save failure with retry, keyboard use, and favorite state preservation.
- [ ] Step 2: Run pnpm exec vitest run tests/flashcard-review.test.tsx tests/flashcards.test.ts; expected FAIL for concept mappings and ratings.
- [ ] Step 3: Map cards to one active concept only where content has a reviewed relationship; keep unmapped cards visible for reading but exclude them from scheduled review. Every reviewed normative fact must cite a primary source version and exact location.
- [ ] Step 4: Reuse the existing authenticated recordRecallReview action and preserve its retry/idempotency behavior; do not add another persistence path.
- [ ] Step 5: Run focused tests and content verification; commit with git add content/flashcards.ts lib/content/schema.ts components/cards/flashcard-deck.tsx tests/flashcard-review.test.tsx tests/flashcards.test.ts && git commit -m "feat: add spaced review to ADIF flashcards".
