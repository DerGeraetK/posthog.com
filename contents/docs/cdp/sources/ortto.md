---
title: Linking Ortto as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Ortto
---

The Ortto connector can link people, accounts, audiences, tags, and custom field definitions to PostHog.

To link Ortto:

1. Go to the [Data pipeline page](https://app.posthog.com/data-management/sources) and the sources tab in PostHog
2. Click **New source** and select Ortto
3. Select the region where your Ortto account was created:
   - **Global** - For accounts at `ortto.app`
   - **Australia** - For accounts at `ortto.au`
   - **Europe** - For accounts at `ortto.eu`
4. Enter your Ortto API key. Create one in Ortto under **Settings** > **API keys**
5. *Optional:* Add a prefix to your table names
6. Click **Next**

The data warehouse then starts syncing your Ortto data. You can see details and progress in the [data pipeline sources tab](https://app.posthog.com/data-management/sources).

## Configuration

<SourceParameters />

## Available data

Ortto syncs the following tables:

| Table | Description |
|-------|-------------|
| `people` | Contact records with built-in fields (name, email, phone, location) and custom fields |
| `accounts` | Company/organization records with built-in fields (name, website, industry) and custom fields |
| `audiences` | Audience segment definitions |
| `tags` | Tag definitions used to categorize contacts |
| `person_custom_fields` | Schema definitions for custom person fields |
| `account_custom_fields` | Schema definitions for custom account fields |

Custom fields you've defined in Ortto are included in the `people` and `accounts` tables.

## Sync behavior

All Ortto tables use full refresh syncing. Ortto's API doesn't support filtering by modification date, so PostHog reimports all data on each sync. This matches how other Ortto connectors (like Fivetran) work.

If a sync is interrupted, it resumes from where it left off rather than restarting.
