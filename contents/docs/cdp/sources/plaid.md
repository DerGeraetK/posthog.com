---
title: Linking Plaid as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Plaid
---

import { CalloutBox } from "components/Docs/CalloutBox";

<CalloutBox icon="IconFlask" title="Alpha" type="info">

Plaid is currently in alpha. We'd love feedback on your experience.

</CalloutBox>

The Plaid connector syncs banking data from a linked financial institution into PostHog, including accounts and transactions. Each source connects to one Plaid Item (a single institution connection), so add a separate source for each institution your users have linked.

## Requirements

You need:

1. A Plaid account with API access
2. Your client ID and secret from the [Plaid dashboard](https://dashboard.plaid.com/developers/keys)
3. An access token for the Item you want to sync (obtained when a user completes Plaid Link in your app)

## Adding a data source

1. In PostHog, go to the [Data pipeline page](https://app.posthog.com/data-management/sources) and select the **Sources** tab.
2. Click **+ New source** and select Plaid by clicking the **Link** button.
3. Select an **Environment**: **Production** or **Sandbox**. Use sandbox for testing with Plaid's test credentials.
4. Enter your **Client ID** from the Plaid dashboard.
5. Enter your **Secret** for the selected environment. Production and sandbox use different secrets.
6. Enter your **Access token**. This is the token for the Plaid Item you want to sync, obtained after a user completes Plaid Link. Each access token represents one linked institution.
7. Click **Next**, select the tables you want to sync, and then press **Import**.

PostHog validates the credentials by calling Plaid's `/item/get` endpoint before creating the source.

## Configuration

<SourceParameters />

## Synced tables

| Table        | Primary key      | Sync method           | Description                               |
| ------------ | ---------------- | --------------------- | ----------------------------------------- |
| Accounts     | `account_id`     | Full refresh          | Bank accounts linked to the Item          |
| Transactions | `transaction_id` | Incremental (by date) | Transactions from the linked accounts     |

### Accounts

The accounts table contains all bank accounts associated with the Item. This includes checking, savings, credit, and other account types. The table is fully refreshed on each sync.

### Transactions

The transactions table contains transaction history from all accounts in the Item. PostHog syncs transactions incrementally using the transaction date as a watermark, pulling new transactions since the last sync. On the first sync, PostHog fetches transaction history back to January 1, 2000 (or the earliest available data).

Transactions are fetched newest-first. PostHog commits the date watermark only after each sync completes, so interrupted syncs resume from the same watermark.

<CalloutBox icon="IconInfo" title="Transaction limitations" type="info">

Plaid's date-window API is used instead of the newer `/transactions/sync` endpoint, which means:

- Deleted transactions in Plaid aren't automatically removed from PostHog
- Modified transactions may not reflect updates until the next full sync of that date range

</CalloutBox>

## Rate limiting

Plaid limits `/transactions/get` calls to 30 requests per minute per Item. PostHog spaces requests approximately 2 seconds apart to stay within this limit and uses exponential backoff if rate limits are hit.

## One Item per source

Each PostHog source connects to exactly one Plaid Item. If you have users who've linked multiple institutions through Plaid Link, add one source per Item (access token). This design matches how Plaid organizes data and ensures clean separation between institution connections.

## Troubleshooting

### Invalid credentials error

If validation fails with an invalid credentials error:

1. Check that the environment setting (production vs sandbox) matches your access token
2. Verify your client ID and secret are from the correct environment
3. Confirm the access token hasn't been revoked or expired

Plaid access tokens can expire or require re-authentication depending on the institution. If an Item enters an error state, your users may need to re-link through Plaid Link, which generates a new access token.
