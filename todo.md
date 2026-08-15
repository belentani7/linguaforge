# LinguaForge — Project TODO

## Alcance funcional aprobado

- [x] Soporte para español, inglés, mandarín, hindi, árabe, portugués, bengalí, ruso, japonés y francés.
- [x] Rutas de aprendizaje bidireccionales entre cualquier par de idiomas disponibles.
- [x] Niveles progresivos MCER A1, A2, B1, B2, C1 y C2.
- [x] Evaluación diagnóstica inicial por usuario e idioma objetivo.
- [x] Ubicación automática del usuario en el nivel adecuado después del diagnóstico.
- [x] Lecciones organizadas por módulos de vocabulario, gramática, pronunciación y conversación.
- [x] Ejercicios interactivos de completar frases, relacionar elementos, traducción y opción múltiple.
- [x] Sistema de flashcards con repetición espaciada SRS.
- [x] Panel de progreso con racha diaria, lecciones completadas, XP acumulada y nivel por idioma.
- [ ] Banco de más de 1000 entradas de vocabulario y frases por par de idiomas, organizado por nivel y temática.
- [x] Autenticación de usuarios con perfil personalizable.
- [x] Selección de idioma nativo y uno o varios idiomas objetivo.
- [x] Modo de práctica libre con ejercicios aleatorios filtrables por idioma y nivel.
- [x] Diseño responsive para escritorio, tableta y móvil.
- [ ] Accesibilidad completa mediante navegación por teclado, foco visible, etiquetas y contraste adecuados.
- [x] Soporte completo de modo claro y modo oscuro.
- [x] Interfaz premium, coherente, refinada y sin fricciones.
- [x] No añadir funcionalidades fuera del alcance aprobado.

## Arquitectura y calidad

- [x] Investigar y documentar fuentes lingüísticas y del MCER antes de fijar el contenido.
- [x] Diseñar navegación, arquitectura de pantallas y estados vacíos/carga/error.
- [x] Definir modelo de datos para idiomas, rutas, niveles, módulos, lecciones, ejercicios, vocabulario, frases, progreso, diagnósticos y revisiones SRS.
- [x] Crear migraciones de base de datos y verificar el esquema.
- [x] Implementar procedimientos tRPC protegidos y públicos necesarios.
- [x] Crear pruebas Vitest para diagnóstico, progreso, SRS y consultas principales.
- [x] Verificar tipos, compilación y pruebas.
- [x] Validar visualmente escritorio y móvil.
- [x] Revisar accesibilidad y coherencia de temas claro/oscuro.
- [x] Documentar instalación, arquitectura, fuentes, licencia y contribución open source.
- [x] Crear o actualizar el repositorio público de GitHub y dejar instrucciones para publicar el sitio cuando el usuario lo confirme.

## Brechas detectadas en la revisión del MVP

- [x] Sembrar y servir desde backend el catálogo real de los diez idiomas en lugar de depender solo de la constante frontend.
- [x] Implementar selección completa de idioma origen y destino y generar/servir los pares bidireccionales válidos.
- [x] Conectar la UI de idiomas y rutas a procedimientos tRPC y a las tablas reales.
- [x] Reemplazar tarjetas clicables no semánticas por botones o enlaces accesibles y añadir soporte completo de teclado, foco y ARIA.
- [ ] Auditar navegación por teclado y contraste de todos los estados de la interfaz.
- [x] Ejecutar pruebas Vitest, verificación TypeScript y revisión visual parcial de escritorio y móvil antes del checkpoint.

## Brechas de integración y QA antes del checkpoint

- [x] Usar directamente los datos de idioma devueltos por tRPC/DB en la UI y eliminar la dependencia de nombres y etiquetas hardcodeadas.
- [x] Implementar selección completa de idioma origen y destino y consumir `languages.paths` para mostrar rutas bidireccionales reales.
- [x] Añadir procedimientos tRPC protegidos para perfil, diagnóstico, progreso, práctica y SRS, y conectar sus pantallas a datos persistidos.
- [x] Realizar QA visual de escritorio, móvil y modo oscuro en las vistas de lección, ejercicio, repaso y perfil.
- [ ] Reemplazar tarjetas interactivas por botones o enlaces semánticos y completar la auditoría de teclado, foco, ARIA y contraste.

