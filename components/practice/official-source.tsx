import type { OfficialQuestion } from "../../lib/content/schema";

export function OfficialSource({
  source,
  variant = "question",
}: {
  source: OfficialQuestion["source"];
  variant?: "question" | "exam";
}) {
  return (
    <aside aria-label="Procedencia oficial" className="official-source">
      <strong>{variant === "exam" ? "Documento oficial ADIF" : "Pregunta oficial ADIF"}</strong>
      <span>
        {source.year} · {source.call} · {source.profileCode} · modelo {source.examCode}
        {variant === "question" && <> · pregunta {source.questionNumber}</>}
      </span>
      <a href={source.documentUrl} rel="noreferrer" target="_blank">Ver en el documento oficial</a>
    </aside>
  );
}
