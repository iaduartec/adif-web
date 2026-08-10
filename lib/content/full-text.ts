const fullTextLoaders: Record<string, () => Promise<{ default: string }>> = {
  "ict-rd-346-2011": () => import("../../content/full-texts/ict-rd-346-2011.json"),
  "compatibilidad-electromagnetica": () => import("../../content/full-texts/compatibilidad-electromagnetica.json"),
  "rcf-libro-1": () => import("../../content/full-texts/rcf-libro-1.json"),
  igualdad: () => import("../../content/full-texts/igualdad.json"),
  "prevencion-riesgos-laborales": () => import("../../content/full-texts/prevencion-riesgos-laborales.json"),
  "estatuto-adif": () => import("../../content/full-texts/estatuto-adif.json"),
  "declaracion-red-2027": () => import("../../content/full-texts/declaracion-red-2027.json"),
  "codigo-conducta": () => import("../../content/full-texts/codigo-conducta.json"),
  incompatibilidades: () => import("../../content/full-texts/incompatibilidades.json"),
};

export async function loadFullText(slug: string): Promise<string | undefined> {
  const load = fullTextLoaders[slug];
  return load ? (await load()).default : undefined;
}
