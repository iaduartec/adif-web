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

export const lessonTheories: Record<string, TheorySection> = {
  igualdad: {
    introduction: "El estudio de la igualdad y la no discriminación en España está cimentado en la Ley Orgánica 3/2007. Este bloque de legislación social es transversal y obligatorio en las oposiciones del sector público y de ADIF en 2026, buscando garantizar la igualdad real de trato y oportunidades en el acceso al empleo y la promoción profesional.",
    concepts: [
      {
        title: "Principio de Igualdad de Trato",
        description: "Supone la ausencia absoluta de cualquier discriminación, directa o indirecta, por razón de sexo, y, de forma especial, las derivadas de la maternidad, la asunción de obligaciones familiares y el estado civil."
      },
      {
        title: "Discriminación Directa por Sexo",
        description: "Situación en que se encuentra una persona que sea, haya sido o pudiera ser tratada de manera menos favorable que otra en situación comparable por razón de su sexo."
      },
      {
        title: "Discriminación Indirecta por Sexo",
        description: "Situación en la que una disposición, criterio o práctica aparentemente neutros pone a personas de un sexo en desventaja particular frente a las de otro, salvo que pueda justificarse objetivamente con una finalidad legítima y los medios sean necesarios y adecuados."
      },
      {
        title: "Acciones Positivas",
        description: "Medidas específicas y temporales adoptadas por los Poderes Públicos en favor de las mujeres para corregir situaciones de desigualdad de partida de carácter social, económico o de acceso al empleo."
      }
    ],
    examples: [
      {
        situation: "Una oferta de empleo de la empresa exige una altura mínima idéntica de 1.75 metros tanto para hombres como para mujeres sin una justificación de seguridad real.",
        application: "Es una discriminación indirecta. Aunque el criterio es idéntico, perjudica de forma desproporcionada a la población femenina porque estadísticamente menos mujeres alcanzan esa estatura."
      },
      {
        situation: "Se decide rescindir el contrato de una trabajadora en período de prueba al enterarse de su embarazo.",
        application: "Es una discriminación directa por razón de sexo. La protección a la maternidad es absoluta y no admite justificación comercial ni organizativa."
      }
    ],
    reviewTakeaways: [
      "La discriminación directa NO admite justificación objetiva; la indirecta sí puede justificarse si persigue un fin legítimo con medios necesarios.",
      "Las acciones positivas son constitucionales y de carácter temporal para corregir la desigualdad histórica de partida.",
      "Toda orden de discriminar directa o indirectamente se considera un acto de discriminación en sí mismo."
    ]
  },
  "prevencion-riesgos-laborales": {
    introduction: "La Ley 31/1995 de Prevención de Riesgos Laborales (LPRL) determina el marco de seguridad y salud en los centros de trabajo. En el entorno ferroviario de ADIF, con presencia de riesgos eléctricos, mecánicos y de circulación, comprender y aplicar esta ley es crucial para el personal de operaciones y telecomunicaciones.",
    concepts: [
      {
        title: "Deber de Protección Eficaz",
        description: "El empresario tiene el deber de garantizar la seguridad y salud de los trabajadores en todos los aspectos relacionados con el trabajo mediante la integración de la prevención."
      },
      {
        title: "Principios de la Acción Preventiva",
        description: "Reglas jerárquicas que debe seguir el diseño preventivo: 1. Evitar riesgos; 2. Evaluar inevitables; 3. Combatir en origen; 4. Adaptar el trabajo; 5. Seguir técnica; 6. Sustituir lo peligroso; 7. Planificar; 8. Anteponer protección colectiva a individual; 9. Instruir."
      },
      {
        title: "Obligaciones del Trabajador",
        description: "El trabajador debe velar por su propia seguridad y la de terceros afectados por sus actos u omisiones, utilizando correctamente máquinas, EPIs y dispositivos de seguridad."
      }
    ],
    examples: [
      {
        situation: "Un operario trabaja en una zona con ruido continuo elevado y la empresa decide comprar protectores auditivos de espuma en lugar de instalar pantallas insonorizadoras sobre la máquina emisora.",
        application: "Incumplimiento de la prioridad de protección colectiva. La insonorización de la máquina (colectiva) debe implantarse con prioridad sobre el reparto de tapones (individual)."
      },
      {
        situation: "Un técnico de mantenimiento desconecta voluntariamente un sensor de enclavamiento de seguridad de una cabina de comunicación para acelerar el mantenimiento rutinario.",
        application: "Incumplimiento grave de las obligaciones del trabajador (Artículo 29), pudiendo incurrir en sanción disciplinaria por poner en riesgo su integridad y la del sistema."
      }
    ],
    reviewTakeaways: [
      "La primera prioridad preventiva es evitar el riesgo; si no se puede evitar, el siguiente paso obligatorio es su evaluación.",
      "Las medidas de protección colectiva siempre se anteponen a los equipos de protección individual (EPI).",
      "La prevención no es un departamento aislado; debe estar integrada en la estructura jerárquica y en todos los procesos de la empresa."
    ]
  },
  "estatuto-adif": {
    introduction: "El Real Decreto 2395/2004 aprueba el Estatuto de ADIF, configurándolo como una Entidad Pública Empresarial de las previstas en la legislación estatal. Regula su organización, funcionamiento, atribuciones y el régimen especial de su patrimonio e infraestructuras.",
    concepts: [
      {
        title: "Naturaleza y Adscripción",
        description: "ADIF es una entidad pública empresarial con personalidad jurídica propia, patrimonio propio y autonomía de gestión, adscrita al Ministerio de Fomento (actualmente Ministerio de Transportes)."
      },
      {
        title: "Funciones y Competencias",
        description: "Administración de las infraestructuras ferroviarias, control y regulación del tráfico ferroviario, gestión de los sistemas de seguridad, mantenimiento y asignación de capacidad (surcos) a operadores."
      },
      {
        title: "Órganos de Gobierno",
        description: "Se estructuran en el Consejo de Administración (máximo órgano colegiado, con Presidente y entre 9 y 10 vocales) y el Presidente de la entidad."
      }
    ],
    examples: [
      {
        situation: "Se debate si ADIF puede vender un solar colindante a las vías del tren de manera directa a un promotor inmobiliario sin aprobación administrativa.",
        application: "La venta de bienes de ADIF está sujeta a su estatuto y a la Ley del Sector Ferroviario; los bienes afectados al servicio ferroviario público no pueden ser enajenados sin un proceso previo de desafectación."
      },
      {
        situation: "Se plantea si el personal laboral de ADIF se rige por el Estatuto Básico del Empleado Público o por el Estatuto de los Trabajadores.",
        application: "El personal de ADIF se rige con carácter general por el derecho laboral (Estatuto de los Trabajadores y Convenio Colectivo propio), salvaguardando las funciones que impliquen el ejercicio de potestades públicas."
      }
    ],
    reviewTakeaways: [
      "ADIF es una entidad pública empresarial, lo que implica que combina fines públicos de infraestructura con una gestión mercantil privada.",
      "El Presidente ostenta la representación legal y la dirección inmediata de los servicios de la entidad.",
      "El Consejo de Administración aprueba el presupuesto de explotación, las cuentas anuales y los grandes planes de inversión."
    ]
  },
  "ict-rd-346-2011": {
    introduction: "El Real Decreto 346/2011 regula las Infraestructuras Comunes de Telecomunicaciones (ICT). Define los parámetros técnicos y de diseño que deben cumplir las edificaciones de viviendas y oficinas para facilitar la recepción y distribución de señales de telecomunicación.",
    concepts: [
      {
        title: "Infraestructura Común de Telecomunicaciones",
        description: "Conjunto de instalaciones en el interior de edificios que permite la captación, adaptación y distribución de señales de radio, TV, telefonía disponible al público y servicios de banda ancha."
      },
      {
        title: "Estructura y Redes de la ICT",
        description: "Consta de: 1. Red de alimentación (operadores); 2. Red de distribución (vertical); 3. Red de dispersión (acceso a viviendas); 4. Red interior de usuario (dentro de cada PAU)."
      },
      {
        title: "Recintos Técnicos (RIT)",
        description: "RITI (Recinto Inferior): aloja equipamiento de telefonía y redes de cable/fibra. RITS (Recinto Superior): aloja equipos de captación de señales de radio y televisión terrenal y satélite."
      }
    ],
    examples: [
      {
        situation: "Un vecino instala una antena parabólica particular en su balcón porque afirma que la ICT comunitaria no tiene señal de su satélite preferido.",
        application: "La normativa obliga a intentar canalizar los nuevos servicios por la ICT común (RITS). Solo si la comunidad rechaza adaptarla en un plazo legal, el usuario adquiere el derecho de instalación individual."
      },
      {
        situation: "Durante la inspección de una ICT, se comprueba que el Punto de Acceso al Usuario (PAU) no separa físicamente la red de dispersión de la red interior.",
        application: "Es un fallo de diseño. El PAU es el límite de la infraestructura común y debe contar con un elemento de corte y prueba para delimitar responsabilidades en averías."
      }
    ],
    reviewTakeaways: [
      "El PAU (Punto de Acceso al Usuario) marca la frontera de responsabilidad de la comunidad frente al usuario final.",
      "Los recintos RITI y RITS deben contar con climatización forzada, protección contra incendios y conexión obligatoria a la toma de tierra del edificio.",
      "Toda ICT requiere de un Proyecto Técnico firmado por un ingeniero de telecomunicaciones competente."
    ]
  },
  "compatibilidad-electromagnetica": {
    introduction: "El Real Decreto 186/2016 regula la compatibilidad electromagnética (CEM/EMC). Su objetivo es garantizar que los aparatos eléctricos y electrónicos no perturben el funcionamiento de las telecomunicaciones ni se vean afectados de forma crítica por el entorno.",
    concepts: [
      {
        title: "Compatibilidad Electromagnética",
        description: "Aptitud de un equipo para funcionar satisfactoriamente en su entorno electromagnético sin introducir perturbaciones electromagnéticas intolerables a otros equipos."
      },
      {
        title: "Emisión, Inmunidad y Susceptibilidad",
        description: "Emisión es la perturbación que genera un equipo. Inmunidad es la tolerancia del equipo para operar correctamente en entornos con perturbaciones. Susceptibilidad es la falta de inmunidad."
      },
      {
        title: "Mecanismos de Acoplamiento",
        description: "Vías por las que viaja la interferencia: Acoplamiento conducido (cables de alimentación, bucles de tierra) y Acoplamiento radiado (ondas a través del aire)."
      }
    ],
    examples: [
      {
        situation: "Al arrancar un transformador eléctrico de potencia en la subestación, los terminales de voz digital del centro de control ferroviario pierden sincronismo temporalmente.",
        application: "Es una interferencia por acoplamiento conducido o radiado transitorio. Se mitiga mediante filtros en la línea de datos y apantallamiento metálico en los cables de comunicación."
      },
      {
        situation: "Se instalan cables de fibra óptica junto a cables de fuerza eléctrica de alta tensión en la misma bandeja de canalización de ADIF.",
        application: "Es correcto y seguro. Dado que la fibra óptica transmite luz y no corriente eléctrica, posee una inmunidad intrínseca absoluta frente a interferencias electromagnéticas."
      }
    ],
    reviewTakeaways: [
      "La fibra óptica es inmune por naturaleza a la radiación e inducción electromagnética.",
      "La segregación de canalizaciones (mantener distancia física entre datos y potencia) es una de las medidas preventivas más baratas y eficaces.",
      "Una conexión equipotencial a tierra con baja impedancia es fundamental para derivar corrientes inducidas y ruidos de alta frecuencia."
    ]
  },
  "rcf-libro-1": {
    introduction: "El Reglamento de Circulación Ferroviaria (RCF), aprobado por Real Decreto 921/2015, es la norma suprema que rige la seguridad ferroviaria en España. El Libro Primero contiene las definiciones fundamentales y los principios rectores que debe cumplir todo agente en la explotación ferroviaria.",
    concepts: [
      {
        title: "Principio de Prudencia",
        description: "En caso de duda, malentendido, falta de regulación específica o anomalías, el personal ferroviario debe optar por la alternativa más segura y restrictiva para el tráfico, primando la seguridad sobre la puntualidad."
      },
      {
        title: "Personal de Circulación",
        description: "Integrado por aquellos agentes cuyas decisiones o funciones afectan directamente a la seguridad de la circulación (maquinistas, auxiliares de circulación, operadores de cabina, etc.)."
      },
      {
        title: "Documentación de A bordo",
        description: "Conjunto de manuales técnicos, libros de itinerario oficiales y órdenes escritas que todo maquinista y personal de operaciones debe portar y consultar obligatoriamente."
      }
    ],
    examples: [
      {
        situation: "Una señal de entrada a la estación muestra una luz parpadeante y difusa que el maquinista no logra descifrar con total claridad.",
        application: "Aplicando el principio de prudencia, el maquinista debe asumir la indicación más restrictiva (considerarla señal de parada o de rebase restrictivo) y detener la marcha."
      },
      {
        situation: "Un agente observa que una aguja de desvío de la vía no está completamente encajada pero el tren de pasajeros se aproxima a la estación.",
        application: "El agente debe interponer inmediatamente una señal de parada de emergencia para frenar el convoy antes de que transite por la aguja defectuosa."
      }
    ],
    reviewTakeaways: [
      "La seguridad de la vida humana y de la infraestructura prevalece incondicionalmente sobre cualquier retraso del servicio.",
      "Cualquier orden que contradiga el Reglamento de Circulación es nula y no debe ser ejecutada por poner en riesgo la explotación.",
      "El conocimiento actualizado del RCF es un deber inexcusable para todo el personal operativo de ADIF."
    ]
  },
  psicometria: {
    introduction: "La psicometría y las pruebas de aptitud evalúan las habilidades cognitivas del aspirante para puestos de personal de entrada de ADIF. Estas pruebas miden la velocidad de procesamiento, la exactitud visual y el razonamiento analítico bajo condiciones severas de fatiga y presión de tiempo.",
    concepts: [
      {
        title: "Atención y Resistencia a la Fatiga",
        description: "Evalúa la concentración visual sostenida. Tareas típicas incluyen buscar caracteres específicos en tablas complejas o comparar parejas de códigos alfanuméricos determinando si son idénticos."
      },
      {
        title: "Razonamiento Lógico y Espacial",
        description: "Habilidad para orientarse y razonar con formas geométricas. Se mide mediante rotación de figuras en 3D, secuencias de matrices y desdoblamientos de cubos planos."
      },
      {
        title: "Aptitud Numérica",
        description: "Capacidad de cálculo matemático básico, agilidad mental con fracciones, porcentajes, reglas de tres y resolución ágil de ecuaciones lineales aplicadas."
      }
    ],
    examples: [
      {
        situation: "Se le presenta un ejercicio de psicotecnia con una lista de 50 parejas de códigos tipo 'XF-789-A' frente a 'XF-789-B' para responder rápido en 2 minutos.",
        application: "Se debe escanear de derecha a izquierda o fijarse en los caracteres cambiantes. El entrenamiento diario automatiza el barrido visual y minimiza la tasa de fallos."
      },
      {
        situation: "En una serie de figuras, una flecha gira 45 grados en sentido horario en cada paso, mientras una estrella se duplica.",
        application: "Separar mentalmente ambos elementos dinámicos ayuda a resolver la secuencia de forma independiente y rápida sin saturar la memoria de trabajo."
      }
    ],
    reviewTakeaways: [
      "La puntuación final penaliza los errores en la mayoría de test psicotécnicos: es mejor dejar en blanco si hay dudas absolutas.",
      "El control del tiempo es clave: no te quedes atascado en una pregunta compleja, sáltala y vuelve al final.",
      "La regularidad de la práctica diaria es el factor determinante para automatizar la resolución de patrones."
    ]
  },
  "ingles-a2": {
    introduction: "La prueba de inglés para el nivel A2 del Marco Común Europeo de Referencia para las Lenguas (MCER) evalúa el conocimiento de estructuras gramaticales básicas, tiempos del pasado regular e irregular, uso de verbos modales y vocabulario del ámbito técnico y del transporte ferroviario.",
    concepts: [
      {
        title: "Tiempos Verbales del Pasado",
        description: "Past Simple: uso de terminación '-ed' para verbos regulares y memorización de la lista de verbos irregulares comunes (go -> went, see -> saw, buy -> bought) en oraciones afirmativas, negativas y preguntas."
      },
      {
        title: "Modales Esenciales",
        description: "'Must' indica obligación legal o interna estricta. 'Must not' indica prohibición absoluta. 'Have to' expresa una necesidad u obligación externa. 'Can/Could' expresa habilidad o peticiones."
      },
      {
        title: "Vocabulario Técnico Ferroviario",
        description: "Dominio de sustantivos comunes como: platform (andén), track (vía), departure (salida), delay (retraso), timetable (horario) y staff (personal)."
      }
    ],
    examples: [
      {
        situation: "Se te pide rellenar el espacio vacío: 'You ___ smoke inside the train. It is illegal.'",
        application: "La respuesta correcta es 'must not'. Dado que es una prohibición legal estricta y absoluta, no se debe usar 'don't have to' (que significa falta de necesidad)."
      },
      {
        situation: "Se pide traducir la frase: 'El tren llegó al andén número tres hace diez minutos.'",
        application: "La traducción correcta es: 'The train arrived at platform number three ten minutes ago.' (Arrived en pasado simple y Platform para andén)."
      }
    ],
    reviewTakeaways: [
      "El pasado de los verbos regulares duplica la consonante final en palabras cortas (por ejemplo: stop -> stopped).",
      "'Must not' expresa prohibición, mientras que 'don't have to' expresa que algo es opcional o innecesario.",
      "El contexto de la pregunta en la oposición de ADIF suele estar orientado al entorno técnico o laboral."
    ]
  }
};
