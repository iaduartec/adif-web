import { lessonTheories } from "./lesson-theory";

export type SyllabusStatus = "covered" | "partial" | "missing" | "reference-only";

export type SyllabusItem = {
  id: string;
  title: string;
  officialSourceId: string;
  officialLocator: string;
  status: SyllabusStatus;
  linkedModules: string[];
  rationale: string;
  priority?: "P0" | "P1" | "P2" | "P3";
};

export type SyllabusCoverageMetrics = {
  syllabusItemsTotal: number;
  covered: number;
  partial: number;
  missing: number;
  referenceOnly: number;
  coveragePercent: number;
};

/**
 * Source-level inventory of the official scope currently represented by the
 * course. PNI26/01 is the current ADIF call page; its public HTML exposes the
 * bases but not an itemised annex, so the map deliberately does not invent
 * finer-grained syllabus wording. The unit of measurement is one named
 * official source/block, not one claim.
 */
export const syllabusItems: readonly SyllabusItem[] = [
  {
    id: "syllabus-constitucion",
    title: "Constitución Española",
    officialSourceId: "CE",
    officialLocator: "Bloque legal citado en el alcance del curso",
    status: "partial",
    linkedModules: ["igualdad", "codigo-conducta"],
    rationale: "Hay principios constitucionales aplicados, pero no un bloque autónomo completo.",
    priority: "P1",
  },
  {
    id: "syllabus-igualdad",
    title: "Igualdad efectiva de mujeres y hombres",
    officialSourceId: "LO 3/2007",
    officialLocator: "Bloque legal citado en el alcance del curso",
    status: "covered",
    linkedModules: ["igualdad"],
    rationale: "El módulo contiene conceptos y claims trazables a la ley y su desarrollo retributivo.",
  },
  {
    id: "syllabus-prl",
    title: "Prevención de riesgos laborales y equipos de protección",
    officialSourceId: "Ley 31/1995",
    officialLocator: "Bloque legal citado en el alcance del curso",
    status: "covered",
    linkedModules: ["prevencion-riesgos-laborales"],
    rationale: "El módulo cubre principios preventivos, derechos y obligaciones con fuentes BOE.",
  },
  {
    id: "syllabus-sector-ferroviario",
    title: "Sector ferroviario y ADIF",
    officialSourceId: "Ley 38/2015",
    officialLocator: "Bloque legal citado en Declaración sobre la Red",
    status: "partial",
    linkedModules: ["declaracion-red-2027", "estatuto-adif"],
    rationale: "Está tratado junto con la Declaración sobre la Red, pero faltan apartados autónomos del sector.",
    priority: "P1",
  },
  {
    id: "syllabus-incompatibilidades",
    title: "Incompatibilidades del personal de las Administraciones Públicas",
    officialSourceId: "Ley 53/1984",
    officialLocator: "Bloque legal citado en el alcance del curso",
    status: "covered",
    linkedModules: ["incompatibilidades"],
    rationale: "Módulo específico con artículos, excepciones y fuentes BOE.",
  },
  {
    id: "syllabus-estatuto-adif",
    title: "Estatuto de la entidad pública empresarial ADIF",
    officialSourceId: "RD 2395/2004",
    officialLocator: "Bloque institucional citado en el alcance del curso",
    status: "covered",
    linkedModules: ["estatuto-adif"],
    rationale: "Módulo específico con organización, órganos y controles trazados al BOE.",
  },
  {
    id: "syllabus-ict",
    title: "Infraestructuras comunes de telecomunicaciones",
    officialSourceId: "RD 346/2011",
    officialLocator: "Bloque técnico citado en el alcance del curso",
    status: "covered",
    linkedModules: ["ict-rd-346-2011"],
    rationale: "Módulo técnico específico con conceptos y artículos del reglamento BOE.",
  },
  {
    id: "syllabus-rcf",
    title: "Reglamento de Circulación Ferroviaria, Libro 1",
    officialSourceId: "RD 664/2015",
    officialLocator: "Bloque ferroviario citado en el alcance del curso",
    status: "covered",
    linkedModules: ["rcf-libro-1"],
    rationale: "Módulo específico con definiciones y reglas generales localizadas.",
  },
  {
    id: "syllabus-epi",
    title: "Equipos de protección individual",
    officialSourceId: "RD 773/1997",
    officialLocator: "Bloque preventivo citado en el alcance del curso",
    status: "partial",
    linkedModules: ["prevencion-riesgos-laborales"],
    rationale: "El contenido aparece como parte de PRL; no existe todavía una cobertura independiente completa.",
    priority: "P1",
  },
  {
    id: "syllabus-igualdad-retributiva",
    title: "Igualdad retributiva",
    officialSourceId: "RD 902/2020",
    officialLocator: "Bloque de igualdad retributiva citado en el alcance del curso",
    status: "partial",
    linkedModules: ["igualdad"],
    rationale: "Se cubren principios y obligaciones seleccionadas, no el desarrollo completo del real decreto.",
    priority: "P1",
  },
  {
    id: "syllabus-codigo-conducta",
    title: "Código de conducta de los empleados públicos",
    officialSourceId: "TREBEP",
    officialLocator: "Capítulo VI del título III",
    status: "covered",
    linkedModules: ["codigo-conducta"],
    rationale: "El módulo cubre los artículos 52 a 54 del capítulo seleccionado.",
  },
  {
    id: "syllabus-cem-legal",
    title: "Compatibilidad electromagnética: marco legal",
    officialSourceId: "Real Decreto 186/2016",
    officialLocator: "Bloque técnico-legal citado en el alcance del curso",
    status: "covered",
    linkedModules: ["compatibilidad-electromagnetica"],
    rationale: "El módulo cubre definición, ámbito y obligaciones con RD y Directiva.",
  },
  {
    id: "syllabus-cem-directiva",
    title: "Compatibilidad electromagnética: Directiva europea",
    officialSourceId: "Directiva 2014/30/UE",
    officialLocator: "Bloque técnico-legal citado en el alcance del curso",
    status: "covered",
    linkedModules: ["compatibilidad-electromagnetica"],
    rationale: "La Directiva está representada con definición y localizador oficial.",
  },
  {
    id: "syllabus-declaracion-red",
    title: "Declaración sobre la Red de Adif",
    officialSourceId: "DR 2027",
    officialLocator: "Capítulos I y II de la edición 2027",
    status: "covered",
    linkedModules: ["declaracion-red-2027"],
    rationale: "Módulo específico de los capítulos I y II con fuente institucional ADIF.",
  },
  {
    id: "syllabus-en-50121",
    title: "EN 50121: compatibilidad electromagnética ferroviaria",
    officialSourceId: "EN 50121",
    officialLocator: "Referencia de norma incluida en la página oficial PNI26/01",
    status: "reference-only",
    linkedModules: ["compatibilidad-electromagnetica"],
    rationale: "La convocatoria acredita inclusión, pero el repositorio no contiene una fuente material legítima de la norma.",
    priority: "P0",
  },
  {
    id: "syllabus-psicometria",
    title: "Prueba psicométrica y aptitudes cognitivas",
    officialSourceId: "MET-PSI-01",
    officialLocator: "Referencia metodológica de la página oficial PNI26/01",
    status: "reference-only",
    linkedModules: ["psicometria"],
    rationale: "La convocatoria acredita el bloque, pero no publica una guía material accesible en el repositorio.",
    priority: "P0",
  },
  {
    id: "syllabus-ingles-a2",
    title: "Conocimiento de idioma inglés orientativo A2",
    officialSourceId: "MCER-A2",
    officialLocator: "Nivel A2 según MCER",
    status: "covered",
    linkedModules: ["ingles-a2"],
    rationale: "El módulo usa el MCER como marco y mantiene separado el alcance de convocatoria.",
  },
];

export function getSyllabusCoverage(items: readonly SyllabusItem[]): SyllabusCoverageMetrics {
  const counts = items.reduce(
    (acc, item) => {
      acc[item.status] += 1;
      return acc;
    },
    { covered: 0, partial: 0, missing: 0, "reference-only": 0 } as Record<SyllabusStatus, number>,
  );
  const syllabusItemsTotal = items.length;
  return {
    syllabusItemsTotal,
    covered: counts.covered,
    partial: counts.partial,
    missing: counts.missing,
    referenceOnly: counts["reference-only"],
    coveragePercent:
      syllabusItemsTotal === 0 ? 0 : Number(((counts.covered / syllabusItemsTotal) * 100).toFixed(2)),
  };
}

export function getTheoryConceptCount(moduleSlug: string): number {
  return lessonTheories[moduleSlug]?.concepts.length ?? 0;
}
