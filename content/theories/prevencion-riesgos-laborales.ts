import type { TheorySection } from "../lesson-theory";

function reviewedAgainst(article: number) {
  return {
    status: "reviewed" as const,
    confidence: {
      level: "high" as const,
      reason: `Cotejado con el artículo ${article} de BOE-A-1995-24292, texto consolidado cuya última actualización se publicó el 09-04-2026; revisión independiente pendiente.`,
    },
    reviewedAt: "2026-11-02",
  };
}

export const prlTheory: TheorySection = {
  sources: [
    {
      id: "lprl-exposicion-1",
      sourceId: "Ley 31/1995",
      sourceVersion: "consolidated-page-2026-11-02",
      verifiedAt: "2026-11-02",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Exposición de motivos, apartado 1",
      excerpt: "Fundamentos constitucionales, europeos e internacionales de la prevención."
    },
    {
      id: "lprl-exposicion",
      sourceId: "Ley 31/1995",
      sourceVersion: "consolidated-page-2026-11-02",
      verifiedAt: "2026-11-02",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Exposición de motivos, apartados 1 a 8",
      excerpt: "Fundamentos, objetivos y organización de la política preventiva expuestos por el legislador."
    },
    {
      id: "lprl-31-1995-art1",
      sourceId: "Ley 31/1995",
      sourceVersion: "consolidated-page-2026-11-02",
      verifiedAt: "2026-11-02",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 1",
      excerpt: "La normativa preventiva incluye disposiciones legales y convencionales con prescripciones preventivas.",
    },
    {
      id: "lprl-31-1995-art2",
      sourceId: "Ley 31/1995",
      sourceVersion: "consolidated-page-2026-11-02",
      verifiedAt: "2026-11-02",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 2.1 y 2.2",
      excerpt: "Promover la seguridad y salud; las disposiciones laborales son un mínimo indisponible mejorable por convenio.",
    },
    {
      id: "lprl-31-1995-art3",
      sourceId: "Ley 31/1995",
      sourceVersion: "consolidated-page-2026-11-02",
      verifiedAt: "2026-11-02",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 3.1, 3.2 y 3.3",
      excerpt: "Ámbito laboral y administrativo/estatutario, con exclusiones funcionales limitadas y peculiaridades expresas.",
    },
    {
      id: "lprl-31-1995-art4",
      sourceId: "Ley 31/1995",
      sourceVersion: "consolidated-page-2026-11-02",
      verifiedAt: "2026-11-02",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 4; ordinales 1.º–8.º",
      excerpt: "Definiciones legales de prevención, riesgos, daños, equipos y condiciones de trabajo.",
    },
    {
      id: "lprl-31-1995-art14",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 14",
      excerpt: "Los trabajadores tienen derecho a una protección eficaz en materia de seguridad y salud en el trabajo..."
    },
    {
      id: "lprl-31-1995-art15",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 15",
      excerpt: "El empresario aplicará las medidas que integran el deber general de prevención... evitando los riesgos, evaluando los que no se puedan evitar..."
    },
    {
      id: "lprl-31-1995-art16",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 16",
      excerpt: "La prevención de riesgos laborales deberá integrarse en el sistema general de gestión de la empresa... mediante la implantación y aplicación de un plan de prevención..."
    },
    {
      id: "lprl-31-1995-art18",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 18",
      excerpt: "A fin de dar cumplimiento al deber de protección... el empresario adoptará las medidas adecuadas para que los trabajadores reciban todas las informaciones necesarias..."
    },
    {
      id: "lprl-31-1995-art19",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 19",
      excerpt: "En cumplimiento del deber de protección, el empresario deberá garantizar que cada trabajador reciba una formación teórica y práctica, suficiente y adecuada, en materia preventiva, tanto en el momento de su contratación como cuando se produzcan cambios en las funciones que desempeñe o se introduzcan nuevas tecnologías o cambios en los equipos de trabajo. La formación deberá impartirse, siempre que sea posible, dentro de la jornada de trabajo o, en su defecto, en otras horas pero con el descuento en aquélla del tiempo invertido en la misma, y su coste no recaerá en ningún caso sobre los trabajadores."
    },
    {
      id: "lprl-31-1995-art20",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 20",
      excerpt: "El empresario... deberá analizar las posibles situaciones de emergencia y adoptar las medidas necesarias en materia de primeros auxilios..."
    },
    {
      id: "lprl-31-1995-art21",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 21",
      excerpt: "1. Cuando los trabajadores estén o puedan estar expuestos a un riesgo grave e inminente con ocasión de su trabajo, el empresario estará obligado a: a) Informar lo antes posible a todos los trabajadores afectados acerca de la existencia de dicho riesgo y de las medidas adoptadas o que, en su caso, deban adoptarse en materia de protección. ... 2. De acuerdo con lo previsto en el apartado 1 del artículo 14 de la presente Ley, el trabajador tendrá derecho a interrumpir su actividad y abandonar el lugar de trabajo, en caso necesario, cuando considere que dicha actividad entraña un riesgo grave e inminente para su vida o su salud. 3. Cuando en el caso a que se refiere el apartado 1 de este artículo el empresario no adopte o no permita la adopción de las medidas necesarias para garantizar la seguridad y la salud de los trabajadores, los representantes legales de éstos podrán acordar, por mayoría de sus miembros, la paralización de la actividad de los trabajadores afectados por dicho riesgo. Tal acuerdo será comunicado de inmediato a la empresa y a la autoridad laboral, la cual, en el plazo de veinticuatro horas, anulará o ratificará la paralización acordada. El acuerdo a que se refiere el párrafo anterior podrá ser adoptado por decisión mayoritaria de los Delegados de Prevención cuando no resulte posible reunir con la urgencia requerida al órgano de representación del personal."
    },
    {
      id: "lprl-31-1995-art22",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 22",
      excerpt: "El empresario garantizará a los trabajadores a su servicio la vigilancia periódica de su estado de salud en función de los riesgos inherentes al trabajo. Esta vigilancia sólo podrá llevarse a cabo cuando el trabajador preste su consentimiento. De este carácter voluntario sólo se exceptuarán, previo informe de los representantes de los trabajadores, los supuestos en los que la realización de los reconocimientos sea imprescindible para evaluar los efectos de las condiciones de trabajo sobre la salud de los trabajadores o para verificar si el estado de salud del trabajador puede constituir un peligro para el mismo, para los demás trabajadores o para otras personas relacionadas con la empresa o cuando así esté establecido en una disposición legal en relación con la protección de riesgos específicos y actividades de especial peligrosidad."
    },
    {
      id: "lprl-31-1995-art23",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 23",
      excerpt: "El empresario deberá elaborar y conservar a disposición de la autoridad laboral la siguiente documentación..."
    },
    {
      id: "lprl-31-1995-art24",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 24",
      excerpt: "Cuando en un mismo centro de trabajo desarrollen actividades trabajadores de dos o más empresas, éstas deberán cooperar en la aplicación de la normativa..."
    },
    {
      id: "lprl-31-1995-art29",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 29",
      excerpt: "Corresponde a cada trabajador velar, según sus posibilidades y mediante el cumplimiento de las medidas de prevención que en cada caso sean adoptadas..."
    },
    {
      id: "lprl-31-1995-art35",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 35",
      excerpt: "Los Delegados de Prevención son los representantes de los trabajadores con funciones específicas en materia de prevención de riesgos en el trabajo."
    },
    {
      id: "lprl-31-1995-art38",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 38",
      excerpt: "El Comité de Seguridad y Salud es el órgano paritario y colegiado de participación destinado a la consulta regular y periódica..."
    },
    {
      id: "rd773-1997-art3",
      sourceId: "RD 773/1997",
      sourceTitle: "Real Decreto 773/1997, de 30 de mayo, sobre disposiciones mínimas de seguridad y salud relativas a la utilización por los trabajadores de equipos de protección individual",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735",
      locator: "Artículo 3",
      excerpt: "En aplicación a lo dispuesto en el presente Real Decreto, el empresario estará obligado a: ... c) Proporcionar gratuitamente a los trabajadores los equipos de protección individual que deban utilizar, reponiéndolos cuando resulte necesario."
    },
    {
      id: "rd773-1997-art4",
      sourceId: "RD 773/1997",
      sourceTitle: "Real Decreto 773/1997, de 30 de mayo, sobre disposiciones mínimas de seguridad y salud relativas a la utilización por los trabajadores de equipos de protección individual",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735",
      locator: "Artículo 4",
      excerpt: "Los equipos de protección individual deberán utilizarse cuando existan riesgos para la seguridad o salud de los trabajadores que no hayan podido evitarse o limitarse suficientemente por medios técnicos de protección colectiva o mediante medidas, métodos o procedimientos de organización del trabajo."
    }
  ],

  introduction: [
    {
      id: "prl-chapter-i-intro",
      text: "El capítulo I fija el vocabulario y los límites de aplicación de la LPRL: qué integra la normativa preventiva, a quién se aplica y qué significan sus conceptos básicos. Fuente legal consultada en el BOE consolidado con última actualización publicada el 9 de abril de 2026.",
      kind: "didactic",
      legalBasis: [],
      review: {
        status: "reviewed",
        confidence: {
          level: "high",
          reason: "Introducción didáctica cotejada con la organización y los artículos 1–4 de BOE-A-1995-24292; revisión independiente pendiente.",
        },
        reviewedAt: "2026-11-02",
      },
    },
    {
      id: "prl-intro-1",
      text: "La Ley 31/1995, de 8 de noviembre, de Prevención de Riesgos Laborales (LPRL) transpone la Directiva Marco 89/391/CEE y constituye la norma básica de referencia en materia de seguridad y salud en el trabajo.",
      kind: "didactic",
      legalBasis: []
    },
    {
      id: "prl-intro-2",
      text: "Impone al empresario un deber general de protección frente a los riesgos laborales, que se extiende también a las Administraciones públicas respecto del personal a su servicio.",
      kind: "normative",
      legalBasis: ["lprl-31-1995-art14"]
    }
  ],

  concepts: [
    {
      id: "prl-exposicion-fundamentos",
      title: "Exposición de motivos: mapa para recordar",
      claims: [
        {
          id: "prl-exposicion-origen",
          text: "Apartados 1 y 2: la exposición sitúa el origen de la ley en el mandato constitucional de protección, el marco europeo y los compromisos internacionales; también busca superar la dispersión y actualizar la normativa.",
          kind: "interpretative",
          legalBasis: ["lprl-exposicion", "lprl-exposicion-1"],
          review: { status: "needs_review", confidence: { level: "medium", reason: "Contraste inicial con BOE; revisión académica independiente pendiente." } }
        },
        {
          id: "prl-exposicion-mapa",
          text: "Apartados 3 a 8: presenta el marco mínimo y su ámbito; la política pública y la cultura preventiva; los derechos y la organización preventiva; la consulta y participación; las responsabilidades y la tramitación del proyecto. Es contexto explicativo: las reglas y excepciones deben estudiarse en los artículos vigentes.",
          kind: "interpretative",
          legalBasis: ["lprl-exposicion"],
          review: { status: "needs_review", confidence: { level: "medium", reason: "Contraste inicial con BOE; revisión académica independiente pendiente." } }
        }
      ]
    },
    {
      id: "prl-concept-1",
      title: "Deber de Protección del Empresario",
      claims: [
        {
          id: "prl-c1-1",
          text: "El empresario tiene el deber legal de garantizar la seguridad y salud de los trabajadores en todos los aspectos relacionados con el trabajo.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art14"]
        }
      ]
    },
    {
      id: "prl-concept-2",
      title: "Principios de la Acción Preventiva",
      claims: [
        {
          id: "prl-c2-1",
          text: "Las medidas preventivas deben regirse por un orden jerárquico establecido por ley, priorizando evitar los riesgos antes de evaluarlos o mitigarlos.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art15"]
        },
        {
          id: "prl-c2-2",
          text: "Se adoptarán medidas que antepongan la protección colectiva a la individual.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art15"]
        }
      ]
    },
    {
      id: "prl-concept-3",
      title: "Evaluación de Riesgos",
      claims: [
        {
          id: "prl-c3-1",
          text: "La evaluación es el instrumento previo y básico para identificar peligros y estimar la probabilidad y gravedad de los daños derivados del trabajo.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art16"]
        }
      ]
    },
    {
      id: "prl-concept-4",
      title: "Planificación de la Actividad Preventiva",
      claims: [
        {
          id: "prl-c4-1",
          text: "Cuando se detecten riesgos en la evaluación, se planificará la actividad preventiva precisando plazos, responsables y recursos materiales y humanos.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art16"]
        }
      ]
    },
    {
      id: "prl-concept-5",
      title: "Información a los Trabajadores",
      claims: [
        {
          id: "prl-c5-1",
          text: "Cuando existan representantes, la información general sobre riesgos y medidas se facilita a través de ellos; además, cada trabajador recibe directamente información sobre los riesgos específicos de su puesto y las medidas aplicables.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art18"]
        }
      ]
    },
    {
      id: "prl-concept-6",
      title: "Formación de los Trabajadores",
      claims: [
        {
          id: "prl-c6-1",
          text: "El empresario garantizará formación teórica y práctica, suficiente y adecuada, en el momento de la contratación y ante cambios de funciones o introducción de nuevas tecnologías, impartida, siempre que sea posible, dentro de la jornada de trabajo y sin coste para el trabajador.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art19"]
        }
      ]
    },
    {
      id: "prl-concept-7",
      title: "Medidas de Emergencia",
      claims: [
        {
          id: "prl-c7-1",
          text: "El empresario analizará emergencias potenciales y designará al personal encargado de primeros auxilios, lucha contra incendios y evacuación.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art20"]
        }
      ]
    },
    {
      id: "prl-concept-8",
      title: "Derecho de Paralización por Riesgo Grave e Inminente",
      claims: [
        {
          id: "prl-c8-1",
          text: "El trabajador tiene derecho a interrumpir su actividad y abandonar el lugar de trabajo, en caso necesario, cuando considere que dicha actividad entraña un riesgo grave e inminente para su vida o su salud.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art21"]
        },
        {
          id: "prl-c8-2",
          text: "Los representantes legales de los trabajadores podrán acordar, por mayoría de sus miembros, la paralización de la actividad cuando el empresario no adopte o no permita la adopción de las medidas necesarias; si no resulta posible reunir con la urgencia requerida al órgano de representación del personal, el acuerdo podrá ser adoptado por decisión mayoritaria de los Delegados de Prevención.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art21"]
        }
      ]
    },
    {
      id: "prl-concept-9",
      title: "Vigilancia de la Salud",
      claims: [
        {
          id: "prl-c9-1",
          text: "La vigilancia médica es periódica y voluntaria para el trabajador, salvo en supuestos regulados de riesgo propio, para terceros o por previsión legal.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art22"]
        }
      ]
    },
    {
      id: "prl-concept-10",
      title: "Documentación Obligatoria",
      claims: [
        {
          id: "prl-c10-1",
          text: "El empresario mantendrá documentados el Plan de prevención, la Evaluación de riesgos, la Planificación, los controles de salud y la relación de accidentes con IT superior a un día.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art23"]
        }
      ]
    },
    {
      id: "prl-concept-11",
      title: "Obligaciones de los Trabajadores",
      claims: [
        {
          id: "prl-c11-1",
          text: "Los trabajadores deben velar por su propia seguridad y la de terceros usando correctamente equipos, EPIs y dispositivos de protección.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art29"]
        }
      ]
    },
    {
      id: "prl-concept-12",
      title: "Equipos de Protección Individual (EPI)",
      claims: [
        {
          id: "prl-c12-1",
          text: "Los equipos de protección individual tienen carácter subsidiario: se utilizan cuando los riesgos no hayan podido evitarse o limitarse suficientemente por medios técnicos de protección colectiva o por medidas, métodos o procedimientos de organización del trabajo.",
          kind: "normative",
          legalBasis: ["rd773-1997-art4"]
        },
        {
          id: "prl-c12-2",
          text: "El empresario está obligado a proporcionar gratuitamente los equipos de protección individual que los trabajadores deban utilizar, reponiéndolos cuando resulte necesario.",
          kind: "normative",
          legalBasis: ["rd773-1997-art3"]
        }
      ]
    },
    {
      id: "prl-concept-13",
      title: "Delegados de Prevención y Comité",
      claims: [
        {
          id: "prl-c13-1",
          text: "Los Delegados de Prevención son los representantes del personal en materia de prevención, variando su número según la escala de la plantilla.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art35"]
        },
        {
          id: "prl-c13-2",
          text: "El Comité de Seguridad y Salud es obligatorio en centros de 50 o más trabajadores, reuniéndose trimestralmente como órgano paritario consultivo.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art38"]
        }
      ]
    },
    {
      id: "prl-concept-14",
      title: "Coordinación de Actividades Empresariales",
      claims: [
        {
          id: "prl-c14-1",
          text: "Obliga a cooperar e informar recíprocamente cuando coincidan trabajadores de distintas empresas en un mismo centro de trabajo.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art24"]
        }
      ]
    },
    {
      id: "prl-concept-15",
      title: "Qué integra la normativa de prevención (artículo 1)",
      claims: [
        {
          id: "prl-c15-1",
          text: "La normativa de prevención no se limita a la Ley 31/1995: incluye sus disposiciones de desarrollo o complementarias y otras normas legales o convencionales que contengan prescripciones para adoptar medidas preventivas en el ámbito laboral o puedan producirlas.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art1"],
          review: reviewedAgainst(1),
        },
      ],
    },
    {
      id: "prl-concept-16",
      title: "Finalidad y carácter de la ley (artículo 2)",
      claims: [
        {
          id: "prl-c16-1",
          text: "La Ley persigue promover la seguridad y salud de las personas trabajadoras mediante medidas y actividades para prevenir riesgos laborales; establece principios generales para proteger, eliminar o reducir riesgos y para articular información, consulta, participación y formación.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art2"],
          review: reviewedAgainst(2),
        },
        {
          id: "prl-c16-2",
          text: "Las disposiciones laborales de la Ley y de sus normas reglamentarias son un mínimo de derecho necesario indisponible: la negociación colectiva puede mejorarlas y desarrollarlas, no rebajar ese mínimo.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art2"],
          review: reviewedAgainst(2),
        },
      ],
    },
    {
      id: "prl-concept-17",
      title: "Ámbito de aplicación y excepciones funcionales (artículo 3)",
      claims: [
        {
          id: "prl-c17-1",
          text: "La Ley se aplica a relaciones laborales y a relaciones administrativas o estatutarias del personal al servicio de las Administraciones públicas, con sus peculiaridades; también establece previsiones para obligaciones de fabricantes, importadores y suministradores, trabajo autónomo y cooperativas con actividad de trabajo personal.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art3"],
          review: reviewedAgainst(3),
        },
        {
          id: "prl-c17-2",
          text: "El artículo 3.2 dispone que la Ley no se aplica a las actividades cuyas particularidades lo impidan dentro de las funciones públicas de policía, seguridad y resguardo aduanero; de servicios operativos de protección civil y peritaje forense en casos de grave riesgo, catástrofe o calamidad pública; y de las Fuerzas Armadas y actividades militares de la Guardia Civil. La Ley inspirará la normativa específica que se dicte para salvaguardar la seguridad y salud de quienes trabajan en esas actividades.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art3"],
          review: reviewedAgainst(3),
        },
        {
          id: "prl-c17-3",
          text: "En centros y establecimientos militares se aplica la Ley con las peculiaridades de su normativa específica. En centros penitenciarios se adaptan las actividades cuyas características justifiquen una regulación especial.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art3"],
          review: reviewedAgainst(3),
        },
      ],
    },
    {
      id: "prl-concept-18",
      title: "Definiciones legales que organizan la prevención (artículo 4)",
      claims: [
        {
          id: "prl-c18-1",
          text: "El artículo 4 distingue prevención (actividades o medidas en todas las fases de actividad para evitar o disminuir riesgos), riesgo laboral (posibilidad de daño derivado del trabajo) y daño derivado del trabajo (enfermedad, patología o lesión sufrida con motivo u ocasión del trabajo). La gravedad del riesgo valora conjuntamente probabilidad y severidad.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art4"],
          review: reviewedAgainst(4),
        },
        {
          id: "prl-c18-2",
          text: "El riesgo grave e inminente es el probable racionalmente en un futuro inmediato que pueda causar un daño grave a la salud. Si hay exposición a agentes que pueden causar daños graves, basta la probabilidad racional de una exposición inmediata peligrosa aunque el daño no se manifieste de inmediato.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art4"],
          review: reviewedAgainst(4),
        },
        {
          id: "prl-c18-3",
          text: "Son potencialmente peligrosos los procesos, actividades, operaciones, equipos o productos que, sin medidas preventivas específicas, originen riesgos. Equipo de trabajo es toda máquina, aparato, instrumento o instalación utilizada en el trabajo.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art4"],
          review: reviewedAgainst(4),
        },
        {
          id: "prl-c18-4",
          text: "Condición de trabajo es cualquier característica del trabajo que pueda influir significativamente en la generación de riesgos; incluye locales, instalaciones, equipos, productos, agentes, procedimientos y organización del trabajo. EPI es el equipo llevado o sujetado para proteger frente a uno o varios riesgos, incluidos sus complementos o accesorios.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art4"],
          review: reviewedAgainst(4),
        },
      ],
    }
  ],

  examples: [
    {
      id: "prl-ex-1",
      situation: "Un técnico de ADIF debe realizar un mantenimiento en altura. Le entregan un arnés (EPI) pero la barandilla de protección colectiva del andamio no está instalada.",
      application: [
        {
          id: "prl-ex-1-app-1",
          text: "Supone un incumplimiento de la prioridad de protección colectiva frente a la individual.",
          kind: "example",
          legalBasis: ["lprl-31-1995-art15"]
        }
      ]
    },
    {
      id: "prl-ex-2",
      situation: "Durante tareas en la vía, se advierte riesgo eléctrico grave por catenaria activa sin descargar.",
      application: [
        {
          id: "prl-ex-2-app-1",
          text: "El trabajador podría ejercer su derecho a interrumpir la actividad y abandonar la zona si considera que la tarea entraña un riesgo grave e inminente para su vida o su salud.",
          kind: "example",
          legalBasis: ["lprl-31-1995-art21"]
        },
        {
          id: "prl-ex-2-app-2",
          text: "Si el empresario no adopta o no permite adoptar las medidas necesarias, los representantes del personal o los Delegados de Prevención podrían acordar la paralización de los trabajos por riesgo grave e inminente.",
          kind: "example",
          legalBasis: ["lprl-31-1995-art21"]
        }
      ]
    },
    {
      id: "prl-capitulo-i-example-1",
      situation: "En una intervención en un cuarto de comunicaciones, el equipo analiza el local, una instalación y el procedimiento de trabajo antes de comenzar. Durante el estudio separa la posibilidad de sufrir un daño de una lesión efectivamente producida.",
      application: [
        {
          id: "prl-capitulo-i-example-1-app-1",
          text: "El artículo 4 permite clasificar las características del local, la instalación y el procedimiento como condiciones de trabajo; la posibilidad de lesión como riesgo laboral; y una lesión producida con motivo u ocasión del trabajo como daño derivado del trabajo. Es una explicación de las definiciones, no una evaluación técnica de esa intervención.",
          kind: "example",
          legalBasis: ["lprl-31-1995-art4"],
          review: reviewedAgainst(4),
        },
      ],
    }
  ],

  reviewTakeaways: [
    {
      id: "prl-chapter-i-takeaway-art1",
      text: "Artículo 1: la normativa preventiva reúne la LPRL, sus normas de desarrollo o complemento y otras reglas legales o convencionales con prescripciones preventivas.",
      kind: "normative",
      legalBasis: ["lprl-31-1995-art1"],
      review: reviewedAgainst(1),
    },
    {
      id: "prl-chapter-i-takeaway-art2",
      text: "Artículos 2.1 y 2.2: finalidad preventiva y mínimo laboral indisponible que la negociación colectiva puede mejorar y desarrollar.",
      kind: "normative",
      legalBasis: ["lprl-31-1995-art2"],
      review: reviewedAgainst(2),
    },
    {
      id: "prl-chapter-i-takeaway-art3",
      text: "Artículos 3.1, 3.2 y 3.3: se aplica a relaciones laborales y públicas; las exclusiones funcionales solo operan cuando las particularidades impiden aplicar la Ley.",
      kind: "normative",
      legalBasis: ["lprl-31-1995-art3"],
      review: reviewedAgainst(3),
    },
    {
      id: "prl-chapter-i-takeaway-art4",
      text: "Artículo 4: distingue prevención, riesgo, daño y sus características, y define los conceptos de riesgo grave e inminente, equipo y condición de trabajo y EPI.",
      kind: "normative",
      legalBasis: ["lprl-31-1995-art4"],
      review: reviewedAgainst(4),
    },
    {
      id: "prl-takeaway-1",
      text: "La prevención de riesgos laborales es un deber del empresario que exige la integración de un plan formal en el sistema general de gestión.",
      kind: "normative",
      legalBasis: ["lprl-31-1995-art16"]
    },
    {
      id: "prl-takeaway-2",
      text: "El Comité de Seguridad y Salud es un órgano colegiado paritario de carácter consultivo que se constituye obligatoriamente a partir de 50 trabajadores.",
      kind: "normative",
      legalBasis: ["lprl-31-1995-art38"]
    }
  ]
};
