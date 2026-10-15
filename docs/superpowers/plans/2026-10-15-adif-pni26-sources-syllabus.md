# ADIF PNI26 Sources and Syllabus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish an auditable, update-detectable source catalog and map the complete PNI26/01 26/12PO syllabus to the nine ADIF-listed documents.

**Architecture:** Keep source records and syllabus content versioned in Git. Add a validated manifest and a pure version-comparison layer, then connect the existing syllabus and theory validators to it. Preserve existing additional modules as explicitly supplemental material.

**Tech Stack:** Next.js App Router, TypeScript, Zod, Vitest, pnpm, Git-versioned JSON/TS content.

**Spec:** `docs/superpowers/specs/2026-10-15-pni26-01-26-12po-design.md`

## Global Constraints

- Mantener Next.js, Supabase, Google OAuth y Vercel existentes.
- Mantener el contenido fuente/versiones en Git y los datos personales de estudio en Supabase.
- No recrear tablas si las actuales cubren los flujos y no migrar sin verificar el estado remoto y preparar respaldo.
- No tratar estimaciones históricas, fuentes secundarias ni contenido generado como autoridad normativa.
- No copiar psicométricos protegidos.
- No desplegar, hacer push ni modificar producción como parte de la especificación o auditoría.
- El modo `Formato oficial 2026` permanece desactivado hasta verificar instrucciones de ADIF.
- Un fetch fallido, HTTP 403 o snapshot no cotejado no puede producir el estado `verified`.

## Review Focus

- HTTP 403, timeout y URL inaccesible deben conservar la versión anterior y dejar la fuente en `needs_check`; prueba en Task 3.
- PDF cambiado con el mismo URL debe generar versión candidata por SHA-256; prueba en Task 3.
- Fuente duplicada o `source_version` inexistente debe fallar la validación; prueba en Tasks 2 y 5.
- Tema suplementario no debe contarse dentro del denominador oficial; prueba en Task 4.
- Claim normativo sin fuente primaria o localizador exacto debe fallar; prueba en Task 5.

---

### Task 1: Exclude orphan worktree snapshots from the Vitest baseline

**Files:**
- Modify: `vitest.config.ts`
- Modify: `tests/repository-hygiene.test.ts`

**Interfaces:**
- Consumes: the current Vitest `test.exclude` configuration.
- Produces: a test run that discovers only this repository's tests, never tests beneath `.worktrees/` or `worktrees/`.

- [ ] **Step 1: Write the failing configuration contract test** in `tests/repository-hygiene.test.ts`.

```ts
import vitestConfig from "../vitest.config";

it("excludes orphan worktree snapshots from Vitest discovery", () => {
  expect(vitestConfig.test.exclude).toContain("**/.worktrees/**");
  expect(vitestConfig.test.exclude).toContain("**/worktrees/**");
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `pnpm exec vitest run tests/repository-hygiene.test.ts`
Expected: FAIL because both worktree patterns are absent.

- [ ] **Step 3: Add the two exclusion patterns** to `vitest.config.ts`, keeping existing exclusions.

- [ ] **Step 4: Run the focused test and full suite**

Run: `pnpm exec vitest run tests/repository-hygiene.test.ts && pnpm test --reporter=dot`
Expected: PASS; no discovered file path is under `.worktrees/` or `worktrees/`.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts tests/repository-hygiene.test.ts
git commit -m "test: exclude archived worktrees from vitest"
```

### Task 2: Add a versioned official source manifest

**Files:**
- Create: `content/source-manifest.json`
- Create: `content/convocation/PNI26-01.json`
- Create: `lib/content/source-manifest.ts`
- Create: `tests/source-manifest.test.ts`
- Modify: `lib/content/schema.ts`
- Modify: `scripts/verify-theory-references.ts`

