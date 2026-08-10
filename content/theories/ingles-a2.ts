import type { TheorySection } from "../lesson-theory";

export const inglesA2Theory: TheorySection = {
  sources: [
    {
      id: "mcer-ingles-a2",
      sourceId: "MCER-A2",
      sourceTitle: "Marco Común Europeo de Referencia para las Lenguas, nivel A2",
      sourceUrl: "https://www.coe.int/en/web/common-european-framework-reference-languages/introduction-and-context",
      locator: "Nivel de Usuario Básico A2",
      excerpt: "Describe la capacidad de comprender frases y expresiones de uso frecuente relacionadas con áreas de experiencia que le son especialmente relevantes."
    }
  ],

  introduction: [
    {
      id: "ingles-intro-1",
      text: "La prueba de inglés para el acceso a puestos de personal operativo de ADIF evalúa las competencias comunicativas y lingüísticas correspondientes al nivel A2 del MCER.",
      kind: "didactic",
      legalBasis: ["mcer-ingles-a2"]
    }
  ],

  concepts: [
    {
      id: "ingles-concept-1",
      title: "El Pasado Simple (Past Simple)",
      claims: [
        {
          id: "ingles-c1-1",
          text: "Se utiliza para acciones completadas en el pasado. Los verbos regulares añaden '-ed' al infinitivo, mientras que los irregulares cambian su ortografía (ej: went, bought).",
          kind: "didactic",
          legalBasis: ["mcer-ingles-a2"]
        },
        {
          id: "ingles-c1-2",
          text: "Al formular preguntas o negaciones con el auxiliar 'did', el verbo principal adopta de forma preceptiva su forma base de infinitivo.",
          kind: "didactic",
          legalBasis: ["mcer-ingles-a2"]
        }
      ]
    },
    {
      id: "ingles-concept-2",
      title: "Verbos Modales de Obligación y Prohibición",
      claims: [
        {
          id: "ingles-c2-1",
          text: "'Must' indica obligación estricta. 'Must not' expresa prohibición absoluta de seguridad. 'Have to' denota obligación externa normativa.",
          kind: "didactic",
          legalBasis: ["mcer-ingles-a2"]
        },
        {
          id: "ingles-c2-2",
          text: "'Don't have to' o 'doesn't have to' expresa ausencia de obligación, indicando que una acción es opcional o no necesaria.",
          kind: "didactic",
          legalBasis: ["mcer-ingles-a2"]
        }
      ]
    },
    {
      id: "ingles-concept-3",
      title: "Vocabulario Ferroviario Técnico A2",
      claims: [
        {
          id: "ingles-c3-1",
          text: "Términos recurrentes en enunciados: Platform (andén), Track (vía), Train driver (maquinista), Delay (retraso) y Level crossing (paso a nivel).",
          kind: "didactic",
          legalBasis: ["mcer-ingles-a2"]
        }
      ]
    }
  ],

  examples: [
    {
      id: "ingles-ex-1",
      situation: "Se presenta la frase incompleta: 'The technician ___ (repair) the signal yesterday.'",
      application: [
        {
          id: "ingles-ex-1-app-1",
          text: "El término temporal 'yesterday' exige el pasado simple. Al ser regular, se completa como 'repaired'.",
          kind: "example",
          legalBasis: ["mcer-ingles-a2"]
        }
      ]
    }
  ],

  reviewTakeaways: [
    {
      id: "ingles-takeaway-1",
      text: "El uso de 'must not' implica prohibición de seguridad, a diferencia de 'don't have to' que indica mera opcionalidad.",
      kind: "didactic",
      legalBasis: ["mcer-ingles-a2"]
    }
  ]
};
