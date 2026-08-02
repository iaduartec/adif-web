import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { updateSession } = vi.hoisted(() => ({ updateSession: vi.fn() }));

vi.mock("../lib/supabase/middleware", () => ({ updateSession }));

import { config, proxy } from "../proxy";

describe("proxy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("preserves refreshed session cookies when redirecting an anonymous visitor to login", async () => {
    const refreshedResponse = NextResponse.next();
    refreshedResponse.cookies.set("sb-access-token", "refreshed-token", { httpOnly: true });
    updateSession.mockResolvedValue({ response: refreshedResponse, user: null });

    const response = await proxy(new NextRequest("http://localhost/curso"));

    expect(response.headers.get("location")).toBe("http://localhost/login?next=%2Fcurso");
    expect(response.headers.get("set-cookie")).toContain("sb-access-token=refreshed-token");
  });

  it("keeps Next internals and every file extension outside the auth matcher", () => {
    const matcher = new RegExp(`^${config.matcher[0]}$`);

    expect(matcher.test("/_next/static/chunks/app.js")).toBe(false);
    expect(matcher.test("/fonts/rail.woff2")).toBe(false);
    expect(matcher.test("/materials/temario.pdf")).toBe(false);
    expect(matcher.test("/robots.txt")).toBe(false);
    expect(matcher.test("/images/logo.avif")).toBe(false);
    expect(matcher.test("/styles/app.css")).toBe(false);
    expect(matcher.test("/curso")).toBe(true);
  });
});
