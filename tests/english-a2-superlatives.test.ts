import { describe, expect, it } from "vitest";

import questions from "../content/original-practice/english-a2.json";
import { inglesA2Theory } from "../content/theories/ingles-a2";
import { originalPracticeQuestionSchema } from "../lib/content/original-practice-schema";

describe("English A2 superlatives", () => {
  it("links the accessible rule and practice guidance to an original exercise", () => {
    const concept = inglesA2Theory.concepts.find((item) => item.id === "ingles-topic-superlatives");
    const claims = concept?.claims.map((claim) => claim.text).join(" ") ?? "";
    const practice = questions.find((question) => question.id === "orig-a2-superlatives-001");

    expect(claims).toMatch(/the \+ adjetivo terminado en -est/);
    expect(claims).toMatch(/uno con todo un grupo \(superlativo\)/);
    expect(claims).toMatch(/el bloque incluye una pregunta de superlativos/);
    expect(practice).toBeDefined();
    expect(practice?.origin).toBe("original");
    expect(practice?.status).toBe("reviewed");
    expect(practice?.topicId).toBe("comparatives");
    expect(practice?.conceptIds).toContain("ingles-topic-comparatives");
  });

  it("uses one unambiguous A2 item with feedback for each distractor", () => {
    const item = originalPracticeQuestionSchema.parse(
      questions.find((question) => question.id === "orig-a2-superlatives-001"),
    );
    expect(item.answer).toBe("A");
    expect(item.options).toHaveLength(4);
    expect(item.prompt).toMatch(/2 km, 5 km and 8 km/);
    expect(item.prompt).toMatch(/use a superlative/);
    expect(item.prompt).toMatch(/minimum distance/);
    expect(item.options.map((option) => option.text)).toEqual(["shortest", "shorter", "most short", "short"]);
    expect(item.explanation).toMatch(/extremo de menor distancia entre tres rutas/);
    expect(item.explanation).toMatch(/Shorter es comparativo/);
    expect(item.explanation).toMatch(/most short/);
    expect(item.explanation).not.toMatch(/Shorter necesita than/);
  });
});
