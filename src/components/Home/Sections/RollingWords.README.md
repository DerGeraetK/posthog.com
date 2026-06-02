# RollingWords

A kinetic inline word-cycler for headlines. Renders a single word slot that **vertically rolls** through a list of words — each word rises from the underline baseline as it fades in, while the outgoing word continues upward and fades out. The list **accelerates** (driven by each step's `hold`) and then **settles permanently on the last word** with a slower, graceful fade.

Built for the homepage hero: _"Let PostHog **analyze → diagnose → … → code**"_.

## Usage

```tsx
import { RollingWords, type RollingWordStep } from 'components/Home/Sections/RollingWords'

const HERO_VERBS: RollingWordStep[] = [
    { word: 'analyze', hold: 1000 },
    { word: 'diagnose', hold: 800 },
    // ...accelerating...
    { word: 'ship', hold: 110 },
    { word: 'code', hold: 0 }, // final word — sits permanently
]

;<h1>
    Let PostHog <RollingWords steps={HERO_VERBS} className="text-red dark:text-yellow font-bold" />
</h1>
```

## Props

| Prop        | Type                | Default | Description                                                                                          |
| ----------- | ------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `steps`     | `RollingWordStep[]` | —       | Ordered words + per-word `hold` (ms before advancing). The **last** word stays permanently.          |
| `className` | `string`            | `''`    | Applied to the wrapper. Set the rolling word's **color and weight** here. |

`RollingWordStep` = `{ word: string; hold: number }`.

## How it works

- **Roll:** `framer-motion`'s `AnimatePresence` (`mode="popLayout"`, `initial={false}`) swaps the word. Enter `y: 0.4em → 0` + fade in; exit `y: 0 → -0.4em` + fade out. `popLayout` pops the outgoing word out of flow so it never shoves the slot width.
- **Acceleration:** a `setTimeout` chain advances `index` using `steps[index].hold`. It stops once the last word is reached. The roll duration also scales with each word's `hold`, so very short holds roll quickly instead of piling up against the next swap — this makes a rapid "speed-run" of words (short holds) blur past smoothly. Compose multi-pass effects (e.g. a readable pass then an accelerating blur) by repeating words in the `steps` array with decreasing holds.
- **Settle:** the last word uses a longer ease-out-expo transition (`[0.22, 1, 0.36, 1]`, 0.7s) instead of the snappy `easeOut` (0.25s) used for the fast cycle.
- **Underline:** an absolutely-positioned span spanning the full (padded) cell width, so it holds a **constant width** regardless of the current word. Uses the primary text color (`bg-[rgb(var(--text-primary))]`), independent of the word's color. The cell has horizontal padding so the underline extends slightly past the longest word.
- **Replay:** once the cycle settles on the final word, a small `IconRewind` button appears on the right of the cell — only on hover (or keyboard focus) — and restarts the animation from the first word.
- **Accessibility:** respects `prefers-reduced-motion` (via `components/Code/usePrefersReducedMotion`) by rendering only the final word, statically, with the underline (no replay control).

## Notes

- Only the **color/weight** belong in `className`; sizing comes from the surrounding heading.
- The underline color follows `currentColor`, so light/dark variants (`text-red dark:text-yellow`) need no extra wiring.
