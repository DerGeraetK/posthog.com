/**
 * Silhouette paths for `GlassIcon`.
 *
 * Newer glyphs are authored in Figma's ~37-unit frame (the `GlassIcon` default
 * viewBox). `GlassIcon` derives stroke + shadow sizes proportionally from the
 * viewBox, so a glyph in a different frame just needs its own `viewBox` passed
 * (see DEMO below). To add a glyph, export the frame from Figma and copy the
 * fill `d` attribute here.
 */

// House — exported from Figma (37-unit frame). Uses the default viewBox.
export const HOME_SILHOUETTE =
    'M20.1209 3.0574C19.1321 2.40941 17.8531 2.40941 16.8643 3.0574L4.55673 11.1226C3.71896 11.6716 3.21423 12.6058 3.21423 13.6074V30.2498C3.21423 31.8905 4.5443 33.2206 6.18503 33.2206H12.9754C13.6786 33.2206 14.2486 32.6505 14.2486 31.9474V26.0058C14.2486 23.6619 16.1487 21.7618 18.4926 21.7618C20.8365 21.7618 22.7366 23.6619 22.7366 26.0058V31.9474C22.7366 32.6505 23.3067 33.2206 24.0098 33.2206H30.8002C32.4409 33.2206 33.771 31.8905 33.771 30.2498V13.6074C33.771 12.6058 33.2663 11.6716 32.4285 11.1226L20.1209 3.0574Z'

// Neutral rounded-square tile (37-unit frame, uses the default viewBox).
// Temporary placeholder for icons without a real silhouette yet (Product OS,
// Library). Swap these out as the final glyphs are added.
export const PLACEHOLDER_SILHOUETTE =
    'M9 3H28C31.3137 3 34 5.68629 34 9V28C34 31.3137 31.3137 34 28 34H9C5.68629 34 3 31.3137 3 28V9C3 5.68629 5.68629 3 9 3Z'

// Clapperboard — older Figma export in a 58-unit frame, so it must be paired
// with viewBox="0 0 58 59". Single path with the top strips encoded as holes,
// so an embedded image clips cleanly inside it.
export const DEMO_SILHOUETTE =
    'M52.998 47.332C52.9979 49.9091 50.9082 51.998 48.3311 51.998H9.66602C7.0891 51.9978 5.00017 49.909 5 47.332V21.333H52.998V47.332ZM16.2236 17.333H5V8.66602C5.00023 6.08915 7.08915 4.00023 9.66602 4H20.6689L16.2236 17.333ZM32.8916 17.333H20.4443L24.8896 4H37.3369L32.8916 17.333ZM48.334 4C50.9109 4.00013 52.9998 6.08909 53 8.66602V17.333H37.1104L41.5557 4H48.334Z'
export const DEMO_VIEWBOX = '0 0 58 59'

// Externally-hosted thumbnail embedded inside the demo clapperboard.
export const DEMO_THUMBNAIL = 'https://res.cloudinary.com/dmukukwp6/image/upload/demo_icon_c491faf6f2.png'
