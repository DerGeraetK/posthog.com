import React, { useEffect, useMemo, useState } from 'react'
import SEO from 'components/seo'
import ReaderView from 'components/ReaderView'
import { TreeMenu } from 'components/TreeMenu'
import OSButton from 'components/OSButton'
import { internalToolsNav } from '../../navs/internalTools'
import { useUser } from 'hooks/useUser'
import { PerformanceTable } from 'components/HogWatch/PerformanceTable'
import { QuarterlyTable } from 'components/HogWatch/QuarterlyTable'
import { MediumBreakdown } from 'components/HogWatch/MediumBreakdown'
import type { PerformanceResponse } from 'lib/hogwatch/performanceTypes'

async function fetchPerformance(refreshYouTube: boolean, bypassCache = false): Promise<PerformanceResponse> {
    const params = new URLSearchParams()
    if (refreshYouTube) params.set('refreshYouTube', '1')
    if (bypassCache) params.set('refresh', '1')
    const res = await fetch(`/api/hogwatch-performance?${params}`)
    if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || res.statusText)
    }
    return res.json()
}

interface SyncSheetResult {
    triggered: boolean
    status: string | null
    lastSyncedAt: string | null
    latestError: string | null
    triggeredAt: string
}

async function triggerSheetSync(): Promise<SyncSheetResult> {
    const res = await fetch('/api/hogwatch-sync-sheet', { method: 'POST' })
    if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || res.statusText)
    }
    return res.json()
}

async function getSheetSyncStatus(): Promise<SyncSheetResult> {
    const res = await fetch('/api/hogwatch-sync-sheet')
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
}

// Poll up to ~90s for the sync to leave the Running state.
async function pollSheetSyncStatus(): Promise<SyncSheetResult> {
    for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 3000))
        const s = await getSheetSyncStatus()
        if (s.status !== 'Running') return s
    }
    return getSheetSyncStatus()
}

