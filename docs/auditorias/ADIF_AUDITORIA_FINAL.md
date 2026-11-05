# ADIF 360: estado de la auditoría

Fecha: 5 de noviembre de 2026. Base de GitHub y producción observada: `bf7148aad3afb220cd61deeb67e5b1c5d732ba2d`. Rama de trabajo: `codex/adif-360-auditoria`. **Auditoría y mejoras parciales; no se acredita que el temario esté completo ni que la plataforma sea suficiente como única preparación.**

| Dimensión | Estado inicial | Estado de esta revisión | Evidencia y pendiente |
|---|---|---|---|
| Cobertura | Nueve documentos y 28 unidades inventariadas; seis documentos marcados como cubiertos en el cálculo estructural. | Matriz de unidades con estados independientes de revisión. | [Cobertura](ADIF_COBERTURA_TEMARIO.md); cotejo exhaustivo pendiente. |
| Exactitud | Contenido y revisiones académicas parciales. | Aclarado el supuesto de RITU en teoría y pregunta; completados los supuestos del plan de igualdad del art. 45. Ambos contrastados con fuentes y revisión independiente. | [Revisión académica](ADIF_REVISION_ACADEMICA.md); estas correcciones no acreditan la totalidad de ICT o igualdad. |
| Fuentes | 16 fuentes `needs_check`; identidad o edición de DR y CEM pendiente de resolver. | Consulta directa ADIF 403; lectura alternativa de página y adjuntos disponible; BOE ICT accesible. | [Cobertura](ADIF_COBERTURA_TEMARIO.md); verificar identidad binaria, versiones y uso permitido. |
| Aprendizaje | Readiness y plan diario se basaban en preguntas oficiales. | Preguntas originales revisadas alimentan métricas por concepto y una tabla propia por modalidad; indicadores oficiales se mantienen separados. | [Revisión pedagógica](ADIF_REVISION_PEDAGOGICA.md); el plan diario aún no selecciona práctica original y no se ha probado Supabase real. |
| Preguntas | Originales y material histórico sujeto a condiciones de publicación. | Se corrigió una explicación ICT y se añadieron regresiones. | Mantener la barrera de publicación; revisión independiente y muestreo amplios pendientes. |
| Simulacros | Existen flujos con recuperación y pruebas de navegador. | Se refactorizaron efectos y se corrigió una carrera de recuperación en Strict Mode; pasaron los 13 recorridos dirigidos y la batería completa de 37 pruebas con mocks. | [Pruebas](ADIF_PRUEBAS_FUNCIONALES.md); comprobar persistencia real y reglas que las bases no detallan. |
| UX/UI | Lectura ancha; título podía sugerir que toda la teoría estaba completa; la revisión de cada afirmación no se mostraba. | Título y etiquetas aclaran alcance; cada afirmación muestra su estado editorial; acceso en castellano de España. | [UX/UI](ADIF_UX_UI.md); la revisión editorial registrada no acredita exactitud ni revisión independiente. Auditoría visual integral pendiente. |
| Persistencia | RLS y migraciones en el repositorio; sin verificación real integral. | No hay evidencia nueva en un Supabase aislado. | [Pruebas](ADIF_PRUEBAS_FUNCIONALES.md); probar con dos usuarios y migraciones de prueba. |
| Seguridad | Alta mediante Admin API con correo preconfirmado; protección de abuso no localizada en la acción. | Riesgo documentado. | Definir una solución viable de confirmación y controles de abuso; no se probó el entorno remoto. |
| Accesibilidad | Pruebas de teclado y tamaños incluidos en Playwright. | La batería estable pasó con mocks, incluidos los casos de teclado, 320 px y 390 px. | Ampliar la revisión con herramientas y personas; no equivale a auditoría exhaustiva. |

## Resultados de referencia

En la base: `pnpm typecheck` y `pnpm verify:content` pasaron; `pnpm test` obtuvo 809 pruebas correctas; `pnpm lint` mostró siete errores y siete avisos. Tras las correcciones de código y esta mejora adaptativa, TypeScript y los validadores pasan, Vitest obtiene 828 pruebas correctas, lint termina con cero errores y tres avisos, y `pnpm build` pasa con variables públicas ficticias. El recorrido Playwright de estadísticas pasa con mocks; Supabase real no se ha probado. La instalación informó de lockfile actualizado al resolver los overrides: una observación previa en esta conversación que afirmaba que la diferencia de specifiers rompería necesariamente `--frozen-lockfile` no estaba suficientemente fundada y queda rectificada.

Los informes detallan los límites de las notas, las fuentes y las tareas restantes: [línea base](ADIF_LINEA_BASE.md), [cobertura](ADIF_COBERTURA_TEMARIO.md), [revisión académica](ADIF_REVISION_ACADEMICA.md), [pedagogía](ADIF_REVISION_PEDAGOGICA.md), [UX/UI](ADIF_UX_UI.md), [pruebas funcionales](ADIF_PRUEBAS_FUNCIONALES.md) y [pendientes para preparar el examen](ADIF_PENDIENTES_PARA_APROBAR.md).

## Modelos y revisión

Se utilizaron subagentes GPT-6 Luna para revisiones separadas y GPT-6.1 Sol para el análisis del refactor de hooks, tras no completarse el trabajo con la primera revisión Luna. El modelo del orquestador de esta sesión no se puede confirmar desde el repositorio; no se afirma que fuera GPT-6.1 Terra. No se ha invocado Astra. Las notas de los nueve documentos quedan no evaluables allí donde no existe evidencia suficiente para asignar puntuaciones fiables; no son calificaciones de expertos humanos.

## Estado de publicación

La [PR #21](https://github.com/iaduartec/adif-web/pull/21) se integró en `main` mediante squash: `37c7627dab6f61ee3dfcbcf68b3bde067bc6e135`. Vercel desplegó producción como `dpl_9Ka7DSPaTedjAwBdS5jtxvFkZUyk` en estado `READY`; la raíz pública devuelve HTTP 200 y muestra el acceso actualizado. La comparación entre preview y producción confirmó el texto de castellano corregido y que el mínimo de seis caracteres ya no se aplica al inicio de sesión. `/estadisticas` y `/curso` redirigen a `/login` sin sesión válida; sus páginas autenticadas solo se comprobaron en recorridos E2E con mocks. No se aplicaron migraciones.
