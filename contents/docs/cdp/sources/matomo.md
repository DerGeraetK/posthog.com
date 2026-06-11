---
title: Linking Matomo as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Matomo
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

Matomo is an open-source web analytics platform. Connect your Matomo instance to pull web analytics data into the PostHog data warehouse. This source works with both Matomo Cloud and self-hosted instances.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Matomo.
3. You need three pieces of information from your Matomo instance:
   - **Instance URL** – your Matomo instance URL (e.g. `https://myorg.matomo.cloud` for Matomo Cloud, or `https://analytics.example.com` for self-hosted).
   - **Site ID** – the numeric ID of the site you want to sync, found in **Administration > Websites > Manage**.
   - **API token** – create one under **Administration > Personal > Security > Auth tokens**.
4. Back in PostHog, enter the instance URL, site ID, and API token, then click **Next**.
5. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using Matomo data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `visits` | Raw visit log with visitor actions | Incremental |
| `visits_summary` | Daily aggregate visit statistics | Incremental |
| `actions_summary` | Daily aggregate action statistics | Incremental |
| `referrers` | Daily referrer breakdown | Incremental |
| `countries` | Daily visitor country breakdown | Incremental |

**Incremental** tables sync only new or updated records on each run.

## Sync behavior

The `visits` table uses Matomo's Live API to fetch raw visit data in ascending order by server timestamp. Visits from the last hour are deferred to the next sync so their action lists are complete when stored.

The aggregate tables (`visits_summary`, `actions_summary`, `referrers`, `countries`) sync oldest-first by day. Because Matomo can re-archive recent days, incremental syncs re-pull a 3-day trailing window to capture any updates.

## Configuration

<SourceParameters />
