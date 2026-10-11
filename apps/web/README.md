# LinguaForge · web

Plataforma de aprendizaje para llevar a una persona de cero a experta en desarrollo de agentes de IA.
Next.js 16 (App Router, `cacheComponents`), React 19, Tailwind 4, TypeScript estricto.

## Qué hay hoy

- **Plan de estudios** de 4 niveles: Fundamentos Web para IA · Prompting y conexión a modelos · Arquitectura de agentes · Producción y escala.
- **8 lecciones completas** (dos por nivel) en español, portugués de Brasil y catalán. La hoja de ruta tiene 9 elementos: la lección restante del nivel 3 aparece como "próximamente".
- **Espacio de práctica**: editor Monaco, teoría en un idioma, código en otro y chat en un tercero (aprendizaje cruzado).
- **Pruebas en el navegador** en un Web Worker con límite de 3 s.
- **Revisión en vivo** línea por línea (reglas deterministas: `var`, `==`, `fetch` sin `await`, claves de API escritas en el código, etc.).
- **Tutor** con streaming SSE. Usa OpenAI o Anthropic si hay clave en el servidor; si no, un tutor local determinista (pistas escalonadas, nunca la solución completa).
- **Voz**: sesión con OpenAI Realtime si hay `OPENAI_API_KEY`; sin clave, voz nativa del navegador (Web Speech) con texto como respaldo.
- **Progreso** local (XP, racha, lecciones completadas) con Zustand.

## Puesta en marcha

```bash
cd apps/web
npm ci
npm run dev            # http://localhost:3000
```

Sin ninguna clave de API la aplicación funciona completa en modo local.

## Variables de entorno (todas opcionales, solo servidor salvo `NEXT_PUBLIC_*`)

| Variable | Uso |
| --- | --- |
| `TUTOR_PROVIDER` | Fuerza `openai`, `anthropic` o `local`. |
| `OPENAI_API_KEY` | Chat con `OPENAI_MODEL` (por defecto `gpt-4o`) y voz Realtime (`OPENAI_REALTIME_MODEL`, `OPENAI_REALTIME_VOICE`). |
| `ANTHROPIC_API_KEY` | Chat con `ANTHROPIC_MODEL` (por defecto `claude-3-5-sonnet-latest`). |
| `TUTOR_DAILY_LIMIT` | Mensajes diarios por cliente (por defecto 200). |
| `NEXT_PUBLIC_SITE_URL` | URL pública para metadatos, sitemap y robots. |

Las claves nunca llegan al navegador.

## Scripts

| Script | Qué hace |
| --- | --- |
| `npm run lint` | ESLint 9 (flat config con `eslint-config-next`, que incluye reglas jsx-a11y). |
| `npm run typecheck` | `tsc --noEmit` en modo estricto. |
| `npm test` | Vitest: currículo, soluciones de referencia, revisión, tutor local, contratos, límite diario, i18n. |
| `npm run build` | Build de producción con prerender de portada, plan de estudios, lecciones publicadas y `robots`/`sitemap`. |

## Estructura

```
src/
  app/            rutas (App Router), API (/api/courses, /api/tutor*), proxy.ts (404 real)
  content/        currículo y tipos (ES/PT-BR/CA)
  components/     workspace, tutor, voz, catálogo, panel, UI
  lib/
    tutor/        proveedores, tutor local, revisión, límite diario, cliente SSE
    voice/        Realtime, Web Speech, instrucciones de sesión
    sandbox/      runner de pruebas (Worker)
    i18n.ts       diccionario de interfaz
  store/          Zustand (progreso, IA, preferencias)
tests/            Vitest (incluye soluciones de referencia de cada lección)
```

## Calidad

- Pruebas unitarias y de contenido: `npm test` (78 pruebas).
- Cada lección publicada tiene una solución de referencia en `tests/solutions.ts`, que debe pasar sus pruebas, y el código inicial debe fallar: así se evita que una lección sea trivial o imposible.
- Accesibilidad: enlace de salto, idioma del `<html>` sincronizado, etiquetas en controles, `prefers-reduced-motion`.

### Pendiente de verificar (no hay navegador ni claves en el entorno de desarrollo)

- Pruebas E2E con Playwright y auditoría axe en navegador real.
- Lighthouse ≥ 95 y responsive 360/768/1024/1440.
- Llamadas reales a OpenAI, Anthropic y OpenAI Realtime (solo verificadas la ruta local y la rama sin clave).
- Voz humana: los clips de audio por idioma aún no están generados.

## Licencia

MIT. Proyecto original de Pedro Belentani; ver `LICENSE` en la raíz.
