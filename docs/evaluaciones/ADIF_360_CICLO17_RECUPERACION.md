# ADIF 360 — Ciclo 17 · Recuperación e integridad de simulacros

## Resultado

La sesión original ahora sobrevive a una recarga en la misma pestaña. Se reutilizan el banco, la selección, la navegación, la corrección y la entrega existentes; no se añadió un segundo motor ni se modificó Supabase, autenticación o migraciones.

Los cuatro bancos habilitados continúan siendo los del Ciclo 16: 108 específicas, 79 generales, 46 de inglés A2 y 38 psicotécnicas. El Ciclo 16 no registró claves demostrablemente incorrectas ni ambigüedades graves como hallazgo P0. Siguen pendientes las mejoras académicas señaladas allí: pares RCF/ICT casi duplicados, distractores a veces fáciles, cobertura estrecha en algunos subtemas y dificultad editorial sin calibración. No se copiaron preguntas reservadas al entrenamiento.

## Arquitectura y datos guardados

- `sessionStorage` por pestaña, modalidad y ámbito de cuenta. El servidor obtiene el UUID de la cuenta autenticada y entrega al componente un ámbito opaco derivado por SHA-256; el UUID no se escribe en el borrador.
- Borrador estricto `schemaVersion: 2`: ID estable del intento, modalidad, instante de inicio, IDs y orden, huellas de versión de preguntas, respuestas elegidas, índice actual, milisegundos acumulados por pregunta, deadline absoluto opcional, UUID de idempotencia por respuesta y estado de entrega.
- Antes de entregar no se guardan claves ni explicaciones. Tras confirmar la entrega se guardan correcciones y resultado para que una recarga permita seguir repasándolos; esos datos locales son editables por quien controla el navegador y no tienen autenticidad frente a la clave del servidor.
- No se guardan nombre, correo, ID de cuenta ni texto de preguntas. La clave de almacenamiento incluye solo el hash de ámbito, además de versión y modalidad.

El lector valida esquema, modalidad, IDs únicos, opciones elegidas y huella de cada pregunta frente al banco revisado actual. Un borrador corrupto, de otra versión o con preguntas ya no disponibles se elimina y ofrece empezar de nuevo. La ausencia de almacenamiento no bloquea el examen: aparece un aviso de que esa sesión no podrá recuperarse con fiabilidad.

## Continuidad, tiempo y limpieza

- Al recargar se restauran conjunto y orden, respuesta actual, blancos, índice y cronómetro. El estudiante ve un aviso explícito de que se ha recuperado localmente.
- El deadline se guarda como hora absoluta. Al volver de una pestaña suspendida se recalcula; si venció durante la ausencia, se entrega automáticamente al recuperar la página. El temporizador y la fecha del equipo son manipulables; esto no es una medida antitrampas.
- Las pestañas duplicadas pueden heredar una copia de `sessionStorage`. Por ello, las claves de evento reducen duplicados por respuesta, pero no garantizan una única entrega de examen entre pestañas.
- El borrador y los resultados locales vencen a las 24 horas desde el inicio; al cargarlos después del plazo se eliminan. El botón **Nuevo simulacro** limpia explícitamente el estado ya entregado.
- Si un usuario cambia de cuenta en la misma pestaña, el hash de ámbito cambia y la nueva cuenta no puede leer ni reentregar el borrador de la anterior.

## Entrega e integridad del resultado

Antes de invocar la Server Action, la pantalla congela la entrega y escribe `deliveryState: submitting`. Tras una recarga durante una petición, reenvía el mismo orden, respuestas, tiempos y UUID de idempotencia. El control en memoria bloquea doble clic y la interfaz bloquea cambios mientras se entrega. Los blancos siguen en el denominador y se corrigen después de la entrega.

La Action existente persiste secuencialmente una RPC `record_practice_attempt` por pregunta respondida; los blancos no crean esa fila. La migración vigente impone unicidad por usuario y `client_event_id` y compara la huella de la petición al repetirla. Esto da idempotencia por respuesta con la misma petición, no una transacción atómica del examen completo. Una entrega parcial puede haber escrito respuestas antes de un error; el reintento conservado reutiliza las claves. No hay fila agregada de simulacro original, y esta recuperación no la crea.

