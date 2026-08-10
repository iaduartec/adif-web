import type { TheorySection } from "../lesson-theory";

export const rcfLibro1Theory: TheorySection = {
  introduction: `El Reglamento de Circulación Ferroviaria (RCF), aprobado por el Real Decreto 664/2015, de 17 de julio, constituye el pilar básico e irrenunciable que regula la seguridad de la circulación de los trenes en la Red Ferroviaria de Interés General (RFIG). Este reglamento sustituyó al histórico Reglamento General de Circulación (RGC) de RENFE con el fin de adaptar las normas operativas a la liberalización del sector ferroviario europeo y a la separación entre el Administrador de Infraestructuras (ADIF) y las Empresas Ferroviarias (EF).

El Libro Primero, titulado 'Reglas Generales', establece las bases comunes y los principios operativos esenciales que vinculan a todos los agentes que participan en las operaciones de circulación ferroviaria (maquinistas, responsables de circulación, auxiliares de circulación, operadores de centro de control de tráfico, personal de infraestructura, etc.). Es la parte más teórica y la que define con precisión quirúrgica el lenguaje técnico ferroviario que se emplea en el resto de libros del reglamento.

En los exámenes de ADIF, las preguntas sobre el RCF Libro Primero son extremadamente frecuentes y minuciosas. Suelen centrarse en: (1) las definiciones de las distintas dependencias ferroviarias (estaciones, puestos de bloqueo, etc.); (2) el orden de prevalencia de la documentación técnica y reglamentaria; (3) las condiciones exactas de los distintos tipos de marcha (maniobras, a la vista, con precaución, etc.); (4) los requisitos para la validez y el registro de las comunicaciones de circulación (telefonemas).`,

  concepts: [
    {
      title: "La seguridad como principio rector (Art. 1.1)",
      description: "El principio supremo del reglamento es garantizar la seguridad en todas las operaciones ferroviarias. Todas las normas, instrucciones, consignas y procedimientos deben interpretarse y aplicarse con el fin prioritario de mantener la seguridad del personal, de los viajeros, de la infraestructura y del tráfico. Ante cualquier situación no regulada expresamente o de duda sobre la interpretación de una norma, el agente debe adoptar siempre la decisión que priorice la seguridad, incluso si esto supone detener la circulación de un tren o retrasar el servicio."
    },
    {
      title: "Clasificación y prevalencia de la documentación reglamentaria (Art. 1.3)",
      description: "La documentación se divide según quién la elabore. (a) Del Administrador de Infraestructuras (ADIF): Consignas (C), Avisos (A) y Horarios de los trenes. Las Consignas modifican o complementan al RCF con carácter permanente o temporal. Los Avisos notifican modificaciones puntuales o de corta duración. (b) De las Empresas Ferroviarias (EF): Libro de Normas del Maquinista (LNM) y Libro de Itinerarios del Maquinista (LIM). En caso de discrepancia en una norma, el orden de prevalencia es: 1º Legislación de la AESF y directivas europeas, 2º Normas de ADIF (Consignas y Avisos), 3º Instrucciones de la Empresa Ferroviaria (LNM/LIM)."
    },
    {
      title: "Concepto de Estación Ferroviaria (Art. 1.4)",
      description: "Infraestructura consistente en una instalación de vías y sus aparatos asociados (desvíos), protegida por señales, en la que se desarrollan procesos de circulación (cruce, adelantamiento, estacionamiento). A efectos del RCF, también se consideran estaciones: los Puestos de Bloqueo (PB), los Puestos de Bloqueo de Alta Velocidad (PBA), los Puestos de Cantonamiento (PCA), los Puestos de Adelantamiento y Estacionamiento de Trenes (PAET) y las Bifurcaciones. Asimismo, se asimilan a estaciones los Cambiadores de Ancho de vía y las Bases de Mantenimiento cuando no estén integrados en otra dependencia."
    },
    {
      title: "Cantón de Bloqueo y separación de trenes (Art. 1.4)",
      description: "Es el tramo de vía cuya ocupación simultánea por dos trenes se impide mediante sistemas de seguridad (bloqueo) para garantizar que los trenes circulen a distancia segura. La delimitación física de un cantón depende del sistema de bloqueo instalado: (1) En Bloqueo Telefónico (BT) y Bloqueo de Liberación Automática (BLA), el cantón es la parte de vía comprendida entre dos estaciones colaterales abiertas. (2) En Bloqueo Automático (BA), es el tramo comprendido entre dos señales colaterales consecutivas del sistema de bloqueo."
    },
    {
      title: "Marcha de Maniobras (Art. 1.5)",
      description: "Condición de circulación que se prescribe para los movimientos de trenes o locomotoras en el interior de las estaciones o entre estas y las vías de apartado. Impone al maquinista las siguientes obligaciones estrictas: (1) avanzar con prudencia; (2) regular la velocidad sin exceder en ningún caso de 30 km/h cuando la locomotora vaya tirando del convoy; (3) no exceder en ningún caso de 20 km/h cuando la locomotora vaya empujando el convoy; (4) disponer de la capacidad de detener el tren ante cualquier obstáculo visible por delante de la marcha o ante una señal de parada."
    },
    {
      title: "Marcha a la Vista (Art. 1.5)",
      description: "Condición de marcha de carácter restrictivo que se prescribe al maquinista ante situaciones de anormalidad o avería en los sistemas de señalización o bloqueo. Obliga a: (1) avanzar con la precaución que requiera el caso; (2) regular la velocidad del tren en función del alcance visual de la vía por delante del puesto de conducción; (3) ser capaz de detener el tren de inmediato ante cualquier obstáculo, tren precedente o indicación de parada de una señal. El motivo por el cual se prescribe la marcha a la vista debe comunicarse siempre al maquinista."
    },
    {
      title: "Marcha con Precaución (Art. 1.5)",
      description: "Condición de marcha que impone al maquinista avanzar limitando la velocidad del tren por debajo del máximo autorizado por la línea, debido a condiciones singulares (incidencias meteorológicas menores, obras en vía adyacente o avisos de precaución temporal). El maquinista debe adecuar la marcha para reaccionar ante cualquier peligro imprevisto en la vía, pero sin la exigencia de poder parar ante un obstáculo no visible que sí impone la marcha a la vista."
    },
    {
      title: "Habilitación de Personal (Art. 1.6)",
      description: "Documento oficial e individual que faculta a su titular para desempeñar determinadas funciones relacionadas con la seguridad de la circulación (maquinista, responsable de circulación, etc.). Para obtener la habilitación, el agente debe: (1) poseer el título de conducción o licencia correspondiente; (2) haber superado una formación teórica y práctica reglada; (3) superar las pruebas de aptitud psicofísica periódicas. El personal que interviene en la circulación debe llevar consigo su habilitación durante su turno de trabajo y los útiles de servicio correspondientes."
    },
    {
      title: "Comunicaciones reglamentarias y el Telefonema (Art. 1.7)",
      description: "Las comunicaciones entre agentes que afecten a la seguridad de la circulación deben realizarse de forma reglada y precisa, evitando lenguaje ambiguo. El telefonema es la comunicación reglamentaria de circulación, caracterizada por: (1) utilizar un formato preestablecido en los formularios reglamentarios; (2) identificarse mediante un número secuencial correlativo; (3) registrar el nombre y cargo de los agentes emisor y receptor; (4) registrar la hora exacta de transmisión. El telefonema debe ser leído por el emisor y copiado por el receptor, y posteriormente el receptor debe releerlo (colacionar) para confirmar la exactitud de los datos. Queda registrado en grabadora de voz oficial."
    },
    {
      title: "Colacionar en comunicaciones ferroviarias",
      description: "Operación obligatoria en las transmisiones de telefonemas y órdenes verbales de circulación. Consiste en que el agente receptor repita íntegramente al emisor el contenido de la comunicación que acaba de copiar. Esto permite al emisor verificar que el receptor ha copiado y comprendido la orden con absoluta exactitud. Si hay algún error en la colación, el telefonema se anula y debe emitirse uno nuevo. No colacionar una orden de circulación es una de las infracciones operativas más graves en el ámbito ferroviario."
    }
  ],

  examples: [
    {
      situation: "Un maquinista circula con su tren por una línea equipada con Bloqueo Automático (BA). De repente, observa que una señal luminosa de bloqueo presenta indicación de parada (rojo) y al mismo tiempo ve una consigna de ADIF que indica que esa señal está fuera de servicio por obras y se debe continuar la marcha.",
      application: "Se aplica el orden de prevalencia de la documentación y señales (Art. 1.3): las Consignas del Administrador de Infraestructuras prevalecen sobre el funcionamiento normal de las señales fijas automáticas si así se establece en las mismas por anormalidad. No obstante, si el maquinista tiene cualquier duda sobre la seguridad de la vía o la interpretación del documento, prevalece el principio rector de seguridad (Art. 1.1), debiendo detener el tren de inmediato y consultar por radiotelefonía con el responsable de circulación de la estación colateral antes de reiniciar la marcha."
    },
    {
      situation: "El responsable de circulación ordena verbalmente a un maquinista por el canal de radio de banda estrecha del tren: 'Avanza en marcha de maniobras empujando los vagones para situarlos en la vía 3 de la estación'. El maquinista inicia el avance a una velocidad constante de 28 km/h.",
      application: "El maquinista está cometiendo una infracción reglamentaria. En marcha de maniobras (Art. 1.5), la velocidad máxima permitida está estrictamente limitada a 20 km/h cuando la locomotora va empujando el convoy (y a 30 km/h cuando va tirando). A 28 km/h empujando, infringe el límite de velocidad. Además, la orden debió transmitirse mediante telefonema registrado con su correspondiente número y hora, no de manera verbal e informal si implica movimientos que afecten a la seguridad de la circulación principal."
    },
    {
      situation: "Se produce una avería en el sistema de radiotelefonía GSM-R entre una estación y un tren en marcha. El responsable de circulación necesita transmitir una orden urgente al maquinista para que detenga el tren por presencia de obstáculos en la vía.",
      application: "Ante la imposibilidad de comunicación por GSM-R, se deben utilizar los sistemas de protección del tren (frenado automático mediante ASFA/ERTMS por falta de portadora o señal restrictiva) y el uso de señales portátiles o de mano si hay agentes en el trayecto. Si el maquinista no recibe señales pero detecta anomalías en las comunicaciones en una zona con aviso de incidencia, debe circular con marcha a la vista (capacidad de detenerse ante cualquier obstáculo)."
    },
    {
      situation: "Dos responsables de circulación de estaciones colaterales abiertas necesitan establecer un bloqueo telefónico (BT) por avería del bloqueo automático. Intercambian telefonemas para autorizar la expedición de un tren, pero el receptor del telefonema no repite el texto para comprobarlo.",
      application: "Vulneración muy grave del procedimiento de comunicación reglamentaria (Art. 1.7). La colación (repetición íntegra de la orden copiada) es obligatoria en todos los telefonemas de circulación. Si el receptor no colaciona, el emisor no puede dar por válida la transmisión y el tren no puede ser expedido. La no colación invalida el proceso de bloqueo."
    }
  ],

  reviewTakeaways: [
    "Principio de seguridad (Art. 1.1): ante cualquier duda o situación no prevista, se adopta la decisión más segura (generalmente detener el tren).",
    "Prevalencia documental: 1º AESF/Europa → 2º ADIF (Consignas y Avisos) → 3º Empresa Ferroviaria (LNM/LIM).",
    "Estación = instalación de vías y desvíos protegida por señales. Comprende: PB, PBA, PCA, PAET y Bifurcaciones.",
    "Cantón de bloqueo: tramo de vía en el que se garantiza la separación de trenes. En BT y BLA es entre estaciones abiertas; en BA es entre señales consecutivas.",
    "Marcha de maniobras: velocidad máxima 30 km/h tirando, 20 km/h empujando. Obliga a poder parar ante obstáculo visible o señal de parada.",
    "Marcha a la vista: obliga a regular la velocidad según el alcance visual del maquinista para parar ante obstáculo, tren precedente o señal de parada.",
    "Marcha con precaución: obliga a circular por debajo del límite de la línea ante condiciones singulares, pero sin la exigencia de parada ante obstáculo oculto.",
    "Habilitación: documento de aptitud que el personal debe llevar consigo en su jornada laboral junto a los útiles de servicio.",
    "Telefonema: formato reglado + número secuencial + hora de emisión + identificación de emisor/receptor + registro en grabadora de voz.",
    "Colacionar: repetición íntegra de la orden copiada por el receptor, requisito obligatorio para la validez de cualquier telefonema o instrucción verbal."
  ]
};
