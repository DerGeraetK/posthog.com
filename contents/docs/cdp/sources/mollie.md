---
title: Linking Mollie as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: mollie
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Mollie connector syncs your payment data into PostHog, including payments, refunds, chargebacks, customers, subscriptions, settlements, and payment links.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Mollie.
3. Enter your Mollie API key. Use a live key (`live_...`) for production data — test keys only return test-mode data.
4. Click **Next**.
5. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using Mollie data in PostHog.

## Finding your API key

1. Log in to the [Mollie dashboard](https://my.mollie.com/dashboard).
2. Go to **Developers > API keys**.
3. Copy your live API key (starts with `live_`).

Organization access tokens also work. They may return 4xx errors on profile-scoped endpoints without a profileId, but PostHog treats these as valid credentials.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `payments` | Payment transactions | Full refresh |
| `refunds` | Refund records | Full refresh |
| `chargebacks` | Chargeback records | Full refresh |
| `customers` | Customer records | Full refresh |
| `subscriptions` | Recurring payment subscriptions | Full refresh |
| `settlements` | Settlement batches | Full refresh |
| `payment_links` | Payment link records | Full refresh |

All tables use **full refresh** sync. Mollie's API doesn't support created/updated-since filtering, and mutable objects like payments, refunds, and chargebacks change status after creation. Full refresh ensures you always have the latest data.

## Configuration

<SourceParameters />
