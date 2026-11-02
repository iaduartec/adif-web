import type { TheorySection } from "../lesson-theory";

export const declaracionRed2027Theory: TheorySection = {
  sources: [
    {
      id: "lsf-38-2015-art4",
      sourceId: "Ley 38/2015",
      sourceTitle: "Ley 38/2015, de 29 de septiembre, del sector ferroviario",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10440",
      locator: "Artículo 4",
      excerpt: "La Red Ferroviaria de Interés General está integrada por las infraestructuras esenciales..."
    },
    {
      id: "lsf-38-2015-art32",
      sourceId: "Ley 38/2015",
      sourceTitle: "Ley 38/2015, de 29 de septiembre, del sector ferroviario",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10440",
      locator: "Artículo 32",
      excerpt: "La declaración sobre la red expondrá las características de la infraestructura puesta a disposición de las empresas ferroviarias e informará sobre la capacidad y condiciones técnicas de cada tramo de la red y sobre las condiciones de acceso a la misma. Su contenido se atendrá a lo recogido en el anexo III."
    },
    {
      id: "dr-adif-2027-c1",
      sourceId: "DR 2027",
      sourceTitle: "Declaración sobre la Red de Adif (Edición 2027)",
      sourceUrl: "https://www.adif.es/sobre-adif/declaracion-red",
      locator: "Capítulo I, 1.4 Los agentes del sector ferroviario",
      excerpt: "Corresponden a Adif las funciones de administración de las infraestructuras... La DR entrará en vigor tras su publicación y podrá ser actualizada por el administrador de infraestructuras ferroviarias cuando así lo requieran sus contenidos. Aprobada la Declaración sobre la Red por el Consejo de Administración del Administrador de infraestructuras se publica en la web, www.adif.es, en formato PDF o similar."
    },
    {
      id: "dr-adif-2027-c2",
      sourceId: "DR 2027",
      sourceTitle: "Declaración sobre la Red de Adif (Edición 2027)",
      sourceUrl: "https://www.adif.es/sobre-adif/declaracion-red",
      locator: "Capítulo I, 1.2 Estructura organizativa. RFIG",
      excerpt: "La Red Ferroviaria de Interés General (RFIG): Red Convencional de Ancho Ibérico puro (1.668 mm) 10.212,5 km; Red Mixta (Tercer Carril) 126,8 km; Red de Vía Estrecha de Ancho Métrico (1.000 mm) 1.195,3 km. Total Red Ferroviaria Titularidad de Adif 11.675,9 km."
    },
    {
      id: "dr-adif-2027-agentes",
      sourceId: "DR 2027",
      sourceTitle: "Declaración sobre la Red de Adif (Edición 2027)",
      sourceUrl: "https://www.adif.es/sobre-adif/declaracion-red",
      locator: "Capítulo I, 1.4 Los agentes del sector ferroviario",
      excerpt: "El Ministerio de Transportes y Movilidad Sostenible es responsable de proponer y ejecutar la política del ferrocarril... La CNMC supervisará y controlará el correcto funcionamiento del sector ferroviario y la competencia en los mercados de servicios."
    },
    {
      id: "dr-adif-2027-cap2",
      sourceId: "DR 2027",
      sourceTitle: "Declaración sobre la Red de Adif (Edición 2027)",
      sourceUrl: "https://www.adif.es/sobre-adif/declaracion-red",
      locator: "Capítulo II, 2.1 Introducción; 2.2 Ámbito de la red gestionada por Adif; 2.3 Descripción de la red (2.3.1 tipología de vías, 2.3.2 ancho, 2.3.3 estaciones y terminales, 2.3.4 gálibo, 2.3.5 límite de carga, 2.3.6 rampas, 2.3.7 velocidades máximas, 2.3.8 longitud máxima de trenes, 2.3.9 suministro de energía eléctrica, 2.3.10 sistemas de seguridad y señalización, 2.3.11 control y gestión del tráfico, 2.3.12 comunicaciones, 2.3.13 control y protección del tren, 2.3.14 autopistas ferroviarias, 2.3.15 protección y seguridad); 2.4 restricciones; 2.5 disponibilidad; 2.6 desarrollo",
      excerpt:
        "La infraestructura ferroviaria, conforme a la Ley del Sector Ferroviario y su anexo IV, se compone de terrenos, obras de explotación y plataformas, obras civiles, pasos a nivel, superestructuras, calzadas de patios, instalaciones de seguridad, señalización y telecomunicaciones, instalaciones de alumbrado, instalaciones de transformación y conducción de corriente eléctrica para la tracción, edificios del servicio de infraestructuras y cambiadores de ancho. La red gestionada por Adif está compuesta por líneas principalmente de tráfico mixto y consta de líneas de tres anchos de vía diferentes."
    }
  ],

  introduction: [
    {
      id: "dr-intro-1",
      text: "La Declaración sobre la Red (DR) detalla las características físicas y operativas de la infraestructura ferroviaria y las condiciones de acceso a la RFIG.",
      kind: "normative",
      legalBasis: ["dr-adif-2027-c1"]
    },
    {
      id: "dr-intro-2",
      text: "La Ley 38/2015 obliga a los administradores de infraestructuras ferroviarias, previa consulta a las partes interesadas, a elaborar, aprobar y publicar la declaración sobre la red correspondiente a su ámbito de actuación, así como sus actualizaciones.",
      kind: "normative",
      legalBasis: ["lsf-38-2015-art32"]
    }
  ],

  concepts: [
    {
      id: "dr-concept-1",
      title: "La Declaración sobre la Red",
      claims: [
        {
          id: "dr-c1-1",
          text: "Documento oficial regulado por la Ley 38/2015 que expone las características de la infraestructura puesta a disposición de las empresas ferroviarias e informa sobre la capacidad y condiciones técnicas de cada tramo de la red y las condiciones de acceso a la misma.",
          kind: "normative",
          legalBasis: ["dr-adif-2027-c1", "lsf-38-2015-art32"]
        }
      ]
    },
    {
      id: "dr-concept-2",
      title: "Red Ferroviaria de Interés General",
      claims: [
        {
          id: "dr-c2-1",
          text: "Integrada por las líneas, estaciones y terminales esenciales para el transporte ferroviario, recogidas oficialmente en el Catálogo de la RFIG.",
          kind: "normative",
          legalBasis: ["lsf-38-2015-art4"]
        }
      ]
    },
    {
      id: "dr-concept-3",
      title: "Ministerio de Transportes y Movilidad Sostenible",
      claims: [
        {
          id: "dr-c3-1",
          text: "El Ministerio de Transportes y Movilidad Sostenible es responsable de proponer y ejecutar la política del ferrocarril y establece directrices específicas para el desarrollo de la política ferroviaria a través de sus planes estratégicos.",
          kind: "normative",
          legalBasis: ["dr-adif-2027-agentes"]
        }
      ]
    },
    {
      id: "dr-concept-4",
      title: "Comisión Nacional de los Mercados y la Competencia (CNMC)",
      claims: [
        {
          id: "dr-c4-1",
          text: "La Comisión Nacional de los Mercados y la Competencia (CNMC) supervisa y controla el correcto funcionamiento del sector ferroviario y la competencia en los mercados de servicios.",
          kind: "normative",
          legalBasis: ["dr-adif-2027-agentes"]
        }
      ]
    },
    {
      id: "dr-concept-5",
      title: "Agencia Estatal de Seguridad Ferroviaria (AESF)",
      claims: [
        {
          id: "dr-c5-1",
          text: "Autoridad responsable de la seguridad en la RFIG. Emite licencias y certificados de seguridad y expide habilitaciones del personal ferroviario.",
          kind: "normative",
          legalBasis: ["dr-adif-2027-c1"]
        }
      ]
    },
    {
      id: "dr-concept-6",
      title: "Cifras Oficiales de la Red",
      claims: [
        {
          id: "dr-c6-1",
          text: "La longitud en explotación suma unos 11.675,9 km, predominando el ancho ibérico convencional (1.668 mm) con 10.212,5 km.",
          kind: "normative",
          legalBasis: ["dr-adif-2027-c2"]
        },
        {
          id: "dr-c6-2",
          text: "El ancho métrico representa unos 1.195,3 km del total, mientras que las líneas de ancho mixto (con tercer carril instalado) cubren 126,8 km.",
          kind: "normative",
          legalBasis: ["dr-adif-2027-c2"]
        }
      ]
    },

    {
      id: "dr-cap2-infraestructura-ferroviaria",
      title: "Infraestructura ferroviaria (art. 3 LSF)",
      claims: [
        {
          id: "dr-cap2-infra-1",
          text: "La infraestructura ferroviaria, conforme a la Ley del Sector Ferroviario y su anexo IV, se compone de terrenos, obras de explotación y plataformas, obras civiles, pasos a nivel, superestructuras, calzadas de patios, instalaciones de seguridad, señalización y telecomunicaciones, instalaciones de alumbrado, instalaciones de transformación y conducción de corriente eléctrica para la tracción, edificios del servicio de infraestructuras y cambiadores de ancho.",
          kind: "normative",
          legalBasis: ["dr-adif-2027-cap2", "lsf-38-2015-art4"]
        }
      ]
    },
    {
      id: "dr-cap2-red-gestionada-adif",
      title: "Red gestionada por Adif",
      claims: [
        {
          id: "dr-cap2-red-1",
          text: "La red gestionada por Adif está compuesta por líneas principalmente de tráfico mixto (mercancías y viajeros) y consta de líneas de tres anchos de vía diferentes: ancho ibérico, ancho mixto (tercer carril) y ancho métrico.",
          kind: "normative",
          legalBasis: ["dr-adif-2027-cap2"]
        }
      ]
    },
    {
      id: "dr-cap2-sistemas-seguridad",
      title: "Sistemas de seguridad, señalización y control",
      claims: [
        {
          id: "dr-cap2-sistemas-1",
          text: "El capítulo II describe, entre otros, los sistemas de seguridad y señalización, los sistemas de control y gestión del tráfico, los sistemas de comunicación y los sistemas de control y protección del tren, así como el suministro de energía eléctrica.",
          kind: "normative",
          legalBasis: ["dr-adif-2027-cap2"]
        }
      ]
    },
    {
      id: "dr-cap2-estaciones-terminales",
      title: "Estaciones de viajeros y terminales de mercancías",
      claims: [
        {
          id: "dr-cap2-estaciones-1",
          text: "El capítulo II describe las estaciones de viajeros y las terminales de transporte de mercancías, con sus correspondientes catálogos, mapas y fichas descriptivas.",
          kind: "normative",
          legalBasis: ["dr-adif-2027-cap2"]
        }
      ]
    },
    {
      id: "dr-cap2-restricciones-disponibilidad",
      title: "Restricciones, disponibilidad y desarrollo",
      claims: [
        {
          id: "dr-cap2-restr-1",
          text: "El capítulo II incluye las restricciones de tráfico, la disponibilidad de la infraestructura y el desarrollo de la infraestructura (actuaciones previstas y actualización de activos de la RFIG).",
          kind: "normative",
          legalBasis: ["dr-adif-2027-cap2"]
        }
      ]
    },
  ],

  examples: [
    {
      id: "dr-ex-cap2",
      situation: "Una empresa ferroviaria solicita capacidad de infraestructura para circular por la RFIG.",
      application: [
        {
          id: "dr-ex-cap2-app-1",
          text: "La solicitud se tramita conforme a la DR, que expone las características de la infraestructura puesta a disposición, la capacidad y las condiciones técnicas de cada tramo, así como las condiciones de acceso.",
          kind: "example",
          legalBasis: ["dr-adif-2027-cap2", "lsf-38-2015-art32"]
        }
      ]
    },
    {
      id: "dr-ex-1",
      situation: "Una operadora internacional solicita circular en la RFIG. ADIF tramita la petición siguiendo el procedimiento de la DR.",
      application: [
        {
          id: "dr-ex-1-app-1",
          text: "La operadora debe obtener certificado de seguridad previo emitido por la AESF y abonar los cánones fijados conforme a la DR.",
          kind: "example",
          legalBasis: ["dr-adif-2027-c1"]
        }
      ]
    }
  ],

  reviewTakeaways: [
    {
      id: "dr-takeaway-cap2-1",
      text: "La infraestructura ferroviaria se compone de los elementos de la Ley del Sector Ferroviario y su anexo IV; la red gestionada por Adif consta de líneas de tres anchos de vía y es principalmente de tráfico mixto.",
      kind: "normative",
      legalBasis: ["dr-adif-2027-cap2", "lsf-38-2015-art4"]
    },
    {
      id: "dr-takeaway-cap2-2",
      text: "El capítulo II de la DR describe estaciones, terminales, sistemas de seguridad y señalización, control y gestión del tráfico, comunicaciones, protección del tren, restricciones, disponibilidad y desarrollo de la infraestructura.",
      kind: "normative",
      legalBasis: ["dr-adif-2027-cap2"]
    },
    {
      id: "dr-takeaway-1",
      text: "La DR, aprobada por el Consejo de Administración del administrador de infraestructuras, entra en vigor tras su publicación y puede ser actualizada por el propio administrador cuando sus contenidos lo requieran.",
      kind: "normative",
      legalBasis: ["dr-adif-2027-c1"]
    },
    {
      id: "dr-takeaway-2",
      text: "El ancho ibérico convencional representa el mayor porcentaje de extensión ferroviaria dentro de las líneas explotadas por ADIF.",
      kind: "interpretative",
      legalBasis: ["dr-adif-2027-c2"]
    }
  ]
};
