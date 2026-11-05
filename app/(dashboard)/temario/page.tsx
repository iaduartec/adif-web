import type { Metadata } from "next";
import { TemarioView } from "../../../components/temario/temario-view";

export const metadata: Metadata = {
  title: "Temario de la convocatoria",
  description:
    "Documentos de la convocatoria PNI26/01 y material de estudio con su estado de cobertura.",
};

export default function TemarioPage() {
  return <TemarioView />;
}
