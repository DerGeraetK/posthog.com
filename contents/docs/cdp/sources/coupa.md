---
title: Linking Coupa as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Coupa
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Coupa connector syncs your spend data — invoices, purchase orders, requisitions, suppliers, contracts, expense reports, users, and approvals — into the PostHog data warehouse.

## Prerequisites

You need the following credentials from your Coupa instance:

- **Instance URL** – your Coupa host, e.g. `https://myorg.coupahost.com`
- **Client ID** and **Client secret** – from an OIDC client configured in your Coupa instance

A Coupa admin creates the OIDC client under **Setup > Integrations > OAuth2/OpenID Connect Clients**. Choose the **client credentials** grant type and assign read scopes for the objects you want to sync:

| Table             | Required scope             |
| ----------------- | -------------------------- |
| `invoices`        | `core.invoice.read`        |
| `purchase_orders` | `core.purchase_order.read` |
| `requisitions`    | `core.requisition.read`    |
| `suppliers`       | `core.supplier.read`       |
| `contracts`       | `core.contract.read`       |
| `expense_reports` | `core.expense.read`        |
| `users`           | `core.user.read`           |
| `approvals`       | `core.approval.read`       |

<CalloutBox icon="IconWarning" title="Save your client secret" type="caution">

The client secret is only shown once when you create the OIDC client. If you lose it, you'll need to create a new client.

</CalloutBox>

## Linking Coupa to PostHog

1. Go to the [Data pipeline page](https://app.posthog.com/data-management/sources) and the sources tab in PostHog.
2. Click **New source** and select **Coupa**.
3. Enter your **Instance URL**, **Client ID**, and **Client secret**.
4. Click **Next**, select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using Coupa data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `invoices` | Invoices in your Coupa account | Incremental |
| `purchase_orders` | Purchase orders | Incremental |
| `requisitions` | Requisitions (purchase requests) | Incremental |
| `suppliers` | Supplier records | Incremental |
| `contracts` | Contracts | Incremental |
| `expense_reports` | Expense reports | Incremental |
| `users` | Users in your Coupa account | Incremental |
| `approvals` | Approval records | Incremental |

All tables support **incremental** sync via the `updated_at` field. PostHog uses Coupa's server-side `updated_at[gt]` filter to sync only new or updated records on each run.

## Configuration

<SourceParameters />
