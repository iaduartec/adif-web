import { lessonTheories } from "./lesson-theory";
import { lessons } from "./lessons";
import { SYLLABUS_SOURCES } from "./syllabus-sources";

export type ConfirmedSyllabusStatus = "covered" | "partial" | "missing" | "reference-only";
export type SyllabusStatus = ConfirmedSyllabusStatus | "unresolved";

export type SyllabusItem = {
  id: string;
  title: string;
  syllabusSourceId: string;
  syllabusLocator: string;
  syllabusQuote?: string;
  materialSourceIds: string[];
  status: SyllabusStatus;
  /** Provisional classification retained for identified-scope reporting only. */
  identifiedStatus?: ConfirmedSyllabusStatus;
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
  identifiedItemsTotal: number;
  covered: number;
  partial: number;
  missing: number;
  referenceOnly: number;
  unresolved: number;
  coveragePercent: number | null;
  identifiedCoveragePercent: number | null;
};

export const syllabusInventoryMeta: SyllabusInventoryMeta = {
  sourceComplete: false,
  sourceDocumentId: "pni26-01",
  sourceTitle: SYLLABUS_SOURCES["pni26-01"].title,
  sourceUrl: SYLLABUS_SOURCES["pni26-01"].url,
  extractedItems: 0,
  unresolvedItems: 17,
};

const provisionalScope = {
  syllabusSourceId: "pni26-01",
  syllabusLocator: "Página de convocatoria PNI26/01; bases adjuntas anunciadas, anexo itemizado no expuesto",
} as const;

const item = (
  value: Omit<SyllabusItem, "syllabusSourceId" | "syllabusLocator" | "status">,
): SyllabusItem => ({
  ...value,
  ...provisionalScope,
  status: "unresolved",
});

/** Provisional identified scope. It is not the official exhaustive universe. */
export const syllabusItems: readonly SyllabusItem[] = [
  item({ id: "syllabus-constitucion", title: "Constitución Española", materialSourceIds: ["CE"], identifiedStatus: "partial", linkedModules: ["igualdad", "codigo-conducta"], rationale: "Bloque identificado en la trazabilidad previa; su presencia y granularidad PNI26/01 no están confirmadas.", priority: "P1" }),
  item({ id: "syllabus-igualdad", title: "Igualdad efectiva de mujeres y hombres", materialSourceIds: ["LO 3/2007", "RD 902/2020"], identifiedStatus: "covered", linkedModules: ["igualdad"], rationale: "Fuente material trazada, pero falta el anexo oficial que confirme el ítem de alcance." }),
  item({ id: "syllabus-prl", title: "Prevención de riesgos laborales y equipos de protección", materialSourceIds: ["Ley 31/1995", "RD 773/1997"], identifiedStatus: "covered", linkedModules: ["prevencion-riesgos-laborales"], rationale: "Fuente material trazada, pero falta el anexo oficial que confirme el ítem de alcance." }),
  item({ id: "syllabus-sector-ferroviario", title: "Sector ferroviario y ADIF", materialSourceIds: ["Ley 38/2015", "RD 2395/2004"], identifiedStatus: "partial", linkedModules: ["declaracion-red-2027", "estatuto-adif"], rationale: "Bloque identificado en la trazabilidad previa; su presencia y granularidad PNI26/01 no están confirmadas.", priority: "P1" }),
  item({ id: "syllabus-incompatibilidades", title: "Incompatibilidades del personal de las Administraciones Públicas", materialSourceIds: ["Ley 53/1984"], identifiedStatus: "covered", linkedModules: ["incompatibilidades"], rationale: "Fuente material trazada, pero falta el anexo oficial que confirme el ítem de alcance." }),
  item({ id: "syllabus-estatuto-adif", title: "Estatuto de la entidad pública empresarial ADIF", materialSourceIds: ["RD 2395/2004"], identifiedStatus: "covered", linkedModules: ["estatuto-adif"], rationale: "Fuente material trazada, pero falta el anexo oficial que confirme el ítem de alcance." }),
  item({ id: "syllabus-ict", title: "Infraestructuras comunes de telecomunicaciones", materialSourceIds: ["RD 346/2011"], identifiedStatus: "covered", linkedModules: ["ict-rd-346-2011"], rationale: "Fuente material trazada, pero falta el anexo oficial que confirme el ítem de alcance." }),
  item({ id: "syllabus-rcf", title: "Reglamento de Circulación Ferroviaria, Libro 1", materialSourceIds: ["RD 664/2015"], identifiedStatus: "covered", linkedModules: ["rcf-libro-1"], rationale: "Fuente material trazada, pero falta el anexo oficial que confirme el ítem de alcance." }),
  item({ id: "syllabus-epi", title: "Equipos de protección individual", materialSourceIds: ["RD 773/1997"], identifiedStatus: "partial", linkedModules: ["prevencion-riesgos-laborales"], rationale: "Bloque identificado en la trazabilidad previa; su presencia y granularidad PNI26/01 no están confirmadas.", priority: "P1" }),
  item({ id: "syllabus-igualdad-retributiva", title: "Igualdad retributiva", materialSourceIds: ["RD 902/2020"], identifiedStatus: "partial", linkedModules: ["igualdad"], rationale: "Bloque identificado en la trazabilidad previa; su presencia y granularidad PNI26/01 no están confirmadas.", priority: "P1" }),
  item({ id: "syllabus-codigo-conducta", title: "Código de conducta de los empleados públicos", materialSourceIds: ["TREBEP"], identifiedStatus: "covered", linkedModules: ["codigo-conducta"], rationale: "Fuente material trazada, pero falta el anexo oficial que confirme el ítem de alcance." }),
  item({ id: "syllabus-cem-legal", title: "Compatibilidad electromagnética: marco legal", materialSourceIds: ["Real Decreto 186/2016", "Directiva 2014/30/UE"], identifiedStatus: "covered", linkedModules: ["compatibilidad-electromagnetica"], rationale: "Fuente material trazada, pero falta el anexo oficial que confirme el ítem de alcance." }),
  item({ id: "syllabus-cem-directiva", title: "Compatibilidad electromagnética: Directiva europea", materialSourceIds: ["Directiva 2014/30/UE"], identifiedStatus: "covered", linkedModules: ["compatibilidad-electromagnetica"], rationale: "Fuente material trazada, pero falta el anexo oficial que confirme el ítem de alcance." }),
  item({ id: "syllabus-declaracion-red", title: "Declaración sobre la Red de Adif", materialSourceIds: ["DR 2027", "Ley 38/2015"], identifiedStatus: "covered", linkedModules: ["declaracion-red-2027"], rationale: "Fuente material trazada, pero falta el anexo oficial que confirme el ítem de alcance." }),
  item({ id: "syllabus-en-50121", title: "EN 50121: compatibilidad electromagnética ferroviaria", materialSourceIds: [], identifiedStatus: "reference-only", linkedModules: ["compatibilidad-electromagnetica"], rationale: "Referencia técnica identificada, sin documento material legítimo accesible ni confirmación itemizada del anexo PNI26/01.", priority: "P0" }),
  item({ id: "syllabus-psicometria", title: "Prueba psicométrica y aptitudes cognitivas", materialSourceIds: [], identifiedStatus: "reference-only", linkedModules: ["psicometria"], rationale: "La documentación psicométrica oficial está restringida al portal del candidato; no hay guía material pública verificable.", priority: "P0" }),
  item({ id: "syllabus-ingles-a2", title: "Conocimiento de idioma inglés orientativo A2", materialSourceIds: ["MCER-A2"], identifiedStatus: "covered", linkedModules: ["ingles-a2"], rationale: "MCER es fuente material del nivel; la convocatoria que demostraría el alcance A2 sigue sin anexo público verificable." }),
];

