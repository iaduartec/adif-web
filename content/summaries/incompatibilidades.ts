import type { LessonSummary } from "./types";

export const incompatibilidadesSummary: LessonSummary = {
  overview: "La Ley 53/1984 regula las incompatibilidades del personal incluido en su ámbito. Distingue el segundo puesto público de las actividades privadas: cada caso exige comprobar prohibiciones, condiciones, autorizaciones y excepciones.",
  keyFacts: [
    "Art. 1: como regla general se prohíbe un segundo puesto o actividad públicos salvo los supuestos legales; también se limita la percepción de más de una remuneración de los fondos comprendidos en la ley.",
    "Ámbito: Personal de la Administración del Estado, comunidades autónomas, entidades locales y entidades públicas empresariales (como ADIF).",
    "La segunda actividad pública autorizable requiere autorización previa y expresa (art. 3); el ejercicio de las actividades privadas del art. 14 requiere reconocimiento previo, sin confundirlo con las excepciones del art. 19.",
    "Límite de jornada: La segunda actividad autorizada no puede impedir ni perturbar el estricto cumplimiento de los deberes del puesto principal.",
    "Remuneración (art. 1.2): derecho económico derivado directa o indirectamente de una prestación o servicio personal, fijo o variable, periódico u ocasional.",
    "Límite retributivo (art. 7): se aplican los dos límites legales, con posibilidad de superación anual mediante acuerdo expreso por especial interés del servicio.",
    "Actividades exceptuadas (art. 19): comprobar las condiciones de cada categoría; por ejemplo, creación y publicaciones derivadas si no nacen de una relación de empleo o prestación de servicios."
  ],
  sections: [
    {
      title: "Compatibilidad en el Sector Público",
      points: [
        "La regla general prohíbe compatibilizar un segundo puesto, cargo o actividad en el sector público salvo los supuestos previstos en la ley; la percepción de remuneraciones tiene una regla distinta en el artículo 1.2.",
        "Entre los supuestos autorizables están la docencia y la sanidad en las condiciones legales, los cargos electivos y la investigación o asesoramiento del artículo 6, además de los supuestos determinados por interés público conforme al artículo 3.",
        "La autorización de la segunda actividad pública no modifica la jornada ni el horario de ninguno de los dos puestos y queda condicionada al cumplimiento estricto de ambos."
      ]
    },
    {
      title: "Compatibilidad en el Sector Privado",
      points: [
        "El artículo 11 prohíbe las actividades privadas relacionadas directamente con las que desarrolla la entidad de destino, con la excepción de las actividades que los interesados realizan para sí en ejercicio de un derecho legalmente reconocido.",
        "El artículo 12.1.a prohíbe actividades privadas en asuntos en los que la persona intervenga, haya intervenido en los dos últimos años o tenga que intervenir por razón de su puesto.",
        "El artículo 12.1.c prohíbe desempeñar cargos, por sí o por persona interpuesta, en las empresas concesionarias o contratistas y otras entidades que especifica; no reduce esa regla a cualquier prestación de servicios.",
        "El artículo 12 también limita la pertenencia a órganos rectores de entidades relacionadas y la participación superior al 10 % en el capital de las empresas indicadas en su letra c.",
        "Si un puesto privado exige presencia durante al menos la mitad de la jornada semanal ordinaria pública, solo puede autorizarse cuando la actividad pública sea de las previstas por la ley a tiempo parcial (art. 12.2).",
        "El reconocimiento previo del artículo 14 se resuelve motivadamente en dos meses; deja de surtir efecto al cambiar de puesto en el sector público. Las actividades del artículo 19 tienen sus propias excepciones."
      ]
    },
    {
      title: "Actividades Excluidas del Régimen de Incompatibilidades (Art. 19)",
      points: [
        "Administración del patrimonio personal o familiar, sin perjuicio de lo previsto en el artículo 12.",
        "Dirección de seminarios o cursos en los centros y condiciones del artículo 19.b: sin carácter permanente o habitual y sin superar 75 horas al año; colaboración o asistencia ocasional a congresos y cursos profesionales en los términos del apartado h.",
        "Participación en tribunales calificadores de pruebas selectivas.",
        "Creación y producción literaria, artística, científica o técnica y publicaciones derivadas, siempre que no se originen por una relación de empleo o de prestación de servicios."
      ]
    }
  ]
};
