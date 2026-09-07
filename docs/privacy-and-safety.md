# Privacidad y seguridad operativa

LinguaForge adopta una arquitectura de mínimo privilegio. La aplicación no envía correos, publica contenido ni ejecuta acciones externas de forma autónoma por defecto. Los borradores, diagnósticos, preferencias y registros de ejecución deben conservar únicamente los datos necesarios para prestar el servicio y deben poder eliminarse mediante los controles del producto.

## Correo y automatización

El correo funciona en modo borrador hasta que exista un proveedor configurado, consentimiento verificable, destinatarios permitidos, límites de frecuencia, registro de auditoría y una aprobación humana. Ningún secreto se almacena en el repositorio, en el frontend o en `todo.md`. Los jobs programados se identifican por `taskUid` y una clave de ejecución idempotente; los reintentos duplicados se reconocen sin volver a ejecutar efectos externos.

## Contenido y multimedia

Cada audio, voz, vídeo o imagen debe registrar licencia, fuente, MIME, idioma, estado de consentimiento y estado editorial antes de aparecer en la interfaz pública. Los bytes se almacenan fuera de la base de datos; la base solo conserva metadatos y la referencia de almacenamiento. El estado `published` requiere consentimiento `verified`.

## Agente

El agente queda limitado a responder, proponer y preparar borradores. No puede cambiar secretos, publicar, borrar datos, enviar correos ni ejecutar acciones irreversibles sin una regla explícita y una revisión humana. Toda futura ampliación debe incluir límites de coste, trazabilidad y un mecanismo de apagado.

> Este documento define controles técnicos y de producto. No sustituye una revisión jurídica específica de la jurisdicción, proveedor de correo, tratamiento de voz o publicación de contenido.
