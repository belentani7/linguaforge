# Estrategia operativa de crecimiento

LinguaForge crecerá mediante ciclos pequeños y reversibles. El objetivo no es añadir volumen indiscriminado, sino mejorar activación, aprendizaje y retención sin degradar accesibilidad, privacidad o calidad lingüística.

| Área          | Métrica                                          | Fuente                                | Cadencia        | Umbral de revisión                                  |
| ------------- | ------------------------------------------------ | ------------------------------------- | --------------- | --------------------------------------------------- |
| Activación    | Porcentaje de usuarios que completan diagnóstico | Evento de diagnóstico                 | Semanal         | Descenso de 10% frente a la media de cuatro semanas |
| Aprendizaje   | Lecciones completadas por usuario activo         | `lessonProgress`                      | Semanal         | Descenso de 15%                                     |
| Retención     | Usuarios que vuelven en 7 días                   | Analítica agregada con consentimiento | Semanal         | Descenso de 10%                                     |
| Calidad       | Ejercicios con error reportado                   | Feedback de ejercicio                 | Semanal         | Más de 3 reportes por ejercicio                     |
| Accesibilidad | Hallazgos de teclado/contraste                   | Auditoría reproducible                | Por versión     | Cualquier regresión bloquea la entrega              |
| Contenido     | Pares que no alcanzan 1.000 entradas verificadas | `validate-content.mjs`                | Por importación | No publicar el lote                                 |

El feedback procede de reportes explícitos de usuarios, errores de ejercicios, revisiones editoriales y pruebas automatizadas. No se utilizarán reseñas, testimonios o métricas inventadas. Los cambios de producto se registran en issues y checkpoints, y cada experimento debe tener una hipótesis, una métrica y una condición de reversión.

Los jobs gestionados pueden preparar informes, validar lotes o recordar revisiones, pero comienzan en estado `draft`, pasan a `paused` ante una anomalía y no ejecutan correo, publicación ni borrado. La activación de un job requiere una programación externa aprobada y un despliegue del checkpoint correspondiente.
