# Checklist de readiness legal-operativo

> Documento de control técnico y de producto. No constituye asesoramiento jurídico; debe revisarlo un profesional cualificado antes de activar tratamientos o integraciones que lo requieran.

## Decisión de activación

LinguaForge permanece en modo de bajo riesgo: el correo automático, la newsletter, los pagos, la publicidad, la afiliación, el cron externo y el agente autónomo están desactivados. La publicación del sitio requiere la acción manual **Publish**. Ninguna credencial de proveedor se guarda en el repositorio, el frontend o los documentos de trabajo.

| Área | Estado actual | Gate obligatorio antes de activarla | Evidencia requerida |
|---|---|---|---|
| Cuenta y verificación | OAuth gestionado; sin correo de verificación propio | Definir proveedor, base jurídica/consentimiento, retención y baja | Plantillas aprobadas, logs sin contenido innecesario y prueba de baja |
| Newsletter | Opt-in diseñado, envío desactivado | Consentimiento granular, confirmación, baja visible, frecuencia mensual y lista de supresión | Registro de consentimiento, versión de plantilla y prueba de unsubscribe |
| Correo entrante | No conectado | Proveedor autorizado, permisos mínimos, filtrado, límites, revisión humana y apagado | Matriz de scopes, allowlist, auditoría y prueba de no-respuesta automática peligrosa |
| Analítica | Métricas internas de crecimiento | Minimización, aviso de privacidad, configuración de retención y, si aplica, consentimiento | Inventario de eventos, finalidad, retención y configuración verificable |
| Contenido lingüístico | Tatoeba piloto con licencia y procedencia | Licencia compatible, atribución, fuente, versión, fecha y transformación por lote | `CREDITS.md`, JSONL original/normalizado y salida del validador |
| Multimedia | Solo publicada con consentimiento verificado y revisión | Licencia, consentimiento cuando proceda, MIME, almacenamiento y estado editorial | Metadatos, fuente, revisión y prueba de bloqueo de estados no publicables |
| Pagos y monetización | Desactivados | Demanda verificable, proveedor, impuestos, reembolsos, términos, límites y revisión | Decisión aprobada, configuración segura y pruebas de error/reembolso |
| Automatizaciones | Jobs deterministas, pausables e idempotentes | Propietario, alcance, coste máximo, frecuencia, logs y revisión humana si hay efecto externo | `automationRuns`, `lastResult`, heartbeat y prueba de idempotencia |
| Seguridad | Secretos inyectados por entorno; repositorio auditado | Revisión de dependencias, rotación, control de acceso y plan de incidente | Resultado de escaneo, inventario de secretos y procedimiento de revocación |
| Publicación | Gate manual en WebDev | Build, tests, QA de autenticación/privacidad/accesibilidad y confirmación humana | Checkpoint, resultado de validaciones y acción manual Publish |

## Datos y retención

Solo deben conservarse los datos necesarios para autenticación, progreso, preferencias, diagnóstico, SRS, feedback y métricas agregadas de producto. Los datos de feedback y ejecución deben tener un estado de revisión y una política de retención; los bytes multimedia deben permanecer en almacenamiento de objetos y la base de datos debe contener únicamente metadatos y referencias.

## Analítica y crecimiento

Las métricas actuales se limitan a eventos internos de bajo riesgo, como diagnósticos completados, lecciones completadas y feedback enviado. No se deben presentar como tráfico, conversión o ingresos. La estrategia prioriza SEO, contenido abierto y comunidad; donaciones y premium siguen siendo gates futuros, no funcionalidades activas.

## Revisión previa a activación

Antes de activar cualquier integración externa, el propietario debe confirmar el proveedor, la finalidad, las regiones de tratamiento relevantes, los permisos, la retención, el coste máximo, el responsable, la posibilidad de pausa y la evidencia de pruebas. Cuando exista impacto legal o de privacidad, el checklist debe pasar por revisión jurídica específica. Hasta entonces, el comportamiento correcto es conservar el modo borrador o el estado desactivado y no solicitar secretos innecesarios.

## Evidencia operativa actual

`docs/privacy-and-safety.md`, `docs/email-governance.md`, `docs/email-automation-options.md`, `CREDITS.md`, `docs/content-import.md`, `docs/provenance-and-signing.md` y `docs/ops-validation.md` contienen las políticas detalladas. Las validaciones técnicas actuales incluyen TypeScript, Vitest, auditoría semántica, auditoría de interacciones, build de producción y validación trazable del lote Tatoeba. La estabilidad con tráfico real, costes del entorno publicado, obligaciones jurídicas específicas y ejecución continua siguen requiriendo validación posterior.
