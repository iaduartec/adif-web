import { describe, expect, it } from "vitest";

import { lessonTheories } from "../content/lesson-theory";
import { officialItems } from "../content/syllabus";
import { toPublicPracticeQuestion } from "../lib/content/original-practice-public-dto";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";
import { sourceManifest } from "../lib/content/source-manifest";

const specificParents = officialItems.filter((item) => item.scope === "specific-26-12po");
const telecomNodes = new Map(
  specificParents.flatMap((parent) => parent.children.map((child) => [child.id, child] as const)),
);

describe("original telecom practice", () => {
  const questions = listOriginalPracticeQuestions({ domain: "telecom" });
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

  it("links every reviewed item to a mapped specific node with an exact verified locator", () => {
    for (const question of reviewed) {
      expect(question.syllabusNodeId, question.id).toBe(question.topicId);
      const node = telecomNodes.get(question.topicId);
      expect(node, question.id).toBeDefined();
      expect(node!.materialSourceIds, question.id).toContain(question.sourceId);

      const source = sourceManifest.sources.find(
        (candidate) =>
          candidate.sourceId === question.sourceId && candidate.sourceVersion === question.sourceVersion,
      );
      expect(source, question.id).toBeDefined();
      expect(source!.sourceType, question.id).toBe("primary");
      expect(source!.authority, question.id).toBe("A");
      expect(source!.status, question.id).toBe("verified");
      expect(source!.locatorPolicy, question.id).toBe("exact");

      const anchorModuleId = node!.linkedModules.find((moduleId) =>
        lessonTheories[moduleId]?.sources.some(
          (candidate) =>
            candidate.sourceId === question.sourceId &&
            candidate.sourceVersion === question.sourceVersion &&
            candidate.locator === question.sourceLocator,
        ),
      );
      expect(anchorModuleId, question.id).toBeDefined();

      const theory = lessonTheories[anchorModuleId!];
      const reference = theory.sources.find(
        (candidate) =>
          candidate.sourceId === question.sourceId &&
          candidate.sourceVersion === question.sourceVersion &&
          candidate.locator === question.sourceLocator,
      );
      expect(reference, question.id).toBeDefined();

      for (const conceptId of question.conceptIds) {
        const concept = theory.concepts.find((candidate) => candidate.id === conceptId);
        expect(concept, `${question.id}/${conceptId}`).toBeDefined();
        const citesReference = concept!.claims.some((claim) => claim.legalBasis.includes(reference!.id));
        expect(citesReference, `${question.id}/${conceptId}`).toBe(true);
      }
    }
  });

  it("covers the ICT and RCF domains and keeps the unmapped CEM domain out of the bank", () => {
    const coveredSourceIds = new Set(reviewed.map((question) => question.sourceId));
    expect(coveredSourceIds.has("RD 346/2011")).toBe(true);
    expect(coveredSourceIds.has("RD 664/2015")).toBe(true);

    const cemParent = specificParents.find((item) => item.id === "syllabus-compatibilidad-electromagnetica");
    expect(cemParent).toBeDefined();
    for (const node of cemParent!.children) {
      expect(node.materialSourceIds, node.id).toHaveLength(0);
      expect(node.linkedModules, node.id).toHaveLength(0);
    }
    expect(questions.some((question) => question.topicId.startsWith("cem-"))).toBe(false);
  });

  it("spreads the correct answer across every option position", () => {
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

  it("covers all 34 ICT concepts and all four mapped RCF chapters", () => {
    const coveredConcepts = new Set(reviewed.flatMap((question) => question.conceptIds));
    for (const concept of lessonTheories["ict-rd-346-2011"]!.concepts) {
      expect(coveredConcepts.has(concept.id), concept.id).toBe(true);
    }
    for (const concept of lessonTheories["rcf-libro-1"]!.concepts) {
      expect(coveredConcepts.has(concept.id), concept.id).toBe(true);
    }

    const rcfParent = specificParents.find((item) => item.id === "syllabus-rcf");
    expect(rcfParent).toBeDefined();
    const mappedRcfNodeIds = rcfParent!.children
      .filter((node) => node.linkedModules.includes("rcf-libro-1"))
      .map((node) => node.id);
    const coveredNodeIds = new Set(reviewed.map((question) => question.topicId));

    for (const nodeId of mappedRcfNodeIds) {
      expect(coveredNodeIds.has(nodeId), nodeId).toBe(true);
    }
  });
});
