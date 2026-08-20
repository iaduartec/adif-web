import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { saveLessonProgress } = vi.hoisted(() => ({ saveLessonProgress: vi.fn() }));
vi.mock("../app/actions/lesson", () => ({ saveLessonProgress }));

import { CourseTheoryReader } from "../components/course/course-theory-reader";
import { getLesson } from "../lib/content/repository";

describe("server-rendered lesson selection", () => {
  afterEach(cleanup);

  it("renders the selected official view without loading the full legal document", async () => {
    render(await CourseTheoryReader({
      lesson: getLesson("igualdad")!,
      progress: 0,
      view: "official",
      showFullDocument: false,
    }));

    expect(screen.getByRole("heading", { name: "Texto Oficial Integrado" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Cargar documento completo" })).toBeVisible();
    expect(screen.queryByText(/LEGISLACIÓN CONSOLIDADA/)).not.toBeInTheDocument();
  });

  it("loads the complete legal document only when explicitly requested", async () => {
    render(await CourseTheoryReader({
      lesson: getLesson("igualdad")!,
      progress: 0,
      view: "official",
      showFullDocument: true,
    }));

    expect(screen.getByText(/LEGISLACIÓN CONSOLIDADA/)).toBeVisible();
  });

  it("gives every theory concept a stable review-session anchor without making the reader client-side", async () => {
    render(await CourseTheoryReader({
      lesson: getLesson("igualdad")!,
      progress: 0,
      view: "theory",
    }));

    const conceptHeading = screen.getAllByRole("heading", { level: 4 })[0]!;
    expect(conceptHeading.closest("section")).toHaveAttribute("id", expect.stringMatching(/^concept-.+/));
  });
});
