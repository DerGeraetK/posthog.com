---
title: Linking Braintree as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Braintree
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Braintree connector syncs transactions, refunds, and disputes from your Braintree account into PostHog.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.

2. Click **+ New source** and then click **Link** next to Braintree.

3. Select your **Environment**:
   - **Production** – for live Braintree data
   - **Sandbox** – for test data

4. You need API keys from Braintree. In your [Braintree Control Panel](https://www.braintreegateway.com/), go to **Settings** > **API Keys**. If you don't have an existing key, generate a new one. Copy the **Public Key** and **Private Key**.

   > Sandbox and production use separate API keys. Make sure the keys match the environment you selected.

5. Back in PostHog, paste the public key and private key into the corresponding fields and click **Next**.

6. Select the tables you want to sync and configure the sync method and frequency. Click **Import**.

Once the syncs are complete, you can start using Braintree data in PostHog.

## Configuration

<SourceParameters />

## Sync methods

All three Braintree tables (transactions, refunds, and disputes) support incremental syncing using `createdAt` as the replication key. This means only records created since the last sync are fetched on each run.

Full table refresh is also available if you need to re-import all data.

## Available tables

The Braintree connector syncs the following tables:

| Table | Description |
|-------|-------------|
| `transactions` | Payment transactions including amount, status, order ID, merchant account, and payment method type |
| `refunds` | Refund records linked to their original transactions |
| `disputes` | Chargebacks and disputes including case number, status, and disputed amount |

> **Note:** Customer, plan, and subscription data aren't currently available through this connector. These resources use Braintree's legacy SDK API rather than the GraphQL API.
