# 09 — Dictamen académico independiente

## Veredicto: GO CON APOYO EXTERNO, provisional

**No recomendaría estudiar exclusivamente con ADIF 360.** Puede servir de curso principal acompañado por las fuentes exigidas y un preparador que complete las lagunas, pero esta auditoría es exploratoria y no demuestra cobertura íntegra. DR y CEM no pudieron cotejarse contra los adjuntos completos y la clasificación de ICT presenta una contradicción entre `covered` y descripciones explícitamente parciales. La definición resumida de estación RCF omite un supuesto. La teoría de igualdad no demuestra el desarrollo de toda la ley. La decisión no implica probabilidad de aprobado ni equivale a un GO sin reservas.

## Alcance y método

El [programa oficial ADIF](https://www.adif.es/w/pni26-01-personal-operativo) lista seis documentos comunes y tres específicos 26/12PO. Las revisiones de materias se hicieron primero con convocatoria, fuentes primarias accesibles y archivos actuales; los ciclos anteriores se compararon después. El director tuvo exposición accidental a fragmentos truncados de informes previos durante el trabajo; los revisores que emitieron las evaluaciones independientes recibieron contexto nuevo y no leyeron esas conclusiones. Son agentes Codex Luna reales, no profesionales humanos ni agentes nativos WorkBuddy. Se agruparon algunas disciplinas y los papeles se repartieron en ejecuciones separadas; no se realizó una revisión exhaustiva por cada uno de los nueve perfiles imaginados.

El checkout era `main` en `9efd1abbe92a9e04aaa61089c265c2794ff4d581`, con trabajo local previo extenso. Se preservaron cambios y baterías históricas. Ninguna teoría, banco, validador o gate se modificó. El estudio de archivos no sustituye ensayo con usuarios ni demuestra desplegados.

## Qué ofrece y qué falta

- **Alcance:** los nueve documentos están identificados; no está demostrada la cobertura de todos sus apartados. La [matriz](01_MATRIZ_COBERTURA.md) identifica bloques concretos y documentos N/E. El capítulo II de PRL no está en el recorte exigido: no se debe contabilizar como carencia.
- **Exactitud:** en las muestras contrastadas no se ha demostrado un P0 jurídico ni un parámetro ICT incorrecto. Esto es un resultado de muestra, no prueba de ausencia de errores. Se verificó una omisión en la síntesis de estación de RCF. En materia documental se separa el BOE actual del PDF exacto de ADIF; el acceso parcial al PDF TREBEP no demuestra su identidad completa, y CEM y DR siguen pendientes de cotejo.
- **Profundidad:** PRL y RCF contienen explicaciones y casos sobre apartados importantes; TREBEP ofrece matices sobre aplicación y conducta. ICT presenta guías prácticas de recintos y cronología; no se han verificado completos los anexos. Estatuto, igualdad e incompatibilidades precisan contraste artículo a artículo, excepciones y aplicación. No se ha establecido que un bloque sea «excelente» para el programa completo.
- **Preguntas:** 108 específicas, 79 generales, 46 inglés y 38 psicotécnicas revisadas/elegibles. Revisión independiente de 6 por banco, más 12 SVG estáticos: ninguna clave errónea demostrada en esa muestra. Los ejercicios de atención etiquetados como memoria, algunas trampas fáciles y concentración temática reducen la fuerza diagnóstica. No se afirma suficiencia de cantidad ni representatividad del examen. Véase [bancos](05_AUDITORIA_PREGUNTAS.md).
- **Pedagogía:** hay explicaciones, ejemplos y recursos de repaso. Cobertura, profundidad y facilidad para aprender desde cero no están acreditadas por pruebas con alumnos. Los juicios por dimensión están en [pedagogía](06_AUDITORIA_PEDAGOGICA.md); se marcan N/E notas numéricas que la evidencia no puede sostener.
- **Prueba de fuego:** 14 propuestas, 3 excluidas por no pertenecer al recorte, 11 pertinentes. Alumno simulado acertó 11, pero una respuesta usó un extracto interno no mostrado en la vista: solo las otras 10 son estrictamente atribuibles a la teoría visible revisada. Suficiencia: 8/11 plena, 2/11 parcial y 1/11 sin soporte visible localizado. No hubo preguntas válidas de Estatuto ADIF, DR, CEM, inglés o psicotécnicos. [Metodología y reservas](07_PRUEBA_FUEGO.md).

## Rúbrica y notas

Rúbrica interna solicitada: cobertura 25 %, exactitud 30 %, profundidad 15 %, pedagogía 10 %, preguntas 15 % y memorización 5 %. Para ninguno de los nueve documentos se ha completado un cotejo suficientemente estratificado de todas esas dimensiones: **nota global por documento N/E**. No se calcula media global, ni se convierten fuentes bloqueadas en cero. Las observaciones parciales y fortalezas están documentadas por módulo; una nota numérica precisa ocultaría la incertidumbre.

## Diez mejoras de mayor impacto

| Prioridad | Documento | Problema | Evidencia | Solución | Esfuerzo |
|---|---|---|---|---|---|
| BLOQUEADO | CEM | Artículo asignado no cotejado | 403 y hash histórico sin bytes actuales | Recuperar copia legítima exacta y cotejar contenido, figuras y versión | Medio, sujeto a fuente |
| BLOQUEADO | DR 2027 | Ediciones y adjunto no cotejados | V0 frente a edición julio y adjunto | Comparar archivos íntegros, diferencias y claims | Alto, sujeto a fuente |
| P1 | ICT | `covered` contradice sus propios rationales | `content/syllabus.ts:278–284` | Inventariar por apartado, corregir teoría antes de métricas | Alto |
| P1 | RCF 1.1.1.3 | Definición estación omite condición de dos instalaciones | `content/theories/rcf-libro-1.ts:399` | Completar supuesto y cotejar todas las definiciones exigidas | Medio |
| P1 | Igualdad | Ley completa no acreditada por selección de conceptos | `content/theories/igualdad.ts`; BOE LO 3/2007 | Matriz por títulos y artículos; añadir excepciones demostradas | Alto |
| P1 | Estatuto ADIF | Escasa evidencia de detalle de competencias | `content/theories/estatuto-adif.ts` | Cuadro órgano–función–condición, contrastar artículo a artículo | Alto |
| P1 | Incompatibilidades | Art. 1.3 solo localizado en excerpt no mostrado en teoría | `content/theories/incompatibilidades.ts:31`, lector de teoría | Confirmar representación visible y desarrollar regla y excepciones | Bajo |
| P1 | RCF y PRL | Muestra insuficiente para acreditar excepciones completas | auditorías 02 y 04 | Muestreo estratificado de capítulos y prueba externa por incisos | Alto |
| P2 | Bancos | Concentración, distractores y taxonomía | auditoría 05 | Tras corregir teoría, revisar pares y diseñar casos variados con distractores plausibles | Alto |
| P2 | Inglés y psicotécnicos | Dificultad concentrada en básico y sin calibración | etiquetas y muestra 05 | Mejorar variedad de contextos, aptitudes y retroalimentación; no prometer validez estadística | Medio |

No se han inventado frecuencias de examen. Antes de adoptar cambios académicos, completar los cotejos y resolver las fuentes; la priorización refleja alcance e impacto, no probabilidad de aparición de una pregunta. Los hallazgos y desacuerdos figuran en [revisión adversarial](08_REVISION_ADVERSARIAL.md).
