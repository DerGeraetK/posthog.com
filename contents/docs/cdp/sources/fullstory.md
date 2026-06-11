---
title: Linking Fullstory as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: FullStory
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Fullstory connector syncs user data from Fullstory into PostHog.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Fullstory.
3. Create an API key in Fullstory under **Settings** > **Integrations & API Keys** > **API Keys**. A key with at least the **Viewer** permission level is sufficient.
4. Back in PostHog, enter your Fullstory API key and click **Next**.
5. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the sync completes, you can start using Fullstory data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `users` | User metadata from the Server API v2 | Full refresh |

**Full refresh** tables reload all data on each sync.

## Sync limitations

Only the `users` endpoint is available in this release. Session and event data require Fullstory's async Data Export jobs and are planned for a future update.

The `users` table supports full refresh only – Fullstory's user listing endpoint doesn't expose a server-side timestamp filter for incremental sync.

## Configuration

<SourceParameters />
