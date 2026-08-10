import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { createServerClient } = vi.hoisted(() => ({ createServerClient: vi.fn() }));

vi.mock("../lib/supabase/server", () => ({ createServerClient }));

import CourseLessonPage from "../app/(dashboard)/curso/[slug]/page";
import InglesA2Page from "../app/(dashboard)/ingles-a2/page";
import PsicotecnicosPage from "../app/(dashboard)/psicotecnicos/page";

function createSupabaseDouble() {
  const query = {
    select: vi.fn(),
    eq: vi.fn(),
    maybeSingle: vi.fn(async () => ({ data: null, error: null })),
    then: (resolve: (value: { data: unknown[]; error: null }) => unknown) =>
      Promise.resolve({ data: [], error: null }).then(resolve),
  };
  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  return {
    auth: { getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } } })) },
    from: vi.fn(() => query),
  };
}

describe("official-only navigation contracts", () => {
  afterEach(cleanup);

  it.each([
    ["Inglés A2", InglesA2Page],
    ["Psicotécnicos", PsicotecnicosPage],
  ])("does not offer a legacy or unrelated practice session from %s", async (_label, Page) => {
    createServerClient.mockResolvedValue(createSupabaseDouble());
    const { container } = render(await Page());

    expect(container.querySelector('a[href*="module="]')).toBeNull();
    expect(screen.queryByRole("link", { name: /Iniciar Práctica/i })).not.toBeInTheDocument();
    expect(screen.getByText(/no hay preguntas oficiales públicas disponibles/i)).toBeVisible();
  });

  it("links a lesson only to the unfiltered official bank and never injects unrelated questions", async () => {
    createServerClient.mockResolvedValue(createSupabaseDouble());
    render(await CourseLessonPage({ params: Promise.resolve({ slug: "igualdad" }) }));

    expect(screen.getByRole("link", { name: "Preguntas oficiales" })).toHaveAttribute("href", "/tests");
    expect(document.querySelector('a[href*="module="]')).toBeNull();
    expect(screen.queryByText(/ADIF-\d{4}-\d{4}-Q\d{2}/)).not.toBeInTheDocument();
  });
});
