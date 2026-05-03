# Ringdove Studio — Session 2 prompt

You are continuing work on `ringdove.studio` — Maciej Grzywacz's solo design studio site (`RINGDOVE SP. Z O.O.`, Kraków). The codebase is an Astro 5 + TypeScript + MDX project with a self-hosted Author body font and a system serif (Times New Roman / Times) display face. Read [`CLAUDE.md`](../CLAUDE.md) for the load-bearing project conventions before doing anything. The visual prototype lives at [`docs/prototype.html`](./prototype.html); [`docs/INITIAL_PROMPT.md`](./INITIAL_PROMPT.md) is the original engineering brief.

The studio voice is restrained, editorial, italic-as-the-only-emphasis, no chromatic accent, no marketing language. Every change you ship here has to read like it belongs to that voice — large gestures are welcome but loud gestures are not.

This session has six work items, in priority order.

---

## 0. Branch hygiene before you start

Branch off `main`. Suggested name: `feat/session-2` (or split each item into its own branch if they're large).

Push to `origin/<branch>` periodically. End the session with a clean merge into `main` and `origin/main`.

---

## 1. Quick fixes (do these first — they're small, visible, and unblock the rest)

### 1a. Frame corner ticks at the top are clipped

Currently the four `+`-shaped register marks at the inner corners of the frame are decorative — see CLAUDE.md "Frame" section. The two **top** corner ticks render only their lower half because something (probably the `frame-top` element's `border-bottom` or the section content) is sitting on top. The two **bottom** ticks render correctly. Inspect [`src/components/frame/FrameTop.astro`](../src/components/frame/FrameTop.astro) and confirm:

- Either the `::before` / `::after` pseudo-elements need `z-index: 1` to lift above their parent's border
- Or the calc'd offset (`top: calc(var(--frame-w) - 5px)`) needs adjusting once frame-w changes (see item 1c)

Fix so all four ticks render fully visible.

### 1b. Frame top + bottom padding should match side panel width

Currently `frame-top` and `frame-bottom` use `padding: 0 16px`. The side panels (`frame-left` / `frame-right`) are `var(--frame-w)` wide. The user wants the inner content of the top + bottom bars (wordmark, section label, nav, coords, page counter, colophon) to align with the inner edge of the side panels — meaning the horizontal padding on top + bottom should be `var(--frame-w)` instead of 16px. Update both [`FrameTop.astro`](../src/components/frame/FrameTop.astro) and [`FrameBottom.astro`](../src/components/frame/FrameBottom.astro). Confirm the corner ticks still land in the right place after the change.

### 1c. Frame and frame-text scaling on large viewports

The user reports that on a 4K display, the wordmark, plate counter, nav, and side text feel too small. They want **uniform bumps applied above breakpoints**, not fluid scaling — the existing sizes are fine on standard desktop and mobile, but at large viewports the whole frame (text + width) should step up.

Implementation:

- Add a `@media (min-width: 1600px)` (and possibly `@media (min-width: 2400px)`) override that:
  - Bumps `--frame-w` from `36px` to `~48px` (and `~56px` at 2400+) in `:root`
  - Bumps wordmark from `17px` to `~22px` (and `~26px` at 2400+)
  - Bumps frame nav, side text, coords, colophon from `12px` → `~14px` → `~16px`
  - Bumps the page counter (display italic 13px) → `~16px` → `~18px`
- Confirm the page counter and section label keep the `transition: opacity 400ms` behavior unchanged
- Verify nothing breaks below 1600px

The exact values are a judgment call — start with the suggestions above, screenshot at 1280 / 1600 / 2400 / 3840 viewports, and dial in.

### 1d. Hero: drop the caption, headline larger

Currently `HeroPlate.astro` renders `Quiet design / for digital products / that repay attention.` with an italic caption beneath ("Two disciplines, one standard."). The user wants the **caption removed entirely** and the headline **larger**.

- Delete the `<p class="caption">` and its CSS rules from [`HeroPlate.astro`](../src/components/plates/HeroPlate.astro)
- Remove `caption` from `SITE.hero` in [`src/lib/site.ts`](../src/lib/site.ts) (it's no longer used)
- Increase headline size — current is `clamp(56px, 7vw, 112px)`. Try `clamp(72px, 8.4vw, 144px)` first, screenshot, dial in. The three forced lines via `.hl-row` spans must continue to work — keep both the inline-style and the scoped CSS so it survives an HMR cache wedge.

The empty space below the headline (now without caption) should still feel intentional, not unfinished. The page below the hero is the work plates — the negative space is meant to let the hero land before the work begins.

---

## 2. Statement plate — replace with a different content type

The user does not want the centered slogan plate ("We do the work that the work asks for. *No more, no less.*") in its current form. The slogan reads as corny and the centered-quote layout doesn't earn its place.

[`src/components/plates/StatementPlate.astro`](../src/components/plates/StatementPlate.astro) is the file. Replace it with **a different content type that fits the studio voice**, not just a different slogan.

Propose 2–3 concrete alternatives in your first design pass and let the user pick. Possibilities:

- **Editorial process note** — a short prose paragraph (3–5 sentences) describing how the studio works on a project. Italic, left-aligned, sets the page rhythm before the studio plate.
- **Availability + contact teaser** — "Open for Q3, two slots, both tracks. Write *hello@ringdove.studio*." Direct, in voice, replaces the slogan with a state-of-business.
- **Journal-style fragment** — a single dated note ("April 2026 — On designing for sound...") with a paragraph of prose. Hints at a journal/writing surface that doesn't yet exist (v2 territory) but reads well as a single artefact today.
- **Studio principle** — a short numbered list of 3 commitments (e.g. "I. We say no often. II. We deliver finished work. III. We don't dramatise."). Italic, restrained.
- **A real client snippet** — pulled from one of the four work plates, presented as an editorial pull-quote with attribution. Bridges between the work above and the studio below.

The user wants this to *replace* the slogan plate's role, so it should still work as the "pause" between work and studio. Don't drop the plate entirely — adjust its content and design.

The plate's current `data-section` is `"A studio note, kept on the wall"` and `data-page` is `"— / VI"`. Update both as appropriate to the new content. The frame indicator currently doesn't number this plate; that pattern can continue or change depending on the new design.

---

## 3. Background interest — sketch 2–3 concepts

The user looked at [bureau.cool](https://bureau.cool) and noted how its mostly-white site has decorative-but-meaningful background elements (their rotating ring of recent engagements). Ringdove's pages currently have the cream-on-near-black palette but no background life — the negative space reads as "empty" rather than "considered."

The user wants you to **sketch 2–3 concrete concepts** before committing, so they can compare like-for-like. The concepts should span the complexity range:

- **Concept A — CSS / SVG only**. A slow-drifting decorative element. E.g. a typographic ring rotating through current engagements ("Currently designing for *Polyphon*… *Lattice*… *Q3 open*…"); or hairline marginalia drifting on a long timeline; or a kinetic colophon set in the corner. No render loop, runs ~free of CPU. ~10–20kB of CSS + an SVG.
- **Concept B — WebGL-light**. A simple shader (animated noise tinted in `--ink` opacity 0.04, slow ripple effect, or particle drift). One small lib (`ogl` or `twgl`) and ~50 lines of GLSL. Runs as a render loop but constrained to a single canvas with `prefers-reduced-motion` gating.
- **Concept C — full WebGL**. A more substantial scene — fluid simulation, slow flowing gradient mesh, or a rendering of typography in 3D space (with the wordmark or hero text). Highest visual impact, real perf budget needed, mobile considerations.

Each concept should be sketched as a **standalone Astro component** under [`src/components/background/`](../src/components/) (new directory) and toggleable via a `?bg=a|b|c` query param on the homepage so the user can compare them by visiting different URLs. Don't ship all three — implement them as alternatives, demo them, then the user picks one and the others get deleted.

Constraints: no chromatic accent, must respect `prefers-reduced-motion`, must not interfere with the existing reveal animations or the frame.

---

## 4. Work plates as a single sticky-scroll block

This is the largest item in this session. The user wants the four work plates (Spire / Lattice / Morrow / Halftone) to behave as **one composed "projects" section** with sticky-scroll mechanics, inspired by [bureau.cool's projects page](https://bureau.cool/projects).

### Behaviour

When the user scrolls into the projects section:

1. **A sticky counter on the left** appears, showing the four project names. The currently-active project's name is in `--ink`; the others are in `--ink-faint`. Sticky-positioned so it doesn't scroll out of view while the user is in the projects section.
2. **A sticky project image on the right** appears, showing the current project's image-area (the existing CSS-only image components). Stays pinned to the right side of the viewport while the user is in the projects section.
3. **Only the project copy scrolls.** As the user scrolls, the active project's text slides up and out of view (fading and increasing blur as it leaves), and the next project's text slides up from below (fading in from blur). The counter on the left animates its state change (default → active for the new project, active → default for the previous one). The sticky image on the right cross-fades from one project's image to the next.
4. When the user scrolls past the last project (Halftone), the entire sticky section unsticks and the page resumes normal flow.

This is "scrollytelling" — pin a section, advance content as scroll progresses through a fixed range. The cleanest approach is `position: sticky` on the section, with internal IntersectionObserver-driven state machine for which project is "active". Avoid GSAP/ScrollTrigger if possible — the brief forbids third-party libs. CSS `position: sticky` + a small vanilla JS observer should be sufficient.

### Layout changes

- **Project images become square** (`aspect-ratio: 1 / 1`) instead of `4 / 5`. The four work-image components ([`SpireImage.astro`](../src/components/work-images/SpireImage.astro), [`LatticeImage.astro`](../src/components/work-images/LatticeImage.astro), [`MorrowImage.astro`](../src/components/work-images/MorrowImage.astro), [`HalftoneImage.astro`](../src/components/work-images/HalftoneImage.astro)) all need their internal CSS re-tuned for the new aspect ratio. The Spire ring constellation, the Lattice grid + ink rect, the Morrow price + dashed rule, and the Halftone radial dots all need their proportions checked at 1:1.
- **No more alternating left / right layout.** All four projects share the same sticky right-side image slot and same scrolling-text slot. The `variant: 'left' | 'right'` field in the work content collection becomes unused for this view (still used on `/audio` and `/product` discipline pages, so leave the field in place).
- **Counter on the left** is a new component. Lives outside the sticky region's main content (sticky positioned in its own column), 4 rows of project names, hairline divider between them. Active state: italic + `--ink`. Inactive: roman + `--ink-faint`.

### Implementation notes

- Refactor [`WorkPlate.astro`](../src/components/plates/WorkPlate.astro) into either a new `WorkSticky.astro` block component (preferred — keeps the plate-per-project model usable for discipline pages) or split into `WorkCopy` + `WorkImage` siblings.
- Update [`src/pages/index.astro`](../src/pages/index.astro) to render the projects as one sticky block instead of four sequential plates.
- Update the data-section / data-page attributes — the four projects might be one logical "frame plate" now, with the section label changing as the user advances. Or each project could keep its own data-section, with the frame indicator updating per scroll position.
- Keep the discipline pages (`/audio`, `/product`) using the original `WorkPlate.astro` — those pages render only 2 plates each and don't need sticky-scroll.
- Reveal animation (`src/lib/reveal.ts`) still applies to the project image and copy on first scroll into the section.

### Verification

- Hard scroll through the projects section at desktop, tablet, and mobile widths
- Confirm sticky behaves correctly at viewport heights 600 / 800 / 1000 / 1400
- Tab through with keyboard — counter project names should be focusable links if they're navigable, or just decorative if not
- Reduced motion: disable the slide+blur, just swap content on scroll

---

## 5. Footer — Ringdove wordmark overlapped by colophon

The user picked: keep the contact plate's role, but layer it. The giant `Ringdove.` wordmark in [`ContactPlate.astro`](../src/components/plates/ContactPlate.astro) currently sits centered in the upper portion with the contact info card below. The user wants the wordmark to **drop lower** so the contact info card **overlaps its lower half**.

Implementation:

- Push the wordmark vertically down (e.g. `align-self: end` instead of `center`)
- Position the contact info absolutely or via grid overlap, sitting on top of the wordmark's lower portion
- The wordmark stays at full color (`--ink`) but the overlapping contact-info card stays readable on top
- Consider whether the wordmark should be in a slightly muted ink (`--ink-soft`?) where it shows behind the contact info, while the rest is full ink
- Mobile: stack normally, no overlap (it'd be illegible at small sizes)

Reference [set.studio](https://set.studio) for the bolder layered-typography style the user is drawn to.

---

## 6. Open items / known gotchas

These will bite during the session — flag them up front:

### Vite HMR can wedge on scoped Astro CSS

When you edit a scoped `<style>` block multiple times in succession, Vite occasionally fails to push the new rules to the browser even though the dev server is serving them correctly (verifiable via `curl`). Symptom: HTML structure updates fine, computed styles don't.

**Workarounds**:
1. Rename a class in the affected file (e.g. `.col` → `.disc`, `.line` → `.hl-row`). This invalidates Vite's module cache and forces fresh CSS through.
2. Or kill `pnpm dev` and restart.
3. Belt-and-braces: for critical layout properties on a freshly-renamed class, also apply them as inline `style="..."` so they survive a stale stylesheet (see `.hl-row` in [`HeroPlate.astro`](../src/components/plates/HeroPlate.astro) for the pattern).

### Astro scoped CSS mishandles `:has(.foo:hover)` selectors

When you write `.parent:has(.child:hover) .child:not(:hover)` in a `<style>` block, Astro's scoping pass sometimes drops the `:has()` parent from the first selector of compound rules, leaving `.child:not(:hover)` matching always. **Move those rules to a `<style is:global>` block** (namespaced tightly — e.g. `.plate.studio .body:has(.disc:hover) ...`) to bypass the scoper. See the bottom of [`StudioPlate.astro`](../src/components/plates/StudioPlate.astro).

### 12px font minimum

The user wants no rendered text below 12px. The codebase has been swept once — don't reintroduce 10.5px / 11px values. If a label needs to feel small, push the case + letter-spacing rather than the px size.

### Subgrid for mirrored content alignment

The studio plate's two cards use CSS subgrid to keep each text block (kicker / heading / lede / body / meta / cta) at the same height across the mirror. If you build a similar mirrored layout elsewhere, use the same pattern — see [`StudioPlate.astro`](../src/components/plates/StudioPlate.astro) for the working example.

---

## Verification (session-end)

Before merging, on the production preview (`pnpm preview`):

1. Visit `/` at desktop, tablet, mobile, and 4K viewport widths
2. Hover and scroll through every plate; confirm reveal animations fire
3. Confirm corner ticks render at all four corners on every viewport
4. Confirm frame top + bottom padding aligns with side panel inner edges
5. Confirm hero headline is at the new size with no caption underneath
6. Confirm projects section sticky-scrolls correctly with counter + sticky image
7. Confirm statement plate renders the new content type
8. Confirm contact plate has wordmark overlapped by contact info
9. Confirm `prefers-reduced-motion: reduce` disables the new motion (background animation, sticky-scroll fades, statement plate animations)
10. Run `pnpm exec astro check` and `pnpm build` — both should be clean
11. Lighthouse on the production preview — target the brief's 95+ across all four categories

---

## References to look at while working

- [bureau.cool](https://bureau.cool) — the rotating-ring engagement display, the projects page sticky-scroll behaviour
- [set.studio](https://set.studio) — bolder typographic layouts, the layered-wordmark pattern for the contact plate
- [pentagram.com](https://pentagram.com) — magazine-cover hero treatment, type-led project entries
- [klim.co.nz](https://klim.co.nz) — type foundry restraint
- [manuelmoreale.com](https://manuelmoreale.com) — single-italic-paragraph editorial register

---

## Definition of done

The page reads as the same studio that scaffolded the v1, but with the empty space turned into considered space, the projects section reading as one composed editorial unit, the frame holding its weight at every screen size, and every plate landing on its intended role.

When in doubt, choose less. The brief still applies.
