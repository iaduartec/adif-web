import { describe, expect, it } from "vitest";

import { codigoConductaTheory } from "../content/theories/codigo-conducta";

const sources = new Map((codigoConductaTheory.sources ?? []).map((source) => [source.id, source]));

/**
 * These excerpts are presented as literal quotations of the consolidated TREBEP
 * (BOE-A-2015-11719). A quote that stops mid-sentence and closes with a full stop
 * silently deletes the operative clause: 53.12 lost the ban on using the
 * information, and 54.3 lost the duty to report to the inspection bodies.
 */
describe("TREBEP excerpts are quoted without dropping operative clauses", () => {
  it("keeps article 53.12 complete, including the prohibition on using the information", () => {
    const excerpt = sources.get("rdleg-5-2015-art53")?.excerpt ?? "";
    expect(excerpt).toContain("1. Los empleados públicos respetarán la Constitución");
    expect(excerpt).toContain(
      "sin que puedan hacer uso de la información obtenida para beneficio propio o de terceros, o en perjuicio del interés público"
    );
  });

  it("keeps article 54.3 complete and the conservation duty of 54.5", () => {
    const excerpt = sources.get("rdleg-5-2015-art54")?.excerpt ?? "";
    expect(excerpt).toContain(
      "en cuyo caso las pondrán inmediatamente en conocimiento de los órganos de inspección procedentes"
    );
    expect(excerpt).toContain("Tendrán, asimismo, el deber de velar por su conservación");
  });

  it("marks every omission with an ellipsis instead of a full stop", () => {
    const excerpt = sources.get("rdleg-5-2015-art54")?.excerpt ?? "";
    expect(excerpt).toContain("[…]");
    expect(excerpt).not.toContain("...");
  });
});