export default function HogWatchPerformancePage() {
    const { user, isModerator } = useUser()
    const [data, setData] = useState<PerformanceResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [refreshYouTube, setRefreshYouTube] = useState<boolean>(true)
    const [syncing, setSyncing] = useState(false)
    const [syncMessage, setSyncMessage] = useState<string | null>(null)

    useEffect(() => {
        if (!isModerator) return
        load(refreshYouTube, false)
    }, [isModerator])

    async function load(refresh: boolean, bypassCache: boolean) {
        setLoading(true)
        setError(null)
        try {
            const d = await fetchPerformance(refresh, bypassCache)
            setData(d)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    async function handleSheetSync() {
        setSyncing(true)
        setSyncMessage('Sync triggered \u2014 waiting for upstream to finish\u2026')
        try {
            // Trigger the sync. The response captures pre-sync state (latestError = prior run's error).
            await triggerSheetSync()
            // Poll for completion. Sync usually takes 5\u201360s.
            const finalStatus = await pollSheetSyncStatus()
            if (finalStatus.status === 'Completed') {
                setSyncMessage(
                    `\u2705 Sync succeeded. Last synced: ${new Date(
                        finalStatus.lastSyncedAt!
                    ).toLocaleString()}. Hard-refresh the dashboard to see the new data.`
                )
            } else if (finalStatus.status === 'Failed') {
                setSyncMessage(
                    `\u274c Sync failed upstream: "${finalStatus.latestError}". This is a problem in the Google Sheet itself \u2014 open the sheet and de-duplicate the header row (or fill empty headers), then re-sync.`
                )
            } else {
                setSyncMessage(
                    `Sync still running (status: ${
                        finalStatus.status ?? 'unknown'
                    }). Check back in a minute and hard-refresh.`
                )
            }
        } catch (err) {
            setSyncMessage(`Sync trigger failed: ${err instanceof Error ? err.message : 'unknown error'}`)
        } finally {
            setSyncing(false)
        }
    }

    const totals = useMemo(() => {
        if (!data) return null
        let spend = 0
        let views = 0
        const perUtmSeen = new Set<string>()
        let signups = 0
        for (const v of data.videos) {
            spend += v.cost
            views += v.viewsLive ?? v.viewsSheet
            if (!perUtmSeen.has(v.utm)) {
                perUtmSeen.add(v.utm)
                signups += v.signupsTotal
            }
        }
        const costPerSignup = signups > 0 ? spend / signups : Infinity
        return { spend, views, signups, costPerSignup, influencerCount: perUtmSeen.size }
    }, [data])

    if (!user || !isModerator) {
        return (
            <>
                <SEO
                    title="HogWatch 3000 — Performance"
                    description="Internal influencer marketing performance dashboard"
                />
                <ReaderView
                    title="HogWatch 3000 — Performance"
                    leftSidebar={<TreeMenu items={internalToolsNav} />}
                    description="Internal influencer marketing performance dashboard"
                    showQuestions={false}
                >
                    <div className="@container text-primary">
                        <div className="bg-accent p-4 rounded border border-primary mt-4">
                            <p className="mt-0 font-semibold">Access denied</p>
                            <p className="mb-0 text-muted">
                                This page is only available to logged-in moderators. Log in with your community account
                                to continue.
                            </p>
                        </div>
                    </div>
                </ReaderView>
            </>
        )
    }

    return (
        <>
            <SEO title="HogWatch 3000 — Performance" description="Performance of every sponsored influencer video" />
            <ReaderView
                title="HogWatch 3000 — Performance"
                leftSidebar={<TreeMenu items={internalToolsNav} />}
                description="Performance of every sponsored influencer video. Joins the marketing budget Sheet (via PostHog data warehouse) with live signup attribution and optional live YouTube view counts."
                showQuestions={false}
            >
                <div className="@container text-primary">
                    <div className="space-y-6">
                        <section className="bg-accent p-4 rounded border border-primary space-y-2">
                            <p className="mt-0">
                                Spend, reach, clicks, and signups per influencer. Source of truth for spend/links is the
                                marketing budget Sheet (synced into our data warehouse). Signups come from PostHog
                                events.
                            </p>
                            <p className="mb-0 text-sm text-muted">
                                <a href="/hogwatch" className="text-red hover:underline">
                                    ← Back to channel evaluator
                                </a>
                                {' \u00b7 '}
                                <a
                                    href="https://docs.google.com/spreadsheets/d/1MmNUd9fFlZM3-SDk-HQ9cOmBY8XtqT7F97JFOAehxh8/"
                                    className="text-red hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Marketing budget sheet
                                </a>
                                {' \u00b7 '}
                                <a
                                    href="https://us.posthog.com/project/2/dashboard/493906"
                                    className="text-red hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    PostHog influencer dashboard
                                </a>
                            </p>
                        </section>

                        <section className="space-y-3 border-t border-primary pt-4">
                            <div className="flex flex-wrap items-end gap-4">
                                <label className="flex items-center gap-2 text-sm text-primary">
                                    <input
                                        type="checkbox"
                                        checked={refreshYouTube}
                                        onChange={(e) => setRefreshYouTube(e.target.checked)}
                                    />
                                    Refresh YouTube views (slower but live)
                                </label>
                                <OSButton
                                    type="button"
                                    size="md"
                                    variant="primary"
                                    disabled={loading}
                                    onClick={() => load(refreshYouTube, false)}
                                >
                                    {loading ? 'Loading\u2026' : data ? 'Refresh' : 'Load dashboard'}
                                </OSButton>
                                <OSButton
                                    type="button"
                                    size="md"
                                    variant="secondary"
                                    disabled={loading}
                                    onClick={() => load(refreshYouTube, true)}
                                    title="Bypass the 90s response cache. Re-runs HogQL, Dub API, and YouTube fetches."
                                >
                                    {loading ? 'Loading\u2026' : 'Hard refresh (skip cache)'}
                                </OSButton>
                                <OSButton
                                    type="button"
                                    size="md"
                                    variant="secondary"
                                    disabled={syncing}
                                    onClick={handleSheetSync}
                                    title="Trigger PostHog to re-sync the marketing budget Google Sheet. Background job — wait ~1\u20132 min then hard-refresh."
                                >
                                    {syncing ? 'Triggering\u2026' : 'Re-sync sheet'}
                                </OSButton>
                            </div>
                            {syncMessage && (
                                <div className="rounded border border-primary bg-accent px-4 py-2 text-xs text-primary mt-2">
                                    {syncMessage}
                                </div>
                            )}
                        </section>

                        {error && (
                            <div className="rounded border border-primary bg-accent px-4 py-3 text-sm text-red">
                                {error}
                            </div>
                        )}

                        {data && totals && (
                            <>
                                <section className="grid grid-cols-2 md:grid-cols-5 gap-3 border-t border-primary pt-4">
                                    <StatTile label="Influencers" value={totals.influencerCount.toLocaleString()} />
                                    <StatTile label="Spend" value={`$${Math.round(totals.spend).toLocaleString()}`} />
                                    <StatTile label="Views" value={totals.views.toLocaleString()} />
                                    <StatTile label="Signups" value={totals.signups.toLocaleString()} />
                                    <StatTile
                                        label="Cost / signup"
                                        value={
                                            Number.isFinite(totals.costPerSignup)
                                                ? `$${Math.round(totals.costPerSignup).toLocaleString()}`
                                                : '\u2014'
                                        }
                                    />
                                </section>

                                {data.signupsYoutubeReferrer > 0 && (
                                    <p className="text-xs text-muted">
                                        +{data.signupsYoutubeReferrer.toLocaleString()} signups had a YouTube referrer
                                        (mostly unattributed to a specific influencer because browsers strip the watch
                                        URL).
                                    </p>
                                )}

                                {data.errors.length > 0 && (
                                    <div className="rounded border border-primary bg-accent px-4 py-3 text-sm text-yellow">
                                        <p className="font-semibold mt-0 mb-1">Partial errors</p>
                                        <ul className="my-0 pl-4">
                                            {data.errors.map((e, i) => (
                                                <li key={i}>{e}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <MediumBreakdown videos={data.videos} />

                                <QuarterlyTable videos={data.videos} />

                                <PerformanceTable videos={data.videos} />

                                <div className="text-xs text-muted space-y-1">
                                    <p className="mb-0">
                                        Fetched at {new Date(data.fetchedAt).toLocaleString()}. Attribution lookback:
                                        365 days. Signup event:{' '}
                                        <code className="rounded bg-accent px-1">{data.signupEvent}</code>.
                                    </p>
                                    <p className="mb-0">
                                        <strong>UTM signal is weak by design:</strong> the convention changed on April 3
                                        from <code className="rounded bg-accent px-1">utm_source=&lt;slug&gt;</code>{' '}
                                        (legacy) to{' '}
                                        <code className="rounded bg-accent px-1">
                                            utm_source=influencer + utm_campaign=&lt;slug&gt;
                                        </code>{' '}
                                        (current, via vercel.json redirects). We match both. But{' '}
                                        <code className="rounded bg-accent px-1">$initial_utm_source</code> is
                                        first-touch (set once by posthog-js), so most users carry whatever UTM hit them
                                        the very first time they landed on posthog.com — usually not an influencer link.
                                        That's why the self-reported{' '}
                                        <code className="rounded bg-accent px-1">referral_source</code> field does ~95%+
                                        of the attribution work.
                                    </p>
                                    <p className="mb-0">
                                        If the warehouse sync is broken, signups stay live but spend/sheet-views may be
                                        stale.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </ReaderView>
        </>
    )
}

function StatTile({ label, value, tone }: { label: string; value: string; tone?: 'green' | 'yellow' | 'red' }) {
    const toneClass =
        tone === 'green'
            ? 'text-green'
            : tone === 'yellow'
            ? 'text-yellow'
            : tone === 'red'
            ? 'text-red'
            : 'text-primary'
    return (
        <div className="bg-accent border border-primary rounded p-3">
            <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
            <div className={`text-xl font-semibold ${toneClass}`}>{value}</div>
        </div>
    )
}
