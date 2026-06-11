---
title: Linking Gladly as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Gladly
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

Enter your Gladly credentials to pull your customer service data – customers, conversations, agents, and topics – into the PostHog data warehouse.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Gladly.
3. Gather your Gladly credentials:
   - **Organization** – the first part of your Gladly URL. For `myorg.gladly.com`, enter `myorg`.
   - **Agent email** – the email address of an agent with API access.
   - **API token** – create one in **Settings → API Tokens**. The agent must have the **API User** permission.
4. Back in PostHog, enter the credentials and click **Next**.
5. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using Gladly data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `customers` | Customer profiles | Incremental |
| `conversation_items` | Individual items within conversations (messages, notes, etc.) | Incremental |
| `agents` | Support agents | Incremental |
| `topics` | Conversation topics | Incremental |

**Incremental** tables sync only new or updated records on each run.

## How syncing works

Gladly doesn't provide real-time list endpoints for bulk data. Instead, PostHog syncs data from Gladly's scheduled export jobs:

1. Gladly generates export files on a vendor-scheduled basis.
2. PostHog downloads completed export jobs and imports the JSONL data.
3. Each row includes `_job_id` and `_job_updated_at` fields to track which export job it came from.
4. Subsequent syncs skip jobs that have already been processed.

## Sync limitations

Gladly retains export files for **14 days**. If you need historical data older than 14 days, contact Gladly support to regenerate exports before setting up the sync.

## Configuration

<SourceParameters />
