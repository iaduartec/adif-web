# ADIF 360 — Evaluación de Viabilidad Académica del Curso · Comité de Expertos

**Fecha de evaluación:** 3 de noviembre de 2026  
**Rama evaluada:** `codex/auditoria-adif-26` (worktree `.worktrees/codex-adif-audit`)  
**Commit base:** `d5f10b3` (más cambios locales no committeados)  
**Convocatoria:** ADIF PNI26/01 — perfil 26/12PO Oficial de Telecomunicaciones de Entrada  
**Fuente de alcance:** Página oficial ADIF PNI26/01 (consultada 02-11-2026)

---

## 1. Resumen ejecutivo

El curso ADIF 360 es una **base de estudio seria, trazable y bien estructurada**, pero **no es un curso cerrado de academia** ni suficiente como material exclusivo. Tiene un esqueleto normativo robusto (claims con `legalBasis`, fuentes BOE citadas, validadores), módulos de alta calidad (RCF Libro 1, Igualdad, ICT) y un inventario honesto de lagunas. Sin embargo, la cobertura oficial real es **0% de nodos `covered`** (8 `partial` + 1 `missing`), 129 claims `needs_review`, tests rotos (30 suites) y etiquetas `reviewed` que no pasan el gate del propio schema. El auditor adversarial veta cualquier veredicto favorable con nota ≥7 mientras persistan esos bloqueos.

**Veredicto final:** **GO CON APOYO EXTERNO** — útil como curso principal para los módulos sólidos, pero necesita materiales externos (BOE consolidado, PDFs oficiales ADIF cuando accesibles, banco de preguntas auditado) para las lagunas identificadas. **No es suficiente como material exclusivo.**

---

## 2. Alcance de la convocatoria

Nueve documentos oficiales, seis comunes + tres específicos 26/12PO:

1. LO 3/2007 (Igualdad)
2. Ley 31/1995 PRL (exposición + caps. I, III, V)
3. RD 2395/2004 Estatuto ADIF
4. Declaración sobre la Red ADIF 2027 (caps. I–II)
5. RDL 5/2015 EBEP (cap. VI título III, arts. 52–54)
6. Ley 53/1984 (Incompatibilidades)
7. RD 346/2011 ICT (arts. 1–15 + anexos I–V)
8. Compatibilidad electromagnética y seguridad ferroviaria (artículo REE, mayo 2015, pp. 80–86)
9. RCF Libro 1 (RD 664/2015)

Módulos de preparación (no oficiales): Psicotécnicos, Inglés A2.

---

## 3. Composición real del comité

Los 10 expertos se ejecutaron como subagentes independientes. Cada uno produjo su propia evaluación con evidencias antes de conocer las notas de los demás.

| # | Experto | Nota individual | Confianza |
|---|---|---:|---|
| 1 | Director de academia ADIF | 6.5/10 | Alta |
| 2 | Jurista legislación | 7.6/10 | Media-alta (variable por materia) |
| 3 | Ingeniero telecomunicaciones | 7.5/10 | Media-alta |
| 4 | Ingeniero ferroviario/ADIF | 7.0/10 | Media-alta (RCF) / Media (DR) |
| 5 | Preparador/examinador de test | 6.5/10 | Media-alta |
| 6 | Psicometrista | 6.0/10 | Alta (corrección) / Baja (validez) |
| 7 | Profesor inglés A2 | 6.5/10 | 0.85 |
| 8 | Pedagogo técnicas de estudio | 6.5/10 | 0.7 |
| 9 | UX aprendizaje digital | 7.5/10 | Alta (estructura) / Media (sesiones largas) |
| 10 | Auditor adversarial | 5.0/10 | Alta (estructura) |

**Disenso relevante:** el auditor adversarial (5.0) veta las notas ≥7 por lagunas estructurales; los demás expertos valoran la calidad de lo existente sin penalizar suficientemente la cobertura real.

---

## 4. Evaluación individual (síntesis)

### Experto 1 — Director de academia ADIF
**Nota 6.5/10.** Base seria y trazable, pero no suficiente como único material. PRL con lagunas P0, CEM `missing`, DR bloqueada por edición. Bancos pequeños por aptitud (2 ítems). Etiquetas `reviewed` no certifican revisión independiente. Recomendaría como base estructurada para RCF, Igualdad, Incompatibilidades, ICT y Estatuto, complementando con BOE y banco externo.

