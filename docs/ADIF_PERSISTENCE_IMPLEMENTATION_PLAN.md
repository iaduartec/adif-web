# ADIF 360 — Plan de implementación de persistencia de sesiones

Fecha: 2026-11-02. Rama: `codex/auditoria-adif-26`.

## Objetivo

Permitir que el estudiante:
**Empezar una práctica → responder → guardar → cerrar → volver → recuperar → terminar → consultar resultados.**

Sin perder respuestas, duplicar intentos ni exponer datos entre usuarios.

## Decisiones aprobadas

1. Tabla `practice_sessions` independiente (no reutilizar `attempts`).
2. Respuestas normalizadas en `practice_session_answers`.
3. Sin fallback offline (localStorage).
4. Sin migración de intentos históricos.
5. Migración aditiva y reversible.

## Fase 0 — Inspección del sistema existente

### Archivos a inspeccionar

- `app/api/attempts/route.ts` — endpoint de corrección existente.
- `lib/supabase/server.ts` — cliente Supabase SSR.
- `lib/supabase/client.ts` — cliente Supabase browser.
- `lib/content/original-practice-repository.ts` — repositorio de preguntas.
- `lib/content/original-practice-public-dto.ts` — DTO público.
- `components/practice/original-practice-session.tsx` — componente de sesión.
- `supabase/migrations/` — migraciones existentes.
- `supabase/config.toml` — configuración local.

### Reutilizable

- Autenticación Supabase (cookie-based).
- Endpoint `/api/attempts` para corrección individual.
- Componente `OriginalPracticeSession` (UI).
- Validadores de contenido.

## Fase 1 — Esquema SQL (migración local)

### Migración: `supabase/migrations/20261102000000_practice_sessions.sql`

```sql
-- practice_sessions
CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  domain TEXT NOT NULL,
  topic_id TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('training', 'practice')),
  question_count INTEGER NOT NULL,
  question_ids TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'ABANDONED')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  total_elapsed_ms INTEGER DEFAULT 0,
  client_event_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own sessions"
  ON practice_sessions FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_practice_sessions_user ON practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_status ON practice_sessions(status);
CREATE UNIQUE INDEX idx_practice_sessions_client_event ON practice_sessions(client_event_id);

-- practice_session_answers
CREATE TABLE practice_session_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  question_id TEXT NOT NULL,
  selected_answer TEXT NOT NULL CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN,
  correct_answer TEXT,
  explanation TEXT,
  elapsed_ms INTEGER,
  client_event_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, question_id)
);

ALTER TABLE practice_session_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own answers"
  ON practice_session_answers FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_session_answers_session ON practice_session_answers(session_id);
CREATE INDEX idx_session_answers_user ON practice_session_answers(user_id);
CREATE UNIQUE INDEX idx_session_answers_client_event ON practice_session_answers(client_event_id);
```

### Rollback

```sql
DROP TABLE IF EXISTS practice_session_answers;
DROP TABLE IF EXISTS practice_sessions;
```

## Fase 2 — Contratos API

### POST /api/practice-sessions

**Request:**
```json
{
  "domain": "psychometric",
  "topicId": "all",
  "mode": "training",
  "questionCount": 10,
  "questionIds": ["q1", "q2", ...],
  "clientEventId": "uuid"
}
```

**Response (201):**
```json
{ "sessionId": "uuid", "status": "CREATED" }
```

**Validaciones:**
- Usuario autenticado (server-side).
- `clientEventId` único (idempotencia).
- `questionIds` no vacío.
- `mode` válido.

### GET /api/practice-sessions/:id

**Response (200):**
```json
{
  "session": { "id", "domain", "topicId", "mode", "status", "startedAt", "completedAt", "totalElapsedMs" },
  "answers": { "q1": "A", "q2": "B" },
  "results": { "q1": { "isCorrect", "correctAnswer", "explanation" } }
}
```

**Validaciones:**
- Usuario autenticado y propietario de la sesión.
- Si status ≠ COMPLETED, no devolver `correctAnswer` ni `explanation`.

### PATCH /api/practice-sessions/:id/answers

**Request:**
```json
{
  "questionId": "q1",
  "selectedAnswer": "A",
  "elapsedMs": 5000,
  "clientEventId": "uuid"
}
```

**Response (200):**
```json
{ "status": "IN_PROGRESS", "savedAt": "timestamp" }
```

**Validaciones:**
- Usuario autenticado y propietario.
- Sesión no finalizada (status ≠ COMPLETED, ABANDONED).
- `clientEventId` único (idempotencia).
- Upsert en `practice_session_answers` (ON CONFLICT (session_id, question_id) DO UPDATE).

### POST /api/practice-sessions/:id/submit

**Request:**
```json
{ "clientEventId": "uuid" }
```

**Response (200):**
```json
{
  "status": "COMPLETED",
  "results": { "q1": { "isCorrect", "correctAnswer", "explanation" } },
  "score": { "correct": 5, "total": 10 }
}
```

**Validaciones:**
- Usuario autenticado y propietario.
- Sesión en estado IN_PROGRESS.
- Transacción: marcar SUBMITTED → corregir todas las respuestas → marcar COMPLETED.
- Idempotencia: si ya está COMPLETED, devolver resultados existentes.

### POST /api/practice-sessions/:id/abandon

**Request:**
```json
{ "clientEventId": "uuid" }
```

**Response (200):**
```json
{ "status": "ABANDONED" }
```

**Validaciones:**
- Usuario autenticado y propietario.
- Sesión no finalizada.

