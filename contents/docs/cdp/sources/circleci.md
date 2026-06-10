---
title: Linking CircleCI as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: CircleCI
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The CircleCI connector syncs your CI/CD data – pipelines, workflows, jobs, and projects – into PostHog.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to CircleCI.
3. Enter your CircleCI credentials:
   - **Personal API token** – Create one in your [CircleCI user settings](https://app.circleci.com/settings/user/tokens). The token has the same access to organizations and projects as your user account.
   - **Organization slug** – The organization slug in `vcs/org` format, such as `gh/your-org`. Find this under **Organization settings** in CircleCI.
4. Click **Next**, select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using CircleCI data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `pipelines` | CI/CD pipelines for your organization | Full refresh |
| `workflows` | Workflows within pipelines | Full refresh |
| `jobs` | Individual jobs within workflows | Full refresh |
| `projects` | Projects derived from pipeline data | Full refresh |

All tables use **full refresh** sync because the CircleCI API doesn't support incremental fetching. Each sync reloads all data.

## Configuration

<SourceParameters />