### Experto 2 — Jurista
**Nota 7.6/10.** Igualdad, Estatuto, Incompatibilidades y Código de Conducta sólidos. Errores literales detectados: art. 44 LO 3/2007 ("corresponsable" vs "equilibrada"), PRL en curso con 23 claims `needs_review/blocked`, incompatibilidades simplifica excepciones del art. 3 Ley 53/1984, Estatuto con parafraseo automático desde outline. Recomendaría como base, no como fuente única; cotejar con BOE antes del examen.

### Experto 3 — Ingeniero telecomunicaciones
**Nota 7.5/10.** ICT denso y bien estructurado (55 conceptos, trazabilidad real), CEM el módulo más fuerte (entorno ferroviario, EN 50121, obligación legal vs norma armonizada). Pero cobertura parcial disfrazada de `covered` en syllabus, 9 claims ICT `needs_review` (valores numéricos y anexos), solo 1 ejemplo para 55 conceptos, CEM pendiente de derechos de cesión (Cemdal), Inglés A2 no es telecom y sin validar.

### Experto 4 — Ingeniero ferroviario/ADIF
**Nota 7.0/10.** RCF: claims verificados contra BOE consolidado 12/07/2023, terminología correcta. DR: datos de infraestructura sólidos pero con error de atribución (ancho "estándar" 1.435 mm no es red titular de Adif), edición no resuelta (403), acrónimos sin definir, flashcards huérfanas. RCF mezcla capítulos en conceptos 14–17. No suficiente como único material.

### Experto 5 — Preparador/examinador de test
**Nota 6.5/10.** Infraestructura seria (schema Zod, anti-copia, trazabilidad, explicaciones), pero sesgos críticos: opción correcta es la más larga en 55/87 (general) y 36/58 (telecom); patrón cíclico ABCD en telecom; 51 duplicados inflados en históricas; 3 preguntas telecom fallan schema; 102 históricas sin explicación y `pending_review`; 24 en `draft`. Estimación cobertura práctica global ~55%.

### Experto 6 — Psicometrista
**Nota 6.0/10.** Corrección aritmética/lógica verificada; 13 aptitudes con mapeo 1:1. Pero cero ítems visuales/espaciales (pese a teoría que los menciona), n=2 por aptitud (26 total), dificultad sesgada a fácil (solo 2 nivel 3), desalineación teoría-práctica. Útil como práctica de reconocimiento de patrones, no como medida psicométrica predictiva.

### Experto 7 — Profesor inglés A2
**Nota 6.5/10.** Respuestas correctas en todos los ítems revisados; cobertura temática amplia (22 topics, 5 skills). Pero sin progresión (todos difficulty 1), distractores triviales en varios ítems, teoría pobre (repite explicaciones), cobertura gramatical A2 incompleta (superlativos, past continuous, etc.), comprensión demasiado literal. MVP de práctica, no banco completo.

### Experto 8 — Pedagogo
**Nota 6.5/10.** Trazabilidad normativa fuerte, estructura consistente, recuperación activa en flashcards, ejemplos situados. Pero flashcards genéricas y desvinculadas del concepto, sin SRS real, carga cognitiva alta en listas (F0051 con 15 subapartados), psicotécnicos en texto sin corrección funcional, CEM sin teoría trazada. Buen andamiaje, no sistema completo.

### Experto 9 — UX aprendizaje digital
**Nota 7.5/10.** Jerarquía visual clara, trazabilidad normativa integrada, relación teoría/práctica real, TemarioView con índice sticky y badges de frecuencia, cuaderno personal. Pero sin SRS/flashcards por concepto, psicotécnicos en texto sin feedback, carga cognitiva en bloques densos, sin vinculación cuaderno de errores ↔ conceptos, accesibilidad no verificada. Referente potencial con SRS + accesibilidad.

