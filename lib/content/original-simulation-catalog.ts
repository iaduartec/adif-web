import type { OriginalPracticeDomain } from "./original-practice-schema";

export const originalSimulationCatalog: readonly {
  domain: OriginalPracticeDomain;
  title: string;
  description: string;
}[] = [
  { domain: "telecom", title: "Conocimientos específicos", description: "Telecomunicaciones y materias específicas de la convocatoria." },
  { domain: "general-knowledge", title: "Conocimientos generales", description: "Legislación y materias comunes del programa." },
  { domain: "english-a2", title: "Inglés A2", description: "Gramática, vocabulario y comprensión escrita con sus textos completos." },
  { domain: "psychometric", title: "Psicotécnicos", description: "Razonamiento verbal, numérico, lógico y espacial; incluye las figuras originales en SVG." },
];

export function getOriginalSimulation(domain: string) {
  return originalSimulationCatalog.find((simulation) => simulation.domain === domain);
}
