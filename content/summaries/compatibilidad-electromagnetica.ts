import type { LessonSummary } from "./types";

export const compatibilidadElectromagneticaSummary: LessonSummary = {
  overview: "La Compatibilidad Electromagnética (CEM / EMC) en el sector ferroviario busca que los equipos de telecomunicaciones, señalización y tracción funcionen adecuadamente en presencia de perturbaciones y sin causar perturbaciones intolerables. En examen importa distinguir emisión, inmunidad, mecanismos de acoplamiento y la familia de normas EN 50121.",
  keyFacts: [
    "Definición de CEM: capacidad de un equipo o sistema para funcionar satisfactoriamente en su entorno electromagnético sin introducir perturbaciones inaceptables.",
    "Emisión electromagnética: energía que el equipo envía al entorno y que puede molestar a otros aparatos.",
    "Inmunidad electromagnética: capacidad de seguir funcionando aunque existan perturbaciones externas.",
    "Marcado CE: el fabricante indica la conformidad del aparato con la legislación de armonización de la Unión aplicable que prevé su colocación (RD 186/2016, artículos 3.x, 7.2, 16 y 17).",
    "La serie EN 50121 agrupa las normas ferroviarias específicas de emisión e inmunidad.",
    "Las partes, ediciones y requisitos concretos de EN 50121 necesitan cotejo de la norma aplicable; no atribuyas valores de ensayo a una edición no verificada.",
    "La gestión de CEM combina diseño, instalación, pruebas y documentación.",
  ],
  sections: [
    {
      title: "Qué suelen preguntar",
      points: [
        "La diferencia entre emisión e inmunidad.",
        "Los mecanismos de acoplamiento: conducción, inducción, capacitancia y radiación.",
        "Qué norma EN 50121 aplica a material rodante o a instalaciones fijas.",
        "Qué medidas reducen el riesgo de interferencias en un entorno ferroviario severo.",
      ]
    },
    {
      title: "Cómo resolverlo en el examen",
      points: [
        "Lee primero si la pregunta va sobre el equipo, el tren o la instalación fija.",
        "Luego separa si pide emisión, inmunidad o medidas de mitigación.",
        "Si hay varias respuestas parecidas, elige la que encaje con el contexto ferroviario y no con electrónica genérica.",
        "Cuando aparezca una norma, identifica la parte de la serie EN 50121 sin mezclarla con las demás.",
      ]
    },
    {
      title: "Trampas habituales y checklist",
      points: [
        "No confundir inmunidad con ausencia total de perturbaciones: significa tolerarlas sin degradarse de forma inaceptable.",
        "No mezclar normas de material rodante con las de infraestructura fija.",
        "Checklist: identificar el agente perturbador, el camino de acoplamiento y la medida de protección.",
        "Apantallamiento, filtrado y puesta a tierra son las respuestas clásicas que debes recordar.",
      ]
    }
  ]
};