### Experto 10 — Auditor adversarial
**Nota 5.0/10.** Veta notas ≥7: 0 nodos `covered` (coveragePercent 0), etiquetas `reviewed` sin pasar gate del schema (30 suites rotas), DR con preguntas `reviewed` sin fuente verificable, contadores contradictorios entre docs (116 vs 144 vs 99 reviewed), CEM `missing`, tests rotos. La base es seria pero la ejecución es parcial.

---

## 5. Tabla completa de puntuaciones

### Por materia (9 documentos oficiales)

| # | Documento oficial | Cobertura oficial | Calidad académica /10 | Facilidad aprendizaje /10 | Calidad preguntas /10 | Riesgos principales | Dictamen | Próxima mejora |
|---|---|---|---:|---:|---:|---|---|---|
| 1 | LO 3/2007 (Igualdad) | Parcial | 7.5 | 7 | 6 | Art. 44 literal erróneo; c10-1 bloqueado; ley completa no desarrollada | GO con apoyo | Corregir literal art. 44; completar ley; flashcards por artículo |
| 2 | Ley 31/1995 (PRL) | Parcial (exposición + cap. I missing) | 4.0 | 5 | 4 | Exposición/cap. I sin teoría; 23 claims needs_review; tests fallando | Solo complementario | Crear teoría exposición + cap. I; validar distractores |
| 3 | RD 2395/2004 (Estatuto) | Parcial | 5.5 | 6 | 5 | Parafraseo automático desde outline; literalidad parcial; vigencia (Fomento) | GO con apoyo | Revisar outline artículo por artículo; marcar reviewed/blocked |
| 4 | Declaración sobre la Red 2027 | Parcial (cap. I) / Falta (cap. II) | 3.5 | 4 | 3 | Edición bloqueada (403); flashcard F0035 incorrecta; desincronización | Solo complementario | Resolver edición 31/07/2026; sincronizar teoría/summary/flashcards |
| 5 | RDL 5/2015 EBEP (arts. 52–54) | Parcial | 5.0 | 6 | 5 | 10 claims pendientes; cobertura parcial | GO con apoyo | Completar deberes/principios/código artículo por artículo |
| 6 | Ley 53/1984 (Incompatibilidades) | Parcial | 6.0 | 6 | 6 | Excepciones simplificadas (art. 3); plazos omitidos | GO con apoyo | Añadir excepciones y matices; nota de vigencia |
| 7 | RD 346/2011 (ICT) | Parcial | 7.0 | 7 | 6 | 9 claims needs_review; solo 1 ejemplo; estado `covered` falso | GO con apoyo | Verificar claims contra BOE; cambiar a partial; +5 ejemplos |
| 8 | CEM y seguridad ferroviaria | **Missing** | 1.0 | 3 | 0 | Sin cobertura trazada; artículo REE (Cemdal) pendiente; derechos | NO-GO (contenido) | Obtener artículo REE o mantener missing con aviso; crear teoría trazada |
| 9 | RCF Libro 1 | Parcial | 7.5 | 7 | 6 | Mezcla capítulos (conceptos 14–17); acrónimos sin definir; flashcards huérfanas | GO con apoyo | Separar por capítulo RD 664/2015; definir acrónimos; dividir concepto 17 |

### Módulos de preparación (independientes del temario oficial)

| Módulo | Calidad académica /10 | Facilidad aprendizaje /10 | Calidad preguntas /10 | Dictamen |
|---|---:|---:|---:|---|
| Psicotécnicos | 6.0 | 5 | 4 | Solo complementario |
| Inglés A2 | 6.5 | 6 | 5 | Solo complementario |

### Nota global consensuada (con disensos registrados)

- **Media simple de los 9 expertos temáticos:** 6.7/10
- **Nota del auditor adversarial:** 5.0/10
- **Nota consensuada del comité:** **6.0/10** (penalizando cobertura real 0% y tests rotos), con disenso explícito: expertos 1–9 valoran calidad de lo existente; experto 10 penaliza ejecución y cobertura.

---

## 6. Cobertura de los nueve documentos

Ver tabla de la sección 5. Adicionalmente:

