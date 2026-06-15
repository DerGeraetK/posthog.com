---
title: Linking Google Search Console as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
beta: true
sourceId: GoogleSearchConsole
---

You can sync SEO performance data from Google Search Console by configuring it as a source in PostHog. Once connected, you can join this data with your product and web analytics to understand how organic search traffic correlates with product engagement.

## Available tables

Google Search Console syncs data from the [Search Analytics API](https://developers.google.com/webmaster-tools/search-console-api-original/v3/searchanalytics). The following tables are available:

| Table | Description | Sync method |
|-------|-------------|-------------|
| `search_analytics_by_date` | Daily totals for clicks, impressions, CTR, and average position. | Incremental |
| `search_analytics_by_query` | Daily performance broken out by search query (keyword). | Incremental |
| `search_analytics_by_page` | Daily performance broken out by landing page URL. | Incremental |
| `search_analytics_by_country` | Daily performance broken out by country (ISO 3166-1 alpha-3). | Incremental |
| `search_analytics_by_device` | Daily performance broken out by device (DESKTOP, MOBILE, TABLET). | Incremental |
| `search_analytics_by_query_page` | Daily performance broken out by both query and landing page (enabled by default). | Incremental |
| `search_analytics_by_search_appearance` | Daily performance broken out by search result presentation type (e.g., RICH_RESULT, FAQ_RICH_RESULT, VIDEO). | Incremental |

All tables include these metrics: `clicks`, `impressions`, `ctr` (click-through rate), and `position` (average ranking position).

**Incremental** tables sync only new or updated records on each run.

> **Note:** Only `search_analytics_by_query_page` is enabled by default. Enable additional tables manually during source configuration based on your analysis needs.

## Requirements

- A verified [Google Search Console property](https://search.google.com/search-console) (either URL-prefix or domain property)
- A Google account with read access to the property
- During authentication, make sure you approve the requested scopes

## Data freshness and history

Google Search Console data has a 2-3 day processing delay. PostHog syncs data up to 3 days behind the current date to ensure you receive finalized data.

On initial sync, PostHog backfills approximately 16 months of historical data (the maximum Google retains).

## API sampling limitations

Google's Search Analytics API has a limit of approximately 50,000 rows per property, per day, per dimension combination. When this limit is exceeded, Google returns the top rows by clicks and silently drops the rest.

**Impact by table:**

- **`by_date`, `by_country`, `by_device`**: Small row counts, rarely affected
- **`by_query`, `by_page`**: Most sites are unaffected; very high-traffic sites may lose long-tail data
- **`by_query_page`**: Most likely to hit the limit due to the cartesian product of queries × pages

Additionally, Google anonymizes search queries with fewer than ~100 unique users over a 2-3 month period. These queries don't appear in the API at all.

If you need full-fidelity data for a high-traffic property, consider using Google's [BigQuery bulk export](https://support.google.com/webmasters/answer/12899614) and connecting that BigQuery dataset to PostHog instead.

## Configuring PostHog

Connect PostHog to your Google Search Console property:

1. In PostHog, go to the **[Data pipelines](https://app.posthog.com/data-management/sources)** tab.
2. Open the **+ New** drop-down menu in the top-right and select **Source**.
3. Find Google Search Console in the sources list and click **Link**.
4. Sign in with a Google account that has access to your Search Console property.
5. Enter your **Property URL** exactly as it appears in Google Search Console:
   - For URL-prefix properties: `https://example.com/` (include the trailing slash)
   - For domain properties: `sc-domain:example.com`
6. Select which tables to sync and configure sync settings.
7. (Optional) Add a prefix for the table names.

## Configuration

<SourceParameters />

## Troubleshooting

### "Site is not visible to the connected Google account"

This error means the property URL you entered doesn't match any property the connected Google account can access. Double-check:

- The property URL matches exactly what's shown in Google Search Console
- URL-prefix properties need the trailing slash (e.g., `https://example.com/`, not `https://example.com`)
- Domain properties use the `sc-domain:` prefix (e.g., `sc-domain:example.com`)

### "The connected Google account does not have verified access"

The Google account can see the property but doesn't have verified ownership. Ask a property owner to grant you access in Google Search Console under **Settings > Users and permissions**.

### Missing data for recent dates

Google Search Console data has a 2-3 day processing delay. Data for the last few days won't be available until Google finishes processing it.
