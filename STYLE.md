# TMSB.net — Design System & Style Guide

> **The Maple Street Band** — a rock/jam/funk band from Saint Simons Island, GA.
> This is a React + Vite single-page application.

---

## 1. Overview

The site uses a **dark, warm aesthetic** built on glassmorphic cards layered over a textured background. The primary accent is a **golden-yellow** that evokes stage lighting and warmth. The design is **mobile-first** with a max content width of **935px**.

Key traits:

- Dark canvas with warm undertones (not cold/blue-black)
- Frosted-glass card surfaces (`backdrop-filter: blur`)
- Golden-yellow accent color across interactive elements, borders, and highlights
- Display type via **Rubik Bubbles** (Google Fonts) for a playful, hand-drawn feel
- Smooth micro-interactions (lifts, glows, scale pops)

---

## 2. Color Palette

All colors are defined as CSS custom properties in `index.css` on `:root`.

### Core Palette

| Token                      | Value                              | Usage                          |
| -------------------------- | ---------------------------------- | ------------------------------ |
| `--color-accent`           | `#ebe78e`                          | Golden yellow — primary accent |
| `--color-accent-light`     | `#f5f1a0`                          | Lighter hover variant          |
| `--color-accent-glow`      | `rgba(235, 231, 142, 0.35)`       | Drop-shadow / glow tint        |
| `--color-text-primary`     | `#f5f3e8`                          | Warm white for headings & body |
| `--color-text-secondary`   | `rgba(245, 243, 232, 0.65)`       | Subdued text / descriptions    |
| `--color-text-muted`       | `rgba(245, 243, 232, 0.4)`        | Faint labels / timestamps      |
| `--color-text-dark`        | `#1e1e1c`                          | Dark text on accent backgrounds|
| `--color-card-bg`          | `rgba(18, 18, 16, 0.65)`          | Card background                |
| `--color-card-bg-hover`    | `rgba(18, 18, 16, 0.8)`           | Card hover state               |
| `--color-border`           | `rgba(235, 231, 142, 0.18)`       | Default card/item border       |
| `--color-border-hover`     | `rgba(235, 231, 142, 0.45)`       | Hover border                   |

### Section Accent Colors

Each section has a unique tint used for icon bubbles and subtle highlights:

| Section   | Color   | Hue     |
| --------- | ------- | ------- |
| Tour      | yellow  | `#ebe78e` / warm gold  |
| Merch     | purple  | violet tint            |
| Contact   | teal    | blue-green             |
| Gallery   | coral   | warm pink-orange       |
| Songs     | green   | earthy green           |
| About     | blue    | sky blue               |
| Stats     | amber   | deep gold              |
| Search    | light blue | soft cyan           |

---

## 3. Typography

### Display Font — Rubik Bubbles

Used for **all headings, nav labels, buttons, and badges**. Loaded from Google Fonts.

```css
font-family: "Rubik Bubbles", system-ui, sans-serif;
```

Apply the title drop-shadow on nav labels and hero text:

```css
filter: drop-shadow(3px 3px 0px var(--color-accent-glow));
```

### Body Font — System UI Stack

Used for **paragraph body text, metadata, sub-labels, and descriptions**.

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
             Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

### Responsive Sizing

Use `clamp()` for fluid typography:

```css
/* Page title */
font-size: clamp(1.3rem, 4vw, 1.7rem);

/* Section heading */
font-size: clamp(1rem, 3vw, 1.2rem);

/* Body text */
font-size: clamp(0.85rem, 2.5vw, 0.95rem);
```

---

## 4. Card Pattern

The **glassmorphic card** is the fundamental building block of the UI. Nearly every content container uses this pattern.

### Base Card

```css
.card {
  background: var(--color-card-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}
```

### Hover State

```css
.card:hover {
  transform: translateY(-2px);
  border-color: var(--color-border-hover);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}
```

### Active / Pressed State

```css
.card:active {
  transform: translateY(0);
  box-shadow: none;
}
```

### Mobile Adjustments

On smaller screens, reduce border-radius to `10px`–`12px` for a tighter feel:

```css
@media (max-width: 580px) {
  .card {
    border-radius: 10px;
  }
}
```

---

## 5. Layout

### Content Container

```css
.page-container {
  max-width: 935px;
  margin: 0 auto;
  padding: 1rem 0.75rem 1rem;
}

@media (max-width: 580px) {
  .page-container {
    padding-bottom: 0.75rem;
  }
}
```

Bottom padding is kept small (`1rem`) because the `Footer` component provides its own top margin (`2.5rem`) for visual separation. Horizontal padding of **0.75rem** is applied consistently — either on the page container or on child elements directly. Pick one approach per page and stick with it.

### Card Spacing

Cards are spaced with a gap of `0.75rem` (via `gap` on flex/grid parents or explicit margins).

### Hero Section

The hero area (Home page top, shared across inner page headers) uses a sky gradient:

```css
.hero-gradient {
  background: linear-gradient(
    to bottom,
    #87aac0,
    #9bceaf,
    transparent
  );
}
```

The Home hero includes **fly-in animations** for the logo and paper-plane graphic using `@keyframes` with `transform` translations.

---

## 6. Interactive Elements

### Buttons & Pills

