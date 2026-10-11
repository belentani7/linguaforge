# ANALISIS_ORIGINAL — LinguaForge

Fase 0 del prompt de recreación. Documento de diagnóstico previo a cualquier cambio de código.
Base: commit `8b777b6` de `main` (historial git superficial: 1 commit visible, clon `--depth 1`).
Fecha del análisis: 2026-10-11.

> **Hallazgo principal:** el repositorio describe una plataforma full stack (Express + tRPC 11 + Drizzle sobre MySQL/TiDB, auth Manus, scripts de validación, documentación de contenido). En el repositorio **no existen** el backend (`server/`), el esquema (`drizzle/`), la carpeta `scripts/` ni varios documentos referenciados. El frontend React sí existe pero **no compila como aplicación**. El backend no puede preservarse porque no está en el repositorio.

---

## 1. Funcionalidades prometidas (contrato propuesto)

Fuente: sección "Lo que existe hoy" del README (versiones PT/ES/EN). Estado indicado tras revisar el código disponible.

| # | Funcionalidad prometida | Estado en el código disponible |
|---|---|---|
| F1 | Rutas origen→destino persistidas y bidireccionales entre 10 idiomas (es, en, zh, hi, ar, pt, bn, ru, ja, fr) | Parcial. El catálogo está en `shared/institution.ts` (y `shared/content.ts`). La persistencia depende de `trpc.languages.paths` y `trpc.languages.list`, cuyo backend no existe. |
| F2 | Progresión CEFR A1–C2, diagnóstico inicial y recomendación de nivel | Parcial. UI y llamadas `trpc.diagnostic.start` / `trpc.diagnostic.complete`. Sin backend. |
| F3 | Lecciones: vocabulario, gramática, pronunciación y conversación | Parcial. Páginas `Lesson.tsx`, `Library.tsx`, `Programs.tsx`; llamadas `trpc.learning.modules` y `trpc.institution.lesson`. Sin backend. |
| F4 | Ejercicios: completar frases, relacionar, traducción, opción múltiple | No verificable. No hay componentes de ejercicio identificables en el código. |
| F5 | Memoria: flashcards y repetición espaciada SRS con progreso persistido | Parcial. `trpc.srs.queue` / `trpc.srs.review`. Cero uso de `localStorage` en `Home.tsx`. Sin backend. |
| F6 | Panel: racha, XP, lecciones completadas, nivel y resumen por idioma | Parcial. `trpc.progress.summary`, `Dashboard.tsx`. Sin backend. |
| F7 | Contenido: lotes piloto Tatoeba con licencia, URL, versión y atribución | Parcial. Datos en `client/public/open-data/data/*.json` (6 ficheros) y `open-data/`. Revisión de metadatos pendiente. |
| F8 | Calidad: TypeScript, Vitest, build de producción, auditorías reproducibles | **No cumplido.** `tsc --noEmit` falla con 33 errores; no hay Vitest ni tests de frontend; `tests/test_forge_smoke.py` es un smoke de Python sin relación con la app; los scripts `*:verify` / `audit-*` apuntan a `scripts/` inexistente. |
| F9 | Accesibilidad: teclado, foco, ARIA, contraste y estados verificados | **No verificable.** Las auditorías referenciadas no existen. Hay componentes Radix (accesibles de base). |
| F10 | Avisos: notificaciones locales opcionales con permiso explícito, sin correo externo | Parcial. `src/lib/notifier.ts` (47 líneas). |
| F11 | Práctica oral: captura voluntaria, transcripción en servidor y comparación con el objetivo | Parcial. `VoicePractice.tsx`, `VoiceLanding.tsx`, `trpc.voice.transcribe`. Sin backend. |
| F12 | Tutor IA: explicaciones y correcciones, llamada solo desde servidor, límite diario | Parcial. `Tutor.tsx`, `trpc.tutor.respond`, `trpc.ai.chat`. Sin backend. |
| F13 | Autenticación (Manus OAuth, cookie de sesión) y perfil de preferencias | Parcial. `useAuth.ts`, `trpc.auth.me/logout`, `trpc.profile.get/update`. Sin backend. |
| F14 | Proyectos y evidencias (`Projects`, `EvidenceRecord`, `Employment`) | Parcial. Sin backend. |
| F15 | Idioma de interfaz (es, en, pt con respaldo español) y RTL preparado | Parcial. `shared/i18n.ts`. |
| F16 | Publicación estática en GitHub Pages (`ecosistema.html`, `campus/`, `open-data/`, `magic/`) | Cumplido en estructura. `pages.yml` copia contenido estático. |
| F17 | Campus de cursos (semanas 1–4, quiz JSON, cápsulas, voces de bienvenida) | Cumplido como contenido estático en `campus/`. |
| F18 | Sin publicidad, sin pagos obligatorios, sin email/analítica externa por defecto | Declarativo. Se cumple en lo visible (no se detectan SDK de analítica en el frontend). |

