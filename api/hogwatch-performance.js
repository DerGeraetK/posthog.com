/**
 * HogWatch 3000 — Performance dashboard backend.
 *
 * Joins three sources and returns one row per sponsored YouTube video:
 * 1. Warehouse table `marketing_budgetgooglesheets_formatted_newsletters_influencers` (the marketing budget Sheet)
 * 2. PostHog `events` for live signup attribution (UTM ∨ self-reported referral_source, deduped)
 * 3. YouTube Data API for live view counts (when ?refreshYouTube=1)
 *
 * Env: POSTHOG_APP_API_KEY (required), YOUTUBE_API_KEY_HW3000 (optional, only for live views)
 */

// Hand-seeded aliases for matching the self-reported `referral_source` property to influencers.
// Aliases must be ≥3 chars and are matched case-insensitively as substrings. Extend per
// influencer when their audience writes them differently than the utm slug (e.g. "t3.gg" for Theo).
const KNOWN_ALIASES = {
    theo: ['t3.gg', 't3 gg', 't3dotgg', 'theo browne'],
    fireship: ['jeff delaney'],
    raroque: ['chris raroque'],
    jsmastery: ['js mastery', 'javascript mastery'],
    codesource: ['deven', 'deven codesource'],
    benjamincode: ['benjamin code'],
    simongrimm: ['simon grimm', 'galaxies.dev'],
    viktor: ['viktor farcic', 'devops toolkit'],
    travismedia: ['travis media'],
    jesseshowalter: ['jesse showalter'],
    lenny: ["lenny's newsletter", 'lenny rachitsky'],
    navi: ['neetcode'],
    bytegrad: ['wesley', 'bytegrad'],
    coredumped: ['core dumped'],
    bigbox: ['big box'],
    codingjerk: ['coding jerk'],
    adambasis: ['adam basis'],
    buildwithai: ['build with ai'],
    enggirlfriend: ['liz the engineer', 'engineer girlfriend'],
    kikisbytes: ["kiki's bytes", 'kikis bytes'],
    marketertools: ['marketer tools'],
    mikebifulco: ['mike bifulco'],
    'www.opensourceceo.com': ['opensourceceo', 'open source ceo'],
    robshocks: ['rob shocks'],
    shadecode: ['shade of code'],
    starterstory: ['starter story'],
    worldofai: ['world of ai'],
    youraveragetechbro: ['your average tech bro', 'average tech bro'],
}

const POSTHOG_HOST = 'https://us.posthog.com'
const PROJECT_ID = 2
const SIGNUP_EVENT = 'user signed up'
const ATTRIBUTION_LOOKBACK_DAYS = 365
const YT_BASE = 'https://www.googleapis.com/youtube/v3'

