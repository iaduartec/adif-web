import { estatutoAdifOutline } from "./estatuto-adif-outline";
import type { OfficialTextSection } from "./official-texts";

/** Exam-focused article index; the complete consolidated text is loaded separately. */
export const estatutoAdifOfficialText: OfficialTextSection = {
  title: "Real Decreto 2395/2004, Estatuto de la entidad pública empresarial ADIF",
  articles: estatutoAdifOutline.map(({ number, title, content }) => ({ number, title, content })),
};
