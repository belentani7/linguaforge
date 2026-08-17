# Auditoría de calidad de LinguaForge

**Fecha:** 2026-08-17  
**Autor del producto:** Pedro Belentani  
**Objeto:** código, pruebas, contenido, accesibilidad, seguridad operativa, licencias y recursos open source/generativos.

## Veredicto ejecutivo

LinguaForge presenta una base técnica sólida de MVP: React 19, TypeScript, tRPC, Drizzle, autenticación, persistencia de progreso/SRS, diez idiomas declarados, rutas bidireccionales, niveles MCER A1–C2, auditorías reproducibles de accesibilidad y un flujo local de notificaciones opt-in. No es técnicamente honesto afirmar que cada línea es “10/10”, que las lecciones están completas o que es la plataforma más completa del mundo. El propio sistema muestra `CONTENIDO PENDIENTE` cuando no existen módulos/lecciones importados y la cobertura masiva sigue en planificación.

La evaluación actual es **MVP avanzado, no producto completo**. Las pruebas automatizadas pasan, pero no sustituyen la revisión manual de lector de pantalla/zoom, la validación de producción, la revisión jurídica, la importación masiva de contenido ni la auditoría individual de pesos, voces, datasets y plugins de IA.

## Puntuación por dimensión

| Dimensión                  | Resultado verificable                                                                                 | Nivel actual | Bloqueo para 10/10                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------- | -----------: | ---------------------------------------------------------------------------------- |
| Arquitectura y tipos       | `pnpm check` pasa; contratos tRPC y esquema Drizzle presentes                                         |         8/10 | Falta validación completa de producción y carga real                               |
| Pruebas                    | 23 pruebas pasan; 7 de integración permanecen omitidas                                                |       7.5/10 | Faltan pruebas DB/integración ejecutadas y E2E público                             |
| Accesibilidad automatizada | 17 rutas, 1084 estados de contraste sin fallos; keyboard/dynamic/error pasan                          |       8.5/10 | Falta lector de pantalla, zoom y validación publicada                              |
| Contenido de lecciones     | Objetivo: 1000 entradas por par; piloto: 5 en es→en, en→es y pt→en                                    |         2/10 | Faltan los lotes oficiales, niveles, temas, revisión y cobertura de los 90 pares   |
| Idiomas y rutas            | 10 idiomas y 90 pares definidos en la especificación                                                  |         7/10 | Definición de rutas no equivale a contenido completo por ruta                      |
| SRS y progreso             | Persistencia y pruebas de transición implementadas                                                    |         8/10 | Falta ejercicio sostenido con datos representativos y producción                   |
| Seguridad operativa        | Auditoría de dependencias sin vulnerabilidades prod conocidas; servicios externos apagados por diseño |       7.5/10 | Falta threat model independiente, pruebas de producción y revisión legal           |
| Open source                | MIT del proyecto y fuentes Tatoeba documentadas; recursos IA inventariados                            |         7/10 | Código, pesos, voces, datasets y plugins requieren auditoría separada              |
| IA, voz, vídeo e imágenes  | Plan por fases, sin modelos externos activados en runtime                                             |         4/10 | No existe todavía integración editorial verificada ni evaluación humana por idioma |
| Producción                 | Fallback de arranque añadido; la URL publicada llegó a mostrar error de runtime                       |         3/10 | Debe comprobarse el nuevo checkpoint sin runtime/editor en producción              |

## Lecciones y contenido

Las lecciones **no están completas**. La plataforma tiene la estructura funcional para servir módulos, lecciones y ejercicios, pero el banco real no alcanza el objetivo declarado. La especificación exige 1000 entradas por cada uno de los 90 pares bidireccionales, seis niveles CEFR y cinco temas; el estado documentado solo contiene pilotos de cinco entradas para tres pares. Por tanto, no se deben presentar todas las rutas como cursos completos.

