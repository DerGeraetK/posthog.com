# SalesforceForm

Renders the "Book a PostHog demo" / "Contact sales" lead form used across the site. It's a
Formik form driven entirely by a `form` config object (fields, validation, CTA button). On
submit it posts to `/api/contact-event` and a Zapier hook, then shows a success message and
fires confetti.

It's almost always rendered via [`ContactSales`](../ContactSales/index.tsx), which spreads a
`formConfig` object into it. Two live surfaces use it today:

- **`/talk-to-a-human`** – the standalone "Book a PostHog demo" page (`src/pages/talk-to-a-human.tsx`).
- **Presentation sidebar** – the right-hand demo form on product presentations such as
  `/web-analytics` (`src/components/Presentation/Utilities/PresentationForm.tsx`).

## Engagement instrumentation

These forms submit off-page to Salesforce, so without explicit events every open/close is
invisible to analytics — we couldn't measure how often visitors open the form and abandon it
without interacting. The component fires lightweight lifecycle events via `posthog.capture`:

| Event                 | When it fires                                                        |
| --------------------- | -------------------------------------------------------------------- |
| `demo_form_viewed`    | The form mounts (has fields).                                        |
| `demo_form_started`   | First focus of any field (fires once).                               |
| `demo_form_submitted` | A valid submit is attempted.                                         |
| `demo_form_closed`    | The form unmounts/closes without a submit (abandonment).             |

Every event carries:

- **`form_name`** – the form config name (e.g. `Contact sales`).
- **`form_location`** – the surface, so abandonment can be funneled per surface: `talk_to_a_human`
  from the page, `<team>_sidebar` (e.g. `web_analytics_sidebar`) from a presentation, or
  `presentation_sidebar` as a fallback.

`demo_form_closed` additionally sends **`form_started`** (boolean) to separate glance-and-leave
abandonment (`false`) from partial fills (`true`).

Pass `formLocation` through the `formConfig` object handed to `ContactSales`; it flows into
`SalesforceForm` via the config spread.

> **Note:** These event names were chosen to be self-descriptive and funnel-friendly. Confirm
> them with the marketing/web team so they align with existing HubSpot/Salesforce reporting
> before building long-lived dashboards on top of them.
