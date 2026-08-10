import type { TheorySection } from "../lesson-theory";

export const inglesA2Theory: TheorySection = {
  introduction: `La prueba de inglés en las oposiciones de Personal Operativo de ADIF evalúa las competencias correspondientes al nivel A2 del Marco Común Europeo de Referencia para las Lenguas (MCER). A diferencia de otras pruebas, el examen de ADIF suele enfocarse de manera muy práctica en: (1) estructuras gramaticales de uso cotidiano y profesional; (2) verbos modales de obligación, prohibición, permiso y habilidad; (3) tiempos verbales básicos (especialmente el pasado simple regular e irregular); y (4) comprensión lectora de textos cortos y vocabulario técnico ferroviario básico.

La prueba de opción múltiple suele penalizar los errores, por lo que dominar la detección de palabras clave temporales (como "ago", "yesterday", "last week") y la diferenciación sutil de modales (como "must not" frente a "don't have to") es crucial para descartar opciones incorrectas al instante sin riesgo de penalizar.`,

  concepts: [
    {
      title: "El Pasado Simple (Past Simple): formación y uso",
      description: "Se utiliza para describir acciones completadas en un momento específico del pasado. (1) Verbos regulares: se forman añadiendo '-ed' al infinitivo del verbo (ej. 'work' -> 'worked', 'stop' -> 'stopped'). (2) Verbos irregulares: cambian su forma ortográfica por completo y deben memorizarse (ej. 'go' -> 'went', 'buy' -> 'bought', 'see' -> 'saw', 'write' -> 'wrote'). (3) Auxiliar 'did': en oraciones negativas ('did not' / 'didn't') y preguntas ('Did you...?'), se utiliza el auxiliar 'did', lo que obliga a que el verbo principal vuelva a escribirse en infinitivo (ej: 'We didn't go to the station', NO 'We didn't went')."
    },
    {
      title: "Verbos modales de Obligación, Prohibición y Necesidad",
      description: "Clasificación semántica clave en exámenes: (a) 'Must': indica obligación firme, deber moral u orden de seguridad directa (ej: 'You must wear a helmet'). (b) 'Must not' / 'Mustn't': expresa prohibición absoluta por motivos de seguridad o ley (ej: 'You must not walk on the tracks'). (c) 'Have to': indica una obligación externa impuesta por normas o reglamentos (ej: 'Maquinistas have to pass a medical exam'). (d) 'Don't have to' / 'Doesn't have to': expresa ausencia de obligación, es decir, algo opcional o innecesario (ej: 'You don't have to pay, it is free'). Esta última distinción es muy preguntada."
    },
    {
      title: "Verbos modales de Habilidad y Permiso",
      description: "Expresión de capacidades y autorizaciones: (a) 'Can': expresa habilidad o capacidad en el presente (ej: 'He can speak English') y permiso informal (ej: 'Can I use this phone?'). (b) 'Could': expresa habilidad en el pasado (ej: 'She could drive when she was 18') o peticiones de auxilio o información con mayor cortesía en la atención al cliente (ej: 'Could you tell me the platform number?'). (c) 'May': indica permiso formal o posibilidad media-alta (ej: 'May I enter the control room?')."
    },
    {
      title: "Vocabulario y Glosario Técnico Ferroviario (Glosario A2)",
      description: "Términos indispensables que aparecen recurrentemente en los enunciados y lecturas de ADIF: (1) Platform: Andén. (2) Track / Line: Vía ferroviaria / línea. (3) Train driver: Maquinista. (4) Station master / Station manager: Jefe de estación. (5) Timetable / Schedule: Horario de trenes. (6) Delay: Retraso. (7) Level crossing: Paso a nivel. (8) Buffer / Buffer stop: Tope de vía. (9) Points / Switches: Agujas de desvío / desvíos. (10) Ticket office: Taquilla de billetes. (11) Left-luggage office: Consigna de equipajes. (12) Commuter train: Tren de cercanías. (13) Luggage / Baggage: Equipaje."
    },
    {
      title: "Comprensión lectora (Reading Comprehension): táctica A2",
      description: "En las lecturas sobre avisos de retrasos, cambios de andén o incidencias meteorológicas en la vía, la técnica recomendada es: (1) Leer primero la pregunta para identificar qué información se solicita (un número de andén, una hora, un motivo de retraso). (2) Hacer un barrido rápido del texto (skimming) buscando sinónimos o palabras clave de la pregunta. (3) No deducir información que no figure de forma explícita y literal en el párrafo."
    }
  ],

  examples: [
    {
      situation: "En una pregunta de examen tipo test de ADIF se presenta la frase incompleta: 'The technician ___ (repair) the signal at track 3 yesterday morning.' y se ofrecen las opciones: A) repairs, B) repaired, C) did repair, D) has repaired.",
      application: "La palabra clave temporal es 'yesterday morning' (ayer por la mañana), lo que exige el uso de Pasado Simple. Al ser 'repair' un verbo regular, se añade '-ed'. La respuesta correcta es B) 'repaired'. La opción C es incorrecta porque en oraciones afirmativas no se utiliza el auxiliar 'did'."
    },
    {
      situation: "Se plantea la traducción de un cartel de advertencia de seguridad ferroviaria: 'Está terminantemente prohibido cruzar las vías'. Las opciones son: A) You don't have to cross the tracks, B) You must not cross the tracks, C) You could not cross the tracks.",
      application: "La frase indica una prohibición de seguridad absoluta. 'Must not' es el modal adecuado para prohibiciones. La opción A es incorrecta porque 'don't have to' indica que es opcional/innecesario. La respuesta correcta es B) 'You must not cross the tracks'."
    },
    {
      situation: "Se te presenta una pregunta sobre vocabulario ferroviario: 'Passengers should wait for the train on the ___.' con las opciones: A) track, B) station master, C) platform, D) switches.",
      application: "Analizando la semántica de la frase: los pasajeros deben esperar al tren en el andén. La palabra en inglés para andén es 'platform'. Esperar en la vía ('track') es peligroso e ilegal; 'switches' son las agujas de desvío; y 'station master' es el jefe de estación. La respuesta correcta es C) 'platform'."
    },
    {
      situation: "Se plantea la frase: 'Did you ___ the new safety regulations last week?' con las opciones: A) read, B) readed, C) wrote, D) did read.",
      application: "Es una pregunta en pasado simple marcada por 'last week' y el auxiliar 'Did'. Como ya se ha utilizado el auxiliar 'Did', el verbo principal debe ir en su forma base de infinitivo. La forma base de leer en inglés es 'read' (pronunciado /riːd/). 'Readed' no existe en inglés (es irregular, se escribe 'read' pero se pronuncia /red/ en pasado). La respuesta correcta es A) 'read'."
    }
  ],

  reviewTakeaways: [
    "Pasado Simple afirmativo: verbos regulares añaden '-ed'; verbos irregulares cambian su forma por completo (go -> went).",
    "Auxiliar 'did' en preguntas y negativas: anula la conjugación en pasado del verbo principal, que vuelve al infinitivo.",
    "Must not (mustn't) = Prohibición absoluta de seguridad; Don't have to = No es necesario (opcional).",
    "Platform = Andén; Track = Vía; Train driver = Maquinista; Switches = Agujas de desvío; Level crossing = Paso a nivel.",
    "Could se utiliza para peticiones corteses en atención al cliente ('Could you help me?') y habilidad pasada.",
    "Lecturas de comprensión: lee primero las preguntas para localizar los datos específicos (horas, andenes, retrasos) en el texto."
  ]
};
