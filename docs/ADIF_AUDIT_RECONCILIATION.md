# ADIF_AUDIT_RECONCILIATION.md — Validación independiente y reconciliación

Fecha: 2 de noviembre de 2026. Read-only. No se modificó código, contenido ni despliegue.

## 1. Estado real de las ramas

| Rama / worktree | Commit | Contenido | Veredicto |
|---|---|---|---|
| `main` (local/remoto) | `a0418c1` | Layout wide reading + auth restoration + my commit `a0418c1` | Más reciente en infraestructura/UI, pero **contenido anterior** |
| `codex/auditoria-adif-26` (worktree `.worktrees/codex-adif-audit`) | `190f2b7` | +15 commits sobre `main` anterior: CEM, PRL, flashcards, syllabus, sources, summaries | **Contenido más actualizado** |
| `docs/pni26-01-26-12po-spec` (worktree 6c02) | `deaeeef` | Antecesor; base de la rama de auditoría | Histórico, no usar como referencia actual |

**Conclusión**: el contenido más actualizado está en `codex/auditoria-adif-26` (`190f2b7`), NO en `main`. La auditoría anterior se ejecutó sobre un estado intermedio. Las correcciones de CEM (68 líneas añadidas) y PRL (246 líneas añadidas) ya están en la rama de auditoría.

**No se mezclaron ramas ni se sobrescribieron cambios.**

## 2. Diferencias académicas entre versiones

Comparación `main` vs `codex/auditoria-adif-26` (solo `content/`):

| Archivo | Cambio |
|---|---|
| `content/theories/compatibilidad-electromagnetica.ts` | +46 líneas (279 → 325) |
| `content/theories/prevencion-riesgos-laborales.ts` | +276 líneas (384 → 660) |
| `content/syllabus.ts` | +18 (2 nodos missing → partial) |
| `content/summaries/compatibilidad-electromagnetica.ts` | +6 |
| `content/summaries/prevencion-riesgos-laborales.ts` | +25 |
| `content/flashcards.ts` | +53 |
| `content/original-practice/general-knowledge.json` | +518 |
| `content/source-manifest.json` | +91 |
| `content/source-observations/latest.json` | +8 |
| `content/theory-source-links.json` | +2 |

**Syllabus (rama de auditoría)**: 28 nodos → 25 partial, 3 missing (vs main: 23 partial, 5 missing).

**Nodos still missing en la rama más actualizada**:
1. Declaración sobre la Red — Capítulo II. Infraestructura
2. CEM — Artículo completo (compatibilidad electromagnética y seguridad ferroviaria)
3. RCF — Capítulo 3. Distribución de documentos y útiles de servicio

**Conclusión**: las correcciones de CEM y PRL avanzaron, pero el artículo de CEM sigue sin teoría trazada. Los P0 de CEM, DR cap. II y RCF cap. 3 permanecen.

## 3. Tabla de cobertura corregida (rama más actualizada)

| Documento | Nodos | covered | partial | missing |
|---|---|---|---|---|
| LO 3/2007 | 1 | 0 | 1 | 0 |
| Ley 31/1995 | 4 | 0 | 4 | 0 |
| RD 2395/2004 | 6 | 0 | 6 | 0 |
| Declaración sobre la Red 2027 | 2 | 0 | 1 | 1 |
| EBEP cap. VI T. III | 1 | 0 | 1 | 0 |
| Ley 53/1984 | 1 | 0 | 1 | 0 |
| RD 346/2011 | 7 | 0 | 7 | 0 |
| CEM (art. REE 2015) | 1 | 0 | 0 | 1 |
| RCF Libro 1 | 5 | 0 | 4 | 1 |
| **Total** | **28** | **0** | **25** | **3** |

Verificación reproducible (rama de auditoría): `grep -oE "status: ..."` → 25 partial, 3 missing.

## 4. Doble puntuación justificada por tema (rama más actualizada)

| Materia / Tema | Calidad académica | Facilidad aprendizaje | Justificación |
|---|---|---|---|
| Igualdad (LO 3/2007) | 3/5 | 4/5 | Contenido útil, artículos seleccionados, sin revisión independiente |
| PRL (Ley 31/1995) | 3/5 | 4/5 | Mejorado en rama de auditoría (+276 líneas), pero sin revisión independiente |
| Estatuto ADIF (RD 2395/2004) | 3/5 | 4/5 | Seis capítulos con artículos seleccionados |
| Declaración sobre la Red 2027 | 2/5 | 3/5 | Cap. II sin cobertura; diferencia de ediciones sin resolver |
| Código de Conducta (EBEP) | 3/5 | 4/5 | Arts. 52–54 con trazabilidad |
| Incompatibilidades (Ley 53/1984) | 3/5 | 4/5 | Artículos seleccionados; excepciones y plazos |
| ICT (RD 346/2011) | 3/5 | 4/5 | Anexos I–V parciales |
| **Compatibilidad electromagnética** | **1/5** | **2/5** | Sin teoría trazada al documento oficial (sigue missing) |
| RCF, Libro 1 | 3/5 | 4/5 | Cap. 3 sin teoría |
| Inglés A2 | NO VERIFICADO | 3/5 | 22 ítems, todos dificultad 1 |
| Psicotécnicos | NO VERIFICADO | 2/5 | 26 ítems, 2 por aptitud; sin corrección funcional |

**Regla aplicada**: no se promediaron las dos notas; un tema con 5/5 académica y 1/5 pedagógica se reporta como "correcto pero no optimizado". Ningún tema alcanza 5/5 académica.

## 5. Errores encontrados en la auditoría anterior

