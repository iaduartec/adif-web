# ADIF 360 — Ciclo 19 · Concurrencia y entrega

## Causa y reproducción

La prueba del Ciclo 18 se ejecutó de nuevo antes de cambiar código: 2/2 PASS en Chromium con cuenta y almacén simulados. La pestaña A inició un intento y respondió; `window.open` creó B con copia del mismo `attemptId`, orden, respuesta e ID de evento en `sessionStorage`. B cambió la respuesta; A envió una Server Action y recibió corrección; B envió una Action con el mismo ID de evento y otra carga y recibió error. La RPC simulada rechazó la huella distinta. La Action clasificaba todos los errores como reintentables; el componente conservaba el envío congelado, no ofrecía salida y al recargar reenviaba automáticamente. El test original no registró valores UUID concretos ni inspeccionó filas reales: el comportamiento de esos identificadores se verificó en el código y en el fixture, no en una base remota.

## Cambios y estados

La Action distingue el conflicto conocido por código `23514` y el texto concreto de la excepción de idempotencia de la migración local. Un error de red, respuesta perdida o espera de 30 segundos se trata como confirmación desconocida. La coincidencia de texto depende de la forma real de error PostgREST, no verificada en servidor real; ante una forma distinta se conserva la clasificación prudente de confirmación desconocida.

La pantalla distingue `in_progress`, `submitting`, `submitted`, `conflict`, `submission_unknown` y `recoverable_error`; el borrador mantiene también el estado anterior `delivered` para compatibilidad. Las respuestas y tiempos de una entrega quedan congelados. Conflicto muestra que otra pestaña pudo entregar y ofrece volver o empezar un nuevo intento con confirmación. En confirmación desconocida se conserva la copia, se explica que pueden existir escrituras parciales y no se reenvía automáticamente al recargar; el reintento es explícito y usa los mismos IDs y carga. El timeout deja de esperar pero no cancela una Action ya enviada: una respuesta tardía puede haber procesado datos y no se toma como confirmación de pantalla. Una Action no atómica no permite garantizar por este mecanismo que dos reintentos en vuelo sean seguros en el servidor real. Reiniciar puede volver a registrar preguntas como práctica y la confirmación lo advierte. El resultado anterior solo se muestra si existe en el borrador entregado de esa pestaña; no se inventa una nota.

La Action compara el ámbito de la cuenta que inició el intento con la identidad autenticada actual antes de cualquier RPC. Una diferencia detiene la entrega; el hash es espacio de nombres, no credencial. Se probó con dos identidades simuladas en prueba de Action, no con inicio/cierre de sesión real en E2E.

## Coordinación y límites

Un Web Lock exclusivo y no bloqueante por ámbito de cuenta e ID del intento permanece durante la vida de la pestaña. Una copia que no lo obtiene presenta una salida visible y no permite responder ni entregar. Al cerrar el dueño, una recarga de la copia puede obtener el lock si no se inició una entrega; se advierte que su instantánea puede carecer de cambios posteriores del dueño. Un marcador compartido de estado y fecha en localStorage ayuda a evitar que una copia antigua se entregue tras el cierre de la pestaña que inició o completó la entrega; no contiene respuestas ni correcciones. Se consulta bajo el lock, y caduca lógicamente a las 24 horas. Es manipulable y no certifica un resultado.

Sin Web Locks se permite continuar con aviso explícito de ausencia de coordinación: la detección de conflicto de servidor y salidas siguen disponibles. Si localStorage falla también se avisa; un cierre durante un envío puede dejar una copia antigua sin poder conocerlo. Web Locks no coordina otros dispositivos, perfiles aislados o navegadores sin la API. No se añade BroadcastChannel, que por sí solo no aporta exclusión atómica. La recuperación de `sessionStorage` sigue siendo local por pestaña, sujeto a expiración de 24 horas y comportamiento del navegador.

## Verificación y revisión

La prueba secuencial anterior ahora se ejecuta sin Web Locks y comprueba el conflicto y las salidas. Un segundo E2E abre copias con Web Locks y verifica propietario, copia, nueva sesión, cierre y snapshot. Otro usa una barrera de red para iniciar simultáneamente dos Actions sin Web Locks y comprueba dos respuestas terminales, no una transacción de base de datos. Otro hace que el servidor mock procese la Action con `route.fetch` y aborta la respuesta al navegador: se muestra confirmación desconocida y una recarga no provoca otro envío. Los escenarios de doble clic, expiración, almacenamiento inaccesible, recarga, cuatro modalidades y móvil se cubren en las pruebas existentes. El gate histórico cubre 102 enunciados y ocho formularios.

Una revisión Luna independiente examinó cambios de cuenta, borrador, locks, marcador, errores y riesgo de duplicación. No halló un nuevo defecto P0/P1 en el control de ámbito o locks. Identificó que una entrega parcial seguida por un intento nuevo puede registrar evidencia de nuevo; también que el conflicto depende del texto exacto del error. Quedan abiertos. No se verificaron RLS ni servidor real, dos cuentas reales en navegador, suspensión/cierre durante una RPC parcial, o todas las combinaciones de navegador sin BroadcastChannel. La implementación no depende de BroadcastChannel.

Evidencia ejecutada: `pnpm typecheck` PASS; `pnpm verify:content` PASS; `pnpm test` 100 archivos y 735/735 PASS; Playwright conjunto 21/21 PASS con el entorno mock, seguido de 6/6 PASS en el archivo focalizado ampliado con el cierre posterior a la entrega. La prueba unitaria de espera sin respuesta confirma salida tras 30 segundos. `git diff --check` PASS. La prueba de dos ámbitos usa fixtures locales; no acredita autenticación, RLS ni persistencia reales.

## Contrato futuro

Antes de persistir historial debe definirse un agregado de intento por usuario autenticado, UUID único e idempotency key, versión inmutable de banco, orden de preguntas, respuestas y blancos, deadline, estado y resultado inmutable. La operación de entrega debe validar propiedad y claves en servidor, comprobar versión, serializar las entregas concurrentes, registrar respuestas y calcular puntuación en una transacción, con restricción única por propietario e intento/operación. Repetición de la misma carga devuelve el resultado guardado; carga distinta devuelve conflicto explícito y estable. Deben definirse retención, eliminación, RLS, recuperación entre dispositivos, y cómo asociar evidencia por pregunta sin contabilizarla dos veces. Esto es diseño: no se modificaron tablas, políticas, migraciones ni RPC.

## Estados

- UX local: mejora implementada; la condición de salida se comprueba en escenarios locales indicados, no equivale a garantía en todos los fallos o navegadores.
- Coordinación local: solo en escenarios Chromium con Web Locks y marcadores disponibles; fallback sin exclusión.
- Entrega única en servidor: **NO VERIFICADA**.
- Persistencia real y RLS: **NO VERIFICADAS**.
- Despliegue: no realizado.
