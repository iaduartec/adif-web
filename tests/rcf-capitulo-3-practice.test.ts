import { describe, expect, it } from "vitest";
import telecom from "../content/original-practice/telecom.json";

describe("RCF cap. 3 practice", () => {
  const qs = (telecom as any[]).filter((q) => q.syllabusNodeId === "rcf-capitulo-3");
  it("has at least 4 questions", () => {
    expect(qs.length).toBeGreaterThanOrEqual(4);
  });
  it("each question has 4 options and a valid answer", () => {
    for (const q of qs) {
      expect(q.options).toHaveLength(4);
      expect(["A", "B", "C", "D"]).toContain(q.answer);
      expect(q.explanation).toBeTruthy();
      expect(q.sourceLocator).toMatch(/1\.3\.1\./);
    }
  });
  it("covers both articles", () => {
    const locs = qs.map((q) => q.sourceLocator);
    expect(locs.some((l) => /1\.3\.1\.1/.test(l))).toBe(true);
    expect(locs.some((l) => /1\.3\.1\.2/.test(l))).toBe(true);
  });
});