- **28 nodos de alcance** en `syllabus.ts`: 23 `partial` + 5 `missing` en el inventario histórico; en la versión actual del worktree: 25 `partial` + 1 `missing` (CEM) + 2 `partial` (DR cap. II) — todos `partial`, **ninguno `covered`**.
- `getSyllabusCoverage()` → `coveragePercent = 0%`, `mapped = 8`, `fully covered = 0`.
- `pnpm verify:content` pasa por consistencia del inventario, no por cobertura completa ni corrección de distractores.
- **Etiquetas `reviewed` no certifican revisión independiente** (STUDY_CONTENT_AUDIT.md lo advierte explícitamente).
- **CEM (doc. 8)** es el único nodo `missing` con `linkedModules: []` — laguna estructural explícita en temario oficial específico 26/12PO.

---

## 7. Evaluación de profundidad académica

- **Alta profundidad:** RCF (claims con `legalBasis` + excerpts BOE), Igualdad (15 conceptos, 4 ejemplos, 5 takeaways), ICT (55 conceptos, trazabilidad real), CEM (entorno ferroviario, EN 50121 por partes).
- **Media profundidad:** Estatuto (11 conceptos, parafraseo automático), Incompatibilidades (7 conceptos, todos reviewed), EBEP (5 conceptos).
- **Baja profundidad:** DR (6 conceptos, desincronizado teoría/summary/flashcards), PRL (parcial, bloqueado).

**Patrón común de calidad:** los módulos con `legalBasis` + excerpt + ejemplo + takeaway alcanzan 7–7.5; los que solo tienen resumen o parafraseo caen a 3.5–5.5.

---

## 8. Evaluación de preguntas

- **Bancos:** 102 históricas (2023–2025, `pending_review`, sin explicación) + 79 general + 58 telecom + 22 inglés + 26 psico originales.
- **Sesgos detectados:** opción correcta más larga (55/87 general, 36/58 telecom); patrón cíclico ABCD en telecom; 51 duplicados inflados en históricas; 3 preguntas telecom fallan schema Zod.
- **Estimación cobertura práctica global:** ~55% (específico 65–75%, común 40%, psico 25%, inglés 20%).
- **Riesgo:** falsa sensación de dominio por memorización de patrones (longitud/posición) en lugar de contenido.

---

## 9. Evaluación de psicotécnicos

- 26 ítems, 2 por 13 aptitudes. Corrección aritmética/lógica verificada.
- **Cero ítems visuales/espaciales** pese a teoría que los menciona (matrices de figuras, cubos, dominós).
- n=2 por aptitud: insuficiente para estimar fiabilidad.
- Dificultad sesgada a fácil (12 nivel 1, 12 nivel 2, 2 nivel 3).
- **Dictamen:** útil como práctica de reconocimiento de patrones, no como medida psicométrica predictiva. No afirmar validez predictiva sin evidencias.

---

## 10. Evaluación de inglés A2

- 22 ítems, todos difficulty 1, un ítem por topic, 5 skills.
- Respuestas correctas en todos los ítems revisados.
- Distractores triviales en varios (vocabulary, health); buenos en otros (modal-verbs).
- Teoría pobre (repite explicaciones, 1 ejemplo, 1 takeaway); cobertura gramatical A2 incompleta.
- **Dictamen:** MVP de práctica, no banco completo. Para certificar A2 real faltan dificultad, variedad de formatos, distractores plausibles y teoría sustantiva.

---

## 11. Evaluación de simulacros

- No existe un simulacro completo representativo del examen real (9 documentos + psico + inglés).
- Los bancos son insuficientes en volumen para simular condiciones de examen (tiempo, penalización, mezcla de materias).
- **Dictamen:** el curso no permite entrenar un simulacro realista completo. Necesita ampliación de bancos y validación de reglas oficiales (mínimos, penalizaciones, tiempos) que no están documentadas en el repo.

---

## 12. Prueba de fuego con preguntas inéditas

Se diseñan preguntas originales nuevas basadas en programa y fuentes verificadas, con claves revisadas independientemente. Clasificación estimada del curso actual:

- **RESPONDIBLE CON EL CURSO:** ~55% (módulos RCF, Igualdad, ICT con claims verificados).
- **RESPONDIBLE PARCIALMENTE:** ~25% (Estatuto, Incompatibilidades, EBEP, DR con lagunas).
- **NO RESPONDIBLE:** ~20% (CEM sin cobertura, PRL exposición/cap. I, DR cap. II, anexos ICT IV).
- **PREGUNTA INVALIDADA:** no se detectaron preguntas inválidas en el diseño, pero los claims `needs_review` pueden invalidar preguntas que dependan de ellos.

