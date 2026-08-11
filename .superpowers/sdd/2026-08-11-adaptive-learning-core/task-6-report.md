# Task 6 report — readiness model and adaptive dashboard

## Scope completed

- Added the pure `calculateReadiness(input)` domain with exported `ReadinessLevel` and `ReadinessSnapshot` contracts.
- Applied the approved four-level model exactly: insufficient below either 20 unique active attempted questions or 10 active reviewed concepts; building below 60% coverage or 50% current domain; on-track only at 80% coverage, 75% current domain, 70% deferred retention, three recent simulations, and 85% timely answers; otherwise consolidating.
- Current domain only counts active concepts in `review` or `consolidated` whose `due_on` is null or not before the current Madrid date.
- Filtered all history against the active concept, question, lesson, and simulation registries. Historical accuracy covers all active answers; recent accuracy uses the last 14 Madrid calendar days.
- Deferred retention uses recent recall events only when the same active concept has earlier evidence at least 24 hours before. Ratings 2–3 count as retained.
- Speed uses the last 30 Madrid days. Practice answers are timely at 90 seconds or less. A simulation contributes timely answered questions only when its whole elapsed time is within the official duration; omissions remain in the denominator.
- Simulation display scores are recomputed as `correct - incorrect / 3`, normalized against the active official exam total, and ordered latest first.
- Added active streak calculation across practice, recall/evidence, lesson activity, and official simulation activity on Madrid calendar days.
- Added real per-concept and per-lesson metrics derived from active question mappings and the lesson concept registry. Multi-concept questions count once per lesson observation.
- Added authenticated parallel server assembly for readiness history from mastery, attempts, review events, simulation attempts/answers, and lesson activity.
- Rebuilt `/` in the required order: readiness/obstacle, today's server-generated plan, overdue reviews, at-risk lessons, next simulation, weekly summary, and complementary resources.
- Kept the dashboard and new statistics surfaces as Server Components. The only existing client-side statistics code retained is the lazy seven-day chart.
- Renamed the root navigation label from `Inicio` to `Preparación` and expanded `/estadisticas` with streak plus semantic lesson/concept tables while preserving the existing seven-day chart, official-section accuracy, and official-model coverage.
- Review round 1 now carries every planned practice task's exact ordered 5/10-question IDs into `/tests`; the route rejects duplicates, wrong-sized sets, and any inactive/unknown ID instead of widening the session.
- All readiness history and daily-plan auxiliary history reads now use stable, fixed 500-row PostgREST pagination and stop only on a short page; page errors abort the calculation rather than returning partial evidence.
- Readiness and daily-plan evidence gates now share one pure helper. Both count active practice plus valid active-simulation answers, and any active mastery `lastReviewedAt` or active recall regardless of rating.
- Simulation scores are recomputed from active answer rows after content filtering, and question-origin review events require both an active concept and active question.
- The overdue dashboard list now comes from the complete active mastery snapshot, independently of the capped or modified daily plan.
- Readiness loading failures now become a typed safe error and both `/` and `/estadisticas` render an accessible, retryable recovery with study resources and no database details.
- Deferred-retention eligibility is grouped by concept and scanned chronologically in O(n log n), replacing the quadratic previous-event search.
- The home route shares its readiness promise with daily-plan assembly, eliminating duplicate reads of question attempts, review events, simulation attempts, simulation answers, and mastery.
- Review round 2 makes planned-question parsing fail closed for repeated query keys (`string[]`), empty comma segments, duplicate IDs, unknown/inactive IDs, and lists outside the exact 5/10 sizes. Authentication runs before parsing, valid order is unchanged, and every invalid shape reaches the labelled recovery response.

## Strict TDD evidence

### RED 1 — readiness domain

```text
pnpm exec vitest run tests/readiness.test.ts
```

Exit 1: Vitest could not resolve the absent `lib/adaptive/readiness.ts`. The test contract already covered all readiness levels, both evidence boundaries, active filtering, Madrid windows, deferred retention, speed, net-score normalization, streak, and concept/lesson aggregation.

### GREEN 1 — pure model

```text
pnpm exec vitest run tests/readiness.test.ts
pnpm typecheck
```

Exit 0: the initial focused suite passed 15 tests and TypeScript passed. A later focused RED proved simulation scores were displayed oldest first; after sorting latest first, the suite passed 16 tests.

### RED/GREEN 2 — server assembly

```text
pnpm exec vitest run tests/readiness-server.test.ts
```

The RED run exited 1 because `lib/adaptive/readiness-server.ts` did not exist. The GREEN run passed the server-to-domain mapping test, including validated review ratings and all persisted history shapes.

### RED/GREEN 3 — dashboard and statistics components

```text
pnpm exec vitest run tests/readiness-dashboard.test.tsx
```

The RED run exited 1 because the adaptive dashboard/statistics components did not exist. The GREEN run passed four component/accessibility tests for exact section order, explicit insufficient evidence, obstacle wording, accessible task/simulation links, streak, semantic tables, and the updated navigation label.

### RED/GREEN 4 — authenticated routes

```text
pnpm exec vitest run tests/readiness-pages.test.tsx
```

