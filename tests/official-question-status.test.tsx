import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createServerClient, rowsByTable, rpc } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  rowsByTable: { current: {} as Record<string, unknown[]> },
  rpc: vi.fn(),
}));

vi.mock("../lib/supabase/server", () => ({ createServerClient }));
vi.mock("../lib/content/official-question-validity", () => ({
  validateStoredHistoricalQuestionValidity: vi.fn(() => []),
}));

import { POST } from "../app/api/attempts/route";
import TestsPage from "../app/(dashboard)/tests/page";
import SimulacrosPage from "../app/(dashboard)/simulacros/page";
import {
  getOfficialExamRecord,
  getOfficialQuestion,
  getOfficialQuestionRecord,
  listOfficialQuestionRecords,
} from "../lib/content/repository";
import type { OfficialQuestion } from "../lib/content/schema";
import { isOfficialExamPracticeEligible } from "../lib/content/official-publication";

function createSupabaseDouble() {
  const from = vi.fn((table: string) => {
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
  });

  return {
    auth: { getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } } })) },
    from,
    rpc,
  };
}

function attemptRequest(body: unknown) {
  return new Request("http://localhost/api/attempts", {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
}

const approvedDecision = {
  status: "approved_for_publication" as const,
  evidenceValid: true,
  errors: [],
  review: {
    decisionId: "test-publication-review",
    decision: "approved" as const,
    permittedUse: "public_question_text" as const,
    reviewedAt: "2026-10-15",
    reviewerRole: "human_editor" as const,
    scope: {
      examIds: ["ADIF-2025-1131", "ADIF-2025-4104"],
      sections: ["specific" as const],
      content: "official_question_text" as const,
    },
    evidence: {
      sourceId: "test-rights-source",
      sourceVersion: "review-1",
      locator: "p. 2, resolution 5",
      basis: "documented_legal_review" as const,
    },
    rationale: "Unit-test review scope.",
  },
};

describe("official question source and validity status", () => {
  afterEach(cleanup);

  beforeEach(() => {
    rowsByTable.current = {};
    rpc.mockReset();
    createServerClient.mockResolvedValue(createSupabaseDouble());
  });

  it("shows the official year and review warning while withholding historical prompts", async () => {
    const withheld = listOfficialQuestionRecords()[0]!;
    render(await TestsPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getAllByText(`OFICIAL ADIF ${withheld.source.year}`).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/vigencia pendiente de revisión/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("alert")).toHaveTextContent(/fuentes y los derechos de uso/i);
    expect(screen.queryByText(withheld.prompt)).not.toBeInTheDocument();
    expect(screen.queryByText(withheld.options[0]!.text)).not.toBeInTheDocument();
  });

  it("does not let metadata search reveal a withheld prompt", async () => {
    const withheld = listOfficialQuestionRecords()[0]!;
    render(await TestsPage({ searchParams: Promise.resolve({ query: withheld.prompt }) }));

    expect(screen.getByText("0")).toBeVisible();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
    expect(screen.queryByText(withheld.prompt)).not.toBeInTheDocument();
  });

  it("shows the form's final tribunal citation without publishing the question text", async () => {
    render(await TestsPage({ searchParams: Promise.resolve({ year: "2024" }) }));

    expect(screen.getAllByText("OFICIAL ADIF 2024").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /resolución final del tribunal/i })[0]).toHaveAttribute(
      "href",
      expect.stringContaining("70febb4b-f8a2-de01-d00d-11feba2b6aa3"),
    );
    expect(screen.queryByText(getOfficialQuestionRecord("ADIF-2024-3403-Q01")!.prompt)).not.toBeInTheDocument();
  });

  it("returns 404 for a non-approved historical prompt and never calls the answer registry", async () => {
    expect(getOfficialQuestion("ADIF-2025-1131-Q01")).toBeUndefined();

    const response = await POST(attemptRequest({
      questionId: "ADIF-2025-1131-Q01",
      selectedAnswer: "A",
      elapsedMs: 500,
      clientEventId: "018f4c5e-7c2a-7d61-a85e-969efdde4dd5",
    }));

    expect(response.status).toBe(404);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("keeps the historical form shell and prior score visible while any item is withheld", async () => {
    rowsByTable.current.simulation_attempts = [{
      simulation_id: "ADIF-2025-1131",
      score: 12.5,
      correct_count: 14,
      incorrect_count: 3,
      omitted_count: 1,
      elapsed_ms: 500_000,
      created_at: "2026-10-15T12:00:00.000Z",
    }];

    render(await SimulacrosPage());

    expect(screen.getAllByRole("article")).toHaveLength(8);
    expect(screen.getByText(/formulario 1131/i)).toBeVisible();
    expect(screen.getByText("12.5")).toBeVisible();
    expect(screen.getAllByText(/texto retenido/i)).toHaveLength(8);
    expect(screen.queryByRole("link", { name: /abrir examen/i })).not.toBeInTheDocument();
  });

  it("allows a fully cleared legacy form and rejects a form with one changed item", () => {
    const exam = getOfficialExamRecord("ADIF-2025-1131")!;
    const questions = listOfficialQuestionRecords({ year: 2025, examCode: "1131" });
    const clearedQuestions = questions.map((question) => ({
      ...question,
      currentness: "current" as const,
      validity: "current" as const,
      validityReason: "Test fixture reconciled to the current syllabus.",
      publicationStatus: "approved_for_publication" as const,
      effectiveAnswer: question.initialAnswer,
    }));
    const clearedById = new Map(clearedQuestions.map((question) => [question.id, question]));

    expect(isOfficialExamPracticeEligible(exam, clearedById, approvedDecision)).toBe(true);
    expect(getOfficialExamRecord(exam.id)).toMatchObject({ id: exam.id, questionIds: exam.questionIds });
    expect(isOfficialExamPracticeEligible({
      ...exam,
      questionIds: exam.questionIds.slice(0, -1),
    }, clearedById, approvedDecision)).toBe(false);
    expect(isOfficialExamPracticeEligible({
      ...exam,
      questionIds: [...exam.questionIds, exam.questionIds[0]!],
    }, clearedById, approvedDecision)).toBe(false);
    expect(isOfficialExamPracticeEligible(exam, clearedById, {
      ...approvedDecision,
      review: {
        ...approvedDecision.review,
        scope: { ...approvedDecision.review.scope, sections: ["general"] },
      },
    })).toBe(false);
    expect(isOfficialExamPracticeEligible(exam, clearedById, {
      ...approvedDecision,
      review: { ...approvedDecision.review, decision: "pending" },
    })).toBe(false);

    const oneChanged = new Map<string, OfficialQuestion>(clearedById);
    const changedQuestion = clearedQuestions[0]!;
    oneChanged.set(changedQuestion.id, {
      ...changedQuestion,
      currentness: "changed",
      validity: "changed",
      validityReason: "The historic rule changed.",
    });
    expect(isOfficialExamPracticeEligible(exam, oneChanged, approvedDecision)).toBe(false);
  });
});
