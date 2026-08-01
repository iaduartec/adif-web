# Plataforma ADIF Telecomunicaciones Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir y desplegar una plataforma web de estudio para ADIF Oficial de Telecomunicaciones de Entrada 2026 con Google OAuth, progreso sincronizado, curso, tests, simulacros, fichas, notas y estadísticas.

**Architecture:** Next.js App Router separará contenido estático versionado de datos personales persistidos en Supabase. Los componentes serán de servidor por defecto; solo autenticación interactiva, filtros, respuestas, temporizador, notas y gráficos usarán componentes cliente. Las operaciones personales se validarán en servidor y quedarán protegidas por RLS.

**Tech Stack:** Next.js, TypeScript, React, Tailwind CSS, Supabase Auth/PostgreSQL, Vitest, Testing Library, Playwright, Vercel.

## Global Constraints

- Inicio de sesión exclusivamente mediante Google.
- Despliegue público en Vercel y persistencia en Supabase.
- App Router y componentes de servidor por defecto.
- Diseño editorial claro, verde ferroviario contenido y sin rejillas repetitivas de tarjetas.
- Navegación completa: Inicio, Curso, Tests, Simulacros, Psicotécnicos, Inglés A2, Fichas, Cuaderno de errores y Estadísticas.
- El material oficial, las explicaciones originales y el contenido pendiente de cotejo deben distinguirse visiblemente.
- Todas las tablas personales deben tener RLS y restringirse al usuario propietario.
- HTML semántico, teclado, foco visible, contraste WCAG AA y `prefers-reduced-motion`.
- Ejecutar lint, typecheck, pruebas existentes y build antes de entregar.

## File Structure

```text
app/
  (auth)/login/page.tsx                 acceso con Google
  auth/callback/route.ts                intercambio OAuth
  (dashboard)/layout.tsx                shell autenticado
  (dashboard)/page.tsx                  inicio personal
  (dashboard)/curso/[slug]/page.tsx     lección
  (dashboard)/tests/page.tsx            práctica filtrable
  (dashboard)/simulacros/[id]/page.tsx  ejecución/corrección
  (dashboard)/errores/page.tsx          cuaderno de errores
  (dashboard)/estadisticas/page.tsx     métricas
  api/attempts/route.ts                  registro de respuestas
components/
  shell/                                navegación y cabecera
  course/                               lección y procedencia
  practice/                             preguntas y simulacros
  dashboard/                            progreso y planificación
content/
  lessons.ts                            catálogo de lecciones
  questions.json                        preguntas importadas
  simulations.json                      definiciones de simulacros
lib/
  content/                              consultas de contenido
  supabase/                             clientes browser/server
  progress/                             métricas y recomendaciones
supabase/migrations/                    esquema y RLS
tests/                                  pruebas unitarias e integración
e2e/                                    recorridos Playwright
```

---

### Task 1: Base Next.js, sistema visual y shell público

**Files:**
- Create: `package.json`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/(auth)/login/page.tsx`
- Create: `components/ui/button.tsx`
- Create: `tests/login-page.test.tsx`

**Interfaces:**
- Consumes: ninguna.
- Produces: `Button`, tokens CSS y ruta `/login` para tareas posteriores.

- [ ] **Step 1: Scaffold Next.js with TypeScript and Tailwind**

Run: `pnpm create next-app@latest . --ts --tailwind --eslint --app --src-dir=false --import-alias="@/*"`

Expected: `package.json` contains `dev`, `build`, `start`, and `lint` scripts.

- [ ] **Step 2: Install test dependencies and add scripts**

Run: `pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react`

Add scripts: `"typecheck": "tsc --noEmit"`, `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 3: Write the failing login-page test**

```tsx
render(<LoginPage />)
expect(screen.getByRole('heading', { name: /prepara adif telecomunicaciones/i })).toBeVisible()
expect(screen.getByRole('button', { name: /continuar con google/i })).toBeEnabled()
expect(screen.getByText(/no pertenece a adif/i)).toBeVisible()
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `pnpm test -- tests/login-page.test.tsx`

Expected: FAIL because `LoginPage` is not implemented.

- [ ] **Step 5: Implement the editorial login shell**

Define CSS variables `--ink: #17211f`, `--paper: #f7f8f5`, `--rail: #e2e7e2`, `--accent: #176b55`, `--accent-strong: #0d503f`; implement a full-height layout, restrained rule lines, 48px desktop title, 36px mobile title, and the exact allowed copy from the design spec.

- [ ] **Step 6: Run checks and commit**

Run: `pnpm test -- tests/login-page.test.tsx && pnpm lint && pnpm typecheck`

Expected: all PASS.

Commit: `git add . && git commit -m "feat: scaffold editorial study platform"`

