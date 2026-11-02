# ADIF 360 — Diseño de persistencia de sesiones de estudio

Fecha: 2026-11-02. Rama: `codex/auditoria-adif-26`.

## 1. Arquitectura existente

### Tablas Supabase existentes
- `attempts` (o similar): almacena intentos individuales por pregunta.
- `practice_sessions`: no existe todavía.
- `user_progress`: no existe todavía.

### API existente
- `POST /api/attempts`: recibe `{ questionId, selectedAnswer, mode, elapsedMs, clientEventId }`. Devuelve `{ isCorrect, correctAnswer, explanation }`.
- Autenticación via Supabase Auth (cookie-based).

### RLS existente
- Las tablas de attempts probablemente tienen RLS por `user_id`.

## 2. Modelo de datos propuesto

### Tabla: `practice_sessions`

```sql
CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  domain TEXT NOT NULL, -- 'psychometric', 'english', 'telecom', etc.
  topic_id TEXT, -- 'all' or specific topic
  mode TEXT NOT NULL CHECK (mode IN ('training', 'practice')),
  question_count INTEGER NOT NULL,
  question_ids TEXT[] NOT NULL, -- IDs de preguntas originales
  status TEXT NOT NULL DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'ABANDONED')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  total_elapsed_ms INTEGER DEFAULT 0,
  client_event_id UUID NOT NULL, -- idempotency key
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own sessions"
  ON practice_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_practice_sessions_user ON practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_status ON practice_sessions(status);
CREATE UNIQUE INDEX idx_practice_sessions_client_event ON practice_sessions(client_event_id);
-- Composite unique for FK from answers (P0: ownership integrity)
ALTER TABLE practice_sessions ADD CONSTRAINT uq_practice_sessions_id_user UNIQUE (id, user_id);
```

### Tabla: `practice_session_answers` (normalizada)

```sql
CREATE TABLE practice_session_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  question_id TEXT NOT NULL,
  selected_answer TEXT NOT NULL CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
  elapsed_ms INTEGER,
  client_event_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Composite FK: ensures session_id and user_id belong together (P0)
  FOREIGN KEY (session_id, user_id) REFERENCES practice_sessions(id, user_id) ON DELETE CASCADE,
  UNIQUE(session_id, question_id) -- idempotencia por pregunta
);

-- RLS
ALTER TABLE practice_session_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own answers"
  ON practice_session_answers FOR ALL
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_session_answers_session ON practice_session_answers(session_id);
CREATE INDEX idx_session_answers_user ON practice_session_answers(user_id);
CREATE UNIQUE INDEX idx_session_answers_client_event ON practice_session_answers(client_event_id);
```

### Tabla: `attempts` (existente, posiblemente)

```sql
-- Ya existe, se reutiliza
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  question_id TEXT NOT NULL,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  mode TEXT NOT NULL,
  elapsed_ms INTEGER,
  client_event_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 3. Estados del ciclo de vida

```
CREATED → IN_PROGRESS → SUBMITTED → COMPLETED
                      → ABANDONED
