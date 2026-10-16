import type {
  PublicOfficialCorrectionSource,
  PublicOfficialQuestionSource,
  PublicOfficialQuestionStatus,
} from "../../lib/content/public-dto";

type OfficialQuestionStatusDetails = Pick<
  PublicOfficialQuestionStatus,
  "validity" | "currentness" | "validityReason" | "validityEvidence" | "publicationStatus"
> & {
  correctionSource: PublicOfficialCorrectionSource | null;
};

function validityLabel(validity: OfficialQuestionStatusDetails["validity"]): string {
  switch (validity) {
    case "current": return "Vigencia revisada: sigue en el temario actual";
    case "changed": return "Vigencia revisada: el contenido histórico cambió";
    case "out_of_scope": return "Vigencia revisada: fuera del temario actual";
    case "pending_review": return "Vigencia pendiente de revisión";
  }
}

function publicationLabel(status: OfficialQuestionStatusDetails["publicationStatus"]): string {
  switch (status) {
    case "approved_for_publication": return "Texto autorizado para práctica";
    case "link_only": return "Enunciado retenido; consulta la fuente";
    case "review_pending": return "Publicación en revisión";
    case "restricted": return "Contenido restringido";
  }
}

function sourceStatusLabel(status: PublicOfficialQuestionSource["sourceStatus"]): string {
  switch (status) {
    case "verified": return "fuente verificada";
    case "needs_check": return "fuente pendiente de verificación";
    case "superseded": return "fuente sustituida";
    case "unavailable": return "fuente no disponible";
    case "missing": return "fuente sin resolver";
  }
}

function citationStatusLabel(source: PublicOfficialCorrectionSource): string {
  return source.sourceStatus === "verified" ? "referencia verificada" : "referencia por verificar";
}

export function OfficialSource({
  source,
  variant = "question",
  questionStatus,
}: {
  source: PublicOfficialQuestionSource;
  variant?: "question" | "exam";
  questionStatus?: OfficialQuestionStatusDetails;
}) {
  return (
    <aside aria-label="Procedencia oficial" className="official-source">
      <strong>{variant === "exam" ? `ADIF ${source.year}` : `OFICIAL ADIF ${source.year}`}</strong>
      <span>
        {source.call} · {source.profileCode} · modelo {source.examCode}
        {variant === "question" && <> · pregunta {source.questionNumber}</>}
      </span>
      <span className="official-source__verification">{sourceStatusLabel(source.sourceStatus)}</span>
      <a href={source.documentUrl} rel="noreferrer" target="_blank">Ver cuadernillo oficial ADIF</a>
      {questionStatus && (
        <div className="official-source__status">
          <span className="status-tag">{validityLabel(questionStatus.validity)}</span>
          <span className="status-tag">{publicationLabel(questionStatus.publicationStatus)}</span>
          <p>{questionStatus.validityReason}</p>
          {questionStatus.validityEvidence && (
            <a href={questionStatus.validityEvidence.sourceUrl} rel="noreferrer" target="_blank">
              Fuente vigente: {questionStatus.validityEvidence.locator}
            </a>
          )}
          {questionStatus.correctionSource && (
            <div className="official-source__correction">
              <a href={questionStatus.correctionSource.sourceUrl} rel="noreferrer" target="_blank">
                Resolución final del tribunal ({citationStatusLabel(questionStatus.correctionSource)})
              </a>
              <span>{questionStatus.correctionSource.locator}</span>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