## Brechas de persistencia e integración detectadas

- [x] Implementar persistencia real de progreso y SRS: eliminar respuestas hardcodeadas en `progress.*` y `srs.*`, guardar y leer desde la base de datos.
- [x] Conectar las vistas de perfil, diagnóstico, progreso, práctica y repaso a procedimientos tRPC reales, sustituyendo el estado/mock local.
- [x] Renderizar en la UI los datos reales devueltos por `languages.paths`, mostrando la ruta origen→destino activa.
- [x] Documentar explícitamente en README o docs cómo cambiar el repositorio privado a público cuando el usuario lo autorice.

## Consistencia del progreso

- [x] Actualizar `userLanguages` con racha, XP, lecciones completadas y nivel actual al registrar una lección.
- [x] Cubrir la transición `recordLesson` → `progress.summary` con una prueba Vitest y verificar los cambios persistidos.

## Nivel MCER derivado del progreso

- [x] Recalcular y persistir `currentLevel` en `recordLessonProgress` según el progreso acumulado del idioma.
- [x] Añadir una prueba Vitest de `recordLesson` que verifique XP, lecciones, racha y nivel MCER persistidos.

## Accesibilidad verificable pendiente

- [x] Reemplazar los interactivos no semánticos restantes, incluida la marca clickable, por botones o enlaces semánticos.
- [x] Añadir estilos visibles y consistentes de `:focus-visible` para botones, enlaces y controles interactivos en claro y oscuro.
- [ ] Completar una auditoría de teclado y ARIA en dashboard, idiomas, práctica, repaso y perfil, y corregir hallazgos verificables.

## Auditoría semántica final

- [x] Auditar todas las vistas principales para localizar cualquier interactivo no semántico restante y reemplazarlo por `<button>` o `<a>` según corresponda.
- [x] Mantener pendiente la auditoría de teclado y ARIA hasta verificar explícitamente que no quedan elementos interactivos no semánticos en dashboard, idiomas, práctica, repaso y perfil.

## Auditoría reproducible de interacción

- [x] Auditar explícitamente dashboard, idiomas, práctica, repaso, perfil, lección y ejercicio buscando cualquier `onClick`, `onKeyDown` u otro evento en elementos no semánticos.
- [x] Corregir y documentar cada hallazgo verificable indicando el reemplazo por `<button>` o `<a>`.
- [x] Añadir una verificación reproducible de accesibilidad/semántica que demuestre que no quedan interactivos no semánticos en las vistas principales.

## Evidencia de accesibilidad

- [x] Documentar en `docs/accessibility-audit.md` cada hallazgo real de semántica, archivo afectado y reemplazo aplicado.
- [x] Ampliar `scripts/audit-interactions.mjs` para cubrir `onMouseDown`, `onPointerDown` y todos los componentes principales sin exclusiones que oculten hallazgos.
- [x] Añadir una verificación reproducible adicional de accesibilidad/semántica para las vistas principales que complemente la búsqueda estática.

## Ampliación firmada por el propietario

- [x] Añadir identidad de autor y créditos de Pedro Belentani, Belentani.eu, NoiaCore.com, @belentani_ y belentani7studio@proton.me sin exponer secretos.
- [x] Definir una política de firma/autenticidad del código y documentación, con commits verificables y procedencia clara.
- [x] Diseñar un catálogo escalable de herramientas y recursos sin prometer de forma literal más de 3000 herramientas hasta disponer de inventario, licencias y mantenimiento.
- [x] Diseñar automatizaciones seguras, observables, pausables y con aprobación humana cuando impliquen correo, publicación o acciones externas.
- [ ] Integrar correo entrante y respuestas automáticas solo después de configurar proveedor, permisos, plantillas, límites y revisión humana.
- [x] Diseñar agente de IA con alcance acotado, registros, permisos mínimos, protección de datos y controles de apagado.
- [x] Incorporar generación o integración de vídeos, voces y audio con derechos, consentimiento, límites de uso y almacenamiento adecuado.
- [x] Añadir estrategia de crecimiento continuo basada en versiones, métricas, feedback y tareas programadas controlables.
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

