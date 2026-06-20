# OSIcons

Desktop OS-style icons used across the site.

## GlassIcon

Renders a single silhouette `path` as a frosted-glass icon — translucent white frost over a backdrop blur, hairline borders, and soft drop shadows. This is the shared treatment for all desktop icons, so the whole icon (the house, the clapperboard, etc.) _is_ the glass shape.

### Usage

```tsx
import { GlassIcon } from 'components/OSIcons'
import { HOME_SILHOUETTE, DEMO_SILHOUETTE, DEMO_THUMBNAIL } from 'components/OSIcons/glyphs'

// Minimal — just pass a silhouette path
<GlassIcon path={HOME_SILHOUETTE} />

// With an externally-hosted image clipped inside the shape (e.g. demo.mov)
<GlassIcon path={DEMO_SILHOUETTE} image={DEMO_THUMBNAIL} fillOpacity={0.2} />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `path` | `string` | **required** | Glyph fill `d`, authored in Figma's ~37-unit frame (or a frame matching `viewBox`) |
| `viewBox` | `string` | `"0 0 36.9853 37.7206"` | SVG viewBox — Figma's ~37-unit glyph frame. Pass a matching one for glyphs in another frame (e.g. the demo's `"0 0 58 59"`) |
| `image` | `string` | — | Externally-hosted image rendered inside the silhouette (clipped to it) |
| `fillOpacity` | `number` | `0.4` | Glass frost opacity; lower it when an `image` should show through |
| `blur` | `number` | `1.3` | Backdrop blur radius in px (≈ the export's blur at 36px) |
| `glowColor` | `string` | `#53FFCB` | Hover glow color |
| `className` | `string` | — | Additional classes on the wrapper (size is `size-9` / 36px by default) |
| `children` | `ReactNode` | — | Arbitrary SVG content clipped into the shape (under the glass fill) |

### How it works

- **Backdrop blur (frost)**: a plain HTML `<div>` with `backdrop-filter`, clipped to the silhouette via an `objectBoundingBox` clipPath (so it scales with the icon). It must be an HTML element, **not** an SVG `<foreignObject>` — browsers refuse to render `backdrop-filter` inside `foreignObject`, which silently drops the frost and leaves a flat shape. The SVG uses `preserveAspectRatio="none"` so it stretches to the box exactly like this clip and stays aligned.
- **Frame-proportional stroke + shadow**: the stroke width and shadow offset/blur are derived from the viewBox size (`0.0348 × vbW` etc.), matching the export's proportions (a ~37-unit frame → stroke 0.64 / shadow `dy` 1.29 / blurs 1.29 & 0.64). This is what makes it look right at the small 36px render — oversized shadows are what previously muddied the interior into a fake "inner shadow".
- **Two layered copies of the same glyph `path`**:
  - _Layer A_ — the glass fill (`white` at `fillOpacity`) + a thin dark hairline (`#415B66` @ 0.15) aligned just _outside_ the edge, **with the drop shadow** (the icon's outer lift).
  - _Layer B_ — a thin white highlight aligned just _inside_ the edge, **no shadow**. The export gives this layer a shadow too, but it falls just inside the edge and reads as an unwanted inner shadow at this size, so we drop it.
  - Together the strokes form the glass bevel (dark outside / white inside, adjacent).
- **Stroke alignment via masks**: each stroke is drawn at double width and a `<mask>` keeps one half — `outsideMask` (white outside the glyph) for the dark hairline, `insideMask` (white inside) for the white highlight. This is the same result the export bakes into offset paths; the shared path + `fill-rule="nonzero"` keeps interior holes (e.g. the clapperboard strips) correct.
- **Drop shadows**: each layer gets a brand-blue glow (`#0290C5` @ 0.4) and a black ambient shadow (@ 0.25). The filter reproduces the export's `feComposite operator="out"` **knockout**, which removes each shadow from behind the shape — without it the shadow bleeds through the 40% fill and darkens the frosted interior (it won't match Figma's lighter glass).
- **Hover**: a subtle zoom pop (`group-hover:scale-[1.03]`) plus a soft glow that fades in slowly behind the shape. Driven by the `group` class on the parent `AppLink`, so hovering the icon + label triggers it. Click has no scale (kept snappy).

Filter/clip IDs are scoped with `useId()`, so many icons can render on the same screen without colliding.

### Silhouette paths

Paths live in `glyphs.ts`. Newer glyphs are authored in Figma's ~37-unit frame (the default `viewBox`); just copy the **fill** `d` from the export — `GlassIcon` derives the strokes and shadows itself. A glyph in a different frame (e.g. the demo clapperboard's 58-unit one) also exports a `viewBox` constant to pass alongside it. `PLACEHOLDER_SILHOUETTE` is a neutral rounded-square tile used as a stand-in until a real path is added.

## AppIcon

Renders image-based app icons from the `PRODUCT_ICON_MAP`. Supports skin variants (classic/modern). See `AppIcon.tsx` for the full icon registry.

## AppLink

Wraps any icon (AppIcon, image URL, React element, or component) in a clickable figure with a label. Handles URL resolution, drag prevention, and orientation (row/column layout).
