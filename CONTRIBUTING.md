# Contribuir a LinguaForge

Gracias por ayudar a construir una herramienta de aprendizaje abierta y verificable. Antes de cambiar contenido o lógica, revisa `docs/fuentes-y-criterios.md` y `docs/plan-y-mapa.md`.

## Código

Usa TypeScript estricto, componentes accesibles y los componentes UI existentes cuando cubran el caso. Los controles interactivos deben poder utilizarse con teclado y mostrar un foco visible. Los cambios de backend deben mantener los contratos tRPC tipados y añadir una prueba Vitest para la lógica nueva.

## Contenido lingüístico

Cada entrada debe indicar idioma origen, idioma destino, nivel MCER, temática, ejemplo contextual, autoría o fuente y licencia. No se aceptan traducciones, audios, corpus o imágenes de licencia desconocida. Las contribuciones de contenido deben conservar la atribución requerida por la licencia de origen.

## Verificación

Antes de abrir un pull request, ejecuta:

```bash
pnpm check
pnpm test
```

Comprueba también los estados de carga, error y vacío, el tema claro y oscuro, y al menos un viewport móvil. Los pull requests deben explicar qué parte del mapa funcional modifican y qué quedó fuera de alcance.
