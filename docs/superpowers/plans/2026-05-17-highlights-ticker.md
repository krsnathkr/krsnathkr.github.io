# Highlights Ticker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a pinned full-width ticker ribbon at the top of the viewport that scrolls recent highlights from a JSON file continuously left-to-right, pausing on hover.

**Architecture:** A new `Ticker.jsx` component reads from `highlights.json` and renders a `position: fixed` bar at `top: 0`. Scrolling is pure CSS via `@keyframes marquee`; hover-pause is React state toggling `animationPlayState`. `App.jsx` renders `<Ticker />` inside the outer wrapper and adds `pt-9` to that wrapper to push page content below the bar.

**Tech Stack:** React 19, Tailwind CSS v4, CSS animations (no external libraries)

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `src/data/highlights.json` | Data source — one entry per highlight |
| Modify | `src/index.css` | Add `@keyframes marquee` + `.animate-marquee` utility |
| Create | `src/components/Ticker.jsx` | Fixed bar, scroll loop, hover-pause logic |
| Modify | `src/App.jsx` | Import + render `<Ticker />`, add `pt-9` to outer wrapper |

---

## Task 1: Create the highlights data file

**Files:**
- Create: `src/data/highlights.json`

- [ ] **Step 1: Create the file with example highlights**

```json
[
  { "text": "Starting summer internship at Pubgen.ai", "url": "https://pubgen.ai" },
  { "text": "Research paper accepted to ACL 2026", "url": null }
]
```

Each object has:
- `text` (string, required) — the highlight copy
- `url` (string | null) — if non-null, wraps the text in an `<a>` tag

- [ ] **Step 2: Commit**

```bash
git add src/data/highlights.json
git commit -m "feat: add highlights data file"
```

---

## Task 2: Add marquee CSS animation

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Append the keyframe and utility class to `src/index.css`**

Add at the end of the file:

```css
@keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
}

.animate-marquee {
    animation: marquee var(--marquee-duration, 24s) linear infinite;
}
```

The `--marquee-duration` CSS variable is set per-instance by the component, so the speed automatically adjusts to the number of items. The `24s` default is a safe fallback.

- [ ] **Step 2: Verify the CSS parses cleanly**

```bash
npm run build 2>&1 | grep -i error
```

Expected: no output (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add marquee CSS keyframe"
```

---

## Task 3: Build the Ticker component

**Files:**
- Create: `src/components/Ticker.jsx`

- [ ] **Step 1: Create `src/components/Ticker.jsx`**

```jsx
import React, { useState } from 'react';
import highlights from '../data/highlights.json';

const Ticker = () => {
    const [paused, setPaused] = useState(false);

    if (highlights.length === 0) return null;

    const items = [...highlights, ...highlights];
    const duration = `${highlights.length * 8}s`;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-9 flex items-center overflow-hidden bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-gray-800">
            <div
                className="flex whitespace-nowrap animate-marquee"
                style={{
                    '--marquee-duration': duration,
                    animationPlayState: paused ? 'paused' : 'running',
                }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {items.map((item, i) => (
                    <span key={i} className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mx-4 flex-shrink-0" />
                        {item.url ? (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-light text-gray-600 dark:text-gray-400 hover:underline"
                            >
                                {item.text}
                            </a>
                        ) : (
                            <span className="text-sm font-light text-gray-600 dark:text-gray-400">
                                {item.text}
                            </span>
                        )}
                        <span className="mx-4 text-gray-400 dark:text-gray-600">·</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Ticker;
```

Key details:
- `items = [...highlights, ...highlights]` duplicates the array so the scroll loop seams invisibly at the `-50%` mark
- `animationPlayState` toggles via `onMouseEnter`/`onMouseLeave` — no timeout or RAF needed
- The green dot uses Tailwind's built-in `animate-pulse`
- Background and border match the page exactly (no color introduced)

- [ ] **Step 2: Start dev server and verify Ticker renders**

```bash
npm run dev
```

Open `http://localhost:5173` in a browser. You should see a slim bar pinned to the top of the page with two scrolling items. Hover over the bar — scrolling should pause. Mouse off — scrolling resumes.

- [ ] **Step 3: Commit**

```bash
git add src/components/Ticker.jsx
git commit -m "feat: add Ticker component"
```

---

## Task 4: Wire Ticker into App

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add the Ticker import**

In `src/App.jsx`, add this import alongside the other component imports (around line 16):

```jsx
import Ticker from './components/Ticker';
```

- [ ] **Step 2: Render `<Ticker />` and add top padding**

In `src/App.jsx`, make two changes inside the `AppContent` return:

**Add `<Ticker />` as the first child inside the outer wrapper div, before `<ThemeToggle />`:**

Find this block (around line 41):
```jsx
<div className="bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 antialiased selection:bg-gray-900 selection:text-white dark:selection:bg-white dark:selection:text-gray-900 min-h-screen transition-colors duration-0">
  <ThemeToggle />
```

Replace with:
```jsx
<div className="bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 antialiased selection:bg-gray-900 selection:text-white dark:selection:bg-white dark:selection:text-gray-900 min-h-screen transition-colors duration-0 pt-9">
  <Ticker />
  <ThemeToggle />
```

The `pt-9` (36px) matches the ticker's `h-9` height, ensuring no page content hides behind the fixed bar.

- [ ] **Step 3: Verify in browser**

With `npm run dev` still running, reload `http://localhost:5173`.

Check all of the following:
- Ticker bar is pinned at the top of the viewport
- Page content starts below the bar (not hidden behind it)
- ThemeToggle still appears and works correctly
- Scrolling down the page: the ticker stays pinned at top, content scrolls under it
- Dark mode toggle: ticker background switches correctly between white and near-black
- Hover: scrolling pauses; mouse-off: scrolling resumes
- If any highlight has a `url`, clicking it opens the link in a new tab

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire Ticker into app layout"
```

---

## Task 5: Build and final check

- [ ] **Step 1: Run production build**

```bash
npm run build 2>&1
```

Expected: build completes with no errors. Output lines will include `dist/index.html` and asset files.

- [ ] **Step 2: Preview production build**

```bash
npm run preview
```

Open the preview URL (usually `http://localhost:4173`). Repeat the browser checks from Task 4 Step 3 on the production build.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: build highlights ticker dist"
```
