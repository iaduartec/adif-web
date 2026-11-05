# Auditoría UX/UI ADIF

**Fecha de esta nota:** 5 de noviembre de 2026
**Referencia:** base `bf7148a` y cambios de la rama de auditoría.
**Método:** inspección de código, diffs y documentación de auditoría previa. No se hicieron nuevas pruebas visuales en dispositivos.

## Hallazgos verificados

### Lectura ancha y contenido académico

La auditoría previa `docs/ADIF_UX_UI_AUDIT.md` registra que el ancho de lectura para `/curso`, `/curso/[slug]` y `/temario` se amplió en `a0418c1`. Ese documento reporta verificación responsive para curso y temario a 390 px y para curso hasta 1920 px, sin overflow horizontal. Esta nota no repite esas pruebas ni las extiende a otras pantallas o dispositivos.

En el diff local de `components/temario/temario-view.tsx` se reemplaza el título “Temario oficial completo” por “Temario de la convocatoria”; el texto ahora indica que la teoría y los resúmenes están en revisión, y aclara que “Cobertura declarada” no acredita exactitud ni revisión independiente. `app/(dashboard)/temario/page.tsx` refleja el nuevo título y una descripción menos concluyente. Estos cambios están en el commit `86e0be6` de la rama de auditoría.

El ajuste de rotulación reduce el riesgo de presentar como verificación independiente un estado de cobertura. No demuestra que el contenido haya sido revisado académicamente. La revisión de fuentes primarias sigue pendiente.

### Login y alta

- `app/(auth)/login/page.tsx:6-22` presenta un encabezado, explicación breve, aviso de que la plataforma no pertenece a ADIF y accesos mediante Google o correo/contraseña.
- `components/auth/email-password-sign-in.tsx:75-115` asocia etiquetas a los campos, usa autocompletado apropiado, limita a 6 caracteres solo en modo de alta y presenta errores con `role="alert"`.
- Los textos del selector de cuenta y los errores pasan de voseo rioplatense a castellano peninsular en el commit `09cf3d1`. La eliminación de la longitud mínima en el inicio de sesión es un cambio local previo, conservado sin incluirlo en ese commit.
- Cada afirmación de la teoría muestra su estado editorial: revisión registrada (con fecha cuando consta), pendiente, borrador o sin dato. Este metadato no certifica por sí mismo la exactitud ni la revisión independiente de la fuente.
- `components/auth/google-sign-in.tsx:65-105` no tiene estado de espera ni deshabilita el botón mientras inicia OAuth; clics repetidos pueden iniciar solicitudes duplicadas. Es un riesgo menor de UX/fiabilidad.
- `app/(auth)/login/actions.ts:15-27` crea usuarios mediante la API de administración con `email_confirm: true`. La acción no valida formato/longitud en servidor ni implementa limitación de frecuencia visible. El límite HTML se puede eludir invocando la Server Action directamente. `lib/supabase/admin.ts:17-24` muestra que el cliente utiliza `SUPABASE_SERVICE_ROLE_KEY`.
- La preconfirmación parece una decisión explícita para evitar depender de correo SMTP, pero aumenta el riesgo de altas abusivas y de registrar direcciones ajenas o mal escritas. Requiere validación de servidor, controles contra abuso y una decisión de producto sobre verificación de email.

### Accesibilidad y responsive

El login contiene `main`, sección nombrada por `aria-labelledby`, etiquetas de formulario, mensajes de error con `role="alert"` y controles con foco visible en los estilos de `app/globals.css`. La experiencia de OAuth carece de estado de carga anunciado. La página temario incluye encabezado, navegación con nombre accesible y textos explicativos en el diff local.

No se ejecutó auditoría con axe, lector de pantalla ni pruebas de contraste. Playwright con Chromium simulado pasó pruebas de teclado, 320 px, 390 px y escritorio; no equivale a probar dispositivos físicos, todas las pantallas ni otros navegadores.

## Limitaciones de verificación

- Los cambios de texto de login y rotulación del temario están confirmados en la rama de auditoría; el ajuste previo de longitud mínima continúa como cambio local sin confirmar. Ninguno forma parte de `bf7148a`.
- La producción reportada como `READY` para `bf7148a` no incorpora necesariamente estos cambios locales.
- Las pruebas de componentes existentes verifican presencia e interacción básica, pero no sustituyen inspección visual en dispositivos reales ni evaluación con tecnologías de asistencia.
- No se comprobó el flujo real de Google OAuth ni el alta en un proyecto Supabase de producción o prueba.
- Esta nota es una revisión estática acotada y no constituye certificación WCAG ni validación académica del material.

## Acciones recomendadas

1. Ampliar la comprobación visual en dispositivos físicos y otros navegadores.
2. Añadir estado pendiente accesible al acceso Google y evitar solicitudes OAuth repetidas.
3. Validar los datos del alta en servidor y añadir controles de abuso; resolver la política de confirmación de email.
4. Completar auditoría de teclado, lector de pantalla, contraste y responsive para los módulos aún no verificados.
5. Mantener el lenguaje de cobertura como declaración de estado hasta completar el cotejo académico de cada afirmación con sus fuentes primarias.
