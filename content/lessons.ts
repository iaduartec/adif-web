import type { Lesson } from "../lib/content/schema";

const finalAnnexVerification = {
  text: "Alineación final con el anexo 2026 pendiente de verificación frente a la convocatoria y sus fuentes oficiales vigentes.",
  origin: "verification_pending" as const,
};

export const lessons: readonly Lesson[] = [
  {
    slug: "igualdad",
    title: "Igualdad y no discriminación",
    summary: "Explicación de estudio sobre igualdad de trato, discriminación y garantías de protección.",
    origin: "original_explanation",
    officialReferences: [{ title: "Ley Orgánica 3/2007, para la igualdad efectiva de mujeres y hombres", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2007-6115", origin: "official_reference" }],
    verificationNote: finalAnnexVerification,
  },
  {
    slug: "prevencion-riesgos-laborales",
    title: "Prevención de riesgos laborales",
    summary: "Material de repaso sobre principios preventivos, modalidades y medidas de protección.",
    origin: "original_explanation",
    officialReferences: [{ title: "Ley 31/1995, de Prevención de Riesgos Laborales", url: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292", origin: "official_reference" }],
    verificationNote: finalAnnexVerification,
  },
  {
    slug: "estatuto-adif",
    title: "Estatuto de ADIF",
    summary: "Síntesis didáctica de la naturaleza, fines y organización de ADIF.",
    origin: "original_explanation",
    officialReferences: [{ title: "Real Decreto 2395/2004, Estatuto de la entidad pública empresarial ADIF", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2004-21913", origin: "official_reference" }],
    verificationNote: finalAnnexVerification,
  },
  {
    slug: "ict-rd-346-2011",
    title: "Infraestructuras comunes de telecomunicación",
    summary: "Repaso de los conceptos de ICT y del marco reglamentario de instalaciones de telecomunicación.",
    origin: "original_explanation",
    officialReferences: [{ title: "Real Decreto 346/2011, reglamento regulador de las ICT", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834", origin: "official_reference" }],
    verificationNote: finalAnnexVerification,
  },
  {
    slug: "compatibilidad-electromagnetica",
    title: "Compatibilidad electromagnética",
    summary: "Explicación de conceptos de emisión, inmunidad y control de interferencias electromagnéticas.",
    origin: "original_explanation",
    officialReferences: [{ title: "Real Decreto 186/2016, compatibilidad electromagnética", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2016-4442", origin: "official_reference" }],
    verificationNote: finalAnnexVerification,
  },
  {
    slug: "rcf-libro-1",
    title: "Reglamento de Circulación Ferroviaria: Libro 1",
    summary: "Guía de estudio de definiciones, principios y reglas generales de circulación ferroviaria.",
    origin: "original_explanation",
    officialReferences: [{ title: "Reglamento de Circulación Ferroviaria, Libro Primero", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-8042", origin: "official_reference" }],
    verificationNote: finalAnnexVerification,
  },
  {
    slug: "psicometria",
    title: "Psicometría",
    summary: "Práctica original de aptitudes, razonamiento y estrategias de resolución de pruebas.",
    origin: "original_explanation",
    officialReferences: [{ title: "Bases de la convocatoria y criterios de evaluación aplicables", url: "https://www.adif.es/w/pni26-03-tecnico", origin: "official_reference" }],
    verificationNote: finalAnnexVerification,
  },
  {
    slug: "ingles-a2",
    title: "Inglés A2",
    summary: "Repaso original de vocabulario, gramática y comprensión para el nivel A2.",
    origin: "original_explanation",
    officialReferences: [{ title: "Marco Común Europeo de Referencia para las Lenguas, nivel A2", url: "https://www.coe.int/en/web/common-european-framework-reference-languages/introduction-and-context", origin: "official_reference" }],
    verificationNote: finalAnnexVerification,
  },
];
