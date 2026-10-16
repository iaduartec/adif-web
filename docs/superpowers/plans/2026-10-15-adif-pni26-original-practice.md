# ADIF Original Practice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide reviewed, genuinely original practice for common-law topics, 26/12PO telecom, A2 English and psychometric aptitudes without importing protected test items.

**Architecture:** Keep original question sets separate from official ADIF transcriptions. Use a strict typed repository and skill taxonomy; each content item is labeled by origin, topic, difficulty, review state and explanation.

**Tech Stack:** TypeScript, Zod, JSON content, Vitest, existing Next.js practice components.

**Spec:** `docs/superpowers/specs/2026-10-15-pni26-01-26-12po-design.md`

## Global Constraints

- Mantener Next.js, Supabase, Google OAuth y Vercel existentes.
- Mantener el contenido fuente/versiones en Git y los datos personales de estudio en Supabase.
- No recrear tablas si las actuales cubren los flujos y no migrar sin verificar el estado remoto y preparar respaldo.
- No tratar estimaciones históricas, fuentes secundarias ni contenido generado como autoridad normativa.
- No copiar psicométricos protegidos.
- No desplegar, hacer push ni modificar producción como parte de la especificación o auditoría.
- No etiquetar material original como `OFICIAL ADIF`.
- El contenido psicométrico debe ser nuevo y revisado antes de aparecer en modo simulado.

## Review Focus

- Duplicated or near-duplicated original questions are rejected by content fingerprints and human review.
- A question with two valid options is not marked `reviewed`; tests require one answer and an explanation.
- Missing A2 error category or topic prevents that item from entering adaptive practice.
- A psicométrico item that imports a protected source image/text is excluded and flagged for review.
- A technical question with no verified official syllabus node remains `draft`.

---

### Task 1: Define the original-practice schema and repository

**Files:**
- Create: `lib/content/original-practice-schema.ts`
- Create: `lib/content/original-practice-repository.ts`
- Create: `lib/content/original-practice-public-dto.ts`
- Create: `content/original-practice/english-a2.json`
- Create: `content/original-practice/general-knowledge.json`
- Create: `content/original-practice/psychometric.json`
- Create: `content/original-practice/telecom.json`
- Create: `tests/original-practice-schema.test.ts`
- Create: `tests/original-practice-repository.test.ts`
- Create: `tests/original-practice-public-dto.test.ts`

**Interfaces:**
- `OriginalPracticeQuestion = { id: string; domain: "general-knowledge" | "english-a2" | "psychometric" | "telecom"; topicId: string; topic: string; skill: string; prompt: string; options: Option[]; answer: AnswerKey; explanation: string; difficulty: 1 | 2 | 3; tags: string[]; conceptIds: string[]; errorCategory?: string; syllabusNodeId?: string; sourceId?: string; sourceVersion?: string; sourceLocator?: string; status: "draft" | "reviewed"; reviewedAt?: string; origin: "original" }`.
- `listOriginalPracticeQuestions(filter?: OriginalPracticeFilter): readonly OriginalPracticeQuestion[]`.
- `getOriginalPracticeQuestion(id: string): OriginalPracticeQuestion | undefined`.
- `toPublicPracticeQuestion(question): OriginalPracticeQuestionDto` omits answer keys; full answer-bearing records are consumed on the server, and feedback is available only after submission.

