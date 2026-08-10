import type { TheorySection } from "../lesson-theory";

export const prlTheory: TheorySection = {
  introduction: `La Ley 31/1995, de 8 de noviembre, de Prevención de Riesgos Laborales (LPRL) transpone al ordenamiento español la Directiva Marco 89/391/CEE y establece el marco legal básico de la seguridad y salud en el trabajo. Su objetivo es garantizar que ningún trabajador pierda la vida, sufra lesiones o enfermedades por causa u ocasión del trabajo, imponiendo al empresario un deber de protección que tiene naturaleza de obligación de resultado, no meramente de medios.

En el entorno operativo de ADIF, los riesgos laborales son especialmente graves: trabajos en vía ferroviaria con circulación activa de trenes, exposición a alta tensión eléctrica en catenarias y subestaciones, trabajos en altura en estructuras ferroviarias, confinamiento en recintos técnicos sin ventilación suficiente, y manejo de maquinaria pesada de infraestructura. El personal técnico de telecomunicaciones se expone además a radiaciones no ionizantes de antenas y equipos de radiocomunicación, así como a riesgos ergonómicos propios del trabajo en campo.

La LPRL se estructura sobre tres pilares: la evaluación de riesgos como instrumento básico (Art. 16), los derechos y obligaciones de empresario y trabajador (Arts. 14 a 29), y la organización de la prevención mediante los distintos modos de gestión (servicio de prevención propio, ajeno o mancomunado). La ley desarrolló el Reglamento de los Servicios de Prevención (RSP), aprobado por el Real Decreto 39/1997, que concreta los requisitos de las entidades especializadas y los criterios de organización de la prevención en las empresas.`,

  concepts: [
    {
      title: "Deber de Protección del Empresario (Art. 14)",
      description: "El empresario tiene el deber legal de garantizar la seguridad y la salud de sus trabajadores en todos los aspectos relacionados con el trabajo. Este deber incluye: la adopción de cuantas medidas sean necesarias para la protección de la seguridad y salud, las actividades de prevención, información, formación, consulta, participación y vigilancia de la salud. Es una obligación de resultado: no basta con intentar proteger, hay que conseguirlo. El empresario también debe cumplir sus obligaciones aunque contrate trabajadores de empresas externas (coordinación de actividades empresariales, Art. 24)."
    },
    {
      title: "Principios de la Acción Preventiva (Art. 15)",
      description: "Son los principios generales aplicables al diseño de cualquier medida preventiva, en orden de prioridad obligatoria: (1) Evitar los riesgos; (2) Evaluar los que no puedan evitarse; (3) Combatir los riesgos en su origen; (4) Adaptar el trabajo a la persona (ergonomía); (5) Tener en cuenta la evolución técnica; (6) Sustituir lo peligroso por lo menos peligroso; (7) Planificar la prevención con un conjunto coherente; (8) Anteponer la protección colectiva a la individual; (9) Dar las debidas instrucciones a los trabajadores. El orden importa: la eliminación es siempre preferible a la protección."
    },
    {
      title: "Evaluación de Riesgos (Art. 16.1 y 16.2)",
      description: "Instrumento básico y previo a cualquier medida preventiva. Consiste en identificar los peligros existentes en cada puesto de trabajo, estimar la probabilidad y gravedad de cada daño y determinar si las medidas existentes son suficientes. Debe realizarse por personal con formación preventiva adecuada, con consulta a los Delegados de Prevención, y debe revisarse cuando cambien las condiciones de trabajo, cuando se produzca un daño, o cuando las medidas existentes se revelen insuficientes. La evaluación inicial debe hacerse antes de que el trabajador comience a desempeñar el puesto."
    },
    {
      title: "Planificación de la Actividad Preventiva (Art. 16.2.b)",
      description: "Cuando el resultado de la evaluación revele que las medidas existentes no son suficientes, el empresario debe elaborar un Plan de Prevención que recoja: las medidas correctoras a adoptar, el plazo para hacerlo, la persona o servicio responsable de su ejecución y los recursos materiales y humanos necesarios. La planificación debe estar documentada, ser coherente con los resultados de la evaluación y cubrir un período de tiempo determinado. Forma parte obligatoria del sistema de gestión de la prevención de la empresa."
    },
    {
      title: "Información a los Trabajadores (Art. 18)",
      description: "El empresario debe proporcionar a cada trabajador información sobre: (1) los riesgos específicos de su puesto de trabajo, (2) las medidas de prevención y protección aplicables, (3) las medidas adoptadas en materia de primeros auxilios, lucha contra incendios y evacuación. La información debe darse directamente al trabajador, sin intermediarios, de forma comprensible y adaptada a sus características (idioma, nivel de instrucción). No basta con entregar documentos; el empresario debe asegurarse de que la información ha sido recibida y comprendida."
    },
    {
      title: "Formación de los Trabajadores (Art. 19)",
      description: "El empresario debe garantizar que cada trabajador recibe una formación teórica y práctica, suficiente y adecuada, en materia preventiva, tanto en el momento de su contratación como cuando cambie de puesto o función, o se introduzcan nuevas tecnologías o cambios en los equipos de trabajo. La formación debe estar centrada en el puesto concreto y los riesgos específicos de la función. Debe impartirse dentro de la jornada de trabajo o, si no es posible, descontarse de la misma. Su coste no puede recaer en los trabajadores."
    },
    {
      title: "Actuación ante Situaciones de Emergencia (Art. 20)",
      description: "El empresario debe analizar las posibles situaciones de emergencia y adoptar las medidas necesarias en materia de primeros auxilios, lucha contra incendios y evacuación. Para ello designará al personal encargado de poner en práctica estas medidas (personal de emergencias), que debe tener la formación necesaria, ser suficiente en número y disponer del material adecuado. Las medidas de emergencia deben estar coordinadas con los servicios externos (bomberos, urgencias sanitarias) y adaptadas al tamaño de la empresa y a los riesgos presentes."
    },
    {
      title: "Derecho de Paralización ante Riesgo Grave e Inminente (Art. 21)",
      description: "Cuando el trabajador esté o pueda estar expuesto a un riesgo grave e inminente (que sea probable racionalmente que se materialice en un futuro inmediato y pueda suponer un daño grave para la salud), tiene derecho a interrumpir su actividad y, si es necesario, abandonar de inmediato el lugar de trabajo. El trabajador no podrá sufrir perjuicio alguno por ejercer este derecho. Los Delegados de Prevención también pueden acordar la paralización (con comunicación inmediata al empresario) cuando el Comité de Seguridad y Salud no pueda reunirse de urgencia. El empresario debe comunicar la paralización a la autoridad laboral en 24 horas salvo fuerza mayor."
    },
    {
      title: "Vigilancia de la Salud (Art. 22)",
      description: "El empresario garantizará a los trabajadores la vigilancia periódica de su estado de salud en función de los riesgos inherentes al trabajo. Esta vigilancia será voluntaria para el trabajador, salvo en tres supuestos excepcionales: cuando el reconocimiento sea imprescindible para evaluar los efectos de las condiciones de trabajo sobre la salud, para verificar si el estado de salud del trabajador puede constituir un peligro para él mismo o para terceros, o cuando así lo establezca una disposición legal. Los resultados de la vigilancia deben comunicarse a los trabajadores y son confidenciales para el empresario, que solo conoce las conclusiones sobre aptitud para el puesto."
    },
    {
      title: "Documentación obligatoria (Art. 23)",
      description: "El empresario debe elaborar y conservar a disposición de la autoridad laboral la siguiente documentación: (a) Plan de prevención de riesgos laborales; (b) Evaluación de los riesgos para la seguridad y la salud en el trabajo; (c) Planificación de la actividad preventiva; (d) Práctica de los controles del estado de salud de los trabajadores y conclusiones obtenidas; (e) Relación de accidentes de trabajo y enfermedades profesionales que hayan causado al trabajador una incapacidad laboral superior a un día de trabajo. Los daños sufridos deben notificarse a la autoridad laboral."
    },
    {
      title: "Obligaciones de los Trabajadores (Art. 29)",
      description: "Los trabajadores tienen las siguientes obligaciones: (1) Usar adecuadamente los equipos de trabajo, los medios de protección y los dispositivos de seguridad; (2) No poner fuera de funcionamiento ni usar de forma incorrecta los dispositivos de seguridad; (3) Informar de inmediato a su superior y a los Delegados de Prevención de cualquier situación que, a su juicio, entrañe riesgo para su seguridad o la de terceros; (4) Contribuir al cumplimiento de las obligaciones en materia de seguridad; (5) Cooperar con el empresario para que éste pueda garantizar condiciones de trabajo seguras. El incumplimiento por parte del trabajador tiene la consideración de incumplimiento laboral."
    },
    {
      title: "Equipos de Protección Individual (EPI) — RD 773/1997",
      description: "Cualquier equipo destinado a ser llevado o sujetado por el trabajador para que le proteja de uno o varios riesgos que puedan amenazar su seguridad o su salud en el trabajo. Los EPI son la última barrera de protección: solo deben usarse cuando los riesgos no pueden eliminarse ni controlarse suficientemente por medios técnicos o colectivos. El empresario debe suministrarlos gratuitamente, asegurar su funcionamiento correcto y sustituirlos cuando sea necesario. Los trabajadores deben utilizarlos correctamente y cuidarlos; su uso inadecuado es un incumplimiento laboral grave."
    },
    {
      title: "Delegados de Prevención (Arts. 35 a 37)",
      description: "Son los representantes de los trabajadores con funciones específicas en materia de prevención de riesgos laborales. Se designan por y entre los representantes del personal. El número de Delegados de Prevención depende del tamaño de la plantilla: en empresas de 6 a 49 trabajadores, 1 Delegado; de 50 a 100, 2; de 101 a 500, 3; de 501 a 1.000, 4; de 1.001 a 2.000, 5; de 2.001 a 3.000, 6; de 3.001 a 4.000, 7; y de 4.001 en adelante, 8. Sus competencias incluyen: colaborar con la dirección, promover la cooperación de los trabajadores, ser consultados, ejercer vigilancia y acompañar a los Inspectores de Trabajo."
    },
    {
      title: "Comité de Seguridad y Salud (Arts. 38 y 39)",
      description: "Órgano paritario y colegiado de participación destinado a la consulta regular y periódica de las actuaciones de la empresa en materia de prevención de riesgos. Es obligatorio en empresas o centros de trabajo con 50 o más trabajadores. Está formado, de forma paritaria, por los Delegados de Prevención de una parte, y por el empresario y/o sus representantes de la otra, en igual número. El Comité se reúne trimestralmente y siempre que lo solicite alguna de sus representaciones. Sus decisiones no tienen carácter ejecutivo: es un órgano consultivo y de participación."
    },
    {
      title: "Servicios de Prevención (Arts. 30 a 32 y RD 39/1997)",
      description: "El empresario puede organizar la prevención mediante: (a) asunción personal (solo en empresas de hasta 10 trabajadores, o hasta 25 si hay un único centro y el empresario trabaja habitualmente en él); (b) designación de trabajadores (deben tener formación preventiva y disponer de tiempo y medios); (c) servicio de prevención propio (obligatorio en empresas de más de 500 trabajadores, o de más de 250 en actividades peligrosas, o cuando así lo decida la autoridad laboral); (d) servicio de prevención ajeno (entidad especializada acreditada); (e) mancomunado (para grupos de empresas o empresas del mismo sector). Los servicios de prevención ajenos deben estar acreditados por la autoridad laboral."
    },
    {
      title: "Coordinación de Actividades Empresariales (Art. 24 y RD 171/2004)",
      description: "Cuando en un mismo centro de trabajo desarrollen actividades trabajadores de dos o más empresas, estas deberán cooperar en la aplicación de la normativa de prevención. El empresario titular del centro deberá informar e instruir a los contratistas sobre los riesgos propios del centro y las medidas de protección. El empresario principal (quien contrata) debe vigilar que los contratistas cumplen la normativa de prevención y, en caso de incumplimiento, puede responder solidariamente. Esta obligación es especialmente relevante en ADIF, donde múltiples empresas concurren en las obras de infraestructura ferroviaria."
    }
  ],

  examples: [
    {
      situation: "Un técnico de telecomunicaciones de ADIF debe sustituir un equipo de radiocomunicación ubicado en la cima de un mástil de 20 metros de altura. La empresa le facilita un arnés anticaídas pero el andamio de acceso no tiene barandillas perimetrales.",
      application: "Violación del principio de prelación de medidas preventivas (Art. 15.1.h): la barandilla del andamio es una medida de protección colectiva que debe estar instalada con carácter previo y prioritario sobre el EPI individual (arnés). El trabajador tiene derecho a no iniciar el trabajo hasta que se instalen las barandillas, sin que ello pueda suponerle perjuicio alguno. Si la situación generase un riesgo grave e inminente, tiene derecho a paralizar la actividad (Art. 21)."
    },
    {
      situation: "Durante una operación de mantenimiento nocturno de señalización ferroviaria, un operario detecta que la zona de trabajo está demasiado cerca de la catenaria electrificada a 25 kV y que no se ha realizado la descarga previa del sistema. El supervisor le ordena continuar.",
      application: "Riesgo grave e inminente (electrocución por contacto con alta tensión). El trabajador puede y debe paralizar la actividad y alejarse de inmediato (Art. 21.1), sin que el empresario pueda sancionarle por ello. La orden del supervisor es ilegal y no debe obedecerse. Los Delegados de Prevención pueden acordar también la paralización si el Comité no puede reunirse de urgencia. El empresario debe comunicar la paralización a la autoridad laboral en el plazo de 24 horas."
    },
    {
      situation: "La evaluación de riesgos de una empresa de mantenimiento ferroviaria se realizó hace 5 años y no se ha actualizado, pese a que se han incorporado nuevas herramientas eléctricas de corte de carril y se han modificado los turnos de trabajo incluyendo trabajo nocturno.",
      application: "La evaluación de riesgos debe revisarse cuando cambien las condiciones de trabajo (Art. 16.2.a): la introducción de nuevas herramientas y la modificación de turnos son cambios sustanciales que obligan a revisar y actualizar la evaluación. El incumplimiento es una infracción grave de la LPRL (Art. 47), con multas de hasta 40.985 euros. Los Delegados de Prevención pueden exigir la revisión y la autoridad laboral puede ordenarla de oficio."
    },
    {
      situation: "Una empresa contrata a una trabajadora de ETT para un puesto de soldadora en infraestructura ferroviaria durante 3 meses. La empresa usuaria (ADIF) no le proporciona información sobre los riesgos del puesto ni le entrega los EPI necesarios, argumentando que 'eso es responsabilidad de la ETT'.",
      application: "Ambas empresas (ETT y usuaria) tienen obligaciones preventivas complementarias, pero la empresa usuaria es responsable de las condiciones de seguridad en el puesto de trabajo (Art. 28.5 LPRL): debe proporcionar información sobre los riesgos del puesto, los EPI necesarios y la formación específica para el trabajo que va a realizar. La ETT es responsable de la formación genérica y el reconocimiento médico. El incumplimiento de la empresa usuaria es sancionable independientemente de lo que haga la ETT."
    },
    {
      situation: "Un trabajador de ADIF realiza un trabajo en recinto confinado (cámara de canalización subterránea) sin que se haya realizado el correspondiente análisis de atmósfera ni se disponga de equipo de rescate en el exterior. Alega que 'siempre se ha hecho así'.",
      application: "El trabajo en recintos confinados es de los de mayor riesgo de muerte (asfixia por deficiencia de oxígeno, intoxicación por gases). Es obligatorio: (1) realizar análisis de la atmósfera interior antes de entrar; (2) mantener vigilancia permanente desde el exterior; (3) disponer de equipo de rescate listo para usar; (4) obtener el permiso de trabajo en espacio confinado firmado. La costumbre ('siempre se ha hecho así') no exime de responsabilidad penal en caso de accidente, pues la empresa incumple la obligación de evaluar y controlar el riesgo (Arts. 14 y 16)."
    }
  ],

  reviewTakeaways: [
    "Orden de prelación preventiva (Art. 15): Eliminar > Evaluar > Combatir en origen > Adaptar trabajo > Evolución técnica > Sustituir > Planificar > Colectiva > Individual > Instrucciones.",
    "Riesgo GRAVE e INMINENTE (Art. 21): el trabajador PUEDE abandonar el puesto sin sufrir perjuicio. Los Delegados de Prevención TAMBIÉN pueden acordar la paralización.",
    "Vigilancia de la salud (Art. 22): es VOLUNTARIA para el trabajador, salvo tres excepciones (riesgo para terceros, efectos de las condiciones de trabajo, disposición legal expresa).",
    "Comité de Seguridad y Salud: obligatorio con 50 o más trabajadores → reuniones TRIMESTRALES → ÓRGANO CONSULTIVO (no ejecutivo).",
    "EPI = ÚLTIMA barrera: siempre DESPUÉS de las medidas colectivas y técnicas. Su coste NUNCA recae sobre el trabajador.",
    "Delegados de Prevención: de 6-49 trabajadores → 1; 50-100 → 2; 101-500 → 3 (escala ascendente hasta 8 para más de 4.000).",
    "Formación en prevención: impartida dentro de la jornada (o descontada de ella) + gratuita + centrada en el puesto concreto + obligatoria al cambio de puesto o función.",
    "Coordinación de actividades (Art. 24): el empresario PRINCIPAL vigila que los contratistas cumplen la normativa → responsabilidad solidaria en caso de incumplimiento.",
    "Documentación obligatoria (Art. 23): Plan de prevención + Evaluación de riesgos + Planificación + Registros de vigilancia de la salud + Relación de accidentes con IT > 1 día.",
    "Los accidentes de trabajo que causan incapacidad superior a 1 día deben notificarse a la autoridad laboral; si el accidente es grave, muy grave o mortal, la notificación es urgente (24h)."
  ]
};
