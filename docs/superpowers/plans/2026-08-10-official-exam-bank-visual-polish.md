# Official ADIF Exam Bank and Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every synthetic practice question and simulation with traceable questions and answer keys from published ADIF exams, then make the resulting study flows visually clear and mobile-friendly.

**Architecture:** Add a strict official-exam domain alongside the existing lesson domain, commit one reviewed transcription file per historical exam model, and expose those files through the current content repository. Keep the existing `/tests` and `/simulacros` URLs for compatibility while changing their labels and behavior to official questions and official exam models; Supabase attempt rows remain untouched and are naturally excluded when their retired question IDs no longer exist in the active repository.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Zod, Tailwind CSS, Supabase, Vitest, Playwright, pnpm.

## Global Constraints

- Google-only authentication stays unchanged.
- Supabase remains the persistence layer for progress, attempts, favorites, notes, and goals.
- The active bank may contain only literal questions, four options, and answers verified against official `adif.es` exam booklets and correction templates.
- Do not complete unreadable text, generate distractors, infer an answer, combine models into artificial simulations, or expose private candidate-only psychometric booklets.
- Every active question must carry year, call, profile, exam code, original number, source URL, booklet page, answer-key page, verification date, and a stable content fingerprint.
- Keep the current URLs `/tests` and `/simulacros`; change visible labels to `Preguntas oficiales` and `Exámenes oficiales`.
- Preserve historical Supabase rows; do not delete attempts, favorites, or simulation results for retired synthetic IDs.
- Prefer server components and keep client-side JavaScript limited to study sessions, navigation, and account actions.
- Preserve semantic markup, keyboard operation, mobile-first layout, and `prefers-reduced-motion`.
- Use only the scripts declared in `package.json` for lint, typecheck, tests, and build.

---

### Task 1: Define the official question and exam contracts

**Files:**
- Modify: `lib/content/schema.ts`
- Create: `tests/official-content-schema.test.ts`

**Interfaces:**
- Consumes: existing `optionSchema` and `contentOriginSchema`.
- Produces: `officialQuestionSchema`, `officialQuestionsSchema`, `officialExamSchema`, `officialExamsSchema`, `OfficialQuestion`, `OfficialExam`, and `OfficialQuestionSource`.

- [ ] **Step 1: Write failing schema tests**

Add tests that prove a valid official fixture parses and that missing source pages, non-ADIF URLs, duplicate options, an answer outside A–D, and mismatched exam IDs fail.

```ts
const source = {
  kind: "official_adif_exam" as const,
  year: 2025,
  call: "PNI25/01",
  profileCode: "25/10PO",
  profileName: "Oficial de Telecomunicaciones de Entrada",
  examCode: "1131",
  questionNumber: 1,
  section: "specific" as const,
  isReserve: false,
  documentUrl: "https://www.adif.es/documents/20124/45240815/examen.pdf",
  bookletPage: 61,
  answerKeyPage: 6,
  verifiedAt: "2026-08-10",
  fingerprint: "sha256:4f8f26b905099d51b9f2d47a3c6cf1186be75f75c38644c9a92ef116e11f4ec1",
};

expect(officialQuestionSchema.safeParse({
  id: "ADIF-2025-1131-Q01",
  sectionLabel: "Conocimiento específico",
  prompt: "Pregunta oficial de prueba de contrato.",
  options: [
    { key: "A", text: "Opción A" },
    { key: "B", text: "Opción B" },
    { key: "C", text: "Opción C" },
    { key: "D", text: "Opción D" },
  ],
  answer: "A",
  origin: "official_reference",
  source,
}).success).toBe(true);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm test -- tests/official-content-schema.test.ts`

Expected: FAIL because `officialQuestionSchema` and `officialExamSchema` are not exported.

- [ ] **Step 3: Implement the schemas and types**

Add strict Zod objects. The question ID must match `ADIF-${year}-${examCode}-Q${questionNumber padded to two digits}`. The exam ID must match `ADIF-${year}-${examCode}` and every `questionId` must start with that ID.

