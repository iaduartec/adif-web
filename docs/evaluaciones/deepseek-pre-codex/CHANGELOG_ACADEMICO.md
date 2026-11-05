# CHANGELOG ACADÉMICO

Registro de cambios con efecto sobre el contenido de estudio. No incluye
reformateos ni cambios de infraestructura.

## 2026-11-04 — Ciclo 9A/9B: cotejo documental y precisión CEM

- La página oficial de ADIF confirma que la edición general de DR 2027 publicada
  el 31/07/2026 incluye cambios en los capítulos 2, 4, 5 y 7. Enlaces directos
  de esa edición, el adjunto DR de PNI26/01 y el artículo CEM: HTTP 403 en la
  reconsulta ordinaria del 04/11/2026. Los SHA históricos y los snapshots
  locales, que no coinciden, permanecen registrados por separado en
  `content/source-manifest.json`; no se infiere identidad entre versiones.
- Se aclaró el estado 9A: las afirmaciones del capítulo II ligadas al snapshot
  PNI V.0 quedan `needs_review` porque ADIF anuncia cambios posteriores en ese
  capítulo y el PDF actual no está accesible para comparar.
- En `compatibilidad-electromagnetica.ts`, takeaways 4–7 ya no presentan cifras,
  ensayos y procedimientos descritos por el artículo REE de 2015 como valores
  actuales, reglas generales de irretroactividad o requisitos universales. La
  Directiva se separa entre entrada en vigor y aplicación (art. 46); el art. 19
  RD 186/2016 queda expresado como excepción condicionada de instalación fija.
  También se corrigieron la fecha de publicación de la Directiva 2004/108/CE, el
  alcance del claim sobre normas armonizadas, la mezcla entre CEM e inmunidad y
  tres ejemplos que implicaban requisitos uniformes. EN 50121 conserva estado
  pendiente de cotejo de edición y armonización.
- Revisión independiente (GPT-6 Luna): cuatro hallazgos importantes y tres
  menores; todos los puntos se corrigieron. Verificación final: 41/41 pruebas
  focalizadas, `pnpm verify:content` y `pnpm typecheck` PASS. La cobertura del
  temario permanece 44,44 %; no implica cobertura completa del programa.

## 2026-11-04 — Ciclo 8D: precisiones de incompatibilidades

- Cotejo selectivo contra la Ley 53/1984 consolidada del BOE, arts. 2–4, 12,
  14, 19 y 20. Se concretó la compatibilidad del Profesor universitario
  asociado (dedicación no superior a la de tiempo parcial), sin perder los
  requisitos generales.
- Se precisó que la excepción de administrar el patrimonio personal o familiar
  del art. 19.a queda sujeta a las limitaciones del art. 12. Se añadió
  `orig-gen-incompat-008`, sobre una oferta remunerada vinculada a un expediente
  de contratación en el que la empleada interviene. La explicación distingue
  el reconocimiento general del art. 14 de la prohibición específica del art.
  12.1.a. Se corrigió `orig-gen-incompat-002` y su localizador del art. 4.1.
- Añadidas tarjetas `incomp-fc-1/3` sobre condiciones de doble puesto público,
  Profesor asociado y alcance conjunto de los arts. 19.a y 12.
- Los avisos de copia literal «automáticamente» quedan exceptuados por separado
  en `incomp-c11-1` y `incomp-c16-1`: son efectos previstos en los arts. 14 y
  20, con condiciones que siguen expresas en cada claim.
- Verificación: 30/30 pruebas focalizadas, teoría, referencias, claims, copia
  y typecheck PASS. Revisión independiente completada con dos observaciones
  menores corregidas; el cotejo integral y el examen ciego siguen pendientes.

## 2026-11-04 — Ciclo 8A: lagunas PRL de la prueba de fuego

- Tras consultar Project Bridge (sin tareas activas en los ficheros PRL), se
  continuó el trabajo preservando cambios locales previos. Se cotejó la Ley
  31/1995 consolidada en BOE (última actualización 09/04/2026).
