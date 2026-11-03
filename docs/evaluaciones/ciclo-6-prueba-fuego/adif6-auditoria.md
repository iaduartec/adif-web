# Auditoría independiente ADIF 6 — resultados provisionales

**Corte:** 04/11/2026. **Alcance actual:** bloque jurídico (15) y bloque técnico más RCF (20). Enunciados/preguntas RCF proceden de `/tmp/adif6-a-ferro.md`; las respuestas RCF, de `/tmp/adif6-b-tecnico.md`. Contraste de suficiencia contra teoría presente en el checkout local; contraste normativo contra claves y fuentes primarias BOE. No se ha modificado el repositorio.

## Criterio y denominadores

- Las etiquetas califican la **respondibilidad del ítem desde la teoría actual**, determinada por enunciado/opciones y cobertura, sin mirar si B contestó o se abstuvo: **RESPONDIBLE** = hay apoyo suficiente para resolver; **PARCIAL** = apoyo incompleto; **NO** = la teoría no permite sostener la opción; **INVALIDADA** = enunciado/gráfico o clave defectuoso que impide puntuar.
- La exactitud se calcula aparte: aciertos de B / total del documento (las abstenciones no son aciertos). También informo exactitud entre respuestas elegidas y cobertura para que 100 % de acierto entre intentos no oculte blancos.

| Bloque/respuestas | Ítems válidos | Elegidas | Aciertos / total | Exactitud entre elegidas | Cobertura | Suficiencia plena / parcial / ausente |
|---|---:|---:|---:|---:|---:|---:|
| Jurídico B | 15 | 15 | 15/15 (100 %) | 15/15 (100 %) | 15/15 (100 %) | 10/15 (66,7 %) / 3 / 2 |
| Técnico + RCF B | 20 | 8 | 8/20 (40 %) | 8/8 (100 %) | 8/20 (40 %) | 4/20 (20 %) / 5 / 11 |
| **Total normativo B** | **35** | **23** | **23/35 (65,7 %)** | **23/23 (100 %)** | **23/35 (65,7 %)** | **14/35 (40 %) / 8 / 13** |

Las abstenciones cuentan como no acierto en `aciertos/total` y reducen cobertura. La etiqueta de respondibilidad de cada fila se asignó de forma independiente: primero según opciones y teoría del checkout, después comparé la letra del alumno con la clave. Así, una respuesta puede ser correcta y aun quedar `NO` si carece de cobertura suficiente; un blanco puede corresponder a un ítem respondible. Se revisaron los enunciados completos en `/tmp/adif6-q-legal.md`, `/tmp/adif6-q-tecnico.md` y `/tmp/adif6-q-ferro.md`; no se detecta invalidez en los 35 enunciados normativos. En jurídico #2 sería más preciso decir que el trato se produce «como consecuencia de» la queja, no solo después de ella; la opción C sigue siendo la única que puede describir el supuesto y no se invalida.

## Jurídico — B vs clave A

La lista de claves (de `/tmp/adif6-a-legal.md`, corroboradas como fundamento por `/tmp/adif6-revision-claves.md`) es 1 B, 2 C, 3 A, 4 B, 5 D, 6 A, 7 C, 8 B, 9 D, 10 B, 11 B, 12 C, 13 A, 14 C, 15 B. B elige las 15 claves. La clase de cada fila mide si la teoría permite responder el ítem, no si B lo acertó.

