import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { OriginalPracticeSession } from "../components/practice/original-practice-session";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";
import { toPublicPracticeQuestion } from "../lib/content/original-practice-public-dto";

const questions = listOriginalPracticeQuestions({ domain: "psychometric", status: "reviewed" })
  .map(toPublicPracticeQuestion).filter((question) => question !== null)
  .filter((question, index, all) => all.findIndex((candidate) => candidate.topicId === question.topicId) === index)
  .slice(0, 3);

const recoveryScope = "abcdef0123456789abcdef01";

afterEach(() => {
  cleanup();
  window.sessionStorage.clear();
  window.localStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function startExam() {
  render(<OriginalPracticeSession examMode questions={questions} recoveryScope={recoveryScope} />);
  fireEvent.change(screen.getByRole("spinbutton", { name: "Número de preguntas" }), { target: { value: "3" } });
  fireEvent.change(screen.getByRole("spinbutton", { name: /Tiempo límite/ }), { target: { value: "2" } });
  fireEvent.click(screen.getByRole("button", { name: "Iniciar simulacro original" }));
}

describe("original simulation accessibility", () => {
  it("keeps the countdown out of a live region so it is not read every second", () => {
    startExam();

    const timer = screen.getByRole("timer");
    expect(timer).toHaveAttribute("aria-live", "off");
    expect(timer).toHaveTextContent(/^Tiempo restante: 2:00$/);
  });

  it("moves focus to the question heading when the learner changes question", () => {
    startExam();

    const firstHeading = screen.getByRole("heading", { level: 3 });
    const firstText = firstHeading.textContent;
    expect(firstHeading).toHaveAttribute("tabindex", "-1");
    expect(firstHeading).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Siguiente pregunta" }));

    const secondHeading = screen.getByRole("heading", { level: 3 });
    expect(secondHeading.textContent).not.toBe(firstText);
    expect(secondHeading).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Anterior" }));
    expect(firstHeading).toHaveFocus();
  });

  it("offers a polite threshold region that stays silent while nothing changes", () => {
    startExam();

    const announcement = screen.getByTestId("simulation-timer-announcement");
    expect(announcement).toHaveAttribute("aria-live", "polite");
    expect(announcement).toBeEmptyDOMElement();
  });
});
