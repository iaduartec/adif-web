import { lessonTheories } from "./lesson-theory";
import { lessons } from "./lessons";
import { SYLLABUS_SOURCES } from "./syllabus-sources";

export type ConfirmedSyllabusStatus = "covered" | "partial" | "missing" | "reference-only";
export type SyllabusStatus = ConfirmedSyllabusStatus | "unresolved";
export type OfficialSyllabusScope = "common" | "specific-26-12po";

export type SyllabusNode = {
  id: string;
  title: string;
  /** Exact source document containing this node's scoped material. */
  sourceId: string;
  sourceVersion: string;
  sourceLocator: string;
  materialSourceIds: string[];
  status: SyllabusStatus;
  linkedModules: string[];
  rationale: string;
  priority?: "P0" | "P1" | "P2" | "P3";
};

export type SyllabusItem = {
  id: string;
  title: string;
  scope: OfficialSyllabusScope;
  /** ADIF page that establishes this document as part of the PNI26/01 scope. */
  scopeSourceId: string;
  scopeSourceVersion: string;
  scopeLocator: string;
  /** PDF linked from the profile page; preserved even when a newer edition exists. */
  sourceId: string;
  sourceVersion: string;
  sourceLocator: string;
  children: readonly SyllabusNode[];
  rationale: string;
};

export type SupplementalSyllabusItem = {
  id: string;
  title: string;
  sourceIds: string[];
  linkedModules: string[];
  rationale: string;
  priority?: "P0" | "P1" | "P2" | "P3";
};

export type SyllabusInventoryMeta = {
  sourceComplete: boolean;
  sourceDocumentId: string;
  sourceTitle: string;
  sourceUrl: string;
  extractedItems: number;
  unresolvedItems: number;
};

export type SyllabusCoverageMetrics = {
  officialItemsTotal: number | null;
  mapped: number;
  covered: number;
  partial: number;
  missing: number;
  referenceOnly: number;
  unresolved: number;
  coveragePercent: number | null;
};

const scopeSourceId = "pni26-01";
const scopeSourceVersion = "page-capture-2026-10-15";
const linkedPdfVersion = "adif-live-2026-10-15";
const currentDeclarationVersion = "edition-2027-2026-07-31";

export const syllabusInventoryMeta: SyllabusInventoryMeta = {
  sourceComplete: true,
  sourceDocumentId: "ADIF PNI26/01",
  sourceTitle: SYLLABUS_SOURCES[scopeSourceId].title,
  sourceUrl: SYLLABUS_SOURCES[scopeSourceId].url,
  extractedItems: 9,
  unresolvedItems: 0,
};

function node(
  value: Omit<SyllabusNode, "sourceVersion"> & { sourceVersion?: string },
): SyllabusNode {
  return { ...value, sourceVersion: value.sourceVersion ?? linkedPdfVersion };
}

function officialItem(
  value: Omit<SyllabusItem, "scopeSourceId" | "scopeSourceVersion" | "scopeLocator"> & {
    scopeLocator: string;
  },
): SyllabusItem {
  return { ...value, scopeSourceId, scopeSourceVersion };
}