| Ítem | B | Estado | Suficiencia de teoría actual y cita exacta |
|---:|:---:|---|---|
| 1 | B | RESPONDIBLE | Completa: `igualdad-c4-1`, definición propósito **o** efecto (`content/theories/igualdad.ts:293-297`). |
| 2 | C | RESPONDIBLE | Completa para represalia por queja/reclamación/denuncia/recurso: `igualdad-c6-1/2` (`igualdad.ts:335-345`); matiz: la claim omite «demanda», aunque la fuente legal enlazada es art. 9. |
| 3 | A | RESPONDIBLE | Completa: parte demandada, ausencia de discriminación y proporcionalidad (`igualdad.ts:371-375`). |
| 4 | B | RESPONDIBLE | Completa: claim 50 o más y negociación con representación (`igualdad.ts:383-387`); el extracto del art. 45 reproduce elaborar/aplicar y negociación conforme a legislación laboral (`igualdad.ts:128-135`). |
| 5 | D | RESPONDIBLE | Completa para definición general de 40–60: DA 1.ª y claim (`igualdad.ts:182-189`, `413-422`). El takeaway 4 estrecha su contexto a selección, pero no borra el claim general. |
| 6 | A | RESPONDIBLE | Definición completa de prevención, art. 4 (`prevencion-riesgos-laborales.ts:321-325`). |
| 7 | C | PARCIAL | El curso declara deber general de protección (`prevencion-riesgos-laborales.ts:186-190`, `355-359`), pero no la regla concreta de art. 14.4: encomendar/concertar prevención no exime al empresario. |
| 8 | B | PARCIAL | Solo cubre información directa sobre riesgos y medidas del puesto (`prevencion-riesgos-laborales.ts:40-46`, `414-418`); no el canal general por representantes. |
| 9 | D | PARCIAL | Solo marco general de consulta/participación (`prevencion-riesgos-laborales.ts:248-252`); no el art. 33.2 ni su alcance. |
| 10 | B | NO | La respuesta coincide con clave, pero el curso solo dice que varía según escala (`prevencion-riesgos-laborales.ts:104-110`, `532-536`), sin el tramo 50–100 = dos delegados. |
| 11 | B | RESPONDIBLE | Completa: art. 3 exige autorización previa y expresa fundada en interés público (`incompatibilidades.ts:43-49`). |
| 12 | C | RESPONDIBLE | Completa para la excepción y dedicación exclusiva (`incompatibilidades.ts:61-67`; claim `incomp-c3-1`, `242-246`). |
| 13 | A | RESPONDIBLE | Completa, incluido límite y autoridad habilitada para excepción (`incompatibilidades.ts:88-94`, `incomp-c5-1` en `268-272`). |
| 14 | C | RESPONDIBLE | Completa: asuntos en intervención actual, en los dos últimos años o futura por puesto (`incompatibilidades.ts:124-130`, `incomp-c9-1` en `320-324`). |
| 15 | B | NO | B coincide con clave BOE, pero teoría no define remuneración; extracto del art. 1 se limita a prohibición general y doble percepción (`incompatibilidades.ts:25-31`). No hay claim definitoria. |

**Validez de pregunta:** los enunciados completos están en `/tmp/adif6-q-legal.md`. No detecto ítems jurídicos inválidos. La pregunta 2 tiene un matiz causal que conviene corregir: el artículo 9 exige que el trato adverso derive de la queja, mientras que el stem solo dice que ocurre después; por su redacción como posibilidad («puede constituir») y por ser C la única opción que recoge la protección, mantengo C como clave, sin contarla como invalidada.

## Técnico + RCF — B vs preguntas y clave A

### ICT / Estatuto ADIF / EBEP

| Ítem | B | Clave | Estado | Causa y cita exacta de teoría |
|---:|---|:---:|---|---|
| 1 | Abstención | B | NO | Abstención correcta como control de cobertura: no consta art. 3.2 ni excepción de edificio de vivienda única; teoría de ámbito trata otros supuestos (`ict-rd-346-2011.ts:282-292`, `727-732`). |
| 2 | A | A | PARCIAL | Sí relaciona anexos I y II (`ict-rd-346-2011.ts:25-40`, `142-150`), pero omite norma técnica básica de edificación y mínimo del anexo III como dice opción A. |
| 3 | Abstención | C | NO | Teoría describe memoria/planos/pliego, pero no lista los cuatro mínimos ni presupuesto (`ict-rd-346-2011.ts:132-139`, `ict-concept-16` en `477-486`). |
| 4 | Abstención | A | NO | No se localiza art. 8.2 ni efecto de la consulta a operadores en teoría ICT. |
| 5 | Abstención | B | NO | No se localiza plazo de 15 días naturales del art. 10.1 en teoría ICT. |
| 6 | Abstención | B | NO | `estatuto-adif.ts` no desarrolla art. 2 ni estos criterios. |
| 7 | Abstención | B | NO | El curso describe genéricamente administrar infraestructura, no el desglose del art. 9.1 (`estatuto-adif.ts:81-84`). |
| 8 | Abstención | A | NO | No consta habilitación de art. 4.1 en la teoría. |
| 9 | Abstención | C | NO | El curso trata el Consejo bajo art. 15, no la lista del art. 14 (`estatuto-adif.ts:86-89`). |
| 10 | Abstención | A | NO | No está el concepto de mantenimiento del art. 10.1 en la teoría. |
| 11 | A | A | RESPONDIBLE | Completa: extracto del art. 52 y claim cubren diligencia, interés general, ordenamiento y principios (`codigo-conducta.ts:6-12`, `55-59`). **La nota `/tmp/adif6-revision-claves.md` está equivocada** al afirmar que el 03/10/2026 no es actualización publicada: la cabecera actual del BOE muestra esa fecha; el art. 52 actual conserva el texto preguntado ([BOE RDL 5/2015](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719), cabecera 59–60 y art. 52 1660–1662). |
| 12 | Abstención | B | NO | El extracto actual del curso art. 53 no incluye apartado 2, ni `conducta-c2-1` (art. 53.5, abstención por interés personal) sustituye el principio distinto de art. 53.2 (`codigo-conducta.ts:15-21`, `63-71`). Abstención razonable. |
| 13 | C | C | RESPONDIBLE | Texto coincidente con art. 54.3 en extracto y claim (`codigo-conducta.ts:24-30`, `91-95`). |
| 14 | B | B | PARCIAL | Austeridad/no provecho propio está cubierto; deber de conservación no está en el extracto ni takeaway (`codigo-conducta.ts:24-30`, `135-139`). |
| 15 | C | C | PARCIAL | Ejemplo respalda rechazo por superar usos habituales, pero no recoge inciso penal de la opción (`codigo-conducta.ts:114-122`). |

