# ADIF 360 — Ciclo 16 · Calidad real de simulacros

Fecha de validación: 2026-11-04 · Checkout: `/home/kiri_/projects/adif-web` · Rama `main`.

## Resultado ejecutivo

Los cuatro recorridos de simulacro original funcionan en E2E con selección, navegación, cambio de respuesta, blancos, temporizador, entrega, corrección, resultado por materia y explicación posterior. Se preservan las preguntas oficiales retenidas. Los bancos disponibles son 108 específicas, 79 generales, 46 de inglés A2 y 38 psicotécnicas.

El resultado académico es utilizable para práctica y diagnóstico, con reservas: las etiquetas de dificultad no están calibradas, existen concentraciones y pares casi duplicados en telecomunicaciones, y numerosos distractores permiten descartar por absurdidad. No hay evidencia empírica para afirmar validez psicométrica ni para estimar probabilidades de aprobar.

## Auditoría académica

| Modalidad | Auditadas | Alcance y resultado |
|---|---:|---|
| Específicas | 108/108 elegibles: 61 ICT y 47 RCF | Revisión completa del banco elegible por especialista: fuente/claim local, unicidad, explicación y dificultad. No se halló clave evidentemente incorrecta. El cierre de trazabilidad local no verifica externamente cada claim ICT que sigue marcado pendiente. |
| Generales | 20/79, estratificadas: 4 por cada bloque de Igualdad, PRL, Estatuto, Conducta e Incompatibilidades | Las claves y explicaciones concuerdan con los localizadores de teoría consultados. Es una muestra; no equivale a verificación artículo por artículo del banco completo. |
| Inglés A2 | 46/46 | Lecturas conservan contexto compartido y evidencia suficiente; no se halló contradicción de clave. Los distractores y tareas tienden a ser sencillos. |
| Psicotécnicos | 38/38; comprobación de 12 figuras de pregunta y 40 figuras de opción | Sin clave visual incorrecta observada. Revisión manual de unicidad, prompt, explicación y etiquetas. No es calibración psicométrica. |
| **Total** | **212** | **108 específicas + 20 generales + 46 A2 + 38 psicotécnicas.** |

### Correcciones realizadas

- RCF `orig-tel-rcf-029`: localizador ajustado a 1.5.1.3, que es el apartado usado por enunciado y explicación.
- ICT `orig-tel-ict-018` y `orig-tel-ict-025`: localizadores precisados a 7.3 y 7.2.3, respectivamente; se añadió la referencia local exacta de compartimentación contra incendios. No cambió la clasificación pendiente de claims ni el gate de verificación.
- General `orig-gen-incompat-008`: etiqueta de materia normalizada a `INCOMPATIBILIDADES`, alineada con el idioma y el filtro del banco.
- Psicotécnicos: `orig-psico-logic-001` explicita la existencia de operadores y ya no ofrece un distractor compatible con las premisas; dos preguntas de retención con estímulo visible se clasificaron como atención; los ejercicios numéricos dejaron de etiquetarse como matrices; plegado/rotación se separó como razonamiento espacial y dominós como secuencias.
- Se añadió `psico-topic-spatial` al temario didáctico. No se modificó ninguna clave psicométrica por sospecha sin demostrar.

Las correcciones se comprueban en `tests/cycle16-original-quality.test.ts` y en los validadores de contenido.

### Variedad, cobertura y dificultad declarada

La distribución siguiente es la clasificación editorial preexistente `difficulty=1/2/3`, interpretada como básica/intermedia/exigente. No se revisó individualmente cada etiqueta para calibración; la auditoría encontró preguntas de recuerdo literal etiquetadas como exigentes. Por ello no se ofrece selección por dificultad.

| Banco | Básica | Intermedia | Exigente | Observación de cobertura |
|---|---:|---:|---:|---|
| Telecom | 12 | 65 | 31 | ICT anexo II: 25/61; RCF capítulo 5: 30/47. RCF capítulos 3 y 4: 2 preguntas cada uno. |
| General | 15 | 48 | 16 | PRL 26, Estatuto 23, EBEP 8, Igualdad 14 e Incompatibilidades 8; no hay preguntas de Declaración sobre la Red elegibles. |
| Inglés A2 | 32 | 11 | 3 | Gramática 18; comprensión lectora 16; contextos/mensajes 8; vocabulario y avisos 2 cada uno. |
| Psicotécnicos | 16 | 19 | 3 | 13 temas nominales; series/secuencias 7, atención/velocidad/diferencias 10, matrices 3, espacial 3. |

