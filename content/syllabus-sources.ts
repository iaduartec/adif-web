export type SyllabusSourceKind = "call" | "bases" | "annex" | "syllabus" | "official-page";

export type SyllabusSource = {
  id: string;
  title: string;
  url: string;
  kind: SyllabusSourceKind;
};

/** Sources that establish exam scope; material sources live in the theory registry. */
export const SYLLABUS_SOURCES: Record<string, SyllabusSource> = {
  "pni26-01": {
    id: "pni26-01",
    title: "PNI26/01 - Convocatoria Pública de Ingreso en categorías de Personal Operativo",
    url: "https://www.adif.es/w/pni26-01-personal-operativo",
    kind: "call",
  },
  "pni26-01-instructions": {
    id: "pni26-01-instructions",
    title: "Instrucciones para formalizar la inscripción PNI26/01",
    url: "https://www.adif.es/documents/20124/55031380/Instrucciones%2Bpara%2Bformalizar%2Bla%2Binscripci%C3%B3n%2BPNI26%2B01.pdf/f99c019c-92cd-2da1-d5a5-98367b72edb7?t=1783940162781",
    kind: "official-page",
  },
  "pni26-01-boe": {
    id: "pni26-01-boe",
    title: "Anuncio de convocatoria PNI26/01 en el BOE",
    url: "https://www.boe.es/diario_boe/txt.php?id=BOE-B-2026-24123",
    kind: "call",
  },
};
