import { useEffect, useState } from 'react'
import usePostHog from './usePostHog'

export const KOREAN_SITE_FLAG = 'korean-site'

/**
 * Kill switch for the Korean (/ko) experience — the translated landing page and
 * the translated nav bar (`KoreanTaskBarMenu`). These mirror the English site, so
 * this flag lets us turn them off when a future website change would leave the
 * translations stale, without touching the standalone Korean newsletters.
 *
 * The experience is ON by default and only turned OFF when the `korean-site` flag
 * is explicitly disabled. We default `true` during SSR / before flags resolve so
 * the page renders unchanged (matching the SSR markup, avoiding hydration
 * flicker) and so adblocked visitors — whose flags never load — keep seeing it.
 */
export const useKoreanSiteEnabled = (): boolean => {
    const posthog = usePostHog()
    const [enabled, setEnabled] = useState(true)

    useEffect(() => {
        if (!posthog?.onFeatureFlags) {
            return
        }
        return posthog.onFeatureFlags(() => {
            // `isFeatureEnabled` returns true/false/undefined; keep the experience
            // on unless the flag is deliberately off.
            setEnabled(posthog.isFeatureEnabled(KOREAN_SITE_FLAG) !== false)
        })
    }, [posthog])

    return enabled
}
