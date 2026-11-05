# ADIF 360 — Ciclo 15 · Preparación real del examen

Fecha: 2026-11-04 · Repositorio: /home/kiri_/projects/adif-web

## 1. Cobertura académica (informe Ciclo 14)

Nueve documentos oficiales. Cobertura global de syllabus: 66,67 % de nodos completamente
cubiertos (6/9), 2 parciales (DR cap. II, EBEP), 1 reference-only (CEM). No hay nodos
missing.

| Documento | Estado | Conceptos | Claims revisadas / pendientes | Preguntas |
|---|---|---|---|---|
| Igualdad (LO 3/2007) | cubierto (texto completo) | 15 | 0 / 25 (heredadas) | 71 (dominio compartido) |
| PRL (caps. I, III, V) | cubierto | 30 | 61 / 0 | 26 |
| Estatuto ADIF (caps. I–VI) | cubierto | 62 | 17 / 57 | 8 |
| Declaración sobre la Red 2027 | parcial documental | 38 | 1 / 118 | — |
| EBEP cap. VI tít. III | parcial documental | 7 | 20 / 4 | — |
| Incompatibilidades (Ley 53/1984) | cubierto | 16 | 17 / 0 | 1 |
| ICT (RD 346/2011) | cubierto (reservas editoriales) | 61 | 40 / 45 | 20 |
| Compatibilidad electromagnética | parcial (fuente secundaria) | 33 | 10 / 57 | — |
| RCF Libro 1 (caps. 1–5) | cubierto | 36 | 59 / 12 | 47 |

## 2. Situación documental

### A. Declaración sobre la Red 2027

- PDF exacto exigido por ADIF: edición general 31/07/2026, publicada en la página oficial
  de ADIF. Reconsulta 2026-11-04: HTTP 403. El adjunto DR del temario PNI26/01 y el
  artículo CEM también devuelven 403.
- Hashes históricos conservados (DR general 0c9d55a6…, adjunto PNI 362a3f68…, CEM
  2697bebd…). Hashes de snapshots locales distintos (DR 796b26bd…, CEM 01ff8ed8…).
- No se demuestra identidad byte a byte ni equivalencia entre ediciones.
- Teoría actual (cap. II, 38 conceptos, 119 claims) se basa en la edición V.0 (ED
  27/02/2026) conservada localmente; ADIF declara cambios en caps. 2, 4, 5 y 7 en la
  edición de julio de 2026.
- **Conclusión:** suficiente como material de estudio con reserva; no declarar cobertura
  oficial completa. Bloqueo documental mantenido.

### B. CEM

- Artículo REE de mayo de 2015, pp. 80–86, disponible localmente en
  `pdf/txt/02 Compatibilidad electromagnética y seguridad en los ferrocarriles.txt`
  (fuente secundaria técnica, cedida por Cemdal).
- El PDF asignado por ADIF devuelve 403 y su hash no coincide con el histórico.
- Conceptos exigidos (emisión, inmunidad, ensayos in-situ, normas EN 50121) contrastados
  con el artículo local; el módulo lo marca como needs_review para los claims CEM.
- **Conclusión:** contenido útil y complementario; no sustituye la normativa oficial. No
  atribuir al artículo contenido no comprobado.

### C. TREBEP

- PDF enlazado por ADIF (arts. 52–54) sigue inaccesible (403). URL y hash esperado en
  RESUMEN_TREBEP.md.
- Texto oficial utilizado: Ley 5/2015 (cap. VI, título III) consolidado, disponible
  localmente.
- Aplicación general al personal laboral de ADIF respaldada por arts. 2 y 7 TREBEP,
  art. 27 del Estatuto ADIF y apartados 4 y 12 de las instrucciones BOE de 2007.
- **Conclusión:** revisión académica realizada; bloqueo documental mantenido. No reabrir
  arts. 52–54 sin evidencia nueva.

### Solicitud manual para el usuario

Si dispone de acceso institucional o de una copia legítima, los documentos a obtener son:

1. Declaración sobre la Red ADIF 2027, edición general 31/07/2026 — URL oficial en la
   página de ADIF "Declaración sobre la Red 2027" (actualmente 403).
2. Adjunto DR del temario PNI26/01 (SHA-256 esperado
   362a3f68b7b81c0464515cf1ee026c785e6b1594395042d3e1d69c9255a4b080).
3. Artículo CEM (REE, mayo de 2015, pp. 80–86) — hash histórico 2697bebd… .
4. PDF TREBEP ADIF de octubre (arts. 52–54) — URL y hash en RESUMEN_TREBEP.md.

## 3. Preparación de examen

### Estructura oficial 2026

La convocatoria PNI26/01 (perfil 26/12PO) anuncia fecha provisional de examen 2026-12-12
y sedes (Barcelona, León, Madrid, Sevilla). ADIF no ha publicado instrucciones de examen
específicas para PNI26/01: tiempos, número de preguntas, penalización y baremo no están
verificados. El diseño histórico (45 min prueba común, 15 min específica, 4 opciones, 1
correcta, penalización aciertos − errores/3, blancos 0, mínimos 40 % por prueba y 100/200
global) se conserva como configuración simulada, no como regla oficial.

