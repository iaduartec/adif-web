import { describe, expect, it } from "vitest";

import { lessonTheories } from "../content/lesson-theory";
import { officialItems } from "../content/syllabus";
import { toPublicPracticeQuestion } from "../lib/content/original-practice-public-dto";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";
import { sourceManifest } from "../lib/content/source-manifest";

const commonParents = officialItems.filter((item) => item.scope === "common");

function findNode(nodeId: string) {
  for (const parent of commonParents) {
    const node = parent.children.find((child) => child.id === nodeId);
    if (node) return { parent, node };
  }
  return null;
}

describe("original common-law practice", () => {
  const questions = listOriginalPracticeQuestions({ domain: "general-knowledge" });
  const reviewed = questions.filter((question) => question.status === "reviewed");

  it("provides at least 18 reviewed eligible items with four unique options, one answer and an explanation", () => {
    expect(reviewed.length).toBeGreaterThanOrEqual(18);

    for (const question of reviewed) {
      expect(question.origin, question.id).toBe("original");
      expect(question.reviewedAt, question.id).toBeTruthy();
      expect(question.conceptIds.length, question.id).toBeGreaterThan(0);
      expect(question.explanation.length, question.id).toBeGreaterThan(20);
      expect(question.options, question.id).toHaveLength(4);
      expect(new Set(question.options.map((option) => option.key)).size, question.id).toBe(4);
      expect(question.options.map((option) => option.key), question.id).toContain(question.answer);

      const dto = toPublicPracticeQuestion(question);
      expect(dto, question.id).not.toBeNull();
      expect(dto, question.id).not.toHaveProperty("answer");
      expect(dto, question.id).not.toHaveProperty("explanation");
    }
  });

  it("represents every common official scope", () => {
    const coveredNodeIds = new Set(questions.map((question) => question.topicId));
    expect(commonParents.length).toBe(6);

    for (const parent of commonParents) {
      const represented = parent.children.some((child) => coveredNodeIds.has(child.id));
      expect(represented, parent.id).toBe(true);
    }
  });

  it("anchors every reviewed item to an exact locator in a verified primary source", () => {
    for (const question of reviewed) {
      const located = findNode(question.topicId);
      expect(located, question.id).not.toBeNull();
      expect(question.syllabusNodeId, question.id).toBe(question.topicId);

      const source = sourceManifest.sources.find((candidate) =>
        candidate.sourceId === question.sourceId && candidate.sourceVersion === question.sourceVersion,
      );
      expect(source, question.id).toBeDefined();
      expect(source!.sourceType, question.id).toBe("primary");
      expect(source!.authority, question.id).toBe("A");
      expect(source!.status, question.id).toBe("verified");
      expect(source!.locatorPolicy, question.id).toBe("exact");

      expect(located!.node.materialSourceIds, question.id).toContain(question.sourceId);

      const anchorModuleId = located!.node.linkedModules.find((moduleId) =>
        lessonTheories[moduleId]?.sources.some((candidate) =>
          candidate.sourceId === question.sourceId &&
          candidate.sourceVersion === question.sourceVersion &&
          candidate.locator === question.sourceLocator,
        ),
      );
      expect(anchorModuleId, question.id).toBeDefined();

      const anchorTheory = lessonTheories[anchorModuleId!];
      const matchedReference = anchorTheory.sources.find(
        (candidate) =>
          candidate.sourceId === question.sourceId &&
          candidate.sourceVersion === question.sourceVersion &&
          candidate.locator === question.sourceLocator,
      );
      expect(matchedReference, question.id).toBeDefined();

      for (const conceptId of question.conceptIds) {
        const concept = anchorTheory.concepts.find((candidate) => candidate.id === conceptId);
        expect(concept, `${question.id}/${conceptId}`).toBeDefined();
        const citesReference = concept!.claims.some((claim) => claim.legalBasis.includes(matchedReference!.id));
        expect(citesReference, `${question.id}/${conceptId}`).toBe(true);
      }
    }
  });

  it("keeps the Declaración sobre la Red scope represented but unreviewed until its source is verified", () => {
    const parent = commonParents.find((item) => item.id === "syllabus-declaracion-red");
    expect(parent).toBeDefined();
    const childIds = new Set(parent!.children.map((child) => child.id));

    const declaracionItems = questions.filter((question) => childIds.has(question.topicId));
    expect(declaracionItems.length).toBeGreaterThan(0);
    expect(declaracionItems.every((question) => question.status !== "reviewed")).toBe(true);

    const declarationSource = sourceManifest.sources.find((source) => source.sourceId === "DR 2027");
    expect(declarationSource).toBeDefined();
    expect(declarationSource!.status).not.toBe("verified");
  });

  it("covers every mapped Estatuto ADIF chapter I–VI and spreads correct answers across A–D", () => {
    const estatutoParent = commonParents.find((item) => item.id === "syllabus-estatuto-adif");
    expect(estatutoParent).toBeDefined();
    const reviewedNodeIds = new Set(reviewed.map((question) => question.topicId));

    for (const child of estatutoParent!.children) {
      expect(reviewedNodeIds.has(child.id), child.id).toBe(true);
    }

    const distribution = reviewed.reduce<Record<string, number>>((counts, question) => {
      counts[question.answer] = (counts[question.answer] ?? 0) + 1;
      return counts;
    }, {});

    const counts = ["A", "B", "C", "D"].map((key) => distribution[key] ?? 0);
    for (const [index, count] of counts.entries()) {
      expect(count, "ABCD"[index]).toBeGreaterThan(0);
    }
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(2);
  });
});
