# Validación operativa y límites conocidos

## Evidencia reproducible

El 15 de agosto de 2026 se ejecutaron `pnpm check`, `pnpm test`, `pnpm build`, `pnpm accessibility:verify`, `pnpm language-labels:verify` y `node scripts/audit-interactions.mjs`. TypeScript no devolvió errores; Vitest produjo 22 pruebas aprobadas y cinco pruebas de integración opt-in omitidas cuando no existen fixtures semilla; los auditores devolvieron `passed: true` y `findings: []`. La compilación de producción terminó correctamente y el directorio `dist` ocupó aproximadamente 1,4 MB.

La compilación generó chunks separados para React, React DOM, datos, UI y el código de la aplicación. El chunk más grande quedó por debajo del umbral de advertencia de Vite tras aplicar code splitting. Una búsqueda reproducible del árbol versionado no encontró el token de GitHub expuesto, claves privadas, cadenas de conexión MySQL literales ni patrones básicos de API keys. Esta comprobación no sustituye un escáner de secretos especializado ni una revisión de dependencias.

## Límites que no deben convertirse en promesas

La estabilidad productiva, las cuotas del proveedor, los costes de base de datos/almacenamiento, el comportamiento con tráfico real, la revisión jurídica y el rendimiento en dispositivos de baja gama requieren validación posterior en el entorno publicado. LinguaForge no afirma capacidad máxima, coste cero absoluto, ingresos garantizados ni disponibilidad 24/7. El cron externo, el correo automático, los pagos, los anuncios, la afiliación y el agente autónomo permanecen desactivados.

Antes de activar una integración externa se debe registrar el proveedor, la finalidad, las cuotas, el coste máximo aceptable, el responsable, el consentimiento requerido, el procedimiento de pausa y la evidencia de prueba. Antes de una publicación de producción se debe ejecutar de nuevo el build, la suite completa y una revisión manual de autenticación, privacidad, accesibilidad, errores de red y recuperación.

## Decisión actual

WebDev continúa siendo la plataforma principal. La arquitectura serverless y los jobs gestionados son adecuados para tareas idempotentes de bajo volumen; un servicio reservado solo se justificaría si aparece una necesidad verificable de ejecución continua o latencia sostenida. La publicación del sitio se realiza manualmente mediante **Publish** en la interfaz de gestión.
