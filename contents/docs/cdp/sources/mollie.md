---
title: Linking Mollie as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Mollie
---

import { CalloutBox } from "components/Docs/CalloutBox";

The Mollie connector syncs payments, refunds, chargebacks, customers, subscriptions, settlements, and payment links from your Mollie account into PostHog.

<CalloutBox icon="IconFlask" title="Alpha release" type="info">

This source is in alpha. We've tested it against Mollie's API documentation and automated tests, but it hasn't been validated with live Mollie accounts yet. If you run into issues, [let us know](https://posthog.com/questions).

</CalloutBox>

## Sync behavior

Mollie tables use **full refresh** sync only. Each sync reloads all rows from the beginning.

Mollie's API doesn't support filtering by creation or update date, and objects like payments and refunds change status after creation (pending → paid → refunded). Incremental syncing would silently miss these updates. Full refresh keeps your PostHog data accurate, though syncs take longer as your Mollie account grows.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and select Mollie.
3. Enter your Mollie API key.
4. Select the tables you want to sync.
5. _Optional:_ Add a prefix to your table names.
6. Click **Next**, then click **Link**.

### Getting your API key

1. Log into your [Mollie dashboard](https://my.mollie.com/dashboard/).
2. Go to **Developers** > **API keys**.
3. Copy your **Live API key** (starts with `live_`).

Use a live key for production data. Test keys (starting with `test_`) only return test-mode data.

Once linked, your Mollie data starts syncing. You can see details and progress in the [sources tab](https://app.posthog.com/data-management/sources).

## Configuration

<SourceParameters />

## Available tables

| Table | Description |
|-------|-------------|
| payments | All payment transactions |
| refunds | Refunds issued against payments |
| chargebacks | Chargebacks filed against payments |
| customers | Customer records |
| subscriptions | Recurring payment subscriptions |
| settlements | Payout settlements |
| payment_links | Payment links created in Mollie |
