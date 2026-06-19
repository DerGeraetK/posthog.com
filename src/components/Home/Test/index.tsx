'use client'

import React, { useEffect, useState } from 'react'
import WhyPostHogReader from 'components/WhyPostHog'
import SEO from 'components/seo'
import { useApp } from '../../../context/App'
import { useWindow } from '../../../context/Window'
import ControlHero from 'components/Home/Sections/Hero'
import DataStackSection from 'components/Home/Sections/DataStackSection'
import PricingSection from 'components/Home/Sections/PricingSection'
import AISection from 'components/Home/Sections/AISection'
import WhyPostHogSection from 'components/Home/Sections/WhyPostHogSection'
import BedtimeReadingSection from 'components/Home/Sections/BedtimeReadingSection'
import ShamelessCTASection from 'components/Home/Sections/ShamelessCTASection'
import HitCounter from 'components/Home/HitCounter'
import Link from 'components/Link'
import Tooltip from 'components/RadixUI/Tooltip'
import { IconArrowUpRight, IconHeadset, IconPlayFilled } from '@posthog/icons'
import { IconMCP } from 'components/OSIcons'
import Logo from 'components/Logo'
import usePostHog from 'hooks/usePostHog'
import { APP_COUNT } from '../../../constants'
import { CallToAction } from 'components/CallToAction'
import { ToggleGroup, ToggleOption } from 'components/RadixUI/ToggleGroup'
import CloudinaryImage from 'components/CloudinaryImage'
import IntegrationPrompt from 'components/IntegrationPrompt'
import { motion } from 'framer-motion'
import HeroCarousel from 'components/Home/HeroCarousel'
import { buildTabs } from 'components/Home/HeroCarousel/tabs'
// NOTE: `components/PlatformInstall` (index/IconButton/schema/CopyableCommand), the new
// `Logomark*` icons added to `components/OSIcons/Icons.tsx`, and the `canvas-confetti`
// dependency are all VENDORED VERBATIM from the `9000` branch — kept byte-identical to that
// branch on purpose. When 9000 lands, the additions will be identical on both sides and 3-way
// merge cleanly (no conflicts). Do NOT edit the vendored files here to avoid diverging from
// 9000; tweak the install UI via the schema prop instead. This homepage integration (Tagline,
// GetStarted, the carousel) is the only PostHog.com-side glue and is not present on 9000.
import PlatformInstall, { wizardInstallSchema } from 'components/PlatformInstall'
import { RenderInClient } from 'components/RenderInClient'
import Customers from '../Customers'
import { Typecaast } from '@typecaast/react'
import configSlack from './typecaast-slack.json'
import configCursor from './typecaast-cursor.json'

const AppCount = () => <span className="text-xs font-normal">{APP_COUNT} apps</span>

// @PostHog styled as a Slack-style mention chip, with a tooltip explaining the Slackbot.
const PostHogMention = () => {
    const [open, setOpen] = useState(false)
    return (
        <Tooltip
            delay={0}
            open={open}
            onOpenChange={setOpen}
            trigger={
                <span className="bg-blue/10 dark:bg-blue/20 text-blue rounded-md px-1 font-bold whitespace-nowrap cursor-help">
                    @PostHog
                </span>
            }
        >
            {/* Dismiss when the link inside is clicked */}
            <div
                data-scheme="primary"
                className="text-primary [&_*]:text-primary max-w-xs text-sm leading-normal font-normal prose"
                onClick={() => setOpen(false)}
            >
                <h3>How it works</h3>
                <ol>
                    <li>Add PostHog to your app</li>
                    <li>
                        <Link
                            to="https://posthog.slack.com/marketplace/A03M3FN0RSQ-posthog"
                            externalNoIcon
                            className="group underline font-semibold"
                        >
                            Install PostHog Slackbot{' '}
                            <IconArrowUpRight className="size-4 inline-block text-secondary group-hover:text-primary" />
                        </Link>
                    </li>
                    <li>
                        Tag <code>@PostHog</code> in any Slack thread to ship a fix, ask a data question, or edit
                        content – without leaving the conversation.
                    </li>
                </ol>
            </div>
        </Tooltip>
    )
}

