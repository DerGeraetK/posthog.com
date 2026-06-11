---
title: Linking AdRoll as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: AdRoll
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The AdRoll (NextRoll) connector syncs your advertising entity data into PostHog. It authenticates against the NextRoll API using a personal access token and your app's Client ID.

<CalloutBox icon="IconWarning" title="API quota limits" type="caution">

NextRoll's default quota is **100 API requests per day**. A full sync costs 1 + 2×(number of advertisables) requests, so accounts with many advertisables may hit this limit. Contact NextRoll support to request a higher quota if needed.

</CalloutBox>

## Requirements

- A personal access token from the [NextRoll developer console](https://developers.nextroll.com/)
- An app registered in the NextRoll developer console (you need the app's **Client ID**)

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to AdRoll.
3. In the [NextRoll developer console](https://developers.nextroll.com/), create a personal access token and register an app if you haven't already. Copy the **Client ID** from your app and the **personal access token**.
4. Back in PostHog, enter the `Client ID (apikey)` and `Personal access token`, then click **Next**.
5. Select the tables you want to sync, set the sync frequency, then click **Import**.

Once the syncs are complete, you can start using AdRoll data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `advertisables` | Advertisable accounts in your organization | Full refresh |
| `campaigns` | Campaigns for each advertisable (includes `_advertisable_eid` for linking) | Full refresh |
| `ads` | Ads for each advertisable (includes `_advertisable_eid` for linking) | Full refresh |

All tables use **full refresh** sync, which reloads all data on each sync. The AdRoll entity API endpoints don't support incremental sync.

## Linking campaigns and ads to advertisables

Campaigns and ads are fetched per advertisable and include an `_advertisable_eid` column that links each row to its parent advertisable. Use this column to join these tables with the `advertisables` table.

## Sync limitations

- **Performance metrics not included**: Metrics like spend, impressions, and clicks are only available through NextRoll's GraphQL Reporting API and aren't yet supported.

## Configuration

<SourceParameters />
