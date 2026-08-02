import { describe, expect, it } from "vitest";

import { parseCourseCsv } from "../scripts/import-course-content";

const headers = ["id", "module", "stem", "A", "B", "C", "D", "answer", "comment", "source"] as const;

function csvRow(overrides: Partial<Record<(typeof headers)[number], string>> = {}) {
  const values = {
    id: "Q0001",
    module: "G1 Igualdad",
    stem: "Seleccione la respuesta correcta.",
    A: "Respuesta A",
    B: "Respuesta B",
    C: "Respuesta C",
    D: "Respuesta D",
    answer: "A",
    comment: "Explicación didáctica original.",
    source: "Referencia de estudio para verificar.",
    ...overrides,
  };

  return headers.map((header) => values[header]).join(",");
}

function csv(rows: string[]) {
  return [headers.join(","), ...rows].join("\n");
}

describe("course CSV importer failure contracts", () => {
  it("reports malformed CSV syntax", () => {
    expect(() => parseCourseCsv(`${headers.join(",")}\n"unterminated`, { expectedQuestionCount: 1 })).toThrow(
      /Malformed CSV/,
    );
  });

  it("reports duplicate stable IDs", () => {
    expect(() =>
      parseCourseCsv(csv([csvRow(), csvRow()]), { expectedQuestionCount: 2 }),
    ).toThrow(/duplicate question IDs: Q0001/);
  });

  it("reports reordered stable IDs", () => {
    expect(() =>
      parseCourseCsv(csv([csvRow({ id: "Q0002" })]), { expectedQuestionCount: 1 }),
    ).toThrow(/expected stable ID Q0001, received Q0002/);
  });

  it("reports missing required fields", () => {
    expect(() => parseCourseCsv(csv([csvRow({ stem: "" })]), { expectedQuestionCount: 1 })).toThrow(
      /stem is required/,
    );
  });

  it("reports invalid answers", () => {
    expect(() => parseCourseCsv(csv([csvRow({ answer: "E" })]), { expectedQuestionCount: 1 })).toThrow(
      /answer must be one of A, B, C, or D/,
    );
  });
});