/** The nine parent documents listed by ADIF for PNI26/01. */
export const officialItems: readonly SyllabusItem[] = [
  officialItem({
    id: "syllabus-igualdad",
    title: "Ley Orgánica 3/2007, de 22 de marzo, para la igualdad efectiva de mujeres y hombres",
    scope: "common",
    scopeLocator: "Página PNI26/01 → 2. Temario común → punto 1",
    sourceId: "PNI26-COMMON-01",
    sourceVersion: linkedPdfVersion,
    sourceLocator: "PDF ADIF, portada e índice, pp. 1–2; documento completo, 66 páginas.",
    rationale: "ADIF no publica un recorte: el PDF contiene el texto completo de la Ley Orgánica 3/2007.",
    children: [
      node({
        id: "igualdad-ley-completa",
        title: "Texto completo: preámbulo, título preliminar y títulos I–VIII",
        sourceId: "PNI26-COMMON-01",
        sourceLocator: "PDF pp. 1–66; índice en pp. 1–5 y texto consolidado desde p. 6.",
        materialSourceIds: ["LO 3/2007"],
        status: "partial",
        linkedModules: ["igualdad"],
        rationale: "La teoría existente desarrolla artículos seleccionados, no toda la ley.",
      }),
    ],
  }),
  officialItem({
    id: "syllabus-prl",
    title: "Ley 31/1995, de 8 de noviembre, de Prevención de Riesgos Laborales",
    scope: "common",
    scopeLocator: "Página PNI26/01 → 2. Temario común → punto 2",
    sourceId: "PNI26-COMMON-02",
    sourceVersion: linkedPdfVersion,
    sourceLocator: "PDF ADIF, portada e índice, pp. 1–2; extracto de 24 páginas.",
    rationale: "El PDF y ADIF delimitan expresamente la exposición de motivos y los capítulos I, III y V.",
    children: [
      node({
        id: "prl-exposicion-motivos",
        title: "Exposición de motivos",
        sourceId: "PNI26-COMMON-02",
        sourceLocator: "PDF p. 3; texto impreso de la exposición de motivos, pp. 5–7.",
        materialSourceIds: [],
        status: "missing",
        linkedModules: [],
        rationale: "No hay teoría vinculada a esta parte del alcance oficial.",
      }),
      node({
        id: "prl-capitulo-i",
        title: "Capítulo I (artículos 1–4)",
        sourceId: "PNI26-COMMON-02",
        sourceLocator: "PDF p. 1 (índice); Capítulo I, artículos 1–4.",
        materialSourceIds: [],
        status: "missing",
        linkedModules: [],
        rationale: "El módulo actual no desarrolla este capítulo de forma trazable.",
      }),
      node({
        id: "prl-capitulo-iii",
        title: "Capítulo III (artículos 14–29)",
        sourceId: "PNI26-COMMON-02",
        sourceLocator: "PDF pp. 1–2 (índice); Capítulo III, artículos 14–29.",
        materialSourceIds: ["Ley 31/1995"],
        status: "partial",
        linkedModules: ["prevencion-riesgos-laborales"],
        rationale: "El módulo cubre artículos de este capítulo, pero deja artículos sin desarrollar.",
      }),
      node({
        id: "prl-capitulo-v",
        title: "Capítulo V (artículos 33–40)",
        sourceId: "PNI26-COMMON-02",
        sourceLocator: "PDF p. 2 (índice); Capítulo V, artículos 33–40.",
        materialSourceIds: ["Ley 31/1995"],
        status: "partial",
        linkedModules: ["prevencion-riesgos-laborales"],
        rationale: "La teoría actual enlaza artículos 35 y 38; falta completar el capítulo.",
      }),
    ],
  }),
  officialItem({
    id: "syllabus-estatuto-adif",
    title: "Real Decreto 2395/2004, de 30 de diciembre, por el que se aprueba el Estatuto de ADIF",
    scope: "common",
    scopeLocator: "Página PNI26/01 → 2. Temario común → punto 3",
    sourceId: "PNI26-COMMON-03",
    sourceVersion: linkedPdfVersion,
    sourceLocator: "PDF ADIF, portada e índice, pp. 1–2; Estatuto completo.",
    rationale: "ADIF no indica un recorte del Estatuto; se conserva íntegro como alcance.",
    children: [
      node({ id: "estatuto-capitulo-i", title: "Capítulo I. Disposiciones generales (artículos 1–2)", sourceId: "PNI26-COMMON-03", sourceLocator: "PDF p. 2 (índice); Capítulo I, artículos 1–2.", materialSourceIds: ["RD 2395/2004"], status: "partial", linkedModules: ["estatuto-adif"], rationale: "Hay conceptos enlazados, pero el capítulo no está cubierto de forma exhaustiva." }),
      node({ id: "estatuto-capitulo-ii", title: "Capítulo II. Funciones de ADIF (artículos 3–13)", sourceId: "PNI26-COMMON-03", sourceLocator: "PDF p. 2 (índice); Capítulo II, artículos 3–13.", materialSourceIds: ["RD 2395/2004"], status: "partial", linkedModules: ["estatuto-adif"], rationale: "La teoría desarrolla algunas funciones y no todo el capítulo." }),
      node({ id: "estatuto-capitulo-iii", title: "Capítulo III. Organización (artículos 14–26)", sourceId: "PNI26-COMMON-03", sourceLocator: "PDF p. 2 (índice); Capítulo III, artículos 14–26.", materialSourceIds: ["RD 2395/2004"], status: "partial", linkedModules: ["estatuto-adif"], rationale: "La teoría enlaza puntos de organización, pero no todos los artículos." }),
      node({ id: "estatuto-capitulo-iv", title: "Capítulo IV. Personal (artículos 27–29)", sourceId: "PNI26-COMMON-03", sourceLocator: "PDF p. 2 (índice); Capítulo IV, artículos 27–29.", materialSourceIds: ["RD 2395/2004"], status: "partial", linkedModules: ["estatuto-adif"], rationale: "Hay contenido sobre personal; el capítulo sigue incompleto." }),
      node({ id: "estatuto-capitulo-v", title: "Capítulo V. Régimen patrimonial (artículos 30–32)", sourceId: "PNI26-COMMON-03", sourceLocator: "PDF p. 2 (índice); Capítulo V, artículos 30–32.", materialSourceIds: ["RD 2395/2004"], status: "partial", linkedModules: ["estatuto-adif"], rationale: "La teoría actual desarrolla algunos artículos patrimoniales." }),
      node({ id: "estatuto-capitulo-vi", title: "Capítulo VI. Régimen económico-financiero (artículos 33–44)", sourceId: "PNI26-COMMON-03", sourceLocator: "PDF p. 2 (índice); Capítulo VI, artículos 33–44.", materialSourceIds: ["RD 2395/2004"], status: "partial", linkedModules: ["estatuto-adif"], rationale: "La teoría enlaza el artículo 39, no todo el régimen económico-financiero." }),
    ],
  }),
  officialItem({
    id: "syllabus-declaracion-red",
    title: "Declaración sobre la Red ADIF 2027, capítulos I y II",
    scope: "common",
    scopeLocator: "Página PNI26/01 → 2. Temario común → punto 4",
    sourceId: "PNI26-COMMON-04",
    sourceVersion: linkedPdfVersion,
    sourceLocator: "PDF enlazado por PNI26/01, portada y capítulos I–II; el archivo se conserva como evidencia del enlace del perfil.",
    rationale: "La ficha general de ADIF lista la edición 31/07/2026, pero el PDF enlazado desde PNI26/01 conserva en sus páginas la marca V.0 (ED 27/02/2026). Se usa la edición general vigente para el contenido y se registra la diferencia de versiones.",
    children: [
      node({
        id: "declaracion-red-capitulo-i",
        title: "Capítulo I. Información general",
        sourceId: "DR 2027 Libro 2027",
        sourceVersion: currentDeclarationVersion,
        sourceLocator: "PDF vigente según ficha ADIF, edición 31/07/2026, pp. 5–6 (índice del capítulo I).",
        materialSourceIds: ["DR 2027"],
        status: "partial",
        linkedModules: ["declaracion-red-2027"],
        rationale: "La teoría existente se centra en apartados seleccionados; hay que revisar los localizadores frente a la edición vigente.",
      }),
      node({
        id: "declaracion-red-capitulo-ii",
        title: "Capítulo II. Infraestructura",
        sourceId: "DR 2027 Libro 2027",
        sourceVersion: currentDeclarationVersion,
        sourceLocator: "PDF vigente según ficha ADIF, edición 31/07/2026, p. 3 (índice general del capítulo II).",
        materialSourceIds: [],
        status: "missing",
        linkedModules: [],
        rationale: "No se ha mapeado teoría a este capítulo; la versión de febrero del adjunto PNI no se usa como sustituto de la edición vigente.",
      }),
    ],
  }),
  officialItem({
    id: "syllabus-codigo-conducta",
    title: "Real Decreto Legislativo 5/2015 (EBEP), capítulo VI del título III: deberes y código de conducta",
    scope: "common",
    scopeLocator: "Página PNI26/01 → 2. Temario común → punto 5",
    sourceId: "PNI26-COMMON-05",
    sourceVersion: linkedPdfVersion,
    sourceLocator: "PDF ADIF, portada e índice, pp. 1–3; Título III, capítulo VI.",
    rationale: "Se limita al capítulo VI del título III y no extiende el tema al EBEP completo.",
    children: [
      node({
        id: "ebep-capitulo-vi-titulo-iii",
        title: "Capítulo VI, título III (artículos 52–54)",
        sourceId: "PNI26-COMMON-05",
        sourceLocator: "PDF p. 3 (índice); artículos 52–54, pp. 32–33 de la legislación consolidada.",
        materialSourceIds: ["TREBEP"],
        status: "partial",
        linkedModules: ["codigo-conducta"],
        rationale: "La teoría enlaza los tres artículos, pero requiere revisión de cobertura y de la versión consolidada vigente.",
      }),
    ],
  }),
  officialItem({
    id: "syllabus-incompatibilidades",
    title: "Ley 53/1984, de incompatibilidades del personal al servicio de las Administraciones Públicas",
    scope: "common",
    scopeLocator: "Página PNI26/01 → 2. Temario común → punto 6",
    sourceId: "PNI26-COMMON-06",
    sourceVersion: linkedPdfVersion,
    sourceLocator: "PDF ADIF, portada e índice, pp. 1–3; documento completo, 15 páginas.",
    rationale: "ADIF no restringe el documento: se conserva el texto completo, incluidas sus disposiciones.",
    children: [
      node({
        id: "incompatibilidades-ley-completa",
        title: "Ley completa (preámbulo, capítulos I–V y disposiciones)",
        sourceId: "PNI26-COMMON-06",
        sourceLocator: "PDF pp. 1–15; índice en pp. 1–3 y texto consolidado desde p. 4.",
        materialSourceIds: ["Ley 53/1984"],
        status: "partial",
        linkedModules: ["incompatibilidades"],
        rationale: "La teoría cubre artículos seleccionados; no incluye todo el texto ni todas las disposiciones.",
      }),
    ],
  }),
  officialItem({
    id: "syllabus-ict",
    title: "Real Decreto 346/2011: Reglamento regulador de las infraestructuras comunes de telecomunicaciones",
    scope: "specific-26-12po",
    scopeLocator: "Página PNI26/01 → 6. Parte específica → Oficial de Telecomunicaciones 26/12PO → punto 1",
    sourceId: "PNI26-12PO-SPECIFIC-01",
    sourceVersion: linkedPdfVersion,
    sourceLocator: "PDF ADIF, portada e índice, pp. 1–2; Reglamento y anexos I–V.",
    rationale: "El PDF oficial no limita el alcance a un solo anexo: incluye los capítulos I–II y anexos I–V.",
    children: [
      node({ id: "ict-capitulo-i", title: "Capítulo I. Disposiciones generales (artículos 1–3)", sourceId: "PNI26-12PO-SPECIFIC-01", sourceLocator: "PDF p. 2 (índice); capítulo I, artículos 1–3.", materialSourceIds: ["RD 346/2011"], status: "partial", linkedModules: ["ict-rd-346-2011"], rationale: "La teoría desarrolla algunos artículos generales; falta completar el capítulo." }),
      node({ id: "ict-capitulo-ii", title: "Capítulo II. Infraestructura común de telecomunicaciones (artículos 4–15)", sourceId: "PNI26-12PO-SPECIFIC-01", sourceLocator: "PDF p. 2 (índice); capítulo II, artículos 4–15.", materialSourceIds: ["RD 346/2011"], status: "partial", linkedModules: ["ict-rd-346-2011"], rationale: "Hay contenido parcial sobre obligaciones, proyecto, conservación y hogar digital." }),
      node({ id: "ict-anexo-i", title: "Anexo I. Radiodifusión sonora y televisión", sourceId: "PNI26-12PO-SPECIFIC-01", sourceLocator: "PDF p. 2 (índice); Anexo I, desde la página impresa 16.", materialSourceIds: ["RD 346/2011"], status: "partial", linkedModules: ["ict-rd-346-2011"], rationale: "Se desarrollan algunos elementos de la red y del cableado; la cobertura es parcial." }),
      node({ id: "ict-anexo-ii", title: "Anexo II. Telefonía disponible al público y banda ancha", sourceId: "PNI26-12PO-SPECIFIC-01", sourceLocator: "PDF p. 2 (índice); Anexo II, desde la página impresa 24.", materialSourceIds: ["RD 346/2011"], status: "partial", linkedModules: ["ict-rd-346-2011"], rationale: "La teoría contiene conceptos de red, puntos de conexión y fibra; falta revisar el anexo completo." }),
      node({ id: "ict-anexo-iii", title: "Anexo III. Especificaciones técnicas mínimas de las edificaciones", sourceId: "PNI26-12PO-SPECIFIC-01", sourceLocator: "PDF p. 2 (índice); Anexo III, desde la página impresa 59.", materialSourceIds: [], status: "missing", linkedModules: [], rationale: "No hay teoría trazada a este anexo." }),
      node({ id: "ict-anexo-iv", title: "Anexo IV. Inspección y mantenimiento de las infraestructuras de telecomunicaciones", sourceId: "PNI26-12PO-SPECIFIC-01", sourceLocator: "PDF p. 2 (índice) y p. 84; secciones 1–3: inspección, mantenimiento y documentos normalizados.", materialSourceIds: ["RD 346/2011"], status: "partial", linkedModules: ["ict-rd-346-2011"], rationale: "El módulo enlaza conceptos de conservación e inspección, sin cubrir íntegramente las tres secciones del anexo." }),
      node({ id: "ict-anexo-v", title: "Anexo V. Hogar Digital", sourceId: "PNI26-12PO-SPECIFIC-01", sourceLocator: "PDF p. 2 (índice); Anexo V, desde la página impresa 112.", materialSourceIds: ["RD 346/2011"], status: "partial", linkedModules: ["ict-rd-346-2011"], rationale: "La teoría incluye el concepto, pero falta completar los requisitos y niveles del anexo." }),
    ],
  }),
  officialItem({
    id: "syllabus-compatibilidad-electromagnetica",
    title: "Compatibilidad electromagnética y seguridad en los ferrocarriles",
    scope: "specific-26-12po",
    scopeLocator: "Página PNI26/01 → 6. Parte específica → Oficial de Telecomunicaciones 26/12PO → punto 2",
    sourceId: "PNI26-12PO-SPECIFIC-02",
    sourceVersion: linkedPdfVersion,
    sourceLocator: "PDF ADIF pp. 1–7; artículo REE, mayo de 2015, pp. 80–86 de revista.",
    rationale: "ADIF determina que este artículo forma parte del temario; el documento indica que fue cedido por Cemdal y no debe tratarse como normativa ni atribuirse su autoría a ADIF.",
    children: [
      node({
        id: "cem-articulo-ree-completo",
        title: "Artículo completo: compatibilidad electromagnética y seguridad ferroviaria",
        sourceId: "PNI26-12PO-SPECIFIC-02",
        sourceLocator: "PDF pp. 1–7 (paginación de REE 80–86); artículo completo, autoría y cesión indicadas en p. 1.",
        materialSourceIds: [],
        status: "missing",
        linkedModules: [],
        rationale: "El módulo actual trata leyes y normas relacionadas, pero todavía no resume ni cita este artículo asignado por ADIF.",
      }),
    ],
  }),
  officialItem({
    id: "syllabus-rcf",
    title: "Reglamento de Circulación Ferroviaria (RCF), Libro 1",
    scope: "specific-26-12po",
    scopeLocator: "Página PNI26/01 → 6. Parte específica → Oficial de Telecomunicaciones 26/12PO → punto 3",
    sourceId: "PNI26-12PO-SPECIFIC-03",
    sourceVersion: linkedPdfVersion,
    sourceLocator: "PDF ADIF p. 1 (índice); Libro Primero, Principios Fundamentales, 21 páginas.",
    rationale: "El alcance publicado es el Libro Primero, con sus cinco capítulos; no se amplía a los demás libros del RCF.",
    children: [
      node({ id: "rcf-capitulo-1", title: "Capítulo 1. Generalidades", sourceId: "PNI26-12PO-SPECIFIC-03", sourceLocator: "PDF p. 1 (índice); capítulo 1 del Libro Primero.", materialSourceIds: ["RD 664/2015"], status: "partial", linkedModules: ["rcf-libro-1"], rationale: "La teoría incluye objeto, ámbito y definiciones seleccionadas." }),
      node({ id: "rcf-capitulo-2", title: "Capítulo 2. Documentación reglamentaria", sourceId: "PNI26-12PO-SPECIFIC-03", sourceLocator: "PDF p. 1 (índice); capítulo 2 del Libro Primero.", materialSourceIds: ["RD 664/2015"], status: "partial", linkedModules: ["rcf-libro-1"], rationale: "Hay conceptos de documentación, pero falta completar el capítulo." }),
      node({ id: "rcf-capitulo-3", title: "Capítulo 3. Distribución de documentos y útiles de servicio", sourceId: "PNI26-12PO-SPECIFIC-03", sourceLocator: "PDF p. 1 (índice); capítulo 3 del Libro Primero.", materialSourceIds: [], status: "missing", linkedModules: [], rationale: "No hay teoría vinculada a este capítulo." }),
      node({ id: "rcf-capitulo-4", title: "Capítulo 4. Comunicaciones reglamentarias", sourceId: "PNI26-12PO-SPECIFIC-03", sourceLocator: "PDF p. 1 (índice); capítulo 4 del Libro Primero.", materialSourceIds: ["RD 664/2015"], status: "partial", linkedModules: ["rcf-libro-1"], rationale: "La teoría cubre algunos procedimientos de comunicación." }),
      node({ id: "rcf-capitulo-5", title: "Capítulo 5. Conceptos básicos de circulación", sourceId: "PNI26-12PO-SPECIFIC-03", sourceLocator: "PDF p. 1 (índice); capítulo 5 del Libro Primero.", materialSourceIds: ["RD 664/2015"], status: "partial", linkedModules: ["rcf-libro-1"], rationale: "La teoría incluye supuestos seleccionados de marcha y circulación." }),
    ],
  }),
];

