import type { LessonSummary } from "./types";

export const prevencionRiesgosLaboralesSummary: LessonSummary = {
  overview: "La Ley 31/1995 de Prevención de Riesgos Laborales regula los derechos y obligaciones de empresarios y trabajadores en materia de seguridad y salud laboral, estableciendo los principios de la acción preventiva en el ámbito de las administraciones públicas y empresas privadas.",
  keyFacts: [
    "Objeto: Promover la seguridad y la salud de los trabajadores mediante la aplicación de medidas y desarrollo de actividades necesarias.",
    "Principio de primacía de la protección colectiva frente a la individual (Art. 15).",
    "Derecho a la paralización de la actividad (Art. 21): En caso de riesgo grave e inminente, los trabajadores pueden interrumpir su labor.",
    "Vigilancia periódica de la salud (Art. 22): Con el consentimiento del trabajador salvo excepciones legales.",
    "Delegados de Prevención (Art. 35): Representantes de los trabajadores con funciones específicas en prevención.",
    "Comité de Seguridad y Salud (Art. 38): Órgano paritario y colegiado de participación en empresas de 50 o más trabajadores.",
    "Coste de las medidas de seguridad: Nunca puede recaer sobre los trabajadores (Art. 14.5)."
  ],
  sections: [
    {
      title: "Principios de la Acción Preventiva (Art. 15)",
      points: [
        "Evitar los riesgos y evaluar los que no se puedan evitar.",
        "Combatir los riesgos en su origen y adaptar el trabajo a la persona.",
        "Tener en cuenta la evolución de la técnica y sustituir lo peligroso por lo seguro.",
        "Planificar la prevención y adoptar medidas que antepongan la protección colectiva a la individual.",
        "Dar las debidas instrucciones a los trabajadores."
      ]
    },
    {
      title: "Obligaciones del Empresario y Derechos del Trabajador",
      points: [
        "El empresario debe garantizar la formación suficiente y adecuada en materia preventiva adaptada al puesto de trabajo.",
        "El trabajador tiene el deber de usar correctamente los medios y equipos de protección, informando de inmediato de cualquier situación de riesgo."
      ]
    }
  ]
};
