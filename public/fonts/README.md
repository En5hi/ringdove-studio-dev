# Fonts

The site uses two type families:

- **Display** — the system serif (resolves to **Times New Roman** on Windows / **Times** on macOS). Not a webfont. No file in this directory.
- **Body** — self-hosted Fontshare **Author**, served as a variable WOFF2 from this directory.

## Files in use

```
author/author-variable.woff2          — Author roman, weight axis 100–900   (preloaded)
author/author-variable-italic.woff2   — Author italic, weight axis 100–900
```

Referenced from `src/styles/tokens.css` (`@font-face`) and `src/layouts/Base.astro` (`<link rel="preload">`). Renaming or moving them means updating both places.

The variable Author file covers every weight the site uses (300, 400, 500) in two files, with smaller cumulative size than shipping multiple static cuts.

## Why no Zodiak

The original brief and the prototype loaded Zodiak from Fontshare's CDN. In practice the prototype's `font-weight: 200` rules don't match any of Fontshare's available Zodiak cuts (which start at 300/Light), so the browser was falling back through the family stack and rendering everything in the system serif. That fallback rendering became the look the studio chose to keep.

The display face is therefore the system serif by intention. Don't reintroduce Zodiak (or any other display webfont) without explicit direction — see `CLAUDE.md` "Type families".