- [x] Crear una política formal de autenticidad/procedencia con reglas de firma de commits/tags, verificación y trazabilidad, e implementar el mecanismo realmente usado por el repositorio.
- [x] Implementar un flujo real de multimedia con metadatos, almacenamiento, validación de licencia/consentimiento y consumo en UI/backend, o dejar explícitamente el alcance como diseño/documentación.
- [x] Aplicar cambios UI verificables ligados a carga cognitiva, Gestalt, branding, copy y foco visual, y validarlos con revisión visual/documentación.

## Decisión aprobada por el propietario

- [x] Adoptar jobs gestionados del backend para automatizaciones deterministas, con idempotencia, logs, límites, pausa y sin temporizadores en proceso.
- [x] Mantener correo en modo borrador y revisión humana; no activar envío automático ni conectar una bandeja externa sin credenciales y consentimiento explícitos.
- [x] Limitar el agente a consultas, propuestas y borradores; bloquear envío, publicación, borrado, cambios de secretos y acciones irreversibles.
- [x] Aceptar multimedia únicamente con licencia, fuente, consentimiento cuando proceda, metadatos y estado de revisión.
- [x] Mantener WebDev como plataforma principal y evaluar hosting reservado solo si aparece una necesidad 24/7 verificable.

## Cierre operativo pendiente

- [x] Definir e implementar una estrategia de crecimiento operativa con métricas concretas, fuentes de feedback, jobs programados controlables y evidencia verificable en código o documentación.
- [x] Añadir la base técnica de automatizaciones gestionadas: modelo de jobs, logs, pausa/reanudación e idempotencia, sin activar cron externo antes de checkpoint y despliegue.
- [x] Aplicar cambios UI adicionales y trazables para jerarquía, agrupación, copy de marca y foco visual en las vistas principales.
- [x] Realizar una validación visual/UX reproducible de dashboard, idiomas, práctica, repaso y perfil con evidencia específica.

## Ejecución real de automatizaciones pendiente

- [x] Implementar el ciclo operativo de `automationJobs`: creación, pausa/reanudación y actualización de `lastRunAt`, `lastStatus` y `lastError` desde handlers/backend.
- [x] Añadir handlers o contratos programables reales para jobs deterministas bajo `/api/scheduled/*`, con idempotencia y sin temporizadores en proceso.
- [x] Mantener la adopción de jobs gestionados como decisión de arquitectura/documentación hasta que exista ejecución real verificable en código.

## Idempotencia y pruebas de jobs pendiente

- [x] Implementar idempotencia real en `/api/scheduled/automation`, registrando y reconociendo reintentos duplicados por ejecución/taskUid antes de actualizar estado.
- [x] Añadir pruebas Vitest para `automation.createDraft`, `automation.pause/resume` y `handleAutomationHeartbeat`, incluyendo reintentos duplicados y actualización de estado.

## Cobertura real de automatizaciones pendiente

- [x] Crear pruebas Vitest para `automation.createDraft` y `automation.pause/resume`, verificando control por propietario e idempotencia básica.
- [x] Crear pruebas Vitest para `handleAutomationHeartbeat` que cubran ejecución activa, job pausado, job huérfano, error y reintento duplicado con la misma `executionKey`.
- [x] Verificar en tests que `handleAutomationHeartbeat` actualiza `lastRunAt`, `lastStatus` y `lastError` correctamente.

## Cobertura específica pendiente

- [x] Crear pruebas Vitest específicas para `automation.createDraft`, `automation.pause` y `automation.resume`, cubriendo control por propietario y contrato idempotente de entrada.
- [x] Añadir una prueba del handler que verifique explícitamente la actualización de `lastRunAt`, `lastStatus` y `lastError` mediante estado persistido o una aserción equivalente sobre la mutación.

## Idempotencia de borradores pendiente

- [x] Añadir una prueba de integración del helper de DB que ejerza `automation.createDraft` con la misma `idempotencyKey` y verifique ausencia de duplicado persistido.

## Operación de crecimiento pendiente

