---
title: Linking Ashby as a source
sidebar: Docs
showTitle: true
availability:
  free: full
  selfServe: full
  enterprise: full
sourceId: Ashby
---

<CalloutBox icon="IconInfo" title="Alpha release" type="fyi">

This source is currently in **alpha**. The interface and available tables may change.

</CalloutBox>

Enter your Ashby API key to pull your Ashby ATS data into the PostHog data warehouse.

## Adding a data source

1. Go to the [sources tab](https://app.posthog.com/data-management/sources) of the data pipeline section in PostHog.
2. Click **+ New source** and then click **Link** next to Ashby.
3. In Ashby, create an API key under **Admin > API Keys**. Grant read permissions for the data you want to sync — for example `candidatesRead`, `applicationsRead`, `jobsRead`, `offersRead`, `interviewsRead`, `usersRead`.
4. Back in PostHog, paste the key into the `API key` field and click **Next**.
5. Select the tables you want to sync, set the sync method and frequency, then click **Import**.

Once the syncs are complete, you can start using Ashby data in PostHog.

## Available tables

| Table | Description | Sync method |
| ----- | ----------- | ----------- |
| `candidates` | Candidates in your Ashby account | Full refresh |
| `applications` | Candidate applications | Full refresh |
| `jobs` | Jobs | Full refresh |
| `job_postings` | Job postings | Full refresh |
| `offers` | Offers | Full refresh |
| `interviews` | Interviews | Full refresh |
| `interview_schedules` | Interview schedules | Full refresh |
| `users` | Ashby users | Full refresh |
| `departments` | Departments | Full refresh |
| `locations` | Locations | Full refresh |
| `sources` | Candidate sources | Full refresh |
| `archive_reasons` | Archive reasons | Full refresh |
| `candidate_tags` | Candidate tags | Full refresh |
| `custom_fields` | Custom fields | Full refresh |
| `openings` | Job openings | Full refresh |
| `projects` | Projects | Full refresh |

**Full refresh** tables reload all data on each sync.

## Configuration

<SourceParameters />
