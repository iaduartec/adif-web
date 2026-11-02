# Diseño funcional — primera entrega P0 ADIF 26/12PO

- **Estado:** borrador para aprobación del usuario; no autoriza todavía el plan de implementación.
- **Base:** rama `codex/auditoria-adif-26`, HEAD `24176b16c404310c105266027d1cee5af462957a`.
- **Criterio rector:** cada incremento debe dejar una unidad que se pueda estudiar, recuperar y practicar; el inventario y las etiquetas editoriales no cuentan como dominio.

## Intención

Entregar la primera parte utilizable del enfoque aprobado “contenido primero”, atendiendo en paralelo las tres regresiones E2E que bloquean el recorrido básico. Se parte de las páginas, repositorios de preguntas, teoría, citas, intentos y progreso que ya existen; no se crea otra academia ni un esquema de datos nuevo por anticipado.

## Resultado visible de esta entrega

1. Un registro de verificación de los nueve documentos ADIF de 26/12PO: edición identificada, fuente primaria contrastada, localizador, fecha, acceso y estado (`verified`, `needs_check`, `superseded` o equivalente del manifiesto). Separará la evidencia de alcance ADIF de la que demuestra el texto vigente. Un PDF 403 queda bloqueado salvo que una fuente oficial accesible permita verificar de forma suficiente la misma edición y alcance.
2. Una unidad completa y trazable sobre **PRL, capítulo I, artículos 1–4**, actualmente `missing`. Se elige porque la Ley 31/1995 es accesible en BOE y sus artículos tienen localizadores primarios exactos. La unidad incluirá introducción, resumen de recuperación, desarrollo, imprescindible, distinciones/trampas, ejemplo didáctico, flashcards y práctica original. Cada afirmación normativa citará fuente, versión, artículo/apartado y fecha de cotejo.
3. El recorrido `curso → práctica → corrección → errores/repaso` se podrá completar en escritorio y móvil. Se corregirán las tres regresiones indicadas: las opciones del ejercicio no aparecen en móvil; el diagnóstico de onboarding no llega a “Pregunta 1 de 15”; y desde curso no se llega al enlace “Iniciar práctica”. La causa concreta de cada regresión se establecerá al reproducirla antes de cambiar código.

La unidad no declarará completo todo PRL ni los nueve documentos. El estado de los restantes nodos continuará explícito hasta que se cotejen sus fuentes y cobertura.

## Enfoques considerados

1. **Contenido primero con regresiones paralelas — seleccionado por el usuario.** Verificar fuentes, dejar una unidad académica completa y restaurar el flujo E2E en el mismo incremento. Maximiza el tiempo útil de estudio y conserva un alcance vertical pequeño.
2. **Fiabilidad primero.** Resolver persistencia/reanudación y corrección de servidor antes de añadir contenido. Reduce riesgo funcional, pero retrasa una unidad de estudio pese a existir el flujo y datos necesarios.
3. **Frentes amplios por materia y subsistema.** Trabajar en paralelo PRL, RCF, ICT, CEM, Declaración, inglés, psicotécnicos y simulador. Se descarta para esta entrega: mezcla fuentes con bloqueos distintos, eleva el riesgo de revisión superficial y retrasa una entrega realmente estudiable.

## Alcance

### Incluido

- Revisar las fuentes y versiones registradas para los nueve documentos del temario; comprobar los accesos actuales y cotejar ediciones con fuentes primarias accesibles. Documentar bloqueos por separado, sin convertirlos en verificación.
- Completar PRL, capítulo I (arts. 1–4) como primera unidad. Cubrir el texto exigido, significado de los términos, relaciones entre conceptos y distinciones que puedan inducir confusión. Elaborar un mapa de objetivos de aprendizaje y preguntas antes de redactar el banco.
- Añadir preguntas **originales**, claramente atribuidas, con una sola respuesta defendible, distractores plausibles, explicación de cada opción y cita primaria exacta. El tamaño del conjunto lo determina la cobertura del mapa de objetivos: debe incluir recuperación literal, comprensión/discriminación y aplicación; no se fija una cuota para inflar el banco.
- Ejecutar las tres reparaciones con TDD, conservando las comprobaciones útiles de E2E y probando la ruta completa en viewport móvil y escritorio.
- Mantener los nodos no terminados como `partial` o `missing`, y señalar la fecha/fuente de cada verificación.

### No incluido

- Completar de una sola vez los 23 nodos parciales o todos los cinco ausentes.
- Publicar o habilitar preguntas históricas, incluidas las de CEM, mientras falten permisos, fuente y corrección resueltos.
- Activar simulacro oficial 2026 o inferir sus reglas de formatos antiguos.
- Cambiar autenticación, persistencia remota, RLS, esquema o migraciones; operar sobre Supabase real; desplegar, hacer push o integrar con `main`.
- Rehacer navegación/diseño visual fuera de lo requerido para usar las tres rutas afectadas.
- Afirmar dominio personal, probabilidad de aprobar o predicción de aparición a partir de esta entrega.

## Comportamiento de estudio

- La teoría se presenta como contenido didáctico separado del texto normativo y enlazado a sus localizadores. No se confundirá “aparece en el temario” con “la fuente confirma esta explicación”.
- La práctica mantiene `ORIGINAL ≠ OFFICIAL`; las respuestas y explicaciones aparecen tras responder en entrenamiento y no se filtran en estados de examen/simulación.
- Responder no marca por sí solo un tema como dominado. El progreso y los repasos reutilizan los mecanismos existentes; esta entrega solo comprobará que una respuesta incorrecta tiene corrección explicada y que el concepto queda accesible para repaso.
- Móvil: controles de respuesta visibles y operables dentro de la práctica activa, con área táctil adecuada y sin overflow horizontal. Las vistas de listado no revelarán claves u opciones si la política de contenido las retiene; las pruebas E2E deben verificar el contexto correcto y no debilitar el control de exposición.

