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
    }
  ],

  examples: [
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