### Capacidad del banco para simulacros

Banco actual (revisado): 109 telecom (108 revisadas), 79 general-knowledge (71 revisadas
+ 8 PRL nuevas), 46 english-a2, 38 psicométricas. Distribución de claves: telecom
A28/B27/C27/D26 (spread 2, dentro del límite); general-knowledge A18/B18/C17/D18 (spread 1).
Los simulacros representativos son posibles en los bloques telecom y psicométrico;
el bloque inglés y el general requieren más ítems para variabilidad suficiente.

### Preguntas añadidas en este ciclo

Ninguna pregunta nueva en Ciclo 15 (el trabajo se centró en verificación documental y
preparación). Las preguntas reservadas de auditorías anteriores no se incorporan al
entrenamiento.

## 4. Evaluación del estudiante (funcionalidades existentes)

El curso permite, con las funcionalidades ya implementadas:

- Distinguir conceptos estudiados vs. dominados mediante el estado de revisión de las
  preguntas (reviewed/published) y los resultados de práctica.
- Registrar aciertos y fallos por sesión de práctica.
- Identificar áreas débiles por materia y por concepto (conceptIds en cada pregunta).
- Repasar con flashcards por módulo.
- Vincular cada pregunta a su fuente primaria (sourceId, sourceVersion, sourceLocator).

No se desarrollaron nuevas bases de datos ni sistemas de seguimiento en este ciclo, conforme
a la restricción de priorizar mejoras académicas.

## 5. Prueba final de preparación (batería inédita)

Se diseñó una batería reservada de 20 preguntas inéditas (no reutilizadas de ciclos
anteriores), equilibrada entre materias y proporcional al alcance oficial confirmado:

- 8 RCF (caps. 1–5): definiciones reglamentarias, excepciones, responsabilidades.
- 4 PRL (caps. III y V): equipos de trabajo, maternidad, Comité, Inspección.
- 4 ICT (anexos y artículos 8–10): consulta, proyecto, acta de replanteo.
- 2 Incompatibilidades: Profesor asociado, caso de contratación.
- 2 Igualdad: derechos de conciliación y permisos retribuidos.

Diseñador, verificador de claves, estudiante simulado y auditor académico se separaron.

Resultados (estudiante simulado, solo con teoría del curso):

- Aciertos: 17/20 (85 %).
- Suficiencia de teoría: 18/20 pleno, 2/20 parcial (ambas en ICT anexo III, donde la
  teoría enumera pero no desarrolla todos los apartados).
- Deficiencias: ninguna laguna demostrada en RCF ni PRL; ICT anexo III mejorable.
- Preguntas ambiguas: 0.
- Áreas no evaluables: DR cap. II y CEM (fuentes bloqueadas).
- Calidad de explicaciones: todas las preguntas incluyen explicación >20 caracteres con
  cita de fuente.

No se presenta esta evaluación como predicción de la nota de un opositor real.

## 6. Conclusiones y mejoras

### Veredicto del director académico

1. ¿Está completo el temario verificable? Sí para RCF (caps. 1–5), PRL (caps. I, III, V),
   Incompatibilidades, Igualdad e ICT (con reservas editoriales). No para DR cap. II,
   EBEP y CEM (bloqueo documental).
2. ¿Qué fuentes siguen bloqueadas? DR 2027 edición general, adjunto DR del temario
   PNI26/01, artículo CEM (REE 2015) y PDF TREBEP ADIF (arts. 52–54).
3. ¿Puede utilizarse ADIF 360 como curso principal? Sí, con apoyo, para RCF, PRL,
   Incompatibilidades, ICT e Igualdad. Con reservas para Estatuto (profundidad parcial),
   DR y CEM.
4. ¿Puede utilizarse como material exclusivo? No mientras DR y CEM estén bloqueados y
   Estatuto tenga artículos autogenerados de una frase.
5. ¿Las preguntas permiten entrenar de forma exigente? Sí en RCF y PRL; mejorable en
   variedad para inglés y psicométrico.
6. Cinco mejoras de mayor valor (ranking priorizado):
   1. Obtener y verificar las fuentes bloqueadas (DR 2027, CEM, TREBEP) — mayor impacto.
   2. Profundizar Estatuto: arts. 16, 17, 19, 43 y ADIF Alta Velocidad, con tabla
      Órgano → Función → Competencia → Referencia.
   3. Desarrollar ICT anexo III en profundidad (responsabilidades, tabla de doble entrada).
   4. Añadir preguntas en inglés y psicométrico para mejorar la variabilidad.
   5. Resolver la integración del filtro de mazo para tarjetas TREBEP.

## Validación

- Typecheck: PASS.
- Verify:content: PASS.
- Tests focalizados: PASS.
- Suite general: 93 archivos / 699 pruebas PASS.
- Verificación académica independiente: realizada (RCF 12/12, PRL 8/8, prueba final 17/20).
- `git diff --check`: limpio.

No se modificaron Supabase, autenticación ni persistencia. No se realizó push, merge ni deploy.
EOF
echo done