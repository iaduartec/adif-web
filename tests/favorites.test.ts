import { beforeEach, describe, expect, it, vi } from "vitest";

const { createServerClient, getOfficialQuestion, insert, maybeSingle, select } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  getOfficialQuestion: vi.fn(),
  insert: vi.fn(),
  maybeSingle: vi.fn(),
  select: vi.fn(),
}));

vi.mock("../lib/supabase/server", () => ({ createServerClient }));
vi.mock("../lib/content/repository", () => ({ getOfficialQuestion }));

import { toggleFavorite } from "../app/actions/favorites";

describe("toggleFavorite", () => {
  beforeEach(() => {
    createServerClient.mockReset();
    getOfficialQuestion.mockReset();
    insert.mockReset();
    select.mockReset();
    maybeSingle.mockReset();
    getOfficialQuestion.mockReturnValue({ id: "ADIF-2023-1433-Q01" });
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

  it("adds a valid official question favorite for the authenticated owner and returns its explicit state", async () => {
    await expect(toggleFavorite("ADIF-2023-1433-Q01")).resolves.toEqual({ isFavorite: true });

    expect(insert).toHaveBeenCalledWith({ user_id: "user-1", item_type: "question", item_id: "ADIF-2023-1433-Q01" });
  });

  it("rejects retired synthetic question identifiers", async () => {
    getOfficialQuestion.mockReturnValue(undefined);

    await expect(toggleFavorite("Q0001")).rejects.toThrow("La pregunta solicitada no existe");
    expect(createServerClient).not.toHaveBeenCalled();
  });

  it("fails without presenting a false success state when persistence fails", async () => {
    insert.mockResolvedValueOnce({ error: { message: "database unavailable" } });

    await expect(toggleFavorite("ADIF-2023-1433-Q01")).rejects.toThrow("No se ha podido actualizar el favorito");
  });
});
