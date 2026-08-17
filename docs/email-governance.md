# Gobernanza del correo de LinguaForge

**Propietario del producto:** Pedro Belentani  
**Estado:** diseño aprobado, envío desactivado  
**Última revisión:** 2026-08-15

## Decisión

LinguaForge no enviará correo mientras no exista un proveedor configurado mediante el canal seguro de secretos, una base jurídica documentada, plantillas revisadas, límites operativos y una ruta de baja verificable. La autenticación actual puede conservar el correo recibido por el proveedor de identidad para la sesión, pero eso no constituye consentimiento para comunicaciones de marketing.

El alcance permitido se limita a dos finalidades: **verificación de cuenta**, cuando sea necesaria para una cuenta local futura, y **newsletter mensual opt-in**, solicitada mediante una acción afirmativa separada. No se enviarán campañas de crecimiento automáticas, mensajes diarios de racha, recomendaciones comerciales, publicidad ni respuestas automáticas a usuarios.

## Contrato funcional previsto

| Flujo                         | Consentimiento                                  |                           Frecuencia | Estado actual              | Condición de activación                      |
| ----------------------------- | ----------------------------------------------- | -----------------------------------: | -------------------------- | -------------------------------------------- |
| Verificación de cuenta        | Necesaria para crear y proteger la cuenta local | Solo durante alta o cambio de correo | No implementado como envío | Proveedor, plantilla y token con caducidad   |
| Newsletter                    | Opt-in separado, granular y revocable           |                       Máximo mensual | No implementado como envío | Proveedor, registro de consentimiento y baja |
| Recuperación de cuenta        | Necesaria para la solicitud explícita           |                  Solo bajo solicitud | No implementado como envío | Flujo de identidad local aprobado            |
| Notificaciones de aprendizaje | No permitidas en esta fase                      |                                    0 | Bloqueado                  | Revisión posterior basada en demanda real    |

## Modelo de consentimiento

Cuando se implemente el proveedor, el sistema deberá conservar únicamente el estado necesario: dirección normalizada, finalidad, versión del texto mostrado, fecha UTC, origen de la acción, fecha de baja y estado actual. La newsletter no podrá activarse por defecto, por marcar una casilla de términos generales, por importar una lista ni por iniciar sesión con un proveedor externo. La baja deberá ser posible desde cada envío y desde el perfil, sin exigir una explicación.

Los tokens de verificación y baja deberán ser de un solo uso o estar limitados por caducidad, no deberán aparecer en logs y no deberán almacenarse en texto plano si el diseño del proveedor exige persistencia local. Las tareas de envío deberán ser idempotentes y registrar solo metadatos operativos mínimos, nunca el contenido completo de la bandeja de entrada ni credenciales.

## Proveedor y secretos

La integración se mantendrá detrás de una interfaz de proveedor. El código no deberá depender de una marca concreta ni de una API propietaria para que el proyecto pueda cambiar de servicio, permanecer sin correo o utilizar una instalación compatible con el presupuesto disponible. Antes de activar cualquier proveedor se solicitarán por la interfaz segura únicamente las variables imprescindibles, por ejemplo una clave de API, identificador de remitente y dominio verificado, si el proveedor elegido las exige.

Mientras no existan esos secretos, las funciones de envío deben devolver un estado desactivado y no realizar solicitudes de red. Los tests deberán demostrar que el modo desactivado no envía, que una newsletter sin consentimiento se rechaza y que una baja impide nuevos envíos. La activación será una decisión explícita del propietario posterior a la revisión de privacidad, costes, límites, retención, tratamiento internacional y condiciones del proveedor.

## Plantillas y revisión

Cada plantilla debe declarar su finalidad, remitente, identidad de LinguaForge, enlace de baja cuando corresponda, versión y fecha de revisión. El contenido debe ser sobrio, accesible y no manipulativo. No se utilizarán urgencia artificial, culpa por perder rachas, perfiles sensibles, publicidad encubierta ni afirmaciones de certificación oficial.

## Estado verificable

Actualmente no hay proveedor de correo, secreto de proveedor, job de envío ni endpoint de newsletter activo en LinguaForge. La estrategia de crecimiento mantiene el correo en borrador y prioriza contenido abierto, SEO y comunidad. Esta especificación prepara el contrato para una futura implementación sin convertir el documento en autorización de envío.
