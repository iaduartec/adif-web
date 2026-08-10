import type { LessonSummary } from "./types";

export const psicometriaSummary: LessonSummary = {
  overview:
    "Evaluación psicométrica: qué se mide y cómo prepararlo. En ADIF el bloque psicotécnico premia rapidez, atención sostenida y reducción de errores; la clave no es memorizar teoría, sino reconocer el tipo de ejercicio en segundos y aplicar siempre la misma mecánica de resolución.",
  keyFacts: [
    "La nota depende del acierto, pero también de la administración del tiempo y de la limpieza del proceso de respuesta.",
    "Las preguntas suelen agruparse en comparación visual, series, matrices, razonamiento espacial, aptitud numérica y verbal.",
    "La atención selectiva y la resistencia a la fatiga son determinantes cuando el test repite patrones monótonos.",
    "La aptitud numérica mezcla cálculo mental, porcentajes, proporciones, reglas de tres y pequeños problemas de velocidad o reparto.",
    "El razonamiento espacial exige detectar simetrías, giros y piezas fijas antes de empezar a rotar mentalmente opciones.",
    "En verbal, la lectura rápida y la precisión importan más que el vocabulario rebuscado.",
    "Conviene hacer una primera pasada por las preguntas seguras y dejar las dudosas para el final.",
  ],
  sections: [
    {
      title: "Qué suele preguntar ADIF",
      points: [
        "Comparación de cadenas alfanuméricas: detectar si dos secuencias coinciden exactamente o si cambian en un dígito, una letra o el orden.",
        "Series numéricas: reconocer progresiones aditivas, multiplicativas, alternadas o por diferencias sucesivas.",
        "Matrices y figuras: identificar la regla dominante antes de probar respuesta por respuesta.",
        "Problemas verbales breves: traducir el texto a una relación numérica simple y resolver sin recrear todo el enunciado.",
        "Tareas de atención: encontrar símbolos, repeticiones o diferencias mínimas bajo presión de tiempo.",
      ],
    },
    {
      title: "Cómo se resuelve con seguridad",
      points: [
        "Haz una primera lectura rápida para clasificar el ejercicio: visual, numérico, espacial o verbal.",
        "En series y matrices, busca primero la relación dominante; si no aparece en pocos segundos, marca y continúa.",
        "En comparación visual, fija un orden de lectura estable para no saltarte caracteres.",
        "En problemas numéricos, escribe la operación mínima necesaria: menos pasos implican menos errores.",
        "Entrena por bloques cronometrados hasta que el reconocimiento de patrones sea casi automático.",
      ],
    },
    {
      title: "Errores típicos y checklist final",
      points: [
        "Confundir velocidad con precipitación: responder rápido sin revisar cuesta más que dejar una duda para el final.",
        "Saltar pasos en una serie y perder la regularidad del patrón.",
        "Comparar solo el principio o el final de una cadena y no el conjunto completo.",
        "Gastar demasiado tiempo en una sola duda y perder preguntas fáciles después.",
        "Checklist: entender el tipo de ejercicio, localizar la regla, resolver con el mínimo cálculo y cerrar la pregunta sin dudar demasiado.",
      ],
    },
  ],
};
