# Auditoría inicial del contenido de estudio — ADIF 26/12PO

Fecha: 2 de noviembre de 2026. Esta matriz inventaría los datos y etiquetas del repositorio; **no es una revisión académica concepto por concepto**, ni certifica vigencia, exhaustividad, corrección de respuestas o dominio del estudiante. La prioridad expresa necesidad de revisión y estudio, no predice preguntas ni frecuencia de examen.

## Muestra contrastada el 2 de noviembre de 2026

Se contrastaron las claves de `orig-tel-ict-002`, `-029` y `-033` con el [RD 346/2011, artículo 2.1 y anexo I, apartados 4.2.1 y 2.3.1](https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834), y las de `orig-gen-prl-001`, `-002` y `-004` con la [Ley 31/1995, artículos 14.1, 15.1.a y 21.2](https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292). Las seis claves eran compatibles con los textos consultados. En `orig-gen-prl-004` se ha precisado que el abandono del lugar procede **en caso necesario**, matiz omitido en la opción y explicación originales. Esta muestra no verifica el resto de preguntas, distractores, temario ni las versiones concretas de los documentos de examen.

Se revisaron además `orig-tel-ict-001` y `orig-tel-ict-003` a `007` contra el [RD 346/2011 consolidado en el BOE](https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834): la versión consolidada indica actualización global publicada el 26/03/2025, mientras que el anexo III indica actualización publicada el 03/10/2019. El identificador interno `consolidated-page-2026-10-15` identifica la captura registrada, no una fecha de publicación normativa. Se corrigió la explicación del ítem 001 y la trazabilidad de 004 y 005 al anexo III. La versión antigua 006 se conserva en borrador porque contenía una prohibición absoluta no respaldada por el apartado citado; la pregunta corregida se identifica como `orig-tel-ict-006-v2` y se fundamenta en el anexo III, apartado 5.7. Los intentos anteriores conservan el ID antiguo. La migración correctora es local y no se ha aplicado remotamente. La revisión de esta muestra no certifica los demás ítems ni sus distractores.

En una comprobación adicional de la fuente se detectó que `orig-tel-ict-017` atribuía al anexo II, apartado 7.2.3, una descripción del anillo de tierra de los recintos que figura en el anexo III, apartado 7.1. Se conserva la versión anterior en borrador y se añade `orig-tel-ict-017-v2` con la fuente correcta y la precisión de que el anillo se aplica a recintos no modulares; también se corrige el concepto `ict-concept-10`. La migración local desactiva los dos IDs antiguos sin modificar los intentos históricos y registra las versiones nuevas. No se ha aplicado en producción.

## Cobertura de los documentos del temario

El inventario local `content/syllabus.ts`, basado en capturas identificadas como octubre de 2026, clasifica nueve documentos padres: ocho parciales y uno sin cobertura del material oficial. El validador pasa porque verifica consistencia del inventario, no porque garantice cobertura completa. La actualización actual de cada texto y su cotejo con el documento de ADIF y BOE siguen pendientes.

| Materia / documento | Cobertura registrada | Riesgo o acción | Prioridad inicial |
|---|---|---|---|
| Igualdad, LO 3/2007 | Parcial | El PDF se inventaría como ley completa; la teoría selecciona artículos. Revisar conceptos omitidos y versión. | 1 |
| PRL, Ley 31/1995 | Parcial | Exposición y capítulo I sin teoría vinculada; capítulos III y V parciales. | 1 |
| Estatuto ADIF, RD 2395/2004 | Parcial | Seis capítulos con artículos seleccionados. | 1 |
| Declaración sobre la Red 2027, capítulos I–II | Parcial | Capítulo II sin cobertura vinculada; preguntas originales del área en borrador. Verificar edición y documento primario. | 1 |
| EBEP, capítulo VI título III | Parcial | Revisar deberes y código de conducta, artículos 52–54. | 1 |
| Incompatibilidades, Ley 53/1984 | Parcial | Se inventaría la ley completa; contrastar excepciones y plazos. | 1 |
| ICT, RD 346/2011 | Parcial | El anexo III ya tiene algunos conceptos vinculados; faltan secciones, como ocurre también en otros capítulos y anexos. | 1 |
| Compatibilidad electromagnética y seguridad ferroviaria | Sin cobertura trazada al documento oficial | Existe teoría relacionada, pero no demuestra cobertura del artículo concreto. Comprobar fuente y derechos. | 1 |
| RCF, libro 1 | Parcial | Capítulo 3 sin teoría vinculada; capítulos restantes parciales. | 1 |

