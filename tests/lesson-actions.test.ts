import { beforeEach, describe, expect, it, vi } from "vitest";

const { createServerClient, getLesson, upsert } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  getLesson: vi.fn(),
  upsert: vi.fn(),
}));

vi.mock("../lib/supabase/server", () => ({ createServerClient }));
vi.mock("../lib/content/repository", () => ({ getLesson }));

import { saveLessonProgress, saveNote } from "../app/actions/lesson";

describe("lesson server actions", () => {
  beforeEach(() => {
    upsert.mockReset();
    getLesson.mockReturnValue({ slug: "igualdad" });
    upsert.mockResolvedValue({ error: null });
    createServerClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }) },
      from: vi.fn(() => ({ upsert })),
    });
  });

  it("rejects unauthenticated completion attempts before writing personal progress", async () => {
    createServerClient.mockResolvedValueOnce({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      from: vi.fn(),
    });

    await expect(saveLessonProgress("igualdad", 100)).rejects.toThrow("Debes iniciar sesión");
    expect(upsert).not.toHaveBeenCalled();
  });

  it("upserts a completed progress record under the authenticated owner", async () => {
    await expect(saveLessonProgress("igualdad", 100)).resolves.toEqual({ ok: true });

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "user-1",
        lesson_id: "igualdad",
        percent: 100,
        completed: true,
      }),
      { onConflict: "user_id,lesson_id" },
    );
  });

  it("trims a note before persisting it for the authenticated owner", async () => {
    await expect(saveNote("igualdad", "  Recordar el artículo 14.  ")).resolves.toEqual({ ok: true });

    expect(upsert).toHaveBeenCalledWith(
      { user_id: "user-1", lesson_id: "igualdad", body: "Recordar el artículo 14." },
      { onConflict: "user_id,lesson_id" },
    );
  });

  it("rejects non-integer progress and empty notes", async () => {
    await expect(saveLessonProgress("igualdad", 25.5)).rejects.toThrow("entero");
    await expect(saveNote("igualdad", "   ")).rejects.toThrow("entre 1 y 5000");
    expect(upsert).not.toHaveBeenCalled();
  });
});
