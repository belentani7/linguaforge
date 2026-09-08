# Criterios de entrega verificables

Este documento relaciona la solicitud institucional con artefactos concretos del repositorio. Los criterios se validan mediante pruebas unitarias, comprobación de tipos y verificación visual de las rutas principales.

| Requisito | Evidencia de implementación | Estado |
|---|---|---|
| Identidad institucional única | `Home.tsx`, `InstitutionShell.tsx`, `README.md`. | Implementado |
| 39 idiomas y perfiles | `shared/institution.ts`, `Catalog.tsx`, prueba `education.test.ts`. | Implementado |
| CEFR A1–C2 | `CEFR_LEVELS`, catálogo y rutas de programas. | Implementado |
| Seis facultades conectadas | `INSTITUTION_FACULTIES`, `INSTITUTION-MODEL.md`, `Programs.tsx`, `OpenInstitution.tsx`. | Implementado |
| Rutas modulares y cursos iniciales | `LEARNING_GOALS`, `COURSE_CATALOG`, `CURRICULUM_LESSONS`, `Programs.tsx`. | Implementado |
| Diagnóstico y recomendación transversal | `Onboarding.tsx`, `recommendInstitutionalPath`, procedimiento `diagnostic.complete`. | Implementado |
| Panel, avance y complemento | `Dashboard.tsx`, `learningProfiles`, `lessonCompletions`. | Implementado |
| Biblioteca, búsqueda y glosario acotado | `Library.tsx`, `LINGUAFORGE_MICRO_GLOSSARY`, `Labs.tsx`. | Implementado |
| Internacionalización sin duplicar arquitectura | `CORE_UI_COPY`, metadatos de idioma, selector común en `InstitutionShell.tsx`. | Implementado |
| Tutor adaptativo | `Tutor.tsx`, `tutor.respond`, auditoría mínima en `tutorRequests`. | Implementado |
| Grabación, transcripción y comparación | `VoicePractice.tsx`, `voice.transcribe`, `voiceAttempts`. | Implementado |
| Constancia de recorrido personal | `EvidenceRecord.tsx`, actividades reales en `lessonCompletions`. | Implementado; no oficial. |
| Estudio de proyectos verificables | `LEARNING_PROJECTS`, `projectSubmissions`, `Projects.tsx`, `projects.save`. | Implementado; autogestionado y no certificado. |
| Transparencia y colaboración pública | `OpenInstitution.tsx`, `LICENSE`, `CONTRIBUTING.md`, `GOVERNANCE.md`, `PRIVACY.md`, `SECURITY.md`. | Implementado |
| Documentación y calidad | `README.md`, `docs/`, `education.test.ts`. | Implementado |

## Validaciones requeridas antes de publicar

| Control | Comando o revisión | Resultado esperado |
|---|---|---|
| Tipos | `pnpm check` | Sin errores de TypeScript. |
| Pruebas | `pnpm test` | Pruebas de autenticación y dominio educativo aprobadas. |
| Interfaz | Revisión de `/`, `/programas`, `/idiomas`, `/diagnostico`, `/biblioteca`, `/labs`, `/empleo`, `/abierto`, `/mi-espacio`, `/tutor`, una lección y la constancia. | Jerarquía legible en escritorio y móvil, navegación sin callejones sin salida. |
| Seguridad de voz | Prueba en HTTPS con permiso explícito de micrófono. | La grabación se inicia solo por acción de la persona y la transcripción devuelve un resultado o error comprensible. |
| Tutor | Prueba autenticada con una consulta educativa. | La respuesta usa contexto de ruta y muestra un recordatorio de verificación. |
| Proyecto | Guardar un borrador y registrar un proyecto autenticado con artefacto y reflexión válidos. | El proyecto reaparece en el panel y en la constancia personal. |

## Límites conocidos y próximos incrementos

La entrega crea una arquitectura integral y una base curricular inicial de doce lecciones con cursos de entrada para las seis facultades. Antes de presentar el sistema como un catálogo exhaustivo, se deben producir y revisar más lecciones por idioma, nivel y facultad con especialistas, conservar procedencia y licencia de cada recurso y añadir revisión pedagógica. La interfaz dispone de un **microglosario local y explícitamente limitado** entre español, inglés y portugués; no simula un traductor general. El catálogo de 39 idiomas mantiene metadatos y respaldo visible en español para localizar el resto sin bifurcar el producto.

El reconocimiento de voz depende de permiso del navegador, conectividad y disponibilidad del servicio de transcripción. La comparación actual es deliberadamente pedagógica y textual; no debe utilizarse para decisiones de selección, acreditación o identificación.
