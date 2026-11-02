import { describe, expect, it } from "vitest";
import general from "../content/original-practice/general-knowledge.json";

describe("DR cap. II practice", () => {
  const qs = (general as any[]).filter((q) => q.syllabusNodeId === "declaracion-red-capitulo-ii");
  it("has at least 3 questions", () => {
    expect(qs.length).toBeGreaterThanOrEqual(3);
  });
  it("each question has 4 options and a valid answer", () => {
    for (const q of qs) {
      expect(q.options).toHaveLength(4);
      expect(["A", "B", "C", "D"]).toContain(q.answer);
      expect(q.explanation).toBeTruthy();
    }
  });
});
