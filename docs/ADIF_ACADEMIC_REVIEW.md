# ADIF_ACADEMIC_REVIEW.md — Revisión académica

Fecha: 2 de noviembre de 2026. Read-only.

## 1. Exactitud normativa

- 256 claims de teoría heredados en `content/claim-review-manifest.json` con estado `needs_review` y confianza baja.
- 146 referencias de teoría vinculadas a 20 identidades/versiones (`content/theory-source-links.json`).
- Un claim normativo/interpretativo sin localizador, versión conocida o evidencia primaria no valida.
- Un claim solo puede constar como `reviewed` con confianza alta, fecha real de revisión y evidencia primaria verificada.

**Conclusión**: no se puede afirmar exactitud normativa sin revisión independiente claim por claim. Estado: **NO VERIFICADO** para la mayoría.

## 2. Vigencia de fuentes

Fuentes `needs_check` en `content/source-manifest.json`: ADIF PNI23/01, PNI24/01, PNI25/01 (plantillas/cuadernillos), ADIF PNI26/01, distribución por sede, DR 2027, EN 50121, MCER-A2, MET-PSI-01.

Fuentes `verified`: LO 3/2007, Ley 31/1995, RD 2395/2004, Ley 38/2015, Ley 53/1984, RD 346/2011, RD 664/2015, RD 773/1997, RD 902/2020, Real Decreto 186/2016, TREBEP, PNI26-COMMON-01..06, PNI26-12PO-SPECIFIC-01..03, DR 2027 Libro 2027.

**Diferencia de ediciones sin resolver**: Declaración sobre la Red 2027 — PDF enlazado desde PNI26/01 conserva "V.0 (ED 27/02/2026)" mientras ADIF identifica edición vigente 31/07/2026.

## 3. Completitud por documento

Ver `ADIF_SYLLABUS_COVERAGE.md` §1 y §3. 8/9 parciales, 1/9 (CEM) sin cobertura. 6 nodos `missing`.

## 4. Errores y correcciones documentados (muestra)

- ICT: correcciones de anexo III (apartados 4.2.1, 2.3.1, 5.7, 7.1) y anillo de tierra (anexo III 7.1, no anexo II 7.2.3).
- PRL: art. 21.2/21.3 literales; gratuidad/subsidiario EPI (RD 773/1997 arts. 3 y 4).
- Estatuto ADIF: 6 mapeos de artículo corregidos (Consejo=Art.15, Presidente=Art.23, personal directivo=Art.27.2, patrimonio=Art.30, control eficacia=Art.38, control económico-financiero=Art.39).
- RCF: locators a secciones reales; sin "colación"; estación = "procesos de circulación".
- CEM: definición locator Art. 3 de Directiva 2014/30/UE; EN 50121 como syllabus-reference didáctico.
- DR 2027: Consejo de Administración con fuente real; agentes §1.4; cifras km verificadas.

**Nota**: estas correcciones son de una auditoría anterior (commit `1fd544a`); no se ha re-verificado claim por claim en esta auditoría. Los 256 claims siguen `needs_review`.

## 5. Terminología y definiciones

- EN 50121 se mantiene como material relacionado, no como documento oficial independiente de PNI26/01.
- Directiva 2014/30/UE y RD 186/2016 son contexto, no documentos oficiales independientes.
- El artículo de compatibilidad electromagnética es de *REE* (mayo 2015), cedido por Cemdal: ADIF es fuente primaria para confirmar inclusión; el contenido es fuente secundaria y debe atribuirse a su autor/publicación.

## 6. Comprobaciones pendientes

- Revisión independiente claim por claim (256 claims).
- Vigencia BOE de cada fuente `verified`.
- Edición vigente de la Declaración sobre la Red 2027.
- Derechos de cesión del artículo de CEM.
- Cuadernillos PNI23/01, PNI24/01, PNI25/01 (vigencia y derechos).

## 7. Conclusión académica

Contenido útil y trazable, pero **incompleto y sin revisión independiente**. No se puede certificar exactitud normativa. Prioridad: P0 (CEM, nodos missing, claims, fuentes).
