export interface TheorySection {
  introduction: string;
  concepts: Array<{
    title: string;
    description: string;
  }>;
  examples: Array<{
    situation: string;
    application: string;
  }>;
  reviewTakeaways: string[];
}

import { igualdadTheory } from "./theories/igualdad";
import { prlTheory } from "./theories/prevencion-riesgos-laborales";
import { estatutoAdifTheory } from "./theories/estatuto-adif";
import { ictTheory } from "./theories/ict-rd-346-2011";
import { cemTheory } from "./theories/compatibilidad-electromagnetica";
import { rcfLibro1Theory } from "./theories/rcf-libro-1";
import { psicometriaTheory } from "./theories/psicometria";
import { declaracionRed2027Theory } from "./theories/declaracion-red-2027";
import { codigoConductaTheory } from "./theories/codigo-conducta";
import { incompatibilidadesTheory } from "./theories/incompatibilidades";
import { inglesA2Theory } from "./theories/ingles-a2";

export const lessonTheories: Record<string, TheorySection> = {
  igualdad: igualdadTheory,
  "prevencion-riesgos-laborales": prlTheory,
  "estatuto-adif": estatutoAdifTheory,
  "ict-rd-346-2011": ictTheory,
  "compatibilidad-electromagnetica": cemTheory,
  "rcf-libro-1": rcfLibro1Theory,
  psicometria: psicometriaTheory,
  "declaracion-red-2027": declaracionRed2027Theory,
  "codigo-conducta": codigoConductaTheory,
  incompatibilidades: incompatibilidadesTheory,
  "ingles-a2": inglesA2Theory
};
