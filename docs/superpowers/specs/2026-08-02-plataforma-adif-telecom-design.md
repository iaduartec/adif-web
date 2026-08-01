# Plataforma web de preparación ADIF Telecomunicaciones 2026

## Objetivo

Crear una plataforma web pública para preparar la oposición ADIF Oficial de Telecomunicaciones de Entrada 2026. La aplicación debe reunir teoría, preguntas, simulacros, psicotécnicos, inglés A2, fichas y planificación, con progreso sincronizado entre dispositivos.

La web se desplegará en Vercel. La autenticación será exclusivamente mediante Google y se implementará con Supabase Auth. Supabase almacenará el progreso, resultados, favoritos y notas.

## Alcance de la primera versión

La primera versión será una plataforma funcional completa, no una página promocional. Incorporará el material generado en el paquete documental existente y permitirá ampliarlo posteriormente sin modificar la arquitectura.

Incluye:

- inicio de sesión con Google;
- panel personal de estudio;
- navegación por módulos y lecciones;
- banco de 4.500 preguntas;
- 30 simulacros;
- psicotécnicos e inglés A2;
- fichas de repaso;
- favoritos y notas;
- cuaderno automático de errores;
- historial y estadísticas;
- planificación semanal;
- sincronización entre dispositivos;
- diseño adaptable a móvil;
- avisos de procedencia y vigencia del contenido.

No incluye inicialmente pagos, suscripciones, administración multiusuario, mensajería, clases en directo ni funciones sociales.

## Enfoque visual

La interfaz tendrá un lenguaje editorial, profesional y sobrio. Evitará el aspecto genérico basado en rejillas repetitivas de tarjetas, degradados, brillos o contenedores anidados.

Principios:

- fondo claro y superficies abiertas;
- verde ferroviario usado como acento, no como relleno dominante;
- tipografía con jerarquía marcada;
- separación mediante espacio, reglas finas y cambios de escala;
- navegación compacta y estable;
- tablas y listas para información densa;
- estados de interacción claros;
- contraste y foco visibles;
- experiencia móvil diseñada, no simplemente encogida.

## Arquitectura

La aplicación se construirá con Next.js, TypeScript y Tailwind CSS. Se usará App Router y componentes de servidor por defecto. Los componentes cliente se reservarán para interacciones, temporizadores, filtros, notas y estado de sesión.

Supabase proporcionará:

- autenticación OAuth con Google;
- base de datos PostgreSQL;
- políticas de seguridad por fila;
- persistencia del progreso;
- sincronización de resultados, favoritos y notas.

El contenido didáctico se mantendrá separado de los datos personales. Las lecciones y preguntas se cargarán desde archivos estructurados versionados en el proyecto, con identificadores estables. Los datos de usuario solo referenciarán esos identificadores.

## Estructura de navegación

La navegación principal incluirá:

1. Inicio
2. Curso
3. Tests
4. Simulacros
5. Psicotécnicos
6. Inglés A2
7. Fichas
8. Cuaderno de errores
9. Estadísticas

En escritorio se utilizará una barra lateral. En móvil se convertirá en navegación compacta con acceso a todas las secciones sin ocultar funciones esenciales.

## Pantallas

### Acceso

Pantalla sencilla con identidad del curso, explicación breve y botón "Continuar con Google". Debe incluir enlaces a privacidad y condiciones y un aviso de que la plataforma no pertenece a ADIF.

### Inicio

Mostrará:

- saludo y continuidad de la última sesión;
- progreso global;
- objetivo semanal;
- próxima sesión recomendada;
- repasos pendientes;
- últimos resultados;
- acceso directo al siguiente simulacro.

### Curso

Vista jerárquica por bloques:

- parte general;
- RD 346/2011 e ICT;
- compatibilidad electromagnética;
- RCF Libro 1;
- psicotécnicos;
- inglés A2.

Cada lección tendrá lectura estimada, estado, progreso y acceso a preguntas relacionadas.

### Lección

La lección incluirá:

- título y ruta de navegación;
- estado de procedencia: oficial, explicación original o pendiente de cotejo;
- contenido estructurado;
- esquema o mapa conceptual;
- ejemplos;
- errores frecuentes;
- fichas relacionadas;
- preguntas de comprobación;
- notas personales;
- acción para marcar como completada.

