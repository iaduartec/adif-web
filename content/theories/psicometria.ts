import type { TheorySection } from "../lesson-theory";

export const psicometriaTheory: TheorySection = {
  introduction: `La evaluación psicotécnica y psicométrica para el ingreso en ADIF constituye una fase eliminatoria clave dentro de los procesos selectivos para el personal operativo (factores de circulación, montadores de instalaciones de seguridad, oficiales de telecomunicaciones, oficiales de subestaciones, ayudantes ferroviarios, etc.). Su propósito fundamental es determinar si el candidato posee las aptitudes cognitivas, de atención sostenida, de razonamiento y psicomotoras requeridas para desempeñar funciones que impactan directamente en la seguridad ferroviaria.

Estas pruebas no evalúan conocimientos teóricos, sino la velocidad de procesamiento de información, la precisión en tareas monótonas bajo presión de tiempo y el control del error. Los exámenes psicotécnicos suelen constar de varios bloques cronometrados de corta duración (entre 2 y 10 minutos por bloque) donde el número de preguntas es deliberadamente superior al tiempo disponible, obligando al candidato a gestionar estratégicamente el tiempo y a dominar técnicas de descarte rápido.

Para obtener un rendimiento excelente en la fase de psicometría, es imprescindible comprender la estructura de las aptitudes evaluadas y aplicar estrategias tácticas específicas de resolución para cada tipología de ejercicio (numérico, verbal, abstracto/lógico-espacial y atención sostenida).`,

  concepts: [
    {
      title: "Resistencia a la fatiga y atención sostenida (Test de Toulouse-Piéron y similares)",
      description: "Evalúan la capacidad de mantener la concentración y realizar tareas de búsqueda visual o comparación de datos de forma repetitiva y monótona sin cometer errores bajo presión temporal. Ejercicios típicos: (a) buscar símbolos específicos entre una matriz de cientos de símbolos similares; (b) comparar columnas de códigos alfanuméricos largos para identificar cuáles son idénticos y cuáles difieren. La clave es el barrido visual sistemático y no saltarse filas para no perder el foco."
    },
    {
      title: "Razonamiento lógico, abstracto y espacial",
      description: "Mide la aptitud para identificar patrones, secuencias lógicas y manipular mentalmente formas geométricas en 2D y 3D. Incluye: (1) matrices de figuras donde se debe encontrar la figura que falta completando una ley de rotación, traslación o simetría; (2) series lógicas de números, letras o dominós; (3) plegado de cubos (desarrollos planos que se cierran para formar un volumen). Para resolverlos rápidamente, se debe buscar primero el elemento constante, luego la regla de alternancia y descartar las opciones imposibles por color o posición."
    },
    {
      title: "Aptitud Numérica: velocidad y simplificación",
      description: "Mide la rapidez para realizar operaciones matemáticas básicas (aritmética mental) y resolver pequeños problemas cuantitativos de lógica (fracciones, porcentajes, reglas de tres, proporciones y ecuaciones de primer grado). En ADIF son muy comunes los problemas de física elemental sobre movimiento: cruces de trenes, velocidades relativas y tiempos de recorrido. La estrategia clave es la simplificación rápida (aproximación numérica) para descartar alternativas en la opción múltiple sin realizar la operación completa por escrito."
    },
    {
      title: "Aptitud Verbal: comprensión técnica y semántica",
      description: "Evalúa la comprensión de textos cortos de carácter técnico, la fluidez léxica y el razonamiento analógico. Incluye: (a) analogías verbales (A es a B como C es a D); (b) sinónimos y antónimos contextuales; (c) ordenación gramatical de instrucciones complejas. La lectura debe ser activa y focalizada: leer primero la pregunta y luego buscar la palabra clave en el texto, evitando interpretaciones subjetivas o asunciones ajenas al párrafo suministrado."
    },
    {
      title: "Gestión del tiempo y tasa de penalización por error",
      description: "En los exámenes de ADIF, los errores suelen restar puntuación (fórmula habitual: Aciertos - [Errores / (N - 1)], donde N es el número de opciones de respuesta). Por tanto, la respuesta aleatoria es perjudicial. El candidato debe: (1) realizar una primera pasada rápida respondiendo únicamente a las preguntas de resolución inmediata (seguridad del 100%); (2) marcar las dudosas para una segunda pasada si queda tiempo; (3) omitir o dejar en blanco las preguntas de resolución compleja que consuman más de 30-40 segundos."
    },
    {
      title: "Velocidad relativa y problemas de cruces ferroviarios",
      description: "Tipología clásica de problema numérico en psicotécnicos ferroviarios. Se basa en dos fórmulas clave derivadas del Movimiento Rectilíneo Uniforme (MRU): (a) Trenes que van al encuentro (direcciones opuestas): Tiempo de encuentro = Distancia inicial / (Velocidad A + Velocidad B). (b) Trenes en persecución (misma dirección): Tiempo de alcance = Distancia inicial / (Velocidad A - Velocidad B). La distancia de cruce se obtiene multiplicando el tiempo obtenido por la velocidad del tren correspondiente."
    }
  ],

  examples: [
    {
      situation: "En un ejercicio psicotécnico de atención alfanumérica, se te presenta una tabla con dos columnas de 80 códigos cada una (ej. Columna A: 'XY-8902-Z' | Columna B: 'XY-8902-Z'). Debes marcar en 2 minutos cuáles son idénticas (I) y cuáles diferentes (D).",
      application: "Aplica la técnica de focalización en puntos críticos: no leas el código en voz alta ni mentalmente. Haz un barrido visual comparando el primer bloque, luego el medio y luego el final. Generalmente los errores se sitúan en la inversión de dos números centrales (ej: 8902 vs 8920) o en la última letra. Si el primer carácter difiere, marca directamente 'D' y pasa al siguiente en menos de un segundo."
    },
    {
      situation: "Se plantea el siguiente problema matemático: 'El tren de alta velocidad A sale de la estación de Madrid a las 10:00 h con velocidad constante de 250 km/h en dirección a Barcelona. A la misma hora, el tren B sale de Barcelona hacia Madrid a 200 km/h por vía paralela. La distancia entre ambas ciudades es de 900 km. ¿A qué hora se cruzarán?'",
      application: "Aplica la fórmula de velocidad relativa al encuentro: Tiempo = Distancia / Suma de Velocidades. t = 900 / (250 + 200) = 900 / 450 = 2 horas. Si salieron a las 10:00 h, se cruzarán a las 12:00 h (10:00 + 2 h). Esta resolución toma menos de 15 segundos si se conoce la estructura de la fórmula."
    },
    {
      situation: "Se te presenta una serie lógica de dominós: [2/4], [3/3], [4/2], [5/1], [?/?]. Debes identificar la ficha que continúa la serie.",
      application: "Analiza por separado los números superiores y los inferiores. Parte superior: 2 -> 3 -> 4 -> 5 (progresión aritmética de +1, la siguiente es 6). Parte inferior: 4 -> 3 -> 2 -> 1 (progresión aritmética de -1, la siguiente es 0 / blanca). Por lo tanto, la ficha que continúa es [6/0]. En series de dominós, recuerda que después del 6 viene el 0 (blanca) y viceversa, formando un ciclo de 7 valores."
    },
    {
      situation: "Durante la prueba, te bloqueas con una matriz de figuras 3D compleja (plegado de un cubo con patrones de líneas) y ya has invertido 45 segundos intentando rotarlo mentalmente. Quedan 10 preguntas y 2 minutos de tiempo.",
      application: "Aplica la gestión táctica del tiempo: no insistas en resolver un ejercicio que te está consumiendo tiempo excesivo. Márcalo en el cuestionario para volver a él si es posible, déjalo en blanco (para evitar la penalización por fallo si respondes al azar) y pasa de inmediato a las siguientes preguntas, que pueden ser mucho más sencillas de resolver en pocos segundos."
    }
  ],

  reviewTakeaways: [
    "Rapidez + Precisión: el examen psicotécnico de ADIF premia no cometer errores. Un fallo resta puntos y anula respuestas correctas.",
    "Fórmula de encuentro (cruce en sentidos opuestos): t = d / (v1 + v2).",
    "Fórmula de alcance (persecución en el mismo sentido): t = d / (v1 - v2).",
    "En series numéricas/letras/dominós, analiza siempre las operaciones alternativas (pares e impares) de forma independiente.",
    "Plegado de cubos: busca caras opuestas (nunca pueden ser adyacentes en la figura plegada) para descartar opciones al instante.",
    "Atención sostenida: haz barridos visuales sin subvocalizar los caracteres; la subvocalización ralentiza el proceso en un 50%.",
    "Táctica de examen: primera pasada para aciertos seguros al 100%, dejando las dudosas y complejas para el final o en blanco.",
    "Comprensión verbal: limítate estrictamente al texto proporcionado; no apliques conocimientos externos que puedan falsear la opción literal."
  ]
};
