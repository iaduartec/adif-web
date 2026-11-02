# Especificación académica — CEM y PRL

Estado: diseño aprobado en sus líneas generales; especificación y planes pendientes de aprobación para ejecución. Base observada: rama `codex/auditoria-adif-26`, HEAD `f6cdcae86921661004d77014ea246d6206b9403c`, 2-11-2026. El `AGENTS.md` modificado es preexistente y queda fuera del alcance. La ejecución revalidará HEAD, cambios y coordinación antes de empezar.

## Resultado y límites

Dos entregas independientes, CEM primero y PRL después, con incrementos pequeños: explicación contrastada, recuperación, práctica original con cuatro opciones, retroalimentación por opción y fuentes precisas. No se modifica ICT, RCF ni Declaración sobre la Red. No se activan históricos, simulacros oficiales, cambios remotos, merge, push ni deploy. Se conserva ORIGINAL ≠ OFFICIAL, la privacidad de claves y la revisión del servidor; no se debilitan los bloqueos de fuente, corrección o derechos. No se presenta lectura ni un solo acierto como dominio.

Las explicaciones normativas son paráfrasis claramente diferenciadas de las definiciones legales y de ejemplos técnicos. Cada afirmación jurídica debe enlazar norma, versión o redacción consultada, artículo y apartado, fecha y estado. El texto consolidado BOE es informativo: comprobar la disposición modificadora oficial cuando sea necesario para determinar fecha de entrada en vigor o cambios. Una fecha global de actualización no equivale a la fecha de modificación de cada artículo. No inventar excepciones, cifras o fuentes.

## Evidencia y bloqueos

- Ley 31/1995: https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292 ; última actualización publicada identificada el 2-11-2026: 09-04-2026. Comprobar cada apartado y su historia antes de marcarlo contrastado.
- Directiva 2014/30/UE: https://www.boe.es/buscar/doc.php?id=DOUE-L-2014-80623 es publicación original, no prueba por sí misma de la redacción vigente; cotejar versión consolidada EUR-Lex y disposiciones modificadoras. Verificar también el RD 186/2016 consolidado en BOE y su relación de transposición antes de formular obligaciones españolas: https://www.boe.es/buscar/act.php?id=BOE-A-2016-4442 . La URL y cada extremo deben volver a verificarse al ejecutar.
- ADIF PNI26/01 https://www.adif.es/w/pni26-01-personal-operativo devuelve 403 en esta consulta. La captura local y los metadatos previos sustentan solo lo capturado, no la edición actual del PDF. Registrar URL, fecha, acceso, identidad y hash de cualquier archivo accesible; un 403 no autoriza darlo por verificado.
- Artículo ferroviario CEM: cotejar directamente ejemplar original y edición asignada, procedencia, autor, páginas y derechos; buscar fuente oficial accesible sin eludir controles. `content/full-texts/compatibilidad-electromagnetica.json` es una transcripción local, no una comprobación actual. Si falla el cotejo, etiquetar contenido histórico y alcance documental como pendientes, sin alterar textos históricos ni habilitar preguntas históricas. No atribuir automáticamente la publicación a ADIF.

## Matriz CEM: objetivos verificables

| Fuente/localizador | Objetivo y comprobación | Estado inicial |
|---|---|---|
| Directiva art. 2.1–4 | Ámbito de equipos, exclusiones, reglas para legislación específica y seguridad: comparar todos los apartados con el texto vigente y evitar «todos los equipos» | Pendiente de cotejo completo |
| Directiva art. 3.1 puntos 1–6 | Distinguir equipo, aparato, instalación fija, CEM, perturbación e inmunidad; comparar definiciones legal y didáctica | Confusión CEM/inmunidad detectada |
| Directiva anexo I.1–2 | Requisitos esenciales aplicables y distinción entre aparatos e instalaciones fijas; no inventar límites numéricos | Pendiente de cotejo |
| RD 186/2016: localizadores equivalentes identificados durante cotejo | Derecho español y transposición: localizar artículo/apartado exactos sin suponer numeración | Pendiente |
| Artículo histórico completo, páginas y edición asignada | Cada afirmación histórica cotejada contra original y separada de regulación actual; sin equiparar pregunta histórica y ley | Original no contrastado en consulta actual |
| EN 50121, parte y edición concretas | Solo afirmar lo que se pueda consultar legítimamente y citar; si no, limitar la explicación y declarar pendiente | Pendiente |

Ejemplos de aceptación: una pregunta distingue CEM de inmunidad y por qué son incorrectas las otras tres opciones; otra exige aplicar una exclusión del art. 2 sin generalizarla. Los ejemplos ferroviarios se rotulan como didácticos, no como citas. Revisar todas las preguntas CEM asociadas existentes, con inventario de ID y decisión fundada; las históricas quedan bloqueadas incluso si se detecta una respuesta obsoleta.

## Matriz PRL: alcance y objetivos

