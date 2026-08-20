import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { lessonSummaries } from "../content/lesson-summaries";
import { lessonTheories } from "../content/lesson-theory";
import { activeTheoryConceptRegistry } from "../content/theory-concepts";
import { lessons } from "../content/lessons";
import {
  lessonReferenceSchema,
  officialExamsSchema,
  officialQuestionsSchema,
  questionSchema,
} from "../lib/content/schema";
import { contentFingerprint } from "../scripts/import-official-exams";

const repositoryRoot = path.resolve(import.meta.dirname, "..");

function readJson(fileName: string): unknown {
  const target = path.join(repositoryRoot, "content", fileName);
  return existsSync(target) ? JSON.parse(readFileSync(target, "utf8")) : [];
}

function listQuestions() {
  return officialQuestionsSchema.safeParse(readJson("questions.json"));
}

function listOfficialExams() {
  return officialExamsSchema.safeParse(readJson("exams.json"));
}

const validQuestion = {
  id: "Q0001",
  module: "G1 Igualdad",
  prompt: "Seleccione la respuesta correcta.",
  options: [
    { key: "A", text: "Opción A" },
    { key: "B", text: "Opción B" },
    { key: "C", text: "Opción C" },
    { key: "D", text: "Opción D" },
  ],
  answer: "A",
  explanation: "Explicación didáctica original.",
  sourceNote: "Referencia de estudio; verificar en fuente oficial.",
  origin: "original_explanation",
};

const retiredGenericDistractors = [
  "Aplicar una regla distinta solo porque contiene palabras tecnicas similares.",
  "Suponer que toda decision es valida si mejora la rapidez de ejecucion.",
  "Omitir la comprobacion documental porque el resultado parece evidente.",
];

describe("course content schemas", () => {
  it("rejects an official lesson reference without a canonical HTTPS URL", () => {
    expect(
      lessonReferenceSchema.safeParse({
        title: "Ley Orgánica 3/2007",
        origin: "official_reference",
        url: "http://www.boe.es/buscar/act.php?id=BOE-A-2007-6115",
      }).success,
    ).toBe(false);
  });

  it("rejects questions that do not contain exactly four keyed options", () => {
    expect(
      questionSchema.safeParse({
        ...validQuestion,
        options: validQuestion.options.slice(0, 3),
      }).success,
    ).toBe(false);
  });

  it("rejects questions whose answer is not a valid option key", () => {
    expect(questionSchema.safeParse({ ...validQuestion, answer: "E" }).success).toBe(false);
  });

});

