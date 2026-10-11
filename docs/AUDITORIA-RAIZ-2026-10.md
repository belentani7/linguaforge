# Auditoría de la raíz del producto — 2026-10-11

Alcance: raíz `/` del repositorio (React 19, Tailwind 4, Vite, Express, tRPC 11, Drizzle, MySQL/TiDB, TypeScript).
Excluido: `apps/web` (LMS en Next.js 16, línea paralela).

Etiquetas: **IMPLEMENTADO** (código escrito) · **VERIFICADO** (ejecutado con evidencia) · **PARCIAL** · **BLOQUEADO** (depende de algo externo o de autorización) · **NO EVALUADO**.

## 1. Estado inicial (contrastado con el código)

| Comprobación | Resultado inicial | Fuente |
|---|---|---|
| `pnpm install --frozen-lockfile` | Falla: `ERR_PNPM_OUTDATED_LOCKFILE` | ejecutado |
| `pnpm check` (tsc) | **48 errores** | ejecutado |
| `pnpm build` | "pasa", pero transforma **2 módulos**: solo la landing estática | ejecutado |
| `pnpm dev` | Sirve `client/index.html`, que **no carga el módulo React** | leído |
| Tests | Ninguno ejecutable: sin script `test`; CI con `npm test --if-present \|\| true` | leído |
| Backend | `server/` y `drizzle/` no existían; `src/lib/trpc.ts` tipaba `AppRouter` como `any` | leído |
| Login | Portal OAuth de **Manus** (`VITE_OAUTH_PORTAL_URL`); sin variable, navega a `undefined/app-auth` | leído |
| Grabación | Plugin de Manus que escribe consola, red y "session replay" en `.manus-logs/` | leído |
| Estilos | Solo 5 de 227 nombres de clase aparecen literalmente en `src/index.css`. Parte son utilidades de Tailwind (generadas en build), así que el número de clases realmente huérfanas **no está medido** | medido (parcial) |

Contraste con documentación: el README promete "diez" idiomas; `shared/institution.ts` tiene **40** en `LANGUAGE_CATALOG`. Varios scripts de `package.json` apuntaban a `scripts/` inexistente.

## 2. Problemas por gravedad

### P0 (bloquean el producto o la verificación)
1. **Lockfile desincronizado** — IMPLEMENTADO y VERIFICADO: `package.json` alineado con las especificaciones del lockfile (64 dependencias + 23 de desarrollo), sin re-resolver versiones. `pnpm install --frozen-lockfile` pasa.
2. **La aplicación React no se monta** — IMPLEMENTADO: `client/index.html` carga `/src/main.tsx`; creados `client/src/main.tsx` y `client/src/App.tsx` (14 páginas, 14 rutas + 404).
3. **Build verde sin producto** — IMPLEMENTADO: el build ahora transforma 2011 módulos. VERIFICADO.
4. **Backend inexistente** — IMPLEMENTADO: `server/routers.ts` con los **11 procedimientos** que usan las páginas (auth ×3, institution ×2, profile, diagnostic, learning, projects ×2, tutor, voice). Tipado end-to-end; `client/src/lib/trpc.ts` ya no usa `any`.
5. **Tests no bloqueantes en CI** — IMPLEMENTADO: `ci.yml` usa pnpm con lockfile congelado y ejecuta `check`, `test` y `build` sin `|| true`.
6. **Tipos rotos (48 errores)** — VERIFICADO a 0 errores, tras corregir contratos reales (ver §3).

### P1 (riesgo alto para producción)
7. **Login dependiente de Manus** — IMPLEMENTADO: sesión local anónima (cookie `lf_session`, HMAC-SHA256, HttpOnly, SameSite=Lax, Secure en producción). **Sin verificación de identidad**: cualquiera obtiene un usuario anónimo. Es una decisión de producto pendiente.
8. **Grabación de sesión y telemetría local** — IMPLEMENTADO: retirados el plugin de Manus y el colector de logs de `vite.config.ts`.
9. **Fuente externa en la app** — IMPLEMENTADO: eliminada la importación de Google Fonts en el CSS de la aplicación.
10. **Voz sin proveedor** — IMPLEMENTADO: `voice.transcribe` responde `unavailable` y la UI ya no muestra una comparación inventada. No hay transcripción real. **BLOQUEADO** por proveedor de voz (claves, coste, consentimiento).
11. **Tutor sin proveedor de IA** — IMPLEMENTADO como respuesta de demostración explícita (`mode: "demonstration-fallback"`). **BLOQUEADO** por proveedor de IA.
12. **Persistencia** — PARCIAL: repositorio en JSON (`data/`, gitignored) con escritura atómica. Esquema MySQL/TiDB en `drizzle/schema.ts` y migración generada (`drizzle/migrations/0000_pink_scourge.sql`, 5 tablas). **NO aplicada ni con repositorio MySQL**: BLOQUEADO por credenciales y autorización para tocar una base real.
13. **Estilos de producto** — PARCIAL: se copiaron los tokens y utilidades de `src/index.css`. Varias clases propias de las páginas no aparecen en ese CSS y no se ha medido cuántas quedan sin estilo. Interfaz **sin validar visualmente**.

### P2 (deuda relevante, decisión pendiente)
14. **Dos árboles de código**: `src/` (plantilla monolítica, no compilada ni tipada) y `client/src/` (app canónica por `vite.config.ts` y `tsconfig`). No eliminado: requiere decisión.
15. **Dos lockfiles**: `package-lock.json` (npm, obsoleto) convive con `pnpm-lock.yaml`. No eliminado: requiere decisión.
16. **Landing estática** movida a `client/public/landing-estatica.html`; sigue cargando GSAP y Google Fonts desde CDN. No se sirve en `/`.
17. **Idiomas**: `LANGUAGE_CATALOG` = 40 idiomas; README = "diez" e incluye ruso y japonés, ausentes del catálogo. Corregir el documento o el catálogo es decisión de producto.
18. **Scripts de contenido/accesibilidad/readiness** retirados de `package.json` por apuntar a `scripts/` inexistente.

