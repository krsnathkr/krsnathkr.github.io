# Highlights Ticker — Design Spec

**Date:** 2026-05-17  
**Status:** Approved

---

## Overview

A pinned full-width ticker ribbon at the top of the viewport, displaying 1–4 short "recent highlights" (internships, publications, milestones). Items scroll continuously left-to-right, pause on hover, and optionally link out. The bar matches the existing page background and uses the site's existing typographic palette.

---

## Placement & Layout

- `position: fixed; top: 0; left: 0; right: 0; z-index: 60` (bumped above `ThemeToggle` which occupies `z-index: 50`)
- Height: `36px` (fits one line of `text-sm`)
- Background: `bg-white dark:bg-[#0a0a0a]` — matches the page exactly
- Bottom border: `1px solid` in `gray-100` / `gray-800` — same token used by existing section dividers
- The main content wrapper in `App.jsx` receives `pt-9` to prevent content being hidden under the bar

---

## Ticker Item Anatomy

Each item renders as:

```
  ●  <text or link>   ·
```

- **Pulsing dot:** small green circle with CSS `animate-pulse` (`w-1.5 h-1.5 rounded-full bg-green-500`)
- **Text:** `text-sm font-light` in `text-gray-600 dark:text-gray-400`
- **Link (optional):** same color, `hover:underline`, no color shift on hover (stays on-brand)
- **Separator:** `·` in `text-gray-400 dark:text-gray-600`, `mx-4`

---

## Scroll Behavior

- CSS `@keyframes marquee` translates X from `0` to `-50%` over a configurable duration
- Items array is duplicated (`[...items, ...items]`) so the loop seam is invisible
- Speed: duration calculated as `items.length * 8s` (8 seconds per item), giving consistent pace regardless of count
- On hover or keyboard focus: CSS `:hover` and `:focus-within` pseudo-classes set `animation-play-state: paused` — no React state or event handlers needed
- `prefers-reduced-motion: reduce` disables the marquee and the pulsing dot entirely
- Overflow hidden on the container clips the strip cleanly at both edges

---

## Data

New file: `src/data/highlights.json`

```json
[
  { "text": "Starting summer internship at Company Name", "url": "https://example.com" },
  { "text": "Paper accepted to ACL 2026", "url": null }
]
```

- `text`: required string — the highlight copy
- `url`: optional string or `null` — if present, wraps the text in an `<a>` tag

Editing highlights requires only changing this JSON file, no component code changes.

---

## Components

### `src/components/Ticker.jsx`
- Imports `highlights.json`
- Renders nothing (no bar) if `highlights.length === 0`
- Renders the fixed bar otherwise
- Duplicates the items array for seamless looping: `const items = [...highlights, ...highlights]`
- Sets `--marquee-duration` as an inline CSS variable on the scrolling div: `style={{ '--marquee-duration': `${highlights.length * 8}s` }}`
- Pause is handled entirely in CSS via `.animate-marquee:hover, .animate-marquee:focus-within { animation-play-state: paused }` — no React state or mouse event handlers
- Renders with `role="region" aria-label="Recent highlights"` on the container
- Second (duplicate) render pass uses `aria-hidden="true"` and `tabIndex={-1}` on links to prevent double-announcement by screen readers

### `src/index.css`
Add `@keyframes marquee`:
```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```
And a utility class:
```css
.animate-marquee {
  animation: marquee var(--marquee-duration, 24s) linear infinite;
}
```

### `src/App.jsx`
- Import and render `<Ticker />` above the main content div (outside `.max-w-2xl`), so it spans the full viewport width
- Add `pt-9` to the outermost wrapper div only when `highlights.length > 0`; since `Ticker` handles this internally, the simplest approach is to always add `pt-9` and have `Ticker` always reserve its space (rendering an invisible bar with no content when empty is also acceptable)

---

## Edge Cases

- **0 items:** If `highlights.json` is empty, `Ticker` renders nothing (no bar, no padding offset needed — `pt-9` is conditional on `highlights.length > 0`)
- **1 item:** Duplication still works; the single item loops seamlessly
- **Long text:** No truncation — items are naturally separated by the scroll gap; very long items just take longer to scroll past

---

## Out of Scope

- No archive of past highlights
- No admin UI — editing is done directly in `highlights.json`
- No timestamps shown in the ticker (the "live" feel comes from the pulsing dot, not dates)
