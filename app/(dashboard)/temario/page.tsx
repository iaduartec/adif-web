import type { Metadata } from "next";
import { TemarioView } from "../../../components/temario/temario-view";

export const metadata: Metadata = {
  title: "Temario oficial completo",
  description:
    "Los nueve documentos del temario oficial de la convocatoria PNI26/01 condensados en una sola lectura, con lo esencial y la frecuencia medida en examen.",
};

export default function TemarioPage() {
  return <TemarioView />;
}
