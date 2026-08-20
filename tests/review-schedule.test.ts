import { describe, expect, it } from "vitest";
import {
  applyReviewSchedule,
  madridDayKey,
  type ConceptMastery,
  type ReviewRating,
} from "../lib/adaptive/review-schedule";

const baseMastery: ConceptMastery = {
  status: "new",
  repetitions: 0,
  easeFactor: 2.5,
  intervalDays: 0,
  dueOn: null,
  lastReviewedAt: null,
  lastEvidenceAt: null,
  correctEvidence: 0,
  incorrectEvidence: 0,
};

describe("applyReviewSchedule", () => {
  it.each([
    { rating: 0 as ReviewRating, status: "at_risk", repetitions: 0, intervalDays: 1, dueOn: "2026-08-12" },
    { rating: 1 as ReviewRating, status: "learning", repetitions: 2, intervalDays: 2, dueOn: "2026-08-13" },
    { rating: 2 as ReviewRating, status: "review", repetitions: 3, intervalDays: 10, dueOn: "2026-08-21" },
    { rating: 3 as ReviewRating, status: "review", repetitions: 3, intervalDays: 13, dueOn: "2026-08-24" },
  ])("applies the explicit recall schedule for rating $rating", ({ rating, status, repetitions, intervalDays, dueOn }) => {
    const result = applyReviewSchedule(
      { ...baseMastery, status: "review", repetitions: 2, intervalDays: 5 },
      { kind: "recall", rating, occurredAt: "2026-08-11T20:30:00.000Z", conceptActive: true },
      "2026-08-11",
    );

    expect(result).toMatchObject({ status, repetitions, intervalDays, dueOn });
  });

  it.each([
    { rating: 2 as ReviewRating, intervalDays: 3 },
    { rating: 3 as ReviewRating, intervalDays: 7 },
  ])("uses the initial interval for a first successful rating $rating", ({ rating, intervalDays }) => {
    expect(applyReviewSchedule(
      baseMastery,
      { kind: "recall", rating, occurredAt: "2026-08-11T10:00:00.000Z", conceptActive: true },
      "2026-08-11",
    )).toMatchObject({ repetitions: 1, intervalDays });
  });

  it("caps repeated intervals at 60 days", () => {
    expect(applyReviewSchedule(
      { ...baseMastery, status: "review", repetitions: 7, intervalDays: 40 },
      { kind: "recall", rating: 3, occurredAt: "2026-08-11T10:00:00.000Z", conceptActive: true },
      "2026-08-11",
    )).toMatchObject({ repetitions: 8, intervalDays: 60, dueOn: "2026-10-10", status: "consolidated" });
  });

  it("consolidates only after three repetitions and a fourteen-day interval", () => {
    const belowInterval = applyReviewSchedule(
      { ...baseMastery, status: "review", repetitions: 2, intervalDays: 6 },
      { kind: "recall", rating: 2, occurredAt: "2026-08-11T10:00:00.000Z", conceptActive: true },
      "2026-08-11",
    );
    const consolidated = applyReviewSchedule(
      { ...baseMastery, status: "review", repetitions: 2, intervalDays: 7 },
      { kind: "recall", rating: 2, occurredAt: "2026-08-11T10:00:00.000Z", conceptActive: true },
      "2026-08-11",
    );

    expect(belowInterval?.status).toBe("review");
    expect(consolidated).toMatchObject({ status: "consolidated", repetitions: 3, intervalDays: 14 });
  });

  it("treats an incorrect question as rating zero evidence", () => {
    expect(applyReviewSchedule(
      { ...baseMastery, status: "consolidated", repetitions: 5, intervalDays: 30, incorrectEvidence: 2 },
      {
        kind: "question",
        questionId: "ADIF-2025-1131-Q01",
        isCorrect: false,
        occurredAt: "2026-08-11T10:00:00.000Z",
        conceptActive: true,
      },
      "2026-08-11",
    )).toMatchObject({
      status: "at_risk",
      repetitions: 0,
      intervalDays: 1,
      dueOn: "2026-08-12",
      incorrectEvidence: 3,
    });
  });

  it.each(["new", "learning", "at_risk"] as const)(
    "uses correct question evidence as a lower-weight learning signal from %s",
    (status) => {
      expect(applyReviewSchedule(
        { ...baseMastery, status, repetitions: 2, intervalDays: 10, dueOn: "2026-08-30" },
        {
          kind: "question",
          questionId: "ADIF-2025-1131-Q01",
          isCorrect: true,
          occurredAt: "2026-08-11T10:00:00.000Z",
          conceptActive: true,
        },
        "2026-08-11",
      )).toMatchObject({
        status: "learning",
        repetitions: 2,
        intervalDays: 10,
        dueOn: "2026-08-13",
        correctEvidence: 1,
      });
    },
  );

  it.each(["review", "consolidated"] as const)("preserves %s after a correct question", (status) => {
    expect(applyReviewSchedule(
      { ...baseMastery, status, repetitions: 4, intervalDays: 20, dueOn: "2026-08-12" },
      {
        kind: "question",
        questionId: "ADIF-2025-1131-Q01",
        isCorrect: true,
        occurredAt: "2026-08-11T10:00:00.000Z",
        conceptActive: true,
      },
      "2026-08-11",
    )).toMatchObject({ status, repetitions: 4, intervalDays: 20, dueOn: "2026-08-12" });
  });

  it("suppresses the same question and concept inside the preceding 24 hours", () => {
    expect(applyReviewSchedule(
      baseMastery,
      {
        kind: "question",
        questionId: "ADIF-2025-1131-Q01",
        isCorrect: true,
        occurredAt: "2026-08-11T09:59:59.000Z",
        previousMatchingOccurredAt: "2026-08-10T10:00:00.000Z",
        conceptActive: true,
      },
      "2026-08-11",
    )).toBeNull();

    expect(applyReviewSchedule(
      baseMastery,
      {
        kind: "question",
        questionId: "ADIF-2025-1131-Q01",
        isCorrect: true,
        occurredAt: "2026-08-11T10:00:00.000Z",
        previousMatchingOccurredAt: "2026-08-10T10:00:00.000Z",
        conceptActive: true,
      },
      "2026-08-11",
    )).not.toBeNull();
  });

  it("ignores evidence for a retired concept", () => {
    expect(applyReviewSchedule(
      baseMastery,
      { kind: "recall", rating: 3, occurredAt: "2026-08-11T10:00:00.000Z", conceptActive: false },
      "2026-08-11",
    )).toBeNull();
  });

  it("uses Europe/Madrid day keys across UTC and daylight-saving boundaries", () => {
    expect(madridDayKey("2026-08-10T22:30:00.000Z")).toBe("2026-08-11");
    expect(madridDayKey("2026-03-29T00:30:00.000Z")).toBe("2026-03-29");
    expect(applyReviewSchedule(
      baseMastery,
      { kind: "recall", rating: 0, occurredAt: "2026-03-29T00:30:00.000Z", conceptActive: true },
      "2026-03-29",
    )?.dueOn).toBe("2026-03-30");
  });
});
