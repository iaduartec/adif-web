import type { TheorySection } from "../lesson-theory";

const reviewedOriginalAptitude = {
  status: "reviewed",
  reviewedAt: "2026-10-16",
  reviewedBy: "opencode-editorial",
  confidence: {
    level: "high",
    reason: "Explicación didáctica original verificada junto con sus cuatro opciones; no acredita contenido oficial ADIF.",
  },
} as const;

/**
 * One teaching concept per original aptitude. The supported aptitude IDs live in
 * `lib/content/psychometric-curriculum.ts`, which fails at load if a concept is missing.
 */
const aptitudeConcepts: TheorySection["concepts"] = [
  {
    id: "psico-topic-verbal",
    title: "Aptitud verbal",
    claims: [
      {
        id: "psico-topic-verbal-rule",
        text: "Evalúa la comprensión de relaciones semánticas entre palabras: sinónimos, antónimos y significado contextual dentro de una frase.",
        kind: "didactic",
        legalBasis: ["guia-aptitudes-cognitivas"],
        review: reviewedOriginalAptitude,
      },
    ],
  },
  {
    id: "psico-topic-synonym-antonym",
    title: "Sinónimos y antónimos",
    claims: [
      {
        id: "psico-topic-synonym-antonym-rule",
        text: "Mide la capacidad de identificar sinónimos y antónimos, distinguiendo el matiz que separa palabras de significado próximo pero no equivalente.",
        kind: "didactic",
        legalBasis: ["guia-aptitudes-cognitivas"],
        review: reviewedOriginalAptitude,
      },
    ],
  },
  {
    id: "psico-topic-numerical",
    title: "Aptitud numérica",
    claims: [
      {
        id: "psico-topic-numerical-rule",
        text: "Resuelve problemas aritméticos aplicados sobre proporciones, porcentajes y velocidades, eligiendo la operación mínima necesaria.",
        kind: "didactic",
        legalBasis: ["guia-aptitudes-cognitivas"],
        review: reviewedOriginalAptitude,
      },
      {
        id: "psico-topic-numerical-percent-method",
        text: "Para calcular mentalmente un porcentaje sencillo, descompónlo en partes fáciles de obtener sobre la cantidad inicial (por ejemplo, 15 % = 10 % + 5 %). Calcula primero la parte porcentual y después súmala o réstala según indique el problema.",
        kind: "didactic",
        legalBasis: ["guia-aptitudes-cognitivas"],
        review: reviewedOriginalAptitude,
      },
    ],
  },
  {
    id: "psico-topic-calculation",
    title: "Cálculo mental",
    claims: [
      {
        id: "psico-topic-calculation-rule",
        text: "Mide la velocidad y la precisión del cálculo mental combinando sumas, restas, multiplicaciones y divisiones con la jerarquía de operaciones.",
        kind: "didactic",
        legalBasis: ["guia-aptitudes-cognitivas"],
        review: reviewedOriginalAptitude,
      },
    ],
  },
  {
    id: "psico-topic-series",
    title: "Series numéricas",
    claims: [
      {
        id: "psico-topic-series-rule",
        text: "Detecta la regla que genera una sucesión numérica: progresiones aditivas, multiplicativas o de diferencias sucesivas.",
        kind: "didactic",
        legalBasis: ["guia-aptitudes-cognitivas"],
        review: reviewedOriginalAptitude,
      },
    ],
  },
  {
    id: "psico-topic-logic",
    title: "Razonamiento lógico",
    claims: [
      {
        id: "psico-topic-logic-rule",
        text: "Evalúa el razonamiento deductivo sobre proposiciones condicionales y cuantificadores, separando lo que se sigue necesariamente de lo meramente posible.",
        kind: "didactic",
        legalBasis: ["guia-aptitudes-cognitivas"],
        review: reviewedOriginalAptitude,
      },
    ],
  },
  {
    id: "psico-topic-matrices",
    title: "Matrices",
    claims: [
      {
        id: "psico-topic-matrices-rule",
        text: "En una matriz, compara filas y columnas y sigue una sola característica cada vez (por ejemplo, el tono de relleno). Comprueba que la regla se repite en más de una línea antes de completar la casilla; así evitas elegir por semejanza visual aislada.",
        kind: "didactic",
        legalBasis: ["guia-aptitudes-cognitivas"],
        review: reviewedOriginalAptitude,
      },
    ],
  },
  {
    id: "psico-topic-spatial",
    title: "Razonamiento espacial",
    claims: [
      {
        id: "psico-topic-spatial-rule",
        text: "Razonar sobre plegado, orientación y rotación de cuerpos requiere mantener relaciones entre caras y posiciones al cambiar el punto de vista.",
        kind: "didactic",
        legalBasis: ["guia-aptitudes-cognitivas"],
        review: reviewedOriginalAptitude,
      },
      {
        id: "psico-topic-spatial-rotation-method",
        text: "Para resolver una rotación, fija primero una marca asimétrica (punto, borde sombreado o esquina), registra dónde está y gira mentalmente el objeto completo en pasos de 90° o 180°. La marca debe acompañar el giro: una rotación conserva el orden de los rasgos, mientras que un reflejo invierte su orientación. Comprueba el resultado con un segundo rasgo antes de elegir; no deduzcas la respuesta solo por la silueta general.",
        kind: "didactic",
        legalBasis: ["guia-aptitudes-cognitivas"],
        review: reviewedOriginalAptitude,
      },
    ],
  },
  {
    id: "psico-topic-abstract-patterns",
    title: "Patrones abstractos",
    claims: [
      {
        id: "psico-topic-abstract-patterns-rule",
        text: "Identifica la transformación que gobierna una figura abstracta (giros, simetrías o alternancias) y la proyecta sobre el siguiente paso.",
        kind: "didactic",
        legalBasis: ["guia-aptitudes-cognitivas"],
        review: reviewedOriginalAptitude,
      },
    ],
  },
  {
    id: "psico-topic-attention",
    title: "Atención",
    claims: [
      {
        id: "psico-topic-attention-rule",
        text: "Mide la concentración sostenida en tareas de búsqueda y conteo de elementos dentro de una secuencia.",
        kind: "didactic",
        legalBasis: ["guia-aptitudes-cognitivas"],
        review: reviewedOriginalAptitude,
      },
    ],
  },
  {
    id: "psico-topic-difference-detection",
    title: "Detección de diferencias",
    claims: [
      {
        id: "psico-topic-difference-detection-rule",
        text: "Localiza la diferencia exacta entre dos cadenas alfanuméricas casi idénticas comparando el conjunto completo y no solo sus extremos.",
        kind: "didactic",
        legalBasis: ["guia-aptitudes-cognitivas"],
        review: reviewedOriginalAptitude,
      },
    ],
  },
  {
    id: "psico-topic-memory",
    title: "Memoria",
    claims: [
      {
        id: "psico-topic-memory-rule",
        text: "Evalúa la retención a corto plazo de claves, secuencias o listas reproducidas sin alterar el orden ni los caracteres.",
        kind: "didactic",
        legalBasis: ["guia-aptitudes-cognitivas"],
        review: reviewedOriginalAptitude,
      },
    ],
  },
  {
    id: "psico-topic-sequences",
    title: "Secuencias",
    claims: [
      {
        id: "psico-topic-sequences-rule",
        text: "Completa secuencias ordenadas de letras o símbolos alternos reconociendo el criterio de avance.",
        kind: "didactic",
        legalBasis: ["guia-aptitudes-cognitivas"],
        review: reviewedOriginalAptitude,
      },
    ],
  },
  {
    id: "psico-topic-perceptual-speed",
    title: "Velocidad perceptiva",
    claims: [
      {
        id: "psico-topic-perceptual-speed-rule",
        text: "Mide la rapidez de discriminación visual sobre cadenas de símbolos, priorizando la precisión sobre la precipitación.",
        kind: "didactic",
        legalBasis: ["guia-aptitudes-cognitivas"],
        review: reviewedOriginalAptitude,
      },
    ],
  },
];

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
      title: "Puntuación y respuestas dudosas",
      claims: [
        {
          id: "psico-c6-1",
          text: "Las consecuencias de acertar, fallar o dejar una respuesta en blanco dependen de las reglas de puntuación confirmadas para cada convocatoria. Consulta esas reglas antes de elegir una estrategia.",
          kind: "didactic",
          legalBasis: ["guia-aptitudes-cognitivas"]
        }
      ]
    },
    ...aptitudeConcepts
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
    },
    {
      id: "psico-ex-2",
      situation: "En una matriz de tres por tres, las filas visibles son gris–blanco–gris; blanco–gris–blanco; gris–blanco–casilla vacía.",
      application: [
        {
          id: "psico-ex-2-app-1",
          text: "Aísla el tono y lee la última fila: gris, blanco, por lo que alterna y falta gris. Compruébalo también en la tercera columna: gris, blanco, gris. La opción correcta es la muestra gris; el patrón queda confirmado tanto en fila como en columna.",
          kind: "example",
          legalBasis: ["guia-aptitudes-cognitivas"],
          review: {
            status: "reviewed",
            reviewedAt: "2026-11-04",
            reviewedBy: "codex-editorial",
            confidence: {
              level: "high",
              reason: "Comprobación didáctica directa: la alternancia de tonos produce gris tanto en la fila como en la columna.",
            },
          }
        }
      ]
    },
    {
      id: "psico-ex-3",
      situation: "Una cantidad de 360 se reduce un 15 %. ¿Cuál es el resultado?",
      application: [
        {
          id: "psico-ex-3-app-1",
          text: "Descompón el 15 % en 10 % + 5 %. El 10 % de 360 es 36 y el 5 % es la mitad, 18; la reducción total es 54. Como el enunciado pide reducir, resta ese importe a la cantidad inicial: 360 − 54 = 306.",
          kind: "example",
          legalBasis: ["guia-aptitudes-cognitivas"],
          review: {
            status: "reviewed",
            reviewedAt: "2026-11-04",
            reviewedBy: "codex-editorial",
            confidence: {
              level: "high",
              reason: "Operación aritmética comprobable: 10 % y 5 % de 360 suman 54; 360 menos 54 es 306.",
            },
          }
        }
      ]
    },
    {
      id: "psico-ex-spatial-rotation",
      situation: "Ejemplo geométrico resuelto, sin figura dibujada: una pieza cuadrada tiene un punto en la esquina superior izquierda y una franja horizontal. Se gira 90° en sentido horario.",
      application: [
        {
          id: "psico-ex-spatial-rotation-app",
          text: "Gira el objeto entero, no sus rasgos por separado: la esquina superior izquierda pasa a la superior derecha; la franja horizontal queda vertical. La comprobación con ambos rasgos confirma el giro horario. Si el punto pasara a la esquina superior derecha pero la franja siguiera horizontal, se habría movido una marca sin rotar el objeto; si se invirtiera el orden como en un espejo, sería una reflexión, no una rotación.",
          kind: "example",
          legalBasis: ["guia-aptitudes-cognitivas"],
          review: {
            status: "reviewed",
            reviewedAt: "2026-11-04",
            reviewedBy: "codex-editorial",
            confidence: {
              level: "high",
              reason: "Verificación geométrica: un giro horario de 90° lleva la esquina superior izquierda a la superior derecha y transforma una orientación horizontal en vertical; se etiqueta expresamente como ejemplo textual, no como figura presentada.",
            },
          },
        },
      ]
    }
  ],

  reviewTakeaways: [
    {
      id: "psico-takeaway-1",
      text: "Practica primero con precisión y después con tiempo limitado; decide qué hacer con las preguntas dudosas según las reglas confirmadas y el tiempo disponible.",
      kind: "didactic",
      legalBasis: ["guia-aptitudes-cognitivas"]
    }
  ]
};
