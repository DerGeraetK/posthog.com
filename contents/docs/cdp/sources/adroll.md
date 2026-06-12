---
title: Linking AdRoll as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
beta: true
sourceId: AdRoll
---

import { CalloutBox } from 'components/Docs/CalloutBox'

You can sync your AdRoll (NextRoll) advertising data to PostHog. The supported tables include:

| Table | Description |
|---|---|
| Advertisables | Your advertising accounts and properties |
| Campaigns | Ad campaigns scoped to each advertisable |
| Ads | Individual ads scoped to each advertisable |

<CalloutBox icon="IconWarning" title="API quota limits" type="caution">

NextRoll's default API quota is 100 requests per day. A full sync costs 1 + 2 x (number of advertisables) requests. If you have many advertisables, contact NextRoll support to raise your quota before syncing.

</CalloutBox>

## Requirements

- A personal access token from the [NextRoll developer console](https://developers.nextroll.com/)
- A Client ID from an app you create in the NextRoll developer console

## Creating API credentials

1. Go to the [NextRoll developer console](https://developers.nextroll.com/) and sign in.
2. Create a new app to get your **Client ID**.
3. Generate a **personal access token** from your developer account settings.

You need both credentials to authenticate. NextRoll uses a dual auth scheme: the personal access token is sent as an `Authorization` header, and the Client ID is sent as the `apikey` query parameter on every request.

## Configuring PostHog

1. In PostHog, go to the **[Data pipelines](https://app.posthog.com/data-management/sources)** tab.
2. Open the **+ New** drop-down menu in the top-right and select **Source**.
3. Find AdRoll in the sources list and click **Link**.
4. Enter your **Client ID** (the app's Client ID from the NextRoll developer console).
5. Enter your **Personal access token**.
6. (Optional) Add a prefix for the table name.
7. Select the tables you want to sync and click **Link**.

PostHog starts syncing your AdRoll data. You can see details and progress in the [data pipeline sources tab](https://app.posthog.com/data-management/sources).

## Configuration

<SourceParameters />

## Sync mode

AdRoll only supports full refresh syncing. The AdRoll API doesn't provide an `updated_at` filter, so PostHog re-imports all data on every sync.

Performance metrics like spend, impressions, and clicks are available through NextRoll's GraphQL Reporting API but aren't supported yet.