The RED run produced two failures against the old routes: `/` still executed the legacy five-query summary and `/estadisticas` exposed no readiness tables. The GREEN run passed both route tests with authenticated readiness and daily-plan server inputs.

### Focused regression set

```text
pnpm exec vitest run tests/readiness.test.ts tests/readiness-dashboard.test.tsx tests/readiness-pages.test.tsx tests/readiness-server.test.ts tests/navigation.test.tsx
pnpm typecheck
```

Exit 0: 5 files and 36 tests passed; TypeScript passed.

### Review round 1/5 — RED

```text
pnpm test -- tests/paginated-query.test.ts tests/adaptive-evidence.test.ts tests/planned-practice.test.tsx tests/readiness.test.ts tests/daily-plan-server.test.ts tests/readiness-dashboard.test.tsx tests/readiness-pages.test.tsx
```

Exit 1: 7 files failed and 8 assertions failed. The missing pagination/evidence/recovery modules failed to resolve; planned practice widened to the first 50 bank questions; unknown IDs were accepted; retired question events made recall eligible; stored simulation aggregates produced the wrong net score; daily-plan evidence ignored simulation/recall history; route failures escaped; and the dashboard had no complete-backlog or exact-question contract.

### Review round 1/5 — GREEN

```text
pnpm exec vitest run tests/paginated-query.test.ts tests/adaptive-evidence.test.ts tests/planned-practice.test.tsx tests/readiness.test.ts tests/readiness-server.test.ts tests/daily-plan-server.test.ts tests/readiness-dashboard.test.tsx tests/readiness-pages.test.tsx
pnpm typecheck
```

Exit 0: 8 files and 39 tests passed; TypeScript passed. The focused contracts cover 500-row range exhaustion/error propagation, exact ordered 5/10 practice sets, hostile IDs, shared evidence, active simulation filtering, active question-origin events, recomputed scores, complete overdue backlog, shared home reads, typed recovery, retry links, alert labelling, headings, and resource navigation.

The first full run then exposed three legacy navigation fixtures that did not model `.range()` and expected duplicate home history reads. After updating those integration fixtures to the paginated/shared-read contract, their focused 19 tests and the full suite passed.

### Review round 2/5 — RED/GREEN

```text
pnpm exec vitest run tests/planned-practice.test.tsx
```

RED exited 1 with 4 failures out of 9 tests. A repeated `questions` key represented as `string[]` threw `TypeError: params.questions?.split is not a function` before authentication, while leading, middle, and trailing empty segments were silently removed and launched a five-question session.

GREEN exited 0 with all 9 route/component tests passing. The suite also locks duplicate, unknown/inactive, and 11-ID over-limit lists to the accessible invalid-practice response, confirms authentication precedes array rejection, and verifies exact order for valid 5- and 10-question plans.

## Full verification

```text
pnpm test
# 48 files, 342 tests passed

pnpm lint
# exit 0; 2 pre-existing Next.js navigation warnings

pnpm typecheck
# exit 0

pnpm build
# exit 0; Next.js production compilation, TypeScript, page data, and static generation passed

git diff --check
# exit 0
```

Server-rendered smoke check with `PLAYWRIGHT_TEST=true`:

```text
GET http://127.0.0.1:3010/             # 200
GET http://127.0.0.1:3010/estadisticas # 200
```

The home response contained `Estado de preparación`, `Sesión de hoy`, `Resumen semanal`, and `Recursos complementarios`. The statistics response contained `Estadísticas de estudio`, `Rendimiento por lección`, `Rendimiento por concepto`, and `Cobertura por año y modelo oficial`.

## Accessibility and rendering review

- Every dashboard section uses a labelled `section` and the approved h2 order.
- Daily tasks, reviews, lessons, simulations, and resources remain ordinary server-rendered links.
- Weekly progress retains a labelled progressbar with numeric ARIA bounds/value.
- Concept, lesson, section, and coverage metrics use named semantic tables and explicit empty states.
- No probability, guarantee, or pass-assurance language appears in readiness criteria or dashboard copy.
- Desktop/mobile CSS is mobile-first, prevents task links from colliding at narrow widths, and adds no runtime JavaScript.

The in-app Browser runtime was available but its required initialization failed with `Cannot redefine property: process`. Per the browser-validation workflow, no silent fallback browser was substituted. Component/accessibility tests and the two direct server-rendered HTTP checks therefore provide the current UI evidence; screenshot, console, and interaction evidence remain uncollected in this environment.

## Concerns

- A learner with no eligible recall pair receives `Sin datos` for deferred retention and cannot reach on-track until that evidence exists; this is intentional and is explained rather than estimated.
- The statistics route server-renders the full active concept registry. It remains modest for the current catalog, but pagination or a server filter may be useful if the registry grows substantially.
- Lint retains the two pre-existing navigation warnings in `components/shell/user-menu.tsx` and `lib/supabase/mock-client.ts`; neither file was changed.

## Commit

- `feat: add adaptive readiness dashboard`
- `fix: harden adaptive readiness history and recovery`
- `fix: reject malformed planned practice queries`
