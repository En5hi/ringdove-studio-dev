# Ringdove Studio Site — Initial Prompt

You are helping Maciej Grzywacz build the production version of **ringdove.studio**, the website for his solo design studio. This document is the brief. A working visual prototype already exists (`prototype.html` — see end of this document); your job is to turn it into a maintainable, well-engineered Astro project, **not to redesign anything**. The visual direction is locked.

## What Ringdove is

A small, craft-led design studio for digital products. Two disciplines, one standard:

- **Product Design** — for software founders building considered products. End-to-end engagements, 3–6 months, embedded.
- **Audio Plugin Design** — for plugin developers and audio software companies. Per-plugin engagements, 6–12 weeks, with brand and packaging where it applies.

The studio is intentionally solo (Maciej), with the option to bring in trusted collaborators on a profit-sharing basis when scale demands it. The studio is registered as **RINGDOVE SP. Z O.O.** in Poland and operates from Kraków on Central European time.

The audio work is positioned as the proof of the standard — the level of typographic and interaction craft visible on a plugin GUI is the studio's quality bar across both tracks.

## Voice

- Studio voice (`we`) on all public-facing pages.
- Personal first-person on the about page and in client emails (out of scope for v1).
- Restrained, considered, opinionated, warm but not casual.
- No marketing language. No superlatives. No "innovative," no "passionate," no "we are committed to."
- Honest about scale: "we take on a small number of projects each year."
- Italic does the work that exclamation marks would otherwise do. Use it sparingly and with intention.

If a line of copy could appear on a generic agency landing page, it does not belong on this site.

## Visual direction — the Frame concept

The site is organised around a single substantive idea: **the studio is a frame, the work is the picture.** This is expressed structurally — a persistent thin border around the viewport (36px on desktop, 24px on mobile) holds the studio metadata: wordmark, location, current commitments, set-in line, coordinates, pagination, navigation. The center is reserved as the canvas for work and content. The frame does not scroll; the canvas does. As the canvas scrolls, the frame's center label and pagination update to reflect the section currently in view — the frame quite literally narrates the visit.

This is not chrome decoration. It is the structural articulation of the brand. **Do not break it.** Specifically: the frame's content updates on scroll, the corner ticks (small register marks at the inner corners) are intentional craft details that must render at every viewport size, and the vertical sides use real CSS writing-mode (not transformed elements) so screen readers handle them correctly.

### Palette

A single warm cream on near-black. **No chromatic accent.** Tonal hierarchy via opacity steps:

- `--bg` `#0A0907` (canvas, frame)
- `--bg-soft` `#100E0B` (image plate backgrounds)
- `--ink` `#F2ECDC` (primary type)
- `--ink-soft` `#918A7C` (secondary type)
- `--ink-faint` `#4A453B` (tertiary, hairlines, register marks)
- `--rule` `rgba(242, 236, 220, 0.20)`
- `--rule-soft` `rgba(242, 236, 220, 0.08)`

### Typography

- **Display: Zodiak** (Indian Type Foundry / Fontshare). Chiseled hairline serif. Used for the wordmark, headlines, project titles, italic emphases, and large display moments. Weights in use: 200, 300, 400, 400 italic, 500.
- **Body: Author** (Fontshare). Modern grotesque with quiet humanist detail. Used for body paragraphs, all uppercase micro-labels, meta lists, and frame text. Weights in use: 300, 400, 500, 400 italic.

Italic carries emphasis everywhere — there is no underline, no bold, no color highlight. Hover states on links go italic instead of underlining. The wordmark "Rin*g*dove" uses an italic 'g' as the brand's single typographic signature.

### Motion

Quiet, intentional, never decorative. Specifically:

- Hairline opacity changes on hover (200–280ms).
- A slow word-by-word rise on the hero headline at first paint.
- A subtle scale (1.005, not 1.05) on plate images on hover.
- A barely-perceptible cream vignette in the background.
- Film-grain overlay at 5% opacity, multiply blend mode.

Respect `prefers-reduced-motion: reduce` — disable the rise-in, the scale, and the equaliser; keep the static layout and the scroll-driven frame updates.

## Content architecture

The homepage is a sequence of full-viewport-height "plates" inside the frame:

