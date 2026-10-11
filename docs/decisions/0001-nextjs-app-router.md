# 0001 · Next.js 16 App Router para la nueva plataforma

- Estado: aceptada
- Fecha: 2026-10-11

## Contexto
El encargo pide una plataforma de nivel mundial con SSR/SSG para SEO, rutas de contenido, API del tutor y experiencia cliente rica (Monaco, R3F). La línea anterior era React + Vite.

## Decisión
Next.js 16.4 con App Router y `cacheComponents: true`. Las páginas de contenido se prerenderizan; las rutas de tutor y voz son dinámicas. Las lecciones no publicadas se rechazan en `src/proxy.ts`.

## Consecuencias
- `cacheComponents` no admite `export const runtime` ni `dynamicParams` en segmentos; se usan los valores por defecto.
- Un `notFound()` dentro de contenido en streaming devuelve 200 (soft 404). Por eso la comprobación de lecciones se hace en Proxy y devuelve 404 real.
- La reversa de "mantener React + Vite" aplica solo a la plataforma nueva. El código Vite de la raíz permanece como legado hasta decidir su retirada.