- [x] **Step 1: Add failing schema/repository/DTO tests** for origin tags, four unique options, one keyed answer, explanation, valid domain, stable domain-validated `topicId`, duplicate IDs, case-insensitive display-topic and topic-ID filters, answer-key exclusion from public DTOs, and a nonempty active `conceptIds` mapping for every reviewed record enabled for attempts. English IDs must belong to the shared A2 taxonomy, psychometric IDs to the original aptitude taxonomy, and general/telecom IDs must resolve to reviewed syllabus topic nodes. Require a primary source/version/exact locator for reviewed normative questions.
- [x] **Step 2: Run** `pnpm exec vitest run tests/original-practice-schema.test.ts tests/original-practice-repository.test.ts tests/original-practice-public-dto.test.ts`; expected FAIL.
- [x] **Step 3: Implement** strict Zod schema, four separate datasets and repository; require a stable `topicId` in every domain (`english-a2` reuses `english-topics.json`, psychometric uses a controlled aptitude ID, and normative items resolve to a reviewed syllabus topic/node). Keep `topic` as the display label; no official source claim is inferred from a secondary guide.
- [x] **Step 4: Run** the focused tests; expected PASS, with invalid and duplicate items rejected. The first RED run produced the expected failures: schema and DTO accepted an official copy whose prompt differed only in letter case. Two adversarial reviews (IMPORTANT) drove the provenance-gate commits `6b37781`, `a715756` and `f349155`, after which the focused run passed with 4 files / 59 tests and the full suite with 66 files / 553 tests (later 572 once the Task 2 tests landed). The duplicate fingerprint normalizes NFKC, case and whitespace and ignores the A–D labels and the answer key; the historical import fingerprint is unchanged.
- [x] **Step 5: Commit** the scoped Task 1 implementation locally as `c890973` (`feat(adif): define original practice question contracts`) plus the corrective commits `6b37781` (`fix(adif): enforce original practice provenance gates`), `a715756` (`fix(adif): close original content bypasses`) and `f349155` (`fix(adif): normalize original practice duplicate checks`); no push or deployment was performed.

### Task 2: Cover the A2 curriculum and error taxonomy

**Files:**
- Modify: `content/original-practice/english-a2.json`
- Modify: `content/summaries/ingles-a2.ts`
- Modify: `content/theories/ingles-a2.ts`
- Modify: `app/(dashboard)/ingles-a2/page.tsx`
- Create: `tests/english-a2-practice.test.ts`

**Interfaces:**
- English questions carry `topicId` from the shared A2 topic taxonomy and a primary skill category of `GRAMMAR | VOCABULARY | READING | SIGN | CONTEXT`. `CARELESSNESS` and `TIME` are self-reported error causes after an incorrect answer, not attributes assigned to an item.
- A2 topic identifiers reuse the shared reviewed taxonomy created by the historical-exams plan. It covers `there-is-are`, present simple/continuous, past simple, future, modals, comparatives, prepositions, quantifiers, countable-uncountable, simple conditionals, everyday vocabulary, notices, messages, email and comprehension contexts.

- [x] **Step 1: Add failing tests** asserting every required A2 topic and the five item-skill categories are represented, at least 18 distinct reviewed eligible items exist for a complete 2025-format section, every item has active learning `conceptIds` and a stable `topicId`, that error-cause annotations expose `CARELESSNESS` and `TIME` for user selection, and that all reviewed items have a clear explanation. Repeated errors on `simple-conditionals` must be separately countable by reviewed `topicId` while English stays outside the official syllabus progress denominator.
- [x] **Step 2: Run** `pnpm exec vitest run tests/english-a2-practice.test.ts`; expected FAIL. The first RED run confirmed three real gaps: topics without a teaching concept, an empty bank, and arbitrary skill categories accepted, plus the expected contract imports for the new classification and progress modules.
- [x] **Step 3: Add** original, reviewed examples for uncovered A2 topics; use everyday contexts and link grammar notes to their teaching module. 22 reviewed original A2 items and 19 new didactic concepts were added; existing taxonomy IDs were preserved. Two Task 1 fixtures were updated to the stricter contract (one used a free-text category, one linked `there-is-are` to a past-simple concept).
- [x] **Step 4: Connect** the existing English page to sanitized records from the original-practice repository; Task 6 wires submitted answers to the owner-scoped attempt API. The page lists sanitized DTOs, restores the official-availability notice, and links each topic concept into the theory view.
- [x] **Step 5: Run** `pnpm exec vitest run tests/english-a2-practice.test.ts tests/diagnostic-practice.test.tsx`; expected PASS with category/topic coverage and no answer leakage before submission. Final application verification passed: `pnpm test --reporter=dot` (70 files, 573 tests), `pnpm typecheck`, `pnpm verify:content` (192 concepts, 152 sources; 102 historical mappings; 8 partial syllabus nodes, 1 missing), `pnpm lint` (0 errors; the same 2 preexisting warnings at `components/shell/user-menu.tsx:44` and `lib/supabase/mock-client.ts:364`) and `pnpm build` (Next.js 16.3.6). `next-env.d.ts`, rewritten by the build, was restored. Independent adversarial review over the twelve requested vectors and the 22 example answers found one navigation defect: the concept links opened the summary view because they omitted `?view=theory`. It was fixed with an observed RED→GREEN regression in `tests/english-a2-page.test.tsx`. Taxonomy coverage and English-outside-the-syllabus-denominator separation kept passing.
- [x] **Step 6: Commit** the scoped Task 2 implementation locally as `aa347c5` (`feat(adif): define A2 curriculum and error taxonomy`) plus the corrective commit `c3ca6d7` (`fix(adif): link A2 concepts into the theory view`); no push, deployment or migration was performed.

