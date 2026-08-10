export interface TheorySection {
  introduction: string;
  concepts: Array<{
    title: string;
    description: string;
  }>;
  examples: Array<{
    situation: string;
    application: string;
  }>;
  reviewTakeaways: string[];
}

import { igualdadTheory } from "./theories/igualdad";
import { prlTheory } from "./theories/prevencion-riesgos-laborales";
import { estatutoAdifTheory } from "./theories/estatuto-adif";

export const lessonTheories: Record<string, TheorySection> = {
  igualdad: igualdadTheory,
  "prevencion-riesgos-laborales": prlTheory,
  "estatuto-adif": estatutoAdifTheory,
  "ict-rd-346-2011": {
    introduction: "El Real Decreto 346/2011 aprueba el Reglamento regulador de las Infraestructuras Comunes de Telecomunicaciones (ICT). Es el reglamento técnico que define las normas obligatorias de diseño, instalación, canalización y equipamiento para el acceso a los servicios de telecomunicación en el interior de edificaciones bajo el régimen de propiedad horizontal en España. Su estudio es fundamental para el personal técnico de telecomunicaciones de ADIF por su conexión directa con las normas técnicas de tendidos de telecomunicaciones y el reglamento de radiocomunicaciones.",
    concepts: [
      {
        title: "Infraestructura Común de Telecomunicaciones (ICT)",
        description: "La infraestructura instalada en el interior de los edificios que facilita la captación, adaptación y distribución ordenada y segura de servicios de radio, televisión terrenal y satélite, y los servicios de telefonía y banda ancha (fibra óptica, par de cobre y coaxial). Sus normas técnicas se desarrollan en los Anexos del Reglamento."
      },
      {
        title: "Red de Alimentación de la ICT",
        description: "Parte de la red propiedad de los operadores de telecomunicaciones que conecta sus centrales de servicio con el Punto de Interconexión del edificio, situado con carácter general en el interior del recinto técnico (RITI). Se define en el apartado 2.1 del Anexo II y es responsabilidad de los operadores de servicio."
      },
      {
        title: "Red de Distribución",
        description: "Tramo que discurre por el interior del edificio (a través de la canalización principal) llevando las señales de telecomunicación desde los repartidores principales del registro principal hasta los registros secundarios o derivadores de planta. Se define en el apartado 2.2 del Anexo II."
      },
      {
        title: "Red de Dispersión",
        description: "Es el tramo de la red que conecta la red de distribución en el registro secundario de cada planta con el Punto de Acceso al Usuario (PAU) de cada una de las viviendas u oficinas, configurándose en estrella desde el PAU hasta las tomas."
      },
      {
        title: "Red Interior de Usuario",
        description: "Tramo de la red que discurre por el interior de cada vivienda u oficina, conectando el Punto de Acceso al Usuario (PAU) con las bases de acceso a terminales (BAT) o tomas de usuario distribuidas por las estancias."
      },
      {
        title: "Recinto de Instalaciones de Telecomunicaciones Inferior (RITI)",
        description: "Local o recinto técnico situado con carácter general en la parte inferior o planta baja del edificio, destinado a albergar el punto de interconexión y los repartidores principales de los operadores de telefonía, cable y fibra óptica."
      },
      {
        title: "Recinto de Instalaciones de Telecomunicaciones Superior (RITS)",
        description: "Local o recinto técnico situado en la parte superior o cubierta del edificio, destinado a alojar los elementos de captación, recepción y procesado de las señales de radiodifusión sonora y televisión recibidas mediante las antenas exteriores, desde donde parten los cables hacia el RITI."
      },
      {
        title: "Punto de Acceso al Usuario (PAU)",
        description: "Elemento en el que comienza la red interior del domicilio del usuario y que permite la delimitación de responsabilidades en cuanto al origen, localización y reparación de averías. Se ubica en el interior del domicilio del usuario y permite la selección del cable de la red interior."
      },
      {
        title: "Proyecto técnico y régimen sancionador (Arts. 9, 10 y 15)",
        description: "El proyecto técnico de la ICT debe acompañar la solicitud de licencia o autorización de edificación, conforme a los requisitos del Reglamento. El incumplimiento de las obligaciones del Reglamento se sanciona de acuerdo con lo previsto en el artículo 11 del Real Decreto-ley 1/1998 y en la Ley 32/2003, General de Telecomunicaciones (el propio RD 346/2011 no tipifica sanciones propias)."
      }
    ],
    examples: [
      {
        situation: "Un técnico instalador despliega una acometida de fibra óptica desde el armario RITI exterior de la calle, pasando el cable directamente a través de la fachada y la ventana de un vecino sin pasar por la canalización del edificio.",
        application: "Es una infracción directa de las especificaciones de diseño del RD 346/2011. Toda instalación debe canalizarse internamente a través de los registros y conductos previstos de la ICT para garantizar la estética, la seguridad y la integridad de las líneas de telecomunicación."
      },
      {
        situation: "Una comunidad de vecinos denuncia pérdidas continuas en la señal de TV digital tras instalarse un repartidor en la red de distribución del edificio.",
        application: "El Anexo I del Reglamento exige que los elementos de la cabecera (amplificadores, mezcladores, repartidores) garanticen los niveles de señal adecuados a las tomas de usuario. El mantenimiento de la ICT y la correcta configuración de los equipos de distribución son responsabilidad de la comunidad, debiendo verificarse los niveles de señal que llegan a cada PAU."
      }
    ],
    reviewTakeaways: [
      "El PAU delimita responsabilidades: comienza la red interior del usuario y permite localizar el origen de las averías.",
      "Las definiciones de las redes (alimentación, distribución, dispersión, interior) y de los recintos RITI/RITS se desarrollan en los Anexos II y III del Reglamento.",
      "El RD 346/2011 no tiene régimen sancionador propio: remite al Real Decreto-ley 1/1998 y a la Ley 32/2003 General de Telecomunicaciones.",
      "La canalización principal discurre por zonas comunes del edificio y nunca puede atravesar viviendas de propiedad privada."
    ]
  },
  "compatibilidad-electromagnetica": {
    introduction: "La compatibilidad electromagnética (CEM o EMC) es la capacidad de los equipos eléctricos y electrónicos para funcionar correctamente en su entorno electromagnético sin producir ni sufrir perturbaciones intolerables. En los ferrocarriles, donde los sistemas de señalización y control conviven con la propulsión eléctrica de alta potencia, la CEM es una parte esencial de los procesos de análisis de seguridad. El material de estudio se apoya en el artículo técnico 'La compatibilidad electromagnética y la seguridad en los ferrocarriles' de Francesc Daura (Cemdal), que resume la Directiva CEM y la norma europea EN 50121.",
    concepts: [
      {
        title: "Directiva CEM y marco normativo",
        description: "La Directiva de Compatibilidad Electromagnética 2004/108/CE (publicada el 15 de diciembre de 2004, plenamente en vigor desde julio de 2009) se transpone en España mediante el Real Decreto 1580/2006, de 22 de diciembre. Fue sustituida por la Directiva 2014/30/UE, publicada el 29 de marzo de 2014 y en vigor desde el 20 de abril de 2016. Afecta a todos los equipos electrónicos, incluida la industria ferroviaria."
      },
      {
        title: "Norma europea EN 50121",
        description: "Es la norma CEM específica de aplicación en los ferrocarriles, desarrollada por CENELEC. Describe las pruebas a realizar para evitar los problemas de CEM dentro del entorno ferroviario y entre la red del ferrocarril y el 'mundo exterior'. Se estructura en partes 1 a 5 (emisión e inmunidad del conjunto, del material rodante, de los aparatos de señalización y telecomunicación, etc.). Su versión española UNE-EN 50121 se presentó en 2007."
      },
      {
        title: "Fuentes de interferencias en el ferrocarril",
        description: "En un ferrocarril electrificado se requieren megavatios de potencia para la propulsión, lo que genera niveles importantes de interferencias electromagnéticas (EMI). Las principales fuentes son los convertidores conmutados de alta potencia de las locomotoras (tanto de alta velocidad como de alta potencia), las subestaciones, los motores y accionamientos, y la catenaria junto con el pantógrafo."
      },
      {
        title: "La catenaria como antena y el acoplamiento",
        description: "Al ser prácticamente una antena de cable horizontal, la catenaria actúa como vía de propagación de las interferencias conducidas, que pueden llegar a la alimentación de la línea aérea. Existen acoplamientos inductivos, capacitivos y conductivos entre las distintas partes del sistema ferroviario y con sistemas cercanos, con consecuencias potencialmente graves para la señalización si no se gestionan."
      },
      {
        title: "Emisiones e inmunidad",
        description: "Las normas EN 50121-2 y EN 50121-3-1 establecen las emisiones que deben medirse: por ejemplo, los límites de cuasi-pico de las emisiones radiadas a 10 metros en la prueba estacionaria del material rodante (EN 50121-3-1). La inmunidad es la capacidad de un equipo para funcionar sin degradarse en presencia de perturbaciones."
      },
      {
        title: "Evaluación de la conformidad y gestión de la CEM",
        description: "Para poder venderse en la UE, todo equipo debe cumplir la Directiva de CEM, lo que requiere documentación técnica (equivalente al expediente técnico de construcción) y declaración de conformidad del fabricante. En el sector ferroviario se completa con los certificados basados en las normas TSI (Especificaciones Técnicas de Interoperabilidad), la elaboración de un Plan de Gestión de la CEM y la incorporación de la CEM como requisito en las convocatorias de licitación."
      },
      {
        title: "Interferencias conducidas y radiadas",
        description: "Las perturbaciones pueden transmitirse de forma conducida (a través de cables de alimentación, de señal o del propio carril como vía de retorno) o radiada (propagándose como ondas electromagnéticas por el aire). Se controlan mediante filtros, blindajes conectados a tierra, segregación de circuitos y buenas prácticas de diseño."
      }
    ],
    examples: [
      {
        situation: "Al arrancar un tren, los sistemas de señalización próximos a la catenaria sufren perturbaciones que degradan sus comunicaciones.",
        application: "La propulsión genera EMI mediante convertidores conmutados de alta potencia que se propagan por la catenaria (que actúa como antena de cable horizontal). Deben aplicarse las normas EN 50121 y las buenas prácticas de CEM, verificando los niveles de emisión e inmunidad de los equipos de señalización."
      },
      {
        situation: "Un fabricante quiere vender en la Unión Europea un equipo electrónico de señalización para el material rodante.",
        application: "Debe evaluar la conformidad con la Directiva CEM (2004/108/CE y actual 2014/30/UE, transpuesta por el RD 1580/2006), elaborar la documentación técnica, aplicar las normas EN 50121 para las pruebas de emisión e inmunidad y declarar la conformidad. En el ámbito ferroviario europeo se completa con los certificados basados en las normas TSI."
      },
      {
        situation: "Un técnico debe medir las emisiones radiadas de una locomotora en prueba estacionaria.",
        application: "Se aplica la norma EN 50121-3-1, que fija los límites de cuasi-pico de las emisiones radiadas a 10 metros. Las mediciones deben realizarse con el instrumento de medida y el barrido adecuados, teniendo en cuenta la influencia de la antena, la distancia y la velocidad del barrido."
      }
    ],
    reviewTakeaways: [
      "La CEM es parte esencial del análisis de seguridad ferroviario y del cumplimiento de las normas TSI.",
      "La Directiva CEM vigente es la 2014/30/UE (en vigor desde el 20/04/2016); en España se transpone por el RD 1580/2006.",
      "La norma europea de CEM ferroviaria es la EN 50121 (partes 1 a 5), que fija las pruebas de emisión e inmunidad.",
      "La catenaria actúa como antena de cable horizontal, por lo que es vía principal de propagación de interferencias.",
      "La conformidad exige documentación técnica y declaración del fabricante; en ferrocarril se refuerza con TSI y Plan de Gestión de la CEM."
    ]
  },
  "rcf-libro-1": {
    introduction: "El Reglamento de Circulación Ferroviaria (RCF), aprobado mediante el Real Decreto 664/2015, de 17 de julio, constituye el marco normativo que regula la seguridad de la circulación de los trenes en la Red Ferroviaria de Interés General (RFIG). El Libro Primero, 'Reglas Generales', establece las definiciones fundamentales, la documentación reglamentaria, las comunicaciones y las condiciones de marcha que deben conocer y aplicar todos los agentes que intervienen en la circulación ferroviaria.",
    concepts: [
      {
        title: "La seguridad como principio rector",
        description: "La circulación debe realizarse en condiciones de seguridad. Las normas y consignas se interpretan y aplican con ese fin: ante cualquier situación que comprometa la seguridad, prevalece la protección de las personas y del tráfico sobre consideraciones de puntualidad o servicio."
      },
      {
        title: "Documentación reglamentaria",
        description: "El Libro Primero clasifica la documentación por su origen. La elaborada y aprobada por el Administrador de Infraestructuras (AI) incluye Consignas, Avisos y Horarios de los trenes; la elaborada y aprobada por las Empresas Ferroviarias (EF) incluye el Libro de Normas del Maquinista y el Libro de Itinerarios del Maquinista. En caso de discrepancia entre documentos sobre un mismo objeto, el orden de prevalencia es: AESF y normas europeas, AI, EF."
      },
      {
        title: "Habilitación",
        description: "Documento que faculta a su titular para ejercer unas funciones cuya capacidad ha sido acreditada mediante la superación de una formación reglada. Todo el personal que interviene en la circulación debe estar habilitado y recibir de su AI o EF los útiles de servicio necesarios para desarrollar su función."
      },
      {
        title: "Estación ferroviaria",
        description: "Infraestructura ferroviaria consistente en una instalación de vías y sus aparatos asociados, protegida por señales, en la que se desarrollan procesos de circulación. A efectos del Reglamento se consideran estación los Puestos de Bloqueo (PB), PBA, PCA, PAET y las Bifurcaciones, así como los Cambiadores de Ancho y Bases de Mantenimiento cuando no estén integrados en otra estación."
      },
      {
        title: "Cantón de bloqueo",
        description: "El tramo de vía cuya ocupación simultánea por dos trenes se impide para garantizar la separación. Su definición depende del sistema de bloqueo: en BT (Bloqueo Telefónico) y BLA (Bloqueo Automático de vía Doble) es la parte de vía comprendida entre dos estaciones colaterales abiertas; en BA (Bloqueo Automático), la parte de vía entre dos señales de bloqueo consecutivas; en BSL, el tramo comprendido entre señales que pueden presentar parada."
      },
      {
        title: "Marcha de maniobras",
        description: "Impone al maquinista la obligación de avanzar con prudencia, sin exceder la velocidad de 30 km/h si la locomotora va tirando del tren, o de 20 km/h si va empujándolo, de forma que pueda detener el tren ante cualquier obstáculo visible desde el puesto de conducción o ante una señal de parada."
      },
      {
        title: "Marcha a la vista",
        description: "Condición de marcha especial que impone avanzar con la precaución que requiera el caso, regulando la velocidad de acuerdo con la longitud de vía visualizada por delante del puesto de conducción, de forma que pueda detenerse el tren ante cualquier obstáculo o señal de parada. Cuando se prescriba, se indicará el motivo."
      },
      {
        title: "Comunicaciones reglamentarias y telefonema",
        description: "Las comunicaciones que inciden en la circulación tienen formato reglado. El telefonema es la comunicación reglamentaria en los procesos de circulación, caracterizada por un formato preestablecido, identificada mediante un número secuencial, la hora de transmisión y la identificación del emisor, y que queda registrada en los soportes contemplados en el Reglamento."
      }
    ],
    examples: [
      {
        situation: "Un maquinista encuentra un obstáculo o una indicación que le impide continuar con normalidad y no dispone de procedimiento específico previsto.",
        application: "Aplica la regla de seguridad como principio rector: debe detener el tren ante cualquier obstáculo o señal de parada y comunicar la situación por el canal reglamentario. En el bloqueo telefónico (BT), la circulación se realiza mediante telefonemas registrados entre estaciones colaterales abiertas."
      },
      {
        situation: "Existe una discrepancia entre el Libro de Itinerarios del Maquinista (EF) y una consigna del Administrador de Infraestructuras sobre el mismo tramo.",
        application: "Se aplica el orden de prevalencia del Reglamento: primero AESF y normas europeas, después el Administrador de Infraestructuras (consignas) y por último la Empresa Ferroviaria (Libro de Normas e Itinerarios del Maquinista)."
      },
      {
        situation: "Una maniobra debe realizarse empujando una locomotora detrás de un convoy.",
        application: "El Reglamento limita la velocidad a 20 km/h en marcha de maniobras cuando la locomotora empuja el tren, debiendo el maquinista poder detenerlo ante cualquier obstáculo visible o señal de parada. Si fuera tirando del tren, el límite sería de 30 km/h."
      }
    ],
    reviewTakeaways: [
      "El RCF se aprueba por el Real Decreto 664/2015, de 17 de julio, y su Libro Primero regula las reglas generales de circulación.",
      "La documentación reglamentaria procede del AI (consignas, avisos, horarios) y de las EF (Libro de Normas e Itinerarios del Maquinista).",
      "La estación se define por sus vías, aparatos y señales, y comprende PB, PBA, PCA, PAET y Bifurcaciones.",
      "El cantón de bloqueo garantiza que no circulen dos trenes en el mismo tramo; su alcance depende del sistema de bloqueo (BT, BLA, BA, BSL).",
      "En marcha de maniobras: 30 km/h tirando, 20 km/h empujando; la marcha a la vista exige poder detener el tren ante cualquier obstáculo.",
      "El telefonema es la comunicación reglamentaria registrada en los procesos de circulación."
    ]
  },
  psicometria: {
    introduction: "La evaluación psicotécnica y psicométrica para el ingreso en ADIF mide el perfil de competencias cognitivas y aptitudinales de los candidatos a personal operativo de entrada. El examen premia rapidez, atención sostenida y control del error: el objetivo no es resolverlo todo, sino acertar con consistencia, gestionar el tiempo y detectar el patrón correcto en pocos segundos.",
    concepts: [
      {
        title: "Resistencia a la Fatiga y Atención Selectiva",
        description: "Mide la capacidad de concentrarse en tareas repetitivas y monótonas sin cometer fallos. Las preguntas típicas exigen comparar cadenas, detectar cambios mínimos y sostener el ritmo sin perder exactitud, así que conviene establecer una secuencia fija de lectura y no improvisar."
      },
      {
        title: "Razonamiento Lógico-Espacial",
        description: "Mide la aptitud para conceptualizar y manipular mentalmente formas bidimensionales (2D) y tridimensionales (3D). Incluye giros, simetrías, matrices y desdoblamientos, y suele resolverse mejor buscando primero el elemento constante o la transformación dominante."
      },
      {
        title: "Aptitud Numérica",
        description: "Evalúa la velocidad para realizar operaciones matemáticas básicas (fracciones, porcentajes, proporciones, regla de tres y velocidad media) y resolver pequeños problemas lógicos. La clave es escribir la mínima operación necesaria para evitar errores de cálculo y de transcripción."
      },
      {
        title: "Aptitud Verbal",
        description: "Evalúa la comprensión lectora rápida de manuales técnicos, analogías semánticas, antónimos, sinónimos y la capacidad de seguir instrucciones complejas escritas de forma rigurosa. Suele penalizar más la lectura precipitada que el desconocimiento léxico real."
      }
    ],
    examples: [
      {
        situation: "Un ejercicio psicotécnico de atención alfanumérica te presenta una columna de 60 códigos tipo 'A9-X4-B3' y otra al lado con ligeras variantes, debiendo marcar si son idénticos o diferentes en 90 segundos.",
        application: "La mejor estrategia es entrenar el barrido visual saltando los primeros dos caracteres comunes de cada código y comparando la terminación directamente, lo que reduce el tiempo de análisis en un 40%."
      },
      {
        situation: "Se plantea un problema matemático de cruce de dos trenes: el tren A sale de Madrid a 80 km/h y el tren B sale de Zaragoza a 120 km/h al mismo tiempo. Sabiendo que la distancia es de 300 km, se pide hallar a qué distancia se cruzan.",
        application: "Usa movimiento relativo: Tiempo = Distancia / (Velocidad A + Velocidad B) = 300 / (80 + 120) = 1,5 horas. Después calcula la distancia recorrida por uno de los trenes para comprobar el resultado antes de pasar a la siguiente pregunta."
      }
    ],
    reviewTakeaways: [
      "En pruebas psicotécnicas conviene confirmar las reglas de corrección de cada convocatoria antes de asumir penalización por error.",
      "La gestión del tiempo es crítica: primero las preguntas seguras, después las dudosas y al final la revisión.",
      "La práctica diaria y cronometrada automatiza series, matrices y comparaciones visuales.",
      "Si un ejercicio no tiene regla evidente en pocos segundos, no te cases con él: márcalo y sigue."
    ]
  },
  "declaracion-red-2027": {
    introduction: "La Declaración sobre la Red (DR) es el documento que el Administrador de Infraestructuras Ferroviarias (Adif) publica cada año para exponer las características de la infraestructura ferroviaria puesta a disposición de las empresas ferroviarias y candidatos, así como las condiciones de acceso a la Red Ferroviaria de Interés General (RFIG), a las instalaciones de servicio y la prestación de servicios en dichas instalaciones. Para la oposición de Personal Operativo de Adif, el estudio se centra en los capítulos I (Información General) y II (Descripción de las Infraestructuras), que contienen la estructura del sector ferroviario español, la definición de la RFIG, los agentes intervinientes, el marco legal y los procedimientos de adjudicación de capacidad y tarificación.",
    concepts: [
      {
        title: "Declaración sobre la Red (DR)",
        description: "Documento del Administrador de Infraestructuras que expone las características de la infraestructura, las condiciones de acceso a la RFIG, las instalaciones de servicio y los servicios prestados. Detalla normas generales, plazos, procedimientos y criterios de cánones y adjudicación de capacidad. Se regula por la Ley 38/2015 del Sector Ferroviario y la Orden FOM/897/2005, y se aprueba anualmente por el Consejo de Administración de Adif."
      },
      {
        title: "Red Ferroviaria de Interés General (RFIG)",
        description: "Conjunto de infraestructuras ferroviarias, estaciones de viajeros y terminales de mercancías esenciales para garantizar un sistema común de transporte ferroviario en todo el territorio del Estado o cuya administración conjunta sea necesaria para su correcto funcionamiento, conforme al artículo 4 de la Ley 38/2015. Incluye itinerarios de tráfico internacional, enlaces entre comunidades autónomas y conexiones a núcleos de población. Todos sus elementos se recogen en el Catálogo de la RFIG."
      },
      {
        title: "Principales agentes del sector ferroviario",
        description: "El Ministerio de Transportes y Movilidad Sostenible planifica, regula y supervisa el sistema. De él dependen las entidades públicas empresariales Adif, Adif-Alta Velocidad, Renfe-Operadora, Puertos del Estado y Enaire. La Comisión Nacional de los Mercados y la Competencia (CNMC) actúa como órgano regulador: garantiza la pluralidad de la oferta, la igualdad de acceso al mercado, la supervisión de cánones y tarifas y la comprobación de cláusulas no discriminatorias de la DR. La Agencia Estatal de Seguridad Ferroviaria (AESF), creada por el RD 1072/2014, tiene por objeto la detección, análisis y evaluación de los riesgos de seguridad del transporte por ferrocarril, como organismo público de los regulados en la Ley 40/2015."
      },
      {
        title: "Grandes cifras de la red de Adif",
        description: "Datos referidos al ejercicio (edición V.0, datos a 31/12/2025): aproximadamente 11.675,9 km de red titularidad de Adif, desglosados en 10.212,5 km de red convencional de ancho ibérico puro (1.668 mm), 57,2 km de AV de ancho estándar puro (1.435 mm), 84,1 km de AV de ancho ibérico, 126,8 km de red mixta de tercer carril y 1.195,3 km de vía estrecha de ancho métrico (1.000 mm). Las líneas equipadas con ERTMS suman 384,5 km. Cuenta con 1.445 estaciones, 45 terminales de mercancías y unos 13.619 empleados."
      },
      {
        title: "Marco legal y estatus jurídico de la DR",
        description: "La base legal es la normativa ferroviaria estatal (Ley 38/2015 del Sector Ferroviario, Orden FOM/897/2005) y la normativa europea transpuesta. La DR tiene carácter vinculante para las empresas ferroviarias, los candidatos y el propio administrador de infraestructuras en cuanto a los derechos y obligaciones que de ella se deriven. La presentación de una solicitud de capacidad implica la aceptación implícita de sus condiciones."
      },
      {
        title: "Adjudicación de capacidad",
        description: "Proceso por el cual el Administrador de Infraestructuras asigna franjas horarias (surcos) a las empresas ferroviarias y candidatos para la prestación de servicios. Se rige por criterios objetivos, transparentes y no discriminatorios, tal y como se detalla en el capítulo 4 de la DR, y la solicitud de capacidad puede ser lineal o en instalaciones de servicio."
      },
      {
        title: "Cooperación internacional",
        description: "Adif participa en los Corredores Ferroviarios Europeos de Mercancías (RFC) y en RailNet Europe (RNE), asociación de administradores de infraestructura europeos que facilita la interoperabilidad y la publicación coordinada de las Declaraciones sobre la Red conforme a una estructura común aprobada por su Asamblea General."
      }
    ],
    examples: [
      {
        situation: "Una empresa ferroviaria privada solicita a Adif acceso a un tramo de la RFIG para operar un servicio de transporte de viajeros en competencia con el operador público.",
        application: "Adif debe aplicar los principios de transparencia y no discriminación: la solicitud de capacidad debe tramitarse en igualdad de condiciones para todos los candidatos, y el acceso a la infraestructura se regula por la Ley 38/2015 y la Declaración sobre la Red vigente."
      },
      {
        situation: "Una empresa ferroviaria detecta que el catálogo de ejes y líneas de la RFIG no incluye un tramo que quiere utilizar.",
        application: "Todos los elementos de la RFIG deben figurar en el Catálogo de la Red Ferroviaria de Interés General con su código oficial (Anexo F de la DR). Si el tramo no está incluido, no forma parte de la RFIG gestionada por Adif y no puede asignarse capacidad sobre él."
      },
      {
        situation: "Un candidato considera que la Declaración sobre la Red contiene cláusulas que le perjudican frente a otros operadores.",
        application: "La CNMC supervisa la DR en sus versiones provisional y definitiva, comprobando que no contenga cláusulas discriminatorias ni otorgue poderes discrecionales al administrador. El candidato puede dirigirse al órgano regulador para la resolución de la reclamación."
      }
    ],
    reviewTakeaways: [
      "La DR tiene carácter vinculante y se aprueba anualmente por el Consejo de Administración de Adif.",
      "La RFIG se define en el artículo 4 de la Ley 38/2015 y sus elementos se recogen en el Catálogo de la RFIG.",
      "Los agentes clave del sector son el Ministerio de Transportes, Adif, Adif-Alta Velocidad, Renfe-Operadora, la CNMC como regulador y la AESF como organismo de seguridad.",
      "Cifras 2027: 11.675,9 km de red de Adif, 1.445 estaciones, 45 terminales y 13.619 empleados.",
      "El acceso a la infraestructura se basa en los principios de objetividad, transparencia y no discriminación."
    ]
  },
  "codigo-conducta": {
    introduction: "El Capítulo VI del Título III del Estatuto Básico del Empleado Público (Real Decreto Legislativo 5/2015, de 30 de octubre) regula los deberes de los empleados públicos y configura el Código de Conducta, integrado por los principios éticos (artículo 53) y los principios de conducta (artículo 54). Estos principios informan la interpretación y aplicación del régimen disciplinario de los empleados públicos, por lo que constituyen un bloque esencial para la oposición de Personal Operativo de Adif, tanto en su parte de legislación general como en las situaciones prácticas del desempeño diario.",
    concepts: [
      {
        title: "Deberes de los empleados públicos (Art. 52)",
        description: "Los empleados públicos deben desempeñar con diligencia las tareas asignadas y velar por los intereses generales con sujeción a la Constitución y al ordenamiento jurídico, actuando conforme a los principios de objetividad, integridad, neutralidad, responsabilidad, imparcialidad, confidencialidad, dedicación al servicio público, transparencia, ejemplaridad, austeridad, accesibilidad, eficacia, honradez, promoción del entorno cultural y medioambiental, y respeto a la igualdad entre mujeres y hombres."
      },
      {
        title: "Principios éticos (Art. 53)",
        description: "Los empleados públicos respetarán la Constitución y el resto del ordenamiento jurídico; su actuación perseguirá el interés general con consideraciones objetivas e imparciales; se ajustarán a los principios de lealtad y buena fe; respetarán los derechos fundamentales evitando toda discriminación; se abstendrán en asuntos con interés personal y de actividades que supongan conflicto de intereses; no aceptarán tratos de favor; actuarán con eficacia, economía y eficiencia; guardarán secreto de las materias clasificadas y mantendrán discreción sobre lo conocido por razón de su cargo."
      },
      {
        title: "Principios de conducta (Art. 54)",
        description: "Tratarán con atención y respeto a ciudadanos y superiores; desempeñarán sus tareas con diligencia cumpliendo jornada y horario; obedecerán las órdenes de los superiores salvo que constituyan infracción manifiesta del ordenamiento; informarán a los ciudadanos; administrarán los recursos públicos con austeridad sin usarlos en provecho propio; rechazarán regalos o favores que vayan más allá de los usos habituales de cortesía; garantizarán la constancia de los documentos; mantendrán actualizada su formación; observarán las normas de seguridad y salud laboral; propondrán mejoras de eficacia del servicio; y atenderán al ciudadano en la lengua oficial que solicite."
      },
      {
        title: "Relación con el régimen disciplinario",
        description: "Los principios y reglas del Código de Conducta informan la interpretación y aplicación del régimen disciplinario de los empleados públicos (Título VII del EBEP), de modo que las faltas disciplinarias se valoran conforme a los deberes y principios éticos y de conducta establecidos en el capítulo."
      }
    ],
    examples: [
      {
        situation: "Un empleado de Adif recibe una orden de su superior para favorecer a una empresa contratista en un trámite administrativo a cambio de ventajas.",
        application: "La orden constituye una infracción manifiesta del ordenamiento jurídico. Conforme al artículo 54.3 del EBEP, el empleado no debe obedecerla y debe ponerla inmediatamente en conocimiento de los órganos de inspección procedentes."
      },
      {
        situation: "Un operador de circulación conoce por razón de su cargo la planificación de una obra en la vía y la comparte con un amigo para una operación inmobiliaria.",
        application: "Viola el artículo 53.12 del EBEP: debe guardar secreto de las materias cuya difusión esté prohibida y no puede hacer uso de la información obtenida por razón de su cargo para beneficio propio o de terceros."
      },
      {
        situation: "Un maquinista recibe un obsequio de alto valor de un proveedor que mantiene contratos con Adif.",
        application: "Conforme al artículo 54.6, se rechazará cualquier regalo, favor o servicio en condiciones ventajosas que vaya más allá de los usos habituales de cortesía, sin perjuicio de lo establecido en el Código Penal."
      }
    ],
    reviewTakeaways: [
      "El Código de Conducta se compone de los principios éticos (Art. 53) y los principios de conducta (Art. 54).",
      "Las órdenes que constituyan infracción manifiesta del ordenamiento no deben obedecerse y deben ponerse en conocimiento de la inspección.",
      "El empleado público no puede usar la información obtenida por su cargo en beneficio propio o de terceros.",
      "La infracción de estos deberes se sanciona conforme al régimen disciplinario del Título VII del EBEP."
    ]
  },
  incompatibilidades: {
    introduction: "La Ley 53/1984, de 26 de diciembre, de Incompatibilidades del personal al servicio de las Administraciones Públicas parte del principio de dedicación del personal a un solo puesto de trabajo en el sector público, sin más excepciones que las que demande el propio servicio público, respetando las actividades privadas que no puedan impedir o menoscabar el estricto cumplimiento de sus deberes ni comprometer su imparcialidad o independencia. Desarrolla el mandato de los artículos 103.3 y 149.1.18 de la Constitución y resulta de aplicación directa al personal de Adif como entidad pública empresarial.",
    concepts: [
      {
        title: "Principio general de dedicación (Art. 1)",
        description: "El personal al servicio de las AAPP no podrá compatibilizar sus actividades con el desempeño de un segundo puesto de trabajo, cargo o actividad en el sector público, salvo en los supuestos previstos en la propia Ley. Tampoco podrá percibir más de una remuneración con cargo a los presupuestos de las AAPP, y el desempeño de un puesto será incompatible con cualquier cargo, profesión o actividad pública o privada que pueda impedir o menoscabar el cumplimiento de sus deberes o comprometer su imparcialidad o independencia."
      },
      {
        title: "Ámbito de aplicación (Art. 2)",
        description: "Se aplica al personal civil y militar de la Administración del Estado, de las Comunidades Autónomas, de las Corporaciones Locales, de entes y organismos públicos, de la Seguridad Social, del Banco de España, de empresas con participación pública superior al 50%, de entidades con presupuesto mayoritariamente subvencionado por las AAPP, y al personal que perciba retribuciones mediante arancel."
      },
      {
        title: "Actividades públicas compatibles (Arts. 3 a 5)",
        description: "Solo puede desempeñarse un segundo puesto en el sector público en los supuestos previstos para funciones docente y sanitaria, en los casos de los artículos 5 y 6, o cuando lo determine el Consejo de Ministros por Real Decreto. La compatibilidad requiere autorización expresa previa, se concede en razón del interés público y exige cumplir estrictamente la jornada de ambos puestos."
      },
      {
        title: "Límites retributivos (Art. 7)",
        description: "Para autorizar la compatibilidad de actividades públicas se exige que la cantidad total percibida por ambos puestos no supere la remuneración prevista para el cargo de Director General, ni supere la del puesto principal incrementada en un 30% para grupo A, 35% para grupo B, 40% para grupo C, 45% para grupo D y 50% para grupo E. Los servicios del segundo puesto no computan a efectos de trienios ni derechos pasivos."
      },
      {
        title: "Actividades privadas (Arts. 11 y 12)",
        description: "El personal no podrá ejercer actividades privadas que se relacionen directamente con las que desarrolle el departamento u organismo donde esté destinado. En todo caso, quedan prohibidas: las actividades privadas en asuntos en los que intervenga o haya intervenido en los dos últimos años por razón del puesto; la pertenencia a consejos de administración de empresas directamente relacionadas con su departamento; el desempeño de cargos en empresas concesionarias, contratistas o con participación del sector público; y la participación superior al 10% en el capital de dichas sociedades."
      },
      {
        title: "Reconocimiento de compatibilidad (Art. 14)",
        description: "El ejercicio de actividades profesionales, laborales, mercantiles o industriales fuera de las AAPP requiere el previo reconocimiento de compatibilidad, que se resuelve en el plazo de dos meses por el Ministerio de la Presidencia, el órgano competente de la Comunidad Autónoma o el Pleno de la Corporación Local. Los reconocimientos no modifican la jornada y quedan sin efecto si cambia el puesto."
      },
      {
        title: "Actividades exceptuadas (Art. 19)",
        description: "Quedan exceptuadas del régimen de incompatibilidades: la administración del patrimonio personal o familiar; la dirección de seminarios o cursos en centros oficiales de formación cuando no superen 75 horas al año; la participación en tribunales calificadores; la producción literaria, artística, científica y técnica; la participación ocasional en coloquios y medios de comunicación; y la colaboración ocasional en congresos y seminarios."
      }
    ],
    examples: [
      {
        situation: "Un técnico de telecomunicaciones de Adif quiere montar una empresa de instalación de redes de telecomunicación que contrata con Adif como contratista.",
        application: "Incompatible. El artículo 12.1 c) prohíbe el desempeño de cargos en empresas contratistas de obras, servicios o suministros de las AAPP, y el artículo 12.1 d) prohíbe la participación superior al 10% en su capital. La actividad se relaciona directamente con las funciones del puesto."
      },
      {
        situation: "Un empleado de Adif solicita autorización para dar clases particulares de idiomas por las tardes.",
        application: "La actividad docente privada no relacionada con su puesto no está prohibida en términos absolutos, pero el ejercicio de actividades profesionales fuera de las AAPP requiere el previo reconocimiento de compatibilidad conforme al artículo 14, siempre que no menoscabe la jornada ni comprometa la imparcialidad."
      },
      {
        situation: "Un empleado público es elegido concejal de su ayuntamiento con dedicación parcial.",
        application: "El artículo 5.1 b) permite compatibilizar el puesto con el cargo electivo de miembro de Corporación Local salvo que desempeñe cargo retribuido en régimen de dedicación exclusiva. En dedicación parcial, las retribuciones se limitan conforme al artículo 75.2 de la Ley 7/1985."
      }
    ],
    reviewTakeaways: [
      "Regla general: un solo puesto en el sector público y una sola remuneración con cargo a los presupuestos.",
      "La compatibilidad de actividades públicas requiere autorización expresa previa, en razón del interés público.",
      "Quedan prohibidas las actividades privadas relacionadas con el departamento y la participación superior al 10% en empresas contratistas o concesionarias.",
      "El ejercicio de actividades privadas fuera de las AAPP exige reconocimiento previo de compatibilidad."
    ]
  },
  "ingles-a2": {
    introduction: "La prueba de inglés para el ingreso en ADIF corresponde al nivel de competencia A2 del Marco Común Europeo de Referencia para las Lenguas (MCER). Evalúa estructuras gramaticales cotidianas, verbos modales, tiempos verbales básicos y comprensión de textos breves; la estrategia ganadora es identificar la pista temporal o modal antes de mirar las opciones.",
    concepts: [
      {
        title: "Pasado Simple (Past Simple)",
        description: "Tiempo verbal utilizado para narrar eventos completados en el pasado. Los verbos regulares se forman añadiendo '-ed' al infinitivo (work -> worked). Los verbos irregulares cambian su forma y deben memorizarse (go -> went, see -> saw, write -> wrote, buy -> bought). En oraciones negativas y preguntas se utiliza el auxiliar 'did', que obliga a volver al infinitivo."
      },
      {
        title: "Verbos Modales de Obligación, Prohibición y Necesidad",
        description: "'Must' indica obligación legal u orden directa. 'Must not' (mustn't) denota prohibición absoluta. 'Have to' expresa una necesidad u obligación externa (reglamento). 'Don't have to' indica ausencia de obligación, así que es el contraste que más preguntas resuelve."
      },
      {
        title: "Verbos Modales de Habilidad y Permiso",
        description: "'Can' expresa habilidad presente o permiso informal. 'Could' expresa habilidad pasada o una petición más cortés de asistencia al cliente. Cuando el enunciado suene a posibilidad, permiso o cortesía, este par suele ser el primero que debes revisar."
      },
      {
        title: "Glosario Técnico Ferroviario Esencial",
        description: "Platform (andén), Track (vía), Train driver (maquinista), Station master (jefe de estación), Timetable (horario), Delay (retraso), Level crossing (paso a nivel), Buffer (tope de vía), Points / Switches (agujas de desvío). Reconocer este vocabulario acelera mucho las preguntas de lectura."
      }
    ],
    examples: [
      {
        situation: "Se presenta la frase: 'The ticket inspector ___ (check) my ticket five minutes ago.' y se pide rellenar el hueco.",
        application: "La expresión temporal 'five minutes ago' nos indica que la acción es del pasado. Al ser 'check' un verbo regular, la forma correcta es el Past Simple: 'checked'."
      },
      {
        situation: "Se plantea la traducción de la frase: 'No debes caminar sobre las vías del tren. Está prohibido.'",
        application: "La traducción correcta es: 'You must not walk on the tracks. It is forbidden.' Se emplea 'must not' por ser una prohibición estricta de seguridad."
      },
      {
        situation: "Se plantea la opción múltiple: 'If you have a ticket, you ___ pay again. It is free.' con las opciones: A) must, B) don't have to, C) must not.",
        application: "La respuesta correcta es 'don't have to' (B) porque el billete ya está pagado y pagar de nuevo es innecesario u opcional, no una prohibición legal."
      }
    ],
    reviewTakeaways: [
      "El auxiliar 'did' de pasado simple anula la forma de pasado del verbo principal en preguntas y negativas.",
      "Must not indica prohibición; don't have to indica que algo es opcional o innecesario.",
      "El vocabulario técnico sobre estaciones, retrasos y billetes suele constituir el núcleo principal de los enunciados de ADIF.",
      "Antes de responder, detecta si el hueco pide tiempo verbal, modal o vocabulario; esa clasificación reduce mucho el error."
    ]
  }
};
