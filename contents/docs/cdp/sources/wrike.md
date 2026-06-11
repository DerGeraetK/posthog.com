---
title: Linking Wrike as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Wrike
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

Enter your Wrike permanent access token to pull your Wrike data into the PostHog data warehouse.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Wrike.
3. In Wrike, create a permanent access token under **Apps & Integrations > API**. The default scope grants sufficient read access for all available tables.
4. Back in PostHog, paste the token in the `Permanent access token` field. Set **Host** to the domain shown in your browser when logged into Wrike (for example `www.wrike.com`, `app-us2.wrike.com`, or `app-eu.wrike.com`). Click **Next**.
5. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using Wrike data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `tasks` | Tasks | Full refresh |
| `folders` | Folders | Full refresh |
| `contacts` | Contacts | Full refresh |
| `workflows` | Workflows | Full refresh |
| `custom_fields` | Custom fields | Full refresh |
| `spaces` | Spaces | Full refresh |

**Full refresh** tables reload all data on each sync.

## Configuration

<SourceParameters />
