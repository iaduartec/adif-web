import type { OfficialQuestion } from "../../lib/content/schema";

export function OfficialSource({ source }: { source: OfficialQuestion["source"] }) {
  return (
    <aside aria-label="Procedencia oficial" className="official-source">
      <strong>Pregunta oficial ADIF</strong>
      <span>
        {source.year} · {source.call} · {source.profileCode} · modelo {source.examCode} · pregunta {source.questionNumber}
      </span>
      <a href={source.documentUrl} rel="noreferrer" target="_blank">Ver en el documento oficial</a>
    </aside>
  );
}
