---
title: Linking GoCardless as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: GoCardless
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The GoCardless connector syncs your bank-debit payments data – customers, mandates, payments, subscriptions, payouts, refunds, and events – into PostHog.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to GoCardless.
3. Select your environment:
   - **Live** for production data
   - **Sandbox** for test data
4. You need an access token from GoCardless. In your [GoCardless dashboard](https://manage.gocardless.com/developers), go to **Developers** and create a new **Access token**. For security, create a read-only token dedicated to this integration.
5. Back in PostHog, enter your access token and click **Next**.
6. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using GoCardless data in PostHog.

<CalloutBox icon="IconWarning" title="Environment must match token" type="caution">

Sandbox and live environments use separate hosts and tokens. Make sure the environment you select in PostHog matches the environment your access token was created for, otherwise authentication will fail.

</CalloutBox>

## Available tables

| Table           | Description                                          | Sync method  |
| --------------- | ---------------------------------------------------- | ------------ |
| `customers`     | Customers set up to pay via GoCardless               | Full refresh |
| `mandates`      | Direct Debit mandates authorizing payments           | Full refresh |
| `payments`      | Individual payment transactions                      | Full refresh |
| `subscriptions` | Recurring payment schedules                          | Full refresh |
| `payouts`       | Payouts from GoCardless to your bank account         | Full refresh |
| `refunds`       | Refunds issued against payments                      | Full refresh |
| `events`        | GoCardless event log tracking changes across objects | Incremental  |

Most tables use **full refresh** because GoCardless records change status over time (for example, a payment moves from pending to confirmed) and the API doesn't support filtering by update time. The **events** table is the exception – it's an append-only change log that supports incremental sync via `created_at`.

## Configuration

<SourceParameters />
