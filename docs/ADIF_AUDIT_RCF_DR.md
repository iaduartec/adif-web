# ADIF 360 — Auditoría RCF + Declaración sobre la Red 2027

Fecha: 2026-11-02. Rama: `codex/auditoria-adif-26`.

## 1. Inventario reconciliado

- Total claims: 273.
- `reviewed`: 91 (83 + 8 RCF).
- `needs_review`: 182.

### Desglose por módulo

| Módulo | Total | Reviewed | Pendientes |
|---|---|---|---|
| estatuto | 65 | 11 | 54 |
| ict | 39 | 34 | 5 |
| incomp | 12 | 7 | 5 |
| rcf | 26 | 18 | 8 → 0 (promovidos) |
| igualdad | 39 | 21 | 18 |
| dr | 20 | 5 | 15 |
| psico | 9 | 1 | 8 |
| conducta | 10 | 0 | 10 |
| cem | 20 | 0 | 20 |
| prl | 25 | 2 | 23 |
| ingles | 8 | 0 | 8 |
| **Total** | **273** | **91** | **182** |

## 2. RCF — 8 claims promovidos

Fuente: RD 664/2015 (BOE-A-2015-8042, cons. 12/07/2023).

| Claim | Resultado | Localizador |
|---|---|---|
| rcf-c6-1 | VERIFIED | Definición 42 (Telefonema) |
| rcf-c7-1 | VERIFIED | 1.1.1.2.2 (Ámbito subjetivo) |
| rcf-c8-1 | VERIFIED | 1.5.1.10.5 (Equipamiento cabina) |
| rcf-c9-1 | VERIFIED | 1.5.1.10.3 (120 km/h) |
| rcf-c10-1 | VERIFIED | Definición de parada prescrita |
| rcf-c11-1 | VERIFIED | Definición 59 (Zona de riesgo) |
| rcf-c12-1 | VERIFIED | 2. Prueba parcial |
| rcf-c13-1 | VERIFIED | 1.5.1.x.1 (Orden de marcha invalidada) |

Módulo RCF: todos los claims normativos (c1-c13) ahora `reviewed`.

## 3. DR 2027 — Investigación de ediciones

### Ediciones disponibles
- **V.0 (27/02/2026)**: disponible localmente (`content/full-texts/declaracion-red-2027.json`). Verificada.
- **Edición 31/07/2026**: portal ADIF devuelve 403. No verificada.

### Edición exigida por la convocatoria
- La convocatoria ADIF PNI26/01 enlaza a la Declaración sobre la Red. No se pudo acceder al PDF (403).
- Se asume que la edición aplicable es la vigente en la fecha del examen, pero no se puede confirmar sin acceso.

### Claims DR (20 total, todos needs_review)
- **Cap. I (dr-c1-1 … dr-c6-2)**: 7 claims. Coinciden con V.0. Dependencia de edición pendiente: baja (conceptos estables).
- **Cap. II (dr-cap2-*)**: 5 claims. Verificados contra V.0 en sesiones anteriores. Dependencia de edición pendiente: media (anexo F puede variar).
- **Intro/takeaway/ex**: 8 claims. Didácticos.

### Decisión: NO promover DR claims
Los claims DR no se promueven a `reviewed` hasta resolver la edición aplicable. Mantienen `needs_review` con la evidencia de V.0 documentada.

## 4. Revisión adversarial

- RCF: los 8 claims verificados coinciden con el RD 664/2015 consolidado (12/07/2023).
- DR: bloqueada por edición inaccesible. No se fabrican evidencias.

## 5. Validación

- `pnpm verify:content`: OK.
- `pnpm typecheck`: OK.

## 6. Estado actual

- `reviewed`: 91.
- `needs_review`: 182.
- Módulo RCF: completo (todos los claims normativos reviewed).
- Módulo DR: bloqueado por edición.

## 7. Siguiente lote recomendado

- **DR**: resolver la edición aplicable (contactar ADIF o verificar acceso alternativo).
- **RCF**: completo.
- **PRL**: rama en curso, no tocar.
- **CEM**: bloqueado (PDF inaccesible).
