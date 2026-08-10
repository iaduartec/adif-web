import type { LessonSummary } from "./types";

export const incompatibilidadesSummary: LessonSummary = {
  overview: "La Ley 53/1984, de 26 de diciembre, de Incompatibilidades del Personal al servicio de las Administraciones Públicas, establece la prohibición general de desempeñar un segundo puesto o actividad en el sector público o privado, salvo autorización expresa o excepciones legales.",
  keyFacts: [
    "Principio general (Art. 1): Incompatibilidad para el desempeño de un segundo puesto o actividad en el sector público o privado.",
    "Ámbito: Personal de la Administración del Estado, comunidades autónomas, entidades locales y entidades públicas empresariales (como ADIF).",
    "Autorización de compatibilidad: Requisito imprescindible antes de iniciar cualquier segunda actividad en el sector público o privado.",
    "Límite de jornada: La segunda actividad autorizada no puede impedir ni perturbar el estricto cumplimiento de los deberes del puesto principal.",
    "Límite retributivo: Las remuneraciones totales en el sector público no pueden superar los límites fijados por la Ley de Presupuestos Generales.",
    "Actividades exentas de autorización (Art. 19): Producción literaria, artística, científica, dirección de cursos y seminarios ocasionales."
  ],
  sections: [
    {
      title: "Compatibilidad en el Sector Público",
      points: [
        "La regla general prohíbe el desempeño de más de un empleo público retribuido con cargo a presupuestos públicos.",
        "Excepciones autorizables: Docencia universitaria a tiempo parcial y actividades de investigación o asesoramiento científico no permanente.",
        "El desempeño de un segundo puesto público requiere expediente previo de compatibilidad y que las horas de trabajo no coincidan."
      ]
    },
    {
      title: "Compatibilidad en el Sector Privado",
      points: [
        "Queda prohibida toda actividad privada que se relacione directamente con los asuntos en los que intervenga el empleado en su puesto público.",
        "No se puede autorizar la compatibilidad para el desempeño de servicios en empresas contratistas o concesionarias de la entidad donde presta servicios.",
        "La autorización de compatibilidad privada requiere solicitud formal previa y resolución motivada del órgano competente."
      ]
    },
    {
      title: "Actividades Excluidas del Régimen de Incompatibilidades (Art. 19)",
      points: [
        "Administración del patrimonio personal o familiar.",
        "Asistencia ocasional a coloquios, conferencias, seminarios y cursos de carácter profesional o docente.",
        "Participación en tribunales calificadores de pruebas selectivas.",
        "Creación y producción literaria, artística, científica o técnica, así como publicaciones derivadas."
      ]
    }
  ]
};
