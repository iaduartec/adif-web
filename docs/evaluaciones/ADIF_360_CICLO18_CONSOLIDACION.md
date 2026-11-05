# ADIF 360 — Ciclo 18 · Consolidación e integridad

## Estado y alcance

Reconciliación local sobre `main`, HEAD `9efd1abbe92a9e04aaa61089c265c2794ff4d581`. Antes de este ciclo había 55 archivos modificados y 48 archivos sin seguimiento enumerados individualmente (34 entradas al agrupar directorios). No hay cambios preparados en el índice. Los worktrees existentes son el principal, `docs/pni26-01-26-12po-spec`, `codex/auditoria-adif-26` y `codex/recuperacion-persistencia`; dos worktrees temporales figuran como podables porque su ruta ya no existe. No se han podado. Bridge no mostraba tareas activas; sus cuatro scripts tienen cambios previos de modo 100755 a 100644 y funcionan invocados con `bash`.

La lista completa al inicio consta al final. La atribución por ciclo solo es segura cuando la indican informes, nombres o Bridge: hay cambios compartidos de varios ciclos en los mismos archivos. Ciclos 15–17 aportan informes y componentes de simulacros; bancos, teoría, fuentes y pruebas incluyen trabajos académicos anteriores. `original-simulation-recovery-proposal` es el prototipo aislado del ciclo 16; el módulo sin `proposal` es el activo del ciclo 17. Las baterías reservadas y sus claves son evidencia académica, no material de entrenamiento. El borrador de declaración de red y CEM conserva su estado pendiente. No se ha atribuido cada hunk sin evidencia ni se ha declarado todo terminado.

Clasificación para integración: (1) contenido y validadores académicos con sus tests y fuentes, por materia y ciclo, requieren revisión de diferencias y trazabilidad; (2) práctica y simulacros originales con acciones, DTO, tests y E2E forman una unidad dependiente; (3) recuperación y sus tests dependen de esa unidad; (4) informes y baterías reservadas son evidencia a conservar y revisar antes de publicar; (5) configuración de fixtures, tests de seguridad, AGENTS y modos de scripts precisan revisión independiente; (6) `next-env.d.ts` es generado por Next y su diferencia requiere comprobarse al integrar; (7) `.workbuddy-ai/memory/2026-11-03.md` es archivo de trabajo de procedencia externa, no asumir que deba integrarse. `content/claim-review-manifest.json` contiene una eliminación amplia previa que requiere revisión específica junto a su evidencia. Los 730 tests no prueban individualmente la calidad o procedencia de cada archivo.

Ignorados relevantes observados por nombre: `.env.local`, `.vercel`, `.agents/state`, `.next`, `node_modules`, `test-results`, worktrees y `tsconfig.tsbuildinfo`. Pueden contener credenciales o datos locales; no se inspeccionó ni copió su contenido. La comprobación de nombres de archivos sin seguimiento no encontró extensiones habituales de claves ni `.env`, lo que no equivale a una auditoría de secretos. No se borró ni restauró nada. Tampoco se crearon commits: los archivos mezclan ciclos y hay cambios de otras herramientas cuya autoría y límites no se pueden separar con seguridad sin revisión de hunks; un commit parcial de archivos compartidos puede romper dependencias. Secuencia propuesta tras esa revisión: fuentes y teoría por materia; bancos y validadores; práctica y simulacros con sus pruebas; recuperación local con sus pruebas; informes y evidencia reservada según política; configuración de fixtures por separado. Usar selección interactiva de hunks y verificar cada commit, sin incluir secretos ni artefactos por defecto.

## Recuperación e integridad

El ámbito de clave de `sessionStorage` deriva del usuario autenticado, modalidad y versión. Un borrador de otra clave no se recupera; el hash es un espacio de nombres, no una barrera de seguridad frente a quien controla el navegador. Al cerrar sesión no se borra proactivamente el borrador anterior; permanece en esa pestaña hasta limpieza o expiración de 24 horas. No se ha probado un cambio real de cuenta ni el cierre de sesión E2E, porque el fixture usa una sola identidad. El navegador puede restaurar sesiones después de cerrarse: no se promete conservar ni borrar al cerrar. Se valida orden, unicidad, respuestas, huellas y disponibilidad del banco; corrupción, versiones y ausencias se rechazan. Deadline absoluto se recalcula en recarga y visibilidad. Almacenamiento inaccesible degrada con aviso. Antes de entregar no se guardan claves o explicaciones; después se guardan correcciones editables para revisión. No son notas certificadas.