Estos niveles son provisionales y se asignan por lagunas documentales; faltan datos personales de dominio y evidencia suficiente para ordenar los nueve entre sí.

## Bancos y aprendizaje

| Área | Inventario medido | Utilidad y limitaciones |
|---|---|---|
| Histórico específico | 102 registros, 2023–2025; seis formularios importados | No equivalen a 102 preguntas independientes ni a exámenes completos. Los registros tienen vigencia pendiente y los controles de publicación/corrección bloquean la práctica. No activar sin resolver evidencia y derechos. |
| Conocimiento general original | 62: 58 con etiqueta editorial `reviewed`, 4 `draft` | La etiqueta no acredita revisión normativa independiente ni vigencia actual. Los cuatro borradores son de Declaración sobre la Red. |
| Telecomunicaciones original | 52 con etiqueta `reviewed`, 2 versiones anteriores en `draft` | El archivo contiene 54 registros; dos IDs antiguos permanecen como borradores y la práctica depende del registro privado/migración. No implica cobertura completa ni revisión externa de todas las soluciones. |
| Inglés A2 | 22 originales con etiqueta `reviewed`; todas de dificultad 1 | Cobertura de la taxonomía no demuestra nivel validado ni variedad suficiente. Mantener separado del denominador del temario oficial. |
| Psicotécnicos | 26 originales con etiqueta `reviewed`, dos por cada una de 13 aptitudes | La rama de auditoría permite responder/corregir y registra intentos; dos ejercicios por aptitud no sostienen variedad ni estimación estable. Hay aptitudes visuales representadas en texto. |

Todas las cifras se refieren a los JSON del repositorio, no a la disponibilidad efectiva para responder. Las preguntas originales no se atribuyen a ADIF. Los metadatos `reviewed` no prueban por sí solos una revisión independiente ni que cada explicación descarte adecuadamente los distractores.

## Matriz materia → tema → nodo de temario

El repositorio registra 28 nodos de alcance: 23 `partial` y 5 `missing`; ninguno figura `covered`. Esta tabla cruza esa cobertura con el número de preguntas que tienen el mapeo correspondiente en el JSON. “Históricas” son transcripciones locales 2023–2025, **no habilitadas para práctica**; “originales” son registros brutos, pueden incluir borradores o versiones retiradas y no equivalen a preguntas elegibles. Dominio personal: **desconocido en todos los nodos** (sin datos de una cuenta del estudiante). Importancia significa pertenencia al alcance oficial, no predicción de aparición.

