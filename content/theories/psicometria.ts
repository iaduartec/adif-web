import type { TheorySection } from "../lesson-theory";

export const psicometriaTheory: TheorySection = {
  sources: [
    {
      id: "guia-aptitudes-cognitivas",
      sourceId: "MET-PSI-01",
      sourceTitle: "Guía Metodológica de Evaluación de Aptitudes Cognitivas y Psicométricas",
      sourceUrl: "https://www.adif.es/w/pni26-01-personal-operativo",
      locator: "Sección de Orientación de Pruebas de Acceso",
      excerpt: "La evaluación de la velocidad perceptiva, razonamiento lógico y aptitud numérica forma parte del estándar psicotécnico aplicable al personal operativo."
    }
  ],

  introduction: [
    {
      id: "psico-intro-1",
      text: "La evaluación psicométrica en el acceso al empleo público en ADIF tiene por objeto medir la idoneidad aptitudinal, la resistencia a la fatiga y el control del error bajo presión temporal.",
      kind: "didactic",
      legalBasis: ["guia-aptitudes-cognitivas"]
    }
  ],

  concepts: [
    {
      id: "psico-concept-1",
      title: "Atención Sostenida y Resistencia a la Fatiga",
      claims: [
        {
          id: "psico-c1-1",
          text: "Mide la concentración mediante tareas monótonas como la localización rápida de diferencias alfanuméricas o la selección de patrones visuales entre matrices densas.",
          kind: "didactic",
          legalBasis: ["guia-aptitudes-cognitivas"]
        }
      ]
    },
    {
      id: "psico-concept-2",
      title: "Razonamiento Lógico y Abstracto",
      claims: [
        {
          id: "psico-c2-1",
          text: "Mide la aptitud de completar secuencias de dominós, matrices de figuras o desarrollo de cuerpos geométricos en tres dimensiones (plegado de cubos).",
          kind: "didactic",
          legalBasis: ["guia-aptitudes-cognitivas"]
        }
      ]
    },
    {
      id: "psico-concept-3",
      title: "Aptitud Numérica",
      claims: [
        {
          id: "psico-c3-1",
          text: "Evalúa la velocidad de cálculo básico y resolución matemática de problemas sobre porcentajes, regla de tres y ecuaciones de primer grado.",
          kind: "didactic",
          legalBasis: ["guia-aptitudes-cognitivas"]
        }
      ]
    },
    {
      id: "psico-concept-4",
      title: "Velocidad Relativa y Cruces de Trenes",
      claims: [
        {
          id: "psico-c4-1",
          text: "Fórmulas de MRU aplicadas: Tiempo de encuentro (sentidos opuestos) t = d / (v1 + v2). Tiempo de alcance (mismo sentido) t = d / (v1 - v2).",
          kind: "didactic",
          legalBasis: ["guia-aptitudes-cognitivas"]
        }
      ]
    },
    {
      id: "psico-concept-5",
      title: "Aptitud Verbal",
      claims: [
        {
          id: "psico-c5-1",
          text: "Evalúa comprensión analítica de textos, establecimiento de analogías gramaticales y relaciones de sinonimia o antonimia contextual.",
          kind: "didactic",
          legalBasis: ["guia-aptitudes-cognitivas"]
        }
      ]
    },
    {
      id: "psico-concept-6",
      title: "Tasa de Penalización por Error",
      claims: [
        {
          id: "psico-c6-1",
          text: "Se penalizan las respuestas erróneas mediante la aplicación de la corrección del azar en preguntas de respuesta múltiple, por lo que responder al azar empeora la puntuación esperada.",
          kind: "didactic",
          legalBasis: ["guia-aptitudes-cognitivas"]
        }
      ]
    }
  ],

  examples: [
    {
      id: "psico-ex-1",
      situation: "Un tren sale de Madrid a 250 km/h y otro de Barcelona a 200 km/h por vías paralelas concurrentes. La distancia entre ambas ciudades es de 900 km.",
      application: [
        {
          id: "psico-ex-1-app-1",
          text: "Se calcula la hora de cruce aplicando la fórmula de velocidad al encuentro: t = 900 / (250 + 200) = 2 horas.",
          kind: "example",
          legalBasis: ["guia-aptitudes-cognitivas"]
        }
      ]
    }
  ],

  reviewTakeaways: [
    {
      id: "psico-takeaway-1",
      text: "La estrategia óptima de realización del test psicotécnico consiste en contestar primero las respuestas de seguridad absoluta, omitiendo aquellas de resolución dudosa para evitar la penalización por fallos.",
      kind: "didactic",
      legalBasis: ["guia-aptitudes-cognitivas"]
    }
  ]
};
