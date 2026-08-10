# Plataforma de Estudio — Oficial de Telecomunicaciones ADIF

Aplicación web para preparar el perfil de **Oficial de Telecomunicaciones de Entrada de ADIF** con un banco histórico de preguntas oficiales. La práctica muestra texto, opciones y plantilla correctora publicados por ADIF; cada resultado conserva su procedencia verificable.

## Contenido oficial

La plataforma publica únicamente transcripciones revisadas de cuadernillos y plantillas correctoras oficiales de ADIF. No se inventan enunciados, opciones ni respuestas; tampoco se reformula el texto para completar lagunas.

La importación inicial contiene 102 apariciones de pregunta procedentes de seis modelos históricos. Hay 72 huellas de contenido distintas y 30 pares de reutilización literal oficial: la reutilización se conserva como apariciones independientes porque pertenece a modelos y claves oficiales diferentes.

| Convocatoria | Perfil | Modelo | Preguntas publicadas |
| --- | --- | ---: | ---: |
| PNI23/01 (2023) | 23/05PO | 1433 | 15 |
| PNI23/01 (2023) | 23/05PO | 4101 | 15 |
| PNI24/01 (2024) | 24/05PO | 3403 | 18 |
| PNI24/01 (2024) | 24/05PO | 3413 | 18 |
| PNI25/01 (2025) | 25/10PO | 1131 | 18 |
| PNI25/01 (2025) | 25/10PO | 4104 | 18 |

Los seis modelos se presentan como **Parte específica**, no como la reproducción de un examen completo. Se excluyen los seis ítems de reserva de 2023 que no disponen de clave A–D publicable. También quedan fuera los cuadernillos psicométricos de acceso privado: una plantilla sin un cuadernillo legible y público no es una fuente suficiente.

### Preguntas oficiales

En la ruta **Preguntas oficiales** se puede practicar con preguntas filtradas por año, modelo y sección. Tras responder, la corrección indica la opción marcada en la plantilla y enlaza el documento oficial; no añade explicaciones inventadas.

### Exámenes oficiales

La ruta **Exámenes oficiales** agrupa las preguntas de un único modelo, mantiene su orden y señala de forma expresa que es una parte específica. No mezcla convocatorias ni crea sesiones a partir de preguntas de varios modelos.

## Procedencia y revisión

Cada registro publicado incluye, como mínimo:

- Identificador estable, año, convocatoria, código y nombre de perfil, modelo y número original.
- Texto literal del enunciado, cuatro opciones A–D y respuesta de la plantilla correctora.
- Tipo de sección, indicador de reserva, URL de ADIF, página del cuadernillo y página de la plantilla.
- Fecha de verificación y huella SHA-256 de contenido.

El directorio `content/official-exams/` es la fuente de mantenimiento: `manifest.json` identifica los documentos y `transcriptions/` conserva las transcripciones revisadas. Antes de publicar un nuevo modelo se debe completar este control:

1. Registrar una URL canónica alojada en `www.adif.es` y los datos del modelo en el manifiesto.
2. Transcribir literalmente solo páginas legibles, con cuatro opciones A–D y la respuesta de la plantilla del mismo modelo.
3. Revisar visualmente cada registro frente a cuadernillo y plantilla; si existe una duda, no se publica.
4. Marcar la cobertura como `specific_part` cuando no esté disponible el examen completo.
5. Ejecutar el importador y revisar que no haya registros publicados rechazados.

```bash
pnpm content:import-official
```

El importador valida la estructura, la procedencia, los números de pregunta, las opciones, las claves, las huellas y los distractores retirados. Escribe los datos de ejecución en `content/questions.json`, `content/exams.json` y `content/official-exams/import-report.json`.

## Stack

- Next.js (App Router), React y TypeScript
- Tailwind CSS
- Supabase para autenticación con Google y progreso por usuario
- Vitest para pruebas unitarias y de contrato
- Playwright para recorridos end-to-end

## Requisitos y puesta en marcha

- Node.js 20+
- pnpm

```bash
pnpm install
cp .env.example .env.local
# Rellena NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY y los secretos de sesión.

pnpm content:import-official
pnpm dev
```

La configuración de Supabase está en [`docs/supabase-setup.md`](docs/supabase-setup.md).

## Verificación local

Ejecuta estas comprobaciones en este orden antes de publicar cambios de contenido o interfaz:

```bash
pnpm content:import-official
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright test
```

## Estructura

```
app/                  # Rutas de Next.js
components/           # Componentes de interfaz
content/official-exams/ # Manifiesto, transcripciones revisadas e informe de importación
content/              # Banco publicado y contenido de curso
lib/                  # Esquemas, repositorios y lógica de dominio
scripts/              # Importadores de contenido
supabase/             # Migraciones y pruebas de base de datos
tests/                # Pruebas unitarias e integración
e2e/                  # Pruebas end-to-end
docs/                 # Especificaciones y guías
```

## Licencia

Proyecto privado de estudio.
