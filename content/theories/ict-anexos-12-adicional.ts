import type {
  LegalReference,
  TheoryClaim,
  TheoryConcept,
  TheoryExample,
  TheorySection,
} from "../theory-types";

const sourceUrl = "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834";
const sourceTitle =
  "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones";
const reviewed = {
  status: "reviewed",
  reviewedAt: "2026-11-05",
  reviewedBy: "cotejo-boe-anexos-I-II",
  confidence: {
    level: "high",
    reason:
      "Cotejado con el texto consolidado BOE-A-2011-5834, última modificación publicada el 26/03/2025, y con los apartados indicados.",
  },
} as const;

const claim = (
  id: string,
  text: string,
  legalBasis: string[],
  kind: TheoryClaim["kind"] = "normative",
): TheoryClaim => ({ id, text, legalBasis, kind, review: reviewed });

export const ictAnexos12Adicional: Pick<
  TheorySection,
  "sources" | "concepts" | "examples" | "reviewTakeaways"
> = {
  sources: [
    {
      id: "ict-anex12-ref-i-4-5",
      sourceId: "RD 346/2011",
      sourceVersion: "consolidated-page-2026-10-15",
      verifiedAt: "2026-10-15",
      sourceTitle,
      sourceUrl,
      locator:
        "Anexo I, apartados 4.4.2 y 4.5; texto modificado por Real Decreto 250/2025, disposición final primera",
      excerpt:
        "La tabla de 4.5 fija niveles de señal, relaciones C/N, interferencia, intermodulación y parámetros globales de calidad en toma. Para COFDM-TV: 47–70 dBμV; MER mínimo 21 dB para COFDM-TV y 22 dB para COFDM-256QAM TV (DVB-T2). La nota (2) distingue los valores aconsejables de los mínimos.",
    },
    {
      id: "ict-anex12-ref-i-4-2",
      sourceId: "RD 346/2011",
      sourceVersion: "consolidated-page-2026-10-15",
      verifiedAt: "2026-10-15",
      sourceTitle,
      sourceUrl,
      locator: "Anexo I, apartado 4.2.1, letra a), y 4.2.2, letra a)",
      excerpt:
        "Para los sistemas captadores situados a menos de 20 m del suelo se indican 130 km/h; para los situados a más de 20 m, 150 km/h. Los dos apartados formulan el umbral con ‘menos’ y ‘más’ de 20 m.",
    },
    {
      id: "ict-anex12-ref-ii-3-1",
      sourceId: "RD 346/2011",
      sourceVersion: "consolidated-page-2026-10-15",
      verifiedAt: "2026-10-15",
      sourceTitle,
      sourceUrl,
      locator:
        "Anexo II, apartado 3.1 y apartados 3.1.1–3.1.4 y 3.1.5",
      excerpt:
        "Los valores de previsión de demanda son mínimos de obligado cumplimiento. El apartado 3.1.1 da como referencia pares trenzados para distancias inferiores a 100 m y admite otra solución si se justifica en el proyecto; el 3.1.2 toma como referencia cables de pares para distancias superiores a 100 m.",
    },
    {
      id: "ict-anex12-ref-ii-3-3-5",
      sourceId: "RD 346/2011",
      sourceVersion: "consolidated-page-2026-10-15",
      verifiedAt: "2026-10-15",
      sourceTitle,
      sourceUrl,
      locator:
        "Anexo II, apartados 3.3.1, 3.3.2 y 3.5.1–3.5.3",
      excerpt:
        "Para redes de distribución de pares trenzados y pares, una vertical se dimensiona aplicando un factor 1,2 a la demanda prevista. La red interior de pares trenzados, coaxial y fibra tiene dotaciones diferenciadas; los locales sin distribución de estancias no reciben red interior de usuario en la previsión del proyecto.",
    },
  ] satisfies LegalReference[],
  concepts: [
    {
      id: "ict-anex12-concept-i-quality-current",
      title: "Anexo I: calidad en toma y lectura de la tabla vigente",
      claims: [
        claim(
          "ict-anex12-claim-i-quality-ranges",
          "La tabla vigente del Anexo I, apartado 4.5, sitúa los niveles de calidad en la toma de usuario y separa las columnas 47–694 MHz y 950–2.150 MHz. Entre los rangos de nivel de señal figuran COFDM-TV 47–70 dBμV, QPSK-TV 47–77 dBμV y FM radio 40–70 dBμV; para las modulaciones digitales, el nivel se refiere a la potencia en todo el ancho de banda del canal.",
          ["ict-anex12-ref-i-4-5"],
        ),
        claim(
          "ict-anex12-claim-i-mer-obligation-vs-advice",
          "No confundir mínimo y valor aconsejable: el MER mínimo en toma es ≥21 dB para COFDM-TV y ≥22 dB para COFDM-256QAM TV (DVB-T2). La nota (2) aconseja 22 dB en toma para COFDM-64QAM TVE y señala un mínimo de 23 dB en antena al considerar la instalación receptora; para COFDM-256QAM TV aconseja 23 dB en toma y 24 dB en antena.",
          ["ict-anex12-ref-i-4-5"],
        ),
        claim(
          "ict-anex12-claim-i-am-tv-conditional",
          "Los valores de AM-TV aparecen solo como referencia para el caso de que se decida distribuir una señal de distribución no obligatoria en la ICT; no convierten esa modulación en un servicio obligatorio.",
          ["ict-anex12-ref-i-4-5"],
        ),
      ],
    },
    {
      id: "ict-anex12-concept-i-wind",
      title: "Anexo I: resistencia al viento de los sistemas captadores",
      claims: [
        claim(
          "ict-anex12-claim-i-wind-speeds",
          "Los apartados 4.2.1 y 4.2.2 fijan 130 km/h para sistemas captadores situados a menos de 20 m del suelo y 150 km/h para los situados a más de 20 m. El texto no asigna expresamente un valor al caso situado exactamente a 20 m.",
          ["ict-anex12-ref-i-4-2"],
        ),
      ],
    },
    {
      id: "ict-anex12-concept-ii-demand-minima",
      title: "Anexo II: previsión mínima de demanda por tecnología",
      claims: [
        claim(
          "ict-anex12-claim-ii-demand-status-distance",
          "Los valores del apartado 3.1 son mínimos de obligado cumplimiento. La distancia de 100 m distingue criterios de referencia: pares trenzados por debajo y pares por encima; no es una prohibición absoluta de otra tecnología, pues 3.1.1 permite una solución distinta si el proyectista la justifica adecuadamente en el proyecto.",
          ["ict-anex12-ref-ii-3-1"],
        ),
        claim(
          "ict-anex12-claim-ii-demand-twisted-pair",
          "Con operadores y acceso por pares trenzados, se prevé una acometida por vivienda; en locales/oficinas de edificio residencial, una por local si está definida la distribución o al menos una por cada 33 m² útiles si solo se conoce la superficie. En edificios destinados fundamentalmente a locales/oficinas, son dos por local definido o al menos una por cada 33 m² útiles si la distribución se desconoce. Se prevén además dos acometidas para las estancias o instalaciones comunes del edificio.",
          ["ict-anex12-ref-ii-3-1"],
        ),
        claim(
          "ict-anex12-claim-ii-demand-copper-coax-fiber",
          "Las previsiones cambian con la tecnología: para pares, dos líneas por vivienda; para coaxial, una acometida por vivienda; para fibra, una acometida óptica por vivienda, formada por dos fibras. Si no hay operadores, el anexo prevé las canalizaciones necesarias para la demanda calculada, dotadas con hilos-guía. Ascensores siguen su normativa específica de demanda; para servicios adicionales la previsión puede hacerse libremente, pero se dispone un tubo de 25 mm desde el registro principal hasta una toma con tapa ciega en el espacio del ascensor.",
          ["ict-anex12-ref-ii-3-1"],
        ),
      ],
    },
    {
      id: "ict-anex12-concept-ii-reserve-and-user",
      title: "Anexo II: reserva de distribución y tomas interiores",
      claims: [
        claim(
          "ict-anex12-claim-ii-factor-reserve",
          "En edificios con una vertical, la red de distribución de pares trenzados y la de pares se dimensionan multiplicando por 1,2 la demanda prevista; con varias verticales, cada vertical se trata como red independiente. Para pares, además se elige cable normalizado de capacidad igual o superior al resultado teórico.",
          ["ict-anex12-ref-ii-3-3-5"],
        ),
        claim(
          "ict-anex12-claim-ii-interior-different-counts",
          "En la vivienda, la red interior de pares trenzados exige al menos dos registros BAT en el salón, uno de ellos doble, y al menos otra estancia con BAT doble; una de las tomas del salón queda a menos de 50 cm de la toma de fibra. La red coaxial de usuario requiere dos tomas en dos estancias distintas. La fibra llega a una roseta/BAT óptica en la estancia principal, próxima a la BAT doble de pares trenzados.",
          ["ict-anex12-ref-ii-3-3-5"],
        ),
        claim(
          "ict-anex12-claim-ii-undivided-local",
          "Si aún no está definida la distribución de un local u oficina, no se instala la red interior de usuario de pares trenzados ni la coaxial en esta fase: su diseño, dimensionamiento y realización futura quedan a cargo de la propiedad cuando se ejecute el proyecto de distribución en estancias.",
          ["ict-anex12-ref-ii-3-3-5"],
        ),
      ],
    },
  ],
  examples: [
    {
      id: "ict-anex12-example-distance-reference",
      situation:
        "En un proyecto, la distancia desde el punto de interconexión hasta el PAU más alejado es de 110 m y se propone pares trenzados.",
      application: [
        claim(
          "ict-anex12-example-claim-distance-reference",
          "El umbral superior a 100 m hace que la referencia del apartado 3.1.2 sean redes de pares, pero no basta para declarar inválida la propuesta: debe justificarse adecuadamente en el proyecto conforme a la posibilidad de solución diferente del apartado 3.1.1.",
          ["ict-anex12-ref-ii-3-1"],
          "example",
        ),
      ],
    },
    {
      id: "ict-anex12-example-no-operators",
      situation:
        "En la ubicación del edificio todavía no hay operador de servicio, pero se proyecta la ICT para permitir futuras conexiones.",
      application: [
        claim(
          "ict-anex12-example-claim-no-operators",
          "Se mantienen las canalizaciones previstas para la demanda tecnológica y se dotan de hilos-guía; la ausencia actual de operador no elimina esa previsión de infraestructura.",
          ["ict-anex12-ref-ii-3-1"],
          "example",
        ),
      ],
    },
  ],
  reviewTakeaways: [
    claim(
      "ict-anex12-takeaway-anex1-current-version",
      "Para preguntas numéricas del Anexo I, usar el texto consolidado actualizado: el apartado 4.5 fue modificado por el Real Decreto 250/2025 y trabaja con la banda terrestre 47–694 MHz; separar límites mínimos, valores aconsejables y supuestos no obligatorios anotados al pie.",
      ["ict-anex12-ref-i-4-5"],
      "interpretative",
    ),
    claim(
      "ict-anex12-takeaway-anex2-exceptions",
      "En el Anexo II, distinguir mínimos obligatorios de criterios de referencia y de excepciones justificables; separar demanda de red de edificio, capacidad de distribución y dotación de red interior de usuario.",
      ["ict-anex12-ref-ii-3-1", "ict-anex12-ref-ii-3-3-5"],
      "interpretative",
    ),
  ],
};
