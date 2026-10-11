# 0002 · Arquitectura activa: raíz React + Vite; `apps/web` en pausa

- Estado: **propuesto, pendiente de confirmación** (la decisión de conservar la raíz sí está aprobada).
- Fecha: 2026-10-11
- Sustituye a: la parte de `0001-nextjs-app-router.md` que declara la raíz Vite "legado".

## Contexto

La raíz (React 19 + Vite 7, Express + tRPC, Drizzle/MySQL) es la app activa: tiene CI, configuración de despliegue en `vercel.json`, backend y 14 rutas. `apps/web` (Next.js 16.4) implementa un currículo distinto (agentes de IA) con mecanismos paralelos.

## Decisión

1. La raíz se conserva como app activa. No se introduce Next.js en ella.
2. `apps/web` no recibe nuevas funciones mientras esté en pausa, y **no se elimina**.
3. Cualquier uso de Next.js debe justificarse con una función demostrable (p. ej., prerenderizado SEO), registrada en la matriz de arquitectura.

## Consecuencias

- El ADR 0001 deja de ser válido en su parte de "legado".
- La elección entre opciones A/B/C de `docs/ARQUITECTURA-MATRIZ-2026-10.md` queda abierta.

Referencias: `docs/ARQUITECTURA-MATRIZ-2026-10.md`.
