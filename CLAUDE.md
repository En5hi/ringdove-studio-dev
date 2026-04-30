# CLAUDE.md

Persistent context for AI-assisted work on this repo. Read this at the start of every session. The principles here are not preferences — they are the load-bearing decisions that keep the site coherent.

## What this is

`ringdove.studio` — the website for Ringdove, a small craft-led design studio. Two disciplines (product design and audio plugin design), one solo operator (Maciej Grzywacz), Polish company (RINGDOVE SP. Z O.O.), based in Kraków. The site is editorial-restrained, dark, typographically led. The visual direction is **locked**; engineering and content choices live within it.

## Stack & commands

- **Astro** + TypeScript, **MDX** for case studies, plain CSS with CSS variables, **pnpm** as the package manager.
- No Tailwind. No CSS-in-JS. No utility classes. Component-scoped CSS only.

```
pnpm dev       — local dev server at :4321
pnpm build     — production static build to ./dist
pnpm preview   — preview the production build
pnpm typecheck — astro check
pnpm format    — prettier --write
```

Don't add new tooling without a reason. If you find yourself reaching for a library, ask first.

## File structure

```
src/
├── components/
│   ├── frame/             — Frame.astro, FrameTop, FrameBottom, FrameSides
│   ├── plates/            — HeroPlate, WorkPlate, StudioPlate, StatementPlate, ContactPlate
│   └── work-images/       — SpireImage, LatticeImage, MorrowImage, HalftoneImage
├── content/
│   ├── config.ts          — content collections schema
│   └── work/              — *.mdx case studies
├── layouts/
│   └── Base.astro
├── pages/
│   ├── index.astro
│   ├── 404.astro
│   ├── impressum.astro    — Polish business imprint (legally required)
│   └── privacy.astro
├── styles/
│   ├── tokens.css         — CSS custom properties
│   ├── reset.css
│   └── global.css
└── lib/
    └── frame-observer.ts
public/
└── fonts/                 — self-hosted WOFF2 (Author only; display face is system serif)
```

Components are PascalCase. Files match their default export. One component per file. Image components live alongside other components but are named `*Image.astro` for grep-ability.

## Design tokens

All values live in `src/styles/tokens.css` as CSS custom properties. Never hardcode a color, type size, or spacing value in a component — reference the token. If you need a value the tokens don't have, add a token first and document why.

```css
:root {
  /* Color — single warm cream on near-black, no chromatic accent */
  --bg: #0A0907;
  --bg-soft: #100E0B;     /* image plate backgrounds, raised surfaces */
  --ink: #F2ECDC;         /* primary type, hairlines that read as ink */
  --ink-soft: #918A7C;    /* secondary type, frame labels */
  --ink-faint: #4A453B;   /* tertiary, disabled, register marks */
  --rule: rgba(242, 236, 220, 0.20);
  --rule-soft: rgba(242, 236, 220, 0.08);

  /* Type families. Display is the system serif by intention (resolves to Times New Roman
     on Windows, Times on macOS) — do NOT swap in a webfont without explicit direction;
     this is the studio's chosen rendering. Body is self-hosted Fontshare Author. */
  --display: 'Times New Roman', Times, Charter, Cambria, serif;
  --body: 'Author', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Frame */
  --frame-w: 36px;        /* desktop. 24px on <880px */
}
```

### Type scale (use these exact ramps; do not invent new sizes mid-component)

| Role | Family | Weight | Size | Line | Tracking |
|---|---|---|---|---|---|
| Hero headline | display | 200 | clamp(56px, 9.6vw, 168px) | 0.94 | -0.035em |
| Project title | display | 300 | clamp(36px, 4.4vw, 64px) | 0.98 | -0.025em |
| Italic lede | display italic | 400 | 19px | 1.42 | 0.005em |
| Statement quote | display | 200 | clamp(36px, 5.6vw, 88px) | 1.1 | -0.030em |
| Wordmark (frame) | display | 400 | 17px | — | -0.005em |
| Body paragraph | body | 400 | 15px | 1.65 | 0 |
| Frame section label | display italic | 300 | 13px | — | 0.01em |
| Micro-label | body | 500 | 10.5px | — | 0.22em uppercase |
| Vertical frame text | body | 500 | 10px | — | 0.30em uppercase |

If a new role appears, add it to this table.

## The Frame — load-bearing rules

The Frame is the brand's structural argument. Breaking it breaks the brand.

