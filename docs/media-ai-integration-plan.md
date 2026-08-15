# Plan de integración multimedia e IA para LinguaForge

**Estado:** diseño aprobado para evaluación; no hay modelos externos activados en producción.

## Principio de arquitectura

LinguaForge debe mantener el aprendizaje, la procedencia de contenido y la experiencia pública en el runtime web actual. Los modelos pesados se ejecutan en un **worker offline o servicio aislado**, no dentro del contenedor web ni durante cada visita. El worker recibe una tarea aprobada, genera un artefacto, registra modelo, versión, licencia, prompt, idioma, hash, fecha y revisión humana, y solo después entrega un medio publicado a almacenamiento persistente.

| Fase | Recurso | Uso | Gate de entrada | Resultado esperado |
|---|---|---|---|---|
| 0 | Sin modelo externo | Cursos y ejercicios existentes, contenido Tatoeba trazable | Ningún proveedor adicional | Estado actual estable y barato |
| 1 | Kokoro TTS | Audio corto de frases en español, inglés, francés, hindi, japonés, mandarín y portugués; ampliar cobertura solo tras prueba | Licencia de pesos/voces, evaluación humana de prosodia y pronunciación, consentimiento de voces | Piloto de audio generado offline |
| 2 | Coqui TTS | Comparación de cobertura multilingüe, incluyendo modelos adicionales | Auditoría individual de cada modelo, dependencias Python, tamaño y calidad | Matriz de calidad por idioma; no publicación automática |
| 3 | Whisper | Pronunciación/transcripción opt-in del estudiante | Consentimiento, procesamiento local o DPA, borrado de audio y no uso como diagnóstico clínico | Feedback lingüístico limitado y explicable |
| 4 | Ollama + modelo aprobado | Borradores de explicaciones, variaciones de ejercicios y clasificación editorial | Modelo y licencia aprobados, límites de prompt, revisión humana, logs y apagado | Herramienta interna; nunca autoridad pedagógica autónoma |
| 5 | Diffusers/ComfyUI | Ilustraciones y assets de cursos, producción editorial offline | Licencia del checkpoint, dataset y custom nodes; revisión de marcas, personas y contenido | PNG/WebP optimizados con manifest de procedencia |
| 6 | Wan2.1 | Vídeos breves de apoyo o demostraciones | GPU aislada, presupuesto de almacenamiento, licencia de pesos, revisión humana y compresión | Clips editoriales, nunca generación en cada visita |

## Reglas para que la voz no sea robótica

La calidad debe medirse con un conjunto de frases paralelas por idioma y no por la descripción del modelo. La prueba debe incluir ritmo conversacional, pausas, nombres propios, números, preguntas, negación, cambios de velocidad y pares mínimos de pronunciación. Dos revisores humanos por idioma deben registrar naturalidad, inteligibilidad y errores; si no hay revisión competente para una lengua, el audio no se publica como material didáctico principal.

No se clonan voces de personas reales sin consentimiento documentado, alcance de uso, duración, retirada y prueba de identidad. Las voces sintéticas deben llevar metadatos de modelo, idioma, versión, licencia y fecha. No se usarán voces o datasets con licencia solo no comercial si el producto puede incorporar monetización futura sin una decisión jurídica separada.

## Seguridad y coste

Los endpoints de IA no se exponen directamente al navegador. El backend valida idioma, longitud, tipo de tarea, permisos, cuota y estado de revisión. Las tareas se encolan de forma idempotente; los resultados se guardan en almacenamiento de objetos con metadatos de procedencia y se sirven mediante URLs controladas. El primer despliegue debe usar lotes manuales pequeños; un job periódico solo se evaluará después de tener un proveedor, presupuesto, alertas y rollback.

La integración no debe añadir dependencias pesadas al frontend ni descargar modelos durante el build de WebDev. El runtime web conserva una ruta de fallback textual cuando no existe audio o vídeo aprobado. Esta decisión mantiene el coste mínimo y evita que una GPU, un modelo o una API externa se conviertan en un punto único de fallo.

## Fuentes GitHub

[1]: https://github.com/hexgrad/kokoro "Kokoro"
[2]: https://github.com/coqui-ai/TTS "Coqui TTS"
[3]: https://github.com/openai/whisper "Whisper"
[4]: https://github.com/ollama/ollama "Ollama"
[5]: https://github.com/huggingface/diffusers "Diffusers"
[6]: https://github.com/Comfy-Org/ComfyUI "ComfyUI"
[7]: https://github.com/Wan-Video/Wan2.1 "Wan2.1"
[8]: https://github.com/adaptlearning/adapt_framework "Adapt Framework"
