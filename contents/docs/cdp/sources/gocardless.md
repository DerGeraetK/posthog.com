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

Enter your GoCardless API credentials to pull your bank debit payment data into the PostHog data warehouse.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to GoCardless.
3. You need two things from GoCardless:
   - **Environment** – select **Live** or **Sandbox**. Live and sandbox use different API hosts and require separate tokens.
   - **Access token** – create one in the [GoCardless dashboard](https://manage.gocardless.com/developers) under **Developers > Create > Access token**. Generate a read-only token for the environment you selected.
4. Back in PostHog, enter the credentials and click **Next**.
5. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using GoCardless data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `customers` | Customer records | Full refresh |
| `mandates` | Direct debit mandates linking customers to bank accounts | Full refresh |
| `payments` | Individual payment records | Full refresh |
| `subscriptions` | Recurring payment subscriptions | Full refresh |
| `payouts` | Payout records to your bank account | Full refresh |
| `refunds` | Refund records | Full refresh |
| `events` | Change log / audit trail | Incremental |

Most tables use **full refresh** because core records (payments, mandates, subscriptions) mutate status over time, and GoCardless only supports filtering by `created_at`, not `updated_at`.

The **events** table is append-only and supports **incremental sync** via `created_at` filtering. It contains the complete change log for all resources.

## Sync behavior

- All tables partition on `created_at` (month format).
- Rate limit: 1000 requests per minute. Syncs automatically retry with backoff if rate limits are hit.
- Credential validation probes the customers endpoint to confirm the token is valid.

## Webhooks

GoCardless webhooks can only be configured manually in the GoCardless dashboard — there's no management API. PostHog uses a pull-only model.

## Configuration

<SourceParameters />
