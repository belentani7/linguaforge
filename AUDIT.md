# Informe de Auditoría: linguaforge

Fecha: 2026-08-27
Stack detectado: TypeScript · React 19 · Tailwind CSS 4 · Express 5 · tRPC 11 · Drizzle ORM (MySQL/TiDB) · Vitest · Vite 7 · pnpm workspace
Commits analizados: 1 (5be0ce9) en `main`
Veredicto: **sano**

> Auditoría autónoma (OpenCode / Big Pickle). Verificación reproducible ejecutada:
> `pnpm install --frozen-lockfile` ✓ · `pnpm check` (tsc) ✓ · `pnpm test` ✓ (tras fix) ·
> `prettier --check` ✓

## Lo mejor del repo (mínimo 3)

1. **Autenticación y modelos de autorización sólidos.** `server/_core/trpc.ts` separa
   `publicProcedure` / `protectedProcedure` / `adminProcedure` con middleware central,
   y el OAuth (`server/_core/oauth.ts`) incluye un nonce de estado con verificación de
   cookie (defensa CSRF) y cookies `secure` + `sameSite=none`.
2. **Sin secretos versionados.** Escaneo regex completo (OpenAI/OpenRouter, NVIDIA,
   xAI, Groq, AWS AKIA, Google/Gemini, GitHub PAT, GitLab, PRIVATE KEY, passwords y
   api keys) sobre todo el árbol (código, docs, contenido) dio **cero coincidencias**.
   Todos los secretos se leen de `process.env` (`server/_core/env.ts`) y no hay `.env`
   commiteado.
3. **Documentación y gobernanza de producción excepcionalmente maduras.** README
   trilingüe (PT/ES/EN), `SECURITY.md`, `CONTRIBUTING.md`, `LICENSE` (MIT) y ~35
   documentos en `docs/` (content provenance, compliance, accessibility, dependency
   security, ops). El contenido indica licencia, URL, versión y atribución.
4. **Calidad de código defensiva.** Acceso a BD exclusivamente vía Drizzle ORM
   (consultas parametrizadas, sin concatenación SQL), el 100 % de las consultas maneja
   el fallback "DB no disponible", y no hay `eval`/`new Function` sobre input de
   usuario ni endpoints de auth/API en HTTP plano (los `http://` encontrados son
   solo `localhost`/tooling de desarrollo).

## Hallazgos CRÍTICOS (archivo:línea)

- Ninguno.

## Hallazgos ALTOS

- Ninguno tras corrección.

### Corregido (🟠 → resuelto)

- **`server/learning.test.ts:70` — build gate (test) roto.** El test
  "returns the persisted typed practice queue for the seeded A1 English path"
  afirmaba contenido real sembrado del path A1-inglés (esperaba los 4 tipos de
  ejercicio), pero corría en el entorno unitario donde `getDb()` devuelve `null`
  (sin `DATABASE_URL`), por lo que `practice.random()` siempre devolvía `[]` y la
  aserción fallaba con `Set{}`. Hacía fallar `pnpm test` y, por tanto, el gate
  `pnpm quality:check`.
  - **Fix (mínimo, sin alterar lógica de negocio):** se envolvió el test con
    `it.skipIf(!seededPathEnabled)`, siguiendo la convención existente en
    `server/automation.integration.test.ts` (`describe.skipIf(!enabled)`):
    se omite salvo que `LINGUAFORGE_RUN_DB_INTEGRATION=1` **y** `DATABASE_URL`.
  - Verificación: `pnpm check` ✓ · `pnpm test` ✓ (10 archivos, 32 pass, 8 skip) ·
    `prettier --check` ✓.
  - Commit: `c19c5e7` · PR: https://github.com/belentani7/linguaforge/pull/1

## Hallazgos MEDIOS

- **Ausencia de CI/CD (`🟡`).** No hay `.github/workflows/`, `.gitlab-ci.yml`,
  `Jenkinsfile` ni `Dockerfile`. El proyecto tiene un gate local reproducible
  (`pnpm quality:check`) y scripts de auditoría, pero no hay ejecución automática
  en cada push/PR. Se recomienda añadir un workflow de GitHub Actions que ejecute
  `install → check → test → build`. (*No tocado por decisión conservadora: solo se
  modifica `.github/workflows/` en 🔴 crítico.*)
- **README muy extenso y centrado en visión/estado.** Cumple bien la función
  "qué es / stack / instalar / usar", pero mezcla posicionamiento personal con
  referencia técnica. Considerar extraer una sección "API / arquitectura / rutas"
  y mover la referencia de comandos a un `docs/development.md` si crece.

## Añadido por el auditor

- `server/learning.test.ts`: gateado el test dependiente de BD (ver Hallazgos ALTOS).
- `AUDIT.md` (este informe) en la raíz del clon.

## Próximos pasos recomendados

1. Revisar/mergear el PR #1 (fix del gate de tests).
2. Añadir un pipeline de CI (GitHub Actions) que corra `quality:check` con una BD de
   pruebas para ejecutar también los tests de integración (variables `LINGUAFORGE_RUN_*`).
3. Auditar dependencias periódicamente (`pnpm audit`) y documentar la política.
4. Considerar un `.github/dependabot.yml` para mantener las dependencias al día.

## No tocado (pero anotado)

- **Posible secreto — revisar manualmente:** no se halló ningún secreto real; se
  asume que las claves son correctamente leídas del entorno. Las variables esperadas
  son `JWT_SECRET`, `DATABASE_URL`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`,
  `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_APP_ID`.
- `.github/workflows/` no modificado (no hay ninguno; ausencia documentada).
- `node_modules/` creado localmente para verificar el build; está gitignored y no se
  commitea.
- Line-ending warning (LF→CRLF) en Windows durante el commit: es un artefacto del
  checkout, no afecta al contenido versionado.