1. **Conteo de nodos**: audit doc dijo "22 parciales, 6 ausentes" → real era 23 parciales, 5 ausentes (main) / 25 parciales, 3 ausentes (rama de auditoría). Corregido.
2. **Claims**: audit doc dijo 255 → real 256 (todos `needs_review`, confianza baja). Corregido.
3. **Fuentes `needs_check`**: audit doc dijo 9 → real 15. Corregido.
4. **Rama auditada**: la auditoría se ejecutó sobre un estado intermedio; el contenido más actualizado está en `codex/auditoria-adif-26`. Las conclusiones sobre CEM/PRL deben re-evaluarse contra esa rama.
5. **CEM**: la auditoría dijo "sin cobertura" — sigue siendo cierto en la rama más actualizada (el nodo CEM sigue `missing`), pero la teoría pasó de 279 a 325 líneas (contexto normativo mejorado, pero sin trazabilidad al documento oficial).
6. **PRL**: la auditoría dijo "parcial (cap. I sin teoría)" — en la rama más actualizada el cap. I pasó a `partial` (+276 líneas). Mejora significativa, pero sin revisión independiente.

## 6. Riesgos que continúan abiertos

- CEM: sin teoría trazada al documento oficial asignado por ADIF (P0).
- DR cap. II: sin cobertura (P0).
- RCF cap. 3: sin cobertura (P0).
- 256 claims `needs_review` con confianza baja (P0).
- 15 fuentes `needs_check` (P0/P1).
- Reglas de simulacro 2026 no cotejadas (P0).
- Persistencia/auth no verificadas en Supabase real (P0).
- Accesibilidad no auditada (P1).
- Diferencia de ediciones de la Declaración sobre la Red sin resolver (P1).
- Inglés A2: 22 ítems todos dificultad 1 (P1).
- Psicotécnicos: 26 ítems, 2 por aptitud, sin corrección funcional (P1).
- Sin flashcards por tema ni SRS real (P1).

## 7. Diez correcciones más importantes

1. (P0) Crear teoría trazada para el artículo de Compatibilidad electromagnética (verificar derechos Cemdal/REE).
2. (P0) Cubrir el capítulo II de la Declaración sobre la Red 2027.
3. (P0) Cubrir el capítulo 3 del RCF.
4. (P0) Revisión independiente de los 256 claims `needs_review`.
5. (P0) Validar o retirar las 15 fuentes `needs_check`.
6. (P0) Cotejar reglas de simulacro 2026 con bases oficiales.
7. (P0) Verificar persistencia/auth contra Supabase real (E2E).
8. (P1) Resolver diferencia de ediciones de la Declaración sobre la Red.
9. (P1) Ampliar variedad de Inglés A2 y Psicotécnicos.
10. (P1) Flashcards por concepto + SRS real.

## 8. Primera entrega funcional recomendada

**Entrega 1 (P0, contenido)**: Cubrir los 3 nodos `missing` (CEM, DR cap. II, RCF cap. 3) + revisión independiente de claims de los temas tocados. Verificación: `missing` = 0 en syllabus, claims `reviewed` con evidencia primaria.

**Entrega 2 (P0, técnico)**: Verificar persistencia/auth contra Supabase real + cotejar reglas de simulacro 2026. Verificación: E2E con Supabase real + documento de reglas verificadas.

**Entrega 3 (P1, aprendizaje)**: Flashcards por concepto + SRS + vinculación errores-conceptos.

## 9. Criterios objetivos de aceptación

- `missing` = 0 en `content/syllabus.ts`.
- Todos los claims tocados en `reviewed` con confianza alta, fecha real de revisión y evidencia primaria verificada.
- Fuentes `needs_check` validadas o retiradas.
- Reglas de simulacro 2026 cotejadas con bases oficiales (documento de referencia).
- E2E con Supabase real: login→estudiar→responder→guardar→volver→recuperar OK.
- Accesibilidad auditada (axe + teclado + lector).
- Cobertura oficial con `sourceComplete: true` solo tras validar exhaustividad.

## 10. Evaluación adversarial final

Un revisor independiente intentó refutar las conclusiones:
- Los recuentos se verificaron directamente desde `content/syllabus.ts`, `content/claim-review-manifest.json`, `content/source-manifest.json` y los bancos de preguntas → corregidos (256 claims, 15 needs_check, 23 partial/5 missing en main; 25 partial/3 missing en la rama de auditoría).
- La cobertura se verificó contra el código real, no contra informes anteriores.
- La vigencia normativa no se puede afirmar (256 claims `needs_review`).
- Las afirmaciones sobre autenticación se basan en modo mock, no en Supabase real.
- Las afirmaciones sobre simulacros se basan en reglas no cotejadas.
- La supuesta completitud del temario es falsa: 3 nodos `missing` incluso en la rama más actualizada.

**Veredicto adversarial**: las conclusiones de la auditoría son consistentes con la evidencia disponible, pero las notas académicas (3/5) son generosas: sin revisión independiente claim por claim, no se puede afirmar 3/5. Recomendación: tratar la calidad académica como **NO VERIFICADO** hasta completar la revisión, y la facilidad de aprendizaje como **3/5** (estructura clara pero sin SRS ni flashcards reales).

## Conclusión

La auditoría ADIF 360 fue útil pero contenía contradicciones numéricas y se basó en un estado intermedio del repositorio. Tras la reconciliación, el estado real más reciente está en `codex/auditoria-adif-26` (`190f2b7`), con mejoras significativas en CEM y PRL, pero **3 nodos missing**, **256 claims sin revisión**, **15 fuentes sin verificar**, y **persistencia/auth no validadas**. No se puede certificar el proyecto como listo para la convocatoria.

No se modificó código, contenido ni despliegue. Se requiere aprobación conforme a Superpowers para la siguiente etapa de implementación.