---
title: Linking Personio as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Personio
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Personio connector syncs your HR data – employees, absences, and attendance records – into PostHog.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Personio.
3. In Personio, create API credentials under **Settings > Integrations > API credentials**. When creating the credentials:
   - Grant read scopes for the datasets you want to sync: `personio:persons:read`, `personio:absences:read`, `personio:attendances:read`
   - Allowlist the employee attributes you need – attributes that aren't allowlisted are silently omitted from sync responses
4. Back in PostHog, enter your **Client ID** and **Client secret** and click **Next**.
5. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using Personio data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `persons` | Employee directory | Incremental |
| `absence_periods` | Absence/time-off records | Incremental |
| `attendance_periods` | Attendance/work-time records | Incremental |

All tables sync incrementally based on `updated_at`, so only new or modified records are fetched on each run.

## Configuration

<SourceParameters />
