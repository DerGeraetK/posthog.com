import React, { useMemo, useState } from 'react'
import type { VideoPerformance } from 'lib/hogwatch/performanceTypes'

interface Props {
    videos: VideoPerformance[]
}

interface QuarterRow {
    key: string
    label: string
    sortValue: number
    isCurrent: boolean
    videoCount: number
    influencerCount: number
    spend: number
    views: number
    signupsProrated: number
    clicksProrated: number
    influencers: InfluencerInQuarter[]
}

interface InfluencerInQuarter {
    utm: string
    name: string
    videoCount: number
    spend: number
    views: number
    signupsProrated: number
    clicksProrated: number
    videos: VideoPerformance[]
}

const MONTHS: Record<string, number> = {
    jan: 0,
    january: 0,
    feb: 1,
    february: 1,
    mar: 2,
    march: 2,
    apr: 3,
    april: 3,
    may: 4,
    jun: 5,
    june: 5,
    jul: 6,
    july: 6,
    aug: 7,
    august: 7,
    sep: 8,
    sept: 8,
    september: 8,
    oct: 9,
    october: 9,
    nov: 10,
    november: 10,
    dec: 11,
    december: 11,
}

function parseDateLoose(raw: string | null | undefined): { year: number; month: number; day: number } | null {
    if (!raw) return null
    const s = String(raw).trim()
    if (!s) return null
    // DD-Mon-YYYY
    const dmy = s.match(/(\d{1,2})[-\s/](\w{3,9})[-\s/](\d{4})/)
    if (dmy) {
        const m = MONTHS[dmy[2].toLowerCase()]
        if (m !== undefined) return { year: Number(dmy[3]), month: m, day: Number(dmy[1]) }
    }
    // DD/MM/YYYY or MM/DD/YYYY — disambiguate by first part > 12 → DD/MM, else assume MM/DD.
    const numeric = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/)
    if (numeric) {
        const first = Number(numeric[1])
        const second = Number(numeric[2])
        const year = Number(numeric[3])
        const isDMY = first > 12
        const month = (isDMY ? second : first) - 1
        const day = isDMY ? first : second
        if (month >= 0 && month < 12) return { year, month, day }
    }
    return null
}

function quarterFromDate(d: { year: number; month: number; day: number }): {
    key: string
    label: string
    sortValue: number
} {
    const q = Math.floor(d.month / 3) + 1
    return { key: `${d.year}-Q${q}`, label: `Q${q} ${d.year}`, sortValue: d.year + q / 10 }
}

function fmtMoney(n: number): string {
    return `$${Math.round(n).toLocaleString()}`
}

