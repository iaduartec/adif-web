import type { LessonSummary } from "./types";

export const rcfLibro1Summary: LessonSummary = {
  overview: "El Libro Primero del Reglamento de Circulación Ferroviaria (RCF, aprobado por Real Decreto 664/2015, de 17 de julio) establece los principios fundamentales y las reglas operativas básicas para garantizar la seguridad en la circulación de los trenes y las maniobras en la Red Ferroviaria de Interés General (RFIG). Estructurado en cinco capítulos (Generalidades, Documentación reglamentaria, Distribución y útiles, Comunicaciones y Conceptos básicos de circulación), constituye el núcleo indispensable de la normativa operativa ferroviaria para el examen.",
  keyFacts: [
    "Aprobación oficial: Real Decreto 664/2015, de 17 de julio (BOE de 18 de julio).",
    "Prevalencia documental: 1.º AESF y normas europeas; 2.º Administrador de Infraestructuras (AI); 3.º Empresas Ferroviarias (EF).",
    "Equipamiento obligatorio de cabina para iniciar servicio: Sistema de protección compatible, Dispositivo de vigilancia y Radiotelefonía.",
    "Velocidad máxima sin protección compatible o averiada: 120 km/h en toda la RFIG.",
    "Marcha de maniobras: Máximo 30 km/h si la locomotora va tirando del corte; máximo 20 km/h si va empujándolo.",
    "Marcha a la vista: No tiene límite numérico fijo; impone adecuar la marcha al tramo visualizado para parar ante obstáculo o señal de parada.",
    "Tolerancia de velocidad máxima: Hasta 5 km/h por encima del límite durante no más de 20 segundos.",
    "Pruebas de freno: Completa (en origen), Parcial (al agregar vehículos), Continuidad (al segregar, invertir o interrumpir TFA) y Verificación del acoplamiento (al cambiar locomotora en cabeza).",
    "Invalidación de la orden de marcha: Ocurre obligatoriamente si un tren directo queda detenido en una estación.",
    "Telefonema: Comunicación reglamentaria con número correlativo anual, hora, identificación de emisor/receptor, colacionado obligatorio y soporte registrado.",
  ],
  sections: [
    {
      title: "Estructura de los 5 Capítulos del Libro Primero",
      points: [
        "Capítulo 1 (Generalidades): Objeto (explotación normal, degradada y recuperación), ámbito de aplicación (RFIG, personal de AI/EF/contratas e interfaz técnico), definiciones clave (estación, cantón, enclavamiento, telefonema), acrónimos, criterios de operación y zonas de trabajo.",
        "Capítulo 2 (Documentación reglamentaria): Jerarquía normativa; documentación de la AESF (ETC, RTS); documentación del AI (Consignas y Avisos); documentación de las EF (Libro de Normas del Maquinista, Horario de los Trenes, Libro de Itinerarios) y documentos de tren.",
        "Capítulo 3 (Distribución y útiles): Publicidad y difusión obligatorias; entrega individual con deber de acuse de recibo y acreditación de conocimiento en SGS; entrega de útiles de servicio.",
        "Capítulo 4 (Comunicaciones reglamentarias): Metodología estricta según ETI OPE; colacionado obligatorio; Libro de telefonemas registrado y conservado.",
        "Capítulo 5 (Conceptos básicos de circulación): Señalización y agujas; velocidades y paridad numérica; órdenes de marcha y paradas (comercial, restringida, técnica); sistemas nominales de bloqueo (BT, BLA, BA, BCA); tubería TFA y pruebas de freno; mercancías peligrosas (RID) y transportes excepcionales.",
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
      ]
    },
    {
      title: "Diferencias Críticas y Errores Habituales en Examen",
      points: [
        "Consignas vs Libros: Las Consignas (A, B, C) y los Avisos son emitidos por el AI. El Libro de Normas del Maquinista y el Libro de Itinerarios son emitidos por la EF.",
        "Marcha a la vista vs Maniobra: La marcha a la vista depende de la visual del maquinista; la maniobra tiene límites numéricos rígidos (30 km/h tirando y 20 km/h empujando).",
        "Tipos de parada: Comercial (subida y bajada de viajeros), Restringida (personal de servicio o técnico), Técnica (necesidades de la circulación y cruces).",
        "Zonas de trabajo: La zona de RIESGO se encuentra exactamente situada entre la zona de PELIGRO y la zona de SEGURIDAD.",
        "Fallo de protección: Si el sistema de protección de tren no es compatible o está inoperativo, la velocidad máxima es siempre 120 km/h, no 80 ni 100 km/h.",
      ]
    }
  ]
};
