import React, { useState } from 'react'
import { CallToAction } from 'components/CallToAction'
import { useUser } from 'hooks/useUser'
import { useToast } from '../../../context/Toast'
import { SQUEAK_HOST } from 'lib/strapi'
import { isPostHogEmail } from 'lib/employee'

// Account-settings section for linking/unlinking PostHog OAuth.
//  - Employee accounts (provider 'posthog') are OAuth-only: shown connected,
//    disconnect disabled (the backend refuses to unlink a passwordless account).
//  - Community accounts (provider 'local') can connect (additive, keeps password)
//    and disconnect freely.
const ConnectedAccounts: React.FC = () => {
    const { user, unlinkProvider } = useUser()
    const { addToast } = useToast()
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!user) return null

    // Employee status is the email domain, NOT the provider — a community member
    // who created their account via OAuth also has provider 'posthog' but is not an
    // employee.
    const isEmployee = isPostHogEmail(user.email)
    // Accounts with no password (employees AND OAuth-created community accounts)
    // can't disconnect — it would lock them out. provider 'local' means a password
    // exists, so a linked local account is the only safely-disconnectable case.
    const isOAuthOnly = user.provider === 'posthog'
    const isLinked = isOAuthOnly || !!user.hasPosthogLogin

    const handleConnect = () => {
        // The OAuth redirect page reads this intent and links to the current
        // account (rather than starting a fresh sign-in).
        localStorage.setItem('posthog_oauth_intent', 'link')
        window.location.href = `${SQUEAK_HOST}/api/connect/posthog`
    }

    const handleDisconnect = async () => {
        setBusy(true)
        setError(null)
        const res = await unlinkProvider()
        setBusy(false)
        if ('error' in res) {
            setError(res.error || 'Could not disconnect PostHog.')
            return
        }
        addToast({ title: 'PostHog login disconnected' })
    }

    return (
        <div data-scheme="primary" className="space-y-2">
            <h2>Connected accounts</h2>
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="m-0 font-semibold">PostHog</p>
                    <p className="m-0 text-sm opacity-70">
                        {isLinked ? 'Connected — sign in with PostHog.' : 'Connect to sign in with PostHog.'}
                    </p>
                </div>
                {!isLinked ? (
                    <CallToAction type="secondary" size="sm" onClick={handleConnect}>
                        Connect PostHog
                    </CallToAction>
                ) : isOAuthOnly ? (
                    <span
                        className="text-sm opacity-70"
                        title={isEmployee ? 'Required for PostHog employees' : 'Set a password to disconnect'}
                    >
                        {isEmployee ? 'Required' : 'Connected'}
                    </span>
                ) : (
                    <CallToAction type="secondary" size="sm" disabled={busy} onClick={handleDisconnect}>
                        Disconnect
                    </CallToAction>
                )}
            </div>
            {error && <p className="text-red text-sm font-bold m-0">{error}</p>}
        </div>
    )
}

export default ConnectedAccounts
