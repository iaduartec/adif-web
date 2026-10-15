import manifestJson from "../../content/official-exams/manifest.json";
import { sourceManifest } from "./source-manifest";
import { getOfficialPublicationDecision } from "./official-publication";
import { officialExamManifestSchema, type OfficialExamManifestEntry } from "./official-exam-manifest";

const forms = officialExamManifestSchema.parse(manifestJson);

export type OfficialExamCatalogEntry = OfficialExamManifestEntry & {
  documentSourceStatus: "verified" | "needs_check" | "superseded" | "unavailable" | "missing";
  publicationStatus: "link_only" | "review_pending" | "approved_for_publication" | "restricted";
  publicationEvidenceValid: boolean;
};

export function listOfficialExamCatalog(): OfficialExamCatalogEntry[] {
  return forms.map((form) => {
    const documentSource = sourceManifest.sources.find((source) =>
      source.sourceId === form.documentSourceId &&
      source.sourceVersion === form.documentSourceVersion &&
      source.url === form.documentUrl,
    );
    const publication = getOfficialPublicationDecision(form.id);

    return {
      ...form,
      documentSourceStatus: documentSource?.status ?? "missing",
      publicationStatus: publication.status,
      publicationEvidenceValid: publication.evidenceValid,
    };
  });
}