```ts
export const officialQuestionSourceSchema = z.object({
  kind: z.literal("official_adif_exam"),
  year: z.number().int().min(2000).max(2100),
  call: z.string().regex(/^PNI\d{2}\/\d{2}$/),
  profileCode: z.string().regex(/^\d{2}\/\d{2}PO$/),
  profileName: z.string().trim().min(1),
  examCode: z.string().regex(/^\d{4}$/),
  questionNumber: z.number().int().min(1).max(99),
  section: z.enum(["general", "english", "specific"]),
  isReserve: z.boolean(),
  documentUrl: z.url().refine((url) => new URL(url).hostname === "www.adif.es"),
  bookletPage: z.number().int().positive(),
  answerKeyPage: z.number().int().positive(),
  verifiedAt: z.iso.date(),
  fingerprint: z.string().regex(/^sha256:[a-f0-9]{64}$/),
}).strict();
```

Define `officialQuestionSchema` with exactly four unique A–D options and `origin: z.literal("official_reference")`. Define `officialExamSchema` with `id`, title, source metadata, `questionIds: z.array(z.string().regex(/^ADIF-\d{4}-\d{4}-Q\d{2}$/)).min(1).max(99)`, `durationMinutes: z.number().int().positive()`, `completeness: z.enum(["complete", "specific_part"])`, and scoring `{ correct: 1, incorrect: -1 / 3, omitted: 0 }` represented as three finite numbers. Export `officialQuestionsSchema = z.array(officialQuestionSchema)` and `officialExamsSchema = z.array(officialExamSchema)`.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `pnpm test -- tests/official-content-schema.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the domain contract**

```bash
git add lib/content/schema.ts tests/official-content-schema.test.ts
git commit -m "feat: define official ADIF exam content"
```

---

### Task 2: Add a provenance-first official exam importer

**Files:**
- Create: `content/official-exams/manifest.json`
- Create: `content/official-exams/transcriptions/.gitkeep`
- Create: `scripts/import-official-exams.ts`
- Modify: `package.json`
- Create: `tests/official-content-importer.test.ts`

**Interfaces:**
- Consumes: `officialQuestionSchema`, `officialExamSchema`, and reviewed transcription JSON files.
- Produces: `parseOfficialExamTranscriptions(input: unknown): { questions: OfficialQuestion[]; exams: OfficialExam[]; report: ImportReport }` and the script `pnpm content:import-official`.

- [ ] **Step 1: Write failing importer tests**

Cover these contracts with an in-memory two-question exam fixture:

- deterministic IDs and fingerprints;
- no duplicate year/model/question combination;
- no question without four options and an answer key;
- no model marked complete when question numbers are missing;
- no source outside `www.adif.es`;
- no question text matching any retired synthetic distractor;
- manifest counts equal the accepted records.

```ts
expect(() => parseOfficialExamTranscriptions({
  manifest: [{
    id: "ADIF-2025-1131",
    year: 2025,
    call: "PNI25/01",
    profileCode: "25/10PO",
    examCode: "1131",
    expectedQuestionNumbers: [1, 2],
  }],
  transcriptions: [{
    examId: "ADIF-2025-1131",
    questions: [{ number: 1 }, { number: 1 }],
  }],
})).toThrow(/duplicate/i);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm test -- tests/official-content-importer.test.ts`

Expected: FAIL because `scripts/import-official-exams.ts` does not exist.

- [ ] **Step 3: Implement pure parsing and validation**

Keep filesystem I/O outside `parseOfficialExamTranscriptions`. Generate the fingerprint from the exact UTF-8 sequence `prompt + "\n" + A + "\n" + B + "\n" + C + "\n" + D + "\n" + answer` using `node:crypto` SHA-256.

```ts
export function contentFingerprint(question: {
  prompt: string;
  options: readonly { key: string; text: string }[];
  answer: string;
}): string {
  const payload = [
    question.prompt,
    ...question.options.map((option) => option.text),
    question.answer,
  ].join("\n");
  return `sha256:${createHash("sha256").update(payload, "utf8").digest("hex")}`;
}
```

The command reads `content/official-exams/manifest.json` and every JSON file in `content/official-exams/transcriptions`, writes `content/questions.json` and `content/exams.json`, and writes `content/official-exams/import-report.json`. It must never generate question wording or answer keys.

The initial manifest must declare exactly these model IDs, in chronological order: `ADIF-2023-1433`, `ADIF-2023-4101`, `ADIF-2024-3403`, `ADIF-2024-3413`, `ADIF-2025-1131`, and `ADIF-2025-4104`. Each entry includes its canonical PDF URL from the design, expected question numbers 1 through 18, `completeness: "specific_part"`, and the documented duration from that PDF's instruction page.

- [ ] **Step 4: Add the package script**

```json
"content:import-official": "tsx scripts/import-official-exams.ts"
```

Remove the old `content:import` script only after Task 3 commits the official data.

- [ ] **Step 5: Run importer tests and typecheck**

Run: `pnpm test -- tests/official-content-importer.test.ts`

Expected: PASS.

Run: `pnpm typecheck`

Expected: PASS.

- [ ] **Step 6: Commit the importer**

```bash
git add content/official-exams/manifest.json content/official-exams/transcriptions/.gitkeep scripts/import-official-exams.ts package.json tests/official-content-importer.test.ts
git commit -m "feat: add official ADIF exam importer"
```

---

### Task 3: Transcribe and verify the six public telecom exam models

**Files:**
- Create: `content/official-exams/transcriptions/2023-1433.json`
- Create: `content/official-exams/transcriptions/2023-4101.json`
- Create: `content/official-exams/transcriptions/2024-3403.json`
- Create: `content/official-exams/transcriptions/2024-3413.json`
- Create: `content/official-exams/transcriptions/2025-1131.json`
- Create: `content/official-exams/transcriptions/2025-4104.json`
- Create: `content/official-exams/import-report.json`
- Modify: `content/questions.json`
- Delete: `content/simulations.json`
- Create: `content/exams.json`
- Modify: `scripts/import-course-content.ts`
- Modify: `tests/content-validation.test.ts`
- Modify: `tests/content-importer.test.ts`

**Interfaces:**
- Consumes: official ADIF PDFs listed in the approved design and `pnpm content:import-official`.
- Produces: six reviewed `OfficialExam` models and their active `OfficialQuestion` records.

- [ ] **Step 1: Add failing repository-level provenance assertions**

Replace volume assertions (`4_500`, `30 × 60`) with:

```ts
const questions = listQuestions();
expect(questions.length).toBeGreaterThan(0);
expect(questions.every((question) => question.origin === "official_reference")).toBe(true);
expect(questions.every((question) => question.source.documentUrl.startsWith("https://www.adif.es/"))).toBe(true);
expect(new Set(questions.map((question) => question.source.fingerprint)).size).toBe(questions.length);
expect(listOfficialExams().map((exam) => exam.id)).toEqual([
  "ADIF-2023-1433",
  "ADIF-2023-4101",
  "ADIF-2024-3403",
  "ADIF-2024-3413",
  "ADIF-2025-1131",
  "ADIF-2025-4104",
]);
```

Add a regression assertion that none of the active options equals the three retired generic distractors.

- [ ] **Step 2: Run the content tests and verify RED**

Run: `pnpm test -- tests/content-validation.test.ts tests/content-importer.test.ts`

Expected: FAIL because the repository still exposes synthetic content.

- [ ] **Step 3: Transcribe one model at a time from the official PDF**

For each model, copy the literal question, A–D options, and answer from the matching correction table. Record the actual PDF pages for both. Mark reserve questions only when the official document identifies them as reserve.

After each model file, run:

`pnpm content:import-official`

Expected: the import report lists that model with `rejected: 0` and the exact accepted count. If any line or answer is uncertain, omit the record and mark the exam `specific_part`; do not repair it from another model.

- [ ] **Step 4: Perform page-by-page visual verification**

Open each source PDF and compare every committed record against its booklet page and answer-key page. Record the reviewer date in `verifiedAt`. Confirm all six IDs use their matching templates:

- 2023: 1433 and 4101;
- 2024: 3403 and 3413;
- 2025: 1131 and 4104.

- [ ] **Step 5: Retire the synthetic generator and data**

Remove the external 4,500-row path and synthetic simulation builder from `scripts/import-course-content.ts`. Either delete the file and its old tests or turn it into a small delegating command that prints an error directing maintainers to `pnpm content:import-official`; do not leave any code capable of regenerating synthetic questions.

- [ ] **Step 6: Run focused validation**

Run: `pnpm content:import-official`

Expected: exit 0, six exam models, zero rejected published records.

Run: `pnpm test -- tests/official-content-schema.test.ts tests/official-content-importer.test.ts tests/content-validation.test.ts tests/content-importer.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit the verified source data**

