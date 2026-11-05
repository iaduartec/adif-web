import type { TheorySection } from "../lesson-theory";

const reviewedIncompatibilidades = {
  status: "reviewed",
  reviewedAt: "2026-11-02",
  reviewedBy: "opencode-editorial",
  confidence: {
    level: "high",
    reason: "Contenido trazado a Ley 53/1984 consolidada (BOE) y fuentes oficiales ADIF; revisado en Ciclo 4.",
  },
} as const;

export const incompatibilidadesTheory: TheorySection = {
  sources: [
    {
      id: "l53-1984-art1-3",
      sourceId: "Ley 53/1984",
      sourceTitle: "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 1.3",
      excerpt: "El desempeño de un puesto por el personal incluido en la Ley es incompatible con actividades públicas o privadas que puedan impedir o menoscabar el estricto cumplimiento de sus deberes o comprometer su imparcialidad o independencia."
    },
    {
      id: "l53-1984-pre",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Preámbulo",
      excerpt: "La nueva regulación de las incompatibilidades parte del principio de dedicación a un solo puesto de trabajo, sin más excepciones que las que demande el propio servicio público, respetando las actividades privadas que no puedan impedir o menoscabar el estricto cumplimiento de los deberes o comprometer la imparcialidad o independencia. La Ley viene a cumplimentar el mandato de los artículos 103.3 y 149.1.18 de la Constitución."
    },
    {
      id: "l53-1984-art1",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 1",
      excerpt: "1. El personal comprendido en el ámbito de aplicación de esta Ley no podrá compatibilizar sus actividades con el desempeño, por sí o mediante sustitución, de un segundo puesto de trabajo, cargo o actividad en el sector público, salvo en los supuestos previstos en la misma. 2. Además, no se podrá percibir, salvo en los supuestos previstos en esta Ley, más de una remuneración con cargo a los presupuestos de las Administraciones Públicas... 3. En cualquier caso, el desempeño de un puesto de trabajo por el personal incluido en el ámbito de aplicación de esta Ley será incompatible con el ejercicio de cualquier cargo, profesión o actividad, público o privado, que pueda impedir o menoscabar el estricto cumplimiento de sus deberes o comprometer su imparcialidad o independencia."
    },
    {
      id: "l53-1984-art2",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 2",
      excerpt: "La presente Ley será de aplicación a: a) El personal civil y militar al servicio de la Administración del Estado y de sus Organismos Públicos. b) El personal al servicio de las Administraciones de las Comunidades Autónomas... d) El personal al servicio de Entes y Organismos públicos... g) El personal al servicio de entidades, corporaciones de derecho público, fundaciones y consorcios cuyos presupuestos se doten ordinariamente en más de un 50 por cien con subvenciones u otros ingresos procedentes de las Administraciones Públicas. h) El personal que preste servicios en Empresas en que la participación del capital, directa o indirectamente, de las Administraciones Públicas sea superior al 50 por 100. 2. En el ámbito delimitado en el apartado anterior se entenderá incluido todo el personal, cualquiera que sea la naturaleza jurídica de la relación de empleo."
    },
    {
      id: "l53-1984-art3",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 3",
      excerpt: "El personal comprendido en el ámbito de aplicación de esta Ley sólo podrá desempeñar un segundo puesto de trabajo o actividad en el sector público en los supuestos previstos en la misma para las funciones docente y sanitaria, en los casos a que se refieren los artículo 5 y 6 y en los que, por razón de interés público, se determine por el Consejo de Ministros, mediante Real Decreto, u órgano de gobierno de la Comunidad Autónoma... Para el ejercicio de la segunda actividad será indispensable la previa y expresa autorización de compatibilidad... En todo caso la autorización de compatibilidad se efectuará en razón del interés público. 2. El desempeño de un puesto de trabajo en el sector público es incompatible con la percepción de pensión de jubilación o retiro por Derechos Pasivos o por cualquier régimen de Seguridad Social público y obligatorio."
    },
    {
      id: "l53-1984-art4",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 4.1",
      excerpt: "Podrá autorizarse la compatibilidad, cumplidas las restantes exigencias de esta ley, para el desempeño de un puesto de trabajo en la esfera docente como Profesor universitario asociado en régimen de dedicación no superior a la de tiempo parcial. Al personal docente e investigador de la Universidad podrá autorizarse la compatibilidad para el desempeño de un segundo puesto de trabajo en el sector público sanitario o de carácter exclusivamente investigador... Recíprocamente, a quienes desempeñen uno de los definidos como segundo puesto podrá autorizarse la compatibilidad para desempeñar uno de los puestos docentes universitarios."
    },
    {
      id: "l53-1984-art5",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 5",
      excerpt: "Por excepción, el personal incluido en el ámbito de aplicación de esta Ley podrá compatibilizar sus actividades con el desempeño de los cargos electivos siguientes: a) Miembros de las Asambleas Legislativas de las Comunidades Autónomas, salvo que perciban retribuciones periódicas por el desempeño de la función o que por las mismas se establezca la incompatibilidad. b) Miembros de las Corporaciones locales, salvo que desempeñen en las mismas cargos retribuidos en régimen de dedicación exclusiva. En los supuestos comprendidos en este artículo sólo podrá percibirse la retribución correspondiente a una de las dos actividades, sin perjuicio de las dietas, indemnizaciones o asistencias que correspondan por la otra."
    },
    {
      id: "l53-1984-art6",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 6",
      excerpt: "Sin perjuicio de lo previsto en el artículo 4.3, excepcionalmente podrá autorizarse al personal incluido en el ámbito de esta ley la compatibilidad para el ejercicio de actividades de investigación de carácter no permanente, o de asesoramiento científico o técnico en supuestos concretos, que no correspondan a las funciones del personal adscrito a las respectivas Administraciones Públicas. El personal investigador al servicio de los Organismos Públicos de Investigación, de las Universidades públicas y de otras entidades de investigación dependientes de las Administraciones Públicas, podrá ser autorizado a prestar servicios en sociedades creadas o participadas por los mismos."
    },
    {
      id: "l53-1984-art7",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 7",
      excerpt: "Será requisito necesario para autorizar la compatibilidad de actividades públicas el que la cantidad total percibida por ambos puestos o actividades no supere la remuneración prevista en los Presupuestos Generales del Estado para el cargo de Director General, ni supere la correspondiente al principal, estimada en régimen de dedicación ordinaria, incrementada en: un 30 por 100 para los funcionarios del grupo A o personal de nivel equivalente; un 35 por 100 para el grupo B; un 40 por 100 para el grupo C; un 45 por 100 para el grupo D; un 50 por 100 para el grupo E. La superación de estos límites, en cómputo anual, requiere en cada caso acuerdo expreso del Gobierno, órgano competente de las Comunidades Autónomas o Pleno de las Corporaciones Locales en base a razones de especial interés para el servicio. 2. Los servicios prestados en el segundo puesto o actividad no se computarán a efectos de trienios ni de derechos pasivos."
    },
    {
      id: "l53-1984-art8",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 8",
      excerpt: "El personal incluido en el ámbito de aplicación de esta Ley que en representación del sector público pertenezca a Consejos de Administración u órganos de gobierno de Entidades o Empresas públicas o privadas, sólo podrá percibir las dietas o indemnizaciones que correspondan por su asistencia a los mismos, ajustándose en su cuantía al régimen general previsto para las Administraciones Públicas. Las cantidades devengadas por cualquier otro concepto serán ingresadas directamente por la Entidad o Empresa en la Tesorería pública que corresponda. No se podrá pertenecer a más de dos Consejos de Administración u órganos de gobierno, salvo que excepcionalmente se autorice para supuestos concretos mediante acuerdo del Gobierno, órgano competente de la Comunidad Autónoma o Pleno de la Corporación Local correspondiente."
    },
    {
      id: "l53-1984-art9",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 9",
      excerpt: "La autorización o denegación de compatibilidad para un segundo puesto o actividad del sector público corresponde al Ministerio de la Presidencia, a propuesta de la Subsecretaría del Departamento correspondiente, al órgano competente de la Comunidad Autónoma o al Pleno de la Corporación Local a que figure adscrito el puesto principal, previo informe, en su caso, de los Directores de los Organismos, Entes y Empresas públicas. Dicha autorización requiere además el previo informe favorable del órgano competente de la Comunidad Autónoma o Pleno de la Corporación Local, conforme a la adscripción del segundo puesto. Si los dos puestos correspondieran a la Administración del Estado, emitirá este informe la Subsecretaría del Departamento al que corresponda el segundo puesto."
    },
    {
      id: "l53-1984-art10",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 10",
      excerpt: "Quienes accedan por cualquier título a un nuevo puesto del sector público que con arreglo a esta Ley resulte incompatible con el que vinieran desempeñando habrán de optar por uno de ellos dentro del plazo de toma de posesión. A falta de opción en el plazo señalado se entenderá que optan por el nuevo puesto, pasando a la situación de excedencia voluntaria en los que vinieran desempeñando. Si se tratara de puestos susceptibles de compatibilidad, previa autorización, deberán instarla en los diez primeros días del aludido plazo de toma de posesión, entendiéndose éste prorrogado en tanto recae resolución."
    },
    {
      id: "l53-1984-art11",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 11",
      excerpt: "1. De acuerdo con lo dispuesto en el artículo 1.3, el personal comprendido en su ámbito de aplicación no podrá ejercer, por sí o mediante sustitución, actividades privadas, incluidas las de carácter profesional, sean por cuenta propia o bajo la dependencia o al servicio de Entidades o particulares que se relacionen directamente con las que desarrolle el Departamento, Organismo o Entidad donde estuviera destinado. Se exceptúan de dicha prohibición las actividades particulares que, en ejercicio de un derecho legalmente reconocido, realicen para sí los directamente interesados. 2. El Gobierno, por Real Decreto, podrá determinar, con carácter general, las funciones, puestos o colectivos del sector público, incompatibles con determinadas profesiones o actividades privadas, que puedan comprometer la imparcialidad o independencia del personal de que se trate, impedir o menoscabar el estricto cumplimiento de sus deberes o perjudicar los intereses generales."
    },
    {
      id: "l53-1984-art12",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 12",
      excerpt: "1. En todo caso, el personal comprendido en el ámbito de aplicación de esta Ley no podrá ejercer las actividades siguientes: a) El desempeño de actividades privadas, incluidas las de carácter profesional, sea por cuenta propia o bajo la dependencia o al servicio de Entidades o particulares, en los asuntos en que esté interviniendo, haya intervenido en los dos últimos años o tenga que intervenir por razón del puesto público. Se incluyen en especial en esta incompatibilidad las actividades profesionales prestadas a personas a quienes se esté obligado a atender en el desempeño del puesto público. b) La pertenencia a Consejos de Administración u órganos rectores de Empresas o Entidades privadas, siempre que la actividad de las mismas esté directamente relacionada con las que gestione el Departamento, Organismo o Entidad en que preste sus servicios el personal afectado. c) El desempeño, por sí o por persona interpuesta, de cargos de todo orden en Empresas o Sociedades concesionarias, contratistas de obras, servicios o suministros, arrendatarias o administradoras de monopolios, o con participación o aval del sector público, cualquiera que sea la configuración jurídica de aquéllas. d) La participación superior al 10 por 100 en el capital de las Empresas o Sociedades a que se refiere el párrafo anterior. 2. Las actividades privadas que correspondan a puestos de trabajo que requieran la presencia efectiva del interesado durante un horario igual o superior a la mitad de la jornada semanal ordinaria de trabajo en las Administraciones Públicas sólo podrán autorizarse cuando la actividad pública sea una de las enunciadas en esta Ley como de prestación a tiempo parcial."
    },
    {
      id: "l53-1984-art13",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 13",
      excerpt: "No podrá reconocerse compatibilidad alguna para actividades privadas a quienes se les hubiere autorizado la compatibilidad para un segundo puesto o actividad públicos, siempre que la suma de jornadas de ambos sea igual o superior a la máxima en las Administraciones Públicas."
    },
    {
      id: "l53-1984-art14",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 14",
      excerpt: "El ejercicio de actividades profesionales, laborales, mercantiles o industriales fuera de las Administraciones Públicas requerirá el previo reconocimiento de compatibilidad. La resolución motivada reconociendo la compatibilidad o declarando la incompatibilidad, que se dictará en el plazo de dos meses, corresponde al Ministerio de la Presidencia, a propuesta del Subsecretario del Departamento correspondiente; al órgano competente de la Comunidad Autónoma o al Pleno de la Corporación Local, previo informe, en su caso, de los Directores de los Organismos, Entes y Empresas públicas. Los reconocimientos de compatibilidad no podrán modificar la jornada de trabajo y horario del interesado y quedarán automáticamente sin efecto en caso de cambio de puesto en el sector público. Quienes se hallen autorizados para el desempeño de un segundo puesto o actividad públicos deberán instar el reconocimiento de compatibilidad con ambos."
    },
    {
      id: "l53-1984-art15",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 15",
      excerpt: "El personal a que se refiere esta Ley no podrá invocar o hacer uso de su condición pública para el ejercicio de actividad mercantil, industrial o profesional."
    },
    {
      id: "l53-1984-art16",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 16",
      excerpt: "1. No podrá autorizarse o reconocerse compatibilidad al personal funcionario, al personal eventual y al personal laboral cuando las retribuciones complementarias que tengan derecho a percibir del apartado b) del artículo 24 del presente Estatuto incluyan el factor de incompatibilidad al retribuido por arancel y al personal directivo, incluido el sujeto a la relación laboral de carácter especial de alta dirección. 2. A efectos de lo dispuesto en el presente artículo, la dedicación del profesorado universitario a tiempo completo tiene la consideración de especial dedicación. 3. Se exceptúan de la prohibición enunciada en el apartado 1, las autorizaciones de compatibilidad para ejercer como Profesor universitario asociado en los términos del apartado 1 del artículo 4, así como para realizar las actividades de investigación o asesoramiento a que se refiere el artículo 6 de esta Ley, salvo para el personal docente universitario a tiempo completo. 4. Asimismo, por excepción y sin perjuicio de las limitaciones establecidas en los artículos 1.3, 11, 12 y 13 de la presente Ley, podrá reconocerse compatibilidad para el ejercicio de actividades privadas al personal que desempeñe puestos de trabajo que comporten la percepción de complementos específicos, o concepto equiparable, cuya cuantía no supere el 30 por 100 de su retribución básica, excluidos los conceptos que tengan su origen en la antigüedad."
    },
    {
      id: "l53-1984-art18",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 18",
      excerpt: "Todas las resoluciones de compatibilidad para desempeñar un segundo puesto o actividad en el sector público o el ejercicio de actividades privadas se inscribirán en los Registros de Personal correspondientes. Este requisito será indispensable, en el primer caso, para que puedan acreditarse haberes a los afectados por dicho puesto o actividad."
    },
    {
      id: "l53-1984-art19",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 19",
      excerpt: "Quedan exceptuadas del régimen de incompatibilidades de la presente Ley las actividades siguientes: a) Las derivadas de la Administración del patrimonio personal o familiar, sin perjuicio de lo dispuesto en el artículo 12. b) La dirección de seminarios o el dictado de cursos o conferencias en Centros oficiales destinados a la formación de funcionarios o profesorado, cuando no tenga carácter permanente o habitual ni supongan más de setenta y cinco horas al año, así como la preparación para el acceso a la función pública en los casos y forma que reglamentariamente se determine. c) La participación en Tribunales calificadores de pruebas selectivas para ingreso en las Administraciones Públicas. d) La participación del personal docente en exámenes, pruebas o evaluaciones distintas de las que habitualmente les correspondan. e) El ejercicio del cargo de Presidente, Vocal o miembro de Juntas rectoras de Mutualidades o Patronatos de Funcionarios, siempre que no sea retribuido. f) La producción y creación literaria, artística, científica y técnica, así como las publicaciones derivadas de aquéllas, siempre que no se originen como consecuencia de una relación de empleo o de prestación de servicios. g) La participación ocasional en coloquios y programas en cualquier medio de comunicación social. h) La colaboración y la asistencia ocasional a Congresos, seminarios, conferencias o cursos de carácter profesional."
    },
    {
      id: "l53-1984-art20",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 20",
      excerpt: "1. El incumplimiento de lo dispuesto en los artículos anteriores será sancionado conforme al régimen disciplinario de aplicación, sin perjuicio de la ejecutividad de la incompatibilidad en que se haya incurrido. 2. El ejercicio de cualquier actividad compatible no servirá de excusa al deber de residencia, a la asistencia al lugar de trabajo que requiera su puesto o cargo, ni al atraso, negligencia o descuido en el desempeño de los mismos. Las correspondientes faltas serán calificadas y sancionadas conforme a las normas que se contengan en el régimen disciplinario aplicable, quedando automáticamente revocada la autorización o reconocimiento de compatibilidad si en la resolución correspondiente se califica de falta grave o muy grave. 3. Los órganos a los que competa la dirección, inspección o jefatura de los diversos servicios cuidarán bajo su responsabilidad de prevenir o corregir, en su caso, las incompatibilidades en que pueda incurrir el personal."
    }
  ],
  introduction: [
    {
      id: "incomp-intro-1",
      text: "La Ley 53/1984 regula las incompatibilidades para garantizar la dedicación única y la imparcialidad del personal de las Administraciones Públicas.",
      kind: "normative",
      legalBasis: ["l53-1984-pre"]
    },
    {
      id: "incomp-intro-2",
      text: "Se aplica de forma preceptiva al personal laboral y técnico contratado en Entidades Públicas Empresariales, como ADIF.",
      kind: "normative",
      legalBasis: ["l53-1984-art2"]
    }
  ],
  concepts: [
    {
      id: "incomp-concept-1",
      title: "Principio de Dedicación Única",
      claims: [
        {
          id: "incomp-c1-1",
          text: "Como regla general se prohíbe compatibilizar un segundo puesto, cargo o actividad en el sector público, salvo los supuestos de la ley. La ley también limita percibir más de una remuneración con cargo a presupuestos públicos u otros fondos comprendidos en ella, con sus excepciones.",
          kind: "normative",
          legalBasis: ["l53-1984-art1"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con el artículo 1, apartados 1 y 2, de la Ley 53/1984 en BOE." } }
        },
        {
          id: "incomp-c1-2",
          text: "A efectos de la limitación del artículo 1, remuneración es cualquier derecho de contenido económico derivado directa o indirectamente de una prestación o servicio personal, sea fijo o variable y de devengo periódico u ocasional.",
          kind: "normative",
          legalBasis: ["l53-1984-art1"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Definición cotejada con el artículo 1.2 de la Ley 53/1984 en BOE." } }
        },
        {
          id: "incomp-c1-3",
          text: "Además de las reglas sobre segundo puesto y remuneraciones, el artículo 1.3 establece una incompatibilidad general para el personal incluido en la Ley: ningún cargo, profesión o actividad, pública o privada, puede impedir o menoscabar el cumplimiento estricto de los deberes del puesto ni comprometer la imparcialidad o independencia de quien lo desempeña. Por ejemplo, una actividad privada que interfiera con sus obligaciones o afecte a su imparcialidad entra en esta prohibición; no basta con que se realice fuera de la jornada.",
          kind: "normative",
          legalBasis: ["l53-1984-art1-3"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Regla general cotejada con el artículo 1.3 de la Ley 53/1984 en BOE; ejemplo didáctico." } }
        }
      ]
    },
    {
      id: "incomp-concept-2",
      title: "Ámbito de la Ley",
      claims: [
        {
          id: "incomp-c2-1",
          text: "Abarca, entre otros, al personal de las Administraciones estatal, autonómicas y locales y de sus organismos. Incluye asimismo a entidades, corporaciones de derecho público, fundaciones y consorcios cuyos presupuestos se doten ordinariamente en más de un 50 % con subvenciones u otros ingresos de Administraciones públicas, y a empresas con participación pública directa o indirecta en su capital superior al 50 %. El artículo 2 enumera otros colectivos y alcanza al personal incluido cualquiera que sea la naturaleza jurídica de su relación de empleo.",
          kind: "normative",
          legalBasis: ["l53-1984-art2"],
          review: reviewedIncompatibilidades
        }
      ]
    },
    {
      id: "incomp-concept-3",
      title: "Excepciones de Doble Puesto Público",
      claims: [
        {
          id: "incomp-c3-1",
          text: "El apartado primero del artículo 3 contempla las funciones docente y sanitaria, los supuestos de los artículos 5 y 6 y otros que se determinen por razón de interés público por el Consejo de Ministros mediante real decreto o por el órgano de gobierno autonómico, en sus respectivas competencias. El artículo añade que, en este último supuesto, la actividad solo podrá prestarse en régimen laboral, a tiempo parcial y de duración determinada. La autorización previa y expresa se concede por interés público, no modifica la jornada ni el horario de los dos puestos y exige cumplirlos estrictamente en ambos. Como supuesto docente específico, el artículo 4.1 permite autorizar el puesto de Profesor universitario asociado con dedicación no superior a la de tiempo parcial, cumplidas las restantes exigencias de la Ley.",
          kind: "normative",
          legalBasis: ["l53-1984-art3", "l53-1984-art4", "l53-1984-art5", "l53-1984-art6"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con los artículos 3 a 6 de la Ley 53/1984; los supuestos y condiciones específicos se mantienen separados." } }
        }
      ]
    },
    {
      id: "incomp-concept-4",
      title: "Límites Económicos de Compatibilidad Pública",
      claims: [
        {
          id: "incomp-c4-1",
          text: "Para autorizar la compatibilidad de actividades públicas, la suma de las cantidades percibidas no debe superar los dos límites del artículo 7: la retribución prevista en presupuestos para Director General y la del puesto principal en dedicación ordinaria incrementada según el grupo o nivel equivalente. Superarlos en cómputo anual requiere acuerdo expreso del órgano previsto por la ley por razones de especial interés para el servicio.",
          kind: "normative",
          legalBasis: ["l53-1984-art7"],
          review: { status: "reviewed", reviewedAt: "2026-11-04", reviewedBy: "codex", confidence: { level: "high", reason: "Cotejado con el artículo 7 de la Ley 53/1984, incluida la excepción por acuerdo expreso." } }
        }
      ]
    },
    {
      id: "incomp-concept-5",
      title: "Consejos de Administración y Órganos de Gobierno",
      claims: [
        {
          id: "incomp-c5-1",
          text: "El personal que represente al sector público en Consejos de Administración u órganos de gobierno de entidades o empresas públicas o privadas solo podrá percibir dietas o indemnizaciones por asistencia, conforme al régimen general; las cantidades devengadas por otros conceptos se ingresan directamente por la entidad o empresa en la Tesorería pública correspondiente. No podrá pertenecer a más de dos de esos órganos, salvo acuerdo excepcional para casos concretos del Gobierno, órgano autonómico competente o Pleno de la corporación local correspondiente.",
          kind: "normative",
          legalBasis: ["l53-1984-art8"],
          review: reviewedIncompatibilidades
        }
      ]
    },
    {
      id: "incomp-concept-6",
      title: "Procedimiento de Autorización de Compatibilidad Pública",
      claims: [
        {
          id: "incomp-c6-1",
          text: "La autorización o denegación de compatibilidad para un segundo puesto o actividad del sector público corresponde al Ministerio de la Presidencia, a propuesta de la Subsecretaría correspondiente, al órgano competente autonómico o al Pleno de la corporación local a que se adscriba el puesto principal, previo informe, en su caso, de los directores de organismos, entes y empresas públicas. La autorización requiere además informe previo favorable según la adscripción del segundo puesto; si ambos corresponden a la Administración del Estado, lo emite la Subsecretaría del departamento del segundo puesto.",
          kind: "normative",
          legalBasis: ["l53-1984-art9"],
          review: reviewedIncompatibilidades
        }
      ]
    },
    {
      id: "incomp-concept-7",
      title: "Opción al Acceder a un Nuevo Puesto",
      claims: [
        {
          id: "incomp-c7-1",
          text: "Quienes accedan a un nuevo puesto público incompatible con el anterior deben optar dentro del plazo de toma de posesión; si no optan, se entiende elegido el nuevo y pasan a excedencia voluntaria en el anterior. Si los puestos son susceptibles de compatibilidad, previa autorización, deberán solicitarla en los diez primeros días de ese plazo, que se entiende prorrogado hasta que recaiga resolución.",
          kind: "normative",
          legalBasis: ["l53-1984-art10"],
          review: reviewedIncompatibilidades
        }
      ]
    },
    {
      id: "incomp-concept-8",
      title: "Prohibiciones Absolutas en el Ámbito Privado",
      claims: [
        {
          id: "incomp-c8-1",
          text: "El artículo 11 prohíbe actividades privadas, por cuenta propia o ajena, que se relacionen directamente con las que desarrolla el Departamento, Organismo o Entidad de destino. Exceptúa las actividades particulares que los interesados realicen para sí en ejercicio de un derecho legalmente reconocido.",
          kind: "normative",
          legalBasis: ["l53-1984-art11"],
          review: reviewedIncompatibilidades
        }
      ]
    },
    {
      id: "incomp-concept-9",
      title: "Incompatibilidades Absolutas con Actividades Privadas",
      claims: [
        {
          id: "incomp-c9-1",
          text: "El apartado primero del artículo 12 prohíbe actividades privadas en asuntos en que el personal intervenga, haya intervenido en los dos últimos años o deba intervenir por su puesto; pertenecer a órganos rectores de entidades privadas cuya actividad se relacione directamente con la gestionada por su entidad; desempeñar cargos en las empresas concesionarias, contratistas, arrendatarias o administradoras de monopolios, o con participación o aval del sector público, que describe la ley; y poseer una participación superior al 10 por 100 en el capital de las empresas a que se refiere la letra c.",
          kind: "normative",
          legalBasis: ["l53-1984-art12"],
          review: reviewedIncompatibilidades
        }
      ]
    },
    {
      id: "incomp-concept-10",
      title: "Incompatibilidad entre Compatibilidad Pública y Privada",
      claims: [
        {
          id: "incomp-c10-1",
          text: "No podrá reconocerse compatibilidad alguna para actividades privadas a quienes se les hubiere autorizado la compatibilidad para un segundo puesto o actividad públicos, siempre que la suma de jornadas de ambos sea igual o superior a la máxima en las Administraciones Públicas.",
          kind: "normative",
          legalBasis: ["l53-1984-art13"],
          review: reviewedIncompatibilidades
        }
      ]
    },
    {
      id: "incomp-concept-11",
      title: "Autorización de Compatibilidad Privada",
      claims: [
        {
          id: "incomp-c11-1",
          text: "El ejercicio de actividades profesionales, laborales, mercantiles o industriales fuera de las Administraciones Públicas requiere el previo reconocimiento de compatibilidad, que se resolverá mediante resolución motivada en el plazo de dos meses. Los reconocimientos no podrán modificar la jornada de trabajo y horario del interesado y quedarán automáticamente sin efecto en caso de cambio de puesto en el sector público. Todo ello sin perjuicio de las actividades exceptuadas del régimen por el artículo 19.",
          kind: "normative",
          legalBasis: ["l53-1984-art14", "l53-1984-art19"],
          review: reviewedIncompatibilidades
        }
      ]
    },
    {
      id: "incomp-concept-12",
      title: "Uso de la Condición Pública",
      claims: [
        {
          id: "incomp-c12-1",
          text: "El personal a que se refiere esta Ley no podrá invocar o hacer uso de su condición pública para el ejercicio de actividad mercantil, industrial o profesional.",
          kind: "normative",
          legalBasis: ["l53-1984-art15"],
          review: reviewedIncompatibilidades
        }
      ]
    },
    {
      id: "incomp-concept-13",
      title: "Limitaciones para Personal con Factor de Incompatibilidad",
      claims: [
        {
          id: "incomp-c13-1",
          text: "No podrá autorizarse o reconocerse compatibilidad al personal funcionario, eventual y laboral cuando las retribuciones complementarias incluyan el factor de incompatibilidad al retribuido por arancel y al personal directivo, incluido el sujeto a la relación laboral de carácter especial de alta dirección. Se exceptúan las autorizaciones para ejercer como Profesor universitario asociado y para realizar las actividades de investigación o asesoramiento reguladas en esta Ley, salvo para el personal docente universitario a tiempo completo. Por excepción, podrá reconocerse compatibilidad para el ejercicio de actividades privadas al personal que desempeñe puestos con complementos específicos cuya cuantía no supere el 30 por 100 de su retribución básica.",
          kind: "normative",
          legalBasis: ["l53-1984-art16"],
          review: reviewedIncompatibilidades
        }
      ]
    },
    {
      id: "incomp-concept-14",
      title: "Registro de Compatibilidades",
      claims: [
        {
          id: "incomp-c14-1",
          text: "Todas las resoluciones de compatibilidad para desempeñar un segundo puesto o actividad en el sector público o el ejercicio de actividades privadas se inscribirán en los Registros de Personal correspondientes. Este requisito será indispensable, en el primer caso, para que puedan acreditarse haberes a los afectados por dicho puesto o actividad.",
          kind: "normative",
          legalBasis: ["l53-1984-art18"],
          review: reviewedIncompatibilidades
        }
      ]
    },
    {
      id: "incomp-concept-15",
      title: "Actividades Exentas de Autorización",
      claims: [
        {
          id: "incomp-c15-1",
          text: "Quedan exceptuadas del régimen de incompatibilidades: la administración del patrimonio personal o familiar, sin perjuicio de las limitaciones del artículo 12; la dirección de seminarios o el dictado de cursos o conferencias en Centros oficiales destinados a la formación de funcionarios o profesorado (cuando no tenga carácter permanente o habitual ni supongan más de setenta y cinco horas al año); la participación en Tribunales calificadores de pruebas selectivas; la participación del personal docente en exámenes y pruebas distintas de las que habitualmente les correspondan; el ejercicio del cargo de Presidente, Vocal o miembro de Juntas rectoras de Mutualidades o Patronatos de Funcionarios, siempre que no sea retribuido; la producción y creación literaria, artística, científica y técnica, así como las publicaciones derivadas de aquéllas; la participación ocasional en coloquios y programas en cualquier medio de comunicación social; y la colaboración y asistencia ocasional a Congresos, seminarios, conferencias o cursos de carácter profesional.",
          kind: "normative",
          legalBasis: ["l53-1984-art19", "l53-1984-art12"],
          review: reviewedIncompatibilidades
        }
      ]
    },
    {
      id: "incomp-concept-16",
      title: "Sanciones por Incumplimiento",
      claims: [
        {
          id: "incomp-c16-1",
          text: "El incumplimiento de lo dispuesto en los artículos anteriores será sancionado conforme al régimen disciplinario de aplicación, sin perjuicio de la ejecutividad de la incompatibilidad en que se haya incurrido. El ejercicio de cualquier actividad compatible no servirá de excusa al deber de residencia, a la asistencia al lugar de trabajo que requiera su puesto o cargo, ni al atraso, negligencia o descuido en el desempeño de los mismos. Las correspondientes faltas serán calificadas y sancionadas conforme a las normas que se contengan en el régimen disciplinario aplicable, quedando automáticamente revocada la autorización o reconocimiento de compatibilidad si en la resolución correspondiente se califica de falta grave o muy grave.",
          kind: "normative",
          legalBasis: ["l53-1984-art20"],
          review: reviewedIncompatibilidades
        }
      ]
    }
  ],
  examples: [
    {
      id: "incomp-ex-1",
      situation: "Un operario de telecomunicaciones de ADIF desea trabajar los fines de semana instalando redes de datos de forma autónoma para una constructora contratista del Ministerio de Transportes.",
      application: [
        {
          id: "incomp-ex-1-app-1",
          text: "Para valorar la solicitud hay que examinar la relación directa de la actividad privada con las actividades de la entidad de destino y si afecta a asuntos en que la persona interviene, ha intervenido en los dos últimos años o deba intervenir por su puesto. Que la empresa contrate con el Ministerio no basta por sí solo para decidir: también deben comprobarse, según el caso, las demás prohibiciones del artículo 12 y el reconocimiento previo de compatibilidad.",
          kind: "example",
          legalBasis: ["l53-1984-art11", "l53-1984-art12", "l53-1984-art14"],
          review: reviewedIncompatibilidades
        }
      ]
    }
  ],
  reviewTakeaways: [
    {
      id: "incomp-takeaway-1",
      text: "Las solicitudes de compatibilidad para actividades privadas deben resolverse en el plazo de dos meses mediante resolución motivada que reconozca la compatibilidad o declare la incompatibilidad.",
      kind: "interpretative",
      legalBasis: ["l53-1984-art14"],
      review: reviewedIncompatibilidades
    },
    {
      id: "incomp-takeaway-2",
      text: "El artículo 19 exceptúa la creación y producción literaria, artística, científica y técnica y sus publicaciones derivadas siempre que no se originen como consecuencia de una relación de empleo o de prestación de servicios.",
      kind: "interpretative",
      legalBasis: ["l53-1984-art19"],
      review: reviewedIncompatibilidades
    },
    {
      id: "incomp-takeaway-3",
      text: "La Ley 53/1984 garantiza la dedicación única y la imparcialidad del personal al servicio de las Administraciones Públicas, cumpliendo el mandato constitucional.",
      kind: "interpretative",
      legalBasis: ["l53-1984-pre"],
      review: reviewedIncompatibilidades
    }
  ]
};
