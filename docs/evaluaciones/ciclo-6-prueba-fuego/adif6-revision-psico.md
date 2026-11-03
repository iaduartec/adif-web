# Revisión psicométrica independiente — material original

Fecha: 4 de noviembre de 2026  
Alcance: `content/original-practice/psychometric.json` (38 ítems; atención especial a los 12 visuales), `content/theories/psicometria.ts` y `/tmp/adif6-q-psico.md`, `/tmp/adif6-a-psico.md`, `/tmp/adif6-b-psico.md`. Revisión editorial y de solución, no validación psicométrica ni cotejo de oficialidad ADIF.

## Dictamen

**Nota del conjunto candidato: 7,4/10, confianza 0,84**, calculada sobre ocho de sus diez preguntas. Excluyo la pregunta 1 (serie numérica insuficientemente determinada) y la 5 (red del cubo mal alineada en el bloque monoespaciado, de modo que no fija de forma fiable dónde se adhieren A y E). No deben puntuarse hasta reformularse. La pregunta 2 es convencionalmente resoluble por avance uniforme en filas y columnas; aunque todo patrón finito admite reglas alternativas, aquí la regla está mejor apoyada que en la pregunta 1.

El solucionario A acierta la clave de las diez preguntas y es conciso, pero pasa por alto la no unicidad de la serie y no advierte el problema gráfico del cubo. El solucionario B también da las claves previstas y es sustancialmente mejor como material de estudio: ofrece pasos, vincula cada ejercicio a la teoría didáctica pertinente y declara límites. Sus niveles de incertidumbre están razonablemente calibrados, salvo que llamar baja a la pregunta 5 presupone la colocación pretendida de A/E que el dibujo no deja legible. Quita ambigüedad al explicar la regla, pero no puede corregir un enunciado gráfico defectuoso.

La variedad del candidato es **moderada y útil para una primera tanda**: números, símbolos, rotación, plegado, analogía, orden, ritmo de trabajo, código y conteo. Con las dos exclusiones, quedan ocho ítems, de ellos varios muy elementales. No constituyen una muestra equilibrada de las aptitudes descritas en la teoría, ni miden velocidad bajo condiciones controladas. Deben presentarse exclusivamente como práctica original, nunca como preguntas oficiales o como instrumento diagnóstico/predictivo.

## Preguntas candidatas: corrección y decisión

| N.º | Decisión | Revisión |
|---|---|---|
| 1 | **Excluir del cómputo** | La regla de diferencias que se duplican produce 97, como dicen A y B, pero los términos no implican esa regla de manera única. B reconoce la limitación; A la presenta como conclusión. Sustituir por una regla explícita o una serie con más estructura y distractores que discriminen la operación. |
| 2 | Incluir con cautela | La opción prevista ○ sigue el avance uniforme en fila/columna. B explica la pauta; A añade innecesariamente que la fila “completa” un ciclo de cuatro. Correcta como matriz elemental, aunque el enunciado podría decir que se mantiene el mismo desplazamiento en cada fila y columna. |
| 3 | Incluir | Flecha: ↑, →, ↓, ←; A es correcta y la explicación A/B es suficiente. Medición muy directa de una regla dada explícitamente, de dificultad baja. |
| 4 | Incluir | La rotación horaria lleva ● de arriba-izquierda a arriba-derecha y ▲ de abajo-derecha a abajo-izquierda; A coincide. La explicación A/B es correcta. Buen ítem de transformación visual, aunque la lectura depende de que el bloque ASCII conserve la alineación. |
| 5 | **Excluir hasta corregir el diagrama** | La clave pretendida D (opción C) es plausible para la red descrita por B-X-C-D, con A/E en lados opuestos, pero el dibujo sitúa las cajas de A y E con ocho espacios iniciales: no quedan centradas inequívocamente sobre una cara de la tira. Al ser una tarea de plegado, el diagrama es parte del problema y no debe reconstruirse desde el solucionario. Alinear con precisión y revisar la red final antes de incluir. |
| 6 | Incluir | A, longitud, es la mejor relación instrumento-magnitud. B detecta correctamente que se trata de una relación funcional, aunque la formulación “brújula es a orientación” puede admitir matices; las opciones delimitan la respuesta suficiente. |
| 7 | Incluir | Omar < Leo < Mara < Nerea; D necesariamente queda a la izquierda. Correcto y bien explicado en A/B. Aptitud lógica elemental y poco ambigua. |
| 8 | Incluir | 84/7 = 12 paquetes/min; ×12 = 144, opción C. Correcta bajo la premisa explícita de ritmo constante. Similar a ejercicios estándar de proporción; no extrapolar a rendimiento real. |
| 9 | Incluir | Con la convención de alfabeto declarada, TREN → USFÑ, opción B. La explicación B señala que esta regla concreta no se desarrolla en la teoría, lo que es acertado. La convención explícita elimina la ambigüedad de Ñ y el retorno Z→A. |
| 10 | Incluir | Cuatro cuadrados pequeños y el cuadrado exterior: cinco, opción B. Correcto. El dibujo tiene que mantenerse cuadrado en los clientes; en texto/monoespaciado actual se entiende. |

## Banco actual: 12 ítems visuales