La dispersión de `sourceLocator` evita que un artículo único domine todos los bancos: el localizador individual más frecuente hallado es 5 preguntas en ICT (Anexo II, 2.5.1–2.5.3); en general es 4 (artículo 14). La mayor concentración es por bloque, no por artículo. En RCF se observaron pares casi duplicados `RCF-002/014`, `003/017`, `006/015` y `012/023`; en ICT, `021/045` y `022/053`. Conviene reescribirlos o sustituirlos por aplicación de casos antes de ampliar el banco. La revisión de muestra general no encontró un defecto de clave, pero la literalidad y distractores débiles reducen la exigencia. Inglés tiene muchos subtemas con 1–2 preguntas y no basta para estimar dominio fino. Los psicotécnicos mezclan vocabulario y tareas de una operación con ítems visuales; la etiqueta de habilidad no mide aptitud validada.

## Configuración del simulador

- La opción inicial continúa usando todo el banco elegible: 108 / 79 / 46 / 38.
- El estudiante puede elegir de 1 al total disponible. El muestreo usa preguntas únicas, balance por `topicId`, sin reemplazo y barajado; el helper acepta semilla para pruebas reproducibles. Una selección mayor que el banco se limita al máximo disponible.
- No se incorporó ajuste de dificultad porque las etiquetas no están suficientemente validadas.
- El temporizador es opcional y lo elige el estudiante. Se muestra como orientativo, no oficial, y el valor manual se limita a 600 minutos. La composición y cronómetro E2E fueron 4 preguntas/30 minutos para Telecom y General, y banco completo/30 minutos para A2 y Psicotécnicos. Esta selección solo hace viable recorrer el banco completo en CI; no declara composición oficial.
- Inglés A2 mantiene lectura y preguntas asociadas en cada ítem de revisión.

## Integridad de examen y resultados

Verificado en pruebas de componente y E2E:

- DTO público sin clave ni explicación antes de entrega; la Server Action lee la clave del repositorio y devuelve corrección después de recibir la entrega.
- Navegación libre, cambio de respuesta, blancos y entrega voluntaria; E2E recorre todas las preguntas de cada composición elegida.
- Un guard de cliente evita doble envío y la misma entrega conserva sus UUID de idempotencia al reintentar. Prueba de doble clic y de coincidencia temporal manual/timeout: una sola invocación de entrega.
- El temporizador usa deadline absoluto, se actualiza al reanudar pestaña y finaliza automáticamente al expirar. Pruebas de cuenta regresiva, suspensión y vencimiento.
- La puntuación distingue aciertos, errores contestados y blancos; el blanco permanece en el denominador. Caso de prueba: 1 acierto, 1 error, 1 blanco; resultado orientativo 33% (1/3). Incluye desglose por materia y materias bajo el umbral orientativo del 70%; no se presenta como regla oficial.
- Clave, respuesta del estudiante y explicación se muestran en la revisión posterior. Las 12 preguntas SVG y 40 opciones SVG aparecen en revisión psicotécnica y se validan como SVG seguro.

Límite adversarial: una persona autenticada puede invocar directamente la Server Action con IDs revisados y respuestas vacías; esa llamada recibe las claves porque constituye una entrega de simulacro en blanco. La API no mantiene un token/estado de intento que pruebe el recorrido por la UI ni que restrinja el conjunto seleccionado al set emitido por esa página. La pantalla normal no revela claves antes de pulsar entregar, pero el examen no es una prueba protegida contra automatización del propio estudiante. Evitar también la entrega directa requeriría un contrato de sesión validado por el servidor; el borrador actual no se persiste y no se modificó base de datos.

El backend actual no dispone de una entrega atómica de simulacro original. La RPC `record_practice_attempt` escribe una fila por respuesta contestada, mientras los blancos se corrigen localmente y no crean intento. La migración activa rechaza expresamente `orig-*` con `p_mode='simulation'`; no se cambió ni se eludió ese gate. Por eso la Action usa `p_mode='practice'`: los intentos originales persistidos aparecen como práctica por pregunta, no como intento de examen. Si falla una llamada intermedia, ya puede haber respuestas persistidas; el mismo envío puede reintentarse con las mismas claves idempotentes, pero no hay fila de entrega con resultado agregado. No se comprobó conexión real a Supabase.

## Recuperación de sesión

La UI advierte que recargar o salir pierde el bloque sin corregir. Se diseñó y probó un codec aislado de borrador (identificador de intento, pregunta actual, respuestas, deadline e IDs idempotentes; lista blanca de IDs originales; TTL de 24 h). Rechaza IDs de otros bancos, campos extra y claves/explicaciones. Está desconectado de `sessionStorage`, UI, base de datos y autenticación. No se activó almacenamiento definitivo ni persistencia nueva. Sin recuperación, tras recarga se pueden perder respuestas y un nuevo inicio puede generar UUID nuevos, dejando riesgo de duplicar estadísticas de preguntas respondidas antes del fallo parcial.

## Batería reservada independiente

