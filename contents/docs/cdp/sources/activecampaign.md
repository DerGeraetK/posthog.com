---
title: Linking ActiveCampaign as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: ActiveCampaign
---

The ActiveCampaign connector syncs your CRM and marketing automation data to PostHog, including contacts, deals, campaigns, automations, and more.

## Schemas

| Schema          | Description                                          |
| --------------- | ---------------------------------------------------- |
| `contacts`      | Contact records with email, name, and custom fields  |
| `accounts`      | Company/organization accounts linked to contacts     |
| `deals`         | Sales deals in your pipeline                         |
| `deal_stages`   | Stages within your deal pipelines                    |
| `deal_groups`   | Deal pipelines (groups of stages)                    |
| `campaigns`     | Email campaigns                                      |
| `lists`         | Contact lists for segmentation                       |
| `segments`      | Dynamic segments based on contact criteria           |
| `forms`         | Forms for collecting contact information             |
| `tags`          | Tags used to categorize contacts                     |
| `automations`   | Marketing automation workflows                       |
| `custom_fields` | Custom field definitions for contacts                |

## To link ActiveCampaign

1. Go to the [Data pipeline page](https://app.posthog.com/data-management/sources) and select the **Sources** tab.
2. Click **New source** and select ActiveCampaign.
3. Enter your ActiveCampaign API URL. This is your account-specific URL, typically `https://youraccount.api-us1.com`. You can find it in your ActiveCampaign dashboard under **Settings** > **Developer**.
4. Enter your ActiveCampaign API key. You can find it on the same **Settings** > **Developer** page. The key is account-wide and grants read access to all endpoints.
5. _Optional:_ Add a prefix to your table names.
6. Click **Next**.

The data warehouse then starts syncing your ActiveCampaign data. You can see details and progress in the [data pipeline sources tab](https://app.posthog.com/data-management/sources).

## Sync limitations

- **Full refresh only** – ActiveCampaign syncs use full refresh mode. Incremental syncing isn't supported because ActiveCampaign's server-side filters have limitations that could cause data to be silently skipped.
- **Rate limits** – ActiveCampaign enforces API rate limits. Large accounts with many contacts may take longer to sync.

## Configuration

<SourceParameters />
