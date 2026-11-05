# REVISION_CODEX

## Ciclos 10–11 — revisión de preguntas ICT y correcciones pedagógicas — 2026-11-04

Se añadieron `orig-tel-ict-042` a `orig-tel-ict-061`, preguntas originales que
cubren ICT concepts 36–55. La primera revisión independiente detectó dos
hallazgos importantes y tres menores: el distractor/clave de las bandas de
respuesta RTV mezclaba 4.4.2 con 4.4.3; la pregunta de sobretensiones trataba
como universal una protección condicional; y los localizadores de arqueta,
canalización secundaria y protocolo eran imprecisos. Se corrigieron y el
revisor confirmó su resolución. En un pase final aparecieron otros dos
hallazgos importantes y uno menor: art. 10.2 permite, según complejidad,
presentar solo el boletín; la regla de tomas por estancia es RTV (Anexo I,
3.5.1), no telefonía/banda ancha; y el caso de ruta de red debía limitarse a
enlace por cable. Teoría, enunciados, distractores y referencias se ajustaron;
el revisor confirmó los tres puntos resueltos y no encontró defectos
residuales en ese alcance.

La teoría ahora distingue respuesta amplitud/frecuencia en canal y en banda,
cableado de pares trenzados de distribución/dispersión frente a cableado
interior de usuario, apantallamiento/puesta a tierra frente a protector de
sobretensión, y las rutas cableada y radioeléctrica. Se añadieron ejemplos
`ict-ex-5/6` y tarjetas `ict-fc-39` a `ict-fc-42`; `ict-fc-18` se corrigió para
no enseñar la puesta a tierra como instalación universal de un protector.

Verificación local final: `pnpm verify:content`, `pnpm typecheck` y
`pnpm vitest run tests/telecom-practice.test.ts tests/content-validation.test.ts`
PASS; 20/20 pruebas. La cobertura global del temario permanece en 44,44 %.
La revisión independiente del banco RCF preexistente y la nueva prueba de
suficiencia teórica siguen pendientes; no declarar este lote como examen ciego
ni como cobertura completa del curso.

## Ciclo 9 — Declaración sobre la Red y CEM — 2026-11-04

### 9A — Declaración sobre la Red 2027

