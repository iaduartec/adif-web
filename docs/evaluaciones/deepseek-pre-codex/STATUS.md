# STATUS — Programa de mejora académica ADIF 360 (ciclos 7–12)

## Ciclos 10–12 — continuidad de bancos y evaluación — 2026-11-04

**Ciclo 10 ICT/RCF:** el hueco detectado por la suite `ict-concept-36` ya está
cubierto. Se incorporaron 20 preguntas originales para ICT concepts 36–55 con
localizador y versión de fuente primaria. El cotejo BOE y la revisión
independiente corrigieron, además, la alternativa documental del artículo
10.2, la distinción entre respuesta RTV en canal y en banda, los requisitos de
cableado de pares trenzados, la condición de los protectores de sobretensión,
la separación entre conexiones de red y el dominio RTV de las tomas mínimas.
El registro principal tiene referencias BOE separadas para no desplazar
localizadores usados por preguntas anteriores.

**Ciclo 11 — teoría y memorización:** añadidos dos ejemplos de aplicación sobre
sobretensiones y bandas de respuesta; aclaradas las responsabilidades y
condiciones en teoría; sustituida una tarjeta que confundía puesta a tierra de
pantallas con protectores y añadidas cuatro tarjetas de distinciones técnicas.
La revisión independiente de las preguntas nuevas y estos cambios confirmó
resueltas sus observaciones. El pase selectivo al banco RCF preexistente detectó
una pregunta incompleta sobre dependencias ferroviarias y una casi duplicada;
ambas se corrigieron y una revisión independiente confirmó los cambios. El caso
ICT 37 se amplió con Orden ITC/1644/2011: dirección de obra obligatoria, entre
otros supuestos, para edificios de más de 20 viviendas; se distingue boletín,
certificado de fin de obra y protocolo. El SHA-256 de la página BOE consultada
consta en el manifiesto.

**Verificación focalizada actual:** `pnpm verify:content`, `pnpm typecheck` y
20 pruebas de `telecom-practice.test.ts` y `content-validation.test.ts` PASS.
La prueba telecom confirma cobertura de todos los conceptos ICT y capítulos RCF
que verifica; esto no demuestra suficiencia de todo el curso. La cobertura
global de temario sigue 44,44 %. La prueba académica independiente generó
preguntas desde teoría sin consultar bancos ni respuestas reservadas: primero
11/12 tenían apoyo suficiente y una parcial; tras ampliar teoría con los
criterios de la Orden ITC/1644/2011, una segunda comprobación resolvió también
el caso práctico de 24 viviendas. No es una prueba ciega ni valida exhaustividad
normativa. Las preguntas reservadas del Ciclo 6 siguen separadas. Ciclos 8A,
8B, 8D, 9 y 10–12 permanecen PARTIAL por los límites de cobertura/documentación
descritos en `PENDIENTES.md`; no hay bloqueo global.

## Actualización de continuidad Codex — última comprobación 2026-11-04

**Ciclo 9 DR/CEM 2026-11-04:** la ficha oficial ADIF identifica la DR 2027 de
31/07/2026 y cambios en los capítulos 2, 4, 5 y 7. Los enlaces directos de la
edición general, el adjunto DR de PNI26/01 y el artículo CEM devuelven HTTP 403
en la reconsulta; se conservaron por separado sus SHA-256 históricos del
15/10/2026 y los hashes distintos de los snapshots locales, sin inferir
identidad ni equivalencia. En CEM se corrigieron el ámbito de dos claims, la
fecha de publicación de la Directiva 2004/108/CE, la distinción CEM/inmunidad y
varias generalizaciones de ensayos y procedimientos históricos. El revisor
independiente señaló cuatro defectos importantes y tres menores; se corrigieron
los siete. 41/41 pruebas focalizadas, `verify:content` y typecheck PASS. La
cobertura global sigue 44,44 %. Ambos módulos quedan **PARTIAL**, no bloqueados
globalmente; falta el cotejo integral y el ensayo académico independiente.