- Se cubrieron el deber empresarial que no se transfiere al concertar prevención
  (art. 14.4), el canal representativo de información y la comunicación directa
  de riesgos del puesto (art. 18), la consulta y participación previa (arts.
  33–34), y las reglas de designación y funciones de Delegados (arts. 35–36).
- Se añadieron cuatro preguntas originales (`orig-gen-prl-015/018`), cinco
  tarjetas (`prl-fc-1/5`) y tres ejemplos ferroviarios. El art. 35 conserva
  expresamente sus reglas para plantillas de hasta 49, las excepciones por
  convenio y las adaptaciones del empleo público.
- Los arts. 30–31 LPRL y art. 11 RD 39/1997 se presentan como **contexto
  complementario**, fuera de los capítulos I, III y V enumerados en el índice
  del extracto ADIF. Se explican modalidades, suficiencia de recursos,
  condiciones de asunción personal y actividades que deben cubrirse mediante
  otra modalidad. El RD 39/1997 art. 11 se registró como fuente primaria
  complementaria en `source-manifest.json` y `theory-source-links.json`, con
  versión consultada 2026-11-04 y SHA-256 de la página descargada.
- Revisión independiente: sin hallazgos críticos; sus observaciones sobre
  modalidades preventivas y distractores se incorporaron. 56/56 pruebas
  focalizadas, `verify:content` y typecheck PASS. El guardarraíl heredado
  `theory-validators.test.ts` registra 47/48 PASS y un fallo por divergencia
  entre el manifiesto y estados inline antiguos; no se modificó para ocultarlo.
  La suite general no se ejecutó y el ciclo sigue PARTIAL.

## 2026-11-04 — Continuación Ciclo 8B: objeto, responsabilidades, relevo y comunicaciones

### Fuente y teoría — `content/theories/rcf-libro-1.ts`

- Contraste con RD 664/2015, Libro Primero, texto consolidado BOE (última
  actualización publicada 12/07/2023), puntos 1.1.1.1.2–.3, 1.1.1.5–.6 y
  1.4.1.1.3, .5, .6 y .10.
- Ampliado el objeto para conservar la recuperación efectiva tras una
  interrupción y añadir la responsabilidad de AI/EF sobre explotación segura,
  control de riesgos, cooperación cuando procede y procedimientos SGS.
- Explicadas obligaciones de organización del personal, relevo de documentación,
  registros, útiles e información, preferencia de canales, comprobación de
  comprensión, identificación mutua y condición de tren parado para registrar
  un telefonema.
- Añadidos dos ejemplos y un esquema-resumen. Se etiquetaron como revisados solo
  los nuevos claims cotejados contra los apartados citados.

### Práctica y memorización

- Añadidas `orig-tel-rcf-024/026`, preguntas originales sobre responsabilidad
  AI/EF, comunicación Maquinista–Responsable de Circulación y el objetivo de
  marco regulador único/unificación de criterios. Reparto RCF actual: A=6,
  B=7, C=7, D=6.
- Añadidas `rcf-fc-4/7` sobre responsabilidad/SGS, relevo, comunicaciones y el
  objetivo documental adicional del artículo 1.1.1.1.
- Las preguntas reservadas del Ciclo 6 no se copiaron al entrenamiento.

### Verificación

- La prueba nueva falló primero por falta de los claims/preguntas requeridos y
  pasó luego con 3/3. La revisión independiente encontró y confirmó corregido el
  objetivo del párrafo 2 y la notación asociada; no encontró claves erróneas ni
  procedimientos inseguros en las preguntas nuevas.
- `pnpm typecheck`: PASS. Suites focalizadas de RCF/contenido/esquema: 41/41
  PASS. `verify:theory` (317 conceptos, 743 claims), references, claims y
  question mappings: PASS. `verify:syllabus`: PASS técnico, cobertura completa
  global 44,44 %.
