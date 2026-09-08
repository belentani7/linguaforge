# Auditoría de experiencia móvil

## Alcance y criterio

La revisión se realizó como un recorrido de una persona que llega a la plataforma desde un teléfono y necesita reconocer qué hacer después de cada decisión. Se verificaron las rutas de inicio, diagnóstico, programas, lección, proyecto, tutor, práctica oral, espacio personal y constancia en un viewport de **390 × 844 px**. El objetivo no fue reducir el producto a una pantalla pequeña, sino conservar un siguiente paso legible, reversible y situado.

> La plataforma ofrece apoyos de organización y aprendizaje; no evalúa condiciones clínicas, atención, bienestar ni capacidades cognitivas de una persona.

| Momento del recorrido | Fricción observada | Corrección implementada | Resultado esperado |
|---|---|---|---|
| Llegada y diagnóstico | Las lenguas podían interpretarse como el único propósito de la institución. | Se declaró el idioma como contexto de apoyo dentro de seis facultades y el diagnóstico recomienda una competencia complementaria. | La persona puede empezar por ciudadanía digital, tecnología, programación, IA o trayectoria profesional. |
| Lección | Al terminar una respuesta, el retorno directo al panel cortaba la práctica y no proponía una continuación. | La lección conserva una sección de continuación con práctica oral, tutor y avance, visible después de guardar. | La persona elige la ayuda siguiente en lugar de perder el hilo. |
| Audio | La práctica de voz requería llegar desde una actividad concreta y no había explicación de control. | Se añadió `/practica-oral` como entrada guiada y se mantiene la grabación solo por acción explícita. | La persona comprende que puede elegir, repetir y controlar el envío. |
| Material audiovisual | La lección no ofrecía una alternativa breve para comprender un proceso antes de escribir. | Se incorporó una cápsula visual controlada para ciudadanía digital, sin reproducción automática, y lectura en voz alta bajo demanda. | Se puede alternar lectura, escucha, visualización y práctica sin imponer un medio. |
| Tutor | El tutor tenía valor contextual, pero el vínculo desde la actividad podía pasar inadvertido. | Se mantuvo un acceso desde la lección y se explica el tipo de apoyo y sus límites. | La asistencia se entiende como apoyo pedagógico, no como evaluación. |
| Destinos móviles | Una entrada genérica de voz devolvía una página inexistente; un nombre legado de la primera actividad tampoco resolvía. | Se creó una página de selección de práctica oral y una compatibilidad con el enlace legado `presentarse-a1`. | No hay callejón sin salida en los accesos auditados. |

## Decisiones de medios

La lectura en voz alta utiliza la síntesis disponible en el dispositivo. No se inicia por sí sola, puede detenerse y no envía texto a un tercero. La grabación oral depende de un permiso explícito del micrófono, ofrece repetición antes del envío y se conserva solamente mediante el flujo autenticado de transcripción. La cápsula visual de seis segundos se utiliza como apoyo para el ejercicio **“Reconocer una fuente y una opinión”**: presenta la secuencia detenerse, comprobar origen y fecha, y decidir. No incluye testimonios, instrucciones legales ni datos personales.

La función audiovisual se mantiene deliberadamente breve. Su propósito es preparar una acción dentro de la lección y no aumentar el tiempo de pantalla ni sustituir materiales editoriales revisados. El vídeo tiene controles nativos, reproducción en línea y precarga de metadatos; no se reproduce automáticamente.

## Pendientes de validación con personas

La revisión confirma la estructura y la representación en navegador, no sustituye pruebas de usabilidad con estudiantes, docentes o personas usuarias de tecnologías asistivas. Antes de ampliar el catálogo audiovisual se debe comprobar, mediante sesiones consentidas, si las etiquetas, el orden de acciones, la calidad de las voces locales y los controles de transcripción resultan comprensibles en dispositivos y conexiones representativos.
