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

import SourceSetupIntro from "../_snippets/source-setup-intro.mdx"
import SyncModes from "../_snippets/sync-modes.mdx"
import TroubleshootingLink from "../_snippets/dw-troubleshooting-link.mdx"
import AlphaRelease from "../_snippets/alpha-release.mdx"

<AlphaRelease />

The Plaid connector syncs the accounts and transactions of a linked Plaid Item into PostHog, so you can analyze financial data alongside your product data. Each source connects to one Plaid Item (a single institution connection), so add a separate source for each institution your users have linked.

## Prerequisites

You need a Plaid account with access to the [Plaid dashboard](https://dashboard.plaid.com/developers/keys) and an access token for the Item you want to sync. The access token is obtained when a user completes Plaid Link, and each token identifies one linked Item (institution connection).

## Adding a data source

<SourceSetupIntro />

When linking Plaid, you'll need:

- **Environment** – choose **Production** or **Sandbox** to match the environment your credentials belong to. Credentials only work against their own environment, and sandbox uses Plaid's test credentials.
- **Client ID** – found in the [Plaid dashboard](https://dashboard.plaid.com/developers/keys).
- **Secret** – found alongside the client ID in the Plaid dashboard. Production and sandbox use different secrets.
- **Access token** – identifies one linked Item, obtained when a user completes Plaid Link. Add one source per Item.

PostHog validates the credentials by calling Plaid's `/item/get` endpoint before creating the source.

## Sync modes

<SyncModes />

## Configuration

<SourceParameters />

## Supported tables

<SourceTables />

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

<TroubleshootingLink />
