# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Sin publicar] — apps/web (Next.js)

### Añadido
- 17 lecciones completas en 4 cursos: CSS moderno, Git y flujo colaborativo, Chain-of-Thought, adaptador de SDKs (OpenAI, Anthropic, Hugging Face), LangChain, RAG con Qdrant/Pinecone, CrewAI, Generative UI y observabilidad (LangSmith/Phoenix).
- Una solución de referencia por lección, verificada en la suite (134 pruebas).
- Aplicación Next.js 16 (App Router, `cacheComponents`) en `apps/web`, con Tailwind 4 y TypeScript estricto.
- Plan de estudios de 4 niveles y 8 lecciones completas en español, portugués de Brasil y catalán.
- Espacio de práctica con editor Monaco, teoría, pruebas en Web Worker (3 s de límite) y revisión en vivo.
- Tutor con streaming SSE (`POST /api/tutor`): proveedores OpenAI y Anthropic por `fetch`, con tutor local determinista cuando no hay clave.
- Revisión de código determinista (`POST /api/tutor/review`) con reglas en los tres idiomas.
- Panel de voz: sesión OpenAI Realtime con token efímero si hay clave; si no, Web Speech del navegador.
- Progreso local (XP, racha, lecciones completadas).
- Metadatos, Open Graph, JSON-LD en portada, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`.
- Pruebas Vitest (134): integridad del currículo, soluciones de referencia de cada lección, reglas de revisión, tutor local, contratos Zod, límite diario, paridad i18n, fechas de racha.
- CI `.github/workflows/web.yml`: lint, typecheck, tests y build.
- Documentación: `apps/web/README.md`, `CONTRATO_API.md`, `DEPENDENCIAS.md`, `docs/decisions/`.

### Corregido durante el desarrollo
- `VoiceTutorPanel`: sin `Math.random()` en render; `playAudioChunk` e `initAudioStream` implementados; fallback a voz del navegador si falla el audio de introducción; cambiar de idioma no reinicia la sesión.
- `CodeEditor`: el proveedor de autocompletado se registra una sola vez (antes se registraba en cada montaje con `startLineNumber` incorrecto).
- Runner de pruebas: la promesa de `AsyncFunction` se espera antes de indexar las pruebas (antes fallaba siempre).
- Lecciones inexistentes o no publicadas devuelven **404 real** (antes 200 en la primera visita, un soft 404).
- Eliminadas `runtime` y `dynamicParams` de segmentos, incompatibles con `cacheComponents`.

### Eliminado
- Hoja de ruta "próximamente": todos sus temas ya son lecciones.
- Dependencias sin uso: `next-intl`, `motion`, `@radix-ui/react-{dialog,progress,tabs,tooltip}`.
- SVG de plantilla de `create-next-app`.

### Pendiente
- Voces por idioma (es, pt-BR, ca) y clips de audio generados.
- Tests E2E (Playwright), auditoría axe, Lighthouse y pruebas responsive en navegador real.
- Llamadas reales a OpenAI / Anthropic / Realtime.

## Proyecto legado (React + Vite)

Versión anterior en la raíz del repositorio (`src/`, `client/`, `vite.config.ts`). Se mantiene sin cambios en esta fase.
