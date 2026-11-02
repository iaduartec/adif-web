# Circuito de preguntas originales — evidencia y límites

Fecha: 2 de noviembre de 2026. Base `09f7b9c`; cambios locales en `codex/auditoria-adif-26`. No se ha desplegado ni aplicado ninguna migración a una base real.

## Continuación: progreso y revisión ICT

Se añade una tabla de estadísticas para intentos originales registrados, por materia: aciertos sobre número de intentos, preguntas distintas respecto al banco revisado, tiempo registrado y última práctica. No incorpora borradores ni preguntas desconocidas; se mantiene separada de la cobertura de exámenes oficiales y no estima probabilidad de aprobar.

En esta continuación pasaron 82 archivos y 645 pruebas Vitest. El recorrido Playwright de cuatro pruebas volvió a pasar en escritorio y móvil con cliente simulado, e incluye la nueva vista de estadísticas. En móvil las cifras se presentan en tarjetas. Una primera captura de página completa en móvil cerró Chromium; se repitió satisfactoriamente con una captura de la zona visible. Estas pruebas no verifican una sesión real de usuario ni la recuperación del bloque pendiente.

La revisión ICT y el detalle de las dos versiones sustituidas constan en [STUDY_CONTENT_AUDIT.md](STUDY_CONTENT_AUDIT.md). La migración local `20261102084809_fix_ict_original_registry.sql` desactiva los IDs antiguos y habilita los nuevos cuando los conceptos siguen activos; conserva los intentos históricos. Se probaron todas las migraciones en PostgreSQL aislado con `auth.uid()` sintético y `supabase/tests/ict_original_registry.sql`; no es una prueba de Supabase completo. La migración `202610150004_original_practice_registry.sql` es una instantánea histórica inmutable: el registro actual requiere aplicar también la migración posterior, y el exportador actual ya no debe compararse byte por byte con aquella instantánea.

La persistencia de bloques y el bloqueo de correcciones anticipadas siguen pendientes. Se ha redactado el [diseño propuesto](superpowers/specs/2026-11-02-practica-recuperable-design.md), sujeto a aprobación, sin implementar sus tablas ni operaciones.

Estado de los criterios de esta continuación: `PRACTICE_RECOVERY = PARTIAL`, `GROUP_CORRECTION = PARTIAL`, `ATTEMPT_PERSISTENCE = PARTIAL`, `USER_ISOLATION = PARTIAL`, `ACADEMIC_REVIEW = INSUFFICIENT`, `MOBILE_E2E = PARTIAL` y `PRODUCTION_READINESS = BLOCKED`. La práctica en bloque sigue sin guardar borradores ni aplicar el bloqueo de corrección en servidor; los 4 recorridos E2E usan un cliente simulado, no un servicio Supabase completo.

## Funcionalidad

- En inglés, psicotécnicos y módulos de conocimientos generales y telecomunicaciones se seleccionan tema, cantidad y modo. Entrenamiento corrige tras cada envío; práctica permite modificar las elecciones antes de entregar y muestra correcciones cuando el bloque termina de guardarse.
- El servidor autentica y usa el RPC de intentos existente, con claves privadas y reintentos identificados por UUID. La explicación se devuelve después de registrar. El cuaderno permite volver a practicar los originales cuyo último intento guardado fue incorrecto.
- El inventario revisado contiene 58 preguntas generales, 52 de telecomunicaciones, 22 de inglés y 26 psicotécnicas. Cuatro preguntas generales son borradores excluidos. Las etiquetas editoriales no certifican corrección académica individual.
- Se ha corregido una recomendación psicométrica que afirmaba una penalización y una estrategia óptima sin contraste de las reglas aplicables.

## Evidencia

