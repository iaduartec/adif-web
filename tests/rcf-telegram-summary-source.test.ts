import { describe, expect, it } from "vitest";

import { rcfLibro1Summary } from "../content/summaries/rcf-libro-1";

describe("RCF summary telegram definition", () => {
  it("uses the fields stated by the official definition without adding annual numbering or a receiver", () => {
    const fact = rcfLibro1Summary.keyFacts.find((entry) => entry.startsWith("Telefonema:"));

    expect(fact).toBeDefined();
    expect(fact).toMatch(/número secuencial/i);
    expect(fact).toMatch(/hora de transmisión/i);
    expect(fact).toMatch(/identificación del emisor/i);
    expect(fact).not.toMatch(/anual|receptor/i);
  });
});
