# ADIF PNI26 Study Search and UX Integration Plan

> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task by task. Steps use checkbox syntax for tracking.

**Goal:** Connect the existing ADIF study tools through global search, a traceable source catalog, favorites, and a focused PNI26 dashboard that works well on mobile.

**Architecture:** Extend the existing authenticated App Router shell and editorial design. Search static reviewed content locally and load personal errors/favorites only on authenticated server routes. Consume the versioned source, syllabus, priority, and simulation records built by the dependent plans.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript, Supabase RLS, Vitest, Testing Library, Playwright, pnpm.

**Spec:** docs/superpowers/specs/2026-10-15-pni26-01-26-12po-design.md

## Existing Capabilities to Preserve

- The authenticated shell, mobile/desktop navigation, course reader, official question views, favorites, flashcards, adaptive dashboard, statistics, and responsive styles already exist.
- Keep the current identity and route names such as /curso, /tests, /repasos, and /estadisticas. Add only the missing connections and requested ADIF 2026 context.
- Use the existing source manifest, current syllabus tree, topic-priority reasons, and full-simulation results. Do not duplicate those data models.

## Global Constraints

- Search is read-only and never sends learner queries or personal errors to an external service.
- Search indexes only active/reviewed content for normal results; pending and obsolete material appears only with an explicit status filter.
- Per-user history and favorites are read on the server under the authenticated user and RLS.
- Show exam date and sites with their source status; provisional information must remain labelled provisional.
- Do not estimate a probability of passing. Show observed results, sample size, and “Sin datos” where evidence is insufficient.
- Preserve keyboard navigation, semantic headings, visible focus, reduced motion, and the current mobile-first shell.

## Review Focus

- Search returns no answer key before a question is attempted and groups results by content type.
- User-specific error and favorite results cannot cross account boundaries.
- Every source page displays its current verification state and exact document reference.
- Dashboard minimum indicators use the three historical tests and do not invent a separate General or Specific cutoff.
- Mobile search, navigation, and study actions remain usable without horizontal scrolling or hidden keyboard focus.

### Task 1: Add a typed local search index

**Files:**
- Create: lib/content/search.ts
- Create: tests/content-search.test.ts
- Consume: source manifest, syllabus nodes, official questions, reviewed original practice, and flashcards from the preceding plans

**Interfaces:**
- searchStudyContent(query, indexes, filters) returns grouped, ranked references to syllabus, questions, flashcards, and sources. It returns public question DTOs without correct-answer data.
- Search normalization supports accents, case, common article/section notation, and short A2 phrases without weakening exact source references.

- [ ] Step 1: Add failing tests for accents, article references, abbreviations, English phrases, grouping, inactive content suppression, deterministic order, and answer-key exclusion.
- [ ] Step 2: Run pnpm exec vitest run tests/content-search.test.ts; expected FAIL because the search module does not exist.
- [ ] Step 3: Implement a deterministic in-memory index over validated local content. Add no search service, dependency, or network call.
- [ ] Step 4: Add tests for empty query, no matches, and duplicate concept/source hits; merge duplicates while retaining all provenance links.
- [ ] Step 5: Run focused tests and commit with git add lib/content/search.ts tests/content-search.test.ts && git commit -m "feat: index ADIF study content for search".

### Task 2: Add global search and grouped results

**Files:**
- Create: app/(dashboard)/buscar/page.tsx
- Create: components/search/global-search.tsx
- Create: components/search/search-results.tsx
- Modify: app/(dashboard)/layout.tsx
- Create: tests/study-search-page.test.tsx
- Create: tests/global-search.test.tsx

**Interfaces:**
- A labelled GET form uses /buscar?q=... and preserves the query on refresh/share.
- Result groups are Temario, Preguntas, Flashcards, Fuentes, and Errores. Personal error matches are added by an authenticated server query and filtered against active content.

- [ ] Step 1: Add failing tests for keyboard form submission, query preservation, all result groups, no-results state, error-query authentication, and absence of answer keys.
- [ ] Step 2: Run pnpm exec vitest run tests/study-search-page.test.tsx tests/global-search.test.tsx; expected FAIL.
- [ ] Step 3: Add a compact global search entry in the existing header and the grouped results route. Keep static content search separate from the user-scoped error query.
- [ ] Step 4: Ensure search text is handled only by the application and is not logged with personal results or sent to a provider.
- [ ] Step 5: Run the focused tests and commit with git add 'app/(dashboard)/buscar/page.tsx' components/search/global-search.tsx components/search/search-results.tsx 'app/(dashboard)/layout.tsx' tests/study-search-page.test.tsx tests/global-search.test.tsx && git commit -m "feat: add grouped ADIF study search".

### Task 3: Add a source catalog page

**Files:**
- Create: app/(dashboard)/fuentes/page.tsx
- Create: components/sources/source-catalog.tsx
- Create: tests/source-catalog.test.tsx
- Consume: content/source-manifest.json and content/convocation/PNI26-01.json from the sources-syllabus plan
- Consume: content/source-observations/latest.json from the source-update-check task

**Interfaces:**
- Each row shows authority class, title, organization, scope, version/date, SHA-256 when present, verification state, and a direct source link.
- A changed, unavailable, pending, or stale source is distinguishable from a source verified current. The source page includes the official call facts and their publication date/status.

