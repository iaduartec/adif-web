import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { codigoConductaTheory } from "../content/theories/codigo-conducta";
import { flashcards } from "../content/flashcards";
import { getSyllabusCoverage, syllabusItems } from "../content/syllabus";
import generalKnowledge from "../content/original-practice/general-knowledge.json";
import type { TheoryClaim } from "../content/theory-types";

/**
 * Syllabus node `ebep-capitulo-vi-titulo-iii` was `partial` because its coverage
 * review and its check against the consolidated TREBEP were both outstanding.
 * The official chapter VI attached to the call (PNI26-COMMON-05) and the BOE
 * consolidated PDF downloaded on 2026-11-04 are verbatim identical over arts.
 * 52-54 (5,766 normalised chars), and the theory covers all 15 principles of
 * art. 52, all 12 rules of art. 53 and all 11 rules of art. 54. These tests
 * keep that claim honest.
 */

const OFFICIAL_TEXT_PATH =
  "pdf/txt/5. Ley 5_2015 del Estatuto Basico del Empleado Publico. Capitulo VI (Tit. III) Deberes de los empleados publicos. Codigo de conducta.txt";

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

const officialRaw = readFileSync(resolve(process.cwd(), OFFICIAL_TEXT_PATH), "utf8");
const official = officialRaw
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(
    (line) =>
      !/^(BOLETÍN OFICIAL DEL ESTADO|LEGISLACIÓN CONSOLIDADA|Página \d+)$/.test(line),
  )
  .join(" ");
const officialText = normalize(official);

const sources = new Map((codigoConductaTheory.sources ?? []).map((source) => [source.id, source]));

const learnerClaims: TheoryClaim[] = [
  ...codigoConductaTheory.introduction,
  ...codigoConductaTheory.concepts.flatMap((concept) => concept.claims),
  ...codigoConductaTheory.examples.flatMap((example) => example.application),
  ...codigoConductaTheory.reviewTakeaways,
];
const learnerText = normalize(learnerClaims.map((claim) => claim.text).join(" "));

const PRINCIPLES_52 = [
  "objetividad",
  "integridad",
  "neutralidad",
  "responsabilidad",
  "imparcialidad",
  "confidencialidad",
  "dedicación al servicio público",
  "transparencia",
  "ejemplaridad",
  "austeridad",
  "accesibilidad",
  "eficacia",
  "honradez",
  "promoción del entorno cultural y medioambiental",
  "respeto a la igualdad entre mujeres y hombres",
];

const RULES_53: Array<[number, string]> = [
  [1, "ordenamiento jurídico"],
  [2, "interés común"],
  [3, "lealtad y buena fe"],
  [4, "derechos fundamentales"],
  [5, "interés personal"],
  [6, "obligaciones económicas"],
  [7, "tratos de favor"],
  [8, "economía y eficiencia"],
  [9, "agilización"],
  [10, "resolver en plazo"],
  [11, "dedicación al servicio público"],
  [12, "materias clasificadas"],
];

const RULES_54: Array<[number, string]> = [
  [1, "trato respetuoso"],
  [2, "jornada"],
  [3, "infracción manifiesta"],
  [4, "informar a los ciudadanos"],
  [5, "austeridad"],
  [6, "regalo"],
  [7, "constancia y permanencia"],
  [8, "formación"],
  [9, "seguridad y salud laboral"],
  [10, "propuestas"],
  [11, "lengua"],
];

describe("TREBEP chapter VI: literal fidelity to the official consolidated text", () => {
  it("keeps every fragment of the three article excerpts literal", () => {
    const excerptIds = ["rdleg-5-2015-art52", "rdleg-5-2015-art53", "rdleg-5-2015-art54"];
    let checked = 0;
    for (const id of excerptIds) {
      const excerpt = sources.get(id)?.excerpt;
      expect(excerpt, `${id} must keep its literal excerpt`).toBeTruthy();
      for (const fragment of (excerpt ?? "").split(/\[…\]|…|\.\.\./)) {
        const normalized = normalize(fragment);
        if (normalized.length < 25) continue;
        checked += 1;
        expect(officialText, `${id}: ${normalized.slice(0, 60)}…`).toContain(normalized);
      }
    }
    expect(checked).toBeGreaterThanOrEqual(9);
  });

  it("finds the 12 ethical rules and the 11 conduct rules in the official attached text", () => {
    const start52 = officialText.lastIndexOf("artículo 52. deberes de los empleados públicos");
    const start53 = officialText.indexOf("artículo 53. principios éticos.", start52);
    const start54 = officialText.indexOf("artículo 54. principios de conducta.", start53);
    const end54 =
      officialText.indexOf("siempre que sea oficial en el territorio.", start54) +
      "siempre que sea oficial en el territorio.".length;
    expect(start52).toBeGreaterThanOrEqual(0);
    expect(start53).toBeGreaterThan(start52);
    expect(start54).toBeGreaterThan(start53);
    expect(end54).toBeGreaterThan(start54);

    // Skip the "Artículo 53./54." heading itself, which also looks like a number.
    const body53 = start53 + "artículo 53. principios éticos.".length;
    const body54 = start54 + "artículo 54. principios de conducta.".length;
    const countRules = (block: string) =>
      [...block.matchAll(/\s(\d{1,2})\.\s+(?=[a-záéíóúñ])/g)].map((match) => Number(match[1]));
    expect(countRules(officialText.slice(body53, start54))).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
    expect(countRules(officialText.slice(body54, end54))).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    ]);

    expect(learnerText).toContain("quince principios");
    expect(learnerText).toContain("doce principios éticos");
    expect(learnerText).toContain("once principios de conducta");
  });
});

describe("TREBEP chapter VI: learner-facing coverage", () => {
  it("names all fifteen principles of article 52", () => {
    for (const principle of PRINCIPLES_52) {
      expect(learnerText, `art. 52 principle '${principle}'`).toContain(principle);
    }
    expect(PRINCIPLES_52).toHaveLength(15);
  });

  it("covers all twelve numbered rules of article 53", () => {
    for (const [number, marker] of RULES_53) {
      expect(learnerText, `art. 53.${number} marker '${marker}'`).toContain(marker);
    }
  });

  it("covers all eleven numbered rules of article 54", () => {
    for (const [number, marker] of RULES_54) {
      expect(learnerText, `art. 54.${number} marker '${marker}'`).toContain(marker);
    }
  });

  it("links examples, original practice and flashcards to the module", () => {
    expect(codigoConductaTheory.examples.length).toBeGreaterThanOrEqual(2);
    const practice = generalKnowledge as Array<{ prompt?: string; sourceId?: string }>;
    const trebepQuestions = practice.filter(
      (question) => question.sourceId === "TREBEP" && question.prompt?.includes("TREBEP"),
    );
    expect(trebepQuestions.length).toBeGreaterThanOrEqual(2);
    expect(flashcards.some((card) => /artículo 52 del TREBEP/i.test(card.front))).toBe(true);
  });
});

describe("TREBEP chapter VI: syllabus status", () => {
  it("is marked covered with an explicit consolidated-version rationale", () => {
    const node = syllabusItems
      .find((item) => item.id === "syllabus-codigo-conducta")
      ?.children.find((child) => child.id === "ebep-capitulo-vi-titulo-iii");
    expect(node?.status).toBe("covered");
    expect(node?.rationale).toMatch(/consolidad/i);
    expect(node?.linkedModules).toContain("codigo-conducta");
    expect(node?.materialSourceIds).toContain("TREBEP");
    expect(getSyllabusCoverage().covered).toBeGreaterThanOrEqual(6);
  });
});
