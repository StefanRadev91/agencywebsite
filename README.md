# Studio website

Bilingual (BG/EN) marketing site built with Next.js. Full docs are written in the final phase.

## Run

```bash
cp .env.example .env.local
npm install
npm run dev        # http://localhost:3000 (redirects to /bg)
```

## Quality gates

```bash
npm run format:check && npm run lint && npm run typecheck && npm test && npm run build
npm run test:e2e   # Playwright
npm run lhci       # Lighthouse CI (after build)
```
