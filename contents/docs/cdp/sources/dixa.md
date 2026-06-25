---
title: Linking Dixa as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Dixa
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Dixa connector syncs your customer service data – conversations, agents, queues, and more – into the PostHog data warehouse.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Dixa.
3. Generate an API token in Dixa under **Settings > Integrations > API Tokens**. You need an admin-level token. The same token covers both the main API (agents, queues, tags, end users) and the Exports API (conversations).
4. Back in PostHog, paste the token in the **API token** field and click **Next**.
5. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using Dixa data in PostHog.

## Available tables

| Table           | Description                                                              | Sync method  |
| --------------- | ------------------------------------------------------------------------ | ------------ |
| `conversations` | Customer service conversations with messages, timestamps, and metadata  | Incremental  |
| `agents`        | Support agents in your Dixa workspace                                    | Full refresh |
| `endusers`      | End users who have contacted support                                     | Full refresh |
| `queues`        | Conversation routing queues                                              | Full refresh |
| `tags`          | Tags used to categorize conversations                                    | Full refresh |

**Incremental** tables sync only new or updated records on each run. **Full refresh** tables reload all data on each sync.

## Creating an API token

To create an API token in Dixa:

1. Log in to your Dixa account as an admin
2. Go to **Settings** > **Integrations** > **API Tokens**
3. Click **Create new token**
4. Give it a description (e.g., "PostHog sync") and click **Create**
5. Copy the token immediately — it won't be shown again

The same token works for both the main API (agents, queues, tags, end users) and the Exports API (conversations).

## Configuration

<SourceParameters />

## Sync behavior

### Conversations table

The conversations table syncs via the Dixa Exports API. Each conversation includes messages, participant info, and metadata like channel, queue assignment, and resolution status.

- **Incremental sync** uses `updated_at` as the cursor, fetching only conversations updated since the last sync
- The Exports API limits time windows to 31 days, so PostHog walks through 30-day windows during backfills
- The Exports API has strict rate limits (10 requests per minute), so large historical backfills can take a while

### Dimension tables

The dimension tables (`agents`, `endusers`, `queues`, `tags`) sync via the main Dixa API.

- **Full refresh** on each sync – the entire table reloads
- These tables typically have fewer rows and change less frequently than conversations

## Supported tables

<SourceTables />
