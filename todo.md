# LinguaForge — Project TODO

## Alcance funcional aprobado

- [x] Soporte para español, inglés, mandarín, hindi, árabe, portugués, bengalí, ruso, japonés y francés.
- [x] Rutas de aprendizaje bidireccionales entre cualquier par de idiomas disponibles.
- [x] Niveles progresivos MCER A1, A2, B1, B2, C1 y C2.
- [ ] Evaluación diagnóstica inicial por usuario e idioma objetivo.
- [ ] Ubicación automática del usuario en el nivel adecuado después del diagnóstico.
- [ ] Lecciones organizadas por módulos de vocabulario, gramática, pronunciación y conversación.
- [ ] Ejercicios interactivos de completar frases, relacionar elementos, traducción y opción múltiple.
- [ ] Sistema de flashcards con repetición espaciada SRS.
- [ ] Panel de progreso con racha diaria, lecciones completadas, XP acumulada y nivel por idioma.
- [ ] Banco de más de 1000 entradas de vocabulario y frases por par de idiomas, organizado por nivel y temática.
- [ ] Autenticación de usuarios con perfil personalizable.
- [ ] Selección de idioma nativo y uno o varios idiomas objetivo.
- [ ] Modo de práctica libre con ejercicios aleatorios filtrables por idioma y nivel.
- [x] Diseño responsive para escritorio, tableta y móvil.
- [ ] Accesibilidad completa mediante navegación por teclado, foco visible, etiquetas y contraste adecuados.
- [x] Soporte completo de modo claro y modo oscuro.
- [ ] Interfaz premium, coherente, refinada y sin fricciones.
- [x] No añadir funcionalidades fuera del alcance aprobado.

## Arquitectura y calidad

- [x] Investigar y documentar fuentes lingüísticas y del MCER antes de fijar el contenido.
- [x] Diseñar navegación, arquitectura de pantallas y estados vacíos/carga/error.
- [x] Definir modelo de datos para idiomas, rutas, niveles, módulos, lecciones, ejercicios, vocabulario, frases, progreso, diagnósticos y revisiones SRS.
- [x] Crear migraciones de base de datos y verificar el esquema.
- [x] Implementar procedimientos tRPC protegidos y públicos necesarios.
- [x] Crear pruebas Vitest para diagnóstico, progreso, SRS y consultas principales.
- [x] Verificar tipos, compilación y pruebas.
- [ ] Validar visualmente escritorio y móvil.
- [ ] Revisar accesibilidad y coherencia de temas claro/oscuro.
- [x] Documentar instalación, arquitectura, fuentes, licencia y contribución open source.
- [x] Crear o actualizar el repositorio privado de GitHub y dejar instrucciones para abrirlo al público cuando el usuario lo confirme.

## Brechas detectadas en la revisión del MVP

- [ ] Sembrar y servir desde backend el catálogo real de los diez idiomas en lugar de depender solo de la constante frontend.
- [x] Implementar selección completa de idioma origen y destino y generar/servir los pares bidireccionales válidos.
- [x] Conectar la UI de idiomas y rutas a procedimientos tRPC y a las tablas reales.
- [x] Reemplazar tarjetas clicables no semánticas por botones o enlaces accesibles y añadir soporte completo de teclado, foco y ARIA.
- [ ] Auditar navegación por teclado y contraste de todos los estados de la interfaz.
- [x] Ejecutar pruebas Vitest, verificación TypeScript y revisión visual parcial de escritorio y móvil antes del checkpoint.

## Brechas de integración y QA antes del checkpoint

- [ ] Usar directamente los datos de idioma devueltos por tRPC/DB en la UI y eliminar la dependencia de nombres y etiquetas hardcodeadas.
- [x] Implementar selección completa de idioma origen y destino y consumir `languages.paths` para mostrar rutas bidireccionales reales.
- [ ] Añadir procedimientos tRPC protegidos para perfil, diagnóstico, progreso, práctica y SRS, y conectar sus pantallas a datos persistidos.
- [ ] Realizar QA visual de escritorio, móvil y modo oscuro en las vistas de lección, ejercicio, repaso y perfil.
- [ ] Reemplazar tarjetas interactivas por botones o enlaces semánticos y completar la auditoría de teclado, foco, ARIA y contraste.

## Brechas de persistencia e integración detectadas

