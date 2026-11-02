export interface Flashcard {
  id: string;
  module: string;
  front: string;
  back: string;
}

export const flashcards: readonly Flashcard[] = [
  // G1 Igualdad
  {
    id: "F0001",
    module: "G1 Igualdad",
    front: "¿Qué principio establece el artículo 14 de la Constitución Española?",
    back: "Establece el principio de igualdad ante la ley, por el cual todos los españoles son iguales sin que pueda prevalecer discriminación alguna por nacimiento, raza, sexo, religión, opinión o cualquier otra condición o circunstancia personal o social.",
  },
  {
    id: "F0002",
    module: "G1 Igualdad",
    front: "¿Qué se entiende por 'discriminación indirecta' según la Ley Orgánica 3/2007?",
    back: "La situación en que una disposición, criterio o práctica aparentemente neutros pone a personas de un sexo en desventaja particular respecto de las del otro, salvo que pueda justificarse objetivamente con una finalidad legítima.",
  },
  {
    id: "F0003",
    module: "G1 Igualdad",
    front: "¿Qué es la transversalidad del principio de igualdad de trato?",
    back: "Es la integración sistemática de la perspectiva de género en la actuación de todos los poderes públicos, aplicándola activamente en la definición, presupuestación y ejecución de todas sus políticas.",
  },

  // G2 PRL
  {
    id: "F0004",
    module: "G2 PRL",
    front: "¿Cuáles son los primeros tres principios de la acción preventiva según el artículo 15 de la Ley 31/1995?",
    back: "a) Evitar los riesgos.\nb) Evaluar los riesgos que no se puedan evitar.\nc) Combatir los riesgos en su origen. El artículo 15 enumera nueve principios en total, que continúan con adaptar el trabajo a la persona, tener en cuenta la evolución de la técnica, sustituir lo peligroso, planificar la prevención, anteponer la protección colectiva a la individual y dar las debidas instrucciones a los trabajadores.",
  },
  {
    id: "F0005",
    module: "G2 PRL",
    front: "¿Quién tiene la obligación de garantizar la seguridad y salud laboral de los trabajadores?",
    back: "El empresario tiene el deber de protección y debe garantizar la seguridad y salud laboral en todos los aspectos relacionados con el trabajo mediante la integración de la prevención en la empresa.",
  },
  {
    id: "F0006",
    module: "G2 PRL",
    front: "¿Qué diferencia hay entre EPI y protección colectiva?",
    back: "La protección colectiva protege a varios trabajadores simultáneamente (ej. barandillas, redes) y debe priorizarse por ley frente a los Equipos de Protección Individual (EPI), que solo protegen a un usuario particular.",
  },

  // G3 Estatuto ADIF
  {
    id: "F0007",
    module: "G3 Estatuto ADIF",
    front: "¿Qué es ADIF y cuál es su adscripción ministerial?",
    back: "ADIF es una entidad pública empresarial con personalidad jurídica propia, plena capacidad de obrar y patrimonio propio, adscrita en su Estatuto (RD 2395/2004) al Ministerio de Fomento (actualmente Ministerio de Transportes y Movilidad Sostenible).",
  },
  {
    id: "F0008",
    module: "G3 Estatuto ADIF",
    front: "¿Qué competencias tiene ADIF respecto al personal a su servicio?",
    back: "El personal de ADIF se rige por el derecho laboral, el Estatuto de los Trabajadores y los convenios colectivos aplicables. Los funcionarios adscritos al antiguo Gestor de Infraestructuras Ferroviarias tuvieron un derecho de opción para integrarse en la plantilla del personal laboral de ADIF, con reconocimiento de antigüedad.",
  },
  {
    id: "F0009",
    module: "G3 Estatuto ADIF",
    front: "¿Cuál es el objeto de ADIF según el RD 2395/2004?",
    back: "La administración de las infraestructuras ferroviarias y su construcción cuando le sea encomendada, así como la gestión de los servicios de regulación y seguridad del tráfico.",
  },

  // E1 ICT
  {
    id: "F0010",
    module: "E1 ICT RD 346/2011",
    front: "¿Qué bandas de frecuencia regula la ICT para la televisión y radio?",
    back: "Regula las bandas terrestres (VHF y UHF) y los servicios de radiodifusión y televisión por satélite (en banda Ku), garantizando la distribución de la señal hasta los hogares.",
  },
  {
    id: "F0011",
    module: "E1 ICT RD 346/2011",
    front: "¿Qué es el RITI y qué significan sus siglas?",
    back: "Recinto de Instalaciones de Telecomunicación Inferior. Espacio cerrado destinado a albergar los equipos y terminaciones de red en la parte inferior del edificio.",
  },
  {
    id: "F0012",
    module: "E1 ICT RD 346/2011",
    front: "¿Qué es el Punto de Interconexión en una red ICT?",
    back: "Es el límite físico que separa la red de alimentación del operador de la red de distribución del edificio, ubicado normalmente dentro del RITI o del RITS.",
  },

  // E2 CEM
  {
    id: "F0013",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿Qué diferencia hay entre 'emisión' e 'inmunidad' electromagnética?",
    back: "La emisión es la liberación de energía electromagnética por parte de un dispositivo, mientras que la inmunidad es la capacidad del dispositivo para funcionar sin degradarse ante perturbaciones externas.",
  },
  {
    id: "F0014",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿Qué significa el marcado CE en los aparatos sujetos al RD 186/2016?",
    back: "El fabricante indica mediante el marcado CE que el aparato es conforme con la legislación de armonización de la Unión aplicable que prevé su colocación. Véanse el RD 186/2016, artículos 3.x, 7.2, 16 y 17, y su preámbulo sobre la transposición de la Directiva 2014/30/UE.",
  },
  {
    id: "F0015",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿Cuáles son los componentes del 'entorno electromagnético' típico?",
    back: "Fenómenos de radiación (ondas de radio, wifi), transitorios conducidos (ruido eléctrico en cables), descargas electrostáticas (ESD) y campos magnéticos industriales.",
  },

  // E3 RCF
  {
    id: "F0016",
    module: "E3 RCF Libro 1",
    front: "¿Qué define el Reglamento de Circulación Ferroviaria como 'Vía Libre'?",
    back: "Es la indicación de una señal luminosa o mecánica (aspecto verde) que autoriza al maquinista a circular a la velocidad máxima establecida para el tramo sin restricciones inmediatas. Es un concepto de señalización del RCF complementario al estudio del Libro Primero.",
  },
  {
    id: "F0017",
    module: "E3 RCF Libro 1",
    front: "¿Qué significa el concepto de 'cantón de bloqueo' en circulación ferroviaria?",
    back: "Tramo de vía en el que, en condiciones normales de circulación, no puede haber más de un tren de forma simultánea, garantizando el espaciamiento seguro entre convoyes. Su extensión depende del sistema de bloqueo (BT, BLA, BA o BSL).",
  },
  {
    id: "F0018",
    module: "E3 RCF Libro 1",
    front: "¿Qué es un 'puesto de mando' según las definiciones del Libro Primero?",
    back: "Centro específico del Administrador de Infraestructuras (AI) encargado de la gestión y regulación del tráfico ferroviario en tiempo real.",
  },

  // P Psicotecnicos
  {
    id: "F0019",
    module: "P Psicotecnicos",
    front: "¿Cuál es la regla clave ante preguntas difíciles en un examen psicotécnico de tiempo limitado?",
    back: "Omitirla temporalmente para no consumir tiempo excesivo. Es preferible asegurar las respuestas fáciles del resto de la prueba y volver a las complejas al final.",
  },
  {
    id: "F0020",
    module: "P Psicotecnicos",
    front: "¿Qué evalúan principalmente las pruebas de 'razonamiento abstracto'?",
    back: "La capacidad de identificar patrones lógicos, secuencias de figuras, analogías visuales y reglas operativas sin dependencia del lenguaje verbal o numérico.",
  },
  {
    id: "F0021",
    module: "P Psicotecnicos",
    front: "¿Qué mide la prueba de 'atención y fatiga' (como el test d2)?",
    back: "La concentración visual sostenida, la velocidad de procesamiento de estímulos y la precisión frente a distracciones tipográficas repetitivas.",
  },

  // I Ingles A2
  {
    id: "F0022",
    module: "I Ingles A2",
    front: "¿Cuándo se utiliza el 'Present Perfect Simple' frente al 'Past Simple'?",
    back: "El 'Present Perfect' se usa para acciones pasadas con relevancia en el presente o sin especificar tiempo (ej: 'I have visited Madrid'). El 'Past Simple' exige un tiempo finalizado (ej: 'I visited Madrid yesterday').",
  },
  {
    id: "F0023",
    module: "I Ingles A2",
    front: "¿Cómo se forman las oraciones comparativas y superlativas de adjetivos cortos?",
    back: "Comparativo: añadiendo el sufijo '-er' (ej: 'taller than'). Superlativo: anteponiendo 'the' y añadiendo el sufijo '-est' (ej: 'the tallest').",
  },
  {
    id: "F0024",
    module: "I Ingles A2",
    front: "¿Qué diferencia gramatical existe entre 'must' y 'have to'?",
    back: "'Must' suele expresar una obligación interna o personal impuesta por el hablante, mientras que 'have to' denota una obligación externa impuesta por normas o circunstancias de la situación.",
  },
  // G2 PRL — capítulo I (arts. 1–4), BOE-A-1995-24292
  {
    id: "F0025",
    module: "G2 PRL",
    front: "Según el artículo 1 de la LPRL, ¿qué integra la normativa sobre prevención de riesgos laborales?",
    back: "La Ley 31/1995, sus disposiciones de desarrollo o complementarias y otras normas legales o convencionales con prescripciones sobre medidas preventivas en el ámbito laboral o susceptibles de producirlas.",
  },
  {
    id: "F0026",
    module: "G2 PRL",
    front: "¿Cuál es la finalidad de la Ley 31/1995 según su artículo 2.1?",
    back: "Promover la seguridad y la salud mediante medidas y actividades para prevenir riesgos derivados del trabajo; establece principios para proteger, eliminar o reducir riesgos y articular información, consulta, participación equilibrada y formación.",
  },
  {
    id: "F0027",
    module: "G2 PRL",
    front: "¿Puede un convenio colectivo rebajar el mínimo laboral preventivo del artículo 2.2?",
    back: "No. Es un mínimo de derecho necesario indisponible. La negociación colectiva puede mejorarlo y desarrollarlo.",
  },
  {
    id: "F0028",
    module: "G2 PRL",
    front: "¿Qué relaciones incluye el ámbito general del artículo 3.1 de la LPRL?",
    back: "Relaciones laborales y administrativas o estatutarias del personal al servicio de las Administraciones públicas, con las peculiaridades legales; también contempla obligaciones de fabricantes, importadores y suministradores, trabajo autónomo y cooperativas con personas socias que trabajen personalmente.",
  },
  {
    id: "F0029",
    module: "G2 PRL",
    front: "¿Cuándo se aplican las exclusiones funcionales del artículo 3.2?",
    back: "Solo a actividades de funciones públicas cuyas particularidades impidan aplicar la Ley: policía, seguridad y resguardo aduanero; servicios operativos de protección civil y peritaje forense en casos de grave riesgo, catástrofe o calamidad; Fuerzas Armadas y actividades militares de la Guardia Civil. La Ley inspira la normativa específica protectora.",
  },
  {
    id: "F0030",
    module: "G2 PRL",
    front: "Según el artículo 4, ¿qué diferencia hay entre riesgo laboral y daño derivado del trabajo?",
    back: "Riesgo laboral es la posibilidad de sufrir un daño derivado del trabajo; el daño es la enfermedad, patología o lesión efectivamente sufrida con motivo u ocasión del trabajo. La gravedad del riesgo valora probabilidad y severidad conjuntamente.",
  },
  {
    id: "F0031",
    module: "G2 PRL",
    front: "¿Qué caracteriza el riesgo laboral grave e inminente del artículo 4.4?",
    back: "Que resulte racionalmente probable que se materialice en un futuro inmediato y pueda causar un daño grave a la salud. Si se trata de agentes capaces de causar daños graves, puede existir aunque el daño no se manifieste de inmediato.",
  },
  {
    id: "F0032",
    module: "G2 PRL",
    front: "¿Qué incluye el artículo 4 en «condición de trabajo», «equipo de trabajo» y «EPI»?",
    back: "Condición de trabajo: característica que influye significativamente en la generación de riesgos, incluidos locales, agentes, equipos, procedimientos y organización. Equipo de trabajo: máquina, aparato, instrumento o instalación utilizada en el trabajo. EPI: equipo llevado o sujetado para proteger de riesgos, incluidos complementos y accesorios.",
  },
  {
    id: "F0033",
    module: "RCF Libro 1",
    front: "¿Qué obligación tiene el personal que recibe una modificación de su documentación de seguridad a título personal?",
    back: "Debe acusar recibo y acreditar conocimiento de su contenido conforme a lo establecido en el sistema de gestión de la seguridad (SGS) de su empresa. Fuente: RD 664/2015, Libro Primero, Capítulo 3, apartado 1.3.1.1.3 (BOE consolidado 12/07/2023).",
  },
  {
    id: "F0034",
    module: "RCF Libro 1",
    front: "¿Qué establece el RCF sobre los útiles de servicio?",
    back: "Los colectivos de personal que intervienen en la circulación reciben de su administrador de infraestructuras o empresa ferroviaria, a título individual, los útiles de servicio necesarios para desarrollar su función. Fuente: RD 664/2015, Libro Primero, Capítulo 3, apartado 1.3.1.2.1 (BOE consolidado 12/07/2023).",
  },
];
