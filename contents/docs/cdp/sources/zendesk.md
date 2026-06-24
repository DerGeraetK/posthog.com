---
title: Linking Zendesk as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Zendesk
---

The Zendesk connector can link brands, groups, organizations, tickets, ticket events, ticket metric events, ticket fields, users, and SLA policies.

To link Zendesk:

1. Go to the [Data pipeline page](https://app.posthog.com/data-management/sources) and the sources tab in PostHog
2. Click **New source** and select Zendesk
3. Provide the subdomain of your zendesk account (`https://posthoghelp.zendesk.com/` -> "posthoghelp" is the subdomain)
4. Provide the [API token](https://support.zendesk.com/hc/en-us/articles/4408889192858-Managing-access-to-the-Zendesk-API#topic_bsw_lfg_mmb) and email associated with it
5. _Optional:_ Add a prefix to your table names
6. Click **Next**

The data warehouse then starts syncing your Zendesk data. You can see details and progress in the [data pipeline sources tab](https://app.posthog.com/data-management/sources).

## Sync modes

Zendesk tables sync in one of two modes depending on whether Zendesk provides an Incremental Export API for that resource. Incremental sync only fetches new or updated records on each run, which reduces API quota usage and speeds up syncs — especially for high-volume accounts.

| Table                  | Sync mode    | Details                            |
| ---------------------- | ------------ | ---------------------------------- |
| `tickets`              | Incremental  | Cursor-based incremental export    |
| `users`                | Incremental  | Cursor-based incremental export    |
| `organizations`        | Incremental  | Time-based incremental export      |
| `ticket_events`        | Incremental  | Time-based incremental export      |
| `ticket_metric_events` | Incremental  | Time-based incremental export      |
| `brands`               | Full refresh | Re-downloads all records each sync |
| `groups`               | Full refresh | Re-downloads all records each sync |
| `sla_policies`         | Full refresh | Re-downloads all records each sync |
| `ticket_fields`        | Full refresh | Re-downloads all records each sync |

New sources automatically use incremental sync where available. Existing sources keep their current sync type until you change it in the UI.

## Configuration

<SourceParameters />
