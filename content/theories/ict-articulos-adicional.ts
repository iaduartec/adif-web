import type {
  LegalReference,
  TheoryClaim,
  TheoryConcept,
  TheoryExample,
} from "../theory-types";

/**
 * Complemento aislado: síntesis de los artículos 1–15 del Reglamento ICT.
 * Fuente cotejada: texto consolidado informativo del BOE, actualización
 * publicada el 26/03/2025. No sustituye a la publicación oficial ni afirma
 * que este real decreto forme parte de una convocatoria ADIF concreta.
 */
const sourceTitle =
  "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones";
const sourceUrl = "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834";
const checked = {
  status: "reviewed",
  reviewedAt: "2026-11-05",
  reviewedBy: "codex",
  confidence: {
    level: "high",
    reason:
      "Síntesis cotejada con el artículo y apartado indicados en el texto consolidado informativo del BOE; última actualización publicada 26/03/2025. No equivale a cotejo de convocatoria ADIF.",
  },
} as const;

const articleRefs: LegalReference[] = Array.from({ length: 15 }, (_, index) => {
  const article = index + 1;
  return {
    id: `ict-a${String(article).padStart(2, "0")}-source`,
    sourceId: "RD 346/2011",
    sourceTitle,
    sourceUrl,
    locator: ({
      2: "Reglamento, artículo 2 y apartado 2.4",
      5: "Reglamento, artículo 5 y apartado 5.5, con remisión al artículo 2.1",
      9: "Reglamento, artículo 9, apartado 1 y remisión al artículo 8",
      13: "Reglamento, artículo 13 y sus remisiones a los artículos 10 de la Ley de Propiedad Horizontal y 21 de la Ley de Arrendamientos Urbanos",
      15: "Reglamento, artículo 15 y su remisión al artículo 11 del Real Decreto-ley 1/1998",
    } as Record<number, string>)[article] ?? `Reglamento, artículo ${article}`,
  };
});

