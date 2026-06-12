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

Enter your Clari API credentials to pull your revenue forecasting data into the PostHog data warehouse.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Clari.
3. In Clari, generate an API key under your account's **API settings**.
4. Back in PostHog, enter the API key in the `API key` field.
5. Enter your **Forecast ID**. You can find this in the URL when viewing a forecast tab in Clari (e.g. `app.clari.com/forecast/<forecast-id>`).
6. Click **Next**.
7. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using Clari data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `audit_events` | User activity and system events | Incremental |
| `forecast` | Revenue forecast data | Full refresh |

**Incremental** tables sync only new or updated records on each run using the `eventTimestamp` field. **Full refresh** tables reload all data on each sync.

## Sync limitations

- **Audit events** are only retained in Clari for about 30 days. Historical data older than this cannot be synced.
- **Forecast exports** are limited to roughly 1,000 per rolling 30 days. Avoid setting very frequent sync intervals for the forecast table.

## Configuration

<SourceParameters />
