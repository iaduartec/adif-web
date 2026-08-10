# Banco oficial de exámenes ADIF y revisión visual final

**Fecha:** 10 de agosto de 2026
**Estado:** Pendiente de revisión escrita
**Producto:** Plataforma de estudio ADIF — Oficial de Telecomunicaciones de Entrada

## 1. Objetivo

Sustituir el banco sintético actual por un archivo de preguntas que hayan aparecido realmente en exámenes de ADIF y mejorar la presentación de la plataforma para que resulte más clara, ordenada y cómoda en escritorio y móvil.

La aplicación conservará la autenticación exclusiva con Google, Supabase como capa de persistencia y la arquitectura actual de Next.js. Este proyecto no añadirá pagos, funciones sociales ni nuevas tablas salvo que la implementación demuestre que son imprescindibles.

## 2. Regla editorial no negociable

El banco de práctica solo podrá contener preguntas, opciones y respuestas correctas reproducidas desde cuadernillos y plantillas correctoras oficiales de ADIF.

Queda prohibido:

- inventar preguntas, opciones o respuestas;
- completar fragmentos que no puedan leerse con certeza en el documento fuente;
- adaptar el enunciado para hacerlo más claro;
- mezclar preguntas de elaboración propia con preguntas oficiales;
- presentar recuerdos de candidatos, academias o recopilaciones no oficiales como exámenes reales;
- crear simulacros artificiales combinando preguntas de diferentes modelos.

Se permiten únicamente correcciones técnicas que no alteren el texto, como normalizar saltos de línea o representar correctamente símbolos que sean inequívocos en el PDF. Toda duda de transcripción dejará la pregunta fuera del banco hasta que pueda verificarse.

## 3. Fuentes oficiales iniciales

La primera importación se limitará a documentos publicados en `adif.es`:

- OEP 2025, PNI25/01, perfil `25/10PO - Oficial de Telecomunicaciones de Entrada`, modelos 1131 y 4104.
- OEP 2024, PNI24/01, perfil `24/05PO - Oficial de Telecomunicaciones de Entrada`, modelos 3403 y 3413.
- OEP 2023, PNI23/01, perfil `23/05PO - Oficial Telecomunicaciones de Entrada`, modelos 1433 y 4101.

Documentos de partida:

- 2025: <https://www.adif.es/documents/20124/45240815/%2818.11.2025%29%2B-%2BPlantillas%2Bcorrectoras%2By%2Bcuadernillos%2Bde%2Bexamen.pdf/a2b9f608-83b0-34ee-0aa4-aba4ee6baf6b>
- 2024: <https://www.adif.es/documents/20124/33942288/%2825.11.2024%29%20-%20Plantillas%20correctoras%20y%20cuadernillos%20de%20examen.pdf/7d5847b0-d613-65b0-a0a2-ae936d6e0500>
- 2023: <https://www.adif.es/documents/20124/17165113/%2807.11.2023%29%2B-%2BPlantillas%2Bcorrectoras%2By%2Bcuadernillos%2Bde%2Bexamen.pdf/dce76c5e-ae60-a0d0-568e-4f4db30c3823>
- Guía de ADIF sobre consulta y alegación de cuadernillos: <https://www.adif.es/documents/20124/45240823/%2818.11.2025%29%2B-%2BGu%C3%ADa%2Bpara%2Balegar%2Bpreguntas%2Bde%2Blas%2Bpruebas%2Bselectivas.pdf/14516d6e-2383-eb59-ec9d-98858d9f8af2>

La parte psicométrica no se incorporará si el cuadernillo solo está disponible en la consulta privada del candidato. La existencia de una plantilla de respuestas sin el cuadernillo legible tampoco será suficiente para importar una pregunta.

## 4. Modelo de datos y procedencia

Cada pregunta oficial tendrá, como mínimo:

- un identificador interno estable;
- convocatoria y año;
- perfil de puesto;
- código de examen;
- número de pregunta original;
- indicador de pregunta ordinaria o de reserva, cuando conste;
- enunciado literal;
- cuatro opciones literales;
- respuesta correcta tomada de la plantilla oficial;
- URL directa del PDF oficial;
- página del cuadernillo y página de la plantilla correctora;
- fecha de verificación;
- huella de contenido para detectar duplicados o modificaciones accidentales.

El esquema de validación rechazará registros sin fuente, página, cuatro opciones o respuesta oficial. También rechazará claves duplicadas para la combinación convocatoria, modelo y número de pregunta.

Las explicaciones didácticas no formarán parte de esta primera migración. La corrección mostrará la opción marcada por ADIF y el enlace a la fuente. Si en el futuro se incorporan explicaciones, deberán basarse en material oficial, quedar visualmente identificadas como elaboración didáctica y someterse a una especificación separada.

## 5. Importación y control de calidad

La importación será reproducible y separará extracción, revisión y publicación:

1. Descargar o registrar el PDF oficial y su URL canónica.
2. Extraer únicamente las páginas del perfil y modelo correspondientes.
3. Transcribir enunciados y opciones sin reformularlos.
4. Asociar cada número con la plantilla del mismo código de examen.
5. Ejecutar validaciones estructurales y de duplicidad.
6. Comparar visualmente cada registro con la página del PDF.
7. Publicar solo registros revisados.

El repositorio conservará un manifiesto de importación con el número de preguntas aceptadas, rechazadas y pendientes de revisión por cada modelo. Una importación incompleta no podrá presentarse como examen completo.

