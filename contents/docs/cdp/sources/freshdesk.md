---
title: Linking Freshdesk as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Freshdesk
---

The Freshdesk connector syncs support tickets, contacts, companies, and other helpdesk data to PostHog.

To link Freshdesk:

1. Go to the [Data pipeline page](https://app.posthog.com/data-management/sources) and the sources tab in PostHog.

2. Click **New source** and select Freshdesk.

3. Get your API key from Freshdesk by clicking your profile icon in the top right, then **Profile settings**. Copy your API key from the right sidebar.

4. Find your Freshdesk domain – the subdomain part of your Freshdesk URL. For example, if your URL is `https://yourcompany.freshdesk.com`, your domain is `yourcompany`.

5. Enter the API key and domain in PostHog, then click **Next**.

6. Select the schemas you want to sync, choose the sync method and frequency for each, then click **Import**.

The data warehouse then starts syncing your Freshdesk data. You can see details and progress in the [data pipeline sources tab](https://app.posthog.com/data-management/sources).

## Synced tables

The Freshdesk connector syncs the following tables:

| Table | Description | Sync method |
|-------|-------------|-------------|
| `tickets` | Support tickets with status, priority, and metadata | Incremental |
| `contacts` | Customer contacts with their details and tags | Incremental |
| `companies` | Company records associated with contacts | Full refresh |
| `agents` | Support agents in your Freshdesk account | Full refresh |
| `groups` | Agent groups for ticket routing | Full refresh |
| `roles` | Agent roles and permissions | Full refresh |
| `products` | Products associated with your helpdesk | Full refresh |
| `skills` | Agent skills for skill-based routing | Full refresh |
| `ticket_fields` | Custom field definitions for tickets | Full refresh |
| `time_entries` | Time tracked on tickets | Full refresh |
| `satisfaction_ratings` | CSAT ratings from ticket surveys | Full refresh |
| `sla_policies` | Service level agreement policies | Full refresh |
| `business_hours` | Support availability schedules | Full refresh |
| `canned_response_folders` | Folders containing canned responses | Full refresh |

The `tickets` and `contacts` tables support incremental sync using the `updated_since` filter. All other tables are fully refreshed on each sync.

## Configuration

<SourceParameters />
