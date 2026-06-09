---
title: Linking Salesforce as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Salesforce
---

The Salesforce connector syncs your Salesforce data to PostHog.

## Standard objects

The following standard objects are supported:

| Object | Description |
|---|---|
| Account | Companies and organizations |
| Campaign | Marketing campaigns |
| Contact | Individual contacts |
| Event | Calendar events |
| Lead | Sales leads |
| Opportunity | Sales opportunities |
| OpportunityHistory | Historical changes to opportunities |
| Order | Orders |
| Pricebook2 | Price books |
| PricebookEntry | Price book entries |
| Product2 | Products |
| Task | Tasks and to-dos |
| User | Salesforce users |
| UserRole | User roles |

## Custom objects

You can also sync custom Salesforce objects. Custom objects have names ending in `__c` (for example, `Employee__c` or `Invoice__c`). When you connect Salesforce, any queryable custom objects in your organization automatically appear in the schema list alongside standard objects.

Custom objects support incremental syncing using the `SystemModstamp` field, so only records modified since the last sync are updated.

To link Salesforce:

1. Go to the [Data pipeline page](https://app.posthog.com/data-management/sources) and the sources tab in PostHog
2. Click **Link Source** and select Salesforce
3. Log in to your Salesforce account and authorize PostHog to access your data
4. Select the standard or custom objects you want to sync
5. *Optional:* Add a prefix to your table names
6. Click **Next**

The data warehouse then starts syncing your Salesforce data. You can see details and progress in the [data pipeline sources tab](https://app.posthog.com/data-management/sources).

## Configuration

<SourceParameters />