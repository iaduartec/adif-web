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
- Create: `supabase/migrations/202610150002_official_question_publication_gate.sql`
- Create: `supabase/tests/official_question_publication_gate.sql`

**Interfaces:**
- Imported question source contains `initialAnswer`, `effectiveAnswer`, `correctionSource`, `validity`, and `publicationStatus` in addition to the existing official source fields.
- `validity = "current" | "changed" | "out_of_scope" | "pending_review"`.
- Add the six 2023–2025 official booklet/final-resolution documents to the hash/versioned primary source manifest, with exact source identity and verified page locators for scoring rules. A 403 or unverified hash keeps the historical exact-mode gate closed.
- All official prompt/options default to link-only or review-pending until a scoped, evidence-backed public-text review approves them. Keep source metadata and learner history, but withhold non-approved text from public DTOs, ordinary practice and simulator banks.

- [ ] **Step 1: Add failing importer/SQL tests** for final-key precedence, reserve flags, exact form identity, missing tribunal evidence, text suppression until an evidence-backed public-use decision exists, and inactive private answer-registry entries for all official questions without approved public-text status. Reject approval if evidence references an unknown/unverified source/version, lacks an exact locator, or only permits metadata use.
- [ ] **Step 2: Run** `pnpm exec vitest run tests/official-content-importer.test.ts`; expected FAIL.
- [ ] **Step 3: Update** all eight specific-form transcriptions from published final resolutions, creating the missing 2024 forms 1044/2442 and keeping the two 2024 sessions separate. Preserve initial answers and apply the two annulments as final effective answers of `null`; do not infer a reserve replacement. Keep prompt/options/keys out of public results unless the rights decision permits public question text. The psychometric text remains excluded from transcription/publication.
- [ ] **Step 4: Implement** importer and public-repository gating. Resolve every correction and publication-evidence reference against the live `source-manifest.json`, then call `validateOfficialCorrectionSets` before importing or applying a correction; schema parsing alone is not an evidence gate. Keep all non-approved official records unavailable to default practice and composite banks. Generate a forward-only migration that disables uncleared private keys while preserving every attempt/history row. Later rights changes require new forward-only migrations.
- [ ] **Step 5: Run** focused importer/content tests, `supabase test db`, and (after local `supabase start` / `supabase db reset`) `psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -v ON_ERROR_STOP=1 -f supabase/tests/official_question_publication_gate.sql`, followed by `pnpm content:import-official`; expected PASS with all eight specific Telecom forms identifiable, corrected keys applied, and no uncleared public text or active private key.
- [ ] **Step 6: Commit** with `git add content/official-exams/manifest.json content/official-exams/transcriptions/2023-1433.json content/official-exams/transcriptions/2023-4101.json content/official-exams/transcriptions/2024-1044.json content/official-exams/transcriptions/2024-2442.json content/official-exams/transcriptions/2024-3403.json content/official-exams/transcriptions/2024-3413.json content/official-exams/transcriptions/2025-1131.json content/official-exams/transcriptions/2025-4104.json content/source-manifest.json tests/source-manifest.test.ts scripts/import-official-exams.ts tests/official-content-importer.test.ts supabase/migrations/202610150002_official_question_publication_gate.sql supabase/tests/official_question_publication_gate.sql && git commit -m "feat: reconcile official ADIF exam keys"`.

### Task 3: Map every imported question to 2026 validity

**Files:**
- Modify: `content/questions.json`
- Modify: `scripts/import-official-exams.ts`
- Create: `tests/official-question-validity.test.ts`
- Modify: `tests/official-content-importer.test.ts`

**Interfaces:**
- `conceptIds` remain active theory concepts; `syllabusNodeId` identifies a 2026 official node or explicit supplemental node.
- `classifyHistoricalQuestion(question, sourceState): OfficialQuestionValidity` returns a status plus a human-readable reason.

- [ ] **Step 1: Add failing tests** that require each practice-eligible existing specific question to map to an official or explicitly supplemental node and to one or more active learning `conceptIds`; require changed/out-of-scope status for non-current evidence. Task 4 adds the same active-concept and current-syllabus mapping gates for cleared General questions, plus reviewed topic/concept mappings for English.
- [ ] **Step 2: Run** `pnpm exec vitest run tests/official-question-validity.test.ts`; expected FAIL on missing/unresolved mappings.
- [ ] **Step 3: Add** reviewed mappings and validity reasons. Do not map from keywords alone when a reviewer must compare the question's legal basis with current law.
- [ ] **Step 4: Run** `pnpm exec vitest run tests/official-question-validity.test.ts tests/official-content-importer.test.ts`; expected PASS with no pending item used by a default practice filter.
- [ ] **Step 5: Commit** with `git add content/questions.json scripts/import-official-exams.ts tests/official-question-validity.test.ts tests/official-content-importer.test.ts && git commit -m "feat: map historical questions to 2026 scope"`.

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

