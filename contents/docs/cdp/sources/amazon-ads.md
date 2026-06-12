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

import { CalloutBox } from "components/Docs/CalloutBox";

<CalloutBox icon="IconWarning" title="Alpha release" type="caution">

Amazon Ads is an alpha source. The feature is functional but may have rough edges. Please report any issues you encounter.

</CalloutBox>

The Amazon Ads connector syncs your advertising data into PostHog, including profiles, Sponsored Products campaigns, and ad groups. You can combine this data with your product analytics to see how campaigns drive user behavior.

## Requirements

You need a Login with Amazon (LWA) application with Amazon Advertising API access. To set this up:

1. Create an LWA application in the [Amazon Developer Console](https://developer.amazon.com/loginwithamazon/console/site/lwa/overview.html)
2. Request access to the [Amazon Advertising API](https://advertising.amazon.com/API/docs/en-us/setting-up/overview)
3. Generate a refresh token authorized for your advertiser account

## Linking Amazon Ads

1. Go to the [Data pipeline page](https://app.posthog.com/data-management/sources) and the **Sources** tab
2. Click **New source** and select **Amazon Ads**
3. Select your region:
   - **North America** - Accounts on amazon.com, amazon.ca, amazon.com.mx
   - **Europe** - Accounts on amazon.co.uk, amazon.de, amazon.fr, amazon.it, amazon.es, and other EU marketplaces
   - **Far East** - Accounts on amazon.co.jp, amazon.com.au, amazon.sg
4. Enter your LWA credentials:
   - **LWA client ID** - Your Login with Amazon application's client identifier (starts with `amzn1.application-oa2-client...`)
   - **LWA client secret** - Your Login with Amazon application's client secret
   - **Refresh token** - A refresh token authorized for your advertiser account (starts with `Atzr|...`)
5. Click **Next**, select the tables you want to sync, then click **Link**

PostHog validates your credentials by minting an access token and listing your profiles. If validation fails, check that your LWA application has Advertising API access and that your refresh token is authorized for the correct account.

## Configuration

<SourceParameters />

## Available tables

Amazon Ads syncs the following tables:

- **profiles** - Your Amazon Advertising profiles, representing individual advertiser accounts
- **sp_campaigns** - Sponsored Products campaigns across all accessible profiles
- **sp_ad_groups** - Sponsored Products ad groups across all accessible profiles

Each campaign and ad group row includes a `_profile_id` column that links it to the parent profile.

## Sync modes

Amazon Ads tables support full refresh sync only. The Amazon Advertising API doesn't expose an updated-since filter for entity endpoints, so PostHog re-imports all records on every sync.

Performance metrics (impressions, clicks, spend) require Amazon's async reporting API and aren't yet supported. Entity data syncs represent your current campaign structure, not historical performance.

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