- **Persistent across all pages.** Same frame on the homepage, case studies, 404, impressum.
- **Top, bottom, left, right are separate fixed elements** with `z-index: 100`. The center label in the top frame and the pagination in the bottom frame **update on scroll** via IntersectionObserver — see `src/lib/frame-observer.ts`. Plates declare their identity via `data-section` and `data-page` attributes; the observer reads those.
- **Corner ticks** at the inner corners are intentional. They render as 9×9px crosshairs using stacked CSS gradients. They must appear at every breakpoint.
- **Vertical text on the sides** uses `writing-mode: vertical-rl`. Left side rotates 180° so it reads bottom-to-top; right side reads top-to-bottom. Do not fake this with `transform: rotate()` — it breaks accessibility.
- **The wordmark "Rin*g*dove"** with the italic 'g' is the brand's single typographic signature. Render it as `Rin<em>g</em>dove` where `em` is the display italic, same weight as the surrounding roman. Do not animate, color, or otherwise decorate it.
- **Mobile reduces `--frame-w` to 24px** and hides the dynamic section label in the top center (the nav links remain). The vertical side text shrinks but stays.

If you are tempted to refactor the frame "for cleanliness" — stop. The frame is the most-tested part of this site.

## Italic is the only emphasis device

There is no bold. There is no underline. There is no color highlight. There is no all-caps for emphasis (only for micro-labels, which are a different role).

- Use `<em>` for semantic emphasis. The CSS ensures `em` always renders in the display italic (system serif italic).
- Hover states on links go italic instead of underlining: `a:hover { font-style: italic; }`.
- Section labels in the frame are pre-set in italic.
- The hero headline mixes display roman with italicised emphasis ("…that *repay attention*").
- Mid-paragraph emphasis in body text uses `<em>` and gets italic Author or italic display depending on context (the global rule maps `em` inside body type to display italic — preserve this).

If you find yourself wanting a "highlight" or an accent color — find an italic instead, or accept that the line doesn't need emphasis.

## Voice & copy

The studio voice is specific. New copy must read like the existing copy. If you are generating placeholder text, generate it in this voice — do not use Lorem Ipsum, do not use generic agency prose.

**Do:**

- "We design product interfaces for software founders, and audio plugins for the people who make them."
- "Two disciplines, one standard."
- "We take on a small number of projects each year."
- "The work that the work asks for. *No more, no less.*"

**Do not:**

- "Innovative," "passionate," "cutting-edge," "leveraging," "solutions," "best-in-class," "world-class," "award-winning."
- Exclamation marks, ever.
- Three-word marketing tag lines ("DESIGN. CRAFT. DELIVER.").
- Em-dashes used as energy ("We do design — and we do it well!"). Em-dashes are fine when they earn the pause.

**Typographic copy hygiene:**

- Use real curly quotes (` " " ' ' `), not straight (`" '`).
- En-dash for ranges (`3–6 months`), em-dash for parenthetical asides (`— like this —`), hyphen only for compound words.
- Use `·` (middot) as the inline separator in metadata (`Plugin GUI · Brand · Marketing`).
- Roman numerals for chapter markers (I, II, III, IV).
- "MMXXVI" for the year in the colophon and frame footer.

## Components — patterns to follow

### Plates

A plate is a full-viewport-height section inside the frame canvas. Every plate has:

- A `min-height` of `calc(100vh - var(--frame-w) * 2)`.
- A `data-section` attribute with the plate's section title (used by the frame observer).
- A `data-page` attribute with the pagination string (used by the frame observer).
- A bottom border of `1px solid var(--rule-soft)`.

The hero, studio, statement, and contact plates each render once. The work plate is reused per project (`<WorkPlate work={spire} variant="left" />`, `<WorkPlate work={lattice} variant="right" />`).

### Work plate alternation

Plate variants alternate `left` (image left) and `right` (image right). Use the `order` CSS property (not `direction: rtl`) to flip:

```css
.layout.reversed .image { order: 2; }
.layout.reversed .copy { order: 1; }
```

Image is fixed at `aspect-ratio: 4 / 5` (portrait), `max-width: 480px`. Copy column has `max-width: 440px`. Gap between them is `96px` on desktop, collapsing to a stacked layout below 880px (always image-first when stacked, regardless of variant).

### Work image components

Each project has a custom CSS-only visual treatment. They are abstract, typographic, geometric — not photographic. Real client mockups, when added, replace these in v2 and live as Astro `<Image>` components for optimisation.

