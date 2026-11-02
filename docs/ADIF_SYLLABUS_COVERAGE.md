# ADIF_SYLLABUS_COVERAGE.md — Cobertura del temario oficial PNI26/01

Fecha de auditoría: 2 de noviembre de 2026.
Repositorio: `/home/kiri_/projects/adif-web` (rama `main`, commit `a0418c1`).
Auditoría read-only. No se modificó código ni contenido.

## 1. Fuentes oficiales identificadas (9 documentos PNI26/01)

Fuente de alcance: página oficial ADIF PNI26/01 (captura 2026-10-15) + PDFs enlazados, con SHA-256 en `content/source-manifest.json`. Los adjuntos se conservan como versiones `verified` (supersedidas en manifest para los documentos comunes/específicos).

| # | Documento | Ámbito | Estado en `content/syllabus.ts` | Estado académico (módulo) |
|---|---|---|---|---|
| 1 | Ley Orgánica 3/2007 (igualdad) | Común | parcial (texto completo como nodo único) | parcial |
| 2 | Ley 31/1995 (PRL) | Común | parcial (cap. I, III, V; exp. motivos sin cobertura) | parcial |
| 3 | RD 2395/2004 (Estatuto ADIF) | Común | parcial (6 capítulos, artículos seleccionados) | parcial |
| 4 | Declaración sobre la Red ADIF 2027 (cap. I–II) | Común | parcial (cap. I parcial; cap. II sin cobertura) | parcial |
| 5 | EBEP cap. VI título III (arts. 52–54) | Común | parcial | parcial |
| 6 | Ley 53/1984 (incompatibilidades) | Común | parcial (artículos seleccionados) | parcial |
| 7 | RD 346/2011 (ICT) | Específico | parcial (cap. I–II + anexos I–V parciales) | parcial |
| 8 | Compatibilidad electromagnética y seguridad ferroviaria (artículo REE 2015) | Específico | **missing** (sin teoría trazada al documento) | sin cobertura |
| 9 | RCF, Libro 1 (cap. 1–5) | Específico | parcial (cap. 3 sin cobertura) | parcial |

**Resumen de cobertura (según `content/syllabus.ts`): 9 oficiales; 8 parciales; 1 missing; 0 covered; 0 unresolved.**

Ningún documento oficial alcanza `covered`. La métrica `coveragePercent` oficial es `null` (no se declara completo). La cobertura identificada provisional del repo (64,71 %) fue invalidada como porcentaje oficial.

## 2. Matriz de doble puntuación por tema (CALIDAD ACADÉMICA / FACILIDAD DE APRENDIZAJE)

Escala 0–5. `NO VERIFICADO` cuando no hay evidencia suficiente.

| Materia / Tema | Calidad académica | Facilidad aprendizaje | Cobertura | Prioridad | Acción |
|---|---|---|---|---|---|
| Igualdad y no discriminación (LO 3/2007) | 3/5 | 4/5 | parcial | P1 | Completar artículos omitidos; revisión independiente |
| Prevención de riesgos laborales (Ley 31/1995) | 3/5 | 4/5 | parcial | P1 | Exposición y cap. I sin teoría; completar cap. III y V |
| Estatuto de ADIF (RD 2395/2004) | 3/5 | 4/5 | parcial | P1 | Seis capítulos con artículos seleccionados |
| Declaración sobre la Red 2027 (cap. I–II) | 2/5 | 3/5 | parcial | P0 | Cap. II sin cobertura; verificar edición vigente |
| Código de Conducta (EBEP cap. VI, T. III) | 3/5 | 4/5 | parcial | P1 | Revisar arts. 52–54 contra TREBEP |
| Incompatibilidades (Ley 53/1984) | 3/5 | 4/5 | parcial | P1 | Texto completo inventariado; excepciones y plazos |
| ICT (RD 346/2011) | 3/5 | 4/5 | parcial | P1 | Anexos I–V parciales; verificar versión consolidada |
| Compatibilidad electromagnética (art. REE 2015) | 1/5 | 2/5 | **missing** | P0 | Sin teoría trazada; verificar derechos y fuente |
| RCF, Libro 1 | 3/5 | 4/5 | parcial | P1 | Cap. 3 sin teoría vinculada |
| Inglés A2 | NO VERIFICADO | 3/5 | N/A (apoyo) | P1 | 22 ítems revisados, todos dificultad 1; falta variedad |
| Psicotécnicos | NO VERIFICADO | 2/5 | N/A (apoyo) | P0 | 26 ítems, 2 por aptitud; ejercicios visuales en texto |

### Justificación de las notas