function sqlEscape(s) {
    return String(s).replace(/'/g, "''")
}

function buildAliases(utm, name) {
    // Only the utm slug, the full lowercase name, and curated aliases.
    // Do NOT split the name into words — short tokens like "code", "ai", "chris" cause
    // massive false-positive matches against referral_source values like "Claude Code".
    // When a partial match matters (e.g. "raroque" inside "Chris Raroque"), add it to KNOWN_ALIASES.
    const seen = new Set()
    const out = []
    const push = (s) => {
        const v = String(s ?? '')
            .toLowerCase()
            .trim()
        if (v.length >= 4 && !seen.has(v)) {
            seen.add(v)
            out.push(v)
        }
    }
    if (utm) push(utm)
    if (name) push(name)
    for (const extra of KNOWN_ALIASES[utm] ?? []) push(extra)
    return out
}

function parseVideoId(publishLink) {
    if (!publishLink || typeof publishLink !== 'string') return null
    const m = publishLink.match(/[?&]v=([\w-]{11})/) || publishLink.match(/youtu\.be\/([\w-]{11})/)
    return m ? m[1] : null
}

// Per-utm medium overrides for influencers whose URLs aren't enough to tell. Extend as we
// add new mediums (e.g. when the podcast lands). Keys are utm slugs.
const MEDIUM_OVERRIDES = {
    lenny: 'newsletter',
    'www.opensourceceo.com': 'newsletter',
    marketertools: 'newsletter',
}

function detectMedium(publishLink, utm, videoId, name, sheetType) {
    // Strongest signal: the sheet's own `type` column ("Newsletter", "Podcast", "Influencer").
    if (sheetType) {
        const t = String(sheetType).toLowerCase()
        if (t.includes('newsletter')) return 'newsletter'
        if (t.includes('podcast')) return 'podcast'
        // "Influencer" falls through to URL/name detection (could be YouTube, Instagram, etc.).
    }
    if (MEDIUM_OVERRIDES[utm]) return MEDIUM_OVERRIDES[utm]
    if (name && /\bpodcast\b/i.test(name)) return 'podcast'
    if (name && /\bnewsletter\b/i.test(name)) return 'newsletter'
    if (videoId) return 'youtube'
    if (!publishLink) return 'unknown'
    const lower = publishLink.toLowerCase()
    if (/youtube\.com|youtu\.be/.test(lower)) return 'youtube'
    if (/lennysnewsletter|substack|opensourceceo|newsletter/.test(lower)) return 'newsletter'
    if (/spotify|apple\.com\/podcasts|anchor\.fm|podcast/.test(lower)) return 'podcast'
    if (/instagram\.com/.test(lower)) return 'instagram'
    if (/twitter\.com|x\.com\//.test(lower)) return 'twitter'
    return 'youtube' // default — most title-only entries are YouTube
}

// Some publish_link cells contain just the video title (no URL). For those, we resolve
// title → videoId via YouTube search.list (100 quota units per call). Results are persisted
// to a JSON file on disk so we don't re-burn quota across api-dev restarts or after the
// daily YouTube quota resets. Cache lives next to the repo at .cache/hogwatch-title-cache.json
// (gitignored via the existing .cache/ entry).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const TITLE_CACHE_FILE = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    '.cache',
    'hogwatch-title-cache.json'
)

function loadTitleCache() {
    try {
        const text = fs.readFileSync(TITLE_CACHE_FILE, 'utf-8')
        const obj = JSON.parse(text)
        return new Map(Object.entries(obj))
    } catch {
        return new Map()
    }
}

const titleSearchCache = loadTitleCache()
let titleCacheDirty = false

function persistTitleCache() {
    if (!titleCacheDirty) return
    try {
        fs.mkdirSync(path.dirname(TITLE_CACHE_FILE), { recursive: true })
        fs.writeFileSync(TITLE_CACHE_FILE, JSON.stringify(Object.fromEntries(titleSearchCache)))
        titleCacheDirty = false
    } catch {
        // Best-effort — failing to persist is not fatal.
    }
}

function isLikelyYouTubeTitle(publishLink) {
    if (!publishLink || typeof publishLink !== 'string') return false
    if (/^https?:\/\//i.test(publishLink)) return false
    if (/^youtube\.com\//i.test(publishLink) || /^youtu\.be\//i.test(publishLink)) return false
    // Non-YouTube hosts we definitely can't resolve
    if (/lennysnewsletter\.com|opensourceceo\.com|instagram\.com|substack\.com/i.test(publishLink)) return false
    return publishLink.trim().length >= 6
}

async function searchVideoIdByTitle(rawTitle, name, key) {
    const cached = titleSearchCache.get(rawTitle)
    if (cached !== undefined) return cached
    const cleanTitle = rawTitle.replace(/\s*-\s*YouTube\s*$/i, '').trim()
    const q = `${name} ${cleanTitle}`.slice(0, 100)
    const url = `${YT_BASE}/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(q)}&key=${key}`
    try {
        const res = await fetch(url)
        if (!res.ok) {
            // Quota errors (403) — do NOT cache as null. We want to retry once quota resets.
            // Other errors (404, 5xx) — same; transient.
            return null
        }
        const data = await res.json()
        const id = data.items?.[0]?.id?.videoId ?? null
        titleSearchCache.set(rawTitle, id)
        titleCacheDirty = true
        return id
    } catch {
        return null
    }
}

async function resolveMissingVideoIds(rows, key, maxNewSearches = 30) {
    if (!key) return rows
    // Find rows where we don't have an ID but the publish_link looks like a YT title.
    const needsSearch = rows.filter((r) => !r.videoId && isLikelyYouTubeTitle(r.publishLink))
    // Honor per-request search budget: 30 × 100 = 3000 units, well under 10K daily.
    let searchesUsed = 0
    const tasks = needsSearch.map((r) => {
        if (titleSearchCache.has(r.publishLink)) {
            return Promise.resolve({ row: r, id: titleSearchCache.get(r.publishLink) })
        }
        if (searchesUsed >= maxNewSearches) return Promise.resolve({ row: r, id: null })
        searchesUsed += 1
        return searchVideoIdByTitle(r.publishLink, r.name, key).then((id) => ({ row: r, id }))
    })
    const results = await Promise.all(tasks)
    for (const { row, id } of results) {
        if (id) row.videoId = id
    }
    persistTitleCache()
    return rows
}

async function phQuery(hogql) {
    const key = process.env.POSTHOG_APP_API_KEY
    if (!key) throw new Error('POSTHOG_APP_API_KEY is not set')
    const res = await fetch(`${POSTHOG_HOST}/api/projects/${PROJECT_ID}/query/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({ query: { kind: 'HogQLQuery', query: hogql } }),
    })
    if (!res.ok) {
        const text = await res.text()
        throw new Error(`PostHog query failed: ${res.status} ${text.slice(0, 500)}`)
    }
    const data = await res.json()
    return data.results ?? []
}

// Derive an influencer slug when the sheet's utm column is empty. Try tracking_link first
// (e.g. https://go.posthog.com/awesome → "awesome"), then fall back to a name-derived slug.
function deriveUtm(rawUtm, name, trackingLink) {
    const utm = (rawUtm ?? '').toLowerCase().trim()
    if (utm) return utm
    if (trackingLink) {
        const m = String(trackingLink).match(/(?:go\.posthog\.com|posthog\.com|soydev\.link)\/([\w-]+)/i)
        if (m) return m[1].toLowerCase()
    }
    if (name) {
        return String(name)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '')
            .slice(0, 32)
    }
    return ''
}

async function fetchWarehouseRows() {
    // Source: influencer_perf_ Google Sheets data warehouse source, single tab.
    // The cleaner replacement for the original marketing_budgetgooglesheets sync.
    // Cost is stored as a string like "$15,000" — strip non-digits before casting.
    // Tab doesn't carry the old views/signups columns; we fetch those live from YouTube +
    // PostHog respectively, so it doesn't matter.
    //
    // Filter relaxed: we no longer require utm or publish_link in the sheet, because newer
    // entries are added with only `name`, `cost`, `paid_date` initially. We derive the utm
    // slug from tracking_link or name (see deriveUtm in JS). We still require a non-#REF!
    // publish_link OR at least one date so we have something to render.
    const sql = `
        SELECT
            name,
            utm,
            toIntOrZero(replaceAll(replaceAll(coalesce(cost, '0'), '$', ''), ',', '')) AS cost,
            publish_link,
            publish_date,
            paid_date,
            tracking_link,
            type
        FROM influencer_perf_googlesheets_sponsorship_influencers_newslettersx
        WHERE (type ILIKE '%influencer%' OR type ILIKE '%newsletter%' OR type ILIKE '%podcast%')
          AND name IS NOT NULL
          AND name != ''
          AND (publish_link IS NULL OR publish_link NOT ILIKE '%#REF%')
          AND (
              (publish_date IS NOT NULL AND publish_date != '')
              OR (paid_date IS NOT NULL AND paid_date != '')
              OR (publish_link IS NOT NULL AND publish_link != '')
          )
        ORDER BY paid_date DESC
        LIMIT 1000
    `
    const rows = await phQuery(sql)
    return rows
        .map((r) => {
            const name = r[0] ?? ''
            const trackingLink = r[6] ?? ''
            const utm = deriveUtm(r[1], name, trackingLink)
            return {
                name,
                utm,
                cost: Number(r[2]) || 0,
                viewsSheet: 0,
                signupsSheet: 0,
                publishLink: r[3] ?? '',
                publishDate: r[4] ?? '',
                paidDate: r[5] ?? '',
                trackingLink,
                sheetType: r[7] ?? '',
            }
        })
        .filter((r) => r.utm) // drop only the rows where we couldn't derive any slug at all
}

async function fetchAttributionCounts(influencers) {
    if (influencers.length === 0) return { perUtm: new Map(), youtubeReferrer: 0 }
    const dateFrom = `now() - INTERVAL ${ATTRIBUTION_LOOKBACK_DAYS} DAY`

    // Single-scan attribution: one events scan, three uniqExact aggregations per influencer.
    // ~30 influencers × 3 = ~90 aggregations sharing one filter pass. Much faster than the
    // previous UNION ALL of 30 sub-queries (which scanned events 30 times).
    //
    // Match patterns:
    //   (a) Direct UTM:  $initial_utm_source = <slug>                              (legacy / hand-tagged)
    //   (b) Redirect:    $initial_utm_source = 'influencer' AND $initial_utm_campaign = <slug>  (post-Apr-3, vercel.json)
    //   (c) Self-report: referral_source contains any alias                         (fuzzy)
    const aggCols = []
    for (const { utm, aliases } of influencers) {
        const utmEsc = sqlEscape(utm)
        const aliasList = aliases.map((a) => `'${sqlEscape(a)}'`).join(', ')
        const utmExpr = `(person.properties.$initial_utm_source = '${utmEsc}' OR (person.properties.$initial_utm_source = 'influencer' AND person.properties.$initial_utm_campaign = '${utmEsc}'))`
        const selfExpr = aliases.length
            ? `arrayExists(a -> position(lower(coalesce(properties.referral_source, '')), a) > 0, [${aliasList}])`
            : 'false'
        aggCols.push(`uniqExactIf(distinct_id, ${utmExpr} OR ${selfExpr}) AS \`${utm}__total\``)
        aggCols.push(`uniqExactIf(distinct_id, ${utmExpr}) AS \`${utm}__utm\``)
        aggCols.push(`uniqExactIf(distinct_id, ${selfExpr}) AS \`${utm}__self\``)
    }
    aggCols.push(
        `uniqExactIf(distinct_id, properties.$referrer ILIKE '%youtube%' OR person.properties.$initial_referrer ILIKE '%youtube%') AS \`__youtube_referrer\``
    )

    const sql = `
        SELECT
            ${aggCols.join(',\n            ')}
        FROM events
        WHERE event = '${sqlEscape(SIGNUP_EVENT)}'
          AND timestamp >= ${dateFrom}
    `
    const rows = await phQuery(sql)
    const row = rows?.[0] ?? []
    // The query API returns column values in the order they appear in the SELECT. Reconstruct
    // by parallel iteration with the same column order we built.
    const perUtm = new Map()
    let col = 0
    for (const { utm } of influencers) {
        perUtm.set(utm, {
            total: Number(row[col++]) || 0,
            byUtm: Number(row[col++]) || 0,
            bySelf: Number(row[col++]) || 0,
        })
    }
    const youtubeReferrer = Number(row[col]) || 0

    return { perUtm, youtubeReferrer }
}

async function fetchDubClicks(influencerUtms) {
    const key = process.env.DUB_API_KEY
    if (!key) return { perUtm: new Map(), error: 'DUB_API_KEY not set' }
    try {
        const url = 'https://api.dub.co/analytics?event=clicks&groupBy=top_links&interval=1y'
        const res = await fetch(url, { headers: { Authorization: `Bearer ${key}` } })
        if (!res.ok) return { perUtm: new Map(), error: `Dub ${res.status}` }
        const data = await res.json()
        // Sum clicks per influencer slug. Only match Dub links on the go.posthog.com domain
        // whose `key` (the slug) matches an influencer utm we're tracking.
        const wanted = new Set(influencerUtms.map((u) => u.toLowerCase()))
        const perUtm = new Map()
        for (const item of data ?? []) {
            if (item.domain !== 'go.posthog.com') continue
            const slug = (item.key ?? '').toLowerCase()
            if (!wanted.has(slug)) continue
            perUtm.set(slug, (perUtm.get(slug) ?? 0) + (Number(item.clicks) || 0))
        }
        return { perUtm, error: null }
    } catch (err) {
        return { perUtm: new Map(), error: err instanceof Error ? err.message : 'Dub fetch failed' }
    }
}

async function fetchPageviewClicks(influencers) {
    // Single-scan over $pageview events, counts unique users who landed at posthog.com with
    // an influencer UTM tag — covers BOTH Dub-tracked clicks and vercel-redirect clicks since
    // both end up at posthog.com with the same utm_source/utm_campaign params.
    if (influencers.length === 0) return new Map()
    const dateFrom = `now() - INTERVAL ${ATTRIBUTION_LOOKBACK_DAYS} DAY`
    const aggCols = influencers.map(({ utm }) => {
        const utmEsc = sqlEscape(utm)
        const cond = `(properties.utm_source = '${utmEsc}' OR (properties.utm_source = 'influencer' AND properties.utm_campaign = '${utmEsc}'))`
        return `uniqExactIf(distinct_id, ${cond}) AS \`${utm}__clicks\``
    })
    const sql = `
        SELECT
            ${aggCols.join(',\n            ')}
        FROM events
        WHERE event = '$pageview'
          AND timestamp >= ${dateFrom}
    `
    const rows = await phQuery(sql)
    const row = rows?.[0] ?? []
    const perUtm = new Map()
    influencers.forEach(({ utm }, i) => {
        perUtm.set(utm, Number(row[i]) || 0)
    })
    return perUtm
}

// Persistent views cache so we survive api-dev restarts AND the YouTube daily quota window.
// videos.list is only 1 quota unit per call regardless of batch size, but we still cache because
// (a) it makes cold loads instant once warm, (b) it lets the dashboard show views even when the
// daily quota is exhausted by other API calls. Views change slowly — 24h TTL is plenty fresh.
const VIEWS_CACHE_FILE = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    '.cache',
    'hogwatch-views-cache.json'
)
const VIEWS_TTL_MS = 24 * 60 * 60 * 1000

function loadViewsCache() {
    try {
        const text = fs.readFileSync(VIEWS_CACHE_FILE, 'utf-8')
        return new Map(Object.entries(JSON.parse(text)))
    } catch {
        return new Map()
    }
}

const viewsCache = loadViewsCache()
let viewsCacheDirty = false

function persistViewsCache() {
    if (!viewsCacheDirty) return
    try {
        fs.mkdirSync(path.dirname(VIEWS_CACHE_FILE), { recursive: true })
        fs.writeFileSync(VIEWS_CACHE_FILE, JSON.stringify(Object.fromEntries(viewsCache)))
        viewsCacheDirty = false
    } catch {
        // Best-effort.
    }
}

async function fetchYouTubeViews(videoIds) {
    const key = process.env.YOUTUBE_API_KEY_HW3000
    if (videoIds.length === 0) return new Map()
    const out = new Map()
    const now = Date.now()

    // Pull from cache where fresh; build a list of IDs that actually need an API hit.
    const idsToFetch = []
    for (const id of videoIds) {
        const cached = viewsCache.get(id)
        if (cached && now - cached.fetchedAt < VIEWS_TTL_MS) {
            out.set(id, cached.views)
        } else {
            idsToFetch.push(id)
        }
    }

    if (!key) {
        // No key configured — return whatever cache had.
        return out
    }

    for (let i = 0; i < idsToFetch.length; i += 50) {
        const batch = idsToFetch.slice(i, i + 50)
        const url = `${YT_BASE}/videos?part=statistics&id=${batch.join(',')}&key=${key}`
        try {
            const res = await fetch(url)
            if (!res.ok) continue
            const data = await res.json()
            for (const item of data.items ?? []) {
                const v = parseInt(item.statistics?.viewCount, 10)
                if (!Number.isNaN(v)) {
                    out.set(item.id, v)
                    viewsCache.set(item.id, { views: v, fetchedAt: now })
                    viewsCacheDirty = true
                }
            }
        } catch {
            // Quota / network — fall through, what we have in `out` already serves stale entries.
        }
    }
    persistViewsCache()
    return out
}

// In-memory response cache. Two keys: with-YT and without-YT. TTL keeps re-loads instant
// without losing freshness. Bypass with ?refresh=1 when you actually want new data.
const CACHE_TTL_MS = 90 * 1000
const cache = new Map()
function cacheGet(key) {
    const hit = cache.get(key)
    if (!hit) return null
    if (Date.now() - hit.at > CACHE_TTL_MS) {
        cache.delete(key)
        return null
    }
    return hit.body
}
function cacheSet(key, body) {
    cache.set(key, { body, at: Date.now() })
}

const handler = async (req, res) => {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const refreshYouTube = req.query?.refreshYouTube === '1' || req.query?.refreshYouTube === 'true'
    const bypassCache = req.query?.refresh === '1' || req.query?.refresh === 'true'
    const cacheKey = `yt=${refreshYouTube ? 1 : 0}`

    if (!bypassCache) {
        const cached = cacheGet(cacheKey)
        if (cached) {
            res.setHeader('x-hogwatch-cache', 'hit')
            return res.status(200).json(cached)
        }
    }

    const errors = []

    try {
        // Step 1: warehouse rows (need this to know which influencers exist).
        const warehouseRows = await fetchWarehouseRows()

        const utmToInfluencer = new Map()
        for (const r of warehouseRows) {
            if (!utmToInfluencer.has(r.utm)) {
                utmToInfluencer.set(r.utm, { utm: r.utm, aliases: buildAliases(r.utm, r.name) })
            }
        }
        const influencers = [...utmToInfluencer.values()]

        const withVideoId = warehouseRows.map((r) => ({ ...r, videoId: parseVideoId(r.publishLink) }))

        // Step 2: resolve title-only entries to YouTube video IDs via search.list (cached).
        // Skip if refreshYouTube is off (we don't need video IDs for sheet-only views).
        if (refreshYouTube) {
            try {
                await resolveMissingVideoIds(withVideoId, process.env.YOUTUBE_API_KEY_HW3000)
            } catch (err) {
                errors.push(`YouTube title search failed: ${err instanceof Error ? err.message : 'unknown'}`)
            }
        }

        // Step 3: run all independent queries in parallel — attribution, pageview clicks,
        // Dub clicks, YouTube views. Big speed win vs sequential.
        const attributionPromise = fetchAttributionCounts(influencers).catch((err) => {
            errors.push(`Attribution query failed: ${err instanceof Error ? err.message : 'unknown'}`)
            return { perUtm: new Map(), youtubeReferrer: 0 }
        })
        const clicksPromise = fetchPageviewClicks(influencers).catch((err) => {
            errors.push(`Pageview clicks query failed: ${err instanceof Error ? err.message : 'unknown'}`)
            return new Map()
        })
        const dubPromise = fetchDubClicks(influencers.map((i) => i.utm)).then((r) => {
            if (r.error) errors.push(`Dub fetch: ${r.error}`)
            return r.perUtm
        })
        const youtubePromise = refreshYouTube
            ? fetchYouTubeViews(withVideoId.map((r) => r.videoId).filter(Boolean)).catch((err) => {
                  errors.push(`YouTube fetch failed: ${err instanceof Error ? err.message : 'unknown'}`)
                  return new Map()
              })
            : Promise.resolve(new Map())

        const [attribution, clicksMap, dubClicksMap, viewsMap] = await Promise.all([
            attributionPromise,
            clicksPromise,
            dubPromise,
            youtubePromise,
        ])

        const videos = withVideoId.map((r) => {
            const a = attribution.perUtm.get(r.utm) ?? { total: 0, byUtm: 0, bySelf: 0 }
            // Link only to actual video URLs — never to a YouTube channel or search results.
            // Priority: (1) the publish_link cell directly when it's a real URL, (2) a canonical
            // youtu.be link when we have a parsed/resolved video ID. If neither, leave null and
            // the UI renders the title as plain text.
            let watchUrl = null
            if (/^https?:\/\//i.test(r.publishLink)) {
                watchUrl = r.publishLink
            } else if (/^(?:youtube\.com|youtu\.be)\//i.test(r.publishLink)) {
                watchUrl = `https://${r.publishLink}`
            } else if (r.videoId) {
                watchUrl = `https://www.youtube.com/watch?v=${r.videoId}`
            }
            return {
                name: r.name,
                utm: r.utm,
                cost: r.cost,
                publishLink: r.publishLink,
                publishDate: r.publishDate,
                paidDate: r.paidDate,
                trackingLink: r.trackingLink,
                videoId: r.videoId,
                watchUrl,
                medium: detectMedium(r.publishLink, r.utm, r.videoId, r.name, r.sheetType),
                viewsSheet: r.viewsSheet,
                viewsLive: r.videoId ? viewsMap.get(r.videoId) ?? null : null,
                signupsSheet: r.signupsSheet,
                signupsTotal: a.total,
                signupsUtm: a.byUtm,
                signupsSelfReported: a.bySelf,
                clicksTotal: clicksMap.get(r.utm) ?? 0,
                clicksDub: dubClicksMap.get(r.utm.toLowerCase()) ?? 0,
            }
        })

        const earliestPublishDate = warehouseRows
            .map((r) => r.publishDate)
            .filter(Boolean)
            .sort()[0]

        const body = {
            videos,
            signupsYoutubeReferrer: attribution.youtubeReferrer,
            syncLastRunAt: null,
            syncFailedAt: null,
            signupEvent: SIGNUP_EVENT,
            earliestPublishDate: earliestPublishDate ?? null,
            fetchedAt: new Date().toISOString(),
            errors,
        }
        cacheSet(cacheKey, body)
        res.setHeader('x-hogwatch-cache', 'miss')
        return res.status(200).json(body)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Request failed'
        return res.status(500).json({ error: message })
    }
}

export default handler
