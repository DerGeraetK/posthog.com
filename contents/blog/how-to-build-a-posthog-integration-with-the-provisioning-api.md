---
date: "2026-06-26"
title: "How I set up PostHog for my users without even making them sign up"
featuredImage: https://res.cloudinary.com/dmukukwp6/image/upload/posthog.com/contents/images/blog/posthog-engineering-blog.png
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
  - AI
seo:
  metaTitle: "How to set up embedded analytics with the PostHog provisioning API"
  metaDescription: "I built a fake farm-website company on PostHog's provisioning API. Here's how it creates accounts for its users and reads their analytics back, with the gotchas I hit."
---

I live on a little farm and recently built a [website](https://creeksidefields.com/) to sell shares of hogs. Other farmers saw it and wanted one too – but they're better versed in the subtle arts of soil, plants, and animals than the [latest coding tool](https://posthog.com/code). So I threw together a website builder called HogFarm that they could run themselves.

HogFarm asks a farmer for the basics like their farm name, what they grow, what they're selling, and spins up a simple storefront site for them. But a site that just sits there doesn't move product. Farmers need to know if anyone's visiting, what they're looking at, and why they leave without buying.

Those are the exact reasons why people use PostHog tools like product analytics, session replay, and error tracking, but farmers want to _farm_, not sign up for accounts and copy-paste API keys.

That's what PostHog's provisioning API lets me do. I can set up a PostHog project for each farm website behind the scenes without them even needing to do anything. From there, I can configure it to automatically read analytics back into a user-friendly dashboard that they never have to leave. No signup, no setup, no idea PostHog is even there.

If you've built software before, you might know this pattern as embedded analytics, multi-tenant analytics, or white-labeling. They all mean pretty much the same thing: your users get their own instance with their own data, and you provision it for them behind the scenes.

The code for HogFarm is [on GitHub](https://github.com/Brooker-Fam/hogfarm), and there's a [live version](https://hogfarm-guava-tri.vercel.app) you can click around and explore. Here's an in-depth guide on how I built it with PostHog's [provisioning API](/docs/integrate/provisioning).

![The HogFarm builder: a farmer enters their farm name and what they grow](https://res.cloudinary.com/dmukukwp6/image/upload/w_1600,c_limit,q_auto,f_auto/builder_landing_8dd50079e6.png)

## Registering your builder app

The first step is to register HogFarm as an OAuth client. Instead of registering through a UI, I host a small JSON file describing the app, and PostHog reads it to register HogFarm automatically. This is called a [Client ID Metadata Document](/docs/api/oauth#client-id-metadata-document-cimd), or CIMD.

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
    "scopes": ["endpoint:read", "endpoint:write", "insight:read", "project:read", "person:read", "session_recording:read", "sharing_configuration:write", "project:write"]
  }
}
```

The `client_id` has to be the exact URL the file is served from, or it won't register, and it needs to be publicly reachable.

> **⚠️ Your CIMD URL has to be publicly reachable**
>
> PostHog registers your app by fetching that JSON file itself – an anonymous, server-to-server request with no login, no cookies, no session. So anything that gates the URL will block it. I deployed behind Vercel's default deployment protection, and the very first call just failed: PostHog hit the SSO gate instead of the file and had nothing to register.
>
> The catch is that it works fine in your own browser, because *you're* logged in – so the file looks reachable when it isn't. To test it the way PostHog sees it, open the `.well-known` URL in an incognito window. If it doesn't load there, registration will never finish.

The `com.posthog.scopes` list is a ceiling: tokens can never go above it, whatever an individual request asks for. These scopes are everything the dashboard needs later: reading the analytics back and embedding a session recording. More on both below.

Because HogFarm holds no secret (`token_endpoint_auth_method` is `"none"`), I use PKCE to prove the token exchange. I generate a random verifier and send only its SHA-256 hash with the first call. The verifier gets replayed at token exchange.

```ts
const verifier = base64url(randomBytes(32))
const challenge = base64url(sha256(verifier))
```

## Creating an account the farmer never sees

With HogFarm registered, the first provisioning step is to create a PostHog account for the farmer. This is the call that makes "no signup" for farmers possible: instead of sending the farmer to a signup page, HogFarm requests an account for them and PostHog creates it in the background.

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
    scopes: ["endpoint:read", "endpoint:write", "insight:read", "project:read", "person:read", "session_recording:read", "sharing_configuration:write", "project:write"],
    configuration: { region: "US", organization_name: farmName },
  }),
})
```

There are a few cases to handle for this response:

- **A new email** comes back as `{ type: "oauth", oauth: { code } }`. The account gets created and linked quietly, I get a code on the spot, and the farmer gets a welcome email to set their password.
- **An email that's already a PostHog user** comes back as `{ type: "requires_auth", requires_auth: { url } }`. They have to consent in the browser first, so I send them to `url` and PostHog redirects back to my `redirect_uri` with a code.
- **The very first call from a new CIMD client** comes back as a `202` with `{ type: "registering" }`. PostHog fetches the metadata document in the background, so I wait the `retry_after` seconds and call again. This happens once per deployment, and it caught me off guard the first time.

## Getting the farmer's project key

The farmer's account exists now, but it's empty at the moment. So, next is to create a project and its API key. That takes two calls: one to trade the code for an access token (replaying the PKCE verifier to prove it's me), then another to use that token to provision the project. The response hands back the `phc_` key that goes into the farm site, which is what actually starts the data flowing.

Here's how I swap the code for tokens:

```ts
await fetch(`${HOST}/api/agentic/oauth/token`, {
  method: "POST",
  headers: { "API-Version": "0.1d", "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "authorization_code", code, code_verifier: verifier }),
})
```

And the next call provisions a project:

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

The response carries `complete.access_configuration.api_key` (the `phc_` token) and `host`, plus a top-level `id`: the team id for the project it just created, which I hold onto for every read below (it shows up as `teamId`). That key goes into the farm site HogFarm generates, so visits start landing in PostHog right away. `service_id: "free"` gives a free-tier project with no card required, which is all HogFarm needs.

![The generated farm site, with the PostHog snippet already wired in](https://res.cloudinary.com/dmukukwp6/image/upload/w_1600,c_limit,q_auto,f_auto/generated_farm_site_af6902b4a8.png)

## Reading the data back to the farmer

Now for the fun part: giving farmers access to useful info about their users. The dashboard reads through [Endpoints](/docs/endpoints): named saved queries you publish once and call by name, versioned and rate-limited as a first-class API. That's the right tool when the same query runs over and over, which is exactly what a dashboard does. At provision time I publish each read once with `endpoint:write`:

```ts
await fetch(`${HOST}/api/projects/${teamId}/endpoints/`, {
  method: "POST",
  headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "dashboard_trend",
    query: {
      kind: "HogQLQuery",
      query: `SELECT toDate(timestamp) AS d, count() AS c FROM events
              WHERE event = '$pageview' AND timestamp > now() - INTERVAL 7 DAY
              GROUP BY d ORDER BY d`,
    },
  }),
})
```

That publishes the seven-day trend; two more cover unique visitors and top pages. Endpoints live in the project, so I create all three in each farm's project right after I provision it. From then on the dashboard just calls them by name with `endpoint:read`:

```ts
const res = await fetch(
  `${HOST}/api/projects/${teamId}/endpoints/dashboard_trend/run`,
  {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: "force" }),
  },
)
const { results } = await res.json()
```

I didn't have the `refresh` in there at first, and the dashboard froze on an empty read for the first minute after provisioning. An Endpoint caches its result by default, so my very first call, fired before any events had landed, cached an empty answer and kept handing it back, at the moment the dashboard needs to look alive. Adding `refresh: "force"` fixed it: it recomputes on every call, so the dashboard always reflects what's actually in the project. That default caching is the whole point of an Endpoint when a query runs constantly, but for a fresh project viewed a handful of times right after setup it was working against me. A busier dashboard would drop the `force` and let the cache do its job.

> **⚠️ Don't use `historical_migration` to seed backdated events**
>
> I seed a week of demo pageviews so a new farm's dashboard isn't empty on day one, and my first instinct was the `historical_migration` flag, since the timestamps are in the past. Don't. That flag routes the batch to a throttled ingestion pipeline that can take many minutes to become queryable, so the dashboard sat empty right after provisioning – the opposite of what I wanted.
>
> The regular capture pipeline takes backdated timestamps fine. It stores the event timestamp, not the arrival time, so a week-old seed shows up in seconds. Skip the flag.

Access tokens last an hour, so for anything long-lived you're storing the refresh token. Encrypt it. I keep them in Postgres with AES-256-GCM and a key that only lives in the environment, never in the database.

## Kicking off session replays

Even though the farm site already loads the PostHog snippet with session recording turned on, I have to turn on a second switch on the project itself since new projects have it off by default. So, at provision time, I turn it on from the server with `project:write`:

```ts
await fetch(`${HOST}/api/projects/${teamId}/`, {
  method: "PATCH",
  headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
  body: JSON.stringify({ session_recording_opt_in: true }),
})
```

Now every visit records. On the dashboard I play the most recent one inline. The provisioning token also has `sharing_configuration:write`, so I flip on public sharing for the latest recording and get an embed token back:

```ts
const res = await fetch(
  `${HOST}/api/projects/${teamId}/session_recordings/${recordingId}/sharing/`,
  {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ enabled: true }),
  },
)
const { access_token } = await res.json()
// /embedded is the one PostHog page built to be iframed
const embedUrl = `https://us.posthog.com/embedded/${access_token}`
```

I drop that URL in an iframe and the farmer watches real visitors move through their site. The recording lives in their own project; HogFarm just borrows a public view of the latest one. (A shared recording is viewable by anyone with the link, which is fine for a demo, but a real builder would gate or expire it.)

![The farmer's dashboard: pageview KPIs, a seven-day trend, an inline session replay, and top pages, all read live from their own PostHog project](https://res.cloudinary.com/dmukukwp6/image/upload/w_1600,c_limit,q_auto,f_auto/analytics_dashboard_61b7b99cc4.png)

## Give the gift of PostHog to your users

Check out the HogFarm repo and the provisioning docs to give your users access to data about their users.

- Code: [github.com/Brooker-Fam/hogfarm](https://github.com/Brooker-Fam/hogfarm)
- Docs: [Provisioning API](/docs/integrate/provisioning) and [OAuth + CIMD](/docs/api/oauth)
