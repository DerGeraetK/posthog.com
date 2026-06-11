---
title: Linking Optimizely as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Optimizely
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

Enter your Optimizely personal access token to pull your projects, experiments, audiences, events, pages, and campaigns into the PostHog data warehouse.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Optimizely.
3. You need a personal access token from Optimizely. In Optimizely, go to **Account Settings → API Access** and generate a token. An admin can create tokens; they are non-expiring. Copy the **Personal access token**.
4. Back in PostHog, enter the personal access token and click **Next**.
5. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using Optimizely data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `projects` | All projects the token can access | Full refresh |
| `experiments` | Experiments, fetched per project | Full refresh |
| `audiences` | Audiences, fetched per project | Full refresh |
| `events` | Custom events, fetched per project | Full refresh |
| `pages` | Pages (for Web projects), fetched per project | Full refresh |
| `campaigns` | Campaigns (for Web projects), fetched per project | Full refresh |

**Full refresh** tables reload all data on each sync.

## Sync limitations

Optimizely's REST API v2 has no server-side updated-since filters, so all tables are full refresh only. The synced data is low-volume experiment configuration — raw event-level data is only available through Optimizely's separate S3 Enriched Events Export and is not included in this connector.

Project-scoped tables (experiments, audiences, events, pages, campaigns) sync across all projects the token can access. If a project doesn't support a feature (for example, campaigns on a non-Web project), that project is skipped for that table.

## Configuration

<SourceParameters />
