---
title: Linking Cloudflare as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Cloudflare
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Cloudflare connector syncs configuration data like accounts, zones, and DNS records into the PostHog data warehouse.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Cloudflare.
3. Create an API token in the [Cloudflare dashboard](https://dash.cloudflare.com/profile/api-tokens). Grant the token read permissions for **Account Settings**, **Zone**, and **DNS**.
4. Back in PostHog, paste your API token and click **Next**.
5. Select the tables you want to sync, set the sync frequency, then click **Import**.

Once the syncs are complete, you can start using Cloudflare data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `accounts` | Cloudflare accounts the token can access | Full refresh |
| `zones` | Domains and sites configured in Cloudflare | Full refresh |
| `dns_records` | DNS records for each zone (includes a `_zone_id` field linking to the parent zone) | Full refresh |

**Full refresh** tables reload all data on each sync. Cloudflare's API doesn't support incremental queries, but these are small configuration tables, so full refresh is efficient.

## Configuration

<SourceParameters />
