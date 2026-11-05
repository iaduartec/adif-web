import type { TheorySection } from "../lesson-theory";
import { theoryArticulos } from "./ict-articulos-adicional";
import * as annex345 from "./ict-anexos-345-adicional";
import { ictAnexos12Adicional } from "./ict-anexos-12-adicional";

/**
 * Estado editorial del módulo tras el Ciclo 7 (04/11/2026).
 *
 * El sello anterior (`reviewed` / `high`, "revisado en Ciclo 2") se retira: el
 * cotejo literal con el texto consolidado del BOE (BOE-A-2011-5834, última
 * actualización publicada 26/03/2025) desmintió afirmaciones normativas del
 * módulo, entre ellas el umbral del 50 % atribuido al artículo 3. Un sello de
 * revisión no puede cubrir en bloque claims que nunca se cotejaron una a una.
 */
const pendingIct = {
  status: "needs_review",
  reviewedBy: "ciclo-7-deepseek",
  confidence: {
    level: "low",
    reason:
      "Sello de revisión retirado en el Ciclo 7 (04/11/2026): el cotejo con el BOE desmintió el umbral del 50 % del artículo 3 y otras precisiones. Pendiente de cotejo individual.",
  },
} as const;

/** Claims cotejadas literalmente contra el BOE durante el Ciclo 7. */
const verifiedIct = {
  status: "reviewed",
  reviewedAt: "2026-11-04",
  reviewedBy: "ciclo-7-deepseek",
  confidence: {
    level: "high",
    reason:
      "Texto cotejado literalmente con BOE-A-2011-5834 (consolidado, última actualización 26/03/2025) en el artículo y apartado indicados.",
  },
} as const;

const reviewedIctSupplement = {
  status: "reviewed",
  reviewedAt: "2026-11-05",
  reviewedBy: "codex",
  confidence: {
    level: "high",
    reason: "Síntesis contrastada con los apartados indicados del BOE y revisión independiente; la identidad del PDF ADIF posterior no se ha cotejado byte a byte.",
  },
} as const;

