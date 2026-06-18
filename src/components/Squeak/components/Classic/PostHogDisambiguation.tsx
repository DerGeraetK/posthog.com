import React, { useRef, useState } from 'react'
import { CallToAction } from 'components/CallToAction'
import { useUser } from 'hooks/useUser'

interface PostHogDisambiguationProps {
    pendingToken: string
    emailInUse: boolean
    onSuccess: () => void
}

// Shown on the OAuth landing page when a non-employee PostHog login matches no
// linked account: let them create a fresh community account, or prove ownership
// of an existing one (any email) and link it. When the OAuth email already maps
// to an account we skip straight to the link form.
const PostHogDisambiguation: React.FC<PostHogDisambiguationProps> = ({ pendingToken, emailInUse, onSuccess }) => {
    const { createWithProvider, linkExisting } = useUser()
    const [mode, setMode] = useState<'choose' | 'link'>(emailInUse ? 'link' : 'choose')
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [busy, setBusy] = useState(false)
    // Synchronous re-entrancy guard: the submit CallToAction fires both its onClick
    // AND the form's native submit in one click, so a state-based `busy` flag (async)
    // wouldn't block the second call — a ref set before any await does.
    const inFlight = useRef(false)

    const handleCreate = async () => {
        if (inFlight.current) return
        inFlight.current = true
        setBusy(true)
        setError(null)
        try {
            const res = await createWithProvider({ pendingToken })
            if (!res || 'error' in res) {
                return setError((res && 'error' in res && res.error) || 'Could not create your account.')
            }
            onSuccess()
        } finally {
            inFlight.current = false
            setBusy(false)
        }
    }

    const handleLink = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (inFlight.current) return
        inFlight.current = true
        setBusy(true)
        setError(null)
        try {
            const res = await linkExisting({ pendingToken, identifier, password })
            if (!res || 'error' in res) {
                return setError((res && 'error' in res && res.error) || 'Could not connect your account.')
            }
            onSuccess()
        } finally {
            inFlight.current = false
            setBusy(false)
        }
    }

    return (
        <div data-scheme="primary" className="max-w-sm w-full space-y-3">
            {mode === 'choose' ? (
                <>
                    <h3 className="text-base font-semibold leading-tight m-0">Welcome to PostHog.com</h3>
                    <p className="text-sm m-0">Create a new community account, or connect one you already have.</p>
                    <CallToAction type="primary" size="sm" width="full" disabled={busy} onClick={handleCreate}>
                        Create a new account
                    </CallToAction>
                    <button
                        type="button"
                        className="text-sm text-red dark:text-yellow font-semibold"
                        onClick={() => setMode('link')}
                    >
                        I already have an account
                    </button>
                </>
            ) : (
                <>
                    <h3 className="text-base font-semibold leading-tight m-0">Connect your existing account</h3>
                    <p className="text-sm m-0">Log in to link PostHog sign-in to your posthog.com account.</p>
                    <form onSubmit={handleLink} className="space-y-2">
                        <input
                            className="rounded-md border !border-border p-1 w-full"
                            placeholder="Email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                        <input
                            className="rounded-md border !border-border p-1 w-full"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="hidden" />
                        <CallToAction
                            type="primary"
                            size="sm"
                            width="full"
                            disabled={busy}
                            onClick={() => handleLink()}
                        >
                            Log in and connect
                        </CallToAction>
                    </form>
                    {!emailInUse && (
                        <button
                            type="button"
                            className="text-sm text-red dark:text-yellow font-semibold"
                            onClick={() => setMode('choose')}
                        >
                            Back
                        </button>
                    )}
                </>
            )}
            {error && <p className="text-red text-sm font-bold m-0">{error}</p>}
        </div>
    )
}

export default PostHogDisambiguation
