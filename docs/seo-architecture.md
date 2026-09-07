# Arquitectura SEO internacional de LinguaForge

## Objetivo

La estrategia de búsqueda de LinguaForge se basa en indexar contenido útil y localizado, no en crear páginas repetidas. Cada ruta pública de aprendizaje debe tener una URL estable, un idioma principal declarado y enlaces alternativos solo cuando exista una versión equivalente revisada.

## URL e idioma

La estructura propuesta es `/es/`, `/en/`, `/pt/`, `/zh/`, `/hi/`, `/ar/`, `/bn/`, `/ru/`, `/ja/` y `/fr/`, seguida del tipo de recurso. La aplicación actual es una SPA en español y no debe emitir `hreflang` de producción hasta que esas rutas server-rendered o prerenderizadas existan. Cuando se habiliten, cada página deberá incluir su propia etiqueta `canonical` absoluta y el conjunto completo de alternates `hreflang`, incluido `x-default`.

## Sitemap e indexabilidad

El sitemap se generará desde las rutas públicas realmente disponibles y excluirá paneles autenticados, diagnósticos personales, práctica privada, sesiones SRS y URLs con parámetros de usuario. `robots.txt` permite rastreo general y deja el sitemap pendiente hasta conocer el dominio canónico público. El proceso de publicación debe validar que todas las URLs del sitemap responden 200, tienen canonical coherente y no están bloqueadas por robots o autenticación.

## Structured data

La página raíz incluye JSON-LD de `WebSite` y `Person` con la autoría pública proporcionada. Las páginas de lección podrán añadir `Course` o `LearningResource` solo cuando tengan una URL pública estable, nombre, descripción, idioma, proveedor y contenido visible equivalentes. No se añadirán reseñas, ratings o datos de usuarios inventados.

## Plantilla de hreflang

```html
<link rel="alternate" hreflang="es" href="https://DOMINIO/es/" />
<link rel="alternate" hreflang="en" href="https://DOMINIO/en/" />
<link rel="alternate" hreflang="pt" href="https://DOMINIO/pt/" />
<link rel="alternate" hreflang="x-default" href="https://DOMINIO/" />
```

`DOMINIO` no se sustituirá hasta que el propietario confirme el dominio canónico y la publicación. La implementación deberá generar estos enlaces desde una única tabla de locales para evitar combinaciones incompletas.

## Validación

Antes de cada publicación internacional se debe comprobar el HTML renderizado, JSON-LD válido, canonical, enlaces hreflang recíprocos, sitemap accesible, robots coherente, idioma visible y ausencia de duplicación sustancial. El tráfico y la indexación se medirán con Search Console y no se afirmará una mejora de ranking sin datos comparables.

## Referencias

[1]: https://developers.google.com/search/docs/specialty/international/localized-versions "Google Search Central — Localized versions"
[2]: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites "Google Search Central — Managing multi-regional and multilingual sites"
[3]: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data "Google Search Central — Introduction to structured data"
