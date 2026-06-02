---
title: Linking Notion as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Notion
---

The Notion connector can link pages, databases, users, blocks, and comments to PostHog.

To link Notion:

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.

2. Click **+ New source** and then click **Link** next to Notion.

3. Create a Notion internal integration and get its token:
   1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations) and click **+ New integration**.
   2. Give your integration a name (like "PostHog") and select the workspace.
   3. Under **Capabilities**, enable **Read content** (required for syncing pages, blocks, and comments) and **Read user information without email addresses** (required for syncing users). Leave other capabilities disabled.
   4. Click **Save changes**, then copy the **Internal Integration Secret** (starts with `ntn_` or `secret_`).

4. Share the pages and databases you want to sync with your integration. For each one:
   1. Open the page or database in Notion.
   2. Click the `•••` menu in the top-right corner.
   3. Click **Connections**, then select your integration.

5. Back in PostHog, paste the token in the **API key** field and click **Next**.

6. Select the schemas you want to sync. All Notion tables use full refresh sync. Once done, click **Import**.

Once the syncs are complete, you can start using Notion data in PostHog.

## Synced tables

The Notion connector syncs the following tables:

| Table | Description |
|-------|-------------|
| `pages` | All pages shared with your integration, including their properties and metadata |
| `databases` | All databases shared with your integration |
| `users` | Users in your Notion workspace |
| `blocks` | Content blocks within pages (text, headings, lists, toggles, etc.) |
| `comments` | Comments on pages |

All tables use full refresh sync because Notion's API doesn't support filtering by last-modified time server-side.

### Blocks and comments

The `blocks` and `comments` tables include a `_page_id` field that links each record to its parent page. Use this to join block content or comments with their pages.

Blocks are fetched recursively up to a limited depth. For large workspaces with deeply nested content, some nested blocks may not sync to avoid excessive API calls under Notion's rate limits (~3 requests per second).

## Configuration

<SourceParameters />
