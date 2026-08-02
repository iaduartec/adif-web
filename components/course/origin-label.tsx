import type { ContentOrigin } from "../../lib/content/schema";

const originLabels: Record<ContentOrigin, string> = {
  official_reference: "Referencia oficial",
  original_explanation: "Explicación didáctica original",
  verification_pending: "Pendiente de cotejo 2026",
};

export function OriginLabel({ origin }: { origin: ContentOrigin }) {
  return <span className={`course-origin course-origin--${origin}`} data-origin-label>{originLabels[origin]}</span>;
}