1. **Hero plate** — single centered headline ("Quiet design for digital products that *repay attention.*"), small floor metadata.
2. **Work plates × 4** — alternating layout (image left/right, copy on the other side). Each plate is a single project: image on one half, copy column on the other (pretitle, title, italic lede, body paragraph, structured `Deliver / Term / Status` list).
3. **Studio plate** — two columns, one paragraph each, for Product Design and Audio Plugin Design.
4. **Statement plate** — single centered quote ("We do the work that the work asks for. *No more, no less.*").
5. **Contact plate** — large wordmark, three info columns (Write / Located / Currently).

Each plate has `data-section` and `data-page` attributes; an IntersectionObserver in the frame uses these to update the live section name and pagination indicator.

## Technical requirements

- **Astro** with **TypeScript**. Static output. Zero JS shipped to the client except for the frame's IntersectionObserver and the hero word-rise (lazy-hydrated).
- **MDX** for case studies. Each project lives as `src/content/work/{slug}.mdx` with structured frontmatter (`title`, `client`, `discipline: 'product' | 'audio'`, `year`, `status`, `deliverables[]`, `term`, `order`, `featured: boolean`).
- **Plain CSS with CSS variables.** No Tailwind. No CSS-in-JS. Tokens in `src/styles/tokens.css`, scoped component styles in Astro components.
- **Self-hosted fonts** in `public/fonts/`. Download Zodiak and Author WOFF2 files from Fontshare. Use `font-display: swap`. Preload the two critical weights (Zodiak 300, Author 400). Subset where possible.
- **Lighthouse target: 95+ across all four categories** on a clean build.
- **No analytics in v1** unless privacy-first (Plausible or Cloudflare Web Analytics). Do not add Google Analytics.
- **Contact: `mailto:`** for v1. No form.
- **Deployment: Cloudflare Pages or Vercel.** Domain points at `ringdove.studio`.

### File structure

```
src/
├── components/
│   ├── frame/             — Frame, FrameTop, FrameBottom, FrameSides
│   ├── plates/            — HeroPlate, WorkPlate, StudioPlate, StatementPlate, ContactPlate
│   └── work-images/       — One component per project's visual treatment
├── content/
│   └── work/              — *.mdx case study files with frontmatter + body
├── layouts/
│   └── Base.astro         — html, head, fonts, global CSS
├── pages/
│   └── index.astro        — composes plates from content collection
├── styles/
│   ├── tokens.css         — CSS custom properties only
│   ├── reset.css
│   └── global.css         — body, scrollbar, grain, vignette, focus styles
└── lib/
    └── frame-observer.ts  — IntersectionObserver for plate → frame updates
public/
└── fonts/                 — self-hosted WOFF2 files
```

## Quality bar

This is not a portfolio site that uses the studio's work as decoration. It is a piece of work in itself. The hover state on a navigation link, the kerning of the wordmark in the frame, the way the section name fades when the active plate changes — these are visible to the kind of clients the studio wants. Treat every detail as if a discerning art director will inspect it.

Specifically:

- Real curly quotes and proper en/em dashes throughout. No straight quotes anywhere.
- Hairlines that are visually 1px regardless of DPR (inspect, don't assume).
- Focus rings that respect the brand (a thin cream outline at 2px offset, not the browser default).
- Tab order that matches reading order, including the frame.
- A 404 page that uses the same frame and the same restraint.
- Imprint / impressum at `/impressum` (Polish business compliance for Sp. z o.o. — registered address, NIP, REGON, KRS visible). A privacy policy at `/privacy` even if there is no analytics or form, since the email link still discloses an address.

## Phasing

**v1 (now)** — Single-page homepage matching the prototype, with the four projects from the prototype as MDX files (Spire, Lattice, Morrow, Halftone). Real client names and rough copy fine; final case study detail pages out of scope. Frame, all plates, IntersectionObserver, motion, fonts, deploy.

**v2 (later)** — Individual case study pages at `/work/{slug}`, an about page with personal first-person voice, a journal/notes section if Maciej decides to start writing.

**Out of scope** — Blog, search, dark/light toggle (the site is dark by intention), CMS, contact form, multi-language. Resist scope creep.

## What good looks like

A discerning person — the kind of client Ringdove wants to attract — visits the site, scrolls through it once, sees no UI element they would change, sees no piece of copy they would rewrite, and remembers two things twenty minutes later: the frame, and the headline. That is the bar.

## Reference

Visual source of truth: `prototype.html` (the dark frame variation, with Zodiak and Author, alternating side-by-side work plates). Exact CSS variables, type sizes, spacing, motion timings, and image visualizations are encoded there. **Treat the prototype as a binding spec for visual fidelity. Treat this document as the binding spec for engineering, content model, and quality.**

When in doubt, choose less.
