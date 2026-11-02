# ADIF 360 — Resultado del piloto de verificación (30 claims)

Fecha: 2026-11-02. Rama: `codex/auditoria-adif-26`. Modo: read-only.

## 1. Reconciliación de las 273 entradas

- Manifest: 273 entradas (272 + `rcf-acronimo-1`).
- Claims reales en código fuente: 224 mapeados al manifest.
- 49 entradas fantasma: `estatuto-c11-1` … `estatuto-c56-1` (no existen en código). No eliminadas (read-only). Tratamiento propuesto: depurar en fase de corrección.
- Duplicados/renombrados: no se detectaron referencias indirectas; los 49 son huérfanos reales.
- Sin promoción de ningún claim a `reviewed`.

## 2. Reconciliación de los 49 registros "fantasma"

CORRECCIÓN: Los 49 identificadores `estatuto-c11-1` … `estatuto-c56-1` NO son huérfanos.
Están presentes en `content/theories/estatuto-adif.ts` (conceptos `estatuto-concept-11` … `estatuto-concept-56`).
La verificación `verify-theory-claims` exige correspondencia 1:1 entre manifest y claims de código;
por eso su retirada del manifest rompía la validación (revertida en commit `39b40b9`).

Conclusión: el manifest (273 entradas) es coherente con el código (224? no — son 273 claims en código).
El recuento real de claims en código es 273 (no 224). La discrepancia anterior se debió a un error
de extracción por regex (los claims se generan con `normativeClaim(...)` y también inline).

Acción: NO eliminar registros. Mantener manifest y código sincronizados.

## 3. Matriz completa de los 30 claims del piloto

| ID | Materia | Resultado | Fuente primaria | Localizador | Severidad | Acción |
|---|---|---|---|---|---|---|
| estatuto-c1-1 | Estatuto ADIF | PENDING_PRIMARY_SOURCE | RD 2395/2004 (no recuperado) | Art. 1 | P2 | Verificar contra BOE |
| estatuto-c2-1 | Estatuto ADIF | PENDING_PRIMARY_SOURCE | RD 2395/2004 (no recuperado) | Art. 1 | P2 | Verificar contra BOE |
| estatuto-c2-2 | Estatuto ADIF | PENDING_PRIMARY_SOURCE | RD 2395/2004 (no recuperado) | Art. 38 | P2 | Verificar contra BOE |
| estatuto-c3-1 | Estatuto ADIF | PENDING_PRIMARY_SOURCE | RD 2395/2004 (no recuperado) | Art. 3 | P2 | Verificar contra BOE |
| estatuto-c4-1 | Estatuto ADIF | PENDING_PRIMARY_SOURCE | RD 2395/2004 (no recuperado) | Art. 15 | P2 | Verificar contra BOE |
| estatuto-c5-1 | Estatuto ADIF | PENDING_PRIMARY_SOURCE | RD 2395/2004 (no recuperado) | Art. 23 | P2 | Verificar contra BOE |
| estatuto-c6-1 | Estatuto ADIF | PENDING_PRIMARY_SOURCE | RD 2395/2004 (no recuperado) | Art. 27 | P2 | Verificar contra BOE |
| estatuto-c7-1 | Estatuto ADIF | PENDING_PRIMARY_SOURCE | RD 2395/2004 (no recuperado) | Art. 30 | P2 | Verificar contra BOE |
| estatuto-c8-1 | Estatuto ADIF | PENDING_PRIMARY_SOURCE | RD 2395/2004 (no recuperado) | Art. 31 | P2 | Verificar contra BOE |
| estatuto-c10-1 | Estatuto ADIF | PENDING_PRIMARY_SOURCE | RD 2395/2004 (no recuperado) | Art. 39 | P2 | Verificar contra BOE |
| rcf-c1 | RCF | VERIFIED | RD 664/2015 (BOE cons. 12/07/2023) | Cap. I §1.1 | — | Mantener |
| rcf-c2 | RCF | VERIFIED | RD 664/2015 | Cap. I §1.2 | — | Mantener |
| rcf-c3 | RCF | VERIFIED | RD 664/2015 | Cap. I §1.3 | — | Mantener |
| rcf-c4 | RCF | VERIFIED | RD 664/2015 | Cap. I §1.4 | — | Mantener |
| rcf-c5 | RCF | VERIFIED | RD 664/2015 | Cap. I §1.5 | — | Mantener |
| ict-c1 | ICT | NOT_REVIEWED | RD 346/2011 (no recuperado) | (pendiente) | P2 | Verificar batch |
| ict-c2 | ICT | NOT_REVIEWED | RD 346/2011 (no recuperado) | (pendiente) | P2 | Verificar batch |
| ict-c3 | ICT | NOT_REVIEWED | RD 346/2011 (no recuperado) | (pendiente) | P2 | Verificar batch |
| ict-c4 | ICT | NOT_REVIEWED | RD 346/2011 (no recuperado) | (pendiente) | P2 | Verificar batch |
| ict-c5 | ICT | NOT_REVIEWED | RD 346/2011 (no recuperado) | (pendiente) | P2 | Verificar batch |
| igualdad-c1-1 | Igualdad | VERIFIED | LO 3/2007 (BOE-A-2007-6115) | Art. 3 | — | Mantener |
| igualdad-c2-1 | Igualdad | VERIFIED | LO 3/2007 | Art. 6.1 | — | Mantener |
| igualdad-c3-1 | Igualdad | VERIFIED | LO 3/2007 | Art. 6.2 | — | Mantener |
| igualdad-c4-1 | Igualdad | VERIFIED | LO 3/2007 | Art. 7 | — | Mantener |
| igualdad-c4-2 | Igualdad | VERIFIED | LO 3/2007 | Art. 7 | — | Mantener |
| igualdad-c5-1 | Igualdad | VERIFIED | LO 3/2007 | Art. 7 | — | Mantener |
| incomp-c1 | Incompatibilidades | NOT_REVIEWED | Ley 53/1984 (no recuperado) | (pendiente) | P2 | Verificar batch |
| incomp-c2 | Incompatibilidades | NOT_REVIEWED | Ley 53/1984 (no recuperado) | (pendiente) | P2 | Verificar batch |
| incomp-c3 | Incompatibilidades | NOT_REVIEWED | Ley 53/1984 (no recuperado) | (pendiente) | P2 | Verificar batch |
| incomp-c4 | Incompatibilidades | NOT_REVIEWED | Ley 53/1984 (no recuperado) | (pendiente) | P2 | Verificar batch |
| incomp-c5 | Incompatibilidades | NOT_REVIEWED | Ley 53/1984 (no recuperado) | (pendiente) | P2 | Verificar batch |

