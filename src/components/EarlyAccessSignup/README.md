# EarlyAccessSignup

A single, reusable email sign-up form that enrolls a visitor into a PostHog
**Early Access Feature (EAF)**. It's the shared code path behind the `/roadmap`
"Coming soon" / "In beta" cards, the `/code` waitlist, and the managed-warehouse
waitlist — so every sign-up across the site lands in **one list**.

## Why one component

Enrolling via posthog-js `updateEarlyAccessFeatureEnrollment(flagKey, true)` sets the
person property `$feature_enrollment/{flagKey}` — the same property the in-app
"Coming Soon" / Feature Previews opt-in sets. Routing all three website surfaces
through this component guarantees they unify with in-app enrollment automatically,
with no backend sync. No PostHog login is required.

All enrollment logic lives in [`useEarlyAccessFeatures`](../../hooks/useEarlyAccessFeatures.ts);
this component is just the form + success state.

## Two modes

| `mode`     | When                | Email     | Default button       | On submit                                              |
| ---------- | ------------------- | --------- | -------------------- | ----------------------------------------------------- |
| `waitlist` | stage concept/alpha | required  | "Notify me at launch" | register interest + capture email                     |
| `try`      | stage beta          | optional  | "Enable & try it"    | enroll (flips the feature flag for the user) + email  |

`mode` defaults from `stage` (`beta` → `try`, otherwise `waitlist`).

## Props

| Prop             | Type                          | Default                       | Notes |
| ---------------- | ----------------------------- | ----------------------------- | ----- |
| `flagKey`        | `string`                      | —                             | EAF flag key to enroll into. If omitted/unmapped, the form **captures only** (no enrollment). |
| `stage`          | `EarlyAccessFeatureStage`     | `'concept'`                   | Drives default `mode` and copy. |
| `mode`           | `'waitlist' \| 'try'`         | derived from `stage`          | Overrides the derived mode. |
| `productName`    | `string`                      | —                             | Used in success/button copy. |
| `buttonLabel`    | `string`                      | derived from `mode`           | |
| `successTitle`   | `string`                      | `"You're on the list!"`       | |
| `successMessage` | `React.ReactNode`             | derived from `mode`           | |
| `autoFocus`      | `boolean`                     | `false`                       | |
| `confetti`       | `boolean`                     | `true`                        | Triggers app-wide confetti via `useApp().setConfetti`. |
| `showDiscord`    | `boolean`                     | `false`                       | Shows a "Join our Discord" link in the success state. |
| `identify`       | `boolean`                     | `false`                       | Opt-in to `posthog.identify(email)`; off by default to avoid merging anonymous browsers. |
| `eventName`      | `string`                      | `'early_access_feature_signup'` | Analytics event fired on submit. |
| `extraProps`     | `Record<string, any>`         | —                             | Merged into the capture event props. |
| `onSuccess`      | `(email: string) => void`     | —                             | Fires after a successful submit — e.g. to fire a legacy survey event. |
| `className`      | `string`                      | `''`                          | |

## Identity & persistence

Because posthog.com initializes posthog-js with `person_profiles: 'identified_only'`,
the hook calls `posthog.createPersonProfile()` before setting properties or enrolling —
otherwise nothing persists for anonymous visitors. See `useEarlyAccessFeatures` for detail.

## Example

```tsx
<EarlyAccessSignup
    flagKey="posthog-code"
    stage="concept"
    productName="PostHog Code"
    eventName="subscribe_to_product_updates"
    extraProps={{ source: 'roadmap' }}
/>
```
