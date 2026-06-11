---
title: Linking Taboola as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
alpha: true
sourceId: Taboola
---

You can sync data from Taboola by configuring it as a source in PostHog. The supported streams include:

| Stream | Description | Sync behavior |
|--------|-------------|---------------|
| campaigns | All campaigns in your account | Full refresh |
| campaign_items | Content items for each campaign | Full refresh |
| conversion_rules | Conversion tracking rules | Full refresh |
| campaign_summary_by_day | Daily campaign performance metrics | Incremental (30-day lookback) |
| top_campaign_content | Top 1000 performing content items | Trailing 30-day snapshot |

The `campaign_summary_by_day` stream syncs incrementally with a 30-day lookback window to account for conversion restatement as attribution data settles. The first sync backfills 365 days of history.

Additional streams will be added based on user feedback we receive via our [in-app support form](https://app.posthog.com/#panel=support%3Afeedback%3Adata_warehouse%3Alow%3Atrue).

## Requirements

- A Taboola Ads account.
- Your **Account ID** (the alphabetic account identifier, also called the account name) from the [Taboola Ads Manager](https://ads.taboola.com/).
- **Client ID** and **Client Secret** for the Backstage API.

<CalloutBox icon="IconWarning" title="API credentials require account manager" type="caution">

Backstage API credentials (client ID and secret) are issued by your Taboola account manager. They cannot be self-served through the Taboola UI. Contact your Taboola representative to request API access.

</CalloutBox>

## Configuring PostHog

1. In PostHog, go to the **[Data pipelines](https://app.posthog.com/pipeline/sources)** tab.
2. Open the **+ New** drop-down menu in the top-right and select **Source**.
3. Find Taboola in the sources list and click **Link**.
4. Enter your **Account ID** (the alphabetic account identifier from Taboola Ads).
5. Enter your **Client ID** and **Client Secret** from your Taboola account manager.
6. (Optional) Add a prefix for the table name.

## Configuration

<SourceParameters />