- [x] Implementar captura y persistencia de métricas de crecimiento como diagnóstico completado y lecciones completadas, con consulta reproducible de resumen.
- [x] Añadir un mecanismo real de feedback del usuario y documentar cómo alimenta la revisión de producto/contenido.
- [x] Conectar un handler determinista de bajo riesgo a un informe interno, con persistencia de `lastResult`, estado, logs, idempotencia y pruebas unitarias.

## Calidad del feedback pendiente

- [x] Añadir estado de carga y manejo de error en el formulario `growth.feedback`, evitando limpiar el mensaje hasta confirmar éxito.
- [x] Añadir cobertura Vitest para `growth.summary` y `growth.feedback`, verificando el conteo agregado y el contrato de persistencia.

## Verificación end-to-end de jobs pendiente

- [x] Añadir una prueba de integración para `/api/scheduled/automation` contra la capa real de base de datos o helpers persistentes, verificando `automationRuns`, `lastRunAt`, `lastStatus` y `lastError`.
- [x] Persistir o registrar de forma reproducible el resultado del informe de crecimiento y documentar dónde queda almacenado.
- [x] Mantener el alcance descrito como handler determinista con pruebas unitarias hasta disponer de verificación end-to-end real y cron desplegado.

## Evidencia de lastResult pendiente

- [x] Documentar en README o en un documento operativo que el informe del job se serializa en `automationJobs.lastResult`, junto con `lastRunAt`, `lastStatus` y `lastError`.
- [x] Añadir una prueba de integración o evidencia equivalente que verifique la escritura persistente de `lastResult` en la base de datos para `/api/scheduled/automation`.

## Publicación segura solicitada

- [x] Auditar el repositorio en busca de tokens, archivos `.env`, credenciales, dumps o datos privados antes de publicar.
- [x] Confirmar que el repositorio remoto se gestiona con la autenticación preconfigurada y no con el token pegado en el chat.
- [x] Guardar un checkpoint final revisable antes de cualquier publicación o cambio de visibilidad.
- [x] Mantener el repositorio privado hasta completar la auditoría y recibir confirmación explícita de visibilidad pública.
- [x] Recordar al propietario que la publicación del sitio se completa pulsando **Publish** en la interfaz de gestión.
- [x] Implementar una segunda verificación reproducible de accesibilidad distinta de `scripts/audit-interactions.mjs` y documentar su ejecución con resultados registrados.
- [x] Reemplazar las etiquetas de idioma todavía hardcodeadas en `Home.tsx` por datos derivados del idioma objetivo activo devuelto por `languages.list`.
- [x] Añadir una revisión reproducible que verifique que diagnóstico y repaso usan el nombre del idioma activo y no etiquetas fijas.
- [x] Corregir el error de renderizado de Home.tsx cuando `availableLanguages` aún está vacío y `selectedLanguage` es indefinido, evitando acceder a `.code` durante la carga del catálogo.
- [x] Corregir la consulta de fixture de la prueba de progreso de integración para enlazar módulos, rutas e idiomas mediante `languagePaths`.

## Estrategia de crecimiento y monetización solicitada