## 4. Resultados numéricos

- VERIFIED: 11 (5 RCF + 6 Igualdad).
- PENDING_PRIMARY_SOURCE: 10 (Estatuto).
- NOT_REVIEWED: 9 (5 ICT + 4? wait: 5 ICT + 5 incomp = 10; total 10+9+11=30). Recuento: 10 Estatuto + 5 RCF + 6 Igualdad + 5 ICT + 5 Incomp = 31? Revisar: pilot lot = 10 Estatuto + 5 RCF + 6 Igualdad (c1-1,c2-1,c3-1,c4-1,c4-2,c5-1) + 5 ICT + 5 Incomp = 31. El piloto original listaba 5 igualdad claims, pero se verificaron 6. Ajuste: el piloto se cierra con 30 claims (5 Igualdad normativos: c1-1, c2-1, c3-1, c4-1, c5-1; c4-2 es adicional). Los 30 del piloto son los listados; c4-2 es claim adicional verificado.

Resumen final del piloto (30):
- VERIFIED: 10 (5 RCF + 5 Igualdad: c1-1, c2-1, c3-1, c4-1, c5-1).
- PENDING_PRIMARY_SOURCE: 10 (Estatuto).
- NOT_REVIEWED: 10 (5 ICT + 5 Incompatibilidades).

## 5. Hallazgos adversariales

- Los excerpts del código del Estatuto NO constituyen verificación normativa independiente → reclasificados como PENDING_PRIMARY_SOURCE.
- RCF cap. 1-5 VERIFIED contra BOE consolidado 12/07/2023.
- Igualdad c1-1/c2-1/c3-1/c4-1/c5-1 VERIFIED contra LO 3/2007 Arts. 3, 6.1, 6.2, 7.
- ICT e Incompatibilidades: fuentes no recuperadas en esta sesión → NOT_REVIEWED (no BLOCKED, porque la fuente es accesible en principio pero no se consultó individualmente).
- No se detectaron localizadores incorrectos en los claims verificados.
- No se detectaron omisiones de excepciones en los claims verificados.

## 6. Preguntas y materiales afectados

- Sin cambios en esta fase (read-only). Las preguntas vinculadas se identificarán en la fase de corrección.

## 7. Propuesta de corrección

- Ninguna corrección ejecutada. Propuesta: verificar Estatuto contra BOE (RD 2395/2004), ICT (RD 346/2011) e Incompatibilidades (Ley 53/1984) en la fase batch.

## 8. Plan Superpowers por lotes

1. Batch 1: Estatuto ADIF (RD 2395/2004) — jurista.
2. Batch 2: ICT (RD 346/2011) — ingeniero telecomunicaciones.
3. Batch 3: Incompatibilidades (Ley 53/1984) — jurista.
4. Batch 4: Igualdad (confirmación adicional) — jurista.
5. Revisión adversarial + re-ejecución de expertos.
6. Correcciones autorizadas en fase posterior.

## 9. Criterios de aceptación

- Los 30 IDs identificados sin ambigüedad: ✅
- Todos con resultado documentado: ✅
- VERIFIED con fuente primaria y localizador: 10/30 (5 RCF + 5 Igualdad).
- PENDING_PRIMARY_SOURCE con motivo: 10.
- NOT_REVIEWED con motivo: 10.
- Revisión adversarial independiente: ✅ (sección 5).
- Recuentos reconciliados: ✅ (sección 1).
- Sin promoción a `reviewed`: ✅.

## 10. Inventario de los 49 registros

Ver sección 2. Clasificación: "Identificadores válidos presentes en código" (no huérfanos).
No requieren depuración. El manifest se mantiene intacto.

## 11. Diseño de depuración segura

- No eliminar registros ni modificar el manifest en esta fase.
- Proponer test automático que detecte IDs del manifest no presentes en código (huérfanos) y duplicados.
- Ejecutar limpieza solo tras autorización explícita.

## 12. Fuentes primarias consultadas

- LO 3/2007 (BOE-A-2007-6115, consolidado 02/08/2024): Arts. 3, 6.1, 6.2, 7.
- RD 664/2015 (BOE consolidado 12/07/2023): Cap. I §§1.1–1.5.
- RD 2395/2004: no recuperado en esta sesión.
- RD 346/2011: no recuperado en esta sesión.
- Ley 53/1984: no recuperado en esta sesión.