```

- **CREATED**: sesión creada, sin respuestas.
- **IN_PROGRESS**: al menos una respuesta guardada.
- **SUBMITTED**: todas las respuestas enviadas, pendiente de corrección.
- **COMPLETED**: corrección recibida, resultados disponibles.
- **ABANDONED**: sesión abandonada (timeout o cierre sin completar).

### Transiciones válidas
- CREATED → IN_PROGRESS: al guardar la primera respuesta.
- IN_PROGRESS → SUBMITTED: al llamar a `finish()`.
- SUBMITTED → COMPLETED: al recibir todas las correcciones.
- IN_PROGRESS → ABANDONED: timeout o abandono explícito.
- SUBMITTED → ABANDONED: si no se reciben correcciones en X minutos.

## 4. Contratos API propuestos

### POST /api/practice-sessions
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
Response: `{ sessionId: "uuid", status: "CREATED" }`

### PATCH /api/practice-sessions/:id
```json
{
  "answers": { "q1": "A", "q2": "B" },
  "clientEventId": "uuid"
}
```
Response: `{ status: "IN_PROGRESS", savedAt: "timestamp" }`

### POST /api/practice-sessions/:id/submit
```json
{
  "clientEventId": "uuid"
}
```
Response: `{ status: "SUBMITTED", results: { ... } }`

### GET /api/practice-sessions/:id
Response: `{ session: { ... }, answers: { ... }, results: { ... } }`

## 5. Seguridad (RLS)

- Todas las operaciones requieren `auth.uid()`.
- RLS por `user_id` en todas las tablas.
- Validación de propietario en cada endpoint.
- Idempotencia via `clientEventId` (UNIQUE constraint).
- Prevención de acceso cruzado: usuario B no puede acceder a sesiones de usuario A.
- Protección de soluciones: las respuestas correctas no se devuelven hasta que la sesión esté COMPLETED.

## 6. Plan TDD

### Tests de integración (Supabase local)
1. Usuario A inicia sesión → CREATED.
2. Guarda respuestas → IN_PROGRESS.
3. Recarga → recupera respuestas y progreso.
4. Finaliza → SUBMITTED → COMPLETED.
5. Consulta resultados → resultados correctos.
6. Usuario B intenta acceder a sesión A → 403.
7. Repetir solicitud con mismo clientEventId → idempotente, no duplica.
8. Interrupción de red → no falsa confirmación.
9. Sesión abandonada → ABANDONED.
10. Sesión expirada → denegación.

### Tests unitarios (mock)
- Validación de transiciones de estado.
- Validación de idempotencia.
- Validación de RLS.

## 7. Plan de migración (local, reversible)

1. Crear tabla `practice_sessions` en Supabase local.
2. Crear índices y constraints.
3. Aplicar RLS.
4. Verificar con tests de integración.
5. Si falla, rollback (DROP TABLE).

No aplicar a producción sin aprobación.

## 8. Riesgos

- **Pérdida de datos**: mitigado por idempotencia y validación de transiciones.
- **Acceso cruzado**: mitigado por RLS y validación de propietario.
- **Duplicados**: mitigado por UNIQUE constraint en clientEventId.
- **Concurrencia**: mitigado por transacciones y optimistic locking.
- **Compatibilidad**: no afecta datos existentes (tabla nueva).

## 8.5. Protección de soluciones (P0)

**La tabla `practice_session_answers` NO almacena:**
- `correct_answer`
- `is_correct`
- `explanation`

**Las claves correctas y explicaciones se resuelven exclusivamente en el servidor** a partir del banco autorizado de preguntas (`original-practice-repository`).

**El servidor revela la corrección según:**
- Modalidad (training: inmediata; practice: tras finalización).
- Estado de la sesión (COMPLETED: todas las correcciones; IN_PROGRESS: solo training).

**Verificación de no filtración:**
- RLS impide lectura directa de soluciones (no existen en la tabla).
- Endpoints API filtran campos según estado/modalidad.
- Vistas y RPC no exponen claves.
- Consultas directas a Supabase no revelan soluciones (no están almacenadas).

## 9. Decisiones aprobadas

1. **Crear tabla `practice_sessions`** — NO reutilizar `attempts`. Las sesiones son entidades independientes.
2. **Respuestas normalizadas** en `practice_session_answers` — integridad referencial, no JSONB.
3. **Sin fallback offline** — sin localStorage. Estado visible de guardado, confirmación solo tras respuesta del servidor, reintentos controlados.
4. **Sin migración de intentos históricos** — estructuras nuevas aditivas, no se modifican intentos existentes.
5. **Compatibilidad** — `attempts` se mantiene para resultados existentes; `practice_sessions` es aditiva.

## 10. Diagrama de flujo

```
[Usuario] → [Seleccionar modo/tema] → [POST /api/practice-sessions] → [CREATED]
    ↓
[Responder pregunta] → [PATCH /api/practice-sessions/:id] → [IN_PROGRESS]
    ↓
[Recargar página] → [GET /api/practice-sessions/:id] → [Recuperar respuestas]
    ↓
[Finalizar] → [POST /api/practice-sessions/:id/submit] → [SUBMITTED → COMPLETED]
    ↓
[Ver resultados] → [GET /api/practice-sessions/:id] → [Resultados + explicaciones]
```