- [ ] Step 1: Add failing tests for source classes, exact source link, hash/version display, 403 or unverified state, candidate status from the latest observation artifact without changing the accepted hash, provisional call date, and the unverified 26/12PO allocation.
- [ ] Step 2: Run pnpm exec vitest run tests/source-catalog.test.tsx; expected FAIL because the page does not exist.
- [ ] Step 3: Render the validated manifest and optional latest observation artifact without recomputing or silently accepting new hashes. Link to ADIF/BOE originals and identify inaccessible or changed material clearly.
- [ ] Step 4: Run focused tests and commit with git add 'app/(dashboard)/fuentes/page.tsx' components/sources/source-catalog.tsx tests/source-catalog.test.tsx && git commit -m "feat: show official ADIF source catalog".

### Task 4: Add a unified favorites page and navigation entry points

**Files:**
- Create: app/(dashboard)/favoritas/page.tsx
- Create: components/practice/favorites-list.tsx
- Modify: components/shell/nav-items.ts
- Modify: components/shell/dashboard-navigation.tsx
- Modify: app/actions/favorites.ts
- Modify: tests/navigation.test.tsx
- Modify: tests/favorites.test.ts
- Create: tests/favorites-page.test.tsx

- [ ] Step 1: Add failing tests for grouped question/flashcard favorites, reviewed original IDs, add/remove favorite behavior for original IDs, rejection of unknown/draft/non-public IDs, empty state, stale/inactive item handling, authenticated reads, and narrow-screen navigation labels.
- [ ] Step 2: Run pnpm exec vitest run tests/favorites-page.test.tsx tests/navigation.test.tsx; expected FAIL.
- [ ] Step 3: Extend the existing favorite action to resolve eligible official and reviewed original question IDs while retaining its owner-scoped table/RLS behavior. Keep one favorites store; unknown, draft, inactive, or non-public official IDs cannot be added. Render stale saved IDs gracefully without silently deleting user data.
- [ ] Step 4: Add navigation links for Favoritas, Fuentes, and Buscar while preserving active-route semantics and the existing desktop/mobile navigation system.
- [ ] Step 5: Run focused tests and commit with git add 'app/(dashboard)/favoritas/page.tsx' components/practice/favorites-list.tsx components/shell/nav-items.ts components/shell/dashboard-navigation.tsx app/actions/favorites.ts tests/navigation.test.tsx tests/favorites.test.ts tests/favorites-page.test.tsx && git commit -m "feat: connect study resources and favorites".

### Task 5: Focus the dashboard on PNI26 progress and evidence

**Files:**
- Modify: app/(dashboard)/page.tsx
- Modify: components/dashboard/adaptive-dashboard.tsx
- Modify: tests/readiness-pages.test.tsx
- Modify: tests/readiness-dashboard.test.tsx

**Interfaces:**
- Consume the call record, official syllabus progress, priority explanations, and three-test results from prior plans.
- Show a sourced countdown/date state, progress by official topic, current high-priority topics and reasons, today's plan, recent simulation evidence, and per-test minimum status.
- If no complete simulation exists, the minimum status is “Sin datos”; after attempts, report observed results and sample count without a pass-probability estimate.

- [ ] Step 1: Add failing tests for provisional/confirmed countdown labels, official-topic progress, high-priority explanation, three eliminatory test indicators, sample size, and insufficient-data state.
- [ ] Step 2: Run pnpm exec vitest run tests/readiness-pages.test.tsx tests/readiness-dashboard.test.tsx; expected FAIL on missing PNI26 status data.
- [ ] Step 3: Extend the existing dashboard hierarchy with the new evidence and source status. Preserve current readiness criteria and do not create a second score model.
- [ ] Step 4: Test changed call date and unavailable call source; the label and countdown must update from the versioned record or fall back to “Fecha por confirmar”.
- [ ] Step 5: Run focused tests and commit with git add 'app/(dashboard)/page.tsx' components/dashboard/adaptive-dashboard.tsx tests/readiness-pages.test.tsx tests/readiness-dashboard.test.tsx && git commit -m "feat: focus dashboard on PNI26 preparation".

### Task 6: Verify mobile and accessible study flow

**Files:**
- Modify: e2e/study-flow.spec.ts
- Create: e2e/study-search-and-sources.spec.ts
- Create: tests/study-search-accessibility.test.tsx

- [ ] Step 1: Add browser assertions for 390x844 layout, search-to-topic navigation, source-link behavior, favorites, keyboard focus, reduced motion, and no horizontal overflow.
- [ ] Step 2: Run the focused browser suite and record any baseline failures separately from changes in this plan.
- [ ] Step 3: Fix only issues in search, source catalog, favorites, or the dashboard additions; preserve the established page layout elsewhere.
- [ ] Step 4: Run pnpm exec vitest run tests/study-search-accessibility.test.tsx tests/favorites-page.test.tsx tests/source-catalog.test.tsx and pnpm exec playwright test e2e/study-flow.spec.ts e2e/study-search-and-sources.spec.ts.
- [ ] Step 5: Commit with git add e2e/study-flow.spec.ts e2e/study-search-and-sources.spec.ts tests/study-search-accessibility.test.tsx && git commit -m "test: verify ADIF study UX on mobile".
