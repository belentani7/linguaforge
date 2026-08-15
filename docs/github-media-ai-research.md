# Investigación GitHub: recursos multimedia, cursos, IA y voz

**Fecha de consulta:** 15 de agosto de 2026. **Proyecto:** LinguaForge. **Criterio:** no se considera suficiente que un repositorio sea popular; deben verificarse por separado el código, los pesos/modelos, los datos de entrenamiento, las voces y los activos generados.

## Candidatos verificados

| Recurso | Función | Evidencia observada | Licencia del repositorio | Actividad/escala observada | Decisión preliminar |
|---|---|---|---|---|---|
| [Coqui TTS](https://github.com/coqui-ai/TTS) | Toolkit TTS, entrenamiento, curación e inferencia | README declara modelos listos, más de 1100 idiomas vía modelos Fairseq y XTTS con soporte multilingüe; documentación de clonación exige audio de referencia | MPL-2.0 para el repositorio; cada modelo/peso debe revisarse aparte | 45.9k estrellas; último push observado 2024-08-16 | **Candidato técnico fuerte**, pero requiere prueba de mantenimiento y revisión de licencia por modelo antes de producción |
| [Kokoro](https://github.com/hexgrad/kokoro) | TTS ligero y rápido | README declara modelo de 82M parámetros, pesos Apache y pipelines para inglés, español, francés, hindi, italiano, japonés, portugués y mandarín; usa Misaki y espeak-ng en algunos fallbacks | Apache-2.0 en repositorio/pesos según README; verificar voces/dependencias | 8.4k estrellas; último push observado 2025-08-06 | **Primera opción para un piloto local** de voces naturales de las lenguas cubiertas, con evaluación auditiva y licencia de cada voz |
| [OpenVoice](https://github.com/myshell-ai/OpenVoice) | Clonación y control de estilo de voz | README declara clonación zero-shot, control de emoción/acento/ritmo y soporte nativo V2 para inglés, español, francés, chino, japonés y coreano | MIT para V1/V2 según README | 37.1k estrellas; último push observado 2025-04-19 | **Opcional y restringido**: solo voces propias o con consentimiento escrito; no usar clonación de terceros |
| [ComfyUI](https://github.com/Comfy-Org/ComfyUI) | Orquestador local de flujos de imagen, vídeo, audio y texto | README declara API local, ejecución offline, workflows reproducibles, colas, offloading y modelos visuales/vídeo diversos | GPL-3.0 para el núcleo; modelos, custom nodes y workflows tienen licencias independientes | 127.7k estrellas; 5.8k commits; actividad muy alta | **Candidato de laboratorio/producción interna**, no copiar el núcleo dentro de la app sin revisar las obligaciones GPL; usar como servicio aislado o herramienta de autoría |
| [Wan2.1](https://github.com/Wan-Video/Wan2.1) | Generación texto-a-vídeo e imagen-a-vídeo | README declara T2V/I2V, edición, 480p/720p y modelo T2V-1.3B con requisito aproximado de 8.19 GB VRAM en su escenario descrito | Apache-2.0 en repositorio; pesos y datos deben verificarse por separado | 16.8k estrellas; 53 commits; último push observado 2026-03-05 | **Solo para generación editorial offline**; demasiado costoso para runtime web gratuito y requiere política de revisión de medios |
| [Ollama](https://github.com/ollama/ollama) | Runtime local de LLM con API REST | README declara API local, integración JS/Python, Docker y soporte de múltiples modelos; el runtime no concede automáticamente la licencia de cada modelo | MIT para runtime; cada modelo descargado tiene licencia propia | 178.5k estrellas; 5.6k commits; actividad observada 2026-08-15 | **Primera opción para prototipos privados** de agente/autoría; no exponerlo públicamente sin autenticación, límites y modelo aprobado |
| [Adapt Framework](https://github.com/adaptlearning/adapt_framework) | Autoría y entrega de cursos HTML5 responsive, multidioma y accesible | README declara soporte SCORM, xAPI, bancos de preguntas, feedback, RTL, localización y accesibilidad WAI AA | GPL-3.0 | 627 estrellas; 3.1k commits; último push observado 2026-08-04 | **Referencia de autoría**, no integración directa inicial: GPL y arquitectura distinta pueden aumentar coste de mantenimiento |

## Conclusión técnica provisional

Para LinguaForge, la combinación de menor coste y menor riesgo es: **Kokoro** para un piloto TTS local de frases cortas, **Coqui TTS** como banco de comparación para idiomas con cobertura adicional, **Ollama** solo en un entorno privado para generación de borradores y evaluación, y **ComfyUI/Wan2.1** exclusivamente como herramientas offline de producción editorial. Los cursos existentes deben seguir siendo nativos en LinguaForge; Adapt es una referencia útil para accesibilidad, localización, SCORM y bancos de preguntas, pero no debe incorporarse sin un análisis de compatibilidad y GPL.

La expresión «voz no robótica» requiere una prueba auditiva con frases paralelas de los diez idiomas, control de pronunciación, prosodia, pausas y errores de nombres propios. No se debe prometer calidad humana antes de esa prueba. La clonación de voz queda prohibida para voces de terceros sin consentimiento y documentación de derechos. Los pesos y modelos deben tener un registro independiente de licencia; la licencia MIT/Apache/GPL/MPL del repositorio no resuelve por sí sola la licencia de los pesos, datasets, voces o plugins.

## Fuentes primarias consultadas

[1]: https://github.com/coqui-ai/TTS "Coqui TTS — GitHub"
[2]: https://github.com/hexgrad/kokoro "Kokoro — GitHub"
[3]: https://github.com/myshell-ai/OpenVoice "OpenVoice — GitHub"
[4]: https://github.com/Comfy-Org/ComfyUI "ComfyUI — GitHub"
[5]: https://github.com/Wan-Video/Wan2.1 "Wan2.1 — GitHub"
[6]: https://github.com/ollama/ollama "Ollama — GitHub"
[7]: https://github.com/adaptlearning/adapt_framework "Adapt Framework — GitHub"

| [Diffusers](https://github.com/huggingface/diffusers) | Biblioteca programática para modelos de difusión de imagen, vídeo y audio | Descripción oficial declara soporte de modelos de imagen, vídeo y audio en PyTorch; permite una integración más controlada que un editor visual | Apache-2.0 para la biblioteca; cada checkpoint, modelo, dataset y dependencia debe verificarse por separado | 34.3k estrellas; último push observado 2026-08-15 | **Candidato de integración programática** si se dispone de GPU/servicio aislado; preferible a incluir ComfyUI en el runtime web |

La recomendación visual se divide en dos capas: **Diffusers** para un servicio interno reproducible y limitado, y **ComfyUI** para autoría manual/offline. Ambos requieren inventario de modelos y revisión de licencias antes de publicar cualquier imagen o vídeo.

| [Whisper](https://github.com/openai/whisper) | Reconocimiento de voz multilingüe para ejercicios de pronunciación y transcripción | Descripción oficial: reconocimiento robusto; repositorio MIT | MIT para el repositorio; revisar pesos, uso de audio y retención | 107.3k estrellas; último push observado 2026-07-28 | **Candidato opcional de STT local**, sujeto a consentimiento, borrado del audio y límites de coste/CPU |

Whisper no sustituye al TTS: puede ayudar a comparar una producción del estudiante con una frase objetivo, pero no debe convertirse en una evaluación clínica ni en una puntuación de pronunciación presentada como diagnóstico profesional.
