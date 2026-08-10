import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { saveLessonProgress } = vi.hoisted(() => ({ saveLessonProgress: vi.fn() }));
vi.mock("../app/actions/lesson", () => ({ saveLessonProgress }));

import { LessonReader } from "../components/course/lesson-reader";
import { getLesson } from "../lib/content/repository";

describe("server-rendered lesson selection", () => {
  afterEach(cleanup);

  it("renders the selected official view without loading the full legal document", async () => {
    render(await LessonReader({
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
    render(await LessonReader({
      lesson: getLesson("igualdad")!,
      progress: 0,
      view: "official",
      showFullDocument: true,
    }));

    expect(screen.getByText(/LEGISLACIÓN CONSOLIDADA/)).toBeVisible();
  });
});
