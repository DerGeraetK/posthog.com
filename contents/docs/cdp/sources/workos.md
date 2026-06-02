---
title: Linking WorkOS as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: WorkOS
---

The WorkOS connector can link organizations, users, connections, directories, directory users, and directory groups to PostHog.

To link WorkOS:

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.

2. Click **+ New source** and then click **Link** next to WorkOS.

3. Next, you need an API key from WorkOS. Go to your [WorkOS Dashboard](https://dashboard.workos.com/) and navigate to **API Keys**. Copy the API key (it starts with `sk_`).

4. Back in PostHog, paste the API key in the `API key` field and click **Next**.

5. On the next page, set up the schemas you want to sync and click **Import**.

Once the syncs are complete, you can start using WorkOS data in PostHog.

## Sync limitations

WorkOS doesn't expose a server-side timestamp filter, so all schemas use full refresh sync only. Incremental sync isn't available for WorkOS tables.

## Configuration

<SourceParameters />
