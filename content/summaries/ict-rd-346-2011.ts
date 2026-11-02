import type { LessonSummary } from "./types";

export const ictRd3462011Summary: LessonSummary = {
  overview: "El Real Decreto 346/2011 regula las Infraestructuras Comunes de Telecomunicación (ICT) en edificios. El examen pide distinguir los cuatro tramos de red, identificar los recintos (RITI/RITS/RITU) y sus funciones, saber dónde se ubica el PAU y conocer las obligaciones documentales del promotor e instalador.",
  keyFacts: [
    "Obligatoria en edificios nuevos y rehabilitaciones integrales (presupuesto > 50% del valor del edificio).",
    "RITI: recinto inferior → punto de interconexión de operadores de cable/fibra.",
    "RITS: recinto superior → equipos de captación de RTV y enlace radioelétrico.",
    "RITU: recinto único para edificios de hasta 3 alturas + PB y máximo 16 PAU.",
    "Redes en orden: alimentación → distribución → dispersión → interior de usuario.",
    "PAU: límite jurídico y técnico entre red común del edificio y red privada del usuario.",
    "Impedancia coaxial ICT: 75 Ω; banda de distribución RTV: 5 MHz–2.150 MHz.",
    "Mástiles de antena se conectan a tierra con cable de sección mínima 25 mm².",
    "BAT de fibra óptica: conector SC/APC. PAU de pares trenzados: conector RJ45 hembra 8 vías.",
    "Hogar Digital (Anexo V): Nivel 1 (telecomunicaciones básicas), Nivel 2 (control + eficiencia), Nivel 3 (automatización plena).",
    "Documentos clave: Proyecto Técnico (antes de licencia de obras), BITE (boletín de instalación), Certificado de Fin de Obra.",
    "Separación ICT/electricidad: 10 cm en paralelo, 3 cm en cruce.",
    "Inspecciones obligatorias: previa a puesta en servicio y luego con periodicidad ≤ 15 años.",
  ],
  sections: [
    {
      title: "Recintos y canalizaciones — lo que más pregunta el examen",
      points: [
        "RITI (inferior): punto de interconexión de telefonía y banda ancha por cable.",
        "RITS (superior): cabecera de RTV, antenas y equipos de enlace radioelétrico.",
        "RITU: solución simplificada para edificios pequeños (≤ 3 plantas + PB, máximo 16 PAU).",
        "Canalización de enlace: desde arqueta de entrada hasta RITI.",
        "Canalización principal: vertical, por hueco de escalera o ascensores; conecta RITI con registros secundarios de planta.",
        "Canalización secundaria: desde registro secundario de planta hasta el PAU de cada vivienda.",
        "Canalización interior de usuario: desde PAU hasta las BAT en el interior de la vivienda.",
      ]
    },
    {
      title: "Señales y especificaciones técnicas",
      points: [
        "TDT: banda UHF 470–790 MHz. DAB: banda III 174–240 MHz.",
        "Satélite: FI de 950–2.150 MHz; protocolo DiSEqC para conmutar posiciones de satélite.",
        "Nivel de señal en toma de usuario (TDT y satélite): 47–77 dBμV; FM analógica: mínimo 40 dBμV.",
        "Cables coaxiales de acometida exterior: 75 ± 3 Ω en rango 5 MHz–3 GHz.",
        "Pares trenzados: red de distribución categoría 6 (mínimo); red de dispersión categoría 5e.",
        "BAT de fibra: conector SC/APC; PAU de pares: roseta RJ45 hembra de 8 vías.",
      ]
    },
    {
      title: "Obligaciones, documentos e inspección",
      points: [
        "Promotor: obligado a instalar la ICT y presentar el Proyecto Técnico antes de la licencia de obras.",
        "Instalador: emite el BITE (Boletín de Instalación de Telecomunicaciones en Edificios) al terminar.",
        "Director de obra: firma el Certificado de Fin de Obra (o Protocolo de Pruebas).",
        "Comunidad de propietarios: responsable de conservación y mantenimiento de la ICT.",
        "Periodicidad de inspecciones: antes de la puesta en servicio y después con un máximo de 15 años entre revisiones.",
      ]
    },
    {
      title: "Seguridad y compatibilidad electromagnética",
      points: [
        "Separación mínima con canalizaciones eléctricas: 10 cm en paralelo, 3 cm en cruce.",
        "Tierra de recintos no modulares: anillo de cobre + barra colectora conectada a tierra general.",
        "Pantallas de cables exteriores: conectadas a tierra local a menos de 2 m de la entrada al recinto.",
        "Mástiles de antena: tierra por el camino más corto, cable de ≥ 25 mm².",
        "Normas armonizadas DOUE: presunción de conformidad CEM.",
        "Pasos de canalizaciones por elementos de compartimentación contra incendios: mantener resistencia al fuego (DB SI del CTE).",
      ]
    },
    {
      title: "Trampas del examen y repaso express",
      points: [
        "No confundir RITI (inferior, cable) con RITS (superior, radio). El RITU los une en edificios pequeños.",
        "La red de dispersión no llega hasta la BAT — llega hasta el PAU. Después viene la red interior de usuario.",
        "El Proyecto Técnico va ANTES de la licencia de obras; el BITE y el Certificado de Fin de Obra van DESPUÉS.",
        "El número máximo de PAU para un RITU simple es 16 (no 'ilimitado en edificios pequeños').",
        "Repaso final express: define en voz alta RITI, RITS, RITU, PAU, BAT, BITE, punto de interconexión, punto de distribución.",
      ]
    }
  ]
};
