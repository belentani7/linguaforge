# Dependencias · apps/web

Versiones tomadas de `apps/web/package.json` y del árbol instalado. Se usan rangos `^` y el lockfile fija las versiones exactas.

## Runtime

| Paquete | Versión | Uso |
| --- | --- | --- |
| next | 16.4.0 | App Router, `cacheComponents`, Proxy, Route Handlers. |
| react / react-dom | 19.3.0 | UI. |
| tailwindcss, @tailwindcss/turbopack | ^4 | Estilos (Tailwind 4, sin archivo de configuración). |
| zustand | ^5 | Estado cliente: progreso, IA, preferencias (persistido en `localStorage`). |
| @tanstack/react-query | ^5 | Caché de datos del catálogo. |
| zod | ^4 | Validación de entrada de APIs y de contenido. |
| @monaco-editor/react | ^4.7 | Editor de código (carga dinámica, solo en el cliente). |
| three, @react-three/fiber, @react-three/drei | 0.186 / ^9 / ^10 | Escena 3D del Hero (reacciona al cursor). |
| framer-motion | ^12 | Animaciones con física (spring) y transiciones. |
| lucide-react | ^1 | Iconos. |
| class-variance-authority, clsx, tailwind-merge | ^0.7 / ^2 / ^3 | Variantes de componentes y composición de clases. |
| @radix-ui/react-slot | ^1.4 | Composición `asChild` del botón. |

## Desarrollo y calidad

| Paquete | Versión | Uso |
| --- | --- | --- |
| typescript | ^5 | Modo estricto. |
| eslint, eslint-config-next | ^9 / 16.4.0 | Lint (flat config). |
| vitest | ^3.2.7 | Pruebas unitarias y de contenido. |
| jsdom, @testing-library/react, @testing-library/dom, @testing-library/jest-dom | ^26 / ^16 / ^10 / ^6 | Preparado para pruebas de componentes (no hay tests de componentes todavía). |

## Notas

- **Sin SDK de proveedores de IA.** El tutor llama a OpenAI y Anthropic con `fetch` desde el servidor. Así no hay dependencias pesadas ni claves en el cliente.
- **Sin `next/font/google`.** Las fuentes son del sistema para que el build no necesite red.
- **Retirado en esta fase:** `next-intl` (la i18n es un diccionario propio tipado), `motion` (duplicaba `framer-motion`) y los paquetes Radix sin uso (`dialog`, `progress`, `tabs`, `tooltip`).
- **Pendiente:** Playwright y `@axe-core/playwright` para E2E y accesibilidad; no se han añadido porque requieren descargar navegadores desde un CDN que no está en la lista de hosts permitidos del entorno.
- Auditoría de seguridad (`npm audit`) no ejecutada en esta fase.
