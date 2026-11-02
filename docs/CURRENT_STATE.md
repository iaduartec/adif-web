# Estado real de ADIF 26/12PO — auditoría inicial

Fecha: 2 de noviembre de 2026. Estado parcial y verificable; no es una certificación de la plataforma.

## Continuación: circuito original

En la rama de auditoría se ha añadido práctica para preguntas originales revisadas: selección de tema y cantidad, entrenamiento con corrección por pregunta y práctica con entrega al final. La API autentica y utiliza el RPC privado de intentos para corregir y registrar; el cuaderno puede repetir preguntas originales cuyo último intento guardado fue incorrecto. Las preguntas históricas continúan bloqueadas según sus contratos.

El circuito aún es parcial: un bloque abierto no se reanuda al recargar; la interfaz lo advierte. La práctica en bloque envía intentos individuales al entregar y no es una sesión de examen protegida por servidor; un cliente que invoque directamente el endpoint de entrenamiento puede obtener la corrección de una pregunta. No se presenta como simulacro oficial ni se ha validado la persistencia en un Supabase completo. La migración existe en Git pero **no se ha aplicado a producción**.

Véase [IMPLEMENTATION_EVIDENCE.md](IMPLEMENTATION_EVIDENCE.md) para pruebas y límites. El estado de la auditoría original se conserva a continuación como registro histórico; las frases sobre ausencia de interacción o API solo para originales describen el estado anterior a esta continuación.

## Versiones y entornos

- Checkout principal: `/home/kiri_/projects/adif-web`, `main` en `a8b544cf814bded0998a19e7b994fff03659b850`. Existe un cambio previo en `.codex/config.toml`, conservado. Tras consultar GitHub, `origin/main` está siete commits por delante.
- Referencia de esta auditoría: `a20aa297c17554f356cb00d523ac2c2c6a6a482a`, rama local `codex/auditoria-adif-26`, worktree `.worktrees/codex-adif-audit`. Incluye la vista `/temario` de la antigua rama `feat/temario-estudio-fullwidth` y actualizaciones posteriores de dependencias. No se ha fusionado ni modificado `main`.
- Worktree histórico `/home/kiri_/.codex/worktrees/6c02/adif-web`: `deaeeef`, limpio; es antecesor de la versión principal local, no la versión más avanzada.
- Vercel informa de un despliegue de producción READY para `a20aa297c17554f356cb00d523ac2c2c6a6a482a`; el dominio responde HTTP 200. Esto no demuestra autenticación ni el funcionamiento completo del despliegue.
- Supabase: migraciones y pruebas SQL presentes en el repositorio; no se ha verificado el estado remoto ni ejecutado una migración. No se observó un servicio Supabase local activo ni CLI en PATH. La autenticación real, RLS efectiva y recuperación de sesión permanecen sin verificar en esta auditoría.

## Alcance y comportamiento

Existen curso, temario, plan diario, fichas, repasos, errores, estadísticas, simulacros, inglés y psicotécnicos. La existencia de páginas y pruebas no demuestra el recorrido de estudio completo. En particular, `app/api/attempts/route.ts` admite identificadores oficiales, no `ORIG-`; la tarea 6 de `docs/superpowers/plans/2026-10-15-adif-pni26-original-practice.md` está pendiente. Las preguntas psicotécnicas se muestran con opciones pero sin controles de respuesta ni corrección; su cronómetro es orientativo y no entrega automáticamente.

Las 102 transcripciones históricas de conocimientos específicos están sujetas a filtros de publicación y vigencia: el inventario no equivale a un banco habilitado para práctica. No se han levantado las restricciones de derechos o validación. Los modos y reglas de un examen compuesto de 2026 siguen pendientes de cotejo y ejecución completa.

La convocatoria [PNI26/01](https://www.adif.es/w/pni26-01-personal-operativo) indicaba al consultarse que la prueba sería **previsiblemente el 12 de diciembre de 2026**; ADIF dice que confirmará fecha definitiva, hora y distribución. No debe presentarse como confirmada. No se ha verificado aquí el detalle completo de puntuación, mínimos ni tiempos en las bases oficiales.

## Comprobaciones

En el checkout principal `a8b544c`, `pnpm lint` terminó con 0 errores y 2 avisos, `pnpm typecheck`, `pnpm verify:content`, `pnpm build` y `pnpm test --reporter=dot` pasaron; Vitest informó 74 archivos y 601 pruebas. El build generó un cambio en `next-env.d.ts`, que se restituyó a su estado inicial limpio. Estas pruebas no acreditan el comportamiento de producción ni sustituyen validación académica.

En la referencia `a20aa29`, instalación offline con lockfile congelado, `pnpm lint` (0 errores, 2 avisos), `pnpm typecheck`, `pnpm verify:content` y `pnpm test --reporter=dot` pasaron: 76 archivos y 623 pruebas. `pnpm build` sin configuración de Supabase falló al prerenderizar `/temario`; `PLAYWRIGHT_TEST=true pnpm build` pasó con el cliente simulado. Esta última comprobación no valida las credenciales, autenticación ni persistencia reales.

La auditoría de fuentes, conceptos, sesiones reales y móvil debe completarse antes de declarar cerrada esta fase. No se han realizado push, despliegue, cambios en datos reales ni migraciones remotas.

## Prioridades de continuación

1. Revisar en el estado de referencia la elegibilidad de las preguntas y recuperar el circuito responder → corregir → guardar con respuestas originales y aislamiento por usuario, conforme al plan aprobado y con pruebas SQL locales seguras.
2. Contrastar los nueve documentos y sus conceptos con la versión exigida por ADIF y la vigencia del BOE; corregir primero carencias de temario.
3. Verificar bases, mínimos, puntuación y reglas antes de presentar un simulacro como oficial.
4. Comprobar autenticación, persistencia, recuperación tras desconexión y experiencia móvil con un entorno aislado.
5. Ampliar práctica de inglés y psicotécnicos con variedad y revisión real, tras habilitar una corrección utilizable.
