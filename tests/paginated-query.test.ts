import { describe, expect, it, vi } from "vitest";

import { fetchPaginatedRows } from "../lib/supabase/paginated-query";

describe("fetchPaginatedRows", () => {
  it("reads every row in fixed 500-row PostgREST ranges until a short page", async () => {
    const firstPage = Array.from({ length: 500 }, (_, id) => ({ id }));
    const range = vi.fn(async (from: number, to: number) => ({
      data: from === 0 ? firstPage : [{ id: 500 }],
      error: null,
      from,
      to,
    }));

    const rows = await fetchPaginatedRows(() => ({ range }));

    expect(range.mock.calls).toEqual([[0, 499], [500, 999]]);
    expect(rows).toHaveLength(501);
    expect(rows[500]).toEqual({ id: 500 });
  });

  it("propagates a page error and does not continue with partial history", async () => {
    const databaseError = new Error("database detail that must stay server-side");
    const range = vi.fn(async (from: number) => ({
      data: from === 0 ? Array.from({ length: 500 }, (_, id) => ({ id })) : null,
      error: from === 0 ? null : databaseError,
    }));

    await expect(fetchPaginatedRows(() => ({ range }))).rejects.toBe(databaseError);
    expect(range).toHaveBeenCalledTimes(2);
  });
});
