---
date: "2026-06-24"
title: "How to build a PostHog integration with the provisioning API"
featuredImage: https://res.cloudinary.com/dmukukwp6/image/upload/Template_cover_14_0da4d45933.jpg
featuredImageType: full
author:
  - matt-brooker
rootPage: /blog
sidebar: Blog
showTitle: true
hideAnchor: true
category: Engineering
tags:
  - Engineering
  - Integrations
seo:
  metaTitle: "How to build a PostHog integration with the provisioning API"
  metaDescription: "I built a fake farm-website company on PostHog's provisioning API. Here's how it creates accounts for its users and reads their analytics back, with the gotchas I hit."
---

I recently built a [website](https://creeksidefields.com/) to sell shares of hogs. I realized it's too difficult for my fellow farmers, who are better versed in the subtle arts of managing soil, plants, and animals than the [latest coding tool](https://posthog.com/code), to build similar sites with current tech. So, I threw together a website builder for farmers.

One of the most important aspects of distributing product from a farm is knowing who you're selling to. So, naturally, wiring up PostHog for product analytics, session replay, and error reporting was a no brainer. However, farmers are trying to farm not sign up for accounts and copy paste API keys into their farm builder apps. So, my farm website builder needed to provision PostHog accounts behind the scenes and surface insights directly to farmers. 

The code is [on GitHub](https://github.com/Brooker-Fam/hogfarm) and there's a [live version](https://hogfarm-guava-tri.vercel.app) you can click around. Here's how it works, from the [provisioning API](/docs/integrate/provisioning) call that creates the account to the query that reads it back.

## Registering your OAuth client via CIMD

To register my OAuth client, I added a small JSON file. The first time I called the API, PostHog fetched the file and registered my OAuth app. It's called a [Client ID Metadata Document](/docs/api/oauth#client-id-metadata-document-cimd), or CIMD.

It looks like this:

```json
{
  "client_id": "https://hogfarm-guava-tri.vercel.app/.well-known/posthog-client.json",
  "client_name": "HogFarm",
  "redirect_uris": ["https://hogfarm-guava-tri.vercel.app/api/oauth/callback"],
  "token_endpoint_auth_method": "none",
  "grant_types": ["authorization_code"],
  "response_types": ["code"],
  "com.posthog": {
    "scopes": ["query:read", "insight:read", "project:read", "person:read"]
  }
}
```

The `client_id` has to be the exact URL the file is served from, or it won't register. The `com.posthog.scopes` list is a ceiling: tokens can never go above it, whatever an individual request asks for. I ask for `query:read` because I need to run queries later to build the dashboard. More on that below.

Because HogFarm holds no secret (`token_endpoint_auth_method` is `"none"`), I use PKCE to prove the token exchange. I generate a random verifier and send only its SHA-256 hash with the first call. The verifier gets replayed at token exchange.

```ts
const verifier = base64url(randomBytes(32))
const challenge = base64url(sha256(verifier))
```

## Creating the account

```ts
await fetch(`${HOST}/api/agentic/provisioning/account_requests`, {
  method: "POST",
  headers: { "API-Version": "0.1d", "Content-Type": "application/json" },
  body: JSON.stringify({
    id: crypto.randomUUID(),
    email,
    name,
    client_id: clientId,
    code_challenge: challenge,
    code_challenge_method: "S256",
    scopes: ["query:read", "insight:read", "project:read", "person:read"],
    configuration: { region: "US", organization_name: farmName },
  }),
})
```

What comes back depends on the email, and I had to handle each case:

- **A new email** comes back as `{ type: "oauth", code }`. The account gets created and linked quietly, I get a code on the spot, and the farmer gets a welcome email to set their password.
- **An email that's already a PostHog user** comes back as `{ type: "requires_auth", url }`. They have to consent in the browser first, so I send them to `url` and PostHog redirects back to my `redirect_uri` with a code.
- **The very first call from a new CIMD client** comes back as a `202` with `{ type: "registering" }`. PostHog fetches the metadata document in the background, so I wait the `retry_after` seconds and call again. This happens once per deployment, and it caught me off guard the first time (see below).

## Getting the project key

With a code in hand, I swap it for tokens:

```ts
await fetch(`${HOST}/api/agentic/oauth/token`, {
  method: "POST",
  headers: { "API-Version": "0.1d", "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "authorization_code", code, code_verifier: verifier }),
})
```

The next call provisions a project:

```ts
await fetch(`${HOST}/api/agentic/provisioning/resources`, {
  method: "POST",
  headers: {
    "API-Version": "0.1d",
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    service_id: "free",
    label_prefix: farmName,
    configuration: { project_name: `${farmName} site` },
  }),
})
```

The response carries `complete.access_configuration.api_key` (the `phc_` token) and `host`. That key goes into the farm site HogFarm generates, so visits start landing in PostHog right away. `service_id: "free"` gives a free-tier project with no card required, which is all HogFarm needs.

## Reading the data back

Now for the fun part, giving critical business insights directly to the farmers. The OAuth access token can query the farmer's project directly. So the dashboard is just a few HogQL queries:

```ts
await fetch(`${HOST}/api/projects/${teamId}/query/`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
  body: JSON.stringify({
    query: {
      kind: "HogQLQuery",
      query: `SELECT toDate(timestamp), count() FROM events
              WHERE event = '$pageview' AND timestamp > now() - INTERVAL 7 DAY
              GROUP BY 1 ORDER BY 1`,
    },
  }),
})
```

That one builds the seven-day trend chart. A couple more get unique visitors and top pages. The access token gets cached and refreshed with the rotating refresh token when it expires, so the reads keep going without bothering the farmer.

Access tokens last an hour, so for anything long-lived you're storing the refresh token. Encrypt it. I keep them in Postgres with AES-256-GCM and a key that only lives in the environment, never in the database.

A brand-new farm has no traffic, so on day one the dashboard would be empty. To make the demo show something, I seed a week of pageviews into the project when it's created, using the capture API with `historical_migration: true` (that's what lets you backdate timestamps). Real visits stack on top of those.

## The stuff that bit me

These are the things that weren't obvious until I hit them:

- **Your CIMD URL has to be reachable.** I deployed behind Vercel's default deployment protection and the first call just failed. PostHog couldn't fetch the metadata document through the SSO gate. If registration never finishes, open the `.well-known` URL in an incognito window and make sure it loads.
- **Backdated events get dropped unless you ask for them.** My seeded pageviews silently vanished until I set `historical_migration: true`. Current-timestamp events were fine; the old ones needed the flag.

## Try it

Checkout the HogFarm repo and the provisioning docs to give your users insights about their users. It's user data all the way down.

- Code: [github.com/Brooker-Fam/hogfarm](https://github.com/Brooker-Fam/hogfarm)
- Docs: [Provisioning API](/docs/integrate/provisioning) and [OAuth + CIMD](/docs/api/oauth)
