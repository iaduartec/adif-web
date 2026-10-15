import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import vitestConfig from "../vitest.config";

describe("repository hygiene", () => {
  it("excludes orphan worktree snapshots from Vitest discovery", () => {
    expect(vitestConfig.test.exclude).toContain("**/.worktrees/**");
    expect(vitestConfig.test.exclude).toContain("**/worktrees/**");
  });

  it("ignores the generated TypeScript incremental cache instead of tracking it", () => {
    const tracked = execFileSync("git", ["ls-files", "tsconfig.tsbuildinfo"], {
      cwd: process.cwd(),
      encoding: "utf8",
    }).trim();
    const ignored = execFileSync("git", ["check-ignore", "tsconfig.tsbuildinfo"], {
      cwd: process.cwd(),
      encoding: "utf8",
    }).trim();

    expect(tracked).toBe("");
    expect(ignored).toBe("tsconfig.tsbuildinfo");
  });
});
