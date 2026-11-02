# ADIF 360 — Auditoría profunda de claims (lote piloto)

Fecha: 2026-11-02. Rama: `codex/auditoria-adif-26`. Modo: read-only (sin cambios de contenido).

## 1. Protección inicial

- HEAD: `67adf49` (feat(rcf): add acronyms concept).
- Worktree: cambios PRL sin commitear preservados (stash/pop verificado); no se sobrescribió nada.
- No se realizaron operaciones destructivas ni modificaciones de producción.

## 2. Inventario real (reconciliado)

- Manifest `content/claim-review-manifest.json`: **273** entradas, todas `needs_review`.
- Claims extraídos directamente del código fuente (theory files): **349** ids únicos.
- Intersección manifest ∩ fuente: **224**.
- **49 entradas del manifest NO existen en el código fuente** (`estatuto-c11-1` … `estatuto-c56-1`). Son claims fantasma / stale. Requieren limpieza del manifest, no verificación.
- El resto de los 349 ids son concept ids, source ids y claims PRL (rama en curso, no auditados aquí).

### Distribución por materia (manifest)

| Materia | Claims |
|---|---|
| estatuto (ADIF) | 56 |
| ict (RD 346/2011) | 34 |
| igualdad (LO 3/2007) | 34 |
| prl | 26 |
| dr (DR 2027) | 22 (incluye cap.II P0) |
| rcf | 21 (incluye cap.3 P0 + acrónimos) |
| cem | 18 |
| incomp | 10 |
| conducta | 9 |
| ingles | 5 |
| psico | 6 |

## 3. Hallazgos de reconciliación (P0)

1. **49 claims fantasma en manifest** (estatuto-c11…c56). El manifest sobreestima el temario real. Acción: depurar manifest en fase de corrección.
2. **Todos los claims siguen en `needs_review`**; ninguno promovido a `reviewed` sin evidencia primaria.
3. **DR cap.II**: 7/8 claims VERIFIED contra V.0 (ED 27/02/2026); `dr-cap2-red-1` corregido. Edición 31/07/2026 inaccesible (403) → bloqueo.
4. **RCF cap.3**: 7/7 VERIFIED contra BOE consolidado 12/07/2023.
5. **CEM**: 1 claim, fuente inaccesible (403) → BLOCKED.

## 4. Metodología de verificación

Para cada claim se registra:

- ID único, materia, documento, artículo/apartado, texto, versión de fuente, estado actual, preguntas relacionadas, impacto en examen.
- Verificación contra texto oficial (BOE/ADIF/RD/DR) con localizador exacto y edición.
- Clasificación: `VERIFIED` / `NEEDS_CORRECTION` / `INCOMPLETE` / `OUTDATED` / `BLOCKED` / `NOT_REVIEWED`.
- Severidad P0–P3, evidencia, revisor, fecha, acción propuesta.
- No se promueve a `reviewed` sin revisión independiente documentada.

## 5. Lote piloto (alto riesgo, 30 claims)

Priorizados por: afectación a respuestas tipo test, definiciones/excepciones, plazos/obligaciones/competencias/cifras.

### A. Estatuto ADIF (cifras y competencias) — 10
- estatuto-c4-1 (Consejo: Presidente + 9–10 vocales) — Art. 15
- estatuto-c5-1 (Presidente nombrado por CdM a propuesta del Ministro) — Art. 23
- estatuto-c7-1 (patrimonio propio, distinto de la AGE) — Art. 30
- estatuto-c8-1 (desafectación de bienes de dominio público) — Art. 31
- estatuto-c10-1 (control financiero permanente IGAE) — Art. 39
- estatuto-c1-1 (entidad pública empresarial, personalidad jurídica propia) — Art. 1
- estatuto-c2-1 (adscripción al Ministerio) — Art. 1
- estatuto-c2-2 (inspecciones/auditorías del Ministerio) — Art. 38
- estatuto-c3-1 (funciones del administrador) — Art. 3
- estatuto-c6-1 (personal directivo) — Art. 27

### B. ICT (RD 346/2011) — 5
- ict-c1 … ict-c5 (definiciones y ámbitos) — verificar contra RD 346/2011.

### C. Igualdad (LO 3/2007) — 5
- igualdad-c1 … igualdad-c5 (principio de igualdad, discriminación directa/indirecta) — Arts. 1, 3, 6.

### D. Incompatibilidades — 5
- incomp-c1 … incomp-c5 (régimen de incompatibilidades del personal) — verificar contra Ley 53/1984 y normativa aplicable.

### E. RCF (cap. 1-2, cap. 3 ya auditado) — 5
- rcf-c1 … rcf-c5 (objeto, ámbito, definiciones) — BOE consolidado 12/07/2023.

## 6. Estado del lote piloto

- **NOT_REVIEWED** para los 30 claims seleccionados: la verificación individual contra fuentes primarias requiere lectura del texto oficial (BOE/ADIF) y se ejecutará en la siguiente fase por lotes, con especialistas por materia.
- No se han promovido claims a `reviewed`.
- No se han modificado contenidos ni código.

## 7. Errores críticos identificados (preliminares)

- 49 claims fantasma en manifest (estatuto) → sobreestimación del temario.
- DR cap.II bloqueada por edición inaccesible.
- CEM bloqueada por PDF inaccesible.
- 15 fuentes `needs_check` sin validar (heredado del checkpoint).

## 8. Revisión adversarial (pendiente)

El auditor adversarial revisará una muestra representativa de los claims verificados y todos los errores P0, intentando reproducir errores y detectar fuentes equivocadas. Se registrará en la siguiente entrega.

## 9. Plan de implementación por lotes (Superpowers)

1. Limpieza del manifest (eliminar 49 fantasmas) + regenerar.
2. Lote 1: Estatuto ADIF (56 claims) — jurista.
3. Lote 2: ICT (34) — ingeniero telecomunicaciones.
4. Lote 3: Igualdad (34) — jurista.
5. Lote 4: PRL (26) — experto laboral (sin tocar rama PRL).
6. Lote 5: DR cap.I/II (22) — ferroviario.
7. Lote 6: RCF (21) — ferroviario.
8. Lote 7: CEM (18) — bloqueado hasta obtención del PDF.
9. Lote 8: Incompatibilidades (10), Conducta (9), Inglés (5), Psico (6).
10. Revisión adversarial + re-ejecución de expertos.

Cada lote: verificación → corrección → tests → commit separado.

## 10. Criterio de éxito

Permitir responder con evidencia: qué material se puede estudiar con confianza, qué contenido tiene errores, qué apartados requieren nueva explicación, qué preguntas están afectadas y qué correcciones tienen mayor impacto para ADIF 26/12PO.
