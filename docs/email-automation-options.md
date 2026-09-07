# Automatización de correo — decisión de arquitectura

## Recomendación inicial

La primera versión debe leer mensajes autorizados, clasificarlos y guardar un borrador interno. El envío automático queda desactivado hasta que el propietario defina categorías, destinatarios, plantillas, límites diarios, exclusiones, política de rebotes y aprobación de producción.

| Opción                                 | Ventajas                                                                          | Riesgos y límites                                                                                                                                     | Uso recomendado                                                     |
| -------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Jobs programados de GitHub Actions     | Integración sencilla con el repositorio y secretos gestionados                    | La programación puede retrasarse; el repositorio no debe ser la bandeja de datos ni el lugar donde se guarden correos; requiere OAuth/API y auditoría | Tareas de baja frecuencia, clasificación o generación de borradores |
| Jobs gestionados del backend           | Control de estado, idempotencia, logs y panel de pausa dentro del producto        | Requiere proveedor de correo, secretos y despliegue; debe respetar límites de ejecución                                                               | Clasificación recurrente y flujos de revisión de LinguaForge        |
| Ejecución local con Proton Mail Bridge | Los datos pueden permanecer en el equipo del propietario mediante IMAP/SMTP local | El equipo debe estar encendido; no es un servicio web 24/7; requiere Bridge y configuración local                                                     | Procesamiento personal y sensible bajo control manual               |
| Gmail API                              | OAuth con scopes configurables y operaciones estructuradas                        | Requiere proyecto OAuth, consentimiento, revisión de scopes y manejo cuidadoso de datos                                                               | Gmail del propietario cuando se confirme la cuenta y los permisos   |

GitHub Actions no debe considerarse un reloj de precisión para revisar correo cada 15 minutos. La arquitectura debe tolerar retrasos, reintentos e idempotencia. No se deben enviar mensajes a partir de instrucciones contenidas en el correo sin una política de confianza independiente.

## Fases de activación

Primero se almacenan solo metadatos mínimos y se genera un borrador. Después se prueba clasificación con mensajes sintéticos o autorizados. Luego se habilita una bandeja de aprobación y logs. El envío automático, si se aprueba, solo se permite para reglas de bajo riesgo con destinatarios y plantillas concretas; las respuestas complejas, legales, financieras, sensibles o ambiguas siempre quedan como borrador.

## Referencias

[1]: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule "GitHub Actions — schedule event"
[2]: https://developers.google.com/workspace/gmail/api/auth/scopes "Google Gmail API — OAuth scopes"
[3]: https://proton.me/mail/bridge "Proton Mail Bridge"
[4]: https://proton.me/support/smtp-submission "Proton Mail SMTP submission"
