# Informe de cumplimiento de la directiva maestra (evidencia, sin certificación)

- Rama: `arena/fd5bd31a-linguaforge` (último commit de calidad: `582bdea`).
- Naturaleza: informe de **evidencia reproducible**. No es una certificación ni un reporte firmado. Cada cifra es reproducible con el comando indicado.
- Principio: nada se declara cumplido sin ejecución. Lo que no se ha ejecutado figura como **pendiente**.

## 1. Resumen

| Fase | Requisito                               | Estado                             | Evidencia                                                        |
| ---- | --------------------------------------- | ---------------------------------- | ---------------------------------------------------------------- |
| 0.2  | Sin `any`                               | **Cumple**                         | `grep` → 0                                                       |
| 0.2  | Sin aserciones `as Tipo`                | **Cumple**                         | `grep` → 0                                                       |
| 0.2  | Validación en runtime con Zod           | **Parcial** (1 archivo)            | `grep -rl 'from "zod"'` → 1                                      |
| 1    | Arquitectura hexagonal / Clean          | **No cumple** (decisión pendiente) | Arquitectura actual: React + tRPC por carpetas                   |
| 2.2  | Sin `catch` vacío                       | **Cumple**                         | `grep` → 0                                                       |
| 2.2  | Lint como gate                          | **Cumple** (nuevo)                 | `pnpm lint` → 0 errores                                          |
| 3.1  | Cobertura > 90 %                        | **No cumple**                      | 57,3 % líneas (sin base de datos)                                |
| 3.1  | Pirámide de tests 80/15/5               | **No cumple**                      | 2 suites Vitest, sin E2E automatizado                            |
| 3.3  | Mutation testing                        | **No ejecutado**                   | —                                                                |
| 4.2  | Lighthouse > 95 en 4 categorías         | **Parcial**                        | 100/100/100 en 3 rutas (medición previa, ver §4)                 |
| 4.2  | WCAG 2.1 AA                             | **Parcial**                        | axe: 0 violaciones WCAG A/AA en 12 rutas; sin lector de pantalla |
| 4.3  | Meta, robots, sitemap                   | **Parcial**                        | Meta y robots por ruta; sin sitemap (falta dominio canónico)     |
| 4.1  | Auditoría Snyk / SonarQube              | **No ejecutado**                   | Requiere cuentas externas (no autorizado)                        |
| 5.2  | Gates de calidad en CI                  | **Cumple** (nuevo)                 | `ci.yml`: check, lint, format, coverage, build, bundle           |
| 5.2  | Presupuesto de bundle                   | **Cumple** (nuevo)                 | 288,5 KB gzip frente a 300 KB                                    |
| 5.2  | Deploy staging/producción automatizado  | **No cumple**                      | Sin hosting conectado; requiere autorización                     |
| 5.1  | Storybook                               | **No cumple**                      | No implementado                                                  |
| 5.3  | Observabilidad y alertas                | **No cumple**                      | No implementado                                                  |
| 6.2  | Reporte firmado / registro de auditoría | **No procede**                     | Sólo se emite evidencia verificable, sin firma                   |

## 2. Cifras reproducibles

| Métrica                                             | Valor                                                              | Comando                           |
| --------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------- |
| Tipos                                               | `tsc --noEmit` sin errores                                         | `pnpm check`                      |
| Lint                                                | 0 errores, 0 avisos                                                | `pnpm lint`                       |
| Formato                                             | Prettier limpio                                                    | `pnpm format:check`               |
| Pruebas                                             | 42 pasan, 15 se saltan sin base de datos (57 en total)             | `pnpm test`                       |
| Cobertura (líneas / funciones / ramas / sentencias) | 57,3 / 52,8 / 50,3 / 58,2 %                                        | `pnpm coverage`                   |
| Umbrales de cobertura (puerta de regresión)         | 55 / 50 / 47 / 55 %                                                | `vitest.config.ts`                |
| JS inicial gzip                                     | 288,5 KB (presupuesto 300 KB)                                      | `pnpm build && pnpm bundle:check` |
| Vulnerabilidades, raíz                              | 0                                                                  | `pnpm audit`                      |
| Vulnerabilidades, `apps/web`                        | 5 altas (`braces`, `micromatch`, `fast-glob`), sin parche upstream | `npm audit` en `apps/web`         |

Nota de cobertura: la base de datos de desarrollo ya no está disponible en este entorno, así que las 15 pruebas de persistencia no se ejecutan. La cifra de cobertura es, por tanto, **inferior** a la que se obtiene con la base. Las 57/57 se verificaron antes con MariaDB de desarrollo.

## 3. Lo que sigue pendiente (y por qué)

1. **Cobertura del 90 %**: requiere escribir pruebas de dominio. Es trabajo de desarrollo, no de configuración. Se eleva el umbral en cada incremento.
2. **Arquitectura hexagonal**: migración mayor. Contradice la instrucción de conservar la arquitectura sin necesidad demostrada. Requiere decisión explícita.
3. **Mutation testing**: pendiente de ejecutar sobre el módulo de dominio cuando exista uno.
4. **Snyk, SonarQube, Storybook, observabilidad, despliegues**: implican cuentas, terceros o publicación. No autorizados.
5. **Sitemap y canonical absoluto**: requieren dominio público canónico.
6. **Alertas de GitHub**: la rama por defecto (`main`, sin cambios en `8b777b6`) reporta 24 vulnerabilidades (8 críticas) en su panel de Dependabot. La auditoría local de `main` dio 13 en la raíz; la diferencia no está explicada. La API de alertas responde 403 y no se pueden listar. Las correcciones de esta rama no llegan a `main` hasta fusionar el PR.

## 4. Medición de rendimiento y accesibilidad (anterior, no repetida en esta sesión)

- Lighthouse (build de producción local, categorías accesibilidad, buenas prácticas y SEO): 100/100/100 en `/`, `/catalogo` y `/lecciones/x`. Rendimiento **no medido** con throttling móvil.
- axe (WCAG 2.0/2.1 A y AA): 0 violaciones en 12 rutas.
- Estas cifras son de la sesión anterior. Antes de publicar hay que repetirlas sobre el build final.

## 5. Reproducción

```bash
pnpm install --frozen-lockfile
pnpm quality:gates          # check, lint, format, coverage, build, bundle
```
