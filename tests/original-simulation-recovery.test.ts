import { describe, expect, it } from "vitest";
import {
  ORIGINAL_SIMULATION_RECOVERY_KEY,
  clearOriginalSimulationRecovery,
  loadOriginalSimulationRecovery,
  parseOriginalSimulationRecoveryDraft,
  saveOriginalSimulationRecovery,
  serializeOriginalSimulationRecoveryDraft,
  type OriginalSimulationRecoveryDraft,
} from "../lib/content/original-simulation-recovery";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";
import { toPublicPracticeQuestion } from "../lib/content/original-practice-public-dto";

const questions = listOriginalPracticeQuestions({ domain: "telecom", status: "reviewed" })
  .slice(0, 2).map(toPublicPracticeQuestion).filter((item) => item !== null);
const draft: OriginalSimulationRecoveryDraft = {
  schemaVersion: 2,
  attemptId: "8d464b7d-9eb8-4fe8-8b2e-9f3f9c29a72f",
  domain: "telecom",
  startedAt: 1_000,
  questionIds: questions.map((question) => question.id),
  questionFingerprints: {},
  answers: { [questions[0]!.id]: "C" },
  currentIndex: 1,
  deadlineAt: 60_000,
  elapsedMsByQuestion: { [questions[0]!.id]: 12_000 },
  currentQuestionStartedAt: 20_000,
  clientEventIds: { [questions[0]!.id]: "fd249bb1-6308-4f46-8b2e-9f3f9c29a72f" },
  deliveryState: "in_progress",
};
const recoveryScope = "a1b2c3d4e5f60718293a4b5c";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  } as unknown as Storage;
}

describe("original simulation local recovery", () => {
  it("round-trips only answer-free in-progress state and the original question order", () => {
    const serialized = serializeOriginalSimulationRecoveryDraft(draft, questions);
    const parsed = parseOriginalSimulationRecoveryDraft(serialized, questions, 2_000);
    expect(parsed).toMatchObject({ status: "ready", draft: { ...draft, questionFingerprints: expect.any(Object) } });
    expect(serialized).not.toMatch(/correctAnswer|explanation|answerKey/i);
  });

  it("rejects corrupted, wrong-domain, unavailable, or changed question banks", () => {
    const serialized = serializeOriginalSimulationRecoveryDraft(draft, questions);
    const changedBank = questions.map((question, index) => index === 0 ? { ...question, prompt: `${question.prompt} editada` } : question);
    expect(parseOriginalSimulationRecoveryDraft("{", questions, 2_000).status).toBe("invalid");
    expect(parseOriginalSimulationRecoveryDraft(serialized, changedBank, 2_000).status).toBe("invalid");
    expect(parseOriginalSimulationRecoveryDraft(serialized, questions.slice(0, 1), 2_000).status).toBe("invalid");
    expect(parseOriginalSimulationRecoveryDraft(serialized, [], 2_000).status).toBe("invalid");
  });

  it("keeps an expired exam recoverable so it can be delivered immediately", () => {
    const serialized = serializeOriginalSimulationRecoveryDraft(draft, questions);
    expect(parseOriginalSimulationRecoveryDraft(serialized, questions, 60_000)).toMatchObject({
      status: "ready",
      remainingSeconds: 0,
    });
  });

  it("expires stale drafts by local retention without confusing that with the exam deadline", () => {
    const serialized = serializeOriginalSimulationRecoveryDraft(draft, questions);
    expect(parseOriginalSimulationRecoveryDraft(serialized, questions, 86_401_001).status).toBe("expired");
  });

  it("safely degrades when session storage is unavailable and clears stored drafts", () => {
    const storage = memoryStorage();
    expect(loadOriginalSimulationRecovery(storage, "telecom", recoveryScope, questions, 2_000).status).toBe("missing");
    expect(saveOriginalSimulationRecovery(storage, draft, recoveryScope, questions)).toBe(true);
    expect(loadOriginalSimulationRecovery(storage, "telecom", recoveryScope, questions, 2_000).status).toBe("ready");
    expect(loadOriginalSimulationRecovery(storage, "telecom", "000000000000000000000000", questions, 2_000).status).toBe("missing");
    clearOriginalSimulationRecovery(storage, "telecom", recoveryScope);
    expect(storage.getItem(`${ORIGINAL_SIMULATION_RECOVERY_KEY}:telecom:${recoveryScope}`)).toBeNull();

    const blocked = {
      getItem: () => { throw new DOMException("blocked", "SecurityError"); },
      setItem: () => { throw new DOMException("blocked", "SecurityError"); },
      removeItem: () => { throw new DOMException("blocked", "SecurityError"); },
    } as unknown as Storage;
    expect(saveOriginalSimulationRecovery(blocked, draft, recoveryScope, questions)).toBe(false);
    expect(loadOriginalSimulationRecovery(blocked, "telecom", recoveryScope, questions, 2_000).status).toBe("unavailable");
    expect(() => clearOriginalSimulationRecovery(blocked, "telecom", recoveryScope)).not.toThrow();
  });

  it("does not recover a pre-delivery payload containing solution material", () => {
    const withKey = JSON.parse(serializeOriginalSimulationRecoveryDraft(draft, questions)) as Record<string, unknown>;
    withKey.correctAnswer = "A";
    expect(parseOriginalSimulationRecoveryDraft(JSON.stringify(withKey), questions, 2_000).status).toBe("invalid");
  });

  it("rejects a delivered score that does not agree with its saved answers", () => {
    const delivered = serializeOriginalSimulationRecoveryDraft({
      ...draft,
      deliveryState: "delivered",
      corrections: draft.questionIds.map((questionId) => ({
        questionId,
        selectedAnswer: draft.answers[questionId] ?? null,
        correctAnswer: "C" as const,
        isCorrect: draft.answers[questionId] === "C",
        explanation: "Revisión local posterior a la entrega.",
      })),
    }, questions);
    const corrupted = JSON.parse(delivered) as { corrections: { isCorrect: boolean }[] };
    corrupted.corrections[0]!.isCorrect = false;
    expect(parseOriginalSimulationRecoveryDraft(JSON.stringify(corrupted), questions, 2_000).status).toBe("invalid");
  });
});