- [ ] **Step 1: Add failing tests** for section-qualified identifiers, preservation of existing specific IDs, form/session isolation, duplicate prevention, final correction precedence, required current syllabus mapping and active concept IDs for practice-eligible General questions, required stable topic IDs and active concept IDs for English, withholding `link_only`, `review_pending` and `restricted` text/options/keys from public DTOs and practice, importer inclusion only after public-text rights approval, rejection of status-only or nonexistent/unverified/metadata-only evidence, required A2 taxonomy coverage, and rejection of psychometric question text.
- [ ] **Step 2: Run** `pnpm exec vitest run tests/official-common-sections.test.ts`; expected FAIL.
- [ ] **Step 3: Inspect official 2023, 2024, and 2025 booklets and final tribunal resolutions. Define and review stable A2 topic IDs in `english-topics.json`; import General and English question text only when the evidence-backed human publication review explicitly allows public question text; otherwise retain document links and completeness metadata without text. Map each General question to a verified current syllabus node and active normative `conceptIds`; map each English question to a reviewed A2 topic ID and existing active English `conceptIds`. Both mappings must be explicit before practice eligibility. Cover the four 2024 Telecom forms across the 10 and 24 November sessions; the maternity-protection session has no 24/05PO form. Add all six historic PDFs/resolutions to the source manifest and extend its tests to validate hashes, status and exact rule locators.
- [ ] **Step 4: Add the restricted psychometric section as source/completeness metadata only. Do not transcribe, transform, or publish its items.**
- [ ] **Step 5: Run** `pnpm exec vitest run tests/official-common-sections.test.ts tests/official-content-schema.test.ts tests/official-content-importer.test.ts tests/source-manifest.test.ts && pnpm content:import-official`; expected PASS with separate sessions/forms, zero psychometric prompts and no uncleared text exposed.
- [ ] **Step 6: Commit** with `git add content/official-exams/common-sections.json content/official-exams/english-topics.json content/official-exams/manifest.json lib/content/schema.ts scripts/import-official-exams.ts tests/official-common-sections.test.ts tests/official-content-importer.test.ts && git commit -m "feat: add cleared official common exam sections"`.

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

- [ ] **Step 1: Add failing UI/DTO/API tests** for year badge, final correction citation, status alert, suppression of prompt/options/key for `link_only`, `review_pending` and `restricted` records, 404 from the attempt route for non-approved official text, a fully cleared legacy form remaining playable, and a form with any withheld/changed item returning `not_ready` while retaining form metadata and prior learner history.
- [ ] **Step 2: Run** `pnpm exec vitest run tests/official-question-status.test.tsx tests/public-question-dto.test.ts`; expected FAIL.
- [ ] **Step 3: Implement** the DTO and accessible status/source labels using exact ADIF form/page data. Generate the private registry migration from all official records that are current-syllabus eligible, cleared for public question text, and linked to nonempty active `conceptIds`; preserve existing IDs and add section-qualified General/English IDs with corrected keys. Use the existing private table columns and a reserved `simulation_id` bucket such as `practice:official-common:<section>` for common-section practice; keep origin, domain and publication metadata in versioned content files. Harden the legacy RPC with an allowlist resolved against all eight Telecom form IDs from 2023–2025; synthetic practice buckets must not start a legacy full-form attempt.
- [ ] **Step 4: Run** the focused tests, `supabase test db`, and (after local `supabase start` / `supabase db reset`) `psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -v ON_ERROR_STOP=1 -f supabase/tests/official_question_registry.sql`; expected PASS, with active question views never exposing a correct answer and every newly imported, cleared, actively mapped official question answerable by the server RPC. Assert reserved practice buckets are rejected by the legacy full-form RPC. Restricted text remains unavailable for new attempts; the legacy form shell and prior attempt history remain readable.
- [ ] **Step 5: Commit** with `git add lib/content/public-dto.ts components/practice/official-source.tsx components/practice/question-session.tsx 'app/(dashboard)/tests/page.tsx' lib/content/repository.ts app/api/attempts/route.ts tests/official-question-status.test.tsx scripts/export-official-question-registry.ts tests/official-question-registry-export.test.ts supabase/migrations/202610150003_official_question_registry.sql supabase/tests/official_question_registry.sql && git commit -m "feat: show official question validity"`.
