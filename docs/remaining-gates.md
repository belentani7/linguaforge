# Gates restantes y condiciones de cierre

Este documento evita confundir preparación técnica con ejecución real. Las tareas marcadas como bloqueadas no se consideran fallos del código; requieren datos, decisiones, aprobación profesional o una acción manual fuera del agente.

| Gate | Estado técnico | Evidencia disponible | Condición verificable de cierre | Acción necesaria |
|---|---|---|---|---|
| Banco de 1000+ entradas por par | Preparado, no ejecutado masivamente | Export/pilotos Tatoeba, normalizador, validador, unificador, manifest de 10 idiomas/90 pares | Recibir un export oficial validado, ejecutar lotes trazables por par/nivel/tema, revisar duplicados/licencias y verificar cobertura | Entregar el export oficial o autorizar el archivo descargado |
| Correo de verificación/newsletter | Diseñado y bloqueado | Contratos de opt-in, borrador y revisión humana documentados | Configurar proveedor, dominio, SPF/DKIM/DMARC, plantillas, límites, supresión y pruebas | Elegir proveedor y aportar credenciales mediante configuración segura |
| Aprobación legal y privacidad | Checklist preparada, no aprobada | Matriz UE/España, Brasil y California con fuentes regulatorias y gates de consentimiento | Revisión profesional aplicable a jurisdicciones, tratamiento de audio, cookies, analítica, derechos y newsletter | Designar jurisdicciones finales y obtener revisión profesional |
| Producción publicada | No ejecutada | Readiness local: healthcheck, build, gates externos bloqueados y rollback manual | Pulsar Publish, comprobar URL pública, rendimiento, errores, almacenamiento, seguridad, rollback y tráfico real | Acción manual Publish del propietario |
| Analítica externa/pagos/automatización | Intencionadamente desactivados | Código y documentación con gates de apagado | Proveedor, finalidad, consentimiento, límites, secretos, logs, alertas y rollback aprobados | Decisión explícita por servicio; no activar por defecto |
| Lector de pantalla/zoom | Revisión manual pendiente | Auditorías CDP de 17 rutas, teclado, foco, ARIA, estados y contraste | Prueba manual con tecnologías asistivas y documentación del entorno | Ejecutar revisión manual o aportar evidencia equivalente |

## Regla de seguridad

Ningún modelo de voz, imagen, vídeo o IA se incorpora al runtime público solo porque su repositorio tenga una licencia permisiva. Antes de cada integración se deben verificar por separado el código, los pesos, las voces, los datasets, los plugins, el consentimiento, el tamaño, el coste, la seguridad y la política de retirada.