const summaries: Array<{ title: string; text: string; locator?: string }> = [
  {
    title: "Objeto y objetivos del Reglamento (artículo 1)",
    text:
      "El Reglamento establece requisitos técnicos de la ICT y especificaciones que deben incorporarse a la normativa técnica básica de edificación para dar capacidad al paso y uso compartido de redes de distintos operadores. Si un tercero instala o gestiona la infraestructura y conserva su titularidad, debe respetarse su utilización por cualquier operador habilitado. También promueve mantenimiento, vida útil, evolución, sostenibilidad y accesibilidad, incluido el concepto de hogar digital.",
  },
  {
    title: "Definiciones reglamentarias (artículo 2)",
    text:
      "La ICT comprende como mínimo la captación, adaptación y distribución de radiodifusión sonora y televisión hasta puntos de conexión, y la infraestructura para acceso a telefonía disponible al público y banda ancha mediante redes públicas. Una infraestructura preexistente adaptada para cumplir esas funciones también es ICT; en propiedad horizontal es elemento común. El sistema individual se contempla bajo las condiciones del artículo 2.4 y la legislación del Real Decreto-ley 1/1998. Hogar digital es la atención integrada de necesidades de seguridad y control, comunicaciones, ocio y confort, integración medioambiental y accesibilidad. Los términos no definidos se rigen por la normativa de telecomunicaciones y, subsidiariamente, por el Reglamento de Radiocomunicaciones de la UIT.",
  },
  {
    title: "Ámbito de aplicación (artículo 3)",
    text:
      "Se aplica a edificios y conjuntos inmobiliarios con continuidad edificatoria, residenciales o no, nuevos o existentes, acogidos o que deban acogerse a propiedad horizontal; también a edificios total o parcialmente arrendados por más de un año, excepto los que alberguen una sola vivienda. El artículo no establece un umbral general del 50 %.",
  },
  {
    title: "Normativa técnica por tipo de infraestructura (artículo 4)",
    text:
      "A radiodifusión sonora y televisión se aplica el anexo I; a telefonía disponible al público y banda ancha, el anexo II. La obra civil soporte se rige por la norma técnica básica de edificación aplicable, que debe recoger las especificaciones mínimas del anexo III; en su ausencia, rige en todo caso el anexo III. Lo anterior se entiende sin perjuicio de las competencias de otras administraciones.",
  },
  {
    title: "Operadores, propiedad y sistemas individuales (artículo 5)",
    text:
      "Los operadores usan la infraestructura conforme al Reglamento y, hasta el punto de terminación de red, responden del secreto de las comunicaciones, calidad exigible y mantenimiento. La propiedad mantiene el tramo entre el punto de terminación de red y el PAU y evita acceso no autorizado o manipulación incorrecta. Los equipos de operador necesarios para introducir señales corren a su cargo en instalación, mantenimiento, operación y retirada; cuando corresponda, también suministran equipos de terminación para compatibilizar interfaces. Tras extinguirse el contrato, el operador retira sus cables y elementos en un máximo de 30 días; después la propiedad puede retirarlos o considerarlos integrados en la ICT. Los copropietarios en régimen horizontal o, en su caso, arrendatarios pueden acceder a su costa por sistemas individuales a servicios distintos de los enumerados en el artículo 2.1 cuando no exista ICT común, no se instale una nueva o no se adapte la preexistente, conforme al procedimiento del Real Decreto-ley 1/1998.",
  },
  {
    title: "Adaptaciones e instalaciones individuales (artículo 6)",
    text:
      "Las adaptaciones de instalaciones individuales o infraestructuras preexistentes que no soporten ICT, o cuando no exista obligación de instalarla, siguen los anexos I y II que resulten aplicables. Antes de una instalación individual, su promotor comunica por escrito la intención a la propiedad o comunidad y acompaña descripción suficiente, acreditación de cumplimiento normativo, detalle del uso de elementos comunes y declaración expresa de que la propiedad queda exenta de obligaciones de mantenimiento, seguridad y vigilancia sobre esa instalación. La propiedad responde en los plazos del Real Decreto-ley 1/1998 e indica si ejecutará o adaptará una ICT; si no, presta consentimiento al uso de elementos comunes y puede proponer alternativa técnica y económicamente viable.",
  },
  {
    title: "Continuidad de servicios durante una sustitución (artículo 7)",
    text:
      "Antes de modificar instalaciones existentes o sustituirlas por una infraestructura nueva, la comunidad o propiedad consulta por escrito a los titulares y, en su caso, arrendatarios para que declaren por escrito los servicios recibidos; la solución modificada debe permitir recibir todos los servicios declarados. La consulta se efectúa en el plazo de dos meses conforme al Real Decreto-ley 1/1998. La propiedad mantiene la utilización normal de lo existente hasta que la nueva o modificada instalación funcione correctamente.",
  },
  {
    title: "Consulta del proyectista con operadores (artículo 8)",
    text:
      "El artículo prevé que una orden ministerial pueda regular la consulta entre proyectistas ICT y operadores con red en la zona, para ampliar la oferta en libre competencia y confirmar la ubicación de la arqueta de entrada. El resultado decide únicamente la ejecución inicial de redes interiores; no altera el diseño, dimensionado ni instalación de la obra civil, salvo la ubicación de la arqueta. Los operadores con red participan voluntariamente mediante adhesión al procedimiento. La consulta se realiza inmediatamente antes del inicio de obra, coincidiendo con el replanteo; sus resultados se consignan en el acta y pueden motivar cambios del proyecto. El plazo máximo de respuesta es de 30 días; sin respuesta, se proyecta conforme al Reglamento. El texto consolidado contiene anotaciones de nulidad judicial sobre incisos concretos: esta síntesis no reproduce como vigentes los incisos anulados.",
  },
  {
    title: "Proyecto técnico de ICT (artículo 9)",
    text:
      "La ICT debe contar con proyecto que describa elementos, ubicación, dimensiones y normas cumplidas. El proyecto original contempla las redes según la presencia de operadores que despliegan red en la ubicación; el de ejecución incorpora los resultados de consulta del artículo 8 y comprende memoria, planos, pliego de condiciones y presupuesto. Si los operadores no responden, incorpora fibra óptica en todas las poblaciones y cable coaxial en las poblaciones donde había operadores de cable al entrar en vigor el Reglamento. La propiedad conserva un ejemplar. Las reglas del apartado 1 están sujetas a las nulidades expresamente anotadas en el texto consolidado; no deben estudiarse incisos anulados como derecho vigente.",
  },
  {
    title: "Replanteo, cierre documental y comprobación (artículo 10)",
    text:
      "Al comenzar las obras, el promotor encarga el acta de replanteo al director de obra ICT, si existe, o, en su defecto, a un profesional competente; la remisión que establecía una titulación exclusiva fue anulada judicialmente. El acta, firmada con la propiedad o su representación, declara la validez del proyecto o cómo se actualizará (modificación ante cambio sustancial, anexo ante cambios menores); incorpora los resultados de consulta y se presenta electrónicamente en un máximo de 15 días naturales desde su firma. Al terminar, la propiedad presenta el boletín de instalación y, cuando proceda por complejidad, certificado del director; recibe, conserva y transmite la documentación y entrega manual de usuario, que se transfiere actualizado en venta o arrendamiento. La Administración puede comprobar o inspeccionar documentación e instalación. A petición para cédula o primera ocupación, la certificación administrativa acredita solo la presentación documental indicada por el artículo, no una garantía general de calidad. Debe preservarse el uso normal de instalaciones individuales durante las obras hasta que la nueva o adaptada funcione.",
  },
  {
    title: "Conformidad de equipos y materiales (artículo 11)",
    text:
      "Los equipos incluidos en el proyecto y materiales empleados en la ejecución deben ajustarse a las especificaciones del Reglamento y a las demás normas vigentes aplicables, con mención especial del Código Técnico de la Edificación en seguridad contra incendios y resistencia al fuego.",
  },
  {
    title: "Colaboración con la Administración (artículo 12)",
    text:
      "La Administración puede requerir en cualquier momento la subsanación de anomalías en documentos ICT presentados. Comunidad o propiedad, empresa instaladora, proyectista y, cuando exista, director de obra deben colaborar con la Administración competente en inspección, facilitando acceso a instalaciones e información requerida. El texto consolidado refleja la modificación del artículo por el Real Decreto 391/2019; sus denominaciones institucionales deben leerse atendiendo a esa redacción y a la organización administrativa vigente.",
  },
  {
    title: "Conservación e inspección técnica de edificios (artículo 13)",
    text:
      "Para ICT en propiedad horizontal se aplica el artículo 10 de la Ley de Propiedad Horizontal sobre mantenimiento de elementos y servicios comunes. En edificios arrendados se aplica el artículo 21 de la Ley de Arrendamientos Urbanos, salvo que los arrendatarios hubieran solicitado la instalación, supuesto en que asumen sus gastos. El protocolo de pruebas del anexo IV es orientativo para evaluar el estado operativo; no se formula aquí como periodicidad universal de inspección.",
  },
  {
    title: "Clasificación de hogar digital (artículo 14)",
    text:
      "El anexo V ofrece una clasificación de viviendas y edificaciones según equipamientos y tecnologías. Se aplica cuando el promotor decide incorporar funcionalidades de hogar digital, con el fin de ofrecer un marco homogéneo y basado en parámetros objetivos para clasificar y comparar; el artículo no impone por sí mismo que toda vivienda incorpore esas funciones.",
  },
  {
    title: "Régimen sancionador (artículo 15)",
    text:
      "El incumplimiento de obligaciones del Reglamento y de sus normas técnicas se sanciona conforme al artículo 11 del Real Decreto-ley 1/1998 y a la legislación general de telecomunicaciones citada por el artículo. Esta remisión no determina por sí sola una sanción concreta: deben identificarse el tipo infractor, la norma sancionadora aplicable y el procedimiento correspondiente.",
  },
];

export const theoryArticulos = {
  sources: articleRefs,
  concepts: summaries.map((item, index): TheoryConcept => {
    const article = index + 1;
    const claim: TheoryClaim = {
      id: `ict-a${String(article).padStart(2, "0")}-claim`,
      text: item.text,
      kind: "normative",
      legalBasis: [`ict-a${String(article).padStart(2, "0")}-source`],
      review: checked,
    };
    return {
      id: `ict-a${String(article).padStart(2, "0")}-concept`,
      title: item.title,
      claims: [claim],
    };
  }),
  examples: [] satisfies TheoryExample[],
  reviewTakeaways: [] satisfies TheoryClaim[],
};