Contrato inmutable propuesto: **F1, F2, F3, F5, F6, F7, F10, F16, F17, F18** como mínimo. F4, F8, F9, F11–F15 quedan como promesas que requieren decisión (ver sección 7).

---

## 2. Stack original detectado

| Capa | Declarado (README / package.json) | Realmente presente |
|---|---|---|
| Frontend | React 19, Tailwind 4, Radix UI, wouter, framer-motion, recharts | Sí en `src/` y `client/src/`. Dos árboles duplicados. |
| Bundler | Vite 7 (`vite.config.ts`) | Configurado con `root: client/`, pero `client/index.html` no carga la app React. |
| Estado / datos | TanStack Query 5, tRPC 11 (`@trpc/react-query`), superjson | Cliente sí; servidor no. |
| Formularios / validación | react-hook-form, zod 4 | Dependencias presentes; uso parcial. |
| Backend | Express 5, tRPC 11, Drizzle ORM, MySQL/TiDB | **Ausente.** `src/lib/trpc.ts` importa `../../../server/routers` (inexistente). `shared/types.ts` importa `../drizzle/schema` (inexistente). |
| Auth | Manus OAuth + cookie `COOKIE_NAME` | Cliente sí (`useAuth.ts`, `main.tsx` con Bearer desde `sessionStorage`); servidor no. |
| Almacenamiento | S3 (`@aws-sdk/client-s3`, presigner) | Dependencia presente; sin código de uso en el repo. |
| Mapas | Google Maps (`components/Map.tsx`) | Código presente; requiere variables de entorno no documentadas en `.env.example`. |
| Infra / CI | GitHub Actions (`ci.yml`, `build.yml`, `pages.yml`, `tutor-ia.yml`), Vercel (`vercel.json`) | `ci.yml` usa `|| true` en tests. `tutor-ia.yml` es un *noop* explícito. `vercel.json` apunta a `dist/public`. |
| Gestor de paquetes | pnpm 10 (`packageManager`, `pnpm-lock.yaml`) | Hay también `package-lock.json`; CI usa `npm install --legacy-peer-deps`. Dos lockfiles divergentes. |
| Licencia | MIT (LICENSE, package.json, README) | Confirmado: MIT, © 2026 Pedro Belentani. |

Verificaciones realizadas (con `npm install --ignore-scripts --legacy-peer-deps`, 481 paquetes):

- `npx tsc --noEmit` → **33 errores** (p. ej. `Cannot find module '@/components/ui/button'` en `Tutor.tsx`, `VoiceLanding.tsx`, `VoicePractice.tsx`; `Cannot find module '../drizzle/schema'` en `shared/types.ts`; múltiples `implicit any`).
- `npx vite build` → **pasa**, pero solo transforma **2 módulos** y produce `dist/public/index.html` de 14 kB. Esto significa que el build compila la landing estática `client/index.html`, **no** la aplicación React. El check verde es engañoso.
- `package.json` → script `check` = `tsc --noEmit`, que falla. `quality:check` (`pnpm format:check && pnpm check && pnpm build`) **falla** en el paso `check`.
- `npm audit` → 4 vulnerabilidades: 1 crítica (`proxy-addr` 1.1.0–2.0.7, corregible), 1 alta (`source-map-js` 1.0.0–1.2.1, corregible), 2 moderadas (`@tailwindcss/typography` / `postcss-selector-parser`, corrección implica salto mayor a 0.5.4).

---

## 3. Deudas técnicas identificadas

