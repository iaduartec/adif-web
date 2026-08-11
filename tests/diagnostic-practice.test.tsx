import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { createServerClient, redirect } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  redirect,
}));
vi.mock("../lib/supabase/server", () => ({ createServerClient }));

import TestsPage from "../app/(dashboard)/tests/page";
import { listOfficialQuestions } from "../lib/content/repository";

describe("diagnostic practice", () => {
  beforeEach(() => {
    createServerClient.mockResolvedValue({
      auth: { getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } } })) },
      from: vi.fn(() => {
        const query = { select: vi.fn(), eq: vi.fn(), order: vi.fn() };
        query.select.mockReturnValue(query);
        query.eq.mockReturnValue(query);
        query.order.mockReturnValue(Promise.resolve({ data: [] }));
        return query;
      }),
    });
  });

  it("uses only the diagnostic question ids instead of the whole official bank", async () => {
    const questions = listOfficialQuestions();
    const ids = [questions[0]!.id, questions[1]!.id].join(",");

    render(await TestsPage({ searchParams: Promise.resolve({ practice: "true", diagnostic: ids }) }));

    expect(screen.getByText("Pregunta 1 de 2")).toBeVisible();
  });
});