/** Adjacent topics from the prior inventory remain visible, but are not official syllabus parents. */
export const supplementalItems: readonly SupplementalSyllabusItem[] = [
  { id: "syllabus-constitucion", title: "Constitución Española", sourceIds: ["CE"], linkedModules: ["igualdad"], rationale: "Contexto jurídico relacionado; ADIF no la enumera como tema independiente de PNI26/01." },
  { id: "syllabus-sector-ferroviario", title: "Sector ferroviario y ADIF", sourceIds: ["Ley 38/2015"], linkedModules: ["estatuto-adif", "declaracion-red-2027"], rationale: "Material de contexto; no añadir la Ley 38/2015 como tema oficial independiente." },
  { id: "syllabus-epi", title: "Equipos de protección individual", sourceIds: ["RD 773/1997"], linkedModules: ["prevencion-riesgos-laborales"], rationale: "Material suplementario de PRL; no aparece en el recorte oficial de la Ley 31/1995." },
  { id: "syllabus-igualdad-retributiva", title: "Igualdad retributiva", sourceIds: ["RD 902/2020"], linkedModules: ["igualdad"], rationale: "Material relacionado que ADIF no enumera como documento separado." },
  { id: "syllabus-cem-legal", title: "Marco legal de compatibilidad electromagnética", sourceIds: ["Real Decreto 186/2016", "Directiva 2014/30/UE"], linkedModules: ["compatibilidad-electromagnetica"], rationale: "Contexto de estudio; no constituye un cuarto documento específico independiente." },
  { id: "syllabus-cem-directiva", title: "Directiva europea de compatibilidad electromagnética", sourceIds: ["Directiva 2014/30/UE"], linkedModules: ["compatibilidad-electromagnetica"], rationale: "Material de consulta relacionado, fuera de los tres documentos específicos publicados." },
  { id: "syllabus-en-50121", title: "EN 50121: compatibilidad electromagnética ferroviaria", sourceIds: ["EN 50121"], linkedModules: ["compatibilidad-electromagnetica"], rationale: "El artículo asignado menciona la familia EN 50121; ADIF no la lista como documento oficial separado." , priority: "P0" },
  { id: "syllabus-psicometria", title: "Prueba psicométrica y aptitudes cognitivas", sourceIds: ["MET-PSI-01"], linkedModules: ["psicometria"], rationale: "Módulo de preparación de prueba, separado del temario normativo y sin copiar test protegidos.", priority: "P0" },
  { id: "syllabus-ingles-a2", title: "Inglés A2 de preparación", sourceIds: ["MCER-A2"], linkedModules: ["ingles-a2"], rationale: "Módulo de práctica lingüística; el nivel y formato 2026 quedan sujetos a instrucciones ADIF." },
];

