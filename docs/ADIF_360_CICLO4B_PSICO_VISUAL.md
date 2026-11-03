# ADIF 360 — Ciclo 4B: Psicotécnicos visuales

## Implementación técnica

- Añadido campo opcional `figure` (SVG) a `OriginalPracticeQuestion` y al DTO público.
- Renderizado con `dangerouslySetInnerHTML` en `original-practice-session.tsx` (contenido controlado por el repositorio).
- Compatibilidad con preguntas textuales mantenida.

## Entregables

- 3 ejercicios visuales nuevos: orig-psico-visual-matrix-001, orig-psico-visual-pattern-001, orig-psico-visual-matrix-002.
- Figuras SVG originales (matriz de formas, patrón de rotación, matriz de colores).

## Validación

- pnpm typecheck: OK
- pnpm verify:content: OK

## Limitaciones

- Solo 3 ejercicios visuales en este ciclo; los 12 previstos requieren más tiempo. El renderizador ya soporta figuras, por lo que añadir más es incremental.
- No se ejecutaron tests E2E de navegador.
