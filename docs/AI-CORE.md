# AI Core: contratos, proveedores y degradación segura

AI Core es una capa propia de aplicación. No es un nombre para un proveedor único, ni afirma que un modelo local, RAG o síntesis de voz esté activo cuando no lo está. Su función es aislar a las rutas de producto de los detalles de inferencia y permitir una sustitución explícita por configuración.

| Contrato | Implementación disponible | Respaldo | Extensión prevista |
|---|---|---|---|
| `EducationalAiProvider.complete` | Proveedor interno del entorno para tutor, revisión y práctica. | Respuesta pedagógica determinista marcada como **modo demostración**. | Adaptador compatible con endpoint OpenAI, gateway LiteLLM o motor local. |
| `SpeechToTextProvider.transcribe` | Servicio de transcripción del servidor con almacenamiento controlado. | Error claro y recuperación manual: escribir la respuesta. | Whisper local/servido u otro motor STT. |
| `TextToSpeechProvider.speak` | No conectado en esta entrega. | Lectura por tecnologías asistivas del navegador y transcripción visible. | TTS abierto o proveedor hospedado tras prueba de privacidad. |
| `KnowledgeSearchProvider.search` | Búsqueda lexical local sobre biblioteca curada. | Filtros por categoría y etiquetas. | Embeddings, RAG y ranking con fuentes y evaluación. |

La arquitectura sigue el principio de una interfaz común que popularizan gateways como LiteLLM, pero no incorpora esa dependencia ni su infraestructura. LiteLLM se referencia como patrón de interoperabilidad, no como código copiado.[1] El adaptador local garantiza que el producto se pueda explorar sin claves adicionales.

## Límites de uso educativo

El tutor recibe un máximo de contexto pedagógico: idioma de apoyo, idioma de estudio, nivel CEFR, objetivo y mensaje. No guarda por defecto el contenido conversacional como perfil, no certifica competencia, no ofrece asesoramiento individual en ámbitos de alto impacto y recuerda verificar información importante. Las solicitudes se someten a tamaño máximo y a límites diarios de disponibilidad.

La búsqueda semántica, el RAG y los agentes se mantienen como capacidades de investigación hasta que se incorporen un corpus con licencias claras, un registro de fuentes, métricas de recuperación, evaluación de errores y controles de privacidad. Ninguno de estos elementos se presenta como implementado en la interfaz actual.

## Referencias

[1]: https://github.com/BerriAI/litellm "LiteLLM — Gateway de IA de interfaz unificada"
