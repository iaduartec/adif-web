import { describe, expect, it, vi } from "vitest";

import {
  assembleReviewBacklog,
  loadReviewBacklog,
  parsePlannedConceptSelection,
} from "../lib/adaptive/review-session";

const catalog = [
  { id: "concept-a", title: "Concepto A", lessonSlug: "lesson-a", claims: ["A auditada"] },
  { id: "concept-b", title: "Concepto B", lessonSlug: "lesson-b", claims: ["B auditada"] },
  { id: "concept-c", title: "Concepto C", lessonSlug: "lesson-c", claims: ["C auditada"] },
] as const;

describe("review backlog assembly", () => {
  it("keeps every active due or at-risk concept and orders by due date, risk, then id", () => {
    const backlog = assembleReviewBacklog({
      catalog,
      rows: [
        { concept_id: "concept-c", due_on: null, status: "at_risk" },
        { concept_id: "concept-b", due_on: "2026-08-10", status: "review" },
        { concept_id: "retired", due_on: "2026-08-01", status: "at_risk" },
        { concept_id: "concept-a", due_on: "2026-08-10", status: "at_risk" },
      ],
      today: "2026-08-11",
    });

    expect(backlog.map(({ id }) => id)).toEqual(["concept-a", "concept-b", "concept-c"]);
    expect(backlog[0]).toMatchObject({
      claims: ["A auditada"],
      lessonSlug: "lesson-a",
      status: "at_risk",
    });
  });

  it("excludes active concepts that are neither due nor at risk", () => {
    expect(assembleReviewBacklog({
      catalog,
      rows: [{ concept_id: "concept-a", due_on: "2026-08-12", status: "review" }],
      today: "2026-08-11",
    })).toEqual([]);
  });

  it("exhausts paginated owner rows before filtering the complete active backlog", async () => {
    const firstPage = Array.from({ length: 500 }, (_, index) => ({
      concept_id: `retired-${index}`,
      due_on: "2026-08-01",
      status: "at_risk",
    }));
    const range = vi.fn(async (from: number, to: number) => ({
      data: from === 0
        ? firstPage
        : [{ concept_id: "concept-a", due_on: "2026-08-10", status: "review" }],
      error: null,
      from,
      to,
    }));
    const query = {
      select: vi.fn(),
      eq: vi.fn(),
      order: vi.fn(),
      range,
    };
    query.select.mockReturnValue(query);
    query.eq.mockReturnValue(query);
    query.order.mockReturnValue(query);
    const supabase = { from: vi.fn(() => query) } as never;

    const result = await loadReviewBacklog(supabase, "user-1", new Date("2026-08-11T10:00:00Z"), catalog);

    expect(range.mock.calls).toEqual([[0, 499], [500, 999]]);
    expect(result.map(({ id }) => id)).toEqual(["concept-a"]);
  });
});

describe("planned review selection", () => {
  it("preserves a valid unique ordered concept list", () => {
    expect(parsePlannedConceptSelection("concept-b,concept-a", new Set(["concept-a", "concept-b"])))
      .toEqual({ kind: "valid", ids: ["concept-b", "concept-a"] });
  });

  it.each([
    ["repeated query keys", ["concept-a", "concept-b"]],
    ["empty segment", "concept-a,"],
    ["duplicate", "concept-a,concept-a"],
    ["not in backlog", "concept-a,concept-c"],
  ])("rejects the complete selection for %s", (_case, value) => {
    expect(parsePlannedConceptSelection(value, new Set(["concept-a", "concept-b"]))).toEqual({ kind: "invalid" });
  });
});