### Task 3: Add original psychometric practice by aptitude

**Files:**
- Modify: `content/original-practice/psychometric.json`
- Modify: `content/summaries/psicometria.ts`
- Modify: `content/theories/psicometria.ts`
- Modify: `app/(dashboard)/psicotecnicos/page.tsx`
- Create: `tests/psychometric-practice.test.ts`

**Interfaces:**
- Skills include verbal, synonym-antonym, numerical, calculation, series, logic, matrices, abstract-patterns, attention, difference-detection, memory, sequences and perceptual-speed.
- Modes expose `training`, `timed` and `simulation`; mode selection changes timing, not answer provenance.

- [x] **Step 1: Add failing tests** requiring every aptitude tag, at least 18 distinct reviewed eligible items, unique content fingerprints, original origin, explanation and `reviewedAt` for items enabled in a mode.
- [x] **Step 2: Run** `pnpm exec vitest run tests/psychometric-practice.test.ts`; expected FAIL. The first RED run failed to resolve `lib/content/psychometric-curriculum`, and the repository fixtures were then rejected under the new psychometric contract (`skill` had to name the aptitude).
- [x] **Step 3: Create** new items from scratch. Do not transcribe, translate, trace, or lightly alter third-party test text or artwork. 26 reviewed original items were authored, two per aptitude across all 13 aptitudes, plus 13 reviewed didactic teaching concepts (`psico-topic-*`) linked one-to-one to their aptitude.
- [x] **Step 4: Connect** the page to sanitized repository records with precision-first training, optional timer and separate simulated mode; Task 6 wires submitted answers to the owner-scoped attempt API. The page renders sanitized DTOs through `PsychometricPractice`, exposing `training | timed | simulation`; the mode only changes the block timer, and the rendered list still goes through the mode selector so provenance cannot change.
- [x] **Step 5: Run** `pnpm exec vitest run tests/psychometric-practice.test.ts tests/diagnostic-practice.test.tsx`; expected PASS, and no source restricted for reproduction is imported. Final application verification passed: `pnpm test --reporter=dot` (71 files, 579 tests), `pnpm typecheck`, `pnpm verify:content` (205 concepts, 288 claims; 102 historical mappings; 8 partial syllabus nodes, 1 missing), `pnpm lint` (0 errors; the same 2 preexisting warnings) and `pnpm build` (Next.js 16.3.6). `next-env.d.ts`, rewritten by the build, was restored. Independent adversarial review over originality, answer leakage, aptitude linkage, mode semantics, accessibility and regressions returned PASS WITH FINDINGS and no CRITICAL/IMPORTANT defects; the actionable findings were fixed: the topic label is now bound to its aptitude, the rendered list routes through the mode selector, and the block-timer copy is accurate. A later orchestrator pass closed the remaining semantic gap: an original psychometric item can no longer declare an ADIF normative source, so the public DTO can never project `answerGrounding` for this domain (`tests/psychometric-practice.test.ts`). The official-fingerprint guard runs for this domain but cannot protect against third-party psychometric banks because no official psychometric record exists in the repository.
- [x] **Step 6: Commit** the scoped Task 3 implementation locally as `2e99afc` (`feat(adif): add original psychometric practice`) plus the review-fix commit `14f4a82` (`fix(adif): tighten psychometric practice review findings`); no push, deployment or migration was performed.

### Task 4: Add original common-law practice when official text cannot be republished

**Files:**
- Modify: `content/original-practice/general-knowledge.json`
- Modify: `lib/content/original-practice-schema.ts`
- Create: `tests/general-knowledge-practice.test.ts`