## Criterios de aceptación verificables

### Fuentes y contenido

1. Los nueve documentos tienen un estado de fuente revisado en esta entrega, fecha de consulta y evidencia concreta. Se indica por separado qué acredita ADIF (inclusión/edición del temario) y qué acredita la fuente del texto. Ningún registro 403 se marca como verificado por el mero hecho de que el enlace aparezca en ADIF.
2. La unidad PRL cubre explícitamente los artículos 1, 2, 3 y 4 según el alcance inventariado. Cada concepto importante tiene explicación comprensible, resumen recuperable, definición, excepción/distinción aplicable, localizador BOE y al menos una actividad que obligue a recordarlo o aplicarlo.
3. Un mapa de cobertura conecta cada objetivo/concepto de la unidad con su artículo, pieza didáctica, flashcard y práctica. No hay objetivo importante sin al menos una vía de recuperación; no se cuenta una simple lectura como recuperación.
4. Todas las preguntas de la unidad llevan ID estable, `origin: original`, estado editorial, dificultad, concepto, respuesta, explicación razonada de correcta e incorrectas, fuente/version/localizador y fecha de revisión. La validación estructural existente y una revisión académica independiente no dejan claves sin fundamento, distractores ambiguos ni contenido presentado como oficial.
5. El verificador rechaza citas normativas sin versión/localizador verificables o con fuente que no sea primaria para la afirmación legal. `pnpm verify:content` y las pruebas de contenido pasan sin elevar el estado académico de unidades ajenas a este alcance.

### Recorrido y regresiones

6. Desde `/curso`, el usuario puede abrir la práctica de la unidad disponible; el enlace tiene nombre accesible y no aparece como disponible si no hay preguntas elegibles.
7. Tras completar onboarding con diagnóstico, se abre un set balanceado de 15 preguntas y se ve “Pregunta 1 de 15”; una respuesta se puede enviar sin perder la ruta ni la sesión.
8. En móvil (390×844), una pregunta activa expone sus opciones seleccionables, las etiquetas/controles cumplen tamaño táctil de al menos 44 px y no hay scroll horizontal. La lista previa conserva su regla de no exposición de respuestas.
9. Al responder mal en práctica, el usuario ve respuesta correcta y explicación con fuente, puede abrir el error/repaso asociado y el intento se guarda por el mecanismo local/mock existente. El flujo se cubre en escritorio y móvil sin depender de credenciales o datos de producción.
10. Las tres regresiones dejan de fallar con aserciones que comprueban comportamiento real, no solo presencia de texto/clases. La regresión completa `Estudiar → Practicar → Corregir → Repasar` queda automatizada.

### Límites operativos

11. El trabajo permanece en `codex/auditoria-adif-26`; no toca `main`, Supabase remoto ni Vercel. No activa históricos ni el formato oficial 2026.
12. Se genera evidencia reproducible de pruebas focalizadas y de la suite aplicable. Cualquier limitación de entorno/mock queda informada; los tests no equivalen a verificación de producción.

## Dependencias y puertas

- La versión actual del temario y la lista de los nueve documentos deben reconfirmarse antes de tratar los registros previos como actuales.
- Para PRL se necesita acceso a la versión BOE consultada y a los artículos exactos 1–4. Si el PDF específico ADIF sigue inaccesible, el alcance se limita a lo que la página ADIF y el texto oficial accesible sostengan; la indisponibilidad se registra.
- Antes de implementación se debe revisar el esquema de teoría/preguntas ya existente y localizar causas de las tres regresiones; no se asume que los tests antiguos describan el comportamiento correcto.
- La revisión independiente académica verifica clave, distractores y trazabilidad; la revisión técnica comprueba seguridad del flujo y no exposición prematura. Ninguna etiqueta `reviewed` basta por sí misma.
- Al cierre se inspecciona el diff, se informa el estado de la migración local existente y se mantiene la integración bloqueada hasta resolverla según la decisión registrada. No se propone merge en esta entrega.

## Orden del incremento (diseño, aún sin plan de tareas)

1. Reconfirmar estado de rama/documentos y versionar la evidencia de fuentes para los nueve documentos.
2. Elegir y cerrar con BOE la unidad PRL I; crear el mapa de objetivos y reglas de aceptación académica.
3. Escribir primero regresiones reproducibles para móvil, onboarding y entrada desde curso; corregir cada raíz preservando las barreras de exposición.
4. Construir teoría, recuperación y práctica original de la unidad contra el mapa de objetivos, sin alterar los bancos históricos.
5. Ejecutar revisiones independiente académica y técnica, los validadores y la ruta E2E completa; corregir hallazgos antes de dar la entrega por usable.

Este orden se concretará en tareas TDD con `writing-plans` únicamente tras aprobación de este diseño.

## Decisiones que quedan al implementador

- Reutilizar los componentes, esquemas, IDs y persistencia local existentes si cubren el contrato; proponer cambios de modelo solo si una necesidad verificable no puede resolverse dentro de ellos.
- Escoger los casos concretos de preguntas a partir del mapa aprobado, usando originalidad genuina y evitando similitudes cosméticas con bancos privados.
- Corregir la causa raíz más estrecha de cada regresión. Si la aserción E2E resulta obsoleta, sustituirla por una verificación funcional equivalente o más fuerte y explicar la diferencia.
- Mantener separada la fuente vigente del histórico didáctico y detener publicación donde derechos o versión no estén resueltos.
