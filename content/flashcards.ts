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
  {
    id: "ict-fc-4",
    module: "E1 ICT RD 346/2011",
    front: "¿Cuándo es obligatoria la ICT según el RD 346/2011?",
    back: "Es obligatoria en edificios de nueva planta que requieran licencia de obra y en rehabilitaciones integrales cuando el presupuesto supere el 50% del valor de la edificación.",
  },
  {
    id: "ict-fc-5",
    module: "E1 ICT RD 346/2011",
    front: "¿Qué diferencia al RITI del RITS?",
    back: "El RITI (Recinto Inferior) alberga el punto de interconexión de las redes de telefonía y banda ancha por cable. El RITS (Recinto Superior) aloja los equipos de captación de señales radioeléctricas (antenas RTV) y de enlace.",
  },
  {
    id: "ict-fc-6",
    module: "E1 ICT RD 346/2011",
    front: "¿Cuáles son los requisitos para usar un RITU en lugar de RITI + RITS?",
    back: "El edificio debe tener como máximo tres alturas más planta baja y un máximo de 16 Puntos de Acceso al Usuario (PAU).",
  },
  {
    id: "ict-fc-7",
    module: "E1 ICT RD 346/2011",
    front: "¿Cuál es el orden correcto de las redes ICT desde el operador hasta el usuario?",
    back: "1. Red de alimentación (del operador al RITI) → 2. Red de distribución (RITI a registros de planta) → 3. Red de dispersión (registro de planta al PAU) → 4. Red interior de usuario (PAU a las BAT).",
  },
  {
    id: "ict-fc-8",
    module: "E1 ICT RD 346/2011",
    front: "¿Qué función tiene el PAU (Punto de Acceso al Usuario)?",
    back: "El PAU es el límite técnico y jurídico que separa la red de dispersión (propiedad común del edificio) de la red interior de usuario (responsabilidad del propietario de la vivienda o local).",
  },
  {
    id: "ict-fc-9",
    module: "E1 ICT RD 346/2011",
    front: "¿Qué conector usa el PAU de pares trenzados? ¿Y la BAT de fibra óptica?",
    back: "PAU de pares trenzados: roseta hembra RJ45 de 8 vías. BAT de fibra óptica: adaptador tipo SC/APC.",
  },
  {
    id: "ict-fc-10",
    module: "E1 ICT RD 346/2011",
    front: "¿Cuál es la impedancia característica de los cables coaxiales de la ICT?",
    back: "75 Ω (con tolerancia de ±3 Ω para los cables de acometida exterior que operan entre 5 MHz y 3 GHz).",
  },
  {
    id: "ict-fc-11",
    module: "E1 ICT RD 346/2011",
    front: "¿Qué banda de frecuencias usa la distribución de señales RTV en la ICT?",
    back: "De 5 MHz a 2.150 MHz, lo que permite distribuir TDT terrestre, DAB y señales de satélite en banda de frecuencia intermedia (FI) de forma transparente.",
  },
  {
    id: "ict-fc-12",
    module: "E1 ICT RD 346/2011",
    front: "¿En qué banda trabaja la TDT (televisión digital terrestre) en la ICT?",
    back: "En la banda UHF, entre 470 y 790 MHz.",
  },
  {
    id: "ict-fc-13",
    module: "E1 ICT RD 346/2011",
    front: "¿Para qué sirve el protocolo DiSEqC en la ICT?",
    back: "Permite controlar desde el receptor hasta cuatro posiciones de satélite distintas, conmutando los cabezales LNB mediante señales de control sobre el propio cable coaxial de FI.",
  },
  {
    id: "ict-fc-14",
    module: "E1 ICT RD 346/2011",
    front: "¿Cuáles son los niveles de señal exigidos en la toma de usuario para TDT y satélite?",
    back: "Entre 47 y 77 dBμV para TDT (señal digital terrestre) y para señal de satélite en FI. Para FM analógica, el mínimo es 40 dBμV.",
  },
  {
    id: "ict-fc-15",
    module: "E1 ICT RD 346/2011",
    front: "¿Qué categoría mínima exige la ICT para los cables de pares trenzados de la red de distribución?",
    back: "Categoría 6 (conforme a UNE-EN 50288) para la red de distribución. La red de dispersión admite categoría 5e como mínimo.",
  },
  {
    id: "ict-fc-16",
    module: "E1 ICT RD 346/2011",
    front: "¿Qué separación mínima debe haber entre canalizaciones ICT y canalizaciones eléctricas de baja tensión?",
    back: "10 cm cuando discurren en paralelo y 3 cm cuando se cruzan.",
  },
  {
    id: "ict-fc-17",
    module: "E1 ICT RD 346/2011",
    front: "¿Cómo se conectan a tierra los mástiles de antena de la ICT?",
    back: "Mediante un cable de sección mínima de 25 mm², por el camino más corto posible, hasta la toma de tierra del edificio.",
  },
  {
    id: "ict-fc-18",
    module: "E1 ICT RD 346/2011",
    front: "¿A qué distancia máxima del punto de entrada al recinto deben conectarse a tierra los cables exteriores con portadores metálicos?",
    back: "A no más de 2 metros del punto de entrada al recinto, para reducir el riesgo de sobretensión.",
  },
  {
    id: "ict-fc-19",
    module: "E1 ICT RD 346/2011",
    front: "¿Qué obligación tiene el promotor en relación con el Proyecto Técnico ICT?",
    back: "Debe presentar el Proyecto Técnico ante la jefatura provincial de inspección de telecomunicaciones ANTES de solicitar la licencia de obras.",
  },
  {
    id: "ict-fc-20",
    module: "E1 ICT RD 346/2011",
    front: "¿Qué es el BITE (Boletín de Instalación de Telecomunicaciones en Edificios)?",
    back: "Es el documento emitido por el instalador al finalizar la ICT, que certifica que la instalación se ha ejecutado conforme al proyecto y a las normas técnicas aplicables. Es necesario para obtener la licencia de primera ocupación.",
  },
  {
    id: "ict-fc-21",
    module: "E1 ICT RD 346/2011",
    front: "¿Quién es responsable del mantenimiento de la ICT tras su puesta en servicio?",
    back: "La comunidad de propietarios, que puede contratar a una empresa instaladora habilitada para realizar el mantenimiento preventivo y las inspecciones periódicas.",
  },
  {
    id: "ict-fc-22",
    module: "E1 ICT RD 346/2011",
    front: "¿Con qué periodicidad máxima deben realizarse las inspecciones obligatorias de la ICT?",
    back: "Como máximo cada 15 años. La primera inspección es previa a la puesta en servicio.",
  },
  {
    id: "ict-fc-23",
    module: "E1 ICT RD 346/2011",
    front: "¿Cuáles son los tres niveles del Hogar Digital según el Anexo V?",
    back: "Nivel 1: telecomunicaciones básicas interiores. Nivel 2: añade control del entorno y eficiencia energética. Nivel 3: automatización plena con gestión remota.",
  },
  {
    id: "ict-fc-24",
    module: "E1 ICT RD 346/2011",
    front: "¿Qué elementos de la canalización conectan la red exterior del operador con el RITI?",
    back: "La arqueta de entrada (en el límite de la propiedad) y la canalización de enlace (desde la arqueta hasta el RITI).",
  },
  {
    id: "ict-fc-25",
    module: "E1 ICT RD 346/2011",
    front: "¿Dónde se sitúa el punto de distribución y qué une?",
    back: "En los registros secundarios de planta. Une la red de distribución (que baja desde el RITI) con la red de dispersión (que va a cada vivienda o local de la planta).",
  },
  {
    id: "ict-fc-26",
    module: "E1 ICT RD 346/2011",
    front: "¿Qué norma se aplica para certificar el cableado de pares trenzados de la ICT?",
    back: "La norma UNE-EN 50346, Tecnologías de la información – Instalación de cableado – Ensayo de cableados instalados.",
  },
  {
    id: "ict-fc-27",
    module: "E1 ICT RD 346/2011",
    front: "¿Cuántas tomas mínimas de televisión y telefonía exige la ICT en el salón de una vivienda?",
    back: "Al menos dos tomas de televisión (BAT coaxial) y dos tomas de telefonía/datos (BAT de pares trenzados) en el salón.",
  },
  {
    id: "ict-fc-28",
    module: "E1 ICT RD 346/2011",
    front: "¿Qué sistemas incluye el grupo 'Control del Entorno' del Hogar Digital?",
    back: "Automatización de toldos y persianas, gestión de ambientes, control de temperatura y telecontrol remoto.",
  },
  {
    id: "ict-fc-29",
    module: "E1 ICT RD 346/2011",
    front: "¿Qué es el Punto de Interconexión en la ICT de telefonía/banda ancha?",
    back: "Es el punto donde se conectan la red de alimentación del operador y la red de distribución del edificio; se ubica en el Registro Principal del RITI y delimita la frontera de responsabilidades entre operador y comunidad.",
  },
  {
    id: "ict-fc-30",
    module: "E1 ICT RD 346/2011",
    front: "¿Qué contempla el Anexo I del RD 346/2011?",
    back: "La norma técnica ICT para la captación, adaptación y distribución de señales de radiodifusión sonora y televisión terrestres y por satélite (RTV), incluyendo especificaciones de red, niveles de señal y características de cables y equipos.",
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
    front: "¿Qué marcado acredita el cumplimiento de la Directiva CEM para comercializar equipos?",
    back: "El marcado 'CE', colocado de forma visible, legible e indeleble en el equipo o en su placa de características, que acredita la conformidad con los requisitos esenciales de la Directiva CEM (2004/108/CE y su sucesora 2014/30/UE, transpuesta en España por el RD 1580/2006). En el sector ferroviario, las pruebas de emisión e inmunidad se realizan conforme a la norma EN 50121.",
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

  // E3 RCF Libro 1 — Recuperación activa avanzada
  {
    id: "F0025",
    module: "E3 RCF Libro 1",
    front: "¿Cuál es el orden de prevalencia documental en caso de discrepancia según el RCF?",
    back: "1.º AESF y normas europeas.\n2.º Administradores de Infraestructuras (AI).\n3.º Empresas Ferroviarias (EF).",
  },
  {
    id: "F0026",
    module: "E3 RCF Libro 1",
    front: "¿Qué tres equipamientos debe tener operativos en cabina un tren para poder iniciar servicio?",
    back: "1. Sistema de protección de tren compatible con la infraestructura.\n2. Dispositivo de vigilancia.\n3. Radiotelefonía (GSM-R o Tren-Tierra).",
  },
  {
    id: "F0027",
    module: "E3 RCF Libro 1",
    front: "¿Cuál es la velocidad máxima si el sistema de protección de tren es incompatible o está averiado?",
    back: "La velocidad máxima de circulación es de 120 km/h en toda la RFIG.",
  },
  {
    id: "F0028",
    module: "E3 RCF Libro 1",
    front: "¿Cuáles son las velocidades máximas autorizadas en la marcha de maniobras?",
    back: "Máximo 30 km/h si la locomotora va tirando del convoy; máximo 20 km/h si la locomotora va empujando.",
  },
  {
    id: "F0029",
    module: "E3 RCF Libro 1",
    front: "¿Qué obligación impone al maquinista la marcha a la vista?",
    back: "Avanzar con la precaución que requiera el caso, regulando la velocidad según la distancia de vía visible por delante, de modo que pueda detener el tren ante cualquier obstáculo o señal de parada.",
  },
  {
    id: "F0030",
    module: "E3 RCF Libro 1",
    front: "¿Qué dependencias se consideran 'estación' a efectos del Reglamento de Circulación Ferroviaria?",
    back: "Los Puestos de Bloqueo (PB), Puestos de Bloqueo de Apartado (PBA), Puestos de Cambio de Apartado (PCA), Puntos de Apartado Especial para Trenes (PAET), Bifurcaciones, y los Cambiadores de Ancho y Bases de Mantenimiento cuando no estén integrados en otra estación.",
  },
  {
    id: "F0031",
    module: "E3 RCF Libro 1",
    front: "¿Qué elementos identifican preceptivamente a un telefonema reglamentario?",
    back: "Formato preestablecido, número secuencial correlativo anual, hora exacta de transmisión, identificación de emisor y receptor, colacionado obligatorio y registro en soporte reglamentario.",
  },
  {
    id: "F0032",
    module: "E3 RCF Libro 1",
    front: "¿Cómo se clasifican las paradas prescritas según su función?",
    back: "1. Comercial: para subida o bajada de viajeros.\n2. Restringida: para personal de servicio o técnico.\n3. Técnica: por necesidades de la gestión del tráfico, cruces o rebase.",
  },
  {
    id: "F0033",
    module: "E3 RCF Libro 1",
    front: "¿En qué supuesto pierde automáticamente la orden de marcha un tren directo?",
    back: "Cuando un tren directo queda detenido en una estación, su orden de marcha queda automáticamente invalidada.",
  },
  {
    id: "F0034",
    module: "E3 RCF Libro 1",
    front: "¿Cuándo se realiza la Prueba Completa de frenado y qué garantiza?",
    back: "Se realiza antes de la salida del tren de la estación o dependencia origen de su composición. Asegura la estanqueidad y continuidad de la TFA y el funcionamiento de apriete y afloje de todos los frenos en servicio.",
  },
  {
    id: "F0035",
    module: "E3 RCF Libro 1",
    front: "¿Cuándo se realiza la Prueba Parcial de frenado y qué garantiza?",
    back: "Se realiza antes de la salida cuando se agregan vehículos a la composición. Asegura estanqueidad y continuidad de TFA, apriete y afloje del último vehículo y el funcionamiento de cada vehículo agregado.",
  },
  {
    id: "F0036",
    module: "E3 RCF Libro 1",
    front: "¿Cuándo debe realizarse la Prueba de Continuidad de frenado?",
    back: "Al agregar locomotora por cola, segregar vehículos de la composición, tras interrumpir la TFA sin segregar vehículos, o al acoplar dos ramas de tren.",
  },
  {
    id: "F0037",
    module: "E3 RCF Libro 1",
    front: "¿Cuándo debe realizarse la Verificación del Acoplamiento en el freno?",
    back: "Al cambiar la locomotora de cabeza, al agregar/segregar locomotora en tracción múltiple, o al segregar vehículos situados inmediatamente tras las locomotoras de cabeza.",
  },
  {
    id: "F0038",
    module: "E3 RCF Libro 1",
    front: "¿Qué margen de tolerancia se admite antes de considerar rebase de la velocidad máxima?",
    back: "Hasta 5 km/h por encima de la velocidad máxima observada por el maquinista durante un tiempo no superior a 20 segundos.",
  },
  {
    id: "F0039",
    module: "E3 RCF Libro 1",
    front: "¿Quién es competente para emitir las Consignas y quién el Libro de Normas del Maquinista?",
    back: "Las Consignas (A, B, C) y los Avisos son competencia del Administrador de Infraestructuras (AI). El Libro de Normas del Maquinista, Horario y Libro de Itinerarios son competencia de las Empresas Ferroviarias (EF).",
  },

  // E2 CEM — ampliación técnica
  {
    id: "F0040",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿Qué exige el Real Decreto 186/2016 al fabricante de un equipo?",
    back: "Elaborar la documentación técnica, realizar el procedimiento de evaluación de la conformidad aplicable y colocar el marcado CE de forma visible, legible e indeleble.",
  },
  {
    id: "F0041",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿Qué diferencia al modo diferencial del modo común en una perturbación conducida?",
    back: "En el modo diferencial la perturbación circula únicamente por los conductores activos; en el modo común circula por todos los conductores, incluido el de protección.",
  },
  {
    id: "F0042",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿A qué distancia y con qué detector se miden las emisiones radiadas del material rodante en prueba estacionaria?",
    back: "A 10 metros de distancia, utilizando detector de cuasi-pico, conforme a la norma armonizada EN 50121.",
  },
  {
    id: "F0043",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿Por qué se miden las emisiones de los trenes en movimiento con varias antenas simultáneas?",
    back: "Para capturar todo el ancho de banda que debe medirse, debido al carácter transitorio de la perturbación durante la circulación.",
  },
  {
    id: "F0044",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿Qué sistemas de señalización requieren niveles de inmunidad elevados según la EN 50121?",
    back: "Los equipos de señalización, telecomunicación y control embarcados, para evitar fallos de seguridad por perturbaciones externas.",
  },

  // DR 2027
  {
    id: "F0045",
    module: "DR 2027 Declaracion sobre la Red",
    front: "¿Qué ley obliga a los administradores de infraestructuras a publicar la Declaración sobre la Red?",
    back: "La Ley 38/2015, de 29 de septiembre, del sector ferroviario (artículo 32), que exige elaborar, aprobar y publicar la DR previa consulta a las partes interesadas.",
  },
  {
    id: "F0046",
    module: "DR 2027 Declaracion sobre la Red",
    front: "¿Cuáles son las tensiones de electrificación de la red ferroviaria española según la DR?",
    back: "25 kV en corriente alterna, 3 kV en corriente continua y 1.5 kV en corriente continua, según tramos.",
  },
  {
    id: "F0047",
    module: "DR 2027 Declaracion sobre la Red",
    front: "¿Qué sistemas de señalización menciona la DR en el capítulo II?",
    back: "ERTMS/ETCS, ASFA digital y sistemas de bloqueo automático, con niveles de protección crecientes.",
  },
  {
    id: "F0048",
    module: "DR 2027 Declaracion sobre la Red",
    front: "¿Cómo expresa la DR la capacidad de la infraestructura?",
    back: "En surcos ofertados por tramo y periodo, considerando las restricciones de mantenimiento y las ventanas de capacidad.",
  },
  {
    id: "F0049",
    module: "DR 2027 Declaracion sobre la Red",
    front: "¿Qué edición de la DR se enlaza desde la convocatoria PNI26/01?",
    back: "La edición V.0 (ED 27/02/2026); la ficha general de ADIF lista la edición 31/07/2026 como vigente, por lo que conviene contrastar diferencias.",
  },

  // DR 2027 — Capítulo II (Infraestructura): definiciones, enumeraciones, magnitudes, restricciones
  {
    id: "F0050",
    module: "DR 2027 Declaracion sobre la Red",
    front: "¿Cómo se estructura el Capítulo II (Infraestructura) de la DR 2027?",
    back: "En seis apartados: 2.1 Introducción, 2.2 Ámbito de la Red Gestionada por Adif, 2.3 Descripción de la Red (quince subapartados), 2.4 Restricciones de Tráfico (cinco), 2.5 Disponibilidad de la Infraestructura y 2.6 Desarrollo de la Infraestructura.",
  },
  {
    id: "F0051",
    module: "DR 2027 Declaracion sobre la Red",
    front: "Enumera los quince subapartados de la sección 2.3 (Descripción de la Red) de la DR 2027.",
    back: "2.3.1 Tipología de vías; 2.3.2 Anchos de vía y tercer carril; 2.3.3 Estaciones y terminales; 2.3.4 Gálibos; 2.3.5 Límite de carga; 2.3.6 Rampas características; 2.3.7 Velocidades máximas; 2.3.8 Longitud máxima de los trenes; 2.3.9 Suministro de energía eléctrica; 2.3.10 Sistemas de seguridad y señalización; 2.3.11 Control y gestión del tráfico; 2.3.12 Sistemas de comunicación; 2.3.13 Control y protección del tren; 2.3.14 Autopistas ferroviarias; 2.3.15 Protección y seguridad.",
  },
  {
    id: "F0052",
    module: "DR 2027 Declaracion sobre la Red",
    front: "¿Cuáles son las cinco restricciones de la sección 2.4 (Restricciones de Tráfico) de la DR 2027?",
    back: "2.4.1 Infraestructuras especializadas; 2.4.2 Normativa medioambiental; 2.4.3 Transporte de mercancías peligrosas; 2.4.4 Restricciones en túneles; 2.4.5 Restricciones en puentes y viaductos.",
  },
  {
    id: "F0053",
    module: "DR 2027 Declaracion sobre la Red",
    front: "¿Qué anchos de vía contempla la Red Ferroviaria de Interés General (RFIG) según la DR 2027?",
    back: "Ancho ibérico de 1.668 mm, ancho internacional UIC de 1.435 mm (a través de tercer carril en la Red Mixta) y ancho métrico de 1.000 mm.",
  },
  {
    id: "F0054",
    module: "DR 2027 Declaracion sobre la Red",
    front: "¿Cuáles son las longitudes de la RFIG por tipo de vía (DR 2027)?",
    back: "Red Convencional de Ancho Ibérico puro: 10.212,5 km; Red Mixta (tercer carril): 126,8 km; Red de Vía Estrecha de Ancho Métrico (1.000 mm): 1.195,3 km. Total titularidad Adif: 11.675,9 km.",
  },
  {
    id: "F0055",
    module: "DR 2027 Declaracion sobre la Red",
    front: "¿Qué tensiones de electrificación utiliza la red de Adif según la DR 2027?",
    back: "25.000 V en corriente alterna (50 Hz), circunscrita normalmente a la Red de Alta Velocidad; 3.000 V en corriente continua en la Red Convencional; y 1.500 V en corriente continua en la Red de Ancho Métrico.",
  },
  {
    id: "F0056",
    module: "DR 2027 Declaracion sobre la Red",
    front: "En la DR 2027, ¿qué limita el 'gálibo' (2.3.4) y qué el 'límite de carga' (2.3.5)?",
    back: "El gálibo es el perfil de contorno que limita las dimensiones de los vehículos y las cargas; el límite de carga fija la masa máxima admisible por eje y por metro lineal de tren.",
  },
  {
    id: "F0057",
    module: "DR 2027 Declaracion sobre la Red",
    front: "¿Qué sistema de control y protección del tren destaca la DR 2027 en el apartado 2.3.13?",
    back: "El ERTMS (versión en servicio 2.3.0d), que combina el ETCS (señalización y protección en cabina que supervisa continuamente la velocidad) y el GSM-R (comunicaciones). El ASFA está instalado en todas las líneas principales de la RFIG.",
  },
  {
    id: "F0058",
    module: "DR 2027 Declaracion sobre la Red",
    front: "¿Qué clases de material rodante por aceleración sin compensar y qué sistemas de bloqueo cita la DR 2027 (apartado 2.3)?",
    back: "Aceleración: N 0,65; A 1; B 1,2; C 1,5; D 1,8 m/s². Bloqueo: BCA, BSL, BLA, BA (con BAU/BAD/BAB), BEM y BT.",
  },
  {
    id: "F0059",
    module: "DR 2027 Declaracion sobre la Red",
    front: "En la DR 2027, ¿cómo se publican las restricciones en túneles y puentes/viaductos (2.4.4 y 2.4.5)?",
    back: "Se publican en la Información de Circulación de las Líneas (ICL), disponible para las empresas ferroviarias en el RGD; las de puentes/viaductos suelen vincularse a la masa máxima admisible por eje y metro lineal (2.3.5).",
  },
  {
    id: "F0060",
    module: "DR 2027 Declaracion sobre la Red",
    front: "¿Qué prohíbe la DR 2027 (2.4.3) en relación con mercancías peligrosas y túneles?",
    back: "En general impide programar estacionamientos en estaciones de núcleos habitados y paradas en túneles de más de 100 m de longitud; la empresa debe replantear esas paradas o usar líneas de circunvalación.",
  },

  // CEM — definiciones, comparaciones, magnitudes, restricciones (módulo compatibilidad-electromagnetica)
  {
    id: "F0061",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿Qué es la compatibilidad electromagnética (CEM) y qué dos vertientes tiene?",
    back: "Es la capacidad de un equipo para funcionar en su entorno electromagnético sin producir perturbaciones indebidas a otros equipos. Sus dos vertientes son la emisión (energía que el equipo libera) y la inmunidad (capacidad de funcionar sin degradarse ante perturbaciones externas).",
  },
  {
    id: "F0062",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿En qué se diferencian la Directiva 2014/30/UE y la Directiva 2004/108/CE?",
    back: "La 2004/108/CE era la directiva previa de CEM; la 2014/30/UE es la versión vigente del marco europeo, transpuesta en España por el Real Decreto 186/2016.",
  },
  {
    id: "F0063",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿Qué relación hay entre la Directiva 2014/30/UE y el Real Decreto 186/2016?",
    back: "El RD 186/2016 es la norma española que transpone (incorpora al ordenamiento interno) la Directiva 2014/30/UE, fijando los requisitos de comercialización de equipos y el procedimiento de evaluación de conformidad (marcado CE).",
  },
  {
    id: "F0064",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿Cuáles son las partes de la familia EN 50121 según el artículo asignado?",
    back: "-1 Generalidades; -2 Emisión del sistema ferroviario completo al mundo exterior; -3-1 Material rodante (tren y vehículo completo); -3-2 Material rodante (aparatos); -4 Emisión e inmunidad de aparatos de señalización y telecomunicaciones; -5 Emisión e inmunidad de instalaciones fijas de suministro de energía y equipos asociados.",
  },
  {
    id: "F0065",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿Qué partes de la EN 50121 exigen pruebas 'in situ' y no solo de laboratorio?",
    back: "Las partes 2, 3-1 y 5 requieren mediciones in situ (en la vía o instalación real), por lo que no tienen el mismo grado de control que las pruebas de laboratorio de CEM.",
  },
  {
    id: "F0066",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿Cómo se clasifica el acoplamiento electromagnético según el modo de transferencia de energía?",
    back: "Puede ser conducido (por los cables), inductivo (campo magnético) o capacitivo (campo eléctrico), describiendo cómo la energía perturbadora pasa de la fuente a la víctima.",
  },
  {
    id: "F0067",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿En qué se diferencian el modo diferencial y el modo común de una perturbación conducida?",
    back: "En el modo diferencial la perturbación circula únicamente por los conductores activos; en el modo común lo hace por todos los conductores, incluido el de protección (tierra).",
  },
  {
    id: "F0068",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿A qué distancia y con qué detector se miden las emisiones radiadas del material rodante en prueba estacionaria (EN 50121-2 / -3-1)?",
    back: "A 10 metros de distancia al lado de la vía, utilizando detector de cuasi-pico; los límites representados son límites de cuasi-pico a 10 metros.",
  },
  {
    id: "F0069",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿Cuál es la línea de tiempo de la norma EN 50121 citada en el artículo asignado?",
    back: "Se introdujo en 1995 como norma previa, fue adoptada definitivamente en 2000, la versión de 2006 entró plenamente en vigor en julio de 2009 y la versión española UNE_EN_50121 se presentó en 2007.",
  },
  {
    id: "F0070",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿Qué equivalencia internacional tiene la EN 50121 y qué norma suele confundirse con ella?",
    back: "La serie IEC 62236-x es la propuesta equivalente de la IEC a nivel internacional. La EN 50155 suele causar confusión porque también contiene requisitos de CEM, pero está enfocada al funcionamiento del producto y no a la obtención del Marcado CE como la EN 50121.",
  },
  {
    id: "F0071",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿Cómo se define la longitud de onda y el índice de distorsión armónica (THD) en el contexto de la CEM?",
    back: "La longitud de onda es la distancia recorrida por una onda durante una oscilación completa. El índice de distorsión armónica (THD) mide la distorsión armónica introducida por los convertidores de potencia ferroviarios en la red.",
  },
  {
    id: "F0072",
    module: "E2 Compatibilidad electromagnetica",
    front: "¿Por qué el carril es una fuente de acoplamiento relevante en el ferrocarril (multi-uso del carril)?",
    back: "En el entorno ferroviario el carril se emplea como conductor de retorno de corriente y como vía de circulación a la vez, lo que favorece el acoplamiento conductivo/inductivo de las perturbaciones hacia los equipos vecinos.",
  },
];
