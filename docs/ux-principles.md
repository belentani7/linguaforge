# Principios de UX, percepción y marca aplicados

## Carga cognitiva

El dashboard presenta una sola acción primaria, resume cuatro métricas y separa la ruta de progreso de la siguiente lección. Esto reduce decisiones simultáneas y conserva el contexto de idioma seleccionado. Las pantallas de práctica y repaso agrupan filtros y sesión en bloques separados, con estados vacíos explícitos.

## Gestalt y percepción

La proximidad agrupa cada métrica con su etiqueta; la similitud mantiene el mismo tratamiento para niveles y tarjetas; la continuidad aparece en la secuencia A1–C2; y la figura/fondo usa superficies suaves sobre un canvas cálido para separar contenido sin bordes pesados. Los colores coral, verde y violeta se reservan para acciones o estados, no para decorar cada elemento.

## Branding

El nombre LinguaForge se presenta con una marca tipográfica y un símbolo de lenguas; el mapa de progreso funciona como metáfora central de forja y avance. El lenguaje de interfaz utiliza frases cortas y orientadas a práctica, con tono de mentor y sin prometer resultados imposibles.

## Motivación responsable

La racha, XP y niveles se muestran como información de avance y no como presión. No se usan cuenta atrás, culpa, falsas urgencias, testimonios inventados ni bloqueos artificiales. Las tarjetas de estado vacío invitan a comenzar sin simular actividad previa.

## Accesibilidad cognitiva

La navegación persistente, los títulos descriptivos, el foco visible, los botones semánticos, los labels de filtros y la consistencia entre temas claro/oscuro reducen memoria de trabajo y ambigüedad. La auditoría dinámica con lector de pantalla y usuarios reales sigue siendo una validación posterior, no se da por supuesta.

## Mejoras trazables de la iteración actual

La navegación de idiomas dejó de mostrar un contador fijo y ahora refleja el número real de objetivos persistidos del usuario. El dashboard usa el catálogo de módulos y lecciones devuelto por `learning.modules`, con fallback visual explícito únicamente cuando todavía no se ha importado contenido. La práctica diferencia campos de texto para completar/traducir, opciones semánticas para selección y una presentación específica para matching. El repaso muestra la tarjeta SRS real cuando existe y envía la valoración mediante `srs.review`; en ausencia de tarjetas, comunica el estado vacío sin simular una cola.

## Evidencia por vista

| Vista     | Cambio verificable                                                                                                                 | Estado vacío o dato real                                                                 |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Dashboard | Métricas, mapa y lección recomendada se derivan del resumen y módulos backend.                                                     | Si no hay módulos, se comunica que el contenido está pendiente.                          |
| Idiomas   | El contador de objetivos y las etiquetas provienen del perfil/catálogo persistidos.                                                | La selección evita dejar al usuario sin objetivo.                                        |
| Práctica  | Los filtros, tipos de ejercicio y estado de respuesta usan la consulta de ejercicios; el foco se mantiene en controles semánticos. | Sin ejercicios, se explica que falta contenido con licencia.                             |
| Repaso    | La tarjeta y las valoraciones proceden de la cola SRS y `srs.review`.                                                              | Sin tarjetas, se muestra una cola vacía sin textos ficticios.                            |
| Perfil    | Nombre, idioma nativo y múltiples objetivos son estados controlados y se guardan mediante tRPC.                                    | Los errores y el feedback de guardado se comunican sin borrar prematuramente el mensaje. |
