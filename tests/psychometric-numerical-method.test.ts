import { describe, expect, it } from "vitest";

import { psicometriaTheory } from "../content/theories/psicometria";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";

describe("psychometric percentage method", () => {
  it("connects the mental decomposition method to a reviewed, uniquely keyed reduction item", () => {
    const concept = psicometriaTheory.concepts.find(({ id }) => id === "psico-topic-numerical");
    const method = concept?.claims.find(({ id }) => id === "psico-topic-numerical-percent-method")?.text;
    const example = psicometriaTheory.examples.find(({ id }) => id === "psico-ex-3");
    const question = listOriginalPracticeQuestions({ domain: "psychometric", status: "reviewed" })
      .find(({ id }) => id === "orig-psico-numerical-003");

    expect(method).toContain("15 % = 10 % + 5 %");
    expect(example?.application[0]?.text).toContain("360 − 54 = 306");
    expect(question?.answer).toBe("A");
    expect(question?.options.filter(({ text }) => text === "408")).toHaveLength(1);
    expect(question?.prompt).toContain("480");
    expect(question?.explanation).toContain("480 − 72 = 408");
    expect(question?.conceptIds).toContain("psico-topic-numerical");
  });
});
