# Reconciliación del alcance oficial PNI26/01

Fecha: 2026-08-11
Repositorio: `iaduartec/adif-web`
Commit base: `348a4f79071bfd9c02c6c733822f84e376224347`

## Fuente oficial localizada

La fuente primaria es la [página oficial PNI26/01 de ADIF](https://www.adif.es/w/pni26-01-personal-operativo),
una página de convocatoria (`pni26-01`). La página confirma 1.079 plazas, la
fecha de convocatoria (14/07/2026) y que las bases están adjuntas, pero el HTML
consultado no expone el PDF de bases ni un anexo itemizado del temario.

También se localizaron el [anuncio BOE-B-2026-24123](https://www.boe.es/diario_boe/txt.php?id=BOE-B-2026-24123)
y las [instrucciones oficiales de inscripción](https://www.adif.es/documents/20124/55031380/Instrucciones%2Bpara%2Bformalizar%2Bla%2Binscripci%C3%B3n%2BPNI26%2B01.pdf/f99c019c-92cd-2da1-d5a5-98367b72edb7?t=1783940162781).
Ninguno contiene el programa itemizado. La guía oficial de alegaciones indica
además que los cuadernillos psicométricos se consultan desde el portal privado
del candidato.

**Inventario oficial exhaustivo:** no. El documento necesario no es recuperable
de las fuentes públicas consultadas. Por tanto, los 17 registros actuales son
`identified scope`, no “ítems oficiales completos”.

## Modelo aplicado

`content/syllabus-sources.ts` contiene exclusivamente fuentes de alcance. Cada
`SyllabusItem` separa:

- `syllabusSourceId` + `syllabusLocator`: por qué podría entrar en examen.
- `materialSourceIds`: fuentes BOE/ADIF/MCER para estudiar su contenido.
- `status: unresolved`: alcance no confirmado mientras falte el anexo.
- `identifiedStatus`: clasificación provisional, solo para la métrica auxiliar.

`coveragePercent` es `null` mientras `sourceComplete === false`.
La métrica auxiliar es `identifiedCoveragePercent`.

## Estado reconciliado

| Métrica | Resultado |
|---|---:|
| Ítems oficiales extraídos | 0 |
| Subítems oficiales | 0 |
| `syllabusItems` provisionales | 17 |
| Covered oficial | 0 |
| Partial oficial | 0 |
| Missing oficial | 0 |
| Reference-only oficial | 0 |
| Unresolved | 17 |
| Cobertura oficial | No válida (`null`) |
| Cobertura identificada provisional | 64,71 % |

El 64,71 % anterior no era una cobertura oficial fiable: trataba fuentes
materiales (`LO 3/2007`, `RD 346/2011`, etc.) como si fueran fuentes de alcance
y asumía exhaustividad inexistente. Queda invalidado como porcentaje oficial.

## Mapeo provisional y módulos

Los 17 registros conservan el mapa de trabajo anterior, pero todos llevan
`syllabusSourceId: pni26-01` y `status: unresolved`. Los módulos de psicometría e
inglés A2 se conservan como contenido de apoyo identificado; su presencia y
granularidad exacta deben confirmarse en las bases/anexo. No se han reescrito
claims ni añadido teoría.

- Ítems oficiales sin mapear: no evaluable (`officialItems` está vacío).
- Módulos huérfanos: no evaluables contra un universo oficial no recuperado.
- Materiales psicométricos: no se presenta la etiqueta interna `MET-PSI-01` como
  guía oficial pública.
- EN 50121: `identifiedStatus: reference-only`, sin `materialSourceIds`.
- Inglés: MCER-A2 solo es fuente material del nivel; no demuestra que PNI26/01
  exija A2.

## Guardrails y tests

El verificador comprueba fuentes separadas, localizadores, IDs duplicados,
módulos y materiales válidos, estados `unresolved`/`reference-only`, coherencia
de `covered`/`missing`, porcentaje nulo con inventario incompleto y la regla de
“missing invisible” cuando un inventario exhaustivo omite un ID oficial.

## Verificación

- `pnpm verify:syllabus`: OK; 17 identificados, 17 unresolved, cobertura oficial no disponible.
- `pnpm verify:content`: OK; teoría 11/87/15/76/167 y guardrail de syllabus OK.
- `pnpm typecheck`: OK.
- `pnpm lint`: OK; 2 warnings preexistentes, 0 errores.
- `pnpm test`: **186 passed / 29 files**.
- `pnpm build`: OK.
- `git diff --check`: OK antes del commit.

## Limitación y siguiente paso

No se debe ampliar contenido P0/P1 ni publicar un porcentaje de cobertura oficial
hasta obtener el PDF/anexo de bases itemizado desde ADIF o desde el portal oficial
correspondiente. El siguiente paso es incorporar ese documento como
`SyllabusSource`, extraer todos sus ítems y activar `sourceComplete: true` solo
después de validar la exhaustividad.