const Tagline = () => (
    <>
        <h1 className="!text-3xl pt-4">
            Just ask <PostHogMention />.
        </h1>
        <HeroImage />
        <p className="text-balance @xl:text-wrap text-lg">
            <PostHogMention /> knows your product, customers, and what needs fixing. It answers questions, triages work,
            writes code, and is always working even when you don't prompt it.
        </p>

        <p className="text-balance @xl:text-wrap text-secondary">
            500,000+ teams are shipping with PostHog. Don't get fomo.
        </p>
    </>
)

const SecondaryActions = () => (
    <p className="!text-sm flex flex-wrap items-center gap-2 justify-center @xl:min-w-96 @xl:max-w-md">
        <Link
            to="/docs/model-context-protocol"
            state={{ newWindow: true }}
            className="text-secondary hover:text-primary"
        >
            <IconMCP className="size-4 mr-1 inline-block relative -top-px" />
            <span className="underline font-semibold">MCP</span>
        </Link>
        <span className="text-secondary">•</span>
        <Link to="/demo" state={{ newWindow: true }} className="text-secondary hover:text-primary">
            <IconPlayFilled className="size-4 mr-1 inline-block relative -top-px" />
            <span className="underline font-semibold">Watch a demo</span>
        </Link>
        <span className="text-secondary">•</span>
        <Link to="/talk-to-a-human" state={{ newWindow: true }} className="text-secondary hover:text-primary">
            <IconHeadset className="size-4 mr-1 inline-block relative -top-px" />
            <span className="underline font-semibold">Talk to a human</span>
        </Link>
    </p>
)

export const GetStarted = () => (
    <div className="mt-6 flex flex-col items-center @xl:items-start">
        <PlatformInstall schema={wizardInstallSchema} />
        <SecondaryActions />
    </div>
)

export const CTAs = () => {
    const [showIntegrationPrompt, setShowIntegrationPrompt] = useState(false)
    return (
        <div>
            <div className="flex flex-col @xs:flex-row @xs:justify-center @xl:justify-start gap-3 @sm:gap-2">
                <CallToAction
                    to="https://app.posthog.com/signup"
                    size="md"
                    state={{ newWindow: true, initialTab: 'signup' }}
                >
                    Get started - free
                </CallToAction>
                <CallToAction
                    type="secondary"
                    size="md"
                    onClick={() => setShowIntegrationPrompt((current) => !current)}
                >
                    Install with AI
                </CallToAction>
            </div>
            <motion.div
                className="overflow-hidden"
                initial={{ height: 0 }}
                animate={{ height: showIntegrationPrompt ? 'auto' : 0 }}
            >
                <div
                    data-scheme="secondary"
                    className="mt-4 p-4 border border-primary rounded-md bg-primary [&_h3]:mt-0 [&_ul]:mb-0 [&_ul]:p-0"
                >
                    <IntegrationPrompt />
                </div>
            </motion.div>
            {/* @TODO(data-positioning): Restore the original test CTA row below once this experiment no longer needs control-matching primary buttons.
            Existing test CTA row retained for reference:
            <div className="flex gap-2 items-center">
                <div className="flex items-center gap-1">
                    <WizardCommand latest={false} slim className="border border-primary" />
                    <Tooltip trigger={<IconInfo className="size-4 text-primary inline-block" />}>
                        <div className="max-w-sm">
                            <p className="text-sm mb-1">
                                <strong className="block mb-1">Add PostHog to your project in ~8 minutes.</strong>
                            </p>
                            <p className="text-sm mb-0">
                                <Link to="/wizard" state={{ newWindow: true }}>
                                    <span className="underline font-bold">Learn more</span>{' '}
                                    <IconArrowUpRight className="size-4 inline-block" />
                                </Link>
                            </p>
                        </div>
                    </Tooltip>
                </div>
                <span className="text-sm">or </span>
                <CallToAction
                    to="https://app.posthog.com/signup"
                    size="sm"
                    state={{ newWindow: true, initialTab: 'signup' }}
                    type="plain"
                    className=""
                >
                    signup with email
                </CallToAction>
            </div>
            */}
            <div className="mt-4">
                <SecondaryActions />
            </div>
        </div>
    )
}

