import { beforeEach, describe, expect, it, vi } from "vitest";

const { createServerClient, getUser, rpc, maybeSingle } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  getUser: vi.fn(),
  rpc: vi.fn(),
  maybeSingle: vi.fn(),
}));

vi.mock("../lib/supabase/server", () => ({ createServerClient }));

import { recordRecallReview } from "../app/actions/reviews";
import { activeTheoryConceptRegistry } from "../content/theory-concepts";

const conceptId = activeTheoryConceptRegistry.keys().next().value!;
const eventId = "8d464b7d-9eb8-4fe8-8b2e-9f3f9c29a72f";

describe("recall review action", () => {
  beforeEach(() => {
    getUser.mockReset().mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
    rpc.mockReset().mockResolvedValue({ data: true, error: null });
    maybeSingle.mockReset().mockResolvedValue({
      data: { due_on: "2026-08-18", status: "review" },
      error: null,
    });
    const query = { select: vi.fn(), eq: vi.fn(), maybeSingle };
    query.select.mockReturnValue(query);
    query.eq.mockReturnValue(query);
    createServerClient.mockResolvedValue({ auth: { getUser }, rpc, from: vi.fn(() => query) });
  });

  it("authenticates, records the exact concept and stable event, and returns persisted feedback", async () => {
    await expect(recordRecallReview(conceptId, 2, eventId)).resolves.toEqual({
      kind: "saved",
      dueOn: "2026-08-18",
      status: "review",
    });
    expect(rpc).toHaveBeenCalledWith("record_recall_review", {
      p_client_event_id: eventId,
      p_concept_id: conceptId,
      p_rating: 2,
    });
  });

  it("classifies an unknown RPC outcome as retryable without changing the payload", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { code: "08006", message: "connection lost" } });
    await expect(recordRecallReview(conceptId, 1, eventId)).resolves.toEqual({ kind: "retryable" });
  });

  it("classifies definitive validation rejection so the rating may be attempted again", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { code: "23514", message: "invalid" } });
    await expect(recordRecallReview(conceptId, 3, eventId)).resolves.toEqual({ kind: "rejected" });
  });

  it("rejects malformed, inactive, or unauthenticated input before the RPC", async () => {
    await expect(recordRecallReview("retired", 2, eventId)).resolves.toEqual({ kind: "rejected" });
    await expect(recordRecallReview(conceptId, 4 as never, eventId)).resolves.toEqual({ kind: "rejected" });
    getUser.mockResolvedValueOnce({ data: { user: null }, error: null });
    await expect(recordRecallReview(conceptId, 2, eventId)).resolves.toEqual({ kind: "unauthenticated" });
    expect(rpc).not.toHaveBeenCalled();
  });
});
