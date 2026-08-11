import type { TheorySection } from "../lesson-theory";

export const codigoConductaTheory: TheorySection = {
  sources: [
    {
      id: "rdleg-5-2015-art52",
      sourceId: "TREBEP",
      sourceTitle:
        "Real Decreto Legislativo 5/2015, de 30 de octubre, por el que se aprueba el texto refundido de la Ley del Estatuto Básico del Empleado Público",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
      locator: "Artículo 52",
      excerpt: "Los empleados públicos deberán desempeñar con diligencia las tareas que tengan asignadas y velar por los intereses generales con sujeción y observancia de la Constitución y del resto del ordenamiento jurídico, y deberán actuar con arreglo a los siguientes principios: objetividad, integridad, neutralidad, responsabilidad, imparcialidad, confidencialidad, dedicación al servicio público, transparencia, ejemplaridad, austeridad... Los principios y reglas establecidos en este capítulo informarán la interpretación y aplicación del régimen disciplinario de los empleados públicos."
    },
    {
      id: "rdleg-5-2015-art53",
      sourceId: "TREBEP",
      sourceTitle:
        "Real Decreto Legislativo 5/2015, de 30 de octubre, por el que se aprueba el texto refundido de la Ley del Estatuto Básico del Empleado Público",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
      locator: "Artículo 53",
      excerpt: "Principios éticos: Los empleados públicos respetarán la Constitución y el resto de normas que integran el ordenamiento jurídico. ... 5. Se abstendrán en aquellos asuntos en los que tengan un interés personal... 7. No aceptarán ningún trato de favor o situación que implique privilegio o ventaja injustificada, por parte de personas físicas o entidades privadas. ... 12. Guardarán secreto de las materias clasificadas u otras cuya difusión esté prohibida legalmente, y mantendrán la debida discreción sobre aquellos asuntos que conozcan por razón de su cargo..."
    },
    {
      id: "rdleg-5-2015-art54",
      sourceId: "TREBEP",
      sourceTitle:
        "Real Decreto Legislativo 5/2015, de 30 de octubre, por el que se aprueba el texto refundido de la Ley del Estatuto Básico del Empleado Público",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
      locator: "Artículo 54",
      excerpt: "Principios de conducta: 1. Tratarán con atención y respeto a los ciudadanos, a sus superiores y a los restantes empleados públicos. 2. El desempeño de las tareas correspondientes a su puesto de trabajo se realizará de forma diligente y cumpliendo la jornada y el horario establecidos. 3. Obedecerán las instrucciones y órdenes profesionales de los superiores, salvo que constituyan una infracción manifiesta del ordenamiento jurídico, en cuyo caso las pondrán inmediatamente en conocimiento de los órganos de inspección procedentes. 5. Administrarán los recursos y bienes públicos con austeridad, y no utilizarán los mismos en provecho propio o de personas allegadas. 8. Mantendrán actualizada su formación y cualificación."
    }
  ],

  introduction: [
    {
      id: "conducta-intro-1",
      text: "El Código de Conducta de los empleados públicos está regulado en el Título III, Capítulo VI del TREBEP (aprobado por el RD Legislativo 5/2015).",
      kind: "normative",
      legalBasis: ["rdleg-5-2015-art52"]
    },
    {
      id: "conducta-intro-2",
      text: "Se integra por principios éticos y principios de conducta, vinculantes para todo el personal de las administraciones y entidades públicas como ADIF.",
      kind: "normative",
      legalBasis: ["rdleg-5-2015-art52"]
    }
  ],

  concepts: [
    {
      id: "conducta-concept-1",
      title: "Deberes Generales de los Empleados Públicos",
      claims: [
        {
          id: "conducta-c1-1",
          text: "Los empleados públicos deben actuar con diligencia, objetividad, integridad, neutralidad y transparencia, velando permanentemente por los intereses generales.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art52"]
        }
      ]
    },
    {
      id: "conducta-concept-2",
      title: "Principios Éticos",
      claims: [
    {
      id: "conducta-c2-1",
      text: "Entre los principios éticos se incluye la abstención en los asuntos en los que el empleado tenga un interés personal y el deber de no aceptar tratos de favor o situaciones que impliquen un privilegio o ventaja injustificada por parte de personas físicas o entidades privadas.",
      kind: "normative",
      legalBasis: ["rdleg-5-2015-art53"]
    }
      ]
    },
    {
      id: "conducta-concept-3",
      title: "Principios de Conducta",
      claims: [
        {
          id: "conducta-c3-1",
          text: "Reglas de comportamiento del servicio diario: trato respetuoso, cumplimiento de jornada, uso austero de recursos públicos y actualización de la formación.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art54"]
        }
      ]
    },
    {
      id: "conducta-concept-4",
      title: "Objeción a Órdenes de Superiores",
      claims: [
    {
      id: "conducta-c4-1",
      text: "Los empleados públicos obedecerán las instrucciones y órdenes profesionales de los superiores, salvo que constituyan una infracción manifiesta del ordenamiento jurídico, en cuyo caso deberán ponerlas inmediatamente en conocimiento de los órganos de inspección procedentes.",
      kind: "normative",
      legalBasis: ["rdleg-5-2015-art54"]
    }
      ]
    },
    {
      id: "conducta-concept-5",
      title: "Secreto Profesional y Confidencialidad",
      claims: [
        {
          id: "conducta-c5-1",
          text: "Obliga a guardar estricta reserva sobre las materias e informaciones confidenciales de las que se tenga conocimiento por razón del desempeño del puesto.",
          kind: "normative",
          legalBasis: ["rdleg-5-2015-art53"]
        }
      ]
    }
  ],

  examples: [
    {
      id: "conducta-ex-1",
      situation: "Un empleado del departamento de compras de ADIF acepta una invitación de fin de semana con todos los gastos pagados por parte de una empresa proveedora de traviesas.",
      application: [
        {
          id: "conducta-ex-1-app-1",
          text: "Podría constituir un incumplimiento de los principios éticos y de conducta que obligan a rechazar cualquier regalo, favor o servicio que vaya más allá de los usos habituales, sociales y de cortesía, pudiendo dar lugar a las responsabilidades disciplinarias que procedan.",
          kind: "example",
          legalBasis: ["rdleg-5-2015-art53"]
        }
      ]
    }
  ],

  reviewTakeaways: [
    {
      id: "conducta-takeaway-1",
      text: "El Código de Conducta es un régimen de obligaciones jurídicamente vinculante para los empleados públicos, cuyo incumplimiento puede motivar la apertura del correspondiente expediente disciplinario.",
      kind: "interpretative",
      legalBasis: ["rdleg-5-2015-art52"]
    },
    {
      id: "conducta-takeaway-2",
      text: "Los bienes y recursos públicos no podrán utilizarse en provecho propio o de personas allegadas, por lo que su empleo para fines privados supone un incumplimiento del código de conducta.",
      kind: "interpretative",
      legalBasis: ["rdleg-5-2015-art54"]
    }
  ]
};
