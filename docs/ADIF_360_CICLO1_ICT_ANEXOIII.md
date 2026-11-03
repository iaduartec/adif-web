# ADIF 360 — Ciclo 1 académico: ICT Anexo III (recintos, tierra, incendios, CEM, seguridad)

**Rama:** codex/auditoria-adif-26 @ d5f10b3 + cambios locales  
**Fuente primaria:** RD 346/2011 (BOE-A-2011-5834, consolidado 26/03/2025), Anexo III apartados 4.5, 5.5, 5.7, 7, 8.

## Materia / apartados

ICT — Anexo III: recintos de telecomunicación (RITU/RITU-A/RITM/RITI/RITS), tierra local, compartimentación contra incendios, CEM/apantallamiento en recintos, requisitos de seguridad entre instalaciones.

## Problemas corregidos

- 5 claims pendientes de verificación (ict-c8, c10, c11, c22, c30) ahora verificados contra BOE con locators exactos y review `reviewed`/high.
- Fuentes no registradas añadidas al módulo (anex3-recintos, incendios, cem, seguridad-instalaciones) + sourceVersion.
- Acrónimos y conceptos sin desarrollo (RITU/RITU-A/RITM) ahora con conceptos dedicados.

## Teoría nueva

- 5 conceptos nuevos (ict-concept-35 a 39): RITU/RITU-A, RITM/RITI/RITS, tierra local, incendios, CEM/apantallamiento+seguridad.
- 3 ejemplos prácticos (RITU en edificio de 4 plantas, tierra en recinto de 30 PAU, paso por compartimentación).
- 4 takeaways de memorización.

## Preguntas incorporadas

- 5 preguntas originales nuevas (orig-tel-ict-anexo3-001 a -005), difficulty 2, reviewed, con conceptIds vinculados.

## Flashcards

- 4 flashcards nuevas (F0090–F0093) por concepto.

## Fuentes verificadas

- BOE-A-2011-5834 consolidado 26/03/2025, Anexo III apartados 4.5, 5.5, 5.7, 7.1, 7.3, 8.

## Calificaciones

- Especialista telecom: profundidad elevada a 4/5 en el bloque.
- Pedagogo: mejoras de memorización (takeaways + flashcards por concepto).

## Hallazgos adversariales

- Ninguno bloqueante. Las preguntas pasan hasExactConceptCitation; verify:content OK; typecheck OK.

## Archivos modificados

- content/theories/ict-rd-346-2011.ts
- content/flashcards.ts
- content/original-practice/telecom.json
- docs/ADIF_360_CICLO1_ICT_ANEXOIII.md

## Pruebas académicas ejecutadas

- pnpm typecheck: OK
- pnpm verify:content: OK (claims, references, copy, syllabus, question mappings)

## Pendientes concretos

- Cubrir los 9 claims ICT originalmente pendientes restantes (ict-c12 presunción conformidad, ict-c18 hogar digital, ict-c26 impedancia, ict-c32 banda) en ciclos posteriores.
- Ampliar ejemplos para anexos I, II, IV, V.
- Psicotécnicos e inglés en ciclos dedicados.