**Interfaces:**
- The common-general bank covers all six current official common syllabus scopes through original wording. Each reviewed legal item links to its official syllabus node, primary source version and exact article/section locator.
- A composite historical-format paper may use cleared official General items where allowed; otherwise it uses reviewed original General items. Every item retains its official/original badge. If a reviewed bank cannot provide 18 eligible items including reserves, paper creation is disabled with a clear content-readiness reason.

- [x] **Step 1: Add failing tests** for coverage of LO 3/2007, LPRL in ADIF's stated scope, ADIF Statute, Declaración sobre la Red 2027 chapters I–II, EBEP chapter VI/title III and conduct code, and Ley 53/1984; require exact primary locators, four unique options, one answer and explanation.
- [x] **Step 2: Run** `pnpm exec vitest run tests/general-knowledge-practice.test.ts`; expected FAIL because the common bank is absent. → 3 failing / 1 vacuous pass (empty bank).
- [x] **Step 3: Write and review original questions from current primary texts**, preserving source versions and exact locators. Do not copy academy material or treat a historical question as original by paraphrasing it. → 24 items (22 reviewed + 2 draft), each anchored to a curated theory source and its exact locator.
- [x] **Step 4: Run** `pnpm exec vitest run tests/general-knowledge-practice.test.ts tests/original-practice-schema.test.ts`; expected PASS with all six official scopes represented, at least 18 distinct reviewed eligible questions, and no reviewed normative item without a primary locator. → 4 files / 47 tests pass; full suite 72 files / 591 tests pass; typecheck, `verify:content` (205 concepts / 288 claims) and build (Next 16.3.6) pass; lint 0 errors / 2 pre-existing warnings.
- [x] **Step 5: Commit** with `git add content/original-practice/general-knowledge.json lib/content/original-practice-schema.ts tests/general-knowledge-practice.test.ts && git commit -m "feat: add original common-law practice"`. → `9e6c5a0` feature, `13f15f1` test hardening, `c3dd68f` lint config.

