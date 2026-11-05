import { estatutoAdifOutline } from "../estatuto-adif-outline";
import type { LegalReference, TheoryConcept, TheorySection } from "../theory-types";

const BOE_URL = "https://www.boe.es/buscar/act.php?id=BOE-A-2004-21913";
const SOURCE_TITLE =
  "Real Decreto 2395/2004, de 30 de diciembre, por el que se aprueba el Estatuto de la entidad pública empresarial Administrador de Infraestructuras Ferroviarias";

function sourceId(locator: string) {
  if (locator === "Artículo único") return "rd2395-2004-articulo-unico";
  const additional = locator.match(/^Disposición adicional (\w+)/i);
  if (additional) return `rd2395-2004-da${additional[1]}`;
  const transitional = locator.match(/^Disposición transitoria (\w+)/i);
  if (transitional) return `rd2395-2004-dt${transitional[1]}`;
  if (locator === "Disposición derogatoria única") return "rd2395-2004-dd-unica";
  const final = locator.match(/^Disposición final (\w+)/i);
  if (final) return `rd2395-2004-df${final[1]}`;
  const article = locator.match(/^Artículo (\d+)/i);
  return `rd2395-2004-art${article?.[1] ?? "unknown"}`;
}

const sourceByLocator = new Map<string, LegalReference>(
  estatutoAdifOutline.map((item) => [
    item.locator,
    {
      id: sourceId(item.locator),
      sourceId: "RD 2395/2004",
      sourceTitle: SOURCE_TITLE,
      sourceUrl: BOE_URL,
      locator: item.locator,
    },
  ]),
);

const externalSources: LegalReference[] = [
  {
    id: "rd2395-2004-art3-2",
    sourceId: "RD 2395/2004",
    sourceTitle: SOURCE_TITLE,
    sourceUrl: BOE_URL,
    locator: "Artículo 3.2",
  },
  {
    id: "ley-38-2015",
    sourceId: "Ley 38/2015",
    sourceTitle: "Ley 38/2015, de 29 de septiembre, del sector ferroviario",
    sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10440",
    locator: "Ley 38/2015",
  },
  {
    id: "dr-2027",
    sourceId: "DR 2027",
    sourceTitle: "Declaración sobre la Red de Adif (Edición 2027)",
    sourceUrl: "https://www.adif.es/sobre-adif/declaracion-red",
    locator: "Declaración sobre la Red de Adif",
  },
];

function legalBasis(locator: string) {
  return [sourceByLocator.get(locator)?.id ?? sourceId(locator)];
}

/**
 * Sello editorial para los enunciados añadidos en el Ciclo 7 tras cotejo
 * literal con el texto consolidado del BOE. No se aplica de forma masiva a
 * los enunciados heredados: esos siguen dependiendo del manifiesto de revisión
 * hasta que se cotejen uno por uno.
 */
const verifiedEstatuto = {
  status: "reviewed",
  reviewedAt: "2026-11-04",
  reviewedBy: "ciclo-7-deepseek",
  confidence: {
    level: "high",
    reason:
      "Texto cotejado literalmente con el BOE consolidado de BOE-A-2004-21913 (última actualización publicada el 28/12/2013, en vigor desde el 31/12/2013) en el artículo y apartado indicados.",
  },
} as const;

function normativeClaim(
  id: string,
  text: string,
  locator: string,
  review?: typeof verifiedEstatuto,
) {
  const basis = new Set(legalBasis(locator));
  for (const token of text.matchAll(/\bartículo\s+(\d+)/gi)) {
    const referenced = sourceByLocator.get(`Artículo ${token[1]}`);
    if (referenced) basis.add(referenced.id);
  }
  if (/Ley 38\/2015|Ley del Sector Ferroviario/i.test(text)) basis.add("ley-38-2015");
  if (/Declaración sobre la Red/i.test(text)) basis.add("dr-2027");
  return {
    id,
    text,
    kind: "normative" as const,
    legalBasis: [...basis],
    ...(review ? { review } : {}),
  };
}

