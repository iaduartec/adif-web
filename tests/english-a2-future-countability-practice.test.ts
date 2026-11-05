import { describe, expect, it } from "vitest";

import questions from "../content/original-practice/english-a2.json";
import { inglesA2Theory } from "../content/theories/ingles-a2";
import { originalPracticeQuestionSchema } from "../lib/content/original-practice-schema";

describe("English A2 future and countability practice", () => {
  it("teaches and tests a spontaneous offer with will", () => {
    const concept = inglesA2Theory.concepts.find((item) => item.id === "ingles-topic-future");
    const exercise = originalPracticeQuestionSchema.parse(
      questions.find((item) => item.id === "orig-a2-future-will-offer-001"),
    );
    const example = inglesA2Theory.examples.find((item) => item.id === "ingles-ex-future-will");

    expect(concept?.claims.map((claim) => claim.text).join(" ")).toMatch(/decisiones tomadas en el momento, ofrecimientos/);
    expect(example?.situation).toMatch(/save you a seat/);
    expect(exercise.answer).toBe("B");
    expect(exercise.prompt).toMatch(/hold her bag/);
    expect(exercise.options.map((option) => option.text)).toEqual([
      "to hold", "hold", "holding", "holds",
    ]);
    expect(exercise.explanation).toMatch(/oferta en el momento/);
  });

  it("applies the uncountable noun information in a sentence", () => {
    const concept = inglesA2Theory.concepts.find((item) => item.id === "ingles-topic-countable-uncountable");
    const exercise = originalPracticeQuestionSchema.parse(
      questions.find((item) => item.id === "orig-a2-countable-information-002"),
    );
    const example = inglesA2Theory.examples.find((item) => item.id === "ingles-ex-countable-information");

    expect(concept?.claims.map((claim) => claim.text).join(" ")).toMatch(/information, luggage, advice, water/);
    expect(example?.situation).toMatch(/information about luggage/);
    expect(exercise.answer).toBe("D");
    expect(exercise.options.map((option) => option.text)).toEqual([
      "an information", "many information", "two informations", "some information",
    ]);
    expect(exercise.explanation).toMatch(/two pieces of information/);
  });
});
