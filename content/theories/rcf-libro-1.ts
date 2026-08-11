import type { TheorySection } from "../lesson-theory";

export const rcfLibro1Theory: TheorySection = {
  sources: [
    {
      id: "rd664-2015-1-1-1-1",
      sourceId: "RD 664/2015",
      sourceTitle:
        "Real Decreto 664/2015, de 17 de julio, por el que se aprueba el Reglamento de Circulación Ferroviaria",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-8042",
      locator: "Capítulo 1, 1.1.1.1 Objeto del Reglamento",
      excerpt: "1. El objeto de este Reglamento es establecer reglas operativas generales para que la circulación de los trenes y de las maniobras se realice de forma segura, eficiente y puntual, tanto en condiciones de explotación normal como degradada..."
    },
    {
      id: "rd664-2015-1-1-1-3",
      sourceId: "RD 664/2015",
      sourceTitle:
        "Real Decreto 664/2015, de 17 de julio, por el que se aprueba el Reglamento de Circulación Ferroviaria",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-8042",
      locator: "Capítulo 1, 1.1.1.3 Definiciones",
      excerpt: "17. Estación: Infraestructura ferroviaria consistente en una instalación de vías y sus aparatos asociados, protegida por señales, y en la que se desarrollan procesos de circulación. A efectos de este Reglamento se consideran estación los PB, PBA, PCA, PAET y las Bifurcaciones. También, los Cambiadores de Ancho y las Bases de Mantenimiento, cuando no estén integrados dentro de otra estación. ... 42. Telefonema: Comunicación reglamentaria en los procesos de circulación, caracterizada por un formato preestablecido, identificada mediante un número secuencial, la hora de transmisión y la identificación del emisor, y que queda registrada..."
    },
    {
      id: "rd664-2015-1-2-1-1",
      sourceId: "RD 664/2015",
      sourceTitle:
        "Real Decreto 664/2015, de 17 de julio, por el que se aprueba el Reglamento de Circulación Ferroviaria",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-8042",
      locator: "Capítulo 1, 1.2.1.1 Documentación",
      excerpt: "En caso de discrepancia entre documentos en referencia a un mismo objeto, se seguirá el siguiente orden de prevalencia: AESF y normas europeas, AI, EF."
    },
    {
      id: "rd664-2015-1-4-1",
      sourceId: "RD 664/2015",
      sourceTitle:
        "Real Decreto 664/2015, de 17 de julio, por el que se aprueba el Reglamento de Circulación Ferroviaria",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-8042",
      locator: "Capítulo 1, 1.4.1.1 Comunicaciones",
      excerpt: "8. Las comunicaciones por telefonema consisten en la transmisión a distancia de un texto determinado. ... Los AI y las EF desarrollarán en sus respectivos SGS las normas para llevar a cabo las comunicaciones relacionadas con la seguridad... En particular, deberán definir su estructura y metodología, que será acorde con lo dispuesto en la ETI OPE."
    },
    {
      id: "rd664-2015-1-5-1-4",
      sourceId: "RD 664/2015",
      sourceTitle:
        "Real Decreto 664/2015, de 17 de julio, por el que se aprueba el Reglamento de Circulación Ferroviaria",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-8042",
      locator: "Capítulo 1, 1.5.1.4 Condiciones de marcha especiales",
      excerpt: "1. Marcha a la vista: Impone al maquinista la obligación de avanzar con la precaución que requiera el caso, regulando la velocidad de acuerdo con la longitud de vía que visualiza por delante del puesto de conducción, de forma que pueda detener el tren ante cualquier obstáculo o señal de parada. 2. Marcha de maniobras: Impone al maquinista la obligación de avanzar con prudencia, sin exceder la velocidad de 30 km/h si la locomotora va tirando del tren, o de 20 km/h si va empujándolo, de forma que pueda detener el tren ante cualquier obstáculo visible desde el puesto de conducción o ante una señal de parada."
    }
  ],

  introduction: [
    {
      id: "rcf-intro-1",
      text: "El Reglamento de Circulación Ferroviaria (RCF), aprobado por el Real Decreto 664/2015, regula la circulación de los trenes y las maniobras en la RFIG.",
      kind: "normative",
      legalBasis: ["rd664-2015-1-1-1-1"]
    },
    {
      id: "rcf-intro-2",
      text: "El Libro Primero, de principios fundamentales, establece el objeto, las definiciones y las reglas que vinculan a todos los agentes que intervienen en los procesos de circulación.",
      kind: "normative",
      legalBasis: ["rd664-2015-1-1-1-1"]
    }
  ],

  concepts: [
    {
      id: "rcf-concept-1",
      title: "Objeto y Reglas Operativas",
      claims: [
        {
          id: "rcf-c1-1",
          text: "El Reglamento tiene por objeto que la circulación de los trenes y de las maniobras se realice de forma segura, eficiente y puntual, tanto en condiciones de explotación normal como degradada.",
          kind: "normative",
          legalBasis: ["rd664-2015-1-1-1-1"]
        }
      ]
    },
    {
      id: "rcf-concept-2",
      title: "Prevalencia de la Documentación",
      claims: [
        {
          id: "rcf-c2-1",
          text: "En caso de discrepancia entre documentos en relación con un mismo objeto, el orden de prevalencia es el siguiente: la Agencia Estatal de Seguridad Ferroviaria (AESF) y las normas europeas, después los Administradores de Infraestructuras (AI) y, en último lugar, las Empresas Ferroviarias (EF).",
          kind: "normative",
          legalBasis: ["rd664-2015-1-2-1-1"]
        }
      ]
    },
    {
      id: "rcf-concept-3",
      title: "Definición de Estación",
      claims: [
        {
          id: "rcf-c3-1",
          text: "Estación es la infraestructura consistente en una instalación de vías y sus aparatos asociados, protegida por señales, en la que se desarrollan procesos de circulación. A efectos reglamentarios se consideran estación los PB, PBA, PCA, PAET y las bifurcaciones.",
          kind: "normative",
          legalBasis: ["rd664-2015-1-1-1-3"]
        }
      ]
    },
    {
      id: "rcf-concept-4",
      title: "Marcha de Maniobras",
      claims: [
        {
          id: "rcf-c4-1",
          text: "La marcha de maniobras impone al maquinista avanzar con prudencia, sin exceder la velocidad de 30 km/h si la locomotora va tirando del tren, o de 20 km/h si va empujándolo, de forma que pueda detener el tren ante cualquier obstáculo o señal de parada.",
          kind: "normative",
          legalBasis: ["rd664-2015-1-5-1-4"]
        }
      ]
    },
    {
      id: "rcf-concept-5",
      title: "Marcha a la Vista",
      claims: [
        {
          id: "rcf-c5-1",
          text: "La marcha a la vista impone al maquinista avanzar con la precaución que requiera el caso, regulando la velocidad conforme a la longitud de vía que visualiza, de forma que pueda detener el tren ante cualquier obstáculo o señal de parada.",
          kind: "normative",
          legalBasis: ["rd664-2015-1-5-1-4"]
        }
      ]
    },
    {
      id: "rcf-concept-6",
      title: "Comunicaciones Reglamentarias: El Telefonema",
      claims: [
        {
          id: "rcf-c6-1",
          text: "El telefonema es una comunicación reglamentaria caracterizada por un formato preestablecido, identificada mediante un número secuencial, la hora de transmisión y la identificación del emisor, y queda registrada mediante los soportes contemplados en el Reglamento.",
          kind: "normative",
          legalBasis: ["rd664-2015-1-1-1-3"]
        }
      ]
    }
  ],

  examples: [
    {
      id: "rcf-ex-1",
      situation: "Un responsable de circulación dicta a un maquinista por telefonema una orden y se la identifica con su número correlativo, hora y emisor, quedando registrada.",
      application: [
        {
          id: "rcf-ex-1-app-1",
          text: "La comunicación reglamentaria debe ajustarse al formato preestablecido, llevar número secuencial, hora e identificación del emisor y quedar registrada. Las normas detalladas de su estructura y metodología las desarrollan los AI y las EF en sus respectivos SGS.",
          kind: "example",
          legalBasis: ["rd664-2015-1-4-1"]
        }
      ]
    }
  ],

  reviewTakeaways: [
    {
      id: "rcf-takeaway-1",
      text: "La marcha de maniobras limita a 30 km/h al tirar del convoy, y a 20 km/h cuando la locomotora va empujando.",
      kind: "normative",
      legalBasis: ["rd664-2015-1-5-1-4"]
    },
    {
      id: "rcf-takeaway-2",
      text: "El telefonema se identifica mediante un número secuencial, la hora de transmisión y la identificación del emisor, y queda registrada; su estructura concreta la definen los AI y las EF en sus SGS.",
      kind: "interpretative",
      legalBasis: ["rd664-2015-1-1-1-3", "rd664-2015-1-4-1"]
    }
  ]
};
