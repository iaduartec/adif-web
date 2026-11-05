import type { LessonSummary } from "./types";

export const ictRd3462011Summary: LessonSummary = {
  overview: "El Real Decreto 346/2011 aprueba el Reglamento regulador de las Infraestructuras Comunes de Telecomunicación (ICT). El examen pide delimitar su ámbito por el régimen jurídico del inmueble, distinguir los cuatro tramos de red y los recintos RITI/RITS/RITU, situar el PAU y dominar la secuencia documental: proyecto técnico, consulta a operadores, acta de replanteo y boletín de instalación.",
  keyFacts: [
    "Ámbito (art. 3): edificios en propiedad horizontal, residenciales o no y nuevos o existentes, y edificios arrendados por más de un año salvo los que alberguen una sola vivienda. No existe umbral del 50 % del valor de la edificación.",
    "RITI: recinto inferior → registros principales y punto de interconexión de telefonía y banda ancha.",
    "RITS: recinto superior → captación y acondicionamiento de RTV y equipos de acceso inalámbrico.",
    "RITU: recinto único para hasta 3 alturas más planta baja con máximo 16 PAU, y para conjuntos de viviendas unifamiliares sin límite de PAU. RITU-A: más alturas con 16 PAU o menos, o entre 17 y 30 PAU.",
    "Redes en orden: alimentación → distribución → dispersión → interior de usuario.",
    "PAU: límite técnico y jurídico entre la red común del edificio y la red privada del usuario.",
    "Impedancia coaxial: 75 Ω (75 ± 3 Ω en acometida exterior). Bandas de referencia del anexo I: 47–694 MHz y 950–2.150 MHz.",
    "Mástiles de antena: toma de tierra por el camino más corto con cable de sección mínima 25 mm².",
    "BAT de fibra: conector SC/APC. PAU de pares trenzados: roseta hembra RJ45 de 8 vías.",
    "Cableado de pares trenzados: Clase E (categoría 6) o superior, no 5e.",
    "Hogar digital (anexo V): tres niveles —básico, medio y alto— según la puntuación por servicios en seis áreas; el básico se mueve entre 80 y 100 puntos.",
    "Proyecto técnico de ejecución: memoria, planos, pliego de condiciones y presupuesto.",
    "Consulta a operadores: responden en 30 días; su resultado solo decide la ejecución inicial de las redes interiores.",
    "Acta de replanteo: se presenta electrónicamente en 15 días naturales desde su redacción y firma.",
    "Separación con otros servicios: 100 mm en paralelo y 30 mm en cruce; en la canalización interior de usuario se admiten 30 mm en ambos casos.",
    "ITE: el anexo IV aporta un protocolo orientativo para la ICT; los plazos de inspección del edificio deben contrastarse con la normativa aplicable y la inclusión de la ICT no debe presumirse en toda ITE.",
  ],
  sections: [
    {
      title: "Recintos y canalizaciones — lo que más pregunta el examen",
      points: [
        "RITI (inferior): registros principales y punto de interconexión de telefonía y banda ancha; de él arranca la canalización principal.",
        "RITS (superior): cabecera de RTV y elementos de acceso inalámbrico.",
        "RITU: unifica RITI y RITS en edificios de hasta 3 alturas más planta baja con máximo 16 PAU, y en conjuntos de viviendas unifamiliares sin límite de PAU.",
        "RITU-A: recinto único ampliado para edificios de más de 3 alturas con 16 PAU o menos, o entre 17 y 30 PAU, con anchura accesible doble.",
        "Canalización de enlace: desde la arqueta de entrada hasta el RITI.",
        "Canalización principal: conecta RITI y RITS con los registros secundarios; en altura es rectilínea y fundamentalmente vertical.",
        "Canalización secundaria: desde el registro secundario hasta el registro de terminación de red.",
        "Canalización interior de usuario: desde el PAU hasta las BAT.",
      ]
    },
    {
      title: "Señales y especificaciones técnicas",
      points: [
        "Respuesta amplitud/frecuencia del anexo I sobre 47–694 MHz y 950–2.150 MHz; el proyecto debe proteger la TDT frente a servicios en 694–862 MHz.",
        "Satélite: FI de 950–2.150 MHz; DiSEqC para conmutar posiciones.",
        "Niveles en toma (anexo I, 4.5): COFDM-TV 47–70 dBμV; QPSK-TV 47–77 dBμV; FM radio 40–70 dBμV. En señales digitales se mide la potencia en todo el ancho del canal.",
        "Cables coaxiales de acometida exterior: 75 ± 3 Ω en el rango 5 MHz–3 GHz.",
        "Pares trenzados: Clase E (categoría 6) o superior, cuatro pares sin apantallar, cubierta libre de halógenos.",
        "BAT de fibra: SC/APC; PAU de pares: roseta RJ45 hembra de 8 vías.",
        "Tomas: una por estancia, excluidos baños y trasteros, con un mínimo de dos.",
      ]
    },
    {
      title: "Ámbito y secuencia documental",
      points: [
        "Art. 3: propiedad horizontal (residencial o no, nueva o existente) o arrendamiento por más de un año salvo vivienda única. El criterio no es el tipo de obra ni su presupuesto.",
        "Proyecto técnico original: proyecta todas las redes posibles según los operadores presentes.",
        "Consulta a operadores: la lanza el proyectista antes del inicio de obras, coincidiendo con el replanteo; responden en 30 días.",
        "Proyecto técnico de ejecución: incorpora el resultado de la consulta; si no hay respuesta, fibra en todas las poblaciones y coaxial donde haya operadores de cable.",
        "Acta de replanteo: la encarga el promotor, la firma el director de obra con la propiedad y se presenta en 15 días naturales.",
        "Boletín de instalación de la empresa instaladora y certificado del director de obra: se presentan electrónicamente al terminar.",
      ]
    },
    {
      title: "Seguridad y compatibilidad electromagnética",
      points: [
        "Separación mínima con otros servicios: 100 mm en paralelo y 30 mm en cruce; en la canalización interior de usuario 30 mm en ambos casos. Las telecomunicaciones pasan preferentemente por encima.",
        "Canalizaciones secundarias conjuntas: tabiques de rigidez dieléctrica mínima 1500 V.",
        "Tierra de recintos no modulares: anillo de cobre y barra colectora unida a la tierra general.",
        "Pantallas de cables exteriores: conectadas a tierra local a menos de 2 m de la entrada al recinto.",
        "Mástiles de antena: tierra por el camino más corto, cable de 25 mm² o superior.",
        "Normas armonizadas del DOUE: presunción de conformidad en CEM.",
        "Pasos por elementos de compartimentación: mantener la resistencia al fuego exigible (DB SI del CTE).",
      ]
    },
    {
      title: "Trampas del examen y repaso express",
      points: [
        "No confundir RITI (inferior, cable) con RITS (superior, radio). El RITU los une en edificios pequeños.",
        "La red de dispersión llega al PAU, no a la BAT: después viene la red interior de usuario.",
        "El resultado de la consulta a operadores no permite tocar la obra civil, salvo la ubicación de la arqueta de entrada.",
        "El plazo del acta de replanteo son 15 días naturales desde la firma, no desde el inicio de la obra.",
        "En 2012 el Supremo anuló incisos sobre titulación, la reserva exclusiva del Estudio Técnico del anexo IV a titulaciones de telecomunicación y la verificación obligatoria por entidad. El plazo de 15 días del acta permanece vigente.",
        "Repaso final: define en voz alta RITI, RITS, RITU, RITU-A, PAU, BAT, punto de interconexión y punto de distribución.",
      ]
    }
  ]
};
