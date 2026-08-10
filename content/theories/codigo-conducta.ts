import type { TheorySection } from "../lesson-theory";

export const codigoConductaTheory: TheorySection = {
  introduction: `El Título III, Capítulo VI del Estatuto Básico del Empleado Público (EBEP), aprobado por el Real Decreto Legislativo 5/2015, de 30 de octubre, regula los deberes de los empleados públicos y configura el Código de Conducta. Este código está integrado por los principios éticos (artículo 53) y los principios de conducta (artículo 54).

Los principios del Código de Conducta son de obligado cumplimiento para todo el personal al servicio de las Administraciones Públicas y de las Entidades Públicas Empresariales como ADIF. Su relevancia estriba en que no constituyen meras recomendaciones morales, sino que informan directamente la interpretación y aplicación del régimen disciplinario (Título VII del EBEP). Una infracción grave de estos principios puede traducirse en sanciones disciplinarias de suspensión de funciones o despido disciplinario del empleado.`,

  concepts: [
    {
      title: "Los Deberes de los empleados públicos (Art. 52)",
      description: "Los empleados públicos deben desempeñar con diligencia las tareas asignadas y velar por los intereses generales con sujeción a la Constitución y al ordenamiento jurídico. Su actuación se rige por los principios de objetividad, integridad, neutralidad, responsabilidad, imparcialidad, confidencialidad, dedicación al servicio público, transparencia, ejemplaridad, austeridad, accesibilidad, eficacia, honradez y respeto a la igualdad."
    },
    {
      title: "Los Principios Éticos (Art. 53 EBEP)",
      description: "Son normas que rigen la rectitud moral y la objetividad del empleado. Destacan: (1) Respeto estricto a la Constitución y al ordenamiento. (2) Neutralidad e imparcialidad en la toma de decisiones, sin influencias de intereses personales o de partidos. (3) Abstención en asuntos en los que tenga interés personal o conflicto de intereses. (4) Prohibición absoluta de aceptar regalos, favores o tratos de favor de particulares. (5) Deber de confidencialidad y secreto respecto a materias clasificadas y discreción profesional."
    },
    {
      title: "Los Principios de Conducta (Art. 54 EBEP)",
      description: "Son reglas prácticas de comportamiento en el desempeño de la actividad laboral diaria. Destacan: (1) Trato respetuoso y atento a los ciudadanos, superiores y compañeros. (2) Cumplimiento diligente de la jornada laboral y del horario establecido. (3) Obligación de cumplir las órdenes de los superiores, salvo que constituyan una infracción manifiesta del ordenamiento jurídico (en cuyo caso deben ponerse en conocimiento de la inspección). (4) Administración de los recursos públicos con criterios de austeridad y prohibición de usarlos para beneficio propio. (5) Mantener actualizada su formación profesional."
    },
    {
      title: "La objeción a las órdenes de los superiores (Art. 54.3)",
      description: "El principio de jerarquía obliga al cumplimiento de las órdenes recibidas de los superiores. No obstante, existe una excepción constitucional y legal: si una orden implica la comisión de una infracción manifiesta del ordenamiento jurídico (ilegalidad evidente o constitutiva de delito), el empleado público tiene la obligación de NO obedecerla, debiendo informar de inmediato a los órganos de inspección o control correspondientes para salvaguardar la legalidad de la administración."
    },
    {
      title: "El secreto profesional y la confidencialidad",
      description: "Derivado del artículo 53.12 del EBEP, los empleados públicos deben guardar secreto sobre los asuntos que conozcan por razón de su cargo y no utilizarlos en beneficio propio o de terceros. En el ámbito de ADIF, esto incluye datos de carácter industrial de operadores privados, itinerarios de mercancías de alta seguridad o información confidencial sobre licitaciones de obras públicas."
    },
    {
      title: "Vinculación con el régimen disciplinario (Título VII)",
      description: "Los principios éticos y de conducta definidos en el EBEP sirven como base tipificadora de las faltas disciplinarias. El incumplimiento de los deberes del Código de Conducta puede considerarse falta muy grave, grave o leve en función de la intencionalidad, el perjuicio causado a la administración o a los ciudadanos, y la reincidencia del empleado."
    }
  ],

  examples: [
    {
      situation: "Un responsable de circulación de ADIF recibe la orden de un supervisor superior para que priorice el paso de un tren de pasajeros privado sin justificación técnica y retrasando la circulación del operador público, para favorecer los intereses económicos de un familiar que trabaja en la empresa privada.",
      application: "La orden infringe el deber de imparcialidad y el principio de neutralidad (Art. 53). Además, constituye una orden de favor personal. El empleado debe abstenerse de aplicarla si implica una infracción manifiesta del ordenamiento y comunicar el conflicto de intereses y la instrucción recibida a los canales de inspección internos de ADIF."
    },
    {
      situation: "Un técnico de mantenimiento de telecomunicaciones de ADIF utiliza la furgoneta de la empresa pública durante el fin de semana para realizar mudanzas privadas de sus familiares directos.",
      application: "Infracción directa del Artículo 54.7 del EBEP (Principios de Conducta): los recursos públicos deben administrarse con austeridad y no pueden utilizarse en provecho propio o de terceros. El uso no autorizado de bienes de la empresa pública constituye una falta disciplinaria sancionable."
    },
    {
      situation: "Un empleado que trabaja en el departamento de compras y contratación de ADIF acepta una invitación de fin de semana con todos los gastos pagados por parte de una constructora que se presenta a una licitación de obras de vía férrea.",
      application: "Incumplimiento grave del Artículo 53.6 (Principios Éticos): los empleados públicos no pueden aceptar ningún regalo, favor o servicio de particulares que vaya más allá de los usos de cortesía. Aceptar este viaje compromete su imparcialidad y es constitutivo de falta muy grave y posible delito de cohecho."
    }
  ],

  reviewTakeaways: [
    "El Código de Conducta se divide en Principios Éticos (rectitud moral, imparcialidad) y Principios de Conducta (comportamiento profesional, jornada).",
    "Los principios éticos y de conducta no son meras directrices morales: son vinculantes y fundamentan el régimen disciplinario del EBEP.",
    "El deber de abstención obliga a apartarse de cualquier asunto que genere un conflicto de intereses personales o familiares.",
    "Las órdenes de superiores que impliquen infracciones manifiestas de la ley NO deben obedecerse y deben denunciarse a la inspección.",
    "Se prohíbe el uso de bienes, recursos o furgonetas de ADIF para uso personal o provecho privado de terceros.",
    "El secreto profesional obliga a no divulgar información confidencial conocida en el desempeño de las funciones ferroviarias."
  ]
};
