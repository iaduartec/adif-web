# ADIF 360 — Auditoría funcional real y cierre de la experiencia de estudio

Fecha: 2026-11-02. Rama: `codex/auditoria-adif-26`.

## 1. Inventario reconciliado

- Total claims: 273.
- `reviewed`: 144.
- `needs_review`: 129.
- `pnpm verify:content`: OK.

## 2. Psicotécnicos — Auditoría funcional

### Componente: `OriginalPracticeSession` (components/practice/original-practice-session.tsx)

**Funciones verificadas por código y tests:**

| Función | Estado | Evidencia |
|---|---|---|
| Iniciar ejercicio | PASS | `startSession()` reinicia estado |
| Seleccionar respuesta | PASS | `choose()` actualiza answers |
| Confirmar (training) | PASS | `submitTrainingAnswer()` → fetch /api/attempts |
| Corrección inmediata (training) | PASS | `results[question.id]` muestra correct/incorrect |
| Explicación | PASS | `results[question.id]!.explanation` |
| Avanzar | PASS | `next()` → `focusQuestion(index+1)` |
| Finalizar bloque (practice) | PASS | `finish()` → batch fetch /api/attempts |
| Puntuación | PASS | `results` por pregunta, `practiceComplete` |
| Cronómetro | PARTIAL | `elapsedFor()` calcula tiempo por pregunta, pero no hay timer visible |
| Reinicio | PASS | `startSession()` limpia todo |
| Navegación móvil | PASS | Responsive CSS, flex-wrap |
| Beforeunload warning | PASS | `hasUnfinishedWork` → beforeunload listener |

### Tests ejecutados
- `tests/psychometric-practice.test.ts`: 8 tests, todos PASS.
- `tests/theory-validators.test.ts`: 48 tests, todos PASS.

### Hallazgos
- El cronómetro es interno (no visible al usuario). Mejora recomendada.
- No hay persistencia de sesión (se pierde al recargar). Documentado en UI.
- Mock de Supabase en tests; no verificado contra Supabase real.

## 3. Inglés A2 — Auditoría lingüística

### Banco de preguntas
- 22 ítems (según informe anterior).
- Claims: 8 (todos reviewed).
- Tests: `tests/english-a2-page.test.tsx`.

### Evaluación
- Gramática: verbos regulares/irregulares, modales (must/have to), past simple.
- Vocabulario: ferroviario (platform, track, train driver).
- Nivel: A2 (MCER).
- Distractores: presentes, calidad variable.

### Hallazgos
- Dificultad uniforme (todos nivel similar). Recomendación: diversificar.
- Sin comprensión auditiva (solo escrita). Limitación del formato web.

## 4. Recorrido completo del estudiante

| Paso | Estado | Notas |
|---|---|---|
| Login | NOT_TESTED | Requiere Supabase real |
| Elegir tema | PASS (código) | Navegación por links |
| Estudiar teoría | PASS (código) | Componentes renderizados |
| Responder pregunta | PASS (código) | `choose()` + `submitTrainingAnswer()` |
| Corregir | PASS (código) | fetch /api/attempts |
| Guardar progreso | NOT_TESTED | Requiere Supabase real |
| Salir y volver | PARTIAL | beforeunload warning, sin persistencia de sesión |
| Recuperar progreso | NOT_TESTED | Requiere Supabase real |

### Separación de entornos
- **Verificado con código/tests**: componentes, flujos de UI, validaciones.
- **Verificado con mock**: tests unitarios con Supabase mock.
- **No verificado**: Supabase real (persistencia, auth).
- **Fallido**: ninguno detectado en código.

## 5. Auditoría visual

- Sidebar de navegación: presente.
- Contenido principal ancho: `max-width: min(100%, 72rem)` (commit a0418c1).
- Sin tres columnas estrechas: confirmado.
- Controles accesibles: botones, labels, fieldsets presentes.
- Explicaciones: visibles en training mode.

### Móvil
- Responsive CSS presente.
- No verificado en dispositivo real (sin Playwright).

## 6. Inventario reconciliado

- Total claims: 273.
- `reviewed`: 144.
- `needs_review`: 129.
- Módulos completos: ICT, Incompatibilidades, RCF, Estatuto (normativos), Igualdad, Conducta, Psico, Inglés.
- Módulos bloqueados: DR, CEM.
- Módulos pendientes: PRL (rama en curso).

## 7. Revisión adversarial

- No se detectaron preguntas con claves incorrectas en los claims verificados.
- No se detectaron ejercicios sin corrección (el componente llama a /api/attempts).
- Los cronómetros son internos (no visibles). Mejora recomendada.
- La sesión se pierde al recargar (documentado en UI).
- Las estadísticas no se verificaron (requiere Supabase real).

## 8. Plan de reparación (TDD)

### P0 — Funcionalidad
1. Hacer visible el cronómetro en psicotécnicos.
2. Añadir persistencia de sesión (localStorage o Supabase).
3. Verificar /api/attempts contra Supabase real.

### P1 — Calidad
4. Diversificar dificultad en Inglés A2.
5. Añadir comprensión auditiva (si factible).
6. Mejorar distractores en preguntas psicotécnicas.

### P2 — UX
7. Añadir diagramas de redes ICT.
8. Tabla comparativa de anexos I-V.
9. Flashcards sobre definiciones y excepciones.

## 9. Tests ejecutados

- `pnpm verify:content`: OK.
- `pnpm typecheck`: OK.
- `tests/psychometric-practice.test.ts`: 8/8 PASS.
- `tests/theory-validators.test.ts`: 48/48 PASS.
- `tests/english-a2-page.test.tsx`: no ejecutado en esta sesión.

## 10. Bloqueos pendientes

- DR: edición 31/07/2026 inaccesible.
- CEM: PDF inaccesible.
- Supabase real: no verificado (persistencia, auth).
- Playwright/móvil: no ejecutado.

## 11. Evaluación final

| Materia | Académica | Aprendizaje | Claims |
|---|---|---|---|
| RCF | 4/5 | 4/5 | 26/26 |
| Igualdad | 4/5 | 4/5 | 39/39 |
| ICT | 4/5 | 3/5 | 34/34 |
| Incompatibilidades | 4/5 | 3/5 | 7/7 |
| Código de Conducta | 4/5 | 3/5 | 10/10 |
| Psicotécnicos | 3/5 | 3/5 | 9/9 |
| Inglés A2 | 3/5 | 3/5 | 8/8 |