La página oficial de [ADIF](https://www.adif.es/sobre-adif/declaracion-red)
identifica la edición general de 31/07/2026 y anuncia cambios en los capítulos
2, 4, 5 y 7. La reconsulta ordinaria del enlace directo devolvió HTTP 403 el
04/11/2026. El manifiesto conserva el SHA-256 de la descarga histórica completa
del 15/10/2026 (`0c9d55a6dd82ffd5884f6425479be1d8ba9dcd40f1f2fc26e03fc6eb81649a62`)
y el Last-Modified reportado entonces; también conserva el registro separado
del adjunto que ADIF enlaza al PNI26/01 (`362a3f68b7b81c0464515cf1ee026c785e6b1594395042d3e1d69c9255a4b080`).
El snapshot local, SHA `796b26bdd38957ba31663b56dcda259d36de199c3cf1b537cfa3111d0cd029f2`,
no coincide con el del adjunto descargado históricamente. La edición general y
la asignada son registros distintos; no se afirma equivalencia entre ellas.

Las fuentes de capítulo II y sus claims conservan `needs_review`: el archivo
local procede del snapshot PNI V.0 (ED 27/02/2026), mientras la ficha pública
señala modificaciones posteriores del capítulo 2. La página oficial demuestra
la identidad anunciada y el enlace, pero el 403 impide cotejar ahora el archivo
completo y medir las diferencias. El cambio local de «efectúa automáticamente»
a «materializa» en la definición de enclavamiento reduce una implicación que no
se desprendía claramente del texto atribuido; no convierte el claim en revisado.
**Estado 9A: PARTIAL documental.**

### 9B — Compatibilidad electromagnética

Se conservaron las correcciones selectivas ya presentes en el árbol: Directiva
2014/30/UE, arts. 6, 46 y anexo I; RD 186/2016, arts. 7, 17 y 19 y anexo I.
Los artículos BOE se cotejaron de nuevo en sus textos oficiales. La Directiva
publicada el 29/03/2014 no entró en vigor el 20/04/2016: el art. 46 establece la
entrada en vigor a los veinte días de publicación y especifica la aplicación
desde el 20/04/2016 de los preceptos enumerados. El art. 19 del RD contempla
una excepción condicionada para determinados aparatos destinados a una
instalación fija concreta, con información/documentación adjunta; no es una
exención general.

Se corrigieron los takeaways 4–7 para no presentar cifras de conmutación,
geometrías de ensayo, versiones de EN 50121, irretroactividad ni autorizaciones
descritas en el artículo REE como requisitos actuales generales. El artículo es
una fuente técnica secundaria de 2015; el snapshot local tiene SHA
`01ff8ed87e08c16f4f1335ac368d8ada5e7a19444337c1de837d58ed983f850b`, distinto del
SHA histórico descargado de ADIF (`2697bebd7bac056f669fd575b7e84a057c658628ef30568fe9dba034cc9f015e`).
El enlace asignado devolvió HTTP 403 el 04/11/2026. EN 50121 consta en el
temario, pero su edición y estado de armonización no se verifican aquí. También
se precisó la fecha de publicación de la Directiva 2004/108/CE (DOUE L 390,
31/12/2004), se acotó el ámbito de dos claims, se separó definición CEM de
inmunidad, y se condicionaron la aceptación de convertidores y referencias
EN 50238/CLC/TR 50507 al caso y a la edición aplicable.

Revisión independiente final (GPT-6 Luna): cuatro hallazgos importantes
(aceptación universal EN 50121, fecha/ámbito 2004, alcance demasiado amplio en
claim legal, y estado 9A incoherente en tabla) y tres menores (definición CEM,
modalidad de prácticas de diseño y verificación normativa categórica). Se
corrigieron los siete. Verificación final: 41/41 pruebas focalizadas,
`pnpm verify:content`, referencias, claims y TypeScript PASS. La revisión fue
selectiva: no verifica cada afirmación histórica del artículo ni el PDF exacto.
**Estado 9B: PARTIAL;** no se ha cotejado íntegramente el artículo asignado.

Fuentes primarias consultadas: [BOE, Directiva 2014/30/UE](https://www.boe.es/buscar/doc.php?id=DOUE-L-2014-80623),
[BOE, RD 186/2016 consolidado](https://www.boe.es/buscar/act.php?id=BOE-A-2016-4442)
y [BOE, Ley 38/2015 consolidada](https://www.boe.es/buscar/act.php?id=BOE-A-2015-10440).

## Ciclo 8B — Continuación RCF, 2026-11-04 — revisión localizada

Se leyó la prueba de fuego del Ciclo 6 y se contrastaron las lagunas RCF con el
RD 664/2015, Libro Primero, texto consolidado BOE actualizado el 12/07/2023.
Se ampliaron claims de objeto (incluido el marco regulador único del párrafo 2),
responsabilidad AI/EF y SGS, obligaciones del personal, relevo y comunicaciones;
se añadieron dos ejemplos, tres preguntas originales (`orig-tel-rcf-024` a
`orig-tel-rcf-026`) y tarjetas `rcf-fc-4` a `rcf-fc-7`. Las preguntas
reservadas del Ciclo 6 permanecen en su directorio de evaluación.

La revisión independiente confirmó las claves y los localizadores de las tres
preguntas nuevas y no halló procedimientos inseguros. Señaló inicialmente la
omisión del objetivo del art. 1.1.1.1, párrafo 2; se añadió el claim `rcf-c1-3`,
una pregunta y una tarjeta. El segundo pase confirmó corregida esa omisión y
recomendó usar la notación «párrafo 2» en lugar de «apartado 1.1.1.1.2», ya
ajustada en explicación y tarjeta. La regresión `tests/rcf-cycle8b-coverage.test.ts`
pasó 3/3. Typecheck, teoría, referencias y trazabilidad de claims pasan; tres
suites focalizadas suman 41/41. El test agregado de telecom sigue fallando por
falta de ICT 36 antes de llegar a su comprobación RCF; el validador de copia
conserva dos avisos de incompatibilidades. Revisión localizada RCF correcta,
pero no se auditaron todos los claims heredados ni se acredita cobertura
integral del capítulo 5.

## Ciclo 8D — Incompatibilidades, 2026-11-04 — revisión localizada

Contraste selectivo de la Ley 53/1984 consolidada en BOE. Se precisó el
supuesto de Profesor universitario asociado del art. 4.1 y se explicitó que la
excepción patrimonial del art. 19.a no elimina las limitaciones del art. 12.
Se corrigió `orig-gen-incompat-002`, con localizador específico del art. 4.1,
y se añadió `orig-gen-incompat-008`, caso de asesoramiento remunerado en un
expediente de contratación en el que interviene la empleada (art. 12.1.a).
También se amplió la descripción del ámbito del art. 2 para que no parezca
exhaustiva y se añadieron tres tarjetas.

Las expresiones «automáticamente» de `incomp-c11-1` y `incomp-c16-1` coinciden
con los arts. 14 y 20 y conservan sus condiciones; se autorizaron únicamente
por claim en el verificador de copia. Pruebas focalizadas de
contenido/esquema/referencias: 30/30 PASS; teoría, claims, referencias, copia y
TypeScript PASS. La revisión independiente encontró dos problemas menores
(alcance del art. 2 y localizador de la pregunta) y ambos se corrigieron. No se
ha cotejado cada apartado ni todo el banco, ni se ha realizado prueba ciega;
8D permanece PARTIAL.

## Ciclo 8A — PRL, 2026-11-04 — lagunas de la prueba de fuego

Project Bridge estaba libre de claims ajenos activos para estos ficheros; se
reclamó 8A sin conflicto. Se conservaron los cambios locales previos y se
ampliaron aditivamente los huecos demostrados: art. 14.4 (organización
preventiva no exime al empresario), art. 18 (información general por los
representantes y directa para riesgos específicos), arts. 33–34 (materias de
consulta, antelación, representación y participación), y arts. 35–36
(designación, escala y funciones de los Delegados de Prevención). Se añadieron
cuatro preguntas originales, cinco tarjetas y tres ejemplos ferroviarios.

También se desarrollaron los arts. 30–31 LPRL y el art. 11 del RD 39/1997 como
**contexto complementario**; el índice del material PNI26/01 incluye capítulos
I, III y V, no el IV. La excepción para asumir personalmente tareas se limitó
por tamaño, centro único, actividad fuera del anexo I, presencia habitual y
capacidad; vigilancia de la salud y otras actividades no asumidas requieren
otra modalidad.

Revisión independiente: sin hallazgos críticos; confirmó la exactitud legal y
las adaptaciones de Administración pública. Se atendieron sus notas sobre
modalidades preventivas, vigilancia de salud, actividades no asumidas y
distractores; la fuente RD 39/1997 art. 11 se añadió a los registros centrales.
Validación final: seis suites focalizadas, 56/56 PASS; teoría 319 conceptos, 753
claims y 39 ejemplos; referencias, trazabilidad, copia y typecheck PASS.
`pnpm verify:content` PASS. `tests/theory-validators.test.ts`: 47/48 PASS, una
falla heredada en la expectativa `needs_review` frente al estado inline
`reviewed` de claims PRL; no se alteró para silenciar el fallo. El ciclo queda
PARTIAL: no se ha auditado integralmente todo el contenido de los capítulos
oficiales ni realizado nueva prueba ciega.

## TREBEP 8C — cierre académico y pendiente documental, 2026-11-04

La revisión académica de los arts. 52–54 está realizada. La aplicación general
del Código al personal laboral de ADIF se aclaró con fuentes oficiales y una
segunda revisión independiente. No reabrir ese análisis sin nueva evidencia.
Permanece **PARTIAL documental** el cotejo del PDF exacto enlazado por ADIF:
la URL oficial y el HTTP 403 constan en `RESUMEN_TREBEP.md`; el SHA-256 esperado
registrado en la descarga del 15/10/2026 es
`dd083f554a10d264053ba324ecead1f1fee931dae9830cb3c27db3a9b43a1997`. Ese valor
no se sustituye por el hash del snapshot BOE ni prueba que los PDFs sean
idénticos. La incidencia documental no bloquea otras materias.

## Continuidad Codex — última comprobación 2026-11-04

**Contraste posterior:** resuelta y revisada independientemente la aplicación general del Código al personal laboral de ADIF; la aplicación disciplinaria concreta requiere hechos y régimen aplicable. Las dudas generales sobre aplicación mencionadas en entradas históricas quedan superadas. Sigue sin cotejarse el PDF ADIF de octubre. Referencias y alcance en `RESUMEN_TREBEP.md`.

Auditoría y reparaciones parciales con revisión independiente en ICT, Estatuto, TREBEP, RCF, incompatibilidades y CEM. La segunda prueba reservada TREBEP obtuvo 4/4 respuestas y 4/4 respaldos en una muestra pequeña. Siguen sin verificarse la aplicación laboral concreta a todo el personal ADIF y la identidad del documento oficial asignado. La suite global conserva dos fallos; los dos avisos editoriales de incompatibilidades no se han ocultado. Consultar `REANUDACION.md` para resultados, límites y siguiente paso.

## Actualización Codex — auditoría independiente posterior, 2026-11-04

Se contrastaron por agentes independientes Codex/Luna ICT, Estatuto, TREBEP,
RCF e incompatibilidades; sus límites y la matriz de hallazgos se detallan en
`AUDITORIA_CODEX.md`. Se repararon errores de excepciones, condiciones,
atribución de fuentes y tarjetas, sin modificar PRL. El criterio de cierre sigue
siendo por bloque: los tests de TypeScript y estructura no certifican calidad
académica ni la versión de convocatoria. Las pruebas ciegas de TREBEP y sus
reservas se documentan en `EXAMEN_RESERVADO_TREBEP_RESULTADOS.md`.

El artículo CEM local y la DR local se identificaron por SHA-256, pero no
coinciden con los hashes históricos del adjunto ADIF; la reconsulta de ADIF
devolvió 403. No se ha establecido equivalencia de esos bytes ni completitud de
los documentos. Se preservaron los cambios ajenos y la historia de DeepSeek.

## Actualización Codex — 2026-11-04: ciclo 8C parcial

El estado anterior no recogía cambios locales posteriores en teoría y resumen
de Código de Conducta. Se preservaron y se corrigió la atribución a la Ley
4/2023 de cinco principios del artículo 52; el [BOE consolidado](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719#a53)
atribuye esa reforma al artículo 53.4. La cabecera del consolidado indica
actualización global de 03/10/2026; 01/03/2023 corresponde a la modificación
del artículo 53, no a la última actualización global. Se añadieron los matices
del 53.2 y el deber de conservación del 54.5 y se reparó la trazabilidad de
tres claims. La revisión es parcial: `conducta-c7-1` necesita fundamento
específico sobre el personal de ADIF; revisar también `conducta-c6-2`, la
literalidad de extractos, los metadatos `reviewed` previos y el resto del 8C.
No se ha hecho prueba ciega independiente ni revisión integral del programa.

En esta ejecución `pnpm typecheck`, estructura, referencias y claims pasaron.
`pnpm verify:content` quedó bloqueado por dos avisos de copia en
incompatibilidades. Las tres suites focalizadas dieron 65 aprobadas y tres
fallos: inventario 315/317, distribución de claves del Estatuto y revisiones
heredadas. `git diff --check` detectó un blanco final preexistente en
`content/flashcards.ts`. La sección de resultados esperados posterior es
histórica y no describe el árbol actual. No se modificaron PRL ni
incompatibilidades; no se ha verificado despliegue.

Instrucciones de auditoría para la sesión con Codex. Este documento no afirma
nada que no esté comprobado; señala dónde mirar y qué preguntar.

---

## 1. Qué se ha tocado y qué no

**Ficheros modificados por esta ejecución:**

```
content/theories/ict-rd-346-2011.ts
content/summaries/ict-rd-346-2011.ts
content/theories/estatuto-adif.ts
content/flashcards.ts
content/original-practice/telecom.json
content/original-practice/general-knowledge.json
tests/content-validation.test.ts
tests/estatuto-adif-coverage.test.ts
docs/evaluaciones/deepseek-pre-codex/*.md
```

**Ficheros deliberadamente intactos** (modificados por otros agentes):
`content/theories/prevencion-riesgos-laborales.ts`,
`content/theories/incompatibilidades.ts`, `content/theories/rcf-libro-1.ts`,
`content/theories/declaracion-red-2027.ts`,
`content/theories/ingles-a2.ts`, `lib/content/original-practice-schema.ts`,
`lib/content/original-practice-public-dto.ts`, los JSON de `english-a2` y
`psychometric`, y todo lo relativo a Supabase, persistencia, autenticación,
despliegue e infraestructura.

---

## 2. Puntos que exigen contraste independiente

### 2.1 Ámbito del artículo 3 del RD 346/2011

Se ha eliminado el umbral del 50 % heredado. **Verificar** contra
`BOE-A-2011-5834` que el artículo 3 tiene dos apartados y que ninguno contiene un
porcentaje. Comprobar también que el único «50 %» del documento está en el
preámbulo, referido a hogares con 100 Mbps.

### 2.2 Renumeración del artículo 4 del Estatuto

Punto delicado, y el más importante de esta auditoría. En una primera pasada se
concluyó que la reforma de 2013 había eliminado la habilitación para convenir con
comunidades autónomas. **Era falso.** El contraste con el texto original de 2004
(que tenía cuatro apartados) y con la disposición final primera, apartado cinco,
del RD 1044/2013 demuestra lo contrario: lo suprimido fue el apartado del
contrato-programa y la habilitación con comunidades autónomas pasó del apartado 2
al 1.

**Verificar** que:
- `estatuto-c102-1` describe el apartado primero vigente como el de las
  comunidades autónomas;
- `estatuto-c102-3` explica la renumeración en el sentido correcto;
- `orig-gen-estatuto-019` y `-020` tienen la clave correcta con esa lectura;
- la clave A de la pregunta 8 del ciclo 6 **no** necesita rectificación.

### 2.3 Anulaciones del Tribunal Supremo de 2012

Se sostiene que solo cayeron el inciso de la titulación del RD-ley 1/1998 y el
inciso de la entidad verificadora independiente, y que el plazo de 15 días
naturales del acta de replanteo sigue vigente. **Verificar** contra
`BOE-A-2012-13773`, `-13774` y `-13532`.

### 2.4 Separaciones entre canalizaciones

Se afirma 100 mm en paralelo y 30 mm en cruce, con rigidez dieléctrica de 1.500 V.
**Verificar** el anexo correspondiente: es un dato con alta probabilidad de estar
redondeado a centímetros en materiales de academia.

### 2.5 Bandas de radiodifusión del anexo I

47–694 MHz y 950–2.150 MHz, más deber de protección de 694–862 MHz. **Verificar**
que no se ha confundido la atribución del anexo I con la del Plan Técnico
Nacional de la TDT.

### 2.6 Plazo de 30 días de la consulta a operadores

Se afirma que el artículo 8.5 fija 30 días para responder y que el silencio
habilita al proyectista a proyectar conforme al reglamento. **Verificar** que el
plazo es de días naturales o hábiles — el texto dice «30 días» sin adjetivo, y el
material debe reproducir esa literalidad sin añadir precisiones.

---

## 3. Riesgos de método que el auditor debe conocer

1. **No hubo agentes independientes.** Los ciclos se ejecutaron con pasadas de
   revisión sucesivas del mismo modelo sobre los mismos ficheros. Cualquier
   coincidencia entre pasadas no es evidencia de consenso.
2. **El sello `reviewed` se aplicó solo a los enunciados cotejados uno a uno.**
   En ICT se retiró el sello masivo que otro agente había puesto a 63 enunciados.
   Conviene comprobar que ningún enunciado quedó con `reviewed` sin cotejo.
3. **Los conceptos 36 a 55 de ICT siguen sin pregunta.** El test de cobertura está
   en rojo desde antes de esta ejecución; no es una regresión, pero tampoco está
   resuelto.
4. **Las pruebas de revisión heredada fallan en PRL** por un cambio local ajeno.
   No atribuir ese fallo a esta ejecución.

---

## 4. Comandos de verificación

```bash
cd /home/kiri_/projects/adif-web
pnpm typecheck
pnpm verify:theory
pnpm verify:theory-references
pnpm verify:theory-claims
pnpm verify:syllabus
pnpm vitest run tests/content-validation.test.ts tests/estatuto-adif-coverage.test.ts
pnpm vitest run tests/telecom-practice.test.ts tests/general-knowledge-practice.test.ts
```

Resultado esperado en el estado actual: todo verde salvo
`telecom-practice › covers all 34 ICT concepts` y
`theory-validators › keeps inherited claim reviews pending`, ambos documentados en
`PENDIENTES.md` con su causa.
# Ciclos 10–12 — cierre focal ICT/RCF y evaluación — 2026-11-04

## Resultado de revisión

- Incorporadas 20 preguntas originales ICT (`orig-tel-ict-042` a `061`) para
  conceptos 36–55, con fuentes y localizadores exactos; la revisión primaria y
  especialista corrigieron los defectos descritos en `STATUS.md`.
- El pase al banco RCF existente revisó selectivamente preguntas 001–026. Se
  completó `orig-tel-rcf-003` sobre estaciones y dependencias ferroviarias y se
  cambió `orig-tel-rcf-018` para evitar su duplicidad con la 007. Revisión
  independiente confirmó la precisión normativa y la distinción. No se revisó
  todo el capítulo 5.
- Revisión independiente de teoría ICT 37 / `orig-tel-ict-043`, contrastada con
  la [Orden ITC/1644/2011 consolidada](https://www.boe.es/eli/es/o/2011/06/10/itc1644/con):
  para más de 20 viviendas la dirección de obra es obligatoria (art. 6.5.a);
  el instalador entrega boletín y protocolo firmado, y el director expide el
  certificado de fin de obra y supervisa/entrega el protocolo (art. 6.4). El
  término «al menos» impide inferir que los otros casos estén exentos.
- La fuente quedó en el manifiesto con SHA-256 de la página BOE descargada
  `fec485d2277ffbcdb738acd7bfb80d60beca5bc005b3124643efea90b465ad26`, fecha
  2026-11-04 y URL oficial; la pregunta usa los artículos 6.4 y 6.5.
- Evaluación generada usando únicamente teoría: 11/12 inicialmente suficientes,
  1/12 parcial por falta de criterios concretos. Tras añadir dichos criterios,
  un revisor independiente resolvió el caso de 24 viviendas usando solo la
  teoría. Muestra pequeña, no ciega y no exhaustiva; preguntas reservadas del
  Ciclo 6 no consultadas ni incorporadas.

## Validación focalizada

- `pnpm verify:content`: PASS; teoría estructural, referencias, trazabilidad de
  claims, copia, scope del temario y 102 mapeos históricos validados. Cobertura
  completa global 44,44 % (9 bloques oficiales; 4 completos, 4 parciales).
- `pnpm typecheck`: PASS.
- `pnpm vitest run tests/telecom-practice.test.ts tests/content-validation.test.ts`:
  PASS, 20/20.
- `git diff --check`: persiste el aviso heredado de línea vacía al final de
  `content/flashcards.ts`; no se altera aquí.
- Ciclos 8B/8A/8D/9 y 10–12 quedan PARTIAL por auditorías integrales y/o
  cotejos documentales abiertos indicados en `STATUS.md` y `PENDIENTES.md`.
  TREBEP 52–54 no se reabre; continúa PARTIAL solo el cotejo del PDF ADIF 403.


## Ciclo 13 — auditoría Codex — 2026-11-04

| Ciclo | Estado previo | Auditoría Codex | Reparaciones | Estado actual |
|---|---|---|---|---|
| RCF Cap. 5 | PARTIAL | Prueba académica independiente: 11/12 pleno + 1 parcial (paradas sin definir) | Definición comercial/restringida/técnica añadida a rcf-c10-1; pregunta nueva orig-tel-rcf-047 | 12/12 pleno; nodo `covered` |
| PRL III/V | PARTIAL | Faltaban arts. 17, 25, 26, 27, 28, 37, 39, 40 | 8 conceptos (prl-concept-17…24), 8 preguntas (orig-gen-prl-019…026), 3 tarjetas (prl-fc-6…8) | `covered` en nivel de artículos |
| Banco | PARCIAL | Auditoría global: sin duplicados, sin claves mal formadas, sin explicaciones cortas | Sin cambios de código; observación documentada (English A2 y psicométrico con spread alto) | Auditado |
| DR/CEM | PARTIAL DOCUMENTAL | Sin cambio de estado | Sin cambios | PARTIAL documental |

Recuento actual: 346 conceptos, 110 preguntas telecom (109 revisadas), 100 general-knowledge
(79 revisadas), 46 english-a2, 38 psicométricas. `verify:content` PASS, typecheck limpio,
suites focalizadas PASS.
