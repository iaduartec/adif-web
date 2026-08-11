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
      excerpt: "Los empleados públicos deben desempeñar con diligencia las tareas que tengan asignadas y velar por los intereses generales..."
    },
    {
      id: "rdleg-5-2015-art53",
      sourceId: "TREBEP",
      sourceTitle:
        "Real Decreto Legislativo 5/2015, de 30 de octubre, por el que se aprueba el texto refundido de la Ley del Estatuto Básico del Empleado Público",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
      locator: "Artículo 53",
      excerpt: "Principios éticos: Los empleados públicos respetarán la Constitución y el resto del ordenamiento jurídico..."
    },
    {
      id: "rdleg-5-2015-art54",
      sourceId: "TREBEP",
      sourceTitle:
        "Real Decreto Legislativo 5/2015, de 30 de octubre, por el que se aprueba el texto refundido de la Ley del Estatuto Básico del Empleado Público",
      sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
      locator: "Artículo 54",
      excerpt: "Principios de conducta: Garantizarán la atención al ciudadano... cumplirán con diligencia las tareas... informarán a la inspección ante órdenes ilegales..."
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
          text: "Normas fundamentales de rectitud moral que incluyen el deber de neutralidad, abstención por interés personal, y la prohibición absoluta de aceptar regalos o tratos de favor.",
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
          text: "El deber de obediencia jerárquica cede ante órdenes de superiores que supongan una infracción manifiesta del ordenamiento jurídico, en cuyo caso existe la obligación de no ejecutarlas.",
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
          text: "Constituye un incumplimiento muy grave del deber ético que prohíbe la aceptación de regalos o favores de particulares, pudiendo derivar en expediente disciplinario.",
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
      text: "Se prohíbe rigurosamente la utilización de recursos o furgonetas de ADIF para fines privados u operaciones ajenas al servicio público ferroviario.",
      kind: "interpretative",
      legalBasis: ["rdleg-5-2015-art54"]
    }
  ]
};
