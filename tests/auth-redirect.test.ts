import { describe, expect, it } from "vitest";
import { getSafeRedirectPath, resolveProtectedRoute } from "../lib/auth/redirect";

describe("resolveProtectedRoute", () => {
  it("sends an unauthenticated visitor back to login with the requested route", () => {
    expect(resolveProtectedRoute(null, "/curso")).toBe("/login?next=%2Fcurso");
  });

  it("allows an authenticated visitor through", () => {
    expect(resolveProtectedRoute({ id: "u1" }, "/curso", true)).toBeNull();
  });

  it("sends an authenticated user with incomplete onboarding to the intended dashboard route", () => {
    expect(resolveProtectedRoute({ id: "u1" }, "/curso?tema=rcf", false))
      .toBe("/onboarding?next=%2Fcurso%3Ftema%3Drcf");
  });

  it("never loops an incomplete user from onboarding back to onboarding", () => {
    expect(resolveProtectedRoute({ id: "u1" }, "/onboarding?next=%2Fcurso", false)).toBeNull();
  });

  it.each(["/login", "/auth/callback"])("never redirects the public auth route %s", (pathname) => {
    expect(resolveProtectedRoute(null, pathname)).toBeNull();
  });

  it("keeps a relative callback destination", () => {
    expect(getSafeRedirectPath("/curso?tema=senalizacion")).toBe("/curso?tema=senalizacion");
  });

  it.each(["//attacker.example", "https://attacker.example", "curso", "/\\attacker.example"])(
    "rejects an unsafe callback destination %s",
    (next) => {
      expect(getSafeRedirectPath(next)).toBeNull();
    },
  );
});
