# ADIF_RED_TEAM_REVIEW.md — Revisión adversarial

Fecha: 2 de noviembre de 2026. Independiente del resto.

## 1. Intento de demostrar que las conclusiones son incorrectas

### Temas omitidos
- 6 nodos `missing` en `content/syllabus.ts`: PRL exposición de motivos y cap. I; Declaración sobre la Red cap. II; RCF cap. 3; CEM completo.
- Estos son omisiones demostradas del temario exigido.

### Fuentes equivocadas / no verificadas
- 15 fuentes `needs_check` (MCER-A2, MET-PSI-01, EN 50121, cuadernillos ADIF, DR 2027).
- Declaración sobre la Red: diferencia de ediciones sin resolver (V.0 ED 27/02/2026 vs. 31/07/2026).

### Definiciones imprecisas
- 256 claims `needs_review` con confianza baja. No se puede afirmar exactitud sin revisión independiente.
- ICT: correcciones recientes (anexo III) pero el resto de claims pendientes.

### Respuestas incorrectas
- No se ha verificado claim por claim en esta auditoría. Las correcciones documentadas (commit `1fd544a`) son de una auditoría anterior.

### Distractores ambiguos
- Bancos originales (62 + 52 + 22 + 26) con etiqueta `reviewed`, pero sin validación independiente de cada distractor.

### Contenido inventado
- EN 50121 y Directiva CEM se mantienen como material relacionado, no como documentos oficiales. Riesgo de presentarlos como oficiales.

### Normativa derogada
- No se ha detectado normativa derogada en las fuentes `verified`, pero no se ha verificado vigencia BOE de cada una.

### Errores de puntuación
- Simulacros: reglas 2026 pendientes de cotejo. Distinción "superar mínimos" vs "obtener plaza" no verificada.

### Funciones rotas
- Psicotécnicos: cronómetro orientativo, sin registro ni corrección funcional.
- Práctica en bloque: no es sesión protegida por servidor.

### Fallos de persistencia
- Modo mock en tests; migraciones no aplicadas en producción; recuperación de sesiones pendiente.

### Confusiones ORIGINAL/OFFICIAL
- Las preguntas originales se etiquetan `reviewed` pero no se atribuyen a ADIF. Los históricos están bloqueados. Riesgo de confusión si no se distingue claramente.

### Métricas engañosas
- `coveragePercent` oficial es `null` (correcto, no engañoso). La cobertura identificada provisional (64,71 %) fue invalidada (correcto).
- Etiqueta `reviewed` no acredita revisión independiente (riesgo de sobreestimación).

### Defectos responsive
- Columna amplia corregida en commit `a0418c1`. Accesibilidad y contraste no auditados.

### Evaluaciones complacientes
- No se han concedido aprobaciones por cortesía. Las notas se basan en evidencia disponible; donde no hay evidencia, se usa NO VERIFICADO.

## 2. Conclusiones del adversarial

- Las conclusiones del resto del comité son **consistentes con la evidencia disponible**.
- **No se puede certificar** el proyecto como "listo para preparar toda la convocatoria".
- Los hard gates se mantienen: omisiones demostradas, 256 claims sin revisión, reglas de simulacro no cotejadas, persistencia/auth no verificadas, accesibilidad no auditada.

## 3. Recomendación adversarial

No declarar COMPLETE. Priorizar P0 (CEM, nodos missing, claims, fuentes, simulacros, persistencia) antes de cualquier funcionalidad nueva.
