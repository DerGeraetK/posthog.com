import React, { useEffect, useRef, useState } from 'react'
import Input from 'components/OSForm/input'
import OSButton from 'components/OSButton'
import usePostHog from '../../hooks/usePostHog'
import useProduct from '../../hooks/useProduct'
import { useApp } from '../../context/App'
import Link from 'components/Link'
import { IconDiscord } from 'components/OSIcons/Icons'

// Persist the post-submit confirmation across reloads so a refresh doesn't reset
// the form and let users re-submit (which fires duplicate capture events).
const submittedStorageKey = (handle: string): string => `waitlist_submitted_${handle}`

const hasSubmittedWaitlist = (handle: string): boolean => {
    if (typeof window === 'undefined') return false
    try {
        return window.localStorage.getItem(submittedStorageKey(handle)) === 'true'
    } catch {
        return false
    }
}

const markSubmittedWaitlist = (handle: string): void => {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(submittedStorageKey(handle), 'true')
    } catch {
        // Ignore storage failures (e.g. private mode, disabled storage)
    }
}

interface WaitlistFormProps {
    autoFocus?: boolean
    confetti?: boolean
    productHandle?: string
    productName?: string
    surveyId?: string
    showTitle?: boolean
    buttonLabel?: string
    showDiscord?: boolean
}

export function WaitlistForm({
    autoFocus = false,
    confetti = true,
    productHandle = 'posthog_code',
    productName = 'PostHog Code',
    surveyId,
    showTitle = true,
    buttonLabel = 'Get updates',
    showDiscord = true,
}: WaitlistFormProps) {
    const posthog = usePostHog()
    const selectedProduct = useProduct({ handle: productHandle })
    const { setConfetti } = useApp()
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // Initialize from localStorage after mount to keep the confirmation visible
    // across reloads. Done in an effect (not lazy state) to avoid SSR/hydration
    // mismatches between the server-rendered empty form and the client.
    useEffect(() => {
        if (hasSubmittedWaitlist(productHandle)) {
            setSubmitted(true)
        }
    }, [productHandle])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        // Don't re-capture if this product's waitlist was already submitted.
        if (submitted || hasSubmittedWaitlist(productHandle)) {
            setSubmitted(true)
            return
        }
        if (surveyId) {
            posthog?.capture('survey sent', {
                $survey_id: surveyId,
                $survey_response: email,
            })
        }
        posthog?.capture('subscribe_to_product_updates', { email, selectedProduct })
        if (confetti) {
            setConfetti(true)
        }
        markSubmittedWaitlist(productHandle)
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <p className="text-sm mt-0 mb-4 border border-green rounded-md p-3 bg-green/10">
                <strong>You&apos;re on the list!</strong>
                <br />
                We&apos;ll let you know when <span className="inline-block">{productName}</span> is ready.
                {showDiscord && (
                    <>
                        <br />
                        <br />
                        <Link
                            className="group flex items-center gap-1 text-sm font-medium"
                            to="https://discord.com/invite/E9xV2WnR98"
                            externalNoIcon
                        >
                            <IconDiscord className="size-6 text-secondary group-hover:text-primary" />
                            <span className="group-hover:underline">Join our Discord</span>
                        </Link>
                    </>
                )}
            </p>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            {showTitle && <h3 className="text-lg font-bold mb-2 !mt-0">Join the waitlist</h3>}
            <Input
                ref={inputRef}
                autoFocus={autoFocus}
                label="Email"
                type="email"
                size="md"
                direction="column"
                showLabel={false}
                placeholder="Email address"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
            />
            <OSButton variant="primary" size="md" width="full" onClick={handleSubmit}>
                {buttonLabel}
            </OSButton>
        </form>
    )
}
