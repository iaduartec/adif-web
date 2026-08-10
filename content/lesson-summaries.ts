import { codigoConductaSummary } from "./summaries/codigo-conducta";
import { compatibilidadElectromagneticaSummary } from "./summaries/compatibilidad-electromagnetica";
import { declaracionRed2027Summary } from "./summaries/declaracion-red-2027";
import { estatutoAdifSummary } from "./summaries/estatuto-adif";
import { ictRd3462011Summary } from "./summaries/ict-rd-346-2011";
import { igualdadSummary } from "./summaries/igualdad";
import { incompatibilidadesSummary } from "./summaries/incompatibilidades";
import { inglesA2Summary } from "./summaries/ingles-a2";
import { psicometriaSummary } from "./summaries/psicometria";
import { prevencionRiesgosLaboralesSummary } from "./summaries/prevencion-riesgos-laborales";
import { rcfLibro1Summary } from "./summaries/rcf-libro-1";
import type { LessonSummary } from "./summaries/types";

export const lessonSummaries: Record<string, LessonSummary> = {
  igualdad: igualdadSummary,
  "prevencion-riesgos-laborales": prevencionRiesgosLaboralesSummary,
  "estatuto-adif": estatutoAdifSummary,
  "codigo-conducta": codigoConductaSummary,
  incompatibilidades: incompatibilidadesSummary,
  "ict-rd-346-2011": ictRd3462011Summary,
  "compatibilidad-electromagnetica": compatibilidadElectromagneticaSummary,
  "rcf-libro-1": rcfLibro1Summary,
  "declaracion-red-2027": declaracionRed2027Summary,
  psicometria: psicometriaSummary,
  "ingles-a2": inglesA2Summary,
};

export type { LessonSummary, LessonSummarySection } from "./summaries/types";
