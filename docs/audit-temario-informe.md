# Informe Final de Auditoría de Contenido — Temario ADIF

**Proyecto:** adif-web
**Fecha:** 2026-08-11
**Commit auditado:** `1fd544a` (`fix(course): audit theory content against official sources`)
**Base de comparación:** `3533332`
**Producción:** https://adif-web.vercel.app (deploy verificado, HTTP 200)

---

## 1. Resumen ejecutivo

Se auditaron los **11 módulos** del temario de teoría contra las fuentes oficiales
consolidadas (BOE `act.php`, texto refundido, Ley 38/2015, Directiva 2014/30/UE, RD 664/2015,
RD 664/2015 RCF, RD 346/2011 ICT, etc.). El objetivo fue garantizar que **cada claim tenga
correspondencia semántica real** con su fuente + locator + excerpt, respetando la clasificación
por `kind` (normative / interpretative / didactic / example). No se tocó arquitectura, tests,
trazabilidad ni UI.

**Resultado global:** invariante verificada y desplegada en producción.

---

## 2. Contadores globales

| Métrica | Valor |
|---------|-------|
| Modules | 11 |
| Concepts | 87 |
| Examples | 15 |
| Sources | 76 |
| ClaimsTotal | 167 |

### 2.1 Distribución por kind

| kind | claims |
|------|--------|
| normative | 113 |
| interpretative | 16 |
| didactic | 24 |
| example | 14 |
| **Total** | **167** |

`Classified claims == total claims` → **OK** (toda claim tiene `kind` válido y `legalBasis`).

---

## 3. Métricas de cambio (vs base `3533332`)

### 3.1 Claims

| Métrica | Valor |
|---------|-------|
| claimsReviewed (modificadas) | 60 |
| claimsRewritten | 56 |
| claimsReclassified | 1 |
| claimsAdded | 4 |
| claimsDeleted | 0 |
| claimsSplit | 2 |
| claimsUnchanged | 107 |

**Desglose:**
- **Rewritten (56):** claims reescritas para ajustarse al texto oficial (eliminadas
  afirmaciones no verificables, precisados matices legales). Ej.: `prl-c8-1`/`prl-c8-2`
  (art. 21.2/21.3 literales), `rcf-c6-1` (sin "colación"), `dr-takeaway-1` (Consejo de
  Administración con fuente real), `incomp-c6-1` (sin silencio desestimatorio), etc.
- **Reclassified (1):** `prl-intro-1` (normative → didactic; el art. 14 no demuestra la
  transposición de la Directiva 89/391/CEE).
- **Added (4):** `estatuto-c2-2`, `igualdad-c4-3` (extensiones de conceptos con nuevas
  fuentes), `prl-c12-2` y `prl-ex-2-app-2` (resultado de **splits**).
- **Split (2):** `prl-c12-1` (subsidiario art.4 / gratuidad art.3 → c12-1 + c12-2) y
  `prl-ex-2-app-1` (interrumpe/abandona vs. representantes acuerdan → app-1 + app-2).
- **Deleted (0):** sin claims eliminadas; se conservó el total.

### 3.2 Sources

| Métrica | Valor |
|---------|-------|
| sourcesAdded | 18 |
| sourcesCorrected | 3 |

**Desglose de adiciones (18 ids nuevos):**
- **Estatuto ADIF (7):** `rd2395-2004-art1/art15/art23/art27/art30/art38/art39` — corrección
  de mapeos (Consejo=Art.15, Presidente=Art.23, personal directivo=Art.27.2, patrimonio=Art.30,
  control eficacia=Art.38, control económico-financiero=Art.39).
- **Igualdad (2):** `lo3-2007-art48` (acoso en ámbito digital), `lo3-2007-art53`
  (presencia equilibrada en selección de personal).
- **PRL (2, por split de `rd773-1997`):** `rd773-1997-art3` (gratuidad EPI), `rd773-1997-art4`
  (carácter subsidiario).
- **RCF (5, renombrados a secciones reales):** `rd664-2015-1-1-1-1`, `-1-1-1-3`, `-1-2-1-1`,
  `-1-4-1`, `-1-5-1-4`.
- **DR 2027 (1):** `dr-adif-2027-agentes` (Ministerio/CNMC en §1.4).
- **Igualdad (1, renombrado):** `rd902-2020` → `rd902-2020-art7`.

**Correcciones in-place (3):** `dir-2014-30-ue` (definición → Art. 3, no Art. 1),
`dr-adif-2027-c1`, `dr-adif-2027-c2` (excerpts ampliados/corregidos).

> Nota metodológica: los "renombrados" (RCF, rd902) se contabilizaron como adición nueva por
> cambio de id, ya que el validador exige correspondencia sourceId↔registro. El neto de fuentes
> vigentes pasó a 76.

---

## 4. Verificación final (todo exit 0)

| Check | Resultado |
|-------|-----------|
| `pnpm verify:content` | ✅ |
| `pnpm verify:theory` | ✅ |
| `pnpm verify:theory-references` | ✅ |
| `pnpm verify:theory-claims` | ✅ |
| `pnpm verify:theory-copy` | ✅ |
| `pnpm typecheck` | ✅ |
| `pnpm lint` | ✅ |
| `pnpm test` | **177 passed / 28 files** |
| `pnpm build` | ✅ |
| `git diff --check` | ✅ |

---

## 5. Despliegue

| Ítem | Estado |
|------|--------|
| Commit | `1fd544a` |
| Push `origin/main` | `3533332..1fd544a` (sin force) |
| Deploy Vercel | **Ready** |
| Producción | https://adif-web.vercel.app → **HTTP 200** |

---

## 6. Módulos auditados (resumen por módulo)

| Módulo | Fuente oficial | Cambios clave |
|--------|----------------|---------------|
| igualdad | LO 3/2007, RD 902/2020 | splits de art., acoso digital (art.48), presencia equilibrada (art.53), auditoría retributiva (art.7) |
| prevencion-riesgos-laborales | LPRL, RD 773/1997 | split gratuidad/subsidiario EPI, art. 21/22 literales |
| estatuto-adif | RD 2395/2004 | 6 mapeos de artículo corregidos (Consejo=15, Presidente=23, etc.) |
| incompatibilidades | Ley 53/1984 | art. 1/2/11/14/19 sin afirmaciones no verificables |
| codigo-conducta | TREBEP (RDL 5/2015) | objetividad, órdenes ilegales (art. 54.3), bienes públicos (54.5) |
| ict-rd-346-2011 | RD 346/2011 | 10→16 PAU, puesta a tierra sin resistencia no verificable |
| rcf-libro-1 | RD 664/2015 | locators a secciones reales, sin "colación", estación="procesos de circulación" |
| compatibilidad-electromagnetica | Directiva 2014/30/UE, RD 186/2016 | locator definición Art. 3; EN 50121 como syllabus-reference (didáctico) |
| declaracion-red-2027 | Ley 38/2015, DR 2027 | Consejo de Administración con fuente real, agentes §1.4, cifras km verificadas |
| psicometria | MET-PSI-01 | didáctico (sin cambios) |
| ingles-a2 | MCER-A2 | didáctico, MCER como marco (sin cambios) |

**Arquitectura, validadores y tests:** sin modificación (regla de oro respetada).