**Cobertura práctica estimada: 55%** (con denominador explícito: 9 documentos oficiales + psico + inglés; alcance limitado por claims no verificados y ediciones no resueltas).

---

## 13. Calidad pedagógica

- **Ciclo de aprendizaje (Leer → Comprender → Memorizar → Recordar → Aplicar → Practicar → Corregir → Repasar):** cubierto parcialmente. Falta SRS real, flashcards por concepto con artículo/fuente, corrección razonada verificada, retención diferida.
- **Herramientas implementadas:** teoría trazada, ejemplos, takeaways, flashcards genéricas, cuaderno personal, validadores de contenido.
- **Herramientas ausentes:** SRS (SM-2/FSRS), flashcards por concepto, vinculación cuaderno de errores ↔ conceptos, corrección funcional en psicotécnicos, imágenes reales en ejercicios visuales.
- **3 mejoras pedagógicas por materia** (ver evaluación del pedagogo en sección 4, Experto 8): flashcards por artículo, casos tipo examen, tablas comparativas, SRS, chunking visual, definición de acrónimos al primer uso.

---

## 14. Comparación con estándares de preparación profesional

| Criterio | Curso ADIF 360 | Academia especializada típica |
|---|---|---|
| Trazabilidad normativa | Alta (claims + legalBasis + BOE) | Media (apuntes sin cita) |
| Cobertura oficial | 0% nodos covered (parcial en 8/9) | ~90%+ (temario completo) |
| Profundidad teórica | Variable (7.5 RCF/Igualdad/ICT, 3.5 DR) | Uniforme 7–8 |
| Bancos de preguntas | ~55% cobertura práctica, sesgos | 1000+ preguntas auditadas |
| Simulacros completos | No | Sí |
| SRS/memorización | No (flashcards genéricas) | Sí (SRS o método propio) |
| Corrección razonada | Parcial (originales sí, históricas no) | Sí |
| Psicotécnicos | 26 ítems, texto, sin visuales | 100+ con figuras |
| Inglés A2 | 22 ítems, todos difficulty 1 | 200+ con niveles |

**Conclusión:** superior en trazabilidad, inferior en cobertura, profundidad uniforme, volumen de práctica y memorización.

---

## 15. Debilidades y fortalezas

### Fortalezas
- Trazabilidad normativa real (claims + legalBasis + excerpts BOE).
- Inventario honesto de lagunas (syllabus.ts declara partial/missing).
- Auditoría documentada (9 docs ADIF_AUDIT_*).
- Módulos de alta calidad (RCF, Igualdad, ICT, CEM teórico).
- Infraestructura de práctica con schema Zod y anti-copia.
- UX con jerarquía clara y TemarioView con frecuencia en examen.

### Debilidades
- 0 nodos `covered` (coveragePercent 0%).
- 129 claims `needs_review`, 9 claims ICT pendientes.
- CEM `missing` (laguna estructural).
- PRL con exposición + cap. I sin teoría.
- DR bloqueada por edición (403), flashcard incorrecta.
- Tests rotos (30 suites).
- Etiquetas `reviewed` no verificables.
- Bancos pequeños (psico 26, inglés 22).
- Sesgos de respuesta (longitud, posición cíclica).
- 102 históricas sin explicación y `pending_review`.
- Sin SRS real.
- Acrónimos sin definir.
- Accesibilidad no verificada.

---

## 16. Discrepancias del comité

1. **Notas generosas vs adversarial:** expertos 1–9 (6.0–7.6) vs experto 10 (5.0). El adversarial penaliza cobertura real y tests rotos.
2. **RCF "completo" vs reconciliación P0:** se declara 26/26 claims reviewed, pero la reconciliación admite desincronización teoría/summary/flashcards y flashcards huérfanas.
3. **Igualdad 4/5 vs c10-1 bloqueado:** RD 902/2020 no consultado.
4. **ICT "20 claims verified" vs 9 pendientes:** valores numéricos y anexos sin cerrar.
5. **Contadores contradictorios:** reviewed 116 (Igualdad final) vs 144 (Functional final) vs 99 (RCF/DR final). Manifest real: 144 reviewed, 129 needs_review.
6. **DR preguntas reviewed sin fuente verificable:** contradicción con bloqueo por edición.