/** Backward-compatible name for the official, parent-level inventory only. */
export const syllabusItems = officialItems;

function summarizeItem(item: SyllabusItem): SyllabusStatus {
  const statuses = item.children.map((child) => child.status);
  if (statuses.length === 0 || statuses.includes("unresolved")) return "unresolved";
  if (statuses.every((status) => status === "covered")) return "covered";
  if (statuses.every((status) => status === "reference-only")) return "reference-only";
  if (statuses.some((status) => status === "covered" || status === "partial")) return "partial";
  if (statuses.every((status) => status === "missing")) return "missing";
  return "unresolved";
}

export function getSyllabusCoverage(
  items: readonly SyllabusItem[] = officialItems,
  meta: SyllabusInventoryMeta = syllabusInventoryMeta,
): SyllabusCoverageMetrics {
  const statuses = items.map(summarizeItem);
  const count = (status: SyllabusStatus) => statuses.filter((itemStatus) => itemStatus === status).length;
  const covered = count("covered");
  const partial = count("partial");
  return {
    officialItemsTotal: meta.sourceComplete ? meta.extractedItems : null,
    mapped: covered + partial,
    covered,
    partial,
    missing: count("missing"),
    referenceOnly: count("reference-only"),
    unresolved: count("unresolved"),
    coveragePercent:
      meta.sourceComplete && meta.extractedItems > 0
        ? Number(((covered / meta.extractedItems) * 100).toFixed(2))
        : null,
  };
}

