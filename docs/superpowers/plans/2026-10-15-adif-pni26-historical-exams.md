# ADIF Historical Exam Bank Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconcile the 2023–2025 official telecom exams, including usable general and English sections, to final tribunal keys and current syllabus validity, while publishing only content cleared for the intended use.

**Architecture:** Keep original ADIF source records and corrections in versioned files. The importer builds questions with both initial and final-key provenance; repository and UI expose official origin, correction state, validity, and publication status separately.

**Tech Stack:** TypeScript, Zod, JSON source records, Vitest, existing content repository and Next.js question views.

**Spec:** `docs/superpowers/specs/2026-10-15-pni26-01-26-12po-design.md`

## Global Constraints

- Mantener Next.js, Supabase, Google OAuth y Vercel existentes.
- Mantener el contenido fuente/versiones en Git y los datos personales de estudio en Supabase.
- No recrear tablas si las actuales cubren los flujos y no migrar sin verificar el estado remoto y preparar respaldo.
- No tratar estimaciones históricas, fuentes secundarias ni contenido generado como autoridad normativa.
- No copiar psicométricos protegidos.
- No desplegar, hacer push ni modificar producción como parte de la especificación o auditoría.
- El modo `Formato oficial 2026` permanece desactivado hasta verificar instrucciones de ADIF.
- No publicar íntegramente una pregunta cuando el permiso de reproducción está pendiente.
- A public ADIF booklet does not itself establish permission to republish the question text; a scoped human rights/use review is mandatory for every official question set.

### Historical inventory correction (verified 2026-10-15)

