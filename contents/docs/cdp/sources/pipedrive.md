---
title: Linking Pipedrive as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Pipedrive
---

The Pipedrive connector syncs your CRM data to PostHog, including deals, contacts, organizations, activities, and more.

## Schemas

| Schema               | Description                                       |
| -------------------- | ------------------------------------------------- |
| `deals`              | Sales deals in your pipeline                      |
| `persons`            | Contact records                                   |
| `organizations`      | Companies or organizations                        |
| `products`           | Products or services you sell                     |
| `pipelines`          | Sales pipelines                                   |
| `stages`             | Stages within your pipelines                      |
| `activities`         | Scheduled activities (calls, meetings, tasks)     |
| `notes`              | Notes attached to deals, persons, or organizations|
| `leads`              | Pre-qualified leads before they become deals      |
| `users`              | Users in your Pipedrive account                   |
| `deal_fields`        | Custom field definitions for deals                |
| `person_fields`      | Custom field definitions for persons              |
| `organization_fields`| Custom field definitions for organizations        |

## To link Pipedrive

1. Go to the [Data pipeline page](https://app.posthog.com/data-management/sources) and select the **Sources** tab.
2. Click **New source** and select Pipedrive.
3. Enter your Pipedrive company domain. This is the subdomain in your Pipedrive URL (for example, if you access Pipedrive at `mycompany.pipedrive.com`, enter `mycompany`).
4. Enter your Pipedrive API token. You can find it in Pipedrive under **Settings > Personal preferences > API**. The token inherits your user's permissions, so make sure your user can access the data you want to sync.
5. _Optional:_ Add a prefix to your table names.
6. Click **Next**.

The data warehouse then starts syncing your Pipedrive data. You can see details and progress in the [data pipeline sources tab](https://app.posthog.com/data-management/sources).

## Sync limitations

- **Full refresh only** – Pipedrive syncs use full refresh mode. Incremental syncing isn't supported because Pipedrive's server-side filters haven't been verified for reliable incremental updates.
- **API rate limits** – Pipedrive enforces API rate limits. Large accounts with many records may take longer to sync.

## Configuration

<SourceParameters />
