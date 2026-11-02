# ADIF_FUNCTIONAL_QA.md — QA funcional y técnico

Fecha: 2 de noviembre de 2026. Read-only. No se tocó producción.

## 1. Stack y pruebas

- Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Supabase (SSR + RLS).
- Vitest: 83 archivos / 652 pruebas (última ejecución: 652 OK).
- Playwright: E2E con `PLAYWRIGHT_TEST=true` (modo mock de Supabase).
- Validadores: `pnpm verify:content` (theory, references, claims, copy, syllabus, question-mappings).

## 2. Recorrido real probado (Escenario 2 y 5)

- Login → Estudiar → Responder → Corregir → Guardar → Salir → Volver → Recuperar progreso.
- **No verificado contra Supabase real**: solo modo mock. Migraciones no aplicadas en producción.
- `app/api/attempts/route.ts` admite identificadores oficiales, no `ORIG-` (práctica original pendiente de circuito completo).

## 3. Persistencia

- Modo mock en tests: usuario `test-user-id`, onboarding completado.
- Migraciones existen en Git pero **no aplicadas en producción**.
- Recuperación de sesiones y bloqueo de correcciones anticipadas pendientes de diseño aprobado.
- Práctica en bloque envía intentos individuales al entregar; no es sesión de examen protegida por servidor.

## 4. Simulacros

- Reglas 2026 pendientes de cotejo con bases oficiales.
- Tiempos, penalización, mínimos, bloques, reservas no verificados contra bases 2026.
- Distinción "superar mínimos" vs "obtener plaza" debe verificarse.

## 5. Seguridad

- RLS no verificada contra Supabase real.
- No se tocó producción durante la auditoría.
- `pnpm build` con Supabase real falla al prerenderizar `/temario` sin config; con `PLAYWRIGHT_TEST=true` pasa (cliente simulado). Esto no valida credenciales reales.

## 6. Build y rendimiento

- `pnpm build` OK en modo mock.
- `pnpm lint`: 0 errores, 2 warnings preexistentes (navegación interna).
- `pnpm typecheck`: OK.

## 7. Hallazgos

- P0-6: Persistencia/auth no verificadas en Supabase real.
- P0-5: Reglas de simulacro 2026 no cotejadas.
- P1: Psicotécnicos muestran preguntas/opciones sin registrar ni corregir respuestas (cronómetro orientativo).

## 8. Conclusión

Funcionamiento técnico sólido en modo mock. **No certificado en entorno real**. Prioridad: P0 (persistencia/auth, reglas de simulacro).