**Continuidad RCF 2026-11-04:** prueba de fuego Ciclo 6: 3/5 respuestas y 2/5 con apoyo pleno. Contrastado el Libro Primero con el consolidado del RD 664/2015 (actualización BOE 12/07/2023); ampliados objetivos, responsabilidad AI-EF, SGS, deberes del personal, relevo y comunicaciones. Tres preguntas originales, cuatro tarjetas y dos ejemplos nuevos; preguntas reservadas separadas. Typecheck PASS; pruebas focalizadas 41/41 PASS (incluida cobertura RCF 3/3); teoría, referencias y claims pasan. La revisión independiente encontró dos hallazgos y confirmó ambos corregidos. `verify:theory-copy` conserva dos avisos ajenos de incompatibilidades; la suite telecom agregada falla antes de comprobar RCF por ICT 36 sin cubrir. RCF sigue PARTIAL por falta de auditoría integral del capítulo 5.

**Continuidad Incompatibilidades 2026-11-04:** contraste selectivo de Ley 53/1984 contra BOE; afinados el supuesto de Profesor universitario asociado (arts. 3 y 4.1), la salvedad del art. 19.a respecto del art. 12 y un caso práctico de contratación (art. 12.1.a). Se añadieron tres tarjetas originales. Los dos usos de «automáticamente» reproducen efectos legales condicionados de los arts. 14 y 20 y se exceptúan únicamente en esas claims del validador editorial. Pruebas focalizadas 30/30 PASS; teoría, claims, referencias, copia y TypeScript PASS. Revisión independiente completada con dos observaciones menores corregidas; no equivale a cotejo total ni a prueba ciega.

**Continuidad PRL 2026-11-04:** al consultar Project Bridge no había claims activos ajenos sobre los ficheros PRL; se reclamó el ciclo y se preservó todo cambio local previo. Se atendieron las lagunas de la prueba de fuego en responsabilidad (14.4), canales de información (18), consulta/participación (33–34) y designación/facultades de Delegados (35–36). Se añadieron cuatro preguntas, cinco tarjetas y tres ejemplos. Los arts. 30–31 LPRL y RD 39/1997 art. 11 se etiquetan como contexto complementario fuera de los capítulos I, III y V del extracto ADIF; el RD 39/1997 quedó registrado con SHA-256 en el manifiesto. Revisión independiente sin hallazgos críticos. 56/56 pruebas focalizadas y `verify:content` PASS. El módulo sigue PARTIAL por cobertura incompleta del extracto y por una prueba heredada de estado de revisión.

