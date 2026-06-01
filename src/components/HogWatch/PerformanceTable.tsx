import React, { useMemo, useState } from 'react'
import type { VideoPerformance } from 'lib/hogwatch/performanceTypes'

const HEADER_TOOLTIPS: Record<string, string> = {
    Influencer: 'Influencer / channel name from the marketing budget sheet.',
    Videos: 'Number of sponsored videos tracked for this influencer.',
    Spend: 'Sum of amounts paid across all of this influencer\u2019s videos.',
    Views: 'Total views across all videos. Uses live YouTube counts where available, falls back to the sheet.',
    Signups:
        'Distinct users who signed up and either had utm_source matching this influencer or wrote something matching them in the self-reported referral_source field. Deduped across signals.',
    'UTM-only': 'Subset of signups attributed via person.properties.$initial_utm_source (set by posthog-js).',
    'Self-reported':
        'Subset of signups attributed via fuzzy match on properties.referral_source from the signup event.',
    'Sheet signups':
        'The signups count maintained manually in the marketing budget Sheet. Shown for comparison \u2014 large gaps suggest the Sheet is out of date.',
    CPM: 'Cost per 1,000 views: (spend \u00f7 views) \u00d7 1000.',
    'Cost/signup': 'Spend divided by attributed signups.',
    Clicks: 'Unique users who landed on posthog.com with this influencer\u2019s UTM (covers both Dub-tracked links and the vercel.json redirects).',
    'Dub clicks':
        'Click events from Dub API for go.posthog.com/<slug>. Usually higher than landings because some clicks don\u2019t complete a pageview.',
    CTR: 'Click-through rate: clicks \u00f7 views.',
    Conv: 'Click-to-signup conversion: signups \u00f7 clicks.',
}

interface Props {
    videos: VideoPerformance[]
}

interface InfluencerAggregate {
    utm: string
    name: string
    videoCount: number
    spend: number
    views: number
    signupsTotal: number
    signupsUtm: number
    signupsSelfReported: number
    signupsSheet: number
    clicksTotal: number
    clicksDub: number
    videos: VideoPerformance[]
}

type SortKey = 'name' | 'videoCount' | 'spend' | 'views' | 'signupsTotal' | 'cpm' | 'costPerSignup'

function aggregateByUtm(videos: VideoPerformance[]): InfluencerAggregate[] {
    const map = new Map<string, InfluencerAggregate>()
    for (const v of videos) {
        const view = v.viewsLive ?? v.viewsSheet
        const cur = map.get(v.utm)
        if (cur) {
            cur.videoCount += 1
            cur.spend += v.cost
            cur.views += view
            cur.signupsSheet += v.signupsSheet
            cur.videos.push(v)
        } else {
            map.set(v.utm, {
                utm: v.utm,
                name: v.name,
                videoCount: 1,
                spend: v.cost,
                views: view,
                signupsTotal: v.signupsTotal,
                signupsUtm: v.signupsUtm,
                signupsSelfReported: v.signupsSelfReported,
                signupsSheet: v.signupsSheet,
                clicksTotal: v.clicksTotal,
                clicksDub: v.clicksDub,
                videos: [v],
            })
        }
    }
    return [...map.values()]
}

function fmtMoney(n: number): string {
    return `$${Math.round(n).toLocaleString()}`
}

function TH({
    label,
    align = 'right',
    sortKey,
    sortBy,
    sortDir,
    onSort,
    sticky,
    tip,
}: {
    label: string
    align?: 'left' | 'right' | 'center'
    sortKey?: SortKey
    sortBy?: SortKey | null
    sortDir?: 'asc' | 'desc'
    onSort?: (k: SortKey) => void
    sticky?: boolean
    tip?: string
}) {
    const alignClass = align === 'left' ? 'text-left' : align === 'center' ? 'text-center' : 'text-right'
    const isSorted = sortKey && sortBy === sortKey
    return (
        <th
            className={`group relative cursor-help border border-primary px-4 py-2 font-semibold tracking-posthog-tight text-primary ${alignClass} ${
                sortKey ? 'cursor-pointer select-none' : ''
            } ${sticky ? 'sticky left-0 z-10 bg-accent' : ''}`}
            title={tip}
            onClick={sortKey ? () => onSort?.(sortKey) : undefined}
        >
            <span className="inline-flex items-center gap-0.5 border-b border-transparent group-hover:border-primary/40">
                {label}
                {isSorted && <span className="text-red">{sortDir === 'asc' ? ' \u2191' : ' \u2193'}</span>}
            </span>
            {tip ? (
                <span
                    className="pointer-events-none absolute left-1/2 top-full z-[100] mt-1.5 max-w-[280px] -translate-x-1/2 rounded border border-primary bg-accent px-3 py-2 text-left text-xs font-normal leading-snug text-primary opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100"
                    role="tooltip"
                >
                    {tip}
                </span>
            ) : null}
        </th>
    )
}

