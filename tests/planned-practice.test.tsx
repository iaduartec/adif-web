import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createServerClient, getUser, redirect } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  getUser: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  redirect,
}));
vi.mock("../lib/supabase/server", () => ({ createServerClient }));
vi.mock("../components/practice/question-session", () => ({
  QuestionSession: ({ questions }: { questions: { id: string }[] }) => (
    <output aria-label="Preguntas planificadas">{questions.map(({ id }) => id).join("|")}</output>
  ),
}));

import TestsPage from "../app/(dashboard)/tests/page";
import { listOfficialQuestions } from "../lib/content/repository";

describe("planned practice route", () => {
  afterEach(cleanup);

  beforeEach(() => {
    getUser.mockReset().mockResolvedValue({ data: { user: { id: "user-1" } } });
    createServerClient.mockResolvedValue({
      auth: { getUser },
      from: vi.fn(() => {
        const query = { select: vi.fn(), eq: vi.fn(), order: vi.fn() };
        query.select.mockReturnValue(query);
        query.eq.mockReturnValue(query);
        query.order.mockReturnValue(Promise.resolve({ data: [] }));
        return query;
      }),
    });
  });

  it.each([5, 10] as const)("runs only the exact %s active question ids in their requested order", async (count) => {
    const questions = listOfficialQuestions();
    const orderedIds = questions.slice(0, count).map(({ id }) => id).reverse();

    render(await TestsPage({
      searchParams: Promise.resolve({ practice: "true", questions: orderedIds.join(",") }),
    }));

    expect(screen.getByLabelText("Preguntas planificadas")).toHaveTextContent(orderedIds.join("|"));
  });

  it("rejects the whole planned set when any supplied id is not active", async () => {
    const activeIds = listOfficialQuestions().slice(0, 4).map(({ id }) => id);

    render(await TestsPage({
      searchParams: Promise.resolve({
        practice: "true",
        questions: [...activeIds, "unknown-question"].join(","),
      }),
    }));

    expect(screen.getByRole("alert")).toHaveTextContent(/no se puede iniciar esta práctica/i);
    expect(screen.queryByLabelText("Preguntas planificadas")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /volver a preguntas oficiales/i })).toHaveAttribute("href", "/tests");
  });

  it("authenticates and safely rejects repeated questions query keys represented as an array", async () => {
    const activeIds = listOfficialQuestions().slice(0, 5).map(({ id }) => id).join(",");

    const page = await TestsPage({
      searchParams: Promise.resolve({
        practice: "true",
        questions: [activeIds, activeIds],
      }),
    });
    render(page);

    expect(getUser).toHaveBeenCalledOnce();
    expect(screen.getByRole("alert")).toHaveAccessibleName("No se puede iniciar esta práctica");
    expect(screen.queryByLabelText("Preguntas planificadas")).not.toBeInTheDocument();
  });

  it.each([
    ["leading empty segment", (ids: string[]) => `,${ids.join(",")}`],
    ["middle empty segment", (ids: string[]) => `${ids.slice(0, 2).join(",")},,${ids.slice(2).join(",")}`],
    ["trailing empty segment", (ids: string[]) => `${ids.join(",")},`],
  ] as const)("rejects a planned list with a %s", async (_name, tamper) => {
    const activeIds = listOfficialQuestions().slice(0, 5).map(({ id }) => id);

    render(await TestsPage({
      searchParams: Promise.resolve({ practice: "true", questions: tamper(activeIds) }),
    }));

    expect(screen.getByRole("alert")).toHaveAccessibleName("No se puede iniciar esta práctica");
    expect(screen.queryByLabelText("Preguntas planificadas")).not.toBeInTheDocument();
  });

  it("rejects duplicate planned IDs instead of silently shrinking or repeating the session", async () => {
    const activeIds = listOfficialQuestions().slice(0, 4).map(({ id }) => id);

    render(await TestsPage({
      searchParams: Promise.resolve({
        practice: "true",
        questions: [...activeIds, activeIds[0]!].join(","),
      }),
    }));

    expect(screen.getByRole("alert")).toBeVisible();
    expect(screen.queryByLabelText("Preguntas planificadas")).not.toBeInTheDocument();
  });

  it("rejects more than the planned ten-question maximum", async () => {
    const overLimitIds = listOfficialQuestions().slice(0, 11).map(({ id }) => id);

    render(await TestsPage({
      searchParams: Promise.resolve({ practice: "true", questions: overLimitIds.join(",") }),
    }));

    expect(screen.getByRole("alert")).toBeVisible();
    expect(screen.queryByLabelText("Preguntas planificadas")).not.toBeInTheDocument();
  });
});
