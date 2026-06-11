---
title: Linking Checkout.com as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: CheckoutCom
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Checkout.com connector syncs your payment disputes data into PostHog. Checkout.com's API doesn't expose a list-all-payments endpoint, so only disputes are available through this connector. Bulk payment data requires the Checkout.com Reports API, which may be added in a future release.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.

2. Click **+ New source** and then click **Link** next to Checkout.com.

3. Create an access key in your [Checkout.com dashboard](https://dashboard.checkout.com/) under **Settings > Access keys**. Grant the key the `disputes` scope.

4. Back in PostHog:
   - Paste the **Access key ID** (starts with `ack_...`) and **Access key secret**.
   - Select the **Environment** that matches where you created the key (production or sandbox).

5. Click **Next**, then select the tables you want to sync and set your sync frequency. Click **Import** to begin syncing.

Once the sync completes, you can start using Checkout.com disputes data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `disputes` | Payment disputes from Checkout.com | Incremental |

The `disputes` table uses the `last_update` field as the replication key for incremental syncing. Only new or updated disputes are fetched on each sync.

## Sync limitations

This source only syncs disputes. Checkout.com's API doesn't expose a list endpoint for payments, so bulk payment data is only available through their Reports API. Support for this may be added in a future release.

## Configuration

<SourceParameters />
