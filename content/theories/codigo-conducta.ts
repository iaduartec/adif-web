import type { TheorySection } from "../lesson-theory";

/**
 * Editorial state for the claims added or re-verified in Ciclo 8C (EBEP).
 * Every new claim ID needs explicit review metadata because the legacy
 * claim-review-manifest only knows the original ten IDs.
 */
const verifiedConducta = {
  status: "reviewed",
  reviewedAt: "2026-11-04",
  reviewedBy: "ciclo-8c-deepseek",
  confidence: {
    level: "high",
    reason:
      "Texto cotejado literalmente con BOE-A-2015-11719 (texto refundido del TREBEP, " +
      "consolidado; la modificación de 01/03/2023 corresponde al artículo 53.4). " +
      "Cotejo repetido el 2026-11-04 sobre el PDF oficial consolidado del BOE " +
      "(SHA-256 11cfda7f…), artículo por artículo; las citas de los artículos 53 y 54 " +
      "se completaron para no cortar cláusulas operativas.",
  },
} as const;

export const codigoConductaTheory: TheorySection = {
  sources: [
    {
      id: "rdleg-5-2015-art2",
      sourceId: "TREBEP",
      sourceTitle: "Real Decreto Legislativo 5/2015, de 30 de octubre, por el que se aprueba el texto refundido de la Ley del Estatuto Básico del Empleado Público",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
      locator: "Artículo 2",
    },
    {
      id: "rdleg-5-2015-art7",
      sourceId: "TREBEP",
      sourceTitle: "Real Decreto Legislativo 5/2015, de 30 de octubre, por el que se aprueba el texto refundido de la Ley del Estatuto Básico del Empleado Público",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
      locator: "Artículo 7",
    },
    {
      id: "rd2395-2004-art27-contexto",
      sourceId: "RD 2395/2004",
      sourceTitle: "Real Decreto 2395/2004, de 30 de diciembre, por el que se aprueba el Estatuto de la entidad pública empresarial Administrador de Infraestructuras Ferroviarias",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2004-21913",
      locator: "Artículo 27",
    },
    {
      id: "rdleg-5-2015-art93-94",
      sourceId: "TREBEP",
      sourceTitle: "Real Decreto Legislativo 5/2015, de 30 de octubre, por el que se aprueba el texto refundido de la Ley del Estatuto Básico del Empleado Público",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
      sourceVersion: "consolidated-page-2026-10-15",
      locator: "Artículos 93 y 94"
    },
    {
      id: "rdleg-5-2015-art52",
      sourceId: "TREBEP",
      sourceTitle:
        "Real Decreto Legislativo 5/2015, de 30 de octubre, por el que se aprueba el texto refundido de la Ley del Estatuto Básico del Empleado Público",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
      locator: "Artículo 52",
      excerpt:
        "Los empleados públicos deberán desempeñar con diligencia las tareas que tengan asignadas y velar por los intereses generales con sujeción y observancia de la Constitución y del resto del ordenamiento jurídico, y deberán actuar con arreglo a los siguientes principios: objetividad, integridad, neutralidad, responsabilidad, imparcialidad, confidencialidad, dedicación al servicio público, transparencia, ejemplaridad, austeridad, accesibilidad, eficacia, honradez, promoción del entorno cultural y medioambiental, y respeto a la igualdad entre mujeres y hombres, que inspiran el Código de Conducta de los empleados públicos configurado por los principios éticos y de conducta regulados en los artículos siguientes. Los principios y reglas establecidos en este capítulo informarán la interpretación y aplicación del régimen disciplinario de los empleados públicos."
    },
    {
      id: "rdleg-5-2015-art53",
      sourceId: "TREBEP",
      sourceTitle:
        "Real Decreto Legislativo 5/2015, de 30 de octubre, por el que se aprueba el texto refundido de la Ley del Estatuto Básico del Empleado Público",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
      locator: "Artículo 53",
      excerpt:
        "Artículo 53. Principios éticos. 1. Los empleados públicos respetarán la Constitución y el resto de normas que integran el ordenamiento jurídico. […] 5. Se abstendrán en aquellos asuntos en los que tengan un interés personal, así como de toda actividad privada o interés que pueda suponer un riesgo de plantear conflictos de intereses con su puesto público. […] 7. No aceptarán ningún trato de favor o situación que implique privilegio o ventaja injustificada, por parte de personas físicas o entidades privadas. […] 12. Guardarán secreto de las materias clasificadas u otras cuya difusión esté prohibida legalmente, y mantendrán la debida discreción sobre aquellos asuntos que conozcan por razón de su cargo, sin que puedan hacer uso de la información obtenida para beneficio propio o de terceros, o en perjuicio del interés público."
    },
    {
      id: "rdleg-5-2015-art53-3-8",
      sourceId: "TREBEP",
      sourceTitle: "Real Decreto Legislativo 5/2015, de 30 de octubre, por el que se aprueba el texto refundido de la Ley del Estatuto Básico del Empleado Público",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
      sourceVersion: "consolidated-page-2026-10-15",
      locator: "Artículo 53.3 y 53.8"
    },
    {
      id: "rdleg-5-2015-art53-10-11",
      sourceId: "TREBEP",
      sourceTitle: "Real Decreto Legislativo 5/2015, de 30 de octubre, por el que se aprueba el texto refundido de la Ley del Estatuto Básico del Empleado Público",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
      sourceVersion: "consolidated-page-2026-10-15",
      locator: "Artículo 53.10 y 53.11"
    },
    {
      id: "rdleg-5-2015-art53-5",
      sourceId: "TREBEP",
      sourceTitle: "Real Decreto Legislativo 5/2015, de 30 de octubre, por el que se aprueba el texto refundido de la Ley del Estatuto Básico del Empleado Público",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
      sourceVersion: "consolidated-page-2026-10-15",
      locator: "Artículo 53.5"
    },
    {
      id: "rdleg-5-2015-art54-4-8-11",
      sourceId: "TREBEP",
      sourceTitle: "Real Decreto Legislativo 5/2015, de 30 de octubre, por el que se aprueba el texto refundido de la Ley del Estatuto Básico del Empleado Público",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
      sourceVersion: "consolidated-page-2026-10-15",
      locator: "Artículo 54.4, 54.8 y 54.11"
    },
    {
      id: "rdleg-5-2015-art54",
      sourceId: "TREBEP",
      sourceTitle:
        "Real Decreto Legislativo 5/2015, de 30 de octubre, por el que se aprueba el texto refundido de la Ley del Estatuto Básico del Empleado Público",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
      locator: "Artículo 54",
      excerpt:
        "Artículo 54. Principios de conducta. 1. Tratarán con atención y respeto a los ciudadanos, a sus superiores y a los restantes empleados públicos. 2. El desempeño de las tareas correspondientes a su puesto de trabajo se realizará de forma diligente y cumpliendo la jornada y el horario establecidos. 3. Obedecerán las instrucciones y órdenes profesionales de los superiores, salvo que constituyan una infracción manifiesta del ordenamiento jurídico, en cuyo caso las pondrán inmediatamente en conocimiento de los órganos de inspección procedentes. […] 5. Administrarán los recursos y bienes públicos con austeridad, y no utilizarán los mismos en provecho propio o de personas allegadas. Tendrán, asimismo, el deber de velar por su conservación. 6. Se rechazará cualquier regalo, favor o servicio en condiciones ventajosas que vaya más allá de los usos habituales, sociales y de cortesía, sin perjuicio de lo establecido en el Código Penal. […] 9. Observarán las normas sobre seguridad y salud laboral. […] 11. Garantizarán la atención al ciudadano en la lengua que lo solicite siempre que sea oficial en el territorio."
    }
  ],

  introduction: [
    {
      id: "conducta-intro-1",
      text: "El Código de Conducta de los empleados públicos está regulado en el Título III, Capítulo VI del TREBEP (aprobado por el RD Legislativo 5/2015).",
      kind: "normative",
      legalBasis: ["rdleg-5-2015-art52"]
    },
    {
      id: "conducta-intro-2",
      text: "Se integra por principios éticos y de conducta y es aplicable al personal laboral de ADIF. Ello no convierte a este personal en funcionario ni elimina la aplicación de la legislación laboral y del convenio que corresponda.",
      kind: "interpretative",
      legalBasis: ["rdleg-5-2015-art52", "rdleg-5-2015-art2", "rdleg-5-2015-art7", "rd2395-2004-art27-contexto"]
    }
  ],

  concepts: [
    {
      id: "conducta-concept-1",
      title: "Deberes Generales y principios inspiradores (art. 52)",
      claims: [
        {
          id: "conducta-c1-1",
          text: "Los empleados públicos deben actuar con diligencia, objetividad, integridad, neutralidad y transparencia, velando permanentemente por los intereses generales.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art52"]
        },
        {
          id: "conducta-c1-2",
          text:
            "El artículo 52 del TREBEP enumera quince principios que inspiran el Código de Conducta: objetividad, integridad, neutralidad, responsabilidad, imparcialidad, confidencialidad, dedicación al servicio público, transparencia, ejemplaridad, austeridad, accesibilidad, eficacia, honradez, promoción del entorno cultural y medioambiental, y respeto a la igualdad entre mujeres y hombres.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art52"],
          review: verifiedConducta
        },
        {
          id: "conducta-c1-3",
          text:
            "Los principios y reglas del capítulo informan la interpretación y aplicación del régimen disciplinario de los empleados públicos. El artículo 52 no establece por sí solo una falta ni una sanción concreta.",
          kind: "interpretative",
          legalBasis: ["rdleg-5-2015-art52"],
          review: verifiedConducta
        }
      ]
    },
    {
      id: "conducta-concept-2",
      title: "Principios Éticos (art. 53)",
      claims: [
        {
          id: "conducta-c2-1",
          text: "Entre los principios éticos se incluye la abstención en los asuntos en los que el empleado tenga un interés personal y el deber de no aceptar tratos de favor o situaciones que impliquen un privilegio o ventaja injustificada por parte de personas físicas o entidades privadas.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art53"]
        },
        {
          id: "conducta-c2-2",
          text:
            "El artículo 53 del TREBEP desarrolla doce principios éticos: respeto al ordenamiento jurídico; persecución del interés general con imparcialidad; lealtad y buena fe; respeto de los derechos fundamentales y prohibición de discriminación; abstención ante interés personal o conflicto de intereses; prohibición de contraer obligaciones económicas con conflicto de intereses; prohibición de aceptar tratos de favor o privilegios; actuación conforme a eficacia, economía y eficiencia; no influir en la agilización de trámites sin justa causa; diligencia y resolución en plazo; dedicación al servicio público y neutralidad; y deber de secreto y discreción.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art53"],
          review: verifiedConducta
        },
        {
          id: "conducta-c2-3",
          text:
            "El deber de secreto y discreción es el principio ético número doce del artículo 53, y converge con la 'confidencialidad' que el artículo 52 lista entre los principios generales: ambos protegen la información conocida por razón del cargo, pero el artículo 53 añade la prohibición de usarla en beneficio propio o de terceros o en perjuicio del interés público.",
          kind: "interpretative",
          legalBasis: ["rdleg-5-2015-art53", "rdleg-5-2015-art52"],
          review: verifiedConducta
        },
        {
          id: "conducta-c2-4",
          text: "La actuación debe perseguir los intereses generales y basarse en consideraciones objetivas orientadas a la imparcialidad y al interés común, al margen de posiciones personales, familiares, corporativas, clientelares u otros factores que puedan colisionar con ese principio.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art53"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con el artículo 53.2 del TREBEP consolidado del BOE." } }
        },
        {
          id: "conducta-c2-5",
          text: "El artículo 53, apartado sexto, prohíbe contraer obligaciones económicas o intervenir en operaciones financieras, obligaciones patrimoniales o negocios jurídicos con personas o entidades cuando ello pueda suponer un conflicto de intereses con las obligaciones del puesto público.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art53"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con el artículo 53.6 del TREBEP consolidado del BOE." } }
        },
        {
          id: "conducta-c2-6",
          text: "El artículo 53, apartado noveno, prohíbe influir en la agilización o resolución de un trámite o procedimiento administrativo sin justa causa y, en ningún caso, cuando comporte un privilegio en beneficio de titulares de cargos públicos o su entorno familiar y social inmediato, o cuando suponga un menoscabo de intereses de terceros.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art53"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con el artículo 53.9 del TREBEP consolidado del BOE." } }
        },
        {
          id: "conducta-c2-7",
          text: "El artículo 53, apartado cuarto, exige respetar derechos fundamentales y libertades públicas y evitar toda actuación que pueda discriminar por nacimiento, origen racial o étnico, género, sexo, orientación e identidad sexual, expresión de género, características sexuales, religión o convicciones, opinión, discapacidad, edad o cualquier otra condición o circunstancia personal o social.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art53"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con el artículo 53.4 del TREBEP y la reforma de la Ley 4/2023." } }
        },
        {
          id: "conducta-c2-8",
          text: "El artículo 53.3 exige lealtad y buena fe con la Administración en que se prestan servicios y con superiores, compañeros, subordinados y ciudadanos. El 53.8 añade eficacia, economía y eficiencia, y la vigilancia del interés general y de los objetivos de la organización.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art53-3-8"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex-revisor-trebep", confidence: { level: "high", reason: "Revisión independiente frente a los apartados tercero y octavo del artículo 53 del BOE." } }
        },
        {
          id: "conducta-c2-9",
          text: "El artículo 53.10 exige cumplir con diligencia las tareas propias o encomendadas y, en su caso, resolver en plazo los procedimientos o expedientes de la propia competencia. El 53.11 exige dedicación al servicio público y abstenerse también de conductas que comprometan la neutralidad al ejercerlo.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art53-10-11"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex-revisor-trebep", confidence: { level: "high", reason: "Revisión independiente frente a los apartados décimo y undécimo del artículo 53 del BOE." } }
        }
      ]
    },
    {
      id: "conducta-concept-3",
      title: "Principios de Conducta (art. 54)",
      claims: [
        {
          id: "conducta-c3-1",
          text:
            "El artículo 54 del TREBEP enumera once principios de conducta del servicio diario: trato respetuoso, diligencia y cumplimiento de jornada, obediencia a las instrucciones de los superiores salvo infracción manifiesta, información a los ciudadanos sobre las materias o asuntos que tengan derecho a conocer, austeridad en el uso de recursos públicos, rechazo de regalos y favores, constancia y permanencia de documentos para su transmisión y entrega, actualización de la formación, observancia de la seguridad y salud laboral, formulación de propuestas de mejora y atención al ciudadano en la lengua solicitada cuando sea oficial en el territorio.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art54"],
          review: verifiedConducta
        },
        {
          id: "conducta-c3-4",
          text: "Los recursos y bienes públicos se administran con austeridad, no se utilizan en provecho propio ni de personas allegadas y debe velarse por su conservación.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art54"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con el artículo 54.5 del TREBEP consolidado del BOE." } }
        },
        {
          id: "conducta-c3-2",
          text:
            "La regla de rechazo de regalos figura en el artículo 54: se rechazará cualquier regalo, favor o servicio en condiciones ventajosas que vaya más allá de los usos habituales, sociales y de cortesía, sin perjuicio de lo establecido en el Código Penal. No es una norma del artículo 53, sino del apartado de principios de conducta.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art54", "rdleg-5-2015-art53"],
          review: verifiedConducta
        },
        {
          id: "conducta-c3-3",
          text:
            "Entre los principios de conducta figura la observancia de las normas de seguridad y salud laboral, lo que conecta el Código de Conducta con la prevención de riesgos en el ámbito ferroviario: el empleado debe respetar las normas preventivas como parte de su comportamiento ordinario.",
          kind: "interpretative",
          legalBasis: ["rdleg-5-2015-art54"],
          review: verifiedConducta
        },
        {
          id: "conducta-c3-5",
          text: "El artículo 54, apartado séptimo, exige garantizar la constancia y permanencia de los documentos para transmitirlos y entregarlos a sus posteriores responsables.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art54"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con el artículo 54.7 del TREBEP consolidado del BOE." } }
        },
        {
          id: "conducta-c3-6",
          text: "El artículo 54, apartado décimo, exige poner en conocimiento de los superiores o de los órganos competentes las propuestas adecuadas para mejorar el desarrollo de las funciones de la unidad en la que estén destinados. A estos efectos puede preverse una instancia que centralice propuestas de empleados públicos o administrados para mejorar la eficacia del servicio.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art54"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con el artículo 54.10 del TREBEP consolidado del BOE." } }
        },
        {
          id: "conducta-c3-7",
          text: "El artículo 54.4 exige informar a los ciudadanos sobre las materias o asuntos que tengan derecho a conocer y facilitar el ejercicio de sus derechos y el cumplimiento de sus obligaciones. El 54.8 exige mantener actualizadas la formación y la cualificación; el 54.11 garantiza la atención en la lengua solicitada siempre que sea oficial en el territorio.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art54-4-8-11"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex-revisor-trebep", confidence: { level: "high", reason: "Revisión independiente frente a los apartados cuarto, octavo y undécimo del artículo 54 del BOE." } }
        }
      ]
    },
    {
      id: "conducta-concept-4",
      title: "Objeción a Órdenes de Superiores (art. 54.3)",
      claims: [
        {
          id: "conducta-c4-1",
          text: "Los empleados públicos obedecerán las instrucciones y órdenes profesionales de los superiores, salvo que constituyan una infracción manifiesta del ordenamiento jurídico, en cuyo caso deberán ponerlas inmediatamente en conocimiento de los órganos de inspección procedentes.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art54"]
        }
      ]
    },
    {
      id: "conducta-concept-5",
      title: "Secreto Profesional y Confidencialidad (art. 53.12)",
      claims: [
        {
          id: "conducta-c5-1",
          text: "Exige guardar secreto de las materias clasificadas u otras cuya difusión esté prohibida legalmente y mantener la debida discreción sobre los asuntos conocidos por razón del cargo, sin usar la información obtenida en beneficio propio o de terceros o en perjuicio del interés público.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art53"]
        }
      ]
    },
    {
      id: "conducta-concept-6",
      title: "Conexión con el Régimen Disciplinario (art. 52, último párrafo)",
      claims: [
        {
          id: "conducta-c6-1",
          text: "Los principios y reglas del Código de Conducta informan la interpretación y aplicación del régimen disciplinario de los empleados públicos, según el último párrafo del artículo 52.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art52"],
          review: verifiedConducta
        },
        {
          id: "conducta-c6-2",
          text:
            "Como contexto, el artículo 93 del TREBEP sujeta al personal laboral al régimen disciplinario de su título VII y remite a la legislación laboral en lo no previsto en dicho título. El artículo 94 exige legalidad y tipicidad de faltas y sanciones; en el caso del personal laboral, también mediante los convenios colectivos. Para una responsabilidad concreta hay que examinar los hechos, la infracción y el procedimiento aplicables: el artículo 52 no tipifica por sí mismo una falta ni determina una sanción.",
          kind: "interpretative",
          legalBasis: ["rdleg-5-2015-art52", "rdleg-5-2015-art93-94"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex-revisor-trebep", confidence: { level: "high", reason: "Revisión independiente de los artículos 52, 93 y 94 del TREBEP; la valoración concreta depende del régimen y los hechos aplicables." } }
        }
      ]
    },
    {
      id: "conducta-concept-7",
      title: "Ámbito de aplicación subjetivo",
      claims: [
        {
          id: "conducta-c7-1",
          text:
            "ADIF es una entidad pública empresarial: su personal laboral está comprendido en el ámbito del TREBEP en lo que proceda y le son aplicables los deberes y principios del Código de Conducta. El artículo 7 remite también a la legislación laboral y a las normas convencionales, y el artículo 27 del Estatuto de ADIF sujeta el régimen de su personal laboral al Derecho laboral. Para valorar un incumplimiento y sus consecuencias hay que atender a los hechos y al régimen aplicable; no toda regla del TREBEP corresponde a un vínculo de funcionario.",
          kind: "interpretative",
          legalBasis: ["rdleg-5-2015-art2", "rdleg-5-2015-art7", "rdleg-5-2015-art52", "rd2395-2004-art27-contexto"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex-revisor-trebep", confidence: { level: "high", reason: "Revisión independiente: aplicación directa apoyada por las instrucciones estatales de 5 de junio de 2007, apartados 4 y 12; las responsabilidades concretas dependen del régimen y los hechos." } }
        }
      ]
    }
  ],

  examples: [
    {
      id: "conducta-ex-1",
      situation: "Un empleado del departamento de compras de ADIF acepta una invitación de fin de semana con todos los gastos pagados por parte de una empresa proveedora de traviesas.",
      application: [
        {
          id: "conducta-ex-1-app-1",
          text: "Debe considerarse la regla del artículo 54 sobre regalos, favores o servicios en condiciones ventajosas que superen los usos habituales, sociales y de cortesía. Las eventuales responsabilidades requieren examinar el régimen aplicable y los hechos concretos; no se deduce una sanción específica del artículo 54.",
          kind: "example",
          legalBasis: ["rdleg-5-2015-art54"]
        }
      ]
    },
    {
      id: "conducta-ex-2",
      situation: "Una persona participa en un trámite administrativo y un familiar cercano es uno de los interesados.",
      application: [
        {
          id: "conducta-ex-2-app-1",
          text: "El parentesco es una señal para examinar si existe interés personal o riesgo de conflicto con el puesto: el artículo 53.5 exige abstenerse en los asuntos con interés personal. No se deduce de este ejemplo que cualquier parentesco produzca por sí solo la misma consecuencia en todos los procedimientos; hay que comprobar las reglas de abstención aplicables.",
          kind: "example",
          legalBasis: ["rdleg-5-2015-art53-5"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex-revisor-trebep", confidence: { level: "high", reason: "Revisión independiente: señala un riesgo a valorar sin afirmar que cualquier parentesco obliga por sí mismo a abstenerse." } }
        }
      ]
    }
  ],

  reviewTakeaways: [
    {
      id: "conducta-takeaway-1",
      text: "Los principios y reglas del Código informan la interpretación y aplicación del régimen disciplinario; el artículo 52 no define por sí solo una infracción ni una sanción.",
      kind: "interpretative",
      legalBasis: ["rdleg-5-2015-art52"]
    },
    {
      id: "conducta-takeaway-2",
      text: "El apartado quinto del artículo 54 prohíbe utilizar bienes y recursos públicos en provecho propio o de personas allegadas y exige velar por su conservación. Una eventual responsabilidad requiere examinar los hechos y el régimen aplicable.",
      kind: "interpretative",
      legalBasis: ["rdleg-5-2015-art54"]
    }
  ]
};
