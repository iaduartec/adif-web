import { describe, expect, it } from "vitest";

import { importCourseContent } from "../scripts/import-course-content";

describe("retired synthetic course importer", () => {
  it("directs maintainers to the verified official importer", async () => {
    await expect(importCourseContent()).rejects.toThrow(/pnpm content:import-official/);
  });
});
