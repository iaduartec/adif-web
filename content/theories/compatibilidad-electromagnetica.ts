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

const reviewedCemCodex = {
  status: "reviewed",
  reviewedAt: "2026-11-04",
  reviewedBy: "codex",
  confidence: {
    level: "high",
    reason: "Cotejado con el precepto oficial concreto de la Directiva 2014/30/UE, del RD 186/2016 o de la fuente BOE indicada.",
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
    reason: "Las afirmaciones editoriales se cotejaron con el artículo REE de mayo de 2015 (pp. 80–86) en su publicación independiente de Redeweb. Esto no demuestra identidad binaria con el PDF enlazado por ADIF ni convierte el contenido técnico secundario e histórico en normativa vigente; la norma y la vigencia aplicables requieren fuentes primarias.",
  },
} as const;

export const cemTheory: TheorySection = {
  sources: [
    {
      id: "dir-2004-108-ce",
      sourceId: "Directiva 2004/108/CE",
      sourceTitle: "Directiva 2004/108/CE del Parlamento Europeo y del Consejo, de 15 de diciembre de 2004, relativa a la aproximación de las legislaciones de los Estados miembros en materia de compatibilidad electromagnética y por la que se deroga la Directiva 89/336/CEE",
      sourceUrl: "https://www.boe.es/buscar/doc.php?id=DOUE-L-2004-83048",
      locator: "Ficha BOE: datos de publicación en el DOUE",
      excerpt: "Directiva de 15 de diciembre de 2004, publicada en el DOUE L 390 de 31 de diciembre de 2004.",
    },
    {
      id: "dir-2014-30-ue-art2-13",
      sourceId: "Directiva 2014/30/UE",
      sourceTitle: "Directiva 2014/30/UE del Parlamento Europeo y del Consejo, de 26 de febrero de 2014, sobre la armonización de las legislaciones de los Estados miembros en materia de compatibilidad electromagnética",
      sourceUrl: "https://www.boe.es/buscar/doc.php?id=DOUE-L-2014-80623",
      locator: "Artículos 2 y 13",
    },
    {
      id: "dir-2014-30-ue",
      sourceId: "Directiva 2014/30/UE",
      sourceTitle:
        "Directiva 2014/30/UE del Parlamento Europeo y del Consejo, de 26 de febrero de 2014, sobre la armonización de las legislaciones de los Estados miembros en materia de compatibilidad electromagnética",
      sourceUrl: "https://www.boe.es/buscar/doc.php?id=DOUE-L-2014-80623",
      locator: "Artículo 3, definiciones",
      excerpt:
        "Compatibilidad electromagnética: capacidad de que un equipo funcione de forma satisfactoria en su entorno electromagnético sin introducir perturbaciones electromagnéticas intolerables para otros equipos en ese entorno.",
    },
    {
      id: "dir-2014-30-ue-art6-anexo1",
      sourceId: "Directiva 2014/30/UE",
      sourceTitle:
        "Directiva 2014/30/UE del Parlamento Europeo y del Consejo, de 26 de febrero de 2014, sobre la armonización de las legislaciones de los Estados miembros en materia de compatibilidad electromagnética",
      sourceUrl: "https://www.boe.es/buscar/doc.php?id=DOUE-L-2014-80623",
      locator: "Artículo 6 y anexo I, apartado 1",
      excerpt:
        "Los equipos cumplirán los requisitos esenciales establecidos en el anexo I. Su diseño y fabricación garantizarán límites a las perturbaciones generadas y protección frente a las perturbaciones previsibles.",
    },
    {
      id: "dir-2014-30-ue-art46",
      sourceId: "Directiva 2014/30/UE",
      sourceTitle: "Directiva 2014/30/UE del Parlamento Europeo y del Consejo, de 26 de febrero de 2014, sobre la armonización de las legislaciones de los Estados miembros en materia de compatibilidad electromagnética",
      sourceUrl: "https://www.boe.es/buscar/doc.php?id=DOUE-L-2014-80623",
      locator: "Artículo 46",
    },
    {
      id: "rd186-2016",
      sourceId: "Real Decreto 186/2016",
      sourceTitle:
        "Real Decreto 186/2016, de 6 de mayo, por el que se regula la compatibilidad electromagnética de los equipos eléctricos y electrónicos",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2016-4442",
      locator: "Artículo 3",
      excerpt: "Compatibilidad electromagnética: capacidad de que un equipo funcione de forma satisfactoria en su entorno electromagnético sin introducir perturbaciones electromagnéticas intolerables para otros equipos en ese entorno.",
    },
    {
      id: "rd186-2016-art7",
      sourceId: "Real Decreto 186/2016",
      sourceTitle:
        "Real Decreto 186/2016, de 6 de mayo, por el que se regula la compatibilidad electromagnética de los equipos eléctricos y electrónicos",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2016-4442",
      locator: "Artículo 7",
      excerpt:
        "Los fabricantes elaborarán la documentación técnica y llevarán a cabo el correspondiente procedimiento de evaluación de la conformidad o velarán por que se lleve a cabo; cuando se haya demostrado el cumplimiento, formularán una declaración UE de conformidad y colocarán el marcado CE.",
    },
    {
      id: "rd186-2016-anexo1",
      sourceId: "Real Decreto 186/2016",
      sourceTitle: "Real Decreto 186/2016, de 6 de mayo, por el que se regula la compatibilidad electromagnética de los equipos eléctricos y electrónicos",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2016-4442",
      locator: "Anexo I, apartado 1",
    },
    {
      id: "rd186-2016-art17",
      sourceId: "Real Decreto 186/2016",
      sourceTitle: "Real Decreto 186/2016, de 6 de mayo, por el que se regula la compatibilidad electromagnética de los equipos eléctricos y electrónicos",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2016-4442",
      locator: "Artículo 17",
    },
    {
      id: "rd186-2016-art19",
      sourceId: "Real Decreto 186/2016",
      sourceTitle: "Real Decreto 186/2016, de 6 de mayo, por el que se regula la compatibilidad electromagnética de los equipos eléctricos y electrónicos",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2016-4442",
      locator: "Artículo 19",
    },
    {
      id: "cem-ree-2015",
      sourceId: "PNI26-12PO-SPECIFIC-02",
      sourceTitle: "Compatibilidad electromagnética y seguridad en los ferrocarriles",
      sourceUrl:
        "https://www.adif.es/documents/20124/55031380/02%2BCompatibilidad%2Belectromagn%C3%A9tica%2By%2Bseguridad%2Ben%2Blos%2Bferrocarriles.pdf/66b0c76b-4910-3415-fd83-0672ec9a3068",
      locator: "Artículo REE, mayo de 2015, pp. 80–86 (cedido por Cemdal)",
      excerpt:
        "ADIF asigna este artículo al temario de la parte específica 26/12PO (PNI26/01). El texto editorial se cotejó con la publicación independiente de REE, pp. 80–86 (https://www.redeweb.com/ficheros/articulos/cemdal_870487183.pdf); esta referencia independiente no demuestra identidad binaria con el PDF enlazado por ADIF. El contenido técnico del artículo es secundario e histórico, no normativa vigente.",
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
        "Parte relativa a la emisión del sistema ferroviario completo hacia el exterior; el texto íntegro y la edición vigente no se han cotejado aquí.",
    },
    {
      id: "en50121-p3",
      sourceId: "EN 50121",
      sourceTitle: "Norma armonizada europea de compatibilidad electromagnética en aplicaciones ferroviarias",
      sourceUrl: "https://www.adif.es/w/pni26-01-personal-operativo",
      locator: "Parte 3-2, material rodante: aparatos",
      excerpt:
        "Parte relativa a los aparatos del material rodante; el texto íntegro y la edición vigente no se han cotejado aquí.",
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
      text: "La compatibilidad electromagnética es la capacidad de un equipo para funcionar satisfactoriamente en su entorno sin introducir perturbaciones electromagnéticas intolerables para otros equipos. La inmunidad es un concepto distinto: la aptitud para funcionar sin degradación ante perturbaciones electromagnéticas.",
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
      text: "ADIF asigna a esta unidad el artículo \"Compatibilidad electromagnética y seguridad en los ferrocarriles\" (Revista Española de Electrónica, mayo de 2015, pp. 80–86, cedido por Cemdal, autoría de Francesc Daura Luna). Su texto se ha cotejado con la publicación editorial independiente de REE en Redeweb (https://www.redeweb.com/ficheros/articulos/cemdal_870487183.pdf); esto no acredita identidad binaria con el PDF enlazado por ADIF. El artículo es una fuente secundaria e histórica: los requisitos legales se contrastan por separado con la Directiva 2014/30/UE y el RD 186/2016 del BOE.",
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
          text: "Los requisitos esenciales combinan dos objetivos: limitar la emisión de perturbaciones para permitir el funcionamiento previsto de otros equipos y proporcionar inmunidad suficiente frente a perturbaciones previsibles para evitar una degradación inaceptable en el uso previsto.",
          kind: "normative",
          legalBasis: ["rd186-2016-anexo1"],
          review: reviewedCemCodex,
        },
      ],
    },
    {
      id: "cem-concept-2",
      title: "Directiva CEM 2014/30/UE",
      claims: [
        {
          id: "cem-c2-1",
          text: "La Directiva 2014/30/UE, incorporada en España mediante el Real Decreto 186/2016, establece requisitos esenciales de protección para los equipos comprendidos en su ámbito de aplicación. Su artículo 2 contempla exclusiones y la prevalencia de legislación europea más específica para los requisitos que esta regule.",
          kind: "normative",
          legalBasis: ["dir-2014-30-ue-art2-13", "dir-2014-30-ue-art6-anexo1", "rd186-2016"],
          review: reviewedCemPrimary,
        },
        {
          id: "cem-c2-2",
          text: "El anexo I de la Directiva exige que el diseño y la fabricación limiten las perturbaciones generadas a un nivel que permita funcionar a los equipos de radio, telecomunicaciones y demás equipos según su finalidad; también exige protección ante perturbaciones previsibles.",
          kind: "normative",
          legalBasis: ["dir-2014-30-ue-art6-anexo1"],
          review: reviewedCemCodex,
        },
      ],
    },
    {
      id: "cem-concept-3",
      title: "Norma UNE-EN 50121",
      claims: [
        {
          id: "cem-c3-1",
          text: "La serie EN 50121 aborda la compatibilidad electromagnética en aplicaciones ferroviarias mediante distintas partes para sistemas, material e instalaciones. La condición de norma armonizada vigente depende de la parte, edición, alcance y referencia publicada, que deben comprobarse antes de aplicarla.",
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
          text: "La figura 6 del artículo REE de 2015 presenta límites de cuasi-pico de emisiones radiadas a 10 metros para prueba estacionaria e identifica EN 50121-3-1. Es una descripción de esa fuente histórica, no un cotejo de la edición vigente de la norma.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
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
          text: "El fabricante debe elaborar la documentación técnica y llevar a cabo el procedimiento de evaluación de la conformidad aplicable o velar por que se lleve a cabo. Una vez demostrada la conformidad, formulará la declaración UE de conformidad y colocará el marcado CE, visible, legible e indeleble sobre el aparato o su placa; si esto no fuera posible o no pudiera garantizarse por la naturaleza del aparato, se colocará en el embalaje y los documentos adjuntos.",
          kind: "normative",
          legalBasis: ["rd186-2016-art7", "rd186-2016-art17"],
          review: reviewedCemCodex,
        },
      ],
    },
    {
      id: "cem-concept-16",
      title: "Inmunidad en Instalaciones Fijas Ferroviarias",
      claims: [
        {
          id: "cem-c16-1",
          text: "La parte 3-2 de EN 50121 trata los aparatos del material rodante; la parte 4 aborda los aparatos de señalización y telecomunicaciones. El artículo REE explica esta división, pero aquí no se ha cotejado el texto íntegro ni la edición vigente de esas normas.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015", "en50121-p3"],
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
          text: "El artículo de 2015 describe cómo las conmutaciones de convertidores de tracción pueden generar interferencias radiadas y perturbaciones acopladas al cableado y a la alimentación. La lectura que distingue esa conmutación electrónica del cambio del tren entre redes de alimentación es una interpretación del contexto: la formulación del artículo puede resultar ambigua.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c20-2",
          text: "El artículo REE de 2015 indica que el cambio entre sistemas de alimentación puede ocurrir en unos pocos nanosegundos y, después, describe emisiones de las conmutaciones de convertidores. Esa secuencia no demuestra que el tiempo citado sea el de conmutación de los convertidores ni un valor representativo general; cualquier parámetro de equipo requiere verificación técnica específica.",
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
          text: "El artículo de 2015 afirma que se añaden filtros a los convertidores para atenuar las EMI que pueden conducirse hacia la catenaria. Se recoge como explicación técnica de esa fuente histórica, no como obligación legal ni regla universal de diseño aplicable a todo convertidor.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c24-2",
          text: "El artículo REE de 2015 relaciona el diseño de filtros con las transiciones rápidas y el espectro de las perturbaciones de convertidores. Sus cifras de corriente, tiempo y frecuencia deben cotejarse para el equipo y ensayo concretos antes de tratarlas como magnitudes generales.",
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
          text: "La Directiva 2004/108/CE, fechada el 15 de diciembre de 2004, se publicó en el DOUE L 390 el 31 de diciembre de 2004. Incluía aparatos e instalaciones fijas dentro de su ámbito; su aplicación a equipos ferroviarios depende de que estén comprendidos en ese ámbito y de sus exclusiones.",
          kind: "normative",
          legalBasis: ["dir-2004-108-ce"],
          review: reviewedCemCodex,
        },
        {
          id: "cem-c25-2",
          text: "La Directiva 2014/30/UE se publicó el 29 de marzo de 2014. Su artículo 46 distingue la entrada en vigor, veinte días después de su publicación, de la aplicación desde el 20 de abril de 2016 de los preceptos que enumera.",
          kind: "normative",
          legalBasis: ["dir-2014-30-ue-art46"],
          review: reviewedCemCodex,
        },
        {
          id: "cem-c25-3",
          text: "La normativa distingue aparatos e instalaciones fijas. El régimen de marcado y evaluación depende del supuesto: el artículo 19 del RD 186/2016 contempla, bajo sus condiciones, aparatos destinados a una instalación fija concreta que de otra manera no se comercializarían. Los procedimientos de evaluación deben determinarse conforme al régimen aplicable.",
          kind: "normative",
          legalBasis: ["rd186-2016", "rd186-2016-art19"],
          review: reviewedCemCodex,
        },
      ],
    },
    {
      id: "cem-concept-26",
      title: "Requisitos legales frente a normas técnicas",
      claims: [
        {
          id: "cem-c26-1",
          text: "La Directiva obliga a que los equipos comprendidos en su ámbito cumplan los requisitos esenciales aplicables; contempla aparatos e instalaciones fijas y establece exclusiones. Las normas armonizadas son voluntarias: su aplicación da presunción de conformidad únicamente respecto de los requisitos que cubren.",
          kind: "normative",
          legalBasis: ["dir-2014-30-ue-art2-13", "rd186-2016-anexo1"],
          review: reviewedCemCodex,
        },
        {
          id: "cem-c26-2",
          text: "El artículo REE de 2015 atribuye a la edición de EN 50121 que cita una advertencia: cumplir la norma hace probable la conformidad CEM, pero la complejidad ferroviaria impide garantizarla al 100 %. También presenta las normas ferroviarias como mínimos técnicos que pueden requerir complementarse mediante identificación de peligros y riesgos; esta descripción histórica no fija por sí sola la edición ni los requisitos vigentes.",
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
          text: "Una instalación fija combina aparatos y, en su caso, otros dispositivos, ensamblados e instalados para uso permanente en un sitio predefinido. Debe instalarse conforme a buenas prácticas de ingeniería. Un aparato comercializado que pueda incorporarse a ella debe cumplir todos los requisitos del real decreto; hay una excepción específica para el destinado a una instalación fija concreta que de otra manera no se comercializaría.",
          kind: "normative",
          legalBasis: ["rd186-2016", "rd186-2016-art19", "rd186-2016-anexo1"],
          review: reviewedCemCodex,
        },
        {
          id: "cem-c27-2",
          text: "El artículo técnico REE de 2015 explica la documentación de buenas prácticas de ingeniería y describe una persona responsable capaz de determinar la conformidad de la configuración de la instalación fija; también recomienda aclarar responsabilidades en contratos y documentación de entrega. Esta descripción del artículo no sustituye la comprobación de las obligaciones legales aplicables a cada instalación.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c27-3",
          text: "Para un aparato destinado a incorporarse en una instalación fija concreta y que de otra manera no se comercializaría, el artículo 19 exceptúa los requisitos de los artículos 6 a 12 y 14 a 18. La documentación adjunta identifica la instalación y sus características CEM, indica las precauciones para no comprometer su conformidad e incluye la información a la que remite el artículo 19: identificación del aparato y datos del fabricante e importador conforme a los preceptos señalados.",
          kind: "normative",
          legalBasis: ["rd186-2016-art19"],
          review: reviewedCemCodex,
        },
        {
          id: "cem-c27-4",
          text: "El artículo de 2015 describe la documentación CEM de instalaciones ferroviarias existentes como documentación que puede actualizarse con el tiempo y expone un reparto de responsabilidades durante la construcción y explotación. Sus afirmaciones sobre retroactividad y responsables no sustituyen la normativa aplicable a cada instalación.",
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
          text: "El artículo de 2015 describe mediciones de emisiones con puntos de observación situados a 10 metros de la vía. Distingue la parte 2, relativa al sistema ferroviario hacia el exterior, y la parte 3-1, relativa al tren y vehículo completo; debe verificarse la edición aplicable para cada ensayo.",
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
          text: "El artículo de 2015 describía una evaluación en dos partes atribuida al entonces Ministerio de Fomento y a ADIF. Es una descripción histórica del artículo, no una identificación del procedimiento vigente de autorización, que requiere consultar la normativa ferroviaria aplicable.",
          kind: "didactic",
          legalBasis: ["cem-ree-2015"],
          review: reviewedCemArticle,
        },
        {
          id: "cem-c32-2",
          text: "El artículo de 2015 describía los procesos españoles mediante órdenes de materiales y especificaciones técnicas de homologación y mencionaba la intervención de organismos de certificación y notificados. Para conocer las exigencias actuales hay que comprobar la normativa y las especificaciones aplicables al caso.",
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
      text: "Puede investigarse la posible relación entre las emisiones del tren y las anomalías de los circuitos de vía, y entre las perturbaciones y las caídas de radio. Las partes EN 50121-3-1 y -4 son referencias que cita el material; antes de usarlas como criterio hay que comprobar su edición, ámbito y aplicabilidad al equipo.",
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
          text: "Documenta los síntomas y encarga una evaluación técnica de la compatibilidad del equipo y la instalación conforme a su régimen y configuración. Selecciona las mediciones y normas pertinentes para el caso y verifica su edición y aplicabilidad; la aparición de interferencias no impone por sí sola una prueba universal de aceptación EN 50121.",
          kind: "example",
          legalBasis: ["rd186-2016-art19", "en50121"],
          review: pendingCemSyllabus,
        },
      ],
    },
    {
      id: "cem-ex-3",
      situation: "Al diseñar la sala de electrónica de un enclavamiento junto a la sala de máquinas de un convertidor de tracción, se plantea el trazado de los cables de señalización y de potencia.",
      application: [
        {
          id: "cem-ex-3-app-1",
          text: "Como opciones de diseño, el artículo asignado describe separar los cables de señal y potencia, apantallar, unir equipotencialmente chasis y armarios y reducir el área de bucle. La selección depende del análisis de acoplamiento y del diseño de la instalación.",
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
          text: "El carril puede servir de retorno de tracción y participar en los circuitos de vía. Para investigar las anomalías, identifica primero el sistema de detección y las perturbaciones observadas; el artículo asignado cita EN 50238 y CLC/TR 50507 como referencias posibles, pero su edición y aplicabilidad deben comprobarse para el caso.",
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
      text: "La Directiva 2014/30/UE se incorpora en España mediante el Real Decreto 186/2016, que regula la evaluación de conformidad y las obligaciones de los agentes económicos, incluido el marcado CE de los aparatos comprendidos en su ámbito.",
      kind: "normative",
      legalBasis: ["dir-2014-30-ue", "rd186-2016"],
      review: reviewedCemPrimary,
    },
    {
      id: "cem-takeaway-2",
      text: "La serie EN 50121 reúne normas técnicas de CEM ferroviaria. La condición de armonizada y la presunción de conformidad deben comprobarse para cada parte, edición y requisito cubierto, a partir de las referencias publicadas aplicables.",
      kind: "didactic",
      legalBasis: ["en50121"],
      review: pendingCemSyllabus,
    },
    {
      id: "cem-takeaway-3",
      text: "La identidad del ejemplar exacto del artículo REE de mayo de 2015 enlazado por ADIF y las condiciones de uso siguen pendientes de cotejo; las fuentes técnicas y normativas complementarias se identifican por separado.",
      kind: "didactic",
      legalBasis: [],
      review: pendingCemSyllabus,
    },
    {
      id: "cem-takeaway-4",
      text: "Las cifras y descripciones de conmutación, medición y EN 50121 se cotejaron con una publicación editorial independiente del artículo REE (mayo de 2015, pp. 80–86); esto no acredita identidad binaria con el PDF asignado por ADIF. Se mantienen como contenido histórico, no como valores generales ni datos vigentes; la edición normativa aplicable debe comprobarse aparte. La Directiva 2014/30/UE se publicó el 29 de marzo de 2014; su artículo 46 distingue su entrada en vigor de las fechas de aplicación de determinados preceptos, entre ellas el 20 de abril de 2016.",
      kind: "normative",
      legalBasis: ["cem-ree-2015", "en50121", "dir-2014-30-ue-art46"],
      review: pendingCemSyllabus,
    },
    {
      id: "cem-takeaway-5",
      text: "El artículo REE de 2015 expone una estructura y unos ensayos de la familia EN 50121 propios de la edición que describe. La vigencia, armonización y alcance de cada parte deben comprobarse en la edición aplicable; este resumen histórico no basta para fijar requisitos de ensayo actuales.",
      kind: "didactic",
      legalBasis: ["cem-ree-2015", "en50121"],
      review: pendingCemSyllabus,
    },
    {
      id: "cem-takeaway-6",
      text: "El artículo REE de 2015 describe la gestión documental y el reparto de responsabilidades en instalaciones ferroviarias conforme al marco que expone. No establece por sí solo una regla general de irretroactividad ni el procedimiento vigente de autorización; ambos extremos deben determinarse con la normativa aplicable al caso.",
      kind: "didactic",
      legalBasis: ["cem-ree-2015"],
      review: reviewedCemArticle,
    },
    {
      id: "cem-takeaway-7",
      text: "El artículo REE de 2015 propone filtros, apantallamiento, separación de cables, conexión equipotencial y reducción del área de bucle como medidas de mitigación. Son opciones de diseño que deben seleccionarse según el análisis del acoplamiento y las condiciones de la instalación; no son una lista universal de obligaciones legales.",
      kind: "didactic",
      legalBasis: ["cem-ree-2015"],
      review: reviewedCemArticle,
    },
  ],
};
