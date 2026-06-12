---
title: Linking Apollo as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Apollo
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Apollo connector syncs your saved contacts, accounts, and opportunities from Apollo into PostHog.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.

2. Click **+ New source** and then click **Link** next to Apollo.

3. Get an API key from Apollo. In your Apollo account, go to **Settings** > **Integrations** > **API** and create a new API key. API access requires a paid Apollo plan.

4. Back in PostHog, paste the API key in the **API key** field and click **Next**.

5. Select the tables you want to sync, set the sync frequency, then click **Import**.

Once syncing completes, you can start using Apollo data in PostHog.

## Available tables

| Table           | Description                      | Sync method |
| --------------- | -------------------------------- | ----------- |
| `contacts`      | Your saved contacts in Apollo    | Incremental |
| `accounts`      | Your saved accounts in Apollo    | Incremental |
| `opportunities` | Your opportunities (deals)       | Full refresh |

**Incremental** tables sync only records modified since the last sync, based on the `updated_at` field. **Full refresh** tables reload all data on each sync because Apollo's API doesn't support sorting opportunities by update time.

## Sync limitations

Apollo search results are capped at 50,000 records per table. If a table exceeds this limit, older records won't sync. PostHog logs an error when this happens.

## Configuration

<SourceParameters />
