---
title: Linking Amazon Ads as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: AmazonAds
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Amazon Ads connector syncs your advertising data into PostHog, including profiles, Sponsored Products campaigns, and ad groups. You can combine this data with your product analytics to see how campaigns drive user behavior.

## Requirements

You need a Login with Amazon (LWA) application with Amazon Advertising API access. To set this up:

1. Create an LWA application in the [Amazon Developer Console](https://developer.amazon.com/loginwithamazon/console/site/lwa/overview.html)
2. Request access to the [Amazon Advertising API](https://advertising.amazon.com/API/docs/en-us/setting-up/overview)
3. Generate a refresh token authorized for your advertiser account

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Amazon Ads.
3. Select the **Region** that matches your Amazon advertising profiles:
   - **North America** – Accounts on amazon.com, amazon.ca, amazon.com.mx
   - **Europe** – Accounts on amazon.co.uk, amazon.de, amazon.fr, amazon.it, amazon.es, and other EU marketplaces
   - **Far East** – Accounts on amazon.co.jp, amazon.com.au, amazon.sg
4. Enter your Login with Amazon credentials:
   - **LWA client ID** – Your Login with Amazon application's client identifier (starts with `amzn1.application-oa2-client...`)
   - **LWA client secret** – Your Login with Amazon application's client secret
   - **Refresh token** – A refresh token authorized for your advertiser account (starts with `Atzr|...`)
5. Click **Next**.
6. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

PostHog validates your credentials at connect time by minting an access token and listing your advertising profiles. If validation fails, check that your LWA application has Advertising API access and that your refresh token is authorized for the correct account.

Once the syncs are complete, you can start using Amazon Ads data in PostHog.

## Available tables

| Table          | Description                                              | Sync method  |
| -------------- | -------------------------------------------------------- | ------------ |
| `profiles`     | Amazon Advertising profiles associated with your account | Full refresh |
| `sp_campaigns` | Sponsored Products campaigns across all profiles         | Full refresh |
| `sp_ad_groups` | Sponsored Products ad groups across all profiles         | Full refresh |

All tables use **full refresh** sync because the Amazon Ads API doesn't expose an updated-since filter for entity lists. Each sync reloads all data.

Sponsored Products rows (`sp_campaigns` and `sp_ad_groups`) include a `_profile_id` field identifying which advertising profile they belong to. Data is synced from every profile your token can access.

Performance metrics (impressions, clicks, spend) require Amazon's async reporting API and aren't yet supported. Entity data syncs represent your current campaign structure, not historical performance.

## Configuration

<SourceParameters />

## Supported tables

<SourceTables />

## Troubleshooting

### Invalid credentials error

If you see "Invalid Amazon Ads credentials" during setup:

- Verify your LWA client ID and secret are correct
- Confirm your refresh token hasn't been revoked
- Check that your LWA application has Amazon Advertising API access enabled

### Access denied (403)

If you see a 403 error:

- Verify your refresh token has access to the selected region
- Confirm your Amazon Advertising API access is approved and active
- Check that the advertiser account is accessible with your credentials

### No profiles found

If validation succeeds but no data syncs:

- Verify your advertiser account has at least one profile
- Check that the profiles are in the region you selected