| ID | Deuda | Severidad |
|---|---|---|
| D1 | **Backend ausente**: `server/`, `drizzle/`, routers tRPC y auth no están en el repositorio, pero el frontend consume 23 procedimientos tRPC (`languages`, `profile`, `srs`, `progress`, `learning`, `diagnostic`, `tutor`, `voice`, `ai`, `auth`, `institution`, `media`, `practice`, `projects`, `growth`). | Crítica |
| D2 | **Frontend no compila como app**: `vite.config.ts` apunta a `client/` cuyo `index.html` es una landing; `client/src` no tiene `main.tsx` ni `App.tsx`; el `main.tsx`/`App.tsx` reales están en `src/`. | Crítica |
| D3 | **Duplicación**: `src/` y `client/src/` contienen componentes, hooks y `lib/` casi idénticos (p. ej. `lib/trpc.ts` difiere solo por el tipo `AppRouter`). Resolución de `@/` apunta a `client/src`, y `main.tsx`/`App.tsx` viven en `src/`. | Alta |
| D4 | **33 errores de TypeScript**; `strict: true` declarado pero incumplido. | Alta |
| D5 | **Tests inexistentes**: no hay Vitest ni Playwright; el único test es `tests/test_forge_smoke.py` (`Path(".").exists()`). La CI ejecuta `npm test ... || true`, por lo que nunca falla. | Alta |
| D6 | **Scripts de validación ausentes**: `content:validate`, `content:merge`, `content:targets:verify`, `accessibility:*` (8 variantes), `language-labels:verify`, `operational:readiness` apuntan a `scripts/*.mjs` inexistente. | Alta |
| D7 | **Documentación referenciada inexistente**: `CREDITS.md`, `CONTRIBUTING.md`, `docs/content-import.md`, `docs/compliance-readiness.md`. | Media |
| D8 | **Codificación rota (mojibake)** en `README.md`: texto UTF-8 interpretado como cp1252 (p. ej. `Ã¡`, `├¡`, `ÔåÆ`). Afecta a la legibilidad del README y a la atribución visible. | Media |
| D9 | **Dos gestores de paquetes**: `pnpm-lock.yaml` y `package-lock.json` conviven; CI usa npm con `--legacy-peer-deps`. | Media |
| D10 | **Dependencias sin uso visible**: `@aws-sdk/*`, `@google/maps` types, `streamdown`, `cookie`, `dotenv`, `add` y `pnpm` como dependencia de desarrollo (`add` es un paquete ajeno al propósito). | Media |
| D11 | **Vulnerabilidades**: `proxy-addr` (crítica), `source-map-js` (alta), `@tailwindcss/typography`/`postcss-selector-parser` (moderadas). | Alta (crítica/alta) |
| D12 | **CI débil**: `ci.yml` con `|| true` en tests; `build.yml` con `actions/checkout@v3` y sin pasos reales; `tutor-ia.yml` = noop. No hay Lighthouse ni auditoría a11y en CI. | Alta |
| D13 | **Variables de entorno incompletas**: `.env.example` solo tiene un comentario. Faltan `DATABASE_URL`, `JWT`/cookie, `OAUTH_*`, claves de mapas, S3, etc. | Media |
| D14 | **Estado de la landing**: `index.html` redirige con `meta refresh` a `ecosistema.html`; `client/index.html` carga GSAP y Google Fonts desde CDN externos (dependencia de terceros en el arranque, contraria a la promesa de privacidad). | Media |
| D15 | **Ficheros de depuración en producción**: `public/__manus__/debug-collector.js` y `vite-plugin-manus-runtime` (excluido solo en build de producción por condición de `argv`). | Baja |
| D16 | **Configuración de Vite acoplada a plataforma**: `allowedHosts` de `.manus*.computer` y `server.fs.deny` con plugin propietario. | Baja |
| D17 | **Ruta de publicación ambigua**: `vercel.json` (`dist/public`) y `pages.yml` (copia estática) describen dos despliegues distintos sin documentar cuál es el oficial. | Baja |
| D18 | **Procedencia de contenido no verificable**: el README promete licencia, URL, versión y atribución por lote, pero `open-data/` no contiene campos de licencia; `topics.json` muestra descargas fallidas (Tatoeba ES: HTTP 429). | Alta |

---

## 4. Dependencias obsoletas o vulnerables

Resultado de `npm audit` (registro npm, 2026-10-11):

| Severidad | Paquete | Rango afectado | Corrección |
|---|---|---|---|
| Crítica | `proxy-addr` | 1.1.0 – 2.0.7 | `npm audit fix` (dependencia transitiva de `express`) |
| Alta | `source-map-js` | 1.0.0 – 1.2.1 | `npm audit fix` |
| Moderada | `@tailwindcss/typography` | ≤0.5.4 o rango insider | Salto a 0.5.4 (semver mayor según npm); requiere verificación visual |
| Moderada | `postcss-selector-parser` | <7.1.6 | Vía `@tailwindcss/typography` |

Obsolescencia relevante (sin auditoría de CVE, pero a tener en cuenta):

- `recharts@2.15.4` — npm avisa de que las ramas 1.x y 2.x están inactivas; migrar a Recharts 3.
- `express@5` con `@types/express@4.17.21` — tipos desalineados.
- `tailwindcss@4.1` y `@tailwindcss/vite` — versión actual razonable.
- `vite@7` y `vite-plugin-manus-runtime@0.0.59` — plugin propietario de la plataforma.
- `typescript@5.9.3` — correcto.
- `npm` 10.9.8 instalado; hay versión mayor disponible (sin impacto en el proyecto).

Verificación de `pip-audit`: no aplica (sin dependencias Python reales; `tests/` solo usa la biblioteca estándar).
Verificación de `snyk`: no ejecutada (requiere credenciales; no se usan).

