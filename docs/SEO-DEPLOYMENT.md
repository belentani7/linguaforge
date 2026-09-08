# SEO y despliegue

La aplicación genera la etiqueta canónica en el navegador con el origen real del despliegue y la ruta pública actual. De este modo, la base no publica como canónico un dominio que todavía no controla. Al asociar un dominio definitivo, se debe verificar que dicho origen sea el deseado, añadir la propiedad en las herramientas de búsqueda pertinentes y actualizar los enlaces públicos de la documentación.

| Elemento | Implementación actual | Acción antes de comunicación pública |
|---|---|---|
| Título y descripción | Metadatos HTML descriptivos por defecto. | Revisar la redacción en cada localización publicada. |
| Social cards | Open Graph y Twitter/X sin imagen inventada. | Añadir una imagen editorial propia alojada y con texto alternativo si existe un activo autorizado. |
| Canonical | Se actualiza con el origen y ruta de producción. | Confirmar el dominio final y evitar duplicados entre despliegues de prueba. |
| Datos estructurados | `EducationalOrganization` sin premios, membresías ni métricas inventadas. | Validar con una herramienta de resultados enriquecidos tras publicar. |
| Robots | `robots.txt` permite rastreo de las rutas públicas. | Ajustar cuando existan zonas privadas o un dominio canónico definitivo. |
| Sitemap | No se publica uno con URLs de dominio ficticio. | Generarlo en la etapa de despliegue con el dominio real y solo rutas indexables. |

El runtime produce una SPA, por lo que la indexación de contenido crítico puede requerir prerenderizado o migración SSR si el proyecto evoluciona hacia un catálogo público grande. Esta decisión debe tomarse tras medir necesidades de descubrimiento, no para aparentar complejidad.