export function QuarterlyTable({ videos }: Props) {
    const rows = useMemo(() => buildQuarterRows(videos), [videos])
    const today = new Date()
    const currentQuarter = `${today.getFullYear()}-Q${Math.floor(today.getMonth() / 3) + 1}`
    const [expanded, setExpanded] = useState<Set<string>>(() => new Set([currentQuarter]))

    if (rows.length === 0) return null

    function toggle(key: string) {
        setExpanded((prev) => {
            const next = new Set(prev)
            if (next.has(key)) next.delete(key)
            else next.add(key)
            return next
        })
    }

    return (
        <section className="border-t border-primary pt-4">
            <h3 className="text-base font-semibold tracking-posthog-tight text-primary mt-0 mb-2">By quarter</h3>
            <p className="text-xs text-muted mb-3">
                Grouped by publish date (paid date as fallback). Signups are prorated across each influencer's videos by
                spend share, so quarter-level numbers are estimates, not exact attribution. Click any quarter to see the
                influencer breakdown.
            </p>
            <div className="overflow-x-auto -mx-px">
                <table className="w-full min-w-max border-collapse border border-primary text-sm">
                    <thead>
                        <tr className="bg-accent">
                            <th className="border border-primary px-4 py-2 text-left font-semibold text-primary">
                                Quarter
                            </th>
                            <th className="border border-primary px-4 py-2 text-right font-semibold text-primary">
                                Videos
                            </th>
                            <th className="border border-primary px-4 py-2 text-right font-semibold text-primary">
                                Influencers
                            </th>
                            <th className="border border-primary px-4 py-2 text-right font-semibold text-primary">
                                Spend
                            </th>
                            <th className="border border-primary px-4 py-2 text-right font-semibold text-primary">
                                Views
                            </th>
                            <th
                                className="border border-primary px-4 py-2 text-right font-semibold text-primary"
                                title="Unique users who landed on posthog.com via influencer UTMs in this quarter, prorated by spend share."
                            >
                                Clicks
                            </th>
                            <th
                                className="border border-primary px-4 py-2 text-right font-semibold text-primary"
                                title="Clicks \u00f7 views"
                            >
                                CTR
                            </th>
                            <th className="border border-primary px-4 py-2 text-right font-semibold text-primary">
                                Signups
                            </th>
                            <th
                                className="border border-primary px-4 py-2 text-right font-semibold text-primary"
                                title="Signups \u00f7 clicks"
                            >
                                Conv
                            </th>
                            <th className="border border-primary px-4 py-2 text-right font-semibold text-primary">
                                CPM
                            </th>
                            <th className="border border-primary px-4 py-2 text-right font-semibold text-primary">
                                Cost/signup
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => {
                            const cpm = r.views > 0 ? (r.spend / r.views) * 1000 : 0
                            const costPerSignup = r.signupsProrated > 0 ? r.spend / r.signupsProrated : Infinity
                            const isCurrent = r.key === currentQuarter
                            const isOpen = expanded.has(r.key)
                            return (
                                <React.Fragment key={r.key}>
                                    <tr
                                        className={`cursor-pointer ${
                                            isCurrent ? 'bg-accent/40 font-semibold' : 'hover:bg-accent'
                                        }`}
                                        onClick={() => toggle(r.key)}
                                    >
                                        <td className="border border-primary px-4 py-2 whitespace-nowrap">
                                            <span className="text-muted mr-2">{isOpen ? '\u25be' : '\u25b8'}</span>
                                            <span className="text-primary">{r.label}</span>
                                            {isCurrent ? (
                                                <span className="ml-2 inline-flex rounded border border-primary bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-red">
                                                    current
                                                </span>
                                            ) : null}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-primary whitespace-nowrap">
                                            {r.videoCount}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-muted whitespace-nowrap">
                                            {r.influencerCount}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-primary whitespace-nowrap">
                                            {fmtMoney(r.spend)}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-primary whitespace-nowrap">
                                            {r.views.toLocaleString()}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-primary whitespace-nowrap">
                                            {r.clicksProrated > 0
                                                ? Math.round(r.clicksProrated).toLocaleString()
                                                : '\u2014'}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-muted whitespace-nowrap">
                                            {r.views > 0 && r.clicksProrated > 0
                                                ? `${((r.clicksProrated / r.views) * 100).toFixed(1)}%`
                                                : '\u2014'}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-primary whitespace-nowrap">
                                            {Math.round(r.signupsProrated).toLocaleString()}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-muted whitespace-nowrap">
                                            {r.clicksProrated > 0 && r.signupsProrated > 0
                                                ? `${((r.signupsProrated / r.clicksProrated) * 100).toFixed(1)}%`
                                                : '\u2014'}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-muted whitespace-nowrap">
                                            {r.views > 0 ? `$${cpm.toFixed(1)}` : '\u2014'}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-primary whitespace-nowrap">
                                            {Number.isFinite(costPerSignup) ? fmtMoney(costPerSignup) : '\u2014'}
                                        </td>
                                    </tr>
                                    {isOpen && (
                                        <tr>
                                            <td colSpan={11} className="border border-primary bg-accent/30 px-4 py-3">
                                                <QuarterBreakdown quarter={r} />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

function QuarterBreakdown({ quarter }: { quarter: QuarterRow }) {
    const influencers = [...quarter.influencers].sort((a, b) => b.spend - a.spend)
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
                <thead>
                    <tr className="text-muted">
                        <th className="border-b border-primary px-2 py-1 text-left">Influencer</th>
                        <th className="border-b border-primary px-2 py-1 text-right">Videos</th>
                        <th className="border-b border-primary px-2 py-1 text-right">Spend</th>
                        <th className="border-b border-primary px-2 py-1 text-right">Views</th>
                        <th className="border-b border-primary px-2 py-1 text-right" title="Clicks \u00f7 views">
                            Clicks
                        </th>
                        <th className="border-b border-primary px-2 py-1 text-right">CTR</th>
                        <th className="border-b border-primary px-2 py-1 text-right">Signups (prorated)</th>
                        <th className="border-b border-primary px-2 py-1 text-right" title="Signups \u00f7 clicks">
                            Conv
                        </th>
                        <th className="border-b border-primary px-2 py-1 text-right">CPM</th>
                        <th className="border-b border-primary px-2 py-1 text-right">Cost/signup</th>
                    </tr>
                </thead>
                <tbody>
                    {influencers.map((inf) => {
                        const cpm = inf.views > 0 ? (inf.spend / inf.views) * 1000 : 0
                        const costPerSignup = inf.signupsProrated > 0 ? inf.spend / inf.signupsProrated : Infinity
                        return (
                            <React.Fragment key={inf.utm}>
                                <tr className="hover:bg-primary">
                                    <td className="border-b border-primary/30 px-2 py-1">
                                        <span className="font-medium text-primary">{inf.name}</span>
                                        <span className="ml-2 text-muted">utm: {inf.utm}</span>
                                    </td>
                                    <td className="border-b border-primary/30 px-2 py-1 text-right text-primary whitespace-nowrap">
                                        {inf.videoCount}
                                    </td>
                                    <td className="border-b border-primary/30 px-2 py-1 text-right text-primary whitespace-nowrap">
                                        {fmtMoney(inf.spend)}
                                    </td>
                                    <td className="border-b border-primary/30 px-2 py-1 text-right text-primary whitespace-nowrap">
                                        {inf.views.toLocaleString()}
                                    </td>
                                    <td className="border-b border-primary/30 px-2 py-1 text-right text-primary whitespace-nowrap">
                                        {inf.clicksProrated > 0
                                            ? Math.round(inf.clicksProrated).toLocaleString()
                                            : '\u2014'}
                                    </td>
                                    <td className="border-b border-primary/30 px-2 py-1 text-right text-muted whitespace-nowrap">
                                        {inf.views > 0 && inf.clicksProrated > 0
                                            ? `${((inf.clicksProrated / inf.views) * 100).toFixed(1)}%`
                                            : '\u2014'}
                                    </td>
                                    <td className="border-b border-primary/30 px-2 py-1 text-right text-primary whitespace-nowrap">
                                        {Math.round(inf.signupsProrated).toLocaleString()}
                                    </td>
                                    <td className="border-b border-primary/30 px-2 py-1 text-right text-muted whitespace-nowrap">
                                        {inf.clicksProrated > 0 && inf.signupsProrated > 0
                                            ? `${((inf.signupsProrated / inf.clicksProrated) * 100).toFixed(1)}%`
                                            : '\u2014'}
                                    </td>
                                    <td className="border-b border-primary/30 px-2 py-1 text-right text-muted whitespace-nowrap">
                                        {inf.views > 0 ? `$${cpm.toFixed(1)}` : '\u2014'}
                                    </td>
                                    <td className="border-b border-primary/30 px-2 py-1 text-right text-muted whitespace-nowrap">
                                        {Number.isFinite(costPerSignup) ? fmtMoney(costPerSignup) : '\u2014'}
                                    </td>
                                </tr>
                                {inf.videos.length >= 1 && (
                                    <tr>
                                        <td colSpan={10} className="border-b border-primary/30 px-2 py-1">
                                            <div className="ml-4 text-muted text-[11px] flex flex-wrap gap-x-3 gap-y-1">
                                                {inf.videos.map((v, i) => {
                                                    const view = v.viewsLive ?? v.viewsSheet
                                                    const url = v.watchUrl
                                                    return (
                                                        <span key={i}>
                                                            {url ? (
                                                                <a
                                                                    href={url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-red hover:underline"
                                                                    title={url}
                                                                >
                                                                    {v.videoId
                                                                        ? `youtu.be/${v.videoId}`
                                                                        : v.publishLink.slice(0, 40)}
                                                                </a>
                                                            ) : (
                                                                <span>{v.publishLink.slice(0, 40) || 'video'}</span>
                                                            )}
                                                            <span className="ml-1">
                                                                {fmtMoney(v.cost)} / {view.toLocaleString()} views
                                                            </span>
                                                        </span>
                                                    )
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

function buildQuarterRows(videos: VideoPerformance[]): QuarterRow[] {
    // Per-utm totals (for prorating signups and clicks).
    const utmTotals = new Map<string, { spend: number; signups: number; clicks: number; name: string }>()
    for (const v of videos) {
        const cur = utmTotals.get(v.utm) ?? { spend: 0, signups: 0, clicks: 0, name: v.name }
        cur.spend += v.cost
        cur.signups = v.signupsTotal
        cur.clicks = v.clicksTotal
        cur.name = v.name
        utmTotals.set(v.utm, cur)
    }

    // Enrich each video with its quarter and prorated shares.
    type Enriched = VideoPerformance & {
        quarter: { key: string; label: string; sortValue: number } | null
        proratedSignups: number
        proratedClicks: number
    }
    const today = new Date()
    const todayMs = today.getTime()

    const enriched: Enriched[] = videos.map((v) => {
        // A row counts as "actually published" only if it has a non-empty publish_link.
        // Rows with a publish_date but no link are scheduled placeholders, not live videos —
        // we don't want those affecting any quarter's totals.
        const hasPublishLink = !!v.publishLink && v.publishLink.trim() !== '' && !v.publishLink.includes('#REF')
        // Group by publish date first, falling back to paid date when publish date is missing.
        const parsed = parseDateLoose(v.publishDate) ?? parseDateLoose(v.paidDate)
        // Day-level future check: a row published 30-Jun-2026 when today is 2-Jun-2026 hasn't
        // happened yet, even though its month "started" before today.
        const isFuture = parsed !== null && new Date(parsed.year, parsed.month, parsed.day).getTime() > todayMs
        const quarter = parsed && !isFuture && hasPublishLink ? quarterFromDate(parsed) : null
        const t = utmTotals.get(v.utm) ?? { spend: 0, signups: 0, clicks: 0, name: v.name }
        const share = t.spend > 0 ? v.cost / t.spend : 0
        const proratedSignups = t.signups * share
        const proratedClicks = t.clicks * share
        return { ...v, quarter, proratedSignups, proratedClicks }
    })

    const currentQuarter = `${today.getFullYear()}-Q${Math.floor(today.getMonth() / 3) + 1}`

    // First pass: group videos by quarter, then within each quarter by utm.
    interface BucketAcc {
        key: string
        label: string
        sortValue: number
        byUtm: Map<string, InfluencerInQuarter>
        videoCount: number
        spend: number
        views: number
        signupsProrated: number
        clicksProrated: number
    }
    const buckets = new Map<string, BucketAcc>()

    for (const v of enriched) {
        if (!v.quarter) continue
        let bucket = buckets.get(v.quarter.key)
        if (!bucket) {
            bucket = {
                key: v.quarter.key,
                label: v.quarter.label,
                sortValue: v.quarter.sortValue,
                byUtm: new Map(),
                videoCount: 0,
                spend: 0,
                views: 0,
                signupsProrated: 0,
                clicksProrated: 0,
            }
            buckets.set(v.quarter.key, bucket)
        }
        const views = v.viewsLive ?? v.viewsSheet
        bucket.videoCount += 1
        bucket.spend += v.cost
        bucket.views += views
        bucket.signupsProrated += v.proratedSignups
        bucket.clicksProrated += v.proratedClicks

        let inf = bucket.byUtm.get(v.utm)
        if (!inf) {
            inf = {
                utm: v.utm,
                name: v.name,
                videoCount: 0,
                spend: 0,
                views: 0,
                signupsProrated: 0,
                clicksProrated: 0,
                videos: [],
            }
            bucket.byUtm.set(v.utm, inf)
        }
        inf.videoCount += 1
        inf.spend += v.cost
        inf.views += views
        inf.signupsProrated += v.proratedSignups
        inf.clicksProrated += v.proratedClicks
        inf.videos.push(v)
    }

    const out: QuarterRow[] = []
    for (const b of buckets.values()) {
        out.push({
            key: b.key,
            label: b.label,
            sortValue: b.sortValue,
            isCurrent: b.key === currentQuarter,
            videoCount: b.videoCount,
            influencerCount: b.byUtm.size,
            spend: b.spend,
            views: b.views,
            signupsProrated: b.signupsProrated,
            clicksProrated: b.clicksProrated,
            influencers: [...b.byUtm.values()],
        })
    }
    out.sort((a, b) => b.sortValue - a.sortValue)
    return out
}
