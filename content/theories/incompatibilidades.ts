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
      excerpt: "El personal comprendido en el ámbito de esta Ley no podrá compatibilizar sus actividades con el desempeño de un segundo puesto..."
    },
    {
      id: "l53-1984-art2",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 2",
      excerpt: "La presente Ley será de aplicación al personal... al servicio de los entes y organismos públicos..."
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
      excerpt: "El personal no podrá ejercer actividades privadas que se relacionen directamente con las que desarrolle el departamento..."
    },
    {
      id: "l53-1984-art14",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 14",
      excerpt: "El personal que acceda por cualquier título a un nuevo puesto del sector público que con arreglo a esta Ley sea incompatible..."
    },
    {
      id: "l53-1984-art19",
      sourceId: "Ley 53/1984",
      sourceTitle:
        "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
      locator: "Artículo 19",
      excerpt: "Quedan exceptuadas del régimen de incompatibilidades las actividades siguientes: La dirección de seminarios..."
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
          text: "Se prohíbe realizar actividades privadas relacionadas con las funciones de ADIF, como formar parte de consejos en constructoras adjudicatarias de vía.",
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
          text: "Toda actividad laboral o mercantil privada requiere previa autorización expresa. El silencio administrativo tras dos meses es desestimatorio.",
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
      text: "El silencio administrativo de las solicitudes de compatibilidad se cataloga como negativo tras el transcurso de dos meses.",
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
