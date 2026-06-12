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

import { CalloutBox } from "components/Docs/CalloutBox";

The Gladly connector syncs your customer service data – customers, conversations, agents, and topics – into the PostHog data warehouse.

## Available tables

| Table | Sync method | Description |
|---|---|---|
| customers | Incremental | Customer profiles from your Gladly account |
| conversation_items | Incremental | Individual messages and actions within conversations |
| agents | Incremental | Support agents in your Gladly organization |
| topics | Incremental | Topics used to categorize conversations |

All tables support incremental sync using the `_job_updated_at` field, which tracks when each record was last exported from Gladly.

## Linking Gladly

1. Go to the [Data pipeline page](https://app.posthog.com/data-management/sources) and the sources tab in PostHog
2. Click **New source** and select Gladly
3. Enter your connection details:
   - **Organization:** Your Gladly organization name (the subdomain from your Gladly URL, e.g., `myorg` from `myorg.gladly.com`)
   - **Agent email:** The email address of an agent with API access
   - **API token:** The API token for that agent
4. Select the tables you want to sync
5. Click **Next**

The data warehouse then starts syncing your Gladly data. You can see details and progress in the [data pipeline sources tab](https://app.posthog.com/data-management/sources).

## Creating an API token

To create an API token in Gladly:

1. Log in to your Gladly account as an admin
2. Go to **Settings** > **API Tokens**
3. Click **Create API Token**
4. Select the agent who will own the token (must have the **API User** permission)
5. Copy the token immediately — it won't be shown again

The agent associated with the token must have the **API User** permission enabled in Gladly.

## Configuration

<SourceParameters />

## Sync behavior

Gladly doesn't provide a traditional REST API for bulk data access. Instead, PostHog syncs data through Gladly's Export Jobs API, which delivers scheduled JSONL file exports.

### How it works

1. Gladly generates export jobs on a schedule (hourly or daily, configured in Gladly)
2. Each export job contains JSONL files for different data types
3. PostHog downloads and processes these files, oldest job first
4. Each row includes a `_job_updated_at` timestamp used for incremental sync

### Incremental sync

PostHog tracks which export jobs it has processed using the `_job_updated_at` field. On subsequent syncs, it only downloads jobs newer than the last one processed.

If the same record appears in multiple export jobs, PostHog deduplicates by primary key (`id`) and keeps the most recent version.

<CalloutBox icon="IconWarning" title="14-day file retention" type="caution">

Gladly retains export job files for 14 days. If you're setting up the connector for the first time, you'll only have access to the last 14 days of export data. For older historical data, contact Gladly support to request regenerated exports.

</CalloutBox>

## Troubleshooting

### Invalid organization error

If you see an error about an invalid organization, check that you entered only the subdomain portion of your Gladly URL. For `myorg.gladly.com`, enter `myorg` – not the full URL.

### Authentication failed

Verify that:
- The agent email matches an active agent in your Gladly account
- The API token is correct and hasn't been revoked
- The agent has the **API User** permission enabled
