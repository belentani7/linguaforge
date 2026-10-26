# Canon de producto — LinguaForge

> Estado: **mapa de implementación revisado, calidad sin ejecutar** · 2026-10-13. Este índice conecta documentación existente sin duplicarla.

## Producto
Herramienta abierta de aprendizaje de idiomas con niveles MCER/CEFR A1–C2, rutas bidireccionales, actividades, progreso y repetición espaciada. La progresión **no equivale a certificación oficial**. Mantener diferenciados idioma de interfaz, de apoyo y de estudio.

## Árbol verificable, no arquitectura inventada
| Dominio | Source of truth | Estado |
| --- | --- | --- |
| Visión, usos y catálogo | [README](../README.md), [PRODUCTOS](../PRODUCTOS.md), [CURRICULUM](./CURRICULUM.md) | Documentado |
| Cliente y rutas | [client/src](../client/src), [vite.config.ts](../vite.config.ts) | Fuente existente; rutas por trazar |
| Servidor y procedimientos | [server/index.ts](../server/index.ts), [server/routers.ts](../server/routers.ts), [shared](../shared) | Fuente existente; endpoints por auditar |
| Persistencia | [drizzle](../drizzle), [server/db](../server/db), [tests/persistence.test.ts](../tests/persistence.test.ts) | MySQL/MariaDB en CI; migración y rollback pendientes de prueba independiente |
| Arquitectura y decisiones | [ARCHITECTURE](./ARCHITECTURE.md), [matriz 2026](./ARQUITECTURA-MATRIZ-2026-10.md), [decisions](./decisions) | Contrastar con código actual |
| Garantías | [ci.yml](../.github/workflows/ci.yml), [vitest.config.ts](../vitest.config.ts), [tests](../tests) | Quality gates configurados, resultados desconocidos |
| Seguridad y privacidad | [PRIVACY](../PRIVACY.md), [SECURITY](../SECURITY.md) | Verificación de datos pendiente |

## Cambios recientes: observación vs confirmación
El merge `7565071` del 13-10-2026 declara cambios de calidad, SEO, accesibilidad y capa visual y afectó **187 archivos**. No se da por validado el conjunto por el título del PR. Evaluar diffs, pruebas y regresiones por dominio, especialmente compatibilidad de rutas, currículum, SRS, persistencia y recursos de traducción.

## Comandos de aceptación (no ejecutados aquí)
En [package.json](../package.json): `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm coverage`, `pnpm build`, `pnpm bundle:check`. El CI define servicio MariaDB temporal para pruebas de migración/rollback; **no usar datos reales**. Preservar API y contratos antes de reestructurar.

## Experiencias obligatorias antes de release
1. Elegir par lingüístico → diagnóstico → lección → evaluación → persistencia de progreso.
2. Cambiar idioma de interfaz sin perder idioma de estudio ni sesiones.
3. Repetición espaciada con estado consistente tras recargar y después de migración.
4. Contenido con procedencia y licencias visibles; interfaz accesible sin audio obligatorio.

**Definition of Done:** pruebas automatizadas ejecutadas y trazadas a un commit, flujos E2E demostrados, auditoría de privacidad/contenido y preview probado. No declarar 10/10 ni producción lista por documentación. El proyecto de Vercel asociado al repositorio es `openlinguaforge`; el proyecto `linguaforge` está vinculado a otra repo (`belentani-007`) en el inventario y **no debe confundirse**.

## Pendientes
- [ ] Auditar los 187 ficheros del merge por categorías y resultados de CI.
- [ ] Resolver decisión explícita de package manager; hay más de un lockfile.
- [ ] Comprobar compatibilidad real del contrato API y del modelo de datos.
- [ ] Medir experiencia móvil y multilingüe.
