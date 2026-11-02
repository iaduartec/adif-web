# Estado real de ADIF 26/12PO

Fecha de corte: 2 de noviembre de 2026. Auditoría local y parcial; no certifica el contenido académico completo, la autenticación real ni la producción.

## Resumen de estado

| Área | Estado verificado |
|---|---|
| Rama y base principal | `main`, `23e6c938f527`, igual que `origin/main` al consultar GitHub. |
| Referencia más completa | `codex/auditoria-adif-26`, `451217fbe497`, worktree `.worktrees/codex-adif-audit`; incluye 4 commits no integrados. Es la referencia de esta auditoría funcional, no la rama desplegada. |
| Worktree histórico | `/home/kiri_/.codex/worktrees/6c02/adif-web`, `deaeeef`; anterior y menos completo. La rama remota histórica aparece eliminada. |
| Estado local preservado | En el checkout principal quedan `skills-lock.json` modificado y `.agents/skills/supabase-postgres-best-practices/`, `docs/db-repair-informe.md` sin seguimiento. No se tocaron. Las ramas `main` y auditoría están divergidas desde `a20aa29`. |
| Temario | 9 documentos oficiales; 28 subdivisiones registradas: 0 completas, 23 parciales y 5 sin cobertura (ver matriz en `STUDY_CONTENT_AUDIT.md`). |
| Fuentes | Rama de auditoría: 49 registros, 23 `verified`, 15 `needs_check`, 11 `superseded`. La validez del estado del manifiesto no reemplaza la revisión del documento actual. |
| Bancos | 102 transcripciones históricas de conocimientos específicos (2023–2025); 158 originales etiquetadas `reviewed` y 6 borradores. Etiqueta editorial no equivale a revisión independiente ni habilitación de publicación. |
| Aprendizaje | Ya existen teoría, prioridades, plan, fichas, repasos, errores, estadísticas, inglés A2, psicotécnicos y simulacros. La rama de auditoría añade corrección/registro de práctica original. La retención personal no se puede inferir del contenido; no hay historial personal disponible en esta auditoría. |
| Reglas de examen | PNI26: fecha prevista 12-12-2026; falta confirmación definitiva de fecha, hora y aulas. Puntuaciones, mínimos, penalización, cantidad y tiempos de prueba no verificados. El modo 2026 no debe activarse con las reglas históricas. |
| Autenticación | El despliegue web redirige `/` a `/login`; no se probaron credenciales, OAuth/callback real, cookies, logout ni rutas privadas con una cuenta real. |
| Base de datos | Migraciones, RPC y SQL RLS están en Git. No hay CLI Supabase ni servicio local Supabase observado; el único contenedor Docker activo observado es ajeno al proyecto. No se consultó ni modificó una base remota. |
| Producción | Vercel reporta un deployment `READY` (`dpl_GGCDTQ6bVcZTUGZx5YeJc4nLon1Y`) para el alias `adif-web.vercel.app`. El alias responde `307 /login`. Vercel CLI no expuso `gitSource`/SHA: no atribuirlo a un commit por coincidencia temporal. |

## Convocatoria y fuentes primarias

