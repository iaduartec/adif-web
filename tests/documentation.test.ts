import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("official-only documentation", () => {
  it("documents the official exam bank and retires synthetic-course claims", async () => {
    const readme = await readFile(resolve(process.cwd(), "README.md"), "utf8");

    expect(readme).toContain("Preguntas oficiales");
    expect(readme).toContain("Exámenes oficiales");
    expect(readme).toContain("content:import-official");
    expect(readme).not.toContain("4.500 preguntas");
    expect(readme).not.toContain("30 simulacros");
    expect(readme).not.toContain("preguntas comentadas");
  });
});