### Task 2: Supabase clients, Google OAuth and protected routes

**Files:**
- Create: `lib/supabase/browser.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/middleware.ts`
- Create: `middleware.ts`
- Create: `app/auth/callback/route.ts`
- Modify: `app/(auth)/login/page.tsx`
- Test: `tests/auth-redirect.test.ts`

**Interfaces:**
- Consumes: `/login` and `Button` from Task 1.
- Produces: `createBrowserClient()`, `createServerClient()`, `updateSession(request)` and OAuth callback.

- [ ] **Step 1: Install Supabase packages**

Run: `pnpm add @supabase/supabase-js @supabase/ssr`

- [ ] **Step 2: Write failing redirect tests**

```ts
expect(resolveProtectedRoute(null, '/curso')).toEqual('/login?next=%2Fcurso')
expect(resolveProtectedRoute({ id: 'u1' }, '/curso')).toBeNull()
```

- [ ] **Step 3: Verify failure**

Run: `pnpm test -- tests/auth-redirect.test.ts`

Expected: FAIL because `resolveProtectedRoute` does not exist.

- [ ] **Step 4: Implement OAuth and middleware**

Use `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: origin + '/auth/callback' } })`; exchange `code` in the callback with `exchangeCodeForSession`; protect every dashboard route and preserve `next`.

- [ ] **Step 5: Validate configuration errors**

