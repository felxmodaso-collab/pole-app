# Поле · pole-app

Spec site for **Поле**, a writing tool for non-fiction of 12+ month length.
Part of a three-site portfolio exploring different product archetypes (premium
service / SaaS platform / product). This is the SaaS-platform archetype.

**Live:** https://felxmodaso-collab.github.io/pole-app/

## Stack

- Next.js 15.1 (App Router, static export for GitHub Pages)
- React 19 · TypeScript 5.7
- framer-motion for zone-focus, constellation, modal physics
- Tailwind 3.4 · custom palette (midnight teal / growth / anchor / cream)

## Local dev

```
npm install
npm run dev        # :3032
```

## Gh-pages build

```
DEPLOY_TARGET=gh-pages npm run build
# → ./out is the static bundle
```

Deploys via `.github/workflows/deploy.yml` on push to `main`.
