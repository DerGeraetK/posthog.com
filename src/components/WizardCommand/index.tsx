import React, { useState } from 'react'
import { IconCopy, IconChevronRight, IconCheck, IconArrowUpRight } from '@posthog/icons'
import useCloud from 'hooks/useCloud'
import { useToast } from '../../context/Toast'
import Link from 'components/Link'
import ZoomHover from 'components/ZoomHover'

const variantStyles: Record<string, string> = {
    default: 'bg-white text-black',
    bordered: 'bg-white text-black border border-primary shadow-sm',
}

export default function WizardCommand({
    className = '',
    command = '',
    selfDriving = false,
    latest = true,
    simple = false,
    slim = false,
    variant = 'default',
    onCopy,
}: {
    className?: string
    command?: string
    selfDriving?: boolean
    latest?: boolean
    simple?: boolean
    slim?: boolean
    variant?: keyof typeof variantStyles
    onCopy?: () => void
}): JSX.Element {
    const cloud = useCloud()
    const { addToast } = useToast()
    const [copyKey, setCopyKey] = useState(0)
    // `selfDriving` is shorthand for the `self-driving` subcommand; `command` is the escape hatch
    // for any other subcommand.
    const subcommand = selfDriving ? 'self-driving' : command
    // The copied command always includes `-y` (auto-confirms the npx prompt); the displayed command
    // never shows it. `latest` controls whether `@latest` is present at all; `simple` additionally
    // hides `@latest` from the display (the copy still pins it for freshness).
    const buildCode = (withYes: boolean, withLatest: boolean) =>
        `npx ${withYes ? '-y ' : ''}@posthog/wizard${withLatest ? '@latest' : ''}${subcommand ? ` ${subcommand}` : ''}${
            cloud ? ` --region ${cloud}` : ''
        }`
    const displayCode = buildCode(false, simple ? false : latest)
    const copyCode = buildCode(true, latest)

    const handleCopy = () => {
        navigator.clipboard.writeText(copyCode)
        setCopyKey((k) => k + 1)
        onCopy?.()
        addToast({
            description: (
                <span className="inline-flex items-center gap-1.5">
                    <IconCheck className="size-4 text-green" />
                    Copied to clipboard
                </span>
            ),
            duration: 2000,
        })
    }

    return (
        <div className="inline-flex flex-col not-prose">
            <ZoomHover size="lg">
                <button
                    onClick={handleCopy}
                    className={`group inline-flex items-center gap-2 ${
                        variantStyles[variant] || variantStyles.default
                    } font-mono text-sm px-2 py-1.5 cursor-pointer ${
                        !slim ? 'rounded-t-md relative z-10 border border-primary' : 'rounded-md'
                    } ${className}`}
                >
                    <IconChevronRight className="size-4 opacity-50" />
                    <span className="relative mr-1">
                        <code className="!bg-transparent !p-0 !border-0 text-gradient-wizard select-none">
                            {displayCode}
                        </code>
                        {copyKey > 0 && (
                            <code
                                key={copyKey}
                                className="!bg-transparent !p-0 !border-0 absolute inset-0 text-[#36C46F] pointer-events-none text-gradient-wizard-flash"
                                aria-hidden="true"
                            >
                                {displayCode}
                            </code>
                        )}
                    </span>
                    <IconCopy className="size-4 opacity-60 group-hover:opacity-80" />
                </button>
            </ZoomHover>
            {!slim && (
                <Link
                    to="/wizard"
                    state={{ newWindow: true }}
                    className="group relative -top-2 flex gap-px justify-center items-center pt-3 pr-2 pl-5 pb-1 text-xs text-secondary hover:text-primary mx-1.5 border-b border-x border-primary bg-accent/50 hover:bg-hover/100 rounded-b-md text-center"
                >
                    Learn more
                    <IconArrowUpRight className="invisible group-hover:visible inline-block size-3 opacity-75 relative" />
                </Link>
            )}
        </div>
    )
}