**Interfaces:**
- Produces `sourceManifestSchema` and `parseSourceManifest(value: unknown): SourceManifest`.
- Produces a separately versioned call record with source notice and individually evidenced `examDate`, `sites`, and `positionsByProfile` facts. Each fact stores its value, status, and optional primary source locator; call facts are not syllabus nodes.
- A profile allocation such as 57 places remains `unverified` with no primary evidence until a source record verifies it. A validator must reject promotion to `confirmed` without a verified ADIF source and exact locator.
- `SourceVersionStatus = "verified" | "needs_check" | "superseded" | "unavailable"`.
- Each record contains `sourceId`, `sourceVersion`, `sourceType`, `authority`, `organization`, `title`, `url`, `scope`, `status`, `downloadedAt`, `verifiedAt: string | null`, `consultedLocator`, `editorialConfidence`, `sha256`, and `locatorPolicy`. `organization` is the issuing/body named by the source; `consultedLocator` records the exact consulted page/section or states `document-level`; `editorialConfidence` is an explicit `high | medium | low` assessment with a reason in the record, not a probability of exam appearance. `verifiedAt` is null until the source version is actually verified.
- Consumes: current `LegalReference.sourceId` and the nine syllabus document identities in the approved spec; distinct scopes may also hold call notices, historical booklets, correction resolutions and rights evidence.

- [ ] **Step 1: Add failing manifest tests** for all nine official source identities, required metadata including organization, consulted locator and reasoned editorial confidence, and the current PNI26/01 notice record. A provisional exam date and announced sites must remain labelled provisional/announced; 26/12PO's reported 57 places must stay unverified until an ADIF primary source and exact locator are verified.

```ts
it("contains six common and three 26/12PO official sources", () => {
  expect(manifest.filter((s) => s.scope === "common")).toHaveLength(6);
  expect(manifest.filter((s) => s.scope === "specific-26-12po")).toHaveLength(3);
});

it("rejects a verified version without a SHA-256 hash", () => {
  expect(() => parseSourceManifest(withVerifiedHash(undefined))).toThrow(/sha256/i);
});
```

- [ ] **Step 2: Run the focused tests and verify they fail**

Run: `pnpm exec vitest run tests/source-manifest.test.ts`
Expected: FAIL because the schema and manifest do not exist.

- [ ] **Step 3: Implement the schema and manifest** using the exact six common and three specific documents in the spec. Record the August local snapshots as `needs_check` until compared with current ADIF downloads; never infer currentness from the local filename. Add the latest accessible ADIF call notice as a distinct record; preserve its publication date and whether each fact is provisional or confirmed.

- [ ] **Step 4: Resolve existing source references through the manifest** in `scripts/verify-theory-references.ts`; keep module references backward compatible while validating their `sourceId` and version link.

- [ ] **Step 5: Run source-manifest and reference tests**

Run: `pnpm exec vitest run tests/source-manifest.test.ts tests/official-content-schema.test.ts && pnpm verify:theory-references`
Expected: PASS; unknown IDs and `verified` records without hashes fail, and every existing reference has a manifest entry.

- [ ] **Step 6: Commit**

```bash
git add content/source-manifest.json content/convocation/PNI26-01.json lib/content/source-manifest.ts lib/content/schema.ts scripts/verify-theory-references.ts tests/source-manifest.test.ts
git commit -m "feat: version official ADIF sources"
```

### Task 3: Detect source updates without publishing unreviewed content

**Files:**
- Create: `content/source-observations/latest.json`
- Create: `lib/content/source-update-check.ts`
- Create: `scripts/check-source-updates.ts`
- Create: `tests/source-update-check.test.ts`
- Modify: `package.json`

**Interfaces:**
- `SourceObservation = { sourceId: string; sourceVersion: string; url: string; httpStatus: number | null; failureKind?: "timeout" | "network"; checkedAt: string; etag?: string; lastModified?: string; contentLength?: number; sha256?: string }`. `httpStatus` is null only when no HTTP response exists; `failureKind` is then required. A received HTTP response has a numeric status and no transport failure kind.
- `compareSourceVersion(previous: SourceManifestEntry, observed: SourceObservation): SourceUpdateResult`.
- `SourceUpdateResult.status` is `unchanged | candidate | needs_check`; the function never returns `verified`.
- The CLI writes the latest validated observations to `content/source-observations/latest.json` without editing accepted manifest entries. The source catalog may show a candidate only from this explicit observation artifact; candidates never replace the accepted version/hash.

