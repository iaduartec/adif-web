import type { TheorySection } from "../lesson-theory";

export const ictTheory: TheorySection = {
  introduction: `El Real Decreto 346/2011, de 11 de marzo, aprueba el Reglamento regulador de las Infraestructuras Comunes de Telecomunicaciones (ICT) para el acceso a los servicios de telecomunicación en el interior de las edificaciones. Deroga el anterior RD 401/2003 y constituye el marco técnico-legal vigente que obliga a todo edificio sujeto a la Ley de Propiedad Horizontal a disponer de una infraestructura común que permita la distribución ordenada de los servicios de radiodifusión sonora y televisión (terrenal y por satélite), telecomunicaciones de telefonía disponible al público (STDP) y telecomunicaciones de banda ancha (fibra óptica, cable coaxial y par de cobre).

Para el personal técnico de telecomunicaciones de ADIF, el conocimiento del RD 346/2011 es relevante por tres razones: (1) la analogía directa entre la estructura de canalizaciones ICT y las canalizaciones de telecomunicación ferroviaria; (2) los principios de seguridad eléctrica y separación de servicios son idénticos a los que se aplican en las instalaciones de telecomunicación de ADIF; y (3) las preguntas de examen sobre este tema son muy específicas y se centran en definiciones técnicas, topologías de red y recintos.

El Reglamento se estructura en un articulado principal (Arts. 1 a 15) y cinco Anexos técnicos: Anexo I (captación, adaptación y distribución de las señales de radiodifusión sonora y televisión), Anexo II (telecomunicaciones de telefonía disponible al público), Anexo III (telecomunicaciones de banda ancha), Anexo IV (canalizaciones e infraestructura de distribución) y Anexo V (requisitos de seguridad eléctrica y compatibilidad electromagnética).`,

  concepts: [
    {
      title: "Definición de ICT y ámbito de aplicación (Arts. 1 y 2)",
      description: "La ICT es la infraestructura instalada en el interior de los edificios que permite el acceso a los servicios de telecomunicación definidos en el Reglamento: radiodifusión sonora y televisión terrenal y por satélite, telefonía disponible al público (STDP) y telecomunicaciones de banda ancha. Es obligatoria en todos los edificios de nueva construcción y en los que sean objeto de rehabilitación integral, así como en los que se dividan en régimen de propiedad horizontal."
    },
    {
      title: "Red de Alimentación (Anexo II, apt. 2.1)",
      description: "Es la parte de la red propiedad de los operadores de telecomunicaciones que conecta sus centrales o redes de distribución con el Punto de Interconexión del edificio, ubicado generalmente en el interior del RITI (Recinto de Instalaciones de Telecomunicaciones Inferior). La red de alimentación NO forma parte de la ICT del edificio y es responsabilidad exclusiva del operador de telecomunicaciones. Se introduce en el edificio a través de la arqueta de entrada y la canalización externa."
    },
    {
      title: "Red de Distribución (Anexo II, apt. 2.2)",
      description: "Tramo de la red que discurre por las zonas comunes del edificio (canalización principal) desde los repartidores del registro principal situados en el RITI hasta los registros secundarios de cada planta. Transporta las señales de telecomunicación a todas las plantas del edificio. Es propiedad de la comunidad de propietarios y su mantenimiento corresponde a la misma. La topología es en bus vertical (cableado principal que recorre el edificio de abajo a arriba)."
    },
    {
      title: "Red de Dispersión (Anexo II, apt. 2.3)",
      description: "Tramo que conecta los registros secundarios de planta con el Punto de Acceso al Usuario (PAU) de cada vivienda u oficina. Utiliza la canalización secundaria del edificio. Es propiedad de la comunidad de propietarios. La topología es en estrella desde el registro secundario hasta cada PAU de la planta."
    },
    {
      title: "Red Interior de Usuario (Anexo II, apt. 2.4)",
      description: "Tramo que discurre por el interior de la vivienda u oficina, desde el PAU hasta las Bases de Acceso Terminal (BAT) o tomas de usuario distribuidas por las estancias. Es propiedad del usuario final y su mantenimiento es responsabilidad suya. La topología es en estrella desde el PAU hasta cada BAT."
    },
    {
      title: "Punto de Acceso al Usuario (PAU)",
      description: "Elemento físico que marca el inicio de la red interior del usuario y el final de la red de dispersión de la comunidad. Es el punto de delimitación de responsabilidades: la avería antes del PAU (red de dispersión) es responsabilidad de la comunidad o del operador; la avería después del PAU (red interior) es responsabilidad del usuario. Se ubica en el interior del domicilio, generalmente junto al registro de terminación de red."
    },
    {
      title: "Base de Acceso Terminal (BAT)",
      description: "Es la toma de usuario final donde se conectan los equipos terminales de telecomunicación (teléfono, televisor, router). Cada estancia principal de la vivienda debe contar con al menos una BAT. Las BAT se ubican en los registros de toma empotrados en la pared y deben cumplir las especificaciones técnicas del Anexo correspondiente."
    },
    {
      title: "RITI — Recinto de Instalaciones de Telecomunicaciones Inferior (Anexo IV)",
      description: "Local o habitáculo de uso exclusivo para telecomunicaciones situado en la parte inferior del edificio (planta baja o primer sótano). Alberga: los equipos de terminación de red de los operadores, los puntos de interconexión, los repartidores principales de telefonía y banda ancha, y los cuadros de protección eléctrica de la ICT. Dimensiones mínimas: para edificios de hasta 20 PAU, 2,00 m × 1,00 m × 2,30 m (ancho × profundo × alto). Debe tener puerta con cerradura, ventilación, iluminación mínima de 300 lux, toma de corriente y conexión a tierra."
    },
    {
      title: "RITS — Recinto de Instalaciones de Telecomunicaciones Superior (Anexo IV)",
      description: "Local situado en la parte superior del edificio (azotea, cubierta o última planta). Alberga los equipos de captación, adaptación y distribución de las señales de radiodifusión sonora y televisión (antenas, amplificadores, mezcladores, cabecera). Dimensiones mínimas idénticas al RITI. Desde el RITS parten los cables de distribución de televisión y radio hacia el RITI y las plantas del edificio."
    },
    {
      title: "RITU — Recinto Único de Telecomunicaciones (Anexo IV)",
      description: "En edificios de hasta 3 alturas y 10 PAU, puede instalarse un recinto único que sustituye al RITI y al RITS. Dimensiones mínimas: 2,00 m × 0,50 m × 2,30 m. Debe cumplir las mismas condiciones de seguridad eléctrica, ventilación e iluminación que los recintos separados. En la oposición suelen preguntar cuándo se puede instalar RITU en lugar de RITI+RITS."
    },
    {
      title: "Canalización externa, de enlace, principal y secundaria (Anexo IV)",
      description: "La infraestructura de canalizaciones se divide en: (1) Canalización externa: desde la arqueta de entrada del edificio hasta el punto de entrada general (acometida del operador); (2) Canalización de enlace inferior: desde el punto de entrada general hasta el RITI; (3) Canalización principal: discurre verticalmente por las zonas comunes, conecta el RITI con el RITS pasando por los registros secundarios de cada planta; (4) Canalización secundaria: discurre horizontalmente por cada planta desde el registro secundario hasta los registros de paso y de terminación de red de cada vivienda; (5) Canalización interior de usuario: desde el RTR (registro de terminación de red) hasta cada BAT."
    },
    {
      title: "Registros: tipos y función (Anexo IV)",
      description: "Los registros son cajas o armarios empotrados o adosados que permiten acceder a los puntos de empalme, derivación o conexión de los cables. Tipos principales: (a) Registro principal: ubicado en el RITI, alberga los repartidores; (b) Registros secundarios: ubicados en cada planta, permiten la derivación de la red de distribución a la red de dispersión; (c) Registros de paso: facilitan el tendido de cables en la canalización secundaria; (d) Registro de terminación de red (RTR): situado en el interior de la vivienda, alberga el PAU; (e) Registros de toma: alojan las BAT."
    },
    {
      title: "Proyecto técnico de la ICT (Arts. 7 a 9)",
      description: "Toda edificación sujeta al Reglamento debe contar con un proyecto técnico de ICT firmado por un ingeniero de telecomunicación o un ingeniero técnico de telecomunicación competente. El proyecto debe acompañar la solicitud de licencia de edificación y debe ser visado por el colegio profesional correspondiente. Su contenido mínimo incluye: memoria descriptiva, planos, pliego de condiciones y presupuesto. El director de obra de la ICT certifica la correcta ejecución del proyecto."
    },
    {
      title: "Régimen sancionador (Art. 15 y normativa aplicable)",
      description: "El RD 346/2011 no tipifica infracciones propias. Las infracciones por incumplimiento se sancionan conforme al Real Decreto-ley 1/1998 y a la Ley 9/2014, General de Telecomunicaciones (que derogó la Ley 32/2003). Las sanciones pueden afectar al promotor, al constructor, al proyectista y al director de obra. Los importes pueden alcanzar hasta 20 millones de euros en infracciones muy graves."
    },
    {
      title: "Seguridad eléctrica y CEM (Anexo V)",
      description: "Todas las instalaciones de la ICT deben cumplir el Reglamento Electrotécnico de Baja Tensión (REBT). Los recintos deben disponer de cuadro de protección propio (interruptor magnetotérmico + diferencial), toma de tierra independiente con resistencia máxima de 10 Ω, y los cables de telecomunicación deben mantener la separación reglamentaria con las líneas de energía eléctrica. La puesta a tierra de la ICT debe estar interconectada con la del edificio."
    }
  ],

  examples: [
    {
      situation: "Un técnico instalador de fibra óptica de un operador accede al edificio y pasa el cable directamente por la fachada hasta la ventana de un vecino, perforando el muro exterior sin utilizar la canalización interna del edificio.",
      application: "Infracción directa del RD 346/2011. Toda instalación de telecomunicaciones en edificios sujetos a la ICT debe discurrir por las canalizaciones internas previstas (canalización externa → canalización de enlace → RITI → canalización principal → registro secundario → canalización secundaria → RTR → PAU → red interior). El operador debe utilizar la infraestructura común existente y solo puede intervenir en la red de alimentación hasta el punto de interconexión del RITI."
    },
    {
      situation: "Una comunidad de vecinos reclama al operador de telecomunicaciones porque la señal de televisión TDT se degrada en las plantas altas del edificio. El operador alega que es responsabilidad de la comunidad.",
      application: "El operador tiene razón parcialmente. La red de distribución (desde el RITS hasta los registros secundarios) y la red de dispersión (hasta cada PAU) son propiedad de la comunidad de propietarios, que debe mantenerlas. Sin embargo, si el problema está en la cabecera (amplificadores del RITS) instalada por la comunidad, es esta quien debe repararla. Si el problema está en la red de alimentación del operador (antes del punto de interconexión), es responsabilidad del operador."
    },
    {
      situation: "Un promotor inmobiliario construye un edificio de 4 plantas con 8 viviendas y pregunta si puede instalar un RITU en lugar de RITI + RITS separados.",
      application: "No puede. El RITU solo se permite en edificios de hasta 3 alturas y 10 PAU (Anexo IV). Aunque tiene solo 8 PAU (cumple el requisito de PAU), el edificio tiene 4 alturas (supera el límite de 3). Debe instalar RITI y RITS separados. Si tuviera 3 alturas y 8 PAU, sí podría usar RITU."
    },
    {
      situation: "En un examen se pregunta: '¿Cuál es el punto que delimita la responsabilidad entre la comunidad de propietarios y el usuario en caso de avería en la instalación de telecomunicaciones?'",
      application: "El PAU (Punto de Acceso al Usuario). Antes del PAU: la avería es responsabilidad de la comunidad (red de distribución y dispersión) o del operador (red de alimentación). Después del PAU: la avería es responsabilidad del usuario (red interior). Esta es una de las preguntas más frecuentes sobre ICT en oposiciones."
    },
    {
      situation: "Un ingeniero proyecta una ICT en la que la canalización principal atraviesa el interior de una vivienda privada para llegar a la planta superior.",
      application: "Es incorrecto. La canalización principal debe discurrir siempre por zonas comunes del edificio (rellanos, huecos de escalera, patinillos). Nunca puede atravesar viviendas de propiedad privada. El proyecto técnico debe prever un recorrido alternativo por zonas comunes."
    }
  ],

  reviewTakeaways: [
    "Orden de las redes: Alimentación (operador) → Distribución (comunidad, vertical) → Dispersión (comunidad, horizontal por planta) → Interior de usuario (usuario).",
    "PAU = delimitación de responsabilidades: antes del PAU → comunidad/operador; después del PAU → usuario.",
    "BAT = toma final del usuario (donde se conecta el equipo terminal).",
    "RITI = parte inferior (operadores, interconexión, repartidores); RITS = parte superior (antenas, cabecera TV/radio).",
    "RITU = recinto único, solo para edificios de hasta 3 alturas Y hasta 10 PAU.",
    "Canalizaciones: externa → enlace inferior → principal (vertical, zonas comunes) → secundaria (horizontal, por planta) → interior de usuario.",
    "El proyecto técnico ICT debe acompañar la solicitud de licencia de edificación y estar firmado por ingeniero de telecomunicación.",
    "El RD 346/2011 NO tiene régimen sancionador propio → remite al RD-ley 1/1998 y a la Ley 9/2014 General de Telecomunicaciones.",
    "La canalización principal NUNCA puede atravesar viviendas privadas → solo zonas comunes.",
    "Puesta a tierra de la ICT: resistencia máxima 10 Ω, interconectada con la del edificio."
  ]
};
