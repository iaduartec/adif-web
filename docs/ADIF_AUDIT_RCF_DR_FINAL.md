# ADIF 360 — Cierre didáctico RCF y desbloqueo documental DR

Fecha: 2026-11-02. Rama: `codex/auditoria-adif-26`.

## 1. RCF — COMPLETO

- 26/26 claims reviewed (18 normativos + 8 didácticos).
- Fuente: RD 664/2015 (BOE-A-2015-8042, cons. 12/07/2023).
- Calidad académica: 4/5.
- Facilidad de aprendizaje: 4/5.

## 2. DR 2027 — BLOQUEADA

- Edición V.0 (27/02/2026): disponible localmente. 20 claims coinciden con V.0.
- Edición 31/07/2026: portal ADIF devuelve 403. No verificada.
- Los 20 claims DR mantienen `needs_review`.
- No se promueven sin resolver la edición aplicable.

### Intentos de acceso
- curl HEAD https://www.adif.es/sobre-adif/declaracion-red → 403.
- webfetch → 403.

### Vías alternativas
- Contactar a ADIF directamente.
- Solicitar el documento a través de canales oficiales.

## 3. Inventario final

- Total claims: 273.
- `reviewed`: 99.
- `needs_review`: 174.

### Módulos completos (todos los claims normativos reviewed)
- ICT: 34/34.
- Incompatibilidades: 7/7.
- RCF: 26/26 (incluye didácticos).
- Estatuto: 11/11 normativos.

### Módulos bloqueados
- DR: 20 (edición inaccesible).
- CEM: 20 (PDF inaccesible).
- PRL: 23 (rama en curso).

### Módulos pendientes (verificables)
- Igualdad: 18 (incluye 2 bloqueadas).
- Psico: 8.
- Conducta: 10.
- Inglés: 8.

## 4. Validación
- `pnpm verify:content`: OK.
- `pnpm typecheck`: OK.

## 5. Siguiente prioridad recomendada

Dado que DR y CEM están bloqueadas por fuentes inaccesibles, se recomienda:

1. **Igualdad** (18 claims pendientes, fuente LO 3/2007 ya recuperada).
2. **PRL** (23 claims, rama en curso — no tocar).
3. **Psico/Conducta/Inglés** (26 claims, fuentes diversas).

No prolongar la auditoría de DR indefinidamente. Mantener los límites documentados.

## 6. Bloqueos pendientes
- DR: edición 31/07/2026 inaccesible (403).
- CEM: PDF inaccesible (403).
- PRL: rama en curso, no tocar.
