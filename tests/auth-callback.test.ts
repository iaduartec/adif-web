import { beforeEach, describe, expect, it, vi } from "vitest";

const { createServerClient, exchangeCodeForSession } = vi.hoisted(() => {
  const exchangeCodeForSession = vi.fn();

  return {
    exchangeCodeForSession,
    createServerClient: vi.fn(async () => ({ auth: { exchangeCodeForSession } })),
  };
});

vi.mock("../lib/supabase/server", () => ({ createServerClient }));

import { GET } from "../app/auth/callback/route";

describe("GET /auth/callback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    exchangeCodeForSession.mockResolvedValue({ error: null });
  });

  it("exchanges the code and redirects to a safe requested path", async () => {
    const response = await GET(new Request("http://localhost/auth/callback?code=oauth-code&next=%2Fcurso"));

    expect(response.headers.get("location")).toBe("http://localhost/curso");
    expect(exchangeCodeForSession).toHaveBeenCalledWith("oauth-code");
  });

  it("rejects an external next destination", async () => {
    const response = await GET(
      new Request("http://localhost/auth/callback?code=oauth-code&next=https%3A%2F%2Fattacker.example"),
    );

    expect(response.headers.get("location")).toBe("http://localhost/");
  });
});
