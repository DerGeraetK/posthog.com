---
title: Linking Crunchbase as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Crunchbase
---

import { CalloutBox } from "components/Docs/CalloutBox";

The Crunchbase connector syncs company and funding data from Crunchbase into PostHog, including organizations, people, funding rounds, acquisitions, investments, IPOs, and funds.

<CalloutBox icon="IconWarning" title="Enterprise or Applications license required" type="caution">

The Crunchbase connector requires a paid Crunchbase Enterprise or Applications license. Basic-plan API keys don't have access to the Search API that this connector uses, and are rejected during setup.

</CalloutBox>

To link Crunchbase:

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.

2. Click **+ New source** and then click **Link** next to Crunchbase.

3. Get your Crunchbase API user key. In your Crunchbase account, go to your API settings to find or generate a user key. This key must be from an Enterprise or Applications license – Basic-plan keys won't work.

4. Back in PostHog, paste the API key in the **User key** field.

5. Click **Next**, select the tables you want to sync, and configure the sync method and frequency for each. Then click **Import**.

Once the syncs complete, you can start using Crunchbase data in PostHog.

## Available tables

The Crunchbase connector can sync the following tables:

| Table | Description |
|-------|-------------|
| `organizations` | Companies, investors, schools, and other organizations in Crunchbase |
| `people` | People associated with organizations |
| `funding_rounds` | Investment rounds for organizations |
| `acquisitions` | Acquisition transactions |
| `investments` | Individual investments in funding rounds |
| `ipos` | Initial public offerings |
| `funds` | Investment funds |

Each table includes core fields like the entity identifier, creation date, and last update date. Organizations include additional fields like description, website, founding date, location, total funding, employee count, and operating status.

## Sync modes

All Crunchbase tables support incremental syncing using the `updated_at` field. Subsequent syncs only fetch records that changed since the last sync, reducing API usage and sync time.

When you enable incremental sync:

1. The first sync imports all records to establish a baseline.
2. Subsequent syncs only fetch records modified since the last sync.

If a sync is interrupted, it resumes from where it left off.

## Configuration

<SourceParameters />

## Limitations

- **Deletions not synced** – If a record is removed from Crunchbase's dataset, that deletion isn't reflected in PostHog. The record remains in your synced tables.
- **Fixed field set** – Each table syncs a predefined set of fields. You can't customize which fields are included.
