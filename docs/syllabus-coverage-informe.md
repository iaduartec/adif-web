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

Tras el push, `https://adif-web.vercel.app/curso` respondió HTTP 200. Se
observó `X-Vercel-Cache: PRERENDER` y un `X-Vercel-Id` real; no se afirma un
estado interno `Ready` porque no hay acceso autenticado a la API de Vercel.

## Limitación y siguiente paso

No se debe ampliar contenido P0/P1 ni publicar un porcentaje de cobertura oficial
hasta obtener el PDF/anexo de bases itemizado desde ADIF o desde el portal oficial
correspondiente. El siguiente paso es incorporar ese documento como
`SyllabusSource`, extraer todos sus ítems y activar `sourceComplete: true` solo
después de validar la exhaustividad.

---

## Addendum de actualización — 2026-10-15

El estado anterior se conserva como registro histórico de la consulta realizada
el 2026-08-11. La [página oficial PNI26/01 de ADIF](https://www.adif.es/w/pni26-01-personal-operativo)
ahora muestra el temario por perfil. En sus secciones «2. Temario común» y «6.
Parte específica» para 26/12PO enumera seis documentos comunes y tres
específicos. La ausencia de una lista pública que describía el estado anterior
ya no aplica a esta revisión.

Los nueve adjuntos vinculados por ADIF se descargaron completos el 2026-10-15,
se revisaron sus portadas/índices y se guardaron como versiones `verified` con
SHA-256 en `content/source-manifest.json`. Los snapshots locales de agosto se
conservan como versiones anteriores; no se eliminaron. La última ejecución de
`pnpm sources:check` clasificó 32 observaciones: 12 sin cambios, 18 candidatas
a revisión y 2 `needs_check`. El JSON conserva las observaciones descargadas;
la clasificación se calcula al ejecutar el comprobador. Ninguna candidatura
de fuentes ajenas a estos nueve documentos se promovió automáticamente.

### Alcance oficial reconstruido

- **Común:** LO 3/2007; Ley 31/1995 limitada a exposición de motivos y capítulos
  I, III y V; RD 2395/2004; Declaración sobre la Red ADIF 2027, capítulos I y
  II; RDL 5/2015 EBEP, capítulo VI del título III (arts. 52–54); y Ley 53/1984.
- **26/12PO:** RD 346/2011 con capítulos I–II y anexos I–V; el documento de
  compatibilidad electromagnética enlazado por ADIF; y RCF, Libro Primero, con
  sus cinco capítulos.

ADIF identifica la edición de la Declaración sobre la Red 2027 publicada el
31-07-2026 en su [ficha de documentos vigentes](https://www.adif.es/sobre-adif/declaracion-red).
El PDF completo descargado desde esa ficha conserva internamente la leyenda
«V.0 (ED 27/02/2026)», mientras que el PDF enlazado desde la página PNI26/01
también presenta esa leyenda. Se conservan los registros de ambas versiones,
sus hashes y la diferencia; la teoría de capítulos I–II debe cotejarse con la
edición que ADIF identifica como vigente.

El adjunto de compatibilidad electromagnética es un artículo de *REE* (mayo de
2015) que señala que fue cedido por Cemdal. ADIF es la fuente primaria para
confirmar su inclusión en el temario, pero el contenido del artículo es una
fuente secundaria y debe atribuirse a su autor/publicación. La Directiva
2014/30/UE, el RD 186/2016 y EN 50121 se mantienen como material relacionado,
no como documentos oficiales independientes de PNI26/01.

### Cobertura de teoría heredada

El inventario oficial contiene nueve padres y unidades hijas trazadas a
versiones y localizadores concretos. El estado observado del contenido actual
es: **8 materias parcialmente mapeadas, 1 sin teoría trazada al documento
asignado, 0 materias con cobertura completa y 0 nodos sin resolver**. Los temas
adyacentes heredados (Constitución, RD 773/1997, RD 902/2020, legislación
ferroviaria, normas de CEM, psicometría e inglés) se conservan en
`supplementalItems` y no cuentan como documentos oficiales adicionales.
Esta fase corrige el mapa de alcance; no declara `reviewed` los claims teóricos
heredados. La fase posterior incorporó trazabilidad de versiones y controles
automáticos de citas. La revisión editorial sustantiva de la vigencia, el
contenido y las versiones BOE candidatas sigue pendiente: los 255 claims
heredados se conservan explícitamente como `needs_review`, con confianza baja
y el motivo visible, hasta que se cotejen individualmente.

Verificación de esta actualización:

- `pnpm sources:check`: 32 observaciones; el comprobador clasificó 12 `unchanged`, 18 `candidate` y 2 `needs_check`.
- `pnpm verify:content`: OK; cobertura del temario: 9 oficiales, 8 parciales, 1 missing.
- `pnpm test --reporter=dot`: 56 archivos, 412 pruebas OK.
- `pnpm typecheck`: OK.
- `pnpm lint`: 0 errores; permanecen 2 warnings preexistentes de navegación interna.
- `pnpm build`: OK.

### Trazabilidad editorial de claims (2026-10-15)

Cada uno de los 255 claims de teoría conserva estado y confianza editorial en
`content/claim-review-manifest.json`. Todos los claims heredados están en
`needs_review`; no se promovieron automáticamente a `reviewed`. Las 146
referencias de teoría enlazan a 20 identidades y versiones fijadas en
`content/theory-source-links.json`; el verificador coteja versión, URL y fecha
de verificación con el manifiesto. Un claim normativo o interpretativo sin
localizador, versión conocida o evidencia primaria no valida. Un claim solo
puede constar como `reviewed` con confianza alta, fecha real de revisión y
evidencia primaria verificada.

Verificación posterior de trazabilidad:

- `pnpm verify:content`: OK, incluidos los validadores estructurales, de referencias, claims, copia y temario.
- `pnpm test --reporter=dot`: 57 archivos, 429 pruebas OK.
- `pnpm typecheck`: OK.
- `pnpm lint`: 0 errores; permanecen 2 warnings preexistentes de navegación interna.
- `pnpm build`: OK.
