---
title: Linking Culture Amp as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: CultureAmp
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Culture Amp connector syncs your employee data, demographics, and performance review information into PostHog.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Culture Amp.
3. In Culture Amp, an account admin can generate API credentials under **Settings > Integrations > Culture Amp API**. Grant the following permissions: **employees read**, **employee demographics read**, and **performance evaluations read**.
4. Note your **Account ID** (entity ID) shown alongside your credentials. This is a UUID like `8ed17dce-9eca-4383-a9e1-54f82c362b6d`.
5. Back in PostHog, enter the `Client ID`, `Client secret`, and `Account ID`, then click **Next**.
6. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using Culture Amp data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `employees` | Employee records | Full refresh |
| `employee_demographics` | Demographic data for each employee (name/value pairs) | Full refresh |
| `performance_cycles` | Performance review cycles | Incremental |
| `manager_reviews` | Manager review submissions | Incremental |

**Incremental** tables sync only new or updated records on each run. **Full refresh** tables reload all data on each sync.

## Sync limitations

The `employees` and `employee_demographics` tables are full refresh only — the Culture Amp API doesn't support filtering by modification date for these endpoints. The `employee_demographics` table returns data as name/value pairs (e.g., `{"name": "department", "value": "Engineering"}`), with an `_employee_id` field to link rows to employees.

Survey data is not available through this connector.

## Configuration

<SourceParameters />
