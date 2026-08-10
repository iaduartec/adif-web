import type { LessonSummary } from "./types";

export const psicometriaSummary: LessonSummary = {
  overview:
    "Evaluación psicométrica: qué se mide y cómo prepararlo. La parte psicotécnica de ADIF prioriza rapidez, exactitud, atención sostenida y razonamiento práctico bajo presión de tiempo, así que el objetivo no es memorizar teoría sino automatizar patrones de resolución.",
  keyFacts: [
    "La nota depende tanto del acierto como de la gestión del tiempo y del control de errores.",
    "Las tareas más habituales son comparación de cadenas, series numéricas, matrices lógicas y problemas verbales breves.",
    "La atención selectiva y la resistencia a la fatiga pesan mucho en ejercicios monótonos.",
    "La aptitud numérica suele mezclar cálculo mental, porcentajes, proporciones y regla de tres.",
    "El razonamiento espacial exige rotar figuras mentalmente y detectar simetrías o piezas clave.",
    "En verbal, la lectura rápida y la precisión léxica importan más que la erudición.",
    "La estrategia de examen debe priorizar preguntas seguras antes que perder tiempo en bloques difíciles.",
  ],
  sections: [
    {
      title: "Qué evalúa el examen psicométrico",
      points: [
        "Atención y concentración: detectar diferencias mínimas, seguir patrones y sostener el rendimiento durante varios minutos seguidos.",
        "Razonamiento lógico: inferir reglas, secuencias y relaciones entre elementos sin depender de conocimientos memorísticos.",
        "Razonamiento espacial: anticipar giros, simetrías y desdoblamientos de figuras en dos y tres dimensiones.",
        "Aptitud numérica: resolver operaciones sencillas con rapidez y aplicar porcentajes, proporciones y velocidad media.",
        "Aptitud verbal: comprender instrucciones, analogías, sinónimos y antónimos con lectura muy rápida.",
      ],
    },
    {
      title: "Cómo se prepara con eficacia",
      points: [
        "Entrena por bloques cortos y cronometrados para reproducir la presión real del examen.",
        "Repite ejercicios similares hasta que la mecánica salga casi automática.",
        "Empieza por los ítems más rápidos y no te quedes bloqueado en una sola pregunta.",
        "Revisa los fallos por patrón: cambio de signo, lectura precipitada, cálculo mal copiado o confusión de regla.",
        "En series y matrices, busca primero la relación dominante antes de probar opciones al azar.",
      ],
    },
    {
      title: "Errores típicos que penalizan",
      points: [
        "Confundir velocidad con precipitación: responder rápido sin comprobar cuesta más que dejar una pregunta dudosa en blanco cuando la convocatoria lo permite.",
        "Ignorar el orden del patrón y saltar pasos intermedios en series o cálculos.",
        "No vigilar los detalles visuales en ejercicios de comparación alfanumérica.",
        "Gastar demasiado tiempo en una sola duda y perder preguntas fáciles después.",
      ],
    },
  ],
};
