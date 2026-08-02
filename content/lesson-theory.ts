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
    introduction: "El estudio de la igualdad y la no discriminación en España está cimentado en la Ley Orgánica 3/2007, de 22 de marzo. Este bloque legislativo de carácter social y transversal es obligatorio y prioritario en todas las oposiciones públicas y de ADIF para el año 2026. Su objetivo principal es asegurar la igualdad real y efectiva entre mujeres y hombres en todos los ámbitos, corrigiendo las desigualdades históricas y estructurales de partida, especialmente en el acceso al empleo público, la formación, la promoción profesional y las condiciones de trabajo en las empresas públicas.",
    concepts: [
      {
        title: "Principio de Igualdad de Trato y de Oportunidades",
        description: "Representa la ausencia de cualquier tipo de discriminación, ya sea directa o indirecta, por razón de sexo. La ley hace especial hincapié en proteger las situaciones derivadas de la maternidad, el embarazo, el estado civil y la asunción de obligaciones familiares de conciliación."
      },
      {
        title: "Discriminación Directa por Sexo (Art. 6.1)",
        description: "Se define como aquella situación jurídica o fáctica en la que se encuentra una persona que sea, haya sido o pudiera ser tratada de manera menos favorable que otra en una situación comparable debido exclusivamente a su sexo. Este tipo de discriminación es de carácter absoluto y no admite justificación objetiva por parte del empleador."
      },
      {
        title: "Discriminación Indirecta por Sexo (Art. 6.2)",
        description: "Ocurre cuando una disposición legal, un criterio de selección o una práctica aparentemente neutros o comunes sitúan a las personas de un sexo determinado en una situación de desventaja particular respecto a las del otro sexo. Solo se considerará lícita si dicha disposición, criterio o práctica pueden justificarse objetivamente con una finalidad legítima y los medios para alcanzarla son necesarios y adecuados."
      },
      {
        title: "Acoso Sexual y Acoso por Razón de Sexo (Art. 7)",
        description: "El acoso sexual es cualquier comportamiento, verbal o físico, de naturaleza sexual con el propósito o el efecto de atentar contra la dignidad de una persona, creando un entorno intimidatorio, degradante u ofensivo. El acoso por razón de sexo es cualquier comportamiento realizado en función del sexo de una persona con idéntico propósito o efecto. Ambos supuestos se consideran discriminatorios y están prohibidos en el ámbito laboral de ADIF."
      },
      {
        title: "Acciones Positivas (Art. 11)",
        description: "Son medidas específicas, de carácter temporal, adoptadas por los Poderes Públicos y las empresas para favorecer al sexo subrepresentado (históricamente las mujeres). Su finalidad es corregir situaciones patentes de desigualdad de partida en el ámbito social, económico, educativo y laboral. Serán vigentes solo mientras persista la situación de desigualdad que las motivó."
      },
      {
        title: "Planes de Igualdad en las Empresas (Art. 45 y 46)",
        description: "Conjunto ordenado de medidas adoptadas en una organización después de realizar un diagnóstico de situación, tendentes a alcanzar la igualdad de trato y de oportunidades. Es obligatorio en empresas con 50 o más trabajadores. Debe contemplar el acceso al empleo, clasificación profesional, formación, promoción, auditoría retributiva, conciliación y prevención del acoso."
      },
      {
        title: "Principio de Presencia Equilibrada",
        description: "Criterio rector que persigue que en los órganos colegiados, comités de selección y consejos de administración, ningún sexo supere el 60% ni sea inferior al 40% del total de los miembros, promoviendo una representación paritaria."
      }
    ],
    examples: [
      {
        situation: "En una convocatoria de empleo para la categoría de Oficial de Telecomunicaciones de ADIF, se establece una prueba física con una marca de tiempo idéntica para hombres y mujeres, alegando que el trabajo requiere velocidad física común.",
        application: "Es un caso de discriminación indirecta. Aunque el baremo es aparentemente neutro e idéntico, perjudica de forma desproporcionada a la población femenina debido a diferencias biomédicas medias. La empresa debe establecer baremos diferenciados corregidos por sexo para garantizar la equidad, salvo que se demuestre una necesidad técnica crítica insalvable."
      },
      {
        situation: "Una empresa contratista de ADIF decide no renovar el contrato temporal de una ingeniera de sistemas tras recibir la notificación de que ha iniciado un tratamiento de reproducción asistida.",
        application: "Constituye discriminación directa por razón de sexo. Toda discriminación vinculada al embarazo, la maternidad o procesos de gestación está protegida de forma absoluta por el Artículo 8 de la Ley Orgánica 3/2007. El despido o la no renovación en estas circunstancias es nulo de pleno derecho."
      },
      {
        situation: "Un sindicato denuncia que el comité de valoración de una oposición de ADIF está constituido por 5 vocales masculinos y 1 vocal femenina.",
        application: "Incumple el principio de presencia equilibrada fijado en la Ley 3/2007. La composición paritaria exige que la proporción de cada sexo se sitúe entre el 40% y el 60%. La composición correcta mínima para 6 miembros sería de al menos 2 personas de un sexo y 4 del otro."
      }
    ],
    reviewTakeaways: [
      "La discriminación directa no admite justificación objetiva; la indirecta sí, siempre que sea razonable, proporcional y persiga un fin legítimo.",
      "Cualquier orden o instrucción de discriminar por razón de sexo se considera, por ley, un acto de discriminación efectiva.",
      "El despido de trabajadoras embarazadas o que soliciten la conciliación familiar es nulo, salvo que se demuestren causas justificadas totalmente ajenas a su situación familiar.",
      "Los Planes de Igualdad deben ser negociados con la representación legal de los trabajadores y registrarse en el registro oficial correspondiente."
    ]
  },
  "prevencion-riesgos-laborales": {
    introduction: "La Ley 31/1995, de 8 de noviembre, de Prevención de Riesgos Laborales (LPRL), desarrolla el mandato constitucional de proteger la salud y la seguridad de los trabajadores. En el ámbito de ADIF, debido a la exposición a riesgos de alta peligrosidad (alta tensión eléctrica en catenarias, trabajos en vía con circulación de trenes, manejo de maquinaria pesada de infraestructura y trabajos en recintos confinados), la aplicación estricta de la LPRL es de obligado cumplimiento para todo el personal operativo de telecomunicaciones.",
    concepts: [
      {
        title: "Deber de Protección del Empresario (Art. 14)",
        description: "El empresario tiene el deber de garantizar la seguridad y la salud de los trabajadores a su servicio en todos los aspectos relacionados con el trabajo. Este deber incluye la prevención de riesgos, la información, la formación, la actuación en emergencias y la vigilancia de la salud."
      },
      {
        title: "Principios de la Acción Preventiva (Art. 15)",
        description: "Orden de prioridad técnica obligatorio para diseñar e implantar medidas preventivas en la empresa. Se resume en: 1. Evitar los riesgos; 2. Evaluar los riesgos inevitables; 3. Combatir los riesgos en su origen; 4. Adaptar el trabajo a la persona; 5. Tener en cuenta la evolución técnica; 6. Sustituir lo peligroso; 7. Planificar la prevención global; 8. Anteponer la protección colectiva a la individual; 9. Dar las debidas instrucciones a los trabajadores."
      },
      {
        title: "Evaluación de Riesgos y Planificación Preventiva (Art. 16)",
        description: "La evaluación es el instrumento básico para identificar los peligros de cada puesto de trabajo y estimar su gravedad. La planificación es el documento que recoge las medidas correctoras, su presupuesto, los responsables y los plazos de ejecución."
      },
      {
        title: "Equipos de Protección Individual (EPI)",
        description: "Cualquier equipo destinado a ser llevado o sujetado por el trabajador para que le proteja de uno o varios riesgos. Los EPIs se consideran medidas de último recurso y solo se emplean cuando los riesgos no se han podido evitar o limitar suficientemente por medios de protección colectiva o reformas organizativas."
      },
      {
        title: "Derecho de Paralización de la Actividad (Art. 21)",
        description: "Cuando el trabajador se encuentre ante una situación de riesgo grave e inminente (aquel que resulta probable racionalmente que se materialice en un futuro inmediato y pueda suponer un daño grave para la salud), tiene derecho a interrumpir su actividad y, si fuera necesario, abandonar de inmediato el lugar de trabajo."
      },
      {
        title: "Delegados de Prevención y Comité de Seguridad y Salud (Art. 35 y 38)",
        description: "Los Delegados de Prevención son los representantes de los trabajadores con funciones específicas en materia de prevención. El Comité de Seguridad y Salud es el órgano paritario y colegiado de consulta y participación en empresas de 50 o más trabajadores."
      }
    ],
    examples: [
      {
        situation: "Un equipo de mantenimiento de telecomunicaciones debe sustituir una tarjeta de red en una antena situada a 15 metros de altura. Se les facilita un arnés anticaídas de seguridad individual, pero el andamio perimetral de acceso carece de barandillas de protección.",
        application: "Es una violación de los principios preventivos. La barandilla del andamio es una medida de protección colectiva, la cual debe estar instalada con prioridad obligatoria antes de recurrir al arnés de seguridad anticaídas individual (EPI)."
      },
      {
        situation: "Un operario en vía observa que una tormenta eléctrica severa está provocando descargas de rayos cerca de la catenaria de alimentación donde realiza labores de cableado de fibra. El supervisor le ordena seguir trabajando para evitar retrasar el tren nocturno.",
        application: "El trabajador y sus representantes legales tienen el derecho legal amparado por el Artículo 21 de paralizar la actividad. Un riesgo por rayo en zona metálica de catenaria es un riesgo grave e inminente para la vida, lo que anula cualquier orden directa del supervisor."
      },
      {
        situation: "La empresa decide realizar una evaluación de riesgos anual basándose únicamente en los cuestionarios rellenos por los directivos de oficina, ignorando los puestos de los técnicos de campo en las subestaciones.",
        application: "Es ilegal. La evaluación de riesgos debe ser específica para cada puesto de trabajo (Art. 16) y debe realizarse con la consulta activa y participación de los Delegados de Prevención, reflejando las condiciones reales de trabajo de campo."
      }
    ],
    reviewTakeaways: [
      "La protección colectiva (redes, barandillas, extractores) siempre se antepone a la protección individual (cascos, tapones, arneses).",
      "El coste de las medidas de seguridad y salud en el trabajo nunca puede recaer sobre los hombros de los trabajadores.",
      "El trabajador está obligado a usar correctamente los equipos y dispositivos de seguridad; el uso inadecuado u omisión constituye una falta laboral grave."
    ]
  },
  "estatuto-adif": {
    introduction: "El Real Decreto 2395/2004 aprueba el Estatuto de la Entidad Pública Empresarial Administrador de Infraestructuras Ferroviarias (ADIF). Define su marco legal de actuación, sus competencias como gestor de la infraestructura pública, sus órganos de administración y dirección, y el régimen de su patrimonio y financiación pública. Este estatuto es clave para entender las responsabilidades del personal de ADIF y los límites normativos que rigen su funcionamiento diario.",
    concepts: [
      {
        title: "Naturaleza Jurídica y Régimen de ADIF",
        description: "ADIF se constituye como una Entidad Pública Empresarial (EPE) de las previstas en la legislación del Estado, con personalidad jurídica propia, patrimonio propio y autonomía de gestión. Está adscrita al Ministerio de Transportes y Movilidad Sostenible."
      },
      {
        title: "Objeto Principal y Competencias",
        description: "La administración de las infraestructuras ferroviarias integrantes de la Red Ferroviaria de Interés General (RFIG), la gestión del tráfico y los sistemas de seguridad de la circulación, la conservación y mantenimiento de la infraestructura, y la adjudicación de surcos (capacidad) a los operadores ferroviarios de forma objetiva y no discriminatoria."
      },
      {
        title: "El Consejo de Administración",
        description: "Es el órgano supremo de gobierno colegiado de la entidad. Está integrado por el Presidente de ADIF y un número de vocales que oscila entre un mínimo de 9 y un máximo de 10, nombrados por el Ministerio de adscripción. Se encarga de definir las directrices de explotación de la red pública y aprobar presupuestos."
      },
      {
        title: "El Presidente de ADIF",
        description: "Es nombrado por el Consejo de Ministros a propuesta del Ministro de Transportes. Ostenta la representación legal y ordinaria de la entidad, dirige el funcionamiento de todos sus órganos y servicios, y convoca y preside el Consejo de Administración."
      },
      {
        title: "Régimen Patrimonial y Financiero",
        description: "ADIF cuenta con patrimonio propio y bienes adscritos por el Estado (que permanecen de dominio público). Sus ingresos provienen del cobro de cánones a los operadores ferroviarios por el uso de la infraestructura y estaciones, de las transferencias de los Presupuestos Generales del Estado y de la explotación de sus propios activos."
      },
      {
        title: "Régimen del Personal",
        description: "El personal de ADIF se rige por el Derecho Laboral común (Estatuto de los Trabajadores, convenios colectivos y legislación laboral), salvo en lo referente a puestos que impliquen el ejercicio directo de potestades públicas administrativas, que se reservan a estatutos específicos."
      }
    ],
    examples: [
      {
        situation: "Un operador ferroviario privado solicita permiso para utilizar la vía principal de ADIF en un horario determinado y el departamento técnico de ADIF le deniega la solicitud de manera verbal para favorecer al operador público nacional.",
        application: "Es una infracción del Estatuto de ADIF y de la Ley del Sector Ferroviario. La adjudicación de capacidad e infraestructura debe realizarse bajo principios de objetividad, transparencia y no discriminación. Cualquier denegación debe ser motivada formalmente por escrito y basarse en criterios técnicos de capacidad real."
      },
      {
        situation: "Se debate si ADIF puede hipotecar una estación de tren de su red de interés general para solicitar un crédito de financiación comercial a un banco privado.",
        application: "No es posible. Los bienes de dominio público ferroviario que tiene adscritos ADIF son inalienables, inembargables e imprescriptibles. Su régimen patrimonial impide utilizarlos como garantía real o hipoteca, requiriendo autorización previa del Consejo de Ministros para cualquier desafectación."
      }
    ],
    reviewTakeaways: [
      "ADIF es una EPE adscrita al Ministerio de Transportes y Movilidad Sostenible.",
      "El Consejo de Administración aprueba los presupuestos anuales y las propuestas de tarifas y cánones ferroviarios.",
      "La gestión de la capacidad y seguridad del tráfico ferroviario son funciones públicas exclusivas de ADIF que no pueden ser subcontratadas ni delegadas a operadores privados."
    ]
  },
  "ict-rd-346-2011": {
    introduction: "El Real Decreto 346/2011 aprueba el Reglamento regulador de las Infraestructuras Comunes de Telecomunicaciones (ICT). Es el reglamento técnico que define las normas obligatorias de diseño, instalación, canalización y equipamiento para el acceso a los servicios de telecomunicación en el interior de edificaciones bajo el régimen de propiedad horizontal en España. Su estudio es fundamental para el personal técnico de telecomunicaciones de ADIF por su conexión directa con las normas técnicas de tendidos de telecomunicaciones y el reglamento de radiocomunicaciones.",
    concepts: [
      {
        title: "Infraestructura Común de Telecomunicaciones (ICT)",
        description: "La infraestructura instalada en el interior de los edificios que facilita la captación, adaptación y distribución ordenada y segura de servicios de radio, televisión terrenal y satélite, y los servicios de telefonía y banda ancha (fibra óptica, par de cobre y coaxial)."
      },
      {
        title: "Red de Alimentación de la ICT",
        description: "Parte de la red propiedad de los operadores de telecomunicaciones que conecta sus centrales de servicio con el Punto de Interconexión del edificio, situado en el interior del recinto técnico."
      },
      {
        title: "Red de Distribución",
        description: "Tramo que discurre en sentido vertical por el interior del edificio (a través de los patinillos y registros secundarios) llevando las señales de telecomunicación desde los repartidores principales hasta los derivadores de planta."
      },
      {
        title: "Red de Dispersión",
        description: "Es el tramo de la red que conecta la red de distribución en el registro secundario de cada planta con el Punto de Acceso al Usuario (PAU) de cada una de las viviendas u oficinas."
      },
      {
        title: "Red Interior de Usuario",
        description: "Tramo de la red que discurre por el interior de cada vivienda u oficina, conectando el Punto de Acceso al Usuario (PAU) con las bases de acceso a terminales (BAT) o tomas de usuario distribuidas por las estancias."
      },
      {
        title: "Recinto de Instalaciones de Telecomunicaciones Inferior (RITI)",
        description: "Local o recinto técnico situado en la planta baja o sótano del edificio destinado a albergar los repartidores principales de los operadores de telefonía, cable y fibra óptica. Debe estar protegido frente a humedades y contar con toma de tierra."
      },
      {
        title: "Recinto de Instalaciones de Telecomunicaciones Superior (RITS)",
        description: "Local o recinto técnico situado en la planta alta, ático o azotea del edificio, destinado a alojar los equipos de adaptación y amplificación de las señales de radiodifusión sonora y televisión recibidas mediante las antenas exteriores."
      },
      {
        title: "Punto de Acceso al Usuario (PAU)",
        description: "Dispositivo de interconexión que delimita la infraestructura común del edificio de la instalación privada de cada vivienda. Permite al usuario o técnico realizar pruebas de aislamiento y comprobar la calidad de señal que entra en el domicilio."
      }
    ],
    examples: [
      {
        situation: "Un técnico instalador despliega una acometida de fibra óptica desde el armario RITI exterior de la calle, pasando el cable directamente a través de la fachada y la ventana de un vecino sin pasar por la canalización del edificio.",
        application: "Es una infracción directa de las especificaciones de diseño del RD 346/2011. Toda instalación debe canalizarse internamente a través de los registros y conductos previstos de la ICT para garantizar la estética, seguridad frente a incendios y la integridad de las líneas de telecomunicación."
      },
      {
        situation: "Una comunidad de vecinos denuncia pérdidas continuas en la señal de TV digital tras instalarse un repartidor no homologado en la red de distribución del edificio.",
        application: "El reglamento de ICT obliga a que todos los componentes activos y pasivos utilizados en la red de distribución cuenten con la homologación CE y mantengan un blindaje mínimo de inmunidad de clase A para evitar fugas de señal e interferencias electromagnéticas."
      }
    ],
    reviewTakeaways: [
      "El PAU sirve de punto de corte y prueba para deslindar responsabilidades de mantenimiento entre la comunidad de vecinos y el propietario individual.",
      "El RITI y RITS son obligatorios en edificios de nueva construcción, debiendo poseer dimensiones mínimas normalizadas y extractores de ventilación automáticos.",
      "La canalización principal discurre por zonas comunes del edificio y nunca puede atravesar viviendas de propiedad privada."
    ]
  },
  "compatibilidad-electromagnetica": {
    introduction: "La compatibilidad electromagnética (CEM o EMC, por sus siglas en inglés) es la capacidad de cualquier equipo, sistema o instalación eléctrica para funcionar de manera satisfactoria en su entorno electromagnético sin introducir perturbaciones electromagnéticas que resulten intolerables para otros equipos presentes en dicho entorno. En ADIF, donde conviven trenes de tracción eléctrica con corrientes de miles de amperios, subestaciones eléctricas de alta tensión, y delicados equipos de telecomunicación por fibra, radio y señalización ferroviaria, la CEM es una disciplina técnica indispensable para evitar fallos de seguridad críticos.",
    concepts: [
      {
        title: "Perturbación Electromagnética",
        description: "Cualquier fenómeno electromagnético (ruido de fondo, señal no deseada, transitorio de tensión, descarga electrostática) que sea capaz de degradar el rendimiento o provocar el fallo de funcionamiento de un equipo o circuito electrónico."
      },
      {
        title: "Emisiones Electromagnéticas",
        description: "La cantidad de energía electromagnética indeseada generada y liberada por un aparato al exterior. Puede transmitirse de forma conducida (a través de cables de red o señal) o de forma radiada (propagándose como ondas electromagnéticas a través del aire)."
      },
      {
        title: "Inmunidad y Susceptibilidad Electromagnética",
        description: "La inmunidad es la aptitud de un equipo para funcionar sin degradarse en presencia de perturbaciones externas. La susceptibilidad es la incapacidad del equipo para resistir estas perturbaciones (a menor inmunidad, mayor susceptibilidad)."
      },
      {
        title: "Acoplamiento Conducido",
        description: "La perturbación viaja directamente a través de conductores metálicos compartidos (cables de alimentación, bucles de masa o cables de señal comunes). Se combate mediante el uso de filtros pasivos e inductores de choque."
      },
      {
        title: "Acoplamiento Radiado",
        description: "La perturbación se propaga por el espacio en forma de ondas electromagnéticas cruzando del elemento emisor al receptor. Se controla mediante blindajes metálicos (jaulas de Faraday) y materiales absorbentes de RF."
      },
      {
        title: "Técnicas de Blindaje e Impedancia",
        description: "El uso de carcasas conductoras continuas para aislar los circuitos delicados del ruido exterior. Para ser efectivo, el blindaje debe estar conectado a una tierra física de muy baja inductancia y baja impedancia."
      },
      {
        title: "Segregación de Cables",
        description: "Práctica de diseño consistente en separar físicamente el tendido de cables según su función y nivel de señal. Los cables de alimentación de potencia y los cables de señales débiles de telecomunicación nunca deben discurrir paralelos en la misma bandeja sin una distancia de seguridad normalizada."
      }
    ],
    examples: [
      {
        situation: "Al arrancar un motor de un ascensor en una estación de ADIF, los ordenadores de venta de billetes sufren parpadeos en pantalla y pérdidas de comunicación en la red local.",
        application: "Es una perturbación por acoplamiento conducido provocada por el transitorio de conmutación del motor del ascensor. Se soluciona instalando un filtro de red EMI en la entrada de alimentación del ascensor o de los ordenadores para bloquear los picos de alta frecuencia."
      },
      {
        situation: "Un técnico de ADIF debe pasar un cable de datos ethernet de par trenzado de categoría 5e junto a una línea trifásica de 400V en una bandeja metálica de telecomunicaciones.",
        application: "Incorrecto. Se debe respetar la distancia de segregación mínima (habitualmente 20 cm) o utilizar bandejas metálicas con divisor físico continuo conectado a tierra, empleando cable blindado (STP) para asegurar la inmunidad del cable de datos."
      }
    ],
    reviewTakeaways: [
      "La fibra óptica (monomodo y multimodo) es totalmente inmune a las perturbaciones y ruidos electromagnéticos, ya que transmite pulsos de luz en lugar de señales eléctricas.",
      "El apantallamiento de los cables solo es efectivo si la malla exterior metálica se conecta correctamente a tierra en ambos extremos de la canalización.",
      "Las descargas electrostáticas (ESD) representan perturbaciones radiadas de alta tensión y baja energía que pueden destruir circuitos integrados sin dejar marcas físicas visibles."
    ]
  },
  "rcf-libro-1": {
    introduction: "El Reglamento de Circulación Ferroviaria (RCF), aprobado mediante el Real Decreto 921/2015, constituye el marco normativo supremo que regula la seguridad de la circulación de los trenes en la Red Ferroviaria de Interés General (RFIG). El Libro Primero, denominado 'Reglas Generales', establece las bases éticas, las definiciones fundamentales, las responsabilidades de los agentes intervinientes y los principios operativos sobre los que se sustenta la explotación segura de la red ferroviaria.",
    concepts: [
      {
        title: "El Principio de Prudencia Ferroviaria",
        description: "Principio rector por el cual, ante cualquier duda, contradicción entre normas, señalización confusa o situación imprevista, todo el personal del sector ferroviario debe adoptar obligatoriamente la decisión más segura y restrictiva para el tráfico, primando la seguridad humana sobre los retrasos o la puntualidad."
      },
      {
        title: "Personal de Circulación",
        description: "Agentes que realizan funciones que inciden directamente en la seguridad del tráfico. Incluye a maquinistas, factores de circulación, encargados de trabajos, personal de cabina de control y pilotos de seguridad. Tienen la obligación de mantener activa su aptitud psicofísica durante la jornada laboral."
      },
      {
        title: "Documentación Oficial Obligatoria de Circulación",
        description: "Documentos e información escrita o digital que deben portar y conocer los agentes de conducción de forma obligatoria, tales como el Libro de Itinerarios del tren, el Horario de Servicio de la línea y las Notificaciones vigentes."
      },
      {
        title: "Estación Ferroviaria",
        description: "Infraestructura ferroviaria constituida por vías, agujas de desvío y señales, delimitada por sus señales de entrada, destinada a regular la circulación de trenes y permitir la subida, bajada y transbordo de viajeros o mercancías."
      },
      {
        title: "Cantón de Vía",
        description: "Tramo de vía en el que, en condiciones normales de explotación, no puede circular de forma simultánea más de un tren. La separación de los trenes se realiza dividiendo la línea en cantones protegidos por señales fijas automáticas o bloqueos manuales."
      },
      {
        title: "Aguja Ferroviaria",
        description: "Aparato de vía móvil y metálico que permite a las ruedas de los trenes cambiar de una vía a otra de forma segura. Su correcto enclavamiento y posición es crítico para la seguridad de la circulación."
      }
    ],
    examples: [
      {
        situation: "Una señal de salida de la estación muestra una luz violeta parpadeante, la cual no está contemplada en las indicaciones estándar de parada o vía libre del reglamento de señales.",
        application: "El maquinista debe aplicar inmediatamente el principio de prudencia. Una indicación dudosa o no normalizada equivale legalmente a una señal de parada estricta. El maquinista debe detener el tren antes de rebasar la señal y notificar al Puesto de Mando."
      },
      {
        situation: "Un factor de circulación detecta que los sistemas informáticos de bloqueo automático de la vía se han apagado debido a un fallo eléctrico.",
        application: "Se debe suspender el bloqueo automático e implantar el bloqueo telefónico manual de emergencia con registro de telefonemas firmados. No se autorizará la salida de ningún tren hasta confirmar verbalmente con la estación colateral que el cantón está libre."
      }
    ],
    reviewTakeaways: [
      "La puntualidad y rapidez comercial están subordinadas incondicionalmente a la seguridad de la vida humana y de la infraestructura ferroviaria.",
      "Toda orden verbal que contradiga el Reglamento de Circulación es nula y no debe ser ejecutada por el agente receptor por riesgo de accidente.",
      "Las señales fijas de parada de emergencia deben ser obedecidas de forma inmediata por cualquier tren en circulación."
    ]
  },
  psicometria: {
    introduction: "La evaluación psicotécnica y psicométrica para el ingreso en ADIF mide el perfil de competencias cognitivas y aptitudinales de los candidatos a personal operativo de entrada. El examen consta de test de velocidad y precisión donde el control del tiempo, la resistencia a la fatiga visual sostenida y el razonamiento analítico rápido determinan la puntuación final del aspirante.",
    concepts: [
      {
        title: "Resistencia a la Fatiga y Atención Selectiva",
        description: "Mide la capacidad de concentrarse en tareas repetitivas y monótonas sin cometer fallos. Pruebas típicas son el tachado de símbolos específicos (test d2), detección de errores en cadenas alfanuméricas largas y verificación de correspondencia."
      },
      {
        title: "Razonamiento Lógico-Espacial",
        description: "Mide la aptitud para conceptualizar y manipular mentalmente formas bidimensionales (2D) y tridimensionales (3D). Incluye la resolución de giros espaciales, matrices de progresión analítica de figuras geométricas y desdoblamiento de poliedros."
      },
      {
        title: "Aptitud Numérica",
        description: "Evalúa la velocidad para realizar operaciones matemáticas básicas (fracciones, porcentajes, proporciones, sistemas de ecuaciones básicas) y resolver pequeños problemas lógicos de física elemental (cruces de trenes, velocidad media, pérdidas)."
      },
      {
        title: "Aptitud Verbal",
        description: "Evalúa la comprensión lectora rápida de manuales técnicos, analogías semánticas, antónimos, sinónimos y la capacidad de seguir instrucciones complejas escritas de forma rigurosa."
      }
    ],
    examples: [
      {
        situation: "Un ejercicio psicotécnico de atención alfanumérica te presenta una columna de 60 códigos tipo 'A9-X4-B3' y otra al lado con ligeras variantes, debiendo marcar si son idénticos o diferentes en 90 segundos.",
        application: "La mejor estrategia es entrenar el barrido visual saltando los primeros dos caracteres comunes de cada código y comparando la terminación directamente, lo que reduce el tiempo de análisis en un 40%."
      },
      {
        situation: "Se plantea un problema matemático de cruce de dos trenes: el tren A sale de Madrid a 80 km/h y el tren B sale de Zaragoza a 120 km/h al mismo tiempo. Sabiendo que la distancia es de 300 km, se pide hallar a qué distancia se cruzan.",
        application: "Uso de la ecuación de movimiento relativo: $Tiempo = Distancia / (Velocidad A + Velocidad B) = 300 / (80 + 120) = 1.5$ horas. Se cruzan a $1.5 \\times 80 = 120$ km de Madrid."
      }
    ],
    reviewTakeaways: [
      "Las respuestas incorrectas restan puntuación en las oposiciones oficiales de ADIF; dejar preguntas en blanco es la opción más prudente ante dudas completas.",
      "La gestión del tiempo es crítica: es conveniente saltarse las preguntas difíciles para asegurar primero las fáciles en la primera ronda del test.",
      "La práctica diaria y cronometrada es el método científico más eficaz para automatizar la resolución de series y razonamientos lógicos."
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
        description: "El Ministerio de Transportes y Movilidad Sostenible planifica, regula y supervisa el sistema. De él dependen las entidades públicas empresariales Adif, Adif-Alta Velocidad, Renfe-Operadora, Puertos del Estado y Enaire. La Comisión Nacional de los Mercados y la Competencia (CNMC) actúa como órgano regulador: garantiza la pluralidad de la oferta, la igualdad de acceso al mercado, la supervisión de cánones y tarifas y la comprobación de cláusulas no discriminatorias de la DR."
      },
      {
        title: "Grandes cifras de la red de Adif",
        description: "Datos referidos al ejercicio: aproximadamente 11.675 km de red titularidad de Adif (10.212 km de red convencional de ancho ibérico, 57 km de AV de ancho estándar puro, 84 km de AV de ancho ibérico, 127 km de red mixta de tercer carril y 1.195 km de vía estrecha de ancho métrico), 1.445 estaciones de viajeros, 45 terminales de mercancías y unos 13.619 empleados."
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
      "Los agentes clave del sector son el Ministerio de Transportes, Adif, Adif-Alta Velocidad, Renfe-Operadora y la CNMC como regulador.",
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
    introduction: "La prueba de inglés para el ingreso en ADIF corresponde al nivel de competencia A2 del Marco Común Europeo de Referencia para las Lenguas (MCER). Evalúa el dominio práctico de estructuras gramaticales cotidianas, el uso correcto de los tiempos verbales (en especial los pasados regular e irregular), el manejo de los verbos modales de obligación, permiso y prohibición, y la comprensión de un glosario de términos ferroviarios básicos.",
    concepts: [
      {
        title: "Pasado Simple (Past Simple)",
        description: "Tiempo verbal utilizado para narrar eventos completados en el pasado. Los verbos regulares se forman añadiendo '-ed' al infinitivo (work -> worked). Los verbos irregulares cambian su forma y deben memorizarse (go -> went, see -> saw, write -> wrote, buy -> bought). En oraciones negativas y preguntas se utiliza el auxiliar 'did'."
      },
      {
        title: "Verbos Modales de Obligación, Prohibición y Necesidad",
        description: "'Must' indica obligación legal u orden directa. 'Must not' (mustn't) denota prohibición absoluta. 'Have to' expresa una necesidad u obligación externa (reglamento). 'Don't have to' indica ausencia de obligación (es opcional)."
      },
      {
        title: "Verbos Modales de Habilidad y Permiso",
        description: "'Can' expresa habilidad presente o permiso informal. 'Could' expresa habilidad pasada o una petición más cortés de asistencia al cliente."
      },
      {
        title: "Glosario Técnico Ferroviario Esencial",
        description: "Platform (andén), Track (vía), Train driver (maquinista), Station master (Jefe de estación), Timetable (horario), Delay (retraso), Level crossing (paso a nivel), Buffer (tope de vía), Points / Switches (agujas de desvío)."
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
      "El auxiliar 'did' de pasado simple anula la forma de pasado del verbo principal en las preguntas y negativas (ej. 'Did you go?', no 'Did you went?').",
      "Must not indica prohibición; don't have to indica que algo es opcional o innecesario.",
      "El vocabulario técnico sobre estaciones, retrasos y billetes suele constituir el núcleo principal de los enunciados de examen de ADIF."
    ]
  }
};