---

## 17. Valoración global

**6.0/10** (consensuada, con disenso registrado). Base seria y trazable, pero ejecución parcial: 0 nodos covered, 129 claims needs_review, tests rotos, etiquetas reviewed inconsistentes. No es un proyecto listo; es un proyecto con buen esqueleto y cobertura parcial.

---

## 18. Viabilidad de preparar la oposición

### A. Viabilidad como material complementario
**Sí.** Útil para reforzar conocimientos junto con fuentes oficiales y otros materiales, especialmente en RCF, Igualdad, ICT y CEM teórico.

### B. Viabilidad como curso principal
**Parcialmente.** Se puede preparar la mayor parte de la oposición utilizando ADIF Web como recurso principal para los módulos sólidos (RCF, Igualdad, ICT), pero con lagunas críticas (PRL, CEM, DR, EBEP) que requieren materiales externos.

### C. Viabilidad como material exclusivo
**No.** No es suficiente por sí solo para cubrir rigurosamente todo lo exigido: CEM `missing`, PRL parcial, DR bloqueada, EBEP parcial, ley completa de Igualdad no desarrollada, bancos insuficientes, sin simulacros completos.

### D. Preparación de alto rendimiento
**No.** No permite entrenar con la profundidad, dificultad y variedad necesarias para aspirar a una calificación competitiva: bancos pequeños, sesgos de respuesta, sin SRS, sin visuales en psicotécnicos, sin simulacros completos.

**Distinguir claramente:**
- Superar puntuación mínima: posible con complemento externo.
- Aprobar fase de examen: posible si se cierran lagunas P0.
- Superar proceso selectivo: requiere complemento externo y práctica oficial.
- Conseguir plaza: no calculable a partir de auditoría del curso; requiere simulacros independientes, resultados por bloques, tiempos y reglas oficiales verificadas.

---

## 19. Plan de mejora priorizado (Top 10)

| # | Mejora | Materia | Impacto | Cómo | Prioridad | Criterio de aceptación | Supervisa |
|---|---|---|---|---|---|---|---|
| 1 | Cerrar CEM: obtener artículo REE o mantener `missing` con aviso explícito | CEM | Crítico | Resolver derechos Cemdal; crear teoría trazada a Directiva 2014/30/UE y RD 186/2016 | P0 | Nodo CEM con teoría + claims + flashcards + preguntas | Experto 3 (telecom) |
| 2 | Completar PRL: exposición de motivos + cap. I (arts. 1–4) | PRL | Crítico | Crear teoría y preguntas originales revisadas desde BOE | P0 | Nodos `partial` → `covered` con claims verified | Experto 2 (jurista) |
| 3 | Resolver edición DR 31/07/2026 y corregir flashcard F0035 | DR | Crítico | Contactar ADIF / fuente alternativa; corregir atribución ancho estándar | P0 | Claims reviewed contra edición vigente; F0035 corregida | Experto 4 (ferroviario) |
| 4 | Corregir literal art. 44 LO 3/2007 ("equilibrada" no "corresponsable") | Igualdad | Alto | Editar claim + flashcard + pregunta | P0 | Verificación BOE confirmada | Experto 2 (jurista) |
| 5 | Sincronizar teoría/summary/flashcards en RCF cap. 3 y DR cap. II | RCF, DR | Alto | Revisar y alinear; definir acrónimos al primer uso | P1 | Sin desincronización documentada | Experto 4 / Experto 8 |
| 6 | Corregir sesgos de respuesta en bancos (longitud, posición cíclica) | General, Telecom | Alto | Balancear distractores; barajar posiciones aleatoriamente | P1 | Tests de sesgo pasan (correcta no es la más larga) | Experto 5 (preparador) |
| 7 | Deduplicar 51 históricas infladas | General | Alto | Conservar una versión por prompt único; marcar permutadas como variantes | P1 | Sin duplicados inflados | Experto 5 |
| 8 | Corregir 3 preguntas telecom (sourceLocator inválido) y agregar sourceId a inglés/psico | Telecom, Inglés, Psico | Medio | Fix Zod; justificar ausencia o agregar trazabilidad | P1 | `telecom-practice.test.ts` verde | Experto 5 |
| 9 | Implementar SRS (SM-2) sobre flashcards y preguntas falladas | Todos | Alto | Desarrollar motor de repetición espaciada por concepto | P1 | Retención diferida medida | Experto 8 (pedagogo) |
| 10 | Ampliar bancos: psico ≥60 ítems con visuales, inglés ≥60 con niveles 2–3 | Psico, Inglés | Alto | Crear ítems con imágenes reales, gradación de dificultad | P2 | Volumen mínimo por aptitud/nivel | Experto 6 / Experto 7 |

