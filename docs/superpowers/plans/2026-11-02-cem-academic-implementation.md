# CEM Academic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Corregir CEM con definiciones, ámbito, práctica original y evidencia trazable.
**Architecture:** Reutilizar teoría, fuentes, práctica y revisión existentes; separar texto histórico, derecho vigente y ejemplos técnicos, sin activar históricos.
**Tech Stack:** TypeScript, JSON, Vitest, Next.js.
**Spec:** `docs/superpowers/specs/2026-11-02-cem-prl-academic-design.md`

## Global Constraints

- Rama `codex/auditoria-adif-26`; preservar `AGENTS.md` y cambios ajenos.
- ORIGINAL ≠ OFFICIAL; históricos bloqueados; ninguna operación remota, merge, push ni deploy.
- Ningún 403 o copia local prueba la edición actual; ningún `reviewed` sustituye revisión independiente.
- CEM primero; no tocar ICT, RCF ni Declaración sobre la Red.
- Red → green → refactor para cambios funcionales; revisar y hacer commits locales por incremento solo tras verificación.

## Review Focus

1. Una exclusión del art. 2 no se generaliza al resto: test de casos incluidos/excluidos en tarea 1.
2. Inmunidad no se presenta como definición legal de CEM: test de trazabilidad en tarea 1.
3. PDF inaccesible o captura antigua no se marca verificado: test de estado en tarea 2.
4. Pregunta original no anticipa clave en DTO público: test de tarea 3.
5. Respuesta histórica obsoleta o ambigua no activa el banco histórico: test y auditoría en tarea 3.

### Tarea 1: CEM e inmunidad y ámbito legal

**Archivos:** `content/theories/compatibilidad-electromagnetica.ts`, `content/summaries/compatibilidad-electromagnetica.ts`, `content/claim-review-manifest.json`; crear `tests/cem-academic-content.test.ts`.
**Interfaces:** conservar estructuras existentes de teoría y fuentes; cada claim normativo usa referencia primaria con versión y localizador exacto.

- [ ] Añadir tests `cem_and_immunity_have_distinct_legal_sources`, `cem_scope_does_not_claim_universal_application`, `cem_scope_contains_source_backed_exclusion`: comprueban conceptos distintos con citas art. 3.1.4 y 3.1.6, ausencia de afirmación universal y exclusión atribuida a apartado exacto del art. 2.
- [ ] Ejecutar `pnpm exec vitest run tests/cem-academic-content.test.ts`; confirmar fallo por comportamiento anterior, no por importación rota.
- [ ] Cotejar versión consolidada Directiva y RD español; corregir afirmaciones, citas, resumen, ejemplos y exclusiones conforme a fuente. Mantener el texto didáctico separado de la definición legal.
- [ ] Repetir test focalizado y `pnpm verify:content`; examinar diff y registrar cambios/citas revisados. Hacer commit local solo de archivos de tarea.

### Tarea 2: Procedencia y artículo histórico

**Archivos:** `content/source-manifest.json`, `content/syllabus.ts`, `docs/STUDY_CONTENT_AUDIT.md`; crear `docs/cem-evidence-matrix.md`; test `tests/source-manifest.test.ts`.
**Interfaces:** registrar por separado edición capturada, resultado de acceso y verificación actual; conservar estados de bloqueo.

- [ ] Añadir test `historical_cem_403_does_not_verify_current_artifact`: ante evidencia de captura previa y acceso prohibido, no se establece verificación actual ni se habilita histórico.
- [ ] Ejecutar `pnpm exec vitest run tests/source-manifest.test.ts`; confirmar fallo de la nueva aserción si requiere un comportamiento nuevo. Si ya existe, conservar la prueba como regresión y documentar que no hubo RED funcional.
- [ ] Buscar ejemplar original y PDF ADIF accesibles; cotejar identidad y páginas o registrar pendiente. Matriz: afirmación, fuente, versión, localizador, acceso, fecha y decisión; no cambiar texto histórico silenciosamente ni inventar correspondencia de edición.
- [ ] Ejecutar el test focalizado y `pnpm verify:content`; revisar diff y hacer commit local del incremento documentado.

### Tarea 3: Práctica y revisión independiente

**Archivos:** `content/original-practice/telecom.json`, `content/flashcards.ts`, `content/theory-concepts.ts` cuando corresponda; crear `tests/cem-original-source-detail.test.ts` y `docs/cem-academic-review.md`.
**Interfaces:** preguntas del repositorio original existentes; cuatro opciones, una clave defendible, explicación de cada opción y referencia exacta; DTO público sin clave previa.

- [ ] Añadir tests `cem_original_questions_cover_definition_and_scope`, `cem_explanations_address_four_options`, `cem_original_questions_have_exact_primary_locator` y cobertura de no exposición reutilizando `tests/original-practice-public-dto.test.ts`; describir los IDs concretos al crear el mapa de objetivos, no mediante recuentos arbitrarios.
- [ ] Ejecutar `pnpm exec vitest run tests/cem-original-source-detail.test.ts tests/original-practice-public-dto.test.ts tests/telecom-practice.test.ts` y observar RED por objetivos faltantes.
- [ ] Inventariar todas las preguntas CEM, incluidas históricas bloqueadas; revisar clave y distractores con evidencia, anotar incidencias sin publicarlas. Completar práctica original, recuperación y enlaces por objetivo; corregir o retirar del circuito original cualquier pregunta no defendible.
- [ ] Ejecutar mismos tests y `pnpm verify:content`; solicitar revisiones independientes de especialista, preparador, pedagogo y auditor sobre el contenido real; registrar desacuerdos, bloqueos y evidencia antes de elevar estado. Realizar commit local limitado.

### Cierre CEM

- [ ] Ejecutar `pnpm test`, `pnpm typecheck`, `pnpm build`, `pnpm verify:content` y `git diff --check`; conservar salida y comunicar fallos sin ocultarlos. Confirmar límites de histórico, datos y ausencia de cambios ajenos. No certificar como completo el documento inaccesible.
