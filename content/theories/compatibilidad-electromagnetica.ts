import type { TheorySection } from "../lesson-theory";

export const cemTheory: TheorySection = {
  introduction: `La compatibilidad electromagnética (CEM o EMC, por sus siglas en inglés) es la capacidad de un equipo, sistema o instalación para funcionar satisfactoriamente en su entorno electromagnético sin introducir perturbaciones electromagnéticas intolerables en otros equipos y sin sufrir degradaciones inaceptables por las perturbaciones que esos otros equipos generan.

En el entorno ferroviario, la CEM es un requisito de seguridad crítico porque los sistemas de señalización, telecomunicación y control de tráfico conviven con fuentes de energía electromagnética de muy alta potencia: las locomotoras eléctricas pueden demandar varios megavatios a través de la catenaria, que actúa como una antena de cable horizontal de decenas o centenares de kilómetros. Las interferencias electromagnéticas (EMI) generadas por los convertidores de potencia, los pantógrafos y las subestaciones de tracción pueden degradar o bloquear los circuitos de vía, las balizas ERTMS/ETCS, los sistemas de telecomunicación GSM-R y los equipos de señalización lateral.

El marco normativo se estructura en tres niveles: (1) la Directiva Europea de CEM (actualmente la 2014/30/UE, en vigor desde el 20 de abril de 2016), que establece los requisitos esenciales de protección para todos los equipos electrónicos comercializados en la UE; (2) las normas armonizadas europeas, en particular la serie EN 50121 (partes 1 a 5), específica para aplicaciones ferroviarias; y (3) las Especificaciones Técnicas de Interoperabilidad (TSI), que integran los requisitos de CEM en el proceso de certificación de material rodante e infraestructura ferroviaria.

El material de estudio principal es el artículo técnico "La compatibilidad electromagnética y la seguridad en los ferrocarriles" de Francesc Daura (Cemdal), que sintetiza los conceptos fundamentales de CEM aplicados al sector ferroviario y es la referencia oficial del temario de la oposición.`,

  concepts: [
    {
      title: "Definición de CEM: emisión e inmunidad",
      description: "La CEM se define mediante dos parámetros complementarios: (a) Emisión: nivel de perturbaciones electromagnéticas que un equipo genera y que podrían afectar a otros equipos de su entorno. Los límites de emisión se expresan en dBμV/m (emisión radiada) o dBμV (emisión conducida). (b) Inmunidad: capacidad de un equipo para funcionar sin degradación en presencia de perturbaciones electromagnéticas externas. Los niveles de inmunidad se expresan en V/m (campo eléctrico) o A/m (campo magnético). Un equipo es compatible electromagnéticamente cuando sus emisiones están por debajo de los límites y su inmunidad está por encima de los umbrales."
    },
    {
      title: "Directiva CEM 2014/30/UE",
      description: "Directiva europea vigente que sustituye a la anterior 2004/108/CE. Establece los requisitos esenciales de protección: (1) las perturbaciones electromagnéticas generadas por un equipo no deben superar un nivel que impida el uso previsto de aparatos de radio, telecomunicaciones y otros; (2) el equipo debe tener un nivel de inmunidad adecuado frente a las perturbaciones electromagnéticas esperables en su uso previsto. Se transpone en España mediante el Real Decreto 186/2016, de 6 de mayo. Aplica a todos los equipos electrónicos, incluidos los ferroviarios."
    },
    {
      title: "Norma europea EN 50121: CEM ferroviaria",
      description: "Es la norma armonizada específica de CEM para aplicaciones ferroviarias, desarrollada por CENELEC (Comité Europeo de Normalización Electrotécnica). Se estructura en partes: EN 50121-1 (generalidades), EN 50121-2 (emisión del sistema ferroviario al mundo exterior), EN 50121-3-1 (material rodante - tren y vehículo completo), EN 50121-3-2 (material rodante - aparatos), EN 50121-4 (emisión e inmunidad de los aparatos de señalización y telecomunicación), EN 50121-5 (emisión e inmunidad de las instalaciones fijas de alimentación de potencia). La versión española es UNE-EN 50121."
    },
    {
      title: "Fuentes de interferencias electromagnéticas (EMI) en el ferrocarril",
      description: "Las principales fuentes de EMI en un ferrocarril electrificado son: (1) Convertidores de potencia conmutados de las locomotoras (generan armónicos de alta frecuencia); (2) Pantógrafo-catenaria (arcos eléctricos en el contacto producen pulsos de banda ancha); (3) Subestaciones de tracción (rectificadores, transformadores de potencia); (4) Motores y accionamientos (conmutación de escobillas en motores DC, modulación PWM en motores AC); (5) Equipos auxiliares del tren (inversores de climatización, cargadores de baterías). La potencia implicada puede ser de varios MW, generando campos electromagnéticos muy intensos."
    },
    {
      title: "La catenaria como antena de cable horizontal",
      description: "La catenaria (cable de contacto + cable sustentador + pendolones) es una estructura conductora suspendida a lo largo de la vía que, electromagnéticamente, se comporta como una antena de cable horizontal de gran longitud. Esto significa que: (1) cualquier corriente de alta frecuencia que circule por ella se radiará eficientemente al espacio circundante; (2) las perturbaciones conducidas generadas por las locomotoras se propagan por la catenaria y llegan a equipos distantes; (3) el campo magnético de la corriente de retorno por los carriles se acopla inductivamente con los cables de señalización que discurren paralelos a la vía. El acoplamiento puede ser inductivo (campo magnético), capacitivo (campo eléctrico) o conductivo (a través de impedancias comunes)."
    },
    {
      title: "Tipos de acoplamiento electromagnético",
      description: "Las perturbaciones se transmiten de una fuente a una víctima por tres mecanismos: (1) Acoplamiento conducido: la perturbación viaja por conductores comunes (cables de alimentación, carriles como retorno de corriente, pantallas compartidas). Se controla con filtros, separación de circuitos y transformadores de aislamiento. (2) Acoplamiento inductivo (campo magnético): la corriente variable en un conductor induce una tensión en un conductor cercano (ley de Faraday). Se controla con apantallamiento magnético, distancia y trenzado de cables. (3) Acoplamiento capacitivo (campo eléctrico): la tensión variable en un conductor induce una corriente en un conductor cercano a través de la capacidad parásita. Se controla con blindaje electrostático y distancia."
    },
    {
      title: "Medición de emisiones: cuasi-pico y valores límite",
      description: "Las emisiones se miden con receptores de medida de perturbaciones que utilizan diferentes detectores: (a) Detector de cuasi-pico (QP): pondera la amplitud y la repetitividad de las perturbaciones, dando mayor peso a las perturbaciones frecuentes. Es el detector de referencia para los límites de emisión radiada de la EN 50121-3-1. (b) Detector de valor medio: pondera el valor medio de las perturbaciones. (c) Detector de pico: mide el valor máximo instantáneo. Las mediciones de emisiones radiadas del material rodante (EN 50121-3-1) se realizan a 10 metros de distancia del vehículo en prueba estacionaria, con el barrido adecuado de frecuencias."
    },
    {
      title: "Evaluación de la conformidad y marcado CE",
      description: "Para comercializarse en la UE, todo equipo electrónico debe cumplir la Directiva de CEM y llevar el marcado CE. El fabricante debe: (1) elaborar la documentación técnica que demuestre la conformidad (equivalente al expediente técnico de construcción); (2) realizar o encargar los ensayos de emisión e inmunidad según las normas armonizadas aplicables; (3) emitir la Declaración UE de Conformidad; (4) aplicar el marcado CE al producto. En el sector ferroviario, se completa con los certificados de conformidad basados en las TSI y con la intervención de Organismos Notificados."
    },
    {
      title: "Plan de Gestión de la CEM en proyectos ferroviarios",
      description: "En proyectos de infraestructura ferroviaria complejos, se elabora un Plan de Gestión de la CEM que incluye: (1) identificación de las fuentes de EMI y de los equipos sensibles (víctimas); (2) análisis de los mecanismos de acoplamiento; (3) definición de los requisitos de CEM para cada subsistema; (4) especificación de las medidas de mitigación (filtros, blindajes, separación de cables, puesta a tierra); (5) planificación de los ensayos de verificación; (6) seguimiento durante la integración y puesta en servicio. La CEM debe ser un requisito en los pliegos de licitación de las obras de ADIF."
    },
    {
      title: "Medidas de mitigación de EMI",
      description: "Las principales técnicas para controlar las interferencias son: (1) Filtrado: filtros EMI en las entradas de alimentación y señal para atenuar las perturbaciones conducidas. (2) Blindaje/apantallamiento: cajas metálicas, cables apantallados y mallas conductoras que impiden la propagación de campos electromagnéticos. (3) Puesta a tierra: diseño correcto del sistema de tierras para evitar lazos de masa que actúen como antenas receptoras. (4) Segregación de cables: separación física entre cables de potencia, cables de señal y cables de telecomunicación. (5) Distancia: alejar las fuentes de EMI de los equipos sensibles. (6) Trenzado de cables: reduce el área del lazo de acoplamiento inductivo."
    },
    {
      title: "Especificaciones Técnicas de Interoperabilidad (TSI) y CEM",
      description: "Las TSI son normativa europea obligatoria que define los requisitos que deben cumplir los subsistemas ferroviarios (material rodante, infraestructura, energía, control-mando y señalización, explotación) para ser interoperables en la red ferroviaria europea. La CEM es un parámetro fundamental de las TSI de material rodante (TSI LOC&PAS) y de la TSI de energía, que remiten a las normas EN 50121 para los ensayos de emisión e inmunidad. El cumplimiento de las TSI es obligatorio para obtener la autorización de puesta en servicio de un vehículo o infraestructura en la RFIG."
    }
  ],

  examples: [
    {
      situation: "Al arrancar un tren de alta velocidad en una estación, los sistemas de señalización ERTMS/ETCS y los circuitos de vía de la estación adyacente experimentan perturbaciones que degradan las comunicaciones GSM-R y provocan falsas ocupaciones de cantón.",
      application: "Los convertidores de potencia del tren generan armónicos de alta frecuencia que se propagan por la catenaria (que actúa como antena) y por los carriles (retorno de corriente). Estas perturbaciones se acoplan inductiva y conductivamente con los cables de señalización y los circuitos de vía. Para resolverlo: (1) verificar que el tren cumple los límites de emisión de la EN 50121-3-1; (2) comprobar que los equipos de señalización cumplen los requisitos de inmunidad de la EN 50121-4; (3) revisar la segregación de cables de señalización respecto a los de potencia; (4) verificar la puesta a tierra del sistema."
    },
    {
      situation: "Un fabricante quiere vender en la Unión Europea un nuevo equipo de señalización ferroviaria para instalación en vía (baliza ETCS).",
      application: "Debe: (1) cumplir la Directiva CEM 2014/30/UE (transpuesta en España por RD 186/2016); (2) realizar los ensayos de emisión e inmunidad según la EN 50121-4 (aparatos de señalización y telecomunicación); (3) elaborar la documentación técnica y emitir la Declaración UE de Conformidad; (4) aplicar el marcado CE; (5) obtener la certificación TSI correspondiente a través de un Organismo Notificado para la autorización de puesta en servicio en la RFIG."
    },
    {
      situation: "Un técnico de ADIF debe medir las emisiones radiadas de una locomotora eléctrica en prueba estacionaria para verificar el cumplimiento de la EN 50121-3-1.",
      application: "Debe aplicar la norma EN 50121-3-1: (1) situar la antena de medida a 10 metros de distancia del vehículo; (2) utilizar un receptor de medida de perturbaciones con detector de cuasi-pico (QP); (3) realizar el barrido de frecuencias en el rango especificado por la norma; (4) comparar los valores medidos con los límites de cuasi-pico establecidos. Las mediciones deben realizarse con el vehículo en condiciones estacionarias definidas (pantógrafo levantado, equipos auxiliares en marcha, motores en vacío o carga definida)."
    },
    {
      situation: "Durante la instalación de un nuevo sistema de telecomunicaciones en una línea ferroviaria, el ingeniero de proyecto debe decidir la separación mínima entre los cables de telecomunicación y los cables de alta tensión de la catenaria.",
      application: "Debe aplicar los criterios de segregación de cables del Plan de Gestión de CEM del proyecto: los cables de telecomunicación deben mantener la máxima distancia posible de los cables de potencia y de la catenaria para minimizar el acoplamiento inductivo y capacitivo. La normativa ferroviaria y las buenas prácticas de CEM exigen: separación física mínima, uso de cables apantallados con conexión de pantalla a tierra, cruce perpendicular cuando sea inevitable, y verificación mediante ensayos de inmunidad en campo."
    },
    {
      situation: "En el pliego de condiciones de una licitación de ADIF para un nuevo enclavamiento electrónico se omite cualquier referencia a requisitos de CEM.",
      application: "Es un error grave. La CEM debe ser un requisito explícito en los pliegos de licitación de todos los sistemas electrónicos ferroviarios, especialmente los de seguridad. El pliego debe exigir: cumplimiento de la Directiva 2014/30/UE, conformidad con la EN 50121-4 (para aparatos de señalización), documentación técnica de CEM, resultados de ensayos de emisión e inmunidad, y Plan de Gestión de CEM para la integración en el entorno ferroviario específico. Sin estos requisitos, ADIF no puede verificar la compatibilidad del nuevo equipo con los sistemas existentes."
    }
  ],

  reviewTakeaways: [
    "CEM = Emisión (lo que genera el equipo) + Inmunidad (lo que soporta el equipo). Ambos deben cumplir los límites.",
    "Directiva CEM vigente: 2014/30/UE (en vigor desde 20/04/2016). En España: RD 186/2016.",
    "Norma ferroviaria de CEM: EN 50121 (partes 1-5). EN 50121-2 = sistema al exterior; EN 50121-3-1 = material rodante; EN 50121-4 = señalización y telecomunicación; EN 50121-5 = instalaciones fijas de potencia.",
    "Catenaria = antena de cable horizontal → vía principal de propagación de interferencias conducidas y radiadas.",
    "Tres tipos de acoplamiento: conducido (cables), inductivo (campo magnético, ley de Faraday), capacitivo (campo eléctrico).",
    "Medición de emisiones radiadas: detector de cuasi-pico (QP) a 10 m de distancia en prueba estacionaria (EN 50121-3-1).",
    "Marcado CE = Directiva CEM + documentación técnica + Declaración UE de Conformidad. En ferrocarril: + TSI + Organismo Notificado.",
    "Mitigación de EMI: filtrado > blindaje > puesta a tierra > segregación de cables > distancia > trenzado.",
    "La CEM debe ser requisito EXPLÍCITO en los pliegos de licitación de ADIF para cualquier equipo electrónico.",
    "Plan de Gestión de CEM: identificación fuentes/víctimas → análisis acoplamiento → medidas mitigación → ensayos verificación."
  ]
};
