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

function normativeClaim(id: string, text: string, locator: string) {
  const basis = new Set(legalBasis(locator));
  for (const token of text.matchAll(/\bartículo\s+(\d+)/gi)) {
    const referenced = sourceByLocator.get(`Artículo ${token[1]}`);
    if (referenced) basis.add(referenced.id);
  }
  if (/Ley 38\/2015|Ley del Sector Ferroviario/i.test(text)) basis.add("ley-38-2015");
  if (/Declaración sobre la Red/i.test(text)) basis.add("dr-2027");
  return { id, text, kind: "normative" as const, legalBasis: [...basis] };
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
    claims: [normativeClaim(`estatuto-c${index + 11}-1`, item.content, item.locator)],
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
  ],
};