El inventario del repositorio identifica exposición de motivos y capítulos I, III y V. Es evidencia histórica del alcance; el PDF ADIF actual sigue pendiente mientras sea inaccesible. La auditoría debe desglosar cada artículo en apartados y letras reales y registrar no aplicables o derogaciones, no solo cubrir cada fila con un párrafo.

| Localizador Ley 31/1995 | Objetivo de contraste y estudio |
|---|---|
| Exposición de motivos I–IV, según estructura real BOE | Finalidad, origen, marco y alcance; verificar división real antes de citar; no convertir el preámbulo en obligación autónoma |
| 1 | Fuentes de la normativa preventiva |
| 2 | Objeto y carácter de mínimos |
| 3 | Ámbito, exclusiones y aplicación adaptada |
| 4 | Definiciones, elementos y diferencias |
| 14 | Derecho, deber empresarial, alcance y coste |
| 15 | Principios de la acción preventiva y orden conceptual |
| 16 | Integración, plan, evaluación y planificación |
| 17 | Equipos de trabajo y protección individual |
| 18 | Información, consulta y participación |
| 19 | Formación: condiciones, tiempo y coste |
| 20 | Medidas de emergencia |
| 21 | Riesgo grave e inminente, sujetos, facultades y condiciones |
| 22 | Vigilancia de la salud, voluntariedad, excepciones y confidencialidad |
| 23 | Documentación y deberes relacionados |
| 24 | Coordinación de actividades empresariales |
| 25 | Protección de trabajadores especialmente sensibles |
| 26 | Maternidad y medidas sucesivas |
| 27 | Protección de menores |
| 28 | Relaciones temporales, duración determinada y empresas de trabajo temporal |
| 29 | Obligaciones de las personas trabajadoras |
| 33 | Consulta y materias |
| 34 | Derechos de participación y representación |
| 35 | Delegados de Prevención: designación y escala |
| 36 | Competencias y facultades de delegados |
| 37 | Garantías y sigilo |
| 38 | Comité de Seguridad y Salud: composición y constitución |
| 39 | Competencias y facultades del comité |
| 40 | Colaboración con la Inspección de Trabajo |

Cada fila se transforma en una matriz de artículo/apartado: texto contrastado, concepto, sujeto, regla/excepción, cita exacta, sección y pregunta/recuperación, estado, revisor y fecha. Señalar apartados sin actividad; no afirmar cobertura completa con huecos. Las cifras, condiciones y plazos se incorporan solo tras comprobación. No se promete un número fijo de preguntas: cada objetivo sustantivo requiere recuperación o aplicación y el conjunto debe discriminar comprensión y memoria.

## Archivos previstos y contratos

- `content/theories/compatibilidad-electromagnetica.ts`, `content/summaries/compatibilidad-electromagnetica.ts`: teoría y recuperación CEM; PRL equivalentes para la segunda entrega.
- `content/original-practice/telecom.json`, `content/original-practice/general-knowledge.json`: preguntas originales de su materia, claves y explicación de cuatro opciones bajo el esquema existente; revisión de existentes sin cambiar su procedencia.
- `content/flashcards.ts`, `content/theory-concepts.ts`, `content/claim-review-manifest.json`, `content/syllabus.ts`, `content/source-manifest.json`: solo cuando corresponda vincular conceptos, citas, estado y recuperación; ningún estado equivale a revisión independiente.
- `docs/STUDY_CONTENT_AUDIT.md` y nuevos registros de matriz/revisión: evidencia, cobertura, discrepancias y bloqueos.
- Tests específicos en `tests/`, más los de validación, DTO público y práctica. Si el esquema actual no permite justificar cada distractor sin exponer claves antes de contestar, especificar cambio mínimo y test de seguridad antes de implementarlo; no crear migración remota.

## Aceptación y revisión independiente

Para cada unidad: 1) mapa íntegro de conceptos y apartados; 2) texto comprensible, resumen recuperable, regla/excepción y ejemplo; 3) preguntas originales con cuatro opciones y explicación de cada una; 4) citas primarias exactas y versión; 5) práctica y revisión disponibles mediante mecanismos existentes; 6) pendientes visibles y verificables; 7) tests de no exposición y preservación de históricos; 8) revisión documentada por especialista de materia, preparador, pedagogo y auditor independientes de quien redactó. El especialista coteja citas, el preparador cobertura y trampas, el pedagogo recuperación y el auditor intenta refutar los tres; registrar nombres/roles, archivos, versión y defectos. Ningún autor aprueba su propio trabajo ni `reviewed` sustituye esa revisión. Las discrepancias se resuelven mediante fuente primaria o permanecen abiertas.

`COMPLETE` exige ausencia de afirmaciones fundamentales sin fuente, cobertura del alcance confirmado, práctica adecuada y cuatro revisiones aprobadas. Si el PDF ADIF/artículo original no se obtiene, se puede entregar una unidad parcial contrastada con BOE pero no certificar integridad respecto del documento inaccesible. Tests automáticos no certifican corrección académica.
