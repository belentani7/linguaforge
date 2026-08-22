# Auditoría severa comparativa de LinguaForge

**Fecha de corte:** 2026-08-22  
**Criterio:** no se asigna una puntuación perfecta sin evidencia de implementación, contenido, licencias, pruebas y operación sostenida.

## Referentes abiertos evaluados

| Referente      | Evidencia primaria                                                                                                                                                                                | Fortaleza comprobada                                        | Límite relevante para LinguaForge                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| LibreLingo     | El repositorio declara AGPL-3.0, ejercicios interactivos, repetición espaciada, progreso y cursos con licencias propias; el propio README informa que el repositorio principal está archivado [1] | Modelo de curso versionado y colaborativo                   | No se debe copiar código ni cursos sin compatibilidad de licencia y procedencia; LinguaForge necesita un manifiesto de curso equivalente |
| H5P            | H5P declara tecnología MIT para crear, compartir y reutilizar contenido HTML5 interactivo y responsive [2]                                                                                        | Catálogo de tipos interactivos y empaquetado de autoría     | Integrarlo exige evaluar librerías, tipos de contenido, seguridad de paquetes y accesibilidad; no se añade solo por volumen de widgets   |
| Adapt Learning | Adapt declara framework y autoría para cursos HTML5 responsivos, extensibles y distribuibles también por SCORM [3]                                                                                | Arquitectura de cursos responsivos y contribución editorial | LinguaForge ya cuenta con un runtime propio; una migración completa no es proporcional ni reduce el gate de contenido real               |

## Matriz de severidad

| Dimensión                         | Evidencia actual                                                             | Nivel actual | Brecha crítica                                                                        | Decisión                                                                                    |
| --------------------------------- | ---------------------------------------------------------------------------- | -----------: | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Integridad de producto            | Dominio público, rutas, dashboard, búsqueda, documentación y checkpoints     |   Medio-alto | Falta cobertura de contenido y aceptación prolongada por usuarios                     | Mantener mejora incremental y gates explícitos                                              |
| Currículo                         | Mapa A0–C2, rutas, módulos, cuatro ejercicios y diagnóstico inicial          |        Medio | No hay cursos completos y revisados para 90 pares                                     | Crear manifiestos y lotes curriculares; no generar cursos sin fuente                        |
| SRS y progreso                    | Persistencia de tarjetas, ratings, XP, racha, diagnóstico y pruebas          |   Medio-alto | Parámetros actuales son básicos y no están calibrados con aprendizaje real            | Medir resultados antes de cambiar algoritmo o declarar personalización avanzada             |
| Autoría y contenido abierto       | Tatoeba, Wiktionary/Kaikki y políticas de procedencia documentadas           |        Medio | Export CC0 no cubre pares completos; falta corpus de enlaces y revisión editorial     | Procesar solo lotes completos, con licencia y control de calidad                            |
| IA educativa                      | Plan de arquitectura y helper server-side disponibles                        |         Bajo | No existe aún asistente público acotado ni presupuesto/catálogo de modelo decidido    | Crear un asistente con límites, privacidad y fallback, sin actuar como autoridad pedagógica |
| Voz, imagen y vídeo               | Arquitectura offline y gates de licencia/consentimiento definidos            |         Bajo | No hay artefactos verificados ni capacidad de cómputo para vídeo local                | Mantener fuera del runtime público hasta tener recursos y revisión                          |
| Accesibilidad y UX                | Auditorías automatizadas, rutas públicas verificadas y estados honestos      |   Medio-alto | Falta revisión manual con tecnología asistiva y zoom                                  | No declarar conformidad total hasta completar revisión manual                               |
| Seguridad, privacidad y operación | Autorización, cookies, validación, pruebas y servicios externos desactivados |        Medio | Falta revisión jurídica, presupuesto de servicios, retención y tráfico representativo | Mantener correo, analítica externa y automatizaciones externas apagados                     |
| Portabilidad y comunidad          | Repositorio público, README trilingüe y licencia/documentación               |        Medio | Falta ZIP portable y procedimiento de restauración probado                            | Generar, verificar y publicar paquete sin secretos                                          |

## Conclusión de la auditoría

LinguaForge tiene una base técnica más sólida que un prototipo visual: las rutas principales están publicadas, el backend usa procedimientos tipados, el progreso y SRS son persistibles, la búsqueda no inventa resultados y las decisiones de licencia son explícitas. No supera todavía una auditoría que permita afirmar que es la plataforma open source de idiomas más completa: no hay material curricular masivo por las 90 direcciones, evaluación editorial sostenida, producción multimedia verificable, operación con tráfico real ni revisión legal final.

La comparación útil no es competir por el número de pantallas o herramientas. El objetivo verificable es combinar la autoría y comunidad de LibreLingo, la modularidad interactiva de H5P y la disciplina de curso responsivo de Adapt, preservando la trazabilidad de datos, la accesibilidad y la operación de coste mínimo.

## Evidencia reproducible de 2026-08-22

La batería `pnpm quality:check` terminó correctamente con formato Prettier, TypeScript, 30 pruebas Vitest aprobadas y 7 pruebas de integración omitidas de forma explícita por requerir infraestructura externa. El build de producción terminó correctamente; el bundle publicado localmente mide aproximadamente 0,97 MB y conserva un chunk React de 536,72 kB minificado, que debe tratarse como oportunidad de división diferida y no como un fallo ya resuelto. La auditoría de dependencias de producción no informó vulnerabilidades conocidas de severidad alta. El verificador operativo confirmó salud local, build disponible y que correo, pagos, cron externo y analítica externa continúan bloqueados; también indicó correctamente que no existe evidencia de tráfico representativo ni de presupuesto real de proveedores.

La dimensión de IA educativa avanza a nivel medio: el asistente está restringido a usuarios autenticados, tareas educativas de explicación/práctica/revisión, entrada limitada, salida limitada, aviso visible, modelo explícito y cuota diaria persistente. Todavía no se considera una tutoría personalizada completa porque no conserva contexto conversacional, no cita fuentes por respuesta, no cuenta con evaluación humana de prompts ni con datos de coste de producción.

## Referencias

[1]: https://github.com/kantord/LibreLingo "LibreLingo — repositorio oficial"
[2]: https://h5p.org/ "H5P — sitio oficial"
[3]: https://www.adaptlearning.org/ "Adapt Learning — sitio oficial"