- [x] Investigar fuentes públicas y recursos reutilizables para adquisición, contenido, distribución y monetización de LinguaForge.
- [x] Comparar modelos de ingresos compatibles con un núcleo open source gratuito, indicando costes, riesgos, dependencia de plataformas y esfuerzo de mantenimiento.
- [x] Auditar las capacidades actuales del producto y mapear embudos de adquisición, activación, retención y conversión sin inventar métricas.
- [x] Diseñar una arquitectura de automatización persistente, idempotente, pausables y de coste mínimo, sin activar correo, pagos o publicaciones externas sin autorización.
- [x] Redactar un plan estratégico documentado con escenarios conservador, base y expansivo, métricas, experimentos y límites de afirmaciones sobre ingresos pasivos.
- [x] Persistir en DB y exponer en tRPC la selección de uno o varios idiomas objetivo por usuario, con UI para añadir/quitar objetivos y mantenerlos entre sesiones.
- [x] Añadir pruebas que verifiquen la persistencia y lectura de múltiples idiomas objetivo en perfil/resumen del usuario.
- [x] Añadir una prueba Vitest que invoque el procedimiento tRPC `progress.recordLesson` y luego consulte `progress.summary`, verificando cambios persistidos.
- [x] Mantener o complementar la prueba de helper `recordLessonProgress` con una prueba de contrato del router que cubra XP, lecciones, racha y nivel MCER desde la entrada `recordLesson`.
- [x] Hacer que la prueba opt-in de `progress.recordLesson` se omita de forma explícita cuando faltan lecciones semilla, en vez de fallar por ausencia de fixture real.
- [x] Conectar una vista real de lecciones por módulo consumiendo módulos/lecciones persistidos de DB para vocabulario, gramática, pronunciación y conversación.
- [x] Implementar y probar en UI/backend los cuatro tipos de ejercicio (`fill_blank`, `matching`, `translation`, `multiple_choice`) con flujos reales, no genéricos ni mock.
- [x] Completar la conexión tRPC de perfil, diagnóstico y repaso SRS: formularios enlazados a valores reales, mutación de diagnóstico completa y `srs.review` integrado en la sesión de repaso.
- [x] Realizar QA visual reproducible de escritorio, móvil y modo oscuro en lección, ejercicio, repaso y perfil, documentando hallazgos y correcciones.
- [x] Aplicar y documentar mejoras UI adicionales de jerarquía, agrupación, copy de marca y foco visual en las vistas principales antes de declarar la interfaz premium completa.
- [ ] Completar la auditoría de teclado, foco, ARIA y contraste en todas las vistas para respaldar la afirmación de experiencia sin fricciones.
- [ ] Completar una auditoría reproducible de teclado y ARIA para dashboard, idiomas, práctica, repaso y perfil, verificando orden de tabulación, activación por teclado, nombres accesibles y estados ARIA donde apliquen.
- [x] Documentar en `docs/accessibility-audit.md` la cobertura exacta por vista de la auditoría de teclado/ARIA y los resultados reproducibles.
- [x] Añadir verificaciones automatizadas adicionales para las vistas principales que cubran contratos ARIA/teclado más allá de interactivos no semánticos.
- [x] Reducir el chunk JavaScript principal de producción o documentar una estrategia de code splitting, porque `pnpm build` advierte que el bundle minificado supera 500 kB.
- [x] Eliminar los fallbacks mock restantes en práctica y repaso, o convertirlos en estados vacíos reales con copy explícita cuando la base no tenga ejercicios/tarjetas.
- [x] Conectar el mapa de progreso y la lección recomendada a datos persistidos en lugar de mantener `LEVELS` y bloques fijos cuando existan datos backend.
- [x] Aplicar mejoras UI verificables adicionales en dashboard, idiomas, práctica, repaso y perfil, y documentarlas con evidencia por vista.
- [x] Realizar y documentar QA visual reproducible de escritorio, móvil y modo oscuro para lección, ejercicio, repaso y perfil antes de cerrar las mejoras UX.
- [x] Corregir la selección de respuesta de práctica para no leer `currentExercise.answer` cuando no existen ejercicios backend y se muestra el estado vacío.
- [x] Ajustar el contrato de `LessonView` para aceptar correctamente campos nullable de lecciones persistidas sin ocultar su estado vacío.

## Decisiones recibidas en pasted_content_2.txt

