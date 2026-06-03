---
title: Linking Granola as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Granola
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

The Granola connector syncs your AI meeting notes into PostHog's data warehouse, letting you analyze meeting data alongside your product analytics.

## Requirements

API access requires a **Granola Business plan** or higher. You need to create an API key in the Granola desktop app.

## Available tables

| Table   | Description                                                         | Sync method |
| ------- | ------------------------------------------------------------------- | ----------- |
| `notes` | Meeting notes with AI summaries (only notes with generated content) | Incremental |
| `folders` | Folder organization for your notes                                | Full refresh |

The `notes` table supports incremental sync using `updated_at` or `created_at`. Choose `updated_at` to capture edits to existing notes, or `created_at` for append-only syncs.

## Linking Granola

1. Go to the [Data pipeline page](https://app.posthog.com/data-management/sources) and select the **Sources** tab.
2. Click **+ New source** and select Granola.
3. Open the Granola desktop app and go to **Settings** > **Connectors** > **API keys**.
4. Click **Create API key** to generate a new key (prefixed `grn_`).
5. When creating the key, grant access scopes for the data you want to sync:
   - **Personal notes** – your own meeting notes
   - **Public notes** – shared notes visible to your team
6. Copy the API key and paste it into PostHog.
7. Click **Next**, select the tables to sync, and click **Import**.

Only notes with a generated AI summary and transcript are returned by the Granola API.

## Configuration

<SourceParameters />
