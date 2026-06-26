import { type RefObject, useEffect, useRef, useState } from 'react'

/**
 * Find the nearest actually-scrollable ancestor of `el` — the element that clips it as the
 * user scrolls. On posthog.com pages render inside a draggable/resizable OS-style window
 * panel (see `src/context/App.tsx`), so the element that scrolls content out of view is that
 * panel's content area, NOT the browser viewport. Returns null when nothing scrolls yet
 * (content fits), in which case callers fall back to the viewport.
 */
function getScrollParent(el: HTMLElement | null): HTMLElement | null {
    let node = el?.parentElement ?? null
    while (node) {
        const { overflowY } = window.getComputedStyle(node)
        if (
            (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
            node.scrollHeight > node.clientHeight
        ) {
            return node
        }
        node = node.parentElement
    }
    return null
}

/**
 * Returns true once the referenced element has been scrolled fully into view *within its
 * window panel*, then stays true — a one-shot trigger (it never flips back to false).
 *
 * The IntersectionObserver is rooted at the panel's scroll container (via `getScrollParent`)
 * rather than the viewport, so it works inside the OS-style windows where content scrolls
 * within the panel rather than the page. Falls back to the viewport when no scroll container
 * is found.
 *
 * @param threshold Visible fraction that counts as "in view". Defaults to 0.99 (≈ fully
 *   visible) rather than 1 to avoid sub-pixel rounding that can stop `1` from ever firing.
 *   Note: an element taller than the scroll container can never reach this ratio — lower the
 *   threshold for such cases.
 */
export function useInViewWithinWindow<T extends HTMLElement>(ref: RefObject<T>, threshold = 0.99): boolean {
    const [inView, setInView] = useState(false)
    // Keep the latest threshold without re-subscribing the observer on every render.
    const thresholdRef = useRef(threshold)
    thresholdRef.current = threshold

    useEffect(() => {
        const el = ref.current
        if (!el || typeof IntersectionObserver === 'undefined') return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.intersectionRatio >= thresholdRef.current) {
                    setInView(true)
                    observer.disconnect()
                }
            },
            { root: getScrollParent(el), threshold: thresholdRef.current }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [ref])

    return inView
}