El cálculo local usa aciertos / preguntas presentadas, incluidos blancos en el denominador, y desglosa por materia. Se corrigió el texto que decía «sobre el banco» cuando el alumno puede elegir una muestra. La Action calcula correcciones con las claves revisadas y comprueba coincidencia con RPC; envía solo respuestas seleccionadas, con eventos estables, a `record_practice_attempt` en modo práctica. Blancos y cabecera de examen no se registran por esta ruta. Reintentos idénticos reutilizan eventos; una respuesta parcial puede permanecer si falla una RPC posterior. La pantalla bloquea doble clic en la misma instancia y congela el envío; el código de base de datos local contempla deduplicación por usuario y evento con huella, pero no se ha verificado aplicación ni ejecución remota. No hay garantía de unicidad o atomicidad del simulacro completo.

## Pestañas y corrección aplicada

E2E Chromium abrió un popup del mismo origen, que copió el borrador, cambió la respuesta y entregó primero la pestaña original y después la copia. Se observaron una Server Action en cada pestaña; la primera mostró resultado y la segunda mostró error de confirmación por conflicto en el almacén simulado. La prueba demuestra ese caso, no cubre todos los intercalados ni efectos en base real. El test de otro ámbito cambia la clave local y comprueba que no se recupera; no suplanta un cambio real de identidad.

Se añadió un aviso visible para evitar duplicar la pestaña y se corrigió el denominador descrito del porcentaje. La revisión independiente identificó además que, tras un conflicto permanente, la copia mantiene el envío congelado y el reintento conserva la misma carga conflictiva; actualmente no ofrece una salida visible para abandonarla. Una recarga puede volver a intentar esa carga. No se ha implantado exclusión entre pestañas: Web Locks podría prevenir algunos conflictos en navegadores compatibles, pero requiere diseño de liberación, caída de pestaña, recarga, ausencia de API y transferencia; no resolvería escrituras parciales ni garantizaría unicidad entre dispositivos. Concurrencia local: **riesgo reproducido y abierto**. Doble clic y vencimiento se protegen en memoria y se ejercitan en pruebas existentes; una respuesta tardía de red y todas las carreras posibles no están demostradas exhaustivamente.

## Propuesta de historial real — diseño pendiente de autorización

El código local ya contiene `question_attempts` para eventos por pregunta; `simulation_attempts` y `simulation_answers` para simulacros existentes; `practice_sessions`, `practice_session_answers` y `practice_session_events` para sesiones de práctica. La RPC de simulación existente guarda un agregado con respuestas; las sesiones actuales admiten modos training/practice, no el contrato de simulacros originales. Investigar primero si se pueden extender estas estructuras sin mezclar las reglas o duplicar evidencia; no inferir una sesión agrupando eventos de pregunta. El estado de migraciones y datos remotos es desconocido.

Contrato propuesto: UUID único de intento y usuario obtenido de sesión verificada; tipo y modalidad; versión inmutable del banco y selección ordenada de IDs con versión o instantánea suficiente para revisión histórica; respuestas seleccionadas y blancos explícitos; inicio, deadline, finalización, estado (en curso, entregado, abandonado), tiempos orientativos y política de puntuación; resultado calculado por servidor y clave de idempotencia con huella de la solicitud. La creación, guardado y entrega deben validar dueño, elegibilidad, opciones y versión. Para una entrega, una transacción bloquea la sesión, comprueba estado y versión, guarda todas las respuestas y calcula resultados con claves protegidas; repetición idéntica devuelve el resultado previo, solicitud divergente recibe conflicto. El resultado y la evidencia por pregunta han de relacionarse para impedir doble contabilización. La sincronización entre dispositivos necesita versión de revisión o comparación optimista y resolver conflictos sin sobrescribir silenciosamente. Las sesiones en curso no deben exponer claves.

