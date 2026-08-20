import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createServerClient, loadReviewBacklog, redirect } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  loadReviewBacklog: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("next/navigation", () => ({ redirect }));
vi.mock("../lib/supabase/server", () => ({ createServerClient }));
vi.mock("../lib/adaptive/review-session", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/adaptive/review-session")>()),
  loadReviewBacklog,
}));
vi.mock("../components/reviews/review-session", () => ({
  ReviewSession: ({ concepts }: { concepts: { id: string }[] }) => (
    <output aria-label="Conceptos de repaso">{concepts.map(({ id }) => id).join("|")}</output>
  ),
}));

import ReviewError from "../app/(dashboard)/repasos/error";
import ReviewLoading from "../app/(dashboard)/repasos/loading";
import ReviewsPage from "../app/(dashboard)/repasos/page";

const backlog = [
  { id: "concept-a", title: "A", lessonSlug: "lesson-a", claims: ["A"], dueOn: "2026-08-10", status: "review" },
  { id: "concept-b", title: "B", lessonSlug: "lesson-b", claims: ["B"], dueOn: null, status: "at_risk" },
] as const;

describe("review route states", () => {
  afterEach(cleanup);

  beforeEach(() => {
    createServerClient.mockReset().mockResolvedValue({
      auth: { getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } }, error: null })) },
    });
    loadReviewBacklog.mockReset().mockResolvedValue(backlog);
    redirect.mockReset();
  });

  it("authenticates and preserves an exact valid planned order", async () => {
    render(await ReviewsPage({ searchParams: Promise.resolve({ concepts: "concept-b,concept-a" }) }));
    expect(screen.getByLabelText("Conceptos de repaso")).toHaveTextContent("concept-b|concept-a");
  });

  it("rejects the whole planned list when it is malformed or no longer in the active backlog", async () => {
    render(await ReviewsPage({ searchParams: Promise.resolve({ concepts: "concept-a,retired" }) }));
    expect(screen.getByRole("alert")).toHaveAccessibleName("No se puede iniciar este repaso");
    expect(screen.queryByLabelText("Conceptos de repaso")).not.toBeInTheDocument();
  });

  it("renders a useful empty state when no review is due or at risk", async () => {
    loadReviewBacklog.mockResolvedValueOnce([]);
    render(await ReviewsPage({ searchParams: Promise.resolve({}) }));
    expect(screen.getByRole("status")).toHaveTextContent(/no tienes repasos pendientes/i);
    expect(screen.getByRole("link", { name: "Volver a tu preparación" })).toHaveAttribute("href", "/");
  });

  it("provides semantic loading and retryable error states", () => {
    const reset = vi.fn();
    const { unmount } = render(<ReviewLoading />);
    expect(screen.getByRole("status")).toHaveTextContent(/preparando tus repasos/i);
    unmount();
    render(<ReviewError error={new Error("private database detail")} reset={reset} />);
    expect(screen.getByRole("alert")).toHaveTextContent(/no hemos podido cargar tus repasos/i);
    expect(screen.queryByText(/private database detail/i)).not.toBeInTheDocument();
  });
});
