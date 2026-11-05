import type { TheorySection } from "../lesson-theory";

const reviewedPrl = {
  status: "reviewed",
  reviewedAt: "2026-11-02",
  reviewedBy: "opencode-editorial",
  confidence: {
    level: "high",
    reason: "Contenido trazado a Ley 31/1995 y fuentes oficiales ADIF; revisado en Ciclo 3.",
  },
} as const;

export const prlTheory: TheorySection = {
  sources: [
    {
      id: "lprl-31-1995-art22-4",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 22.4"
    },
    {
      id: "lprl-31-1995-art14",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 14",
      excerpt: "Los trabajadores tienen derecho a una protección eficaz. El empresario garantiza la seguridad y la salud en todos los aspectos relacionados con el trabajo; las obligaciones de trabajadores, la atribución de funciones preventivas y el concierto con entidades especializadas complementan su acción, sin eximirlo de su deber (apartados 1, 2 y 4)."
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
      excerpt: "El empresario informa de riesgos generales y por puesto, de las medidas de prevención y de emergencia; si hay representantes, facilita a través de ellos la información general, pero informa directamente a cada trabajador de los riesgos específicos de su puesto y de sus medidas. También consulta a los trabajadores y permite su participación en las cuestiones de seguridad y salud (apartados 1 y 2)."
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
      id: "lprl-31-1995-art30",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 30",
      excerpt: "Para prevenir riesgos, el empresario designa uno o varios trabajadores, constituye un servicio de prevención o concierta el servicio con una entidad especializada ajena. Los designados deben tener capacidad, tiempo y medios suficientes. En empresas de hasta 10 personas, o hasta 25 con un centro único, el empresario puede asumir personalmente la actividad si trabaja habitualmente allí y tiene capacidad necesaria."
    },
    {
      id: "lprl-31-1995-art30-5",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      sourceVersion: "consolidated-page-2026-10-15",
      locator: "Artículo 30.5",
      excerpt: "El empresario puede asumir personalmente las funciones preventivas del artículo 30.1 en empresas de hasta 10 trabajadores, o hasta 25 si hay un único centro, siempre que trabaje habitualmente allí y tenga la capacidad necesaria según los riesgos y peligrosidad."
    },
    {
      id: "lprl-31-1995-art31",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 31",
      excerpt: "Si la designación de trabajadores es insuficiente, el empresario recurre a uno o varios servicios de prevención propios o ajenos. Son medios humanos y materiales que asesoran y asisten al empresario, trabajadores y representantes; entre sus funciones están plan preventivo, evaluación, planificación, información y formación, emergencias y vigilancia de la salud. En Administraciones públicas se considera la estructura organizativa y ámbitos sectoriales o descentralizados."
    },
    {
      id: "lprl-31-1995-art35",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 35",
      excerpt: "Los Delegados de Prevención son representantes con funciones específicas en prevención. Se designan por y entre los representantes del personal; hasta 30 trabajadores el Delegado de Prevención es el Delegado de Personal; de 31 a 49 hay uno elegido entre los Delegados de Personal; de 50 a 100 corresponden dos; siguen tramos hasta ocho (arts. 35.1–3)."
    },
    {
      id: "lprl-31-1995-art33",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 33",
      excerpt: "El empresario consulta con la debida antelación decisiones sobre planificación y organización del trabajo y nuevas tecnologías; organización de la prevención y recurso a servicio externo; designación para emergencias; procedimientos de información y documentación; proyecto y organización de la formación; y otras acciones con efectos sustanciales. Cuando haya representantes, la consulta se realiza con ellos."
    },
    {
      id: "lprl-31-1995-art34",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 34",
      excerpt: "Los trabajadores tienen derecho a participar en la empresa en cuestiones preventivas. En centros con seis o más trabajadores, la participación se canaliza a través de representantes y representación especializada. En Administraciones públicas se adapta el ejercicio del derecho a sus particularidades, sin afectar las competencias, facultades y garantías de Delegados de Prevención y Comités."
    },
    {
      id: "lprl-31-1995-art36",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 36",
      excerpt: "Los Delegados de Prevención colaboran en la mejora preventiva, promueven la cooperación, son consultados antes de decisiones del artículo 33 y vigilan el cumplimiento. Pueden acompañar evaluaciones e inspecciones, acceder a información dentro de los límites legales, recabar medidas preventivas y proponerlas al empresario o al Comité; la negativa empresarial a esas propuestas debe motivarse. También pueden proponer al órgano de representación de los trabajadores el acuerdo de paralización previsto para el riesgo grave e inminente."
    },
    {
      id: "rd39-1997-art11",
      sourceId: "RD 39/1997",
      sourceVersion: "consolidated-page-2026-11-04",
      sourceTitle: "Real Decreto 39/1997, de 17 de enero, por el que se aprueba el Reglamento de los Servicios de Prevención",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1997-1853",
      locator: "Artículo 11",
      excerpt: "La asunción personal por el empresario excluye la vigilancia de la salud y exige: empresa de hasta 10 trabajadores, o hasta 25 con un centro; actividad fuera del anexo I; trabajo habitual del empresario en el centro; y capacidad preventiva adecuada. La vigilancia de la salud y las demás actividades no asumidas deben cubrirse por otras modalidades preventivas."
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
    },
    {
      id: "lprl-31-1995-exposicion",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Exposición de motivos",
      excerpt: "La exposición de motivos vincula la ley con el art. 40.2 CE, la transposición de la Directiva 89/391/CEE y de las Directivas 92/85/CEE, 94/33/CEE y 91/383/CEE, el Convenio OIT 155 y los arts. 149.1.7 y 149.1.18 CE."
    },
    {
      id: "lprl-31-1995-art1",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 1",
      excerpt: "La normativa sobre prevención de riesgos laborales está constituida por la presente Ley, sus disposiciones de desarrollo o complementarias y cuantas otras normas, legales o convencionales, contengan prescripciones relativas a la adopción de medidas preventivas en el ámbito laboral."
    },
    {
      id: "lprl-31-1995-art2",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 2",
      excerpt: "La presente Ley tiene por objeto promover la seguridad y la salud de los trabajadores mediante la aplicación de medidas y el desarrollo de las actividades necesarias para la prevención de riesgos derivados del trabajo. Las disposiciones de carácter laboral contenidas en esta Ley tendrán el carácter de Derecho necesario mínimo indisponible."
    },
    {
      id: "lprl-31-1995-art3",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 3",
      excerpt: "Ámbito de aplicación: relaciones laborales del Estatuto de los Trabajadores y relaciones administrativas o estatutarias del personal al servicio de las Administraciones públicas. Exclusiones: policía, seguridad y resguardo aduanero, servicios operativos de protección civil y peritaje forense, Fuerzas Armadas."
    },
    {
      id: "lprl-31-1995-art4",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 4",
      excerpt: "Definiciones: prevención, riesgo laboral, daño derivado del trabajo, riesgo grave e inminente, potencialmente peligrosos, equipo de trabajo, condición de trabajo, equipo de protección individual."
    },
    {
      id: "lprl-31-1995-art17",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 17",
      excerpt: "El empresario adoptará las medidas necesarias con el fin de que los equipos de trabajo sean adecuados para el trabajo que deba realizarse y convenientemente adaptados a tal efecto... Cuando la utilización de un equipo de trabajo pueda presentar un riesgo específico... a) La utilización del equipo de trabajo quede reservada a los encargados de dicha utilización. b) Los trabajos de reparación, transformación, mantenimiento o conservación sean realizados por los trabajadores específicamente capacitados para ello. 2. El empresario deberá proporcionar a sus trabajadores equipos de protección individual adecuados... y velar por el uso efectivo de los mismos..."
    },
    {
      id: "lprl-31-1995-art25",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 25",
      excerpt: "El empresario garantizará de manera específica la protección de los trabajadores que, por sus propias características personales o estado biológico conocido, incluidos aquellos que tengan reconocida la situación de discapacidad física, psíquica o sensorial, sean especialmente sensibles a los riesgos derivados del trabajo... Los trabajadores no serán empleados en aquellos puestos de trabajo en los que... puedan ellos, los demás trabajadores u otras personas relacionadas con la empresa ponerse en situación de peligro... 2. ... deberá tener en cuenta en las evaluaciones los factores de riesgo que puedan incidir en la función de procreación..."
    },
    {
      id: "lprl-31-1995-art26",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 26",
      excerpt: "1. La evaluación de los riesgos... deberá comprender la determinación de la naturaleza, el grado y la duración de la exposición de las trabajadoras en situación de embarazo o parto reciente... el empresario adoptará las medidas necesarias para evitar la exposición a dicho riesgo, a través de una adaptación de las condiciones o del tiempo de trabajo... Dichas medidas incluirán, cuando resulte necesario, la no realización de trabajo nocturno o de trabajo a turnos. 2. Cuando la adaptación... no resultase posible... ésta deberá desempeñar un puesto de trabajo o función diferente y compatible con su estado... 3. Si dicho cambio de puesto no resultara técnica u objetivamente posible... podrá declararse el paso... a la situación de suspensión del contrato por riesgo durante el embarazo... 4. ... durante el período de lactancia natural... 5. Las trabajadoras embarazadas tendrán derecho a ausentarse del trabajo, con derecho a remuneración, para la realización de exámenes prenatales y técnicas de preparación al parto..."
    },
    {
      id: "lprl-31-1995-art27",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 27",
      excerpt: "1. Antes de la incorporación al trabajo de jóvenes menores de dieciocho años, y previamente a cualquier modificación importante de sus condiciones de trabajo, el empresario deberá efectuar una evaluación de los puestos de trabajo a desempeñar por los mismos... la evaluación tendrá especialmente en cuenta los riesgos específicos para la seguridad, la salud y el desarrollo de los jóvenes derivados de su falta de experiencia, de su inmadurez para evaluar los riesgos existentes o potenciales y de su desarrollo todavía incompleto... el empresario informará a dichos jóvenes y a sus padres o tutores... 2. ... el Gobierno establecerá las limitaciones a la contratación de jóvenes menores de dieciocho años en trabajos que presenten riesgos específicos."
    },
    {
      id: "lprl-31-1995-art28",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 28",
      excerpt: "1. Los trabajadores con relaciones de trabajo temporales o de duración determinada, así como los contratados por empresas de trabajo temporal, deberán disfrutar del mismo nivel de protección en materia de seguridad y salud que los restantes trabajadores de la empresa en la que prestan sus servicios... 2. El empresario adoptará las medidas necesarias para garantizar que, con carácter previo al inicio de su actividad, los trabajadores... reciban información acerca de los riesgos... 5. En las relaciones de trabajo a través de empresas de trabajo temporal, la empresa usuaria será responsable de las condiciones de ejecución del trabajo... La empresa de trabajo temporal será responsable del cumplimiento de las obligaciones en materia de formación y vigilancia de la salud..."
    },
    {
      id: "lprl-31-1995-art37",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 37",
      excerpt: "1. Lo previsto en el artículo 68 del Estatuto de los Trabajadores en materia de garantías será de aplicación a los Delegados de Prevención... será considerado en todo caso como tiempo de trabajo efectivo, sin imputación al citado crédito horario, el correspondiente a las reuniones del Comité de Seguridad y Salud... 2. El empresario deberá proporcionar a los Delegados de Prevención los medios y la formación en materia preventiva que resulten necesarios... El tiempo dedicado a la formación será considerado como tiempo de trabajo... y su coste no podrá recaer en ningún caso sobre los Delegados de Prevención. 3. ... sigilo profesional..."
    },
    {
      id: "lprl-31-1995-art39",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 39",
      excerpt: "1. El Comité de Seguridad y Salud tendrá las siguientes competencias: a) Participar en la elaboración, puesta en práctica y evaluación de los planes y programas de prevención de riesgos de la empresa... b) Promover iniciativas sobre métodos y procedimientos para la efectiva prevención de los riesgos... 2. ... estará facultado para: a) Conocer directamente la situación relativa a la prevención de riesgos en el centro de trabajo, realizando a tal efecto las visitas que estime oportunas. b) Conocer cuantos documentos e informes... c) Conocer y analizar los daños producidos en la salud... d) Conocer e informar la memoria y programación anual de servicios de prevención. 3. ... se podrá acordar la realización de reuniones conjuntas de los Comités de Seguridad y Salud..."
    },
    {
      id: "lprl-31-1995-art40",
      sourceId: "Ley 31/1995",
      sourceTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
      locator: "Artículo 40",
      excerpt: "1. Los trabajadores y sus representantes podrán recurrir a la Inspección de Trabajo y Seguridad Social si consideran que las medidas adoptadas y los medios utilizados por el empresario no son suficientes... 2. ... el Inspector de Trabajo y Seguridad Social comunicará su presencia al empresario o a su representante o a la persona inspeccionada, al Comité de Seguridad y Salud, al Delegado de Prevención o, en su ausencia, a los representantes legales de los trabajadores, a fin de que puedan acompañarle... 3. La Inspección... informará a los Delegados de Prevención sobre los resultados de las visitas... y al empresario mediante diligencia en el Libro de Visitas... 4. Las organizaciones sindicales y empresariales más representativas serán consultadas con carácter previo a la elaboración de los planes de actuación..."
    }
  ],

  introduction: [
    {
      id: "prl-intro-1",
      text: "La Ley 31/1995, de 8 de noviembre, de Prevención de Riesgos Laborales (LPRL) transpone la Directiva Marco 89/391/CEE y constituye la norma básica de referencia en materia de seguridad y salud en el trabajo.",
      kind: "didactic",
      legalBasis: [],
    review: reviewedPrl,
    },
    {
      id: "prl-intro-2",
      text: "Impone al empresario un deber general de protección frente a los riesgos laborales, que se extiende también a las Administraciones públicas respecto del personal a su servicio.",
      kind: "normative",
      legalBasis: ["lprl-31-1995-art14"],
    review: reviewedPrl,
    }
  ],

  concepts: [
    {
      id: "prl-concept-0",
      title: "Exposición de Motivos: Fundamento Constitucional y Europeo",
      claims: [
        {
          id: "prl-c0-1",
          text: "El mandato constitucional encomienda a los poderes públicos velar por la seguridad e higiene en el trabajo, base de la Ley.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-exposicion"],
        review: reviewedPrl,
        },
        {
          id: "prl-c0-2",
          text: "La Ley transpone la Directiva Marco 89/391/CEE y las Directivas 92/85/CEE (maternidad), 94/33/CEE (jóvenes) y 91/383/CEE (relaciones temporales y empresas de trabajo temporal).",
          kind: "normative",
          legalBasis: ["lprl-31-1995-exposicion"],
        review: reviewedPrl,
        },
        {
          id: "prl-c0-3",
          text: "Se incorporan las prescripciones del Convenio 155 de la OIT sobre seguridad y salud de los trabajadores y medio ambiente de trabajo.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-exposicion"],
        review: reviewedPrl,
        },
        {
          id: "prl-c0-4",
          text: "La Ley es legislación laboral y, en sus aspectos fundamentales, norma básica del régimen estatutario de los funcionarios públicos.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-exposicion"],
        review: reviewedPrl,
        }
      ]
    },
    {
      id: "prl-concept-0b",
      title: "Exposición de Motivos: Objetivos y Enfoque Preventivo",
      claims: [
        {
          id: "prl-c0b-1",
          text: "La Ley tiene por objeto la determinación del cuerpo básico de garantías y responsabilidades preciso para establecer un adecuado nivel de protección de la salud de los trabajadores frente a los riesgos derivados del trabajo.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-exposicion"],
        review: reviewedPrl,
        },
        {
          id: "prl-c0b-2",
          text: "La planificación de la prevención desde el diseño del proyecto empresarial, la evaluación inicial de riesgos y su actualización periódica constituyen el nuevo enfoque preventivo de la Ley.",
          kind: "didactic",
          legalBasis: [],
        review: reviewedPrl,
        },
        {
          id: "prl-c0b-3",
          text: "El capítulo V regula los derechos de consulta y participación de los trabajadores en materia de prevención a través de los Delegados de Prevención y el Comité de Seguridad y Salud.",
          kind: "didactic",
          legalBasis: [],
        review: reviewedPrl,
        }
      ]
    },
    {
      id: "prl-concept-0c",
      title: "Artículo 1: Normativa sobre Prevención de Riesgos Laborales",
      claims: [
        {
          id: "prl-c0c-1",
          text: "La normativa sobre prevención de riesgos laborales está constituida por la presente Ley, sus disposiciones de desarrollo o complementarias y cuantas otras normas, legales o convencionales, contengan prescripciones relativas a la adopción de medidas preventivas en el ámbito laboral.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art1"],
        review: reviewedPrl,
        }
      ]
    },
    {
      id: "prl-concept-0d",
      title: "Artículo 2: Objeto y Carácter de la Norma",
      claims: [
        {
          id: "prl-c0d-1",
          text: "La Ley tiene por objeto promover la seguridad y la salud de los trabajadores mediante la aplicación de medidas y el desarrollo de las actividades necesarias para la prevención de riesgos derivados del trabajo.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art2"],
        review: reviewedPrl,
        },
        {
          id: "prl-c0d-2",
          text: "Las disposiciones de carácter laboral contenidas en la Ley y sus normas reglamentarias tienen el carácter de Derecho necesario mínimo indisponible, pudiendo ser mejoradas y desarrolladas en los convenios colectivos.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art2"],
        review: reviewedPrl,
        }
      ]
    },
    {
      id: "prl-concept-0e",
      title: "Artículo 3: Ámbito de Aplicación",
      claims: [
        {
          id: "prl-c0e-1",
          text: "La Ley se aplica a las relaciones laborales reguladas en el Estatuto de los Trabajadores y a las relaciones de carácter administrativo o estatutario del personal al servicio de las Administraciones públicas.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art3"],
        review: reviewedPrl,
        },
        {
          id: "prl-c0e-2",
          text: "No se aplica a las actividades cuyas particularidades lo impidan en el ámbito de las funciones públicas de policía, seguridad y resguardo aduanero, servicios operativos de protección civil y peritaje forense, y Fuerzas Armadas.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art3"],
        review: reviewedPrl,
        },
        {
          id: "prl-c0e-3",
          text: "En los centros y establecimientos militares se aplica la Ley con las particularidades de su normativa específica; en los establecimientos penitenciarios se adaptan aquellas actividades cuyas características justifiquen una regulación especial.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art3"],
        review: reviewedPrl,
        }
      ]
    },
    {
      id: "prl-concept-0f",
      title: "Artículo 4: Definiciones Básicas",
      claims: [
        {
          id: "prl-c0f-1",
          text: "Prevención: conjunto de actividades o medidas adoptadas o previstas en todas las fases de actividad de la empresa con el fin de evitar o disminuir los riesgos derivados del trabajo.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art4"],
        review: reviewedPrl,
        },
        {
          id: "prl-c0f-2",
          text: "Riesgo laboral: posibilidad de que un trabajador sufra un determinado daño derivado del trabajo; su gravedad se valora conjuntamente por la probabilidad de que se produzca el daño y la severidad del mismo.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art4"],
        review: reviewedPrl,
        },
        {
          id: "prl-c0f-3",
          text: "Riesgo laboral grave e inminente: aquel que resulte probable racionalmente que se materialice en un futuro inmediato y pueda suponer un daño grave para la salud de los trabajadores.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art4"],
        review: reviewedPrl,
        },
        {
          id: "prl-c0f-4",
          text: "Equipo de protección individual (EPI): cualquier equipo destinado a ser llevado o sujetado por el trabajador para que le proteja de uno o varios riesgos que puedan amenazar su seguridad o su salud en el trabajo.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art4"],
        review: reviewedPrl,
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
          legalBasis: ["lprl-31-1995-art14"],
        review: reviewedPrl,
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
          legalBasis: ["lprl-31-1995-art15"],
        review: reviewedPrl,
        },
        {
          id: "prl-c2-2",
          text: "Se adoptarán medidas que antepongan la protección colectiva a la individual.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art15"],
        review: reviewedPrl,
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
          legalBasis: ["lprl-31-1995-art16"],
        review: reviewedPrl,
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
          legalBasis: ["lprl-31-1995-art16"],
        review: reviewedPrl,
        }
      ]
    },
    {
      id: "prl-concept-5",
      title: "Información a los Trabajadores",
      claims: [
        {
          id: "prl-c5-1",
          text: "El empresario debe informar directamente a cada trabajador sobre los riesgos de su puesto, medidas de protección y planes de emergencia.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art18"],
        review: reviewedPrl,
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
          legalBasis: ["lprl-31-1995-art19"],
        review: reviewedPrl,
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
          legalBasis: ["lprl-31-1995-art20"],
        review: reviewedPrl,
        }
      ]
    },
    {
      id: "prl-concept-8",
      title: "Derecho de Paralización por Riesgo Grave e Inminente",
      claims: [
        {
          id: "prl-c8-1",
          text: "El trabajador tiene derecho a interrumpir su actividad y abandonar el lugar de trabajo cuando considere que dicha actividad entraña un riesgo grave e inminente para su vida o su salud.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art21"],
        review: reviewedPrl,
        },
        {
          id: "prl-c8-2",
          text: "Los representantes legales de los trabajadores podrán acordar, por mayoría de sus miembros, la paralización de la actividad cuando el empresario no adopte o no permita la adopción de las medidas necesarias; si no resulta posible reunir con la urgencia requerida al órgano de representación del personal, el acuerdo podrá ser adoptado por decisión mayoritaria de los Delegados de Prevención.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art21"],
        review: reviewedPrl,
        }
      ]
    },
    {
      id: "prl-concept-9",
      title: "Vigilancia de la Salud",
      claims: [
        {
          id: "prl-c9-1",
          text: "La vigilancia periódica de la salud se realiza en función de los riesgos del trabajo y, como regla general, requiere consentimiento. Previo informe de los representantes de los trabajadores, se exceptúan los reconocimientos imprescindibles para evaluar los efectos de las condiciones de trabajo sobre la salud o comprobar si el estado de salud del trabajador puede suponer un peligro para él, otros trabajadores u otras personas relacionadas con la empresa; también los establecidos en una disposición legal para proteger frente a riesgos específicos y actividades de especial peligrosidad. Deben elegirse pruebas proporcionales al riesgo que causen las menores molestias.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art22"],
        review: reviewedPrl,
        },
        {
          id: "prl-c9-2",
          text: "La vigilancia respeta la intimidad y dignidad de la persona y la confidencialidad de la información sobre su salud; los resultados se comunican al trabajador afectado y no pueden usarse para discriminarle ni perjudicarle. El acceso de terceros a los datos médicos personales se limita al personal médico y las autoridades sanitarias que realizan la vigilancia; no se facilitan al empresario ni a otras personas sin consentimiento expreso.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art22", "lprl-31-1995-art22-4"],
          review: reviewedPrl,
        },
        {
          id: "prl-c9-3",
          text: "El empresario y los responsables de prevención reciben las conclusiones sobre la aptitud para el puesto o la necesidad de introducir o mejorar medidas preventivas, para poder cumplir sus funciones; esto no les da acceso automático al historial médico. Cuando la naturaleza de los riesgos lo requiera, el derecho a la vigilancia periódica se prolonga tras terminar la relación laboral en los términos reglamentarios. La vigilancia debe realizarla personal sanitario con competencia técnica, formación y capacidad acreditadas.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art22"],
          review: reviewedPrl,
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
          legalBasis: ["lprl-31-1995-art23"],
        review: reviewedPrl,
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
          legalBasis: ["lprl-31-1995-art29"],
        review: reviewedPrl,
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
          legalBasis: ["rd773-1997-art4"],
        review: reviewedPrl,
        },
        {
          id: "prl-c12-2",
          text: "El empresario está obligado a proporcionar gratuitamente los equipos de protección individual que los trabajadores deban utilizar, reponiéndolos cuando resulte necesario.",
          kind: "normative",
          legalBasis: ["rd773-1997-art3"],
        review: reviewedPrl,
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
          legalBasis: ["lprl-31-1995-art35"],
        review: reviewedPrl,
        },
        {
          id: "prl-c13-2",
          text: "El Comité de Seguridad y Salud es obligatorio en centros de 50 o más trabajadores, reuniéndose trimestralmente como órgano paritario consultivo.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art38"],
        review: reviewedPrl,
        },
        {
          id: "prl-c13-3",
          text: "Los Delegados de Prevención son designados por y entre los representantes del personal. Hasta 30 trabajadores, el Delegado de Prevención es el Delegado de Personal; entre 31 y 49 se elige uno por y entre los Delegados de Personal; de 50 a 100 corresponden dos Delegados de Prevención. La Ley permite sistemas distintos por convenio y, para las Administraciones públicas, con las adaptaciones previstas.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art35"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con los apartados 2 y 4 del artículo 35 consolidado del BOE; se conserva el margen de adaptación." } }
        },
        {
          id: "prl-c13-4",
          text: "Los Delegados de Prevención colaboran en la mejora preventiva, promueven la cooperación, son consultados antes de ejecutar las decisiones del artículo 33 y vigilan el cumplimiento. Entre sus facultades están acompañar evaluaciones e inspecciones y acceder a la información laboral necesaria con los límites legales.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art36", "lprl-31-1995-art33"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Síntesis cotejada con los apartados 1 y 2 del artículo 36 consolidado del BOE." } }
        },
        {
          id: "prl-c13-5",
          text: "Los Delegados de Prevención pueden recabar del empresario medidas preventivas y de mejora de la protección y proponerlas al empresario o al Comité de Seguridad y Salud. Si el empresario rechaza las medidas propuestas, debe motivar su decisión.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art36"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con el artículo 36.2.f y 36.4 del texto consolidado BOE, actualizado a 09/04/2026." } }
        },
        {
          id: "prl-c13-6",
          text: "Ante un riesgo grave e inminente, los Delegados de Prevención pueden proponer al órgano de representación de los trabajadores que acuerde paralizar la actividad afectada cuando el empresario no adopte o no permita las medidas necesarias. Solo si no es posible reunir con la urgencia necesaria a ese órgano, la decisión de paralización puede adoptarse por mayoría de los Delegados de Prevención; la competencia no es una facultad individual de cada delegado.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art36", "lprl-31-1995-art21"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con el artículo 36.2.g de la LPRL y el artículo 21.3 del texto consolidado BOE, actualizado a 09/04/2026." } }
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
          legalBasis: ["lprl-31-1995-art24"],
        review: reviewedPrl,
        }
      ]
    },
    {
      id: "prl-concept-15",
      title: "Responsabilidad Empresarial y Organización Preventiva (arts. 30–31, contexto complementario)",
      claims: [
        {
          id: "prl-c15-1",
          text: "Las funciones preventivas atribuidas a trabajadores o servicios de la empresa y el concierto con entidades especializadas complementan la actuación empresarial, pero no eximen al empresario de su deber de protección. La organización preventiva aporta medios para cumplir ese deber; no lo transfiere.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art14"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con el artículo 14.4 consolidado del BOE." } }
        },
        {
          id: "prl-c15-2",
          text: "Como contexto complementario a los capítulos I, III y V del extracto de temario ADIF, el empresario organiza la actividad preventiva designando uno o varios trabajadores designados, constituyendo un servicio de prevención o concertándolo con una entidad especializada ajena. Si las funciones asignadas a trabajadores designados son insuficientes por el tamaño, los riesgos o la peligrosidad, debe recurrir a uno o varios servicios propios o ajenos. La asunción personal solo cabe dentro de los límites del artículo 30.5 y del artículo 11 del RD 39/1997: empresa de hasta 10 trabajadores, o hasta 25 con un único centro; actividad no incluida en el anexo I; trabajo habitual del empresario en el centro; y capacidad preventiva adecuada. La vigilancia de la salud y las demás actividades que no asuma personalmente deben cubrirse por otras modalidades.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art30", "lprl-31-1995-art30-5", "lprl-31-1995-art31", "rd39-1997-art11"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con los artículos 30.1–2 y 30.5 y 31.1 de la LPRL y el artículo 11 del RD 39/1997; contenido complementario, pues el extracto PNI26/01 enumera los capítulos I, III y V." } }
        },
        {
          id: "prl-c15-3",
          text: "Como contexto complementario a los capítulos I, III y V del extracto de temario ADIF, el servicio de prevención reúne medios humanos y materiales para asesorar y asistir al empresario, a los trabajadores, a sus representantes y a los órganos especializados. Su apoyo comprende plan y evaluación de riesgos, planificación y prioridades, información y formación, emergencias y vigilancia de la salud; su composición y medios deben ser suficientes y adecuados a los riesgos.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art31"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con los artículos 31.2–4 consolidados del BOE; contenido complementario al extracto oficial de temario." } }
        }
      ]
    },
    {
      id: "prl-concept-16",
      title: "Información, Consulta y Participación Preventiva",
      claims: [
        {
          id: "prl-c16-1",
          text: "El empresario informa sobre riesgos generales, riesgos por puesto, medidas preventivas y de emergencia. Si hay representantes, la información general se facilita a través de ellos; cada trabajador recibe directamente la información sobre los riesgos específicos de su puesto y sus medidas. Además, se consulta a los trabajadores y se permite su participación en las cuestiones de seguridad y salud; en centros con representación, la consulta del artículo 33 se realiza con sus representantes, con las adaptaciones previstas para el empleo público.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art18", "lprl-31-1995-art33", "lprl-31-1995-art34"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con los artículos 18.1–2, 33.1–2 y 34.1–3 consolidados del BOE." } }
        },
        {
          id: "prl-c16-2",
          text: "La consulta, con la debida antelación, abarca la planificación y organización del trabajo y las nuevas tecnologías en lo relativo a sus efectos preventivos; la organización y desarrollo de la prevención, incluida la designación de trabajadores encargados o el recurso a un servicio de prevención externo; la designación del personal para emergencias; los procedimientos de información y documentación; el proyecto y organización de la formación; y cualquier otra acción con efectos sustanciales para la seguridad y salud. Cuando existen representantes, se consulta con ellos.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art33"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con todas las letras a–f del artículo 33.1 y el apartado 2." } }
        }
      ]
    },
    {
      id: "prl-concept-17",
      title: "Equipos de Trabajo y Medios de Protección",
      claims: [
        {
          id: "prl-c17-1",
          text: "El empresario adopta las medidas necesarias para que los equipos de trabajo sean adecuados a la tarea y convenientemente adaptados, de forma que garanticen la seguridad y la salud al utilizarlos. Si su uso presenta un riesgo específico, reserva la utilización a los encargados de dicha utilización y encomienda la reparación, transformación, mantenimiento o conservación a trabajadores específicamente capacitados.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art17"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con el apartado 1 y sus letras a y b del artículo 17 del extracto ADIF (capítulo III) y del texto consolidado del BOE." } }
        },
        {
          id: "prl-c17-2",
          text: "El empresario proporciona equipos de protección individual adecuados para el desempeño de las funciones y vela por su uso efectivo cuando la naturaleza de los trabajos lo exige. Los equipos de protección individual se utilizan cuando los riesgos no se pueden evitar o no se pueden limitar suficientemente mediante medios técnicos de protección colectiva o mediante medidas, métodos o procedimientos de organización del trabajo.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art17"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con el apartado 2 del artículo 17 del extracto ADIF (capítulo III) y del texto consolidado del BOE." } }
        }
      ]
    },
    {
      id: "prl-concept-18",
      title: "Trabajadores Especialmente Sensibles",
      claims: [
        {
          id: "prl-c18-1",
          text: "El empresario garantiza de manera específica la protección de los trabajadores que, por sus características personales o estado biológico conocido, incluida la discapacidad física, psíquica o sensorial reconocida, sean especialmente sensibles a los riesgos del trabajo. Debe tenerlo en cuenta en las evaluaciones de riesgos y adoptar, en función de ellas, las medidas preventivas y de protección necesarias.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art25"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con el apartado 1 del artículo 25 del extracto ADIF (capítulo III) y del texto consolidado del BOE." } }
        },
        {
          id: "prl-c18-2",
          text: "Los trabajadores no son empleados en puestos en los que, por sus características personales, estado biológico o discapacidad reconocida, puedan ponerse en situación de peligro ellos, los demás trabajadores u otras personas relacionadas con la empresa, ni cuando se encuentren manifiestamente en situaciones transitorias que no respondan a las exigencias psicofísicas del puesto. La evaluación también considera los factores que puedan incidir en la función de procreación.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art25"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con el párrafo segundo del apartado 1 y con el apartado 2 del artículo 25 del extracto ADIF y del texto consolidado del BOE." } }
        }
      ]
    },
    {
      id: "prl-concept-19",
      title: "Protección de la Maternidad y la Lactancia",
      claims: [
        {
          id: "prl-c19-1",
          text: "La evaluación de riesgos determina la naturaleza, el grado y la duración de la exposición de las trabajadoras en situación de embarazo o parto reciente a agentes, procedimientos o condiciones que puedan influir negativamente en su salud o en la del feto. Si revela riesgo, el empresario adopta las medidas necesarias mediante una adaptación de las condiciones o del tiempo de trabajo, que incluye, cuando resulte necesario, la no realización de trabajo nocturno o a turnos.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art26"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con el apartado 1 del artículo 26 del extracto ADIF (capítulo III) y del texto consolidado del BOE." } }
        },
        {
          id: "prl-c19-2",
          text: "Si la adaptación no es posible o persiste el riesgo, y así lo certifican los servicios médicos del Instituto Nacional de la Seguridad Social o de las mutuas con el informe del médico del Servicio Nacional de Salud, la trabajadora desempeña un puesto o función diferente y compatible con su estado. El empresario determina, previa consulta con los representantes, la relación de puestos exentos de riesgo. Si no existe puesto compatible, puede ser destinada a un puesto de otro grupo o categoría equivalente conservando las retribuciones de su puesto de origen; si tampoco es posible, cabe la suspensión del contrato por riesgo durante el embarazo.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art26"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con los apartados 2 y 3 del artículo 26 del extracto ADIF y del texto consolidado del BOE." } }
        },
        {
          id: "prl-c19-3",
          text: "Las reglas de adaptación y cambio de puesto se aplican también durante la lactancia natural cuando las condiciones de trabajo puedan influir negativamente en la salud de la mujer o del hijo y así lo certifiquen los servicios médicos. Cabe la suspensión del contrato por riesgo durante la lactancia de hijos menores de nueve meses. Las trabajadoras embarazadas tienen derecho a ausentarse con remuneración para exámenes prenatales y técnicas de preparación al parto, previo aviso y justificación.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art26"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con los apartados 4 y 5 del artículo 26 del extracto ADIF y del texto consolidado del BOE." } }
        }
      ]
    },
    {
      id: "prl-concept-20",
      title: "Protección de los Menores",
      claims: [
        {
          id: "prl-c20-1",
          text: "Antes de incorporar al trabajo a jóvenes menores de dieciocho años, y antes de cualquier modificación importante de sus condiciones, el empresario evalúa los puestos a desempeñar para determinar la naturaleza, el grado y la duración de su exposición a agentes, procesos o condiciones que puedan poner en peligro su seguridad o salud. La evaluación atiende a su falta de experiencia, a su inmadurez para evaluar riesgos y a su desarrollo incompleto, y el empresario informa de los riesgos y medidas a los jóvenes y a sus padres o tutores que intervinieron en la contratación.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art27"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con el apartado 1 del artículo 27 del extracto ADIF (capítulo III) y del texto consolidado del BOE." } }
        },
        {
          id: "prl-c20-2",
          text: "Teniendo en cuenta los factores de falta de experiencia, inmadurez y desarrollo incompleto, el Gobierno establece las limitaciones a la contratación de jóvenes menores de dieciocho años en trabajos que presenten riesgos específicos.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art27"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con el apartado 2 del artículo 27 del extracto ADIF y del texto consolidado del BOE." } }
        }
      ]
    },
    {
      id: "prl-concept-21",
      title: "Relaciones Temporales y Empresas de Trabajo Temporal",
      claims: [
        {
          id: "prl-c21-1",
          text: "Los trabajadores con relaciones temporales o de duración determinada y los contratados por empresas de trabajo temporal disfrutan del mismo nivel de protección en seguridad y salud que los restantes trabajadores de la empresa en la que prestan servicios. La relación temporal no justifica diferencias de trato en las condiciones de trabajo relativas a la protección de la seguridad y la salud, y la Ley y sus disposiciones de desarrollo se les aplican plenamente.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art28"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con el apartado 1 del artículo 28 del extracto ADIF (capítulo III) y del texto consolidado del BOE." } }
        },
        {
          id: "prl-c21-2",
          text: "Antes del inicio de su actividad, estos trabajadores reciben información sobre los riesgos a los que estarán expuestos, en particular sobre cualificaciones o aptitudes exigidas, controles médicos especiales y riesgos específicos del puesto, así como sobre las medidas de protección y prevención. Reciben además formación suficiente y adecuada a las características del puesto, teniendo en cuenta su cualificación y experiencia, y tienen derecho a la vigilancia periódica de su salud.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art28"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con los apartados 2 y 3 del artículo 28 del extracto ADIF y del texto consolidado del BOE." } }
        },
        {
          id: "prl-c21-3",
          text: "El empresario informa a los trabajadores designados o al servicio de prevención de la incorporación de este personal. En las relaciones a través de empresas de trabajo temporal, la empresa usuaria responde de las condiciones de ejecución del trabajo en lo relativo a seguridad y salud y del cumplimiento de las obligaciones de información, mientras que la empresa de trabajo temporal responde de la formación y de la vigilancia de la salud. La empresa usuaria informa a los representantes de los trabajadores de la adscripción de estos trabajadores.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art28"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con los apartados 4 y 5 del artículo 28 del extracto ADIF y del texto consolidado del BOE." } }
        }
      ]
    },
    {
      id: "prl-concept-22",
      title: "Garantías y Sigilo Profesional de los Delegados de Prevención",
      claims: [
        {
          id: "prl-c22-1",
          text: "Las garantías del Estatuto de los Trabajadores en materia de representación se aplican a los Delegados de Prevención como representantes de los trabajadores. El tiempo dedicado a sus funciones se imputa al crédito de horas mensuales retribuidas, pero se considera en todo caso tiempo de trabajo efectivo, sin imputación a ese crédito, el de las reuniones del Comité de Seguridad y Salud y el de las demás reuniones convocadas por el empresario en materia preventiva, así como el de las visitas que el Comité puede realizar para conocer la situación preventiva del centro.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art37"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con el apartado 1 del artículo 37 del extracto ADIF (capítulo V) y del texto consolidado del BOE." } }
        },
        {
          id: "prl-c22-2",
          text: "El empresario proporciona a los Delegados de Prevención los medios y la formación preventiva necesarios para ejercer sus funciones, adaptada a la evolución de los riesgos y repetida periódicamente si es necesario. El tiempo de formación se considera tiempo de trabajo y su coste no puede recaer sobre los Delegados. Les resulta aplicable el deber de sigilo profesional del Estatuto de los Trabajadores respecto de la información conocida por su actuación en la empresa.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art37"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con los apartados 2 y 3 del artículo 37 del extracto ADIF y del texto consolidado del BOE." } }
        }
      ]
    },
    {
      id: "prl-concept-23",
      title: "Competencias y Facultades del Comité de Seguridad y Salud",
      claims: [
        {
          id: "prl-c23-1",
          text: "El Comité de Seguridad y Salud participa en la elaboración, puesta en práctica y evaluación de los planes y programas de prevención de la empresa. Antes de su puesta en práctica debate, en lo que afecta a la prevención, la elección de la modalidad organizativa y la gestión de las entidades especializadas concertadas, los proyectos de planificación y organización del trabajo, la introducción de nuevas tecnologías, la organización y desarrollo de las actividades preventivas y el proyecto y organización de la formación. Además promueve iniciativas sobre métodos y procedimientos de prevención.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art39"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con el apartado 1 y sus letras a y b del artículo 39 del extracto ADIF (capítulo V) y del texto consolidado del BOE." } }
        },
        {
          id: "prl-c23-2",
          text: "El Comité está facultado para conocer directamente la situación preventiva del centro mediante las visitas que estime oportunas; conocer los documentos e informes sobre condiciones de trabajo y los del servicio de prevención; conocer y analizar los daños a la salud o integridad física para valorar sus causas y proponer medidas; y conocer e informar la memoria y programación anual del servicio de prevención. Cuando varias empresas desarrollan actividades simultáneas en un mismo centro, pueden acordarse reuniones conjuntas de los Comités o, en su defecto, de los Delegados de Prevención y empresarios.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art39"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con el apartado 2, letras a a d, y el apartado 3 del artículo 39 del extracto ADIF y del texto consolidado del BOE." } }
        }
      ]
    },
    {
      id: "prl-concept-24",
      title: "Colaboración con la Inspección de Trabajo y Seguridad Social",
      claims: [
        {
          id: "prl-c24-1",
          text: "Los trabajadores y sus representantes pueden recurrir a la Inspección de Trabajo y Seguridad Social si consideran que las medidas adoptadas y los medios utilizados por el empresario no son suficientes para garantizar la seguridad y la salud en el trabajo.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art40"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con el apartado 1 del artículo 40 del extracto ADIF (capítulo V) y del texto consolidado del BOE." } }
        },
        {
          id: "prl-c24-2",
          text: "En las visitas de comprobación, el Inspector de Trabajo y Seguridad Social comunica su presencia al empresario o a su representante o a la persona inspeccionada, al Comité de Seguridad y Salud, al Delegado de Prevención o, en su ausencia, a los representantes legales de los trabajadores, para que puedan acompañarle y formular observaciones, salvo que considere que la comunicación puede perjudicar el éxito de sus funciones. La Inspección informa a los Delegados de los resultados de las visitas y de las medidas adoptadas, y al empresario mediante diligencia en el Libro de Visitas.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art40"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con los apartados 2 y 3 del artículo 40 del extracto ADIF y del texto consolidado del BOE." } }
        },
        {
          id: "prl-c24-3",
          text: "Las organizaciones sindicales y empresariales más representativas son consultadas con carácter previo a la elaboración de los planes de actuación de la Inspección de Trabajo y Seguridad Social en materia de prevención, en especial de los programas específicos para empresas de menos de seis trabajadores, e informadas del resultado de dichos planes.",
          kind: "normative",
          legalBasis: ["lprl-31-1995-art40"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "deepseek-v4.1-ciclo13", confidence: { level: "high", reason: "Cotejado con el apartado 4 del artículo 40 del extracto ADIF y del texto consolidado del BOE." } }
        }
      ]
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
          legalBasis: ["lprl-31-1995-art15"],
        review: reviewedPrl,
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
          legalBasis: ["lprl-31-1995-art21"],
        review: reviewedPrl,
        },
        {
          id: "prl-ex-2-app-2",
          text: "Si el empresario no adopta o no permite adoptar las medidas necesarias, los representantes del personal o los Delegados de Prevención podrían acordar la paralización de los trabajos por riesgo grave e inminente.",
          kind: "example",
          legalBasis: ["lprl-31-1995-art21"],
        review: reviewedPrl,
        }
      ]
    },
    {
      id: "prl-ex-3",
      situation: "ADIF concierta con un servicio de prevención ajeno las evaluaciones y parte de la actividad preventiva de un centro de mantenimiento.",
      application: [
        {
          id: "prl-ex-3-app-1",
          text: "El concierto aporta organización y medios especializados, pero no transfiere ni extingue el deber empresarial de protección. ADIF debe integrar y supervisar la prevención y adoptar las medidas necesarias, conforme al artículo 14.4.",
          kind: "example",
          legalBasis: ["lprl-31-1995-art14"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Aplicación didáctica de la regla del artículo 14.4." } }
        }
      ]
    },
    {
      id: "prl-ex-4",
      situation: "En un taller ferroviario se informa a la representación del personal de los riesgos generales. Una persona pasa a trabajar junto a una nueva instalación de alta tensión.",
      application: [
        {
          id: "prl-ex-4-app-1",
          text: "El canal representativo no sustituye la información individual sobre los riesgos específicos del nuevo puesto y sus medidas de protección y prevención; esa información se comunica directamente a la persona afectada.",
          kind: "example",
          legalBasis: ["lprl-31-1995-art18"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Aplicación del último inciso del artículo 18.1." } }
        }
      ]
    },
    {
      id: "prl-ex-5",
      situation: "Un centro de mantenimiento proyecta sustituir herramientas manuales por equipos automatizados y cambiar la organización de la prevención.",
      application: [
        {
          id: "prl-ex-5-app-1",
          text: "Antes de adoptar esas decisiones, el empresario consulta con la debida antelación a los trabajadores; si existe representación, lo hace con ella. La consulta abarca también la organización preventiva y el recurso a un servicio externo.",
          kind: "example",
          legalBasis: ["lprl-31-1995-art33"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Aplicación de los apartados 1.a, 1.b y 2 del artículo 33." } }
        }
      ]
    }
  ],

  reviewTakeaways: [
    {
      id: "prl-takeaway-1",
      text: "La prevención de riesgos laborales es un deber del empresario que exige la integración de un plan formal en el sistema general de gestión.",
      kind: "normative",
      legalBasis: ["lprl-31-1995-art16"],
    review: reviewedPrl,
    },
    {
      id: "prl-takeaway-2",
      text: "El Comité de Seguridad y Salud es un órgano colegiado paritario de carácter consultivo que se constituye obligatoriamente a partir de 50 trabajadores.",
      kind: "normative",
      legalBasis: ["lprl-31-1995-art38"],
    review: reviewedPrl,
    }
  ]
};
