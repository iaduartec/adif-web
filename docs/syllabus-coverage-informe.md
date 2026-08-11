# Mapa de cobertura del temario oficial ADIF

Fecha: 2026-08-11
Repositorio: `iaduartec/adif-web`
Commit inicial de esta fase: `2851f6485db8d175581fe0e44d0dadb4393ab165`

## Fuente de alcance

La referencia de convocatoria vigente utilizada es la página oficial de ADIF
[PNI26/01 — Convocatoria Pública de Ingreso en categorías de Personal Operativo](https://www.adif.es/w/pni26-01-personal-operativo).
La página confirma la convocatoria y remite a las bases, pero el HTML público
consultado no expone un anexo desglosado con el temario por subapartados.

Por esa limitación real, este primer inventario usa como unidad conservadora cada
bloque/fuente oficial ya identificado en la trazabilidad del curso. No usa el
número de claims como cobertura y no inventa títulos de subapartados que no están
publicados en el repositorio. La fuente de alcance (convocatoria) queda separada
de las fuentes materiales (BOE, ADIF y MCER).

## Unidad y fórmula

- Unidad: bloque o fuente oficial identificada en el alcance actual.
- `coveragePercent = covered / syllabusItemsTotal * 100`.
- Los elementos `partial` y `reference-only` no incrementan `coveragePercent`.
- La métrica no cuenta claims, conceptos ni ejemplos.

## Estado inicial

| Métrica | Valor |
|---|---:|
| Ítems oficiales inventariados | 17 |
| Covered | 11 |
| Partial | 4 |
| Missing | 0 |
| Reference-only | 2 |
| Coverage | 64,71 % |

El mapa canónico está en [`content/syllabus.ts`](../content/syllabus.ts) y el
verificador ejecutable en [`scripts/verify-syllabus-coverage.ts`](../scripts/verify-syllabus-coverage.ts).

## Gaps priorizados antes de ampliar contenido

| ID | Estado | Módulo actual | Qué cubre | Qué falta | Fuente material | Prioridad |
|---|---|---|---|---|---|---|
| `syllabus-sector-ferroviario` | partial | `declaracion-red-2027`, `estatuto-adif` | Ley 38/2015 arts. 4 y 32 y contexto de red | Bloque autónomo del sector ferroviario | BOE Ley 38/2015 | P1 |
| `syllabus-epi` | partial | `prevencion-riesgos-laborales` | RD 773/1997 arts. 3 y 4 | Desarrollo independiente de selección, uso y obligaciones sobre EPI | BOE RD 773/1997 | P1 |
| `syllabus-igualdad-retributiva` | partial | `igualdad` | RD 902/2020 art. 7 | Desarrollo completo del principio y herramientas de igualdad retributiva | BOE RD 902/2020 | P1 |
| `syllabus-constitucion` | partial | `igualdad`, `codigo-conducta` | Principios constitucionales usados como fundamento | Bloque constitucional autónomo | BOE Constitución | P1 |
| `syllabus-en-50121` | reference-only | `compatibilidad-electromagnetica` | La convocatoria acredita su inclusión | Fuente material legítima accesible de la norma | Referencia ADIF PNI26/01 | P0 |
| `syllabus-psicometria` | reference-only | `psicometria` | La convocatoria acredita el bloque psicométrico | Guía material oficial publicada | Referencia ADIF PNI26/01 | P0 |

## Decisión de ampliación de esta sesión

No se ha añadido contenido normativo nuevo todavía. El anexo oficial itemizado
de PNI26/01 no está disponible en el checkout ni se expone en la página pública
consultada; ampliar ahora exigiría adivinar el alcance exacto. El siguiente lote
válido es el de los cuatro gaps P1 anteriores, una vez incorporado o verificado
el anexo oficial. EN 50121 y MET-PSI-01 permanecen `reference-only` por falta de
fuente material legítima, conforme a la regla de no inventar normas técnicas.

## Guardrails implementados

`pnpm verify:syllabus` comprueba IDs únicos, estados válidos, fuentes registradas,
módulos existentes, coherencia entre estado y contenido, y porcentajes derivados.
También está integrado en `pnpm verify:content`.

## Verificación de esta fase

| Check | Resultado |
|---|---|
| `pnpm verify:content` | OK; 11 módulos, 87 conceptos, 15 ejemplos, 76 fuentes, 167 claims |
| `pnpm verify:syllabus` | OK; 17 items, 64,71 % |
| `pnpm typecheck` | OK |
| `pnpm lint` | OK; 2 warnings preexistentes de navegación interna |
| `pnpm test` | 183 passed / 29 files |
| `pnpm build` | OK |
| `git diff --check` | OK |

Deployment tras el push: `https://adif-web.vercel.app/curso` respondió HTTP 200.
La respuesta incluyó cabecera `X-Vercel-Id: cdg1::9dwxz-1786413444488-aa3fed488ad4`
y `X-Vercel-Cache: HIT`; el acceso a la API autenticada de Vercel no está
configurado en este entorno, por lo que no se afirma un estado interno `Ready`
más allá del HTTP 200 observado.

Revisión mínima de rutas con configuración mock de Playwright: `/curso` y
`/curso/igualdad`, `/curso/psicometria`, `/curso/compatibilidad-electromagnetica`
y `/curso/ingles-a2` devolvieron HTTP 200.

## Estado final de esta fase

No hay ampliación material de teoría en este commit: el cambio queda limitado al
mapa, su verificador, tests y documentación. Por tanto, los contadores de teoría
y las métricas de cobertura son iguales antes y después. El siguiente commit de
contenido debe esperar al anexo oficial itemizado o a una fuente ADIF equivalente.

## Próximos cinco gaps

1. `syllabus-sector-ferroviario` — separar y completar el bloque de Ley 38/2015.
2. `syllabus-epi` — ampliar EPI con material BOE verificable.
3. `syllabus-igualdad-retributiva` — completar RD 902/2020 con texto vigente.
4. `syllabus-constitucion` — confirmar si el anexo oficial exige un bloque autónomo.
5. `syllabus-en-50121` — mantener reference-only hasta disponer de material legítimo.