When `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is absent, render a server-safe configuration message in development and return a generic unavailable state in production.

- [ ] **Step 6: Run checks and commit**

Run: `pnpm test -- tests/auth-redirect.test.ts && pnpm lint && pnpm typecheck`

Expected: PASS.

Commit: `git add . && git commit -m "feat: add Google authentication"`

### Task 3: Database schema and row-level security

**Files:**
- Create: `supabase/migrations/202608020001_study_schema.sql`
- Create: `supabase/tests/rls.sql`
- Create: `lib/database.types.ts`
- Create: `docs/supabase-setup.md`

**Interfaces:**
- Consumes: Supabase user IDs from Task 2.
- Produces: tables `profiles`, `lesson_progress`, `question_attempts`, `simulation_attempts`, `simulation_answers`, `favorites`, `notes`, `study_goals`.

- [ ] **Step 1: Write RLS assertions first**

```sql
select throws_ok(
  $$ insert into public.notes(user_id, lesson_id, body) values ('other-user', 'ict-01', 'x') $$,
  '42501'
);
```

- [ ] **Step 2: Implement schema with ownership constraints**

Every personal table uses `user_id uuid not null references auth.users(id) on delete cascade`; notes use `check (char_length(body) between 1 and 5000)`; unique keys prevent duplicate favorites and progress rows.

- [ ] **Step 3: Enable RLS and add policies**

For each table create select/insert/update/delete policies using `(select auth.uid()) = user_id`; restrict profile insert to its own ID.

- [ ] **Step 4: Generate database types**

Run: `supabase gen types typescript --local > lib/database.types.ts`

Expected: generated types contain all eight public tables.

- [ ] **Step 5: Run database tests and commit**

Run: `supabase db reset && supabase test db`

Expected: PASS with cross-user insert denied.

Commit: `git add . && git commit -m "feat: add secure study data schema"`

### Task 4: Import and validate course content

**Files:**
- Create: `scripts/import-course-content.ts`
- Create: `content/lessons.ts`
- Create: `content/questions.json`
- Create: `content/simulations.json`
- Create: `lib/content/schema.ts`
- Create: `lib/content/repository.ts`
- Test: `tests/content-validation.test.ts`

**Interfaces:**
- Consumes: `outputs/Curso_ADIF_Telecom_2026/02_Banco_4500_preguntas_comentadas.csv`.
- Produces: `getLesson(slug)`, `listLessons()`, `getQuestion(id)`, `listQuestions(filter)`, `getSimulation(id)`.

- [ ] **Step 1: Add Zod and write failing validation test**

Run: `pnpm add zod && pnpm add -D tsx`

```ts
expect(questionSchema.safeParse({ id: 'Q1', options: [] }).success).toBe(false)
expect(allQuestions).toHaveLength(4500)
expect(new Set(allQuestions.map(q => q.id)).size).toBe(4500)
```

- [ ] **Step 2: Run test to verify failure**

Run: `pnpm test -- tests/content-validation.test.ts`

Expected: FAIL because schemas and generated content are absent.

- [ ] **Step 3: Implement importer and provenance model**

Define `ContentOrigin = 'official_reference' | 'original_explanation' | 'verification_pending'`; map every imported question to `original_explanation`; preserve stable `Q0001` identifiers; generate exactly 30 simulation definitions with 60 question IDs each.

- [ ] **Step 4: Generate and validate content**

Run: `pnpm tsx scripts/import-course-content.ts && pnpm test -- tests/content-validation.test.ts`

Expected: PASS with 4,500 unique questions and 30 valid simulations.

- [ ] **Step 5: Commit**

Commit: `git add . && git commit -m "feat: import validated ADIF course content"`

### Task 5: Authenticated shell and responsive navigation

**Files:**
- Create: `app/(dashboard)/layout.tsx`
- Create: `components/shell/sidebar.tsx`
- Create: `components/shell/mobile-navigation.tsx`
- Create: `components/shell/user-menu.tsx`
- Test: `tests/navigation.test.tsx`

**Interfaces:**
- Consumes: authenticated server client from Task 2.
- Produces: `DashboardShell` and navigation shared by every private screen.

- [ ] **Step 1: Write navigation test**

Assert all nine required destinations are present, current route uses `aria-current="page"`, and mobile trigger has an accessible name.

- [ ] **Step 2: Verify failure**

Run: `pnpm test -- tests/navigation.test.tsx`

- [ ] **Step 3: Implement open editorial shell**

Use a 248px desktop rail, 1px dividers, no floating card around the page, 72px maximum reading measure for lessons, and a mobile sheet that traps focus and closes on navigation.

- [ ] **Step 4: Run tests and commit**

Run: `pnpm test -- tests/navigation.test.tsx && pnpm lint && pnpm typecheck`

Commit: `git add . && git commit -m "feat: add responsive authenticated shell"`

### Task 6: Course hierarchy, lesson reader, notes and completion

**Files:**
- Create: `app/(dashboard)/curso/page.tsx`
- Create: `app/(dashboard)/curso/[slug]/page.tsx`
- Create: `components/course/origin-label.tsx`
- Create: `components/course/lesson-reader.tsx`
- Create: `components/course/lesson-notes.tsx`
- Create: `app/actions/lesson.ts`
- Test: `tests/lesson-reader.test.tsx`

**Interfaces:**
- Consumes: content repository from Task 4 and `lesson_progress`/`notes` from Task 3.
- Produces: `saveLessonProgress(slug, percent)` and `saveNote(slug, body)` server actions.

- [ ] **Step 1: Write failing provenance and note tests**

```tsx
expect(screen.getByText('Explicación didáctica original')).toBeVisible()
await user.type(screen.getByLabelText('Notas personales'), 'Repasar PAU')
await user.click(screen.getByRole('button', { name: 'Guardar nota' }))
expect(saveNote).toHaveBeenCalledWith('ict-01', 'Repasar PAU')
```

- [ ] **Step 2: Implement server actions with user validation**

Call `supabase.auth.getUser()` inside each action; reject unauthenticated calls; trim notes; enforce 1-5,000 characters; upsert progress on `(user_id, lesson_id)`.

- [ ] **Step 3: Implement course and lesson UI**

Render semantic article sections, source links, provenance labels, examples, errors, related questions and a completion action. Provide loading, missing-lesson and save-error states.

- [ ] **Step 4: Run checks and commit**

Run: `pnpm test -- tests/lesson-reader.test.tsx && pnpm lint && pnpm typecheck`

Commit: `git add . && git commit -m "feat: add course reader and personal notes"`

### Task 7: Question practice, favorites and error notebook

**Files:**
- Create: `app/(dashboard)/tests/page.tsx`
- Create: `app/(dashboard)/errores/page.tsx`
- Create: `components/practice/question-session.tsx`
- Create: `components/practice/question-filters.tsx`
- Create: `app/api/attempts/route.ts`
- Create: `app/actions/favorites.ts`
- Test: `tests/question-session.test.tsx`

**Interfaces:**
- Consumes: questions from Task 4 and attempts/favorites tables from Task 3.
- Produces: `QuestionSession`, `recordAttempt(input)` and `toggleFavorite(questionId)`.

- [ ] **Step 1: Write failing interaction tests**

Test answer selection, optional immediate correction, next-question navigation, favorite toggle and automatic appearance of an incorrect answer in the error notebook.

- [ ] **Step 2: Implement validated attempt endpoint**

Accept `{ questionId: string, answer: 'A'|'B'|'C'|'D', mode: 'practice'|'simulation', elapsedMs: number }`; derive correctness on the server from content; never trust a client-supplied score.

- [ ] **Step 3: Implement filters and scalable rendering**

Filter by module, status, failed and favorites; paginate at 25 rows in list mode; load the interactive session only after starting practice.

- [ ] **Step 4: Run checks and commit**

Run: `pnpm test -- tests/question-session.test.tsx && pnpm lint && pnpm typecheck`

Commit: `git add . && git commit -m "feat: add question practice and error notebook"`

### Task 8: Timed simulations and correction

**Files:**
- Create: `app/(dashboard)/simulacros/page.tsx`
- Create: `app/(dashboard)/simulacros/[id]/page.tsx`
- Create: `components/practice/simulation-runner.tsx`
- Create: `components/practice/simulation-results.tsx`
- Create: `app/actions/simulations.ts`
- Test: `tests/simulation-runner.test.tsx`

**Interfaces:**
- Consumes: simulation definitions and database tables from Tasks 3-4.
- Produces: `submitSimulation(input)` returning `{ attemptId, correct, incorrect, omitted, score, elapsedMs }`.

- [ ] **Step 1: Write failing timer and submission tests**

Use fake timers to verify countdown, answered indicator, confirmation before manual delivery, automatic delivery at zero, and server-derived scoring.

- [ ] **Step 2: Implement runner state**

Persist draft answers to versioned `sessionStorage` every change; restore only when simulation ID and content version match; clear after successful submission.

- [ ] **Step 3: Implement transactional submission**

Validate all question IDs belong to the simulation; calculate results on the server; insert one `simulation_attempts` row and its answers; return corrections only after insertion succeeds.

- [ ] **Step 4: Run checks and commit**

Run: `pnpm test -- tests/simulation-runner.test.tsx && pnpm lint && pnpm typecheck`

Commit: `git add . && git commit -m "feat: add timed simulations and correction"`

### Task 9: Dashboard, study plan and statistics

**Files:**
- Create: `app/(dashboard)/page.tsx`
- Create: `app/(dashboard)/estadisticas/page.tsx`
- Create: `components/dashboard/progress-summary.tsx`
- Create: `components/dashboard/study-plan.tsx`
- Create: `components/dashboard/performance-chart.tsx`
- Create: `lib/progress/metrics.ts`
- Test: `tests/progress-metrics.test.ts`

**Interfaces:**
- Consumes: attempts, progress and goals from Tasks 3, 6-8.
- Produces: `calculateMetrics(attempts, lessonProgress)` and `recommendNextSession(metrics)`.

- [ ] **Step 1: Write deterministic metric tests**

Test empty history, accuracy by module, seven-day activity, streak boundaries, weakest module and next-session recommendation.

- [ ] **Step 2: Implement pure metric functions**

Use one pass with Maps for grouped accuracy; return serializable numbers and ISO dates; do not include React or Supabase dependencies.

- [ ] **Step 3: Implement dashboard and lazy statistics**

Server-render summary and study plan; dynamically import chart code only on statistics; include a textual table matching every chart value.

- [ ] **Step 4: Run checks and commit**

Run: `pnpm test -- tests/progress-metrics.test.ts && pnpm lint && pnpm typecheck`

Commit: `git add . && git commit -m "feat: add progress dashboard and statistics"`

### Task 10: End-to-end verification, documentation and Vercel release

**Files:**
- Create: `e2e/study-flow.spec.ts`
- Create: `e2e/mobile.spec.ts`
- Create: `playwright.config.ts`
- Modify: `README.md`
- Create: `.env.example`
- Create: `vercel.json`

**Interfaces:**
- Consumes: complete application.
- Produces: repeatable local setup, verified production build and deployed Vercel URL.

- [ ] **Step 1: Install Playwright and write the core-flow test**

Run: `pnpm add -D @playwright/test && pnpm exec playwright install chromium`

Test a seeded authenticated session: open dashboard, complete a lesson, answer a question incorrectly, verify error notebook, favorite it, submit a simulation and see statistics.

- [ ] **Step 2: Add mobile and accessibility assertions**

Use a 390x844 viewport; verify no horizontal overflow, mobile navigation keyboard operation, visible focus and readable lesson line length.

- [ ] **Step 3: Document exact setup**

README must cover Supabase project creation, Google provider configuration, redirect URLs for localhost and Vercel, migration command, import command, environment variables, test commands and deployment.

- [ ] **Step 4: Run the complete release gate**

Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm exec playwright test`

Expected: all commands exit 0.

- [ ] **Step 5: Deploy and smoke-test**

Run: `vercel --prod`; configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`; add the production callback URL to Google/Supabase; repeat login, lesson, test and simulation workflows on the deployed URL.

- [ ] **Step 6: Commit release documentation**

Commit: `git add . && git commit -m "chore: verify and document production release"`

## Completion Gate

- [ ] Google OAuth works on localhost and production.
- [ ] Cross-user database access is denied by RLS tests.
- [ ] Course contains visible provenance labels.
- [ ] The bank contains exactly 4,500 unique questions.
- [ ] Exactly 30 simulations load and submit.
- [ ] Progress, notes, favorites and attempts survive a new session.
- [ ] Error notebook updates after an incorrect response.
- [ ] Dashboard and statistics match persisted data.
- [ ] Desktop and 390x844 mobile flows pass.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` and Playwright pass.
