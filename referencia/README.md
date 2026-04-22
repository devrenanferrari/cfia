# CFIA Design System

**CFIA — Centro de Formação em Inteligência Artificial** is a Brazilian Portuguese online education platform focused on Artificial Intelligence careers. Think "Coursera + Udemy, built on IBM Carbon". The product is a Next.js + Tailwind + shadcn web app that sells structured AI career tracks (Engenheiro de IA, Cientista de Dados, ML Engineer, IA Generativa), individual courses, and a premium subscription.

This design system captures what already ships in the codebase so future designs stay consistent with the site, and evolves it toward three reference brands the founder admires:

- **IBM (Carbon)** — structural DNA: zero border-radius, IBM Plex, grid gutters, restrained blue accent
- **Coursera** — pedagogical clarity: career tracks, progression, trustworthy social proof
- **Udemy** — commerce energy: course cards, ratings, instructor bylines, pricing

---

## Sources

- **Codebase:** `devrenanferrari/cfia` on GitHub (Next.js 16, Tailwind v4, shadcn, Prisma, NextAuth, Stripe). Key files imported/read:
  - `src/app/globals.css` — CDS token layer
  - `src/app/layout.tsx` — font loading (IBM Plex Sans 300/400/600 + IBM Plex Mono 400)
  - `src/app/(public)/home/page.tsx` — homepage composition
  - `src/components/navbar.tsx`, `footer.tsx`
  - `src/components/home/hero-section.tsx`, `pricing-section.tsx`, `editorial-section.tsx`
  - `src/components/course-card.tsx`
  - `src/components/ui/{button,badge,card,input,...}.tsx` — shadcn base
- **Reference brands (public sites):** coursera.org, ibm.com/design/language, udemy.com

---

## Index

```
README.md                  ← you are here
SKILL.md                   ← Agent Skill manifest (portable to Claude Code)
colors_and_type.css        ← CSS variables for tokens + semantic type rules
assets/                    ← logos, icons, generic illustrations
fonts/                     ← webfonts (IBM Plex Sans, IBM Plex Mono)
preview/                   ← design-system preview cards (registered assets)
ui_kits/
  website/                 ← public marketing site UI kit
    README.md
    index.html             ← interactive click-thru prototype
    *.jsx                  ← factored React components
```

---

## Content fundamentals

**Language:** Brazilian Portuguese (pt-BR). All UI copy, marketing, legal.

**Tone:** Direct, encouraging, pragmatic. Sells outcomes ("torne-se um profissional", "mude sua carreira", "chegue ao mercado") not abstractions. Never hype; no "revolucionário" / "disruptivo".

**Person:** Second person informal — **você**, never "tu" or "vocês". "Aprenda", "construa", "comece" as imperatives. First person plural ("nós") only for institutional voice (About, footer).

**Casing:** Sentence case for headlines and buttons. Capitals only for proper nouns ("Inteligência Artificial", "Machine Learning"). UPPERCASE reserved for:
- Step labels: "PASSO 01"
- Eyebrows/kickers: section pills use Title Case not uppercase ("Trilhas de carreira")
- Small-caps monospaced dates in editorial

**Emoji:** Minimal. Currently used sparingly as category markers (💬 🎯 📊 🚀 🤖 🎓 💼). Treat these as **content** not decoration. Prefer Lucide icons for UI chrome; reserve emoji for hero/project badges where warmth helps.

**Numerics:** Portuguese conventions — `R$99,90`, `+12.000 alunos`, `4.9★`. En-dash for ranges: `6–8 meses`. Use `•` with nbsp padding for inline separators: `Sem cartão · Acesso imediato · Certificado incluso`.

**Call-to-action vocabulary:**
- Primary: *Começar gratuitamente*, *Assinar agora*, *Ver trilha*
- Secondary: *Ver todos os cursos*, *Continuar lendo*, *Saiba mais*
- Never: "Clique aqui", "Saiba mais hoje", "Não perca"

**Example copy that reads right:**

> Torne-se um profissional de Inteligência Artificial e mude sua carreira
>
> Aprenda do zero ao avançado, construa projetos reais e esteja pronto para trabalhar com IA no mercado.

> Um caminho claro até sua nova carreira

> Aprenda fazendo, não só assistindo.

---

## Visual foundations

**Color vibe.** Carbon White theme. Lots of white space, one accent blue (`#0f62fe`), near-black text (`#161616`), and a narrow gray scale. Pale blue `#edf5ff` is the only tint used for emphasis. Dark mode exists (Carbon Gray 100) but the public site is always light.

**Primary palette**
- `#0f62fe` — Interactive / Links / CTAs (Carbon Blue 60)
- `#0043ce` — Link hover + emphasis text on tints (Blue 70)
- `#002d9c` — Active state (Blue 80)
- `#78a9ff` — Dark-mode link (Blue 40)
- `#a6c8ff` — Tint borders (Blue 30)
- `#d0e2ff` — Soft background (Blue 20)
- `#edf5ff` — Section wash / pill background (Blue 10)

