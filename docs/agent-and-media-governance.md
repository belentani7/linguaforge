# Agente, vídeo y voz — gobierno operativo

## Agente de IA

El agente de LinguaForge se diseñará como un componente con herramientas explícitas, no como un proceso con acceso general al sistema. Sus permisos iniciales serán consultar catálogos, proponer ejercicios, resumir actividad y preparar borradores. No podrá enviar correo, publicar, modificar secretos, borrar datos ni cambiar reglas sin una aprobación separada.

Cada ejecución debe registrar identificador, usuario, herramientas invocadas, entradas mínimas, resultado, errores, coste operativo y decisión de aprobación. Se requieren límites de tasa, tiempo máximo, tamaño máximo de entrada, protección contra prompt injection y un interruptor de apagado. La salida del agente no se considerará una verdad clínica, legal o psicológica.

## Vídeo y voz

Los recursos de audio, voz, vídeo, subtítulos e imágenes deben conservar autoría, licencia, consentimiento de voz cuando corresponda, idioma, versión, fecha y referencia de origen. El pipeline local puede procesar materiales cuando el equipo del propietario esté encendido; el producto web solo publicará archivos que hayan pasado validación de formato, tamaño, seguridad y derechos.

La síntesis de voz no debe imitar a una persona real sin consentimiento verificable. Las voces generadas y los contenidos sintéticos deben identificarse internamente y, cuando la experiencia lo requiera, de forma visible. Los archivos grandes no deben guardarse dentro del repositorio ni en `client/public`; se usarán almacenamiento de objetos y metadatos en la base de datos.

## Estados seguros

| Estado | Acción permitida |
|---|---|
| Borrador | Crear contenido o respuesta para revisión |
| Revisado | Publicar o enviar solo si la política lo permite |
| Bloqueado | Detener por licencia, privacidad, seguridad o ambigüedad |
| Revocado | Retirar del catálogo y conservar trazabilidad mínima |
