import type { LegalReference, TheoryConcept, TheoryExample, TheoryClaim } from "../theory-types";

/** Ampliación aislada de puntos poco desarrollados en los anexos III–V.
 * Cotejo principal: texto consolidado BOE, última actualización 26-03-2025.
 * El PDF PNI26/01 disponible localmente es snapshot ADIF de agosto de 2026,
 * supersedido por la versión enlazada y descargada el 15-10-2026.
 */

const boe = "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834";
const title = "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones";

export const sources: LegalReference[] = [
  {
    id: "ict-anex345-anex3-rit-conditions",
    sourceId: "RD 346/2011",
    sourceTitle: title,
    sourceUrl: boe,
    locator: "Anexo III, apartados 5.5.2–5.5.5",
    excerpt: "Condiciones constructivas, ubicación, ventilación e instalaciones eléctricas de los recintos ICT.",
  },
  {
    id: "ict-anex345-anex4-analysis-study",
    sourceId: "RD 346/2011",
    sourceTitle: title,
    sourceUrl: boe,
    locator: "Anexo IV, introducción y sección 3",
    excerpt: "La introducción prevé modelos de Análisis Documentado y Estudio Técnico para actualizar, renovar o sustituir una parte importante de instalaciones. La nota del anexo IV recoge la anulación judicial de la atribución exclusiva del Estudio Técnico a dos titulaciones de telecomunicación.",
  },
  {
    id: "ict-anex345-anex5-services-levels",
    sourceId: "RD 346/2011",
    sourceTitle: title,
    sourceUrl: boe,
    locator: "Anexo V, apartados 4 y 5",
    excerpt: "Enumera seis áreas de servicios del Hogar Digital y condiciona la clasificación a un mínimo de servicios, cobertura de todas las áreas, funcionalidades puntuadas e intervalos globales y por área.",
  },
];

