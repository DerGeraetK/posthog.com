---
title: Linking Amazon Ads as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
alpha: true
sourceId: AmazonAds
---

You can sync your Amazon advertising data by configuring Amazon Ads as a source in PostHog. This source syncs entity data from the Sponsored Products API. The supported tables are:

| Table | Description |
|-------|-------------|
| `profiles` | Advertising profiles associated with your account |
| `sp_campaigns` | Sponsored Products campaigns |
| `sp_ad_groups` | Sponsored Products ad groups |

Campaign and ad group data sync per profile. Each row includes a `_profile_id` field identifying which profile it belongs to.

> **Note:** This source syncs entity data only. Performance metrics (impressions, clicks, spend) require Amazon's async reporting API and will be added in a future update.

## Requirements

To connect Amazon Ads, you need credentials from a Login with Amazon (LWA) application with access to the Amazon Advertising API:

- **LWA client ID** - The client ID from your Login with Amazon application
- **LWA client secret** - The client secret from your Login with Amazon application
- **Refresh token** - An authorized refresh token for the advertiser account you want to sync

### Creating a Login with Amazon application

If you don't have an LWA application with Advertising API access:

1. Go to the [Login with Amazon developer console](https://developer.amazon.com/loginwithamazon/console/site/lwa/overview.html).
2. Create a new security profile or use an existing one.
3. Request access to the Amazon Advertising API through the [Amazon Advertising API onboarding process](https://advertising.amazon.com/API/docs/en-us/get-started/overview).
4. Once approved, generate a refresh token by completing the OAuth authorization flow with your advertiser account.

For detailed instructions, see [Amazon's Advertising API authorization documentation](https://advertising.amazon.com/API/docs/en-us/get-started/overview).

## Configuring PostHog

1. In PostHog, go to the **[Data pipelines](https://app.posthog.com/data-management/sources)** tab.
2. Open the **+ New** drop-down menu in the top-right and select **Source**.
3. Find Amazon Ads in the sources list and click **Link**.
4. Select your **Region**:
   - **North America** - US, Canada, Mexico, Brazil
   - **Europe** - UK, Germany, France, Italy, Spain, Netherlands, UAE, and more
   - **Far East** - Japan, Australia, Singapore
5. Enter your **LWA client ID**.
6. Enter your **LWA client secret**.
7. Enter your **Refresh token**.
8. (Optional) Add a prefix for the table name.

PostHog validates your credentials by minting an access token and listing your advertising profiles. If validation fails, check that your LWA application has Advertising API access and that the refresh token is authorized for the correct advertiser account.

## Configuration

<SourceParameters />

## Sync behavior

All tables use full table refresh. Amazon's entity endpoints don't expose an updated-since filter, so PostHog syncs all data on each run.
