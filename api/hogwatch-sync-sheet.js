/**
 * HogWatch 3000 — trigger a re-sync of the marketing-budget Google Sheet from PostHog's
 * data warehouse. POST only. Returns sync status.
 *
 * Background: the marketing_budgetgooglesheets_formatted_newsletters_influencers table is
 * synced from a Google Sheet on a 6-hour schedule. This endpoint kicks off an ad-hoc sync
 * so newly-edited rows show up faster. Note: if the sheet has duplicate column headers or
 * other structural issues, the sync will fail upstream — surface the error to the caller.
 */

const POSTHOG_HOST = 'https://us.posthog.com'
const PROJECT_ID = 2
// External data schema for the influencer_perf_ Google Sheet (sponsorship_influencers_newslettersx tab).
const SCHEMA_ID = '019e84ee-9bc4-0000-7e2c-b7e8408c66fb'

async function fetchStatus(key) {
    const res = await fetch(`${POSTHOG_HOST}/api/environments/${PROJECT_ID}/external_data_schemas/${SCHEMA_ID}/`, {
        headers: { Authorization: `Bearer ${key}` },
    })
    if (!res.ok) return null
    return res.json()
}

const handler = async (req, res) => {
    if (req.method !== 'POST' && req.method !== 'GET') {
        res.setHeader('Allow', 'POST, GET')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const key = process.env.POSTHOG_APP_API_KEY
    if (!key) return res.status(500).json({ error: 'POSTHOG_APP_API_KEY not set' })

    try {
        if (req.method === 'POST') {
            // Trigger the schema reload.
            const reloadRes = await fetch(
                `${POSTHOG_HOST}/api/environments/${PROJECT_ID}/external_data_schemas/${SCHEMA_ID}/reload/`,
                { method: 'POST', headers: { Authorization: `Bearer ${key}` } }
            )
            if (!reloadRes.ok) {
                const text = await reloadRes.text()
                return res.status(502).json({ error: `Reload failed: ${reloadRes.status} ${text.slice(0, 300)}` })
            }
        }

        // GET or post-trigger: report current status. After a POST the status flips to Running
        // briefly, then either Completed or Failed once the sync wraps up.
        const status = await fetchStatus(key)
        return res.status(200).json({
            triggered: req.method === 'POST',
            schemaId: SCHEMA_ID,
            status: status?.status ?? null,
            lastSyncedAt: status?.last_synced_at ?? null,
            latestError: status?.latest_error ?? null,
            triggeredAt: new Date().toISOString(),
        })
    } catch (err) {
        return res.status(500).json({ error: err instanceof Error ? err.message : 'Sync trigger failed' })
    }
}

export default handler
