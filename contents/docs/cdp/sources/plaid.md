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

The Plaid connector syncs the accounts and transactions of a linked Plaid Item into PostHog, so you can analyze financial data alongside your product data.

## Prerequisites

You need a Plaid account with access to the [Plaid dashboard](https://dashboard.plaid.com/developers/keys) and an access token for the Item you want to sync. The access token is obtained when a user completes Plaid Link, and each token identifies one linked Item (institution connection).

## Adding a data source

<SourceSetupIntro />

When linking Plaid, you'll need:

- **Environment** – choose **Production** or **Sandbox** to match the environment your credentials belong to. Credentials only work against their own environment.
- **Client ID** – found in the [Plaid dashboard](https://dashboard.plaid.com/developers/keys).
- **Secret** – found alongside the client ID in the Plaid dashboard. Make sure the secret matches your selected environment.
- **Access token** – identifies one linked Item, obtained when a user completes Plaid Link. Add one source per Item.

## Understanding Plaid Items

Plaid uses an Item-centric model. An Item represents a single connection between a user and a financial institution – one bank login. When users link their bank through Plaid Link, you receive an access token for that specific Item.

Each PostHog source corresponds to one Item, so you need a separate source for each bank connection you want to sync. For example, syncing data from a user's checking account at Bank A and their savings account at Bank B requires two Plaid sources in PostHog – one for each Item.

## Sync modes

<SyncModes />

For Plaid, the `accounts` table syncs with full refresh only, retrieving all accounts associated with the Item (including IDs, names, types, masks, and current and available balances) on each sync.

The `transactions` table supports incremental sync using the transaction `date` as the cursor, so subsequent syncs only fetch transactions from the last sync date forward. Transaction data includes IDs and dates, amounts and currencies, merchant names and categories, and payment channels and transaction types. For full history on an initial sync, PostHog queries transactions from January 1, 2000 through the current date.

## Configuration

<SourceParameters />

## Supported tables

<SourceTables />

## Troubleshooting

<TroubleshootingLink />

### Invalid credentials error

If you see an authentication error, verify that:

- Your client ID and secret are correct
- Your secret matches the selected environment (production secrets don't work in sandbox and vice versa)
- Your access token is valid and hasn't expired
- The access token was issued for the same environment you selected

### Access token issues

Plaid access tokens can become invalid if:

- The user revokes access through their bank
- The bank requires re-authentication
- The token was issued for a different environment than you selected

When this happens, have the user complete Plaid Link again to get a new access token.
