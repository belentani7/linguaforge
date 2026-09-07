# Paquete fuente portable de LinguaForge

Este paquete contiene el código fuente, documentación, migraciones, pruebas y bloqueos de seguridad de LinguaForge. No es un ejecutable de escritorio ni incluye una base de datos, modelos locales, credenciales, archivos `.env`, tokens, dependencias instaladas, build generado ni datos de usuarios.

## Restauración local

Instala una versión actual de Node.js y `pnpm`. Después de extraer el archivo, entra en la carpeta del proyecto y ejecuta los siguientes comandos:

```bash
pnpm install --frozen-lockfile
pnpm quality:check
pnpm dev
```

Para habilitar las funciones que requieren infraestructura, crea las variables de entorno que usa la plantilla: `DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `BUILT_IN_FORGE_API_URL` y `BUILT_IN_FORGE_API_KEY`. Esos valores no forman parte del paquete y deben configurarse mediante un gestor de secretos. Aplica las migraciones a una base de datos vacía siguiendo la secuencia de `drizzle/`; no se incluyen datos reales ni se debe reutilizar una base de datos de producción durante las pruebas.

## Verificación

Antes de usar el archivo, compara su hash SHA-256 con el valor indicado en el archivo `.sha256` que acompaña al ZIP. Tras instalar dependencias, `pnpm quality:check` debe completar formato, TypeScript, pruebas y build. El registro de licencias, procedencia y limitaciones está en `CREDITS.md`, `docs/remaining-gates.md` y `docs/content-import.md`.

## Límites conocidos

El paquete conserva un piloto de contenido trazable, no cursos completos para las 90 direcciones. Correo, pagos, analítica externa, automatizaciones externas, voz, imágenes y vídeo siguen desactivados o sujetos a revisión. El asistente IA requiere autenticación, un proveedor disponible y mantiene la cuota diaria documentada; no almacena los prompts ni las respuestas en su tabla de control.
