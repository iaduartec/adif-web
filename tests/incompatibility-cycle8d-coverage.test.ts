import { describe, expect, it } from "vitest";

import { lessonTheories } from "../content/lesson-theory";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";

describe("Cycle 8D incompatibilities content", () => {
  const theory = lessonTheories.incompatibilidades!;
  const claims = theory.concepts.flatMap((concept) => concept.claims);
  const questions = listOriginalPracticeQuestions({ domain: "general-knowledge" })
    .filter((question) => question.skill === "INCOMPATIBILIDADES");

  it("preserves the public-post exception conditions in article 3 and article 4", () => {
    const publicException = claims.find((claim) => claim.id === "incomp-c3-1")?.text ?? "";
    expect(publicException).toMatch(/previa y expresa/i);
    expect(publicException).toMatch(/a tiempo parcial y de duración determinada/i);
    expect(publicException).toMatch(/profesor universitario asociado/i);
    expect(publicException).toMatch(/dedicación no superior a la de tiempo parcial/i);
  });

  it("states the article 19 asset-management exception without erasing article 12 limits", () => {
    const privateExceptions = claims.find((claim) => claim.id === "incomp-c15-1")?.text ?? "";
    expect(privateExceptions).toMatch(/patrimonio personal o familiar[^;]*artículo 12/i);
  });

  it("provides an original case question about a private activity in a matter handled by the employee", () => {
    const question = questions.find((item) => item.id === "orig-gen-incompat-008");
    expect(question).toBeDefined();
    expect(question?.answer).toBe("D");
    expect(question?.prompt).toMatch(/expediente.*contratación/i);
    expect(question?.explanation).toMatch(/artículo 12\.1\.a/i);
  });

  it("keeps the private activity authorization requirement and its change-of-post condition", () => {
    const privateAuthorization = claims.find((claim) => claim.id === "incomp-c11-1")?.text ?? "";
    expect(privateAuthorization).toMatch(/previo reconocimiento de compatibilidad/i);
    expect(privateAuthorization).toMatch(/dos meses/i);
    expect(privateAuthorization).toMatch(/cambio de puesto en el sector público/i);
  });
});
