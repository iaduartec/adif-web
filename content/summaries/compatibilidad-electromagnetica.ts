import type { LessonSummary } from "./types";

export const compatibilidadElectromagneticaSummary: LessonSummary = {
  overview: "La Compatibilidad Electromagnética (CEM / EMC) en el sector ferroviario garantiza que los equipos y sistemas de telecomunicaciones, señalización y tracción funcionen sin causar ni sufrir interferencias perjudiciales, regulada por la Directiva 2014/30/UE, el RD 186/2016 y las normas EN 50121.",
  keyFacts: [
    "Definición de CEM: Capacidad de un equipo o sistema para funcionar satisfactoriamente en su entorno electromagnético sin introducir perturbaciones inaceptables (Art. 3 RD 186/2016).",
    "Emisión electromagnética: Generación de energía electromagnética que puede causar interferencias en otros aparatos o sistemas.",
    "Inmunidad electromagnética: Capacidad de un equipo para funcionar sin degradación en presencia de perturbaciones electromagnéticas.",
    "Marcado CE: Certifica la conformidad del equipo con los requisitos esenciales de la Directiva CEM antes de su comercialización.",
    "Norma EN 50121: Conjunto de normas europeas específicas para la emisión e inmunidad de compatibilidad electromagnética en aplicaciones ferroviarias.",
    "Norma EN 50121-3-2: Aplica al material rodante (aparatos e instalaciones a bordo de trenes).",
    "Norma EN 50121-4: Aplica a los equipos de señalización y telecomunicaciones en infraestructuras fijas ferroviarias."
  ],
  sections: [
    {
      title: "Conceptos Fundamentales de la Compatibilidad Electromagnética",
      points: [
        "Entorno electromagnético ferroviario: Caracterizado por corrientes de tracción elevadas, arcos en pantógrafo, conmutación de alta tensión y presencia de emisiones de radio de gran potencia (GSM-R/LTE-R).",
        "Perturbación electromagnética: Cualquier fenómeno electromagnético que pueda degradar el rendimiento de un equipo, sistema o canal de comunicación.",
        "Mecanismos de acoplamiento: Conducción (cables), inducción magnética, acoplamiento capacitivo y radiación electromagnética."
      ]
    },
    {
      title: "Marco Normativo y Serie EN 50121",
      points: [
        "EN 50121-1: Generalidades del entorno ferroviario y reglas básicas de compatibilidad.",
        "EN 50121-2: Emisiones del sistema ferroviario completo hacia el mundo exterior.",
        "EN 50121-3-1 y 3-2: Emisión e inmunidad para trenes completos y aparatos a bordo.",
        "EN 50121-4: Emisión e inmunidad para aparatos de señalización y telecomunicaciones instalados en la infraestructura fija.",
        "EN 50121-5: Emisión e inmunidad en instalaciones fijas de alimentación de energía (subestaciones de tracción)."
      ]
    },
    {
      title: "Técnicas de Mitigación y Evaluación de Conformidad",
      points: [
        "Apantallamiento: Uso de envolventes metálicas continuas para atenuar los campos electromagnéticos radiados.",
        "Filtrado: Inserción de filtros de línea para bloquear interferencias conducidas en cables de alimentación y señal.",
        "Puesta a tierra y equipotencialidad: Red de masa de baja impedancia para derivar corrientes de perturbación y garantizar la seguridad.",
        "El expediente técnico de la evaluación de conformidad debe conservarse durante un plazo de 10 años a disposición de las autoridades."
      ]
    }
  ]
};
