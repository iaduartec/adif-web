import type { TheorySection } from "../lesson-theory";

export const incompatibilidadesTheory: TheorySection = {
  introduction: `La Ley 53/1984, de 26 de diciembre, de Incompatibilidades del Personal al Servicio de las Administraciones Públicas, constituye la norma básica estatal que regula el régimen de dedicación del personal público. Esta ley tiene como objetivo garantizar la imparcialidad, la independencia y la objetividad de los empleados públicos en el ejercicio de sus funciones, evitando cualquier conflicto de intereses con actividades privadas u otros cargos públicos.

Resulta de aplicación directa a los empleados de las Entidades Públicas Empresariales, lo que incluye expresamente a todo el personal operativo y técnico de ADIF. El principio general de la ley es la dedicación a un solo puesto de trabajo en el sector público, estableciendo un régimen restrictivo de autorizaciones y prohibiciones, así como límites económicos estrictos en los casos excepcionales en que se permita la compatibilidad.`,

  concepts: [
    {
      title: "El principio general de dedicación única (Art. 1)",
      description: "El personal comprendido en el ámbito de aplicación no podrá compatibilizar sus actividades con el desempeño de un segundo puesto de trabajo, cargo o actividad en el sector público, salvo en los casos autorizados por ley. Asimismo, se prohíbe la percepción de más de una retribución con cargo a los presupuestos de las Administraciones Públicas o entidades dependientes. Las actividades privadas compatibles no pueden menoscabar el estricto cumplimiento de sus deberes ni comprometer su independencia."
    },
    {
      title: "Ámbito de aplicación de la Ley (Art. 2)",
      description: "La ley es de aplicación a: (a) el personal de la Administración General del Estado, Autonómica y Local; (b) los entes, agencias y organismos públicos; (c) el personal al servicio de las Entidades Públicas Empresariales (como ADIF y ADIF-AV); (d) las sociedades mercantiles con participación pública directa o indirecta superior al 50%; (e) los órganos constitucionales."
    },
    {
      title: "Excepciones en el Sector Público: Docencia y Sanidad (Arts. 3 a 5)",
      description: "Solo se podrá autorizar la compatibilidad para el desempeño de un segundo puesto de trabajo en el sector público en las siguientes áreas específicas y bajo interés público: (1) Función docente como Profesor Universitario Asociado con dedicación a tiempo parcial. (2) Función sanitaria a tiempo parcial en centros hospitalarios públicos de distinta localidad. (3) Cargos electivos de representación en Corporaciones Locales (concejales, diputados provinciales) siempre que no sea en régimen de dedicación exclusiva. Toda compatibilidad pública requiere resolución expresa previa."
    },
    {
      title: "Límites retributivos de la doble actividad pública (Art. 7)",
      description: "La autorización de compatibilidad en el sector público está sujeta a límites económicos rigurosos: (1) La suma de las retribuciones de ambos puestos no podrá superar la remuneración prevista en los Presupuestos Generales del Estado para el cargo de Director General. (2) Tampoco podrá superar la retribución del puesto principal incrementada en un porcentaje según el grupo funcionarial/laboral: 30% para Grupo A (A1/A2), 35% para Grupo B, 40% para Grupo C (C1/C2), 45% para Grupo D y 50% para Grupo E. Los servicios del segundo puesto no computan para trienios ni derechos pasivos."
    },
    {
      title: "Prohibiciones absolutas en el Sector Privado (Arts. 11 y 12)",
      description: "Queda terminantemente prohibido a todo el personal público realizar actividades privadas que guarden relación directa con las funciones del departamento o entidad donde esté destinado. Específicamente, no podrán: (a) pertenecer a consejos de administración o cargos directivos en empresas contratistas, concesionarias o subvencionadas por ADIF o el Ministerio; (b) poseer una participación superior al 10% del capital social de dichas empresas contratistas; (c) intervenir profesionalmente en asuntos en los que hayan intervenido o deban intervenir por razón de su cargo en los últimos dos años."
    },
    {
      title: "Procedimiento de autorización de compatibilidad privada (Art. 14)",
      description: "El ejercicio de cualquier actividad profesional, laboral, mercantil o industrial en el sector privado requiere la solicitud previa y el reconocimiento expreso de compatibilidad por parte de la autoridad competente (en el caso de ADIF, el Ministerio de Hacienda y Función Pública o el órgano delegado de la entidad). El plazo de resolución es de dos meses; transcurrido este plazo sin respuesta, se entiende desestimada (silencio negativo). El reconocimiento no modifica la jornada de trabajo y queda sin efecto automáticamente si el empleado cambia de puesto dentro de ADIF."
    },
    {
      title: "Actividades exceptuadas de autorización (Art. 19)",
      description: "Son actividades libres que el empleado público puede realizar sin necesidad de solicitar compatibilidad previa: (1) La administración del patrimonio personal o familiar. (2) La producción y creación literaria, artística, científica y técnica, así como su publicación. (3) La participación ocasional en coloquios, programas de radio o televisión. (4) La dirección de seminarios o cursos en centros oficiales de formación del profesorado o de la administración que no superen las 75 horas anuales. (5) La participación en tribunales de oposiciones."
    }
  ],

  examples: [
    {
      situation: "Un oficial de telecomunicaciones de ADIF que realiza el mantenimiento de la red de fibra óptica ferroviaria en su jornada de mañana solicita trabajar por las tardes como instalador de telecomunicaciones autónomo para una empresa privada que se presenta a licitaciones de ADIF.",
      application: "La solicitud de compatibilidad debe ser denegada. El artículo 12.1 c) de la Ley 53/1984 prohíbe expresamente realizar actividades privadas o desempeñar empleos en empresas contratistas o adjudicatarias de servicios de la administración pública a la que pertenece el empleado. Al ser una empresa contratista de ADIF, existe un conflicto de intereses insalvable."
    },
    {
      situation: "Una ingeniera de ADIF escribe una novela de ficción por las noches y la publica en una editorial privada, percibiendo derechos de autor por las ventas del libro sin haber solicitado compatibilidad previa.",
      application: "La actuación es completamente legal. Conforme al artículo 19 b) de la Ley 53/1984, la producción y creación literaria, artística o científica, así como la percepción de los derechos de autor que de ella se deriven, están exceptuadas del régimen de incompatibilidades y no requieren autorización previa del organismo público."
    },
    {
      situation: "Un empleado de ADIF solicita compatibilidad para dar clases en una universidad pública como profesor asociado durante 4 horas semanales. Sus ingresos totales de ADIF son de 30.000 € y de la universidad son de 5.000 €.",
      application: "La compatibilidad es viable: cumple el requisito de interés público (docencia universitaria) y la jornada es a tiempo parcial. Además, los ingresos extras (5.000 €) representan un incremento del 16,6% sobre su salario de ADIF, situándose muy por debajo del límite del 30%-40% establecido por el artículo 7 según su grupo profesional. Requiere resolución favorable expresa antes de iniciar las clases."
    }
  ],

  reviewTakeaways: [
    "Dedicación única: principio general de un solo puesto público y una sola retribución pública.",
    "La Ley 53/1984 aplica a funcionarios, personal laboral común y expresamente a Entidades Públicas Empresariales (ADIF).",
    "La compatibilidad en el sector público es excepcional y se limita a docencia universitaria y sanidad a tiempo parcial.",
    "Límites retributivos públicos: el total de retribuciones no puede superar el sueldo de un Director General, ni el puesto principal incrementado en un porcentaje por grupo (30%-50%).",
    "Prohibición absoluta privada: prohibido trabajar para empresas contratistas de ADIF o poseer más de un 10% de su capital.",
    "El silencio administrativo en solicitudes de compatibilidad es de carácter NEGATIVO (dos meses sin resolución equivale a denegación).",
    "Creación artística, literaria y científica: libre de autorización previa y 100% compatible por ley."
  ]
};