---

## 5. Casos de uso críticos que no pueden romperse

Derivados del README y de `docs/ARCHITECTURE.md`:

1. **Elegir origen y destino** de idioma y ver rutas bidireccionales.
2. **Diagnóstico inicial** y recomendación de nivel CEFR (sin afirmar certificación oficial).
3. **Abrir una lección** de vocabulario, gramática, pronunciación o conversación y **completarla**.
4. **Repasar con SRS**: cola de tarjetas, respuesta, siguiente revisión programada.
5. **Consultar el panel** (racha, XP, lecciones completadas, nivel).
6. **Ver la procedencia** de cada lote de contenido (licencia, URL, versión, atribución).
7. **Activar avisos locales** solo tras permiso explícito del navegador.
8. **Navegación por teclado** y foco visible en todas las rutas.
9. **Modo oscuro/claro** y responsive (360/768/1024/1440 según el prompt; a validar con el usuario).
10. **Contenido estático publicado** (`ecosistema.html`, `campus/`, `open-data/`) sin depender del backend.
11. **Tutor IA**: sin llamadas a proveedores desde el navegador; límite diario; mensaje de verificación de respuestas.
12. **Práctica oral**: grabación solo tras acción explícita del usuario; sin evaluación biométrica.

---

## 6. Obligaciones de licencia y atribución

- Código: **MIT**, © 2026 Pedro Belentani. Permite re-licenciar, pero debe conservarse el aviso de copyright y la licencia MIT.
- Contenido: el README afirma que cada lote Tatoeba conserva licencia, URL, versión y atribución, pero **en el repositorio no hay campos de licencia por lote** (búsqueda en `open-data/` sin resultados para "license"). `open-data/topics.json` registra fuentes y estado de descarga (p. ej. "Tatoeba ES" con `HTTP 429`), sin licencias. Esta promesa **no está verificada** y debe documentarse antes de declararla cumplida (ver D18).
- Los modelos/voces/recursos externos mencionados en el README (Kokoro, Coqui, Whisper, Ollama, Diffusers, ComfyUI, Wan2.1) **no están incluidos** en el repositorio y no deben activarse sin revisión.
- Atribución que debe aparecer en el README elevado: "Basado en LinguaForge por Pedro Belentani (belentani7)".

---

## 7. Decisiones que necesito del usuario antes de continuar

1. **Contrato funcional.** ¿Confirmas F1, F2, F3, F5, F6, F7, F10, F16, F17 y F18 como contrato inmutable, y F4, F8, F9, F11–F15 como promesas a cumplir en esta recreación o a dejar como roadmap?
2. **Backend.** El backend (Express + tRPC + Drizzle + Manus auth) no está en el repositorio. Opciones:
   - (a) Proporcionarme el código del backend (o acceso al repositorio/rama donde esté) para preservarlo tal cual.
   - (b) Reconstruir un backend mínimo a partir de los 23 procedimientos tRPC que consume el frontend, con esquema Drizzle y SQLite/MySQL.
   - (c) Recrear solo el frontend con un adaptador documentado (`CONTRATO_API.md`) y datos mock etiquetados como tales.
3. **Framework del frontend.** El prompt sugiere Next.js 15, Nuxt 4 o SvelteKit 2. El proyecto original es React 19 + Vite 7 + Tailwind 4 + wouter. Mi recomendación es **mantener React 19 + Vite + Tailwind 4** (preserva la intención y evita reescribir ~2.500 líneas de UI sin necesidad), y elevar calidad con TypeScript estricto, Vitest, Playwright, axe, ESLint 9 flat y Storybook. ¿Estás de acuerdo?
4. **Estructura monorepo.** La estructura objetivo pide `apps/web`, `packages/ui`, `packages/shared`. ¿Quieres monorepo (pnpm workspaces/Turborepo) o mantener un único paquete?
5. **Duplicado `src/` vs `client/src/`.** Propongo consolidar en un único árbol y eliminar la duplicación. ¿Confirmas que `src/` (que contiene `main.tsx`/`App.tsx`) es el árbol de referencia?

Hasta confirmar 1–3 no escribo código de aplicación, tal como indica la Fase 0.

---

## 8. Próximo paso propuesto

Una vez validado este análisis:

1. Consolidar el árbol del frontend y arreglar el build para que compile la aplicación real (no la landing).
2. Corregir `tsc --noEmit` a 0 errores.
3. Sustituir `|| true` en CI por tests reales y añadir Vitest + Playwright.
4. Redactar `CONTRATO_API.md` con los 23 procedimientos tRPC observados y su estado.
5. Documentar `DEPENDENCIAS.md`, `CHANGELOG.md` y ADRs en `docs/decisions/`.
