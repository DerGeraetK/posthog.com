import React, { useState } from 'react'
import Input from 'components/OSForm/input'
import OSButton from 'components/OSButton'
import Link from 'components/Link'
import { IconCheckCircle } from '@posthog/icons'
import { IconDiscord } from 'components/OSIcons/Icons'
import { useApp } from '../../context/App'
import { useEarlyAccessEnroll, EarlyAccessFeatureStage } from 'hooks/useEarlyAccessFeatures'

export type EarlyAccessSignupMode = 'waitlist' | 'try'

interface EarlyAccessSignupProps {
    /** EAF flag key to enroll into. If omitted/unmapped, the form captures only (no enrollment). */
    flagKey?: string
    /** Drives copy + whether email is required when `mode` is not set explicitly. */
    stage?: EarlyAccessFeatureStage
    /**
     * `waitlist` (concept/alpha → register interest, email required) or
     * `try` (beta → enroll/flip the flag, email optional). Defaults from `stage`.
     */
    mode?: EarlyAccessSignupMode
    /** Used in success/button copy. */
    productName?: string
    /** Optional heading rendered above the form (hidden in the success state). */
    title?: React.ReactNode
    buttonLabel?: string
    successTitle?: string
    successMessage?: React.ReactNode
    autoFocus?: boolean
    confetti?: boolean
    showDiscord?: boolean
    /** Opt-in to `posthog.identify(email)` — off by default (see useEarlyAccessFeatures). */
    identify?: boolean
    eventName?: string
    extraProps?: Record<string, any>
    /** Called after a successful submit with the entered email (e.g. to fire a legacy survey event). */
    onSuccess?: (email: string) => void
    className?: string
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export function EarlyAccessSignup({
    flagKey,
    stage = 'concept',
    mode,
    productName,
    title,
    buttonLabel,
    successTitle = "You're on the list!",
    successMessage,
    autoFocus = false,
    confetti = true,
    showDiscord = false,
    identify = false,
    eventName,
    extraProps,
    onSuccess,
    className = '',
}: EarlyAccessSignupProps): JSX.Element {
    const { enroll } = useEarlyAccessEnroll()
    const { setConfetti } = useApp()
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const effectiveMode: EarlyAccessSignupMode = mode ?? (stage === 'beta' ? 'try' : 'waitlist')
    const emailRequired = effectiveMode === 'waitlist'
    const label = buttonLabel ?? (effectiveMode === 'try' ? 'Enable & try it' : 'Notify me at launch')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (emailRequired && !EMAIL_RE.test(email)) {
            setError('Please enter a valid email address')
            return
        }
        setSubmitting(true)
        try {
            await enroll({
                flagKey,
                stage,
                email: email || undefined,
                identify,
                eventName,
                extraProps,
            })
            if (confetti) {
                setConfetti(true)
            }
            setSubmitted(true)
            onSuccess?.(email)
        } finally {
            setSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <div className={`@container ${className}`}>
                <div className="text-sm mt-0 mb-0 border border-green rounded-md p-3 bg-green/10 flex flex-col gap-1">
                    <span className="flex items-center gap-1 font-bold">
                        <IconCheckCircle className="size-4 text-green" /> {successTitle}
                    </span>
                    <span>
                        {successMessage ??
                            (effectiveMode === 'try'
                                ? `${productName ?? 'This feature'} is now enabled for you in PostHog.`
                                : `We'll let you know when ${productName ?? 'it'} is ready.`)}
                    </span>
                    {showDiscord && (
                        <Link
                            className="group flex items-center gap-1 text-sm font-medium mt-2"
                            to="https://discord.com/invite/E9xV2WnR98"
                            externalNoIcon
                        >
                            <IconDiscord className="size-6 text-secondary group-hover:text-primary" />
                            <span className="group-hover:underline">Join our Discord</span>
                        </Link>
                    )}
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className={`@container space-y-2 ${className}`}>
            {title && <h3 className="text-lg font-bold mb-2 !mt-0">{title}</h3>}
            <Input
                label="Email"
                type="email"
                size="md"
                direction="column"
                showLabel={false}
                placeholder="Email address"
                value={email}
                autoFocus={autoFocus}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required={emailRequired}
                touched={!!error}
                error={error}
            />
            <OSButton type="submit" variant="primary" size="md" width="full" disabled={submitting}>
                {label}
            </OSButton>
        </form>
    )
}

export default EarlyAccessSignup
