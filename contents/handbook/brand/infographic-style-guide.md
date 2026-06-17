---
title: 'Infographic style guide'
sidebar: Handbook
showTitle: true
hideAnchor: false
---

> 🎨 **For anyone making charts, data graphics, or infographics for blogs, newsletters, and social.** This covers the _visual styling_ of in-content infographics — not full brand assets (logos, mascots, presentations), which live in [Logos & hedgehogs](/handbook/brand/assets).
>
> There are **two style systems** below. Use **pre-build mode** for anything in our current/legacy editorial look. Use **post-build mode** for anything shipping alongside or after the build-mode rebrand. Don't mix the two in one graphic.

## Contents

- [Which style do I use?](#which-style-do-i-use)
- [Pre-build mode](#pre-build-mode)
- [Post-build mode](#post-build-mode)
- [Open questions to verify](#open-questions-to-verify)

## Which style do I use?

| | Pre-build mode | Post-build mode |
|---|---|---|
| **Feel** | Editorial, newspaper, zine. Print-inspired, sparse color. | Bold, energetic, data-forward. Orange-dominant. |
| **Headline font** | Perfectly Nineties (serif) | Kalam (handwritten, all caps) |
| **Body font** | Matter SQ | Open Runde |
| **Color** | Near-monochrome; one orange pop | Brand orange dominant + status colors |
| **Signature cue** | Halftone / crosshatch illustration | Graph-paper grid + "build mode" badge |

## Pre-build mode

_Early mock-up designs (drafts 1–5). Editorial, near-monochromatic._

### Typography

- **Display / headline:** Perfectly Nineties — Regular for plain statements, Italic for emphasis or contrast. Large scale (60px+), tight letter-spacing (≈ −4% on large headlines).
- **UI / body / labels:** Matter SQ — Medium (500) for body, SemiBold (600) for section labels, Bold (700) for active nav or key labels.
- **Case:** sentence case throughout. No all-caps.
- **Fill only** — text is always a flat fill, never stroked.
- **Color:** `#1f1f1f` near-black on light backgrounds (never pure black). White only inside filled button pills.

### Color

Near-monochromatic and warm. Orange appears in **at most one place** per composition — a single deliberate pop (a subscribe button, one highlighted number).

| Role | Hex |
|---|---|
| Background | `#dfdccf` (warm sand) or `#fdfdf9` (off-white cream) |
| Primary text | `#1f1f1f` |
| Cards / containers | `#eeefea` |
| Borders / dividers | `#9fa097` (muted grey-green) or `#1f1f1f` |
| Accent / CTA | Brand orange — one pop only |

### Shapes & outlines

- Flat 2D only. No gradients, no drop shadows.
- Shapes are either a 1px `#1f1f1f` stroke with no fill, or `#eeefea` fill with a 1px `#1f1f1f` stroke.
- Corner radius: 8px for cards and buttons; otherwise square (0 radius).
- Dividers are thin (1px) `#1f1f1f` or `#9fa097` strokes. No dashes.

### Arrows & connectors

- Thin line vectors, `#1f1f1f` stroke at 1–1.5px, no fill.
- Straight only — no curves, no rounded ends.
- No arrowhead decoration beyond the raw line.

### Overall feel

Editorial / newspaper / zine, print-inspired. Sparse color. Personality comes from halftone and crosshatch illustration, not from color.

### Quick do / don't

- ✅ One orange accent, max. ✅ Sentence case. ✅ Flat fills + thin strokes.
- ❌ Pure black. ❌ Gradients or shadows. ❌ More than one accent color.

## Post-build mode

_Rebrand onwards — the orange era. Bold and data-forward._

### Typography

- **Headline / title:** Kalam Bold — handwritten/chalkboard feel. Always **all caps** (`textCase: UPPER`). ~28–30px for titles, 14–16px for table column headers.
- **Body / labels / data:** Open Runde — Medium for data cells and body, Semibold for status labels and descriptors, Bold for CTA/badge text. ~10–12px in tables, ~18px for card headings.
- **Fill only** — text is always a flat fill, never stroked.
- **Color:**
  - On colored backgrounds: always `#ffffff`.
  - On white/cream backgrounds: `#000000` for titles and data body; colored text only for status labels (matching their status color).

### Color

Orange-dominant, with a defined status system. **Every filled shape uses a darker shade of its own fill as its stroke — never a neutral or black stroke on a colored shape.**

| Role | Hex | Usage |
|---|---|---|
| Background | `#fdfdf9` (cream) or `#ffffff` | Canvas / frame |
| Brand orange | `#ff5c1c` | Primary accent — headers, shapes, badges, arrows |
| Orange stroke | `#e54000` | 1–2px stroke on orange fills |
| Status: positive | `#47c861` | Green dot + label ("planned" / "covered"); stroke `#35b14e` |
| Status: in-progress | `#ffa81c` | Amber dot + label |
| Status: warning | implied red | Heatmaps / "not addressed" |
| Process blue | `#2bb3df` | Step color in multi-step flows; stroke `#1a89ad` |
| Dark | `#2c2c2d` | Near-black — screenshot overlays, image containers |
| Pure white | `#ffffff` | Text on colored shapes |

### Shapes & outlines

- Flat 2D. Depth comes from shape-to-stroke color contrast, not shadows or gradients.
- **Strokes always present on colored shapes** — 1–2px in a darker shade of the fill (orange → `#e54000`, green → `#35b14e`, blue → `#1a89ad`).
- Corner radius: colored blocks/badges ≈ 8–9px; the build-mode badge pill is fully rounded; grid cells are sharp (0 radius).
- **Graph-paper grid motif:** white cells with `#ff5c1c` 1px strokes, square, no radius — background texture on chart/experimental frames. This is a signature post-rebrand cue.
- **One** subtle drop shadow is allowed — on the table's outer container, to lift the whole graphic off the page. Never on individual cells or data shapes.
- No dashed lines.

### Arrows & lines

- Solid-filled vector arrows in the **same color as the element they connect** (orange → orange, green → green).
- Arrows are flat 2D with no outline stroke on the arrow itself.
- Straight or angled — no curved connectors.
- Table divider lines: `#ff5c1c` at 1px, no dashes.

### Signature elements

**"Build mode" badge** — include on every infographic:

- Top-right corner of the frame, always.
- Orange (`#ff5c1c`) fill + gradient overlay on the background rectangle + `#e54000` stroke, pill shape.
- White Open Runde Bold text at ~10px reading "build mode", with the PostHog logomark.

**Status dot system** (for tables):

- Colored filled ellipse + matching-color Open Runde Bold label.
- Orange = planned, green = mostly covered, amber = in progress, red (implied) = not addressed.
- Body data text stays `#000000` Open Runde Medium.

### Overall feel

Bold, energetic, data-forward. Handwritten headline for personality, rounded sans for legibility, orange dominant. The graph-paper grid signals "data / analytical thinking." Everything is flat and 2D.

### Quick do / don't

- ✅ Darker-shade stroke on every colored fill. ✅ Grid motif on chart frames. ✅ Build-mode badge top-right.
- ❌ Black/neutral strokes on colored shapes. ❌ Shadows on individual cells. ❌ Curved connectors. ❌ Mixed-color arrows.

## Open questions to verify

A few values pulled from the source mock-ups diverge from our core brand tokens. These are flagged rather than reconciled — confirm against the real assets before treating this page as final:

1. **Orange hex mismatch.** The core brand red/orange is `#F54E00` (see [brand assets](/handbook/brand/assets)), but these infographics use `#ff5c1c`. Confirm whether build-mode infographics intentionally use a brighter orange or should snap to `#F54E00`.
2. **Text near-black.** Brand text is `#151515`; the pre-build infographics use `#1f1f1f`. Pick one so graphics match site text.
3. **Background cream.** Brand background is `#EEEFE9`; pre-build uses `#dfdccf` / `#fdfdf9` and cards use `#eeefea`. Worth aligning the card fill to the brand `#EEEFE9` token.
4. **Implied red.** No hex was captured for the warning / "not addressed" status — needs a defined value.
5. **Fonts.** Confirm Perfectly Nineties, Matter SQ, Kalam, and Open Runde are all licensed for web/social use and available to whoever's generating these.