- [x] Implementar persistencia real de progreso y SRS: eliminar respuestas hardcodeadas en `progress.*` y `srs.*`, guardar y leer desde la base de datos.
- [ ] Conectar las vistas de perfil, diagnóstico, progreso, práctica y repaso a procedimientos tRPC reales, sustituyendo el estado/mock local.
- [x] Renderizar en la UI los datos reales devueltos por `languages.paths`, mostrando la ruta origen→destino activa.
- [x] Documentar explícitamente en README o docs cómo cambiar el repositorio privado a público cuando el usuario lo autorice.

## Consistencia del progreso

- [x] Actualizar `userLanguages` con racha, XP, lecciones completadas y nivel actual al registrar una lección.
- [ ] Cubrir la transición `recordLesson` → `progress.summary` con una prueba Vitest y verificar los cambios persistidos.

## Nivel MCER derivado del progreso

- [x] Recalcular y persistir `currentLevel` en `recordLessonProgress` según el progreso acumulado del idioma.
- [ ] Añadir una prueba Vitest de `recordLesson` que verifique XP, lecciones, racha y nivel MCER persistidos.

## Accesibilidad verificable pendiente

- [x] Reemplazar los interactivos no semánticos restantes, incluida la marca clickable, por botones o enlaces semánticos.
- [x] Añadir estilos visibles y consistentes de `:focus-visible` para botones, enlaces y controles interactivos en claro y oscuro.
- [ ] Completar una auditoría de teclado y ARIA en dashboard, idiomas, práctica, repaso y perfil, y corregir hallazgos verificables.

## Auditoría semántica final

- [x] Auditar todas las vistas principales para localizar cualquier interactivo no semántico restante y reemplazarlo por `<button>` o `<a>` según corresponda.
- [ ] Mantener pendiente la auditoría de teclado y ARIA hasta verificar explícitamente que no quedan elementos interactivos no semánticos en dashboard, idiomas, práctica, repaso y perfil.

## Auditoría reproducible de interacción

- [ ] Auditar explícitamente dashboard, idiomas, práctica, repaso, perfil, lección y ejercicio buscando cualquier `onClick`, `onKeyDown` u otro evento en elementos no semánticos.
- [x] Corregir y documentar cada hallazgo verificable indicando el reemplazo por `<button>` o `<a>`.
- [x] Añadir una verificación reproducible de accesibilidad/semántica que demuestre que no quedan interactivos no semánticos en las vistas principales.

## Evidencia de accesibilidad

- [ ] Documentar en `docs/accessibility-audit.md` cada hallazgo real de semántica, archivo afectado y reemplazo aplicado.
- [ ] Ampliar `scripts/audit-interactions.mjs` para cubrir `onMouseDown`, `onPointerDown` y todos los componentes principales sin exclusiones que oculten hallazgos.
- [ ] Añadir una verificación reproducible adicional de accesibilidad/semántica para las vistas principales que complemente la búsqueda estática.

## Ampliación firmada por el propietario

- [x] Añadir identidad de autor y créditos de Pedro Belentani, Belentani.eu, NoiaCore.com, @belentani_ y belentani7studio@proton.me sin exponer secretos.
- [x] Definir una política de firma/autenticidad del código y documentación, con commits verificables y procedencia clara.
- [ ] Diseñar un catálogo escalable de herramientas y recursos sin prometer de forma literal más de 3000 herramientas hasta disponer de inventario, licencias y mantenimiento.
- [x] Diseñar automatizaciones seguras, observables, pausables y con aprobación humana cuando impliquen correo, publicación o acciones externas.
- [ ] Integrar correo entrante y respuestas automáticas solo después de configurar proveedor, permisos, plantillas, límites y revisión humana.
- [ ] Diseñar agente de IA con alcance acotado, registros, permisos mínimos, protección de datos y controles de apagado.
- [x] Incorporar generación o integración de vídeos, voces y audio con derechos, consentimiento, límites de uso y almacenamiento adecuado.
- [ ] Añadir estrategia de crecimiento continuo basada en versiones, métricas, feedback y tareas programadas controlables.
- [x] Aplicar investigación de psicología cognitiva, percepción humana, Gestalt, branding y posicionamiento sin manipulación ni afirmaciones clínicas.
- [x] Diseñar SEO técnico, contenido multilingüe, datos estructurados, sitemap, indexabilidad y estrategia de autoridad verificable.
- [ ] Revisar privacidad, consentimiento, correo, analítica, derechos de autor y obligaciones legales aplicables antes de activar automatizaciones.
- [ ] Validar rendimiento, estabilidad, seguridad, costes, límites de servicios y capacidad real antes de afirmar "máxima capacidad".