**Neutrals (Gray)**
- `#161616` text-primary / dark nav (Gray 100)
- `#393939` strong secondary
- `#525252` body copy secondary (Gray 70)
- `#6f6f6f` helper
- `#8d8d8d` placeholder / meta (Gray 50)
- `#c6c6c6` subtle border / muted chrome (Gray 30)
- `#e0e0e0` layer borders / grid lines (Gray 20)
- `#e8e8e8` layer hover
- `#f4f4f4` layer-01 / input fill (Gray 10)
- `#ffffff` background

**Semantic**
- Success `#24a148`, Warning `#f1c21b`, Error `#da1e28`, Info `#0f62fe`

**Typography.** **IBM Plex Sans** for all UI/body (weights 300 Light, 400 Regular, 600 SemiBold). **IBM Plex Mono** 400 for dates, code, eyebrow metadata. Letter-spacing:
- Headings (h1–h6): `letter-spacing: 0`, but display-size titles use `-0.02em` to tighten
- Body (`p`, `span`, `div`): `0.16px`
- Small text (`.text-xs`, `.text-sm`): `0.16px`
- Captions and widely-tracked labels (`UPPERCASE PASSO 01`): `0.1em`–`0.32px`
- Display headlines use `-0.02em` to `-0.03em`

**Scale (public homepage reality):** `text-xs 12` / `text-sm 14` / `base 16` / `lg 18` / `xl 20` / `3xl 30` (stats) / `4xl 36` (section h2) / `5xl 48` (hero h1). Line-height: `leading-[1.1]` for hero, `leading-relaxed` for long-form.

**Weights.** Carbon leans 400/600 only. `font-bold` is used liberally for headlines (visually still 600/700 with Plex). Reserve `font-black` — it appears in a few legacy pricing/editorial sections and feels off-brand vs Carbon; migrate to `font-bold`.

**Spacing / layout.** 8px base grid implied. Max container `max-w-[1584px]` (IBM grid) on nav/footer, `max-w-7xl` (1280px) on home sections. Section padding: `py-24 md:py-28 px-4 md:px-8`. Row gaps `gap-12` to `gap-20` inside the hero; `gap-8` for feature grids. Form rhythm: `space-y-3` for list items, `mb-16` below section intro.

**Border radius.** **0px everywhere.** Carbon rule, enforced at the token level (`--radius: 0`). The only allowed roundings:
- `.pill` — `24px` (used for filter chips)
- `.rounded-full` — `9999px` (avatars, status dots, social-proof avatars only)
- `.avatar-circle` — `50%`

Code that sneaks in `rounded-xl`/`rounded-3xl` (legacy in pricing + editorial) should be migrated to square.

**Backgrounds.** Overwhelmingly flat white. Acceptable washes:
- `#f4f4f4` (Gray 10) — alternating section
- `#edf5ff` (Blue 10) — emphasis section or eyebrow pill
- `#0f62fe` — final CTA band (full-bleed solid blue, white text)
- **Hero gradient (only)**: `linear-gradient(140deg, #ffffff 0%, #edf5ff 60%, #f0f4ff 100%)` — subtle diagonal, white→palest blue. No other gradients anywhere on the marketing site.

Photos appear in the hero (single portrait, `object-cover`, warm/natural light). Prefer people-focused photography over abstract stock. No illustrations; no patterns; no grain. The only "decorative" pattern is a faint grid overlay inside the legacy pricing premium card (to be deprecated).

**Grid-lines as separator.** A very IBM pattern: grids of tiles use `gap-px` on a `bg-[#e0e0e0]` container with each tile `bg-white`. This produces a 1px hairline grid between cells without drawing borders per-tile.

**Cards.** No shadow, no radius. A card is just `bg-white` (or `bg-[var(--cds-layer-01)]` for the muted layer) inside the grid-line system. Hover = swap `bg-[#f4f4f4]` + optional `border-bottom: 2px solid var(--cds-interactive)` as "IBM Tile" affordance. Images inside cards are flush to the edges; no inner padding around thumbnails.

**Shadows.** Globally stripped by `globals.css` (`.shadow-* { box-shadow: none !important }`). The only residual shadows are:
- Hero portrait: `0 24px 64px rgba(15,98,254,0.12)` — soft blue shadow, rare
- Floating hero badges: `0 4px 16px rgba(0,0,0,0.08)`

Treat these as exceptions. Default = flat. If depth is needed, use the 1px hairline technique above or swap the layer color.

**Borders.**
- Subtle: `1px solid #e0e0e0` (most dividers)
- Strong: `1px solid #c6c6c6` (form bottom-border resting)
- Emphasis: `2px solid #0f62fe` (focus outline, active tile)
- Focus: `outline: 2px solid #0f62fe; outline-offset: -2px` (inset, per Carbon)

**Form inputs.** Bottom-border only (`border: none; border-bottom: 1px solid #8d8d8d`), filled background `#f4f4f4`. On focus: bottom-border becomes `2px solid #0f62fe` plus inset outline. Never use rounded pill inputs.

