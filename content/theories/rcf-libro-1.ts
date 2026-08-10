import type { TheorySection } from "../lesson-theory";

export const rcfLibro1Theory: TheorySection = {
  sources: [
    {
      id: "rd664-2015-art1-1",
      sourceId: "RD 664/2015",
      sourceTitle: "Reglamento de Circulación Ferroviaria, Libro Primero",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-8042",
      locator: "Artículo 1.1",
      excerpt: "La seguridad es el principio rector de la circulación ferroviaria..."
    },
    {
      id: "rd664-2015-art1-3",
      sourceId: "RD 664/2015",
      sourceTitle: "Reglamento de Circulación Ferroviaria, Libro Primero",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-8042",
      locator: "Artículo 1.3",
      excerpt: "Regula la clasificación y el orden de prevalencia de la documentación reglamentaria..."
    },
    {
      id: "rd664-2015-art1-4",
      sourceId: "RD 664/2015",
      sourceTitle: "Reglamento de Circulación Ferroviaria, Libro Primero",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-8042",
      locator: "Artículo 1.4",
      excerpt: "Establece las definiciones de estación, cantón y bloqueo..."
    },
    {
      id: "rd664-2015-art1-5",
      sourceId: "RD 664/2015",
      sourceTitle: "Reglamento de Circulación Ferroviaria, Libro Primero",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-8042",
      locator: "Artículo 1.5",
      excerpt: "Define las condiciones y tipos de marcha (maniobras, a la vista, con precaución)..."
    },
    {
      id: "rd664-2015-art1-7",
      sourceId: "RD 664/2015",
      sourceTitle: "Reglamento de Circulación Ferroviaria, Libro Primero",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-8042",
      locator: "Artículo 1.7",
      excerpt: "Establece las normas para las comunicaciones reglamentarias y el telefonema..."
    }
  ],

  introduction: [
    {
      id: "rcf-intro-1",
      text: "El Reglamento de Circulación Ferroviaria (RCF), aprobado por el Real Decreto 664/2015, es la norma básica de seguridad de la circulación en la RFIG.",
      kind: "normative",
      legalBasis: ["rd664-2015-art1-1"]
    },
    {
      id: "rcf-intro-2",
      text: "El Libro Primero establece los principios comunes, definiciones y reglas que vinculan a todos los agentes en tareas de seguridad.",
      kind: "normative",
      legalBasis: ["rd664-2015-art1-1"]
    }
  ],

  concepts: [
    {
      id: "rcf-concept-1",
      title: "La Seguridad como Principio Rector",
      claims: [
        {
          id: "rcf-c1-1",
          text: "El principio supremo del reglamento es garantizar la seguridad en todas las operaciones ferroviarias, anteponiéndola ante cualquier otra circunstancia.",
          kind: "normative",
          legalBasis: ["rd664-2015-art1-1"]
        }
      ]
    },
    {
      id: "rcf-concept-2",
      title: "Prevalencia de la Documentación",
      claims: [
        {
          id: "rcf-c2-1",
          text: "En caso de discrepancia en una norma operativa, el orden de prevalencia sitúa las directrices de la AESF y ADIF por encima del Libro de Normas de la Empresa Ferroviaria.",
          kind: "normative",
          legalBasis: ["rd664-2015-art1-3"]
        }
      ]
    },
    {
      id: "rcf-concept-3",
      title: "Definición de Estación",
      claims: [
        {
          id: "rcf-c3-1",
          text: "Infraestructura con instalación de vías protegida por señales donde se desarrollan procesos de cruce, adelantamiento o estacionamiento. Asimila PB, PAET, PBA, PCA y bifurcaciones.",
          kind: "normative",
          legalBasis: ["rd664-2015-art1-4"]
        }
      ]
    },
    {
      id: "rcf-concept-4",
      title: "Marcha de Maniobras",
      claims: [
        {
          id: "rcf-c4-1",
          text: "Obliga al maquinista a avanzar con prudencia pudiendo parar ante cualquier obstáculo. Velocidad máxima de 30 km/h tirando de la composición, y 20 km/h empujándola.",
          kind: "normative",
          legalBasis: ["rd664-2015-art1-5"]
        }
      ]
    },
    {
      id: "rcf-concept-5",
      title: "Marcha a la Vista",
      claims: [
        {
          id: "rcf-c5-1",
          text: "Impone regular la velocidad del tren en función del alcance visual, garantizando la detención inmediata del convoy ante cualquier obstáculo o indicación restrictiva.",
          kind: "normative",
          legalBasis: ["rd664-2015-art1-5"]
        }
      ]
    },
    {
      id: "rcf-concept-6",
      title: "Comunicaciones Reglamentarias: El Telefonema",
      claims: [
        {
          id: "rcf-c6-1",
          text: "El telefonema es la comunicación de circulación numerada y horaria registrada formalmente. Es imperativo colacionar (repetir íntegramente) el texto para verificar la exactitud.",
          kind: "normative",
          legalBasis: ["rd664-2015-art1-7"]
        }
      ]
    }
  ],

  examples: [
    {
      id: "rcf-ex-1",
      situation: "Un responsable de circulación dicta a un maquinista por telefonema una orden de rebasado de señal, pero el maquinista no procede a colacionar de vuelta.",
      application: [
        {
          id: "rcf-ex-1-app-1",
          text: "La falta de colación invalida el procedimiento. Ningún movimiento puede autorizarse de este modo sin confirmar la repetición literal de la instrucción.",
          kind: "example",
          legalBasis: ["rd664-2015-art1-7"]
        }
      ]
    }
  ],

  reviewTakeaways: [
    {
      id: "rcf-takeaway-1",
      text: "La marcha de maniobras limita estrictamente a 30 km/h al tirar del convoy, y a 20 km/h cuando la locomotora va empujando.",
      kind: "didactic",
      legalBasis: ["rd664-2015-art1-5"]
    },
    {
      id: "rcf-takeaway-2",
      text: "El telefonema exige de forma obligatoria el uso de fórmulas preestablecidas, número correlativo, hora y la colación por el receptor.",
      kind: "interpretative",
      legalBasis: ["rd664-2015-art1-7"]
    }
  ]
};
