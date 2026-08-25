# 🌐 Deployment Mirrors

LinguaForge está desplegada en múltiples plataformas:

## Servidores Activos

| Plataforma | URL | Setup |
|---|---|---|
| **GitHub Pages** ✅ | https://belentani7.github.io/linguaforge/ | Auto |
| **Netlify** 🚀 | https://linguaforge-belentani.netlify.app | Pendiente* |
| **Vercel** 🚀 | https://linguaforge-belentani.vercel.app | Pendiente* |
| **Surge** 🚀 | https://linguaforge-belentani.surge.sh | Pendiente* |

*Setup: Dashboard → Connect repo → Build: `pnpm build`, Publish: `dist/public/`

## Fallback Loader

```html
<!-- fallback-loader.html auto-detecta servidor disponible -->
```

## Auto-Deploy desde GitHub

Cada push a `main`:
1. GitHub Actions triggers
2. `pnpm build` → `dist/`
3. Deploy a todos los servidores conectados
4. ~2 min para sync completo