const heroImageTabs: ToggleOption[] = [
    { label: 'Slack', value: 'slack', default: true },
    { label: 'Cursor', value: 'cursor' },
]

function HeroImage(): JSX.Element {
    const { siteSettings } = useApp()
    const isDark = siteSettings.theme === 'dark'
    const [activeTab, setActiveTab] = useState('slack')

    return (
        <div className="max-w-[400px] mx-auto mt-4 @xl:mx-0 @2xl:float-right @2xl:ml-4 @2xl:w-72 @3xl:w-80 @4xl:w-96 @2xl:-mt-20 transition-all">
            <ToggleGroup
                title="View"
                hideTitle
                options={heroImageTabs}
                value={activeTab}
                onValueChange={(value) => value && setActiveTab(value)}
                className="mb-2 w-max mx-auto"
            />
            <aside className="h-[420px] border border-primary rounded shadow-xl overflow-hidden leading-[0]">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                >
                    {activeTab === 'slack' ? (
                        <Typecaast
                            config={configSlack}
                            autoplay
                            isolate
                            theme={isDark ? 'dark' : 'light'}
                            className="overflow-hidden rounded"
                        />
                    ) : null}
                    {activeTab === 'cursor' ? (
                        <Typecaast
                            config={configCursor}
                            autoplay
                            isolate
                            theme={isDark ? 'dark' : 'light'}
                            className="overflow-hidden rounded"
                        />
                    ) : null}
                </motion.div>
            </aside>
        </div>
    )
}

function TestHero(): JSX.Element {
    return (
        <>
            <div className="text-center @xl:text-left mb-12">
                <h1 className="[&_p]:m-0 flex gap-1 flex-wrap justify-center @xl:justify-start !text-2xl mb-8 pt-2">
                    <Logo className="max-w-[157px]" />
                </h1>

                <Tagline />

                <GetStarted />
            </div>

            <HeroCarousel tabs={buildTabs} />
        </>
    )
}

function Hero(): JSX.Element {
    const posthog = usePostHog()
    return (
        <RenderInClient
            placeholder={<></>}
            render={() =>
                posthog?.getFeatureFlag?.('homepage-slack-test', { fresh: true }) === 'test' ? (
                    <TestHero />
                ) : (
                    <ControlHero />
                )
            }
        />
    )
}

export default function HomeTest() {
    const { appWindow } = useWindow()
    const { setWindowTitle } = useApp()

    useEffect(() => {
        if (appWindow) {
            setWindowTitle(appWindow, 'home.mdx')
        }
    }, [])

    return (
        <>
            <SEO
                title="PostHog – We make dev tools for product engineers"
                updateWindowTitle={false}
                description="All your developer tools in one place. PostHog gives engineers everything to build, test, measure, and ship successful products faster. Get started free."
                image="/images/og/default.png"
            />
            <WhyPostHogReader hideTitle proseSize="lg" showQuestions={false} hideRightSidebar>
                <div className="space-y-12">
                    <Hero />
                    <Customers />
                    <DataStackSection />
                    <PricingSection />
                    <AISection />
                    <WhyPostHogSection />
                    <BedtimeReadingSection />
                    <ShamelessCTASection />
                    <HitCounter />
                </div>
            </WhyPostHogReader>
        </>
    )
}
