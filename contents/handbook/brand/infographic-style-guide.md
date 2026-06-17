---
title: 'Infographic style guide'
sidebar: Handbook
showTitle: true
hideAnchor: false
---

> 🎨 **For anyone making charts, data graphics, or infographics for blogs, newsletters, and social.** This covers the _visual styling_ of in-content infographics — not full brand assets (logos, mascots, presentations), which live in [Logos & hedgehogs](/handbook/brand/assets).
>
> There are **two style systems** below. Use **pre-build mode** for our current/legacy newsletter look. Use **post-build mode** for anything shipping alongside or after the build-mode rebrand. Don't mix the two in one graphic.

## Contents

- [Which style do I use?](#which-style-do-i-use)
- [Pre-build mode](#pre-build-mode)
- [Post-build mode](#post-build-mode)
- [Open questions to verify](#open-questions-to-verify)

## Which style do I use?

| | Pre-build mode | Post-build mode |
|---|---|---|
| **Feel** | Chunky, bold, comic-book energy. Thick borders, multiple warm accents. | Cleaner, data-forward. Thin strokes, orange does the heavy lifting. |
| **Content font** | Squeak Bold / ExtraBold, all caps | Open Runde |
| **Headline font** | Squeak (titles in Matter SQ Medium) | Kalam, all caps |
| **Stroke weight** | Thick — 4–6px | Thin — 1–2px |
| **Color** | Multiple accents (teal, peach, amber, blue) | Brand orange dominant + status colors |
| **Connectors** | Understated grey, dashed dividers, curved loops | Solid, color-matched, straight |
| **Signature cue** | Heavy outlined shapes + knockout headlines | Graph-paper grid + "build mode" badge |

## Pre-build mode

_Existing PostHog newsletter content (Daniel Hawkins / Lottie Coxon). Chunky, bold, graphic._

### Typography

- **All infographic content:** Squeak Bold or Squeak ExtraBold — always **all caps**, 24–64px depending on hierarchy. This is the defining font of this era.
- **Chart titles / frame labels only:** Matter SQ Medium — sentence case, for top-level titles like "How Bolt works" at ~50px. Not used inside diagrams.
- No italic. No mixed weight within a single diagram.
- **Text stroke: yes** — large display headlines (e.g. an "ENGINEERINGIFICATION" title) use Squeak ExtraBold with a **6px solid black stroke on white fill** for a knockout/outlined effect. This is a deliberate style choice, not an error.
- Body text color: `#1e1e1e` near-black on light fills.

### Color

Multiple accent colors coexist in the same graphic. Each box is a **light tint fill + pure-hue stroke** pair.

| Role | Hex |
|---|---|
| Frame background | `#eeefe9` (warm grey-green) |
| Frame border | `#c3c5bf` at 4px |
| Teal / mint (primary accent) | `#29dbbb` |
| Peach / warm cream (box fill) | `#fceed7` / `#fbead4` |
| Amber (box stroke on peach) | `#f1a82c` / `#eca44c` |
| Blue (secondary accent) | `#2f80fa` |
| Blue light (box fill on blue) | `#e5f0ff` |
| Near-black text | `#1e1e1e` |
| Grey connectors | `#888888` |
| Grey divider | `#d2d2d2` |

### Shapes & outlines

- **Thick strokes — 4–6px on all shape outlines. This is the signature of this era.**
- Each shape color gets its own stroke: teal box → `#000000` 4px stroke; peach box → amber `#f1a82c` 5px stroke; blue box → `#2f80fa` 5px stroke.
- Corner radius: 8px on flow-chart boxes, ~11px on loop-diagram nodes. Consistently rounded — never sharp squares for content boxes.
- Flat 2D. No drop shadows, no gradients.
- Frame containers carry a `#c3c5bf` 4px stroke border on the outer edge.

### Arrows, lines & connectors

- **Connecting arrows:** `#888888` grey, 5px weight, straight lines with arrowheads. Deliberately _not_ colored to match boxes — so the colored boxes stay dominant.
- **Dashed dividers** (separating left/right sections): `#d2d2d2`, 4px weight, `[8, 8]` dash pattern.
- **Curved loop connectors:** black `#000000`, 6px weight, `[20, 20]` dash pattern, drawn on a high-radius path. Used for cyclical diagrams.
- No hairline strokes — everything is visually heavy and bold.

### Overall feel

Chunky, bold, graphic. Squeak gives it a playful-but-technical comic-book energy. Thick borders on every shape, multiple warm accents (teal, peach, amber, blue) used together, with understated grey connectors so the colored boxes lead.

## Post-build mode

_Rebrand onwards — the build-mode newsletter brand. Cleaner and data-forward._

### Typography

- **Headline / title:** Kalam Bold — handwritten/chalkboard feel, always **all caps**. ~28–30px for graphic titles, 14–16px for table column headers.
- **Body / data / labels:** Open Runde — Medium for data cells and body, Semibold for status labels and descriptors, Bold for badge text and CTA.
- **No text stroke** — text is always a flat fill.
- White text on any colored shape; black `#000000` text on white/cream backgrounds.
- Status labels (e.g. "Planned", "Mostly covered") are colored to match their status dot, in Open Runde Bold.

### Color

Orange-dominant; every other color is a functional status signal. **Every filled shape uses a darker shade of its own fill as its stroke — never a neutral or black stroke on a colored shape.**

| Role | Hex |
|---|---|
| Background | `#fdfdf9` (cream) or `#ffffff` |
| Brand orange (primary) | `#ff5c1c` |
| Orange stroke / darker shade | `#e54000` |
| Status: positive | `#47c861` (green); stroke `#35b14e` |
| Status: in progress | `#ffa81c` (amber) |
| Status: not addressed | implied red |
| Process blue | `#2bb3df` with `#1a89ad` stroke |
| Near-black | `#2c2c2d` |

### Shapes & outlines

- **Thin strokes — 1–2px. The opposite of the pre-rebrand era.**
- Every filled shape uses a darker shade of the same color as its stroke (orange fill → `#e54000`, green fill → `#35b14e`). Never a black or neutral stroke on a colored shape.
- Corner radius: ~8–9px on colored blocks; the build-mode badge is a full pill; grid cells are 0 radius (sharp squares).
- **Graph-paper grid motif:** white cells with `#ff5c1c` 1px strokes as background texture. Cells are square, sharp corners. A signature post-rebrand cue.
- **One** subtle drop shadow on the overall table container to lift it off the page — never on individual cells or shapes.
- Flat 2D throughout.

### Arrows, lines & connectors

- Solid-filled vector arrows matching the color of the element they connect (orange step → orange arrow).
- Table row dividers: `#ff5c1c` 1px — no dashes.
- No dashed lines. No grey connectors.
- Arrows are straight — no curves.

### Status dot system

Colored filled ellipse + matching-color Open Runde Bold label. Orange dot = planned, green = mostly covered, amber = in progress.

### Build mode badge

Top-right corner of every graphic: orange `#ff5c1c` pill with Open Runde Bold white text at ~10px, PostHog logomark in white.

### Overall feel

Cleaner, data-forward, restrained in shape weight but bold in color. The graph-paper grid signals "analytical / data." Handwritten Kalam adds personality without losing legibility. Everything is thinner and lighter than the pre-rebrand era — the orange does the heavy lifting instead of thick strokes.

## Open questions to verify

A few values pulled from the source mock-ups are worth confirming before treating this page as final:

1. **Orange hex.** The core brand red/orange is `#F54E00` (see [brand assets](/handbook/brand/assets)), but post-build infographics use `#ff5c1c`. Confirm whether the brighter orange is intentional or should snap to `#F54E00`.
2. **Text near-black.** Brand text is `#151515`; pre-build infographics use `#1e1e1e` and post-build uses `#2c2c2d` / `#000000`. Worth settling on consistent values.
3. **Implied red.** No hex was captured for the post-build warning / "not addressed" status — needs a defined value.
4. **Fonts.** Squeak and Matter SQ are existing brand fonts; confirm Kalam and Open Runde are licensed for web/social use and available to whoever's generating these.