export function getMappedModuleSlugs(items: readonly SyllabusItem[] = officialItems): string[] {
  return [...new Set(items.flatMap((entry) => entry.children.flatMap((child) => child.linkedModules)))];
}

export function getUnmappedOfficialItems(
  official: readonly SyllabusItem[] = officialItems,
  mapped: readonly SyllabusItem[] = syllabusItems,
): string[] {
  const mappedIds = new Set(mapped.map((entry) => entry.id));
  return official.filter((entry) => !mappedIds.has(entry.id)).map((entry) => entry.id);
}

export const SUPPORTING_MODULES = ["psicometria", "ingles-a2"] as const;

export function getOrphanCourseModules(items: readonly SyllabusItem[] = officialItems): string[] {
  const mapped = new Set(getMappedModuleSlugs(items));
  if (items === officialItems) {
    for (const supplemental of supplementalItems) {
      for (const slug of supplemental.linkedModules) mapped.add(slug);
    }
    for (const slug of SUPPORTING_MODULES) mapped.add(slug);
  }
  return lessons.map((lesson) => lesson.slug).filter((slug) => !mapped.has(slug));
}

export function getSupportingModules(): string[] {
  return [...SUPPORTING_MODULES].filter((slug) => Boolean(lessonTheories[slug]));
}