export function PerformanceTable({ videos }: Props) {
    const aggregates = useMemo(() => aggregateByUtm(videos), [videos])
    const [sortBy, setSortBy] = useState<SortKey | null>('signupsTotal')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
    const [expanded, setExpanded] = useState<Set<string>>(new Set())
    const [filter, setFilter] = useState<string>('')

    function handleSort(k: SortKey) {
        if (sortBy === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        else {
            setSortBy(k)
            setSortDir('desc')
        }
    }

    function toggle(utm: string) {
        setExpanded((prev) => {
            const next = new Set(prev)
            if (next.has(utm)) next.delete(utm)
            else next.add(utm)
            return next
        })
    }

    const filtered = aggregates.filter((a) => {
        if (!filter) return true
        const f = filter.toLowerCase()
        return a.name.toLowerCase().includes(f) || a.utm.toLowerCase().includes(f)
    })

    const rows = [...filtered].sort((a, b) => {
        if (!sortBy) return 0
        const va = sortValue(a, sortBy)
        const vb = sortValue(b, sortBy)
        if (typeof va === 'string' && typeof vb === 'string') {
            const c = va.localeCompare(vb)
            return sortDir === 'asc' ? c : -c
        }
        const n = (Number(va) || 0) - (Number(vb) || 0)
        return sortDir === 'asc' ? n : -n
    })

    return (
        <>
            <div className="flex flex-wrap items-center gap-3 border-b border-primary pb-3 mb-3">
                <span className="text-xs font-semibold text-muted">Filter:</span>
                <input
                    type="text"
                    placeholder="influencer name or utm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-56 rounded border border-primary bg-primary px-2 py-1 text-sm text-primary"
                />
                <span className="text-xs text-muted">
                    {rows.length} of {aggregates.length} influencers
                </span>
            </div>
            <div className="overflow-x-auto -mx-px">
                <table className="w-full min-w-max border-collapse border border-primary text-sm">
                    <thead>
                        <tr className="bg-accent">
                            <TH
                                label="Influencer"
                                align="left"
                                tip={HEADER_TOOLTIPS.Influencer}
                                sortKey="name"
                                sortBy={sortBy}
                                sortDir={sortDir}
                                onSort={handleSort}
                                sticky
                            />
                            <TH
                                label="Videos"
                                tip={HEADER_TOOLTIPS.Videos}
                                sortKey="videoCount"
                                sortBy={sortBy}
                                sortDir={sortDir}
                                onSort={handleSort}
                            />
                            <TH
                                label="Spend"
                                tip={HEADER_TOOLTIPS.Spend}
                                sortKey="spend"
                                sortBy={sortBy}
                                sortDir={sortDir}
                                onSort={handleSort}
                            />
                            <TH
                                label="Views"
                                tip={HEADER_TOOLTIPS.Views}
                                sortKey="views"
                                sortBy={sortBy}
                                sortDir={sortDir}
                                onSort={handleSort}
                            />
                            <TH
                                label="Signups"
                                tip={HEADER_TOOLTIPS.Signups}
                                sortKey="signupsTotal"
                                sortBy={sortBy}
                                sortDir={sortDir}
                                onSort={handleSort}
                            />
                            <TH label="UTM-only" tip={HEADER_TOOLTIPS['UTM-only']} />
                            <TH label="Self-reported" tip={HEADER_TOOLTIPS['Self-reported']} />
                            <TH label="Clicks" tip={HEADER_TOOLTIPS.Clicks} />
                            <TH label="Dub" tip={HEADER_TOOLTIPS['Dub clicks']} />
                            <TH label="CTR" tip={HEADER_TOOLTIPS.CTR} />
                            <TH label="Conv" tip={HEADER_TOOLTIPS.Conv} />
                            <TH label="Sheet signups" tip={HEADER_TOOLTIPS['Sheet signups']} />
                            <TH
                                label="CPM"
                                tip={HEADER_TOOLTIPS.CPM}
                                sortKey="cpm"
                                sortBy={sortBy}
                                sortDir={sortDir}
                                onSort={handleSort}
                            />
                            <TH
                                label="Cost/signup"
                                tip={HEADER_TOOLTIPS['Cost/signup']}
                                sortKey="costPerSignup"
                                sortBy={sortBy}
                                sortDir={sortDir}
                                onSort={handleSort}
                            />
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((a) => {
                            const cpm = a.views > 0 ? (a.spend / a.views) * 1000 : 0
                            const costPerSignup = a.signupsTotal > 0 ? a.spend / a.signupsTotal : Infinity
                            const isOpen = expanded.has(a.utm)
                            return (
                                <React.Fragment key={a.utm}>
                                    <tr className="hover:bg-accent">
                                        <td className="sticky left-0 z-10 border border-primary bg-primary px-4 py-2">
                                            <button
                                                type="button"
                                                onClick={() => toggle(a.utm)}
                                                className="flex items-center gap-2 text-left"
                                                title="Show videos for this influencer"
                                            >
                                                <span className="text-muted">{isOpen ? '\u25be' : '\u25b8'}</span>
                                                <div className="min-w-0">
                                                    <span className="font-medium text-primary block">{a.name}</span>
                                                    <span className="block text-xs text-muted">utm: {a.utm}</span>
                                                </div>
                                            </button>
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-primary whitespace-nowrap">
                                            {a.videoCount}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-primary whitespace-nowrap">
                                            {fmtMoney(a.spend)}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-primary whitespace-nowrap">
                                            {a.views.toLocaleString()}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right font-semibold text-primary whitespace-nowrap">
                                            {a.signupsTotal.toLocaleString()}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-muted whitespace-nowrap">
                                            {a.signupsUtm.toLocaleString()}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-muted whitespace-nowrap">
                                            {a.signupsSelfReported.toLocaleString()}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-muted whitespace-nowrap">
                                            {a.signupsSheet.toLocaleString()}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-primary whitespace-nowrap">
                                            {a.clicksTotal > 0 ? a.clicksTotal.toLocaleString() : '\u2014'}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-muted whitespace-nowrap">
                                            {a.clicksDub > 0 ? a.clicksDub.toLocaleString() : '\u2014'}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-muted whitespace-nowrap">
                                            {a.views > 0 && a.clicksTotal > 0
                                                ? `${((a.clicksTotal / a.views) * 100).toFixed(1)}%`
                                                : '\u2014'}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-muted whitespace-nowrap">
                                            {a.clicksTotal > 0 && a.signupsTotal > 0
                                                ? `${((a.signupsTotal / a.clicksTotal) * 100).toFixed(1)}%`
                                                : '\u2014'}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-muted whitespace-nowrap">
                                            {a.views > 0 ? `$${cpm.toFixed(1)}` : '\u2014'}
                                        </td>
                                        <td className="border border-primary px-4 py-2 text-right text-primary whitespace-nowrap">
                                            {Number.isFinite(costPerSignup) ? fmtMoney(costPerSignup) : '\u2014'}
                                        </td>
                                    </tr>
                                    {isOpen && (
                                        <tr>
                                            <td colSpan={14} className="border border-primary bg-accent px-4 py-3">
                                                <VideoBreakdown videos={a.videos} />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <p className="mt-2 text-xs text-muted">
                Signups attribute to influencer, not specific video (our signals can't reliably tell videos apart).
                Click an influencer to see their individual videos with per-video spend and views.
            </p>
        </>
    )
}

function sortValue(a: InfluencerAggregate, key: SortKey): number | string {
    switch (key) {
        case 'name':
            return a.name.toLowerCase()
        case 'videoCount':
            return a.videoCount
        case 'spend':
            return a.spend
        case 'views':
            return a.views
        case 'signupsTotal':
            return a.signupsTotal
        case 'cpm':
            return a.views > 0 ? (a.spend / a.views) * 1000 : 0
        case 'costPerSignup':
            return a.signupsTotal > 0 ? a.spend / a.signupsTotal : Number.MAX_SAFE_INTEGER
        default:
            return 0
    }
}

function VideoBreakdown({ videos }: { videos: VideoPerformance[] }) {
    const sorted = [...videos].sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1))
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
                <thead>
                    <tr className="text-muted">
                        <th className="border-b border-primary px-2 py-1 text-left">Published</th>
                        <th className="border-b border-primary px-2 py-1 text-left">Video</th>
                        <th className="border-b border-primary px-2 py-1 text-right">Spend</th>
                        <th className="border-b border-primary px-2 py-1 text-right">Views (live)</th>
                        <th className="border-b border-primary px-2 py-1 text-right">Views (sheet)</th>
                        <th className="border-b border-primary px-2 py-1 text-right">CPM</th>
                    </tr>
                </thead>
                <tbody>
                    {sorted.map((v, i) => {
                        const view = v.viewsLive ?? v.viewsSheet
                        const cpm = view > 0 ? (v.cost / view) * 1000 : 0
                        const url = v.watchUrl
                        return (
                            <tr key={`${v.utm}-${i}`} className="hover:bg-primary">
                                <td className="border-b border-primary/30 px-2 py-1 text-muted whitespace-nowrap">
                                    {v.publishDate || '\u2014'}
                                </td>
                                <td className="border-b border-primary/30 px-2 py-1 max-w-md truncate">
                                    {url ? (
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-red hover:underline"
                                            title={url}
                                        >
                                            {v.videoId ? `youtu.be/${v.videoId}` : v.publishLink}
                                        </a>
                                    ) : (
                                        <span className="text-primary">{v.publishLink}</span>
                                    )}
                                </td>
                                <td className="border-b border-primary/30 px-2 py-1 text-right text-primary whitespace-nowrap">
                                    {fmtMoney(v.cost)}
                                </td>
                                <td className="border-b border-primary/30 px-2 py-1 text-right text-primary whitespace-nowrap">
                                    {v.viewsLive != null ? v.viewsLive.toLocaleString() : '\u2014'}
                                </td>
                                <td className="border-b border-primary/30 px-2 py-1 text-right text-muted whitespace-nowrap">
                                    {v.viewsSheet > 0 ? v.viewsSheet.toLocaleString() : '\u2014'}
                                </td>
                                <td className="border-b border-primary/30 px-2 py-1 text-right text-muted whitespace-nowrap">
                                    {view > 0 ? `$${cpm.toFixed(1)}` : '\u2014'}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
