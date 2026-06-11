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

The Rippling connector syncs your workforce management data – employees, users, departments, teams, and compensation records – into PostHog.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Rippling.
3. In Rippling, go to **Settings > Company Settings > API Access** and create a new API token. Enable the read scope for each dataset you want to sync (see [required scopes](#required-api-scopes) below).
4. Back in PostHog, enter the token in the **API token** field and click **Next**.
5. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `workers` | Employee records including personal and employment details | Incremental |
| `users` | User accounts with login and access information | Incremental |
| `companies` | Company information linked to your Rippling account | Incremental |
| `departments` | Organizational departments | Incremental |
| `teams` | Team structures within your organization | Incremental |
| `levels` | Job levels and career ladder definitions | Incremental |
| `work_locations` | Office and remote work locations | Incremental |
| `employment_types` | Employment type classifications (full-time, part-time, contractor) | Incremental |
| `compensations` | Salary and compensation records | Incremental |

**Incremental** tables sync only new or updated records on each run using the `updated_at` or `created_at` timestamp.

## Required API scopes

Your API token needs read access for each table you want to sync:

| Table | Required scope |
| ----- | -------------- |
| `workers` | `workers.read` |
| `users` | `users.read` |
| `companies` | `companies.read` |
| `departments` | `departments.read` |
| `teams` | `teams.read` |
| `levels` | `levels.read` |
| `work_locations` | `work-locations.read` |
| `employment_types` | `employment-types.read` |
| `compensations` | `compensations.read` |

If a table fails to sync with a permissions error, check that your token has the corresponding read scope enabled.

## Token expiration

Rippling API tokens expire after **30 days of inactivity**. If your syncs stop working, generate a new token and update the source configuration in PostHog.

## Sync limitations

Time tracking endpoints (`time-entries`, `time-cards`) and Tier 2 leave endpoints are not yet available. Rippling rate limits are undocumented, but the connector handles rate limiting automatically with retries.

## Configuration

<SourceParameters />
