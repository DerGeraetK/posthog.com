import { useCallback, useEffect, useRef, useState } from 'react'
import usePostHog from './usePostHog'

export type EarlyAccessFeatureStage = 'concept' | 'alpha' | 'beta' | 'general-availability'

export interface EarlyAccessFeature {
    name: string
    description: string
    stage: EarlyAccessFeatureStage
    documentationUrl: string
    flagKey: string
}

export interface GroupedEarlyAccessFeatures {
    /** Stage `beta` — available to try right now via in-app feature previews. */
    beta: EarlyAccessFeature[]
    /** Stages `concept` + `alpha` — "coming soon", join the waitlist. */
    comingSoon: EarlyAccessFeature[]
}

export interface EnrollParams {
    flagKey?: string
    stage?: EarlyAccessFeatureStage
    /** Optional, but required for waitlist flows. Persisted on the person so we can notify at launch. */
    email?: string
    /**
     * Whether to `identify(email)`. Defaults to false — identifying anonymous marketing
     * visitors risks merging distinct browsers into one person and prematurely creating
     * identified profiles. `setPersonProperties({ email })` is enough to attach the email.
     */
    identify?: boolean
    /** Analytics event fired alongside enrollment. */
    eventName?: string
    extraProps?: Record<string, any>
}

const DEFAULT_STAGES: EarlyAccessFeatureStage[] = ['concept', 'alpha', 'beta']
const POLL_INTERVAL_MS = 300
const GIVE_UP_MS = 6000
const DEFAULT_EVENT = 'early_access_feature_signup'

/**
 * Enrollment-only hook. Does NOT fetch, so it's safe to mount many times (e.g. once
 * per card). Writes the `$feature_enrollment/{flagKey}` person property — the same one
 * the in-app "Coming Soon" / Feature Previews opt-in sets — so website and in-app
 * sign-ups land in one list with no extra plumbing.
 *
 * Accounts for `person_profiles: 'identified_only'` (see gatsby/onPreBootstrap.ts):
 * properties/enrollment don't persist for anonymous visitors unless a profile exists,
 * so we call `createPersonProfile()` first (same pattern as CallToAction + Link).
 */
export function useEarlyAccessEnroll(): { enroll: (params: EnrollParams) => Promise<void> } {
    const posthog = usePostHog()

    const enroll = useCallback(
        async ({
            flagKey,
            stage,
            email,
            identify = false,
            eventName = DEFAULT_EVENT,
            extraProps = {},
        }: EnrollParams) => {
            if (!posthog) return

            // Required for anonymous visitors under identified_only — without this,
            // properties and enrollment silently do not persist.
            posthog.createPersonProfile?.()

            if (email) {
                if (identify) {
                    posthog.identify?.(email, { email })
                } else {
                    posthog.setPersonProperties?.({ email })
                }
            }

            if (flagKey && typeof posthog.updateEarlyAccessFeatureEnrollment === 'function') {
                posthog.updateEarlyAccessFeatureEnrollment(flagKey, true)
            }

            posthog.capture?.(eventName, { flagKey, stage, email, ...extraProps })
        },
        [posthog]
    )

    return { enroll }
}

interface UseEarlyAccessFeaturesOptions {
    /** Which stages to request from the API. Defaults to concept + alpha + beta. */
    stages?: EarlyAccessFeatureStage[]
    /**
     * Bypass posthog-js's cached EAF result. Defaults to true: posthog-js caches the
     * list keyed without the stage filter, so a prior default (beta-only) fetch elsewhere
     * on the site would otherwise mask the concept/alpha "coming soon" items here.
     */
    forceReload?: boolean
}

interface UseEarlyAccessFeaturesResult {
    features: EarlyAccessFeature[]
    grouped: GroupedEarlyAccessFeatures
    loading: boolean
    error: boolean
    refetch: () => void
}

/**
 * Fetches PostHog Early Access Features client-side, grouped by stage. Call this ONCE
 * per page — it hits the network. Use `useEarlyAccessEnroll` (above) for the sign-up
 * action so individual cards don't each trigger a fetch.
 *
 * posthog-js is loaded as a CDN snippet; its EAF methods only exist once the async
 * `array.js` has loaded, so this polls for `getEarlyAccessFeatures` before calling it.
 */
export function useEarlyAccessFeatures(options: UseEarlyAccessFeaturesOptions = {}): UseEarlyAccessFeaturesResult {
    const { stages = DEFAULT_STAGES, forceReload = true } = options
    const posthog = usePostHog()
    const [features, setFeatures] = useState<EarlyAccessFeature[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const stagesKey = JSON.stringify(stages)

    const fetchFeatures = useCallback(() => {
        // SSR guard + method-availability guard (the snippet stub doesn't expose EAF methods yet).
        if (typeof window === 'undefined' || typeof posthog?.getEarlyAccessFeatures !== 'function') {
            return false
        }
        try {
            posthog.getEarlyAccessFeatures(
                (result: EarlyAccessFeature[]) => {
                    setFeatures(Array.isArray(result) ? result : [])
                    setLoading(false)
                },
                forceReload,
                stages
            )
            return true
        } catch {
            setError(true)
            setLoading(false)
            return true
        }
        // stagesKey stands in for `stages` (a fresh array each render) in the dep list.
    }, [posthog, forceReload, stagesKey])

    useEffect(() => {
        if (fetchFeatures()) return

        pollRef.current = setInterval(() => {
            if (fetchFeatures() && pollRef.current) {
                clearInterval(pollRef.current)
                pollRef.current = null
            }
        }, POLL_INTERVAL_MS)

        const giveUp = setTimeout(() => {
            if (pollRef.current) {
                clearInterval(pollRef.current)
                pollRef.current = null
            }
            setLoading(false)
        }, GIVE_UP_MS)

        return () => {
            if (pollRef.current) {
                clearInterval(pollRef.current)
                pollRef.current = null
            }
            clearTimeout(giveUp)
        }
    }, [fetchFeatures])

    const grouped: GroupedEarlyAccessFeatures = {
        beta: features.filter((f) => f.stage === 'beta'),
        comingSoon: features.filter((f) => f.stage === 'concept' || f.stage === 'alpha'),
    }

    return { features, grouped, loading, error, refetch: fetchFeatures }
}

export default useEarlyAccessFeatures