Seguridad propuesta: RLS por usuario en todas las lecturas, operaciones de escritura mediante funciones con comprobaciones explícitas de identidad y propiedad, claves privadas fuera de DTO público, mínima información y eventos auditables; índices únicos por usuario/intento/evento y pruebas de carreras verdaderas contra una base aislada. Definir retención por estado, acceso/exportación, eliminación en cascada y comportamiento al borrar cuenta; no fijar plazos sin decisión. Historial paginado debe diferenciar práctica, simulacros originales y oficiales, permitir evolución por materia y repaso histórico manteniendo versión y atribución. No mezclar resultados locales editables con registros confirmados ni calcular dos veces `/api/attempts` y RPC. Antes de implementar hacen falta autorización de alcance y política de conservación, elección de reutilización de tablas, tratamiento de versiones históricas, estrategia de migración y prueba de RLS/concurrencia en entorno autorizado.

## Verificación

`pnpm typecheck`, `pnpm verify:content` y `pnpm test` ejecutados en este ciclo: PASS, 100 archivos y 730 tests. Focalizados de resultados, recuperación, Action y seguridad de fixture: 25/25 PASS. La prueba de cambio de texto falló antes del arreglo y pasó después. E2E de simulacros, recuperación, práctica, gates, dos pestañas y ámbito: 16/16 PASS tras el ajuste. El gate comprueba los 102 enunciados retenidos y ocho formularios pendientes. `git diff --check` PASS. Todos los recorridos usan cuenta y almacén mock locales.

Estados: integridad funcional local **PASS con límites de concurrencia**; concurrencia local **riesgo reproducido, no resuelto**; idempotencia de servidor **no verificada en servidor real**; persistencia real **no verificada**; seguridad de datos **parcial, sin evaluación de RLS en base real**. La recuperación local no sincroniza dispositivos ni acredita resultados. La siguiente prioridad es acordar el contrato y conservación de historial y verificar atomicidad en un entorno aislado autorizado.

## Inventario Git al inicio

`M` es modificado y `??` es archivo sin seguimiento. Este listado conserva la vista individual inicial; los archivos Ciclo 18 se describen arriba.

