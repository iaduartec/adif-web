# Informe de reparación — Base de datos Supabase `xyjoetdnzcmgvlhzfpbw`

- **Fecha:** 2026-11-02 (UTC)
- **Ejecutor:** OpenCode (agente), vía Supabase MCP
- **Proyecto:** `xyjoetdnzcmgvlhzfpbw` (`https://xyjoetdnzcmgvlhzfpbw.supabase.co`)
- **Rama de referencia:** `codex/auditoria-adif-26` @ `451217f` (PR #20)
- **Estado del informe:** reparación aplicada y verificada; **producción todavía no impactada** (ver §7)

---

## 1. Resumen ejecutivo

La base **no estaba corrupta**. Estaba **desactualizada y sin control de versiones**: el schema `supabase_migrations` no existía, todas las migraciones históricas se habían aplicado a mano por el SQL Editor, y las 4 migraciones pendientes del PR #20 nunca se habían ejecutado.

| Hallazgo | Antes | Después |
|---|---|---|
| Ledger `supabase_migrations.schema_migrations` | **no existía** | 10/10 migraciones del repo |
| Preguntas `orig-*` | 0 | 160 (158 activas + 2 tombstones) |
| Preguntas oficiales activas | 102 | **0** (gate de publicación) |
| `private.official_simulation_allowlist` | no existía | 8 formas |
| Trigger `question_attempts_original_practice_mode` | no existía | activo |
| Elegibles para práctica (`active_learning_questions`) | 102 oficiales | 158 originales |

**Conclusión:** el esquema quedó coherente con el repo y con el PR #20, y el ledger quedó alineado para futuros `supabase db push`. **Pero la app de producción sigue apuntando a un proyecto inexistente** (`oowbjbyqtevfwdnxrwkb` → NXDOMAIN), así que el usuario final todavía no ve nada de esto.

---

## 2. Método

1. Introspección read-only del proyecto vía MCP (`execute_sql`, `get_advisors`, `get_publishable_keys`).
2. Descarga de los 4 archivos de migración del PR y **verificación SHA-256** contra `git show origin/codex/auditoria-adif-26:...` antes de ejecutar.

   | Migración | SHA-256 (12) | Match |
   |---|---|---|
   | `202610150002_official_question_publication_gate.sql` | `0fea1388ab32` | ✅ |
   | `202610150003_official_question_registry.sql` | `bcf64c539a6d` | ✅ |
   | `202610150004_original_practice_registry.sql` | `1d7b287e366f` | ✅ |
   | `20261102084809_fix_ict_original_registry.sql` | `3fb427434893` | ✅ |

3. Backup de las tablas privadas antes de tocar nada.
4. Aplicación en orden de dependencias.
5. Normalización del ledger.
6. Verificación estructural + prueba funcional end-to-end en transacción con `ROLLBACK`.

**No se modificó ninguna fila de datos de usuario.** `question_attempts`, `simulation_attempts`, `review_events`, `profiles` y `concept_mastery` siguen en 0 filas después de toda la operación.

---

## 3. Estado inicial (evidencia)

```
private.learning_questions        102 filas — TODAS activas (solo oficiales)
private.learning_questions orig-* 0 filas
private.learning_concepts         172 filas
private.official_simulation_allowlist  NO EXISTE
trigger question_attempts_original_practice_mode  NO EXISTE
supabase_migrations.schema_migrations  NO EXISTE
public.question_attempts          0 filas
auth.users                        2 usuarios
```

Interpretación: `202610150004` **nunca** había corrido en este proyecto, por lo tanto **no hizo falta migración correctiva**. La versión regenerada del registro (con los `-v2` ya incorporados) entró limpia y en orden. Esto invalida la hipótesis previa del preflight de PR #20, que asumía una `004` ya aplicada con datos erróneos.

---

## 4. Cambios aplicados

### 4.1 Backup previo

```sql
-- schema aislado, sin acceso a roles de API
preflight_backup.learning_questions_20261102  → 102 filas
preflight_backup.learning_concepts_20261102   → 172 filas
```

Se ejecutó `revoke all` sobre el schema y las tablas para `public`, `anon` y `authenticated`.

### 4.2 Migraciones

| # | Versión | Migración | Efecto |
|---|---|---|---|
| 1 | `202610150002` | `official_question_publication_gate` | desactiva las 102 claves oficiales sin derechos verificados |
| 2 | `202610150003` | `official_question_registry` | crea `official_simulation_allowlist` (8 formas) + trigger de validación de simulacros |
| 3 | `202610150004` | `original_practice_registry` | inserta 158 originales + 33 conceptos nuevos + trigger de modo original |
| 4 | `20261102084809` | `fix_ict_original_registry` | tombstones `orig-tel-ict-006/017`, activa `-v2`, preserva historial |

### 4.3 Normalización del ledger

**Gotcha crítico:** `apply_migration` del MCP registra la **versión del momento de ejecución** (`20261102100235`, `…239`, `…245`, `…250`), **no** la versión del archivo. Si se dejaba así, un `supabase db push` posterior habría intentado reaplicar las 4 migraciones (el CLI compara versiones, no checksums).

Se renombraron las 4 filas a sus versiones reales y se insertó baseline de las 6 migraciones anteriores (esquema base):

```
202608020001  study_schema
202608100002  atomic_simulation_submission
202608110003  adaptive_learning_core
202608110004  atomic_review_persistence
202608110005  daily_plan_actions_rpc
202608200001  estatuto_adif_expanded
```

Ledger final: **10 filas = 10 migraciones del repo**, sin faltantes ni sobrantes.

> Nota: el baseline se marcó `created_by = 'baseline'` y con `statements = '{}'` porque esas migraciones se aplicaron originalmente por SQL Editor y no hay registro de su contenido exacto. Es una **declaración de estado**, no una re-ejecución.

---

## 5. Verificación

### 5.1 Estructural (base real)

| Check | Resultado |
|---|---|
| Originales activas | **158** |
| Elegibles vía `private.active_learning_questions` | **158** |
| Por materia | general 58 · telecom 52 · english-a2 22 · psicométrico 26 |
| Total `orig-*` | 160 (158 activas + 2 tombstones) |
| Duplicados de `question_id` | 0 |
| Activas con concepto huérfano o inactivo | 0 |
| `private.learning_concepts` | 205 (172 + 33) |
| Allowlist de simulacros | 8 formas, incluye `ADIF-2025-1131:18` |
| Trigger `question_attempts_original_practice_mode` | existe |
| `record_practice_attempt` — `authenticated` | `EXECUTE = true` |
| `record_practice_attempt` — `anon` | `EXECUTE = false` |
| RLS en `learning_questions` / `learning_concepts` | habilitado |

Tombstones y reemplazos:

| question_id | active | correct_answer |
|---|---|---|
| `orig-tel-ict-006` | `false` | B |
| `orig-tel-ict-017` | `false` | A |
| `orig-tel-ict-006-v2` | `true` | **B** |
| `orig-tel-ict-017-v2` | `true` | **A** |

### 5.2 Funcional (transacción con `ROLLBACK`, sin persistencia)

| Caso | Resultado |
|---|---|
| `orig-tel-ict-006-v2` respuesta `B` | ✅ `is_correct: true` |
| `orig-tel-ict-006` (tombstone) | ❌ `The active question does not exist.` |
| `-v2` con `mode = simulation` | ❌ `Original practice questions cannot be submitted in simulation mode.` |
| `ADIF-2025-1131-Q01` (oficial, gated) | ❌ `The active question does not exist.` |
| Sin `request.jwt.claim.sub` | ❌ `Authentication is required to submit practice.` |

`question_attempts` permaneció en **0 filas** tras la prueba: no quedó basura de test en la base.

### 5.3 Advisors

- `rls_enabled_no_policy` en tablas de `private` — esperado: esas tablas no se exponen por PostgREST y el acceso es solo por RPC/`service_role`.
- `rls_auto_enable` ejecutable por `anon` — artefacto del proyecto Supabase, no introducido por estas migraciones.
- Sin hallazgos nuevos atribuibles a los cambios aplicados.

---

## 6. Efecto colateral (importante)

Aplicar `202610150002` **desactiva las 102 preguntas oficiales**: hoy `official_active = 0`.

No es un bug, es la política declarada en `docs/CURRENT_STATE.md` del PR #20: las transcripciones históricas no tienen derechos de reproducción ni hashes de PDF verificados, así que se bloquean hasta una migración forward con aprobación explícita.

Consecuencias concretas:

- **Simulacros oficiales bloqueados** por el trigger de allowlist (la allowlist existe, pero no hay preguntas activas que las satisfagan).
- **Práctica de preguntas oficiales devuelve 503** en `app/api/attempts/route.ts`.
- Antes de esta reparación, esos 102 registros estaban activos y funcionaban.

Esto **no es reversible "porque sí"**: reactivarlas requiere una migración nueva + la decisión de derechos. No se tomó esa decisión de forma unilateral.

---

## 7. Riesgo abierto: producción sigue apuntando a una base muerta

| Elemento | Estado |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` en Vercel (Production) | `https://oowbjbyqtevfwdnxrwkb.supabase.co` |
| Resolución DNS de `oowbj...` | ❌ `ENOTFOUND` |
| Proyecto `xyjoet...` (el reparado) | ✅ vivo, `/auth/v1/health` → 401 (requiere apikey) |
| Recurso Supabase `adif-web` en la integración Vercel | **Suspended**, Free Plan |

**Conclusión:** hasta que no se repunten las variables de entorno y se redeploye, la reparación **no llega al usuario**. Los logs de producción ya mostraban `AuthRetryableFetchError: fetch failed`.

Datos para el repunte (verificados):

- URL: `https://xyjoetdnzcmgvlhzfpbw.supabase.co`
- Publishable key: `sb_publishable_UTRPOn3zcAPVg7BW8EukNg_0_s3IsSa`
- Anon legacy key: disponible vía `get_publishable_keys` (no se transcribe acá)

---

## 8. Deuda y pendientes

| # | Pendiente | Prioridad | Nota |
|---|---|---|---|
| 1 | Repuntar env vars de Vercel a `xyjoet` y redeployar | **Alta** | requiere OK explícito, toca config de deploy |
| 2 | Borrar `preflight_backup` cuando se valide | Media | `drop schema preflight_backup cascade;` |
| 3 | Actualizar `CURRENT_STATE.md` / `IMPLEMENTATION_EVIDENCE.md` | Media | hoy dicen "no se aplicó a producción"; ya no es cierto (viven en el PR #20, no en `main`) |
| 4 | Decidir política de derechos de preguntas oficiales | Media | bloquea simulacros oficiales |
| 5 | **No hay backups gestionados** | **Alta** | Free Plan sin PITR; el único respaldo es `preflight_backup` |
| 6 | PR #20 sin review ni branch protection | Media | `MERGEABLE`/`CLEAN`, head `451217f`, 0 reviews |
| 7 | Cambios sin commitear en el repo | Baja | `skills-lock.json` modificado + `.agents/skills/supabase-postgres-best-practices/` sin trackear |

### Sobre el punto 5

El proyecto está en **Free Plan**: sin backups automáticos, sin PITR. La reparación de hoy se hizo **sin un dump completo previo** (solo se copiaron las dos tablas privadas que se iban a tocar). Si se va a usar esta base para datos reales, el backup tiene que resolverse **antes**, no después.

### Rollback disponible

- Esquema/datos privados: `preflight_backup` (102 preguntas, 172 conceptos).
- Migraciones: la `202610150002` se revierte reactivando las oficiales con una migración forward; el resto es aditivo y no destruye filas.
- Ledger: si se necesita volver al estado previo, se eliminan las 10 filas (no había ledger antes).

---

## 9. Decisiones requeridas

1. **¿Se repuntan las env vars de Vercel a `xyjoet` y se redeploya?** Es el único paso que hace visible la reparación.
2. **¿Qué variables se actualizan?** ¿Solo las `NEXT_PUBLIC_*` que usa el código, o las 6 `SUPABASE_*` / `POSTGRES_*`?
3. **¿Se reactivan las preguntas oficiales?** Requiere decisión de derechos + migración forward.
4. **¿Se commitea o se revierte** la instalación del skill `supabase-postgres-best-practices`?

---

## Anexo A — Ledger final

| Version | Name | created_by |
|---|---|---|
| `202608020001` | `study_schema` | baseline |
| `202608100002` | `atomic_simulation_submission` | baseline |
| `202608110003` | `adaptive_learning_core` | baseline |
| `202608110004` | `atomic_review_persistence` | baseline |
| `202608110005` | `daily_plan_actions_rpc` | baseline |
| `202608200001` | `estatuto_adif_expanded` | baseline |
| `202610150002` | `official_question_publication_gate` | sgb.villafranca@gmail.com |
| `202610150003` | `official_question_registry` | sgb.villafranca@gmail.com |
| `202610150004` | `original_practice_registry` | sgb.villafranca@gmail.com |
| `20261102084809` | `fix_ict_original_registry` | sgb.villafranca@gmail.com |

## Anexo B — Archivos de referencia

| Archivo | Rol |
|---|---|
| `supabase/migrations/202610150002_official_question_publication_gate.sql` | gate de publicación oficial |
| `supabase/migrations/202610150003_official_question_registry.sql` | allowlist + trigger de simulacros |
| `supabase/migrations/202610150004_original_practice_registry.sql` | registro de 158 originales |
| `supabase/migrations/20261102084809_fix_ict_original_registry.sql` | tombstones + `-v2` |
| `supabase/migrations/202608110004_atomic_review_persistence.sql` | RPC `record_practice_attempt` |
| `supabase/tests/original_practice_registry.sql` | aserciones de estructura |
| `supabase/tests/ict_original_registry.sql` | aserciones de tombstones/`-v2` |
| `app/api/attempts/route.ts` | manejo de `orig-*` y errores |