```css
.pill-button {
  font-family: "Rubik Bubbles", system-ui, sans-serif;
  background: var(--color-accent);
  color: var(--color-text-dark);
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease;
}

.pill-button:hover {
  transform: translateY(-2px) scale(1.04);
  background: var(--color-accent-light);
}

.pill-button:active {
  transform: translateY(0) scale(0.98);
}
```

### Links

```css
a {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

### Back Button (PageHeader)

A pill-shaped button with a semi-transparent accent background:

```css
.back-button {
  background: rgba(235, 231, 142, 0.15);
  color: var(--color-text-dark);
  border-radius: 999px;
  font-family: "Rubik Bubbles", system-ui, sans-serif;
}
```

### Transition Timing

All interactive state changes use **0.15s–0.2s ease**:

```css
transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
```

---

## 7. Shared Components

### PageHeader

A 3-column grid that provides consistent top navigation across all inner pages.

```
[ ← Back pill ]     [ Centered Title ]     [ Right slot (optional) ]
```

```css
.page-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
}
```

- The **title** uses `var(--color-text-dark)` because it overlaps the lighter hero gradient area.
- The title is centered in the middle column.
- The right slot is optional (used for search icons, filter toggles, etc.).

### Footer

Appears on **all pages except Home**. Rendered as a glassmorphic card at the bottom of the page.

Contents:

1. **Nav pills** — links to sibling sections (other inner pages)
2. **Social links row** — icon links to external profiles
3. **Copyright line**

```css
.site-footer {
  margin: 2.5rem 0.75rem 1.5rem;
  background: rgba(18, 18, 16, 0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(235, 231, 142, 0.12);
  border-radius: 14px;
}
```

The footer's `margin-top: 2.5rem` provides the visual breathing room between page content and footer, so page containers only need minimal bottom padding (`1rem`).

### ScrollToTop

A utility component that scrolls the window to the top on every route change, **except** on POP navigations (browser back/forward) where the user expects to land at their previous scroll position. It uses `useEffect` with the router's `location.pathname` and `useNavigationType`. No visual output — purely behavioral.

---

## 8. Page Structure

### Home Page

The Home page is a **full-height navigation hub**. It does **not** use `PageHeader` or `Footer`.

Structure:

```
[ Hero: sky gradient + logo + plane animation ]
[ Paired navigation link-cards (grid of 2)    ]
```

Each nav card links to an inner section and contains an icon bubble + label.

### Inner Pages

All inner pages follow a consistent layout:

```
[ PageHeader (back + title + optional right slot) ]
[ Content sections / cards                         ]
[ Footer (nav pills + social + copyright)          ]
```

Pattern in JSX:

```jsx
function SomePage() {
  return (
    <div className="some-page">
      <PageHeader title="Page Title" backTo="/" backLabel="← Home" />
      <div className="some-page-content">
        {/* Cards and sections */}
      </div>
      {/* Footer is rendered globally in App.jsx — no need to add it per page */}
    </div>
  );
}
```

The `Footer` component is rendered once in `App.jsx` after the `<Routes>` block. It automatically hides itself on the Home page (`/`). A `ScrollToTop` component is also placed at the router root in `main.jsx`.

---

## 9. Responsive Breakpoints

| Breakpoint          | Max-Width  | Key Changes                                          |
| ------------------- | ---------- | ---------------------------------------------------- |
| **Mobile**          | `580px`    | Reduced padding, smaller border-radius, stacked layouts, single-column grids |
| **Small Tablet**    | `640px`    | Gallery column reduction (3 → 2)                     |
| **Tablet**          | `720px`    | Intermediate grid adjustments, 2-column where applicable |

Example:

```css
/* Tablet */
@media (max-width: 720px) {
  .grid-layout {
    grid-template-columns: 1fr 1fr;
  }
}

/* Mobile */
@media (max-width: 580px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }

  .card {
    border-radius: 10px;
  }

  .page-container {
    padding-bottom: 0.75rem;
  }
}
```

---

## 10. Conventions

### Class Naming

BEM-ish pattern: `.component-element--modifier`

```css
.show-card { }
.show-card-venue { }
.show-card--sold-out { }
.show-card-badge--past { }
```

### File Organization

- Each page or component has its **own `.css` file**, imported directly in the JSX file.
- **No CSS modules** — plain CSS with namespaced class names to avoid collisions.

```
src/
├── pages/
│   ├── Tour.jsx
│   ├── Tour.css
│   ├── Merch.jsx
│   └── Merch.css
├── components/
│   ├── Footer.jsx
│   ├── Footer.css
│   ├── PageHeader.jsx
│   └── PageHeader.css
└── index.css          ← global variables, resets, body styles
```

### Performance

- Animations use **`transform` and `opacity` only** where possible for GPU-composited layers.
- Avoid animating `width`, `height`, `margin`, or `top/left`.

### Accessibility

- Use `aria-*` attributes on interactive and dynamic elements.
- Icons are **inline SVGs** with `aria-hidden="true"` so screen readers skip decorative graphics.
- Meaningful images use `alt` text.
- Interactive elements are focusable and have visible focus states.

```jsx
<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="..." />
</svg>
```

---

## Quick Reference — The Card

Copy-paste starter for any new card component:

```css
.my-card {
  background: var(--color-card-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 1rem;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.my-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-border-hover);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.my-card:active {
  transform: translateY(0);
  box-shadow: none;
}

@media (max-width: 580px) {
  .my-card {
    border-radius: 10px;
  }
}
```
