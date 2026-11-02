import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DiagnosticPage from "../app/(dashboard)/diagnostico/page";
import { getOriginalPracticeQuestion, listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";
import { toPublicPracticeQuestion } from "../lib/content/original-practice-public-dto";
import { selectBalancedOriginalDiagnosticQuestions } from "../lib/onboarding-diagnostic";

describe("original-only onboarding diagnostic", () => {
  it("starts fifteen eligible answer-free original questions and labels the set as formative", async () => {
    const publicPool = listOriginalPracticeQuestions({ status: "reviewed" })
      .map(toPublicPracticeQuestion)
      .filter((question) => question !== null);
    const selected = selectBalancedOriginalDiagnosticQuestions(publicPool);
    const withheldLegacyQuestion = getOriginalPracticeQuestion("orig-gen-prl-001");

    expect(publicPool.length).toBeGreaterThanOrEqual(15);
    expect(withheldLegacyQuestion?.status).toBe("draft");
    expect(selected).toHaveLength(15);
    expect(selected.every((question) => question.origin === "original")).toBe(true);
    expect(selected.some((question) => question.id === withheldLegacyQuestion?.id)).toBe(false);
    expect(selected.every((question) => !("answer" in question) && !("explanation" in question))).toBe(true);

    render(await DiagnosticPage());

    expect(screen.getByRole("heading", { level: 1, name: "Diagnóstico inicial" })).toBeVisible();
    expect(screen.getByText(/diagnóstico formativo de preguntas originales, no equivalente a un examen oficial/i)).toBeVisible();
    expect(screen.getByText(/Pregunta 1 de 15/)).toBeVisible();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    expect(screen.queryByText(/Respuesta correcta|La respuesta [A-D] es correcta/)).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton", { name: "Cantidad de preguntas" })).not.toBeInTheDocument();
  });
});
