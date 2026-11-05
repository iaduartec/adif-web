import { describe, expect, it } from "vitest";

import { lessonTheories } from "../content/lesson-theory";

describe("PRL chapter V: prevention delegate powers", () => {
  const theory = lessonTheories["prevencion-riesgos-laborales"]!;
  const claims = theory.concepts.flatMap((concept) => concept.claims);

  it("states that an employer must give reasons for rejecting proposed preventive measures", () => {
    const claim = claims.find((item) => item.id === "prl-c13-5");
    expect(claim?.legalBasis).toContain("lprl-31-1995-art36");
    expect(claim?.text).toMatch(/recabar.*medidas preventivas/i);
    expect(claim?.text).toMatch(/rechaza.*debe motivar/i);
  });

  it("distinguishes proposing stoppage from adopting it by majority only when urgent representation cannot meet", () => {
    const claim = claims.find((item) => item.id === "prl-c13-6");
    expect(claim?.legalBasis).toContain("lprl-31-1995-art36");
    expect(claim?.legalBasis).toContain("lprl-31-1995-art21");
    expect(claim?.text).toMatch(/riesgo grave e inminente/i);
    expect(claim?.text).toMatch(/no es posible reunir con la urgencia necesaria/i);
    expect(claim?.text).toMatch(/mayoría de los Delegados de Prevención/i);
    expect(claim?.text).toMatch(/no es una facultad individual/i);
  });
});