```bash
git add content/official-exams content/questions.json content/exams.json scripts/import-course-content.ts tests/content-validation.test.ts tests/content-importer.test.ts package.json
git rm content/simulations.json
git commit -m "feat: replace synthetic bank with official ADIF exams"
```

---

### Task 4: Switch the repository, attempts, metrics, and error notebook to official IDs

**Files:**
- Modify: `lib/content/repository.ts`
- Modify: `app/api/attempts/route.ts`
- Modify: `lib/practice/error-notebook.ts`
- Modify: `lib/progress/metrics.ts`
- Modify: `app/(dashboard)/errores/page.tsx`
- Modify: `app/(dashboard)/estadisticas/page.tsx`
- Modify: `tests/attempts-route.test.ts`
- Modify: `tests/error-notebook.test.ts`
- Modify: `tests/progress-metrics.test.ts`

**Interfaces:**
- Consumes: `content/questions.json`, `content/exams.json`, `OfficialQuestion`, and `OfficialExam`.
- Produces: `getOfficialExam(id)`, `listOfficialExams()`, filters `{ year, examCode, section, query, ids }`, and metrics that ignore retired IDs.

- [ ] **Step 1: Write failing integration tests**

Use the active ID `ADIF-2025-1131-Q01` in route tests. Assert:

- the attempt API accepts the official ID and still derives correctness server-side;
- `Q0001` returns 404 even if Supabase contains an old attempt for it;
- the error notebook drops retired question IDs;
- metrics count only attempts joined to active official questions;
- filters can combine year, exam code, section, text, and IDs.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `pnpm test -- tests/attempts-route.test.ts tests/error-notebook.test.ts tests/progress-metrics.test.ts tests/content-validation.test.ts`

Expected: FAIL on the old `^Q\d{4}$` validator and old repository methods.

- [ ] **Step 3: Implement repository and API changes**

Change the attempt validator to:

```ts
questionId: z.string().regex(/^ADIF-\d{4}-\d{4}-Q\d{2}$/),
```

Import `content/exams.json`, parse it with `officialExamsSchema`, validate that every exam question exists and belongs to the same year/model prefix, and expose `getOfficialExam` and `listOfficialExams`. Remove `getSimulation` and `listSimulations` after all consumers migrate.

- [ ] **Step 4: Make retired attempts inert without deleting them**

Keep the current joins through the active question map. Update empty-state copy so historical retired attempts are not described as data loss. In statistics, rank only official sections that have active attempts and show coverage by year/model.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `pnpm test -- tests/attempts-route.test.ts tests/error-notebook.test.ts tests/progress-metrics.test.ts tests/content-validation.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit active-content behavior**

```bash
git add lib/content/repository.ts app/api/attempts/route.ts lib/practice/error-notebook.ts lib/progress/metrics.ts app/(dashboard)/errores/page.tsx app/(dashboard)/estadisticas/page.tsx tests/attempts-route.test.ts tests/error-notebook.test.ts tests/progress-metrics.test.ts
git commit -m "feat: scope study history to official questions"
```

---

### Task 5: Rebuild practice around official provenance

**Files:**
- Modify: `app/(dashboard)/tests/page.tsx`
- Modify: `components/practice/question-session.tsx`
- Modify: `components/practice/favorite-button.tsx` only if the longer IDs expose a bug
- Create: `components/practice/official-source.tsx`
- Modify: `tests/question-session.test.tsx`
- Modify: `tests/navigation.test.tsx`

**Interfaces:**
- Consumes: official repository filters and `PracticeQuestion = Omit<OfficialQuestion, "answer">`.
- Produces: `OfficialSource` component and an official-only bank at `/tests`.

- [ ] **Step 1: Write failing rendered tests**

Assert that the bank and session show:

- `Preguntas oficiales`;
- `Pregunta oficial ADIF`;
- year, call, profile, model, and original question number;
- a canonical link with label `Ver en el documento oficial`;
- no explanation paragraph after correction;
- the answer key returned by the server;
- filters for year, model, and section;
- no `4.500`, `comentadas`, or synthetic origin label.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `pnpm test -- tests/question-session.test.tsx tests/navigation.test.tsx`

Expected: FAIL on old copy and the required `explanation` field.

- [ ] **Step 3: Implement the official source component**

Render provenance as semantic text followed by one external link:

```tsx
<aside aria-label="Procedencia oficial" className="official-source">
  <strong>Pregunta oficial ADIF</strong>
  <span>{source.year} · {source.call} · {source.profileCode} · modelo {source.examCode} · pregunta {source.questionNumber}</span>
  <a href={source.documentUrl} rel="noreferrer" target="_blank">Ver en el documento oficial</a>
