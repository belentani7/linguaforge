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


## Registro de ejecución operativa — 15 de agosto de 2026

La ejecución reproducible de `pnpm operational:readiness` en el preview/local devolvió healthcheck HTTP 200, build presente de 1,364,926 bytes (1.3 MB), gates de correo, pagos, cron externo y analítica externa bloqueados, y rollback manual condicionado a checkpoint. El script mantuvo `productionReadiness: false` porque no simula tráfico representativo publicado, presupuesto real del proveedor, límites de almacenamiento/ejecución ni revisión jurídica. Esta evidencia respalda la preparación técnica local, pero no autoriza Publish ni la activación de servicios externos.


## Matriz legal-operativa por jurisdicción — borrador para revisión profesional

> **Aviso:** este documento es un borrador técnico de preparación y no constituye asesoramiento jurídico. Un profesional cualificado debe confirmar las obligaciones aplicables según la residencia de los usuarios, la entidad responsable, los proveedores, las transferencias internacionales y las funcionalidades que finalmente se activen.

La matriz se mantiene **condicional**: LinguaForge no activa correo, analítica externa, pagos, publicidad, audio ni automatizaciones externas hasta seleccionar proveedor, definir regiones de tratamiento y aprobar textos, retención y controles.

| Ámbito | Alcance que puede afectar a LinguaForge | Evidencia mínima antes de activar | Estado |
|---|---|---|---|
| UE/EEE y España | Cuenta OAuth, progreso, preferencias, diagnóstico, SRS, feedback, newsletter y cookies/tecnologías similares si se incorporan | Inventario de datos y finalidades; base jurídica por tratamiento; información de privacidad; contratos y roles con proveedores; transferencias; retención y borrado; procedimiento de derechos; decisión sobre cookies; revisión profesional | Pendiente |
| España | Requisitos nacionales y criterios de la autoridad española sobre cookies, consentimiento y comunicaciones electrónicas, además del marco europeo aplicable | Política y banner de cookies si existen cookies no técnicas; prueba de consentimiento y retirada; textos de comunicaciones; responsable y contacto; revisión específica de AEPD | Pendiente |
| Brasil | Usuarios o tratamiento vinculado a Brasil; cuenta, progreso, feedback y newsletter | Mapa de bases legales, derechos, responsable/encargado, transferencias, retención, canal de solicitudes y revisión de ANPD/LGPD | Pendiente |
| California/EE. UU. | Aplicación solo si el alcance de usuarios, negocio o tratamiento activa obligaciones estatales; no se presupone aplicabilidad | Determinar umbrales y alcance con asesoría; inventario de categorías y finalidades; solicitudes de acceso/borrado/corrección; señales de opt-out si aplican; contratos y divulgaciones | Pendiente |
| Proveedores globales | OAuth, hosting, correo, analítica, pagos, almacenamiento y cualquier API externa | DPA/contrato, subencargados, región, transferencias, seguridad, retención, SLA, borrado, límites de coste y procedimiento de incidente | Pendiente |

### Decisiones técnicas conservadoras

Hasta que la revisión profesional confirme otra cosa, el producto debe operar con autenticación gestionada, métricas internas agregadas, sin cookies analíticas externas, sin newsletter enviada, sin correo entrante, sin pagos y sin multimedia no verificada. El feedback debe conservar únicamente el contenido y metadatos necesarios para revisión, con una política de retención y borrado que todavía debe aprobarse. La newsletter se limita al diseño opt-in mensual con baja visible; no se envía ningún mensaje en el estado actual.

### Fuentes oficiales consultadas

La [Comisión Europea sobre protección de datos](https://commission.europa.eu/law/law-topic/data-protection_en) sirve como punto de entrada al marco europeo. Para España, la [Guía sobre el uso de las cookies de la AEPD](https://www.aepd.es/guias/guia-cookies.pdf) y la nota de actualización de la [AEPD](https://www.aepd.es/prensa-y-comunicacion/notas-de-prensa/aepd-actualiza-guia-cookies-para-adaptarla-a-nuevas-directrices-cepd) son referencias de revisión. Para Brasil, la [LGPD publicada por ANPD](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/outros-documentos-e-publicacoes-institucionais/lgpd-en-lei-no-13-709-capa.pdf) y el texto legal de [Planalto](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm) son las fuentes primarias. Para California, la [CPPA sobre regulaciones](https://cppa.ca.gov/regulations/) y sus [regulaciones CCPA](https://cppa.ca.gov/regulations/consumer_privacy_act.html) son referencias condicionales. Estas fuentes no sustituyen la revisión de un profesional ni determinan por sí solas la aplicabilidad al proyecto.