export const concepts: TheoryConcept[] = [
  {
    id: "ict-anex345-concept-rit-conditions",
    title: "Condiciones de instalación de los recintos ICT (anexo III)",
    claims: [
      {
        id: "ict-anex345-c-rit-conditions-1",
        text: "Salvo los RIT modulares, el recinto debe tener pavimento rígido que disipe cargas electrostáticas y paredes y techo con capacidad portante suficiente. Se sitúa en zona comunitaria; el RITI o RITU estará, si es posible, sobre rasante y, si queda a nivel inferior, debe disponer de sumidero con desagüe que impida acumular agua. El RITS se sitúa preferentemente en cubierta o azotea y nunca por debajo de la última planta.",
        kind: "normative",
        legalBasis: ["ict-anex345-anex3-rit-conditions"],
      },
      {
        id: "ict-anex345-c-rit-conditions-2",
        text: "Si hay próximo un centro de transformación, una caseta de maquinaria de ascensores o maquinaria de aire acondicionado, los recintos ICT se separan al menos 2 m o se les dota de la protección contra campo electromagnético prevista por el reglamento. Se evita situarlos bajo canalizaciones o desagües y, en todo caso, se protegen frente a la humedad.",
        kind: "normative",
        legalBasis: ["ict-anex345-anex3-rit-conditions"],
      },
      {
        id: "ict-anex345-c-rit-conditions-3",
        text: "La ventilación puede ser natural directa, natural forzada mediante conducto vertical y aspirador estático, o mecánica; esta última debe renovar totalmente el aire del local al menos dos veces por hora. La instalación eléctrica se ajusta al REBT y cada recinto cuenta con canalización eléctrica directa desde el Cuadro de Servicios Generales, con conductores de cobre de sección mínima 2 × 6 + T mm² y tubo de diámetro exterior mínimo de 32 mm o canal de sección equivalente.",
        kind: "normative",
        legalBasis: ["ict-anex345-anex3-rit-conditions"],
      },
    ],
  },
  {
    id: "ict-anex345-concept-documentation",
    title: "Análisis Documentado y Estudio Técnico: alcance y autoría (anexo IV)",
    claims: [
      {
        id: "ict-anex345-c-documentation-1",
        text: "Cuando, a petición de la propiedad o tras una inspección, se actualiza, renueva o sustituye una parte importante de las instalaciones, el anexo ofrece modelos de Análisis Documentado y Estudio Técnico. El primero lo realiza la empresa instaladora y describe la instalación y las actuaciones propuestas; el segundo desarrolla la evaluación y el diseño o dimensionamiento. Una sentencia de 2012 anuló el inciso que atribuía exclusivamente su realización a titulaciones de telecomunicación, por lo que no debe estudiarse como una reserva exclusiva vigente.",
        kind: "normative",
        legalBasis: ["ict-anex345-anex4-analysis-study"],
      },
      {
        id: "ict-anex345-c-documentation-2",
        text: "Los modelos de la sección 3 varían según el tipo de red y la actuación: pueden incluir estado y mediciones, modificación propuesta, esquemas o fotografías, medidas para mantener la continuidad del servicio durante las obras y, cuando proceda, riesgos de seguridad y salud. El Estudio Técnico de banda ancha debe dimensionar la propuesta conforme al anexo II y preservar el libre acceso de los operadores.",
        kind: "normative",
        legalBasis: ["ict-anex345-anex4-analysis-study"],
      },
    ],
  },
  {
    id: "ict-anex345-concept-service-areas",
    title: "Seis áreas de servicios del Hogar Digital (anexo V)",
    claims: [
      {
        id: "ict-anex345-c-service-areas-1",
        text: "El anexo V agrupa servicios en seis áreas: Seguridad; Control del Entorno; Eficiencia Energética; Ocio y Entretenimiento; Comunicaciones; y Acceso Interactivo a Contenidos Multimedia. Por ejemplo, el control de iluminación figura en Eficiencia Energética; el vídeo-portero, en Seguridad; y la teleasistencia básica, en Acceso Interactivo a Contenidos Multimedia. La clasificación por áreas sirve para aplicar los mínimos de puntuación del nivel, aunque algunos servicios tengan relación con más de un grupo.",
        kind: "normative",
        legalBasis: ["ict-anex345-anex5-services-levels"],
      },
      {
        id: "ict-anex345-c-service-areas-2",
        text: "Para clasificar una vivienda en un nivel no basta sumar puntos: debe alcanzar el mínimo de servicios, cubrir las seis áreas y respetar tanto el intervalo total como los mínimos de puntuación de cada área. Además, el anexo distingue servicios cuya disponibilidad depende de que el usuario contrate al proveedor de aquellos que pueden derivarse de contar con la infraestructura y los dispositivos adecuados.",
        kind: "normative",
        legalBasis: ["ict-anex345-anex5-services-levels"],
      },
    ],
  },
];

export const examples: TheoryExample[] = [
  {
    id: "ict-anex345-example-study-vs-analysis",
    situation: "Una comunidad quiere renovar parte de la red de banda ancha y pregunta si basta con encargar un Análisis Documentado a la empresa instaladora.",
    application: [
      {
        id: "ict-anex345-example-study-vs-analysis-1",
        text: "El Análisis Documentado identifica la instalación existente y los trabajos previstos; el Estudio Técnico evalúa y diseña o dimensiona la modificación. La atribución exclusiva de este estudio a dos titulaciones de telecomunicación fue anulada judicialmente. La documentación concreta que procede depende del alcance y de la actuación; los modelos del anexo IV no convierten ambos documentos en equivalentes.",
        kind: "example",
        legalBasis: ["ict-anex345-anex4-analysis-study"],
      },
    ],
  },
];

export const reviewTakeaways: TheoryClaim[] = [
  {
    id: "ict-anex345-takeaway-scope",
    text: "Al estudiar estos anexos, separa las reglas técnicas de los recintos (anexo III), los formularios y funciones documentales (anexo IV) y los requisitos de servicios, infraestructura y clasificación del Hogar Digital (anexo V). La introducción del anexo IV cita edades y periodicidades de la ITE; no las presentes como regla universal vigente sin comprobar la normativa territorial aplicable. La tabla completa de servicios del anexo V aparece como imágenes en la publicación BOE y no queda transcrita ni revisada servicio por servicio en esta ampliación.",
    kind: "didactic",
    legalBasis: ["ict-anex345-anex3-rit-conditions", "ict-anex345-anex4-analysis-study", "ict-anex345-anex5-services-levels"],
  },
];
