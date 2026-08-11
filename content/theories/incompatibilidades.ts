import type { TheorySection } from "../lesson-theory";

export const incompatibilidadesTheory: TheorySection = {
  sources: [
    {
      id: "l53-1984-art1",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 1",
      excerpt: "1. El personal comprendido en el ámbito de aplicación de esta Ley no podrá compatibilizar sus actividades con el desempeño, por sí o mediante sustitución, de un segundo puesto de trabajo, cargo o actividad en el sector público, salvo en los supuestos previstos en la misma. 2. Además, no se podrá percibir, salvo en los supuestos previstos en esta Ley, más de una remuneración con cargo a los presupuestos de las Administraciones Públicas..."
    },
    {
      id: "l53-1984-art2",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 2",
      excerpt: "1. La presente Ley será de aplicación a: ... d) El personal al servicio de Entes y Organismos públicos exceptuados de la aplicación de la Ley de Entidades Estatales Autónomas. ... h) El personal que preste servicios en Empresas en que la participación del capital, directa o indirectamente, de las Administraciones Públicas sea superior al 50 por 100. ... 2. En el ámbito delimitado en el apartado anterior se entenderá incluido todo el personal, cualquiera que sea la naturaleza jurídica de la relación de empleo."
    },
    {
      id: "l53-1984-art3",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 3",
      excerpt: "Se exceptúa del principio general... el desempeño de un puesto docente como Profesor Universitario..."
    },
    {
      id: "l53-1984-art7",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 7",
      excerpt: "La cantidad máxima que puede percibirse por ambos puestos no podrá superar la remuneración de un Director General..."
    },
    {
      id: "l53-1984-art11",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 11",
      excerpt: "1. ...el personal comprendido en su ámbito de aplicación no podrá ejercer, por sí o mediante sustitución, actividades privadas, incluidas las de carácter profesional, sean por cuenta propia o bajo la dependencia o al servicio de Entidades o particulares que se relacionen directamente con las que desarrolle el Departamento, Organismo o Entidad donde estuviera destinado."
    },
    {
      id: "l53-1984-art14",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 14",
      excerpt: "El ejercicio de actividades profesionales, laborales, mercantiles o industriales fuera de las Administraciones Públicas requerirá el previo reconocimiento de compatibilidad. La resolución motivada reconociendo la compatibilidad o declarando la incompatibilidad, que se dictará en el plazo de dos meses, corresponde al Ministerio de la Presidencia, a propuesta del Subsecretario del Departamento correspondiente..."
    },
    {
      id: "l53-1984-art19",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 19",
      excerpt: "Quedan exceptuadas del régimen de incompatibilidades de la presente Ley las actividades siguientes: a) Las derivadas de la Administración del patrimonio personal o familiar... b) La dirección de seminarios o el dictado de cursos o conferencias en Centros oficiales destinados a la formación de funcionarios o profesorado... cuando no tenga carácter permanente o habitual ni supongan más de setenta y cinco horas al año... f) La producción y creación literaria, artística, científica y técnica, así como las publicaciones derivadas de aquéllas..."
    }
  ],

  introduction: [
    {
      id: "incomp-intro-1",
      text: "La Ley 53/1984 regula las incompatibilidades para garantizar la dedicación única y la imparcialidad del personal de las Administraciones Públicas.",
      kind: "normative",
      legalBasis: ["l53-1984-art1"]
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
          text: "Prohíbe con carácter general compatibilizar dos actividades retribuidas en el sector público o con cargo a presupuestos públicos.",
          kind: "normative",
          legalBasis: ["l53-1984-art1"]
        }
      ]
    },
    {
      id: "incomp-concept-2",
      title: "Ámbito de la Ley",
      claims: [
        {
          id: "incomp-c2-1",
          text: "Abarca al personal de corporaciones locales, autonómicas, estatales, empresas públicas y entidades públicas empresariales.",
          kind: "normative",
          legalBasis: ["l53-1984-art2"]
        }
      ]
    },
    {
      id: "incomp-concept-3",
      title: "Excepciones de Doble Puesto Público",
      claims: [
        {
          id: "incomp-c3-1",
          text: "Solo se permite el doble puesto para la docencia universitaria a tiempo parcial, la sanidad a tiempo parcial, o cargos electivos sin exclusividad.",
          kind: "normative",
          legalBasis: ["l53-1984-art3"]
        }
      ]
    },
    {
      id: "incomp-concept-4",
      title: "Límites Económicos de Compatibilidad Pública",
      claims: [
        {
          id: "incomp-c4-1",
          text: "La suma de ambos salarios públicos no podrá superar la retribución fijada para el puesto de Director General del Estado ni los límites porcentuales por grupo.",
          kind: "normative",
          legalBasis: ["l53-1984-art7"]
        }
      ]
    },
    {
      id: "incomp-concept-5",
      title: "Prohibiciones Absolutas en el Ámbito Privado",
      claims: [
        {
          id: "incomp-c5-1",
          text: "Se prohíbe ejercer actividades privadas, por cuenta propia o ajena, que se relacionen directamente con las que desarrolla el organismo donde el empleado está destinado, como ocurriría con asesorías a empresas contratistas del propio ADIF.",
          kind: "normative",
          legalBasis: ["l53-1984-art11"]
        }
      ]
    },
    {
      id: "incomp-concept-6",
      title: "Autorización de Compatibilidad Privada",
      claims: [
        {
          id: "incomp-c6-1",
          text: "El ejercicio de actividades profesionales, laborales, mercantiles o industriales fuera de las Administraciones Públicas requiere el previo reconocimiento de compatibilidad, que se resolverá mediante resolución motivada dictada en el plazo de dos meses.",
          kind: "normative",
          legalBasis: ["l53-1984-art14"]
        }
      ]
    },
    {
      id: "incomp-concept-7",
      title: "Actividades Exentas de Autorización",
      claims: [
        {
          id: "incomp-c7-1",
          text: "La creación literaria, científica, artística, la gestión del patrimonio familiar y la docencia ocasional en seminarios están exentas de solicitar compatibilidad.",
          kind: "normative",
          legalBasis: ["l53-1984-art19"]
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
          text: "La relación de la contratista con el ámbito de supervisión de ADIF impide, con carácter general, conceder la compatibilidad, al concurrir el supuesto de incompatibilidad regulado para las actividades relacionadas con las funciones que desempeña.",
          kind: "example",
          legalBasis: ["l53-1984-art11"]
        }
      ]
    }
  ],

  reviewTakeaways: [
    {
      id: "incomp-takeaway-1",
      text: "Las solicitudes de compatibilidad para actividades privadas deben resolverse mediante resolución motivada en el plazo de dos meses.",
      kind: "interpretative",
      legalBasis: ["l53-1984-art14"]
    },
    {
      id: "incomp-takeaway-2",
      text: "La publicación de obras literarias o científicas y el cobro de derechos de autor no requiere autorización previa de compatibilidad.",
      kind: "interpretative",
      legalBasis: ["l53-1984-art19"]
    }
  ]
};