`bateria-reservada/PREGUNTAS.md` contiene 16 ítems inéditos de evaluación (4 por modalidad), fuera de `content/` y del entrenamiento. Examinador, verificador y estudiante simulado trabajaron separados. El verificador obtuvo C-A-B-D / B-C-A-C / B-A-B-D / B-A-C-B; el estudiante, con solo la batería y teoría citada, respondió 16/16 sin dudas. No se reutilizó clave durante la respuesta ciega. Teoría normativa e inglés aportaron suficiencia directa; psicometría aportó el marco de habilidad y cada solución requirió vocabulario, cálculo o deducción indicados por el ítem. La muestra es demasiado pequeña para estimar dificultad, competencia general o probabilidad de aprobar. Calidad pedagógica pendiente: aumentar casos que midan aplicación y mejorar distractores, especialmente en A2 y cálculo psicotécnico.

## Históricos y seguridad de pruebas

- Los 102 enunciados oficiales permanecen retenidos y sus mapas exactos siguen con la clasificación anterior; `verify:content` validó 102 IDs/mapeos, no los desbloqueó.
- Los ocho formularios históricos siguen pendientes de verificación, con 18 preguntas declaradas cada uno y sin enlace de apertura.
- La configuración de fixture requiere `PLAYWRIGHT_TEST=true`, `NODE_ENV` no productivo y `VERCEL_ENV` no productivo. Las rutas `/api/test/*` comprueban también que el cliente esté en modo mock y rechazan producción. Los tests fuerzan tanto `VERCEL_ENV=production` como un runtime de despliegue `NODE_ENV=production, VERCEL_ENV=preview`; ambos mantienen Supabase aunque el flag se filtre. E2E solo usa usuario/almacén mock; no se usaron datos reales.
- La pantalla histórica muestra la limitación y ningún radio de pregunta retenida. No se retiraron gates de derechos, trazabilidad o simulación oficial.

## Estado de recuperación y review-session

En el E2E actual, los cuatro escenarios de `review-session.spec.ts` pasan: flujo de escritorio, revelar/calificar/teclado, reintento idempotente y móvil con movimiento reducido. No se reprodujeron los cuatro fallos preexistentes mencionados en el informe anterior; el checkout no conserva sus trazas ni identidades individuales para atribuirles una causa histórica. No se cambió su lógica ni se rebajaron esas pruebas.

## Validación ejecutada en este ciclo

| Comprobación | Resultado actual |
|---|---|
| `pnpm test` | 99 archivos, 722/722 PASS |
| `pnpm typecheck` | PASS |
| `pnpm verify:content` | PASS; incluye estructura, referencias, claims, copia, syllabus y mapeos históricos |
| Playwright: 4 simulacros originales + práctica original + review-session + study-flow + mobile | 12/12 PASS |
| `git diff --check` | PASS |
| Capturas | Escritorio y móvil de las cuatro modalidades, generadas en `test-results/` |

Las pruebas de navegador corrieron con mock autorizado de entorno local. No demuestran persistencia en Supabase ni despliegue.

## Clasificación de estados

- **PASS DE PRÁCTICA ORIGINAL:** PASS funcional (E2E de las cuatro materias y suite de práctica). Las correcciones individuales se guardan por RPC como `practice`.
- **PASS DE SIMULACROS ORIGINALES:** PASS funcional local, 4/4 recorridos E2E; composición y tiempo son orientativos.
- **PASS DE RECUPERACIÓN DE SESIONES:** NO. Codec aislado probado; recarga de examen activo sigue perdiendo el bloque.
- **PASS DE PERSISTENCIA REAL:** NO VERIFICADO. E2E usa mock y no existe fila atómica de entrega.

## Veredicto y siguientes mejoras académicas

**Preparador:** apto para estudiar y detectar errores por tema con una sesión original de longitud elegible; no basta aún como simulación representativa validada del examen. Prioridad: reducir duplicados RCF/ICT, ampliar capítulos RCF 3–4 y subtemas de inglés con 1–2 ítems, y revisar distractores fáciles.

**Auditor adversarial:** el flujo normal no entrega claves antes del evento de entrega; el estudiante autenticado puede llamar esa Action directamente y entregar el banco en blanco, pues no existe token/estado de intento emitido por servidor. Los tests cubren timeout, doble envío, blancos y bloqueo histórico. Riesgo abierto para resultados agregados: la entrega no es atómica y la capa de sesión no sobrevive a recargas. La restricción de la migración sobre `p_mode='simulation'` se conserva; la persistencia actual clasifica respuestas del simulacro original como práctica individual.

1. Recalibrar dificultad con criterios editoriales por pregunta antes de habilitar filtros.
2. Sustituir pares repetidos con casos de aplicación y distractores funcionales.
3. Diseñar, probar y autorizar aparte recuperación local de sesión y decisión sobre retención/privacidad.
4. Una entrega agregada persistente exigiría contrato y migración autorizados; queda fuera de este ciclo.
