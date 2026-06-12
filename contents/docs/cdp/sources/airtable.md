---
title: Linking Airtable as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Airtable
---

The Airtable connector syncs your Airtable bases to PostHog, including base metadata, table schemas, and records from every table the token can access.

## Adding a data source

1. Go to the [Data pipeline page](https://app.posthog.com/data-management/sources) and select the **Sources** tab.
2. Click **+ New source** and select Airtable by clicking the **Link** button.
3. Create a personal access token:
   - Go to [airtable.com/create/tokens](https://airtable.com/create/tokens) and click **Create new token**.
   - Give your token a name.
   - Add the following scopes:
     - `data.records:read`
     - `schema.bases:read`
   - Under **Access**, add the bases you want to sync (or select **All current and future bases in all current and future workspaces**).
   - Click **Create token** and copy the token (starts with `pat`).
4. Paste your personal access token into PostHog.
5. _Optional:_ Add a prefix to your table names.
6. Click **Next**.

The data warehouse then starts syncing your Airtable data. You can see details and progress in the [data pipeline sources tab](https://app.posthog.com/data-management/sources).

## Available tables

The Airtable source syncs the following tables:

| Table   | Description                                         |
| ------- | --------------------------------------------------- |
| bases   | Metadata for each base the token can access         |
| tables  | Schema metadata for every table within synced bases |
| records | All records from every table within synced bases    |

### Additional columns

Records and tables include extra columns linking them to their parent objects:

- `tables` rows include `_base_id` to identify their base
- `records` rows include `_base_id` and `_table_id` to identify their base and table

Record IDs are only unique within a table, so the combination of `_base_id`, `_table_id`, and `id` forms the unique key for each record.

## Sync modes

- **records** supports **incremental (append-only)** syncing using the `createdTime` field. New records sync automatically, but updates to existing records require a full refresh.
- **bases** and **tables** support **full refresh only** since they're small metadata listings.

Airtable's API doesn't expose a last-modified timestamp on records, so there's no way to incrementally sync updates. If you need to track record changes, use full refresh syncing.

## Configuration

<SourceParameters />
