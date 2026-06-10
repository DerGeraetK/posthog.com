---
title: Linking Mailgun as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Mailgun
---

The Mailgun connector syncs your email delivery data into PostHog, including domains, events (deliveries, opens, clicks, bounces), suppressions (bounces, complaints, unsubscribes), mailing lists, tags, and templates.

To link Mailgun:

1. Go to the [Data pipeline page](https://app.posthog.com/data-management/sources) and select the **Sources** tab.
2. Click **New source** and select Mailgun.
3. Enter your Mailgun private API key. You can find this in the [Mailgun dashboard](https://app.mailgun.com/settings/api_security) under **Settings** > **API security**.
4. Select your region:
   - **US** (`api.mailgun.net`) – for accounts hosted in the United States
   - **EU** (`api.eu.mailgun.net`) – for accounts hosted in Europe
5. *Optional:* Add a prefix to your table names.
6. Click **Next** and select the tables you want to sync.

The data warehouse then starts syncing your Mailgun data. You can see details and progress in the [data pipeline sources tab](https://app.posthog.com/data-management/sources).

## Configuration

<SourceParameters />

## Available tables

| Table | Description |
| --- | --- |
| `domains` | Sending domains configured in your Mailgun account |
| `events` | Email events including deliveries, opens, clicks, and bounces |
| `bounces` | Addresses that have bounced (per domain) |
| `complaints` | Addresses that have complained/marked as spam (per domain) |
| `unsubscribes` | Addresses that have unsubscribed (per domain) |
| `mailing_lists` | Mailing lists in your account |
| `tags` | Message tags (per domain) |
| `templates` | Email templates (per domain) |

## Sync methods

Most Mailgun tables use full refresh syncing because the Mailgun API doesn't expose update timestamps.

The `events` table supports incremental syncing using the `timestamp` field. Mailgun events are eventually consistent with about 30 minutes of lag, so incremental syncs keep the watermark behind the consistency window.

## Event data retention

Mailgun retains event data for a limited time based on your plan:

- **Free plans** – 1 day
- **Paid plans** – up to 30 days

The initial sync of the `events` table is bounded by your plan's retention period. Historical events beyond this window aren't available from Mailgun's API.

## Per-domain data

Most Mailgun data is scoped per sending domain. The connector automatically discovers all domains in your account and syncs data for each one. A `domain` column is added to domain-scoped tables so you can filter and analyze data by sending domain.
