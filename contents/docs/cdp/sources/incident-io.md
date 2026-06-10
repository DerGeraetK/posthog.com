---
title: Linking incident.io as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: incident.io
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The incident.io connector pulls your incident management data into the PostHog data warehouse, including incidents, alerts, escalations, users, schedules, and related configuration.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to incident.io.
3. In incident.io, go to **Settings > API keys** ([direct link](https://app.incident.io/settings/api-keys)) and create a new API key. Grant the **view** scope for each resource you want to sync.
4. Back in PostHog, paste your API key and click **Next**.
5. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using incident.io data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `incidents` | Incidents tracked in your account | Incremental |
| `incident_updates` | Status updates and notes on incidents | Full refresh |
| `follow_ups` | Follow-up tasks from incidents | Full refresh |
| `alerts` | Alerts that triggered incidents | Full refresh |
| `escalations` | Escalation paths and their state | Full refresh |
| `users` | Users in your incident.io organization | Full refresh |
| `schedules` | On-call schedules | Full refresh |
| `severities` | Severity levels defined in your account | Full refresh |
| `incident_roles` | Roles assigned during incidents | Full refresh |
| `incident_statuses` | Incident status definitions | Full refresh |
| `incident_types` | Incident type definitions | Full refresh |
| `custom_fields` | Custom field definitions | Full refresh |

**Incremental** tables sync only new or updated records on each run. **Full refresh** tables reload all data on each sync.

Only the `incidents` table supports incremental sync. You can sync by `updated_at` (default) or `created_at`. The other tables are configuration or event data that incident.io's API doesn't support filtering by timestamp, so they use full refresh.

## API key permissions

incident.io API keys have granular per-resource permissions. When creating your API key, grant the **view** scope for each table you want to sync. If your key is missing a required permission, you'll see an error when trying to sync that table.

## Configuration

<SourceParameters />
