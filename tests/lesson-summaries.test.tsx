import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, it, expect } from "vitest";

import { LessonReader } from "../components/course/lesson-reader";
import { getLesson } from "../lib/content/repository";

describe("course lesson summaries", () => {
  afterEach(cleanup);

  it("renders the psychometrics summary instead of the fallback note", () => {
    render(<LessonReader lesson={getLesson("psicometria")!} progress={0} questions={[]} />);

    expect(screen.getByText(/Evaluación psicométrica: qué se mide y cómo prepararlo/i)).toBeVisible();
  });

  it("renders the English A2 summary instead of the fallback note", () => {
    render(<LessonReader lesson={getLesson("ingles-a2")!} progress={0} questions={[]} />);

    expect(screen.getByText(/Inglés A2: gramática funcional para examen/i)).toBeVisible();
  });
});
