import type { TheorySection } from "../lesson-theory";

export const inglesA2Theory: TheorySection = {
  sources: [
    {
      id: "mcer-ingles-a2",
      sourceId: "MCER-A2",
      sourceTitle: "Marco Común Europeo de Referencia para las Lenguas (MCER)",
      sourceUrl: "https://www.coe.int/en/web/common-european-framework-reference-languages/introduction-and-context",
      locator: "Nivel de Usuario Básico A2",
      excerpt: "Describe la capacidad de comprender frases y expresiones de uso frecuente relacionadas con áreas de experiencia que le son especialmente relevantes."
    }
  ],

  introduction: [
    {
      id: "ingles-intro-1",
      text: "Este módulo prepara inglés funcional A2 como currículo didáctico. No acredita por sí mismo el nivel oficial de una convocatoria ni la frecuencia histórica de cada estructura.",
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
          text: "Vocabulario ferroviario complementario: Platform (andén), Track (vía), Train driver (maquinista), Delay (retraso) y Level crossing (paso a nivel).",
          kind: "didactic",
          legalBasis: ["mcer-ingles-a2"]
        }
      ]
    },
    {
      "id": "ingles-topic-there-is-are",
      "title": "There is / There are",
      "claims": [
        {
          "id": "ingles-topic-there-is-are-rule",
          "text": "There are acompaña a un sustantivo plural: two towels.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-present-simple",
      "title": "Present Simple",
      "claims": [
        {
          "id": "ingles-topic-present-simple-rule",
          "text": "Every Monday indica una rutina. En tercera persona singular se añade -s: rides.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-present-continuous",
      "title": "Present Continuous",
      "claims": [
        {
          "id": "ingles-topic-present-continuous-rule",
          "text": "Una acción en curso ahora se expresa con be + verbo en -ing: is sleeping.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-future",
      "title": "Future forms",
      "claims": [
        {
          "id": "ingles-topic-future-rule",
          "text": "Be going to + infinitivo permite una predicción apoyada en indicios presentes: las nubes.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-comparatives",
      "title": "Comparatives",
      "claims": [
        {
          "id": "ingles-topic-comparatives-rule",
          "text": "Para comparar dos objetos con el adjetivo corto light se usa lighter than.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-prepositions",
      "title": "Prepositions",
      "claims": [
        {
          "id": "ingles-topic-prepositions-rule",
          "text": "Se usa at con horas concretas y on con días: at 9:15 on Friday.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-quantifiers",
      "title": "Quantifiers",
      "claims": [
        {
          "id": "ingles-topic-quantifiers-rule",
          "text": "En esta oración negativa any acompaña al sustantivo incontable milk. Many y a few se usan con plurales contables.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-countable-uncountable",
      "title": "Countable / uncountable nouns",
      "claims": [
        {
          "id": "ingles-topic-countable-uncountable-rule",
          "text": "Advice es incontable: some advice o a piece of advice. Apple, chair y suitcase admiten plural contable.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-simple-conditionals",
      "title": "Simple conditionals",
      "claims": [
        {
          "id": "ingles-topic-simple-conditionals-rule",
          "text": "El primer condicional expresa una posibilidad futura: if + presente, will + infinitivo.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-vocabulary",
      "title": "Everyday vocabulary",
      "claims": [
        {
          "id": "ingles-topic-vocabulary-rule",
          "text": "Key significa llave y encaja con abrir una puerta cerrada con llave.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-signs-notices",
      "title": "Signs and notices",
      "claims": [
        {
          "id": "ingles-topic-signs-notices-rule",
          "text": "Closed on Sundays indica que el establecimiento permanece cerrado los domingos.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-short-messages",
      "title": "Short messages",
      "claims": [
        {
          "id": "ingles-topic-short-messages-rule",
          "text": "Here se refiere al lugar desde el que Ana escribe, el café. La hora de encuentro es las seis.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-emails",
      "title": "Short emails",
      "claims": [
        {
          "id": "ingles-topic-emails-rule",
          "text": "Ten minutes early significa diez minutos antes: el martes a las 9:50, no después de las diez.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-everyday-situations",
      "title": "Everyday situations",
      "claims": [
        {
          "id": "ingles-topic-everyday-situations-rule",
          "text": "You are welcome es una respuesta natural a un agradecimiento por una ayuda.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-shops",
      "title": "Shops",
      "claims": [
        {
          "id": "ingles-topic-shops-rule",
          "text": "Change significa el dinero que te devuelven al pagar: diez menos cuatro son seis libras.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-hotels",
      "title": "Hotels",
      "claims": [
        {
          "id": "ingles-topic-hotels-rule",
          "text": "Check in es registrarse al llegar a un hotel. Take off se usa, entre otros sentidos, para despegar.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-airports",
      "title": "Airports",
      "claims": [
        {
          "id": "ingles-topic-airports-rule",
          "text": "Boarding indica embarque y gate significa puerta. Debes dirigirte a la puerta seis.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-health",
      "title": "Health",
      "claims": [
        {
          "id": "ingles-topic-health-rule",
          "text": "Toothache significa dolor de muelas o dientes. El profesional correspondiente es el dentista.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
        }
      ]
    },
    {
      "id": "ingles-topic-reading-comprehension",
      "title": "Reading comprehension",
      "claims": [
        {
          "id": "ingles-topic-reading-comprehension-rule",
          "text": "El texto dice has lunch at home. La respuesta se localiza directamente sin deducir dónde trabaja Nora.",
          "kind": "didactic",
          "legalBasis": [],
          "review": {
            "status": "reviewed",
            "reviewedAt": "2026-10-16",
            "reviewedBy": "codex-editorial",
            "confidence": {
              "level": "high",
              "reason": "Explicación didáctica original comprobada junto con sus cuatro opciones; no acredita frecuencia histórica ADIF."
            }
          }
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
