import type { TheorySection } from "../lesson-theory";

const didactic = (id: string, text: string) => ({
  id,
  text,
  kind: "didactic" as const,
  legalBasis: [],
  review: {
    status: "needs_review" as const,
    confidence: {
      level: "medium" as const,
      reason: "Redacción didáctica original; pendiente de revisión editorial y pedagógica. No acredita frecuencia histórica ADIF.",
    },
  },
});
const concept = (id: string, title: string, claims: Array<[string, string]>) => ({
  id,
  title,
  claims: claims.map(([claimId, text]) => didactic(claimId, text)),
});
const example = (id: string, situation: string, application: Array<[string, string]>) => ({
  id,
  situation,
  application: application.map(([claimId, text]) => ({ ...didactic(claimId, text), kind: "example" as const })),
});

export const inglesA2Theory: TheorySection = {
  sources: [
    {
      id: "mcer-ingles-a2",
      sourceId: "MCER-A2",
      sourceTitle: "Marco Común Europeo de Referencia para las Lenguas (MCER)",
      sourceUrl: "https://www.coe.int/en/web/common-european-framework-reference-languages/introduction-and-context",
      locator: "Nivel de Usuario Básico A2",
      excerpt: "Describe la capacidad de comprender frases y expresiones de uso frecuente relacionadas con áreas de experiencia que le son especialmente relevantes.",
    },
  ],

  introduction: [
    didactic("ingles-intro-1", "Guía didáctica original de inglés funcional A2: explica reglas frecuentes, vocabulario y lectura breve con traducciones y errores típicos. No acredita por sí misma el nivel oficial de una convocatoria ni la frecuencia histórica de una estructura en exámenes ADIF."),
    didactic("ingles-intro-2", "Cómo estudiar cada tema: localiza la palabra clave, identifica la estructura, compara las opciones y comprueba que la frase completa tenga sentido. Después, abre Inglés A2 → Preguntas originales por tema para practicar; son ejercicios didácticos, no preguntas oficiales."),
  ],

  concepts: [
    concept("ingles-topic-there-is-are", "There is / There are · hay", [
      ["ingles-topic-there-is-are-rule", "Usamos there is + nombre singular o incontable para decir que algo existe: There is a station nearby. (Hay una estación cerca.) Usamos there are + plural: There are two platforms. (Hay dos andenes.)"],
      ["ingles-topic-there-is-are-questions", "En preguntas, there va delante del verbo: Is there a toilet? (¿Hay un baño?) / Are there any seats? (¿Hay asientos?) Para negar: There isn't a lift. / There aren't any seats."],
      ["ingles-topic-there-is-are-error", "Error típico: *There is two platforms. El sujeto real es two platforms, plural, así que corresponde are. No confundas there is (hay) con they are (ellos/ellas son o están)."],
      ["ingles-topic-there-is-are-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → There is / There are. Busca si el nombre que sigue es singular, incontable o plural."],
    ]),
    concept("ingles-topic-present-simple", "Present Simple · rutinas y hechos", [
      ["ingles-topic-present-simple-rule", "Se usa para hábitos, horarios y hechos generales. En tercera persona singular (he, she, it) se añade -s o -es: The train leaves at six. (El tren sale a las seis.) / She watches the news. (Ella ve las noticias.)"],
      ["ingles-topic-present-simple-forms", "Con I/you/we/they, el verbo no lleva -s: They work here. En preguntas y negativas usamos do; con he/she/it, does: Does he work here? He doesn't work here. Después de does/doesn't, el verbo vuelve a su forma base."],
      ["ingles-topic-present-simple-error", "Error típico: *She don't work o *Does she works? Lo correcto es She doesn't work y Does she work: la marca de tercera persona ya está en doesn't/does."],
      ["ingles-topic-present-simple-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Present Simple. Fíjate en every day, usually, often y en quién realiza la acción."],
    ]),
    concept("ingles-topic-present-continuous", "Present Continuous · acciones en curso", [
      ["ingles-topic-present-continuous-rule", "Forma: sujeto + am/is/are + verbo terminado en -ing. Describe algo que ocurre ahora o en este periodo: The technician is checking the signal. (El técnico está comprobando la señal.)"],
      ["ingles-topic-present-continuous-contrast", "Compara: She works at the station. (Trabaja allí habitualmente; Present Simple.) / She is working now. (Está trabajando ahora; Present Continuous.) Palabras como now, at the moment y currently suelen señalar una acción en curso."],
      ["ingles-topic-present-continuous-error", "Error típico: omitir be (*They waiting) o añadirlo a un verbo de rutina (*I am go every day). Di They are waiting y I go every day."],
      ["ingles-topic-present-continuous-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Present Continuous. Comprueba que aparezca be y que la acción esté en -ing."],
    ]),
    concept("ingles-concept-1", "Past Simple · pasado terminado", [
      ["ingles-c1-1", "Usamos Past Simple para acciones terminadas en un momento pasado, a menudo con yesterday, last week o ago. Los regulares suelen añadir -ed: repair → repaired. Hay que aprender los irregulares: go → went, buy → bought."],
      ["ingles-c1-2", "En preguntas y negativas usamos did/didn't + forma base: Did the train arrive? (¿Llegó el tren?) / It didn't arrive. (No llegó.) El pasado lo marca did, por eso el verbo principal no conserva -ed ni la forma irregular: *Did it arrived? → Did it arrive?"],
      ["ingles-past-pronunciation", "La terminación -ed se escribe igual, pero su pronunciación varía (/t/, /d/ o /ɪd/). No siempre se añade una sílaba: repaired termina en /d/; wanted termina en /ɪd/."],
      ["ingles-past-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Past Simple. Subraya la referencia temporal y decide si la frase es afirmativa, negativa o pregunta."],
    ]),
    concept("ingles-topic-future", "Future forms · planes y predicciones", [
      ["ingles-topic-future-rule", "Be going to + verbo base expresa un plan o una predicción con indicios visibles: We are going to visit York. (Vamos a visitar York.) / Look at those clouds: it is going to rain. (Mira esas nubes: va a llover.)"],
      ["ingles-topic-future-will", "Will + verbo base se usa para decisiones tomadas en el momento, ofrecimientos y predicciones u opiniones: I'll help you. (Te ayudaré.) / I think it will be busy. (Creo que habrá mucha gente.) En ambos casos, tras will no se añade to ni -s."],
      ["ingles-topic-future-error", "Compara: *She will to call → She will call. *They are going visit → They are going to visit. Con going to, no olvides conjugar be: I am, he/she/it is, we/you/they are."],
      ["ingles-topic-future-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Future forms. Busca si hay un plan previo, una señal presente o una decisión espontánea."],
    ]),
    concept("ingles-concept-2", "Modal verbs · obligación, permiso y consejo", [
      ["ingles-c2-1", "Must + verbo base expresa obligación o una conclusión firme: You must wear a helmet. (Debes llevar casco.) Mustn't expresa prohibición: You mustn't enter. (No debes entrar; está prohibido.) No se añade -s: He must stop."],
      ["ingles-c2-2", "Have to expresa obligación o necesidad, a menudo por una regla o circunstancia: I have to show my ticket. (Tengo que enseñar el billete.) Para ausencia de obligación: don't/doesn't have to = no es necesario, es opcional."],
      ["ingles-modals-contrast", "Diferencia esencial: You mustn't park here = está prohibido aparcar. You don't have to pay = no hace falta pagar, aunque podrías hacerlo. Mustn't no significa simplemente que algo no sea necesario."],
      ["ingles-modals-other", "Can/can't expresa capacidad o permiso: Can I sit here? (¿Puedo sentarme aquí?) Should/shouldn't da un consejo: You should leave early. (Deberías salir pronto.) Tras estos modales va el verbo base, sin to."],
      ["ingles-modals-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Modal verbs. Decide si el mensaje expresa prohibición, falta de necesidad, obligación, permiso o consejo."],
    ]),
    concept("ingles-topic-comparatives", "Comparatives · comparar dos cosas", [
      ["ingles-topic-comparatives-rule", "Adjetivo corto + -er + than: This route is shorter than that one. (Esta ruta es más corta que aquella.) En muchos adjetivos largos: more + adjetivo + than: The new station is more modern than the old one."],
      ["ingles-comparatives-spelling", "Cambios frecuentes: large → larger (se elimina la e final); big → bigger (se duplica consonante); easy → easier (y cambia a i). Irregulares: good → better; bad → worse."],
      ["ingles-topic-comparatives-error", "Error típico: *more easier. No combines more con -er: usa easier. Than introduce el segundo elemento de la comparación: faster than the bus (más rápido que el autobús)."],
      ["ingles-topic-comparatives-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Comparatives. Identifica los dos elementos y revisa la longitud y la terminación del adjetivo."],
    ]),
    concept("ingles-topic-prepositions", "Prepositions of time · at, on, in", [
      ["ingles-topic-prepositions-rule", "Como orientación: at para una hora concreta (at 9:15, at noon); on para días y fechas (on Friday, on 12 May); in para meses, años y periodos del día (in June, in 2026, in the morning)."],
      ["ingles-prepositions-places", "Para lugares: at suele señalar un punto o actividad (at the station); in, un espacio interior o zona (in the office, in London); on, una superficie o transporte público (on the platform, on the train). El contexto puede cambiar la elección."],
      ["ingles-topic-prepositions-error", "Error típico: traducir siempre la preposición española «en» como in. Decimos at 8 o'clock, on Monday e in winter. Aprende la combinación completa, no una traducción palabra por palabra."],
      ["ingles-topic-prepositions-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Prepositions. Clasifica primero la expresión: hora, día/fecha, mes/año o lugar."],
    ]),
    concept("ingles-topic-quantifiers", "Quantifiers · some, any, much, many, a few, a little", [
      ["ingles-topic-quantifiers-rule", "Many y a few acompañan nombres contables plurales: many passengers (muchos pasajeros), a few tickets (unos pocos billetes). Much y a little acompañan nombres incontables: much time (mucho tiempo), a little water (un poco de agua)."],
      ["ingles-quantifiers-some-any", "Some aparece a menudo en afirmativas: There are some seats. (Hay algunos asientos.) Any es frecuente en preguntas y negativas: Are there any seats? / There aren't any seats. En ofrecimientos y peticiones también puede usarse some: Would you like some tea?"],
      ["ingles-topic-quantifiers-error", "Error típico: *much passengers o *many information. Passenger se puede contar: many passengers. Information es incontable: much information o a piece of information."],
      ["ingles-topic-quantifiers-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Quantifiers. Decide primero si el nombre es contable o incontable y después observa si la frase afirma, pregunta o niega."],
    ]),
    concept("ingles-topic-countable-uncountable", "Countable / uncountable nouns · contables e incontables", [
      ["ingles-topic-countable-uncountable-rule", "Los contables tienen singular y plural: one ticket, two tickets; pueden ir con a/an en singular. Los incontables normalmente no llevan plural ni a/an: information, luggage, advice, water."],
      ["ingles-countable-units", "Para contar algo incontable, usamos una unidad: a piece of advice (un consejo), a bottle of water (una botella de agua), two items of luggage (dos bultos de equipaje)."],
      ["ingles-topic-countable-uncountable-error", "Error típico para hispanohablantes: *an advice, *informations, *a luggage. Usa some advice, a piece of advice, some information o a bag/item of luggage."],
      ["ingles-topic-countable-uncountable-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Countable / uncountable nouns. Prueba si admite one/two directamente o si necesita una unidad de medida."],
    ]),
    concept("ingles-topic-simple-conditionals", "First conditional · posibilidad real futura", [
      ["ingles-topic-simple-conditionals-rule", "Estructura habitual: If + Present Simple, will + verbo base. Habla de una condición posible y su resultado: If the train is late, I will call you. (Si el tren se retrasa, te llamaré.)"],
      ["ingles-first-conditional-order", "El orden puede invertirse sin cambiar el sentido: I will call you if the train is late. Si la cláusula con if va primero, suele separarse con coma; si va al final, normalmente no."],
      ["ingles-first-conditional-error", "Error típico: *If it will rain, we will stay home. En esta estructura, después de if usamos presente: If it rains, we will stay home. En el resultado, will lleva el verbo base."],
      ["ingles-topic-simple-conditionals-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Simple conditionals. Localiza la condición con if y separa lo que ocurrirá si se cumple."],
    ]),
    concept("ingles-topic-vocabulary", "Everyday vocabulary · palabras con varios sentidos", [
      ["ingles-topic-vocabulary-rule", "Key puede significar llave (a key to open a door) o tecla/clave, según el contexto. Para recordar vocabulario, aprende palabra + combinación + situación: a door key, a train ticket, catch a bus."],
      ["ingles-vocabulary-false-friends", "No traduzcas solo por el parecido: actually significa «en realidad», no «actualmente»; assist suele ser «ayudar», no «asistir a un evento». Usa las palabras vecinas para elegir el sentido."],
      ["ingles-topic-vocabulary-error", "Error típico: escoger la primera traducción del diccionario sin leer la frase. En una frase sobre abrir una puerta, key es «llave»; en una frase sobre un teclado, puede ser «tecla»."],
      ["ingles-topic-vocabulary-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Everyday vocabulary. Lee la frase completa e identifica qué significado encaja con la acción y el objeto."],
    ]),
    concept("ingles-topic-signs-notices", "Signs and notices · carteles y avisos", [
      ["ingles-topic-signs-notices-rule", "Los carteles suelen usar mensajes breves. Closed on Sundays significa «Cerrado los domingos»; No entry, «Prohibida la entrada»; Keep left, «Manténgase a la izquierda»; Out of order, «Fuera de servicio»."],
      ["ingles-signs-reading", "Busca primero la palabra que indica la acción o restricción (no, keep, closed, must), después el lugar o momento. On Sundays señala cuándo; no significa que cierre solo un domingo concreto."],
      ["ingles-topic-signs-notices-error", "Error típico: leer cada palabra aislada y pasar por alto la negación. No entry prohíbe entrar; Entry no significa lo mismo. Comprueba quién debe hacer qué y cuándo."],
      ["ingles-topic-signs-notices-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Signs and notices. Resume el cartel en una instrucción española corta y verifica si hay prohibición u horario."],
    ]),
    concept("ingles-topic-short-messages", "Short messages · mensajes breves", [
      ["ingles-topic-short-messages-rule", "En SMS y notas, localiza quién escribe, dónde está, qué propone y la hora o lugar acordados. Here (aquí) depende del lugar desde el que escribe la persona; tonight significa «esta noche»."],
      ["ingles-short-messages-evidence", "Responde con evidencia del mensaje. Si dice Meet me at six, la cita es a las seis; no deduzcas un cambio de hora por información que no aparece."],
      ["ingles-topic-short-messages-error", "Error típico: confundir la hora en que se envía el mensaje con la hora de la cita, o interpretar here como la ubicación del lector. Relaciona cada pronombre y adverbio con el emisor."],
      ["ingles-topic-short-messages-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Short messages. Marca las palabras que indican emisor, lugar, propuesta y hora."],
    ]),
    concept("ingles-topic-emails", "Short emails · correos breves", [
      ["ingles-topic-emails-rule", "En un correo breve, distingue el motivo, la petición, los detalles prácticos y la despedida. Early significa «antes de la hora prevista»; ten minutes early at ten significa a las 9:50."],
      ["ingles-emails-time", "Compara: ten minutes early (diez minutos antes), ten minutes late (diez minutos tarde), by ten (como muy tarde a las diez) y until ten (hasta las diez). La preposición cambia el plazo."],
      ["ingles-topic-emails-error", "Error típico: leer early como «pronto» sin calcular la hora relativa. Si la cita es a las 10:00 y piden llegar ten minutes early, resta diez minutos: 9:50."],
      ["ingles-topic-emails-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Short emails. Separa hora de cita y hora solicitada; comprueba las expresiones de plazo."],
    ]),
    concept("ingles-topic-everyday-situations", "Everyday situations · respuestas naturales", [
      ["ingles-topic-everyday-situations-rule", "You are welcome suele responder a Thank you: equivale a «de nada». Excuse me llama la atención o pide paso; Sorry expresa disculpa; Can you help me? pide ayuda."],
      ["ingles-everyday-functions", "Identifica primero la función de la frase anterior: agradecimiento, disculpa, petición o saludo. Una respuesta natural contesta a esa función, no solo repite una palabra parecida."],
      ["ingles-topic-everyday-situations-error", "Error típico: confundir You're welcome (respuesta a «gracias») con Welcome! (bienvenida). El apóstrofo en You're representa you are."],
      ["ingles-topic-everyday-situations-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Everyday situations. Nombra el acto comunicativo antes de elegir la respuesta."],
    ]),
    concept("ingles-topic-shops", "Shops · compras y precios", [
      ["ingles-topic-shops-rule", "Change puede significar «cambio» como dinero devuelto: If it costs four pounds and you pay ten, your change is six pounds. (Si cuesta cuatro libras y pagas diez, te devuelven seis.)"],
      ["ingles-shops-calculation", "Para resolver preguntas de compra, distingue price (precio), cost (costar), pay (pagar) y change (vuelto/cambio). Resta el precio del importe pagado: 10 − 4 = 6."],
      ["ingles-topic-shops-error", "Error típico: interpretar change siempre como «cambiar». En una conversación de caja, Could I have my change? pide el dinero sobrante."],
      ["ingles-topic-shops-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Shops. Subraya precio e importe entregado antes de calcular el vuelto."],
    ]),
    concept("ingles-topic-hotels", "Hotels · servicios y phrasal verbs", [
      ["ingles-topic-hotels-rule", "Check in es registrarse al llegar a un hotel; check out es dejar la habitación y completar la salida. Could I check in, please? = ¿Puedo registrarme, por favor?"],
      ["ingles-hotels-phrasal", "Los phrasal verbs dependen de sus partículas: take off puede significar quitarse (take off your shoes) o despegar (the plane takes off). El sujeto y la situación ayudan a elegir el sentido."],
      ["ingles-topic-hotels-error", "Error típico: traducir un phrasal verb palabra por palabra. Para saber si take off significa despegar, busca un avión, una hora de vuelo o una puerta de embarque en el contexto."],
      ["ingles-topic-hotels-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Hotels. Usa las palabras cercanas para decidir si se habla de recepción, habitación o transporte."],
    ]),
    concept("ingles-topic-airports", "Airports · instrucciones de viaje", [
      ["ingles-topic-airports-rule", "Boarding es el embarque; gate es la puerta de embarque. Gate six = puerta seis. Boarding starts at 10:30 indica cuándo empieza el embarque, no necesariamente la hora de despegue."],
      ["ingles-airports-vocabulary", "Palabras útiles: flight (vuelo), departure (salida), arrival (llegada), delayed (retrasado), luggage (equipaje). En un aviso, relaciona número de vuelo, puerta y hora antes de decidir adónde ir."],
      ["ingles-topic-airports-error", "Error típico: confundir boarding time con departure time. Si el aviso dice Boarding at gate 6, busca la puerta seis; no infieras que el avión ya está despegando."],
      ["ingles-topic-airports-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Airports. Extrae por separado vuelo, puerta, hora y estado del viaje."],
    ]),
    concept("ingles-topic-health", "Health · síntomas y ayuda", [
      ["ingles-topic-health-rule", "Toothache significa «dolor de muelas/dientes»; headache, «dolor de cabeza»; stomach ache, «dolor de estómago». Para toothache, la persona indicada es un dentist (dentista)."],
      ["ingles-health-phrases", "I have a headache. (Me duele la cabeza.) / I feel sick. (Me encuentro mal.) / You should see a doctor. (Deberías ver a un médico.) Observa have + nombre del dolor."],
      ["ingles-topic-health-error", "Error típico: traducir tooth como diente y no reconocer toothache como una sola palabra para el dolor. Relaciona el síntoma completo con el profesional o consejo adecuado."],
      ["ingles-topic-health-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Health. Empareja el síntoma con el profesional o la acción que realmente puede ayudar."],
    ]),
    concept("ingles-topic-reading-comprehension", "Reading comprehension · localizar evidencia", [
      ["ingles-topic-reading-comprehension-rule", "Lee la pregunta para saber qué dato buscas; localiza en el texto la frase que lo contiene y parafrasea su significado. Si el texto dice Nora has lunch at home, la respuesta es que come en casa."],
      ["ingles-reading-negation", "Presta atención a not, never, before, after, only y expresiones de cantidad. Esas palabras pueden cambiar la respuesta aunque el resto de la frase coincida."],
      ["ingles-topic-reading-comprehension-error", "Error típico: responder con conocimiento del mundo o una suposición no escrita. Elige lo que el texto afirma; si falta un dato, no lo inventes."],
      ["ingles-topic-reading-comprehension-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Reading comprehension. Señala la frase que demuestra la respuesta antes de mirar las opciones."],
    ]),
    concept("ingles-topic-superlatives", "Superlatives · destacar uno dentro de un grupo", [
      ["ingles-topic-superlatives-form", "El superlativo compara una persona o cosa con todo un grupo. Con adjetivo corto usamos the + adjetivo terminado en -est: the fastest train (el tren más rápido), the smallest station (la estación más pequeña)."],
      ["ingles-topic-superlatives-long", "Con muchos adjetivos largos usamos the most + adjetivo: the most comfortable seat (el asiento más cómodo). Para expresar el grupo, añadimos in/of: the longest route in the country (la ruta más larga del país)."],
      ["ingles-topic-superlatives-spelling", "Cambios frecuentes: large → the largest; big → the biggest; easy → the easiest. Irregulares: good → the best; bad → the worst; far → the farthest/furthest."],
      ["ingles-topic-superlatives-error", "Errores típicos: *the most fastest (no combines most con -est) y omitir the (*fastest train cuando se necesita «el tren más rápido»). Comparativo: faster than; superlativo: the fastest in the group."],
      ["ingles-topic-superlatives-practice", "Practica en Inglés A2 → Preguntas originales por tema → Comparatives: el bloque incluye una pregunta de superlativos. Antes de elegir, distingue si comparas dos elementos (comparativo) o uno con todo un grupo (superlativo)."],
    ]),
    concept("ingles-topic-articles", "Articles · a, an, the y ausencia de artículo", [
      ["ingles-topic-articles-indefinite", "A/an presenta un nombre contable singular no identificado o mencionado por primera vez: a platform (un andén), an airport (un aeropuerto). Elegimos por sonido, no por letra: an hour, pero a university."],
      ["ingles-topic-articles-definite", "The identifica algo concreto o ya conocido: I saw a train. The train was late. (Vi un tren. El tren llegó tarde.) También se usa cuando el contexto deja claro de qué cosa hablamos: Close the door, please."],
      ["ingles-topic-articles-zero", "No solemos usar artículo para hablar en general de plurales o incontables: Trains are useful. (Los trenes son útiles.) / Information is important. (La información es importante.) Los nombres contables singulares normalmente necesitan determinante."],
      ["ingles-topic-articles-error", "Errores típicos: *an station (a station, porque el sonido inicial es consonante), *a information (information es incontable) y the trains para hablar de trenes en general cuando no son un grupo concreto."],
      ["ingles-topic-articles-practice", "Repasa los artículos al practicar inglés A2, especialmente nombres contables/incontables y vocabulario cotidiano. Pregúntate si el nombre es singular contable y si el lector sabe cuál es."],
    ]),
    concept("ingles-topic-pronouns", "Pronouns · sujetos, objetos y posesión", [
      ["ingles-topic-pronouns-subject", "Pronombres sujeto: I (yo), you (tú/usted/vosotros), he (él), she (ella), it (ello/objeto o animal), we (nosotros), they (ellos). Ocupan el lugar de quien realiza la acción: Maria works here → She works here."],
      ["ingles-topic-pronouns-object", "Pronombres objeto: me, you, him, her, it, us, them. Van después del verbo o una preposición: Call me. (Llámame.) / This ticket is for them. (Este billete es para ellos.)"],
      ["ingles-topic-pronouns-possessive", "Adjetivos posesivos acompañan al nombre: my ticket (mi billete), your bag, his/her/its seat, our train, their platform. Pronombres posesivos lo sustituyen: This seat is mine. (Este asiento es mío.)"],
      ["ingles-topic-pronouns-error", "Errores típicos: *Me work here → I work here (sujeto); *call she → call her (objeto); *theirs train → their train (el posesivo theirs no precede al nombre). It se usa para objetos y situaciones, sin asignar género español."],
      ["ingles-topic-pronouns-practice", "Al practicar lectura, mensajes y situaciones cotidianas, sigue cada pronombre hasta su referente. Comprueba si el espacio pide sujeto antes del verbo, objeto después del verbo o posesivo."],
    ]),
    concept("ingles-topic-past-continuous", "Ampliación A2+/B1 · Past Continuous", [
      ["ingles-topic-past-continuous-form", "Forma: was/were + verbo en -ing. Afirmativa: I/he/she/it was waiting; you/we/they were waiting. Negativa: wasn't/weren't waiting. Pregunta: Were they waiting? (¿Estaban esperando?)"],
      ["ingles-topic-past-continuous-use", "Describe una acción que estaba en curso en un momento pasado: At 8:00, I was travelling. (A las ocho, estaba viajando.) Suele combinarse con Past Simple para una acción que interrumpe: I was travelling when the train stopped. (Viajaba cuando el tren se detuvo.)"],
      ["ingles-topic-past-continuous-contrast", "Past Continuous enfoca el desarrollo o contexto; Past Simple presenta el hecho terminado: They were checking the signal when the alarm rang. (Estaban comprobando la señal cuando sonó la alarma.) La acción breve rang va en Past Simple."],
      ["ingles-topic-past-continuous-error", "Error típico: olvidar was/were (*They checking) o usar was con sujeto plural (*They was checking). Di They were checking. Después de was/were, el verbo lleva -ing."],
      ["ingles-topic-past-continuous-scope", "Ampliación A2+/B1 para reconocer y construir narraciones sencillas; no se presenta como requisito oficial ADIF ni como categoría de práctica original validada."],
    ]),
    concept("ingles-topic-present-perfect", "Ampliación A2+/B1 · Present Perfect", [
      ["ingles-topic-present-perfect-form", "Forma: have/has + participio pasado. I/you/we/they have finished; he/she/it has finished. Negativa: haven't/hasn't finished. Pregunta: Have you finished? (¿Has terminado?)"],
      ["ingles-topic-present-perfect-use", "Relaciona una experiencia o resultado pasado con el presente cuando no se indica un momento terminado: I have visited London. (He visitado Londres.) / She has lost her ticket. (Ha perdido el billete y ahora no lo tiene.)"],
      ["ingles-topic-present-perfect-contrast", "Con ever/never hablamos de experiencias; just, already y yet sitúan una acción reciente o esperada: Have you ever travelled by train? (¿Has viajado alguna vez en tren?) / I haven't checked in yet. (Aún no me he registrado.)"],
      ["ingles-topic-present-perfect-past-simple", "Compara: I visited London last year. (Visité Londres el año pasado: momento pasado terminado, Past Simple.) / I have visited London. (He visitado Londres: experiencia, sin decir cuándo.) No uses Present Perfect con una fecha pasada terminada: *I have visited London last year."],
      ["ingles-topic-present-perfect-irregular", "El participio regular suele acabar en -ed; algunos comunes son irregulares: go/went/gone, see/saw/seen, do/did/done, be/was-or-were/been. Aprende por separado infinitivo, pasado y participio."],
      ["ingles-topic-present-perfect-scope", "Ampliación A2+/B1 para reconocer experiencias y resultados; no se presenta como requisito oficial ADIF ni como categoría de práctica original validada."],
    ]),
    concept("ingles-topic-frequency-adverbs", "Adverbs of frequency · frecuencia", [
      ["ingles-topic-frequency-adverbs-scale", "Orden aproximado de más a menos frecuente: always (siempre), usually (normalmente), often (a menudo), sometimes (a veces), hardly ever (casi nunca), never (nunca). La frecuencia exacta depende del contexto."],
      ["ingles-topic-frequency-adverbs-position", "Con la mayoría de verbos, el adverbio va antes del verbo principal: I usually take the train. (Normalmente cojo el tren.) Con be, va después: She is often early. (A menudo llega pronto.)"],
      ["ingles-topic-frequency-adverbs-questions", "Pregunta por frecuencia con How often...? (¿Con qué frecuencia...?): How often do you travel? (¿Con qué frecuencia viajas?) Respuesta: I travel twice a week. (Viajo dos veces por semana.)"],
      ["ingles-topic-frequency-adverbs-error", "Error típico: colocar usually después del verbo principal como en español (*I take usually the train). Di I usually take the train; con be, She is usually on time."],
      ["ingles-topic-frequency-adverbs-practice", "Repasa con Inglés A2 → Preguntas originales por tema → Present Simple. Expresiones como every Monday, twice a week y usually suelen describir rutinas; no son intercambiables en toda frase."],
    ]),
    concept("ingles-topic-connectors", "Connectors · unir ideas", [
      ["ingles-topic-connectors-addition", "And añade información: The station is small and clean. (La estación es pequeña y limpia.) Also suele añadir otra idea: It is also near the centre. (También está cerca del centro.)"],
      ["ingles-topic-connectors-contrast", "But introduce un contraste: The train is fast, but it is expensive. (El tren es rápido, pero es caro.) Because introduce una causa: We stayed inside because it was raining. (Nos quedamos dentro porque llovía.)"],
      ["ingles-topic-connectors-result", "So introduce un resultado: It was raining, so we took a taxi. (Llovía, así que cogimos un taxi.) Because responde a «¿por qué?»; so responde a «¿qué ocurrió como resultado?»."],
      ["ingles-topic-connectors-sequence", "First, then, after that y finally ordenan instrucciones o relatos: First buy a ticket, then go to platform two. (Primero compra un billete y después ve al andén dos.) Before = antes; after = después."],
      ["ingles-topic-connectors-error", "Error típico: usar because y so como si tuvieran el mismo orden. Because it was late, we took a taxi. / It was late, so we took a taxi. No añadas ambos para la misma relación en una estructura sencilla (*Because it was late, so...)."],
      ["ingles-topic-connectors-practice", "En la comprensión lectora, rodea conectores como but, because y so: suelen indicar contraste, causa o consecuencia y ayudan a localizar la relación entre las ideas."],
    ]),
    concept("ingles-concept-3", "Railway vocabulary · vocabulario ferroviario complementario", [
      ["ingles-c3-1", "Vocabulario complementario: platform (andén), track (vía), train driver (maquinista), delay (retraso) y level crossing (paso a nivel). Aprende cada palabra dentro de una frase para distinguir sentidos."],
      ["ingles-railway-combinations", "Combinaciones útiles: wait on the platform (esperar en el andén), a train is delayed (un tren lleva retraso), cross the track (cruzar la vía). En esta guía es vocabulario de apoyo, no evidencia de frecuencia en exámenes ADIF."],
      ["ingles-railway-practice", "Práctica relacionada: Inglés A2 → Preguntas originales por tema → Railway vocabulary. Usa las combinaciones y el contexto, no una lista de traducciones aisladas."],
    ]),
  ],

  examples: [
    example("ingles-ex-future-will", "Un compañero busca dónde sentarse. Te ofreces a guardar su sitio: I'll save you a seat. (Te guardaré un sitio.)", [
      ["ingles-ex-future-will-app", "La oferta surge en el momento de hablar. Will + verbo base forma I'll save; no se añade to ni -s tras will. También puede usarse para promesas y decisiones espontáneas."],
    ]),
    example("ingles-ex-countable-information", "Un compañero pregunta por el equipaje permitido: The airline gives some information about luggage. (La aerolínea da información sobre el equipaje.)", [
      ["ingles-ex-countable-information-app", "Information es incontable: no lleva a/an ni plural -s en este uso. Para contar datos concretos, se puede decir two pieces of information."],
    ]),
    example("ingles-ex-1", "Completa y traduce: The technician ___ (repair) the signal yesterday. (El técnico ___ la señal ayer.)", [
      ["ingles-ex-1-app-1", "Yesterday sitúa la acción en un pasado terminado; repair es regular, así que añadimos -ed: The technician repaired the signal yesterday. = El técnico reparó la señal ayer."],
      ["ingles-ex-1-app-2", "Comprueba el contraste: Did the technician repair the signal? (¿Reparó el técnico la señal?) Con did, repair vuelve a la forma base. Error a evitar: *Did the technician repaired?"],
    ]),
    example("ingles-ex-modals", "El cartel dice: Passengers must not cross the track. ¿Está permitido cruzar la vía?", [
      ["ingles-ex-modals-app", "Must not expresa prohibición: «Los pasajeros no deben cruzar la vía». No significa «no hace falta cruzar». Compara con Passengers don't have to cross the track: no tienen obligación de cruzarla."],
    ]),
    example("ingles-ex-reading", "Lee: The 8:10 train is delayed. Please wait on platform 2. ¿Dónde deben esperar los pasajeros?", [
      ["ingles-ex-reading-app", "Localiza la instrucción wait on platform 2: deben esperar en el andén 2. El dato se encuentra directamente en el aviso; no hace falta deducirlo."],
    ]),
  ],

  reviewTakeaways: [
    didactic("ingles-takeaway-1", "Atajo de examen: identifica la pista y explica por qué las otras formas no encajan. En especial, mustn't = prohibido; don't have to = no es necesario."),
    didactic("ingles-takeaway-2", "Después de repasar, abre la página Inglés A2 y practica en «Preguntas originales por tema». Usa el título del tema indicado al final de cada concepto; la práctica es original y no representa preguntas oficiales ni mide frecuencia histórica."),
  ],
};
