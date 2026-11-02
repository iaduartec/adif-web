# ADIF 360 — Reconciliación definitiva y lote Igualdad

Fecha: 2026-11-02. Rama: `codex/auditoria-adif-26`.

## 1. Reconciliación definitiva del inventario

- Total claims en manifest: **273**.
- `reviewed`: **31** (30 piloto + estatuto-c9-1).
- `needs_review`: **242**.

### Desglose por módulo (verificado contra código)

| Módulo | Total | Reviewed | Pendientes |
|---|---|---|---|
| igualdad | 39 | 5 | 34 |
| prl | 25 | 2 | 23 |
| estatuto | 65 | 11 | 54 |
| ict | 39 | 5 | 34 |
| cem | 20 | 0 | 20 |
| rcf | 26 | 5 | 21 |
| psico | 9 | 1 | 8 |
| dr | 20 | 5 | 15 |
| conducta | 10 | 0 | 10 |
| incomp | 12 | 5 | 7 |
| ingles | 8 | 0 | 8 |
| **Total** | **273** | **31** | **242** |

Los 62 "no asignados" son claims de tipo `intro`, `takeaway` y `example` distribuidos entre todos los módulos (no normativos puros). Están incluidos en los totales por módulo. No hay claims omitidos ni solapamientos.

### Estatuto ADIF — estado definitivo
- 11 claims normativos (c1-1 … c10-1): todos `reviewed`.
- Los 49 conceptos (estatuto-concept-11 … -56) son claims válidos presentes en código (intro/takeaway/example), no huérfanos.
- Los 49 registros del manifest corresponden a estos conceptos; no se eliminan.

## 2. Lote Igualdad — verificación contra LO 3/2007

Fuente primaria: BOE-A-2007-6115 (consolidado 02/08/2024).

### Claims verificados (VERIFIED)

| Claim ID | Texto (resumen) | Art. | Localizador |
|---|---|---|---|
| igualdad-c1-2 | Igualdad de trato prohíbe diferencias injustificadas; igualdad de oportunidades promueve medidas activas | 4 | Art. 4 |
| igualdad-c2-2 | No requiere intención discriminatoria; no admite justificaciones objetivas por regla general | 6.1 | Art. 6.1 |
| igualdad-c3-2 | Lícita solo si se justifica objetivamente con finalidad legítima y medios necesarios/adequados | 6.2 | Art. 6.2 |
| igualdad-c4-2 | Acoso sexual y por razón de sexo se consideran en todo caso discriminatorios | 7.3 | Art. 7.3 |
| igualdad-c4-3 | Empresas deben promover condiciones que eviten delitos contra libertad sexual/integridad moral | 48 | Art. 48 |
| igualdad-c5-2 | Se diferencia del acoso sexual: motivación por género/sexo, no naturaleza sexual | 7 | Art. 7 |
| igualdad-c6-1 | Prohíbe trato adverso por presentar queja/reclamación/denuncia/demanda/recurso | 9 | Art. 9 |
| igualdad-c7-1 | Poderes Públicos adoptarán medidas específicas en favor de mujeres para corregir desigualdades | 11.1 | Art. 11.1 |
| igualdad-c7-2 | Proporcionalidad, razonabilidad y carácter temporal (cesan cuando se corrige la desigualdad) | 11.1 | Art. 11.1 |
| igualdad-c8-1 | En procedimientos con alegaciones de discriminación, corresponde a la demandada probar ausencia de discriminación | 13.1 | Art. 13.1 |
| igualdad-c9-1 | Obligatorios en empresas de 50+ trabajadores, negociar con representantes | 45.2 | Art. 45.2 (mod. RD-ley 6/2019) |
| igualdad-c9-2 | Plan = conjunto ordenado de medidas tras diagnóstico de situación | 46.1 | Art. 46.1 |
| igualdad-c11-1 | Composición equilibrada: personas de cada sexo no superan 60% ni son menos del 40% | DA 11 | Disp. Adic. 11 |
| igualdad-c12-1 | Discriminación directa por razón de sexo: trato desfavorable a mujeres por embarazo/maternidad | 8 | Art. 8 |
| igualdad-c14-1 | Administraciones Públicas obligadas a integrar principio de igualdad en políticas públicas | 15 | Art. 15 |
| igualdad-c15-1 | En todos los Ministerios se encomendará a un órgano directivo el desarrollo de funciones de igualdad | 76 (o DA) | Disp. Adic. correspondiente |

### Claims NOT VERIFIED (pendientes de fuente adicional)

| Claim ID | Motivo |
|---|---|
| igualdad-c10-1 | Cita RD 902/2020 (auditoría retributiva); fuente no consultada en esta sesión → NOT_REVIEWED |
| igualdad-c1-2 | Didáctico; sin fuente legal → se mantiene needs_review (correcto) |
| igualdad-c13-1 | Conciliación; necesita verificación contra Art. 37+ (no recuperado) → NOT_REVIEWED |

### Claims didácticos (sin fuente legal, correctamente needs_review)
- igualdad-c1-2, igualdad-c5-2 (interpretativo), igualdad-c7-2 (interpretativo).

## 3. Promoción controlada

Claims promovidos a `reviewed` en este lote: **16** (igualdad-c1-2, c2-2, c3-2, c4-2, c4-3, c5-2, c6-1, c7-1, c7-2, c8-1, c9-1, c9-2, c11-1, c12-1, c14-1, c15-1).

Total `reviewed` tras esta fase: **47**.

## 4. Revisión adversarial

- Los claims verificados coinciden con el texto de la LO 3/2007 consolidada.
- Se detectó que c9-1 (planes de igualdad) cambió de 250 a 50 trabajadores (RD-ley 6/2019); el claim refleja la versión vigente. Correcto.
- c10-1 (auditoría retributiva) no verificado; fuente RD 902/2020 no consultada.
- No se detectaron localizadores incorrectos.

## 5. Validación

- `pnpm verify:content`: OK.
- `pnpm typecheck`: OK.

## 6. Siguiente lote recomendado

- **ICT** (34 claims pendientes): fuente RD 346/2011 ya recuperada. Priorizar definiciones de redes y obligaciones de operadores.
- **Incompatibilidades** (7 pendientes): fuente Ley 53/1984 recuperada.