## Fase 3 — Estados y transiciones

```
CREATED → IN_PROGRESS (al guardar primera respuesta)
IN_PROGRESS → SUBMITTED (al llamar submit)
SUBMITTED → COMPLETED (tras corrección)
IN_PROGRESS → ABANDONED (abandono explícito o timeout)
SUBMITTED → ABANDONED (si no se reciben correcciones en X minutos)
```

### Reglas de transición

- Solo el servidor puede cambiar estados.
- Transiciones no válidas → 409 Conflict.
- Sesión finalizada → no se puede modificar (403).
- Sesión abandonada → no se puede modificar (403).

## Fase 4 — Idempotencia

- `clientEventId` (UUID) en cada operación.
- UNIQUE constraint en `client_event_id` por tabla.
- Si se repite una request con el mismo `clientEventId`, devolver el resultado existente (200), no error.
- No duplicar respuestas ni sesiones.

## Fase 5 — Seguridad (RLS)

- RLS por `user_id` en ambas tablas.
- Servidor valida `auth.uid()` en cada endpoint.
- No confiar en `user_id` del cliente.
- Respuestas correctas no se devuelven hasta COMPLETED.
- Puntuaciones calculadas por el servidor, no por el cliente.

## Fase 6 — Integración con cronómetro

- `started_at` en `practice_sessions` = marca temporal de inicio.
- `total_elapsed_ms` = suma de `elapsed_ms` de todas las respuestas.
- Al recargar, `started_at` se recupera del servidor; el cronómetro calcula tiempo transcurrido desde `started_at`.
- No persistir un contador arbitrario del cliente.
- Tiempo oficial = `completed_at - started_at` (servidor).

## Fase 7 — Plan TDD

### Tests unitarios (mock Supabase)

1. Validación de transiciones de estado.
2. Validación de idempotencia (clientEventId duplicado).
3. Validación de RLS (usuario B no accede a sesiones de A).
4. Validación de que respuestas correctas no se devuelven antes de COMPLETED.

### Tests de integración (Supabase local)

1. Crear sesión autenticada → CREATED.
2. Guardar respuesta → IN_PROGRESS.
3. Recuperar tras recarga → respuestas y progreso.
4. Recuperar tras cerrar y volver a entrar.
5. Cambiar respuesta permitida (IN_PROGRESS).
6. Impedir duplicados (mismo clientEventId).
7. Finalizar una sola vez (idempotencia de submit).
8. Rechazar modificaciones posteriores (COMPLETED).
9. Impedir acceso entre usuarios (usuario B → 403).
10. Recuperarse de error de red sin confirmar falsamente.
11. Actualizaciones concurrentes (dos dispositivos).
12. Consistencia de puntuación (servidor calcula).

### Tests E2E (Playwright, si disponible)

1. Flujo completo: seleccionar → responder → guardar → recargar → recuperar → finalizar → resultados.
2. Cronómetro visible y funcional.
3. Estado de guardado visible.

## Fase 8 — Archivos a modificar

### Nuevos
- `supabase/migrations/20261102000000_practice_sessions.sql`
- `app/api/practice-sessions/route.ts` (POST)
- `app/api/practice-sessions/[id]/route.ts` (GET)
- `app/api/practice-sessions/[id]/answers/route.ts` (PATCH)
- `app/api/practice-sessions/[id]/submit/route.ts` (POST)
- `app/api/practice-sessions/[id]/abandon/route.ts` (POST)
- `lib/content/practice-session-types.ts` (tipos)
- `lib/content/practice-session-repository.ts` (repositorio)

### Modificados
- `components/practice/original-practice-session.tsx` (integrar persistencia)
- `tests/psychometric-practice.test.ts` (añadir tests de persistencia)

### No modificar
- `app/api/attempts/route.ts` (se mantiene para compatibilidad)
- PRL, CEM, DR (bloqueados)

## Fase 9 — Orden de implementación (TDD)

1. Crear migración SQL (local).
2. Ejecutar migración en Supabase local.
3. Crear tipos TypeScript.
4. Crear repositorio de sesiones.
5. Crear endpoints API (POST, GET, PATCH, submit, abandon).
6. Escribir tests unitarios (mock).
7. Escribir tests de integración (Supabase local).
8. Integrar en componente `OriginalPracticeSession`.
9. Escribir tests E2E (Playwright).
10. Verificar: typecheck, lint, tests, build (sin build si no está configurado).

## Fase 10 — Riesgos

- **Pérdida de datos**: mitigado por idempotencia y confirmación del servidor.
- **Acceso cruzado**: mitigado por RLS y validación de propietario.
- **Duplicados**: mitigado por UNIQUE constraint en clientEventId.
- **Concurrencia**: mitigado por transacciones y optimistic locking.
- **Compatibilidad**: no afecta datos existentes (tablas nuevas).
- **Supabase local no disponible**: mantener NOT_VERIFIED.

## Fase 11 — Plan de reversión

1. Ejecutar rollback SQL (DROP TABLE).
2. Revertir commits de código.
3. `attempts` permanece intacto.
4. No se pierden datos de usuarios existentes.

## Checklist de aprobación

- [ ] Esquema SQL revisado y aprobado.
- [ ] Contratos API revisados y aprobados.
- [ ] Estados y transiciones aprobados.
- [ ] Plan TDD aprobado.
- [ ] Plan de reversión aprobado.
- [ ] Archivos a modificar aprobados.
- [ ] Orden de implementación aprobado.

**No implementar hasta que se apruebe este plan.**
MD
echo done