</aside>
```

Do not render `explanation`, because official explanations are not present in the correction templates.

- [ ] **Step 4: Rebuild server-side filters and pagination**

Use query parameters `year`, `exam`, `section`, `status`, `query`, and `page`. Build filter options from the active questions, not hard-coded years. Limit an open practice session to the selected official model or filtered set and retain the current 50-question client payload ceiling.

- [ ] **Step 5: Update navigation labels**

Change `Tests` to `Preguntas oficiales` and its dashboard shortcut copy. Keep `/tests` as the href.

- [ ] **Step 6: Run focused tests and verify GREEN**

Run: `pnpm test -- tests/question-session.test.tsx tests/navigation.test.tsx tests/attempts-route.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit official practice UI**

```bash
git add app/(dashboard)/tests/page.tsx components/practice/question-session.tsx components/practice/favorite-button.tsx components/practice/official-source.tsx components/shell/nav-items.ts app/(dashboard)/page.tsx tests/question-session.test.tsx tests/navigation.test.tsx
git commit -m "feat: present traceable official questions"
```

---

### Task 6: Replace artificial simulations with historical exam models

**Files:**
- Modify: `app/actions/simulations.ts`
- Modify: `app/(dashboard)/simulacros/page.tsx`
- Modify: `app/(dashboard)/simulacros/[id]/page.tsx`
- Modify: `app/(dashboard)/simulacros/[id]/client.tsx`
- Modify: `components/practice/simulation-runner.tsx`
- Modify: `components/practice/simulation-results.tsx`
- Modify: `tests/simulation-runner.test.tsx`
- Modify: `tests/content-validation.test.ts`

**Interfaces:**
- Consumes: `OfficialExam`, `getOfficialExam`, and official questions.
- Produces: historical exam sessions that never mix models and calculate `correct - incorrect / 3` without an invented zero floor.

- [ ] **Step 1: Write failing historical-exam tests**

Assert that:

- the detail header shows year, call, profile, model, `Parte específica`, exact question count, and documented duration;
- the runner receives the exam duration instead of 90 hard-coded minutes;
- submission iterates only that exam's question IDs;
- a question ID from another model is ignored/rejected;
- score may be negative when incorrect answers outweigh correct answers;
- corrections show the official source link and no invented explanation;
- visible copy contains neither `30 simulacros` nor `60 preguntas` unless a source exam actually has 60.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `pnpm test -- tests/simulation-runner.test.tsx tests/content-validation.test.ts`

