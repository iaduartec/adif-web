import { createElement, type ComponentType, type SVGProps } from "react";

type NavigationIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type NavigationItem = { href: string; icon: NavigationIcon; label: string };

function createIcon(paths: readonly string[]): NavigationIcon {
  return function NavigationIcon(props) {
    return createElement(
      "svg",
      { "aria-hidden": true, fill: "none", height: "20", viewBox: "0 0 24 24", width: "20", ...props },
      ...paths.map((d, index) => createElement("path", { d, key: index })),
    );
  };
}

const RailIcon = createIcon(["M4 6h16M4 12h16M4 18h16"]);
const CourseIcon = createIcon(["M5 4.75h10.5A2.5 2.5 0 0 1 18 7.25v12H7.5A2.5 2.5 0 0 0 5 21.75v-17Z", "M5 4.75h10.5A2.5 2.5 0 0 1 18 7.25v12M5 4.75v17"]);
const TestsIcon = createIcon(["m5 7 2 2 4-4M5 13l2 2 4-4M13 7h6M13 13h6M5 19h14"]);
const SimulationIcon = createIcon(["M5 5.5h14v13H5zM8 9h8M8 13h4M15.5 15.5h.01"]);
const AptitudeIcon = createIcon(["M6 5h12v14H6zM9 9h6M9 12h2M13 15h2"]);
const LanguageIcon = createIcon(["M4 5h10M9 3v2c0 5-2 8-5 10M6 9c1.5 2 3.5 3.7 6 5M14 19l3-8 3 8M15.2 16h3.6"]);
const CardsIcon = createIcon(["M7 5h11v12H7zM4 8v11h11"]);
const ErrorsIcon = createIcon(["M5 4.5h14v15H5zM8 8h8M8 12h5M8 16h3", "m16 15 2 2m0-2-2 2"]);
const StatisticsIcon = createIcon(["M5 19V11M10 19V5M15 19v-7M20 19V8"]);

export const NAV_ITEMS: readonly NavigationItem[] = [
  { href: "/", icon: RailIcon, label: "Inicio" },
  { href: "/curso", icon: CourseIcon, label: "Curso" },
  { href: "/tests", icon: TestsIcon, label: "Tests" },
  { href: "/simulacros", icon: SimulationIcon, label: "Simulacros" },
  { href: "/psicotecnicos", icon: AptitudeIcon, label: "Psicotécnicos" },
  { href: "/ingles-a2", icon: LanguageIcon, label: "Inglés A2" },
  { href: "/fichas", icon: CardsIcon, label: "Fichas" },
  { href: "/errores", icon: ErrorsIcon, label: "Cuaderno de errores" },
  { href: "/estadisticas", icon: StatisticsIcon, label: "Estadísticas" },
] as const;
