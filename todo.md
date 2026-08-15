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
- [ ] Reemplazar tarjetas clicables no semánticas por botones o enlaces accesibles y añadir soporte completo de teclado, foco y ARIA.
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