### P3 (higiene)
19. `format:check` falla en 35 archivos heredados (no tocados). Mis archivos sí cumplen Prettier.
20. `tests/test_forge_smoke.py` (Python) no se ejecuta en CI.
21. `package.json` pasa de CRLF a LF al reescribirse.

## 3. Cambios realizados (rutas)

- Dependencias: `package.json`.
- Contratos reales: `client/src/pages/EvidenceRecord.tsx` (clave por `projectId`), `client/src/pages/VoicePractice.tsx` (muestra comparación solo con `status === "ready"`).
- Backend nuevo: `server/index.ts` (Express, límite de tasa, cabeceras, CSP en producción, fallback SPA), `server/routers.ts`, `server/store.ts`, `server/domain.ts`, `server/session.ts`.
- Datos: `drizzle/schema.ts`, `drizzle.config.ts`, `drizzle/migrations/`.
- Cliente nuevo: `client/index.html`, `client/src/main.tsx`, `client/src/App.tsx`, `client/src/pages/NotFound.tsx`, `client/src/components/ui/button.tsx`, `client/src/components/ui/textarea.tsx`, `client/src/components/AIChatBox.tsx`, `client/src/index.css`.
- Cliente modificado: `client/src/const.ts` (`startLogin` = sesión local), `client/src/_core/hooks/useAuth.ts` (sin escrituras en `localStorage`/`sessionStorage` de Manus), `client/src/lib/trpc.ts`.
- Eliminado (en git): `client/src/components/ManusDialog.tsx` (código muerto con marca Manus).
- Configuración: `vite.config.ts` (sin plugins de grabación; proxy `/api` → `:3001`; `.e2b.app` permitido), `vitest.config.ts`, `tsconfig.json`, `.github/workflows/ci.yml`, `.gitignore`, `.prettierignore`, `.env.example`, `README.md` (`pnpm api`).
- Pruebas: `tests/backend.test.ts`.

## 4. Pruebas y cifras (ejecutadas)

| Verificación | Resultado |
|---|---|
| `pnpm install --frozen-lockfile` | OK (antes: fallo) |
| `pnpm check` (tsc) | **0 errores** (antes: 48) |
| `pnpm test` (Vitest) | **33/33 pasan** |
| Mutación: idempotencia de lección y regla de racha rotas a propósito | **2 tests fallan**; restaurado y 33/33 otra vez |
| `pnpm build` | OK, **2011 módulos**, `dist/public` |
| `pnpm quality:check` (check + test + build) | OK |
| HTTP producción (`pnpm start`) | página 200; SPA `/programas` 200; `/api/nope` 404 JSON; `profile.get` sin sesión 401; `auth.guest` con cookie `HttpOnly; Secure; SameSite=Lax`; CSP presente; `learning.complete` persiste; diagnóstico con 1 competencia → 400 |
| Dev (`pnpm dev` + `pnpm api`) | módulos `main.tsx`, `App.tsx` y páginas transformados 200; proxy `/api` OK; host `*.e2b.app` aceptado |

Cobertura de tests: dominio (bandas, racha por zona horaria, XP), sesión (manipulación, caducidad, secreto), repositorio (idempotencia, persistencia atómica), 11 procedimientos (permisos, validaciones, aislamiento entre usuarios), capa HTTP (cookies, 401, 429, 404).

## 5. Qué NO está evaluado

- **NO EVALUADO**: render visual en navegador. No hay Chromium en el entorno y su descarga no está permitida; no se ha visto la interfaz.
- **NO EVALUADO**: accesibilidad, rendimiento, diseño móvil, compatibilidad de navegadores.
- **NO EVALUADO**: calidad pedagógica del contenido y de las respuestas del tutor (no hay evaluación lingüística ni se simula).

## 6. Riesgos

- Identidad anónima sin verificación: cualquiera puede acumular progreso con su propia sesión.
- Persistencia en JSON local: no es multi-instancia ni apta para producción.
- Límite de tasa en memoria por proceso: no es efectivo con varias réplicas.
- `SESSION_SECRET` es efímero en desarrollo: las sesiones caducan al reiniciar.
- Estilos incompletos: la interfaz puede verse degradada.

## 7. Dependencias externas pendientes

- **BLOQUEADO**: base MySQL/TiDB (credenciales y autorización para aplicar la migración).
- **BLOQUEADO**: proveedor de IA para el tutor (claves, coste, política de datos).
- **BLOQUEADO**: proveedor de voz para transcripción (claves, consentimiento, coste). Sin clonación de voz.
- **Decisión**: ¿la reversa a Next.js 16 aplica también a la raíz o solo a `apps/web`?

## 8. Evaluación de producción

**No apta para publicación.** Bloqueantes: identidad real, persistencia en MySQL/TiDB, proveedor de IA o retirada explícita del tutor, estilos y validación visual, y decisión sobre `src/` y los dos lockfiles.

## 9. Próxima acción

1. Confirmar la dirección de arquitectura (Next.js en la raíz o no) y el destino de `src/` y `package-lock.json`.
2. Aportar credenciales de una base de **desarrollo** (no producción) para implementar el repositorio MySQL y aplicar la migración allí.
3. Validar visualmente las 14 páginas en el preview y completar los estilos faltantes.
