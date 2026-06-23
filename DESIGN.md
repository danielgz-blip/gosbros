# **GOSBROS – Design System Documentation**

This document outlines the core design language, tokens, and component patterns for the GOSBROS website. The site is bilingual (Spanish / English) and draws inspiration from the Auge Design aesthetic — bold brutalist typography, high-contrast layouts, and minimalist grids that let the studio's work take center stage.

> **Brand Name Rule:** The studio name is always written as **GOSBROS** — no trailing period, no lowercase. In code, translations, and UI copy, never write "GOSBROS." with a dot.

---

## **1. Color Palette**

The palette is high-contrast monochrome with two editorial accent colors used sparingly for narrative impact.

### **Core Tokens**

| Token                | Hex       | CSS Variable             | Usage                                              |
| :------------------- | :-------- | :----------------------- | :------------------------------------------------- |
| Primary Dark         | `#000000` | `--color-primary-dark`   | Text, footer backgrounds, section fills             |
| Primary Light        | `#FFFFFF` | `--color-primary-light`  | Page backgrounds, reversed text on dark sections    |
| Gray 1               | `#B3B3B3` | `--color-gray-1`         | Secondary text, muted labels                        |
| Gray 2               | `#ACA7A7` | `--color-gray-2`         | Tertiary text, inactive states                      |
| Gray 3               | `#808080` | `--color-gray-3`         | Placeholders, deeper borders                        |
| Gray 4               | `#C0C0C0` | `--color-gray-4`         | Hover states, subtle dividers, table borders        |
| Gray 5               | `#D6D0D0` | `--color-gray-5`         | Very light dividers                                 |
| Surface              | `#F4F4F4` | (Tailwind `bg-[#f4f4f4]`) | Page-level background for content sections         |

### **Brand Accent Colors**

| Token              | Hex         | Usage                                                |
| :----------------- | :---------- | :--------------------------------------------------- |
| Accent Pink        | `#FF0080`   | Hover overlays on project cards, interactive CTAs     |
| Accent Red         | `#FF0000`   | Rare editorial emphasis (hero sections)               |
| Accent Mint        | `#98FF98`   | Refreshing contrast for service / values sections     |

---

## **2. Typography**

All fonts use a single variable typeface: **Roboto Flex**. Weights and optical sizes are controlled via CSS variable font settings — no additional font files needed.

### **Font Families**

| Role                  | CSS Variable      | Typeface     | Notes                                                |
| :-------------------- | :---------------- | :----------- | :--------------------------------------------------- |
| Sans (Utility & Body) | `--font-sans`     | Roboto Flex  | Body copy, navigation, labels, form inputs            |
| Display (Hero)        | `--font-display`  | Roboto Flex  | Massive headings, hero text — `font-black` weight     |
| Serif (Accent)        | `--font-serif`    | Roboto Flex  | Category labels, metadata — italic style              |

### **Typographic Scale**

All sizes use fluid `clamp()` to scale between mobile and wide desktop. Base values are multiples of 4px.

| Token             | CSS Variable          | Value                              | Usage                                          |
| :---------------- | :-------------------- | :--------------------------------- | :--------------------------------------------- |
| Hero              | `--font-size-hero`    | `clamp(3rem, 12vw, 15rem)`        | Page titles, massive headings                   |
| H2                | `--font-size-h2`      | `clamp(2.5rem, 8vw, 8rem)`        | Section headings, footer CTA text               |
| H3                | `--font-size-h3`      | `clamp(1.5rem, 4vw, 3.5rem)`      | Sub-section headings                            |
| Body              | `--font-size-body`    | `clamp(1rem, 1.2vw, 1.25rem)`     | Paragraphs, descriptions                        |
| Label             | —                     | `12px` (`text-xs`)                 | Navigation, tags, form labels, metadata         |
| Micro             | —                     | `10px` (`text-[10px]`)             | Smallest annotations, badge labels              |

### **Typographic Rules**

- **Headings (h1–h3)** and `.font-display`: Always `text-transform: uppercase`, `font-black` (900 weight), `tracking-tighter`.
- **Body text**: `font-sans`, `tracking-tight`, `leading-[1.2]`.
- **Labels & metadata**: `font-sans`, `uppercase`, `font-bold`, `tracking-widest`, `text-xs`.
- **Accent/category text**: `font-serif`, `italic`, lowercase, `text-sm`.
- **Line heights** default to `leading-[0.85]` for hero/display and `leading-[1.2]` for body.

---

## **3. Spacing & Layout**

All spacing values are multiples of **4px** (minor) and **8px** (major). This ensures vertical rhythm and horizontal alignment across every component and breakpoint.

### **Spacing Scale**

| Token       | Value   | Usage                                                |
| :---------- | :------ | :--------------------------------------------------- |
| `space-1`   | `4px`   | Minimum gap, icon padding, inline gaps               |
| `space-2`   | `8px`   | Tight component gaps, tag padding                    |
| `space-3`   | `12px`  | Small form gaps, label spacing                       |
| `space-4`   | `16px`  | Standard component gap, card padding                 |
| `space-5`   | `24px`  | Section inner padding, grid gaps                     |
| `space-6`   | `32px`  | Major section padding, grid gaps on desktop          |
| `space-7`   | `48px`  | Section vertical padding (mobile)                    |
| `space-8`   | `64px`  | Section vertical padding (desktop), large whitespace |
| `space-9`   | `96px`  | Major section separators                             |
| `space-10`  | `128px` | Hero-level vertical whitespace, page top padding     |

