# ADIF_UX_UI_AUDIT.md — Auditoría UX/UI y accesibilidad

Fecha: 2 de noviembre de 2026. Read-only. Análisis estático + Playwright.

## 1. Caso prioritario: Compatibilidad electromagnética

URL auditada: `https://adif-web.vercel.app/curso/compatibilidad-electromagnetica?view=theory`.

### Problema detectado (antes del fix)
- Contenido en columna estrecha (~640px) rodeado de espacio vacío.
- Sensación de dashboard de tres columnas.
- Poco aprovechamiento del panel principal para lectura larga.

### Fix aplicado (commit `a0418c1`)
- Columna de lectura amplia: `max-width: min(100%, 72rem)` (~1152px), centrada, responsive.
- Verificado a 1920px (1152px), 1440px (1048px), 390px (350px), sin overflow horizontal.
- Tabs, breadcrumb, progreso, título y subtítulo mantenidos arriba.

### Diseño objetivo cumplido
- Sidebar izquierda + una única zona principal amplia.
- Sin tres columnas de contenido académico simultáneo.
- Bloques verticales, jerarquía clara, espacio para tablas/ejemplos.
- Párrafos con longitud de línea cómoda (60–72ch en lede/summary).

## 2. Análisis por pantalla

| Pantalla | Utilidad | Legibilidad | Organización | Ancho | Jerarquía | Consistencia | Accesibilidad | Móvil | Interacción | Errores | Facilidad aprendizaje |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Dashboard | 4 | 4 | 4 | 4 | 4 | 4 | N/V | 3 | 4 | 3 | 4 |
| Curso (índice) | 4 | 4 | 4 | 4 | 4 | 4 | N/V | 4 | 4 | 3 | 4 |
| Tema (resumen/teoría/oficial) | 4 | 4 | 4 | 4 | 4 | 4 | N/V | 4 | 4 | 3 | 4 |
| Temario | 4 | 4 | 4 | 4 | 4 | 4 | N/V | 4 | 4 | 3 | 4 |
| Preguntas | 3 | 4 | 3 | 4 | 3 | 3 | N/V | 3 | 3 | 3 | 3 |
| Simulacros | 3 | 4 | 3 | 4 | 3 | 3 | N/V | 3 | 3 | 3 | 3 |
| Inglés A2 | 3 | 4 | 3 | 4 | 3 | 3 | N/V | 3 | 3 | 3 | 3 |
| Psicotécnicos | 3 | 3 | 3 | 4 | 3 | 3 | N/V | 3 | 2 | 3 | 2 |
| Flashcards | N/V | N/V | N/V | N/V | N/V | N/V | N/V | N/V | N/V | N/V | N/V |
| Cuaderno de errores | 3 | 4 | 3 | 4 | 3 | 3 | N/V | 3 | 3 | 3 | 3 |
| Estadísticas | 4 | 4 | 4 | 4 | 4 | 4 | N/V | 3 | 4 | 3 | 3 |
| Login | 4 | 4 | 4 | 4 | 4 | 4 | N/V | 4 | 4 | 3 | 4 |

N/V = no verificado (no se auditó con herramientas de accesibilidad ni lector de pantalla).

## 3. Hallazgos específicos

- **Ancho**: corregido en commit `a0418c1` para `/curso`, `/curso/[slug]`, `/temario`.
- **Contraste**: no auditado con herramientas (pendiente).
- **Teclado/lector de pantalla**: no auditado (pendiente).
- **Móvil**: responsive verificado a 390px para curso y temario; otros módulos pendientes.
- **Consistencia**: tarjetas con borde/sombra en curso; otras páginas usan `dashboard-wide` (hasta 88rem) sin centrado.

## 4. Propuestas

1. Auditoría de accesibilidad con axe-core + navegación por teclado + lector de pantalla.
2. Unificar anchura de lectura en todas las páginas de estudio (no solo curso/temario).
3. Verificar contraste de `--muted` sobre `--paper` (posible fallo WCAG AA).
4. Añadir skip-link y landmarks ya presentes; verificar `aria-live` en estados.

## 5. Conclusión

Diseño mejorado significativamente (columna amplia). Accesibilidad y contraste **no verificados** → prioridad P1.
