# ADIF_360_AUDIT.md — Auditoría general 360º

Fecha: 2 de noviembre de 2026. Read-only. No se modificó código, contenido, BD ni despliegue.
Repositorio: `/home/kiri_/projects/adif-web`, rama `main` @ `a0418c1`.

## 1. Inventario real del repositorio

- Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Supabase (SSR + RLS), Vitest, Playwright.
- Scripts: `pnpm verify:content` (theory, references, claims, copy, syllabus, question-mappings), `pnpm test`, `pnpm build`, `pnpm lint`, `pnpm typecheck`.
- Contenido: 11 módulos de teoría (`content/lesson-theories`), 9 documentos oficiales (`content/syllabus.ts`), bancos original (62 conocimiento general + 52 telecom + 22 inglés A2 + 26 psicotécnicos), 102 transcripciones históricas (bloqueadas).
- Tests: 83 archivos / 652 pruebas (última ejecución: 652 OK). E2E: Playwright con Supabase en modo mock (`PLAYWRIGHT_TEST=true`).

## 2. Estado global

- **Cobertura del temario oficial**: 8/9 parciales, 1/9 sin cobertura, 0/9 completos. `coveragePercent` oficial = `null`.
- **256 claims** de teoría heredados en `needs_review` (confianza baja), 146 referencias vinculadas a 20 identidades/versiones.
- **Bancos originales**: 62 conocimiento general (58 reviewed, 4 draft), 52 telecom (52 reviewed, 2 versiones antiguas en draft), 22 inglés A2 (todos dificultad 1), 26 psicotécnicos (2 por aptitud).
- **Simulacros**: reglas 2026 pendientes de cotejo; histórico 2025 marcado como no confirmado para 2026.
- **Autenticación/persistencia**: modo mock en tests; no verificado contra Supabase real en esta auditoría.
- **Diseño**: vista de tema rediseñada a columna de lectura amplia (~1152px) en el commit `a0418c1`.

## 3. Puntuación global por dimensión (0–5, N/V = no verificado)

| Dimensión | Nota | Justificación |
|---|---|---|
| Cobertura del temario | 2/5 | 8/9 parciales, 1/9 missing, 0 completos |
| Exactitud normativa | 3/5 | Claims trazables pero 256 `needs_review`, confianza baja |
| Vigencia de fuentes | 2/5 | 15 fuentes `needs_check` (MCER-A2, MET-PSI-01, EN 50121, cuadernillos, DR 2027) |
| Calidad de explicaciones | 3/5 | Estructura clara, pero incompletas y sin revisión independiente |
| Calidad de preguntas | 2/5 | Bancos originales revisados editorialmente, no validados independientemente; distractores sin evidencia |
| Inglés A2 | NO VERIFICADO | 22 ítems, todos dificultad 1, sin variedad ni validación de nivel |
| Psicotécnicos | NO VERIFICADO | 26 ítems, 2 por aptitud, ejercicios visuales en texto, sin corrección funcional |
| Simulacros | 2/5 | Reglas 2026 pendientes de cotejo; corrección y persistencia parciales |
| Memorización y repasos | 2/5 | Sin flashcards por tema ni repetición espaciada real |
| Organización del estudio | 3/5 | Plan diario, fichas, repasos, estadísticas existen |
| Diseño | 3/5 | Columna amplia corregida; mobile responsive; pendiente contraste/teclado/lector |
| Accesibilidad | NO VERIFICADO | No auditada con herramientas ni lector de pantalla |
| Funcionamiento | 3/5 | Tests pasan; autenticación real no verificada |
| Persistencia | 2/5 | Mock en tests; migraciones no aplicadas en producción |
| Seguridad | NO VERIFICADO | RLS no verificada contra Supabase real |

## 4. Doble nota por tema

Ver `ADIF_SYLLABUS_COVERAGE.md` §2. Ningún tema alcanza 5/5 en calidad académica. Compatibilidad electromagnética: 1/5 académica, 2/5 aprendizaje (sin teoría trazada).

## 5. Respuesta a la pregunta central

**¿Puede una persona preparar toda la oposición 26/12PO rigurosamente con esta web sin material adicional no identificado?**

**NO.** Motivos:
1. **Cobertura incompleta**: 8/9 documentos parciales, 1/9 (CEM) sin teoría trazada, 6 nodos `missing` (PRL cap. I, exposición; Declaración sobre la Red cap. II; RCF cap. 3; CEM completo).
2. **256 claims `needs_review`** con confianza baja — no se puede afirmar exactitud sin revisión independiente.
3. **15 fuentes `needs_check`** (incluye MCER-A2, MET-PSI-01, EN 50121, cuadernillos ADIF).
4. **Simulacros**: reglas 2026 pendientes de cotejo; no presentar como oficiales.
5. **Preguntas históricas bloqueadas** (102 registros, derechos/vigencia pendientes).
6. **Persistencia/auth no verificadas** contra Supabase real.

