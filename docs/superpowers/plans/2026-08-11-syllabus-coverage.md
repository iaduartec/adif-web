# ADIF Syllabus Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Establish an official-syllabus source of truth, measure real item-level coverage, and complete the first evidence-backed P0/P1 gaps without changing the existing `TheorySection` contract.

**Architecture:** Keep exam-scope references separate from material sources. Add a typed canonical syllabus inventory under `content/`, derive coverage metrics from linked theory modules and their non-empty concepts, and expose verification through a dedicated script and tests. Use the existing theory modules for the first small content batch; create no arbitrary modules.

**Tech Stack:** TypeScript, Next.js, Vitest, `tsx`, pnpm, existing theory validators.

## Global Constraints

- Use only official current sources for normative/material claims.
- Coverage is based on official syllabus items, not claim counts.
- Work in a maximum first batch of 3–5 P0/P1 items.
- Preserve `TheorySection`; avoid general refactors and cosmetic UI changes.
- Keep syllabus source and material source distinct.
- Do not present inaccessible paid technical standards as reproduced content.
- Existing test count must not decrease.

### Task 1: Inventory the official syllabus and define the data model

**Files:**
- Create: `content/syllabus.ts`
- Create: `docs/syllabus-coverage-informe.md`
- Test: `tests/syllabus-coverage.test.ts`

**Interfaces:**
- Produce `SyllabusItem`, `SyllabusStatus`, `SyllabusCoverageMetrics`, `syllabusItems`, and `getSyllabusCoverage()` exports.
- Each item must include a stable ID, official source ID, exact locator, status, linked module slugs, and a short coverage rationale.

- [ ] **Step 1: Write failing tests** for unique IDs, valid statuses, official source IDs, module links, and derived metrics.
- [ ] **Step 2: Run the focused Vitest file and confirm it fails because the model is absent.**
- [ ] **Step 3: Implement the inventory from the repository's current ADIF PNI26/01 scope reference and the 11 existing course blocks, explicitly marking unsupported technical-standard items `reference-only`.
- [ ] **Step 4: Derive `covered`, `partial`, `missing`, `referenceOnly`, and `coveragePercent` from item statuses; do not hardcode percentages.
- [ ] **Step 5: Add the before-state table and the selected official scope document to `docs/syllabus-coverage-informe.md`.
- [ ] **Step 6: Run focused tests and commit `feat(course): add official syllabus coverage map`.

### Task 2: Add the syllabus coverage verifier and package script

**Files:**
- Create: `scripts/verify-syllabus-coverage.ts`
- Modify: `package.json`
- Modify: `tests/syllabus-coverage.test.ts`

**Interfaces:**
- The script exits non-zero with actionable errors for duplicate IDs, invalid states, missing sources, invalid module links, contradictory `covered`/`missing` declarations, or hardcoded metrics.
- Add `verify:syllabus` and include it in `verify:content`.

- [ ] **Step 1: Add failing tests for each verifier guardrail, including a valid covered, partial, missing, and reference-only fixture.
- [ ] **Step 2: Run the focused tests and confirm expected failures.
- [ ] **Step 3: Implement the verifier using the canonical inventory and existing lesson/theory registries.
- [ ] **Step 4: Run `pnpm verify:syllabus` and the focused tests; confirm exit code 0 for the real inventory.
- [ ] **Step 5: Commit `test(course): verify syllabus coverage integrity`.

### Task 3: Select and document the first P0/P1 batch

**Files:**
- Modify: `docs/syllabus-coverage-informe.md`
- Modify: `content/syllabus.ts`

**Interfaces:**
- Produce a gap table with `syllabusItem`, status, linked module, covered scope, missing scope, material source availability, and P0–P3 priority.
- Select at most five items, prioritizing legal and directly examinable technical blocks.

- [ ] **Step 1: Review the inventory against current module concepts and official exam/scope references.
- [ ] **Step 2: Add the gap table and explain the measurement unit (official syllabus item count).
- [ ] **Step 3: Mark the selected batch in the canonical data with explicit rationale.
- [ ] **Step 4: Run the verifier and commit `docs(course): prioritize first syllabus coverage gaps`.

### Task 4: Expand the first content batch with traceable claims

**Files:**
- Modify: only the 3–5 selected `content/theories/*.ts` files, or create one coherent new module only if the gap is a real block.
- Modify: `content/lessons.ts` only when a new module is necessary.
- Modify: `tests/theory-validators.test.ts` or add a focused content test.

**Interfaces:**
- Every new claim has one proposition, a classification, material `legalBasis`, exact locator, and excerpt where normative/interpretative.
- Syllabus linkage remains in `content/syllabus.ts`; material citations remain in theory `sources`.

- [ ] **Step 1: Write failing assertions for each selected item’s newly required concept or source linkage.
- [ ] **Step 2: Run the focused tests and confirm they fail for the missing content.
- [ ] **Step 3: Add the smallest exam-useful expansion supported by BOE/ADIF sources; keep EN 50121-style inaccessible standards reference-only.
- [ ] **Step 4: Run `pnpm verify:content`, focused tests, and manually inspect each citation.
- [ ] **Step 5: Update before/after counts and commit `feat(course): expand verified syllabus coverage`.

### Task 5: Full verification, visual smoke check, and delivery evidence

**Files:**
- Modify: `docs/syllabus-coverage-informe.md`
- Modify: `README.md` only if commands or canonical data need documentation.

- [ ] **Step 1: Run `pnpm verify:content`, `pnpm verify:syllabus`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, and `git diff --check`.
- [ ] **Step 2: Check `/curso` and each expanded module for navigation, visible sources, claim rendering, and no internal IDs or obvious overflow.
- [ ] **Step 3: Record exact results, final counts, remaining reference-only items, and next five gaps in the report.
- [ ] **Step 4: Confirm clean Git status, push `main` without force, and verify the resulting Vercel deployment returns HTTP 200.