export const ictTheory: TheorySection = {
  sources: [
    ...theoryArticulos.sources,
    ...annex345.sources,
    ...ictAnexos12Adicional.sources,
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
      id: "rd346-2011-art3-scope",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Artículo 3, apartados 3.1 y 3.2",
      excerpt:
        "Las normas contenidas en este reglamento... se aplicarán: 1. A todos los edificios y conjuntos inmobiliarios en los que exista continuidad en la edificación, de uso residencial o no, y sean o no de nueva construcción, que estén acogidos, o deban acogerse, al régimen de propiedad horizontal regulado por la Ley 49/1960. 2. A los edificios que, en todo o en parte, hayan sido o sean objeto de arrendamiento por plazo superior a un año, salvo los que alberguen una sola vivienda."
    },
    {
      id: "rd346-2011-art4-technical-rules",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Artículo 4, apartados 4.1 y 4.2",
      excerpt:
        "a) Lo dispuesto en el anexo I... a la destinada a la captación, adaptación y distribución de las señales de radiodifusión sonora y televisión. b) Lo establecido en el anexo II, a la que tiene por objeto permitir el acceso a los servicios de telefonía disponible al público y de telecomunicaciones de banda ancha. c) A la de obra civil que soporte las demás infraestructuras comunes, lo dispuesto en la norma técnica básica de edificación..., incluidas como anexo III de este reglamento."
    },
    {
      id: "rd346-2011-art5-obligations",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Artículo 5, apartados 5.2 y 5.4",
      excerpt:
        "El propietario o los propietarios de la edificación serán los responsables del mantenimiento de la parte de infraestructura común comprendida entre el punto de terminación de red y el punto de acceso al usuario... Los operadores... procederán a la retirada del cableado... cuando concluya, por cualquier causa, el correspondiente contrato de abono. La retirada será efectuada en un plazo no superior a 30 días."
    },
    {
      id: "rd346-2011-art6-adaptation",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Artículo 6, apartados 6.1 y 6.2",
      excerpt:
        "La adaptación de las instalaciones individuales o de las infraestructuras preexistentes cuando... no reúnan las condiciones para soportar una infraestructura común de telecomunicaciones o no exista obligación de instalarla se realizará de conformidad con los anexos referidos en los párrafos a) y b) del artículo 4.1... el promotor de dicha instalación estará obligado a comunicar por escrito al propietario o, en su caso, a la comunidad de propietarios del edificio su intención."
    },
    {
      id: "rd346-2011-art8-operators",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Artículo 8, apartados 8.1, 8.2, 8.4 y 8.5",
      excerpt:
        "El resultado de la consulta e intercambio de información entre proyectistas y operadores se aplicará solamente para la ejecución o no de la instalación inicial de las diversas redes interiores..., sin que dicho resultado afecte al diseño, al dimensionado ni a la instalación de los diferentes elementos soporte de obra civil..., con excepción de la determinación de la ubicación de la arqueta de entrada. Los operadores de red... dispondrán de un plazo máximo de 30 días... para responder."
    },
    {
      id: "rd346-2011-art10-replanteo",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Artículo 10, apartados 10.1, 10.2 y 10.4",
      excerpt:
        "En el momento del inicio de las obras, el promotor encargará al director de obra de la ICT, si existe, o en caso contrario a un profesional..., la redacción de un acta de replanteo del proyecto técnico de ICT, que será firmada entre aquél y el titular de la propiedad... El acta de replanteo incluirá una referencia a los resultados de la consulta... y será presentada a la Administración electrónicamente... en un plazo no superior a 15 días naturales tras su redacción y firma."
    },
    {
      id: "itc1644-2011-art6-execution",
      sourceId: "Orden ITC/1644/2011",
      sourceTitle: "Orden ITC/1644/2011, de 10 de junio, por la que se desarrolla el Reglamento regulador de las infraestructuras comunes de telecomunicaciones",
      sourceUrl: "https://www.boe.es/eli/es/o/2011/06/10/itc1644/con",
      locator: "Artículos 6.4 y 6.5",
      excerpt: "Finalizados los trabajos [...] la empresa instaladora [...] entregará [...] un boletín de instalación. Cuando exista director de obra, este expedirá [...] un certificado de fin de obra [...] y supervisará y entregará [...] el protocolo de pruebas. La dirección de obra será obligatoria, al menos, [...] en edificios [...] de más de 20 viviendas; [...] en edificaciones de uso residencial [con] elementos activos en la red de distribución; cuando [...] incluya [...] Hogar Digital; [y] en edificios [...] de uso no residencial."
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
      id: "rd346-2011-anex2-infrastructure",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo III, apartados 4.5.1–4.5.4 y 4.6",
      excerpt: "El apartado 4.5.3 permite RITU para edificios o conjuntos inmobiliarios de hasta tres alturas y planta baja con un máximo de 16 PAU, y para conjuntos de viviendas unifamiliares sin límite de PAU. Permite RITU-A para edificios de más de tres alturas y planta baja con hasta 16 PAU, o con 17–30 PAU sin límite de alturas; su anchura accesible es el doble que la de uno de los recintos sustituidos, conserva las demás dimensiones y se sitúa donde cualquiera de ellos.",
    },
    {
      id: "rd346-2011-anex3-rit-dimensions",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo III, apartado 5.5.1",
      excerpt:
        "RITU-A: dimensiones mínimas (altura × anchura × profundidad) de 2.000 × 2.000 × 500 mm para hasta 16 PAU en edificios con planta baja y más de tres alturas; de 2.000 × 2.000 × 500 mm para 17–20 PAU y de 2.000 × 3.000 × 500 mm para 21–30 PAU, estos dos últimos intervalos en edificios de cualquier altura. La anchura completa debe ser accesible. En todo caso, el proyectista puede modificar altura y anchura si mantiene la superficie accesible y la profundidad mínima.",
    },
    {
      id: "rd346-2011-anex3-ritu-options",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo III, apartado 4.5.3",
      excerpt:
        "El RITU-A puede instalarse en edificios o conjuntos inmobiliarios de más de tres alturas y planta baja con hasta 16 PAU, o en los que tengan entre 17 y 30 PAU sin límite de alturas. Su anchura accesible será doble de la que correspondería a uno de los recintos sustituidos; mantendrá las demás dimensiones y se ubicará donde cualquiera de ellos.",
    },
    {
      id: "rd346-2011-anex3-canalizacion-principal",
      sourceId: "RD 346/2011",
      sourceTitle: "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo III, apartado 5.7",
      excerpt: "En edificaciones en altura, la canalización principal deberá ser rectilínea, fundamentalmente vertical y de capacidad suficiente.",
    },
    {
      id: "rd346-2011-anex3-entry-duct",
      sourceId: "RD 346/2011",
      sourceTitle: "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo III, apartados 4.1, 5.2 y 5.3",
      excerpt: "El apartado 4.1 define la arqueta de entrada; los apartados 5.2 y 5.3 regulan la canalización externa y el punto de entrada general.",
    },
    {
      id: "rd346-2011-anex3-secondary-duct",
      sourceId: "RD 346/2011",
      sourceTitle: "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo III, apartado 5.9",
      excerpt: "Regula la canalización secundaria y sus derivaciones hacia los registros de terminación de red.",
    },
    {
      id: "rd346-2011-anex1-response-channel",
      sourceId: "RD 346/2011",
      sourceTitle: "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo I, apartado 4.4.2",
      excerpt: "La tabla de respuesta amplitud/frecuencia en canal distingue 47–694 MHz y 950–2.150 MHz.",
    },
    {
      id: "rd346-2011-anex1-response-band",
      sourceId: "RD 346/2011",
      sourceTitle: "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo I, apartado 4.4.3",
      excerpt: "La tabla de respuesta amplitud/frecuencia en banda de la red distingue 47–862 MHz y 950–2.150 MHz.",
    },
    {
      id: "rd346-2011-anex1-minimum-takes",
      sourceId: "RD 346/2011",
      sourceTitle: "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo I, apartado 3.5.1",
      excerpt: "En las viviendas, el número de tomas RTV será de una por cada estancia, excluidos baños y trasteros, con un mínimo de dos.",
    },
    {
      id: "rd346-2011-anex3-tierra-local",
      sourceId: "RD 346/2011",
      sourceTitle: "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo III, apartado 7.1",
      excerpt: "El sistema de tierra del recinto incluye un anillo interior de cobre aplicable solo a recintos no modulares y una barra colectora conectada al sistema general de tierra.",
    },
    {
      id: "rd346-2011-anex2-feeding",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo II, apartados 2.1.1–2.1.2",
      excerpt: "Define la red de alimentación del edificio para enlaces por cable o medios radioeléctricos.",
    },
    {
      id: "rd346-2011-anex2-broadband-route",
      sourceId: "RD 346/2011",
      sourceTitle: "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo II, apartados 2.1.1, 2.1.2 y 2.2",
      excerpt: "Define la alimentación por cable o por medios radioeléctricos y la red de distribución que parte del punto de interconexión y prolonga el acceso al edificio mediante las tecnologías contempladas.",
    },
    {
      id: "rd346-2011-anex2-user-network",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo II, apartados 2.4 y 5.1.2",
      excerpt: "Describe la red interior de usuario y las especificaciones de sus redes de pares, coaxial y fibra óptica.",
    },
    {
      id: "rd346-2011-anex2-distribution",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo II, apartado 2.2",
      excerpt: "Define la red de distribución entre el punto de interconexión y los puntos de distribución del edificio.",
    },
    {
      id: "rd346-2011-anex2-dispersion",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo II, apartado 2.3",
      excerpt: "Define la red de dispersión entre la red de distribución y cada vivienda, local o estancia común.",
    },
    {
      id: "rd346-2011-anex2-bat",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo II, apartado 2.5.4",
      excerpt: "Define las bases de acceso terminal como acceso de los equipos del usuario a la red interior multiservicio.",
    },
    {
      id: "rd346-2011-anex4",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo IV, secciones 1–3",
      excerpt: "Incluye protocolos y documentos normalizados para inspección técnica, mantenimiento y estudio de infraestructuras de telecomunicaciones.",
    },
    {
      id: "rd346-2011-anex5",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo V",
      excerpt: "Clasifica las viviendas y edificaciones que incorporan funcionalidades de hogar digital.",
    },
    {
      id: "rd346-2011-art2-services",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Reglamento, artículo 2.1",
      excerpt:
        "La ICT proporciona acceso a radiodifusión sonora y televisión terrestre y por satélite, telefonía disponible al público y telecomunicaciones de banda ancha mediante redes públicas."
    },
    {
      id: "rd346-2011-art9-project",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Reglamento, artículo 9, apartados 1 y 2",
      excerpt:
        "El proyecto describe elementos, ubicación, dimensiones y normas. Los planos contienen esquemas y situación; el pliego determina calidades y condiciones de montaje."
    },
    {
      id: "rd346-2011-anex1-scope",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo I, título y apartado 2.3.1",
      excerpt:
        "El Anexo I regula la captación, adaptación y distribución de radiodifusión sonora y televisión; su red de distribución enlaza la cabecera con la red de dispersión."
    },
    {
      id: "rd346-2011-anex1-niveles",
      sourceId: "RD 346/2011",
      sourceTitle: "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo I, apartado 4.5",
    },
    {
      id: "rd346-2011-anex1-network",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo I, apartados 4.1.2, 5.2.3 y 5.2.4",
      excerpt:
        "La señal se distribuye entre 5 MHz y 2.150 MHz. Los elementos de red coaxial tienen 75 Ω de impedancia nominal."
    },
    {
      id: "rd346-2011-anex1-masts",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo I, apartado 4.2.1",
      excerpt:
        "Los mástiles de antena se conectan a la toma de tierra por el camino más corto con cable de al menos 25 mm²."
    },
    {
      id: "rd346-2011-anex1-cables",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo I, apartado 5.4",
      excerpt:
        "Los cables coaxiales de acometida interior o exterior para 5 MHz a 3.000 MHz tienen una impedancia característica media de 75 ± 3 Ω."
    },
    {
      id: "rd346-2011-anex2-network-definition",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo II, apartados 1, 2.1.1 y 2.1.2",
      excerpt:
        "STDP significa servicios de telefonía disponible al público. Por cable, la alimentación entra por la arqueta hasta el RITI; por radio, la captación se sitúa en cubierta o azotea."
    },
    {
      id: "rd346-2011-anex2-connection-points",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo II, apartados 2.5.1 a 2.5.3",
      excerpt:
        "El punto de interconexión une alimentación y distribución en el RITI; el punto de distribución une distribución y dispersión; el PAU de pares trenzados termina en RJ45."
    },
    {
      id: "rd346-2011-anex2-fiber",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo II, apartados 2.5.1.c y 2.5.4.c",
      excerpt:
        "La interconexión usa cordones o latiguillos de fibra óptica con SC/APC; la fibra de usuario termina en un BAT con adaptador SC/APC."
    },
    {
      id: "rd346-2011-anex2-cabling",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo II, apartado 6.2",
      excerpt:
        "Las redes de distribución y dispersión de pares trenzados se certifican conforme a UNE-EN 50346, Tecnologías de la información. Instalación de cableado. Ensayo de cableados instalados."
    },
    {
      id: "rd346-2011-anex2-twisted-pair-minimum",
      sourceId: "RD 346/2011",
      sourceTitle: "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo II, apartados 5.1.1.a y 5.1.2.a",
      excerpt: "Los cables de distribución y dispersión de pares trenzados son como mínimo de cuatro pares de cobre, aislamiento individual sin apantallar, clase E (categoría 6), y cumplen UNE-EN 50288-6-1. La red interior de usuario también requiere como mínimo cuatro pares, clase E, y las características de cubierta indicadas en el apartado 5.1.2.a.",
    },
    {
      id: "rd346-2011-art11-materials",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      sourceVersion: "consolidated-page-2026-10-15",
      verifiedAt: "2026-10-15",
      locator: "Artículo 11",
      excerpt:
        "Los equipos incluidos en el proyecto técnico y los materiales empleados en la ejecución deben ser conformes con las especificaciones técnicas del reglamento y las demás normas vigentes aplicables, especialmente las del Código Técnico de la Edificación sobre seguridad contra incendios y resistencia al fuego.",
    },
    {
      id: "rd346-2011-art13-3",
      sourceId: "RD 346/2011",
      sourceTitle: "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Artículo 13.3",
    },
    {
      id: "rd346-2011-anex3-separacion",
      sourceId: "RD 346/2011",
      sourceTitle: "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo III, apartado 8",
    },
    {
      id: "rd346-2011-anex2-safety",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo II, apartados 7.2.3 y 7.3",
      excerpt:
        "La malla equipotencial une masas y anillo de tierra; las pantallas exteriores se conectan a tierra a no más de 2 m; las penetraciones conservan la resistencia SI 1-3."
    },
    {
      id: "rd346-2011-anex2-fire-compartments",
      sourceId: "RD 346/2011",
      sourceTitle: "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo II, apartado 7.3",
      excerpt: "Los pasos de canalizaciones a través de elementos de compartimentación frente a incendios mantienen la resistencia al fuego exigible según SI 1-3 del DB SI del CTE.",
    },
    {
      id: "rd346-2011-anex2-overvoltage",
      sourceId: "RD 346/2011",
      sourceTitle: "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo II, apartado 7.2.4",
      excerpt: "Según nivel ceráunico y apantallamiento, puede ser conveniente instalar protectores contra sobretensiones en portadores metálicos exteriores; los operadores determinan la necesidad y responden del diseño, suministro e instalación.",
    },
    {
      id: "rd346-2011-anex2-screen-ground",
      sourceId: "RD 346/2011",
      sourceTitle: "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo II, apartado 7.2.3",
      excerpt: "Los cables con portadores metálicos procedentes del exterior estarán apantallados y el extremo de su pantalla se conectará a tierra local cerca de su entrada al recinto del punto de interconexión, nunca a más de 2 m.",
    },
    {
      id: "rd346-2011-anex4-maintenance-protocol",
      sourceId: "RD 346/2011",
      sourceTitle: "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo IV, sección 2",
      excerpt: "La empresa instaladora de telecomunicaciones encargada por la propiedad de las tareas de conservación y mantenimiento le entrega el protocolo de pruebas de los sistemas e instalaciones.",
    },
    {
      id: "rd346-2011-anex2-cem",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo II, apartado 8",
      excerpt:
        "Para los requisitos de compatibilidad electromagnética pueden utilizarse normas armonizadas publicadas en el diario oficial europeo como presunción de conformidad."
    },
    {
      id: "rd346-2011-anex5-framework",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo V, introducción",
      excerpt:
        "Hogar digital contribuye a los objetivos del Código Técnico de la Edificación (CTE) y del Reglamento de Instalaciones Térmicas de los Edificios (RITE)."
    },
    {
      id: "rd346-2011-anex5-services",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo V, apartados 4.2 y 4.3",
      excerpt:
        "Control de iluminación pertenece a Eficiencia Energética, no al grupo Control del Entorno."
    },
    {
      id: "rd346-2011-anex5-level-thresholds",
      sourceId: "RD 346/2011",
      sourceVersion: "consolidated-page-2026-10-15",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo V, apartado 5, tabla Puntuación niveles Hogar Digital",
      excerpt:
        "La tabla fija dos umbrales de puntuación para cada nivel e indica mínimos por cada una de las seis áreas; para el nivel medio, el umbral inferior es 130 puntos, con mínimos de 35 en Seguridad, 30 en Control del Entorno, 30 en Eficiencia Energética, 10 en Ocio y Entretenimiento, 20 en Comunicaciones y 5 en Acceso Interactivo a Contenidos Multimedia."
    },
    {
      id: "rd346-2011-anex5-level-criteria",
      sourceId: "RD 346/2011",
      sourceVersion: "consolidated-page-2026-10-15",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo V, apartado 5, criterios previos a la tabla y puntos 5.3–5.5",
      excerpt:
        "Para alcanzar los niveles se requiere un número mínimo de servicios y cubrir todas las áreas; el apartado 5.3 recoge condiciones de canalización y cableado, y el 5.5 establece los niveles y sus puntuaciones."
    },
    {
      id: "rd346-2011-anex5-digital-home-infrastructure",
      sourceId: "RD 346/2011",
      sourceTitle:
        "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
      locator: "Anexo V, apartados 3 y 5.1–5.5",
      excerpt:
        "El hogar digital dispone de acceso de banda ancha hasta el PAU y cableado estructurado categoría 6 o superior; para su clasificación se añaden una red doméstica ampliada con más BAT RJ45 que las previstas en la ICT y pasarela residencial, red de gestión, control y seguridad y canalizaciones adicionales: en el nivel básico, el videoportero pasa por el PAU o dispone de una canalización hasta él, y hay un conducto adicional del PAU al cuadro eléctrico principal. La caja ciega de la RGCS solo se coloca si la pasarela la requiere."
    }
  ],

  introduction: [
    {
      id: "ict-intro-1",
      text: "El Real Decreto 346/2011 aprueba el Reglamento regulador de las Infraestructuras Comunes de Telecomunicaciones (ICT) para el acceso a servicios de telecomunicación en el interior de edificaciones.",
      kind: "normative",
      legalBasis: ["rd346-2011-art1"],
    review: pendingIct,
    },
    {
      id: "ict-intro-2",
      text: "Su contenido define la estructura física y lógica de canalizaciones, recintos y repartidores para la distribución de telecomunicaciones en inmuebles bajo propiedad horizontal.",
      kind: "normative",
      legalBasis: ["rd346-2011-anex2-infrastructure"],
    review: pendingIct,
    }
  ],

  concepts: [
    ...theoryArticulos.concepts,
    ...annex345.concepts.map((concept) => ({
      ...concept,
      claims: concept.claims.map((claim) => ({ ...claim, review: reviewedIctSupplement })),
    })),
    ...ictAnexos12Adicional.concepts,
    {
      id: "ict-concept-1",
      title: "Definición y Ámbito de la ICT",
      claims: [
        {
          id: "ict-c1-1",
          text: "La ICT comprende las infraestructuras comunes de la edificación destinadas a permitir el acceso a los servicios de telecomunicación; el reglamento se aplica tanto a edificios de nueva construcción como a edificaciones ya existentes, siempre que concurra alguno de los supuestos de su artículo 3.",
          kind: "normative",
          legalBasis: ["rd346-2011-art1", "rd346-2011-art3-scope"],
        review: verifiedIct,
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
          legalBasis: ["rd346-2011-anex2-feeding"],
        review: pendingIct,
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
          legalBasis: ["rd346-2011-anex2-distribution"],
        review: pendingIct,
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
          legalBasis: ["rd346-2011-anex2-dispersion"],
        review: pendingIct,
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
          legalBasis: ["rd346-2011-anex2-user-network"],
        review: pendingIct,
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
          legalBasis: ["rd346-2011-anex2"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-7",
      title: "Recintos RITI y RITS",
      claims: [
        {
          id: "ict-c7-1",
          text: "El Recinto de Instalaciones de Telecomunicación Inferior (RITI) alberga los repartidores de entrada de operadoras y el Recinto de Instalaciones de Telecomunicación Superior (RITS) los equipos de captación de señales radioeléctricas y TV.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-infrastructure"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-8",
      title: "Recinto Único RITU",
      claims: [
        {
          id: "ict-c8-1",
          text: "El anexo III, apartado 4.5.3.i, permite construir un recinto único de instalaciones de telecomunicación (RITU) en edificios o conjuntos inmobiliarios de hasta tres alturas y planta baja con un máximo de 16 PAU, y en conjuntos de viviendas unifamiliares sin límite de PAU.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-infrastructure"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-9",
      title: "Canalización Principal",
      claims: [
        {
          id: "ict-c9-1",
          text: "En edificaciones en altura, la canalización principal debe ser rectilínea y fundamentalmente vertical, y discurrirá próxima al hueco de ascensores o escalera.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex3-canalizacion-principal"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-10",
      title: "Seguridad, puesta a tierra y conformidad de materiales",
      claims: [
        {
          id: "ict-c10-1",
          text: "En recintos no modulares, el sistema de tierra incluye un anillo interior de cobre con una barra colectora conectada al sistema general de tierra de la edificación, al que se unen los equipos y masas metálicas.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex3-tierra-local"],
        review: pendingIct,
        },
        {
          id: "ict-c10-2",
          text: "Los equipos descritos en el proyecto técnico y los materiales usados durante la ejecución deben ajustarse a las especificaciones del reglamento y a las demás normas vigentes aplicables; el artículo 11 destaca las exigencias del Código Técnico de la Edificación sobre seguridad contra incendios y resistencia al fuego.",
          kind: "normative",
          legalBasis: ["rd346-2011-art11-materials"],
          review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-concept-11",
      title: "Compartimentación contra Incendios",
      claims: [
        {
          id: "ict-c11-1",
          text: "En los pasos de canalizaciones por elementos de compartimentación frente a incendios se debe mantener la resistencia al fuego exigible según SI 1-3 del documento básico DB SI del Código Técnico de la Edificación.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-fire-compartments"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-12",
      title: "Presunción de Conformidad CEM",
      claims: [
        {
          id: "ict-c12-1",
          text: "Para acreditar los requisitos de compatibilidad electromagnética de la ICT pueden utilizarse normas armonizadas publicadas en el Diario Oficial de la Unión Europea, que proporcionan presunción de conformidad.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-cem"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-13",
      title: "Certificación del Cableado Instalado",
      claims: [
        {
          id: "ict-c13-1",
          text: "Las redes de distribución y dispersión que utilicen cables de pares trenzados se certifican con arreglo a la norma UNE-EN 50346, Tecnologías de la información. Instalación de cableado. Ensayo de cableados instalados.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-cabling"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-14",
      title: "Punto de Distribución",
      claims: [
        {
          id: "ict-c14-1",
          text: "El punto de distribución realiza la unión entre las redes de distribución y de dispersión de la ICT y, cuando existe, se aloja en los registros secundarios.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-connection-points"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-15",
      title: "Punto de Interconexión",
      claims: [
        {
          id: "ict-c15-1",
          text: "El Punto de interconexión realiza la unión entre las redes de alimentación de los operadores y las redes de distribución de la edificación, delimita las responsabilidades de mantenimiento y se sitúa generalmente en el registro principal del RITI.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-connection-points"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-16",
      title: "Contenido del Proyecto Técnico",
      claims: [
        {
          id: "ict-c16-1",
          text: "El proyecto técnico describe detalladamente los elementos, ubicación, dimensiones y normas de la ICT; sus planos recogen esquemas, elementos, canalizaciones, recintos e interferencias, y el pliego de condiciones determina las calidades de materiales y equipos y las condiciones de montaje.",
          kind: "normative",
          legalBasis: ["rd346-2011-art9-project"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-17",
      title: "Marco Energético del Hogar Digital",
      claims: [
        {
          id: "ict-c17-1",
          text: "El hogar digital contribuye a los objetivos del Código Técnico de la Edificación (CTE) y del Reglamento de Instalaciones Térmicas de los Edificios (RITE) en ahorro y eficiencia energética.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex5-framework"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-18",
      title: "Grupos de Servicios del Hogar Digital",
      claims: [
        {
          id: "ict-c18-1",
          text: "El grupo Control del Entorno incluye automatización de toldos y persianas, ambientes, temperatura y telecontrol; el Control de iluminación pertenece al grupo de Eficiencia Energética.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex5-services"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-19",
      title: "BAT de Fibra Óptica",
      claims: [
        {
          id: "ict-c19-1",
          text: "En el cableado de fibra óptica, la fibra termina en una BAT de fibra óptica con adaptador de tipo SC/APC.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-fiber"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-20",
      title: "Norma Técnica de Radiodifusión y Televisión",
      claims: [
        {
          id: "ict-c20-1",
          text: "El Anexo I contiene la norma técnica de ICT para la captación, adaptación y distribución de señales de radiodifusión sonora y televisión terrestres y por satélite.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex1-scope"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-21",
      title: "Captación de la Red de Alimentación Radioeléctrica",
      claims: [
        {
          id: "ict-c21-1",
          text: "Cuando el enlace del operador se produce por medios radioeléctricos, los elementos de captación se sitúan en la cubierta o azotea de la edificación y los equipos de recepción y procesado se instalan en el RITS.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-network-definition"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-22",
      title: "Puesta a Tierra de Pantallas Exteriores",
      claims: [
        {
          id: "ict-c22-1",
          text: "Los cables con portadores metálicos procedentes del exterior se apantallan y su pantalla se conecta a tierra local cerca de la entrada al recinto del punto de interconexión, nunca a más de 2 metros.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-screen-ground"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-23",
      title: "Servicios STDP",
      claims: [
        {
          id: "ict-c23-1",
          text: "La abreviatura STDP identifica los Servicios de Telefonía Disponible al Público incluidos en la norma técnica del Anexo II.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-network-definition"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-24",
      title: "Interconexión de Fibra Óptica",
      claims: [
        {
          id: "ict-c24-1",
          text: "La conexión entre el panel común de salida de la red del edificio y los repartidores de entrada de los operadores se realiza mediante cordones o latiguillos de fibra óptica terminados en conectores SC/APC.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-fiber"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-25",
      title: "Recorrido de la Red de Alimentación por Cable",
      claims: [
        {
          id: "ict-c25-1",
          text: "Cuando el enlace se produce mediante cable, la red de alimentación entra en la ICT por la arqueta de entrada y llega al RITI, donde se ubica el punto de interconexión.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-network-definition"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-26",
      title: "Impedancia de Cables Coaxiales de Acometida",
      claims: [
        {
          id: "ict-c26-1",
          text: "La impedancia característica media de los cables coaxiales de acometida exterior que operan entre 5 MHz y 3 GHz es de 75 ± 3 Ω.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex1-cables"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-27",
      title: "Servicios Proporcionados por la ICT",
      claims: [
        {
          id: "ict-c27-1",
          text: "La ICT proporciona acceso a servicios de radiodifusión sonora y televisión terrestre y por satélite, así como a telefonía disponible al público y telecomunicaciones de banda ancha mediante redes públicas.",
          kind: "normative",
          legalBasis: ["rd346-2011-art2-services"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-28",
      title: "Puesta a Tierra de Mástiles de Antena",
      claims: [
        {
          id: "ict-c28-1",
          text: "Los mástiles de antena deben conectarse a la toma de tierra del edificio por el camino más corto posible mediante cable de al menos 25 mm² de sección.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex1-masts"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-29",
      title: "Impedancia de la Red Coaxial",
      claims: [
        {
          id: "ict-c29-1",
          text: "Con carácter general, los cables coaxiales y elementos pasivos de la red ICT tienen una impedancia característica o nominal de 75 Ω.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex1-network"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-30",
      title: "Interconexión Equipotencial",
      claims: [
        {
          id: "ict-c30-1",
          text: "Los armarios, bastidores y demás estructuras metálicas accesibles se conectan mediante una red mallada de equipotencialidad entre sí y al anillo de tierra del inmueble.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-safety"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-31",
      title: "Terminación del PAU de Pares Trenzados",
      claims: [
        {
          id: "ict-c31-1",
          text: "Cada acometida de pares trenzados de la red de dispersión termina en una roseta hembra miniatura de ocho vías (RJ45), que sirve como PAU.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-connection-points"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-32",
      title: "Banda de Distribución de RTV",
      claims: [
        {
          id: "ict-c32-1",
          text: "La red de distribución, la red de dispersión y la red interior de usuario permiten distribuir transparentemente la señal entre la cabecera y la toma de usuario en la banda de 5 MHz a 2.150 MHz.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex1-network"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-33",
      title: "Red de Distribución de RTV",
      claims: [
        {
          id: "ict-c33-1",
          text: "En la ICT de radiodifusión sonora y televisión, la red de distribución es la parte que enlaza el equipo de cabecera con la red de dispersión.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex1-scope"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-34",
      title: "Bases de Acceso Terminal (BAT)",
      claims: [
        {
          id: "ict-c34-1",
          text: "Las bases de acceso terminal (BAT) permiten conectar los equipos de telecomunicación del usuario final con la red interior multiservicio.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-bat"],
        },
      ],
    },
    {
      id: "ict-concept-35",
      title: "Ámbito de aplicación: los dos supuestos del artículo 3",
      claims: [
        {
          id: "ict-c35-1",
          text: "El artículo 3 delimita el ámbito por dos supuestos y no por el tipo de obra: (1) todos los edificios y conjuntos inmobiliarios con continuidad en la edificación, de uso residencial o no, y sean o no de nueva construcción, acogidos o que deban acogerse al régimen de propiedad horizontal de la Ley 49/1960; (2) los edificios que, en todo o en parte, hayan sido o sean objeto de arrendamiento por plazo superior a un año.",
          kind: "normative",
          legalBasis: ["rd346-2011-art3-scope"],
        review: verifiedIct,
        },
        {
          id: "ict-c35-2",
          text: "El supuesto de arrendamiento del artículo 3.2 tiene una excepción expresa: no se aplica a los edificios que alberguen una sola vivienda. Por tanto, una vivienda unifamiliar arrendada por más de un año no entra por ese apartado, aunque sí puede quedar incluida por el supuesto de propiedad horizontal si a él está sujeta.",
          kind: "normative",
          legalBasis: ["rd346-2011-art3-scope"],
        review: verifiedIct,
        },
        {
          id: "ict-c35-3",
          text: "El artículo 3 no contiene ningún umbral económico: no exige que el presupuesto de una rehabilitación supere un porcentaje del valor de la edificación, ni emplea la expresión «rehabilitación integral» como criterio de aplicación. El criterio legal es el régimen jurídico del inmueble (propiedad horizontal) o su arrendamiento por más de un año, no la cuantía de la obra.",
          kind: "normative",
          legalBasis: ["rd346-2011-art3-scope"],
        review: verifiedIct,
        },
        {
          id: "ict-c35-4",
          text: "Cuando un edificio no entra en el ámbito del reglamento o no existe obligación de instalar una ICT, el artículo 6 regula la adaptación de las instalaciones preexistentes y la realización de instalaciones individuales, con comunicación escrita al propietario o a la comunidad y consentimiento para usar elementos comunes.",
          kind: "normative",
          legalBasis: ["rd346-2011-art3-scope", "rd346-2011-art6-adaptation"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-concept-36",
      title: "Obligaciones del promotor y de la propiedad",
      claims: [
        {
          id: "ict-c36-1",
          text: "El proyecto técnico lo encarga el promotor y lo firma el profesional encargado del diseño de la ICT, que actúa en coordinación con el autor del proyecto de edificación. Un ejemplar debe obrar en poder de la propiedad, que está obligada a recibirlo, conservarlo y transmitirlo.",
          kind: "normative",
          legalBasis: ["rd346-2011-art9-project"],
        review: verifiedIct,
        },
        {
          id: "ict-c36-2",
          text: "El reglamento no impone presentar el proyecto técnico ante una jefatura provincial antes de solicitar la licencia de obras. Lo que exige el artículo 9 es que la ICT cuente con proyecto técnico y que la propiedad conserve un ejemplar; el artículo 10.4 se refiere a la certificación que expide la Administración cuando se solicita para la cédula de habitabilidad o la licencia de primera ocupación.",
          kind: "normative",
          legalBasis: ["rd346-2011-art9-project", "rd346-2011-art10-replanteo"],
        review: verifiedIct,
        },
        {
          id: "ict-c36-3",
          text: "Las referencias del texto consolidado a las Jefaturas Provinciales de Inspección de Telecomunicaciones se entienden sustituidas por la Secretaría de Estado para el Avance Digital, conforme a la disposición final 4.1 del Real Decreto 391/2019.",
          kind: "normative",
          legalBasis: ["rd346-2011-art10-replanteo"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-concept-37",
      title: "Boletín de instalación y certificado del director de obra",
      claims: [
        {
          id: "ict-c37-1",
          text: "Finalizada la ejecución, la empresa instaladora entrega el boletín de instalación. El artículo 10.2 del Reglamento prevé también el certificado de ajuste al proyecto técnico del director de obra cuando sea exigible y permite que, por la complejidad, baste el boletín. Para concretar los supuestos, el artículo 6.5 de la Orden ITC/1644/2011 exige dirección de obra, al menos, en ICT de edificios de más de 20 viviendas; edificios residenciales con elementos activos en la red de distribución; proyectos que incluyan Hogar Digital; y edificios de uso no residencial. Cuando existe dirección de obra, el artículo 6.4 de la Orden dispone que el director expida el certificado de fin de obra y supervise y entregue el protocolo de pruebas. La lista es de mínimos: no permite inferir que fuera de esos casos nunca pueda exigirse dirección o certificado.",
          kind: "normative",
          legalBasis: ["rd346-2011-art10-replanteo", "itc1644-2011-art6-execution"],
        review: verifiedIct,
        },
        {
          id: "ict-c37-2",
          text: "El «BITE» (Boletín de Instalación de Telecomunicaciones en Edificios) pertenece al régimen anterior del Real Decreto 401/2003; el reglamento vigente habla de «boletín de instalación» sin esa sigla y no lo identifica con el protocolo de pruebas del anexo IV.",
          kind: "normative",
          legalBasis: ["rd346-2011-art10-replanteo", "rd346-2011-anex4"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-concept-38",
      title: "Arqueta de entrada y canalización de enlace",
      claims: [
        {
          id: "ict-c38-1",
          text: "La arqueta de entrada, localizada en el límite de la propiedad, y la canalización de enlace son los elementos que conectan la red exterior del operador con el RITI del edificio.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex3-entry-duct"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-39",
      title: "Registro secundario de planta",
      claims: [
        {
          id: "ict-c39-1",
          text: "Los registros secundarios de planta alojan el punto de distribución donde se bifurcan los cables de la red de distribución hacia cada vivienda o local de la planta, mediante los cables de la red de dispersión.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-connection-points"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-40",
      title: "Canalización secundaria y registro de paso",
      claims: [
        {
          id: "ict-c40-1",
          text: "La canalización secundaria parte del registro secundario de planta y discurre por zonas comunes hasta el PAU de cada vivienda o local, pudiendo incluir registros de paso intermedios.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex3-secondary-duct"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-41",
      title: "Canalización interior de usuario",
      claims: [
        {
          id: "ict-c41-1",
          text: "La canalización interior de usuario comienza en el PAU y termina en los registros de toma donde se ubican las BAT; es responsabilidad del propietario de la vivienda o local.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-user-network"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-42",
      title: "Bandas de frecuencia RTV terrestre",
      claims: [
        {
          id: "ict-c42-1",
          text: "El 4.4.2 fija para la respuesta amplitud/frecuencia en canal las bandas de 47–694 MHz y 950–2.150 MHz.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex1-response-channel"],
        review: verifiedIct,
        },
        {
          id: "ict-c42-2",
          text: "La tabla 4.4.3 fija para la respuesta amplitud/frecuencia en banda de la red 47–862 MHz en la banda terrestre y 950–2.150 MHz en la de satélite; es un parámetro distinto de la respuesta en canal de la tabla 4.4.2.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex1-response-band", "rd346-2011-anex1-response-channel"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-concept-43",
      title: "Señales de satélite (FI y DiSEqC)",
      claims: [
        {
          id: "ict-c43-1",
          text: "Para satélite, la ICT trabaja con señales en la banda de frecuencia intermedia (FI) de 950 MHz a 2.150 MHz; el protocolo DiSEqC permite controlar hasta cuatro posiciones de satélite desde el receptor.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex1-network"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-44",
      title: "Amplificadores de cabecera",
      claims: [
        {
          id: "ict-c44-1",
          text: "La cabecera amplifica y acondiciona las señales de RTV captadas por las antenas; su salida se inyecta en la red de distribución. Los amplificadores deben mantener el nivel de señal dentro de los umbrales establecidos en el Anexo I.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex1-network"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-45",
      title: "Nivel de señal en la toma de usuario (RTV)",
      claims: [
        {
          id: "ict-c45-1",
          text: "La tabla del anexo I, apartado 4.5, fija en la toma de usuario 47–70 dBμV para COFDM-TV, 47–77 dBμV para QPSK-TV y 40–70 dBμV para FM radio. Los niveles digitales se refieren a la potencia en todo el ancho de banda del canal.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex1-niveles"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-46",
      title: "Redes de pares trenzados (STDP y banda ancha)",
      claims: [
        {
          id: "ict-c46-1",
          text: "En las redes de distribución y dispersión, los cables de pares trenzados son como mínimo de cuatro pares de cobre, clase E (categoría 6), con aislamiento individual sin apantallar. El requisito de cubierta no propagadora de la llama, libre de halógenos y de baja emisión de humos que aparece para la red interior de usuario se estudia en su apartado específico.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-twisted-pair-minimum"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-concept-47",
      title: "Registro principal de telefonía",
      claims: [
        {
          id: "ict-c47-1",
          text: "El Registro Principal de telefonía se ubica en el RITI y alberga el Punto de Interconexión entre la red del operador y la red de distribución del edificio para servicios de pares trenzados.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-connection-points"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-48",
      title: "Nivel de servicios del Hogar Digital",
      claims: [
        {
          id: "ict-c48-1",
          text: "El anexo V clasifica las viviendas en tres niveles de equipamiento —hogar digital básico, medio y alto— que se determinan por el número y la ponderación de servicios implantados sobre seis áreas (comunicaciones, eficiencia energética, seguridad, control del entorno, acceso interactivo a contenidos multimedia y ocio), no por una lista cerrada de prestaciones.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex5-services"],
        review: verifiedIct,
        },
        {
          id: "ict-c48-2",
          text: "La puntuación del nivel básico se mueve entre 80 y 100 puntos sobre 100, con mínimos por área: 15 de seguridad, 15 de control del entorno, 15 de eficiencia energética, 10 de ocio y entretenimiento, 20 de comunicaciones y 5 de acceso interactivo a contenidos multimedia.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex5-services"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-concept-49",
      title: "Inspección técnica de la edificación e ICT",
      claims: [
        {
          id: "ict-c49-1",
          text: "El artículo 13.3 incluye un protocolo orientativo de pruebas en el anexo IV. La introducción de ese anexo menciona edificios de más de 30 años e intervalos de 10 años en su descripción de la ITE, pero no debe tomarse ese dato histórico como plazo universal vigente sin consultar la normativa territorial aplicable. Sus documentos se refieren a la ITE que incluya la supervisión de estas infraestructuras.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex4", "rd346-2011-art13-3"],
        review: { status: "needs_review", confidence: { level: "low", reason: "La antigüedad y periodicidad actuales de la ITE dependen de la normativa aplicable; se conserva el contexto del anexo sin generalizarlo." } },
        },
        {
          id: "ict-c49-2",
          text: "El informe de la ITE debe precisar una de tres conclusiones: que la instalación no precisa trabajos inmediatos porque mantiene su funcionalidad, que precisa mantenimiento general o preventivo, o que precisa actuaciones correctivas indicando su grado de urgencia y los elementos a reparar o sustituir.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex4"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-concept-50",
      title: "Documentos normalizados del Anexo IV",
      claims: [
        {
          id: "ict-c50-1",
          text: "El anexo IV contiene documentos de inspección técnica (sección 1), un protocolo de pruebas de mantenimiento (sección 2) y modelos de Análisis Documentado —a realizar por la empresa instaladora— y Estudio Técnico (sección 3). La sentencia del Tribunal Supremo de 17 de octubre de 2012 anuló el inciso que atribuía en exclusiva el Estudio Técnico a ingenieros de telecomunicación o ingenieros técnicos de telecomunicación; no debe estudiarse esa reserva como vigente.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex4"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-concept-51",
      title: "Número mínimo de tomas RTV en una vivienda",
      claims: [
        {
          id: "ict-c51-1",
          text: "En las viviendas, el número de tomas de radiodifusión sonora y televisión (RTV) es de una por cada estancia, excluidos baños y trasteros, con un mínimo de dos. En las estancias comunes de uso general se aplica la regla de toma RTV por estancia, salvo aquellas donde la permanencia habitual no requiera estos servicios.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex1-minimum-takes"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-concept-52",
      title: "Separación entre canalizaciones de telecomunicación y de otros servicios",
      claims: [
        {
          id: "ict-c52-1",
          text: "Las canalizaciones de telecomunicación pasan preferentemente por encima de las de otros servicios, con separación mínima de 100 mm en paralelo y 30 mm en cruces; en la canalización interior de usuario la distancia de 30 mm es válida en ambos casos. Los tabiques de las canalizaciones secundarias conjuntas deben tener una rigidez dieléctrica mínima de 1500 V.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex3-separacion"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-concept-53",
      title: "Protección contra sobretensiones transitorias",
      claims: [
        {
          id: "ict-c53-1",
          text: "Para los portadores metálicos de telecomunicación procedentes del exterior, el reglamento indica que, según el nivel ceráunico y el grado de apantallamiento de la zona, puede ser conveniente instalar protectores contra sobretensiones conectados a tierra. Los operadores de servicio determinan la necesidad de la protección y responden de su diseño, suministro e instalación. Además, las pantallas de esos cables se conectan a tierra local cerca de la entrada al recinto y a no más de 2 m.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-overvoltage", "rd346-2011-anex2-screen-ground"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-54",
      title: "Telecomunicaciones de banda ancha: nodo de acceso",
      claims: [
        {
          id: "ict-c54-1",
          text: "En el enlace por cable, la red de alimentación del operador llega al registro principal del RITI, donde se ubica el punto de interconexión con la red de distribución. Para enlaces radioeléctricos, la captación y el procesado se realizan en el RITS y los cables llegan al punto de interconexión del RITI. La red de distribución puede emplear pares trenzados, pares, fibra óptica o coaxial, según la tecnología de acceso prevista.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-feeding", "rd346-2011-anex2-broadband-route"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-55",
      title: "Conservación y mantenimiento de la ICT",
      claims: [
        {
          id: "ict-c55-1",
          text: "La comunidad de propietarios es la responsable de la conservación, mantenimiento y adecuación permanente de la ICT; puede contratar a una empresa instaladora habilitada para realizar estas tareas.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex4-maintenance-protocol"],
        review: pendingIct,
        }
      ]
    },
    {
      id: "ict-concept-56",
      title: "Correspondencia entre redes y anexos técnicos (artículo 4.1)",
      claims: [
        {
          id: "ict-c56-1",
          text: "El artículo 4.1 reparte la normativa técnica en tres bloques: el anexo I rige la infraestructura destinada a la captación, adaptación y distribución de las señales de radiodifusión sonora y televisión; el anexo II rige la destinada a permitir el acceso a la telefonía disponible al público y a las telecomunicaciones de banda ancha; y la obra civil que soporta las demás infraestructuras se rige por la norma técnica básica de edificación, que recogerá necesariamente las especificaciones mínimas del anexo III.",
          kind: "normative",
          legalBasis: ["rd346-2011-art4-technical-rules"],
        review: verifiedIct,
        },
        {
          id: "ict-c56-2",
          text: "En ausencia de norma técnica básica de edificación, las infraestructuras de obra civil deben cumplir en todo caso las especificaciones del anexo III. El apartado 4.2 añade que esa remisión se entiende sin perjuicio de las competencias que sobre la materia tengan atribuidas otras Administraciones públicas.",
          kind: "normative",
          legalBasis: ["rd346-2011-art4-technical-rules"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-concept-57",
      title: "Consulta e intercambio de información con los operadores (artículo 8)",
      claims: [
        {
          id: "ict-c57-1",
          text: "La consulta del artículo 8.1 persigue dos finalidades: que la oferta de servicios de telecomunicación sea lo más amplia posible en régimen de libre competencia —preguntando al operador qué tipos de redes del proyecto original no tiene previsto utilizar— y confirmar la ubicación más idónea de la arqueta de entrada.",
          kind: "normative",
          legalBasis: ["rd346-2011-art8-operators"],
        review: verifiedIct,
        },
        {
          id: "ict-c57-2",
          text: "El proyectista genera la consulta, facilita la información básica de la edificación y los tiempos de obra, refleja en el acta de replanteo la respuesta y sus consecuencias y, si procede, modifica el proyecto técnico. Los operadores con red son los que despliegan red hasta las edificaciones y se adhieren voluntariamente a la consulta; la Administración solo actúa como gestora del proceso, sin intervenir en el contenido.",
          kind: "normative",
          legalBasis: ["rd346-2011-art8-operators"],
        review: verifiedIct,
        },
        {
          id: "ict-c57-3",
          text: "Los operadores disponen de un plazo máximo de 30 días desde que se realiza la consulta para responder. Transcurrido ese plazo sin contestación, el proyectista proyecta la ICT de acuerdo con las disposiciones del reglamento.",
          kind: "normative",
          legalBasis: ["rd346-2011-art8-operators"],
        review: verifiedIct,
        },
        {
          id: "ict-c57-4",
          text: "El resultado de la consulta se aplica solamente a la ejecución o no de la instalación inicial de las diversas redes interiores. No afecta al diseño, al dimensionado ni a la instalación de los elementos soporte de obra civil, con una única excepción: la determinación de la ubicación de la arqueta de entrada.",
          kind: "normative",
          legalBasis: ["rd346-2011-art8-operators"],
        review: verifiedIct,
        },
        {
          id: "ict-c57-5",
          text: "La consulta debe efectuarse inmediatamente antes del comienzo de las obras de ejecución, haciéndola coincidir con el replanteo. Su resultado se refleja en el acta de replanteo y, si procede, provoca las modificaciones del proyecto técnico mediante el anexo correspondiente.",
          kind: "normative",
          legalBasis: ["rd346-2011-art8-operators", "rd346-2011-art10-replanteo"],
        review: verifiedIct,
        },
        {
          id: "ict-c57-6",
          text: "Precisión de cita: la regla sobre el alcance del resultado está en el párrafo final del apartado 8.1, no en el 8.2. El apartado 8.2 solo define «proyectista» y «operadores con red». Atribuir el efecto al 8.2 es un error de localización frecuente.",
          kind: "interpretative",
          legalBasis: ["rd346-2011-art8-operators"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-concept-58",
      title: "Proyecto técnico: documentos, contenido y versiones (artículo 9)",
      claims: [
        {
          id: "ict-c58-1",
          text: "El proyecto técnico de ejecución incluye, al menos, cuatro documentos: memoria, planos, pliego de condiciones y presupuesto. No forman parte de esa lista el acta de replanteo, el boletín de instalación ni el manual de usuario, que son documentos posteriores o complementarios.",
          kind: "normative",
          legalBasis: ["rd346-2011-art9-project"],
        review: verifiedIct,
        },
        {
          id: "ict-c58-2",
          text: "La memoria especifica como mínimo: descripción de la edificación; descripción de los servicios que se incluyen en la infraestructura; previsiones de demanda; cálculos de niveles de señal en los distintos puntos de la instalación; y elementos que componen la infraestructura.",
          kind: "normative",
          legalBasis: ["rd346-2011-art9-project"],
        review: verifiedIct,
        },
        {
          id: "ict-c58-3",
          text: "Los planos indican esquemas de principio, tipo, número, características y situación de los elementos y canalizaciones, ordenación de los recintos, otras instalaciones que puedan interferir y detalles de puntos singulares. El pliego de condiciones fija calidades de materiales y equipos y condiciones de montaje, y el presupuesto detalla unidades y precios unitarios de cada parte del trabajo.",
          kind: "normative",
          legalBasis: ["rd346-2011-art9-project"],
        review: verifiedIct,
        },
        {
          id: "ict-c58-4",
          text: "Hay dos versiones del proyecto: el proyecto técnico original proyecta y describe la totalidad de las redes que pueden formar parte de la ICT según los operadores que despliegan red en la ubicación, y el proyecto técnico de ejecución incorpora el resultado de la consulta del artículo 8.",
          kind: "normative",
          legalBasis: ["rd346-2011-art9-project", "rd346-2011-art8-operators"],
        review: verifiedIct,
        },
        {
          id: "ict-c58-5",
          text: "Si no existe respuesta de los operadores, el proyecto técnico de ejecución incorpora tecnologías de acceso basadas en fibra óptica en todas las poblaciones y tecnologías basadas en cable coaxial en aquellas poblaciones donde estén presentes operadores de cable en el momento de la entrada en vigor del reglamento.",
          kind: "normative",
          legalBasis: ["rd346-2011-art9-project"],
        review: verifiedIct,
        },
        {
          id: "ict-c58-6",
          text: "Si la instalación requiere una modificación sustancial del proyecto original, la propiedad debe presentar electrónicamente el proyecto modificado con los mismos requisitos; si los cambios no son sustanciales, se incorporan como anexos al proyecto.",
          kind: "normative",
          legalBasis: ["rd346-2011-art9-project"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-concept-59",
      title: "Acta de replanteo: quién, qué contiene y en qué plazo (artículo 10.1)",
      claims: [
        {
          id: "ict-c59-1",
          text: "Al inicio de las obras, el promotor encarga la redacción del acta de replanteo al director de obra de la ICT si existe o, en su defecto, a un profesional con la titulación establecida. El acta la firman el director de obra y el titular de la propiedad o su representación legal.",
          kind: "normative",
          legalBasis: ["rd346-2011-art10-replanteo"],
        review: verifiedIct,
        },
        {
          id: "ict-c59-2",
          text: "El acta contiene una declaración expresa de validez del proyecto original o, si las circunstancias variaron, la forma de acometer su actualización: modificación del proyecto si el cambio es sustancial o anexo al proyecto original si los cambios son de menor entidad. Obligatoriamente incluye una referencia a los resultados de la consulta a operadores.",
          kind: "normative",
          legalBasis: ["rd346-2011-art10-replanteo"],
        review: verifiedIct,
        },
        {
          id: "ict-c59-3",
          text: "El acta de replanteo se presenta electrónicamente en el Registro electrónico del Ministerio en un plazo no superior a 15 días naturales desde su redacción y firma. El plazo se cuenta desde la firma, no desde el inicio de las obras ni desde la finalización.",
          kind: "normative",
          legalBasis: ["rd346-2011-art10-replanteo"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-concept-60",
      title: "Reparto de responsabilidades entre los intervinientes",
      claims: [
        {
          id: "ict-c60-1",
          text: "Promotor → encarga el proyecto técnico y el acta de replanteo y dota de ICT a la edificación. Proyectista → diseña la ICT, lanza la consulta a operadores y actualiza el proyecto. Director de obra → dirige la ejecución, puede introducir modificaciones conforme al artículo 9, apartado segundo, y certifica que la instalación se ajusta al proyecto. Propiedad → recibe, conserva y transmite la documentación y asume el mantenimiento entre el punto de terminación de red y el PAU. Operadores → despliegan la red de alimentación, responden a la consulta en 30 días y retiran su cableado. Administración → gestiona la consulta y puede inspeccionar.",
          kind: "normative",
          legalBasis: ["rd346-2011-art8-operators", "rd346-2011-art9-project", "rd346-2011-art10-replanteo"],
        review: verifiedIct,
        },
        {
          id: "ict-c60-2",
          text: "El operador debe retirar el cableado y elementos que instaló para dar servicio a un abonado cuando concluya el contrato de abono, en un plazo no superior a 30 días. Transcurrido ese plazo, la propiedad puede retirarlo por su cuenta o considerar los elementos integrados en la ICT de la edificación.",
          kind: "normative",
          legalBasis: ["rd346-2011-art5-obligations"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-concept-61",
      title: "Qué anuló el Tribunal Supremo y qué sigue vigente",
      claims: [
        {
          id: "ict-c61-1",
          text: "La sentencia del Tribunal Supremo de 17 de octubre de 2012 anuló en los artículos 8, 9 y 10 el inciso que remitía la titulación al Real Decreto-ley 1/1998. En la sección 3 del anexo IV anuló, además, la atribución exclusiva del Estudio Técnico a ingenieros de telecomunicación o ingenieros técnicos de telecomunicación. El fallo deja vigente el resto de los apartados afectados, incluido el plazo de 15 días naturales del acta de replanteo.",
          kind: "normative",
          legalBasis: ["rd346-2011-art10-replanteo", "rd346-2011-art8-operators", "rd346-2011-art9-project"],
        review: verifiedIct,
        },
        {
          id: "ict-c61-2",
          text: "La Sentencia del Tribunal Supremo de 9 de octubre de 2012 anuló además el inciso del artículo 9, apartado primero, que exigía que el proyecto «debe ser verificado por una entidad que disponga de la independencia necesaria». Por tanto, la verificación por entidad no puede estudiarse como obligación vigente, aunque el precepto conserve su redacción consolidada con la nota de anulación.",
          kind: "normative",
          legalBasis: ["rd346-2011-art9-project"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-concept-62",
      title: "Condiciones del RITU y del RITU-A (anexo III, apartado 4.5.3)",
      claims: [
        {
          id: "ict-c62-1",
          text: "El RITU —recinto único que acumula las funciones del RITI y del RITS— puede instalarse en edificios o conjuntos inmobiliarios de hasta tres alturas y planta baja con un máximo de 16 PAU, y también en conjuntos de viviendas unifamiliares sin límite de PAU. La regla de 16 PAU no se aplica a este último supuesto.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-infrastructure"],
          review: verifiedIct,
        },
        {
          id: "ict-c62-2",
          text: "El RITU-A puede instalarse en edificios o conjuntos inmobiliarios de más de tres alturas y planta baja con un máximo de 16 PAU, o en los que tengan entre 17 y 30 PAU sin límite de alturas. Debe tener una anchura accesible doble de la que correspondería a uno de los recintos sustituidos, mantener las demás dimensiones y situarse donde se ubicaría cualquiera de ellos. El texto establece una posibilidad, no una obligación general de usarlo.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex2-infrastructure", "rd346-2011-anex3-ritu-options"],
          review: verifiedIct,
        },
        {
          id: "ict-c62-3",
          text: "La tabla de dimensiones del Anexo III fija para RITU-A unas dimensiones mínimas de altura × anchura × profundidad de 2.000 × 2.000 × 500 mm hasta 16 PAU cuando el edificio tiene planta baja y más de tres alturas; para 17–20 PAU, 2.000 × 2.000 × 500 mm, y para 21–30 PAU, 2.000 × 3.000 × 500 mm, en ambos últimos casos sin límite de alturas. Debe ser accesible toda la anchura. La salvedad de esa sección permite al proyectista modificar anchura y altura si conserva la superficie accesible y la profundidad mínima, sin perjuicio de las condiciones específicas del RITU-A expuestas en el punto anterior.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex3-rit-dimensions", "rd346-2011-anex3-ritu-options"],
          review: verifiedIct,
        },
      ],
    },
    {
      id: "ict-concept-63",
      title: "Umbrales y mínimos por área de los niveles del Hogar Digital",
      claims: [
        {
          id: "ict-c63-1",
          text: "La tabla del apartado 5 del anexo V establece bandas de puntuación total y mínimos simultáneos por área: nivel básico, 80–100 puntos (mínimos 15 Seguridad, 15 Control del Entorno, 15 Eficiencia Energética, 10 Ocio y Entretenimiento, 20 Comunicaciones y 5 Acceso Interactivo a Contenidos Multimedia); nivel medio, 130–150 (35, 30, 30, 10, 20 y 5, respectivamente); y nivel alto, 180–200 (45, 40, 45, 15, 25 y 10, respectivamente). Además del total, hay que respetar los mínimos por área, cubrir todas las áreas y alcanzar el número mínimo de servicios; el anexo fija también condiciones de infraestructura y cableado. Una suma total suficiente por sí sola no acredita el nivel.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex5-level-thresholds", "rd346-2011-anex5-level-criteria"],
          review: verifiedIct,
        },
      ],
    },
    {
      id: "ict-concept-64",
      title: "Infraestructura necesaria para clasificar una vivienda como Hogar Digital",
      claims: [
        {
          id: "ict-c64-1",
          text: "El anexo V distingue la infraestructura ICT de las dotaciones adicionales necesarias para clasificar una vivienda como Hogar Digital. La ICT lleva el acceso de banda ancha hasta el PAU y dispone de cableado estructurado de categoría 6 o superior en la vivienda; además, el Hogar Digital requiere una Red de Área Doméstica ampliada con más BAT RJ45 que las contempladas en la ICT y una pasarela residencial que interconecte las redes interiores con las exteriores. También incorpora una red de gestión, control y seguridad (RGCS), que puede apoyarse parcialmente en otros medios de transmisión y cuya terminación, si la pasarela lo requiere, se lleva a una caja ciega junto al BAT de conexión. En el hogar digital básico debe existir una canalización de videoportero que pase por el PAU o, alternativamente, una canalización desde el videoportero hasta el PAU; además se requiere cableado adecuado. Para facilitar la instalación, la RGCS debe estar conectada con el PAU y con los cuadros eléctricos; el hogar digital básico debe contar con un conducto adicional desde el PAU hasta el cuadro eléctrico principal. Las condiciones de infraestructura son adicionales a los criterios de servicios y puntuación que clasifican el nivel.",
          kind: "normative",
          legalBasis: ["rd346-2011-anex5-digital-home-infrastructure"],
          review: verifiedIct,
        },
      ],
    },
  ],

  examples: [
    ...annex345.examples.map((example) => ({
      ...example,
      application: example.application.map((claim) => ({ ...claim, review: reviewedIctSupplement })),
    })),
    ...ictAnexos12Adicional.examples,
    {
      id: "ict-ex-1",
      situation: "Un promotor proyecta una ICT para un edificio de cuatro alturas más planta baja, con 8 PAU, y propone un único recinto de telecomunicación.",
      application: [
        {
          id: "ict-ex-1-app-1",
          text: "Con planta baja, más de tres alturas y hasta 16 PAU, el edificio puede optar por RITU-A (apartado 4.5.3), no por el RITU simple. La tabla de 5.5.1 fija para este supuesto 2.000 × 2.000 × 500 mm (altura × anchura × profundidad); toda la anchura debe ser accesible. El proyectista puede modificar altura y anchura solo si mantiene la superficie accesible y la profundidad mínima, además de satisfacer las condiciones específicas de RITU-A del apartado 4.5.3.",
          kind: "example",
          legalBasis: ["rd346-2011-anex3-ritu-options", "rd346-2011-anex3-rit-dimensions"],
          review: pendingIct,
        }
      ]
    },
    {
      id: "ict-ex-2",
      situation: "Una vivienda unifamiliar aislada, no sujeta a propiedad horizontal, se arrienda por catorce meses. El arrendatario pregunta si el propietario está obligado a dotarla de ICT.",
      application: [
        {
          id: "ict-ex-2-app-1",
          text: "El artículo 3.2 incluye los edificios arrendados por más de un año, pero excluye expresamente los que alberguen una sola vivienda. Al no concurrir tampoco el supuesto de propiedad horizontal del artículo 3.1, la vivienda no entra en el ámbito del reglamento por ninguno de los dos apartados.",
          kind: "example",
          legalBasis: ["rd346-2011-art3-scope"],
        review: verifiedIct,
        },
        {
          id: "ict-ex-2-app-2",
          text: "La consecuencia práctica no es la ausencia de derechos del usuario: el artículo 6 permite realizar una instalación individual, con comunicación escrita al propietario y consentimiento para el uso de elementos comunes si fueran necesarios.",
          kind: "example",
          legalBasis: ["rd346-2011-art3-scope"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-ex-3",
      situation: "En el replanteo de un edificio de 30 viviendas, un operador responde a la consulta que no desplegará la red de cable coaxial, aunque sí la de fibra. El proyectista propone reducir la canalización principal y la arqueta de entrada.",
      application: [
        {
          id: "ict-ex-3-app-1",
          text: "La reducción de la red interior de coaxial puede ampararse en la respuesta del operador: el resultado de la consulta se aplica a la ejecución o no de la instalación inicial de las redes interiores.",
          kind: "example",
          legalBasis: ["rd346-2011-art8-operators"],
        review: verifiedIct,
        },
        {
          id: "ict-ex-3-app-2",
          text: "La reducción de la canalización principal y de la arqueta de entrada no está amparada: el resultado de la consulta no afecta al diseño, dimensionado ni instalación de los elementos soporte de obra civil, salvo la determinación de la ubicación de la arqueta, no su capacidad.",
          kind: "example",
          legalBasis: ["rd346-2011-art8-operators"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-ex-4",
      situation: "Un edificio de 1975, en propiedad horizontal, no dispone de ICT y la comunidad debate si debe acometer una obra completa o permitir instalaciones individuales.",
      application: [
        {
          id: "ict-ex-4-app-1",
          text: "El edificio entra en el ámbito del artículo 3.1 por estar acogido a propiedad horizontal, con independencia de su antigüedad: el precepto incluye los edificios «sean o no de nueva construcción».",
          kind: "example",
          legalBasis: ["rd346-2011-art3-scope"],
        review: verifiedIct,
        },
        {
          id: "ict-ex-4-app-2",
          text: "El artículo 6 regula la adaptación de las instalaciones preexistentes y, si no existe o no se adapta la infraestructura común, la instalación individual con comunicación previa y consentimiento para usar elementos comunes.",
          kind: "example",
          legalBasis: ["rd346-2011-art3-scope"],
        review: verifiedIct,
        }
      ]
    },
    {
      id: "ict-ex-5",
      situation: "Durante la revisión de una ICT, una técnica comprueba que las pantallas de los cables metálicos exteriores están conectadas a tierra a 1,5 m de su entrada al RITI. La propiedad pregunta si además debe instalarse siempre un protector de sobretensión.",
      application: [
        {
          id: "ict-ex-5-app-1",
          text: "La conexión de la pantalla a tierra dentro de los 2 m satisface la distancia máxima del apartado 7.2.3; no equivale a un protector contra sobretensiones.",
          kind: "example",
          legalBasis: ["rd346-2011-anex2-safety"],
          review: pendingIct,
        },
        {
          id: "ict-ex-5-app-2",
          text: "El apartado 7.2.4 no impone el protector en todos los edificios. Su conveniencia depende del nivel ceráunico y del apantallamiento, y el operador determina la necesidad y asume diseño, suministro e instalación.",
          kind: "example",
          legalBasis: ["rd346-2011-anex2-overvoltage"],
          review: pendingIct,
        },
      ],
    },
    {
      id: "ict-ex-6",
      situation: "En una memoria técnica aparecen 47–694 MHz para la respuesta en canal terrestre y 47–862 MHz para la respuesta en banda de la red. El alumnado considera que las cifras se contradicen.",
      application: [
        {
          id: "ict-ex-6-app-1",
          text: "Las cifras describen parámetros distintos: el apartado 4.4.2 establece la respuesta amplitud/frecuencia en canal, mientras que el 4.4.3 fija la respuesta amplitud/frecuencia en banda de la red. Deben estudiarse con sus respectivos nombres y localizadores.",
          kind: "example",
          legalBasis: ["rd346-2011-anex1-response-channel", "rd346-2011-anex1-response-band"],
          review: pendingIct,
        },
      ],
    },
    {
      id: "ict-ex-7",
      situation: "Se comparan tres diseños: un bloque de cuatro alturas y planta baja con 16 PAU; un conjunto de 24 PAU en un edificio de ocho alturas; y un conjunto de 22 viviendas unifamiliares.",
      application: [
        {
          id: "ict-ex-7-app-1",
          text: "El primer diseño puede optar por RITU-A por superar tres alturas y planta baja sin exceder 16 PAU. El segundo también puede optar por RITU-A porque tiene entre 17 y 30 PAU, supuesto sin límite de alturas. En ambos casos, el recinto ha de duplicar la anchura accesible del recinto al que sustituye, conservar sus demás dimensiones y ocupar la ubicación de uno de ellos.",
          kind: "example",
          legalBasis: ["rd346-2011-anex2-infrastructure", "rd346-2011-anex3-ritu-options"],
          review: verifiedIct,
        },
        {
          id: "ict-ex-7-app-2",
          text: "El conjunto de 22 viviendas unifamiliares puede optar por RITU sin límite de PAU; el límite de 16 corresponde al supuesto de edificios o conjuntos inmobiliarios de hasta tres alturas y planta baja.",
          kind: "example",
          legalBasis: ["rd346-2011-anex2-infrastructure"],
          review: verifiedIct,
        },
      ],
    }
  ],

  reviewTakeaways: [
    ...ictAnexos12Adicional.reviewTakeaways,
    {
      id: "ict-takeaway-1",
      text: "El RITU unifica RITI y RITS y puede instalarse en edificios o conjuntos inmobiliarios de hasta tres alturas y planta baja con máximo 16 PAU, y en conjuntos de viviendas unifamiliares sin límite de PAU. El RITU-A puede instalarse en edificios de más de tres alturas y planta baja con hasta 16 PAU, o con 17–30 PAU sin límite de alturas; su anchura accesible es doble y conserva las demás dimensiones y ubicación del recinto sustituido.",
      kind: "normative",
          legalBasis: ["rd346-2011-anex2-infrastructure"],
    review: verifiedIct,
    },
    {
      id: "ict-takeaway-2",
      text: "En viviendas unifamiliares, la canalización principal discurre por zona común siempre que sea razonable y, en todo caso, por zonas accesibles.",
      kind: "interpretative",
      legalBasis: ["rd346-2011-anex3-canalizacion-principal"],
    review: pendingIct,
    },
    {
      id: "ict-takeaway-3",
      text: "El orden de las redes ICT siempre es: alimentación → distribución → dispersión → interior de usuario. El PAU separa la parte común de la privada.",
      kind: "normative",
      legalBasis: ["rd346-2011-anex2"],
    review: pendingIct,
    },
    {
      id: "ict-takeaway-4",
      text: "El ámbito del reglamento se define por el régimen jurídico del inmueble, no por el tipo de obra: propiedad horizontal (residencial o no, nueva o existente) y arrendamiento por más de un año salvo vivienda única. No existe en el artículo 3 ningún umbral del 50 % del valor de la edificación.",
      kind: "normative",
      legalBasis: ["rd346-2011-art3-scope"],
    review: verifiedIct,
    },
    {
      id: "ict-takeaway-5",
      text: "Los cables coaxiales de la ICT tienen impedancia de 75 Ω; la banda de distribución de RTV es de 5 MHz a 2.150 MHz. Los mástiles de antena se conectan a tierra con cable de mínimo 25 mm².",
      kind: "normative",
      legalBasis: ["rd346-2011-anex1-cables", "rd346-2011-anex1-masts"],
    review: pendingIct,
    },
    {
      id: "ict-takeaway-6",
      text: "El anexo V distingue tres niveles de hogar digital —básico, medio y alto— que se acreditan por la puntuación obtenida según los servicios implantados en seis áreas, no por una lista cerrada de equipos.",
      kind: "normative",
      legalBasis: ["rd346-2011-anex5-services"],
    review: verifiedIct,
    },
    {
      id: "ict-takeaway-7",
      text: "Consulta a operadores: la lanza el proyectista, responden en 30 días y su resultado solo decide si se ejecutan inicialmente las redes interiores. La obra civil no se toca, salvo la ubicación de la arqueta de entrada.",
      kind: "normative",
      legalBasis: ["rd346-2011-art8-operators"],
    review: verifiedIct,
    },
    {
      id: "ict-takeaway-8",
      text: "Proyecto técnico de ejecución: memoria, planos, pliego de condiciones y presupuesto. La memoria exige descripción de la edificación, servicios, previsiones de demanda, cálculos de niveles de señal y elementos de la infraestructura.",
      kind: "normative",
      legalBasis: ["rd346-2011-art9-project"],
    review: verifiedIct,
    },
    {
      id: "ict-takeaway-9",
      text: "Acta de replanteo: se redacta al inicio de las obras; la firma con la propiedad el director de obra de la ICT si existe o, en caso contrario, el profesional competente encargado. Recoge el resultado de la consulta y se presenta electrónicamente en 15 días naturales desde su firma.",
      kind: "normative",
      legalBasis: ["rd346-2011-art10-replanteo"],
    review: verifiedIct,
    },
    {
      id: "ict-takeaway-10",
      text: "La sentencia del Tribunal Supremo de 9 de octubre de 2012 y la sentencia del Tribunal Supremo de 17 de octubre de 2012 anularon determinados incisos sobre titulación, la atribución exclusiva del Estudio Técnico del anexo IV a titulaciones de telecomunicación y la obligación de verificación por entidad. El plazo de 15 días del acta de replanteo permanece vigente.",
      kind: "normative",
      legalBasis: ["rd346-2011-art10-replanteo", "rd346-2011-art9-project"],
    review: verifiedIct,
    },
    {
      id: "ict-takeaway-11",
      text: "Los niveles básico, medio y alto requieren tanto alcanzar la banda de puntos como respetar mínimos en las seis áreas del anexo V: 80/130/180 puntos son los umbrales inferiores, respectivamente, y una puntuación total por sí sola no acredita el nivel.",
      kind: "normative",
      legalBasis: ["rd346-2011-anex5-level-thresholds"],
      review: verifiedIct,
    }
  ]
};