Los localizadores y versiones exactos son los campos `sourceId`, `sourceVersion` y `sourceLocator` de [`content/syllabus.ts`](../content/syllabus.ts); los PDFs ADIF enlazados están identificados como `adif-live-2026-10-15`. La [página oficial actual de ADIF](https://www.adif.es/w/pni26-01-personal-operativo) se consultó el 2-11-2026. Los PDF específicos dieron 403, por lo que no se cotejaron sus bytes frente a esas capturas.

| Materia → tema / concepto de alcance | Cobertura | Históricas mapeadas | Originales brutas | Dominio | Acción prioritaria |
|---|---:|---:|---:|---|---|
| Igualdad → LO 3/2007 completa (preámbulo, títulos preliminar y I–VIII) | Parcial | 0 | 14 | Desconocido | Completar la ley exigida y vincular conceptos con artículo y excepciones. |
| PRL → exposición de motivos | Falta | 0 | 0 | Desconocido | Crear teoría y recuperación con fuente exacta. |
| PRL → capítulo I, arts. 1–4 | Falta | 0 | 0 | Desconocido | Crear explicación y preguntas originales revisadas. |
| PRL → capítulo III, arts. 14–29 | Parcial | 0 | 12 | Desconocido | Completar artículos y validar distractores. |
| PRL → capítulo V, arts. 33–40 | Parcial | 0 | 2 | Desconocido | Completar capítulo y ampliar práctica más allá de dos ítems. |
| Estatuto ADIF → capítulo I, arts. 1–2 | Parcial | 0 | 2 | Desconocido | Desarrollar conceptos y excepciones. |
| Estatuto ADIF → capítulo II, arts. 3–13 | Parcial | 0 | 3 | Desconocido | Completar funciones y diferencias entre órganos. |
| Estatuto ADIF → capítulo III, arts. 14–26 | Parcial | 0 | 6 | Desconocido | Completar artículos y validar vigencia. |
| Estatuto ADIF → capítulo IV, arts. 27–29 | Parcial | 0 | 2 | Desconocido | Completar régimen de personal. |
| Estatuto ADIF → capítulo V, arts. 30–32 | Parcial | 0 | 3 | Desconocido | Completar régimen patrimonial. |
| Estatuto ADIF → capítulo VI, arts. 33–44 | Parcial | 0 | 2 | Desconocido | Completar régimen económico-financiero. |
| Declaración sobre la Red 2027 → capítulo I | Parcial | 0 | 4 | Desconocido | Contrastar PDF de edición 31-07-2026 y completar el capítulo. |
| Declaración sobre la Red 2027 → capítulo II | Falta | 0 | 0 | Desconocido | Obtener edición oficial exigida; desglosar infraestructura y preguntas. |
| EBEP, RDL 5/2015 → capítulo VI, título III, arts. 52–54 | Parcial | 0 | 5 | Desconocido | Completar deberes, principios y código de conducta artículo por artículo. |
| Incompatibilidades → Ley 53/1984 completa | Parcial | 0 | 7 | Desconocido | Cotejar compatibilidades, autorizaciones, excepciones y plazos. |
| ICT → capítulo I, arts. 1–3 | Parcial | 2 | 2 | Desconocido | Completar alcance y definiciones. |
| ICT → capítulo II, arts. 4–15 | Parcial | 6 | 1 | Desconocido | Cubrir articulado y requisitos de infraestructura. |
| ICT → anexo I, radiodifusión y TV | Parcial | 12 | 6 | Desconocido | Contrastar versiones y ampliar recuperación. |
| ICT → anexo II, telefonía y banda ancha | Parcial | 36 | 21 | Desconocido | Separar definiciones próximas, cifras y excepciones; revisar claves. |
| ICT → anexo III, especificaciones técnicas de edificios | Parcial | 0 | 4 | Desconocido | Completar trazabilidad; conservar corregidas las preguntas 006/017-v2. |
| ICT → anexo IV, inspección y mantenimiento | Parcial | 0 | 0 | Desconocido | Crear cobertura y práctica desde fuente primaria. |
| ICT → anexo V, Hogar Digital | Parcial | 6 | 2 | Desconocido | Completar servicios, grupos y excepciones. |
| Compatibilidad electromagnética → artículo completo REE, pp. 80–86 del documento asignado | Falta | 24 | 0 | Desconocido | Obtener PDF ADIF (403 actual), comprobar autoría/cesión y enlazar apartados. |
| RCF Libro 1 → capítulo 1, generalidades | Parcial | 10 | 14 | Desconocido | Completar conceptos y verificar la versión de convocatoria. |
| RCF Libro 1 → capítulo 2, documentación reglamentaria | Parcial | 0 | 1 | Desconocido | Completar cobertura y generar más de una pregunta. |
| RCF Libro 1 → capítulo 3, distribución de documentos y útiles | Falta | 0 | 0 | Desconocido | Crear teoría y preguntas originales; carencia explícita del inventario. |
| RCF Libro 1 → capítulo 4, comunicaciones reglamentarias | Parcial | 0 | 1 | Desconocido | Completar reglas de comunicación y errores frecuentes. |
| RCF Libro 1 → capítulo 5, conceptos básicos de circulación | Parcial | 6 | 2 | Desconocido | Completar conceptos y medir precisión antes de velocidad. |

**Lectura de prioridad:** los 28 nodos son temario exigido. Los cinco nodos ausentes y cualquier fuente sin cotejar son prioridad P0 por laguna, no por probabilidad calculada de examen. Las cifras históricas describen frecuencia observada en el inventario mapeado y no predicen PNI26. Las 24 preguntas CEM históricas no están habilitadas y requieren revisión de vigencia y fuente.

Esta matriz confirma cobertura estructural, no suficiencia didáctica. Falta revisar cada uno de los 205 conceptos: explicación, fuente/artículo, ejemplos, fichas, distractores y retención diferida. El manifiesto registra 49 fuentes (23 `verified`, 15 `needs_check`, 11 `superseded`); `MET-PSI-01` y `MCER-A2` siguen `needs_check`. La etiqueta `verified` no demuestra por sí sola que el texto y todos sus detalles sigan vigentes.

El curso externo `comoserferroviario.es/course/view.php?id=170` no fue cotejado en esta auditoría: versión, fecha, acceso y correspondencia con PNI26 quedan pendientes. No se extrajo contenido privado ni se reprodujeron bancos de terceros.
