import { describe, expect, it } from "vitest";
import {
  parseOriginalSimulationRecoveryDraft,
  serializeOriginalSimulationRecoveryDraft,
  type OriginalSimulationRecoveryDraft,
} from "../lib/content/original-simulation-recovery-proposal";

const draft: OriginalSimulationRecoveryDraft = {
  schemaVersion: 1,
  attemptId: "8d464b7d-9eb8-4fe8-8b2e-9f3f9c29a72f",
  domain: "telecom",
  createdAt: 1_000,
  questionIds: ["orig-tel-ict-001", "orig-tel-ict-002"],
  answers: { "orig-tel-ict-001": "C" },
  currentIndex: 1,
  deadlineAt: 60_000,
  clientEventIds: { "orig-tel-ict-001": "fd249bb1-6308-4f46-8b2e-9f3f9c29a72f" },
};

describe("isolated simulation recovery proposal", () => {
  it("round-trips a minimal in-progress draft without keys or explanations", () => {
    const serialized = serializeOriginalSimulationRecoveryDraft(draft);
    expect(serialized).not.toMatch(/correctAnswer|explanation|answerKey/i);
    expect(parseOriginalSimulationRecoveryDraft(serialized, 2_000)).toEqual({ status: "ready", draft });
  });

  it("rejects a payload that tries to include answer keys or unknown question IDs", () => {
    const withLeakedKey = JSON.stringify({ ...draft, correctAnswer: "A" });
    const withUnknownAnswer = JSON.stringify({ ...draft, answers: { "orig-official-001": "A" } });

    expect(parseOriginalSimulationRecoveryDraft(withLeakedKey, 2_000).status).toBe("invalid");
    expect(parseOriginalSimulationRecoveryDraft(withUnknownAnswer, 2_000).status).toBe("invalid");
  });

  it("marks a draft expired by its exam deadline or local retention window", () => {
    expect(parseOriginalSimulationRecoveryDraft(serializeOriginalSimulationRecoveryDraft(draft), 60_000).status)
      .toBe("expired");
    expect(parseOriginalSimulationRecoveryDraft(serializeOriginalSimulationRecoveryDraft(draft), 86_401_001).status)
      .toBe("expired");
  });
});
