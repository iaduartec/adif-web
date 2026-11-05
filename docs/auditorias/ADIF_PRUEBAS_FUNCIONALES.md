# Pruebas funcionales y técnicas

Fecha: 5 de noviembre de 2026. Base: `bf7148a`; los cambios posteriores están en la rama de auditoría. Esta página distingue las pruebas automatizadas de las comprobaciones con servicios reales.

## Línea base

| Comprobación | Resultado y alcance |
|---|---|
| `pnpm typecheck` | Correcto. |
| `pnpm verify:content` | Correcto; los validadores comprueban estructura y trazabilidad, no la exactitud de toda la teoría. |
| `pnpm test` | 120 archivos, 809 pruebas correctas. |
| `pnpm lint` | Falló: 7 errores y 7 avisos, todos los errores en `components/practice/original-practice-session.tsx`. |
| `pnpm build` sin variables públicas | Falló al prerenderizar `/temario`, porque falta la configuración de Supabase. |
| `pnpm build` con URL y clave pública ficticias | Correcto. La construcción no demuestra que las credenciales ni la conexión real funcionen. |
| Playwright | La primera ejecución no tenía Chromium instalado. Tras instalarlo, otra pasada se interrumpió por tiempos de espera del servidor de desarrollo. Con el servidor precalentado, pasaron 32 de 37 pruebas y fallaron cinco casos de recuperación de simulacros. El componente se modificó durante la ejecución, por lo que el resultado mezcla estados y no es una línea base limpia; se requiere repetirlo sobre un estado estable. |

Producción respondió en `/login` con HTTP 200; la API de Vercel identificó el despliegue `READY` como `bf7148aad3afb220cd61deeb67e5b1c5d732ba2d`. Esto no acredita acceso autenticado ni persistencia.

## Tras las correcciones

- `pnpm typecheck` y `pnpm verify:content`: correctos.
- `pnpm lint`: correcto, con tres avisos y ningún error.
- `pnpm test`: 126 archivos y 825 pruebas correctas.
- Playwright dirigido a simulacros y concurrencia: 13 pruebas correctas. La batería completa con un servidor simulado recién iniciado terminó con **37/37** pruebas correctas; incluye teclado, vista de 320 px y móvil de 390 px. Sigue sin acreditar backend real.
- Después de añadir el estado editorial por afirmación se repitió `e2e/academic-visible-content.spec.ts`: 3/3 pruebas correctas con Chromium y mocks. La batería completa de 37 se había ejecutado antes de ese último cambio.
- `pnpm build` con URL y clave públicas ficticias: correcto; no verifica la configuración de un entorno real.

La página de la convocatoria en ADIF respondió HTTP 403 a la consulta directa, pero Firecrawl pudo leer el 5 de noviembre la [página de PNI26/01](https://www.adif.es/w/pni26-01-personal-operativo), sus bases y los adjuntos de CEM y Declaración sobre la Red. Se obtuvieron extracciones textuales, no hashes de los binarios. La [versión consolidada del RD 346/2011 en el BOE](https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834) respondió HTTP 200 y se consultó el anexo III, apartado 4.5.3.i para la corrección del RITU.

## Pruebas reales pendientes

Se preparó una copia aislada de la configuración y las migraciones en `/tmp/adif360-supabase-isolado`. El arranque local con Supabase CLI 2.121.0 no llegó a crear la base: la descarga de la imagen de PostgreSQL falló por falta de espacio y límites del registro de imágenes. No se aplicaron migraciones. Permanecen sin comprobar frente a servicios reales: registro y confirmación de correo, OAuth, escritura y recuperación de progreso, simulacros, sesiones, aislamiento entre dos usuarios y políticas RLS efectivas. Las pruebas con mocks no sustituyen esos recorridos. Las migraciones versionadas no demuestran el estado aplicado en producción.

Antes de una preview se deben revisar el build, los resultados finales de tests y lint, la configuración y el destino de los servicios. No ejecutar migraciones contra datos reales como parte de esta revisión.