- **Calidad académica 3/5** para los temas parciales: contenido útil y trazable a fuentes, pero incompleto (artículos/exceptiones omitidos) y 256 claims heredados en `needs_review` con confianza baja. No se asigna 4/5 porque falta revisión independiente y cobertura completa.
- **Compatibilidad electromagnética 1/5**: no existe teoría trazada al documento oficial asignado por ADIF; solo contexto normativo (Directiva 2014/30/UE, RD 186/2016) que ADIF no lista como documento independiente. Riesgo de enseñar contenido no verificable.
- **Declaración sobre la Red 2/5**: cap. II sin cobertura; diferencia de ediciones (V.0 ED 27/02/2026 vs. edición general 31/07/2026) sin resolver.
- **Facilidad de aprendizaje 4/5** para los temas parciales: estructura clara, tabs, resumen, datos clave, tips; pero falta práctica de recuperación espaciada real y flashcards por tema (no se observan flashcards por módulo).
- **Psicotécnicos 2/5**: cantidad y variedad insuficientes; ejercicios de aptitud visual expresados en texto; la pantalla muestra preguntas y opciones sin registrar ni corregir respuestas (cronómetro orientativo).

### Regla de interpretación aplicada

No se ha promediado académica + pedagógica. Un tema con 5/5 académica y 1/5 pedagógica se reporta como "correcto pero no optimizado para estudiar"; ninguno alcanza 5/5 académica en este estado.

## 3. Desglose de cobertura por nodo (resumen)

| Documento | Nodos | covered | partial | missing | reference-only |
|---|---|---|---|---|---|
| LO 3/2007 | 1 | 0 | 1 | 0 | 0 |
| Ley 31/1995 | 4 | 0 | 2 | 2 | 0 |
| RD 2395/2004 | 6 | 0 | 6 | 0 | 0 |
| Declaración sobre la Red 2027 | 2 | 0 | 1 | 1 | 0 |
| EBEP cap. VI T. III | 1 | 0 | 1 | 0 | 0 |
| Ley 53/1984 | 1 | 0 | 1 | 0 | 0 |
| RD 346/2011 | 7 | 0 | 7 | 0 | 0 |
| CEM (art. REE 2015) | 1 | 0 | 0 | 1 | 0 |
| RCF Libro 1 | 5 | 0 | 4 | 1 | 0 |
| **Total** | **28** | **0** | **23** | **5** | **0** |

## 4. Fuentes no verificadas (needs_check)

15 fuentes con estado `needs_check` en `content/source-manifest.json`: ADIF PNI23/01, PNI24/01, PNI25/01 (plantillas/cuadernillos y resoluciones del tribunal), ADIF PNI26/01, distribución por sede, DR 2027, EN 50121, MCER-A2, MET-PSI-01. No deben tratarse como fuentes oficiales verificadas.

## 5. Temas adyacentes (supplementalItems) — NO oficiales

Constitución, sector ferroviario/ADIF, EPI, igualdad retributiva, marco legal CEM, Directiva CEM, EN 50121, psicometría, inglés A2. No deben contarse como documentos oficiales adicionales ni inflar la cobertura.

## 6. Conclusión de cobertura

**Ningún documento oficial alcanza cobertura completa.** 8/9 parciales, 1/9 sin cobertura. El `coveragePercent` oficial es `null`. La cobertura identificada provisional (64,71 %) fue invalidada. No se puede afirmar que el temario exigido esté cubierto.

## 8. Verificación de agregados (reproducible)

Comandos ejecutados el 2 de noviembre de 2026:

```bash
python3 -c "import re; src=open('content/syllabus.ts').read(); import re; print(re.findall(r\"status: '(covered|partial|missing|reference-only|unresolved)'\", src).count('partial'))"
# → 23 partial, 5 missing, 28 total nodos
grep -c 'officialItem({' content/syllabus.ts  # → 9 documentos oficiales
python3 -c "import json; d=json.load(open('content/claim-review-manifest.json')); print(len(d['reviews']))"  # → 256 claims, todos needs_review
python3 -c "import json; d=json.load(open('content/source-manifest.json')); from collections import Counter; print(Counter(s['status'] for s in d['sources']))"  # → needs_check: 15, verified: 23, superseded: 11
python3 /tmp/opencode/qcount.py  # → english-a2 22, general-knowledge 62 (58+4), psychometric 26, telecom 54 (52+2)
```

Validación automática recomendada: añadir un test en `tests/syllabus-coverage.test.ts` que assertee `partial=23`, `missing=5`, `total=28`, `officialItems=9` para evitar regresiones de agregados.

1. (P0) Crear teoría trazada para el artículo de Compatibilidad electromagnética (verificar derechos de cesión Cemdal/REE).
2. (P0) Cubrir el capítulo II de la Declaración sobre la Red 2027 y el capítulo 3 del RCF.
3. (P0) Cubrir exposición de motivos y capítulo I de la Ley 31/1995.
4. (P0) Verificar edición vigente de la Declaración sobre la Red (diferencia V.0 ED 27/02/2026 vs. 31/07/2026).
5. (P1) Completar artículos omitidos en los 8 temas parciales; revisión independiente de los 256 claims `needs_review`.
6. (P1) Promover claims de `needs_review` a `reviewed` solo con evidencia primaria verificada.
7. (P1) Validar fuentes `needs_check` (MCER-A2, MET-PSI-01, EN 50121, cuadernillos ADIF).
