---
name: cfia-design
description: Use this skill to generate well-branded interfaces and assets for CFIA (Centro de Formação em Inteligência Artificial), a Brazilian Portuguese AI education platform. Carbon-aligned (IBM Plex, zero border-radius, #0f62fe blue) with Coursera/Udemy pedagogical patterns. Covers tokens, components, copy voice (pt-BR, informal "você"), and a website UI kit.
user-invocable: true
---

Read the `README.md` in this skill and explore the other files before producing anything. Key references:

- `README.md` — full brand context: content fundamentals, visual foundations, iconography
- `colors_and_type.css` — CSS variables for all tokens + semantic type rules (drop in via `<link>`)
- `assets/` — CFIA wordmark, favicon, logo variants
- `preview/` — 18 design-system preview cards (Colors, Type, Spacing, Components, Brand)
- `ui_kits/website/` — Carbon-styled website recreation (Home, Catalog, Course Detail, Dashboard) with factored JSX components. Start here when building screens.

**When producing visual artifacts** (slides, mocks, throwaway prototypes): copy `colors_and_type.css` and any assets needed into the artifact folder, then write a static HTML file that imports them. Reuse the JSX components from `ui_kits/website/` when the output looks like a page on cfia.com.br.

**When working in production code** (the Next.js codebase): read the rules in `README.md` and mirror the existing token layer (`--cds-*` in `src/app/globals.css`). Use IBM Plex Sans, lucide-react, square corners, no shadows. Copy should be pt-BR, informal "você", sentence-cased.

**If invoked without guidance:** ask the user what they want to build (slide deck, new marketing page, dashboard screen, landing for a new track, etc.), confirm whether they want variations, then produce HTML artifacts or production code per their need.

**Core constraints — never violate without asking:**
- Border radius: 0 everywhere (except `.pill` 24px, `.rounded-full`, `.avatar-circle`)
- Shadows: none (except hero portrait and floating Carbon badges)
- Icons: lucide-react only, 2px stroke
- Typography: IBM Plex Sans 300/400/600, IBM Plex Mono 400 for metadata
- Accent color: a single `#0f62fe` — no purple/teal/rainbow
- Grids separate tiles with `gap: 1px` on a `#e0e0e0` background, not per-tile borders
