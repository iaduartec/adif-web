import type { TheorySection } from "../lesson-theory";

const reviewedCemPrimary = {
  status: "reviewed",
  reviewedAt: "2026-11-02",
  reviewedBy: "opencode-editorial",
  confidence: {
    level: "high",
    reason: "Trazado a Directiva 2014/30/UE y RD 186/2016 consolidados (BOE), verificados en manifest.",
  },
} as const;

const pendingCemSyllabus = {
  status: "needs_review",
  confidence: {
    level: "low",
    reason: "Fuente complementaria de temario (EN 50121 / cuadernillos ADIF) sin verificación byte a byte; pendiente de cotejo.",
  },
} as const;

const reviewedCemArticle = {
  status: "needs_review",
  confidence: {
    level: "medium",
    reason: "Contenido trazado al artículo asignado \"Compatibilidad electromagnética y seguridad en los ferrocarriles\" (REE, mayo de 2015, cedido por Cemdal), conservado en el repositorio (pdf/02, manifest PNI26-12PO-SPECIFIC-02). El marco legal (Directiva 2014/30/UE y RD 186/2016) está verificado en manifest; la verificación byte a byte del artículo REE se mantiene como fuente oficial pendiente.",
  },
} as const;

export const cemTheory: TheorySection = {
  sources: [
    {
      id: "dir-2014-30-ue",
      sourceId: "Directiva 2014/30/UE",
      sourceTitle:
        "Directiva 2014/30/UE del Parlamento Europeo y del Consejo, de 26 de febrero de 2014, sobre la armonización de las legislaciones de los Estados miembros en materia de compatibilidad electromagnética",
      sourceUrl: "https://www.boe.es/buscar/doc.php?id=DOUE-L-2014-80623",
      locator: "Artículo 3, definiciones",
      excerpt:
        "Compatibilidad electromagnética: la capacidad de un equipo para funcionar satisfactoriamente en su entorno electromagnético sin introducir perturbaciones electromagnéticas intolerables para otros equipos y sin sufrir él mismo degradación inaceptable.",
    },
    {
      id: "dir-2014-30-ue-art4",
      sourceId: "Directiva 2014/30/UE",
      sourceTitle:
        "Directiva 2014/30/UE del Parlamento Europeo y del Consejo, de 26 de febrero de 2014, sobre la armonización de las legislaciones de los Estados miembros en materia de compatibilidad electromagnética",
      sourceUrl: "https://www.boe.es/buscar/doc.php?id=DOUE-L-2014-80623",
      locator: "Artículo 4",
      excerpt:
        "Los equipos deberán estar diseñados y fabricados de forma que garanticen, en condiciones de funcionamiento normales, que las perturbaciones electromagnéticas que generan no superen un nivel que permita a los equipos de telecomunicaciones y de radiodifusión funcionar según lo previsto.",
    },
    {
      id: "rd186-2016",
      sourceId: "Real Decreto 186/2016",
      sourceTitle:
        "Real Decreto 186/2016, de 6 de mayo, por el que se regula la compatibilidad electromagnética de los equipos eléctricos y electrónicos",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2016-4442",
      locator: "Artículo 3",
      excerpt: "Los equipos deberán cumplir los requisitos esenciales de protección...",
    },
    {
      id: "rd186-2016-art5",
      sourceId: "Real Decreto 186/2016",
      sourceTitle:
        "Real Decreto 186/2016, de 6 de mayo, por el que se regula la compatibilidad electromagnética de los equipos eléctricos y electrónicos",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2016-4442",
      locator: "Artículo 5",
      excerpt:
        "Los fabricantes deberán asegurar que los equipos que introduzcan en el mercado cumplan los requisitos esenciales; deberán elaborar la documentación técnica y realizar el procedimiento de evaluación de la conformidad aplicable.",
    },
    {
      id: "cem-ree-2015",
      sourceId: "PNI26-12PO-SPECIFIC-02",
      sourceTitle: "Compatibilidad electromagnética y seguridad en los ferrocarriles",
      sourceUrl:
        "https://www.adif.es/documents/20124/55031380/02%2BCompatibilidad%2Belectromagn%C3%A9tica%2By%2Bseguridad%2Ben%2Blos%2Bferrocarriles.pdf/66b0c76b-4910-3415-fd83-0672ec9a3068",
      locator: "Artículo REE, mayo de 2015, pp. 80–86 (cedido por Cemdal)",
      excerpt:
        "Artículo asignado por ADIF al temario de la parte específica 26/12PO (PNI26/01): desarrolla la CEM en el entorno ferroviario, la Directiva de CEM, la norma EN 50121, las instalaciones fijas, el material rodante, la gestión de la CEM y su gestión en España.",
    },
    {
      id: "en50121",
      sourceId: "EN 50121",
      sourceTitle: "Norma armonizada europea de compatibilidad electromagnética en aplicaciones ferroviarias",
      sourceUrl: "https://www.adif.es/w/pni26-01-personal-operativo",
      locator: "Partes 1 a 5",
      excerpt: "Especifica los límites de emisión e inmunidad para material rodante e instalaciones fijas...",
    },
    {
      id: "en50121-p2",
      sourceId: "EN 50121",
      sourceTitle: "Norma armonizada europea de compatibilidad electromagnética en aplicaciones ferroviarias",
      sourceUrl: "https://www.adif.es/w/pni26-01-personal-operativo",
      locator: "Parte 2, emisión",
      excerpt:
        "Fija los límites de emisión radiada y conducida para el material rodante en condiciones de prueba estacionaria y en movimiento.",
    },
    {
      id: "en50121-p3",
      sourceId: "EN 50121",
      sourceTitle: "Norma armonizada europea de compatibilidad electromagnética en aplicaciones ferroviarias",
      sourceUrl: "https://www.adif.es/w/pni26-01-personal-operativo",
      locator: "Parte 3, inmunidad",
      excerpt:
        "Define los niveles de inmunidad exigidos a los equipos de señalización, telecomunicación y control embarcados.",
    },
    {
      id: "adif-pni23-cem-questions",
      sourceId: "ADIF PNI23/01",
      sourceTitle: "Plantillas correctoras y cuadernillos de examen PNI23/01",
      sourceUrl:
        "https://www.adif.es/documents/20124/17165113/%2807.11.2023%29%20-%20Plantillas%20correctoras%20y%20cuadernillos%20de%20examen.pdf/dce76c5e-ae60-a0d0-568e-4f4db30c3823",
      locator: "Cuadernillos 1433 y 4101, preguntas 12 a 15, y plantillas correctoras",
      excerpt:
        "Las respuestas oficiales identifican la propagación diferencial, los criterios de compatibilidad, el efecto del área del bucle en el acoplamiento inductivo y la inmunidad.",
    },
    {
      id: "adif-pni24-cem-questions",
      sourceId: "ADIF PNI24/01",
      sourceTitle: "Plantillas correctoras y cuadernillos de examen PNI24/01",
      sourceUrl:
        "https://www.adif.es/documents/20124/33942288/%2825.11.2024%29%20-%20Plantillas%20correctoras%20y%20cuadernillos%20de%20examen.pdf/7d5847b0-d613-65b0-a0a2-ae936d6e0500",
      locator: "Cuadernillos 3403 y 3413, preguntas 13 a 16, y plantillas correctoras",
      excerpt:
        "Las respuestas oficiales fijan la relación del acoplamiento capacitivo con la distancia, y las definiciones de perturbación, longitud de onda e índice de distorsión armónica.",
    },
    {
      id: "adif-pni25-cem-questions",
      sourceId: "ADIF PNI25/01",
      sourceTitle: "Plantillas correctoras y cuadernillos de examen PNI25/01",
      sourceUrl:
        "https://www.adif.es/documents/20124/45240815/%2818.11.2025%29%2B-%2BPlantillas%2Bcorrectoras%2By%2Bcuadernillos%2Bde%2Bexamen.pdf/a2b9f608-83b0-34ee-0aa4-aba4ee6baf6b",
      locator: "Cuadernillos 1131 y 4104, preguntas 13 a 16, y plantillas correctoras",
      excerpt:
        "Las respuestas oficiales cubren el alcance y fecha de la Directiva CEM, el uso de convertidores ferroviarios y la medición con varias antenas.",
    },
  ],

  introduction: [
    {
      id: "cem-intro-1",
      text: "La compatibilidad electromagnética (CEM) es la capacidad de un equipo para funcionar satisfactoriamente sin introducir perturbaciones electromagnéticas intolerables y sin sufrir degradaciones inaceptables.",
      kind: "normative",
      legalBasis: ["dir-2014-30-ue"],
      review: reviewedCemPrimary,
    },
    {
      id: "cem-intro-2",
      text: "En el entorno ferroviario, la CEM es un factor de seguridad crítico debido a la coexistencia de sistemas sensibles (señalización, telecomunicaciones) y fuentes de tracción eléctrica de gran potencia.",
      kind: "didactic",
      legalBasis: ["en50121"],
      review: pendingCemSyllabus,
    },
    {
      id: "cem-intro-3",
      text: "La Directiva 2014/30/UE armoniza en la Unión Europea los requisitos de CEM para los equipos eléctricos y electrónicos; en España se transpone mediante el Real Decreto 186/2016.",
      kind: "normative",
      legalBasis: ["dir-2014-30-ue", "rd186-2016"],
      review: reviewedCemPrimary,
    },
    {
      id: "cem-intro-4",
      text: "El documento asignado por ADIF para esta unidad es el artículo \"Compatibilidad electromagnética y seguridad en los ferrocarriles\" (Revista Española de Electrónica, mayo de 2015, cedido por Cemdal, autoría de Francesc Daura Luna); su contenido forma la base de esta teoría, complementada con la Directiva 2014/30/UE y el RD 186/2016 verificables en el BOE.",
      kind: "didactic",
      legalBasis: ["cem-ree-2015"],
      review: reviewedCemArticle,
    },
    {
      id: "cem-intro-5",
      text: "El ferrocarril presenta un entorno electromagnético severo y complejo: coexisten la señalización, la tracción y las comunicaciones compartiendo parcialmente la misma infraestructura, con acoplamientos inductivos y capacitivos entre las distintas partes del sistema y con otros sistemas cercanos.",
      kind: "didactic",
      legalBasis: ["cem-ree-2015"],
      review: reviewedCemArticle,
    },
  ],

  concepts: [
    {
      id: "cem-concept-1",
      title: "Emisión e Inmunidad",
      claims: [
        {
          id: "cem-c1-1",
          text: "Un equipo es compatible electromagnéticamente cuando su nivel de emisión se sitúa por debajo de los límites normativos y su nivel de inmunidad por encima de los umbrales exigidos.",
          kind: "normative",
          legalBasis: ["rd186-2016"],
          review: reviewedCemPrimary,
        },
      ],
    },
    {
      id: "cem-concept-2",
      title: "Directiva CEM 2014/30/UE",
      claims: [
        {
          id: "cem-c2-1",
          text: "Directiva europea transpuesta en España mediante el Real Decreto 186/2016. Define los requisitos esenciales de protección para aparatos comercializados en la UE.",
          kind: "normative",
          legalBasis: ["dir-2014-30-ue", "rd186-2016"],
          review: reviewedCemPrimary,
        },
        {
          id: "cem-c2-2",
          text: "Los equipos deberán estar diseñados y fabricados de forma que las perturbaciones electromagnéticas que generan no superen un nivel que impida el funcionamiento previsto de los equipos de telecomunicaciones y radiodifusión.",
          kind: "normative",
          legalBasis: ["dir-2014-30-ue-art4"],
          review: reviewedCemPrimary,
        },
      ],
    },
    {
      id: "cem-concept-3",
      title: "Norma UNE-EN 50121",
      claims: [
        {
          id: "cem-c3-1",
          text: "Es la norma armonizada de CENELEC específica para la CEM en ferrocarriles, que prescribe los ensayos y límites de emisión e inmunidad de material e instalaciones.",
          kind: "didactic",
          legalBasis: ["en50121"],
          review: pendingCemSyllabus,
        },
      ],
    },
    {
      id: "cem-concept-4",
      title: "Acoplamiento Electromagnético",
      claims: [
        {
          id: "cem-c4-1",
          text: "El acoplamiento describe la transferencia de energía perturbadora de la fuente a la víctima. Puede ser conducido, inductivo (campo magnético) o capacitivo (campo eléctrico).",
          kind: "didactic",
          legalBasis: ["en50121"],
          review: pendingCemSyllabus,
        },
        {
          id: "cem-c4-2",
          text: "El modo diferencial se produce cuando la perturbación circula únicamente por los conductores activos del sistema; el modo común cuando circula por todos los conductores incluyendo el de protección.",
          kind: "didactic",
          legalBasis: ["en50121"],
          review: pendingCemSyllabus,
        },
      ],
    },
    {
      id: "cem-concept-5",
      title: "Medición y Ensayos",
      claims: [
        {
          id: "cem-c5-1",
          text: "Los ensayos de emisión radiada de material rodante en prueba estacionaria se miden por norma armonizada a una distancia de 10 metros utilizando detector de cuasi-pico.",
          kind: "didactic",
          legalBasis: ["en50121-p2"],
          review: pendingCemSyllabus,
        },
        {
          id: "cem-c5-2",
          text: "La emisión en movimiento se mide con varias antenas simultáneas para capturar todo el ancho de banda que debe medirse, debido al carácter transitorio de la perturbación.",
          kind: "didactic",
          legalBasis: ["adif-pni25-cem-questions"],
          review: pendingCemSyllabus,
        },
      ],
    },
    {
      id: "cem-concept-6",
      title: "Interferencia Conducida en Modo Diferencial",
      claims: [
        {
          id: "cem-c6-1",
          text: "Una interferencia electromagnética conducida se propaga en modo diferencial cuando circula únicamente por los conductores activos del sistema.",
          kind: "didactic",
          legalBasis: ["adif-pni23-cem-questions"],
          review: pendingCemSyllabus,
        },
      ],
    },
    {
      id: "cem-concept-7",
      title: "Reducción del Acoplamiento Inductivo",
      claims: [
        {
          id: "cem-c7-1",
          text: "Para reducir el acoplamiento inductivo se disminuye el área del bucle víctima, se incrementa la distancia o se reduce el campo magnético; aumentar el área del bucle produce el efecto contrario.",
          kind: "didactic",
          legalBasis: ["adif-pni23-cem-questions"],
          review: pendingCemSyllabus,
        },
      ],
    },
    {
      id: "cem-concept-8",
      title: "Distancia en el Acoplamiento Capacitivo",
      claims: [
        {
          id: "cem-c8-1",
          text: "En el acoplamiento capacitivo, cuanto menor es la distancia entre el conductor fuente y el conductor víctima, mayor es la tensión inducida.",
          kind: "didactic",
          legalBasis: ["adif-pni24-cem-questions"],
          review: pendingCemSyllabus,
        },
      ],
    },
    {
      id: "cem-concept-9",
      title: "Perturbación Electromagnética",
      claims: [
        {
          id: "cem-c9-1",
          text: "La señal eléctrica no deseada que se suma a la señal útil se denomina perturbación electromagnética.",
          kind: "didactic",
          legalBasis: ["adif-pni24-cem-questions"],
          review: pendingCemSyllabus,
        },
      ],
    },
    {
      id: "cem-concept-10",
      title: "Longitud de Onda",
      claims: [
        {
          id: "cem-c10-1",
          text: "La distancia recorrida por una onda durante el tiempo de una oscilación completa se denomina longitud de onda.",
          kind: "didactic",
          legalBasis: ["adif-pni24-cem-questions"],
          review: pendingCemSyllabus,
        },
      ],
    },
    {
      id: "cem-concept-11",
      title: "Índice de Distorsión Armónica",
      claims: [
        {
          id: "cem-c11-1",
          text: "El Índice de Distorsión Armónica (IDA) es inversamente proporcional a la amplitud de la componente fundamental o armónico de rango 1.",
          kind: "didactic",
          legalBasis: ["adif-pni24-cem-questions"],
          review: pendingCemSyllabus,
        },
      ],
    },
    {
      id: "cem-concept-12",
      title: "Alcance y Publicación de la Directiva CEM",
      claims: [
        {
          id: "cem-c12-1",
          text: "En el temario evaluado por ADIF, la Directiva de compatibilidad electromagnética se presenta como aplicable a todos los equipos electrónicos y la directiva vigente se publicó en marzo de 2014.",
          kind: "didactic",
          legalBasis: ["adif-pni25-cem-questions"],
          review: pendingCemSyllabus,
        },
      ],
    },
    {
      id: "cem-concept-13",
      title: "Convertidores de Potencia Ferroviarios",
      claims: [
        {
          id: "cem-c13-1",
          text: "Una razón principal para utilizar convertidores de potencia en las redes ferroviarias es la necesidad de cambiar entre dos o más tipos de líneas de suministro de energía.",
          kind: "didactic",
          legalBasis: ["adif-pni25-cem-questions"],
          review: pendingCemSyllabus,
        },
      ],
    },
    {
      id: "cem-concept-14",
      title: "Medición de Emisiones de Trenes en Movimiento",
      claims: [
        {
          id: "cem-c14-1",
          text: "Las emisiones electromagnéticas de los trenes en movimiento se miden con varias antenas simultáneas para recibir todo el ancho de banda que debe medirse.",
          kind: "didactic",
          legalBasis: ["adif-pni25-cem-questions"],
          review: pendingCemSyllabus,
        },
      ],
    },
    {
      id: "cem-concept-15",
      title: "Obligaciones del Fabricante (RD 186/2016)",
      claims: [
        {
          id: "cem-c15-1",
          text: "El fabricante debe elaborar la documentación técnica, realizar el procedimiento de evaluación de la conformidad aplicable y colocar el marcado CE de forma visible, legible e indeleble.",
          kind: "normative",
          legalBasis: ["rd186-2016-art5"],
          review: reviewedCemPrimary,
        },
      ],
    },
    {
      id: "cem-concept-16",
      title: "Inmunidad en Instalaciones Fijas Ferroviarias",
      claims: [
        {
          id: "cem-c16-1",
          text: "Los equipos de señalización, telecomunicación y control embarcados deben cumplir los niveles de inmunidad definidos por la norma armonizada para evitar fallos de seguridad por perturbaciones externas.",
          kind: "didactic",
          legalBasis: ["en50121-p3"],
          review: pendingCemSyllabus,
        },
      ],
    },
    {
      id: "cem-concept-17",
      title: "Fuentes Típicas de Perturbación en Ferrocarril",
      claims: [
        {
          id: "cem-c17-1",
          text: "Los convertidores de potencia de tracción, los sistemas de frenado regenerativo y los equipos de conmutación son fuentes habituales de perturbación electromagnética en el entorno ferroviario.",
          kind: "didactic",
          legalBasis: ["en50121"],
          review: pendingCemSyllabus,
        },
      ],
    },
    {
      id: "cem-concept-18",
      title: "El entorno ferroviario como entorno electromagnético severo",
      claims: [
        {
          id: "cem-c18-1",
          text: "El entorno ferroviario está considerado generalmente como un entorno electromagnético severo: en un ferrocarril electrificado se requieren megavatios de potencia para la propulsión de los trenes, y el sistema ferroviario presenta un entorno complejo compuesto por muchos sistemas que incluyen señalización, tracción y comunicaciones.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c18-2",
          text: "Los aspectos de CEM a considerar en el entorno ferroviario son: el aspecto legal (las radiocomunicaciones no deben ser perturbadas), la seguridad (no se puede perturbar la señalización ferroviaria), el mantenimiento de la funcionalidad de toda la red ferroviaria, la coexistencia con otros vehículos o equipos del entorno y el aspecto biológico (pasajeros y personal no deben estar expuestos a campos magnéticos demasiado altos).",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c18-3",
          text: "El circuito de potencia equivalente de un sistema eléctrico ferroviario está constituido por las subestaciones, los motores y accionamientos del tren, la catenaria, el pantógrafo y los raíles; los sistemas de señalización comparten parcialmente esa misma infraestructura, lo que genera acoplamientos inductivos y capacitivos entre partes del sistema.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
      ],
    },
    {
      id: "cem-concept-19",
      title: "El multi-uso funcional del carril",
      claims: [
        {
          id: "cem-c19-1",
          text: "El problema clave de la CEM en la industria ferroviaria es el multi-uso funcional del propio carril: en su origen (década de 1840) los raíles eran un sistema de guiado mecánico; con la electricidad se usaron como conductor para la detección de trenes en las secciones de vía (circuitos de vía), como conductor de retorno de potencia en los esquemas de electrificación de corriente alterna y continua, y como conductor de las señales codificadas de bajo nivel del sistema de señalización.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c19-2",
          text: "El uso simultáneo del carril como vía de rodadura, conductor de retorno de tracción y canal de señalización complica el problema de las interferencias, especialmente con locomotoras de tracción eléctrica con inversores de frecuencia que deben ser compatibles con el resto de equipos e instalaciones.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
      ],
    },
    {
      id: "cem-concept-20",
      title: "Fuentes de EMI ferroviarias y sistemas de alimentación",
      claims: [
        {
          id: "cem-c20-1",
          text: "Un tren puede consumir varios MW de potencia (algunos miles de amperios); la conmutación entre sistemas de alimentación se realiza en pocos nanosegundos y genera niveles muy importantes de interferencias electromagnéticas (EMI), parcialmente radiadas directamente y parcialmente inducidas por el cableado del convertidor de potencia.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c20-2",
          text: "Las EMIs debidas a las transiciones de las conmutaciones tienen una amplitud que puede variar en varios miles de amperios en pocos nanosegundos, lo que produce perturbaciones con un espectro muy rico que alcanza el rango de los GHz.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c20-3",
          text: "Ejemplos de sistemas de alimentación de líneas ferroviarias en Europa citados en el artículo asignado: 600 V CC, 750 V CC, 1,5 kV CC, 3 kV CC, 3 kV CA a 16 2/3 Hz, 3 kV CA a 50 Hz, 15 kV CA a 50 Hz y 25 kV CA a 50 Hz.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c20-4",
          text: "También las locomotoras diésel con tracción eléctrica pueden ser fuentes de EMIs, y una instalación ferroviaria al aire libre puede ser perturbada por rayos en caso de tormenta si no está debidamente protegida.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
      ],
    },
    {
      id: "cem-concept-21",
      title: "Vías de propagación: interferencias conducidas y radiadas",
      claims: [
        {
          id: "cem-c21-1",
          text: "Dado que el tren está conectado a la línea externa de alimentación, parte de las EMI producidas por sus convertidores se inyectan en la catenaria por conducción; como la catenaria es prácticamente una antena de cable horizontal, las EMIs conducidas se propagan inevitablemente a lo largo de su longitud y emiten campos electromagnéticos, lo que amenaza a las líneas de telecomunicación cercanas y puede contaminar el espectro de radio/TV.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c21-2",
          text: "La línea de ferrocarril puede considerarse una línea de transmisión multiconductor que permite la propagación de EMIs: los disturbios generados en un punto pueden perturbar el funcionamiento de otros dispositivos conectados a la misma línea de alimentación, incluso a muchos kilómetros de distancia de la fuente.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c21-3",
          text: "Una línea ferroviaria con varias vías paralelas (dos, cuatro o más) presenta acoplamientos entre líneas (diafonía), lo que añade otro camino de propagación de las EMIs hacia otras partes del sistema ferroviario, como las señales de control a lo largo de las vías.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c21-4",
          text: "Las EMIs conducidas pueden perturbar los circuitos electrónicos de control y seguridad en el interior del tren y los circuitos de señalización conectados a los carriles, afectando a la seguridad general de la línea; fallos en la detección de la posición y estado del tren podrían provocar resultados catastróficos, y estas consideraciones son aún más importantes en las líneas de alta velocidad.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
      ],
    },
    {
      id: "cem-concept-22",
      title: "Acoplamiento capacitivo e inductivo: factores de intensidad",
      claims: [
        {
          id: "cem-c22-1",
          text: "Entre las distintas partes del sistema ferroviario (y con otros sistemas cercanos) existen acoplamientos inductivos, asociados al campo magnético, y capacitivos, asociados al campo eléctrico.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c22-2",
          text: "En el acoplamiento capacitivo la tensión inducida en la víctima aumenta al reducirse la distancia entre conductor fuente y conductor víctima; en el acoplamiento inductivo la perturbación crece con el área del bucle que cierra la víctima, por lo que reducirla, aumentar la distancia o reducir el campo magnético disminuye el acoplamiento.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015", "adif-pni23-cem-questions", "adif-pni24-cem-questions"],
          review: reviewedCemArticle,
        },
      ],
    },
    {
      id: "cem-concept-23",
      title: "Apantallamiento, conexión a tierra y equipotencialidad",
      claims: [
        {
          id: "cem-c23-1",
          text: "Las prácticas de instalación deben asegurar que la inmunidad integral del subsistema se mantiene mediante, por ejemplo, cables apantallados, la separación de los cables, la conexión a tierra y las buenas técnicas de unión de los chasis y armarios, requiriendo buena comunicación entre proveedor y contratista principal para asegurar el flujo de información.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c23-2",
          text: "En grandes sistemas, las pruebas de inmunidad \"in situ\" no son prácticas, por lo que es mejor realizar las pruebas de inmunidad en los aparatos individuales y en las prácticas de instalación utilizadas.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
      ],
    },
    {
      id: "cem-concept-24",
      title: "Filtrado de convertidores de tracción",
      claims: [
        {
          id: "cem-c24-1",
          text: "Dado que el nivel de EMI conducidas hacia la alimentación de la línea aérea (catenaria) podría ser catastrófico, a todos los convertidores se les añaden filtros para atenuarlas.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c24-2",
          text: "El diseño de estos filtros no es sencillo, debido a la naturaleza de las EMIs generadas por las conmutaciones, cuya amplitud puede variar en varios miles de amperios en pocos nanosegundos y cuyo espectro alcanza el rango de los GHz.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
      ],
    },
    {
      id: "cem-concept-25",
      title: "De la Directiva 2004/108/CE a la Directiva 2014/30/UE",
      claims: [
        {
          id: "cem-c25-1",
          text: "La Directiva de CEM 2004/108/CE se publicó en el DOUE de 15 de diciembre de 2004 y fue transpuesta por el RD 1580/2006 (BOE de 22 de diciembre de 2006), entrando en vigor el régimen regulatorio de las instalaciones fijas que también afecta a todos los ferrocarriles, sus sistemas de señalización y sus instalaciones.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c25-2",
          text: "La nueva Directiva de compatibilidad electromagnética 2014/30/UE se publicó el 29 de marzo de 2014 y entró en vigor el 20 de abril de 2016; a nivel técnico no aporta cambios respecto a la Directiva anterior.",
          kind: "normative",
          legalBasis: ["cem-ree-2015", "dir-2014-30-ue"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c25-3",
          text: "Según la Directiva de CEM, el ferrocarril se define como una \"instalación fija\"; todo equipo está obligado a llevar el Marcado CE para poder ser vendido en la UE y requiere \"documentación técnica\", equivalente al expediente técnico de construcción; el fabricante puede elegir voluntariamente la evaluación por un Organismo Notificado o autocertificar si dispone de los instrumentos adecuados.",
          kind: "normative",
          legalBasis: ["cem-ree-2015", "dir-2014-30-ue", "rd186-2016"],
          review: reviewedCemArticle,
        },
      ],
    },
    {
      id: "cem-concept-26",
      title: "Requisitos legales frente a normas técnicas",
      claims: [
        {
          id: "cem-c26-1",
          text: "La Directiva de CEM es jurídicamente vinculante y obliga a los sectores de la industria eléctrica y electrónica a garantizar la CEM en sus sistemas y productos; su cumplimiento se demuestra mediante los requisitos esenciales de protección, mientras que las normas armonizadas son instrumentos técnicos voluntarios cuya aplicación facilita y presume la conformidad.",
          kind: "normative",
          legalBasis: ["dir-2014-30-ue", "rd186-2016", "cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c26-2",
          text: "La norma EN 50121 incluye la advertencia de que es probable lograr la conformidad CEM si se cumple la norma, pero, debido a la complejidad del entorno ferroviario, no se puede garantizar la CEM al 100 %; las normas ferroviarias de CEM representan un requisito técnico mínimo y pueden necesitar complementarse a partir de la identificación de peligros y riesgos.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
      ],
    },
    {
      id: "cem-concept-27",
      title: "Instalaciones fijas ferroviarias y \"persona responsable\"",
      claims: [
        {
          id: "cem-c27-1",
          text: "Las instalaciones fijas (IF) son montajes de diversos aparatos y dispositivos, que llevan el Marcado CE, instalados aplicando las \"buenas prácticas de ingeniería\" y destinados a un uso permanente en un lugar previamente definido (por ejemplo, redes de distribución de electricidad, redes de telecomunicaciones, grandes máquinas y conjuntos de máquinas en centros de fabricación).",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c27-2",
          text: "De una IF debe documentarse las \"buenas prácticas de ingeniería de CEM\" utilizadas para instalar sus equipos, y esa documentación debe estar en poder de una \"persona responsable\": la persona que, en virtud de su control de la instalación fija, es capaz de determinar que la configuración de la instalación cumple los requisitos esenciales cuando se usa. Esta responsabilidad debe quedar clara en los contratos y en la documentación de entrega.",
          kind: "normative",
          legalBasis: ["cem-ree-2015", "dir-2014-30-ue"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c27-3",
          text: "Los aparatos diseñados y fabricados para su incorporación en una IF específica y no disponibles en el mercado fuera de esa IF no están obligados a someterse a los procedimientos formales de evaluación de la conformidad de la Directiva; el fabricante puede optar entre seguir dichos procedimientos o documentar el nombre y lugar de la IF y las precauciones de CEM tomadas para mantener la conformidad.",
          kind: "normative",
          legalBasis: ["cem-ree-2015", "dir-2014-30-ue"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c27-4",
          text: "La Directiva de CEM no es retroactiva para las instalaciones ferroviarias ya construidas; la documentación de CEM es \"viva\" (debe reflejar las actualizaciones) y puede ir acumulándose con el tiempo mediante la actualización de la documentación del proyecto y los datos existentes. En la construcción de una nueva línea, la \"persona responsable\" es el contratista principal, que supervisa y coordina la documentación de colaboradores y proveedores; tras la puesta en marcha, el controlador de la infraestructura se convierte en la persona responsable.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c27-5",
          text: "El fabricante debe proporcionar la identificación del aparato y su nombre y dirección (o los de su representante autorizado en la UE); las autoridades pueden exigir ver la Documentación Técnica, no solo la declaración de conformidad (DoC).",
          kind: "normative",
          legalBasis: ["cem-ree-2015", "rd186-2016"],
          review: reviewedCemArticle,
        },
      ],
    },
    {
      id: "cem-concept-28",
      title: "Estructura y evolución de la norma EN 50121",
      claims: [
        {
          id: "cem-c28-1",
          text: "La norma más importante en la UE para la CEM ferroviaria es la CENELEC EN 50121, que describe las pruebas a realizar para evitar los problemas de CEM dentro de un sistema ferroviario; se introdujo en 1995 como norma previa, fue adoptada definitivamente en el año 2000, la versión de 2006 entró plenamente en vigor a partir de julio de 2009 y la versión española UNE_EN_50121 se presentó en 2007.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015", "en50121"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c28-2",
          text: "El objetivo clave de la EN 50121 es lograr la conformidad de CEM dentro del entorno ferroviario y también entre la red del ferrocarril y el \"mundo exterior\". La serie se subdivide en 6 partes (trasladadas por AENOR a normas UNE): EN 50121-1 Generalidades; EN 50121-2 Emisión del sistema ferroviario completo al mundo exterior; EN 50121-3-1 Material rodante, tren y vehículo completo; EN 50121-3-2 Material rodante, aparatos; EN 50121-4 Emisión e inmunidad de los aparatos de señalización y telecomunicaciones; y EN 50121-5 Emisión e inmunidad de las instalaciones fijas de suministro de energía y equipos asociados.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015", "en50121"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c28-3",
          text: "Las partes 2, 3-1 y 5 de la EN 50121 requieren pruebas \"in situ\" para la medición y no tienen el mismo grado de control que las pruebas realizadas en el laboratorio de CEM. La serie IEC 62236-x representa la propuesta equivalente de la IEC a nivel internacional. Cada parte remite internamente a las normas básicas de CEM para los métodos de medición y sus límites.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015", "en50121"],
          review: reviewedCemArticle,
        },
      ],
    },
    {
      id: "cem-concept-29",
      title: "Otras normas ferroviarias relacionadas con la CEM",
      claims: [
        {
          id: "cem-c29-1",
          text: "El subcomité CLC/TC 9X de CENELEC es el órgano técnico encargado de la estandarización de los sistemas eléctricos y electrónicos ferroviarios, y se compone de tres subcomités: CLC/TC 9XA (comunicación, señalización y sistemas de procesamiento), CLC/TC 9XB (material rodante) y CLC/TC 9C (instalaciones fijas).",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c29-2",
          text: "Entre las normas ferroviarias relacionadas directa o indirectamente con la CEM citadas en el artículo asignado destacan: EN 50155 (equipos electrónicos sobre material rodante, centrada en el funcionamiento del producto y con requisitos propios de CEM), EN 50207 (convertidores electrónicos de potencia para material rodante), EN 50126-1 (fiabilidad, disponibilidad, mantenibilidad y seguridad), EN 50128 y EN 50129 (software y seguridad de señalización), EN 50124-1/-2 (coordinación de aislamiento), EN 50125-1/-2/-3 (condiciones ambientales), EN 50500 (exposición humana a campos electromagnéticos), EN 50463 (medida de energía a bordo), EN 50159-1/-2 (comunicación de seguridad), EN 50238-1/-2/-3 (compatibilidad entre material rodante y detección de trenes: circuitos de vía y contadores de ejes), CLC/TR 50507 (límites de interferencia de circuitos de vía existentes), EN 50239 y EN 50163 (tensiones de alimentación de sistemas de tracción).",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c29-3",
          text: "La norma EN 50155 suele causar confusión porque también contiene requisitos de CEM, pero está enfocada al funcionamiento del producto y no a la obtención del Marcado CE como la EN 50121; algunos fabricantes tienen requisito de contrato de cumplir los requisitos de CEM de ambas normas. En el Reino Unido, las normas RIA 12 y RIA 18 de la asociación de la industria ferroviaria fueron la base sobre la que CENELEC desarrolló la serie de normas de CEM ferroviaria.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015", "en50121"],
          review: reviewedCemArticle,
        },
      ],
    },
    {
      id: "cem-concept-30",
      title: "Medición de emisiones del material rodante",
      claims: [
        {
          id: "cem-c30-1",
          text: "Las normas EN 50121-2 y EN 50121-3-1 establecen las emisiones que se deben medir a partir de los movimientos de los trenes desde un único punto de observación situado a 10 metros al lado de la vía férrea.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015", "en50121"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c30-2",
          text: "Por el tiempo muy corto disponible para medir (derivado de la anchura del haz de la antena, la velocidad de barrido del instrumento y la velocidad del tren), las mediciones usan un detector de pico, lo que hace que las emisiones de los transitorios, como los debidos a los rebotes del pantógrafo, queden incluidas en la medición real; los límites representados en las figuras del artículo asignado son límites de cuasi-pico a 10 metros.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c30-3",
          text: "Estas pruebas se realizan con varias antenas a la vez para recibir todo el ancho de banda a medir (de 2 a 3 antenas según el tipo) y requieren pases individuales del tren para los diferentes rangos de frecuencia; es una operación costosa y larga que generalmente requiere una vía de pruebas o cerrar el servicio de la red real por un tiempo. Los límites de la EN 50121-3-1 dependen de si las pruebas se hacen a nivel estacionario o en movimiento lento.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c30-4",
          text: "Los límites de las normas se derivan de tales mediciones, lo que significa que potencialmente el material rodante puede producir emisiones continuas hasta esos límites, por lo que pueden existir trenes más \"ruidosos\" electromagnéticamente que en el pasado.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
      ],
    },
    {
      id: "cem-concept-31",
      title: "Gestión de la CEM en proyectos ferroviarios",
      claims: [
        {
          id: "cem-c31-1",
          text: "Para lograr el cumplimiento de la CEM en los equipos ferroviarios es necesario incluir la CEM como parámetro de diseño desde la fase conceptual del proyecto y controlar el proceso de diseño para asegurar la documentación de apoyo; la primera etapa es incluir la CEM como requisito dentro de la convocatoria de licitación, con una especificación de CEM.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c31-2",
          text: "El contratista principal debe preparar al comienzo del proyecto un Plan de Gestión de la CEM que incluya, en general: una identificación de peligros (fuentes de EMI de los equipos que pueden afectar a otros equipos del entorno operativo y fuentes de EMI del medio ambiente que pueden afectar a la instalación), un listado de referencias (reglamentos de CEM, especificaciones del cliente, normas), la definición de responsabilidades del contratista principal y sus proveedores, el control de los proveedores (exigiendo su plan de CEM y documentación), la documentación entregable, la planificación temporal con hitos (como las pruebas de emisión in-situ) y un anexo con las directrices y prácticas de diseño de CEM utilizadas.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c31-3",
          text: "En grandes sistemas, cada proveedor es responsable de demostrar que su equipo cumple los requisitos de CEM especificados, presentando su Plan de Control de CEM, los Planes de Pruebas y el informe de resultados al contratista principal; el fabricante del sistema debe validar desde el punto de vista de la CEM las técnicas de instalación y cableado utilizadas.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
      ],
    },
    {
      id: "cem-concept-32",
      title: "Gestión de la CEM en España",
      claims: [
        {
          id: "cem-c32-1",
          text: "La evaluación de la CEM en los ferrocarriles españoles es doble: la primera parte la realiza el Ministerio de Fomento (Ministerio de Obras Públicas, la NSA), que expide la autorización de puesta en servicio, y la segunda parte la lleva a cabo el Administrador de Infraestructuras Ferroviarias (ADIF), que emite la autorización de funcionamiento al confirmar la compatibilidad con la red; la documentación que detalla el proceso también es doble.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c32-2",
          text: "Los procesos legales españoles se establecen mediante las Órdenes Ministeriales de materiales y las especificaciones técnicas de las homologaciones (ETH); la evaluación la realiza un panel externo formado por organismos de certificación y organismos notificados, que proporciona un certificado basado en las normas TSI (Especificaciones Técnicas de Interoperabilidad) y las ETH.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c32-3",
          text: "Además de la Documentación Técnica de la CEM, los datos de las pruebas pueden apoyar los aspectos de CEM en la documentación de seguridad del equipo; en proyectos de señalización, la documentación de CEM se puede agregar a la documentación de seguridad de la instalación ferroviaria, y la CEM constituye una parte esencial de los procesos de análisis de la seguridad.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
      ],
    },
    {
      id: "cem-concept-33",
      title: "CEM y seguridad funcional ferroviaria",
      claims: [
        {
          id: "cem-c33-1",
          text: "El diseño de los filtros de los convertidores y el control de las EMIs buscan asegurar que el sistema ferroviario y los equipos cercanos funcionen correctamente; los fallos en la detección de la posición y estado del tren provocados por interferencias podrían tener resultados catastróficos, por lo que la CEM entre los sistemas eléctricos y electrónicos es un requisito esencial para el funcionamiento fiable y seguro de la red ferroviaria.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c33-2",
          text: "Las EMIs de los equipos de tracción pueden afectar a los sistemas de señalización con consecuencias potencialmente graves; por ello la industria ferroviaria aplica un conjunto de reglas de buen diseño a todos los elementos que constituyen una línea ferroviaria, impulsadas por los organismos de normalización de CEM mediante obligaciones y normas razonables para poner a prueba los equipos.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
      ],
    },
  ],

  examples: [
    {
      id: "cem-ex-1",
      situation: "Durante el arranque de un tren, se detectan fallos de ocupación espuria en los circuitos de vía y caídas temporales en la cobertura de radio GSM-R.",
      application: [
        {
          id: "cem-ex-1-app-1",
          text: "Requiere verificar si el tren cumple con los límites de emisión marcados por la EN 50121-3-1 y si los equipos de señalización cumplen con la inmunidad de la EN 50121-4.",
          kind: "example",
          legalBasis: ["en50121"],
          review: pendingCemSyllabus,
        },
      ],
    },
    {
      id: "cem-ex-2",
      situation: "Un nuevo convertidor de potencia se instala en una subestación de tracción de 25 kV; tras la puesta en servicio aparecen interferencias en el sistema de control de tráfico centralizado.",
      application: [
        {
          id: "cem-ex-2-app-1",
          text: "Es necesario verificar el marcado CE y la documentación técnica del convertidor, así como medir las emisiones conducidas y radiadas conforme a la EN 50121 antes de su aceptación.",
          kind: "example",
          legalBasis: ["rd186-2016", "en50121"],
          review: reviewedCemPrimary,
        },
      ],
    },
    {
      id: "cem-ex-3",
      situation: "Al diseñar la sala de electrónica de un enclavamiento junto a la sala de máquinas de un convertidor de tracción, se plantea el trazado de los cables de señalización y de potencia.",
      application: [
        {
          id: "cem-ex-3-app-1",
          text: "Las buenas prácticas de ingeniería CEM del artículo asignado exigen separar los cables de señal de los de potencia, usar cables apantallados y asegurar la conexión a tierra y la unión equipotencial de chasis y armarios, reduciendo el área de bucle de la víctima y la capacidad parásita hacia la fuente de perturbación.",
          kind: "example",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
      ],
    },
    {
      id: "cem-ex-4",
      situation: "Se moderniza una línea convencional incorporando locomotoras con inversores de frecuencia; los circuitos de vía de la línea empiezan a registrar anomalías intermitentes de detección.",
      application: [
        {
          id: "cem-ex-4-app-1",
          text: "El carril es a la vez conductor de retorno de tracción y canal de las señales codificadas de los circuitos de vía; la compatibilidad entre material rodante y detección de trenes se verifica con la familia EN 50238 (circuitos de vía y contadores de ejes) y los límites de interferencia del CLC/TR 50507 citados en el artículo asignado.",
          kind: "example",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
      ],
    },
  ],

  reviewTakeaways: [
    {
      id: "cem-takeaway-1",
      text: "La Directiva 2014/30/UE se transpone en España mediante el Real Decreto 186/2016, que regula las obligaciones de marcado CE y conformidad técnica.",
      kind: "normative",
      legalBasis: ["dir-2014-30-ue", "rd186-2016"],
      review: reviewedCemPrimary,
    },
    {
      id: "cem-takeaway-2",
      text: "La familia de normas EN 50121 es el estándar técnico armonizado que detalla los métodos de ensayo de CEM en el ámbito ferroviario.",
      kind: "didactic",
      legalBasis: ["en50121"],
      review: pendingCemSyllabus,
    },
    {
      id: "cem-takeaway-3",
      text: "El artículo REE de mayo de 2015 asignado por ADIF sigue pendiente de verificación de derechos de cesión (Cemdal); el temario técnico se desarrolla con fuentes complementarias verificadas.",
      kind: "didactic",
      legalBasis: [],
      review: pendingCemSyllabus,
    },
    {
      id: "cem-takeaway-4",
      text: "Cifras y hechos memorizables del artículo asignado: la conmutación de conversión se realiza en nanosegundos con corrientes de miles de amperios y espectro hasta los GHz; las mediciones de emisión de material rodante se hacen desde un punto único a 10 m; se usan de 2 a 3 antenas simultáneas; la EN 50121 se adoptó definitivamente en 2000 (versión 2006 en vigor desde julio de 2009) y se subdivide en 6 partes; la Directiva 2014/30/UE se publicó el 29 de marzo de 2014 y entró en vigor el 20 de abril de 2016 sin cambios técnicos respecto a la anterior.",
      kind: "didactic",
      legalBasis: ["cem-ree-2015", "en50121"],
      review: reviewedCemArticle,
    },
    {
      id: "cem-takeaway-5",
      text: "Las seis partes de la EN 50121 según el artículo asignado: -1 Generalidades; -2 Emisión del sistema ferroviario completo al mundo exterior; -3-1 Material rodante (tren y vehículo completo); -3-2 Material rodante (aparatos); -4 Emisión e inmunidad de aparatos de señalización y telecomunicaciones; -5 Emisión e inmunidad de instalaciones fijas de suministro de energía y equipos asociados. Las partes 2, 3-1 y 5 exigen pruebas \"in situ\".",
      kind: "didactic",
      legalBasis: ["cem-ree-2015", "en50121"],
      review: reviewedCemArticle,
    },
    {
      id: "cem-takeaway-6",
      text: "En las instalaciones fijas, la documentación de \"buenas prácticas de ingeniería CEM\" debe custodiarla una \"persona responsable\" durante toda la vida de la instalación; la Directiva de CEM no es retroactiva y su documentación es \"viva\". En España la evaluación es doble: autorización de puesta en servicio (Ministerio) y autorización de funcionamiento por compatibilidad con la red (ADIF).",
      kind: "didactic",
      legalBasis: ["cem-ree-2015"],
      review: reviewedCemArticle,
    },
    {
      id: "cem-takeaway-7",
      text: "Medidas prácticas de inmunidad y mitigación: filtros en los convertidores para atenuar las EMIs conducidas hacia la catenaria, cables apantallados, separación de cables, conexión a tierra y buenas uniones equipotenciales de chasis y armarios, y reducción del área de bucle de los circuitos víctima.",
      kind: "didactic",
      legalBasis: ["cem-ree-2015"],
      review: reviewedCemArticle,
    },
  ],
};
