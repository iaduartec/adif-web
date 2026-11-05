import { expect, it } from "vitest";
import questions from "../content/original-practice/telecom.json";
import officialText from "../content/full-texts/ict-rd-346-2011.json";

it("keeps the RITU bank explanation consistent with the official single-family exception", () => {
  const question = questions.find((item) => item.id === "orig-tel-ict-005")!;
  const normalizedOfficialText = officialText.replace(/\s+/g, " ");

  expect(question.explanation).toMatch(/viviendas unifamiliares sin límite de PAU/i);
  expect(question.sourceLocator).toContain("Anexo III");
  expect(normalizedOfficialText).toContain(
    "para conjuntos de viviendas unifamiliares (sin limitación en el n.º de PAU)",
  );
});