Expected: FAIL on `getSimulation`, `90`, `60`, and the zero score floor.

- [ ] **Step 3: Migrate server submission**

Use `getOfficialExam(examId)`. Validate answer keys against the exam's own ordered question IDs. Persist the existing `simulation_id` column with the new official exam ID; no database migration is required.

Change score calculation to:

```ts
const score = Math.round((correct - incorrect / 3) * 100) / 100;
```

Persist and return that score without `Math.max(0, score)`.

- [ ] **Step 4: Migrate list and detail copy**

Label the route `Exámenes oficiales`. Group cards by year, expose the exact model code, status (`Parte específica`), question count, and source link. The start screen must use `exam.durationMinutes` and `exam.questionIds.length`.

- [ ] **Step 5: Update runner and result components**

Use `Examen`/`entregar examen` terminology. In results, show raw net score and state that it is the formula applied to the available part, not the complete selection-process score.

- [ ] **Step 6: Run focused tests and verify GREEN**

Run: `pnpm test -- tests/simulation-runner.test.tsx tests/content-validation.test.ts tests/progress-metrics.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit historical exam mode**

```bash
git add app/actions/simulations.ts app/(dashboard)/simulacros components/practice/simulation-runner.tsx components/practice/simulation-results.tsx tests/simulation-runner.test.tsx tests/content-validation.test.ts
git commit -m "feat: run published ADIF exam models"
```

---

### Task 7: Apply the final editorial visual system

**Files:**
- Modify: `app/globals.css`
- Modify: `app/(dashboard)/layout.tsx`
- Modify: `app/(dashboard)/page.tsx`
- Modify: `components/dashboard/progress-summary.tsx`
- Modify: `components/dashboard/study-plan.tsx`
- Modify: `components/shell/user-menu.tsx`
- Modify: `app/(dashboard)/tests/page.tsx`
- Modify: `app/(dashboard)/errores/page.tsx`
- Modify: `app/(dashboard)/estadisticas/page.tsx`
- Modify: `app/(dashboard)/simulacros/page.tsx`
- Modify: `tests/navigation.test.tsx`
- Modify: `e2e/mobile.spec.ts`
- Modify: `e2e/study-flow.spec.ts`

**Interfaces:**
- Consumes: the official question and exam surfaces from Tasks 5 and 6.
- Produces: one consistent editorial layout at desktop and 390 px with resilient avatar fallback.

- [ ] **Step 1: Add failing UI contract tests**

Assert that the home page has one primary recommendation, no emoji headings, official-content labels, and accessible account initials when an avatar fails. Update E2E expectations to official navigation labels and official exam counts.

- [ ] **Step 2: Run component tests and verify RED**

Run: `pnpm test -- tests/navigation.test.tsx tests/question-session.test.tsx tests/simulation-runner.test.tsx`

Expected: FAIL on the old labels and avatar behavior.

- [ ] **Step 3: Consolidate global design tokens**

Keep the current neutral paper/ink/green direction, add a serif-free system stack with better Spanish glyph rendering, and define reusable classes for page headers, metadata rows, quiet panels, filters, data tables, and official-source callouts. Remove component-specific white backgrounds and duplicate Tailwind gray/red/green combinations when the global class already expresses the state.

Do not nest bordered cards. Use borders for interactive questions and exam cards only; use spacing and typographic rules for structural sections.

- [ ] **Step 4: Simplify the dashboard**

Reduce five equal metric cards to a compact summary row plus one dominant next-action section. Replace emoji shortcut headings with the existing line icons or text. Keep lessons completed, official questions attempted, accuracy, and weakest official section; omit metrics with no actionable meaning.

- [ ] **Step 5: Improve official-question layouts**

On desktop, keep options in one readable column inside sessions; list pages may use two columns only above 64rem when each option remains at least 32ch wide. At 390 px, stack filters, keep 44px minimum controls, and avoid showing 25 full option sets on the list: render the prompt and provenance summary, with options available in practice mode.

- [ ] **Step 6: Add resilient avatar fallback**

Track image failure in `UserMenu` and render initials after `onError`, while preserving an empty `alt` for the decorative profile image.

- [ ] **Step 7: Run component and E2E tests**

Run: `pnpm test -- tests/navigation.test.tsx tests/question-session.test.tsx tests/simulation-runner.test.tsx`

Expected: PASS.

Run: `pnpm exec playwright test e2e/mobile.spec.ts e2e/study-flow.spec.ts`

Expected: PASS at desktop Chrome and 390 × 844 with no horizontal overflow.

- [ ] **Step 8: Review React performance after edits**

Apply `build-web-apps:react-best-practices`: keep filters server-side, avoid sending answer keys to clients before correction, avoid new client boundaries, and pass only the selected exam's questions to the runner.

- [ ] **Step 9: Commit the visual system**

```bash
git add app components tests/navigation.test.tsx e2e/mobile.spec.ts e2e/study-flow.spec.ts
git commit -m "feat: polish official exam study experience"
```

---

### Task 8: Update documentation and run release verification

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-08-10-official-exam-bank-visual-polish-design.md`
- Modify: `next.config.ts` only if the external lockfile warning remains and `turbopack.root` can be set without changing runtime behavior

