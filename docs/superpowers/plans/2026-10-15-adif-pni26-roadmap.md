# PNI26/01 26/12PO Implementation Roadmap

> Status: architecture specification approved; implementation is underway. Plan 3 Task 3 (original psychometric practice), Task 4 (original common-law practice, five verified common scopes) and Task 5 (original telecom practice, 12 ICT + 12 RCF) are complete. The Declaración sobre la Red scope is draft-only until its source is verified and the CEM scope stays out of the bank (no verified material source). Later Plan 3 tasks remain unstarted.

## Preserve and Extend the Existing Product

This program builds on the existing Next.js, TypeScript, Supabase Auth (email/password) and Vercel project. The repository already contains the authenticated study shell, 11 theory modules, 172 concepts, 146 sources, 255 claims, source hashing and content validators, a 102-question official specific bank, course reader, notes, favorites, flashcards, English and psychometric pages, a per-form official exam runner, error notebook, review scheduling, daily planning, and readiness statistics.

The work should first correct discovery of orphan worktree tests. A previous 923-pass Vitest baseline included failures from stale ignored worktree snapshots. The focused suite must exclude .worktrees/ and worktrees/ before aggregate test counts become a gate. Do not discard or prune those worktrees as part of that fix.

## Plan Set and Dependencies

| Order | Plan | Depends on | Main result |
|---|---|---|---|
| 1 | [Sources and official syllabus](2026-10-15-adif-pni26-sources-syllabus.md) | Approved specification | Versioned call facts and source manifest; nine official syllabus scopes; source and claim validation |
| 2 | [Historical exams](2026-10-15-adif-pni26-historical-exams.md) | Plan 1 | Versioned tribunal corrections; current applicability for historical items; cleared general/English questions; no protected psychometric content |
| 3 | [Original practice](2026-10-15-adif-pni26-original-practice.md) | Plans 1–2 | Reviewed original A2, psychometric, and telecom question banks; reuses the shared A2 taxonomy and follows the official registry migration |
| 4 | [Composite simulator](2026-10-15-adif-pni26-simulator.md) | Plans 2 and 3 | Four visible blocks, historical 2025 rules, secure persistence, exact scoring and post-exam analysis |
| 5 | [Adaptive priorities and review loop](2026-10-15-adif-pni26-study-loop.md) | Plans 1–4 | Evidence-ranked topics, owner-scoped error causes, and rated flashcard reviews using current mastery machinery |
| 6 | [Search and UX integration](2026-10-15-adif-pni26-search-ux.md) | Plans 1–5 | Search, source catalog, favorites page, and updated PNI26 dashboard on the existing shell |

Run Plan 2 after Plan 1, then Plan 3 after both Plans 1 and 2: the historical-source/rights work establishes which official records can be exposed, defines the shared reviewed A2 taxonomy, and its ordered registry migration must land before the original-answer registry. The forward-only migration order is: `202610150002` official publication gate, `202610150003` official question registry, `202610150004` original question registry, `202610150005` composite simulation papers, and `202610150006` error-cause annotations. Then follow Plans 4–6. Use no more than three active implementers, assign explicit file ownership, and use a separate reviewer on each phase. Never have two workers modify the shared content schema, adaptive dashboard, simulation RPC, or navigation at once.

## Gates

1. **Plan review and approval:** wait for the user to approve this plan set before implementing.
2. **Phase entry:** verify source checkout status, branch/HEAD, Project Bridge claims, relevant diff, and current implementation; preserve dirty user work.
3. **Task execution:** follow the linked TDD plan, reuse current APIs/data tables, and commit each bounded task on the isolated feature branch.
4. **Phase review:** an independent read-only reviewer checks source correctness, content traceability, scoring, RLS, accessibility, mobile behavior, and regressions with evidence. Resolve findings before the next phase.
5. **Release readiness:** run existing and new validators, TypeScript, lint, unit/integration tests, SQL/RLS tests where available, mobile browser tests, and production build. Prepare a Vercel preview only after implementation approval; no production deploy or remote migration is part of this roadmap.

## Evidence and Open Constraints

- The official page lists six common and three specific study documents. Several ADIF downloads returned 403, so local files must stay unverified until compared with a retrievable official version.
- ADIF's 14 October 2026 notice announces Phase 1 as expected on 12 December and lists Barcelona, León, Madrid, and Sevilla. Keep the date provisional until ADIF confirms it. The 57-place allocation for 26/12PO remains unverified from an accessible primary source and has a regression gate against promotion without evidence.
- ADIF has not published PNI26/01 exam-specific time, question-count, or scoring rules. Keep the historical 2025 simulation separate and keep the 2026 mode disabled.
- ComoSerFerroviario course 170 redirects to login. Edge session access could not be opened through the available browser connector. Do not infer the course edition or collect restricted material; revisit only through the user's legitimate browser session.
- TenTuPlaza guides are secondary methods references. Keep their content attributed and do not copy private banks or protected psychometrics.
- Official previous-year question text must be published only where the intended use is cleared. If rights remain uncertain, keep a link and source metadata instead of reproducing the item.
- Supabase remote state is not verified. Any migration needs a local behavioral/RLS test, a remote-state comparison and a backup before it can be applied.

## Do Not Do

- Do not start from a new scaffold, rebuild auth/database/navigation, or recreate existing study tables.
- Do not reset, clean, prune, overwrite, or force-push any worktree or branch.
- Do not mark inaccessible sources, unresolved syllabus items, unknown rights, or unverified call facts as confirmed.
- Do not train with historical items whose current applicability is unresolved.
- Do not label generated content official or reproduce third-party psychometric material.
- Do not show correct answers during a real simulation or enable a 2026 format from historical assumptions.
- Do not push, deploy, apply a remote migration, or change production before the relevant review and explicit release approval.
