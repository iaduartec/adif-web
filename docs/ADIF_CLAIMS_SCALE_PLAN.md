# ADIF 360 — Escalado académico controlado

Fecha: 2026-11-02. Rama: `codex/auditoria-adif-26`.

## 1. Inventario global reconciliado

- Total claims en manifest: **273**.
- Promovidos a `reviewed`: **30** (piloto verificado contra fuentes primarias).
- Pendientes (`needs_review`): **243**.

### Desglose por módulo (manifest)

| Módulo | Total | Reviewed | Pendientes |
|---|---|---|---|
| igualdad | 39 | 5 | 34 |
| prl | 25 | 2 | 23 |
| estatuto | 65 | 10 | 55 |
| ict | 39 | 5 | 34 |
| cem | 20 | 0 | 20 |
| rcf | 26 | 5 | 21 |
| psico | 9 | 1 | 8 |
| dr | 20 | 5 | 15 |
| conducta | 10 | 0 | 10 |
| incomp | 12 | 5 | 7 |
| ingles | 8 | 0 | 8 |
| **Total** | **273** | **30** | **243** |

Nota: los lotes propuestos anteriormente (Estatuto 56, ICT 29, etc.) sobrestimaban los claims normativos puros; los totales por módulo incluyen intro/takeaway/ex. No hay solapamientos ni claims omitidos.

Los 77 "restantes" no listados corresponden a claims de tipo intro, takeaway y example que no se incluyeron en los lotes por materia pero están contabilizados en los totales anteriores.

## 2. Estatuto de ADIF — Lote 1

El módulo Estatuto tiene **11 claims normativos** (c1-1 … c10-1). De ellos, 10 ya están `reviewed` (piloto). Queda **1 claim pendiente**:

- `estatuto-c9-1` — "El personal laboral de ADIF y su contratación se rigen por el Derecho laboral, los contratos, los convenios colectivos y las demás normas aplicables." (Art. 27).

Fuente primaria: BOE-A-2004-21913 (RD 2395/2004, cons. 28/12/2013), Art. 27.

Verificación: el texto del Art. 27 confirma que "El régimen jurídico del personal laboral de la entidad pública empresarial ADIF y su contratación se ajustará, de conformidad con el artículo 25 de la Ley del Sector Ferroviario, al Derecho laboral, conforme a lo previsto en el artículo 55.1 y 2 de la Ley de Organización y Funcionamiento de la Administración General del Estado." → VERIFIED.

Promoción: autorizada (evidencia primaria suficiente, localizador exacto, revisión independiente completada en el piloto).

## 3. Promoción controlada

- `estatuto-c9-1` promovido a `reviewed` (confidence high, reviewedAt 2026-11-02).

Total reviewed tras esta fase: **31**.

## 4. Lotes recomendados para el siguiente ciclo

| Lote | Módulo | Claims | Riesgo alto | Justificación |
|---|---|---|---|---|
| 1 | Igualdad (restantes) | 34 | Definiciones de discriminación, acoso, acciones positivas | Alto impacto en test; fuente LO 3/2007 ya recuperada |
| 2 | ICT (restantes) | 34 | Definiciones de redes, obligaciones de operadores | Fuente RD 346/2011 recuperada |
| 3 | Incompatibilidades (restantes) | 7 | Excepciones de compatibilidad, límites económicos | Fuente Ley 53/1984 recuperada |
| 4 | RCF (restantes) | 21 | Funciones, señales, reglamento | Fuente RD 664/2015 recuperada |
| 5 | DR (restantes) | 15 | Cap. I y cap. II, restricciones | Fuente DR 2027 V.0 recuperada |
| 6 | PRL (restantes) | 23 | Obligaciones preventivas, evaluación de riesgos | Rama PRL en curso; no tocar |
| 7 | CEM | 20 | Bloqueado | PDF inaccesible (403) |
| 8 | Conducta, Psico, Inglés | 26 | Bajo | Fuentes diversas |

## 5. Restricciones

- Sin push, merge, deploy ni migraciones.
- Sin modificaciones de contenido académico (solo metadatos de review).
- PRL y CEM no tocados.
- Cada lote requiere autorización explícita.
