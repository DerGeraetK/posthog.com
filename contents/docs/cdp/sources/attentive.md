---
title: Linking Attentive as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Attentive
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

Connect your Attentive account using a private app API key. Attentive's API doesn't have bulk read endpoints, so all tables are populated from webhook events as they happen. Historical data before the connection date isn't backfilled.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Attentive.
3. Create a **private app** in Attentive under **Marketplace > Create app** to get an API key. Make sure the app has the Webhooks permission enabled.
4. Back in PostHog, paste the API key in the **API key** field and click **Next**.
5. PostHog automatically registers a webhook in your Attentive account but disables it initially. Go to the webhook settings in Attentive and copy the **signing key** (Attentive doesn't return this in the API response). Paste the signing key in PostHog.
6. Once you provide the signing key, PostHog enables the webhook and starts receiving events.
7. Select the tables you want to sync, then click **Import**.

## Available tables

All tables are populated through webhooks only — there's no API sync. Tables start populating from the connection date; historical data isn't backfilled.

| Table | Description |
| ----- | ----------- |
| `sms_subscribed` | SMS opt-in events |
| `sms_sent` | SMS messages sent to subscribers |
| `sms_message_link_click` | Link clicks in SMS messages |
| `email_subscribed` | Email opt-in events |
| `email_unsubscribed` | Email opt-out events |
| `email_opened` | Email open events |
| `email_message_link_click` | Link clicks in email messages |
| `custom_attribute_set` | Custom attribute updates on subscribers |

Each row includes an `event_id` (a hash of the full payload for deduplication) and a `created_at` timestamp derived from Attentive's millisecond timestamp.

## Configuration

<SourceParameters />