- [x] Verificar licencias y formatos de Tatoeba, Wiktionary/Kaikki, Mozilla Common Voice, Project Gutenberg y LibreLingo antes de importar cualquier contenido.
- [x] Crear `CREDITS.md` o equivalente con fuente, licencia, versión, fecha de importación y transformaciones de cada activo lingüístico.
- [x] Importar un primer lote pequeño y reproducible de contenido abierto, con validación de licencia y sin usar material propietario, antes de ampliar el banco masivo.
- [x] Mantener correo desactivado hasta configurar un proveedor mediante la interfaz segura; limitarlo a verificación y newsletter mensual opt-in con baja y límites.
- [x] Mantener pagos desactivados ahora; documentar gates de donaciones cuando exista tracción y de premium solo tras demanda verificable.
- [x] Mantener la publicación del sitio bajo acción manual **Publish** y no desplegar Netlify, Vercel u otros proveedores externos.
- [x] Actualizar la estrategia de crecimiento para priorizar SEO orgánico, contenido abierto y comunidad antes que ingresos.
- [x] Adaptar `scripts/validate-content.mjs` para validar JSONL y el campo `levelCode`, conservando comprobación de licencia, URLs, duplicados y umbral de cobertura sin tratar un lote piloto como cobertura productiva completa.
- [x] Documentar contrato de correo mínimo: verificación de cuenta y newsletter mensual opt-in, con baja, límites, consentimiento y proveedor desacoplado; mantener todos los envíos desactivados hasta configurar credenciales seguras.
- [x] Corregir las rutas directas de QA para que las vistas de perfil, práctica y repaso no devuelvan 404 al abrirse por URL y mantengan sus escapes de navegación.
- [x] Capturar y documentar evidencia visual/UX reproducible de la vista de idiomas en escritorio y móvil, incluyendo selección origen/destino y estados relevantes, antes de cerrar la validación visual global.
- [x] Actualizar `docs/ui-qa.md` con una matriz específica para la vista de idiomas y los hallazgos/correcciones observados durante el recorrido manual.
- [x] Eliminar en Home.tsx los fallbacks visuales hardcodeados de lecciones recomendadas, contador de ejercicios y métricas de retención/revisiones cuando no existan datos persistidos; mostrar estados vacíos honestos.
- [x] Crear una lección A1 trazable para español→inglés y cuatro ejercicios (`fill_blank`, `matching`, `translation`, `multiple_choice`) derivados exclusivamente de entradas Tatoeba verificadas, y probar su consulta por nivel.
- [x] Actualizar la prueba de aprendizaje que esperaba práctica vacía para reflejar la fixture real A1 español→inglés y comprobar sus cuatro tipos persistidos.
- [x] Consolidar un checklist de readiness legal-operativo con privacidad, consentimiento, correo, analítica, derechos de autor, costes, límites y revisión humana; mantenerlo como gate antes de activar integraciones.
- [ ] Mantener desactivados correo, pagos, analítica externa, multimedia no verificada y automatizaciones externas; completar revisión jurídica específica por jurisdicción/proveedor con base legal, retención, consentimiento y responsable antes de activarlos.
- [ ] Ejecutar una validación operativa de producción con presupuesto de runtime/almacenamiento, límites de proveedor, rendimiento en tráfico representativo, seguridad de dependencias y procedimiento de rollback antes de afirmar capacidad.
- [x] Añadir y validar el lote inverso inglés→español derivado de las mismas cinco entradas Tatoeba, actualizar créditos y persistir la segunda dirección sin duplicados.
- [x] Ejecutar y documentar una auditoría reproducible de activación por teclado con Enter, Espacio y Escape en dashboard, idiomas, práctica, repaso y perfil.
- [x] Ampliar `scripts/audit-keyboard.mjs` o añadir una verificación equivalente para estados ARIA relevantes y comportamiento de controles dinámicos/modales en las vistas auditadas.
- [x] Sustituir la racha hardcodeada de la vista de práctica por `progress.summary.streakDays` y mostrar el valor persistido real, sin inventar actividad.
- [x] Revisar y resolver de forma compatible los avisos de seguridad transitivos restantes de Mermaid, DOMPurify, lodash y mdast antes de declarar readiness de producción; documentar cada excepción con impacto y versión.
- [x] Añadir y validar cinco entradas Tatoeba portugués→inglés en A1, persistirlas en la ruta `pt→en`, habilitar una lección inicial y registrar IDs/licencia en `CREDITS.md`.
- [x] Derivar y persistir cuatro ejercicios A1 para la nueva lección portugués→inglés usando únicamente las cinco entradas Tatoeba recién validadas, y comprobar la consulta por ruta/nivel.
- [x] Crear y ejecutar un auditor de readiness local/preview que registre tamaño de build, gates de correo/pagos/cron/analítica, healthcheck, audit de producción y rollback documentado; no sustituirá la validación con tráfico publicado.
