---
title: Linking Rippling as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Rippling
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Rippling connector syncs your workforce data – employees, compensation, organizational structure, and account metadata – into PostHog.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Rippling.
3. Get an **API token** from Rippling. A Rippling admin can create a scoped API token under **Settings** > **Company Settings** > **API Access**. Enable the read scope for each dataset you want to sync (for example, `companies.read`, `users.read`, `workers.read`).
4. Back in PostHog, enter the token in the **API token** field and click **Next**.
5. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using Rippling data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `workers` | Employee records | Incremental or full refresh |
| `users` | User accounts with system access | Incremental or full refresh |
| `companies` | Company records | Incremental or full refresh |
| `departments` | Department structure | Incremental or full refresh |
| `teams` | Team definitions | Incremental or full refresh |
| `levels` | Job levels | Incremental or full refresh |
| `work_locations` | Work location definitions | Incremental or full refresh |
| `employment_types` | Employment type definitions | Incremental or full refresh |
| `compensations` | Compensation records | Incremental or full refresh |

**Incremental** tables sync only new or updated records on each run. **Full refresh** tables reload all data on each sync.

## Required scopes

When creating your API token, enable the read scope for each dataset you want to sync:

- `companies.read`
- `users.read`
- `workers.read`
- `departments.read`
- `teams.read`
- `levels.read`
- `work-locations.read`
- `employment-types.read`
- `compensations.read`

## Token expiration

Rippling API tokens expire after 30 days of inactivity. If a sync fails with an authentication error, generate a new token in Rippling and update the credentials in PostHog.

## Configuration

<SourceParameters />