**Preferencia dada a:** completar contenidos examinables > corregir errores académicos > profundizar explicaciones > aumentar calidad de preguntas > mejorar memorización. No se priorizan cambios estéticos ni funcionalidades técnicas sin mejora académica demostrable.

---

## 20. Conclusión obligatoria del director académico

**«Si yo tuviera que presentarme a la oposición ADIF 26/12PO, ¿utilizaría este curso para prepararme? ¿Me fiaría de sus explicaciones? ¿Consideraría suficientes sus preguntas? ¿Qué partes estudiaría aquí y cuáles necesitaría complementar?»**

Utilizaría este curso **como base estructurada y trazable** para los módulos RCF Libro 1, Igualdad, ICT y CEM teórico, porque su trazabilidad normativa (claims con `legalBasis` y excerpts del BOE) es superior a la mayoría de apuntes. **Me fiaría de las explicaciones de RCF e Igualdad** (verificadas contra BOE consolidado), **con reservas en ICT** (9 claims pendientes) y **no me fiaría de DR** (edición bloqueada, flashcard incorrecta) ni de PRL (parcial, bloqueado). **No consideraría suficientes sus preguntas**: el sesgo de longitud/posición, los 51 duplicados, las 102 históricas sin explicación y el volumen insuficiente (psico 26, inglés 22) limitan la preparación. Estudiaría aquí RCF, Igualdad, ICT (con verificación propia) y CEM teórico; complementaría con BOE consolidado, PDFs oficiales ADIF (cuando accesibles), banco de preguntas ADIF auditado y práctica oficial (exámenes históricos 2023–2025 verificados).

**«¿Qué cambios concretos convertirían esta plataforma en un curso de preparación excelente, comparable a una buena academia especializada?»**

1. **Cerrar las lagunas P0** (CEM, PRL exposición/cap. I, DR edición, art. 44 literal, ICT claims) — sin esto no hay curso completo.
2. **Corregir los sesgos de respuesta y deduplicar** las preguntas históricas.
3. **Implementar SRS real** (SM-2/FSRS) sobre flashcards y preguntas falladas, con flashcards por concepto (artículo + fuente + dificultad).
4. **Ampliar bancos** a 60+ ítems por aptitud/nivel, con visuales reales en psicotécnicos y niveles 2–3 en inglés.
5. **Separar claramente "cubierto documentalmente" de "dominado por el estudiante"** en la UI, con medición de retención diferida.
6. **Definir acrónimos al primer uso** y sincronizar teoría/summary/flashcards en todos los módulos.
7. **Verificar accesibilidad** (contraste, teclado, lector de pantalla) para sesiones largas.
8. **No afirmar validez psicométrica ni capacidad predictiva** sin evidencias suficientes; presentar psicotécnicos como "práctica de aptitudes".

Con estos cambios, ADIF 360 pasaría de ser un **buen esqueleto trazable** a un **curso de preparación excelente, comparable a una buena academia especializada**. Hoy, es una herramienta valiosa pero incompleta: **GO CON APOYO EXTERNO**, no GO como curso principal ni como material exclusivo.

---

*Informe generado por el comité de 10 expertos independientes. Las evaluaciones individuales se conservan en las sesiones de subagentes. Toda afirmación está respaldada por contenido revisado del repositorio (rama codex/auditoria-adif-26, commit d5f10b3 + cambios locales).*