```text
 M .agents/scripts/agy-project
 M .agents/scripts/bridge
 M .agents/scripts/doctor
 M .agents/scripts/status
 M AGENTS.md
 M app/(dashboard)/simulacros/page.tsx
 M app/(dashboard)/tests/page.tsx
 M components/practice/favorite-button.tsx
 M components/practice/original-practice-session.tsx
 M content/claim-review-manifest.json
 M content/flashcards.ts
 M content/original-practice/cem-study-draft.json
 M content/original-practice/english-a2.json
 M content/original-practice/general-knowledge.json
 M content/original-practice/psychometric.json
 M content/original-practice/telecom.json
 M content/source-manifest.json
 M content/summaries/codigo-conducta.ts
 M content/summaries/ict-rd-346-2011.ts
 M content/summaries/incompatibilidades.ts
 M content/summaries/prevencion-riesgos-laborales.ts
 M content/summaries/rcf-libro-1.ts
 M content/syllabus.ts
 M content/theories/codigo-conducta.ts
 M content/theories/compatibilidad-electromagnetica.ts
 M content/theories/declaracion-red-2027.ts
 M content/theories/estatuto-adif.ts
 M content/theories/ict-rd-346-2011.ts
 M content/theories/incompatibilidades.ts
 M content/theories/ingles-a2.ts
 M content/theories/prevencion-riesgos-laborales.ts
 M content/theories/psicometria.ts
 M content/theories/rcf-libro-1.ts
 M content/theory-source-links.json
 M e2e/mobile.spec.ts
 M e2e/original-practice.spec.ts
 M e2e/study-flow.spec.ts
 M lib/content/original-practice-public-dto.ts
 M lib/content/original-practice-schema.ts
 M lib/content/psychometric-curriculum.ts
 M lib/supabase/config.ts
 M next-env.d.ts
 M playwright.config.ts
 M scripts/verify-theory-claims.ts
 M scripts/verify-theory-copy.ts
 M scripts/verify-theory-references.ts
 M tests/content-validation.test.ts
 M tests/estatuto-adif-coverage.test.ts
 M tests/navigation.test.tsx
 M tests/original-practice-schema.test.ts
 M tests/original-practice-session.test.tsx
 M tests/psychometric-practice.test.ts
 M tests/source-manifest.test.ts
 M tests/supabase-config.test.ts
 M tests/theory-validators.test.ts
?? .workbuddy-ai/memory/2026-11-03.md
?? app/(dashboard)/simulacros/original/[domain]/page.tsx
?? app/(dashboard)/simulacros/original/page.tsx
?? app/actions/original-simulations.ts
?? content/original-practice/declaracion-red-2027-draft.json
?? docs/evaluaciones/ADIF_360_CICLO15_PREPARACION_EXAMEN.md
?? docs/evaluaciones/ADIF_360_CICLO16_CALIDAD_SIMULACROS.md
?? docs/evaluaciones/ADIF_360_CICLO17_RECUPERACION.md
?? docs/evaluaciones/BLOQUEOS_DOCUMENTALES_ADIF360.md
?? docs/evaluaciones/SIMULACROS_ADIF360.md
?? docs/evaluaciones/ciclo-16/bateria-reservada/CLAVE-AUDITORIA.md
?? docs/evaluaciones/ciclo-16/bateria-reservada/INFORME-AUDITORIA.md
?? docs/evaluaciones/ciclo-16/bateria-reservada/PREGUNTAS.md
?? docs/evaluaciones/ciclo-16/bateria-reservada/RESPUESTAS-ESTUDIANTE.md
?? docs/evaluaciones/deepseek-pre-codex/AUDITORIA_CODEX.md
?? docs/evaluaciones/deepseek-pre-codex/CHANGELOG_ACADEMICO.md
?? docs/evaluaciones/deepseek-pre-codex/ESTADO_ACADEMICO_CICLO14.md
?? docs/evaluaciones/deepseek-pre-codex/EXAMEN_RESERVADO_TREBEP_2_PREGUNTAS.md
?? docs/evaluaciones/deepseek-pre-codex/EXAMEN_RESERVADO_TREBEP_PREGUNTAS.md
?? docs/evaluaciones/deepseek-pre-codex/EXAMEN_RESERVADO_TREBEP_RESULTADOS.md
?? docs/evaluaciones/deepseek-pre-codex/PENDIENTES.md
?? docs/evaluaciones/deepseek-pre-codex/REANUDACION.md
?? docs/evaluaciones/deepseek-pre-codex/RESUMEN_TREBEP.md
?? docs/evaluaciones/deepseek-pre-codex/REVISION_CODEX.md
?? docs/evaluaciones/deepseek-pre-codex/STATUS.md
?? e2e/original-simulations.spec.ts
?? lib/content/original-simulation-catalog.ts
?? lib/content/original-simulation-recovery-proposal.ts
?? lib/content/original-simulation-recovery.ts
?? lib/content/original-simulation-selection.ts
?? lib/content/practice-svg.ts
?? tests/academic-corrections-nov2026.test.ts
?? tests/cycle16-original-quality.test.ts
?? tests/english-a2-cycle5.test.ts
?? tests/english-a2-extension.test.ts
?? tests/favorite-button.test.tsx
?? tests/incompatibility-cycle8d-coverage.test.ts
?? tests/incompatibility-practice-references.test.ts
?? tests/original-simulation-recovery-proposal.test.ts
?? tests/original-simulation-recovery.test.ts
?? tests/original-simulation-selection.test.ts
?? tests/original-simulation.test.tsx
?? tests/original-simulations-action.test.ts
?? tests/prl-cycle8a-coverage.test.ts
?? tests/rcf-cycle13-coverage.test.ts
?? tests/rcf-cycle8b-coverage.test.ts
?? tests/visual-session.test.tsx
?? tests/visual-svg.test.ts
```
