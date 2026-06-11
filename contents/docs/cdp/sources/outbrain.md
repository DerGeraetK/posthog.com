---
title: Linking Outbrain as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
beta: true
sourceId: Outbrain
---

You can sync data from Outbrain Amplify reports by configuring it as a source in PostHog. The supported data includes marketers, campaigns, budgets, promoted links, and performance metrics.

## Requirements

- An Outbrain account with Amplify API access enabled. This is not automatic — you must request API access through your Outbrain account manager.
- Your Outbrain login credentials (email and password).

## Available tables

| Table | Description | Sync mode |
|-------|-------------|-----------|
| `marketers` | Marketer accounts you have access to | Full refresh |
| `campaigns` | Campaigns under each marketer | Full refresh |
| `budgets` | Budgets under each marketer | Full refresh |
| `promoted_links` | Promoted content items under each campaign | Full refresh |
| `marketer_performance_daily` | Daily performance metrics per marketer | Incremental |
| `campaign_performance` | Campaign totals for trailing 30-day window (snapshot) | Full refresh |

The `marketer_performance_daily` table supports incremental sync using the `_date` field as the cursor. On the first sync, PostHog backfills 365 days of history. Subsequent syncs re-pull a 30-day lookback window because conversion metrics can restate for up to 30 days due to attribution.

## Configuring PostHog

1. In PostHog, go to the **[Data pipelines](https://app.posthog.com/data-management/sources)** tab.
2. Open the **+ New** drop-down menu in the top-right and select **Source**.
3. Find Outbrain in the sources list and click **Link**.
4. Enter your Outbrain **Username** (email) and **Password**.
5. (Optional) Add a prefix for the table names.
6. Click **Next** and select the tables you want to sync.

## Configuration

<SourceParameters />