Revisé las doce claves, reglas narradas y descripciones gráficas disponibles. **No encontré una clave errónea entre los doce**; las soluciones visuales son, en general, verificables y se explican. La banda de cuatro caras en ambos cubos permite identificar las parejas opuestas. La rotación de caras sigue 2→3→5→4 con el punto de vista declarado. Las dos secuencias de fichas, los dos conteos de atención, el patrón de puntos, la matriz de figuras, el giro del triángulo, el tablero alterno y la matriz de marcas dan las claves que registra el JSON.

Hallazgos de calidad, no errores de clave:

- Los dos ejercicios de cubos son prácticamente el mismo esquema de tira de cuatro caras con dos tapas; cambian las letras y la cara preguntada. Es repetición de formato, no evidencia de transferencia a redes variadas.
- La rotación de cubo es el gráfico visual más denso: asegúrese de que las tres vistas que la descripción identifica sean perceptibles en la interfaz y lector de pantalla. `figureAlt` conserva los números y las caras frontal/derecha, lo que favorece accesibilidad, pero no sustituye una representación visual clara.
- El conteo de símbolos y dígitos tiene distractores de diferencia de una unidad y explicación comprobable. Es válido para atención elemental; sin límite de tiempo no mide “velocidad perceptiva”.
- `visual-matrix-001`, `-002` y `-003` son patrones 2×2/3×3 de un solo atributo (forma, tono o cantidad). `visual-pattern-001/-002` y los dominós son reglas de una sola dimensión. Son accesibles, pero la batería visual tiende a reglas muy simples y no representa de modo amplio rotaciones compuestas, simetría, relaciones simultáneas o matrices de varias reglas.
- `visual-matrix-003` enuncia “tantas marcas como indica su fila”, lo que casi da la regla en el propio enunciado; es un ejercicio de lectura/aplicación inmediata, con poca inferencia. La explicación de fila y tres marcas es consistente.
- Los doce usan `topicId` `matrices`, `attention` o `abstract-patterns`; los plegados y la rotación también están clasificados bajo `matrices`. Eso puede ser válido como agrupación de práctica, pero mezcla tipo de representación con aptitud/categoría y hace menos limpia la interpretación del progreso por habilidad.
- Las explicaciones de los visuales suelen contrastar los distractores; no hay análisis empírico que confirme que esos distractores atraigan errores reales. No inferir discriminación psicométrica de su plausibilidad editorial.

La batería textual preexistente completa el repertorio del banco (38 ítems, dos en cada uno de 13 temas, más 12 visuales repartidos en matrices, atención y patrones). Varios ítems textuales son tareas de una sola operación o recuerdo literal. La cobertura nominal de trece etiquetas no equivale a amplitud de dificultad o precisión de medición; varias parejas también son muy parecidas. La nota de los diez candidatos no debe confundirse con una calificación validada del banco completo.

## Teoría y límites de uso

`content/theories/psicometria.ts` etiqueta las afirmaciones como didácticas y la revisión editorial dice expresamente que no acredita contenido oficial; esto es una salvaguarda adecuada. También es útil el consejo de practicar primero precisión y después tiempo, y de consultar las reglas confirmadas de puntuación.

Sin embargo, el identificador/fuente `MET-PSI-01`, el título “Guía Metodológica de Evaluación de Aptitudes Cognitivas y Psicométricas”, la URL de la convocatoria PNI26/01 y el localizador “Sección de Orientación de Pruebas de Acceso” no quedan demostrados por los ficheros revisados como soporte primario de las afirmaciones atribuidas. En particular, afirmaciones de propósito sobre idoneidad, resistencia a fatiga y control del error, y la cita entrecomillada sobre un “estándar psicotécnico aplicable al personal operativo”, requieren localizar y cotejar el texto real, su versión y sección. Hasta ese cotejo, mostrar la teoría como **orientación didáctica general no verificada como contenido/criterio oficial** y retirar o marcar la cita como pendiente. Esto también aplica al ejemplo Madrid-Barcelona y a los conceptos generales que usan esa referencia como `legalBasis`: que el contenido sea razonable no convierte la referencia en evidencia.

No se aportan piloto, tamaño muestral, análisis de ítems, fiabilidad, validez de constructo/criterio, sesgo, equivalencia, normas, tiempo estándar ni condiciones uniformes de administración. La advertencia final del solucionario A es correcta y la explicación B la hace más explícita. Mantenerla junto a cualquier puntuación: el resultado solo informa del desempeño en estos ejercicios concretos; no estima aptitud, diagnóstico ni probabilidad de superar una convocatoria.

## Recomendación editorial

1. Corregir o retirar los candidatos 1 y 5 antes de publicar la tanda; volver a revisar el render del 4 en la misma UI donde se mostrarán.
2. Preferir la resolución B como formato pedagógico, conservando sus etiquetas de incertidumbre pero subordinándolas a la inspección del enunciado. A puede servir como resumen breve, no como única revisión.
3. Mantener la etiqueta “original” y la advertencia de no validación. No describir este conjunto como banco oficial, simulación ADIF calibrada o medida psicométrica.
4. Auditar la fuente de teoría con documento primario verificable (título, versión/fecha, sección y estado de vigencia); entre tanto, no atribuir a ADIF afirmaciones que solo se hallan en la teoría local.
5. Ampliar la diversidad real con reglas de más de un atributo y niveles graduados, sin crear series cuya respuesta dependa de adivinar una pauta implícita. Pilotar por separado si en algún momento se pretende interpretar métricas de dificultad, discriminación o consistencia.
