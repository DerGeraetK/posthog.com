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

import { CalloutBox } from "components/Docs/CalloutBox";

The Dixa connector syncs your customer service data – conversations, agents, queues, and more – into the PostHog data warehouse.

## Available tables

| Table | Sync method | Description |
|---|---|---|
| conversations | Incremental | Customer service conversations with messages, timestamps, and metadata |
| agents | Full refresh | Support agents in your Dixa workspace |
| endusers | Full refresh | End users who have contacted support |
| queues | Full refresh | Conversation routing queues |
| tags | Full refresh | Tags used to categorize conversations |

## Linking Dixa

1. Go to the [Data pipeline page](https://app.posthog.com/data-management/sources) and the sources tab in PostHog
2. Click **New source** and select Dixa
3. Enter your Dixa API token
4. *Optional:* Add a prefix to your table names
5. Select the tables you want to sync
6. Click **Next**

The data warehouse starts syncing your Dixa data. You can see details and progress in the [data pipeline sources tab](https://app.posthog.com/data-management/sources).

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
