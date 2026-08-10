import type { TheorySection } from "../lesson-theory";

export const cemTheory: TheorySection = {
  sources: [
    {
      id: "dir-2014-30-ue",
      sourceId: "Directiva 2014/30/UE",
      sourceTitle: "Directiva de Compatibilidad Electromagnética",
      sourceUrl: "https://www.boe.es/buscar/doc.php?id=DOUE-L-2014-80595",
      locator: "Artículo 1",
      excerpt: "Esta Directiva regula la compatibilidad electromagnética de los equipos..."
    },
    {
      id: "rd186-2016",
      sourceId: "Real Decreto 186/2016",
      sourceTitle: "Real Decreto de transposición de la Directiva de CEM",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2016-4442",
      locator: "Artículo 3",
      excerpt: "Los equipos deberán cumplir los requisitos esenciales de protección..."
    },
    {
      id: "en50121",
      sourceId: "EN 50121",
      sourceTitle: "Norma armonizada europea de compatibilidad electromagnética en aplicaciones ferroviarias",
      sourceUrl: "https://www.adif.es/w/pni26-01-personal-operativo",
      locator: "Partes 1 a 5",
      excerpt: "Especifica los límites de emisión e inmunidad para material rodante e instalaciones fijas..."
    }
  ],

  introduction: [
    {
      id: "cem-intro-1",
      text: "La compatibilidad electromagnética (CEM) es la capacidad de un equipo para funcionar satisfactoriamente sin introducir perturbaciones electromagnéticas intolerables y sin sufrir degradaciones inaceptables.",
      kind: "normative",
      legalBasis: ["dir-2014-30-ue"]
    },
    {
      id: "cem-intro-2",
      text: "En el entorno ferroviario, la CEM es un factor de seguridad crítico debido a la coexistencia de sistemas sensibles y fuentes de tracción eléctrica de gran potencia.",
      kind: "didactic",
      legalBasis: ["en50121"]
    }
  ],

  concepts: [
    {
      id: "cem-concept-1",
      title: "Emisión e Inmunidad",
      claims: [
        {
          id: "cem-c1-1",
          text: "Un equipo es compatible electromagnéticamente cuando su nivel de emisión se sitúa por debajo de los límites normativos y su nivel de inmunidad por encima de los umbrales exigidos.",
          kind: "normative",
          legalBasis: ["rd186-2016"]
        }
      ]
    },
    {
      id: "cem-concept-2",
      title: "Directiva CEM 2014/30/UE",
      claims: [
        {
          id: "cem-c2-1",
          text: "Directiva europea transpuesta en España mediante el Real Decreto 186/2016. Define los requisitos esenciales de protección para aparatos comercializados en la UE.",
          kind: "normative",
          legalBasis: ["dir-2014-30-ue", "rd186-2016"]
        }
      ]
    },
    {
      id: "cem-concept-3",
      title: "Norma UNE-EN 50121",
      claims: [
        {
          id: "cem-c3-1",
          text: "Es la norma armonizada de CENELEC específica para la CEM en ferrocarriles, que prescribe los ensayos y límites de emisión e inmunidad de material e instalaciones.",
          kind: "normative",
          legalBasis: ["en50121"]
        }
      ]
    },
    {
      id: "cem-concept-4",
      title: "Acoplamiento Electromagnético",
      claims: [
        {
          id: "cem-c4-1",
          text: "El acoplamiento describe la transferencia de energía perturbadora de la fuente a la víctima. Puede ser conducido, inductivo (campo magnético) o capacitivo (campo eléctrico).",
          kind: "didactic",
          legalBasis: ["en50121"]
        }
      ]
    },
    {
      id: "cem-concept-5",
      title: "Medición y Ensayos",
      claims: [
        {
          id: "cem-c5-1",
          text: "Los ensayos de emisión radiada de material rodante en prueba estacionaria se miden por norma armonizada a una distancia de 10 metros utilizando detector de cuasi-pico.",
          kind: "normative",
          legalBasis: ["en50121"]
        }
      ]
    }
  ],

  examples: [
    {
      id: "cem-ex-1",
      situation: "Durante el arranque de un tren, se detectan fallos de ocupación espuria en los circuitos de vía y caídas temporales en la cobertura de radio GSM-R.",
      application: [
        {
          id: "cem-ex-1-app-1",
          text: "Requiere verificar si el tren cumple con los límites de emisión marcados por la EN 50121-3-1 y si los equipos de señalización cumplen con la inmunidad de la EN 50121-4.",
          kind: "example",
          legalBasis: ["en50121"]
        }
      ]
    }
  ],

  reviewTakeaways: [
    {
      id: "cem-takeaway-1",
      text: "La Directiva 2014/30/UE se transpone en España por el Real Decreto 186/2016 regulando las obligaciones de marcado CE y conformidad técnica.",
      kind: "normative",
      legalBasis: ["dir-2014-30-ue", "rd186-2016"]
    },
    {
      id: "cem-takeaway-2",
      text: "La familia de normas EN 50121 es el estándar técnico armonizado que detalla los métodos de ensayo de CEM en el ámbito ferroviario.",
      kind: "interpretative",
      legalBasis: ["en50121"]
    }
  ]
};