- The complete 24/05PO Telecom form inventory in PNI24/01 is **1044/2442** for the 10 November session and **3403/3413** for Valencia on 24 November. The 15 November maternity-protection session contains no 24/05PO form.
- The 16 December 2024 tribunal resolution annuls 1044 question 6 and 2442 question 8 (initial keys C/C; final key marks both annulled). It records no named reserve replacement, so `replacementQuestionNumber` stays `null`. The 3403 question 14 / 3413 question 13 allegation was not upheld.
- PNI23/01 has no Telecom key changes after its tribunal resolution. PNI25/01 confirms the original Telecom answers, including 1131 question 14 / 4104 question 13 as B/B; reserves are not activated.
- ADIF attributes psychometric-test rights to PEA and restricts public/commercial reproduction without authorization. Keep only exam and restriction metadata.
- Evidence: [PNI23/01 initial booklet](https://www.adif.es/documents/20124/17165113/%2807.11.2023%29%20-%20Plantillas%20correctoras%20y%20cuadernillos%20de%20examen.pdf/dce76c5e-ae60-a0d0-568e-4f4db30c3823), [PNI23/01 tribunal resolution](https://www.adif.es/documents/20124/17165113/%2827.11.2023%29%2BPlantillas%2Bcorrectoras%2By%2Bresoluci%C3%B3n%2Bdel%2BTribunal.pdf/ee76d603-4125-febc-93f3-23c0da2cb0e1?t=1701095724031), [PNI24/01 initial booklet](https://www.adif.es/documents/20124/33942288/%2825.11.2024%29%20-%20Plantillas%20correctoras%20y%20cuadernillos%20de%20examen.pdf/7d5847b0-d613-65b0-a0a2-ae936d6e0500), [PNI24/01 tribunal resolution](https://www.adif.es/documents/20124/33942288/%2816.12.2024%29%2BPlantillas%2Bcorrectoras%2By%2Bresoluci%C3%B3n%2Bdel%2BTribunal.pdf/70febb4b-f8a2-de01-d00d-11feba2b6aa3?t=1734442826559), [PNI25/01 initial booklet](https://www.adif.es/documents/20124/45240815/%2818.11.2025%29%2B-%2BPlantillas%2Bcorrectoras%2By%2Bcuadernillos%2Bde%2Bexamen.pdf/a2b9f608-83b0-34ee-0aa4-aba4ee6baf6b), [PNI25/01 tribunal resolution](https://www.adif.es/documents/20124/45240815/%2802.12.2025%29%2B-%2BPlantillas%2Bcorrectoras%2By%2Bresoluci%C3%B3n%2Bdel%2BTribunal.pdf/8ec22bea-1eff-2619-697e-5d3958e94f74?t=1764679200377).

## Review Focus

- Tribunal cambia una respuesta frente a la plantilla inicial; el tribunal prevalece y ambas fuentes quedan registradas.
- Pregunta anulada o de reserva no cuenta como pregunta puntuable hasta aplicar la regla de corrección publicada.
- Pregunta antigua remite a normativa cambiada; se marca `changed` o `out_of_scope`, no vigente por defecto.
- Oficial sin documento ADIF, página o respuesta trazable debe bloquear importación.
- Pregunta psicométrica restringida no se puede etiquetar/publicar como práctica oficial.
- A status enum by itself cannot authorize publication of official question text; the record needs a dated human decision, allowed use and evidence reference.

---

### Task 1: Model tribunal corrections and publication status

**Files:**
- Create: `content/official-exams/corrections/2023.json`
- Create: `content/official-exams/corrections/2024.json`
- Create: `content/official-exams/corrections/2025.json`
- Modify: `lib/content/schema.ts`
- Create: `lib/content/official-corrections.ts`
- Create: `tests/official-corrections.test.ts`

**Interfaces:**
- `OfficialCorrection = { examId: string; questionNumber: number; initialAnswer: AnswerKey; finalAnswer: AnswerKey | null; action: "confirmed" | "changed" | "annulled"; replacementQuestionNumber: number | null; correctionSource: SourceReference }`.
- `applyOfficialCorrections(question, corrections): CorrectedOfficialQuestion` preserves the original answer and returns the effective answer/action and any explicit reserve replacement. A replacement is required only when the official tribunal resolution specifies one.
- `PublicationStatus = "link_only" | "review_pending" | "approved_for_publication" | "restricted"`.
- `PublicationReview = { decisionId: string; decision: "approved" | "denied" | "pending"; permittedUse: "metadata_only" | "public_question_text"; reviewedAt: string; reviewerRole: "human_editor"; evidence: { sourceId: string; sourceVersion: string; locator: string; basis: "explicit_license" | "written_permission" | "documented_legal_review" }; rationale: string }`. `approved_for_publication` is derived only from a dated human review explicitly covering public question text and resolvable evidence; an enum or free-text citation alone cannot authorize publication.

- [x] **Step 1: Write tests** for confirmed, changed, annulled with/without a specified reserve replacement, duplicate and out-of-exam correction records, and rejection of `approved_for_publication` without a dated decision, public-text scope, resolvable source/version, exact locator and supported evidence basis.
- [x] **Step 2: Run** `pnpm exec vitest run tests/official-corrections.test.ts`; expected FAIL (the correction module did not exist yet).
- [x] **Step 3: Implement** strict schemas and pure correction application. Preserve the correction resolution URL, publication status and review evidence, year, form, affected question number, and any explicitly named reserve replacement. Never infer a replacement from position alone; derive publishability from the scoped review decision. Task 2 integrates the actual correction sources into `source-manifest.json` before importing the records.
- [x] **Step 4: Run** `pnpm exec vitest run tests/official-corrections.test.ts tests/official-content-schema.test.ts`; expected PASS; annulled questions have no effective answer unless the official resolution specifies reserve handling.
- [x] **Step 5: Commit** with `git add content/official-exams/corrections lib/content/schema.ts lib/content/official-corrections.ts tests/official-corrections.test.ts && git commit -m "feat: model ADIF tribunal corrections"` (`cd1047d`; plan updates were included in the scoped commit).

### Task 2: Import final answers and auditable provenance

**Files:**
- Modify: `content/official-exams/manifest.json`
- Modify: `content/source-manifest.json`
- Modify: `lib/content/source-manifest.ts`
- Modify: `tests/source-manifest.test.ts`
- Modify: `content/official-exams/transcriptions/2023-1433.json`
- Modify: `content/official-exams/transcriptions/2023-4101.json`
- Modify: `content/official-exams/transcriptions/2024-3403.json`
- Modify: `content/official-exams/transcriptions/2024-3413.json`
- Create: `content/official-exams/transcriptions/2024-1044.json`
- Create: `content/official-exams/transcriptions/2024-2442.json`
- Modify: `content/official-exams/transcriptions/2025-1131.json`
- Modify: `content/official-exams/transcriptions/2025-4104.json`
- Modify: `scripts/import-official-exams.ts`
- Modify: `tests/official-content-importer.test.ts`
- Create: `lib/content/official-exam-manifest.ts`
- Create: `lib/content/official-exam-catalog.ts`
- Modify: `tests/official-corrections.test.ts`
- Create: `lib/content/official-publication.ts`
- Modify: `lib/content/repository.ts`
- Modify: `lib/content/public-dto.ts`
- Modify: `app/(dashboard)/tests/page.tsx`
- Modify: `app/(dashboard)/simulacros/page.tsx`
- Modify: `app/(dashboard)/simulacros/[id]/page.tsx`
- Modify: `app/(dashboard)/errores/page.tsx`
- Create: `tests/withheld-question-bank.test.tsx`
- Modify: behavior tests to use an explicit publication-cleared fixture; the production publication gate remains unmocked in gate tests.
- Create: `supabase/migrations/202610150002_official_question_publication_gate.sql`
- Create: `supabase/tests/official_question_publication_gate.sql`

**Interfaces:**
- Imported question source contains `initialAnswer`, `effectiveAnswer`, `correctionSource`, `validity`, and `publicationStatus` in addition to the existing official source fields.
- `validity = "current" | "changed" | "out_of_scope" | "pending_review"`.
- Register the six 2023–2025 official booklet/final-resolution documents in the versioned primary source manifest with exact identity and locators. Direct ADIF PDF requests returned 403 HTML responses, not PDFs; their hashes and exact page checks therefore remain unresolved and historical exact-mode stays closed.
- All official prompt/options default to link-only or review-pending until a scoped, evidence-backed public-text review approves them. Keep source metadata and learner history, but withhold non-approved text from public DTOs, ordinary practice and simulator banks.

- [x] **Step 1: Add failing importer/SQL tests** for final-key precedence, reserve flags, exact form identity, missing tribunal evidence, text suppression until an evidence-backed public-use decision exists, and inactive private answer-registry entries for all official questions without approved public-text status. Reject approval if evidence references an unknown/unverified source/version, lacks an exact locator, cites an ordinary booklet instead of a source registered for that rights basis, or only permits metadata use. Add server-rendered tests for withheld text, preserved learner history, and all eight metadata cards without opening uncleared exams.
- [x] **Step 2: Run** `pnpm exec vitest run tests/official-content-importer.test.ts`; initial expected failures confirmed the publication gate was missing. After implementation, the focused suite passed; broader suites are tracked in final verification.
- [ ] **Step 3: Reconcile** all eight forms and the two 2024 annulments against the published resolutions. The form/session inventory and correction metadata are registered, and existing local transcriptions remain preserved, but the PDFs could not be fetched as PDF bytes (ADIF returned 403 HTML). Do not claim the raw question text or page references were newly verified; keep exact-source hashes and question-text publication pending.
- [x] **Step 4: Implement** importer and public-repository gating. Resolve correction and publication evidence against `source-manifest.json`, require the source to be explicitly registered for the declared rights basis, validate reserve flags against the manifest, reject future review dates and source snapshots/downloads, enforce download-before-verification-before-snapshot chronology, hide all non-approved records from practice and public DTOs, preserve raw records and learner history, expose all eight form records as metadata-only catalog cards, and add a forward-only migration to deactivate uncleared private keys without deleting attempts. The tests use a publication-cleared fixture only for flow mechanics; the real gate is tested without a mock.
- [ ] **Step 5: Verify external data gates.** Full local verification: `pnpm exec vitest run` (468 passed), `pnpm typecheck`, `pnpm lint` (two existing warnings), `pnpm verify:content`, and `pnpm build` passed. `pnpm content:import-official` correctly exits nonzero while tribunal sources are unresolved; SHA-256 hashes of `content/questions.json`, `content/exams.json`, and `content/official-exams/import-report.json` were identical before/after. Supabase CLI and `psql` are unavailable, so `supabase test db` and the SQL test were not executed. Do not mark this step passed until source/rights evidence and local database execution are available.
- [ ] **Step 6: Commit** with `git add content/official-exams/manifest.json content/official-exams/transcriptions/2023-1433.json content/official-exams/transcriptions/2023-4101.json content/official-exams/transcriptions/2024-1044.json content/official-exams/transcriptions/2024-2442.json content/official-exams/transcriptions/2024-3403.json content/official-exams/transcriptions/2024-3413.json content/official-exams/transcriptions/2025-1131.json content/official-exams/transcriptions/2025-4104.json content/source-manifest.json tests/source-manifest.test.ts scripts/import-official-exams.ts tests/official-content-importer.test.ts supabase/migrations/202610150002_official_question_publication_gate.sql supabase/tests/official_question_publication_gate.sql && git commit -m "feat: reconcile official ADIF exam keys"`.

### Task 3: Map every imported question to 2026 validity

**Files:**
- Modify: `content/questions.json`
- Modify: `content/official-exams/manifest.json`, `lib/content/official-exam-manifest.ts`
- Modify: `scripts/import-official-exams.ts`
- Modify: `lib/content/schema.ts`, `lib/content/public-dto.ts`, `lib/content/official-publication.ts`, `package.json`
- Create: `tests/official-question-validity.test.ts`
- Modify: `tests/official-content-importer.test.ts`, `tests/official-content-schema.test.ts`, `tests/public-question-dto.test.ts`, `tests/simulation-runner.test.tsx`, `tests/error-notebook.test.ts`, `tests/source-manifest.test.ts`
- Create: `lib/content/official-question-validity.ts`
- Create: `content/official-exams/concept-syllabus-mappings.json`
- Create: `scripts/verify-official-question-mappings.ts`

**Interfaces:**
- `conceptIds` remain active theory concepts; `syllabusNodeId` identifies the uniquely mapped official 26/12PO node.
- `classifyHistoricalQuestion(question, sourceState)` returns the mapped 2026 node, stored currentness, the evidence-gated study validity, a human-readable reason, and the exact current-source citation whenever currentness has been reviewed.
- A question cannot leave `pending_review` until its exact historic booklet, tribunal key and ADIF scope are verified, its currentness is reviewed, and the cited current source version is verified and locatable.
- Practice eligibility reconstructs the exact exam form, accepted transcription concept IDs, tribunal evidence, current source citation and stored classification before exposing official text; changing a status or concept field alone cannot open a question.

- [x] **Step 1: Add failing tests** that require all 102 preserved specific questions to resolve to one current official 26/12PO node via active concepts; missing and cross-node mappings fail rather than guessing from wording; pending historic evidence stays pending; promotion needs verified historic, tribunal, scope and exact current-source evidence.
- [x] **Step 2: Run** `pnpm exec vitest run tests/official-question-validity.test.ts`; initial run failed on the missing mapping module, then the focused tests passed after implementation.
- [x] **Step 3: Add** explicit concept-to-syllabus mappings, stored node IDs, currentness, validity reasons and nullable current-source citations for all 102 questions. Pin each form's accepted `transcribedQuestionNumbers` in the official-exam manifest so deleting a transcription row cannot silently shrink the expected set. The historic PDFs/resolutions remain unresolved, so no question was promoted. Corrected ICT Annex II/IV/V references, separated the two BAT appearances into their own concept tied to RD 346/2011 Annex II §2.5.4, and corrected six RCF Chapter 5 question mappings after independent review. Normalized 2025 booklet URLs to the exact manifest references.
- [x] **Step 4: Verify** currentness/evidence recomputation at the practice boundary, exact form identities, exact concept mapping to accepted transcription rows and exact coverage of every manifest-pinned transcription ID. Full verification passed: 479 tests; typecheck; lint with two existing warnings; `pnpm verify:content`; production build; and `git diff --check`. The import command still rejects unresolved tribunal sources (ADIF 403); hashes of questions, exams and import report were identical before/after. Independent adversarial review approved the fix and found no remaining Important issue.
- [ ] **Step 5: Commit** the scoped Task 3 files, excluding the user-local design-spec edit, with `git commit -m "feat: map historical questions to 2026 scope"`.

### Task 4: Reconcile official general and English sections without copying restricted psychometrics

**Files:**
- Create: `content/official-exams/common-sections.json`
- Modify: `content/official-exams/manifest.json`
- Modify: `lib/content/schema.ts`
- Modify: `scripts/import-official-exams.ts`
- Modify: `tests/official-content-importer.test.ts`
- Create: `tests/official-common-sections.test.ts`
- Create: `content/official-exams/english-topics.json`

**Interfaces:**
- A common-section record identifies year, call, telecom profile, exam session, form code, section, question number, source booklet, correction source, publication status and scoped `PublicationReview` evidence. Each practice-eligible General question carries a verified current `syllabusNodeId`; each English question carries a reviewed A2 `topicId`; all practice-eligible questions carry one or more existing active `conceptIds` for the learning registry. This task establishes the shared stable A2 topic taxonomy in `english-topics.json`; the original-practice and adaptive plans reuse it.
- `PublicationReview.evidence` is `{ sourceId: string; sourceVersion: string; locator: string; basis: "explicit_license" | "written_permission" | "documented_legal_review" }`; resolve ID/version to a source-manifest record and reject unknown, unverified or metadata-only evidence when public question-text use is claimed.
- Preserve the current 102 question IDs used in persisted learner history. New identifiers include a section segment so overlapping question numbers across General, English, and Specific cannot collide; all eight Telecom forms stay distinct by year and form code.
- Psychometric records may identify the official document, form, restriction, and announced count only. They never contain protected prompts, options, images, or answer keys.

- [x] **Step 1: Add failing tests** for section-qualified identifiers, preservation of existing specific IDs, form/session isolation, duplicate prevention, required current syllabus mapping and active concept IDs for practice-eligible General questions, required stable and reviewed A2 topic mappings for English, publication-rights evidence, required A2 taxonomy coverage, and rejection of psychometric question text. The original run failed because the catalog implementation did not exist.
- [x] **Step 2: Run** `pnpm exec vitest run tests/official-common-sections.test.ts`; initial run failed on the absent catalog module, then passed after implementation.
- [x] **Step 3: Inspect the official ADIF search-index snippets for the 2023–2025 booklet layouts. They establish the common-block ranges and reserve positions, including all four 2024 Telecom form identities across 10 and 24 November; the 15 November maternity-protection session has no 24/05PO form. Direct opening of the six official PDFs still returns 403, so source-manifest versions, hashes and exact PDF locators remain unverified. The six source identities were already registered; their audit notes now record the 16 October check. Create section metadata and stable user-requested A2 topic IDs without importing General/English prompts or answer keys. Every English topic is `needs_review` until its theory mapping is examined against a verified source. Practice-mapping validation requires an exact verified common syllabus source or a reviewed A2 topic plus active concepts.
- [x] **Step 4: Add** all 8 psychometric section records, within the 24 common-section records, as restricted metadata only. No prompt, option, image, answer key or psychometric item data is permitted by the strict schema.
- [x] **Step 5: Run** `pnpm exec vitest run tests/official-common-sections.test.ts tests/official-content-schema.test.ts tests/official-content-importer.test.ts tests/source-manifest.test.ts`, the full Vitest suite, typecheck, lint, content verification and production build. All passed (486 tests; lint retains two existing warnings). `pnpm content:import-official` remains expected to fail closed because the tribunal sources are unverified; question, exam and import-report SHA-256 hashes were unchanged. Independent adversarial review approved the catalog and scope guards.
- [x] **Step 6: Commit** `content/official-exams/common-sections.json`, `content/official-exams/english-topics.json`, `content/official-exams/manifest.json`, `content/source-manifest.json`, `lib/content/official-common-sections.ts`, `lib/content/official-exam-manifest.ts`, `lib/content/schema.ts`, `scripts/import-official-exams.ts`, `tests/official-common-sections.test.ts`, and this plan, excluding the user-local design-spec edit and generated `next-env.d.ts`, with `git commit -m "feat: catalogue official common exam sections"`.

### Task 5: Expose source corrections and statuses in question views

**Files:**
- Modify: `lib/content/public-dto.ts`
- Modify: `components/practice/official-source.tsx`
- Modify: `components/practice/question-session.tsx`
- Modify: `app/(dashboard)/tests/page.tsx`
- Modify: `lib/content/repository.ts`
- Modify: `app/api/attempts/route.ts`
- Create: `tests/official-question-status.test.tsx`
- Create: `scripts/export-official-question-registry.ts`
- Create: `tests/official-question-registry-export.test.ts`
- Create: `supabase/migrations/202610150003_official_question_registry.sql`
- Create: `supabase/tests/official_question_registry.sql`

**Interfaces:**
- Public DTO excludes answer keys during an active attempt and includes `validity`, `publicationStatus`, and correction metadata needed for source display.
- Filters accept `status=current|changed|out_of_scope|pending_review` without relabeling the question's official origin.

- [x] **Step 1: Add failing UI/DTO/API tests** for year badge, final correction citation, status alert, suppression of prompt/options/key for withheld records, metadata-search privacy, 404 from the attempt route for non-approved official text, a fully cleared legacy form remaining playable, and a form with any withheld/changed item returning `not_ready` while retaining form metadata and prior learner history.
- [x] **Step 2: Run** `pnpm exec vitest run tests/official-question-status.test.tsx tests/public-question-dto.test.ts`; initial red run confirmed missing status DTO/UI, withholding behavior and registry exporter.
- [x] **Step 3: Implement** answer-free public status/source DTOs and accessible citation labels; support section-qualified General/English IDs; keep metadata search from querying withheld prompts while merging active, practice-gated text matches; enforce 404 for unavailable questions; and generate the private registry migration from only currently eligible, rights-cleared, actively mapped records. Rights approval is tied to the exact question section and common-section rights record. Specific-part counts and question IDs are pinned to `transcribedQuestionNumbers`; common question IDs and reserve flags are checked against the section catalog. The migration allowlists all eight Telecom forms, prevents common-practice buckets from opening official form-specific attempts, and rejects a partially active form. Current export contains zero answer rows because tribunal/source and rights evidence remain unresolved.
- [ ] **Step 4: Run** focused tests, `supabase test db`, and the direct SQL test. Final focused suites pass (15 tests across the two affected suites); the full suite passes (509 tests in 63 files), and typecheck, content verification, lint and production build pass. Lint retains two existing warnings in `components/shell/user-menu.tsx` and `lib/supabase/mock-client.ts`. Independent adversarial review approved the runtime source, manifest ID, section, number and reserve gates. The SQL test is authored but could not run: `supabase` and `psql` are unavailable and this checkout has no `supabase/config.toml`. No local or remote database was started or modified. Execute this gate when the project has a configured local Supabase CLI/database; do not apply the migration to remote data as part of this task.
- [x] **Step 5: Commit** the scoped Task 5 implementation locally as `8d15bf7` (`feat: show official question validity`); no push or deployment was performed.
