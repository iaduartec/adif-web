import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import InglesA2Page from "../app/(dashboard)/ingles-a2/page";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";

vi.mock("../lib/supabase/server", () => ({
  createServerClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: "a2-student" } } }) } }),
}));

afterEach(cleanup);

describe("A2 curriculum page", () => {
  it("lists shared topics and sanitized original questions without exposing feedback", async () => {
    const page = await InglesA2Page();
    const html = renderToStaticMarkup(page);
    render(page);
    const questions = listOriginalPracticeQuestions({ domain: "english-a2", status: "reviewed" });
    expect(screen.getAllByText("PRÁCTICA A2 ORIGINAL")).toHaveLength(22);
    expect(screen.getByRole("heading", { name: "Currículo A2" })).toBeVisible();
    for (const question of questions) {
      expect(screen.getByText(question.prompt)).toBeInTheDocument();
      expect(html).not.toContain(question.explanation);
    }
    expect(html).not.toContain('"answer":');
    expect(screen.getByText(/progreso del temario oficial/i)).toBeVisible();
  });

  it("links every topic concept into the theory view of the course reader", async () => {
    const page = await InglesA2Page();
    render(page);
    const conceptLinks = screen.getAllByRole("link", { name: "Repasar el concepto" });
    expect(conceptLinks.length).toBeGreaterThan(0);
    for (const link of conceptLinks) {
      expect(link).toHaveAttribute("href", expect.stringMatching(/^\/curso\/ingles-a2\?view=theory#concept-/));
    }
  });
});
