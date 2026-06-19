/**
 * Maps a website product `handle` (from useProduct) to its Early Access Feature
 * flag key in PostHog. The flag key MUST match the EAF flag key configured in the
 * PostHog app so website sign-ups land in the SAME enrollment list
 * (`$feature_enrollment/{flagKey}`) as the in-app "Coming Soon" opt-in.
 *
 * Kept local (rather than a field on useProduct data) because EAF keys are a
 * website-capture concern, and the product data layer is migrating to the billing API.
 *
 * TODO(confirm): verify each value against the EAF flag keys in the PostHog app
 * before relying on it — a wrong key silently sends sign-ups to a different/empty list.
 * Handles without an entry fall back to capture-only (no enrollment).
 */
export const PRODUCT_EAF_FLAG_KEYS: Record<string, string> = {
    posthog_code: 'posthog-code',
    managed_warehouse: 'managed-warehouse',
}

export const getFlagKeyForProduct = (handle?: string): string | undefined =>
    handle ? PRODUCT_EAF_FLAG_KEYS[handle] : undefined
