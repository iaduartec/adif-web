import questionsJson from "../content/questions.json";
import { officialItems } from "../content/syllabus";
import { officialQuestionsSchema } from "../lib/content/schema";
import { sourceManifest } from "../lib/content/source-manifest";
import { describe, expect, it } from "vitest";

import {
  originalPracticeQuestionSchema,
  originalPracticeQuestionsSchema,
} from "../lib/content/original-practice-schema";

const options = [
  { key: "A", text: "Opción A" },
  { key: "B", text: "Opción B" },
  { key: "C", text: "Opción C" },
  { key: "D", text: "Opción D" },
] as const;

function question(overrides: Record<string, unknown> = {}) {
  return {
    id: "orig-english-there-is-are-001",
    domain: "english-a2",
    topicId: "there-is-are",
    topic: "There is / There are",
    skill: "GRAMMAR",
    prompt: "Enunciado sintético creado para probar la práctica original.",
    options,
    answer: "B",
    explanation: "La opción B concuerda con el sustantivo singular del ejemplo sintético.",
    difficulty: 1,
    tags: ["synthetic-fixture"],
    conceptIds: [],
    status: "draft",
    origin: "original",
    ...overrides,
  };
}

function officialSpecificNode(id: string) {
  for (const item of officialItems) {
    if (item.scope !== "specific-26-12po") continue;
    const candidate = item.children.find((child) => child.id === id);
    if (candidate) return candidate;
  }
  throw new Error(`Missing official specific syllabus node: ${id}`);
}