### RCF Libro Primero

| Ítem | B | Clave A | Estado | Causa y cita exacta de teoría |
|---:|---|:---:|---|---|
| 16 | B | B | PARCIAL | B recoge el objeto normal/degradado, pero la teoría no menciona la recuperación tras interrupción (`rcf-libro-1.ts:178-186`). |
| 17 | B | B | RESPONDIBLE | Ámbito territorial RFIG en introducción y ámbito subjetivo en claim (`rcf-libro-1.ts:163-166`, `250-258`). |
| 18 | C | C | RESPONDIBLE | Prevalencia AESF/normas europeas, AI, EF, literal en claim (`rcf-libro-1.ts:190-198`). |
| 19 | Abstención | B | NO | La teoría consultada no desarrolla relevo y recepción de documentación/seguridad. |
| 20 | Abstención | B | NO | Mencionar radiotelefonía como equipamiento no sustenta preferencia ni comprobación de comprensión (`rcf-libro-1.ts:262-270`). |

Las cinco claves RCF de A coinciden con el texto consolidado BOE consultado, que señala actualización publicada el 12/07/2023. Los artículos/puntos son 1.1.1.1, 1.1.1.2, 1.2.1.1, 1.1.1.6 y 1.4.1.1; [fuente primaria RCF](https://www.boe.es/buscar/act.php?id=BOE-A-2015-8042). Sobre comunicación, el BOE establece medios verbales y preferencia por radiotelefonía cuando posible, así como comprobación de comprensión, art. 1.4.1.1.3 y 1.4.1.1.5.

## Defectos y prioridades

1. **Actualizar material de estudio contra huecos que generan abstenciones o inferencias:** ICT art. 3.2, 4.1 (obra civil), 8.2, 9.1 lista mínima y 10.1; Estatuto ADIF arts. 2, 4.1, 9.1, 10.1 y 14; LPRL arts. 14.4, 18 (canal general), 33.2 y 35.2; EBEP arts. 53.2 y 54.5–.6 completos; RCF recuperación, relevo y comunicaciones reglamentarias.
2. **Dejar explícito cuándo el curso solo permite inferir:** técnico #2, jurídico #7–9, técnico EBEP #14–15 y RCF #16; conservar abstención en cuestiones fuera de cobertura en vez de presentar una letra “probable”.
3. **Revisar la revisión de claves:** retirar el falso reparo sobre la actualización BOE del EBEP al 03/10/2026. La fecha sí aparece como última actualización en la página primaria actual. La tesis del revisor sobre que `p=20261003` no acredita la fecha no aplica a la página vigente consultada, que muestra la actualización de forma explícita.
4. **Conseguir los enunciados/opciones jurídicos completos** antes de certificar ambigüedad, unicidad o invalidez de esos ítems. La tabla de arriba evalúa letra, fundamento y cobertura; no reemplaza auditoría de stem.

## Límites

La teoría consultada es el contenido del árbol de trabajo al inicio de esta auditoría; Git registra cambios locales ajenos a esta tarea y no se sobrescribieron. Las fuentes BOE consolidadas son informativas, como advierte su propia cabecera; el material debe fijar la redacción/fecha exigida por el temario. No se hizo una afirmación sobre previsión de examen, rendimiento real ni aprobación oficial.

## Inglés A2 — evaluación adicional

Se contrastan `/tmp/adif6-q-ingles.md`, `/tmp/adif6-a-ingles.md`, `/tmp/adif6-b-ingles.md` y teoría actual `content/theories/ingles-a2.ts`.

| Ítem | B | Clave | Estado | Suficiencia/cita exacta |
|---:|---|:---:|---|---|
| 1 | B | B | RESPONDIBLE | Plena: hábito y 3.ª persona singular, `ingles-a2.ts:51-55`. |
| 2 | C | C | RESPONDIBLE | Plena: pasado continuo interrumpido por pasado simple, `ingles-a2.ts:193-197`. |
| 3 | C | C | RESPONDIBLE | Plena: much con incontables y contexto negativo, `ingles-a2.ts:94-98`. |
| 4 | Abstención | A | NO | La teoría cubre at/in/on, no between (`ingles-a2.ts:88-92`); abstención cuenta como no acierto. |
| 5 | A | A | RESPONDIBLE | Plena: should para consejo y verbo base, `ingles-a2.ts:79`. |
| 6 | B | B | RESPONDIBLE | Plena: Past Simple con referencia pasada terminada y contraste con Present Perfect, `ingles-a2.ts:200-206`. |
| 7 | No responde | A | INVALIDADA | El hueco admite `No, thanks`, pero la continuación fija “please. Just water”, que acepta/pide la bebida. Contradicción pragmática; no puntuar ni incluir en denominador. |
| 8 | B | B | RESPONDIBLE | Plena: dato literal del texto; no requiere teoría gramatical adicional. |
| 9 | C | C | RESPONDIBLE | Plena: dato literal del texto. |
| 10 | C | C | RESPONDIBLE | Plena: will + verbo base como ofrecimiento, `ingles-a2.ts:71-72`. |

De las **9 preguntas válidas**, B acierta 8: **8/9 = 88,9 %** (ocho elegidas correctas, una abstención); entre respuestas contestadas, **8/8 = 100 %**. La suficiencia plena (ítems `RESPONDIBLE`) es **8/9**. La pregunta 7 queda excluida por invalidez; sin excluirla, B no la respondió, pero no debe computarse como error ordinario. En este bloque, la etiqueta no depende de que B se abstuviera en la pregunta 4.

## Psicotécnicos — evaluación adicional

Se usa `/tmp/adif6-revision-psico.md` como auditoría independiente de los enunciados; excluye Q1 (serie insuficientemente determinada) y Q5 (red del cubo mal alineada en ASCII). Para puntuación quedan **8 ítems válidos**. El contenido de teoría es didáctico, no material oficial: `content/theories/psicometria.ts`.

| Ítem | B | Clave prevista | Estado | Suficiencia/cita exacta |
|---:|---|:---:|---|---|
| 1 | C | C | INVALIDADA | La pauta de diferencias duplicadas da 97, pero el enunciado no la determina de modo único. B advierte la no unicidad; excluir del cómputo. Teoría general de series `psicometria.ts:71-80`. |
| 2 | A | A | RESPONDIBLE | Plena para detectar regla de fila/columna (`psicometria.ts:97-106`). |
| 3 | A | A | RESPONDIBLE | Plena: giros como transformación, además de regla explícita en el stem (`psicometria.ts:110-120`). |
| 4 | A | A | RESPONDIBLE | Plena en nivel de principio: proyectar giro, regla dada en stem (`psicometria.ts:110-120`). |
| 5 | C | C | INVALIDADA | El texto ASCII no fija inequívocamente el anclaje de caras A/E; la solución presupone geometría no legible. No puntuar. |
| 6 | A | A | PARCIAL | Teoría cubre analogías/relaciones semánticas, no esta relación instrumento–magnitud específica (`psicometria.ts:19-29`, `260-268`). |
| 7 | D | D | PARCIAL | Solución lógica correcta; teoría trata deducción, pero no orden espacial explícitamente (`psicometria.ts:84-94`). |
| 8 | C | C | RESPONDIBLE | Plena: proporciones/velocidades y operación mínima (`psicometria.ts:45-54`). |
| 9 | B | B | RESPONDIBLE | Plena en el nivel de secuencias; la regla del alfabeto está dada en el enunciado (`psicometria.ts:162-172`). |
| 10 | B | B | PARCIAL | Correcto; teoría cubre búsqueda/conteo de elementos en secuencia, no conteo geométrico de figuras compuestas (`psicometria.ts:123-132`). |

En 8 ítems válidos, B obtiene **8/8 = 100 %**; sobre los 10 ítems publicados, las dos inválidas se excluyen y se informa **8/8 válidos acertados, 2 no puntuables**. Respondibilidad plena: **5/8**; parcial: **3/8**; sin cobertura: **0/8**. Q1 es convencional pero no unívoca; Q5 requiere corregir el dibujo antes de usar. La clasificación de las ocho preguntas válidas se hizo aunque B hubiera contestado todas.

La revisión externa específica del conjunto advierte además que la teoría psicométrica tiene referencias de fuente primaria no demostradas y que el ejercicio no está pilotado ni validado; los resultados solo describen estos ítems originales concretos, no aptitud ni probabilidad de superar una convocatoria. Mantener el carácter de práctica original y el límite no diagnóstico/no predictivo.