export const officialItems: readonly SyllabusItem[] = [];

export function getSyllabusCoverage(
  items: readonly SyllabusItem[] = syllabusItems,
  meta: SyllabusInventoryMeta = syllabusInventoryMeta,
): SyllabusCoverageMetrics {
  const count = (status: SyllabusStatus, identified = false) =>
    items.filter((entry) => (identified ? entry.identifiedStatus === status : entry.status === status)).length;
  const identifiedItemsTotal = items.filter((entry) => entry.identifiedStatus).length;
  const covered = count("covered");
  const identifiedCovered = count("covered", true);
  return {
    officialItemsTotal: meta.sourceComplete ? meta.extractedItems : null,
    identifiedItemsTotal,
    covered,
    partial: count("partial"),
    missing: count("missing"),
    referenceOnly: count("reference-only"),
    unresolved: count("unresolved"),
    coveragePercent:
      meta.sourceComplete && meta.extractedItems > 0
        ? Number(((covered / meta.extractedItems) * 100).toFixed(2))
        : null,
    identifiedCoveragePercent:
      identifiedItemsTotal > 0 ? Number(((identifiedCovered / identifiedItemsTotal) * 100).toFixed(2)) : null,
  };
}

export function getMappedModuleSlugs(items: readonly SyllabusItem[] = syllabusItems): string[] {
  return [...new Set(items.flatMap((entry) => entry.linkedModules))];
}

export function getUnmappedOfficialItems(
  official: readonly SyllabusItem[] = officialItems,
  mapped: readonly SyllabusItem[] = syllabusItems,
): string[] {
  const mappedIds = new Set(mapped.map((entry) => entry.id));
  return official.filter((entry) => !mappedIds.has(entry.id)).map((entry) => entry.id);
}

export const SUPPORTING_MODULES = ["psicometria", "ingles-a2"] as const;

export function getOrphanCourseModules(items: readonly SyllabusItem[] = syllabusItems): string[] {
  const mapped = new Set(getMappedModuleSlugs(items));
  return lessons.map((lesson) => lesson.slug).filter((slug) => !mapped.has(slug));
}

export function getSupportingModules(): string[] {
  return [...SUPPORTING_MODULES].filter((slug) => Boolean(lessonTheories[slug]));
}
