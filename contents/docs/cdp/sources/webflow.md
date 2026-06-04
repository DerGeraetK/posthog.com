---
title: Linking Webflow as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Webflow
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Webflow connector syncs your site data into PostHog, including pages, CMS collections, products, orders, users, and forms.

To link Webflow:

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.

2. Click **+ New source** and then click **Link** next to Webflow.

3. You need a Site API token and Site ID from Webflow:
   - In Webflow, go to **Site settings** > **Apps & integrations** > **API access**.
   - Click **Generate API token** to create a Site API token.
   - Copy the **Site ID** from the same page (or from your site's URL in the Designer).

4. Grant read scopes for the resources you want to sync:
   - `sites:read` for site metadata
   - `cms:read` for CMS collections and collection items
   - `ecommerce:read` for products and orders
   - `pages:read` for pages
   - `users:read` for site members
   - `forms:read` for form submissions

5. Back in PostHog, paste the API token and Site ID, then click **Next**.

6. Select the tables you want to sync and set the sync frequency. Click **Import**.

## Synced data

| Table | Description | Sync method |
|-------|-------------|-------------|
| `sites` | Site metadata including name, timezone, and creation date | Full refresh |
| `collections` | CMS collection definitions | Full refresh |
| `collection_<slug>` | Items for each CMS collection (one table per collection) | Full refresh |
| `pages` | Static pages and their metadata | Full refresh |
| `products` | E-commerce products | Full refresh |
| `orders` | E-commerce orders | Full refresh |
| `users` | Site members | Full refresh |
| `forms` | Form definitions | Full refresh |

### Dynamic CMS collections

Each CMS collection in your Webflow site syncs to its own table named `collection_<slug>`. For example, a "Blog Posts" collection with slug `blog-posts` becomes `collection_blog-posts`. PostHog discovers these collections automatically when you set up the source.

## Sync method

Webflow sources use full refresh syncs. Incremental syncs aren't supported because Webflow's API doesn't provide a reliable way to query only updated records.

## Configuration

<SourceParameters />
