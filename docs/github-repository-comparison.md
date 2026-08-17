# Comparación con el repositorio GitHub existente

## Resultado de la inspección

Se inspeccionó de forma no destructiva `belentani7/linguaforge` en GitHub. El repositorio existente es público, usa la rama `main`, contiene un commit inicial y un checkpoint de la primera entrega, y no presenta nombres de archivos que parezcan `.env`, secretos, tokens, claves privadas o credenciales. Su árbol tiene aproximadamente 131 archivos rastreados.

El estado local actual de LinguaForge contiene aproximadamente 201 archivos fuera de `node_modules`, `dist`, logs y `.git`. La diferencia no es solo un README: el estado local incorpora contenido, auditorías, scripts, migraciones, pruebas, documentación de procedencia, operaciones y la notificación local opt-in.

| Aspecto                 | Repositorio existente            | Estado local actual                                                         |
| ----------------------- | -------------------------------- | --------------------------------------------------------------------------- |
| Historial               | Bootstrap y checkpoint inicial   | Evolución posterior con QA, contenido y operación                           |
| README                  | Documentación inicial monolingüe | README nuevo preparado en português, español e inglés                       |
| Contenido               | Estructura inicial               | Tres lotes piloto Tatoeba, manifest y herramientas de validación            |
| QA                      | Pruebas iniciales                | 22 tests Vitest, accesibilidad y auditorías reproducibles ampliadas         |
| Scripts                 | Scripts de desarrollo básicos    | Validadores de contenido, auditorías y readiness operativo                  |
| Documentación           | Fuentes, plan y mapa inicial     | Procedencia, compliance, recursos GitHub, gates restantes y operación       |
| Riesgo de sobrescritura | Contenido real existente         | No se debe reemplazar sin revisión o una estrategia de integración aprobada |

## Propuesta no destructiva

La opción segura es tratar el estado local actual como la versión candidata y el repositorio existente como un remoto con historia real. Antes de actualizarlo hay que confirmar si se desea conservar el historial existente mediante una rama de integración o si se autoriza una sustitución explícita de la rama `main`. La primera alternativa preserva mejor la trazabilidad; la segunda es más simple, pero puede ocultar el historial anterior aunque no lo borre del reflog local del clon.

No se ha modificado `belentani7/linguaforge` durante esta comparación. Tampoco se ha configurado GitHub Pages ni se ha confundido el repositorio con el despliegue WebDev. La publicación del sitio sigue requiriendo el botón **Publish** del entorno WebDev.

## Recomendación

Recomiendo crear una rama `linguaforge-integration` en el repositorio existente, incorporar allí el estado local y abrir una revisión antes de cambiar `main`. Si el propietario prefiere que la versión actual reemplace directamente `main`, debe confirmarlo de forma literal porque el repositorio existente contiene más que un placeholder.
