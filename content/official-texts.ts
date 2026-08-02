export interface OfficialTextSection {
  title: string;
  articles: Array<{
    number: string;
    title: string;
    content: string;
  }>;
}

export const officialTexts: Record<string, OfficialTextSection> = {
  igualdad: {
    title: "Ley Orgánica 3/2007, de 22 de marzo, para la igualdad efectiva de mujeres y hombres",
    articles: [
      {
        number: "Artículo 3",
        title: "El principio de igualdad de trato entre mujeres y hombres",
        content: "El principio de igualdad de trato entre mujeres y hombres supone la ausencia de toda discriminación, directa o indirecta, por razón de sexo, y, especialmente, las derivadas de la maternidad, la asunción de obligaciones familiares y el estado civil."
      },
      {
        number: "Artículo 6",
        title: "Discriminación directa e indirecta",
        content: "1. Se considera discriminación directa por razón de sexo la situación en que se encuentra una persona que sea, haya sido o pudiera ser tratada, en atención a su sexo, de manera menos favorable que otra en situación comparable.\n\n2. Se considera discriminación indirecta por razón de sexo la situación en que una disposición, criterio o práctica aparentemente neutros pone a personas de un sexo en desventaja particular con respecto a personas del otro, salvo que dicha disposición, criterio o práctica puedan justificarse objetivamente con una finalidad legítima y que los medios para alcanzar dicha finalidad sean necesarios y adecuados."
      },
      {
        number: "Artículo 7",
        title: "Acoso sexual y acoso por razón de sexo",
        content: "1. Sin perjuicio de lo establecido en el Código Penal, a los efectos de esta Ley constituye acoso sexual cualquier comportamiento, verbal o físico, de naturaleza sexual que tenga el propósito o produzca el efecto de atentar contra la dignidad de una persona, en particular cuando se crea un entorno intimidatorio, degradante u ofensivo.\n\n2. Constituye acoso por razón de sexo cualquier comportamiento realizado en función del sexo de una persona, con el propósito o el efecto de atentar contra su dignidad y de crear un entorno intimidatorio, degradante u ofensivo."
      },
      {
        number: "Artículo 11",
        title: "Acciones positivas",
        content: "Con el fin de hacer efectivo el derecho constitucional de la igualdad, los Poderes Públicos adoptarán medidas específicas en favor de las mujeres para corregir situaciones patentes de desigualdad de partida de carácter social, económico, educativo y de acceso al empleo."
      }
    ]
  },
  "prevencion-riesgos-laborales": {
    title: "Ley 31/1995, de 8 de noviembre, de Prevención de Riesgos Laborales",
    articles: [
      {
        number: "Artículo 14",
        title: "Derecho a la protección frente a los riesgos laborales",
        content: "1. Los trabajadores tienen derecho a una protección eficaz en materia de seguridad y salud en el trabajo.\n\n2. En cumplimiento del deber de protección, el empresario garantizará la seguridad y la salud de los trabajadores a su servicio en todos los aspectos relacionados con el trabajo. A estos efectos, en el marco de sus responsabilidades, el empresario realizará la prevención de los riesgos laborales mediante la integración de la actividad preventiva en la empresa."
      },
      {
        number: "Artículo 15",
        title: "Principios de la acción preventiva",
        content: "El empresario aplicará las medidas que integran el deber general de prevención de acuerdo con los siguientes principios generales:\n\n1. Evitar los riesgos.\n2. Evaluar los riesgos que no se puedan evitar.\n3. Combatir los riesgos en su origen.\n4. Adaptar el trabajo a la persona, en particular en lo que respecta a la concepción de los puestos de trabajo, así como a la elección de los equipos y los métodos de trabajo y de producción.\n5. Tener en cuenta la evolución de la técnica.\n6. Sustituir lo peligroso por lo que entrañe poco o ningún peligro.\n7. Planificar la prevención, buscando un conjunto coherente que integre en ella la técnica, la organización del trabajo, las condiciones de trabajo, las relaciones sociales y la influencia de los factores ambientales en el trabajo.\n8. Adoptar medidas que antepongan la protección colectiva a la individual.\n9. Dar las debidas instrucciones a los trabajadores."
      },
      {
        number: "Artículo 29",
        title: "Obligaciones de los trabajadores en materia de prevención",
        content: "Corresponde a cada trabajador velar, según sus posibilidades y mediante el cumplimiento de las medidas de prevención que en cada caso sean adoptadas, por su propia seguridad y salud en el trabajo y por la de aquellas otras personas a las que pueda afectar su actividad profesional, a causa de sus actos y omisiones en el trabajo, de conformidad con su formación y las instrucciones del empresario."
      }
    ]
  },
  "estatuto-adif": {
    title: "Real Decreto 2395/2004, Estatuto de la entidad pública empresarial ADIF",
    articles: [
      {
        number: "Artículo 1",
        title: "Naturaleza y régimen jurídico",
        content: "1. El Administrador de Infraestructuras Ferroviarias (ADIF) es una entidad pública empresarial de las previstas en el artículo 43.1.b) de la Ley 6/1997, de 14 de abril, de Organización y Funcionamiento de la Administración General del Estado, adscrita al Ministerio de Fomento.\n\n2. ADIF tiene personalidad jurídica propia, plena capacidad de obrar para el cumplimiento de sus fines, patrimonio propio y administración independiente."
      },
      {
        number: "Artículo 2",
        title: "Objeto y funciones",
        content: "ADIF tiene por objeto la administración de las infraestructuras ferroviarias y otras funciones de acuerdo con la Ley 39/2003, de 17 de noviembre, del Sector Ferroviario, velando por la seguridad de la circulación y la óptima explotación de la red de transporte ferroviario de su titularidad."
      },
      {
        number: "Artículo 13",
        title: "Órganos de gobierno y de gestión",
        content: "Los órganos de gobierno de ADIF son el Consejo de Administración y el Presidente de la entidad. El Consejo de Administración estará integrado por el Presidente y por un número mínimo de nueve y máximo de diez vocales nombrados por el Ministro de Fomento."
      },
      {
        number: "Artículo 21",
        title: "Régimen patrimonial",
        content: "ADIF tendrá un patrimonio propio, integrado por el conjunto de sus bienes, derechos y obligaciones. La gestión de los bienes adscritos por el Estado se realizará con sujeción a las funciones legalmente atribuidas en materia de administración de infraestructuras ferroviarias."
      }
    ]
  },
  "ict-rd-346-2011": {
    title: "Real Decreto 346/2011, Reglamento regulador de las Infraestructuras Comunes de Telecomunicaciones (ICT)",
    articles: [
      {
        number: "Anexo I",
        title: "Infraestructuras Comunes de Telecomunicaciones (ICT)",
        content: "Las ICT en el interior de los edificios tienen como objeto canalizar de manera ordenada y segura el acceso a los diferentes servicios de telecomunicación. Comprende las canalizaciones principales, secundarias e interiores de usuario, así como los recintos destinados a albergar los equipos."
      },
      {
        number: "Definición",
        title: "Topología y elementos de red",
        content: "1. Red de alimentación: Conecta las redes de los operadores autorizados con la infraestructura del edificio a través del Punto de Interconexión.\n\n2. Red de distribución: Enlaza los equipos principales en el RITI con los derivadores en cada planta.\n\n3. Red de dispersión: Conecta la red de distribución con el Punto de Acceso al Usuario (PAU) en cada una de las viviendas.\n\n4. Red interior de usuario: Conecta las tomas de usuario (BAT) con el PAU en el interior del inmueble."
      },
      {
        number: "Especificación",
        title: "Recintos de Instalaciones de Telecomunicaciones (RIT)",
        content: "1. RITI (Recinto Inferior): Alberga los repartidores principales de los diferentes servicios y se sitúa en la planta baja o sótano.\n\n2. RITS (Recinto Superior): Situado en la planta superior o azotea, alberga los elementos de captación de señales de radiodifusión sonora y televisión."
      }
    ]
  },
  "compatibilidad-electromagnetica": {
    title: "Real Decreto 186/2016, de 6 de mayo, sobre compatibilidad electromagnética de equipos",
    articles: [
      {
        number: "Artículo 3",
        title: "Definición de Compatibilidad Electromagnética (CEM)",
        content: "Capacidad de un equipo para funcionar satisfactoriamente en su entorno electromagnético sin introducir perturbaciones electromagnéticas intolerables para otros equipos situados en el mismo entorno."
      },
      {
        number: "Concepto",
        title: "Fenómenos de acoplamiento e interferencia",
        content: "1. Emisión: Producción y salida de energía electromagnética desde un equipo al exterior. Puede ser conducida (vía cables de alimentación y señal) o radiada (propagada a través del aire).\n\n2. Inmunidad o Susceptibilidad: Capacidad de un equipo para funcionar de forma adecuada ante la presencia de perturbaciones electromagnéticas en su entorno."
      },
      {
        number: "Mitigación",
        title: "Medidas técnicas de reducción de ruidos",
        content: "1. Apantallamiento: Uso de barreras metálicas continuas para contener o reflejar las ondas electromagnéticas.\n\n2. Filtrado: Instalación de filtros en las líneas de alimentación y señal para suprimir el ruido de alta frecuencia conducido.\n\n3. Segregación física: Mantener distancias físicas mínimas entre cables de señales débiles y cables de potencia eléctrica."
      }
    ]
  },
  "rcf-libro-1": {
    title: "Reglamento de Circulación Ferroviaria (RCF) — Libro Primero: Reglas Generales",
    articles: [
      {
        number: "Regla 1.1",
        title: "Principio de prudencia y seguridad",
        content: "En caso de duda, falta de regulación específica o ante circunstancias imprevistas que puedan comprometer la seguridad de la explotación, el personal del sector ferroviario adoptará siempre la decisión más segura y prudente, primando la seguridad de los viajeros y de la circulación sobre la rapidez del servicio."
      },
      {
        number: "Regla 1.2",
        title: "Responsabilidad del personal de circulación",
        content: "Todo agente de circulación, conducción o mantenimiento es responsable directo del estricto cumplimiento de las normas de este reglamento durante su jornada de trabajo, debiendo mantener activa su aptitud psicofísica y notificar de inmediato cualquier deficiencia observada."
      },
      {
        number: "Regla 1.3",
        title: "Documentación oficial obligatoria",
        content: "El personal de conducción deberá llevar en cabina los libros de itinerarios oficiales, las notificaciones de vía vigentes, el horario de servicio y la documentación técnica de seguridad requerida por el operador ferroviario y el administrador de infraestructura."
      }
    ]
  },
  psicometria: {
    title: "Guía de Evaluación Psicotécnica y Psicométrica para el Ingreso en ADIF",
    articles: [
      {
        number: "Bloque 1",
        title: "Evaluación de la Atención y Resistencia a la Fatiga",
        content: "Se evalúa la precisión y rapidez del aspirante para buscar errores, realizar comparaciones de códigos alfanuméricos largos y detectar discrepancias sutiles bajo límites de tiempo estrictos y fatiga sostenida."
      },
      {
        number: "Bloque 2",
        title: "Razonamiento Lógico y Aptitud Espacial",
        content: "Pruebas de inducción a través del análisis de series de figuras, matrices geométricas de transformación, simetrías y rotación mental de piezas complejas de tres dimensiones (3D)."
      },
      {
        number: "Bloque 3",
        title: "Aptitud Numérica y Verbal",
        content: "Resolución de problemas de cálculo mental rápido, proporciones, porcentajes y planteamientos matemáticos básicos, combinados con ejercicios de analogías semánticas y comprensión verbal de instrucciones técnicas."
      }
    ]
  },
  "ingles-a2": {
    title: "Guía de Contenidos de Inglés Nivel A2 (MCER) para ADIF",
    articles: [
      {
        number: "Gramática",
        title: "Tiempos Verbales y Modales Obligatorios",
        content: "1. Present Simple & Continuous: Para rutinas y estados temporales de servicio.\n\n2. Past Simple: Uso de verbos regulares (-ed) e irregulares para documentar eventos pasados.\n\n3. Verbos Modales: Must (obligación estricta), Must not (prohibición), Have to (necesidad), Can & Could (peticiones de asistencia)."
      },
      {
        number: "Vocabulario",
        title: "Terminología de Estación y Transporte Ferroviario",
        content: "1. Platform (andén): Lugar de espera y embarque de pasajeros.\n\n2. Track (vía): Línea metálica sobre la que circulan los vehículos ferroviarios.\n\n3. Signal (señal): Elemento visual o luminoso que autoriza o restringe el movimiento del tren.\n\n4. Delay (retraso): Modificación temporal sobre el horario previsto de paso.\n\n5. Ticket office (taquilla): Punto de venta e información al cliente."
      }
    ]
  }
};