### Tests

Permitirá filtrar por módulo, dificultad, estado, falladas y favoritas. El modo de práctica mostrará una pregunta cada vez y ofrecerá corrección inmediata opcional.

### Simulacros

Cada simulacro tendrá instrucciones, temporizador, navegación entre preguntas, indicador de respondidas y entrega confirmada. Al terminar mostrará puntuación, aciertos, errores, omisiones, tiempo y correcciones comentadas.

### Cuaderno de errores

Registrará automáticamente las preguntas falladas. Permitirá clasificarlas como pendientes, dominadas o marcadas para repaso y abrir la lección asociada.

### Estadísticas

Incluirá evolución temporal, precisión por módulo, tiempo medio, actividad reciente, racha y comparación de simulacros. Las visualizaciones serán accesibles y tendrán alternativa textual.

## Modelo de datos

Tablas principales:

- `profiles`: identidad pública mínima y preferencias;
- `lesson_progress`: estado, porcentaje y última actividad por lección;
- `question_attempts`: respuesta, resultado, modo y tiempo empleado;
- `simulation_attempts`: puntuación y resumen de cada intento;
- `simulation_answers`: respuestas individuales del intento;
- `favorites`: preguntas y fichas guardadas;
- `notes`: notas personales vinculadas a lecciones;
- `study_goals`: objetivo semanal y preferencias de planificación.

Todas las tablas personales incluirán `user_id`. Las políticas de seguridad permitirán a cada usuario consultar y modificar únicamente sus propios datos.

## Flujo de autenticación

1. La persona pulsa "Continuar con Google".
2. Supabase inicia OAuth con Google.
3. Google devuelve al callback autorizado.
4. La aplicación crea o recupera el perfil.
5. La persona accede al panel.
6. Las rutas privadas redirigen al acceso cuando no existe sesión.

Los secretos permanecerán en variables de entorno de Vercel y no se expondrán al navegador.

## Procedencia del contenido

Cada unidad tendrá uno de estos estados:

- `official_reference`: referencia o cita breve de una fuente oficial;
- `original_explanation`: explicación didáctica original;
- `verification_pending`: material que debe cotejarse con el anexo oficial PNI26/01.

La interfaz mostrará esta clasificación de manera comprensible. Las fuentes oficiales prevalecerán siempre y se enlazarán directamente.

## Estados y errores

La aplicación incluirá:

- esqueletos de carga;
- estados vacíos útiles;
- recuperación cuando falla una consulta;
- aviso de pérdida de conexión;
- reintento seguro;
- confirmación antes de entregar un simulacro;
- guardado optimista de favoritos cuando sea seguro;
- mensajes claros si OAuth se cancela o falla.

## Accesibilidad y rendimiento

- HTML semántico y orden correcto de encabezados;
- navegación completa por teclado;
- foco visible;
- contraste WCAG AA;
- etiquetas accesibles para controles;
- respeto de `prefers-reduced-motion`;
- carga diferida de gráficos y vistas pesadas;
- paginación o virtualización del banco de preguntas;
- mínimo JavaScript cliente;
- metadatos y páginas públicas indexables donde corresponda.

## Seguridad

- políticas RLS en todas las tablas personales;
- validación del usuario en operaciones de servidor;
- variables sensibles solo en servidor;
- ninguna clave de servicio en el cliente;
- validación de entradas y límites de longitud para notas;
- cabeceras de seguridad compatibles con Vercel;
- registro mínimo de datos personales.

## Verificación

Antes de entregar se comprobarán:

- inicio y cierre de sesión con Google;
- protección de rutas;
- persistencia entre sesiones;
- progreso de lecciones;
- práctica de preguntas;
- entrega y corrección de simulacro;
- favoritos y notas;
- cuaderno de errores;
- estadísticas;
- escritorio y móvil;
- accesibilidad básica;
- lint, typecheck, pruebas existentes y build.

## Criterios de aceptación

La primera versión estará terminada cuando una persona pueda iniciar sesión con Google, estudiar una lección, responder preguntas, completar un simulacro, guardar notas y favoritos, revisar errores y consultar su progreso desde dos dispositivos distintos.

La aplicación deberá compilar sin errores, funcionar en Vercel, proteger correctamente los datos de cada usuario y distinguir de forma visible el material oficial del contenido didáctico original.
