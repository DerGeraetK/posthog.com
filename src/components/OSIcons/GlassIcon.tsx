import React, { useId } from 'react'

export interface GlassIconProps {
    /** Glyph fill `d`. Author in Figma's ~37-unit frame (or pass a matching `viewBox`). */
    path: string
    /** SVG viewBox (defaults to Figma's ~37-unit glyph frame) */
    viewBox?: string
    /** Optional externally-hosted image rendered inside the silhouette (clipped to it) */
    image?: string
    /** Glass frost opacity over the shape (and over `image` when present). Default 0.4. */
    fillOpacity?: number
    /** Backdrop blur radius in px. Default 1.3 (≈ the export's blur at 36px). */
    blur?: number
    /** Hover glow color (CSS color string) */
    glowColor?: string
    /** Additional className for the wrapper (size lives here — default `size-9` / 36px) */
    className?: string
    /** Arbitrary SVG content clipped into the silhouette (rendered under the glass fill) */
    children?: React.ReactNode
}

/**
 * Frosted-glass desktop icon. Faithfully reproduces the two-layer Figma export
 * as two stacked copies of the same glyph `path`:
 *
 *   - Layer A (bottom): backdrop-blur frost + white fill @ `fillOpacity` + a thin
 *     dark hairline aligned just OUTSIDE the edge, with two knockout drop shadows.
 *   - Layer B (top): a thin white highlight aligned just INSIDE the edge, with the
 *     same two drop shadows.
 *
 * Stroke + shadow sizes are derived PROPORTIONALLY from the viewBox so the look
 * matches the export at any glyph frame (the export's ~37-unit frame → stroke
 * 0.64 / shadow dy 1.29 / blurs 1.29 & 0.64). Stroke alignment uses SVG masks off
 * a double-width stroke (each mask keeps one half) — the same result Figma's
 * export bakes into offset paths, and it handles glyphs with interior holes
 * (e.g. the clapperboard) via the shared path + fill-rule.
 *
 * The frost is a plain HTML element (NOT an SVG `<foreignObject>`, where browsers
 * refuse to render `backdrop-filter`) clipped to the silhouette via an
 * objectBoundingBox clipPath. The drop shadows use the export's
 * `feComposite operator="out"` knockout so they don't bleed through the
 * translucent fill and darken the frosted interior.
 *
 * Hover (driven by the `group` on the parent AppLink) gives a subtle zoom pop;
 * click has no scale (kept snappy).
 */