## Evidencia de UX y SEO pendiente

- [x] Aplicar de forma verificable principios de carga cognitiva, Gestalt, branding y UX en la UI principal, y documentar los cambios concretos.
- [x] Completar un documento de arquitectura SEO con schema markup, sitemap, canonical, hreflang e indexabilidad por idioma.
- [x] Implementar o documentar con detalle reproducible el markup estructurado y la estrategia de sitemap antes de marcar SEO como completo.

## Propuestas del archivo adjunto pendientes de decisión

- [x] Registrar el archivo adjunto como propuesta de arquitectura, no como autorización automática para enviar correos, publicar contenido o ejecutar agentes.
- [x] Añadir un módulo local de notificación sonora/visual con permiso explícito del navegador, sin usarlo para acciones silenciosas o engañosas.
- [x] Comparar GitHub Actions, jobs gestionados y ejecución local para correo, considerando límites de frecuencia, secretos, trazabilidad y disponibilidad.
- [x] Definir correo en modo borrador por defecto y reservar el envío automático para reglas aprobadas, destinatarios permitidos y revisión de seguridad.
- [x] Definir el agente con permisos mínimos, registro de acciones, límites, apagado y revisión humana para casos complejos.
- [x] Documentar que el procesamiento local de vídeo/voz y la publicación automática requieren derechos, almacenamiento y un equipo local o servicio autorizado.
- [x] Adaptar la estrategia SEO adjunta a la arquitectura real de LinguaForge, sin migrar a Astro/Vercel/Netlify ni abandonar WebDev sin una decisión explícita del propietario.

## Evidencia de implementación pendiente

- [ ] Crear una política formal de autenticidad/procedencia con reglas de firma de commits/tags, verificación y trazabilidad, e implementar el mecanismo realmente usado por el repositorio.
- [ ] Implementar un flujo real de multimedia con metadatos, almacenamiento, validación de licencia/consentimiento y consumo en UI/backend, o dejar explícitamente el alcance como diseño/documentación.
- [x] Aplicar cambios UI verificables ligados a carga cognitiva, Gestalt, branding, copy y foco visual, y validarlos con revisión visual/documentación.

## Decisión aprobada por el propietario

- [ ] Adoptar jobs gestionados del backend para automatizaciones deterministas, con idempotencia, logs, límites, pausa y sin temporizadores en proceso.
- [ ] Mantener correo en modo borrador y revisión humana; no activar envío automático ni conectar una bandeja externa sin credenciales y consentimiento explícitos.
- [ ] Limitar el agente a consultas, propuestas y borradores; bloquear envío, publicación, borrado, cambios de secretos y acciones irreversibles.
- [ ] Aceptar multimedia únicamente con licencia, fuente, consentimiento cuando proceda, metadatos y estado de revisión.
- [ ] Mantener WebDev como plataforma principal y evaluar hosting reservado solo si aparece una necesidad 24/7 verificable.

## Cierre operativo pendiente

- [ ] Definir e implementar una estrategia de crecimiento operativa con métricas concretas, fuentes de feedback, jobs programados controlables y evidencia verificable en código o documentación.
- [ ] Añadir la base técnica de automatizaciones gestionadas: modelo de jobs, logs, pausa/reanudación e idempotencia, sin activar cron externo antes de checkpoint y despliegue.
- [ ] Aplicar cambios UI adicionales y trazables para jerarquía, agrupación, copy de marca y foco visual en las vistas principales.
- [ ] Realizar una validación visual/UX reproducible de dashboard, idiomas, práctica, repaso y perfil con evidencia específica.

## Ejecución real de automatizaciones pendiente

- [ ] Implementar el ciclo operativo de `automationJobs`: creación, pausa/reanudación y actualización de `lastRunAt`, `lastStatus` y `lastError` desde handlers/backend.
- [ ] Añadir handlers o contratos programables reales para jobs deterministas bajo `/api/scheduled/*`, con idempotencia y sin temporizadores en proceso.
- [x] Mantener la adopción de jobs gestionados como decisión de arquitectura/documentación hasta que exista ejecución real verificable en código.