- Las pruebas Playwright `e2e/original-practice.spec.ts` pasaron en escritorio y móvil: 4 pruebas con `PLAYWRIGHT_TEST=true` y el cliente simulado. Incluyen las cuatro materias, cambio antes de entrega, corrección y recuperación de un fallo guardado tras recargar el cuaderno. Las capturas están en `test-results/`. No prueban login, Supabase ni RLS reales.
- PostgreSQL 16 aislado en contenedor sin red ni almacenamiento persistente: migraciones completas sobre base nueva, prueba del registro de originales y prueba de dos usuarios sintéticos `supabase/tests/original_practice_isolation.sql`. El `auth.uid()` del ensayo es una función sintética; esto prueba SQL/RLS en PostgreSQL, no autenticación de Supabase ni configuración remota.
- `supabase/tests/original_practice_registry.sql` comprueba conceptos activos, secreto del registro, rechazo del uso de simulación para originales y conservación tanto de conceptos como de preguntas retiradas. La revisión adversarial detectó esos casos y un desajuste de respuestas tras un envío parcial; este último tiene prueba de regresión y el bloque se bloquea durante el reintento.
- Suite final: `pnpm test --reporter=dot`, 80 archivos y 641 pruebas; `pnpm typecheck`, `pnpm verify:content` y `PLAYWRIGHT_TEST=true pnpm build` pasaron. `pnpm lint` terminó sin errores y con dos avisos de navegación preexistentes. Una ejecución anterior en paralelo con build agotó el tiempo de una prueba de configuración; la prueba aislada y la suite completa posterior sin build concurrente pasaron. Esto no demuestra la causa del timeout.

## Estado por criterio

| Criterio | Resultado | Motivo |
|---|---|---|
| PRACTICE_FLOW | PARTIAL | Circuito probado con mock; falta recuperación de sesión y pruebas de login real. |
| ORIGINAL_QUESTIONS | PARTIAL | 158 registros revisados visibles; calidad académica integral sin verificar y despliegue no actualizado. |
| ATTEMPT_PERSISTENCE | PARTIAL | RPC y RLS probados en PostgreSQL aislado con identidades simuladas, no en Supabase completo. |
| USER_ISOLATION | PARTIAL | Aislamiento SQL de dos identidades comprobado; falta auth y acceso integrado Supabase. |
| ACADEMIC_CONTENT | INSUFFICIENT | Nueve documentos con cobertura parcial o sin trazabilidad; muestra de seis preguntas contrastada. |
| EXAM_RULES | PARTIAL | Fecha prevista y alcance en ADIF; puntuación y condiciones definitivas pendientes. |
| MOBILE_E2E | PARTIAL | Playwright móvil con mock, sin login ni reanudación real. |
| PRODUCTION_READINESS | BLOCKED | Migración remota no aplicada, Supabase completo y recorrido real no verificados. |

## Límites pendientes

1. El bloque abierto y sus identificadores de reintento no se conservan al recargar o navegar fuera. Se advierte en pantalla y se pide confirmación del navegador cuando procede; los intentos ya confirmados sí quedan en el historial. Falta recuperación de sesión en curso y prueba de conexión interrumpida de extremo a extremo.
2. La entrega de bloque usa el endpoint individual de entrenamiento; no existe una sesión de servidor que impida solicitar corrección anticipada mediante llamadas directas. No se debe tratar como simulacro seguro u oficial.
3. Supabase local completo, autenticación real, RLS en ese entorno y despliegue siguen sin verificar; producción permanece bloqueada. No se deben aplicar migraciones remotas sin autorización y comprobaciones específicas.
4. La revisión normativa de todos los conceptos y respuestas, los mínimos y las reglas definitivas de 2026 siguen pendientes. El [inventario académico](STUDY_CONTENT_AUDIT.md) describe las lagunas; no constituye certificación de temario.
5. Los psicotécnicos originales son un banco limitado y no hay un modo de velocidad o simulacro oficial validado. Las estadísticas y planificación adaptativa para todos los tipos de preguntas aún necesitan revisión integral.
