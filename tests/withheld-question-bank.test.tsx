import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createServerClient, rowsByTable } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  rowsByTable: { current: {} as Record<string, unknown[]> },
}));

vi.mock("../lib/supabase/server", () => ({ createServerClient }));

import ErrorNotebookPage from "../app/(dashboard)/errores/page";
import SimulacrosPage from "../app/(dashboard)/simulacros/page";
import TestsPage from "../app/(dashboard)/tests/page";
import { listOfficialQuestionRecords, listOfficialQuestions } from "../lib/content/repository";

function createSupabaseDouble() {
  return {
    auth: { getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } } })) },
    from: vi.fn((table: string) => {
      const query = {
        select: vi.fn(),
        eq: vi.fn(),
        order: vi.fn(),
        then: (resolve: (value: { data: unknown[]; error: null }) => unknown) =>
          Promise.resolve({ data: rowsByTable.current[table] ?? [], error: null }).then(resolve),
      };
      query.select.mockReturnValue(query);
      query.eq.mockReturnValue(query);
      query.order.mockReturnValue(query);
      return query;
    }),
  };
}

describe("withheld official question bank", () => {
  afterEach(cleanup);

  beforeEach(() => {
    rowsByTable.current = {};
    createServerClient.mockResolvedValue(createSupabaseDouble());
  });

  it("explains that official prompts are withheld while source and rights checks are pending", async () => {
    expect(listOfficialQuestionRecords().length).toBeGreaterThan(0);
    expect(listOfficialQuestions()).toHaveLength(0);

    render(await TestsPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole("alert")).toHaveTextContent(/preguntas oficiales tienen los enunciados retenidos/i);
    expect(screen.getByRole("alert")).toHaveTextContent(/fuentes y los derechos/i);
    expect(screen.queryByText(/no hay preguntas que coincidan con los filtros/i)).not.toBeInTheDocument();
  });

  it("explains why an official practice session has no playable questions", async () => {
    render(await TestsPage({ searchParams: Promise.resolve({ practice: "true" }) }));

    expect(screen.getAllByRole("status")[0]).toHaveTextContent(/enunciados siguen retenidos/i);
    expect(screen.getAllByRole("status")[0]).toHaveTextContent(/fuentes y los derechos de uso/i);
    expect(screen.queryByText(/no hay preguntas que coincidan con estos filtros/i)).not.toBeInTheDocument();
  });

  it("preserves failed-attempt history without saying the learner has no errors", async () => {
    const withheld = listOfficialQuestionRecords()[0]!;
    rowsByTable.current.question_attempts = [{
      question_id: withheld.id,
      selected_answer: "B",
      is_correct: false,
      created_at: "2026-10-15T09:00:00.000Z",
    }];

    render(await ErrorNotebookPage());

    expect(screen.getByRole("status")).toHaveTextContent(/conservamos 1 intento fallido/i);
    expect(screen.getByRole("status")).toHaveTextContent(/preguntas oficiales retenidas/i);
    expect(screen.queryByText("Todo al día")).not.toBeInTheDocument();
    expect(screen.queryByText(withheld.prompt)).not.toBeInTheDocument();
  });

  it("shows all eight official form records while keeping every uncleared exam unplayable", async () => {
    render(await SimulacrosPage());

    expect(screen.getAllByRole("article")).toHaveLength(8);
    expect(screen.getByText(/Formulario 1044/i)).toBeVisible();
    expect(screen.getByText(/Formulario 2442/i)).toBeVisible();
    expect(screen.getAllByText(/texto retenido/i)).toHaveLength(8);
    expect(screen.queryByRole("link", { name: /abrir examen/i })).not.toBeInTheDocument();
  });
});
