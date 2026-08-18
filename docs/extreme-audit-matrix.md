# Matriz de auditoría extrema de LinguaForge

**Propósito.** Evaluar el estado real del producto antes de considerar una exportación a un repositorio nuevo. La escala no convierte automáticamente un MVP en un producto completo: cada dimensión se puntúa de 0 a 10 con evidencia reproducible y una dimensión esencial incompleta bloquea la aprobación.

## Regla de aprobación

> Solo se puede recomendar exportación cuando backend, frontend, utilidad, relevancia, potencial e identidad alcanzan al menos 9.5/10, no existen bloqueos críticos de seguridad/licencia/producción y la evidencia de contenido corresponde al alcance que se declara. Una nota media no puede ocultar un 0 en contenido, producción o legal.

La puntuación se calcula por criterios ponderados, no por impresión visual. Un criterio sin evidencia recibe 0 en ese criterio y se marca como pendiente; no se rellena con una estimación optimista.

## Criterios

| Dimensión  | Evidencia mínima                                                                                       | Criterios de evaluación                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Backend    | `pnpm check`, suite Vitest, integración DB, revisión de autorización y errores                         | contratos, persistencia, idempotencia, validación de entradas, seguridad, observabilidad |
| Frontend   | `pnpm build`, rutas públicas, estados de carga/error/vacío, teclado, contraste, responsive, producción | montaje real, navegación, accesibilidad, rendimiento, coherencia visual, resiliencia     |
| Utilidad   | tareas educativas ejecutables con datos reales y revisión pedagógica                                   | claridad, práctica activa, SRS, feedback, diagnóstico, progreso, accesibilidad cognitiva |
| Relevancia | fuentes verificadas, cobertura por idioma/nivel/tema y evidencia de usuarios o revisión experta        | necesidad, actualidad, calidad lingüística, alineación CEFR, trazabilidad                |
| Potencial  | hipótesis medibles y límites operativos/coste documentados                                             | distribución, SEO, retención, escalabilidad, sostenibilidad, diferenciación              |
| Identidad  | README, licencia, créditos, procedencia y coherencia de marca                                          | autoría, firma, licencia, tono, neutralidad, ausencia de secretos, consistencia          |

## Bloqueos automáticos

La aprobación se detiene aunque el promedio sea alto cuando ocurre cualquiera de estas condiciones: pantalla blanca o runtime no verificado en producción; contenido declarado como completo sin banco real; dependencias o artefactos sin licencia trazable; secretos expuestos; autenticación/autorización sin prueba; datos personales o voz sin consentimiento; o una afirmación de producto que contradice la evidencia visible.

## Estado inicial conocido

| Dimensión  | Evaluación preliminar | Evidencia                                                                     | Bloqueo actual                                     |
| ---------- | --------------------: | ----------------------------------------------------------------------------- | -------------------------------------------------- |
| Backend    |                  8/10 | tipos, persistencia, tRPC, 24 pruebas; 7 pruebas de integración omitidas      | integración real y threat model                    |
| Frontend   |                  7/10 | build, preview y accesibilidad automatizada; producción tuvo error de runtime | validación pública del checkpoint actual           |
| Utilidad   |                  5/10 | SRS, diagnóstico, práctica y progreso implementados                           | contenido piloto insuficiente                      |
| Relevancia |                  4/10 | diez idiomas definidos y Tatoeba/Wiktionary documentados                      | falta cobertura real por 90 pares                  |
| Potencial  |                  6/10 | SEO, métricas, jobs diseñados y coste mínimo                                  | falta tráfico representativo y métricas de negocio |
| Identidad  |                  9/10 | README trilingüe, MIT, créditos y procedencia                                 | falta firma criptográfica completa si se exige     |

**Resultado inicial: no aprobado para exportación.** Esta decisión es provisional hasta completar la auditoría profunda, pero ya existen bloqueos objetivos en contenido y producción.

## Requisitos para cambiar la decisión

La puntuación solo puede subir mediante commits, pruebas, datos licenciados y validaciones que puedan repetirse. El export a un repositorio nuevo debe conservar historial/procedencia, excluir `.env`, tokens, logs y artefactos de build, y usar un repositorio privado por defecto hasta que el propietario confirme públicamente su visibilidad.

## Fuentes primarias utilizadas

El Consejo de Europa define seis niveles CEFR, A1–C2, mediante descriptores de capacidad y advierte que las especificaciones generales no sustituyen las descripciones de referencia específicas de cada lengua [1]. La página oficial del Companion Volume ofrece descriptores y versiones lingüísticas, incluida la española y la árabe [2]. Tatoeba publica sus descargas de texto bajo CC BY 2.0 FR, con una parte bajo CC0, pero declara que las licencias de audio son elegidas por cada contribuyente y que la corrección de las traducciones no está garantizada por intervención profesional [3] [4]. Por ello, LinguaForge puede usar esas fuentes como base trazable, pero debe filtrar, atribuir y revisar antes de convertirlas en lecciones.

## Referencias

[1]: https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions "Council of Europe — The CEFR Levels"
[2]: https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions "Council of Europe — CEFR Companion Volume"
[3]: https://tatoeba.org/en/downloads "Tatoeba — Downloads and licenses"
[4]: https://tatoeba.org/en/terms_of_use "Tatoeba — Terms of Use"

## Evidencia de frontend y utilidad observada

La revisión visual de siete rutas principales confirma que la interfaz no está vacía: dashboard, idiomas, práctica libre, repaso SRS, perfil, lección y ejercicio renderizan en el preview. La lección piloto muestra una actividad de vocabulario y el ejercicio muestra un ejercicio de completar; dashboard y práctica indican explícitamente “CONTENIDO PENDIENTE” cuando no existe una lección o ejercicio disponible. Esta transparencia mejora identidad y seguridad de producto, pero reduce utilidad y relevancia mientras no exista el banco de contenido.

El backend usa procedimientos protegidos para perfil, diagnóstico, práctica, progreso y SRS, mientras que catálogo, rutas y módulos son públicos. Las entradas numéricas, códigos de idioma, niveles y categorías se validan con Zod. La revisión de cookies añadió `SameSite=None` únicamente en HTTPS y `SameSite=Lax` en transporte local, con pruebas de regresión. Esto mejora la robustez de sesión, pero no sustituye una prueba de integración contra la base de datos de producción ni un threat model independiente.

La auditoría no encuentra evidencia suficiente para subir utilidad o relevancia por encima de los valores preliminares: la funcionalidad existe, pero la cobertura pedagógica real es pequeña. Tampoco hay datos representativos de retención, finalización, adquisición orgánica o coste por usuario que permitan elevar potencial a una puntuación de aprobación.
