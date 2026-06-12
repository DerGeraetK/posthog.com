---
title: Linking Brex as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Brex
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Brex connector syncs corporate spend data into PostHog, including card and cash transactions, expenses, team structure, vendors, and budgets.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source**, then click **Link** next to Brex.
3. Get an API user token from Brex:
   - Open your [Brex dashboard](https://dashboard.brex.com/settings/developer) and go to **Settings** > **Developer**.
   - Create a new API user token with read access to the data you want to sync: Transactions and Accounts (for card and cash transactions), Expenses, Team (for users, departments, locations), Payments (for vendors), and Budgets.
4. Back in PostHog, enter your API user token and click **Next**.
5. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once syncing completes, you can query Brex data in PostHog.

<CalloutBox icon="IconWarning" title="Token expiration" type="caution">

Brex API user tokens expire after 90 days without API activity. If your syncs start failing with authentication errors, generate a new token in your Brex dashboard and reconnect the source.

</CalloutBox>

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `card_transactions` | Card transactions from your primary Brex card account | Incremental |
| `cash_transactions` | Cash account transactions across all your Brex cash accounts | Incremental |
| `expenses` | Expenses submitted by team members | Incremental |
| `users` | Team members in your Brex account | Full refresh |
| `departments` | Departments in your organization | Full refresh |
| `locations` | Office locations configured in Brex | Full refresh |
| `vendors` | Vendors you've paid through Brex | Full refresh |
| `budgets` | Budgets set up in your Brex account | Full refresh |

**Incremental** tables sync only new or updated records on each run. **Full refresh** tables reload all data on each sync.

## Sync details

The Brex API only supports server-side timestamp filtering on certain endpoints:

- `card_transactions` and `cash_transactions` filter by `posted_at_date` – the date the transaction posted to your account.
- `expenses` filter by `updated_at` – when the expense was last modified.

Team data (`users`, `departments`, `locations`), vendors, and budgets don't support incremental filtering, so these tables always do a full refresh.

## Configuration

<SourceParameters />