**Contraste posterior TREBEP:** la aplicación general del Código al personal laboral de ADIF queda respaldada por los arts. 2 y 7 TREBEP, art. 27 del Estatuto ADIF y apartados 4 y 12 de las [instrucciones BOE de 2007](https://www.boe.es/eli/es/res/2007/06/21/(1)/con), y revisada por un segundo especialista independiente. La responsabilidad concreta exige hechos y régimen aplicable. 8C sigue PARTIAL por no poder cotejar el PDF ADIF de octubre; los textos históricos inferiores que presentan pendiente la aplicación general quedan superados. Véase `RESUMEN_TREBEP.md`.

La tabla y los recuentos históricos siguientes se complementan con `REANUDACION.md`. La última suite general registrada antes de 8A/8D alcanzó 670 pruebas aprobadas y 2 fallidas, en 87 archivos aprobados y 2 fallidos: falta de práctica ICT 36 y discrepancia de estados PRL heredados. La distribución de respuestas del Estatuto se resolvió mediante revisión de una pregunta original. El inventario actual de teoría pasó a 319 conceptos tras las adiciones 8C y 8A. `verify:theory-copy` ya pasa con excepciones acotadas a dos claims que reflejan literalmente los arts. 14 y 20 de la Ley 53/1984. No se ha repetido la suite general ni hay PASS general.

TREBEP: revisión académica de los arts. 52–54 realizada; 4/4 en la segunda muestra reservada con respaldo suficiente, sin inferir cobertura total. **PARTIAL documental:** el PDF oficial exacto ADIF devuelve 403; URL y hash esperado constan en `RESUMEN_TREBEP.md`. No repetir el análisis académico sin evidencia nueva. La verificación documental no bloquea el resto del programa.

## Actualización Codex — auditoría y reparaciones 2026-11-04

La tabla y los relatos de DeepSeek que siguen se conservan como historia. Esta
actualización refleja únicamente la revisión realizada en el árbol local; no
indica integración, despliegue ni verificación íntegra del curso.

| Ciclo | Estado previo | Auditoría Codex | Reparaciones | Estado actual |
|---|---|---|---|
| 7A ICT | PASS_WITH_WARNINGS reportado | Revisión independiente parcial: ámbito y consulta correctos; ITE, separación y tarjetas tenían defectos; nivel COFDM heredado era erróneo | Condicional ITE, anexo III, 47–70 COFDM frente a 47–77 QPSK y tarjetas | PARTIAL; faltan práctica 36–55 y revisión integral |
| 7B Estatuto | PASS_WITH_WARNINGS reportado | Revisión independiente parcial: artículos 2, 4, 9, 10 y 14 mayormente correctos; faltaba excepción del 3.2 | Teoría, ejemplo, tarjeta y explicación de pregunta corregidos | PARTIAL; competencias y cobertura por desarrollar |
| 8C TREBEP | REVISIÓN ACADÉMICA REALIZADA | Arts. 52–54 corregidos y contrastados; aplicación general a personal laboral aclarada con fuentes oficiales y segunda revisión | Ocho preguntas revisadas, seis tarjetas y dos muestras reservadas (4/4 en la segunda) | PARTIAL documental: falta el PDF exacto ADIF (403); sin nueva evidencia no reabrir el análisis |
| 8B RCF | PARTIAL | Ciclo 6: 3/5 respuestas y 2/5 apoyo pleno; lagunas de objeto, relevo y comunicaciones | Objeto completo, responsabilidad AI-EF/SGS, deberes del personal, relevo y canales; 3 preguntas, 4 tarjetas, 2 ejemplos | 41 focalizadas PASS; typecheck/theory/references/claims PASS; revisión independiente localizada; falta cobertura integral del capítulo 5 |
| 8D Incompatibilidades | PARCIAL | Contraste selectivo de Ley 53/1984, con foco en arts. 2–4, 12, 14, 19–20 | Condición de Profesor asociado, límite art. 19/12, caso práctico y 3 tarjetas; whitelist literal acotada | 46 pruebas focalizadas PASS; teoría, references, claims, copy y typecheck PASS; revisión independiente completada; cotejo integral y prueba ciega pendientes |
| 8A PRL | PARCIAL | Prueba de fuego: arts. 14.4, 18, 33.2 y 35.2 insuficientes; sin claim sobre poderes art. 36 | Claims de 14, 18, 30–31 (complementario), 33–36; 4 preguntas, 5 tarjetas, 3 ejemplos y resumen actualizado | 56/56 focalizadas, validadores y revisión independiente PASS; cobertura integral de caps. I/III/V y herencia de estados inline pendientes |
| 9A DR | PENDIENTE | Página oficial confirma edición general 31/07/2026; adjunto PNI y edición general constan por separado; reconsulta 403 | Registro actualizado de URLs, HTTP y hashes históricos; teoría del snapshot PNI permanece `needs_review` | PARTIAL documental; no se demuestra identidad actual ni equivalencia entre PDFs |
| 9B CEM | PENDIENTE | Artículo local accesible pero hash distinto del histórico; citas legales/editoriales corregidas selectivamente | Directiva arts. 2, 6, 13, 46 y anexo I; RD arts. 7, 17, 19 y anexo I; ejemplos y takeaways condicionados | PARTIAL; identidad del PDF exacto y revisión integral pendientes |
| 10 Preguntas | PARCIAL | Corregidas preguntas originales concretas; no se han auditado todos los bancos | TREBEP, Estatuto, RCF y localizadores | PARTIAL |
| 11 Pedagogía | PARCIAL | Contradicciones de tarjetas ICT/RCF detectadas | Tarjetas y resumen, cuatro tarjetas TREBEP | PARTIAL; las nuevas tarjetas TREBEP se muestran en Todos pero el filtro no ofrece módulo propio |
| 12 Reevaluación | PENDIENTE | Dos muestras TREBEP, no reevaluación global | Preguntas reservadas separadas | PENDING |

En la segunda muestra TREBEP, un examinador, revisor de claves y estudiante
distintos produjeron 4/4 aciertos y 4/4 con apoyo suficiente. Una pregunta se
parece conceptualmente a una pregunta corregida del banco; cuatro preguntas no
validan el ciclo completo. La prueba anterior, ejecutada antes de reparar tres
lagunas, fue 3/5 aciertos y 2/5 con apoyo pleno. Ver
`EXAMEN_RESERVADO_TREBEP_RESULTADOS.md`.

**Ejecución:** DeepSeek V4.1 Flash · sin Codex · sin modelos de pago
**Repositorio:** `/home/kiri_/projects/adif-web`
**Perfil de examen:** PNI26/01 — 26/12PO Oficial de Telecomunicaciones de Entrada
**Fecha de trabajo:** 2026-11-04

---

## Resumen de estado por ciclo

Esta tabla conserva la clasificación del informe inicial de DeepSeek; no es el
estado actual de los ciclos. La matriz de continuidad anterior y la tabla de
auditoría Codex son las referencias actuales.

| Ciclo | Ámbito | Estado | Evidencia principal |
|---|---|---|---|
| 7A | ICT (RD 346/2011) | **PASS_WITH_WARNINGS** | Umbral del 50 % desmentido contra BOE; arts. 4, 8, 9, 10 desarrollados; 6 conceptos nuevos; 7 preguntas y 8 tarjetas nuevas |
| 7B | Estatuto ADIF (RD 2395/2004) | **PASS_WITH_WARNINGS** | 6 conceptos nuevos (arts. 2, 4, 9, 10, 14, mapa de intervinientes); 5 preguntas y 6 tarjetas nuevas |
| 8B | RCF (Libro 1) | **PARCIAL** | Verificados los datos numéricos (30/20 km/h de maniobras, 120 km/h, tolerancia de 5 km/h y 20 s); desarrollado 1.5.1.9; corregida una expresión absoluta |
| 8C | EBEP | **REVISIÓN ACADÉMICA REALIZADA; PARTIAL DOCUMENTAL** | Arts. 52–54 contrastados; PDF exacto ADIF y hash esperado pendientes por 403; no reabrir sin evidencia nueva |
| 8D | Incompatibilidades | **PARTIAL** | Contraste selectivo de Ley 53/1984, caso práctico y tarjetas; falta revisión integral y prueba ciega |
| 8A | PRL | **PARTIAL** | Lagunas de la prueba de fuego ampliadas; cobertura integral y discrepancia heredada de estados pendientes |
| 9A | Declaración sobre la Red 2027 | **PARTIAL DOCUMENTAL** | Página oficial confirma edición 31/07/2026; PDF directo 403; SHA históricos y snapshots distintos conservados |
| 9B | CEM | **PARTIAL** | Correcciones legales y editoriales verificadas; PDF asignado devuelve 403 y no coincide con snapshot local; EN 50121 y artículo sin cotejo integral |
| 10 | Preguntas | **PARCIAL** | 7 preguntas ICT + 5 Estatuto añadidas; hueco estructural de cobertura ICT 36–55 documentado |
| 11 | Memorización | **PARCIAL** | Resumen ICT reescrito; 14 tarjetas nuevas |
| 12 | Auditoría pre-Codex | **PENDIENTE** | — |

---

## Ciclo 7A — ICT (RD 346/2011)

### Hallazgo principal: el umbral del 50 % no existe

La afirmación heredada de que el artículo 3 exige que el presupuesto de una
rehabilitación supere un porcentaje del valor de la edificación **es falsa**. El
texto consolidado del artículo 3 (BOE-A-2011-5834) tiene dos apartados y en
ninguno aparece un umbral económico ni la expresión «rehabilitación integral»
como criterio de aplicación. El único «50 %» del documento está en el preámbulo
y se refiere a los hogares europeos con acceso a 100 Mbps, no a las obras.

Corregido en: `content/theories/ict-rd-346-2011.ts` (`ict-c35-1` y ss.),
`content/summaries/ict-rd-346-2011.ts`, `content/flashcards.ts` (`ict-fc-4`).

### Ámbito real del artículo 3

1. Edificios acogidos al régimen de propiedad horizontal, de uso residencial o
   no, nuevos o existentes.
2. Edificios arrendados por más de un año, **excepto** los que albergan una sola
   vivienda.

### Otras correcciones numéricas verificadas

| Dato | Valor erróneo | Valor del BOE |
|---|---|---|
| Bandas de RTV (anexo I) | 470–790 MHz / DAB banda III | 47–694 MHz y 950–2.150 MHz, más deber de protección de 694–862 MHz |
| Categoría del cableado | 5e | Clase E (categoría 6) o superior |
| Separación entre canalizaciones | 10 cm / 3 cm | 100 mm en paralelo / 30 mm en cruce |
| Rigidez dieléctrica | no citada | 1.500 V |
| Periodicidad de la ITE | ≤ 15 años | más de 30 años, cada 10 años |
| Tomas de usuario | una por estancia | una por estancia excluyendo baños y trasteros, mínimo dos |

### Artículos desarrollados

- **Art. 4.1:** correspondencia entre el reglamento y sus anexos.
- **Art. 8:** consulta a operadores. Plazo máximo de 30 días; silencio → el
  proyectista proyecta conforme al reglamento; el resultado solo afecta a la
  ejecución de las redes interiores, no al dimensionado de la obra civil salvo
  la arqueta de entrada.
- **Art. 9:** proyecto técnico con memoria, planos, pliego y presupuesto;
  distinción entre proyecto original y de ejecución; modificación sustancial.
- **Art. 10.1:** acta de replanteo, quién la redacta y firma, contenido, plazo de
  15 días naturales desde la firma.

### Anulaciones del Tribunal Supremo (2012)

Solo cayeron dos cosas: el inciso que situaba la titulación exigida en el
artículo 3 del Real Decreto-ley 1/1998 (arts. 8.2.a, 9.1, 10.1, 10.2 y sección 3
del anexo IV) y el inciso «debe ser verificado por una entidad que disponga de
la independencia necesaria» del artículo 9.1. **El plazo de 15 días naturales
sigue vigente**, lo que confirma la clave de la pregunta 5 del ciclo 6.

---

## Ciclo 7B — Estatuto ADIF (RD 2395/2004)

### Re-diagnóstico del «0/5» del ciclo 6

El ciclo 6 informó de que faltaban los artículos 2, 4, 9, 10 y 14. La
inspección en tiempo de ejecución demuestra que **sí existían** como conceptos
autogenerados (`estatuto-concept-22/23/28/29/33`), pero eran de una sola línea y
sin ejemplos. El defecto real era de profundidad, no de ausencia.

### Corrección de un hallazgo propio erróneo

En la primera pasada de este ciclo se afirmó que la reforma de 2013 había
eliminado del artículo 4 la habilitación para convenir con comunidades
autónomas. **Era falso y se ha corregido antes de publicarlo.** Contraste:

- Texto original de 2004: el artículo 4 tenía **cuatro** apartados; el primero
  regulaba los convenios o contratos-programa de encomienda de administración de
  infraestructuras de titularidad estatal.
- RD 1044/2013, disposición final primera, apartado cinco: «Se elimina el
  apartado 1 del artículo 4 pasando los apartados 2, 3 y 4 a ser los apartados
  1, 2 y 3, respectivamente».
- Redacción vigente: 4.1 = convenios con comunidades autónomas; 4.2 = convenios
  con la AGE u otras Administraciones Públicas; 4.3 = convenios de colaboración
  con RENFE-Operadora, empresas ferroviarias y entidades públicas o privadas.

Consecuencia: la clave A de la pregunta 8 del ciclo 6 (artículo 4.1 →
comunidades autónomas) **era correcta** y no requiere rectificación. Se conserva
como trampa didáctica el hecho de que el epígrafe siga titulándose «Convenios o
contratos-programa» pese a la supresión.

### Conceptos añadidos

| Concepto | Contenido |
|---|---|
| `estatuto-concept-101` | Autonomía de gestión: tres límites y cuatro criterios (art. 2) |
| `estatuto-concept-102` | Convenios del art. 4 y qué suprimió realmente 2013 |
| `estatuto-concept-103` | Objeto de la administración de la RFIG (art. 9) |
| `estatuto-concept-104` | Definición de mantenimiento (art. 10) |
| `estatuto-concept-105` | Órganos de gobierno (arts. 14 y 15) |
| `estatuto-concept-106` | Mapa de intervinientes: quién hace qué |

---

## Ciclo 8B — RCF (RD 664/2015, Libro Primero) — PARCIAL

### Continuación Codex 2026-11-04

La prueba reservada del Ciclo 6 puntuó RCF en 3/5 aciertos y 2/5 respuestas
suficientemente apoyadas por la teoría. El registro de auditoría identificó como
huecos el objetivo de recuperación tras interrupción, el relevo de servicios de
seguridad y la preferencia/metodología de las comunicaciones. Las preguntas
reservadas no se incorporaron al entrenamiento.

Se contrastó la teoría con el [texto consolidado oficial del RD 664/2015](https://www.boe.es/buscar/act.php?id=BOE-A-2015-8042), cuya cabecera fija la última actualización publicada en 12/07/2023; el propio BOE advierte que el consolidado es informativo. Los localizadores revisados fueron 1.1.1.1.2–.3, 1.1.1.5–.6 y 1.4.1.1.3, .5, .6 y .10.

Se añadieron o precisaron:

- responsabilidad de AI y EF sobre explotación segura y riesgos; reglas internas y procedimientos en sus SGS, con cooperación cuando proceda;
- obligaciones organizativas del personal ferroviario respecto de aptitud, fatiga, sustancias, distracciones y acceso autorizado;
- entrega y recepción de documentos, registros, útiles e información durante el relevo, incluyendo la obligación de resolver dudas;
- preferencia por radiotelefonía entre Maquinista y Responsable de Circulación y por telefonía fija entre Responsables; comprobación de comprensión, identificación mutua y registro del telefonema con el tren parado;
- dos ejemplos operativos, tres preguntas sobre responsabilidad y objetivos del RCF y comunicaciones, y cuatro tarjetas.

No se declaró la cobertura de los cinco capítulos ni se amplió a otros libros.
Las revisiones se limitaron a claims nuevos cotejados; el banco completo y el
capítulo 5 siguen pendientes de auditoría de suficiencia.

### Datos numéricos verificados contra el BOE

| Dato | Valor comprobado | Punto del reglamento |
|---|---|---|
| Marcha de maniobras tirando | 30 km/h | 1.1.1.3, definición de marcha de maniobras |
| Marcha de maniobras empujando | 20 km/h | idem |
| Velocidad sin protección compatible u operativa | 120 km/h | 1.1.1.7, puntos 3 y 4 |
| Tolerancia de velocidad máxima | 5 km/h durante no más de 20 segundos | 1.5.1.10, punto 1 |
| Trenes formados solo por locomotoras | 200 m y 120 km/h | 1.5.5 |

Ninguno de estos datos requería corrección: el módulo los tenía bien.

### Defecto corregido: el extracto del 1.5.1.9 no era literal

El extracto del punto 1.5.1.9 era una paráfrasis presentada como cita
(«La orden de marcha queda invalidada, entre otros casos, cuando un tren directo
queda detenido en una estación»). Sustituido por el texto literal completo de los
tres apartados, que es lo que permite sostener la trazabilidad.

### Defecto corregido: expresión absoluta

El ejemplo 3 afirmaba que la orden de marcha queda «automáticamente» invalidada.
Reescrito para reproducir el verbo del reglamento («quedará invalidada») y añadir
la distinción real entre haber rebasado o no la señal de salida.

### Profundización del concepto 13

De un solo enunciado a cuatro:

- `rcf-c13-1` — supuesto del tren directo detenido en estación.
- `rcf-c13-2` — los tres supuestos de invalidación enumerados.
- `rcf-c13-3` — las dos actuaciones del punto 2 según se haya rebasado o no la
  señal de salida o el piquete.
- `rcf-c13-4` — prohibición de autorizar la salida de la estación colateral de un
  tren en sentido contrario por la misma vía sin comunicación previa.

### Añadidos

- Pregunta `orig-tel-rcf-023` (invalidación de la orden de marcha, clave B).
- Tarjetas `rcf-fc-1`, `rcf-fc-2` y `rcf-fc-3`.

### Fuera del alcance de este ciclo

El módulo RCF tiene 26 enunciados para un reglamento de más de 500 páginas. Los
capítulos 2 a 5 siguen sin desarrollo equivalente al que se ha dado al 1.5.1.9.
Se registra en `PENDIENTES.md`.

---

## Verificación ejecutada

### Actualización Codex — 2026-11-04

El árbol ya contenía trabajo 8C posterior a este estado. Se conservó y se
retiró una atribución incorrecta a la Ley 4/2023 de la ampliación de los
principios del artículo 52; el BOE identifica la reforma de 2023 en el 53.4.
Se precisaron 53.2 y 54.5 y se repararon tres referencias que impedían
`verify:theory-claims`. Falta revisar el alcance subjetivo en ADIF, las
afirmaciones disciplinarias, las restantes modificaciones 8C y una prueba
académica independiente: no se declara el ciclo terminado.

Comprobación actual: `typecheck`, estructura, referencias y claims pasan;
`verify:content` se detiene en dos avisos de copia de incompatibilidades.
Tres suites focalizadas: 65 pruebas pasan y 3 fallan (inventario 317 frente a
315, distribución de claves del Estatuto y revisiones heredadas). `git diff
--check` señala una línea en blanco final en `content/flashcards.ts`, ajena a
esta intervención. La lista histórica de abajo no es el resultado actual.

```
pnpm typecheck                 → limpio
pnpm verify:theory             → 11 módulos, 315 conceptos, 713 claims
pnpm verify:theory-references  → pasa
pnpm verify:theory-claims      → pasa
pnpm verify:theory-copy        → 2 errores, ambos en incompatibilidades (ajeno)
pnpm verify:syllabus           → 44,44 % de cobertura completa
pnpm vitest run                → 2 fallos preexistentes (ver PENDIENTES.md)
```

`pnpm verify:content` sigue sin poder pasar porque `verify:theory-copy` señala dos
usos de «automáticamente» en `content/theories/incompatibilidades.ts`, fichero con
modificaciones locales de otro agente. Los otros dos casos detectados al inicio
(`rcf-libro-1` y `declaracion-red-2027`) **sí se han corregido**: el primero
reescribiendo el ejemplo 3, el segundo sustituyendo «efectúa automáticamente» por
«materializa» en `dr-c26-3`, al no estar ese fichero intervenido por nadie.

---

## Advertencia de método

Los ciclos 7A, 7B y 8B se han ejecutado con **pasadas de revisión separadas sobre
los mismos ficheros, no con agentes independientes**. Ninguna afirmación de este
documento debe interpretarse como «revisado por varios agentes».

## Ciclo 13 — cierre RCF Capítulo 5 + PRL III/V — 2026-11-04

**RCF Libro Primero, Capítulo 5:** cobertura completa de los puntos 1.5.1.1 a 1.5.1.23.
El módulo se reescribió como módulo limpio (36 conceptos, 40 fuentes, 9 ejemplos, 11
takeaways). Se añadieron 20 preguntas originales (`orig-tel-rcf-027`…`046`), 8 tarjetas
nuevas, 4 ejemplos y la cobertura se fijó en `covered`. El nodo `rcf-capitulo-5` pasó de
`partial` a `covered`. Se cerró un hueco detectado por la prueba académica independiente:
el artículo 1.5.1.6 ahora define comercial, restringida y técnica (rcf-c10-1 ampliado) y se
añadió `orig-tel-rcf-047`.

**Prueba académica independiente (RCF Cap. 5):** primera pasada 11/12 pleno + 1 parcial
(paradas); tras ampliar la definición, segunda pasada 12/12 pleno. La tolerancia de
velocidad (5 km/h durante 20 s) y la identificación de trenes se sostienen literalmente.

**PRL capítulos III y V:** se cubrieron los artículos que faltaban (17, 25, 26, 27, 28,
37, 39 y 40) con claims y fuentes nuevas (prl-concept-17…24). Ambos nodos pasaron de
`partial` a `covered`. Se añadieron 8 preguntas (`orig-gen-prl-019`…`026`), 3 tarjetas
(`prl-fc-6`…`prl-fc-8`) y el recuento de conceptos pasó de 338 a 346.

**Banco de preguntas:** auditoría global sin duplicados de enunciado, sin claves mal
formadas ni explicaciones cortas. Telecom spread A28/B27/C27/D26 (≤2). General-knowledge
spread ≤2. English A2 (spread 10) y psicométrico (spread 9) quedan como observación P2
sin aserción de test. DR/CEM siguen PARTIAL documental (HTTP 403, SHA-256 históricos
conservados).

**Verificación:** typecheck limpio; `verify:content` PASS; suites focalizadas PASS;
`tests/rcf-cycle13-coverage.test.ts` PASS (77 pruebas en 4 archivos).

### Continuidad de simulacros — Ciclo 18

La recuperación local del Ciclo 17 sigue disponible en la misma pestaña; la prueba de pestañas copiadas reproduce un conflicto de entrega con el almacén simulado. La idempotencia del examen completo y la persistencia real siguen sin verificar. Véase `../ADIF_360_CICLO18_CONSOLIDACION.md` para evidencia y límites.

### Continuidad de simulacros — Ciclo 19

La entrega local distingue conflicto y confirmación desconocida, con salida visible y coordinación mediante Web Locks cuando está disponible. El detalle y los límites constan en `../ADIF_360_CICLO19_CONCURRENCIA.md`. No se ha verificado entrega transaccional ni persistencia real.
