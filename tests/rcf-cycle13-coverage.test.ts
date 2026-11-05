import { describe, expect, it } from "vitest";

import { lessonTheories } from "../content/lesson-theory";
import { officialItems } from "../content/syllabus";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";

const theory = lessonTheories["rcf-libro-1"];

function sectionLocator(number: number) {
  return new RegExp(`1\\.5\\.1\\.${number}(?!\\d)`);
}

describe("RCF Libro Primero, Capítulo 5 coverage (Ciclo 13)", () => {
  it("declares an exact source for each of the 23 articles of Chapter 5", () => {
    expect(theory).toBeDefined();
    for (let section = 1; section <= 23; section += 1) {
      const matches = theory.sources.filter((source) => sectionLocator(section).test(source.locator));
      expect(matches.length, `1.5.1.${section}`).toBeGreaterThan(0);
    }
  });

  it("teaches every Chapter 5 article through at least one claim backed by its source", () => {
    const claims = theory.concepts.flatMap((concept) => concept.claims);
    for (let section = 1; section <= 23; section += 1) {
      const sources = theory.sources.filter((source) => sectionLocator(section).test(source.locator));
      const taught = claims.some((claim) =>
        sources.some((source) => claim.legalBasis.includes(source.id)),
      );
      expect(taught, `1.5.1.${section}`).toBe(true);
    }
  });

  it("keeps the documentation split of 1.2.1.3 and 1.2.1.4 historically accurate", () => {
    const claim = theory.concepts
      .find((concept) => concept.id === "rcf-concept-16")
      ?.claims.find((candidate) => candidate.id === "rcf-c16-1");
    expect(claim?.text).toMatch(/Horarios de los trenes/i);
    expect(claim?.text).not.toMatch(/empresas ferroviarias[^.]*Horario/i);
    expect(claim?.text).toMatch(/Libro de Normas del Maquinista/i);
    expect(claim?.text).toMatch(/Libro de Itinerarios del Maquinista/i);
  });

  it("lists the complete blocking systems and the subsidiary role of the telephone block", () => {
    const claim = theory.concepts
      .find((concept) => concept.id === "rcf-concept-27")
      ?.claims.find((candidate) => candidate.id === "rcf-c27-1");
    expect(claim?.text).toMatch(/BLAU/);
    expect(claim?.text).toMatch(/BLAD/);
    expect(claim?.text).toMatch(/BLAB/);
    expect(claim?.text).toMatch(/BAU/);
    expect(claim?.text).toMatch(/BAD/);
    expect(claim?.text).toMatch(/BAB/);
    expect(claim?.text).toMatch(/BSL/);
    expect(claim?.text).toMatch(/BCA/);

    const subsidiary = theory.concepts
      .find((concept) => concept.id === "rcf-concept-27")
      ?.claims.find((candidate) => candidate.id === "rcf-c27-2");
    expect(subsidiary?.text).toMatch(/supletorio/i);
  });

  it("teaches the protection-speed table and the brake endurance limit", () => {
    const claims = theory.concepts.flatMap((concept) => concept.claims);
    const speeds = claims.find((claim) => claim.id === "rcf-c9-2")?.text ?? "";
    expect(speeds).toMatch(/350 km\/h/);
    expect(speeds).toMatch(/ERTMS Nivel 2/);
    expect(speeds).toMatch(/300 km\/h/);
    expect(speeds).toMatch(/220 km\/h/);
    expect(speeds).toMatch(/200 km\/h/);
    expect(speeds).toMatch(/ASFA/);

    const brake = claims.find((claim) => claim.id === "rcf-c33-2")?.text ?? "";
    expect(brake).toMatch(/120 minutos/);
  });

  it("teaches the duration and periodicity classes of stops", () => {
    const claims = theory.concepts
      .find((concept) => concept.id === "rcf-concept-10")
      ?.claims.map((claim) => claim.text)
      .join(" ");
    expect(claims).toMatch(/momentánea/i);
    expect(claims).toMatch(/ocasional/i);
    expect(claims).toMatch(/notificada/i);
  });

  it("teaches the train type letters and the material compatibility rule", () => {
    const claims = theory.concepts
      .find((concept) => concept.id === "rcf-concept-25")
      ?.claims.map((claim) => claim.text)
      .join(" ");
    expect(claims).toMatch(/0,65 m\/s²/);
    expect(claims).toMatch(/1,8 m\/s²/);
    expect(claims).toMatch(/tipo superior.*tipo inferior/i);
  });

  it("marks the Chapter 5 syllabus node as covered", () => {
    const node = officialItems
      .flatMap((item) => item.children)
      .find((child) => child.id === "rcf-capitulo-5");
    expect(node).toBeDefined();
    expect(node!.status).toBe("covered");
    expect(node!.materialSourceIds).toContain("RD 664/2015");
    expect(node!.linkedModules).toContain("rcf-libro-1");
  });

  it("adds original practice for every new Chapter 5 concept", () => {
    const questions = listOriginalPracticeQuestions({ domain: "telecom" }).filter(
      (question) => question.skill === "RCF" && question.status === "reviewed",
    );
    const coveredConcepts = new Set(questions.flatMap((question) => question.conceptIds));

    for (let concept = 18; concept <= 36; concept += 1) {
      expect(coveredConcepts.has(`rcf-concept-${concept}`), `rcf-concept-${concept}`).toBe(true);
    }

    const chapterFive = questions.filter((question) => question.topicId === "rcf-capitulo-5");
    expect(chapterFive.length).toBeGreaterThanOrEqual(28);
    const newItems = chapterFive.filter((question) => question.id >= "orig-tel-rcf-027");
    expect(newItems.length).toBeGreaterThanOrEqual(20);
    for (const question of newItems) {
      expect(question.sourceId, question.id).toBe("RD 664/2015");
      expect(question.sourceLocator, question.id).toMatch(/1\.5\.1\./);
    }
  });
});
