# Revisión e integración del temario de Estatuto de ADIF

## Fuentes revisadas

- Material del curso: `1. LEYSUMEN - Estatuto ADIF` (22 páginas).
- Material del curso: `2. RESUMEN - Estatuto ADIF` (9 páginas, con los bloques destacados).
- Fuente normativa de contraste: [texto consolidado del BOE del Real Decreto 2395/2004](https://www.boe.es/buscar/act.php?id=BOE-A-2004-21913&lang=es&p=&tn=1).

Los PDF del curso son material didáctico. El texto literal que debe prevalecer y cualquier actualización posterior se comprueban en el BOE. El propio resumen advierte de referencias históricas que pueden haber sido derogadas o sustituidas; por eso los nombres y umbrales de otras leyes se mantienen como contexto de estudio, no como garantía de vigencia actual.

## Cobertura integrada

La plataforma tenía diez conceptos aislados y una tarjeta de texto oficial con artículos mal rotulados. Ahora el inventario común cubre 55 unidades: el artículo único, las disposiciones adicionales, transitorias, derogatoria y finales, y los artículos 1 a 44. Se han corregido, entre otros, los rótulos de contratación (artículo 13) y órganos de gobierno (artículo 14).

- `content/estatuto-adif-outline.ts`: inventario didáctico único y trazable.
- `content/official-texts-estatuto-adif.ts`: vista de texto oficial resumido con el mismo inventario.
- `content/theories/estatuto-adif.ts`: 56 conceptos normativos, referencias BOE por unidad y recordatorios pedagógicos.
- `content/summaries/estatuto-adif.ts`: resumen por bloques con las cifras y reglas destacadas por el curso.
- `supabase/migrations/202608200001_estatuto_adif_expanded.sql`: activa en el catálogo privado los nuevos conceptos 11–56 sin tocar intentos, progreso, favoritos ni notas.

La asociación editorial de preguntas existentes se conserva; al ampliar el catálogo, las preguntas retiradas siguen fuera del dominio activo y el validador de contenido comprueba que toda pregunta oficial mantenga conceptos válidos.
