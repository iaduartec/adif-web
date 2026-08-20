import { describe, expect, it } from "vitest";

import { deriveErrorNotebook } from "../lib/practice/error-notebook";
import type { OfficialQuestion } from "../lib/content/schema";

const questions: OfficialQuestion[] = [
  {
    id: "ADIF-2025-1131-Q01", sectionLabel: "Conocimiento Específico", prompt: "Primera pregunta", conceptIds: ["ict-concept-1"], options: [{ key: "A", text: "A" }, { key: "B", text: "B" }, { key: "C", text: "C" }, { key: "D", text: "D" }], answer: "A", origin: "official_reference", source: { kind: "official_adif_exam", year: 2025, call: "PNI25/01", profileCode: "25/10PO", profileName: "Oficial de Telecomunicaciones de Entrada", examCode: "1131", questionNumber: 1, section: "specific", isReserve: false, documentUrl: "https://www.adif.es/examen.pdf", bookletPage: 1, answerKeyPage: 1, verifiedAt: "2026-08-10", fingerprint: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" },
  },
  {
    id: "ADIF-2025-1131-Q02", sectionLabel: "Conocimiento Específico", prompt: "Segunda pregunta", conceptIds: ["ict-concept-1"], options: [{ key: "A", text: "A" }, { key: "B", text: "B" }, { key: "C", text: "C" }, { key: "D", text: "D" }], answer: "B", origin: "official_reference", source: { kind: "official_adif_exam", year: 2025, call: "PNI25/01", profileCode: "25/10PO", profileName: "Oficial de Telecomunicaciones de Entrada", examCode: "1131", questionNumber: 2, section: "specific", isReserve: false, documentUrl: "https://www.adif.es/examen.pdf", bookletPage: 1, answerKeyPage: 1, verifiedAt: "2026-08-10", fingerprint: "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" },
  },
];

describe("deriveErrorNotebook", () => {
  it("keeps only questions whose latest attempt is incorrect and joins their static content", () => {
    const items = deriveErrorNotebook(questions, [
      { question_id: "ADIF-2025-1131-Q01", is_correct: false, created_at: "2026-08-01T09:00:00.000Z" },
      { question_id: "ADIF-2025-1131-Q02", is_correct: false, created_at: "2026-08-01T10:00:00.000Z" },
      { question_id: "ADIF-2025-1131-Q01", is_correct: true, created_at: "2026-08-01T11:00:00.000Z" },
    ]);

    expect(items).toEqual([
      expect.objectContaining({ id: "ADIF-2025-1131-Q02", prompt: "Segunda pregunta", sectionLabel: "Conocimiento Específico" }),
    ]);
  });

  it("restores a question to the notebook when the latest attempt is wrong again", () => {
    const items = deriveErrorNotebook(questions, [
      { question_id: "ADIF-2025-1131-Q01", is_correct: false, created_at: "2026-08-01T09:00:00.000Z" },
      { question_id: "ADIF-2025-1131-Q01", is_correct: true, created_at: "2026-08-01T10:00:00.000Z" },
      { question_id: "ADIF-2025-1131-Q01", is_correct: false, created_at: "2026-08-01T11:00:00.000Z" },
    ]);

    expect(items).toEqual([
      expect.objectContaining({ id: "ADIF-2025-1131-Q01", prompt: "Primera pregunta", sectionLabel: "Conocimiento Específico" }),
    ]);
  });

  it("drops retired question IDs because they cannot join the active official bank", () => {
    const items = deriveErrorNotebook(questions, [
      { question_id: "Q0001", is_correct: false, created_at: "2026-08-01T09:00:00.000Z" },
      { question_id: "ADIF-2025-1131-Q01", is_correct: false, created_at: "2026-08-01T10:00:00.000Z" },
    ]);

    expect(items.map((item) => item.id)).toEqual(["ADIF-2025-1131-Q01"]);
  });
});
