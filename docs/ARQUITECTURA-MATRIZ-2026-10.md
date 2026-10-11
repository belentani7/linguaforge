# Matriz de arquitectura · octubre 2026

Estado: **evidencia recopilada y decisión propuesta**. Ninguna ruta se ha eliminado.
Etiquetas: IMPLEMENTADO · VERIFICADO · PARCIAL · BLOQUEADO · NO EVALUADO.

## 1. Las dos líneas en el repositorio

| Aspecto | Raíz (`client/`, `server/`, `shared/`) | `apps/web/` (LMS) |
|---|---|---|
| Framework | React 19 + Vite 7, Express + tRPC | Next.js 16.4.0 (App Router), React 19.3.0 |
| Gestor declarado | pnpm (`packageManager`, README, `ci.yml`) | npm (`apps/web/package-lock.json`, `web.yml`) |
| Dominio | Plataforma institucional: catálogo de 39 idiomas, 6 objetivos, 12 lecciones, 6 proyectos | Plan de estudios de agentes de IA: 17 lecciones en 4 cursos |
| Rutas | 14 rutas `wouter` (`/`, `/biblioteca`, `/catalogo`, `/diagnostico`, `/empleo`, `/laboratorios`, `/lecciones/:id`, `/mi-constancia`, `/mi-espacio`, `/practica-oral/:id`, `/programas`, `/proyectos`, `/tutor`, `/voz`) | 4 páginas (`/`, `/cursos`, `/cursos/[lessonId]`, `/panel`) + `/no-encontrado`, `/error`, `sitemap`, `robots`, `manifest` |
| API | 12 procedimientos tRPC en 8 routers (`auth`, `institution`, `profile`, `diagnostic`, `learning`, `projects`, `tutor`, `voice`) | 4 route handlers REST: `GET /api/courses`, `POST /api/tutor`, `POST /api/tutor/review`, `POST /api/tutor/voice-token` |
| Persistencia | `MemoryLearningStore` (JSON) por defecto; MySQL de desarrollo con `LF_STORE=mysql` (ver sección 4) | Sin persistencia propia |
| CI | `ci.yml`: `pnpm check` · `pnpm test` · `pnpm build` (Node 22) | `web.yml`: `npm ci` · lint · typecheck · test · build en `apps/web` |
| Despliegue | `vercel.json` (`framework: vite`, `buildCommand: npm run build`, `dist/public`) | `pages.yml` sólo copia contenido estático; no despliega `apps/web` |
| Pruebas | `tests/backend.test.ts` (33), `tests/persistence.test.ts` | `tests/lessons.test.ts`, `tests/tutor.test.ts` (no ejecutadas: sin `node_modules`) |

## 2. ¿Por qué existe Next.js 16? (historial)

- `8b777b6` (base de `main` en esta sesión): raíz sin Next.js ni Prisma en `package.json`. Verificado con `git show 8b777b6:package.json`.
- `b83462b feat(web): plataforma Next.js 16 para agentes de IA (fase 1)`: introduce `apps/web` como línea nueva.
- `docs/decisions/0001-nextjs-app-router.md`: decide Next.js 16.4 App Router para la plataforma nueva y **declara la raíz Vite como legado**.
- La premisa "Next.js 16 y Prisma en el package.json raíz" **no se confirma** en ningún commit: Prisma sólo aparece como texto en documentación.

**Función demostrable de Next.js en `apps/web`** (inventario del código, no ejecutado):

| Capacidad Next | Dónde | ¿Requiere Next? |
|---|---|---|
| Prerenderizado de lecciones (`generateStaticParams`) | `src/app/cursos/[lessonId]/page.tsx` | Sí, si el objetivo es SSG para SEO. Vite puede prerenderizar, con más trabajo. |
| Metadatos por lección (`generateMetadata`) | misma página | Sí, para SEO por página. |
| `sitemap.ts`, `robots.ts`, `manifest.ts` | `src/app/` | Vite necesita plugin o script; no es imposible. |
| Route handlers (4 endpoints JSON) | `src/app/api/` | No. Equivalente en Express/tRPC, que ya existen en la raíz. |
| `proxy.ts` (rewrite a `/no-encontrado`) | `src/proxy.ts` | Podría resolverse en el servidor o en prerender. El ADR advierte que `notFound()` en streaming devuelve 200. |

**Veredicto Next.js:** PARCIAL. Hay una función real (SSG/SEO de lecciones públicas), pero no hay evidencia de que el SEO sea requisito vivo ni de que `next build` funcione aquí: **NO EVALUADO** hasta instalar dependencias y ejecutar el build.

## 3. Duplicidades y decisión

- Dominios distintos (idiomas institucionales frente a agentes de IA), pero **mecanismos repetidos**: currículo con lecciones y pruebas, tutor con proveedor opcional y modo local, voz con token y modo navegador. Es el caso que la directiva prohíbe sin justificación: dos frameworks con funciones paralelas.
- La raíz es la app activa (CI, despliegue, backend tRPC, 14 rutas). **Se conserva**, como se aprobó.
- `apps/web` **no se elimina**: contiene currículo propio (17 lecciones), entorno de pruebas de código (`src/lib/sandbox/run-tests.ts`), proveedores de tutor y voz y 2 suites de pruebas. Borrarlo sería eliminar contenido útil.
- Además, el ADR 0001 declara la raíz "legado", lo que contradice la decisión actual. Se registra en `docs/decisions/0002-arquitectura-activa.md`.

**Opciones para decidir (requiere tu elección):**
- A. Mantener ambas líneas separadas, con CI y dueños explícitos. Next queda limitado a `apps/web`.
- B. Portar a la raíz sólo el SEO/prerender de lecciones y archivar `apps/web` (sin borrado).
- C. Mantener Next.js como plataforma única y migrar la raíz (costoso; contraviene "conservar lo que funciona").

## 4. Persistencia: MySQL de desarrollo frente al proveedor soportado

- El código de la raíz ya usaba `drizzle-orm` y `mysql2` en dependencias, y el esquema apunta a MySQL/TiDB. El proveedor "soportado" por el código es MySQL (TiDB compatible).
- Se usa **MariaDB 11.4** compilada localmente como servidor de desarrollo: MySQL 8.4 requiere Boost, que no es accesible en el sandbox, y no hay descarga de binarios oficiales. El protocolo y el dialecto son compatibles con `mysql2`; **divergencia declarada**.
- La lógica está desacoplada del motor: los routers dependen de la interfaz `LearningStore`. La implementación MySQL (`server/db/mysql-store.ts`) es la única que conoce Drizzle.
- Guarda de seguridad (`server/db/safety.ts`): sólo host local, sólo `linguaforge_dev` o `linguaforge_test`, nunca con `NODE_ENV=production`.

Estado de la persistencia: ver `docs/AUDITORIA-RAIZ-2026-10.md`, sección de persistencia.

## 5. Pendiente de decisión (no ejecutado)

- `package-lock.json` raíz: el gestor oficial es pnpm, pero `vercel.json` usa `npm run build`. Eliminar el lock npm podría cambiar cómo Vercel instala dependencias y no puedo verificarlo desde el sandbox. **Requiere tu confirmación** antes de borrarlo.
- `src/` (75 archivos): sin imports desde código activo, pero referenciado por documentos como fuente de F5 (SRS), F10 (notificaciones) y mapas. No se elimina; se propone portar F5/F10 al backend real.
