import type { LessonSummary } from "./types";

export const ictRd3462011Summary: LessonSummary = {
  overview: "El Real Decreto 346/2011 aprueba el Reglamento regulador de las Infraestructuras Comunes de Telecomunicación (ICT) para el acceso a los servicios de telecomunicación en el interior de los edificios, definiendo la estructura de redes, recintos, canalizaciones y las obligaciones de instalación.",
  keyFacts: [
    "Objeto: Regular las ICT para la captación, adaptación y distribución de señales de radio, televisión y telecomunicaciones por cable y banda ancha (Art. 1).",
    "RITI: Recinto de Instalaciones de Telecomunicación Inferior (alberga redes de operadores de telecomunicación por hilo/cable).",
    "RITS: Recinto de Instalaciones de Telecomunicación Superior (alberga equipos de captación de RTV y enlace).",
    "RITU: Recinto de Instalaciones de Telecomunicación Único (en edificios de hasta 10 viviendas o locales).",
    "Red de alimentación: Enlaza las redes de los operadores con la ICT del edificio a través del registro de enlace.",
    "Red de distribución: Tramo entre los recintos (RITI/RITS) y los registros secundarios a través de la canalización principal.",
    "Red de dispersión: Tramo entre los registros secundarios y los Puntos de Acceso al Usuario (PAU).",
    "Red interior de usuario: Tramo entre el PAU y las Bases de Toma de Usuario (BAT) en el interior de cada vivienda o local.",
    "Proyecto Técnico: Exigible para la obtención de la licencia de edificación, redactado y firmado por un Ingeniero o Ingeniero Técnico de Telecomunicación."
  ],
  sections: [
    {
      title: "Estructura de Redes en una ICT",
      points: [
        "Red de alimentación: Conecta las infraestructuras de los operadores de telecomunicación con el edificio. Pertenece y es mantenida por los operadores.",
        "Red de distribución: Parte de los recintos de telecomunicaciones (RITI/RITS/RITU), discurre por la canalización principal y distribuye las señales por la vertical del inmueble.",
        "Red de dispersión: Conecta la canalización principal con los accesos individuales a las viviendas o locales a través de los registros de terminación de red.",
        "Red interior de usuario: Ubicada en el interior de la propiedad privada, interconecta el PAU con las distintas BAT repartidas por las estancias."
      ]
    },
    {
      title: "Recintos, Canalizaciones y Registros",
      points: [
        "RITI (Inferior): Situado en la planta baja o sótano del inmueble. RITS (Superior): Situado en la cubierta o última planta.",
        "RITU (Único): Solución integrada para edificios pequeños o viviendas unifamiliares.",
        "Arqueta de entrada: Punto de conexión entre la red de alimentación del operador y la canalización de enlace del edificio.",
        "Canalización principal: Troncal vertical provista de canaletas o tubos para alojar los cables de distribución de telefonía, RTV y fibra óptica.",
        "PAU (Punto de Acceso al Usuario): Elemento donde finaliza la red de dispersión e inicia la red interior privada de usuario."
      ]
    },
    {
      title: "Servicios Obligatorios e Instalación",
      points: [
        "Captación y distribución de señales de radiodifusión sonora y televisión (RTV terrestre y satélite).",
        "Acceso a servicios de telecomunicaciones de banda ancha mediante par trenzado, cable coaxial y fibra óptica (FTTH).",
        "El Certificado de Fin de Obra y Boletín de Instalación garantizan que la ICT cumple con las especificaciones del Proyecto Técnico aprobado."
      ]
    }
  ]
};
