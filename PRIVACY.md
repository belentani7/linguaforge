# Privacidad y datos de aprendizaje

El producto distingue entre preferencias, progreso y práctica oral. Las preferencias de interfaz y las lecciones marcadas por invitados pueden permanecer localmente en el navegador. El progreso vinculado a cuentas requiere un servidor de sesiones y persistencia disponible. Las herramientas de CV, marcadores de biblioteca, temporizador y detector local pueden funcionar en el navegador sin envío automático de su contenido.

| Dato                         | Finalidad                                        | Tratamiento actual                                                           | Control de la persona                                                |
| ---------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Preferencia de idioma y ruta | Personalizar navegación y diagnóstico. | Preferencias de interfaz locales; los perfiles de cuenta dependen de la API. | Ajustes del sitio o diagnóstico. |
| Progreso de lecciones | Mostrar el avance y el siguiente paso. | Invitados: almacenamiento local del navegador. Cuentas: servidor disponible. | Borrar datos del sitio o gestionar sesión. |
| Mensaje al tutor | Ofrecer orientación educativa. | Invitados: guía determinista local; con sesión: solicitud al servidor. | No introducir datos sensibles ni utilizar el servicio. |
| Grabación oral | Practicar pronunciación y, si está disponible, transcribir. | Invitados: grabación y escucha en el navegador; con sesión, envío solo al pulsar transcribir. | Denegar micrófono, detener, repetir o no enviar. |
| CV y entrevista de práctica  | Preparar texto profesional.                      | Permanece local hasta imprimir o copiar.                                     | Borrar la pestaña o el texto localmente.                             |

La aplicación no está diseñada para recopilar diagnósticos, perfiles psicológicos, categorías de salud ni decisiones automatizadas de empleo. Las funciones de foco y reflexión son ayudas de interacción y no sustituyen atención profesional. Antes de una puesta en producción institucional, debe completarse una revisión jurídica de jurisdicción, retención, derechos de acceso/supresión y edad mínima aplicable.


## Limitaciones previas a la publicación institucional

Las funciones locales no requieren crear una cuenta. El backend Express/tRPC existe en el repositorio, pero el despliegue estático de Vite no debe presentarse como servidor persistente. El tutor con cuenta usa actualmente respuestas educativas deterministas, no una IA generativa confirmada. Antes de producción se necesitan revisión jurídica y comprobación de alojamiento, conservación y borrado de datos, proveedores y derechos aplicables.