- `tests/telecom-practice.test.ts`: 4/5 PASS; el caso restante falla primero por
  ICT 36 sin práctica, antes de llegar a las comprobaciones RCF. `verify:theory-copy`
  mantiene dos avisos literales en incompatibilidades. No se ocultan como PASS.

---

## 2026-11-04 — Ciclo 7B: Estatuto ADIF (RD 2395/2004)

### Teoría — `content/theories/estatuto-adif.ts`

- **Añadido** `verifiedEstatuto` como sello editorial con `confidence: high` y
  motivo explícito de cotejo contra BOE-A-2004-21913 (consolidado, última
  actualización publicada 28/12/2013).
- **Modificado** el helper `normativeClaim` para aceptar un cuarto parámetro
  `review` opcional. Los enunciados heredados siguen sin sello inline y siguen
  dependiendo del manifiesto: no se ha estampado una revisión masiva.
- **Añadidos** seis conceptos:
  - `estatuto-concept-101` — autonomía de gestión (art. 2): tres límites y
    cuatro criterios acumulativos.
  - `estatuto-concept-102` — convenios del art. 4: qué suprimió realmente la
    reforma de 2013, con la renumeración explicada apartado por apartado.
  - `estatuto-concept-103` — objeto de la administración de la RFIG (art. 9).
  - `estatuto-concept-104` — definición legal de mantenimiento (art. 10).
  - `estatuto-concept-105` — órganos de gobierno (arts. 14 y 15).
  - `estatuto-concept-106` — mapa de intervinientes.
- **Añadidos** los ejemplos `estatuto-ex-4` (trampa del 4.1 con la redacción
  anterior) y `estatuto-ex-5` (administrar no es transportar).
- **Añadidos** los recordatorios `estatuto-takeaway-4` a `-7`.
- **Rectificado** el ejemplo 4 y el recordatorio 7, que en la primera pasada
  afirmaban —erróneamente— que la habilitación con comunidades autónomas había
  desaparecido en 2013.

### Práctica — `content/original-practice/general-knowledge.json`

- **Añadidas** cinco preguntas revisadas con cita exacta de localizador:
  - `orig-gen-estatuto-019` — qué regula el apartado primero del art. 4.
  - `orig-gen-estatuto-020` — qué contenido se suprimió en 2013.
  - `orig-gen-estatuto-021` — objeto de la administración (art. 9).
  - `orig-gen-estatuto-022` — definición de mantenimiento (art. 10).
  - `orig-gen-estatuto-023` — órganos de gobierno (art. 14).
- **Reequilibradas** las claves de `019` y `022` para mantener el reparto A–D.

### Memorización — `content/flashcards.ts`

- **Añadidas** `estatuto-fc-1` a `estatuto-fc-6`: límites y criterios del art. 2,
  qué apartado se suprimió en 2013, contenido vigente de cada apartado del art. 4,
  por qué se mantiene el epígrafe «Convenios o contratos-programa», art. 9 frente
  a art. 10, y los dos órganos de gobierno.

### Pruebas

- `tests/content-validation.test.ts` — inventario de conceptos activos 309 → 315.
- `tests/estatuto-adif-coverage.test.ts` — conceptos publicados 56 → 62.

---

## 2026-11-04 — Ciclo 8B: RCF (RD 664/2015, Libro Primero) — parcial

### Teoría — `content/theories/rcf-libro-1.ts`

- **Corregido** el extracto de `rd664-2015-1-5-1-9`: era una paráfrasis
  presentada como cita. Sustituido por el texto literal de los tres apartados.
- **Ampliado** `rcf-concept-13` de uno a cuatro enunciados verificados:
  supuesto del tren directo detenido, enumeración completa de los tres supuestos
  de invalidación, las dos actuaciones del punto 2 según se haya rebasado o no la
  señal de salida, y la prohibición del punto 3 sobre la estación colateral.
