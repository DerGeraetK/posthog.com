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

The Plaid connector syncs your banking data into PostHog, including accounts and transactions. Each PostHog source connects to one Plaid Item – a single bank connection created when a user completes Plaid Link. Add one source per institution connection.

To link Plaid:

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.

2. Click **+ New source** and then click **Link** next to Plaid.

3. Select your Plaid environment:
   - **Production** - For live bank connections with real user data
   - **Sandbox** - For testing with Plaid's sandbox credentials

4. Enter your Plaid credentials. Find these in the [Plaid dashboard](https://dashboard.plaid.com/developers/keys) under **Developers** > **Keys**:
   - **Client ID** - Your Plaid client identifier
   - **Secret** - The secret for your selected environment (production or sandbox)
   - **Access token** - The token for the specific Item (bank connection) you want to sync. You get this when a user completes Plaid Link in your application.

5. Click **Next**.

6. Select the schemas to sync and configure the sync method for each:
   - **accounts** - Full refresh only. Syncs account details like balances, names, and types.
   - **transactions** - Supports incremental sync using the `date` field. Syncs transaction history including amounts, merchants, and categories.

7. Click **Import**.

The data warehouse then starts syncing your Plaid data. You can see details and progress in the [sources tab](https://app.posthog.com/data-management/sources).

## Configuration

<SourceParameters />

## Understanding Plaid Items

Plaid uses an Item-centric model. An Item represents a single connection between a user and a financial institution – one bank login. When users link their bank through Plaid Link, you receive an access token for that specific Item.

Each PostHog source corresponds to one Item, so you need a separate source for each bank connection you want to sync. For example, syncing data from a user's checking account at Bank A and their savings account at Bank B requires two Plaid sources in PostHog – one for each Item.

## Sync methods

### Accounts

The `accounts` table syncs with full refresh only. Each sync retrieves all accounts associated with the Item, including:

- Account IDs and names
- Account types (checking, savings, credit card, etc.)
- Current and available balances
- Account masks and official names

### Transactions

The `transactions` table supports incremental sync using the transaction `date` as the cursor. Subsequent syncs only fetch transactions from the last sync date forward, reducing API calls and sync time.

Transaction data includes:

- Transaction IDs and dates
- Amounts and currencies
- Merchant names and categories
- Payment channels and transaction types

For full history on an initial sync, PostHog queries transactions from January 1, 2000 through the current date.

## Troubleshooting

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
