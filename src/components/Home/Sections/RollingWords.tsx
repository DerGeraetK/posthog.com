import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IconRewind } from '@posthog/icons'
import { usePrefersReducedMotion } from '../../Code/usePrefersReducedMotion'

export interface RollingWordStep {
    /** The word to display */
    word: string
    /** How long (ms) to hold this word before advancing to the next */
    hold: number
}

interface RollingWordsProps {
    /** Ordered list of words + how long each is held. The final word stays permanently. */
    steps: RollingWordStep[]
    /** Classes applied to the wrapper — set the color/weight of the rolling word here. */
    className?: string
}

// Snappy curve for the cycling words. The roll duration scales with how long the word is
// held, so the fast "speed-run" pass rolls quickly instead of piling up against short holds.
const FAST_EASE = [0.33, 1, 0.68, 1] as const
const fastRoll = (hold: number) => ({ duration: Math.min(0.26, Math.max(0.07, hold / 1400)), ease: FAST_EASE })
// Graceful ease-out-expo settle for the final word
const SETTLE_TRANSITION = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }

// Underline uses the primary text color (theme-adaptive), independent of the word color.
const UNDERLINE = 'absolute left-0 right-0 -bottom-1 h-[3px] rounded-full bg-[rgb(var(--text-primary))]'

/**
 * Slot-machine word cycler for headlines. Words stack in a single fixed-size cell and roll
 * vertically — the outgoing word slides up and out (clipped) while the incoming word rises
 * from below into place. The cycle accelerates (driven by each step's `hold`) and settles
 * permanently on the last word with a slower, graceful glide.
 *
 * The cell is sized to the longest word so the underline holds a constant width.
 *
 * Respects `prefers-reduced-motion` by rendering only the final word, statically.
 */
export function RollingWords({ steps, className = '' }: RollingWordsProps): JSX.Element {
    const prefersReducedMotion = usePrefersReducedMotion()
    const [index, setIndex] = useState(0)

    const lastIndex = steps.length - 1
    const isFinal = index >= lastIndex

    // Reserve width/height for the longest word so the cell (and underline) never resize.
    const longestWord = steps.reduce((a, b) => (b.word.length > a.length ? b.word : a), '')

    useEffect(() => {
        if (prefersReducedMotion || isFinal) {
            return
        }
        const timer = setTimeout(() => setIndex((i) => Math.min(i + 1, lastIndex)), steps[index].hold)
        return () => clearTimeout(timer)
    }, [index, isFinal, lastIndex, prefersReducedMotion, steps])

    // Reduced motion: skip the animation, show the destination word.
    if (prefersReducedMotion) {
        return (
            <span className={`relative inline-block px-2 align-baseline ${className}`}>
                <span aria-hidden className="invisible">
                    {longestWord}
                </span>
                <span className="absolute inset-0 whitespace-nowrap text-center">{steps[lastIndex]?.word ?? ''}</span>
                <span className={UNDERLINE} />
            </span>
        )
    }

    const current = steps[index]?.word ?? ''

    return (
        <span className={`group relative inline-block px-2 align-baseline ${className}`}>
            {/* Invisible sizer pins the cell to the longest word's box */}
            <span aria-hidden className="invisible">
                {longestWord}
            </span>

            {/* Rolling cell — clips words as they slide in/out. Extends a couple px below the
                text box so descenders (g, q, y) aren't clipped at rest. */}
            <span className="absolute inset-x-0 top-0 -bottom-0.5 overflow-hidden">
                <AnimatePresence initial={false}>
                    <motion.span
                        key={current}
                        className="absolute inset-0 whitespace-nowrap text-center"
                        initial={{ y: '105%', opacity: 0 }}
                        animate={{ y: '0%', opacity: 1 }}
                        exit={{ y: '-105%', opacity: 0 }}
                        transition={isFinal ? SETTLE_TRANSITION : fastRoll(steps[index]?.hold ?? 300)}
                    >
                        {current}
                    </motion.span>
                </AnimatePresence>
            </span>

            <span className={UNDERLINE} />

            {/* Replay control — appears on hover once the cycle has settled */}
            {isFinal && (
                <button
                    type="button"
                    onClick={() => setIndex(0)}
                    aria-label="Replay"
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted opacity-0 transition-opacity duration-150 hover:text-primary focus-visible:opacity-100 group-hover:opacity-100"
                >
                    <IconRewind className="size-4" />
                </button>
            )}
        </span>
    )
}

export default RollingWords
