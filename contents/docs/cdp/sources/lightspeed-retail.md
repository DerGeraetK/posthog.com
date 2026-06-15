---
title: Linking Lightspeed Retail as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: LightspeedRetail
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Lightspeed Retail (X-Series) connector syncs your point-of-sale data – sales, customers, products, inventory, and more – into PostHog. This is a pull-only integration; webhooks aren't used.

## Requirements

- A Lightspeed Retail **Plus** plan or higher
- Admin access to create a personal token

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source**, then click **Link** next to Lightspeed Retail.
3. Enter your store's domain prefix and a personal token. The domain prefix is the subdomain of your store URL (for example, if your store is at `yourstore.retail.lightspeed.app`, the domain prefix is `yourstore`). You can also paste the full URL and PostHog extracts the prefix automatically.
4. To create a personal token, log in to your Lightspeed Retail back office as an admin, go to **Setup** > **Personal tokens**, and create a new token.
5. Back in PostHog, enter your domain prefix and personal token, then click **Next**.
6. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once syncing completes, you can start using Lightspeed Retail data in PostHog.

> **Note:** Changing the domain prefix requires re-entering your personal token since the token is tied to a specific store.

## Available tables

| Table | Description | Sync method | Partitioning |
| ----- | ----------- | ----------- | ------------ |
| `sales` | Sales transactions | Incremental | By sale date |
| `customers` | Customer records | Incremental | By month (created_at) |
| `products` | Product catalog | Incremental | By month (created_at) |
| `inventory` | Inventory levels | Incremental | – |
| `outlets` | Store outlets | Incremental | – |
| `registers` | Point-of-sale registers | Incremental | – |
| `users` | Staff users | Incremental | – |
| `taxes` | Tax configurations | Incremental | – |

## Sync mode

All tables support **incremental** sync using the `version` field. Every record in the Lightspeed X-Series API carries a monotonically increasing integer `version`. PostHog uses this as a cursor to fetch only new or updated records since the last sync, so subsequent syncs are fast and efficient.

## Rate limits

Lightspeed Retail allows 300 × (number of registers) + 50 requests per 5-minute window. PostHog handles rate limiting automatically with retry and backoff.

## Configuration

<SourceParameters />