La [página oficial PNI26/01 de ADIF](https://www.adif.es/w/pni26-01-personal-operativo) indica 1.079 plazas y enumera seis documentos comunes y los tres documentos específicos 26/12PO: RD 346/2011, “Compatibilidad electromagnética y seguridad en los ferrocarriles” y RCF Libro 1. La página incluye el aviso de 14-10-2026: fecha prevista 12 de diciembre y sedes Barcelona, León, Madrid y Sevilla; aún anuncia confirmación de fecha definitiva, hora y facultades/aulas. Los tres PDF específicos de 26/12PO y el PDF de distribución devolvieron HTTP 403 en la consulta actual; se verificaron los títulos en la página, no el contenido ni los bytes de esos anexos. El anuncio [BOE-B-2026-24123](https://www.boe.es/diario_boe/txt.php?id=BOE-B-2026-24123) anuncia la convocatoria, pero remite a las bases de ADIF.

No se consideran confirmados los datos de 2025 (40/40/120 puntos, mínimos del 40 %, 100/200 puntos globales, 45/15 minutos, reservas ni penalización) para el examen 2026. La cita de ADIF “Ley 5/2015” se normaliza como Real Decreto Legislativo 5/2015 conservando por separado el rótulo de la convocatoria.

## Pruebas y compilación ejecutadas

| Checkout | Verificación | Resultado |
|---|---|---|
| `main` `23e6c93` | `pnpm test -- --reporter=dot` | PASS, 76 archivos / 623 pruebas. |
| `main` `23e6c93` | `pnpm verify:content` | PASS: validaciones estructurales, referencias, claims, copia, alcance y mapeos. Informa 9 documentos: 8 parciales, 1 sin cobertura, 0 % completos; 102 mapeos históricos. |
| `codex/auditoria-adif-26` `451217f` | `pnpm exec vitest run --reporter=dot` | PASS, 82 archivos / 645 pruebas. |
| `codex/auditoria-adif-26` `451217f` | `pnpm verify:content` | PASS: 11 módulos, 205 conceptos, 154 fuentes, 288 claims; 9 documentos: 8 parciales, 1 sin cobertura, 0 % completos; 102 mapeos históricos. |
| `codex/auditoria-adif-26` `451217f` | `pnpm lint` / `pnpm typecheck` | PASS: 0 errores de lint, 2 avisos de navegación; tipado PASS. |
| `codex/auditoria-adif-26` `451217f` | `PLAYWRIGHT_TEST=true pnpm build` | PASS. Build local con cliente Supabase simulado; no verifica auth ni persistencia real. |
| `codex/auditoria-adif-26` `451217f` | `pnpm exec playwright test` | FAIL: 7/10 pasan; fallan móvil por expectativa de 25 `.official-question-options` y recibir 0, onboarding por no encontrar “Pregunta 1 de 15”, y flujo completo por no encontrar “Iniciar práctica”. Primera ejecución no pudo lanzar Chromium; se instaló el navegador y se repitió. |

Los validadores comprueban consistencia y trazabilidad estructural, no que cada lección permita contestar el examen. El Playwright local usa el cliente de Supabase simulado. No se ejecutó SQL contra una base Supabase ni se verificó RLS/autenticación integrada.

## Estado Git y cambios de esta auditoría

- Base del informe: `23e6c938f527`; HEAD de referencia funcional: `451217fbe497`.
- Cambios de producto o contenido en esta auditoría: ninguno.
- Push, merge, deploy y migración remota: ninguno.
- `next dev` añadió instrucciones Next.js en el `AGENTS.md` de la rama de auditoría y el build actualizó `next-env.d.ts`; son efectos locales de la verificación y no forman parte del cambio de producto.

## Prioridades P0–P3

1. **P0 — cerrar vacíos de cobertura y vigencia:** redactar teoría trazable para los siete nodos ausentes y completar los 23 parciales, empezando por PRL exposición/Cap. I, Declaración 2027 Cap. II, compatibilidad electromagnética y RCF Cap. 3. Obtener o cotejar los PDFs ADIF que dieron 403 y vincular cada claim normativo a fuente, versión y apartado exacto.
2. **P0 — reglas del simulacro:** descargar/leer bases e instrucciones vigentes cuando ADIF lo permita; conservar modo 2025 histórico y mantener `official-2026` no disponible mientras falte evidencia primaria.
3. **P1 — práctica útil:** revisar cada original (enunciado, clave, distractores y explicación), cerrar bloque/sesión y medir conceptos; no aumentar bancos por volumen. Mantener transcripciones históricas bloqueadas hasta resolver fuente, elegibilidad y derechos.
4. **P1 — fiabilidad del aprendizaje:** reanudar sesiones tras recarga/desconexión, comprobar corrección en servidor y persistencia con Supabase local completo/RLS real simulado de forma autorizada.
5. **P2 — adaptación:** conectar evidencia por concepto a repaso, prioridad diaria y riesgo por prueba; separar inglés, psicotécnicos y progreso oficial. No mostrar probabilidad calibrada con muestras insuficientes.
6. **P3 — UX:** reparar las tres regresiones E2E observadas y verificar el recorrido móvil completo. No anteponer cambios visuales a la cobertura académica.
