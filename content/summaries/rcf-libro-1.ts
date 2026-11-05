import type { LessonSummary } from "./types";

export const rcfLibro1Summary: LessonSummary = {
  overview: "El Libro Primero del Reglamento de Circulación Ferroviaria (RCF, aprobado por Real Decreto 664/2015, de 17 de julio) establece principios y reglas operativas para la circulación de trenes y maniobras en la Red Ferroviaria de Interés General (RFIG), también en situaciones degradadas y en la recuperación tras una interrupción. La responsabilidad de la explotación segura y del control de riesgos corresponde a los AI y las EF; sus sistemas de gestión de la seguridad (SGS) concretan procedimientos y responsabilidades del personal. El Capítulo 5 desarrolla los conceptos básicos de circulación: señales y agujas, instalaciones de seguridad, condiciones de marcha, identificación de trenes, paradas y detenciones, orden de marcha, velocidades, tipos de tren, sentido de circulación, bloqueo y conducción, trabajos en la vía, comunicación del tren dispuesto, frenado, masas y longitudes, mercancías peligrosas y transportes excepcionales.",
  keyFacts: [
    "Aprobación oficial: Real Decreto 664/2015, de 17 de julio (BOE de 18 de julio); última actualización consolidada de 12/07/2023.",
    "Prevalencia documental: 1.º AESF y normas europeas; 2.º Administrador de Infraestructuras (AI); 3.º Empresas Ferroviarias (EF).",
    "Equipamiento obligatorio de cabina para iniciar servicio: Sistema de protección compatible, Dispositivo de vigilancia y Radiotelefonía.",
    "Velocidades con protección compatible y operativa: 350 km/h con ERTMS Nivel 2, 300 km/h con ERTMS Nivel 1 o LZB, 220 km/h con EBICAB y 200 km/h con ASFA.",
    "Velocidad máxima sin protección compatible, averiada o ausente en la infraestructura: 120 km/h.",
    "Dotación mínima de cabina: un Maquinista si la infraestructura tiene sistema de protección; Maquinista y segunda persona habilitada si no lo tiene, salvo procedimiento alternativo del SGS autorizado por la AESF.",
    "Marcha de maniobras: máximo 30 km/h si la locomotora va tirando del corte; máximo 20 km/h si va empujándolo.",
    "Marcha a la vista: no tiene límite numérico fijo; impone adecuar la marcha al tramo visualizado para parar ante obstáculo o señal de parada.",
    "Tolerancia de velocidad máxima: hasta 5 km/h por encima del límite durante no más de 20 segundos.",
    "Paradas por función: comercial, restringida y técnica; por duración o periodicidad: momentánea y ocasional. La parada notificada tras la salida se considera prescrita desde la notificación.",
    "Bloqueo: sistemas nominales BT, BLA (BLAU, BLAD, BLAB), BA (BAU, BAD, BAB), BSL y BCA; el BT es supletorio si fallan los nominales.",
    "Tipos de tren: número = velocidad máxima en múltiplos de 10; letra = tipo por curva (N, A, B, C, D). El material de tipo superior puede circular en trenes de tipo inferior, no al revés.",
    "Pruebas de freno: completa (en origen), parcial (al agregar vehículos), continuidad (al segregar, unir ramas o interrumpir la TFA) y verificación del acoplamiento (al cambiar locomotora de cabeza o en tracción múltiple).",
    "Invalidación de la orden de marcha: ocurre si un tren directo queda detenido en una estación, entre los demás supuestos del Reglamento.",
    "Telefonema: comunicación reglamentaria con formato preestablecido, número secuencial, hora de transmisión e identificación del emisor, registrada en un soporte admitido por el Reglamento.",
    "Relevo de seguridad: quien sale entrega documentos, impresos, registros, útiles e información; quien entra se hace cargo, conoce la información y resuelve dudas con el saliente.",
    "Comunicación oral de seguridad: Maquinista y Responsable de Circulación usan preferentemente radiotelefonía; el emisor comprueba la comprensión y las partes se identifican mutuamente.",
  ],
  sections: [
    {
      title: "Estructura de los 5 Capítulos del Libro Primero",
      points: [
        "Capítulo 1 (Generalidades): Objeto (explotación normal, degradada y recuperación); marco operativo único para interfaces AI-EF y unificación de criterios entre AI y anchos; ámbito territorial (RFIG), subjetivo (personal de AI, EF y otras empresas que interviene directa o indirectamente) y técnico (actividades de seguridad en la interfaz AI-EF desde la puesta a disposición del tren hasta destino). Los AI y las EF responden de la explotación segura y el control de riesgos, cooperan cuando procede y recogen procedimientos en sus SGS.",
        "Capítulo 2 (Documentación reglamentaria): Jerarquía normativa; documentación de la AESF (Especificaciones Técnicas de Circulación); documentación del AI (Consignas, Avisos y Horarios de los trenes); documentación de las EF (Libro de Normas del Maquinista, con su Libro de Telefonemas, y Libro de Itinerarios del Maquinista).",
        "Capítulo 3 (Distribución y útiles): Publicidad y difusión obligatorias; entrega individual con deber de acuse de recibo y acreditación de conocimiento en el SGS; entrega de útiles de servicio.",
        "Capítulo 4 (Comunicaciones reglamentarias): pueden ser verbales o escritas. Maquinista y Responsable de Circulación usan preferentemente radiotelefonía; responsables entre sí, telefonía fija. El emisor comprueba la comprensión y, por teléfono o radio, las partes se identifican. El Maquinista registra un telefonema con el tren parado. La metodología de seguridad se concreta en los SGS conforme a la ETI OPE.",
        "Capítulo 5 (Conceptos básicos de circulación): Señales y agujas; instalaciones de seguridad y sistemas auxiliares; condiciones de marcha especiales; identificación de trenes; paradas y detenciones; orden de marcha e invalidación; velocidades y LTV; tipos de tren; sentido de circulación; bloqueo y su aseguramiento; tipos de conducción; estaciones intermitentes; trabajos en la vía; tren dispuesto; frenado y pruebas; masas y longitudes; mercancías peligrosas (RID) y transportes excepcionales.",
      ]
    },
    {
      title: "Capítulo 5: Bloqueo, Velocidades y Tipos de Tren",
      points: [
        "Bloqueo: garantiza la separación entre trenes por la misma vía. En BT se asegura con petición, concesión de vía y aviso de llegada por telefonemas; en BLA, BSL y BA mediante las señales que protegen los cantones y el sentido de circulación; en BCA respetando las velocidades ordenadas mediante señalización en cabina.",
        "Cantón libre: exige que no esté establecida la EVB y que el último tren lo haya liberado totalmente.",
        "Velocidades: 350 km/h con ERTMS N2, 300 km/h con ERTMS N1 o LZB, 220 km/h con EBICAB y 200 km/h con ASFA. Si falta compatibilidad, operatividad o el sistema en infraestructura: 120 km/h.",
        "LTV: reducción temporal de la velocidad máxima por orden de las señales, notificación, prescripción general o particular o anormalidad. Si concurren varias, se cumple la más restrictiva.",
        "Conducción: manual (responsabilidad íntegra del Maquinista, con o sin ASFA), asistida (ETCS/ERTMS, LZB o EBICAB; no gestiona paradas comerciales) y automática (sin intervención del Maquinista, con paradas comerciales programadas).",
        "Trabajos en la vía: interrupción de la circulación por intervalo de horario, intervalo programado (con Consigna si reviste importancia) o anormalidad; liberación por tiempo con intervalo libre garantizado por el Responsable de Circulación.",
      ]
    },
    {
      title: "Tabla Comparativa de las 4 Pruebas de Frenado",
      points: [
        "1. PRUEBA COMPLETA: Se realiza en la estación o dependencia origen de la composición. Comprueba la estanqueidad y continuidad de la TFA y el apriete/afloje de TODOS los frenos en servicio.",
        "2. PRUEBA PARCIAL: Se realiza antes de la salida cuando se agregan vehículos. Comprueba la TFA, el apriete/afloje del último vehículo y el de cada vehículo agregado.",
        "3. PRUEBA DE CONTINUIDAD: Se realiza al agregar locomotora por cola, segregar vehículos, interrumpir la TFA o unir dos ramas. Comprueba estanqueidad de TFA y apriete/afloje del ÚLTIMO vehículo.",
        "4. VERIFICACIÓN DEL ACOPLAMIENTO: Se realiza al cambiar locomotora de cabeza, agregar/segregar en tracción múltiple o segregar tras la cabeza. Comprueba TFA y apriete/afloje del PRIMER vehículo remolcado.",
        "Supresión de pruebas: No se requiere prueba por segregar vehículos de cola, cambiar palancas de potencia, aislar un freno o reponer una alarma.",
        "Automotores: la prueba se realiza según el Manual de conducción y no es necesaria en caso de inversión de marcha o de recorridos sucesivos en la misma jornada si no cambia la composición.",
      ]
    },
    {
      title: "Diferencias Críticas y Errores Habituales en Examen",
      points: [
        "Responsabilidad institucional y función individual: AI y EF responden de la explotación segura y el control de riesgos; el SGS de cada entidad organiza procedimientos y obligaciones concretas del personal. La responsabilidad de las entidades no elimina las obligaciones del personal ferroviario.",
        "Relevo: el saliente entrega información y medios de seguridad; quien entra los recibe, toma conocimiento y pregunta hasta aclarar las dudas. No se presume que la documentación o la información se hayan transferido por el mero cambio de turno.",
        "No confundir reglas de comunicación: la radiotelefonía es la preferencia entre Maquinista y Responsable de Circulación, y la telefonía fija entre Responsables. Comprobar comprensión e identificación mutua son obligaciones distintas; registrar un telefonema con el tren parado es una condición específica del Maquinista.",
        "Consignas, Avisos y Horarios son del AI; el Libro de Normas del Maquinista y el Libro de Itinerarios son de la EF. El Horario de los Trenes NO es documentación de la EF.",
        "Marcha a la vista vs Maniobra: La marcha a la vista depende de la visual del maquinista; la maniobra tiene límites numéricos rígidos (30 km/h tirando y 20 km/h empujando).",
        "Tipos de parada: comercial (subida y bajada de viajeros), restringida (parada comercial para bajada de viajeros, con salida posible al acabar las operaciones) y técnica (cruce, adelantamiento u otras causas de explotación). Por duración: momentánea u ocasional.",
        "Orden de marcha: la señal de salida la confiere; sin señal de salida la constituye «marche el tren». La señal de paso complementa a los trenes directos, no a los parados.",
        "Bloqueo: BT es supletorio, no nominal preferente. El cantón libre exige ausencia de EVB y liberación total por el último tren.",
        "Zonas de trabajo: La zona de RIESGO se encuentra exactamente situada entre la zona de PELIGRO y la zona de SEGURIDAD.",
        "Fallo de protección: Si el sistema de protección de tren no es compatible, está inoperativo o falta en la infraestructura, la velocidad máxima es 120 km/h, no 80 ni 100 km/h.",
      ]
    }
  ]
};
