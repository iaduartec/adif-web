# Auditoría Codex del trabajo de DeepSeek — en curso

> Actualización de continuidad 2026-11-04: las clasificaciones inferiores son iniciales, no una fotografía final. Se realizaron reparaciones en ICT, Estatuto, TREBEP, RCF, incompatibilidades y CEM; siguen pendientes la auditoría exhaustiva, la aplicación laboral concreta del TREBEP, las ediciones oficiales DR/CEM y la evaluación global. Segunda muestra independiente TREBEP: 4/4 respuestas y 4/4 con respaldo suficiente, sin demostrar cobertura completa. Resultado general más reciente: 670 pruebas pasan y 2 fallan; `verify:content` falla por dos avisos literales de incompatibilidades. Detalle y próximos pasos en `REANUDACION.md` y `RESUMEN_TREBEP.md`.

> Contraste posterior sobre 8C: la aplicación general del Código al personal laboral de ADIF queda respaldada por [las instrucciones estatales BOE de 2007, apartados 4 y 12](https://www.boe.es/eli/es/res/2007/06/21/(1)/con), además de los arts. 2 y 7 TREBEP y art. 27 del Estatuto ADIF. Un segundo especialista revisó la conclusión. Se conserva la cautela para responsabilidades concretas y para el PDF ADIF de octubre aún inaccesible; 8C sigue PARTIAL por esa limitación documental. Pruebas focalizadas de esta actualización: 60/60.

Fecha: 2026-11-04. Árbol principal `main`, HEAD `9efd1abbe92a9e04aaa61089c265c2794ff4d581`. Los cambios son locales y mezclan trabajos; los informes anteriores son pistas, no prueba de autoría ni de corrección. Se ha inspeccionado el diff frente a HEAD, Project Bridge, el registro académico y los documentos del ciclo 6. La identificación de DeepSeek en esta tabla procede de su propio registro y debe leerse como procedencia declarada, no como atribución verificada mediante commits.

## Matriz inicial y puerta A

| Bloque | Procedencia y contenido identificado | Clasificación inicial | Límite y reparación |
|---|---|---|---|
| 7A ICT | Registro DeepSeek: teoría y resumen ICT, 6 conceptos, 7 preguntas, 8 tarjetas y modificaciones de claims. | ACCEPT_WITH_FIXES provisional | Revisar artículo por artículo y anexos; faltan preguntas para conceptos 36–55. Auditoría independiente en curso. |
| 7B Estatuto | Registro DeepSeek: conceptos 101–106, dos ejemplos, cinco preguntas, seis tarjetas y tests de inventario. | ACCEPT_WITH_FIXES provisional | Su profundidad y referencias requieren contraste independiente; la teoría sigue incompleta. |
| 8B RCF | Registro DeepSeek: punto 1.5.1.9, un ejemplo, una pregunta y tres tarjetas. El BOE confirma los tres supuestos y el esquema de actuación del punto 1.5.1.9, con la condición «cuando proceda». | ACCEPT_WITH_FIXES provisional | No demuestra cobertura completa de Libro 1. Revisar además las referencias a los capítulos antes de ampliar. |
| 8C TREBEP | Cambios en teoría, resumen y preguntas; Bridge registra correcciones posteriores de Codex. El origen detallado de cada cambio no se deduce del diff. | REWORK parcial | Persisten atribución falsa en pregunta 006, inferencia disciplinaria de pregunta 008 y generalizaciones sobre ADIF. Auditoría independiente en curso. |
| 8D Incompatibilidades | Existían modificaciones previas de origen no establecido; no consta ciclo DeepSeek concluido. | PENDING | Los dos avisos de copia corresponden a expresiones expresas en los arts. 14 y 20; no borrarlas para forzar un PASS. |
| 8A PRL | Cambios previos de otro trabajo; revisión de estados en conflicto con manifiesto. | BLOCKED | Preservar trabajo PRL paralelo. |
| 9A DR | Registro DeepSeek declara cambio aislado de redacción; edición asignada no cotejada. | BLOCKED | Ediciones 2027 pendientes de cotejo documental. |
| 9B CEM | Sin ciclo acreditado. | PENDING | Artículo original REE pendiente de cotejo. |
| 10 Preguntas / 11 Pedagogía | Hay adiciones en ICT, Estatuto y RCF; no se ha completado una auditoría integral de preguntas ni tarjetas. | REWORK parcial | Revisar claves y explicaciones, preservar preguntas oficiales y reservas. |
| 12 Reevaluación | No consta nueva prueba independiente. | PENDING | Mantener separadas preguntas inéditas, claves y resolución ciega. |

## Hallazgos confirmados iniciales

1. **INCORRECT / P0:** `orig-gen-conducta-006` atribuye a la Ley 4/2023 la adición de cinco principios al art. 52 del TREBEP. El consolidado identifica esa reforma en el art. 53.4; la afirmación y la premisa de la pregunta son falsas. [TREBEP, arts. 52 y 53](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719#a52). Origen exacto no probado por Git.
2. **SOURCE_MISMATCH / P0:** `orig-gen-conducta-008` presenta como consecuencia establecida por el art. 52 la apertura de expediente. Ese artículo dice que los principios informan la interpretación y aplicación del régimen disciplinario; no tipifica por sí solo una infracción ni fija una sanción. Misma limitación en `conducta-c6-2` y recordatorio 1.
3. **INCOMPLETE / P0:** `conducta-intro-2` y `conducta-c7-1` atribuyen de forma indiscriminada el Código a todo el personal de todas las entidades públicas. El art. 2 TREBEP habla del personal laboral **en lo que proceda**, el art. 7 remite además a normas laborales y convencionales, y el art. 27 del Estatuto ADIF dispone el régimen laboral de su personal laboral. Estas referencias son contexto, no sustituyen una determinación de cada relación concreta. [TREBEP, arts. 2 y 7](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719#a2); [Estatuto ADIF, art. 27](https://www.boe.es/buscar/act.php?id=BOE-A-2004-21913#a27).
4. **Falso positivo editorial confirmado:** `incomp-c11-1` e `incomp-c16-1` incluyen «automáticamente» con las condiciones que figuran respectivamente en los arts. 14 y 20 de la [Ley 53/1984](https://www.boe.es/buscar/act.php?id=BOE-A-1985-151#a14). La presencia de esa palabra no demuestra que la afirmación sea excesiva. Revisar el contexto completo antes de modificar el control o la teoría.
5. **VERIFIED_WITH_QUALIFICATION:** el extracto añadido sobre la invalidación de orden de marcha concuerda en lo contrastado con [RCF 1.5.1.9](https://www.boe.es/buscar/act.php?id=BOE-A-2015-8042). El resumen debe conservar «cuando proceda» para notificar reanudación.
6. **INCORRECT / P0:** el Estatuto art. 3.2 prohíbe a ADIF prestar transporte ferroviario **salvo el inherente a su actividad**. `estatuto-c103-3`, el ejemplo 5, la tarjeta `estatuto-fc-5` y la explicación de `orig-gen-estatuto-021` omiten esa excepción. La pregunta conserva una clave correcta para el art. 9, pero su explicación debe corregirse. [Estatuto ADIF art. 3](https://www.boe.es/buscar/act.php?id=BOE-A-2004-21913#a3).
7. **INCOMPLETE / P1:** cuatro tarjetas ICT heredadas mantienen rango TDT antiguo, categoría 5e en dispersión, inspecciones de 15 años y niveles de hogar digital inconsistentes con el material corregido. La atribución a DeepSeek de esos errores antiguos no está demostrada.
8. **SOURCE_MISMATCH / P1:** `ict-c52-1` confunde la excepción a distancias (canalización interior de usuario) con los tabiques de 1.500 V en canalizaciones secundarias conjuntas, y cita el anexo II en vez del III. [RD 346/2011, anexo III, apartado 8](https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834#anex3).
9. **VERIFIED_WITH_QUALIFICATION / P1:** los 30 años y 10 años aparecen en la introducción del anexo IV de ICT, pero no queda verificada como regla general vigente territorial; además la inspección que incluye ICT es condicional y el protocolo del art. 13.3 es orientativo. No sustituir por un plazo universal no cotejado. [RD 346/2011 art. 13 y anexo IV](https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834#a13).

Tres revisores Codex independientes (modelo Luna, sin modificaciones) cotejaron ICT, Estatuto y TREBEP. Su cobertura se limita a los puntos identificados, no a todas las afirmaciones. El análisis propio confirmó en el BOE las excepciones anteriores. El extracto de los arts. 53 y 54 del TREBEP es parcial, no una reproducción integral.

## Reproducción inicial

- `pnpm typecheck`: PASS.
- `pnpm verify:content`: FAIL en dos avisos de copia de incompatibilidades; estructura, referencias y claims pasan previamente.
- `pnpm verify:syllabus`: PASS técnico; 4 de 9 apartados oficiales completos, 4 parciales y 1 sin mapear. La métrica estructural no mide veracidad ni preparación.
- `pnpm vitest run tests/content-validation.test.ts tests/estatuto-adif-coverage.test.ts tests/theory-validators.test.ts tests/telecom-practice.test.ts tests/general-knowledge-practice.test.ts`: 71 PASS, 4 FAIL. Inventario 317 frente a 315; distribución de claves Estatuto; falta práctica para ICT 36; revisión heredada en PRL. Cada causa requiere revisión; no se ha realizado una suite general.
- `git diff --check`: fallo por línea blanca final preexistente en `content/flashcards.ts`.

## Reparaciones inmediatas

1. Cotejar y corregir teoría y preguntas 006/008 de TREBEP, manteniendo procedencia y sin inventar un régimen disciplinario aplicable.
2. Completar las auditorías independientes de ICT, Estatuto y TREBEP; contrastar sus hallazgos con el código y las fuentes antes de editar.
3. Reexaminar avisos de incompatibilidades y cada fallo de test por causa, sin alterar el trabajo PRL ni rebajar controles por conveniencia.
4. Continuar los ciclos según las fuentes, preservando reservas de evaluación y edición documental.

El presente documento es deliberadamente parcial: no autoriza a considerar auditadas todas las afirmaciones de DeepSeek ni completo el temario.
