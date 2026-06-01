import React, { useMemo } from 'react'
import type { VideoPerformance } from 'lib/hogwatch/performanceTypes'

interface Props {
    videos: VideoPerformance[]
}

interface MediumRow {
    medium: string
    influencerCount: number
    videoCount: number
    spend: number
    views: number
    signupsProrated: number
    clicksProrated: number
}

const MEDIUM_LABEL: Record<string, string> = {
    youtube: 'YouTube',
    newsletter: 'Newsletter',
    podcast: 'Podcast',
    instagram: 'Instagram',
    twitter: 'X / Twitter',
    unknown: 'Unknown',
}

function fmtMoney(n: number): string {
    return `$${Math.round(n).toLocaleString()}`
}

function buildMediumRows(videos: VideoPerformance[]): MediumRow[] {
    // Prorate per-influencer signups across that influencer's videos by spend share,
    // so signups split correctly when one influencer spans multiple mediums.
    const utmTotals = new Map<string, { spend: number; signups: number; clicks: number }>()
    for (const v of videos) {
        const cur = utmTotals.get(v.utm) ?? { spend: 0, signups: 0, clicks: 0 }
        cur.spend += v.cost
        cur.signups = v.signupsTotal
        cur.clicks = v.clicksTotal
        utmTotals.set(v.utm, cur)
    }

    const buckets = new Map<string, MediumRow & { utms: Set<string> }>()
    for (const v of videos) {
        const m = v.medium || 'unknown'
        let row = buckets.get(m)
        if (!row) {
            row = {
                medium: m,
                influencerCount: 0,
                videoCount: 0,
                spend: 0,
                views: 0,
                signupsProrated: 0,
                clicksProrated: 0,
                utms: new Set(),
            }
            buckets.set(m, row)
        }
        const t = utmTotals.get(v.utm) ?? { spend: 0, signups: 0, clicks: 0 }
        const share = t.spend > 0 ? v.cost / t.spend : 0
        row.videoCount += 1
        row.spend += v.cost
        row.views += v.viewsLive ?? v.viewsSheet
        row.signupsProrated += t.signups * share
        row.clicksProrated += t.clicks * share
        row.utms.add(v.utm)
    }

    const out: MediumRow[] = []
    for (const r of buckets.values()) {
        r.influencerCount = r.utms.size
        out.push(r)
    }
    out.sort((a, b) => b.spend - a.spend)
    return out
}

export function MediumBreakdown({ videos }: Props) {
    const rows = useMemo(
        // Hide the "unknown" bucket — it's almost entirely planned/upcoming videos with no
        // publish_link yet, and the exec view doesn't need to see them mixed in here.
        () => buildMediumRows(videos).filter((r) => r.medium !== 'unknown'),
        [videos]
    )
    if (rows.length === 0) return null

    return (
        <section className="border-t border-primary pt-4">
            <h3 className="text-base font-semibold tracking-posthog-tight text-primary mt-0 mb-2">By medium</h3>
            <p className="text-xs text-muted mb-3">
                YouTube vs newsletter vs podcast etc. Detected from each entry's publish link with manual overrides for
                known newsletter creators. Signups are prorated by spend share when an influencer spans multiple
                mediums.
            </p>
            <div className="overflow-x-auto -mx-px">
                <table className="w-full min-w-max border-collapse border border-primary text-sm">
                    <thead>
                        <tr className="bg-accent">
                            <th className="border border-primary px-4 py-2 text-left font-semibold text-primary">
                                Medium
                            </th>
                            <th className="border border-primary px-4 py-2 text-right font-semibold text-primary">
                                Influencers
                            </th>
                            <th className="border border-primary px-4 py-2 text-right font-semibold text-primary">
                                Videos
                            </th>
                            <th className="border border-primary px-4 py-2 text-right font-semibold text-primary">
                                Spend
                            </th>
                            <th className="border border-primary px-4 py-2 text-right font-semibold text-primary">
                                Views
                            </th>
                            <th className="border border-primary px-4 py-2 text-right font-semibold text-primary">
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
                            return (
                                <tr key={r.medium} className="hover:bg-accent">
                                    <td className="border border-primary px-4 py-2 whitespace-nowrap text-primary font-medium">
                                        {MEDIUM_LABEL[r.medium] ?? r.medium}
                                    </td>
                                    <td className="border border-primary px-4 py-2 text-right text-muted whitespace-nowrap">
                                        {r.influencerCount}
                                    </td>
                                    <td className="border border-primary px-4 py-2 text-right text-primary whitespace-nowrap">
                                        {r.videoCount}
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
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