## 6. Hard gates (no se puede declarar "lista")

- Omisiones demostradas del temario exigido (6 nodos missing + 1 documento sin cobertura).
- 256 claims sin revisión independiente.
- Reglas de simulación no cotejadas con bases 2026.
- Persistencia/auth no verificadas en entorno real.
- Accesibilidad no auditada.

## 7. Top 15 problemas por impacto

| ID | Severidad | Problema | Responsable | Consecuencia | Corrección | Prueba de aceptación |
|---|---|---|---|---|---|---|
| P0-1 | P0 | Compatibilidad electromagnética sin teoría trazada al documento oficial | Ingeniero telecom | Tema examinable no preparable | Crear teoría trazada; verificar derechos Cemdal/REE | Teoría + preguntas vinculadas al documento |
| P0-2 | P0 | 6 nodos `missing` (PRL cap. I/exposición, DR cap. II, RCF cap. 3, CEM) | Jurista/Ferroviario | Lagunas en temario exigido | Cubrir nodos missing | `missing` = 0 en syllabus |
| P0-3 | P0 | 256 claims `needs_review` | Jurista/Técnico | Posible contenido inexacto | Revisión independiente claim por claim | Claims `reviewed` con evidencia primaria |
| P0-4 | P0 | 15 fuentes `needs_check` (MCER-A2, MET-PSI-01, EN 50121, cuadernillos) | Auditor documental | Fuentes no verificadas presentadas como material | Validar o marcar como no oficial | Estado `verified` o retirado |
| P0-5 | P0 | Reglas de simulacro 2026 no cotejadas | Examinador/QA | Simulacro puede no reflejar examen real | Cotejar bases oficiales 2026 | Documento de reglas verificadas |
| P0-6 | P0 | Persistencia/auth no verificadas en Supabase real | Full-stack/QA | Pérdida de progreso posible | Prueba E2E con Supabase real | Login→estudiar→guardar→volver→recuperar |
| P1-1 | P1 | Declaración sobre la Red: diferencia de ediciones sin resolver | Ferroviario | Contenido sobre edición incorrecta | Cotejar edición vigente 31/07/2026 | Localizadores actualizados |
| P1-2 | P1 | PRL cap. I sin teoría | Jurista | Tema parcial | Cubrir arts. 1–4 | Nodo `covered` |
| P1-3 | P1 | RCF cap. 3 sin teoría | Ferroviario | Tema parcial | Cubrir capítulo 3 | Nodo `covered` |
| P1-4 | P1 | Inglés A2: 22 ítems todos dificultad 1 | Profesor inglés | Sin variedad ni validación de nivel | Ampliar variedad y niveles | Banco revisado por nivel |
| P1-5 | P1 | Psicotécnicos: 2 por aptitud, ejercicios visuales en texto | Psicometrista | Preparación insuficiente | Ampliar variedad y corrección funcional | Corrección + cronómetro real |
| P1-6 | P1 | Sin flashcards por tema ni repetición espaciada real | Pedagogo | Memoria a largo plazo no soportada | Flashcards por concepto + SRS | Flashcards por módulo |
| P1-7 | P1 | Accesibilidad no auditada | UX/UI | Exclusión de usuarios | Auditoría axe + teclado + lector | Informe de accesibilidad |
| P1-8 | P1 | Preguntas originales sin validación independiente | Examinador | Distractores posiblemente ambiguos | Revisión independiente de cada ítem | Estado `reviewed` con evidencia |
| P1-9 | P1 | 102 transcripciones históricas bloqueadas | Auditor documental | Sin práctica real con preguntas oficiales | Resolver derechos/vigencia | Banco habilitado |

## 8. Entregables generados

- `docs/ADIF_360_AUDIT.md` (este archivo)
- `docs/ADIF_SYLLABUS_COVERAGE.md` (cobertura + doble nota por tema)
- `docs/ADIF_ACADEMIC_REVIEW.md`
- `docs/ADIF_LEARNING_EXPERIENCE.md`
- `docs/ADIF_UX_UI_AUDIT.md`
- `docs/ADIF_FUNCTIONAL_QA.md`
- `docs/ADIF_RED_TEAM_REVIEW.md`
- `docs/ADIF_360_IMPROVEMENT_PLAN.md`

## 9. Conclusión

El proyecto tiene una base técnica sólida (tests, validadores, trazabilidad) y buena estructura didáctica, pero **no está listo para certificar preparación completa de la oposición**. Faltan: cobertura completa del temario, revisión independiente de 256 claims, validación de fuentes `needs_check`, reglas de simulacro 2026, verificación de persistencia/auth reales y accesibilidad. Prioridad: P0 (CEM, nodos missing, claims, fuentes, simulacros, persistencia).