export default function GlassIcon({
    path,
    viewBox = '0 0 36.9853 37.7206',
    image,
    fillOpacity = 0.4,
    blur = 1.3,
    glowColor = '#53FFCB',
    className = '',
    children,
}: GlassIconProps) {
    const id = useId().replace(/:/g, '')
    const frostClipId = `${id}-frost`
    const shapeClipId = `${id}-shape`
    const outsideMaskId = `${id}-outside`
    const insideMaskId = `${id}-inside`
    const shadowId = `${id}-shadow`

    const [vbX, vbY, vbW, vbH] = viewBox.split(/\s+/).map(Number)

    // Proportions taken from the export (a 36.99-unit frame uses stroke-width
    // 0.643, shadow dy 1.286, blurs 1.286 & 0.643). strokeW is doubled because
    // each mask keeps only one half of the centered stroke.
    const strokeW = 0.0348 * vbW
    const shOffset = 0.0348 * vbW
    const shBlur1 = 0.0348 * vbW
    const shBlur2 = 0.0174 * vbW

    const mX = vbX - 2
    const mY = vbY - 2
    const mW = vbW + 4
    const mH = vbH + 4

    return (
        <span className={`relative inline-flex items-center justify-center size-9 ${className}`}>
            {/* Soft glow behind the shape, revealed on hover (slow fade in) */}
            <span
                aria-hidden
                className="pointer-events-none absolute inset-1 rounded-[40%] blur-md opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-60"
                style={{ backgroundColor: glowColor }}
            />

            {/* Layer A frost: real backdrop blur, clipped to the silhouette. Lives outside
                the SVG because backdrop-filter does not render inside an SVG <foreignObject>.
                The objectBoundingBox clip scales with the box. */}
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 transition-transform duration-200 ease-out group-hover:scale-[1.03]"
                style={{
                    backdropFilter: `blur(${blur}px)`,
                    WebkitBackdropFilter: `blur(${blur}px)`,
                    clipPath: `url(#${frostClipId})`,
                }}
            />

            <svg
                viewBox={viewBox}
                fill="none"
                // "none" maps the viewBox to the box edges exactly like the objectBoundingBox
                // frost clip, so the frost and the SVG strokes/fill stay aligned.
                preserveAspectRatio="none"
                className="relative block size-full overflow-visible transition-transform duration-200 ease-out group-hover:scale-[1.03]"
            >
                <defs>
                    {/* Normalized clip (0–1) for the HTML frost div */}
                    <clipPath id={frostClipId} clipPathUnits="objectBoundingBox">
                        <path
                            d={path}
                            transform={`translate(${-vbX / vbW} ${-vbY / vbH}) scale(${1 / vbW} ${1 / vbH})`}
                        />
                    </clipPath>

                    {/* Keep only the OUTSIDE half of the dark stroke (white outside the glyph) */}
                    <mask id={outsideMaskId} maskUnits="userSpaceOnUse" x={mX} y={mY} width={mW} height={mH}>
                        <rect x={mX} y={mY} width={mW} height={mH} fill="white" />
                        <path d={path} fill="black" fillRule="nonzero" />
                    </mask>

                    {/* Keep only the INSIDE half of the white stroke (white inside the glyph) */}
                    <mask id={insideMaskId} maskUnits="userSpaceOnUse" x={mX} y={mY} width={mW} height={mH}>
                        <path d={path} fill="white" fillRule="nonzero" />
                    </mask>

                    {/* User-space clip for the optional embedded image */}
                    <clipPath id={shapeClipId}>
                        <path d={path} />
                    </clipPath>

                    {/* Two stacked drop shadows (brand-blue glow + black ambient), faithfully
                        reproduced from the export. The `feComposite operator="out"` knockout
                        removes each shadow from BEHIND the shape, so it only shows outside the
                        silhouette — without it the shadow bleeds through the 40% fill and
                        darkens the frosted interior. */}
                    <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        {/* shadow 1 — brand blue #0290C5 @ 0.4 */}
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dy={shOffset} />
                        <feGaussianBlur stdDeviation={shBlur1} />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0.00784314 0 0 0 0 0.564706 0 0 0 0 0.772549 0 0 0 0.4 0"
                        />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="shadow1" />
                        {/* shadow 2 — black @ 0.25 */}
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dy={shOffset} />
                        <feGaussianBlur stdDeviation={shBlur2} />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="shadow1" result="shadow2" />
                        {/* source composited on top of both shadows */}
                        <feBlend mode="normal" in="SourceGraphic" in2="shadow2" result="shape" />
                    </filter>
                </defs>

                {/* Optional embedded image and arbitrary content, clipped to the shape */}
                {(image || children) && (
                    <g clipPath={`url(#${shapeClipId})`}>
                        {image && (
                            <image
                                href={image}
                                x={vbX}
                                y={vbY}
                                width={vbW}
                                height={vbH}
                                preserveAspectRatio="xMidYMid slice"
                            />
                        )}
                        {children}
                    </g>
                )}

                {/* Layer A: white fill + outside-aligned dark hairline, with drop shadow */}
                <g filter={`url(#${shadowId})`}>
                    <path d={path} fill="white" fillOpacity={fillOpacity} fillRule="nonzero" />
                    <path
                        d={path}
                        fill="none"
                        stroke="#415B66"
                        strokeOpacity={0.15}
                        strokeWidth={strokeW}
                        mask={`url(#${outsideMaskId})`}
                    />
                </g>

                {/* Layer B: inside-aligned white highlight. No drop shadow — the export gives
                    this layer one too, but its shadow falls just inside the edge and reads as an
                    unwanted inner shadow at this size. The outer lift comes from Layer A. */}
                <path d={path} fill="none" stroke="white" strokeWidth={strokeW} mask={`url(#${insideMaskId})`} />
            </svg>
        </span>
    )
}
