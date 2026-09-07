# LinguaForge — Crecimiento, gobierno e integraciones

## Principio de alcance

LinguaForge puede crecer de forma modular, pero no se debe prometer una cifra literal de herramientas, una capacidad ilimitada ni una posición garantizada en Google sin inventario, datos, presupuesto y validación. Cada integración se activará por fases, con permisos mínimos, registro de actividad, límites de frecuencia, botón de pausa y pruebas antes de producción.

## Rutas de ejecución continua

| Necesidad                        | Implementación inicial                                             | Condición para ampliar                                                        |
| -------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Tareas programadas deterministas | Jobs del backend con Heartbeat y tabla de ejecuciones              | Pasar a hosting reservado si se requiere proceso continuo                     |
| Eventos externos                 | Endpoint verificado con firma, idempotencia y reintentos limitados | Añadir cola persistente si aumenta el volumen                                 |
| Correo entrante y respuestas     | Bandeja de revisión, clasificación y borrador                      | Envío automático solo con proveedor, consentimiento y aprobación configurados |
| Agente de IA                     | Herramientas explícitas, permisos mínimos y registro de llamadas   | Separar workers y límites por usuario si crece la carga                       |
| Vídeo y voz                      | Activos con licencia, metadatos y almacenamiento externo           | Pipeline dedicado solo cuando el volumen lo justifique                        |

WebDev es suficiente para el producto y automatizaciones moderadas. Un proceso verdaderamente 24/7 o una cola persistente dentro de los límites gestionados requiere estudiar hosting reservado; una máquina externa solo debe considerarse si hacen falta Docker, control del sistema operativo o más de 1 vCPU/512 MB.

## Correo y agente

El sistema no enviará correos automáticamente por defecto. Debe guardar consentimiento, finalidad, destinatario, plantilla, versión del mensaje, resultado, rebotes y opción de cancelación. Las respuestas de un agente se tratarán primero como borradores y solo pasarán a envío automático después de una prueba supervisada y una política explícita del propietario.

El agente tendrá una lista cerrada de herramientas: consultar progreso, proponer ejercicios, redactar respuestas y registrar tareas. No podrá borrar datos, enviar comunicaciones externas, publicar contenido ni cambiar configuración sin autorización. Todas las acciones tendrán trazabilidad, límite de tasa y mecanismo de apagado.

## Psicología, percepción y marca

La experiencia aplicará principios de carga cognitiva reducida, agrupación Gestalt, jerarquía visual, consistencia, recuperación activa y repetición espaciada. Se evitarán patrones manipulativos, urgencia artificial, culpa por la racha o afirmaciones clínicas. El tono de marca será el de un taller de dominio: claro, alentador, preciso y orientado a la práctica.

La firma visible del producto podrá atribuirse a Pedro Belentani mediante créditos y metadatos públicos. Las direcciones y dominios aportados por el propietario se tratarán como identidad pública, nunca como secretos de autenticación.

## SEO multilingüe

La estrategia será medible, no una promesa de ranking: URLs estables por idioma, etiquetas `hreflang`, sitemap, canonicalización, datos estructurados válidos, contenido útil localizado, enlazado interno, rendimiento y revisión periódica en Search Console. Cada idioma necesitará contenido realmente traducido y revisado; no se crearán páginas vacías para capturar palabras clave.

Las decisiones se basan en las guías de Google para SEO y versiones localizadas [1] [2], WCAG 2.2 y accesibilidad cognitiva [3] [4], el marco de gestión de riesgos de IA de NIST [5] y la normativa europea de protección de datos aplicable al uso de correo y datos personales [6].

## Referencias

[1]: https://developers.google.com/search/docs/fundamentals/seo-starter-guide "Google Search Central — SEO Starter Guide"
[2]: https://developers.google.com/search/docs/specialty/international/localized-versions "Google Search Central — Localized Versions"
[3]: https://www.w3.org/TR/WCAG22/ "W3C — Web Content Accessibility Guidelines 2.2"
[4]: https://www.w3.org/WAI/cognitive/ "W3C — Cognitive Accessibility"
[5]: https://www.nist.gov/itl/ai-risk-management-framework "NIST — AI Risk Management Framework"
[6]: https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/legal-grounds-processing-data/can-data-received-third-party-be-used-marketing_en "European Commission — Direct marketing and personal data"

## Persistencia verificable de automatizaciones

Cada ejecución gestionada actualiza `automationJobs.lastRunAt`, `lastStatus`, `lastError` y, cuando completa el informe de crecimiento, serializa el resultado JSON en `automationJobs.lastResult`. La tabla `automationRuns` conserva además la `executionKey`, el estado de ejecución, las marcas de inicio/fin y el error asociado. La prueba opt-in `server/automation.integration.test.ts`, ejecutada con `pnpm test:integration`, verifica idempotencia de `automation.createDraft` y persistencia del heartbeat contra la base de datos real. El cron externo permanece desactivado hasta una decisión de despliegue separada.
