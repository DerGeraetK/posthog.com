---
title: Linking Trello as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Trello
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Trello connector syncs your boards, cards, lists, checklists, labels, members, and activity history into PostHog's data warehouse.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Trello.
3. Get your Trello credentials:
   - **API key** – Go to [trello.com/power-ups/admin](https://trello.com/power-ups/admin), select or create a Power-Up, and copy your API key from the API key section.
   - **API token** – On the same page, click the link to generate a token with **read** access for your account. Authorize the token and copy it.
4. Paste your API key and API token into PostHog and click **Next**.
5. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using Trello data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `boards` | All boards the authenticated user has access to | Full refresh |
| `organizations` | Trello workspaces the user belongs to | Full refresh |
| `lists` | Lists across all accessible boards | Full refresh |
| `cards` | Cards across all accessible boards | Full refresh |
| `checklists` | Checklists across all accessible boards | Full refresh |
| `labels` | Labels defined on all accessible boards | Full refresh |
| `members` | Board members across all accessible boards | Full refresh |
| `actions` | Activity history (comments, moves, updates) across all boards | Incremental |

**Incremental** tables sync only new or updated records on each run. **Full refresh** tables reload all data on each sync.

## Sync limitations

Only the `actions` table supports incremental sync – it's the only Trello endpoint with a server-side timestamp filter. All other tables use full refresh, which matches the behavior of other Trello connectors like Airbyte and Fivetran.

Actions are returned newest-first, so incremental syncs page backwards through history until reaching the last synced timestamp.

## Configuration

<SourceParameters />