describe("original practice question schema", () => {
  it("accepts a minimal original A2 question without official evidence", () => {
    const parsed = originalPracticeQuestionSchema.parse(question());

    expect(parsed.origin).toBe("original");
    expect(parsed.domain).toBe("english-a2");
    expect(parsed.topicId).toBe("there-is-are");
    expect(parsed.conceptIds).toEqual([]);
  });

  it("accepts a reviewed normative original only with active concepts and exact verified primary evidence", () => {
    const parsed = originalPracticeQuestionSchema.parse(question({
      id: "orig-telecom-rcf-chapter-5-001",
      domain: "telecom",
      topicId: "rcf-capitulo-5",
      syllabusNodeId: "rcf-capitulo-5",
      topic: "Capítulo 5 del RCF",
      skill: "circulación ferroviaria",
      conceptIds: ["rcf-concept-1"],
      sourceId: "RD 664/2015",
      sourceVersion: "consolidated-page-2026-10-15",
      sourceLocator: "Artículo 1, apartado 1",
      status: "reviewed",
      reviewedAt: "2026-10-16",
    }));

    expect(parsed.origin).toBe("original");
    expect(parsed.status).toBe("reviewed");
    expect(parsed.sourceId).toBe("RD 664/2015");
    expect(parsed.syllabusNodeId).toBe("rcf-capitulo-5");
  });

  it("keeps an original original when it cites the exact ADIF booklet URL used by an official question", () => {
    const officialQuestion = officialQuestionsSchema.parse(questionsJson)[0]!;
    const booklet = sourceManifest.sources.find((source) =>
      source.url === officialQuestion.source.documentUrl && source.sourceType === "primary",
    );
    expect(booklet).toBeDefined();

    const parsed = originalPracticeQuestionSchema.parse(question({
      sourceId: booklet!.sourceId,
      sourceVersion: booklet!.sourceVersion,
      sourceLocator: "Localizador de fixture; el enunciado sigue siendo sintético.",
    }));

    expect(booklet!.url).toBe(officialQuestion.source.documentUrl);
    expect(parsed.origin).toBe("original");
  });

  it("keeps an original original when its primary source record has a SHA-256 hash", () => {
    const hashedPrimarySource = sourceManifest.sources.find((source) =>
      source.sourceId === "RD 346/2011" && source.sourceType === "primary" &&
      source.authority === "A" && source.status === "verified" && source.sha256 !== null,
    );
    expect(hashedPrimarySource?.sha256).toMatch(/^[a-f0-9]{64}$/);

    const parsed = originalPracticeQuestionSchema.parse(question({
      id: "orig-telecom-shared-source-hash-001",
      domain: "telecom",
      topicId: "ict-capitulo-i",
      syllabusNodeId: "ict-capitulo-i",
      sourceId: hashedPrimarySource!.sourceId,
      sourceVersion: hashedPrimarySource!.sourceVersion,
      sourceLocator: "Artículo 1; fuente ligada por sourceId y sourceVersion.",
    }));

    expect(sourceManifest.sources.find((source) =>
      source.sourceId === parsed.sourceId && source.sourceVersion === parsed.sourceVersion,
    )?.sha256).toBe(hashedPrimarySource!.sha256);
    expect(parsed.origin).toBe("original");
  });

  it("does not infer official provenance from exam-like synthetic wording", () => {
    const parsed = originalPracticeQuestionSchema.parse(question({
      prompt: "Enunciado sintético con estructura de test, redactado desde cero para esta prueba.",
    }));

    expect(parsed.origin).toBe("original");
  });

  it.each([
    ["missing provenance", { origin: undefined }],
    ["official provenance", { origin: "official_reference" }],
    ["unknown provenance", { origin: "adif-official" }],
    ["official flag", { official: true }],
    ["official form metadata", { examCode: "3403", questionNumber: 1, call: "PNI24/01" }],
    ["official publication evidence", { tribunal: "ADIF", publicationEvidence: { sourceId: "ADIF PNI24/01" } }],
  ])("rejects %s on an original record", (_label, override) => {
    expect(originalPracticeQuestionSchema.safeParse(question(override)).success).toBe(false);
  });

  it("rejects invalid answer keys and duplicate option keys", () => {
    expect(originalPracticeQuestionSchema.safeParse(question({ answer: "E" })).success).toBe(false);
    expect(originalPracticeQuestionSchema.safeParse(question({
      options: [options[0], options[0], options[2], options[3]],
    })).success).toBe(false);
    expect(originalPracticeQuestionSchema.safeParse(question({
      options: [options[0], { key: "B", text: options[0].text }, options[2], options[3]],
    })).success).toBe(false);
  });

  it("validates topic IDs against each domain and the official scope", () => {
    expect(originalPracticeQuestionSchema.safeParse(question({ topicId: "not-an-a2-topic" })).success).toBe(false);
    expect(originalPracticeQuestionSchema.safeParse(question({ domain: "psychometric", topicId: "not-an-aptitude" })).success).toBe(false);
    expect(originalPracticeQuestionSchema.safeParse(question({
      domain: "general-knowledge",
      topicId: "rcf-capitulo-5",
      syllabusNodeId: "rcf-capitulo-5",
    })).success).toBe(false);
    expect(originalPracticeQuestionSchema.safeParse(question({
      domain: "telecom",
      topicId: "missing-node",
      syllabusNodeId: "missing-node",
    })).success).toBe(false);

    const node = officialSpecificNode("rcf-capitulo-5");
    expect(node.status).toBe("partial");
    expect(originalPracticeQuestionSchema.safeParse(question({
      domain: "telecom",
      topicId: node.id,
      syllabusNodeId: node.id,
    })).success).toBe(true);
  });

  it("requires an active concept and a reviewed date for reviewed items", () => {
    expect(originalPracticeQuestionSchema.safeParse(question({ status: "published" })).success).toBe(false);
    expect(originalPracticeQuestionSchema.safeParse(question({ status: "reviewed" })).success).toBe(false);
    expect(originalPracticeQuestionSchema.safeParse(question({
      status: "reviewed",
      reviewedAt: "2026-10-16",
      conceptIds: ["concept-not-in-active-theory"],
    })).success).toBe(false);
    expect(originalPracticeQuestionSchema.safeParse(question({
      status: "reviewed",
      reviewedAt: "2026-10-16",
      conceptIds: ["ingles-concept-1"],
    })).success).toBe(true);
  });

  it("requires primary exact evidence for reviewed normative questions", () => {
    const reviewed = {
      id: "orig-general-igualdad-001",
      domain: "general-knowledge",
      topicId: "igualdad-ley-completa",
      syllabusNodeId: "igualdad-ley-completa",
      topic: "Ley Orgánica 3/2007",
      conceptIds: ["igualdad-concept-1"],
      status: "reviewed",
      reviewedAt: "2026-10-16",
    };

    expect(originalPracticeQuestionSchema.safeParse(question({ ...reviewed })).success).toBe(false);
    expect(originalPracticeQuestionSchema.safeParse(question({
      ...reviewed,
      sourceId: "LO 3/2007",
      sourceVersion: "consolidated-page-2026-10-15",
      sourceLocator: "Artículo 5",
    })).success).toBe(true);
    expect(originalPracticeQuestionSchema.safeParse(question({
      ...reviewed,
      sourceId: "TenTuPlaza",
      sourceVersion: "guide-2026",
      sourceLocator: "Tema de legislación",
    })).success).toBe(false);
    expect(originalPracticeQuestionSchema.safeParse(question({
      ...reviewed,
      sourceId: "LO 3/2007",
      sourceVersion: "consolidated-page-2026-10-15",
    })).success).toBe(false);
  });

  it("rejects normative questions grounded in a source from another syllabus section", () => {
    const mismatchedSource = {
      id: "orig-telecom-rcf-wrong-source-001",
      domain: "telecom",
      topicId: "rcf-capitulo-5",
      syllabusNodeId: "rcf-capitulo-5",
      topic: "Capítulo 5 del RCF",
      conceptIds: ["rcf-concept-1"],
      sourceId: "RD 346/2011",
      sourceVersion: "consolidated-page-2026-10-15",
      sourceLocator: "Artículo 1, apartado 1",
      status: "reviewed",
      reviewedAt: "2026-10-16",
    };

    expect(originalPracticeQuestionSchema.safeParse(question(mismatchedSource)).success).toBe(false);
    expect(originalPracticeQuestionSchema.safeParse(question({
      ...mismatchedSource,
      status: "draft",
      reviewedAt: undefined,
      conceptIds: [],
    })).success).toBe(false);
  });

  it("rejects repeated question IDs within one original dataset", () => {
    const sameId = question();
    expect(originalPracticeQuestionsSchema.safeParse([sameId, { ...sameId, prompt: "Otro enunciado sintético." }]).success).toBe(false);
  });
});
