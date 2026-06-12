---
title: Linking Rollbar as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Rollbar
---

The Rollbar connector syncs your Rollbar error tracking data into PostHog, including items (error groups), occurrences (individual error events), deploys, and environments.

To link Rollbar:

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.

2. Click **+ New source** and then click **Link** next to Rollbar.

3. Get a project access token from Rollbar. In your Rollbar project, go to **Settings** > **Project Access Tokens**. Create a new token with the `read` scope, or use an existing read-only token. Copy the token value.

4. Back in PostHog, paste the token in the **Project access token** field.

5. Click **Next**.

6. On the next page, select the schemas you want to sync and configure the sync method and frequency. Click **Import** when ready.

Each PostHog source connects to one Rollbar project. To import data from multiple Rollbar projects, create a separate source for each.

## Sync methods

The Rollbar connector supports two sync methods depending on the table:

- **Items, deploys, environments** - Full refresh only. These tables are completely re-synced on each run.
- **Occurrences** - Supports incremental sync. Only new error occurrences (with higher IDs than the last sync) are fetched.

## Configuration

<SourceParameters />
