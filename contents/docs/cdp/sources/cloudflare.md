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

The Cloudflare connector syncs your Cloudflare configuration data into PostHog, including accounts, zones, and DNS records.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Cloudflare.
3. Create an API token in the [Cloudflare dashboard](https://dash.cloudflare.com/profile/api-tokens):
   - Click **Create Token**, then **Create Custom Token**.
   - Give the token a descriptive name.
   - Under **Permissions**, add the following read permissions:
     - **Account** > **Account Settings** > **Read**
     - **Zone** > **Zone** > **Read**
     - **Zone** > **DNS** > **Read**
   - Under **Zone Resources**, select the zones you want to sync. Choose **All zones** to sync DNS records from every zone the token can access.
   - Click **Continue to summary**, then **Create Token**.
   - Copy the token and store it securely. You won't be able to see it again.
4. Back in PostHog, enter your Cloudflare **API token** and click **Next**.
5. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using Cloudflare data in PostHog.

## Configuration

<SourceParameters />

## Available tables

| Table | Description | Sync method |
| --- | --- | --- |
| `accounts` | Cloudflare accounts the token has access to | Full refresh |
| `zones` | Zones (domains) configured in your Cloudflare account | Full refresh |
| `dns_records` | DNS records from all zones the token can access. Each record includes a `_zone_id` field linking it to its parent zone. | Full refresh |

The Cloudflare API doesn't expose updated-at timestamps for these resources, so incremental sync isn't available.
