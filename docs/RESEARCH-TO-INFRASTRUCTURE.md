# De investigación a infraestructura

Este documento evita convertir referencias pedagógicas o psicológicas en notas decorativas. Cada fuente se traduce en una decisión de producto, un componente o un criterio de revisión. No se realizan afirmaciones clínicas ni se infieren diagnósticos de las personas usuarias.

| Fuente | Hallazgo relevante | Decisión de infraestructura |
|---|---|---|
| Open edX Platform | Plataforma LMS con separación de componentes, configuración y documentación; su licencia AGPL-3.0 no es compatible para copiar código en una base MIT sin una evaluación separada. | Mantener contenido, progresión, IA, voz y presentación como módulos propios y con contratos explícitos. |
| W3C COGA | Propone propósito claro, navegación clara, búsqueda, pasos claros, ayudas, reducción de distracciones, procesos que no dependan de memoria y adaptación. [1] | Añadir modo de enfoque, guardado de borradores, “siguiente paso”, búsqueda, controles de densidad y preferencias que persistan. |
| CAST UDL 3.0 | Recomienda ofrecer opciones de participación, representación, acción y expresión; incluye metas significativas, apoyo graduado y seguimiento del avance. [2] | Ofrecer respuestas escritas y orales, objetivos visibles, elección de ruta, reto de bajo riesgo y reflexión posterior a cada actividad. |
| MDN MediaRecorder y getUserMedia | La grabación requiere una acción del usuario, contexto seguro y permiso explícito. [3] [4] | Mantener captura voluntaria, aviso de privacidad, botón de detener, repetición previa al envío y límites de tamaño. |

## Principios operativos

> **Elección sin manipulación.** El sistema puede hacer visible el avance, proponer próximos pasos y conservar una racha que la persona controla, pero no introduce recompensas variables, avisos coercitivos, bloqueo artificial ni métricas diseñadas para prolongar el uso.

> **Apoyo ejecutivo sin diagnóstico.** El modo de enfoque, el desglose de tareas y la reflexión de aprendizaje reducen fricción y carga de memoria para cualquier persona. No etiquetan a la persona como TDAH, no predicen condiciones ni reemplazan apoyo profesional.

> **Narrativa con dignidad.** Las historias de demostración son escenarios de aprendizaje declarados como tales, no testimonios, usuarios, empleos, premios, financiación ni impacto atribuidos a personas reales.

## Referencias

[1]: https://www.w3.org/TR/coga-usable/ "W3C — Making Content Usable for People with Cognitive and Learning Disabilities"
[2]: https://udlguidelines.cast.org/ "CAST — Universal Design for Learning Guidelines 3.0"
[3]: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder "MDN — MediaRecorder"
[4]: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia "MDN — MediaDevices.getUserMedia()"