describe("active official course content", () => {
  it("retains the infrastructure-equipment qualifier in the RCF start-of-service evidence", () => {
    const theory = lessonTheories["rcf-libro-1"];
    const claim = theory.concepts
      .find((concept) => concept.id === "rcf-concept-8")
      ?.claims.find((candidate) => candidate.id === "rcf-c8-1");
    const source = theory.sources.find((candidate) => candidate.id === "rd664-2015-1-1-1-7");

    expect(claim?.text).toMatch(/infraestructura[^.]*si [ée]sta dispone de ellos/i);
    expect(source?.excerpt).toMatch(/infraestructura[^.]*si [ée]sta dispone de ellos/i);
  });

  it("limits UNE-EN 50346 certification to twisted-pair distribution and dispersion networks", () => {
    const theory = lessonTheories["ict-rd-346-2011"];
    const claim = theory.concepts
      .find((concept) => concept.id === "ict-concept-13")
      ?.claims.find((candidate) => candidate.id === "ict-c13-1");

    expect(claim?.text).toMatch(
      /redes de distribución y dispersión.*pares trenzados.*UNE-EN 50346/i,
    );
  });

  it("anchors the moving-train CEM teaching claim only to its official exam evidence", () => {
    const theory = lessonTheories["compatibilidad-electromagnetica"];
    const claim = theory.concepts
      .find((concept) => concept.id === "cem-concept-14")
      ?.claims.find((candidate) => candidate.id === "cem-c14-1");

    expect(claim?.legalBasis).toEqual(["adif-pni25-cem-questions"]);
  });

  it("maps every official appearance to unique active theory concepts", () => {
    const parsed = listQuestions();
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    expect(activeTheoryConceptRegistry.size).toBe(172);
    expect(parsed.data).toHaveLength(102);
    for (const question of parsed.data) {
      expect(question.conceptIds.length, question.id).toBeGreaterThan(0);
      expect(new Set(question.conceptIds).size, question.id).toBe(question.conceptIds.length);
      expect(
        question.conceptIds.every((conceptId) => activeTheoryConceptRegistry.has(conceptId)),
        question.id,
      ).toBe(true);
    }
  });

  it("maps every official appearance to a concept whose claims teach the tested rule", () => {
    const parsed = listQuestions();
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const groups: Array<{
      conceptId: string;
      claimPattern: RegExp;
      questionIds: string[];
    }> = [
      { conceptId: "rcf-concept-9", claimPattern: /120 km\/h/i, questionIds: ["ADIF-2023-1433-Q01", "ADIF-2023-4101-Q06", "ADIF-2024-3403-Q10", "ADIF-2024-3413-Q12"] },
      { conceptId: "ict-concept-5", claimPattern: /Bases de Acceso Terminal.*BAT/i, questionIds: ["ADIF-2023-1433-Q02", "ADIF-2023-4101-Q05"] },
      { conceptId: "rcf-concept-7", claimPattern: /personal.*EF.*AI.*otras empresas/i, questionIds: ["ADIF-2023-1433-Q03", "ADIF-2023-4101-Q02"] },
      { conceptId: "ict-concept-11", claimPattern: /SI 1-3/i, questionIds: ["ADIF-2023-1433-Q04", "ADIF-2023-4101-Q10"] },
      { conceptId: "ict-concept-12", claimPattern: /normas armonizadas.*Diario Oficial/i, questionIds: ["ADIF-2023-1433-Q05", "ADIF-2023-4101-Q07"] },
      { conceptId: "ict-concept-7", claimPattern: /Recinto de Instalaciones de Telecomunicación Inferior.*Recinto de Instalaciones de Telecomunicación Superior/i, questionIds: ["ADIF-2023-1433-Q06", "ADIF-2023-4101-Q11", "ADIF-2024-3403-Q12", "ADIF-2024-3413-Q06"] },
      { conceptId: "rcf-concept-10", claimPattern: /Comercial.*Restringida.*Técnica/i, questionIds: ["ADIF-2023-1433-Q07", "ADIF-2023-4101-Q09"] },
      { conceptId: "ict-concept-13", claimPattern: /UNE-EN 50346/i, questionIds: ["ADIF-2023-1433-Q08", "ADIF-2023-4101-Q08"] },
      { conceptId: "ict-concept-2", claimPattern: /propiedad del operador/i, questionIds: ["ADIF-2023-1433-Q09", "ADIF-2023-4101-Q03"] },
      { conceptId: "ict-concept-14", claimPattern: /unión.*redes de distribución.*dispersión/i, questionIds: ["ADIF-2023-1433-Q10", "ADIF-2023-4101-Q04"] },
      { conceptId: "rcf-concept-8", claimPattern: /Sistema de protección.*Dispositivo de vigilancia.*Radiotelefonía/i, questionIds: ["ADIF-2023-1433-Q11", "ADIF-2023-4101-Q01"] },
      { conceptId: "cem-concept-6", claimPattern: /modo diferencial.*conductores activos/i, questionIds: ["ADIF-2023-1433-Q12", "ADIF-2023-4101-Q13"] },
      { conceptId: "cem-concept-1", claimPattern: /emisión.*inmunidad/i, questionIds: ["ADIF-2023-1433-Q13", "ADIF-2023-1433-Q15", "ADIF-2023-4101-Q12", "ADIF-2023-4101-Q14"] },
      { conceptId: "cem-concept-7", claimPattern: /acoplamiento inductivo.*área.*bucle/i, questionIds: ["ADIF-2023-1433-Q14", "ADIF-2023-4101-Q15"] },
      { conceptId: "ict-concept-15", claimPattern: /Punto de interconexión.*redes de alimentación.*redes de distribución.*RITI/i, questionIds: ["ADIF-2024-3403-Q01", "ADIF-2024-3413-Q05", "ADIF-2025-1131-Q02", "ADIF-2025-4104-Q01"] },
      { conceptId: "ict-concept-16", claimPattern: /proyecto técnico.*planos.*pliego de condiciones/i, questionIds: ["ADIF-2024-3403-Q02", "ADIF-2024-3403-Q11", "ADIF-2024-3413-Q07", "ADIF-2024-3413-Q08", "ADIF-2025-1131-Q06", "ADIF-2025-4104-Q09"] },
      { conceptId: "ict-concept-17", claimPattern: /Código Técnico de la Edificación.*CTE.*Reglamento de Instalaciones Térmicas de los Edificios.*RITE/i, questionIds: ["ADIF-2024-3403-Q03", "ADIF-2024-3403-Q18", "ADIF-2024-3413-Q03", "ADIF-2024-3413-Q18"] },
      { conceptId: "ict-concept-18", claimPattern: /Control del Entorno.*Control de iluminación.*Eficiencia Energética/i, questionIds: ["ADIF-2024-3403-Q04", "ADIF-2024-3413-Q10"] },
      { conceptId: "ict-concept-19", claimPattern: /BAT.*SC\/APC/i, questionIds: ["ADIF-2024-3403-Q05", "ADIF-2024-3413-Q04"] },
      { conceptId: "ict-concept-20", claimPattern: /Anexo I.*radiodifusión sonora y televisión/i, questionIds: ["ADIF-2024-3403-Q06", "ADIF-2024-3413-Q01"] },
      { conceptId: "ict-concept-21", claimPattern: /cubierta o azotea/i, questionIds: ["ADIF-2024-3403-Q07", "ADIF-2024-3413-Q09"] },
      { conceptId: "ict-concept-22", claimPattern: /2 metros/i, questionIds: ["ADIF-2024-3403-Q08", "ADIF-2024-3413-Q02"] },
      { conceptId: "ict-concept-23", claimPattern: /(?:STDP.*Servicios de Telefonía Disponible al Público|Servicios de Telefonía Disponible al Público.*STDP)/i, questionIds: ["ADIF-2024-3403-Q09", "ADIF-2024-3413-Q11"] },
      { conceptId: "cem-concept-8", claimPattern: /acoplamiento capacitivo.*menor.*distancia.*mayor.*tensión/i, questionIds: ["ADIF-2024-3403-Q13", "ADIF-2024-3413-Q15"] },
      { conceptId: "cem-concept-9", claimPattern: /señal eléctrica no deseada.*señal útil.*perturbación/i, questionIds: ["ADIF-2024-3403-Q14", "ADIF-2024-3413-Q13"] },
      { conceptId: "cem-concept-10", claimPattern: /distancia recorrida.*oscilación completa.*longitud de onda/i, questionIds: ["ADIF-2024-3403-Q15", "ADIF-2024-3413-Q14"] },
      { conceptId: "cem-concept-11", claimPattern: /inversamente proporcional.*fundamental/i, questionIds: ["ADIF-2024-3403-Q16", "ADIF-2024-3413-Q16"] },
      { conceptId: "rcf-concept-12", claimPattern: /Prueba parcial.*agreguen vehículos/i, questionIds: ["ADIF-2024-3403-Q17", "ADIF-2024-3413-Q17"] },
      { conceptId: "ict-concept-24", claimPattern: /cordones o latiguillos de fibra óptica/i, questionIds: ["ADIF-2025-1131-Q01", "ADIF-2025-4104-Q12"] },
      { conceptId: "ict-concept-25", claimPattern: /arqueta de entrada.*RITI.*punto de interconexión/i, questionIds: ["ADIF-2025-1131-Q03", "ADIF-2025-4104-Q02"] },
      { conceptId: "rcf-concept-11", claimPattern: /zona de peligro.*zona de seguridad/i, questionIds: ["ADIF-2025-1131-Q04", "ADIF-2025-4104-Q08"] },
      { conceptId: "ict-concept-26", claimPattern: /75 ± 3.*Ω/i, questionIds: ["ADIF-2025-1131-Q05", "ADIF-2025-4104-Q03"] },
      { conceptId: "ict-concept-27", claimPattern: /radiodifusión sonora.*televisión.*telefonía.*banda ancha/i, questionIds: ["ADIF-2025-1131-Q07", "ADIF-2025-4104-Q07"] },
      { conceptId: "ict-concept-28", claimPattern: /mástiles.*toma de tierra.*25 mm²/i, questionIds: ["ADIF-2025-1131-Q08", "ADIF-2025-4104-Q04"] },
      { conceptId: "ict-concept-29", claimPattern: /cables coaxiales.*75.*Ω/i, questionIds: ["ADIF-2025-1131-Q09", "ADIF-2025-4104-Q05"] },
      { conceptId: "ict-concept-30", claimPattern: /red mallada de equipotencialidad.*anillo de tierra/i, questionIds: ["ADIF-2025-1131-Q10", "ADIF-2025-4104-Q11"] },
      { conceptId: "ict-concept-31", claimPattern: /roseta hembra miniatura de ocho vías.*RJ45/i, questionIds: ["ADIF-2025-1131-Q11", "ADIF-2025-4104-Q06"] },
      { conceptId: "ict-concept-32", claimPattern: /5 MHz.*2\.150 MHz/i, questionIds: ["ADIF-2025-1131-Q12", "ADIF-2025-4104-Q10"] },
      { conceptId: "cem-concept-12", claimPattern: /todos los equipos electrónicos.*marzo de 2014/i, questionIds: ["ADIF-2025-1131-Q13", "ADIF-2025-1131-Q16", "ADIF-2025-4104-Q15", "ADIF-2025-4104-Q16"] },
      { conceptId: "cem-concept-13", claimPattern: /convertidores de potencia.*dos o más.*líneas de suministro/i, questionIds: ["ADIF-2025-1131-Q14", "ADIF-2025-4104-Q13"] },
      { conceptId: "cem-concept-14", claimPattern: /varias antenas.*ancho de banda/i, questionIds: ["ADIF-2025-1131-Q15", "ADIF-2025-4104-Q14"] },
      { conceptId: "ict-concept-33", claimPattern: /equipo de cabecera.*red de dispersión/i, questionIds: ["ADIF-2025-1131-Q17", "ADIF-2025-4104-Q17"] },
      { conceptId: "rcf-concept-13", claimPattern: /Tren directo.*detenido.*estación/i, questionIds: ["ADIF-2025-1131-Q18", "ADIF-2025-4104-Q18"] },
    ];

    const questionById = new Map(parsed.data.map((question) => [question.id, question]));
    const coveredIds = groups.flatMap((group) => group.questionIds);
    expect(new Set(coveredIds).size).toBe(102);
    expect(new Set(coveredIds)).toEqual(new Set(questionById.keys()));

    for (const group of groups) {
      const concept = activeTheoryConceptRegistry.get(group.conceptId);
      expect(concept, group.conceptId).toBeDefined();
      const teachingText = concept?.claims.map((claim) => claim.text).join(" ") ?? "";
      expect(teachingText, group.conceptId).toMatch(group.claimPattern);
      for (const questionId of group.questionIds) {
        expect(questionById.get(questionId)?.conceptIds, questionId).toEqual([group.conceptId]);
      }
    }
  });

  it("publishes 102 uniquely identified official ADIF appearances", () => {
    const parsed = listQuestions();
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const questions = parsed.data;
    expect(questions).toHaveLength(102);
    expect(new Set(questions.map((question) => question.id)).size).toBe(102);
    expect(
      questions.every(
        (question) =>
          question.id ===
          `ADIF-${question.source.year}-${question.source.examCode}-Q${String(
            question.source.questionNumber,
          ).padStart(2, "0")}`,
      ),
    ).toBe(true);
    expect(questions.every((question) => question.origin === "official_reference")).toBe(true);
    expect(
      questions.every((question) => question.source.documentUrl.startsWith("https://www.adif.es/")),
    ).toBe(true);
  });

  it("uses deterministic fingerprints and preserves literal ADIF reuse across models", () => {
    const parsed = listQuestions();
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const questionsByFingerprint = new Map<string, typeof parsed.data>();
    for (const question of parsed.data) {
      expect(question.source.fingerprint).toBe(
        contentFingerprint({
          prompt: question.prompt,
          options: question.options,
          answer: question.answer,
        }),
      );
      const appearances = questionsByFingerprint.get(question.source.fingerprint) ?? [];
      appearances.push(question);
      questionsByFingerprint.set(question.source.fingerprint, appearances);
    }

    const reusedContent = [...questionsByFingerprint.values()].filter((appearances) => appearances.length > 1);
    expect(questionsByFingerprint.size).toBe(72);
    expect(reusedContent).toHaveLength(30);
    expect(
      reusedContent.every(
        (appearances) =>
          appearances.length === 2 &&
          new Set(
            appearances.map((question) => `${question.source.year}-${question.source.examCode}`),
          ).size === 2 &&
          new Set(
            appearances.map((question) =>
              JSON.stringify([question.prompt, question.options, question.answer]),
            ),
          ).size === 1,
      ),
    ).toBe(true);
  });

  it("publishes the six visually reviewed official exam models", () => {
    const parsedExams = listOfficialExams();
    const parsedQuestions = listQuestions();
    expect(parsedExams.success).toBe(true);
    expect(parsedQuestions.success).toBe(true);
    if (!parsedExams.success || !parsedQuestions.success) return;

    expect(parsedExams.data.map((exam) => [exam.id, exam.questionIds.length])).toEqual([
      ["ADIF-2023-1433", 15],
      ["ADIF-2023-4101", 15],
      ["ADIF-2024-3403", 18],
      ["ADIF-2024-3413", 18],
      ["ADIF-2025-1131", 18],
      ["ADIF-2025-4104", 18],
    ]);
    expect(parsedExams.data.map((exam) => exam.durationMinutes)).toEqual([15, 15, 15, 15, 15, 15]);
    expect(parsedExams.data.every((exam) => exam.completeness === "specific_part")).toBe(true);
    const expectedQuestionNumbers = {
      "ADIF-2023-1433": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      "ADIF-2023-4101": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      "ADIF-2024-3403": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      "ADIF-2024-3413": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      "ADIF-2025-1131": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      "ADIF-2025-4104": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    } as const;

    for (const exam of parsedExams.data) {
      const appearances = parsedQuestions.data.filter(
        (question) => `ADIF-${question.source.year}-${question.source.examCode}` === exam.id,
      );
      expect(exam.questionIds).toEqual(appearances.map((question) => question.id));
      expect(appearances.map((question) => question.source.questionNumber)).toEqual(
        expectedQuestionNumbers[exam.id as keyof typeof expectedQuestionNumbers],
      );
    }

    const questionIds = parsedExams.data.flatMap((exam) => exam.questionIds);
    expect(questionIds).toHaveLength(102);
    expect(new Set(questionIds).size).toBe(102);

    const missing2023Reserves = parsedQuestions.data.filter(
      (question) => question.source.year === 2023 && question.source.questionNumber >= 16,
    );
    expect(missing2023Reserves).toEqual([]);

    const publishedReserves = parsedQuestions.data.filter(
      (question) => question.source.year >= 2024 && question.source.questionNumber >= 16,
    );
    expect(publishedReserves).toHaveLength(12);
    expect(
      publishedReserves.every(
        (question) => question.source.isReserve && ["A", "B", "C", "D"].includes(question.answer),
      ),
    ).toBe(true);
    expect(
      parsedQuestions.data
        .filter((question) => question.source.questionNumber <= 15)
        .every((question) => !question.source.isReserve),
    ).toBe(true);
  });

  it("does not publish any retired generic synthetic distractor", () => {
    const parsed = listQuestions();
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const activeOptions = parsed.data.flatMap((question) => question.options.map((option) => option.text));
    expect(activeOptions).not.toEqual(expect.arrayContaining(retiredGenericDistractors));
  });
});

describe("lesson content", () => {
  it("provides lessons with declared origins and stable slugs", () => {
    expect(lessons.length).toBeGreaterThanOrEqual(8);
    expect(lessons.every((lesson) => lesson.origin)).toBe(true);
    expect(lessons.find((lesson) => lesson.slug === "igualdad")?.origin).toBe("original_explanation");
  });

  it("keeps structured summaries for the highest-yield lessons", () => {
    expect(lessonSummaries.psicometria.overview).toMatch(/psicométrica/i);
    expect(lessonSummaries["ingles-a2"].sections).toHaveLength(3);
    expect(lessonSummaries["ict-rd-346-2011"].sections).toHaveLength(3);
    expect(lessonSummaries["compatibilidad-electromagnetica"].sections).toHaveLength(3);
    expect(lessonSummaries["rcf-libro-1"].sections).toHaveLength(3);
  });

  it("uses the Personal Operativo PNI26/01 source for psychometric practice", () => {
    const psychometricLesson = lessons.find((lesson) => lesson.slug === "psicometria");
    expect(psychometricLesson?.officialReferences[0].url).toBe(
      "https://www.adif.es/w/pni26-01-personal-operativo",
    );
  });
});