La corrección guardada tras entregar se valida por coherencia interna y se muestra al restaurar. Al estar en `sessionStorage`, un estudiante puede alterar respuestas o resultados desde las herramientas del navegador. La corrección autoritativa de una nueva entrega sigue procediendo de la Server Action; no se presenta el almacenamiento local como registro fiable de notas.

## Revisión independiente y auditoría Ciclo 16

Un revisor Luna independiente encontró inicialmente el riesgo de cambio de cuenta. Se corrigió aislando las claves mediante el ámbito derivado de la identidad autenticada y se verificó que otro ámbito recibe `missing`, no el borrador. La revisión posterior confirmó la corrección.

Límites P2 que se mantienen explícitos:

1. Una pestaña duplicada puede copiar claves de idempotencia; entregas simultáneas divergentes pueden chocar y la entrega completa no es atómica.
2. El resultado ya entregado puede ser editado localmente; la recuperación no autentica resultados frente a la clave oculta del servidor.

La auditoría académica Cycle 16 sigue siendo la evidencia vigente para las cuatro modalidades: ninguna clave errónea demostrada en su alcance, pero dificultad no calibrada y mejoras de distractores/cobertura pendientes. Los 102 enunciados oficiales y los ocho formularios históricos pendientes permanecen bloqueados; no se cambió ningún gate o clasificación.

## Verificación del Ciclo 17

Resultados ejecutados en este ciclo:

- `pnpm typecheck`: PASS.
- `pnpm verify:content`: PASS; 11 módulos, 347 conceptos, 830 claims y 102 mapeos históricos validados. El syllabus marca 6/9 bloques completos, 2 parciales y 0 sin mapear; esto no altera el gate histórico.
- Suite general `pnpm test`: 100 archivos, 730/730 PASS.
- E2E `e2e/original-simulations.spec.ts` + `e2e/original-practice.spec.ts`: 13/13 PASS. Incluye cuatro recorridos completos, cuatro recuperaciones con viewport móvil, conservación de respuestas/blancos/orden/tiempo, resultado tras recarga, repetición de entrega única, almacenamiento corrupto o bloqueado y entrega inmediata con deadline vencido. El recorrido completo A2 conserva la lectura y el psicotécnico completo comprueba las figuras SVG.
- E2E `e2e/study-flow.spec.ts`: 1/1 PASS; confirmó 102 enunciados retenidos, cero sesión oficial jugable y ocho formularios pendientes sin enlace de apertura.
- Tests focalizados de codec, recuperación de entrega y Action: 17/17 PASS.
- `git diff --check`: PASS.

Los recorridos Playwright usan el usuario y almacén mock autorizados del entorno local. No son evidencia de persistencia real en base de datos ni de despliegue.

## Estados separados

- **PASS DE PRÁCTICA ORIGINAL:** se conserva la evidencia local anterior del Ciclo 16; no se reabrió la auditoría de práctica.
- **PASS DE SIMULACROS ORIGINALES:** PASS local por los E2E del Ciclo 16 y los recorridos de recuperación de este ciclo.
- **PASS DE RECUPERACIÓN LOCAL:** PASS para recarga y reanudación en la misma pestaña, sujeto a disponibilidad de `sessionStorage`.
- **PASS DE PERSISTENCIA REAL:** NO VERIFICADO. No se comprobó Supabase y no se creó persistencia nueva.

## Siguiente prioridad

Separar en un cambio con autorización expresa un contrato de sesión agregado y atómico en servidor para historial, recuperación entre dispositivos, comparación temporal y repaso de errores antiguos. Ese trabajo necesitaría decidir retención y privacidad y requeriría revisar las migraciones; queda fuera de este ciclo. En lo académico, mantener como prioridad reducir duplicados y fortalecer distractores/cobertura antes de ampliar bancos.
