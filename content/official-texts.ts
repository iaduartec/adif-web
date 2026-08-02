export interface OfficialTextSection {
  title: string;
  articles: Array<{
    number: string;
    title: string;
    content: string;
  }>;
}

export const officialTexts: Record<string, OfficialTextSection> = {
  igualdad: {
    title: "Ley Orgánica 3/2007, de 22 de marzo, para la igualdad efectiva de mujeres y hombres",
    articles: [
      {
        number: "Artículo 3",
        title: "El principio de igualdad de trato entre mujeres y hombres",
        content: "El principio de igualdad de trato entre mujeres y hombres supone la ausencia de toda discriminación, directa o indirecta, por razón de sexo, y, especialmente, las derivadas de la maternidad, la asunción de obligaciones familiares y el estado civil."
      },
      {
        number: "Artículo 6",
        title: "Discriminación directa e indirecta",
        content: "1. Se considera discriminación directa por razón de sexo la situación en que se encuentra una persona que sea, haya sido o pudiera ser tratada, en atención a su sexo, de manera menos favorable que otra en situación comparable.\n\n2. Se considera discriminación indirecta por razón de sexo la situación en que una disposición, criterio o práctica aparentemente neutros pone a personas de un sexo en desventaja particular con respecto a personas del otro, salvo que dicha disposición, criterio o práctica puedan justificarse objetivamente con una finalidad legítima y que los medios para alcanzar dicha finalidad sean necesarios y adecuados."
      },
      {
        number: "Artículo 7",
        title: "Acoso sexual y acoso por razón de sexo",
        content: "1. Sin perjuicio de lo establecido en el Código Penal, a los efectos de esta Ley constituye acoso sexual cualquier comportamiento, verbal o físico, de naturaleza sexual que tenga el propósito o produzca el efecto de atentar contra la dignidad de una persona, en particular cuando se crea un entorno intimidatorio, degradante u ofensivo.\n\n2. Constituye acoso por razón de sexo cualquier comportamiento realizado en función del sexo de una persona, con el propósito o el efecto de atentar contra su dignidad y de crear un entorno intimidatorio, degradante u ofensivo.\n\n3. El condicionamiento de un derecho o de una expectativa de derecho a la aceptación de una situación constitutiva de acoso sexual o de acoso por razón de sexo se considerará también acto de discriminación por razón de sexo."
      },
      {
        number: "Artículo 8",
        title: "Discriminación por embarazo o maternidad",
        content: "Constituye discriminación directa por razón de sexo todo trato desfavorable a las mujeres relacionado con el embarazo o la maternidad."
      },
      {
        number: "Artículo 9",
        title: "Indemnidad frente a represalias",
        content: "También se considerará discriminación por razón de sexo cualquier trato adverso o efecto negativo que se produzca en una persona como consecuencia de la presentación por su parte de una queja, reclamación, denuncia, demanda o recurso, de cualquier tipo, destinados a impedir su discriminación y a exigir el cumplimiento efectivo del principio de igualdad de trato entre mujeres y hombres."
      },
      {
        number: "Artículo 11",
        title: "Acciones positivas",
        content: "1. Con el fin de hacer efectivo el derecho constitucional de la igualdad, los Poderes Públicos adoptarán medidas específicas en favor de las mujeres para corregir situaciones patentes de desigualdad de partida de carácter social, económico, educativo y de acceso al empleo.\n\n2. Las personas físicas y jurídicas privadas podrán adoptar medidas de acción positiva en los términos establecidos en esta Ley y en la legislación laboral."
      },
      {
        number: "Artículo 12",
        title: "Tutela judicial efectiva",
        content: "Cualquier persona podrá recabar de los tribunales la tutela del derecho a la igualdad entre mujeres y hombres de acuerdo con lo establecido en el artículo 53.2 de la Constitución, incluso tras la terminación de la relación en la que presuntamente se haya producido la discriminación."
      },
      {
        number: "Artículo 45",
        title: "Elaboración y aplicación de los planes de igualdad",
        content: "1. Las empresas están obligadas a respetar la igualdad de trato y de oportunidades en el ámbito laboral y, con esta finalidad, deberán adoptar medidas dirigidas a evitar cualquier tipo de discriminación laboral entre mujeres y hombres, medidas que deberán negociar, y en su caso acordar, con los representantes legales de los trabajadores.\n\n2. En el caso de las empresas de cincuenta o más trabajadores, las medidas de igualdad a que se refiere el apartado anterior deberán dirigirse a la elaboración y aplicación de un plan de igualdad, con el alcance y contenido establecidos en este capítulo."
      }
    ]
  },
  "prevencion-riesgos-laborales": {
    title: "Ley 31/1995, de 8 de noviembre, de Prevención de Riesgos Laborales",
    articles: [
      {
        number: "Artículo 14",
        title: "Derecho a la protección frente a los riesgos laborales",
        content: "1. Los trabajadores tienen derecho a una protección eficaz en materia de seguridad y salud en el trabajo.\n\n2. En cumplimiento del deber de protección, el empresario garantizará la seguridad y la salud de los trabajadores a su servicio en todos los aspectos relacionados con el trabajo. A estos efectos, en el marco de sus responsabilidades, el empresario realizará la prevención de los riesgos laborales mediante la integración de la actividad preventiva en la empresa y la adopción de cuantas medidas sean necesarias para la protección de la seguridad y la salud de los trabajadores.\n\n3. El empresario responderá del coste de las medidas de seguridad y salud en el trabajo sin que este coste pueda recaer sobre los trabajadores en modo alguno."
      },
      {
        number: "Artículo 15",
        title: "Principios de la acción preventiva",
        content: "1. El empresario aplicará las medidas que integran el deber general de prevención de acuerdo con los siguientes principios generales:\n\na) Evitar los riesgos.\nb) Evaluar los riesgos que no se puedan evitar.\nc) Combatir los riesgos en su origen.\nd) Adaptar el trabajo a la persona, en particular en lo que respecta a la concepción de los puestos de trabajo, así como a la elección de los equipos y los métodos de trabajo y de producción, con miras, en particular, a atenuar el trabajo monótono y repetitivo y a reducir los efectos del mismo en la salud.\ne) Tener en cuenta la evolución de la técnica.\nf) Sustituir lo peligroso por lo que entrañe poco o ningún peligro.\ng) Planificar la prevención, buscando un conjunto coherente que integre en ella la técnica, la organización del trabajo, las condiciones de trabajo, las relaciones sociales y la influencia de los factores ambientales en el trabajo.\nh) Adoptar medidas que antepongan la protección colectiva a la individual.\ni) Dar las debidas instrucciones a los trabajadores."
      },
      {
        number: "Artículo 16",
        title: "Plan de prevención, evaluación de riesgos y planificación de la acción preventiva",
        content: "1. La prevención de riesgos laborales deberá integrarse en el sistema general de gestión de la empresa, tanto en el conjunto de sus actividades como en todos los niveles jerárquicos de la misma, a través de la implantación y aplicación de un plan de prevención de riesgos laborales.\n\n2. Las empresas deberán realizar una evaluación inicial de los riesgos para la seguridad y salud de los trabajadores, teniendo en cuenta, con carácter general, la naturaleza de la actividad, las características de los puestos de trabajo existentes y de los trabajadores que deban desempeñarlos. Esta evaluación será actualizada cuando cambien las condiciones de trabajo y, en todo caso, se someterá a consideración cuando se hayan producido daños para la salud."
      },
      {
        number: "Artículo 21",
        title: "Riesgo grave e inminente",
        content: "1. Cuando los trabajadores estén o puedan estar expuestos a un riesgo grave e inminente con ocasión de su trabajo, el empresario estará obligado a:\n\na) Informar lo antes posible a todos los trabajadores afectados sobre la existencia de dicho riesgo y de las medidas adoptadas o que, en su caso, deban adoptarse en materia de protección.\nb) Adoptar las medidas y dar las instrucciones necesarias para que, en caso de peligro grave, inminente e inevitable, los trabajadores puedan interrumpir su actividad y, si fuera necesario, abandonar de inmediato el lugar de trabajo.\n\n2. El trabajador tendrá derecho a interrumpir su actividad y abandonar el lugar de trabajo, en caso necesario, cuando considere que dicha actividad entraña un riesgo grave e inminente para su vida o su salud."
      },
      {
        number: "Artículo 29",
        title: "Obligaciones de los trabajadores en materia de prevención",
        content: "1. Corresponde a cada trabajador velar, según sus posibilidades y mediante el cumplimiento de las medidas de prevención que en cada caso sean adoptadas, por su propia seguridad y salud en el trabajo y por la de aquellas otras personas a las que pueda afectar su actividad profesional, a causa de sus actos y omisiones en el trabajo, de conformidad con su formación y las instrucciones del empresario.\n\n2. Los trabajadores deberán, en particular: usar adecuadamente las máquinas, herramientas y sustancias; utilizar correctamente los EPIs; no poner fuera de funcionamiento los dispositivos de seguridad; informar de inmediato sobre cualquier situación que entrañe un riesgo para la seguridad; y cooperar con el empresario para garantizar condiciones seguras."
      }
    ]
  },
  "estatuto-adif": {
    title: "Real Decreto 2395/2004, Estatuto de la entidad pública empresarial ADIF",
    articles: [
      {
        number: "Artículo 1",
        title: "Naturaleza y régimen jurídico",
        content: "1. El Administrador de Infraestructuras Ferroviarias (ADIF) es una entidad pública empresarial de las previstas en el artículo 43.1.b) de la Ley 6/1997, de 14 de abril, de Organización y Funcionamiento de la Administración General del Estado, adscrita al Ministerio de Fomento (actualmente Ministerio de Transportes y Movilidad Sostenible).\n\n2. ADIF tiene personalidad jurídica propia, plena capacidad de obrar para el cumplimiento de sus fines, patrimonio propio y administración independiente."
      },
      {
        number: "Artículo 2",
        title: "Objeto y funciones de la entidad",
        content: "ADIF tiene por objeto la administración de las infraestructuras ferroviarias y otras funciones de acuerdo con la Ley del Sector Ferroviario, velando por la seguridad de la circulación y la óptima explotación de la red de transporte ferroviario de su titularidad.\n\nSus funciones específicas incluyen: el mantenimiento y conservación de las vías y catenarias; la gestión de los sistemas de seguridad, bloqueos y enclavamientos; la regulación y control del tráfico ferroviario; y la adjudicación objetiva de surcos y capacidad a los operadores ferroviarios homologados."
      },
      {
        number: "Artículo 13",
        title: "Órganos de gobierno",
        content: "Los órganos de gobierno de ADIF son el Consejo de Administración y el Presidente de la entidad. El Consejo de Administración estará integrado por el Presidente y por un número mínimo de nueve y máximo de diez vocales nombrados por el Ministro de Fomento.\n\nEl Consejo de Administración tiene la competencia de aprobar las cuentas anuales, definir los grandes presupuestos de explotación y proponer las tasas y cánones por uso de vía y estaciones."
      },
      {
        number: "Artículo 14",
        title: "Funciones del Presidente",
        content: "El Presidente de ADIF es nombrado por el Consejo de Ministros. Es el órgano ejecutivo de la entidad, dirige y representa legalmente a ADIF ante cualquier tribunal o institución, ejecuta los acuerdos aprobados por el Consejo de Administración, y ostenta la jefatura superior de todo el personal directivo y operativo de la empresa."
      },
      {
        number: "Artículo 21",
        title: "Régimen patrimonial",
        content: "ADIF tendrá un patrimonio propio, integrado por el conjunto de sus bienes, derechos y obligaciones. La gestión de los bienes adscritos por el Estado se realizará con sujeción a las funciones legalmente atribuidas en materia de administración de infraestructuras ferroviarias. Los bienes de dominio público ferroviario adscritos a ADIF son inalienables, inembargables e imprescriptibles."
      },
      {
        number: "Artículo 23",
        title: "Régimen de personal",
        content: "El personal de ADIF se regirá por el Derecho Laboral común (Estatuto de los Trabajadores y Convenio Colectivo de ADIF), sin perjuicio de las especialidades derivadas de su estatuto. Las funciones que impliquen el ejercicio de potestades públicas administrativas están reservadas a personal bajo estatutos públicos específicos."
      }
    ]
  },
  "ict-rd-346-2011": {
    title: "Real Decreto 346/2011, Reglamento regulador de las Infraestructuras Comunes de Telecomunicaciones (ICT)",
    articles: [
      {
        number: "Artículo 3",
        title: "Concepto de Infraestructura Común de Telecomunicaciones",
        content: "Se entiende por Infraestructura Común de Telecomunicaciones (ICT) en el interior de edificios, las canalizaciones, conductos, recintos técnicos, repartidores y cables necesarios para facilitar el acceso ordenado, seguro y no discriminatorio a los servicios de radiodifusión sonora y televisión, así como a las redes de telecomunicaciones de telefonía y banda ancha (fibra óptica y coaxial)."
      },
      {
        number: "Anexo I - 1",
        title: "Topología y Redes de Acceso",
        content: "1. Red de alimentación: Conecta las redes de los operadores autorizados con la infraestructura del edificio a través del Punto de Interconexión.\n\n2. Red de distribución: Enlaza los equipos principales en el RITI con los derivadores en cada planta.\n\n3. Red de dispersión: Conecta la red de distribución con el Punto de Acceso al Usuario (PAU) en cada una de las viviendas.\n\n4. Red interior de usuario: Conecta las tomas de usuario (BAT) con el PAU en el interior del inmueble."
      },
      {
        number: "Anexo I - 2",
        title: "Recintos Técnicos de Instalación (RITI y RITS)",
        content: "1. RITI (Recinto de Instalaciones de Telecomunicaciones Inferior): Local o armario técnico destinado a albergar los repartidores principales de telefonía y cable, situado en planta baja o sótano. Debe contar con dimensiones mínimas normalizadas (ej. 2m de altura), sistema de ventilación forzada o natural, y estar libre de canalizaciones de agua o gas.\n\n2. RITS (Recinto de Instalaciones de Telecomunicaciones Superior): Local o armario técnico situado en la planta superior o azotea del edificio, destinado a alojar el equipamiento de amplificación, mezcla y captación de señales procedentes de las antenas de televisión terrestre y satélite."
      },
      {
        number: "Anexo I - 3",
        title: "Punto de Acceso al Usuario (PAU) y Bases de Toma (BAT)",
        content: "1. PAU (Punto de Acceso al Usuario): Elemento pasivo de interconexión que delimita la red comunitaria de la red interior de la vivienda. Debe contar con un dispositivo de corte para realizar pruebas de aislamiento.\n\n2. BAT (Bases de Acceso a Terminales): Las tomas de usuario final situadas en las habitaciones (coaxial para TV, RJ45 para telefonía y datos, y tomas de fibra óptica si procede)."
      }
    ]
  },
  "compatibilidad-electromagnetica": {
    title: "Real Decreto 186/2016, de 6 de mayo, sobre compatibilidad electromagnética de equipos",
    articles: [
      {
        number: "Artículo 3",
        title: "Definición de Compatibilidad Electromagnética (CEM)",
        content: "Se define como la aptitud de un equipo eléctrico o electrónico para funcionar de manera satisfactoria en su entorno electromagnético sin introducir perturbaciones electromagnéticas intolerables para otros equipos situados en el mismo entorno."
      },
      {
        number: "Anexo I - 1",
        title: "Fenómenos de acoplamiento e interferencia indeseada",
        content: "1. Emisión: Producción y salida de energía electromagnética desde un equipo al exterior. Puede ser conducida (vía cables de alimentación y señal) o radiada (propagada a través del aire).\n\n2. Inmunidad o Susceptibilidad: Capacidad de un equipo para funcionar de forma adecuada y sin degradación de rendimiento ante la presencia de perturbaciones electromagnéticas en su entorno."
      },
      {
        number: "Anexo I - 2",
        title: "Mecanismos de mitigación y técnicas de blindaje",
        content: "1. Apantallamiento (Shielding): Uso de barreras y carcasas metálicas continuas conectadas a tierra para contener y atenuar los campos magnéticos y eléctricos indeseados (jaulas de Faraday).\n\n2. Filtrado (Filtering): Instalación de filtros en las líneas de corriente y buses de señales para suprimir ruidos conducidos de alta frecuencia.\n\n3. Segregación física de conductores (Separation): Distanciamiento físico mínimo entre canalizaciones de corriente (potencia) y líneas de datos (señales débiles) para evitar inducción mutua."
      },
      {
        number: "Especificación",
        title: "Instalación de Puesta a Tierra y Conexión Equipotencial",
        content: "La puesta a tierra de los equipos de telecomunicaciones de ADIF debe realizarse con conductores de cobre de sección adecuada conectados al anillo de tierra del edificio de comunicaciones, garantizando una baja impedancia en altas frecuencias para derivar eficazmente el ruido electromagnético."
      }
    ]
  },
  "rcf-libro-1": {
    title: "Reglamento de Circulación Ferroviaria (RCF) — Libro Primero: Reglas Generales",
    articles: [
      {
        number: "Regla 1.1",
        title: "Principio de prudencia y seguridad",
        content: "En caso de duda, falta de regulación específica o ante circunstancias imprevistas que puedan comprometer la seguridad de la explotación, el personal del sector ferroviario adoptará siempre la decisión más segura y prudente, primando la seguridad de los viajeros, del personal y de la circulación sobre la rapidez, regularidad u horarios del servicio."
      },
      {
        number: "Regla 1.2",
        title: "Responsabilidad del personal de circulación",
        content: "Todo agente de circulación, conducción o mantenimiento es responsable directo del estricto cumplimiento de las normas de este reglamento durante su jornada de trabajo, debiendo mantener activa su aptitud psicofísica y notificar de inmediato al Puesto de Mando o supervisor cualquier deficiencia u anomalía observada en la infraestructura, señales o vehículos."
      },
      {
        number: "Regla 1.3",
        title: "Documentación oficial obligatoria",
        content: "El personal de conducción deberá llevar en cabina los libros de itinerarios oficiales, las notificaciones de vía vigentes, el horario de servicio de la línea y la documentación técnica de seguridad requerida por el operador ferroviario y el administrador de infraestructura (ADIF)."
      },
      {
        number: "Definición",
        title: "Estación Ferroviaria y Cantón de Vía",
        content: "1. Estación: Infraestructura delimitada por sus señales de entrada, compuesta por vías y agujas de desvío, destinada a regular la marcha de los trenes y realizar operaciones comerciales.\n\n2. Cantón de Vía: Tramo de vía en el que, en condiciones normales, no puede circular simultáneamente más de un tren. Está protegido por señales fijas o sistemas de bloqueo telefónico."
      }
    ]
  },
  psicometria: {
    title: "Guía de Evaluación Psicotécnica y Psicométrica para el Ingreso en ADIF",
    articles: [
      {
        number: "Sección 1",
        title: "Evaluación de la Atención y Resistencia a la Fatiga",
        content: "Se evalúa la precisión y rapidez del aspirante para buscar errores, realizar comparaciones de códigos alfanuméricos largos (ej. comparar series de letras y números determinando si son iguales o diferentes) y detectar discrepancias sutiles bajo límites de tiempo estrictos y fatiga sostenida."
      },
      {
        number: "Sección 2",
        title: "Razonamiento Lógico y Aptitud Espacial",
        content: "Pruebas destinadas a medir la capacidad del opositor para estructurar y conceptualizar formas geométricas en 2D y 3D, incluyendo la resolución de giros espaciales, desdoblamientos de cubos planos, analogías de figuras y progresiones de matrices lógicas."
      },
      {
        number: "Sección 3",
        title: "Aptitud Numérica y Razonamiento Físico",
        content: "Resolución de problemas de cálculo mental rápido, proporciones, porcentajes, reglas de tres aplicadas, y problemas clásicos de física elemental de movimiento relativo (cálculo de velocidades de cruce de trenes, distancias de frenado, aceleraciones)."
      },
      {
        number: "Sección 4",
        title: "Estrategias de Resolución de Exámenes",
        content: "Consejos para optimizar la puntuación: 1) Responder con precisión antes que responder al azar, dado que los fallos penalizan; 2) Realizar una primera pasada resolviendo los ejercicios obvios y rápidos; 3) Mantener un control rígido del tiempo transcurrido por pregunta."
      }
    ]
  },
  "ingles-a2": {
    title: "Guía de Contenidos de Inglés Nivel A2 (MCER) para ADIF",
    articles: [
      {
        number: "Gramática 1",
        title: "Tiempos Verbales del Pasado (Past Simple)",
        content: "1. Verbos regulares: Se forman añadiendo la terminación '-ed' al verbo en infinitivo (ej. work -> worked, check -> checked). Si termina en 'y', cambia a '-ied' (ej. study -> studied).\n\n2. Verbos irregulares: Cambian su forma ortográfica en pasado simple y deben ser memorizados (ej. go -> went, see -> saw, write -> wrote, buy -> bought, break -> broke).\n\n3. Auxiliar de Pasado: En oraciones negativas e interrogativas se utiliza el auxiliar 'did / did not (didn't)' y el verbo principal vuelve a su forma infinitiva base (ej. 'I did not see the signal', 'Did you buy the ticket?')."
      },
      {
        number: "Gramática 2",
        title: "Verbos Modales (Obligación, Prohibición y Habilidad)",
        content: "1. Must: Indica una obligación legal o interna obligatoria (ej. 'You must check the tracks').\n\n2. Must not / Mustn't: Expresa prohibición absoluta de seguridad (ej. 'You must not cross the yellow line').\n\n3. Have to / Has to: Expresa una obligación externa o reglamentaria (ej. 'We have to wear safety helmets').\n\n4. Don't have to: Expresa que algo no es obligatorio, es optativo u opcional (ej. 'You don't have to print the ticket, digital is fine').\n\n5. Can / Could: Habilidad o petición formal (ej. 'Could you help me with the luggage?')."
      },
      {
        number: "Vocabulario",
        title: "Terminología y Glosario Ferroviario",
        content: "1. Platform: Andén de la estación donde los pasajeros esperan e ingresan al tren.\n2. Track: Vía de circulación metálica.\n3. Delay: Retraso en la llegada o salida del tren respecto del horario.\n4. Timetable: Horario de servicio oficial.\n5. Train driver: Maquinista.\n6. Station master: Jefe de estación.\n7. Level crossing: Paso a nivel (intersección de vía ferroviaria y carretera).\n8. Points / Switches: Agujas de desvío de la vía."
      }
    ]
  }
};
