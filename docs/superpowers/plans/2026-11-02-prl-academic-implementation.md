# PRL Academic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Convertir exposición de motivos y capítulos I, III y V de la Ley 31/1995 en unidades estudiables y contrastadas.
**Architecture:** Reutilizar teoría, citas, conceptos, tarjetas y repositorio de práctica originales; dividir en incrementos que puedan revisarse separadamente, con matriz de cada apartado y bloqueo explícito de la edición ADIF inaccesible.
**Tech Stack:** TypeScript, JSON, Vitest, Next.js.
**Spec:** `docs/superpowers/specs/2026-11-02-cem-prl-academic-design.md`

## Global Constraints

- Trabajar en `codex/auditoria-adif-26`; preservar el `AGENTS.md` preexistente y cambios ajenos.
- Consultar Ley 31/1995 BOE y modificaciones con localizador artículo/apartado, fecha y versión; ninguna cita sin soporte.
- Mantener ORIGINAL ≠ OFFICIAL, claves protegidas y bloqueos históricos; no modificar bases de datos remotas, hacer merge, push ni deploy.
- No tocar ICT, RCF ni Declaración sobre la Red. Ejecutar tras la entrega CEM, salvo bloqueo documental independiente.
- Los cuatro revisores independientes validan contenido real; `reviewed` no implica revisión académica independiente.
- Red → green → refactor para modificación funcional; commits locales por incremento una vez revisado.

## Review Focus

1. Excepciones de ámbito y vigilancia de salud se citan con condiciones y sujetos: tests tareas 1 y 2.
2. Plazos, cifras y competencias no se extrapolan entre artículos: tests tareas 2 y 3.
3. Una fuente BOE accesible no certifica edición vigente del PDF ADIF: test tarea 1.
4. Cada opción errónea recibe justificación y fuente relevante; práctica original oculta clave antes de respuesta: tests tareas 2–4.
5. Falta de revisor o de evidencia deja estado parcial aunque pase el validador: control documental tareas 1–4.

### Tarea 1: Matriz documental y exposición/capítulo I

**Archivos:** `content/theories/prevencion-riesgos-laborales.ts`, `content/summaries/prevencion-riesgos-laborales.ts`, `content/flashcards.ts`, `content/syllabus.ts`, `content/claim-review-manifest.json`, `docs/STUDY_CONTENT_AUDIT.md`; crear `docs/prl-article-matrix.md`; tests `tests/prl-study-unit.test.ts`, `tests/source-manifest.test.ts`.
**Interfaces:** matriz con fila por artículo y apartado/letra real: localizador, fuente/versión, concepto, regla o excepción, teoría, recuperación, pregunta, revisión y estado. Los IDs del temario existentes se conservan.

- [ ] Añadir tests `prl_preamble_and_chapter_one_have_linked_recall`, `prl_article_three_qualifies_scope_and_exceptions`, `blocked_adif_pdf_does_not_certify_current_edition`; verificar referencias existentes, recuperación, excepciones y estado de fuente.
- [ ] Ejecutar `pnpm exec vitest run tests/prl-study-unit.test.ts tests/source-manifest.test.ts` y confirmar fallo específico de nueva cobertura o estado, no de configuración.
- [ ] Leer exposición y artículos 1–4 completos del BOE; desglosar sus apartados en la matriz, completar explicación, resumen y recuperación sin tratar el preámbulo como obligación independiente. Conservar `partial` para alcance cuya edición ADIF no se haya cotejado.
- [ ] Ejecutar tests focalizados y `pnpm verify:content`; registrar revisión independiente por roles y hacer commit local solo de la unidad aceptada.

### Tarea 2: Capítulo III, artículos 14–21

**Archivos:** teoría y resumen PRL, `content/flashcards.ts`, `content/original-practice/general-knowledge.json`, `content/theory-concepts.ts`, `content/claim-review-manifest.json`, `docs/prl-article-matrix.md`; crear `tests/prl-chapter-three-first.test.ts`.
**Interfaces:** cada objetivo sustantivo de los artículos 14–21 enlaza cita, explicación y actividad; cada pregunta mantiene IDs y esquema de práctica originales.

- [ ] Añadir tests `articles_14_to_21_have_exact_source_and_retrieval`, `risk_21_preserves_subjects_and_necessary_conditions`, `each_new_item_explains_four_options` sobre el mapa por apartado y preguntas de esta unidad.
- [ ] Ejecutar `pnpm exec vitest run tests/prl-chapter-three-first.test.ts tests/prl-original-source-detail.test.ts tests/original-practice-public-dto.test.ts`; confirmar RED sobre omisiones reales.
- [ ] Cotejar cada apartado 14–21; completar teoría, tarjetas y preguntas de comprensión, memoria y aplicación con cuatro opciones y explicaciones separadas; incluir responsable, condiciones y excepciones conforme a fuente exacta.
- [ ] Ejecutar los mismos tests y `pnpm verify:content`; revisión independiente de los cuatro roles y commit local del incremento.

### Tarea 3: Capítulo III, artículos 22–29

**Archivos:** mismos registros PRL de tarea 2; crear `tests/prl-chapter-three-second.test.ts`.
**Interfaces:** mismas estructuras y matriz; cobertura individual de 22–29 y sus apartados/letras.

- [ ] Añadir tests `articles_22_to_29_have_exact_source_and_retrieval`, `article_22_voluntariness_and_exceptions_are_qualified`, `article_26_sequence_is_source_backed`, `new_items_explain_all_distractors`.
- [ ] Ejecutar `pnpm exec vitest run tests/prl-chapter-three-second.test.ts tests/prl-original-source-detail.test.ts tests/original-practice-public-dto.test.ts` y confirmar RED específico.
- [ ] Cotejar cada apartado 22–29, completar contenido, recuperación y práctica; comprobar vigilancia de salud, confidencialidad, medidas sucesivas y obligaciones de cada sujeto con citas exactas.
- [ ] Repetir tests y `pnpm verify:content`; registrar las cuatro revisiones independientes y realizar commit local limitado.

### Tarea 4: Capítulo V, artículos 33–40

**Archivos:** mismos registros PRL de tarea 2; crear `tests/prl-chapter-five.test.ts` y `docs/prl-academic-review.md`.
**Interfaces:** matriz, teoría y práctica existentes; competencias, composición y cifras solo si están confirmadas con su apartado.

- [ ] Añadir tests `articles_33_to_40_have_exact_source_and_retrieval`, `delegates_and_committee_powers_are_distinct`, `delegate_numbers_match_article_35`, `all_distractors_explained`; comprobar también derechos de consulta y condiciones de constitución del comité.
- [ ] Ejecutar `pnpm exec vitest run tests/prl-chapter-five.test.ts tests/original-practice-public-dto.test.ts` y confirmar RED por contenido insuficiente.
- [ ] Cotejar cada apartado 33–40; completar explicación, recuperación y práctica diferenciando delegados, comité y órganos competentes; comprobar cada dato numérico con BOE.
- [ ] Repetir tests y `pnpm verify:content`; revisión de los cuatro roles con evidencias y desacuerdos; commit local limitado.

### Cierre PRL

- [ ] Auditar la matriz entera, cada pregunta y opción, todas las referencias y estados; anotar ausencias sin elevar a COMPLETE. Ejecutar `pnpm test`, `pnpm typecheck`, `pnpm build`, `pnpm verify:content`, `git diff --check`; guardar resultados reales, comprobar que no hay cambios ajenos y comunicar limitaciones. Verificadores automáticos no sustituyen cotejo jurídico ni revisión de aprendizaje.
