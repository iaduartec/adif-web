import type { TheorySection } from "../lesson-theory";

export const ictTheory: TheorySection = {
  sources: [
    {
      id: "rd346-2011-art1",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Artículo 1",
      excerpt: "Este reglamento tiene por objeto establecer las normas técnicas relativas al diseño, instalación y mantenimiento de las ICT..."
    },
    {
      id: "rd346-2011-anex2",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo II",
      excerpt: "Establece los parámetros y especificaciones técnicas de las redes de telefonía y telecomunicaciones de banda ancha..."
    },
    {
      id: "rd346-2011-anex4",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo IV",
      excerpt: "Especifica las características de las canalizaciones, recintos y registros necesarios para alojar la infraestructura..."
    },
    {
      id: "rd346-2011-anex5",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo V",
      excerpt: "Regula los requisitos de seguridad eléctrica, compatibilidad electromagnética y puesta a tierra..."
    }
  ],

  introduction: [
    {
      id: "ict-intro-1",
      text: "El Real Decreto 346/2011 aprueba el Reglamento regulador de las Infraestructuras Comunes de Telecomunicaciones (ICT) para el acceso a servicios de telecomunicación en el interior de edificaciones.",
      kind: "normative",
      legalBasis: ["rd346-2011-art1"]
    },
    {
      id: "ict-intro-2",
      text: "Su contenido define la estructura física y lógica de canalizaciones, recintos y repartidores para la distribución de telecomunicaciones en inmuebles bajo propiedad horizontal.",
      kind: "normative",
      legalBasis: ["rd346-2011-anex4"]
    }
  ],

  concepts: [
    {
      id: "ict-concept-1",
      title: "Definición y Ámbito de la ICT",
      claims: [
        {
          id: "ict-c1-1",
          text: "La ICT abarca los sistemas y canalizaciones interiores de edificios de nueva planta o rehabilitación integral que posibilitan el acceso a telecomunicaciones.",
          kind: "normative",
          legalBasis: ["rd346-2011-art1"]
        }
      ]
    },
    {
      id: "ict-concept-2",
      title: "Red de Alimentación",
      claims: [
        {
          id: "ict-c2-1",
          text: "La red de alimentación es la parte de la red propiedad del operador que enlaza sus centrales o nodos con el punto de interconexión del edificio, introduciéndose en la ICT hasta el registro principal del RITI.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2"]
        }
      ]
    },
    {
      id: "ict-concept-3",
      title: "Red de Distribución",
      claims: [
        {
          id: "ict-c3-1",
          text: "Tramo que transcurre por las canalizaciones comunes del inmueble desde los repartidores del RITI hasta los registros secundarios de planta.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2"]
        }
      ]
    },
    {
      id: "ict-concept-4",
      title: "Red de Dispersión",
      claims: [
        {
          id: "ict-c4-1",
          text: "Conecta los registros secundarios de cada planta con el Punto de Acceso al Usuario (PAU) de cada unidad catastral u oficina.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2"]
        }
      ]
    },
    {
      id: "ict-concept-5",
      title: "Red Interior de Usuario",
      claims: [
        {
          id: "ict-c5-1",
          text: "Es el tendido que discurre en el interior de cada domicilio desde el PAU hasta las Bases de Acceso Terminal (BAT), diseñado y realizado bajo la responsabilidad de la propiedad de la edificación.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2"]
        }
      ]
    },
    {
      id: "ict-concept-6",
      title: "Punto de Acceso al Usuario (PAU)",
      claims: [
        {
          id: "ict-c6-1",
          text: "Dispositivo de delimitación técnica y jurídica que separa la red de dispersión de la comunidad de la red interior del usuario final.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2"]
        }
      ]
    },
    {
      id: "ict-concept-7",
      title: "Recintos RITI y RITS",
      claims: [
        {
          id: "ict-c7-1",
          text: "El RITI (Inferior) alberga los repartidores de entrada de operadoras y el RITS (Superior) los equipos de captación de señales radioeléctricas y TV.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex4"]
        }
      ]
    },
    {
      id: "ict-concept-8",
      title: "Recinto Único RITU",
      claims: [
        {
          id: "ict-c8-1",
          text: "Se permite la instalación de un único recinto de telecomunicaciones (RITU) en edificios o conjuntos inmobiliarios de hasta tres alturas y planta baja y con un máximo de dieciséis puntos de acceso al usuario (PAU).",
          kind: "normative",
          legalBasis: ["rd346-2011-anex4"]
        }
      ]
    },
    {
      id: "ict-concept-9",
      title: "Canalización Principal",
      claims: [
        {
          id: "ict-c9-1",
          text: "Discurre en vertical por las zonas de copropiedad del edificio. Bajo ninguna circunstancia técnica se permite que atraviese viviendas o locales de dominio privado.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex4"]
        }
      ]
    },
    {
      id: "ict-concept-10",
      title: "Seguridad y Puesta a Tierra",
      claims: [
        {
          id: "ict-c10-1",
          text: "El sistema de puesta a tierra de cada recinto consta de un anillo interior de cobre con una barra colectora, conectado al sistema general de tierra de la edificación y al que se conectan los equipos y masas metálicas.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex5"]
        }
      ]
    }
  ],

  examples: [
    {
      id: "ict-ex-1",
      situation: "Un promotor proyecta una ICT para un edificio de 4 plantas con 8 viviendas empleando un único habitáculo de telecomunicación (RITU).",
      application: [
        {
          id: "ict-ex-1-app-1",
          text: "El RITU simple no resulta aplicable a un edificio de más de tres alturas; para esos casos la norma prevé un recinto único ampliado (RITU-A) bajo determinadas condiciones o, en su defecto, los recintos independientes RITI y RITS.",
          kind: "example",
          legalBasis: ["rd346-2011-anex4"]
        }
      ]
    }
  ],

  reviewTakeaways: [
    {
      id: "ict-takeaway-1",
      text: "El RITU unifica RITI y RITS y está reservado para edificios pequeños, de hasta tres alturas y planta baja y un máximo de 16 PAU.",
      kind: "normative",
      legalBasis: ["rd346-2011-anex4"]
    },
    {
      id: "ict-takeaway-2",
      text: "Las canalizaciones principales de ICT deben transcurrir de forma imperativa a través de zonas y elementos de propiedad común.",
      kind: "interpretative",
      legalBasis: ["rd346-2011-anex4"]
    }
  ]
};
