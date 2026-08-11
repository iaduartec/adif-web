import type { TheorySection } from "../lesson-theory";

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
        "Compatibilidad electromagnética: la capacidad de un equipo para funcionar satisfactoriamente en su entorno electromagnético sin introducir perturbaciones electromagnéticas intolerables para otros equipos y sin sufrir él mismo degradación inaceptable."
    },
    {
      id: "rd186-2016",
      sourceId: "Real Decreto 186/2016",
      sourceTitle:
        "Real Decreto 186/2016, de 6 de mayo, por el que se regula la compatibilidad electromagnética de los equipos eléctricos y electrónicos",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2016-4442",
      locator: "Artículo 3",
      excerpt: "Los equipos deberán cumplir los requisitos esenciales de protección..."
    },
    {
      id: "en50121",
      sourceId: "EN 50121",
      sourceTitle: "Norma armonizada europea de compatibilidad electromagnética en aplicaciones ferroviarias",
      sourceUrl: "https://www.adif.es/w/pni26-01-personal-operativo",
      locator: "Partes 1 a 5",
      excerpt: "Especifica los límites de emisión e inmunidad para material rodante e instalaciones fijas..."
    },
    {
      id: "adif-pni23-cem-questions",
      sourceId: "ADIF PNI23/01",
      sourceTitle: "Plantillas correctoras y cuadernillos de examen PNI23/01",
      sourceUrl:
        "https://www.adif.es/documents/20124/17165113/%2807.11.2023%29%20-%20Plantillas%20correctoras%20y%20cuadernillos%20de%20examen.pdf/dce76c5e-ae60-a0d0-568e-4f4db30c3823",
      locator: "Cuadernillos 1433 y 4101, preguntas 12 a 15, y plantillas correctoras",
      excerpt:
        "Las respuestas oficiales identifican la propagación diferencial, los criterios de compatibilidad, el efecto del área del bucle en el acoplamiento inductivo y la inmunidad."
    },
    {
      id: "adif-pni24-cem-questions",
      sourceId: "ADIF PNI24/01",
      sourceTitle: "Plantillas correctoras y cuadernillos de examen PNI24/01",
      sourceUrl:
        "https://www.adif.es/documents/20124/33942288/%2825.11.2024%29%20-%20Plantillas%20correctoras%20y%20cuadernillos%20de%20examen.pdf/7d5847b0-d613-65b0-a0a2-ae936d6e0500",
      locator: "Cuadernillos 3403 y 3413, preguntas 13 a 16, y plantillas correctoras",
      excerpt:
        "Las respuestas oficiales fijan la relación del acoplamiento capacitivo con la distancia, y las definiciones de perturbación, longitud de onda e índice de distorsión armónica."
    },
    {
      id: "adif-pni25-cem-questions",
      sourceId: "ADIF PNI25/01",
      sourceTitle: "Plantillas correctoras y cuadernillos de examen PNI25/01",
      sourceUrl:
        "https://www.adif.es/documents/20124/45240815/%2818.11.2025%29%2B-%2BPlantillas%2Bcorrectoras%2By%2Bcuadernillos%2Bde%2Bexamen.pdf/a2b9f608-83b0-34ee-0aa4-aba4ee6baf6b",
      locator: "Cuadernillos 1131 y 4104, preguntas 13 a 16, y plantillas correctoras",
      excerpt:
        "Las respuestas oficiales cubren el alcance y fecha de la Directiva CEM, el uso de convertidores ferroviarios y la medición con varias antenas."
    }
  ],

  introduction: [
    {
      id: "cem-intro-1",
      text: "La compatibilidad electromagnética (CEM) es la capacidad de un equipo para funcionar satisfactoriamente sin introducir perturbaciones electromagnéticas intolerables y sin sufrir degradaciones inaceptables.",
      kind: "normative",
      legalBasis: ["dir-2014-30-ue"]
    },
    {
      id: "cem-intro-2",
      text: "En el entorno ferroviario, la CEM es un factor de seguridad crítico debido a la coexistencia de sistemas sensibles y fuentes de tracción eléctrica de gran potencia.",
      kind: "didactic",
      legalBasis: ["en50121"]
    }
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
          legalBasis: ["rd186-2016"]
        }
      ]
    },
    {
      id: "cem-concept-2",
      title: "Directiva CEM 2014/30/UE",
      claims: [
        {
          id: "cem-c2-1",
          text: "Directiva europea transpuesta en España mediante el Real Decreto 186/2016. Define los requisitos esenciales de protección para aparatos comercializados en la UE.",
          kind: "normative",
          legalBasis: ["dir-2014-30-ue", "rd186-2016"]
        }
      ]
    },
    {
      id: "cem-concept-3",
      title: "Norma UNE-EN 50121",
      claims: [
        {
          id: "cem-c3-1",
          text: "Es la norma armonizada de CENELEC específica para la CEM en ferrocarriles, que prescribe los ensayos y límites de emisión e inmunidad de material e instalaciones.",
          kind: "didactic",
          legalBasis: ["en50121"]
        }
      ]
    },
    {
      id: "cem-concept-4",
      title: "Acoplamiento Electromagnético",
      claims: [
        {
          id: "cem-c4-1",
          text: "El acoplamiento describe la transferencia de energía perturbadora de la fuente a la víctima. Puede ser conducido, inductivo (campo magnético) o capacitivo (campo eléctrico).",
          kind: "didactic",
          legalBasis: ["en50121"]
        }
      ]
    },
    {
      id: "cem-concept-5",
      title: "Medición y Ensayos",
      claims: [
        {
          id: "cem-c5-1",
          text: "Los ensayos de emisión radiada de material rodante en prueba estacionaria se miden por norma armonizada a una distancia de 10 metros utilizando detector de cuasi-pico.",
          kind: "didactic",
          legalBasis: ["en50121"]
        }
      ]
    },
    {
      id: "cem-concept-6",
      title: "Interferencia Conducida en Modo Diferencial",
      claims: [
        {
          id: "cem-c6-1",
          text: "Una interferencia electromagnética conducida se propaga en modo diferencial cuando circula únicamente por los conductores activos del sistema.",
          kind: "didactic",
          legalBasis: ["adif-pni23-cem-questions"]
        }
      ]
    },
    {
      id: "cem-concept-7",
      title: "Reducción del Acoplamiento Inductivo",
      claims: [
        {
          id: "cem-c7-1",
          text: "Para reducir el acoplamiento inductivo se disminuye el área del bucle víctima, se incrementa la distancia o se reduce el campo magnético; aumentar el área del bucle produce el efecto contrario.",
          kind: "didactic",
          legalBasis: ["adif-pni23-cem-questions"]
        }
      ]
    },
    {
      id: "cem-concept-8",
      title: "Distancia en el Acoplamiento Capacitivo",
      claims: [
        {
          id: "cem-c8-1",
          text: "En el acoplamiento capacitivo, cuanto menor es la distancia entre el conductor fuente y el conductor víctima, mayor es la tensión inducida.",
          kind: "didactic",
          legalBasis: ["adif-pni24-cem-questions"]
        }
      ]
    },
    {
      id: "cem-concept-9",
      title: "Perturbación Electromagnética",
      claims: [
        {
          id: "cem-c9-1",
          text: "La señal eléctrica no deseada que se suma a la señal útil se denomina perturbación electromagnética.",
          kind: "didactic",
          legalBasis: ["adif-pni24-cem-questions"]
        }
      ]
    },
    {
      id: "cem-concept-10",
      title: "Longitud de Onda",
      claims: [
        {
          id: "cem-c10-1",
          text: "La distancia recorrida por una onda durante el tiempo de una oscilación completa se denomina longitud de onda.",
          kind: "didactic",
          legalBasis: ["adif-pni24-cem-questions"]
        }
      ]
    },
    {
      id: "cem-concept-11",
      title: "Índice de Distorsión Armónica",
      claims: [
        {
          id: "cem-c11-1",
          text: "El Índice de Distorsión Armónica (IDA) es inversamente proporcional a la amplitud de la componente fundamental o armónico de rango 1.",
          kind: "didactic",
          legalBasis: ["adif-pni24-cem-questions"]
        }
      ]
    },
    {
      id: "cem-concept-12",
      title: "Alcance y Publicación de la Directiva CEM",
      claims: [
        {
          id: "cem-c12-1",
          text: "En el temario evaluado por ADIF, la Directiva de compatibilidad electromagnética se presenta como aplicable a todos los equipos electrónicos y la directiva vigente se publicó en marzo de 2014.",
          kind: "didactic",
          legalBasis: ["adif-pni25-cem-questions"]
        }
      ]
    },
    {
      id: "cem-concept-13",
      title: "Convertidores de Potencia Ferroviarios",
      claims: [
        {
          id: "cem-c13-1",
          text: "Una razón principal para utilizar convertidores de potencia en las redes ferroviarias es la necesidad de cambiar entre dos o más tipos de líneas de suministro de energía.",
          kind: "didactic",
          legalBasis: ["adif-pni25-cem-questions"]
        }
      ]
    },
    {
      id: "cem-concept-14",
      title: "Medición de Emisiones de Trenes en Movimiento",
      claims: [
        {
          id: "cem-c14-1",
          text: "Las emisiones electromagnéticas de los trenes en movimiento se miden con varias antenas simultáneas para recibir todo el ancho de banda que debe medirse.",
          kind: "didactic",
          legalBasis: ["adif-pni25-cem-questions"]
        }
      ]
    }
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
          legalBasis: ["en50121"]
        }
      ]
    }
  ],

  reviewTakeaways: [
    {
      id: "cem-takeaway-1",
      text: "La Directiva 2014/30/UE se transpone en España mediante el Real Decreto 186/2016, que regula las obligaciones de marcado CE y conformidad técnica.",
      kind: "normative",
      legalBasis: ["dir-2014-30-ue", "rd186-2016"]
    },
    {
      id: "cem-takeaway-2",
      text: "La familia de normas EN 50121 es el estándar técnico armonizado que detalla los métodos de ensayo de CEM en el ámbito ferroviario.",
      kind: "didactic",
      legalBasis: ["en50121"]
    }
  ]
};
