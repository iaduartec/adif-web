import { beforeEach, describe, expect, it, vi } from "vitest";

const { createServerClient, getOfficialQuestion, getQuestion, insert, maybeSingle, select } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  getOfficialQuestion: vi.fn(),
  getQuestion: vi.fn(),
  insert: vi.fn(),
  maybeSingle: vi.fn(),
  select: vi.fn(),
}));

vi.mock("../lib/supabase/server", () => ({ createServerClient }));
vi.mock("../lib/content/repository", () => ({ getOfficialQuestion, getQuestion }));

import { toggleFavorite } from "../app/actions/favorites";

describe("toggleFavorite", () => {
  beforeEach(() => {
    getQuestion.mockReset();
    getOfficialQuestion.mockReset();
    insert.mockReset();
    select.mockReset();
    maybeSingle.mockReset();
    getQuestion.mockReturnValue({ id: "Q0001" });
    getOfficialQuestion.mockReturnValue(undefined);
    maybeSingle.mockResolvedValue({ data: null, error: null });
    select.mockReturnValue({
      eq: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({ maybeSingle })),
        })),
      })),
    });
    insert.mockResolvedValue({ error: null });
    createServerClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }) },
      from: vi.fn(() => ({ select, insert })),
    });
  });

  it("adds a valid question favorite for the authenticated owner and returns its explicit state", async () => {
    await expect(toggleFavorite("Q0001")).resolves.toEqual({ isFavorite: true });

    expect(insert).toHaveBeenCalledWith({ user_id: "user-1", item_type: "question", item_id: "Q0001" });
  });

  it("accepts an active official-question identifier", async () => {
    getOfficialQuestion.mockReturnValue({ id: "ADIF-2023-1433-Q01" });

    await expect(toggleFavorite("ADIF-2023-1433-Q01")).resolves.toEqual({ isFavorite: true });

    expect(insert).toHaveBeenCalledWith({
      user_id: "user-1",
      item_type: "question",
      item_id: "ADIF-2023-1433-Q01",
    });
  });

  it("fails without presenting a false success state when persistence fails", async () => {
    insert.mockResolvedValueOnce({ error: { message: "database unavailable" } });

    await expect(toggleFavorite("Q0001")).rejects.toThrow("No se ha podido actualizar el favorito");
  });
});