### **Page-Level Padding**

| Context         | Mobile          | Desktop          |
| :-------------- | :-------------- | :--------------- |
| Horizontal      | `px-4` (16px)   | `px-8` (32px)    |
| Page top        | `pt-32` (128px) | `pt-48` (192px)  |
| Section bottom  | `pb-16` (64px)  | `pb-32` (128px)  |

### **Layout Principles**

- **Max container width:** `max-w-[1800px]` with `mx-auto`.
- **Asymmetric grids:** Project cards alternate between 65% / 35% widths to create visual tension.
- **Harsh grid lines:** 1px solid `#000` or `#C0C0C0` horizontal borders separate archive and table rows — a brutalist ledger aesthetic.
- **Edge-to-edge media:** Project images and hero banners bleed to full viewport width with no border-radius.

---

## **4. Component Patterns**

### **4.1. Navigation**

- Fixed at top, `z-40`, `mix-blend-difference` for color inversion over content.
- Left: GOSBROS logo (SVG). Right: nav links + language toggle + CTA.
- Mobile: fullscreen overlay menu (`z-50`), black background, centered oversized links.
- Language toggle: `ES / EN` with the active language at full opacity and the inactive one at 30% opacity with `line-through`.
- All text: `uppercase`, `font-display`, `tracking-widest`.

### **4.2. Hero**

- Full-viewport-height section (`h-screen`) with a cinematic image/video reveal sequence.
- Three animated steps: video fill → "YOU ARE IN" / "ESTÁS EN" → "GOSBROS" logo reveal.
- Typography uses `--font-size-hero` for maximum impact.

### **4.3. Project Cards (Works Feed)**

- **Media:** Full-width images, `aspect-[4/3]` on mobile, `aspect-[16/10]` on desktop. Grayscale by default, color on hover.
- **Hover overlay:** `bg-[#ff0080]/90` with centered "View Project" / "Ver Proyecto" text.
- **Caption:** Title (`font-sans`, `font-bold`, `uppercase`, `tracking-tighter`), category (`font-serif`, `italic`, `text-gray-500`), year.

### **4.4. Project Detail Pages (`/works/[id]`)**

- **Hero:** Full-bleed media locked to `aspect-video` (16:9).
- **Metadata section:** White background, two-column layout (title+desc left, specs right).
- **Content blocks:** Mixed media (images, video) and text, in a `grid-cols-1 md:grid-cols-2` grid.
  - Horizontal media (16:9): `md:col-span-2`, full width.
  - Vertical media (9:16): `md:col-span-1`, two fit side-by-side on desktop.
  - Text blocks: `md:col-span-2`, centered serif typography.
- **Bottom CTA:** Full-width black bar → pink on hover, linking back to `/works`.

### **4.5. Archive / Data Lists**

- Full-width rows separated by `1px` borders (`#C0C0C0`).
- Columns: Title (30%), Category (20%), Material (25%), Ethos (20%), Year (5%).
- Hover: `bg-white` transition, left-padding indent animation.

### **4.6. About Page**

- Two-column layout: massive rotating phrases on the left, studio description on the right.
- Values section: large hero title + 3-column values grid.

### **4.7. Buttons & Links**

- Primary buttons: `bg-black text-white` with `hover:bg-white hover:text-black` border swap.
- Inline links: thin underline that scales to 0 on hover.
- All interactive elements: `data-cursor-hover` attribute for custom cursor expansion.

### **4.8. Footer**

- Massive GOSBROS wordmark (`--font-size-hero`) spanning full width.
- Above: 4-column sub-grid with contact info and social links.
- Copyright: `© 2026 GOSBROS`

---

## **5. Shape & Radii**

The design is overwhelmingly rectilinear. Sharp corners reinforce the editorial, print-like feel.

- **Default:** `border-radius: 0` on all media, cards, and containers.
- **Exception:** Circular elements only for the custom cursor dot and rare UI toggles.
- **Borders:** `1px solid #000` for structural borders, `1px solid #C0C0C0` for subtle dividers.

---

## **6. Animation & Interaction**

### **6.1. Custom Cursor**

- System cursor hidden globally (`cursor: none`).
- Replaced by a small white dot (8px) with `mix-blend-difference`.
- On `[data-cursor-hover]` elements: dot shrinks to 0, a 90px circle expands behind it.
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`.

### **6.2. Scroll-Triggered Text Reveals (Mask Reveal)**

- Headings wrapped in `overflow: hidden` containers.
- Inner `<span>` starts at `translateY(100%)`, slides to `translateY(0)` when visible.
- Duration: `0.8s`, easing: `cubic-bezier(0.16, 1, 0.3, 1)`.

### **6.3. Hero Media Sequence**

- Three-step animation: fullscreen video → text overlay → logo reveal.
- Each step is timed with `setTimeout` intervals (1s, 2s, 3s).

### **6.4. Easing Curves**

- All animations use the same sharp, confident easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Transitions default to `300ms` for hover states, `500ms–800ms` for reveals.

---

## **7. Bilingual (ES/EN) Implementation**

- Language state managed via React Context (`LanguageContext`).
- All user-facing strings stored in `translations.ts` with `es` and `en` keys.
- Language toggle accessible in both desktop navbar and mobile menu.
- URL structure is identical for both languages (no `/es/` or `/en/` prefix — state is client-side).