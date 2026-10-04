# Project conventions

Marketing site for a 2-person web studio. Bilingual (bg default, en). Static/SSG + one API route (`/api/contact`). No database, CMS or auth.

## Stack

Next.js (App Router) + TypeScript strict, Tailwind v4 (tokens as CSS variables), Framer Motion, Lenis, next-intl, zod, Resend. Tests: Vitest (`tests/unit`), Playwright (`tests/e2e`). Lighthouse CI target ≥ 90.

## Conventions

- Studio identity (name, contacts, socials) lives only in `lib/config.ts`.
- All UI strings go in `messages/bg.json` and `messages/en.json` — always update both.
- Content lives in `content/` (projects, services, pricing.json, team.json) and is validated by zod schemas in `lib/schemas/`. Prices are `[TODO]` until decided and render as "price after consultation".
- Sales model: free consultation → free skeleton + design preview → quote by complexity (see `FreeStart` section). CTAs say "Free consultation".
- Next 16: routing middleware is `proxy.ts`, not `middleware.ts`. `params` are Promises.
- Animate only transform/opacity; respect `prefers-reduced-motion`.
- Concept projects must be labeled "Concept"; never invent clients, testimonials or metrics.
- Conventional commits; one commit per phase at minimum.
- ESLint is pinned to v9 (eslint-config-next is not yet compatible with v10).

## Commands

`npm run dev | build | start | lint | typecheck | format | test | test:e2e | lhci`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Performance rules (Lighthouse CI: all categories >= 90, LCP target < 2.5 s on simulated mobile)

Lighthouse's mobile LCP counts every byte requested before first paint (~10 ms per KB), so:

- Keep the critical path small: one font family (Onest variable), no Framer Motion in layout/shared components, no zod in client components (use `lib/contact-validation.ts`), pass labels to client components as props instead of loading the next-intl client runtime.
- Framer Motion is used only where it adds real value (Work filter transitions) and loads lazily after ~1.5 s. Everything above the fold uses CSS (`animate-rise`, `Reveal`).
- Never use text arrow glyphs (→ ← ↗) — they pull an extra font file. Use the SVG icons in `components/ui/icons.tsx`.
- Above-the-fold content must be visible without JS (transform-only entrance, no opacity:0).
- Links visible on first paint use `prefetch={false}`.
- Headings must not skip levels (cards under an h1 need `headingLevel={2}`); axe tests enforce this.
- `npm run quality:report` writes measured results to `content/quality-report.json`; never edit those numbers by hand.