- **Reescrito** `rcf-ex-3-app-1` para eliminar la expresión absoluta
  «automáticamente» y sustituirla por el verbo del reglamento y la distinción
  entre haber rebasado o no la señal de salida.

### Teoría — `content/theories/declaracion-red-2027.ts`

- **Reescrito** `dr-c26-3`: «efectúa automáticamente las órdenes» →
  «materializa las órdenes». Era el único de los cuatro avisos de
  `verify:theory-copy` que caía en un fichero sin cambios locales ajenos.

### Práctica — `content/original-practice/telecom.json`

- **Añadida** `orig-tel-rcf-023`: invalidación de la orden de marcha y actuación
  según se haya rebasado o no la señal de salida (clave B). Reparto A–D del
  conjunto de telecom en 16/16/16/16.

### Memorización — `content/flashcards.ts`

- **Añadidas** `rcf-fc-1` (tres supuestos de invalidación), `rcf-fc-2`
  (actuación según se haya rebasado la señal) y `rcf-fc-3` (30 y 20 km/h en
  marcha de maniobras).

### Verificado sin cambios

Velocidades de maniobras (30/20 km/h), 120 km/h sin protección compatible u
operativa, tolerancia de 5 km/h durante 20 segundos y límite de 200 m y 120 km/h
para composiciones de locomotoras: los cuatro datos ya eran correctos.

---

## 2026-11-04 — Ciclo 7A: ICT (RD 346/2011)

### Teoría — `content/theories/ict-rd-346-2011.ts`

- **Retirado** el sello `reviewedIct` que otro agente había aplicado en bloque a
  63 enunciados. Sustituido por `pendingIct` (`needs_review`, confianza baja,
  motivo explícito) salvo en los enunciados cotejados uno a uno, que llevan
  `verifiedIct`.
- **Corregido** `ict-c35-1`: eliminado el umbral del 50 % inexistente. El
  concepto 35 se reescribe en cuatro enunciados con el ámbito real del art. 3.
- **Corregido** `ict-c42-1`: bandas 47–694 MHz y 950–2.150 MHz más el deber de
  protección de 694–862 MHz.
- **Corregido** `ict-c46-1`: clase E (categoría 6) o superior, no 5e.
- **Corregidos** `ict-c48-1`, `ict-c49-1`, `ict-c50-1`, `ict-c51-1` y `ict-c52-1`:
  niveles de hogar digital, periodicidad de la ITE, bloques documentales del
  anexo IV, número de tomas por estancia y separaciones entre canalizaciones.
- **Añadidos** los conceptos 56 a 61 con 21 enunciados verificados: art. 4.1,
  consulta a operadores (art. 8), documentos del proyecto (art. 9), acta de
  replanteo (art. 10.1), mapa de responsabilidades y anulaciones del Tribunal
  Supremo de 2012.
- **Añadidos** los ejemplos `ict-ex-2` a `ict-ex-4` y ampliados los
  recordatorios de 6 a 10.

### Resumen — `content/summaries/ict-rd-346-2011.ts`

- Reescrito de tres a cinco secciones. Eliminado el dato del 50 %, corregidos
  RITU-A, categoría de cable, distancias de separación, periodicidad de la ITE,
  niveles de hogar digital y secuencia documental.

### Práctica — `content/original-practice/telecom.json`

- **Añadidas** `orig-tel-ict-035` a `-039`, una por cada hueco del ciclo 6.
- **Añadidas** `orig-tel-ict-040` (quién genera la consulta del art. 8) y
  `-041` (alcance real de las anulaciones de 2012).
- **Reequilibradas** las claves de `035`, `037` y `039`.

### Memorización — `content/flashcards.ts`

- **Corregida** `ict-fc-4` (la tarjeta del 50 %).
- **Añadidas** `ict-fc-31` a `ict-fc-38`.

### Pruebas

- `tests/content-validation.test.ts` — inventario 296 → 309 (primera tanda).
- `content/summaries` — secciones ICT 3 → 5.