**Task 4 notes and deviations**
- 22 reviewed items across the five verified common scopes (LO 3/2007, Ley 31/1995, RD 2395/2004, TREBEP, Ley 53/1984), plus 2 draft items for the Declaración sobre la Red scope.
- The Declaración sobre la Red 2027 scope cannot carry reviewed items yet: its only material source `DR 2027` is `status: needs_check` / `locatorPolicy: document-level` in `source-manifest`, and the reviewed gate requires `verified` + `exact`. Promoting it needs a retrievable official PDF (ADIF downloads returned 403), so the scope stays draft-only with a content-readiness reason rather than marking an unverified source as confirmed.
- `lib/content/original-practice-schema.ts` was listed but not modified: no schema change was needed.
- `eslint.config.mjs` now ignores the gitignored `.worktrees/**` and `worktrees/**` snapshots (the roadmap's orphan-worktree discovery fix); eslint was linting generated `.next` chunks from stale snapshots.
- Independent adversarial review: PASS WITH FINDINGS, 0 CRITICAL / 0 IMPORTANT / 2 MINOR / 2 NIT. The MINORs are pre-existing design, not Task 4 defects: "reviewed" is the item's state (the curated anchor claims are repo-wide `needs_review`), and the pre-submission DTO intentionally carries `answerGrounding` (citation only, never the key or explanation).

### Task 5: Add original telecom questions for mapped 2026 nodes

**Files:**
- Modify: `content/original-practice/telecom.json`
- Modify: `content/theories/ict-rd-346-2011.ts`
- Modify: `content/theories/compatibilidad-electromagnetica.ts`
- Modify: `content/theories/rcf-libro-1.ts`
- Create: `tests/telecom-practice.test.ts`

**Interfaces:**
- Every question has a `syllabusNodeId` from the verified source/syllabus manifest and preserves `origin: "original"`.
- The bank distinguishes RD 346/2011, the ADIF CEM document, and RCF Libro 1 as separate domains.

- [ ] **Step 1: Add failing tests** for required node linkage, at least 18 distinct reviewed eligible items, original origin, one correct answer, explanation and rejection of an unmapped node.
- [ ] **Step 2: Run** `pnpm exec vitest run tests/telecom-practice.test.ts`; expected FAIL.
- [ ] **Step 3: Add** reviewed original questions only after the source/syllabus plan supplies verified node IDs.
- [ ] **Step 4: Run** `pnpm exec vitest run tests/telecom-practice.test.ts && pnpm verify:content`; expected PASS, with every reviewed telecom item linked to an official node.
- [ ] **Step 5: Commit** with `git add content/original-practice/telecom.json content/theories/ict-rd-346-2011.ts content/theories/compatibilidad-electromagnetica.ts content/theories/rcf-libro-1.ts tests/telecom-practice.test.ts && git commit -m "feat: add original telecom questions"`.

### Task 6: Persist original practice attempts through the existing owner-scoped pipeline

**Files:**
- Modify: `app/api/attempts/route.ts`
- Modify: `lib/content/original-practice-repository.ts`
- Create: `scripts/export-original-practice-registry.ts`
- Create: `supabase/migrations/202610150004_original_practice_registry.sql`
- Modify: `lib/supabase/mock-client.ts`
- Modify: `lib/supabase/mock-store.ts`
- Create: `supabase/tests/original_practice_registry.sql`
- Create: `tests/original-practice-attempt.test.ts`

**Interfaces:**
- The attempt API accepts an official ID only if found in the existing official repository, or an `ORIG-` ID only if it resolves to a reviewed original record. Draft, unknown, and inactive IDs receive a non-retryable 404.
- The existing `private.learning_questions` columns are `question_id`, `correct_answer`, `concept_ids`, `simulation_id`, and `active`; do not add `origin` or `domain` columns. A deterministic export seeds reviewed original IDs, private answer keys, and active concept links into that existing schema, setting `simulation_id` to a reserved `practice:original:<domain>` bucket. Origin/domain remain in the Git-versioned question dataset and DTO. Keys stay hidden from browser DTOs and inaccessible to authenticated direct reads. Reuse `record_practice_attempt`, `question_attempts`, owner RLS, server grading and existing idempotency. The preceding official-registry migration establishes a legacy `submit_simulation_attempt` allowlist of the six real official form IDs; this migration must preserve and regression-test that allowlist, proving the reserved original buckets cannot create a legacy full-form attempt. Do not redefine the RPC a second time here.
- Every reviewed question enabled for answer persistence maps to at least one active learning concept. Psychometric items map to an existing active psychometric concept; persisted answer events feed the current mastery machinery. Error analytics group English by the same stable `topicId`, independent of the display label.

- [ ] **Step 1: Add failing route/SQL tests** for a reviewed `ORIG-` item, unknown/draft rejection, correct and incorrect grading from the private registry, answer-key exclusion, same-key idempotent retry, changed-payload rejection, owner isolation, and hidden registry keys. Extend the `PLAYWRIGHT_TEST` Supabase mock with a private learning-question fixture so route integration tests exercise the same trusted-key lookup contract; keep SQL/RLS behavior covered separately by the migration test.
- [ ] **Step 2: Run** `pnpm exec vitest run tests/original-practice-attempt.test.ts`; expected FAIL because the API allowlist and original registry are absent.
- [ ] **Step 3: Implement** a deterministic registry exporter and forward-only migration from reviewed source JSON; extend the route's allowlist/repository resolution without changing official ID handling, and keep the established RPC/RLS path. Update the test mock to resolve seeded original IDs from a private fixture registry, never from a client DTO.
- [ ] **Step 4: Run** focused API/content tests, `supabase test db`, and (after local `supabase start` / `supabase db reset`) `psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -v ON_ERROR_STOP=1 -f supabase/tests/original_practice_registry.sql`; expected PASS for active concept mappings, answer secrecy, owner scoping, retry semantics, and continued rejection of original reserved buckets by the allowlisted legacy full-form RPC. Do not apply the migration remotely without a verified backup and remote-state comparison.
- [ ] **Step 5: Commit** with `git add app/api/attempts/route.ts lib/content/original-practice-repository.ts scripts/export-original-practice-registry.ts supabase/migrations/202610150004_original_practice_registry.sql supabase/tests/original_practice_registry.sql tests/original-practice-attempt.test.ts lib/supabase/mock-client.ts lib/supabase/mock-store.ts && git commit -m "feat: persist original practice attempts"`.
