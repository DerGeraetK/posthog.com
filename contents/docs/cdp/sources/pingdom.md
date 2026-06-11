---
title: Linking Pingdom as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Pingdom
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Pingdom connector syncs your uptime and performance monitoring data into PostHog, including checks, probes, maintenance windows, and alerts.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Pingdom.
3. Get your API token from [My Pingdom](https://my.pingdom.com/app/api-tokens) under Settings > Pingdom API. A read-only token is sufficient.
4. Enter your API token in PostHog and click **Next**.
5. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `checks` | Uptime checks configured in Pingdom | Full refresh |
| `probes` | Pingdom probe servers used for monitoring | Full refresh |
| `maintenance` | Scheduled maintenance windows | Full refresh |
| `alerts` | Alert history from your checks | Incremental |

**Incremental** tables sync only new or updated records on each run. **Full refresh** tables reload all data on each sync.

The `alerts` table supports incremental sync using the alert timestamp. Checks, probes, and maintenance don't support server-side date filtering, so they use full refresh only.

## Sync limitations

Per-check endpoints like raw results and performance summaries aren't available yet. They require additional pagination handling and would multiply request volume against Pingdom's rate limits.

Pingdom enforces two-tier rate limits. The connector backs off and retries automatically when it hits them.

## Configuration

<SourceParameters />
