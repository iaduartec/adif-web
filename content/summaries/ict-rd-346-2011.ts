import type { LessonSummary } from "./types";

export const ictRd3462011Summary: LessonSummary = {
  overview: "El Real Decreto 346/2011 aprueba el Reglamento regulador de las Infraestructuras Comunes de Telecomunicación (ICT) para el acceso a los servicios de telecomunicación en el interior de los edificios. En examen interesa saber qué hace cada red, qué recinto corresponde a cada función y qué elemento marca el paso de la red común a la red privada del usuario.",
  keyFacts: [
    "Objeto: regular las ICT para la captación, adaptación y distribución de señales de radio, televisión y telecomunicaciones por cable y banda ancha.",
    "RITI: recinto inferior donde se concentran las redes de operadores de telecomunicación por hilo o cable.",
    "RITS: recinto superior donde se alojan los equipos de captación de RTV y enlace.",
    "RITU: recinto único para edificios pequeños o soluciones integradas.",
    "La secuencia de redes es alimentación, distribución, dispersión e interior de usuario.",
    "El PAU marca el límite entre la red común del edificio y la red privada de cada usuario.",
    "El Proyecto Técnico es la pieza documental clave antes de la licencia de edificación.",
  ],
  sections: [
    {
      title: "Qué te pueden pedir en el examen",
      points: [
        "Preguntan qué recinto corresponde a cada función, cuál es el orden de las redes y dónde termina la red común.",
        "Suelen mezclar definiciones parecidas para obligarte a distinguir distribución, dispersión e interior de usuario.",
        "También aparece la relación entre el proyecto técnico y la licencia de edificación.",
      ]
    },
    {
      title: "Esquema mental para recordar la ICT",
      points: [
        "RITI y RITS son los recintos clásicos en edificios grandes; RITU simplifica la solución en edificios pequeños.",
        "Arqueta de entrada y canalización de enlace conectan la red del operador con la infraestructura del edificio.",
        "La canalización principal baja o sube por el edificio y reparte servicios por plantas.",
        "El PAU separa la parte común de la privada y sirve como punto de acceso al usuario.",
      ]
    },
    {
      title: "Trampas frecuentes y repaso rápido",
      points: [
        "No confundir el recinto donde se alojan equipos con la red que transporta las señales.",
        "No invertir el orden de las redes: primero alimentación, luego distribución, después dispersión y por último interior de usuario.",
        "Repaso final: define RITI, RITS, RITU, PAU y proyecto técnico sin mirar apuntes.",
      ]
    }
  ]
};