**Interfaces:**
- Consumes: every preceding task.
- Produces: accurate setup/content documentation and fresh release evidence.

- [ ] **Step 1: Write documentation assertions**

Update existing tests or add `tests/documentation.test.ts` to read `README.md` and assert it contains `Preguntas oficiales`, `Exámenes oficiales`, and `content:import-official`, while rejecting `4.500 preguntas`, `30 simulacros`, and `preguntas comentadas`.

- [ ] **Step 2: Run the documentation test and verify RED**

Run: `pnpm test -- tests/documentation.test.ts`

Expected: FAIL against the old README.

- [ ] **Step 3: Rewrite README content and maintenance instructions**

Document the six initial models, the official-only policy, provenance fields, import command, review gate, partial-exam labeling, and the fact that private psychometric booklets are excluded.

- [ ] **Step 4: Silence only the verified Next.js root warning**

If a fresh build still selects `C:\Users\kiri_\package-lock.json`, set the repository root explicitly in `next.config.ts` using a path derived from the config file, then rerun build. Do not delete or modify the external lockfile.

- [ ] **Step 5: Run the complete verification suite**

Run in this order:

```bash
pnpm content:import-official
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright test
```

Expected: every command exits 0; the importer reports six reviewed exam models and zero rejected published records; Vitest reports zero failures; Playwright reports zero failures; the production build has no framework error.

- [ ] **Step 6: Perform rendered QA with the Browser plugin**

Test this flow in production mode at 1440 × 1000 and 390 × 844:

`Inicio → Preguntas oficiales → responder → corrección con fuente → Cuaderno de errores → Exámenes oficiales → entregar modelo → Estadísticas`.

Collect page identity, non-blank DOM, framework overlay, console health, screenshot evidence, and one interaction proof per major flow. If Browser initialization fails, record the exact failure and use the repository Playwright workflow.

- [ ] **Step 7: Verify source policy one final time**

Run a repository search for the retired distractors and claims:

```bash
rg -n "Omitir la comprobacion documental|Suponer que toda decision|Aplicar una regla distinta|4\.500 preguntas|30 simulacros" app components content lib README.md
```

Expected: no matches in active product content. Matches in migration documentation are acceptable only when explicitly describing removed content.

- [ ] **Step 8: Commit release documentation**

```bash
git add README.md docs/superpowers/specs/2026-08-10-official-exam-bank-visual-polish-design.md next.config.ts tests/documentation.test.ts
git commit -m "docs: document official-only ADIF content"
```

- [ ] **Step 9: Inspect final repository state**

Run: `git status --short --branch`

Expected: no uncommitted task files. If only `tsconfig.tsbuildinfo` changed, restore it only after confirming it is the generated tracked build artifact and no user-authored changes are present.