**Buttons.** All square. Three variants in use:
- **Primary** — `bg-[#0f62fe] text-white`, padding `px-8 py-4` (lg) or `px-4 py-2` (default). Hover `#0353e9`, active `#002d9c` + `scale(0.98)`.
- **Secondary/Ghost** — `bg-white text-[#161616] border border-[#c6c6c6]`, hover `bg-[#f4f4f4]`.
- **Danger** — `bg-[#da1e28]`.

Buttons on dark surfaces flip: `bg-white text-[#0f62fe]` on the blue CTA band. Never use drop-shadow on buttons (see legacy pricing for the bad example).

**Hover states.** Subtle color shifts, never scale-up.
- Tile hover: `bg-[#f4f4f4]` + optional 2px bottom accent
- Link hover: `color: #0043ce`
- Button hover: one step darker in the blue/gray ramp
- Social icon hover: `color: #ffffff` (from `#c6c6c6`)

**Press / active states.** `active:scale-[0.98]` on primary CTAs only. Everything else just darkens a step.

**Animation.** Extremely restrained.
- Keyframe library: one `fade-in` (translateY 8px → 0, opacity 0 → 1, `0.3s ease-out both`).
- Stagger via `.delay-100 / .delay-200 / .delay-300`.
- Framer Motion used in `course-card.tsx`, `pricing-section.tsx`, `editorial-section.tsx` for scroll-reveal (`opacity 0, y: 30 → 0`, duration `0.45–0.6s`, `whileInView once: true, margin: "-50px"`).
- **No**: bounces, springs, rotations, parallax, orb-glow effects.
- Easing: `ease-out` or default (no custom cubic-bezier). Duration mostly `200–300ms` for interactive states, `450–600ms` for scroll reveals.
- Transitions: `transition-colors` is the workhorse. Avoid `transition-all` except where explicitly inherited.

**Transparency & blur.** Almost none. The only uses:
- Hero image hover overlay: `bg-black/10`
- CTA subtext: `text-white/60`, `text-white/45` for hierarchy on the blue band
- No `backdrop-blur` anywhere on the marketing site.

**Imagery.** Warm, daylit portraits (`images.unsplash.com` placeholder avatars in current build). Natural skin tones, soft contrast; no black-and-white, no heavy grain, no duotone. Brand photography should feel like IBM's people-at-work library, not stock.

**Iconography approach** — see ICONOGRAPHY below.

---

## Iconography

**System:** `lucide-react` is the only icon set (`"iconLibrary": "lucide"` in `components.json`). All UI icons come from this library as line-style strokes. No mixing with Heroicons, Feather, or Font Awesome.

**Stroke:** Lucide default `2px`. Size tokens:
- `h-3 w-3` (12px) — inside badges, star ratings
- `h-4 w-4` (16px) — inline with text, dropdown items, CTA arrows
- `h-5 w-5` (20px) — hero check-list, button arrows at large size, social icons in footer
- `h-6 w-6` — track-card icon tile (inside a 48px swatch)
- `h-7 w-7` — step-card icon tile (inside a 56px swatch)
- `h-20 w-20` — editorial empty-state placeholder (gray)

**Icon containers:** When an icon needs emphasis, it sits in a **square tinted tile** (never a circle), Blue 10 bg `#edf5ff` with Blue 60 icon `#0f62fe`. Exactly the IBM/Coursera pattern of "chip + icon".

**Icon color:** Use the semantic token of the surrounding content. Helper/muted = `#8d8d8d`, primary = `#161616`, interactive = `#0f62fe`, on-dark = `#c6c6c6` → white on hover. Never use rainbow-colored icons; never use filled variants except for the rating `Star` (fill current color).

**SVGs in the repo (`public/*.svg`)** are Next.js defaults (`file`, `globe`, `next`, `vercel`, `window`) and are NOT part of the CFIA brand system — safe to ignore or delete. Copied to `assets/` for reference only.

**Emoji-as-icon** is used in *two* content contexts only:
- Hero floating badges: 🤖 🚀 🎓 💼 (brand-accent chips with emoji + label)
- Project-showcase cards: 💬 🎯 📊 🚀 (one emoji per project type)

Do not introduce emoji into UI chrome. For a new icon need, reach for Lucide first. If Lucide is missing a glyph (rare), pick a semantically close one and document the substitution.

**Logo.** CFIA uses **wordmark-only** — "CFIA" (uppercase, IBM Plex Sans SemiBold, letter-spacing 0). White on the `#161616` nav bar, near-black on light surfaces. A lowercase variant "cfia" appears in the footer. There is no pictorial mark. `assets/logo-cfia.svg` reproduces this.

---

## What this design system reinforces

- **Be flatter.** Remove leftover gradients, rounded cards, and heavy shadows from legacy `pricing-section` and `editorial-section`.
- **Be gridded.** Lean into the `gap-px` hairline technique. It is IBM-honest and differentiates from Coursera's softer card-based grids.
- **Be fast.** A single fade keyframe + scroll reveals is *the animation system*. Don't add more.
- **Be bilingual-ready.** All copy is pt-BR but layouts should tolerate ~20% text expansion for English and Spanish growth.