- [ ] **Step 1: Write tests** for unchanged ETag/hash, changed hash under the same URL, 403, timeout and network failure with `httpStatus: null` plus a required `failureKind`, malformed date, and serialization/validation of the latest observation report.
- [ ] **Step 2: Run** `pnpm exec vitest run tests/source-update-check.test.ts`; expected FAIL.
- [ ] **Step 3: Implement** the pure comparison function and a CLI that checks the manifest, records observations in the report artifact, computes SHA-256 for downloaded bytes, and never edits accepted source records or syllabus content.
- [ ] **Step 4: Run** `pnpm exec vitest run tests/source-update-check.test.ts && pnpm verify:content`; expected PASS, including a `needs_check` result for HTTP 403.
- [ ] **Step 5: Commit** with `git add content/source-observations/latest.json lib/content/source-update-check.ts scripts/check-source-updates.ts tests/source-update-check.test.ts package.json && git commit -m "feat: detect official source updates"`.

### Task 4: Replace provisional syllabus coverage with the official 2026 scope

**Files:**
- Modify: `content/syllabus.ts`
- Modify: `content/syllabus-sources.ts`
- Modify: `scripts/verify-syllabus-coverage.ts`
- Modify: `tests/syllabus-coverage.test.ts`

**Interfaces:**
- `officialItems` contains the six common and three profile-specific parent items.
- Each child node links `sourceId`, `sourceVersion`, exact locator, `linkedModules`, and `status: "covered" | "partial" | "missing" | "reference-only" | "unresolved"`.
- Existing supplemental items remain represented outside official coverage.

- [x] **Step 1: Add failing tests** asserting nine official parents, exact LPRL/EBEP/DR scope, and that supplemental nodes do not affect `officialItemsTotal`.
- [x] **Step 2: Run** `pnpm exec vitest run tests/syllabus-coverage.test.ts`; expected FAIL against the current 17 unresolved provisional items.
- [x] **Step 3: Build** the official hierarchy from the ADIF source documents and their verified page/chapter locators. Keep a node `unresolved` where the current PDF could not be inspected; do not invent lower-level coverage.
- [x] **Step 4: Run** `pnpm exec vitest run tests/syllabus-coverage.test.ts && pnpm verify:syllabus`; expected PASS, with coverage computed only from verified official nodes.
- [ ] **Step 5: Commit** with `git add content/syllabus.ts content/syllabus-sources.ts scripts/verify-syllabus-coverage.ts tests/syllabus-coverage.test.ts && git commit -m "feat: align syllabus with PNI26 26-12PO"`.

### Task 5: Enforce claim and source-version traceability

**Files:**
- Modify: `content/theory-types.ts`
- Modify: `scripts/verify-theory-claims.ts`
- Modify: `scripts/verify-theory-references.ts`
- Create: `tests/source-claim-validation.test.ts`
- Modify: `tests/theory-validators.test.ts`

**Interfaces:**
- Claim source lookup resolves `legalBasis` → module `LegalReference` → `sourceId/sourceVersion` → manifest entry.
- `validateTheoryClaims(input): ValidationIssue[]` emits a blocking issue for a normative claim with only secondary/didactic sources, without a precise locator, or without an explicit editorial confidence (`high | medium | low`) and reason. Persist source, version, exact locator, verification time, confidence and review status on each claim; only high-confidence claims with current primary evidence may be `reviewed`, while medium/low claims remain `draft` or `needs_review` with the reason visible to reviewers.

- [ ] **Step 1: Add failing tests** for missing source, unknown version, missing locator, missing or invalid claim confidence/reason, secondary-only normative claim, low-confidence reviewed claim, and a valid high-confidence primary citation.
- [ ] **Step 2: Run** `pnpm exec vitest run tests/source-claim-validation.test.ts tests/theory-validators.test.ts`; expected FAIL.
- [ ] **Step 3: Implement** the source-version lookup and validator; adapt existing claim records only where verified evidence is available, leaving uncertain claims `draft`/`needs_review`.
- [ ] **Step 4: Run** `pnpm exec vitest run tests/source-claim-validation.test.ts tests/theory-validators.test.ts && pnpm verify:content`; expected PASS with no uncited normative claims marked reviewed.
- [ ] **Step 5: Commit** with `git add content/theory-types.ts scripts/verify-theory-claims.ts scripts/verify-theory-references.ts tests/source-claim-validation.test.ts tests/theory-validators.test.ts && git commit -m "feat: validate claim source versions"`.