Until then, the visual treatment for each project must:

- Use only `--ink`, `--bg-soft`, and opacity steps. No new colors.
- Render at every viewport size without breaking.
- Sit inside `position: relative` with `overflow: hidden`.
- Include small typeset labels (project name, year) as part of the visual where appropriate.

## Motion

Motion is quiet and earns its place. Not decoration.

- All transitions: 200–400ms, easing `cubic-bezier(0.2, 0.8, 0.2, 1)` (custom ease-out, slightly slower at the end). 600–800ms only for image hover scale.
- Hero word-rise: each word fades + translates 40px upward, staggered 80–100ms apart, total ~1100ms.
- Link hover: italic transition over 220ms.
- Plate image hover: `scale(1.005)` over 800ms. Yes, only 1.005 — this is a felt detail, not a visible animation.
- Section/page indicator updates in the frame: opacity transition over 400ms.
- Equaliser bars (if used): keyframe animation, 1.6s loop, sequenced delays.

**Always wrap in `prefers-reduced-motion: reduce`** that disables the rise-in, the scale, and the equaliser. Static layout and the IntersectionObserver-driven frame updates remain — those are not motion, they are state.

## Performance

- Lighthouse 95+ across all four categories on a clean build. Run `pnpm build && npx serve dist` and audit before merging anything significant.
- Self-host Author in `public/fonts/`. Use `font-display: swap`. Preload Author 400 in `<head>`. The display face is the system serif (no webfont) — no preload needed for it.
- No third-party scripts in v1. No fonts.googleapis.com, no analytics until decided, no Hotjar / Intercom / etc.
- Inline the critical CSS Astro generates by default. Don't add a separate CSS bundler.
- Image optimisation via Astro's `<Image>` component when real images replace the CSS visualisations.

## Accessibility

- Color contrast: `--ink` on `--bg` is high-contrast cream-on-black; verify with a contrast checker after any token change. Target AAA.
- Focus rings: thin cream outline (`outline: 2px solid var(--ink); outline-offset: 2px`). Do not remove focus styles.
- Tab order matches reading order, including the frame's nav links.
- All vertical text uses `writing-mode`, not `transform: rotate` — this preserves screen reader behaviour.
- Heading hierarchy: one `h1` per page (the hero headline), `h2` for plate titles, `h3` for studio columns. Don't skip levels.
- Decorative elements (corner ticks, grain overlay, vignette) are CSS-only and not in the DOM accessibility tree.

## Anti-patterns — do not

- **Do not introduce a chromatic accent color**, even briefly, even "just for a CTA." The site has no accent. Italic is the accent.
- **Do not add Tailwind, Bootstrap, or any utility CSS framework.** The aesthetic depends on hand-tuned typography and spacing; utilities will silently corrupt it.
- **Do not add a hamburger menu.** The frame's three nav links are the navigation, and they fit on mobile.
- **Do not add a dark/light toggle.** The site is dark by intention.
- **Do not add scroll-snap, full-page-scroll libraries, or anything that takes scroll away from the user.** The plates are full-viewport but normal scroll.
- **Do not animate the frame itself.** It does not move. It does not fade. The text *inside* it updates; the structure stays.
- **Do not use Lorem Ipsum.** Generate copy in the studio voice or leave a clearly marked `TODO`.
- **Do not add testimonials, logos-of-clients-strips, "trusted by" sections, or any other social-proof component.** They violate the studio voice.
- **Do not use stock photography or AI-generated imagery** as work visuals. Either CSS abstractions (current) or real client work (v2).
- **Do not change the wordmark.** "Rin*g*dove" with the italic 'g' is the brand mark.
- **Do not bold body text.** Ever. Not even "for emphasis on this one word."

## Polish business compliance

Ringdove is registered as RINGDOVE SP. Z O.O. The `/impressum` page must include the registered address, NIP, REGON, and KRS (Maciej will provide the values). The `/privacy` page must explain how the `mailto:` link works and any analytics in use. GDPR cookie banners are not required if the site sets no cookies (the v1 setup with no analytics qualifies); confirm with Maciej before adding anything that does set cookies.

## When in doubt

- Choose less.
- Read the prototype HTML — it is the visual source of truth.
- If a decision feels like it could go either way, ask Maciej before merging.
- The studio voice in CLAUDE.md governs CLAUDE.md — write commit messages, PR descriptions, and code comments in the same restrained register. No emoji in commits.
