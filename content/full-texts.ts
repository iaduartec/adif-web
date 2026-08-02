import ictRd3462011 from "./full-texts/ict-rd-346-2011.json";
import compatibilidad from "./full-texts/compatibilidad-electromagnetica.json";
import rcf from "./full-texts/rcf-libro-1.json";
import igualdad from "./full-texts/igualdad.json";
import prl from "./full-texts/prevencion-riesgos-laborales.json";
import estatuto from "./full-texts/estatuto-adif.json";
import declaracionRed from "./full-texts/declaracion-red-2027.json";
import codigoConducta from "./full-texts/codigo-conducta.json";
import incompatibilidades from "./full-texts/incompatibilidades.json";

export const fullTexts: Record<string, string> = {
  "ict-rd-346-2011": ictRd3462011,
  "compatibilidad-electromagnetica": compatibilidad,
  "rcf-libro-1": rcf,
  igualdad,
  "prevencion-riesgos-laborales": prl,
  "estatuto-adif": estatuto,
  "declaracion-red-2027": declaracionRed,
  "codigo-conducta": codigoConducta,
  incompatibilidades,
};