La conducta actual de mostrar “Contenido pendiente” es correcta y honesta: evita fingir una recomendación de lección que no existe. El siguiente gate debe recibir un export oficial completo, normalizarlo, deduplicarlo, conservar atribución/licencia, asignar nivel y tema con revisión humana, y comprobar cobertura antes de activar cada ruta.

## Recursos open source y generativos

El proyecto no ha instalado “el máximo” de herramientas porque hacerlo aumentaría coste, superficie de ataque y obligaciones de licencia sin mejorar necesariamente el aprendizaje. La selección documentada es deliberadamente mínima: Kokoro para un piloto TTS offline, Coqui para comparación, Whisper para transcripción opt-in, Ollama para borradores internos, Diffusers/ComfyUI para assets editoriales y Wan2.1 para vídeo offline. Ninguno debe entrar en producción solo por tener un repositorio público.

La licencia del repositorio no cubre automáticamente los pesos, voces, datasets, checkpoints ni plugins. Cada artefacto requiere una ficha de procedencia, licencia, versión, hash, consentimiento cuando proceda, evaluación de calidad, coste de almacenamiento, plan de retirada y revisión humana. El fallback textual debe permanecer disponible.

## Pruebas ejecutadas

| Comando o control                           | Resultado                                                    |
| ------------------------------------------- | ------------------------------------------------------------ |
| `pnpm check`                                | Pasa                                                         |
| `pnpm test --run`                           | 23 pasan; 7 omitidas por integración                         |
| `pnpm build`                                | Pasa                                                         |
| `pnpm content:targets:verify`               | Pasa como verificación de objetivos, no como cobertura real  |
| Auditoría keyboard/dynamic/error/validation | Pasa en el alcance automatizado                              |
| Auditoría de contraste                      | 1084 estados comprobados, 0 fallos                           |
| `pnpm audit --prod`                         | 0 vulnerabilidades reportadas; 479 dependencias analizadas   |
| Producción publicada                        | Pendiente de confirmar tras el checkpoint sin runtime/editor |

## Gates que impiden cerrar el producto

| Gate                      | Estado                         | Acción necesaria                                                     |
| ------------------------- | ------------------------------ | -------------------------------------------------------------------- |
| Banco masivo de lecciones | Abierto                        | Export oficial validado y revisión de cobertura                      |
| Producción                | Abierto                        | Publicar y comprobar el checkpoint `9c031eac`                        |
| Legal y privacidad        | Abierto                        | Revisión profesional por jurisdicción y tratamientos reales          |
| Correo                    | Intencionadamente bloqueado    | Proveedor, dominio, SPF/DKIM/DMARC, consentimiento y revisión humana |
| Lector de pantalla y zoom | Abierto                        | Prueba manual documentada                                            |
| IA multimedia             | Diseño, no integración pública | Auditoría por artefacto y piloto offline                             |

## Conclusión

La respuesta precisa a la petición de “10/10” es **no todavía**. El código y la infraestructura tienen una base notable y verificable, pero el contenido no está completo, la publicación requiere nueva comprobación y existen gates externos no resueltos. La prioridad correcta no es añadir miles de herramientas, sino completar contenido licenciado, corregir y validar producción, ejecutar pruebas reales de integración y cerrar privacidad/licencias con evidencia.

Este informe no inventa reseñas, usuarios, ratings, lecciones masivas ni resultados de modelos que no hayan sido ejecutados.

## Hallazgo adicional de formato

El nuevo comando `pnpm quality:check` no termina correctamente porque `prettier --check .` detecta 97 archivos con diferencias de formato. Tipos, pruebas y build no llegaron a ejecutarse dentro de ese comando debido al fail-fast del primer paso, aunque se habían ejecutado por separado y pasaban. No se aplicó un formateo masivo automático porque habría generado una modificación extensa no revisada; el siguiente paso recomendado es formatear por lotes pequeños y revisar cada diff.
