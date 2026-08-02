# Plataforma de Estudio — Oficial de Telecomunicaciones ADIF 2026

Plataforma web para preparar la oposición de **Oficial de Telecomunicaciones de Entrada ADIF 2026**: temario oficial, banco de 4.500 preguntas comentadas, simulacros cronometrados, fichas y seguimiento de progreso.

## Características

- **Temario oficial** — Lecciones con teoría explicada, textos legales íntegros (PDFs y extracciones) y referencias oficiales a BOE/Adif.
- **Banco de 4.500 preguntas comentadas** — 8 bloques del temario, cada pregunta con explicación de la respuesta correcta.
- **Simulacros de examen** — 30 simulacros cronometrados de 60 preguntas con corrección y análisis de errores.
- **Fichas** — Tarjetas de repaso (flashcards) filtrables por módulo y favoritas.
- **Seguimiento de progreso** — Métricas por módulo, plan de estudio diario, metas semanales y recomendación de siguiente sesión.
- **Autenticación** — Google OAuth vía Supabase, con progreso y favoritos por usuario.

## Módulos del temario

| Bloque | Contenido |
| ------ | --------- |
| G1 | Igualdad y no discriminación (Ley Orgánica 3/2007) |
| G2 | Prevención de riesgos laborales (Ley 31/1995) |
| G3 | Estatuto de ADIF (RD 2395/2004) |
| E1 | Infraestructuras comunes de telecomunicación (RD 346/2011) |
| E2 | Compatibilidad electromagnética (Directiva CEM, RD 186/2016) |
| E3 | Reglamento de Circulación Ferroviaria — Libro 1 (RD 664/2015) |
| P | Psicotécnicos |
| I | Inglés A2 |

El banco se completa con bloques de la Declaración sobre la Red 2027, el Código de Conducta de los Empleados Públicos y el régimen de incompatibilidades de las AAPP.

## Stack

- **Next.js** (App Router) + React + TypeScript
- **Tailwind CSS**
- **Supabase** — autenticación (Google OAuth) y almacenamiento de progreso (RLS por usuario)
- **Vitest** — tests unitarios y de contrato de esquema
- **Playwright** — tests end-to-end
- **csv-parse / tsx** — importación de contenido desde CSV

## Requisitos

- Node.js 20+
- pnpm

## Puesta en marcha

```bash
# Instalar dependencias
pnpm install

# Crear el entorno
cp .env.example .env.local
# Rellenar NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY y los secretos de sesión

# Desarrollar
pnpm dev

# Comprobar tipos, lint y tests
pnpm typecheck
pnpm lint
pnpm test
```

## Configurar Supabase

La app necesita un proyecto Supabase con autenticación Google habilitada y el esquema aplicado. La guía completa está en [`docs/supabase-setup.md`](docs/supabase-setup.md). La configuración se aplica con:

```bash
supabase link --project-ref <project-ref>
supabase db push
supabase gen types typescript --linked --schema public > lib/database.types.ts
```

## Actualizar el contenido

Las preguntas y simulacros se generan desde un CSV fuente (4.500 filas) mediante el script `scripts/import-course-content.ts`:

```bash
pnpm content:import
```

El script valida el CSV (encabezados, IDs estables, respuestas A–D, filas esperadas), aplica los esquemas con Zod y escribe `content/questions.json` y `content/simulations.json`.

> El CSV fuente y los documentos oficiales no se versionan en este repositorio; se regeneran de forma local. La columna `source` de cada pregunta indica el origen didáctico a cotejar con la fuente oficial.

## Tests

```bash
pnpm test            # Vitest (unitarios + contrato de esquema Supabase)
pnpm test:watch      # Modo watch
npx playwright test  # E2E
```

## Estructura

```
app/                  # Rutas de Next.js (auth, dashboard, curso, tests, simulacros, fichas, psicotécnicos, inglés)
components/           # Componentes de UI por sección
content/              # Datos de contenido (lecciones, teoría, fichas, textos oficiales, preguntas, simulacros)
lib/                  # Lógica de dominio, esquemas Zod, clientes Supabase, métricas de progreso
scripts/              # Importación de contenido desde CSV
pdf/                  # Documentos oficiales del temario y extracciones de texto
supabase/             # Migraciones y tests de base de datos (pgTAP/RLS)
tests/                # Tests unitarios y de integración
e2e/                  # Tests end-to-end con Playwright
docs/                 # Guías de configuración
```

## Licencia

Proyecto privado de estudio.