const existingConcepts: TheoryConcept[] = [
  {
    id: "estatuto-concept-1",
    title: "Naturaleza jurídica",
    claims: [normativeClaim("estatuto-c1-1", "ADIF es una entidad pública empresarial con personalidad jurídica propia, plena capacidad de obrar y patrimonio propio; en defecto de las normas que le son aplicables se rige por el ordenamiento jurídico privado.", "Artículo 1")],
  },
  {
    id: "estatuto-concept-2",
    title: "Adscripción y control de eficacia",
    claims: [
      normativeClaim("estatuto-c2-1", "El Estatuto adscribe ADIF al Ministerio de Fomento a través de la Secretaría General de Infraestructuras; el control técnico y de eficacia corresponde al Ministerio en los términos del artículo 38.", "Artículo 1"),
      normativeClaim("estatuto-c2-2", "El Ministerio puede realizar inspecciones y auditorías de gestión y requerir a ADIF información o documentación para ejercer el control.", "Artículo 38"),
    ],
  },
  {
    id: "estatuto-concept-3",
    title: "Funciones del administrador",
    claims: [normativeClaim("estatuto-c3-1", "ADIF administra sus infraestructuras, controla e inspecciona la infraestructura y la circulación, adjudica capacidad y desarrolla el resto de funciones enumeradas en el artículo 3.", "Artículo 3")],
  },
  {
    id: "estatuto-concept-4",
    title: "Consejo de Administración",
    claims: [normativeClaim("estatuto-c4-1", "El Consejo ejerce la superior dirección de la administración y gestión de ADIF y está formado por el Presidente y entre nueve y diez vocales.", "Artículo 15")],
  },
  {
    id: "estatuto-concept-5",
    title: "Presidente",
    claims: [normativeClaim("estatuto-c5-1", "El Presidente de ADIF y de su Consejo es nombrado por el Consejo de Ministros a propuesta del Ministro de Fomento; representa a la entidad, convoca y preside el Consejo y ejecuta sus acuerdos.", "Artículo 23")],
  },
  {
    id: "estatuto-concept-6",
    title: "Personal directivo",
    claims: [normativeClaim("estatuto-c6-1", "Son personal directivo los Directores Generales, los Directores Gerentes de las Unidades de negocio y los Directores Corporativos.", "Artículo 27")],
  },
  {
    id: "estatuto-concept-7",
    title: "Régimen patrimonial",
    claims: [normativeClaim("estatuto-c7-1", "ADIF tiene patrimonio propio, distinto del de la AGE, y su gestión se somete a la Ley del Sector Ferroviario, el Estatuto y, supletoriamente, la Ley del Patrimonio de las Administraciones Públicas.", "Artículo 30")],
  },
  {
    id: "estatuto-concept-8",
    title: "Desafectación de bienes",
    claims: [normativeClaim("estatuto-c8-1", "Los bienes de dominio público de ADIF que resulten innecesarios pueden desafectarse previa declaración de innecesariedad del Consejo; pasan a su patrimonio y pueden enajenarse o permutarse.", "Artículo 31")],
  },
  {
    id: "estatuto-concept-9",
    title: "Régimen de personal",
    claims: [normativeClaim("estatuto-c9-1", "El personal laboral de ADIF y su contratación se rigen por el Derecho laboral, los contratos, los convenios colectivos y las demás normas aplicables.", "Artículo 27")],
  },
  {
    id: "estatuto-concept-10",
    title: "Control económico-financiero",
    claims: [normativeClaim("estatuto-c10-1", "ADIF está sometida al control financiero permanente de la Intervención General de la Administración del Estado, sin perjuicio de la fiscalización del Tribunal de Cuentas.", "Artículo 39")],
  },
  {
    id: "estatuto-concept-101",
    title: "Autonomía de gestión: límites y criterios del artículo 2",
    claims: [
      normativeClaim(
        "estatuto-c101-1",
        "La autonomía de gestión del ADIF se ejerce dentro de tres límites: la Ley del Sector Ferroviario, el propio Estatuto y demás legislación que le sea de aplicación.",
        "Artículo 2",
        verifiedEstatuto,
      ),
      normativeClaim(
        "estatuto-c101-2",
        "Al ejercer esa autonomía, el ADIF debe tener en cuenta en todo caso cuatro criterios acumulativos: la garantía del interés público, la satisfacción de las necesidades sociales con la máxima calidad, la seguridad de los usuarios y la eficacia global del sistema ferroviario.",
        "Artículo 2",
        verifiedEstatuto,
      ),
      {
        id: "estatuto-c101-3",
        text: "La autonomía de gestión debe ejercerse dentro de los límites y teniendo en cuenta los criterios que establece el artículo 2; no supone libertad para prescindir de ellos.",
        kind: "interpretative",
        legalBasis: ["rd2395-2004-art2"],
        review: verifiedEstatuto,
      },
    ],
  },
  {
    id: "estatuto-concept-102",
    title: "Convenios del artículo 4: qué suprimió realmente la reforma de 2013",
    claims: [
      normativeClaim(
        "estatuto-c102-1",
        "En la redacción vigente, el artículo 4, apartado primero, habilita al ADIF para celebrar convenios con las comunidades autónomas para la construcción y la administración de las redes ferroviarias de éstas o de tramos de las mismas.",
        "Artículo 4",
        verifiedEstatuto,
      ),
      normativeClaim(
        "estatuto-c102-2",
        "El artículo 4, apartado segundo, permite celebrar cualesquiera convenios con la Administración General del Estado o con otras Administraciones Públicas para el mejor cumplimiento de sus fines, y el apartado tercero regula los convenios de colaboración con RENFE-Operadora, con empresas ferroviarias o con cualquier entidad pública o privada, incluido el régimen de utilización de instalaciones o dependencias de interés común y las actividades mercantiles complementarias o necesarias.",
        "Artículo 4",
        verifiedEstatuto,
      ),
      {
        id: "estatuto-c102-3",
        text: "La reforma de 2013 no eliminó la habilitación para convenir con las comunidades autónomas: eliminó el antiguo apartado primero, que regulaba la encomienda de administración de infraestructuras de titularidad estatal mediante convenio o contrato-programa, y renumeró los apartados restantes. La habilitación con comunidades autónomas pasó del apartado segundo al primero; la de la Administración General del Estado, del tercero al segundo; y la de RENFE-Operadora y entidades privadas, del cuarto al tercero.",
        kind: "interpretative",
        legalBasis: ["rd2395-2004-art4"],
        review: verifiedEstatuto,
      },
      {
        id: "estatuto-c102-4",
        text: "El epígrafe del artículo 4 sigue siendo «Convenios o contratos-programa» aunque el apartado que regulaba el contrato-programa fue suprimido en 2013: el rótulo se mantiene en el texto consolidado y no debe usarse como prueba de que la figura conserve articulado propio.",
        kind: "interpretative",
        legalBasis: ["rd2395-2004-art4"],
        review: verifiedEstatuto,
      },
    ],
  },
  {
    id: "estatuto-concept-103",
    title: "Administración de la RFIG: objeto del artículo 9",
    claims: [
      normativeClaim(
        "estatuto-c103-1",
        "La administración de las infraestructuras ferroviarias integradas en la Red Ferroviaria de Interés General tiene por objeto el mantenimiento y la explotación de aquéllas, así como la gestión de sus sistemas de control, de circulación y de seguridad.",
        "Artículo 9",
        verifiedEstatuto,
      ),
      normativeClaim(
        "estatuto-c103-2",
        "ADIF es competente para mantener y explotar las infraestructuras ferroviarias de las que es titular y para gestionar sus sistemas de control, de circulación y de seguridad.",
        "Artículo 9",
        verifiedEstatuto,
      ),
      {
        id: "estatuto-c103-3",
        text: "Administrar la infraestructura y prestar transporte ferroviario son actividades distintas. El artículo 3.2 dispone que ADIF no puede prestar servicios de transporte ferroviario salvo los inherentes a su propia actividad.",
        kind: "interpretative",
        legalBasis: ["rd2395-2004-art9", "rd2395-2004-art3-2"],
        review: verifiedEstatuto,
      },
    ],
  },
  {
    id: "estatuto-concept-104",
    title: "Mantenimiento de la infraestructura: definición del artículo 10",
    claims: [
      normativeClaim(
        "estatuto-c104-1",
        "A efectos del Estatuto, el mantenimiento de infraestructura ferroviaria es el conjunto de operaciones de conservación, reparación, reposición y actualización tecnológica de elementos que permite preservar las infraestructuras integradas en la RFIG en condiciones adecuadas de operatividad y seguridad.",
        "Artículo 10",
        verifiedEstatuto,
      ),
      normativeClaim(
        "estatuto-c104-2",
        "Corresponde al ADIF la realización de los estudios y la aprobación y el replanteo de los proyectos y de sus modificaciones necesarios para el mantenimiento; la redacción material de estudios y proyectos puede llevarla a cabo el propio ADIF o terceros.",
        "Artículo 10",
        verifiedEstatuto,
      ),
      {
        id: "estatuto-c104-3",
        text: "El concepto legal no se limita a conservar y reparar: incluye también reponer y actualizar tecnológicamente los elementos. Quedan fuera del concepto la construcción de nuevas líneas y la explotación comercial del transporte.",
        kind: "interpretative",
        legalBasis: ["rd2395-2004-art10"],
        review: verifiedEstatuto,
      },
    ],
  },
  {
    id: "estatuto-concept-105",
    title: "Órganos de gobierno del artículo 14 y su desarrollo",
    claims: [
      normativeClaim(
        "estatuto-c105-1",
        "Los órganos de gobierno del ADIF son exactamente dos: el Consejo de Administración y el Presidente. No son órganos de gobierno el Comité de Auditoría, un Consejo Asesor ni la Secretaría General de Infraestructuras.",
        "Artículo 14",
        verifiedEstatuto,
      ),
      normativeClaim(
        "estatuto-c105-2",
        "El Consejo de Administración rige ADIF y asume la superior dirección de su administración y gestión; está formado por el Presidente y un mínimo de nueve y un máximo de diez vocales, cuyo nombramiento y cese corresponde al Ministerio de Fomento. El Presidente de la entidad es también Presidente del Consejo.",
        "Artículo 15",
        verifiedEstatuto,
      ),
      {
        id: "estatuto-c105-3",
        text: "No confundas órganos de gobierno con personal directivo: los Directores Generales, los Directores Gerentes de las Unidades de negocio y los Directores Corporativos son personal directivo, no órganos de gobierno de la entidad.",
        kind: "interpretative",
        legalBasis: ["rd2395-2004-art14", "rd2395-2004-art27"],
        review: verifiedEstatuto,
      },
      normativeClaim(
        "estatuto-c105-4",
        "El Consejo puede delegar competencias en el Presidente, las Comisiones Delegadas y los restantes órganos internos que determine, salvo las materias de las letras a), b), d), e), f), g), i), l), m), o), p) y r) del artículo 16. Como órgano de contratación, solo puede delegar en el Presidente y las Comisiones Delegadas las facultades que le corresponden por la letra h) del artículo anterior; no pueden incluirse la aprobación del expediente, del gasto, la apertura del procedimiento de adjudicación ni la adjudicación del contrato. La aprobación de la declaración contemplada en la letra n) no es delegable en ningún caso.",
        "Artículo 17",
        verifiedEstatuto,
      ),
      normativeClaim(
        "estatuto-c105-5",
        "En caso de urgente necesidad, el Presidente puede adoptar excepcionalmente decisiones reservadas al Consejo de Administración, pero debe dar cuenta de ellas en la primera reunión ordinaria posterior para que el Consejo las ratifique.",
        "Artículo 24",
        verifiedEstatuto,
      ),
    ],
  },
  {
    id: "estatuto-concept-106",
    title: "Quién hace qué: mapa de intervinientes",
    claims: [
      {
        id: "estatuto-c106-1",
        text: "Consejo de Administración → superior dirección y decisiones del catálogo del artículo 16, con los límites de delegación del artículo 17. Presidente → representación, convocatoria y ejecución de acuerdos. ADIF → mantiene y explota las infraestructuras de su titularidad y gestiona sus sistemas de control, circulación y seguridad; también puede convenir con comunidades autónomas la administración de sus redes. Empresas ferroviarias → transporte ferroviario, sin olvidar la excepción del artículo 3.2 para servicios inherentes a la actividad de ADIF. El Estatuto atribuye el nombramiento y cese de vocales al entonces Ministerio de Fomento.",
        kind: "interpretative",
        legalBasis: ["rd2395-2004-art14", "rd2395-2004-art15", "rd2395-2004-art16", "rd2395-2004-art17", "rd2395-2004-art9", "rd2395-2004-art3-2", "rd2395-2004-art4"],
        review: verifiedEstatuto,
      },
    ],
  },
];

