# Revisión de seguridad de dependencias

## Estado de la revisión

El 15 de agosto de 2026 se ejecutó `pnpm audit --prod --json` sobre el árbol de producción. La primera revisión detectó avisos críticos y altos en `fast-xml-parser`, `qs`, `nanoid` y dependencias directas antiguas. Se actualizaron `@trpc/server`, `axios`, `drizzle-orm`, `nanoid`, `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` y Express; además, el proxy de almacenamiento y los fallbacks SPA se adaptaron a Express 5 porque su nueva versión de `path-to-regexp` ya no acepta wildcards anónimos.

La auditoría posterior ya no reporta vulnerabilidades `critical` o `high` en el árbol efectivo tras actualizar el cliente/presigner AWS, `streamdown`/Mermaid y retirar intentos de eliminar componentes compilados. Puede haber avisos de severidad menor o metadatos de mantenimiento; no se marca el proyecto como libre de vulnerabilidades. Cada actualización adicional debe evaluarse por compatibilidad y repetirse con `pnpm check`, `pnpm test`, `pnpm accessibility:verify`, auditoría semántica y `pnpm build`.

## Controles operativos

El proyecto no activa correo, pagos, analítica externa ni automatizaciones externas. El uso de almacenamiento y autenticación continúa limitado a las integraciones preconfiguradas. No se deben ignorar avisos del audit con `pnpm audit --audit-level=none`, ni añadir excepciones permanentes sin registrar el paquete, versión afectada, ruta transitiva, impacto y fecha de revisión.

La revisión de dependencias no sustituye una prueba de seguridad de producción ni una revisión jurídica. La validación operativa debe incluir inventario de dependencias, límites de runtime, rollback y revisión humana antes de declarar capacidad o activar servicios externos.
