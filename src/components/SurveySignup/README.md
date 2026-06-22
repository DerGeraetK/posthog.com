# SurveySignup

A no-login email form that records a sign-up as a PostHog **Survey** response by
firing `posthog.capture('survey sent', { $survey_id, $survey_response: email })`.

This is the single waitlist mechanism on the site. It backs:

- the **/roadmap** "Coming soon" cards (survey id comes from each Early Access Feature's
  `payload.survey_id`),
- the **/code** waitlist (`WaitlistForm`),
- the **managed-warehouse** waitlist (`DuckDBWaitlistSurvey`).

Because every surface fires `survey sent` against the same survey, all sign-ups for a
feature — site or in-app — land in one place: that survey's responses. A PostHog Workflow
can then notify everyone when the feature ships (handled separately).

## Props

| Prop               | Type                       | Default                  | Notes |
| ------------------ | -------------------------- | ------------------------ | ----- |
| `surveyId`         | `string`                   | —                        | Survey to record against. If omitted, no survey event fires (form still calls `onSuccess`). |
| `surveyQuestionId` | `string`                   | —                        | When set, also sends ID-based `$survey_response_{id}`; otherwise legacy `$survey_response`. |
| `productName`      | `string`                   | —                        | Used in success copy. |
| `title`            | `React.ReactNode`          | —                        | Optional heading above the form (hidden once submitted). |
| `buttonLabel`      | `string`                   | `'Notify me at launch'`  | |
| `successTitle`     | `string`                   | `"You're on the list!"`  | |
| `successMessage`   | `React.ReactNode`          | derived from productName  | |
| `autoFocus`        | `boolean`                  | `false`                  | |
| `confetti`         | `boolean`                  | `true`                   | Triggers app-wide confetti via `useApp().setConfetti`. |
| `showDiscord`      | `boolean`                  | `false`                  | Shows a "Join our Discord" link in the success state. |
| `onSuccess`        | `(email: string) => void`  | —                        | Fires after a successful submit — e.g. to capture an extra analytics event. |
| `className`        | `string`                   | `''`                     | |

## No login / no person profile

It only captures the `survey sent` event (the email is the survey response). It does not
identify the visitor or create a person profile, matching the other survey-based waitlist
forms on the site.

## Example (roadmap Coming Soon card)

```tsx
<SurveySignup
    surveyId={feature.payload?.survey_id}
    surveyQuestionId={feature.payload?.survey_question_id}
    productName={feature.name}
/>
```