const coveredByExisting = new Set([
  "Artículo 1", "Artículo 3", "Artículo 15", "Artículo 23", "Artículo 27",
  "Artículo 30", "Artículo 31", "Artículo 38", "Artículo 39",
]);

const additionalConcepts: TheoryConcept[] = estatutoAdifOutline
  .filter((item) => !coveredByExisting.has(item.number))
  .map((item, index) => ({
    id: `estatuto-concept-${index + 11}`,
    title: item.title,
    claims: [
      normativeClaim(`estatuto-c${index + 11}-1`, item.content, item.locator),
      ...(item.locator === "Artículo 11"
        ? [
            {
              id: `estatuto-c${index + 11}-2`,
              text: "A efectos de la prohibición de encomendar a terceros las funciones de gestión de los sistemas de control, circulación y seguridad, esas funciones son las referidas a prestar el servicio dirigido a garantizar la eficacia del sistema y su plena fiabilidad.",
              kind: "normative" as const,
              legalBasis: legalBasis("Artículo 11"),
              review: verifiedEstatuto,
            },
          ]
        : []),
    ],
  }));

export const estatutoAdifTheory: TheorySection = {
  sources: [...sourceByLocator.values(), ...externalSources],
  introduction: [
    normativeClaim("estatuto-intro-1", "El Real Decreto 2395/2004 aprueba el Estatuto de ADIF y organiza su naturaleza, funciones, órganos, personal, patrimonio y régimen económico-financiero.", "Artículo único"),
    {
      id: "estatuto-intro-2",
      text: "El material del curso destaca todos los artículos y disposiciones del Estatuto. La literalidad debe cotejarse con el texto consolidado del BOE, cuya última actualización publicada figura en 2013.",
      kind: "didactic",
      legalBasis: [],
    },
  ],
  concepts: [...existingConcepts, ...additionalConcepts],
  examples: [
    {
      id: "estatuto-ex-1",
      situation: "Una pregunta atribuye al Presidente una competencia reservada al Consejo de Administración.",
      application: [{ id: "estatuto-ex-1-app-1", text: "Comprueba primero si la materia está en el catálogo del artículo 16 y después si el artículo 17 permite delegarla; la aprobación de la Declaración sobre la Red y varias decisiones de contratación tienen límites de delegación.", kind: "didactic", legalBasis: [] }],
    },
    {
      id: "estatuto-ex-2",
      situation: "Se convoca un Consejo con menos de 48 horas y se pretende aprobar un acuerdo sin respetar el quórum.",
      application: [{ id: "estatuto-ex-2-app-1", text: "Distingue la convocatoria ordinaria, la reunión extraordinaria y la primera o segunda convocatoria; el artículo 19 fija plazos, peticiones y quórums concretos.", kind: "didactic", legalBasis: [] }],
    },
    {
      id: "estatuto-ex-3",
      situation: "Una pregunta mezcla el excedente anual, el remanente y el fondo de necesidades de ADIF.",
      application: [{ id: "estatuto-ex-3-app-1", text: "El artículo 43 separa la financiación de inversiones y reducción de deuda, el ingreso del remanente en el Tesoro y la detracción del 20 % para un fondo con límite del 10 % de los gastos de explotación.", kind: "didactic", legalBasis: [] }],
    },
    {
      id: "estatuto-ex-4",
      situation: "Un temario antiguo afirma que el artículo 4.1 del Estatuto se refiere a los convenios o contratos-programa de encomienda de administración de infraestructuras de titularidad estatal.",
      application: [
        {
          id: "estatuto-ex-4-app-1",
          text: "Ese contenido fue el del apartado primero original, suprimido en 2013. En la redacción vigente el apartado primero regula los convenios con las comunidades autónomas para construir y administrar sus redes, el segundo los convenios con la Administración General del Estado u otras Administraciones Públicas, y el tercero los convenios de colaboración con RENFE-Operadora, empresas ferroviarias o entidades públicas y privadas.",
          kind: "example",
          legalBasis: ["rd2395-2004-art4"],
          review: verifiedEstatuto,
        },
      ],
    },
    {
      id: "estatuto-ex-5",
      situation: "Una pregunta atribuye a ADIF la prestación del servicio de transporte ferroviario de viajeros en una línea de su titularidad.",
      application: [
        {
          id: "estatuto-ex-5-app-1",
          text: "La administración de la infraestructura comprende mantenimiento, explotación y gestión de los sistemas de control, circulación y seguridad. El artículo 3.2 impide a ADIF prestar servicios de transporte ferroviario salvo los inherentes a su propia actividad: no debe omitirse esa excepción.",
          kind: "example",
          legalBasis: ["rd2395-2004-art9", "rd2395-2004-art3-2"],
          review: verifiedEstatuto,
        },
      ],
    },
  ],
  reviewTakeaways: [
    {
      id: "estatuto-takeaway-1",
      text: "No confundas las funciones generales del artículo 3 con las competencias del Consejo del artículo 16 y las facultades del Presidente del artículo 23.",
      kind: "didactic",
      legalBasis: [],
    },
    {
      id: "estatuto-takeaway-2",
      text: "Los datos más preguntables del bloque organizativo son 9-10 vocales, al menos 11 reuniones al año, 48 horas de convocatoria, un tercio para la segunda convocatoria y 3-7 vocales en una Comisión Delegada.",
      kind: "didactic",
      legalBasis: [],
    },
    {
      id: "estatuto-takeaway-3",
      text: "En el bloque económico, retén la contabilidad separada del artículo 37 y la regla del 20 % y 10 % del artículo 43; coteja siempre los umbrales de contratación con la legislación vigente.",
      kind: "didactic",
      legalBasis: [],
    },
    {
      id: "estatuto-takeaway-4",
      text: "Órganos de gobierno (artículo 14): solo dos, Consejo de Administración y Presidente. Los vocales son entre nueve y diez y los nombra el Ministerio de Fomento.",
      kind: "normative",
      legalBasis: ["rd2395-2004-art14", "rd2395-2004-art15"],
      review: verifiedEstatuto,
    },
    {
      id: "estatuto-takeaway-5",
      text: "Autonomía de gestión (artículo 2): tres límites normativos y cuatro criterios acumulativos (interés público, necesidades sociales con máxima calidad, seguridad de los usuarios y eficacia global del sistema).",
      kind: "normative",
      legalBasis: ["rd2395-2004-art2"],
      review: verifiedEstatuto,
    },
    {
      id: "estatuto-takeaway-6",
      text: "Mantenimiento (artículo 10): conservación, reparación, reposición y actualización tecnológica. La administración de la RFIG (artículo 9) comprende mantenimiento, explotación y gestión de control, circulación y seguridad. El artículo 3.2 exceptúa de la prohibición de transporte de ADIF el inherente a su actividad.",
      kind: "normative",
      legalBasis: ["rd2395-2004-art9", "rd2395-2004-art10", "rd2395-2004-art3-2"],
      review: verifiedEstatuto,
    },
    {
      id: "estatuto-takeaway-7",
      text: "Artículo 4: la reforma de 2013 suprimió el apartado del contrato-programa y renumeró el resto. En la redacción vigente, el apartado primero es el de los convenios con las comunidades autónomas; el epígrafe sigue diciendo «Convenios o contratos-programa» por inercia del rótulo.",
      kind: "interpretative",
      legalBasis: ["rd2395-2004-art4"],
      review: verifiedEstatuto,
    },
  ],
};