## 6. Migración del producto

El cambio será atómico: la interfaz seguirá usando el banco actual durante el trabajo de extracción, pero el despliegue final sustituirá completamente los datos sintéticos.

En el mismo cambio se eliminarán de las superficies públicas:

- la afirmación de que existen 4.500 preguntas;
- los 30 simulacros artificiales;
- las preguntas, opciones y explicaciones sintéticas;
- cualquier contador o texto derivado de esos volúmenes.

Los intentos históricos que apunten a preguntas sintéticas se conservarán en Supabase para no destruir datos, pero se excluirán de las métricas y del cuaderno de errores del nuevo banco. La migración no borrará registros de usuarios.

## 7. Experiencia de estudio

### Banco oficial

La ruta de tests pasará a denominarse **Preguntas oficiales**. Permitirá filtrar por año, convocatoria, modelo y bloque cuando este pueda identificarse sin inferencias dudosas.

Cada pregunta mostrará:

- etiqueta `Pregunta oficial ADIF`;
- año, perfil, modelo y número original;
- enunciado y opciones literales;
- enlace `Ver en el documento oficial`;
- estado de respuesta del usuario.

La respuesta correcta permanecerá oculta hasta responder. Después se mostrará la opción señalada en la plantilla oficial y la referencia de procedencia, sin explicación inventada.

### Exámenes oficiales

La ruta de simulacros pasará a denominarse **Exámenes oficiales**. Cada sesión representará un único código de examen y conservará el orden, las preguntas de reserva y las reglas publicadas para esa convocatoria cuando estén documentadas.

Si solo está disponible la parte específica, se identificará expresamente como `Parte específica`, sin presentarla como reproducción del examen completo.

### Cuaderno de errores y métricas

El cuaderno de errores seguirá aplicando la regla de que prevalece el último intento, pero solo incluirá preguntas oficiales activas. Las métricas mostrarán cobertura real por convocatoria y rendimiento por fuente, evitando porcentajes basados en preguntas retiradas.

## 8. Dirección visual

La revisión visual seguirá un estilo editorial sobrio, relacionado con documentación técnica ferroviaria:

- tipografía más legible y jerarquía consistente;
- paleta neutra con verde como acento funcional;
- menos cajas, bordes y superficies anidadas;
- encabezados y etiquetas con capitalización coherente;
- espacios verticales más claros entre contexto, acción y contenido;
- tarjetas únicamente para unidades interactivas reales;
- metadatos de procedencia compactos pero siempre visibles;
- controles de filtros que se apilen correctamente en móvil;
- una pregunta por bloque de lectura, sin columnas estrechas para las opciones en pantallas pequeñas;
- acciones principales inequívocas y estados vacíos útiles.

El panel de inicio destacará una única siguiente acción. Las métricas secundarias se simplificarán para reducir ruido. La navegación y las rutas existentes se conservarán, actualizando solamente las etiquetas necesarias.

## 9. Accesibilidad y rendimiento

- Mantener HTML semántico y orden natural del teclado.
- Conservar el diálogo móvil con gestión de foco y cierre mediante Escape.
- Asociar filtros, radios y mensajes de corrección con etiquetas accesibles.
- No depender solo del color para distinguir acierto, error o procedencia.
- Mantener componentes de servidor para lectura y listados siempre que sea posible.
- Limitar JavaScript cliente a filtros interactivos, sesiones y acciones del usuario.
- Evitar cargar el banco completo en el navegador; paginar o seleccionar en el servidor.
- Respetar `prefers-reduced-motion`.

## 10. Errores y estados incompletos

- Un PDF inaccesible o una página ilegible dejará el modelo como pendiente, nunca como completo.
- Una discrepancia entre cuadernillo y plantilla bloqueará la pregunta afectada.
- Un examen parcialmente importado mostrará el número exacto de preguntas disponibles y no ofrecerá modo examen completo.
- Los enlaces oficiales se conservarán aunque ADIF cambie posteriormente la navegación de su web; las comprobaciones de enlaces deberán poder repetirse.
- Los fallos de Supabase mantendrán los estados de carga y error existentes sin revelar datos internos.

## 11. Pruebas y criterios de aceptación

La implementación deberá demostrar:

- cero preguntas activas sin URL y páginas oficiales;
- cero opciones o respuestas generadas por la aplicación;
- correspondencia exacta entre código, número y plantilla correctora;
- ausencia de los tres distractores sintéticos repetidos del banco anterior;
- filtros correctos por año y modelo;
- un examen oficial no mezcla códigos ni convocatorias;
- el cuaderno de errores ignora preguntas retiradas;
- las métricas solo usan preguntas oficiales activas;
- navegación y sesión de respuesta operativas en escritorio y 390 px;
- ausencia de desbordamiento horizontal;
- estados de foco, carga, vacío y error visibles y comprensibles;
- `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build` finalizados sin errores causados por el cambio.

La validación visual incluirá inicio, preguntas oficiales, detalle de examen, sesión, corrección, cuaderno de errores y estadísticas en escritorio y móvil.

## 12. Fuera de alcance

- Conseguir cuadernillos privados mediante credenciales de candidatos.
- Incorporar preguntas recordadas de academias o aspirantes.
- Crear preguntas de entrenamiento parecidas a las oficiales.
- Mantener un objetivo artificial de miles de preguntas.
- Añadir pagos, comunidad, clasificación social o nuevos proveedores de autenticación.
