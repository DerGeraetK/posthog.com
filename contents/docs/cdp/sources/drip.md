---
title: Linking Drip as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Drip
---

The Drip connector links subscribers, campaigns, broadcasts, workflows, forms, and goals to PostHog.

To link Drip:

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.

2. Click **+ New source** and then click **Link** next to Drip.

3. Get an API token from Drip. Go to **Settings** > **User Settings** > **API** in your Drip dashboard and copy your API token.

4. Get your Drip account ID. Find it under **Settings** > **Account** > **General Info**, or in your Drip dashboard URL (the number after `/a/`).

5. Back in PostHog, paste the API token in the `API token` field and the account ID in the `Account ID` field, then click **Next**.

6. Select the schemas you want to sync. All Drip tables use full refresh sync. Once done, click **Import**.

Once syncs complete, you can use Drip data in PostHog.

## Synced tables

The Drip connector syncs the following tables:

| Table | Description |
|-------|-------------|
| `subscribers` | Contacts in your Drip account with their tags, status, and custom fields |
| `campaigns` | Email campaigns you've created |
| `broadcasts` | One-time email broadcasts |
| `workflows` | Automation workflows |
| `forms` | Opt-in forms |
| `goals` | Conversion goals |

All tables use full refresh sync because Drip's API doesn't support filtering by last-modified time.

## Configuration

<SourceParameters />
