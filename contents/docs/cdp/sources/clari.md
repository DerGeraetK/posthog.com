---
title: Linking Clari as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Clari
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Clari connector syncs your sales forecasting data – audit events and forecast exports – into PostHog.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Clari.
3. In Clari, generate an API key under API settings.
4. Find your forecast ID in the URL when viewing a forecast tab in Clari (for example, `app.clari.com/forecast/<forecast-id>`).
5. Back in PostHog, enter the **API key** and **Forecast ID**, then click **Next**.
6. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using Clari data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `audit_events` | Audit trail of user actions in Clari, synced incrementally on `eventTimestamp` | Incremental |
| `forecast` | Forecast data exported from Clari | Full refresh |

**Incremental** tables sync only new or updated records on each run. **Full refresh** tables reload all data on each sync.

<CalloutBox icon="IconWarning" title="Sync limits" type="caution">

Clari retains audit events for approximately 30 days. Forecast exports are limited to roughly 1,000 per rolling 30 days, so avoid scheduling very frequent syncs of the forecast table.

</CalloutBox>

## Configuration

<SourceParameters />
