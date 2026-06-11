import React, { useState, useEffect, useMemo } from 'react'
import SEO from 'components/seo'
import ReaderView from 'components/ReaderView'
import { QuestLog, QuestLogItem } from 'components/Docs/QuestLog'
import { CallToAction } from 'components/CallToAction'
import { ProductScreenshot } from 'components/ProductScreenshot'
import { ProductVideo } from 'components/ProductVideo'
import List from 'components/List'
import Link from 'components/Link'
import CloudinaryImage from 'components/CloudinaryImage'
import { SingleCodeBlock } from 'components/CodeBlock'
import WizardCTA from 'components/WizardCTA'
import usePlatformList from 'hooks/docs/usePlatformList'
import { IconGraph, IconWarning, IconRewindPlay, IconChevronDown } from '@posthog/icons'
import ElevenLabsLogo from 'components/CustomerLogos/ElevenLabsLogo'
import LovableLogo from 'components/CustomerLogos/LovableLogo'
import PostHogLogo from 'components/CustomerLogos/PostHogLogo'

const TOP_COUNT = 8
const PLATFORM_ORDER = [
    '/docs/ai-observability/installation/openai',
    '/docs/ai-observability/installation/anthropic',
    '/docs/ai-observability/installation/langchain',
    '/docs/ai-observability/installation/langgraph',
    '/docs/ai-observability/installation/llamaindex',
    '/docs/ai-observability/installation/vercel-ai',
    '/docs/ai-observability/installation/google',
    '/docs/ai-observability/installation/groq',
    '/docs/ai-observability/installation/mistral',
    '/docs/ai-observability/installation/azure-openai',
    '/docs/ai-observability/installation/crewai',
    '/docs/ai-observability/installation/pydantic-ai',
    '/docs/ai-observability/installation/openai-agents',
    '/docs/ai-observability/installation/claude-agent-sdk',
    '/docs/ai-observability/installation/aws-bedrock',
    '/docs/ai-observability/installation/deepseek',
]

export default function AIObservabilityLanding(): JSX.Element {
    const [showMore, setShowMore] = useState(false)
    const [isIdle, setIsIdle] = useState(false)
    const [openQuestion, setOpenQuestion] = useState<number | null>(null)
    const [installMCPCopied, setInstallMCPCopied] = useState(false)

    const handleCopyMCP = () => {
        navigator.clipboard.writeText('npx @posthog/wizard mcp add')
        setInstallMCPCopied(true)
        setTimeout(() => setInstallMCPCopied(false), 2000)
    }

    const allPlatforms = usePlatformList('docs/ai-observability/installation', 'AI Observability installation')
    const sortedPlatforms = useMemo(() => {
        const indexed = new Map(allPlatforms.map((p) => [p.url, p]))
        const ordered = PLATFORM_ORDER.map((url) => indexed.get(url)).filter(Boolean) as typeof allPlatforms
        const unlisted = allPlatforms.filter((p) => !PLATFORM_ORDER.includes(p.url))
        const all = [...ordered, ...unlisted]
        return { top: all.slice(0, TOP_COUNT), rest: all.slice(TOP_COUNT) }
    }, [allPlatforms])

    useEffect(() => {
        let idleTimer: ReturnType<typeof setTimeout>

        const handleActivity = () => {
            setIsIdle(false)
            clearTimeout(idleTimer)
            idleTimer = setTimeout(() => setIsIdle(true), 2000)
        }

        handleActivity()
        window.addEventListener('pointermove', handleActivity)
        window.addEventListener('keydown', handleActivity)

        const scrollViewport = document.querySelector('[data-radix-scroll-area-viewport]')
        scrollViewport?.addEventListener('scroll', handleActivity)

        return () => {
            clearTimeout(idleTimer)
            window.removeEventListener('pointermove', handleActivity)
            window.removeEventListener('keydown', handleActivity)
            scrollViewport?.removeEventListener('scroll', handleActivity)
        }
    }, [])

    return (
        <>
            <SEO
                title="AI Observability for product engineers"
                description="Track every LLM conversation, know exactly what each model costs, and trace multi-step AI workflows — all in PostHog. Free for your first 100k events per month. No credit card needed."
                noindex
            />
            <ReaderView
                hideLeftSidebar
                hideRightSidebar
                hideTitle
                title="AI Observability for product engineers"
                contentMaxWidthClass="max-w-5xl"
                showQuestions={false}
            >
                <div className="grid grid-cols-1 @lg:grid-cols-[1.2fr_1fr] gap-10 items-center mb-6 max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-3xl md:text-5xl !mb-4">X-ray vision for your AI product</h1>
                        <p className="text-lg md:text-xl mb-6 text-secondary">
                            Track every conversation, trace every LLM call, and know exactly what your models are
                            costing you. Check costs, monitor errors, and analyze model performance from Cursor, Codex,
                            Claude Code, VS Code, or any{' '}
                            <span className="text-gradient-wizard font-semibold whitespace-nowrap">
                                MCP-compatible agent
                            </span>
                            .
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <CallToAction type="primary" size="md" to="https://app.posthog.com/signup">
                                Get started free
                            </CallToAction>
                            <CallToAction
                                type="secondary"
                                size="md"
                                to="/docs/ai-observability"
                                state={{ newWindow: true }}
                            >
                                Read the docs
                            </CallToAction>
                        </div>
                        <p className="text-sm !mb-0 text-secondary">
                            First{' '}
                            <Link to="/docs/ai-observability/start-here" state={{ newWindow: true }}>
                                100k LLM events
                            </Link>{' '}
                            per month are free. Works with OpenAI, Anthropic, LangChain, and{' '}
                            <Link to="/docs/ai-observability/installation" state={{ newWindow: true }}>
                                40+ more
                            </Link>
                            .
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <CloudinaryImage
                            src="https://res.cloudinary.com/dmukukwp6/image/upload/posthog_ai_hogs_d4c45b4550.png"
                            alt="PostHog AI hedgehogs"
                            className="w-full max-w-[450px] mx-auto"
                        />
                    </div>
                </div>

                <div className="mb-12 max-w-7xl mx-auto">
                    <div className="flex flex-wrap items-center gap-x-12 gap-y-6 text-primary dark:text-primary-dark">
                        <LovableLogo className="fill-current object-contain max-w-full h-6" />
                        <ElevenLabsLogo className="fill-current object-contain max-w-full h-8" />
                        <PostHogLogo className="fill-current object-contain max-w-full h-6" />
                    </div>
                    <p className="text-xs mt-3 !mb-0">
                        <span className="font-semibold">AI teams using PostHog AI Observability in production.</span>
                        <br />
                        <span className="text-muted">
                            (Yes, we use it ourselves. Hedgehogs need observability, too.)
                        </span>
                    </p>
                </div>

                <div className={isIdle ? 'quest-idle' : ''}>
                    <QuestLog firstSpeechBubble="Let's get observing!" lastSpeechBubble="Now go build something great!">
                        <QuestLogItem
                            title="Wrap your LLM calls, get instant visibility"
                            subtitle="40+ frameworks and providers supported"
                            icon="IconLlmPromptManagement"
                        >
                            <p>
                                Drop-in SDK wrappers sit in front of your existing LLM calls. Your code barely changes.
                                Inputs, outputs, tokens, cost, latency, model, and provider are captured automatically.
                            </p>

                            <WizardCTA />

                            <h3>Or pick your framework directly</h3>

                            <List
                                className="grid gap-4 grid-cols-2 @md:grid-cols-2 not-prose"
                                items={sortedPlatforms.top}
                            />

                            {showMore && sortedPlatforms.rest.length > 0 && (
                                <List
                                    className="grid gap-4 grid-cols-2 @md:grid-cols-2 not-prose mt-4"
                                    items={sortedPlatforms.rest}
                                />
                            )}

                            <button
                                onClick={() => setShowMore(!showMore)}
                                className="mt-3 text-red dark:text-yellow font-semibold text-sm cursor-pointer hover:underline"
                            >
                                {showMore ? 'Show less' : 'See all integrations'}
                            </button>

                            <div className="mt-4">
                                <CallToAction
                                    type="primary"
                                    size="md"
                                    to="/docs/ai-observability/installation"
                                    state={{ newWindow: true }}
                                >
                                    View all integrations
                                </CallToAction>
                            </div>
                        </QuestLogItem>

                        <QuestLogItem
                            title="Every LLM call, captured in full"
                            subtitle="Inputs, outputs, tokens, cost, and latency — automatically"
                            icon="IconRecord"
                        >
                            <p>
                                Each LLM call becomes a <strong>generation</strong> — a full record of what went in and
                                what came out, with token counts, automatic cost calculation, and latency attached.
                            </p>

                            <ProductVideo
                                videoLight="https://res.cloudinary.com/dmukukwp6/video/upload/ai_generation_in_app_18f37057ca.mp4"
                                videoDark={undefined}
                                classes="rounded border border-primary"
                                autoPlay={true}
                                loop={true}
                            />

                            <ul>
                                <li>Full conversation context — the complete message array, roles and all</li>
                                <li>
                                    Token counts + <strong>automatic cost calculation</strong> per model
                                </li>
                                <li>Response latency, model name, provider, and any tools called</li>
                                <li>Enrichable with user IDs, groups, and custom properties</li>
                            </ul>

                            <div className="mt-4">
                                <CallToAction
                                    type="primary"
                                    size="md"
                                    to="/docs/ai-observability/generations"
                                    state={{ newWindow: true }}
                                >
                                    Learn about generations
                                </CallToAction>
                            </div>
                        </QuestLogItem>

                        <QuestLogItem
                            title="Trace multi-step AI workflows end to end"
                            subtitle="Traces, spans, and sessions for agents, RAG, and pipelines"
                            icon="IconGraph"
                        >
                            <p>
                                Group related LLM calls into <strong>traces</strong>, nest operations into{' '}
                                <strong>spans</strong>, and link traces into <strong>sessions</strong>. The full
                                hierarchy for agentic workflows, RAG pipelines, and multi-turn conversations.
                            </p>

                            <ProductScreenshot
                                imageLight="https://res.cloudinary.com/dmukukwp6/image/upload/llm_generations_b12119af33.png"
                                imageDark="https://res.cloudinary.com/dmukukwp6/image/upload/llm_geneerations_dark_03c996e8ad.png"
                                alt="AI Observability traces"
                                classes="rounded"
                                padding={false}
                                zoom={undefined}
                            />

                            <div className="mt-4">
                                <CallToAction
                                    type="primary"
                                    size="md"
                                    to="/docs/ai-observability/traces"
                                    state={{ newWindow: true }}
                                >
                                    Explore traces
                                </CallToAction>
                            </div>
                        </QuestLogItem>

                        <QuestLogItem
                            title="Your AI dashboard, zero config"
                            subtitle="Costs, latency, errors, and usage — out of the box"
                            icon="IconLineGraph"
                        >
                            <p>
                                First generation in, dashboard on. Costs by model, active users, latency trends, error
                                rates — all pre-built. Fully customizable when you need more.
                            </p>

                            <ProductScreenshot
                                imageLight="https://res.cloudinary.com/dmukukwp6/image/upload/llma_dashboard_c710e66b5e.png"
                                imageDark="https://res.cloudinary.com/dmukukwp6/image/upload/llma_dashboard_dark_aef0f67baf.png"
                                alt="AI Observability dashboard"
                                classes="rounded"
                                padding={false}
                                zoom={undefined}
                            />

                            <div className="mt-4">
                                <CallToAction type="primary" size="md" to="https://app.posthog.com/ai-observability">
                                    Open the dashboard
                                </CallToAction>
                            </div>
                        </QuestLogItem>

                        <QuestLogItem
                            title="AI data meets your product data"
                            subtitle="Analytics, error tracking, and session replay — all connected"
                            icon="IconLogomark"
                        >
                            <p>
                                AI Observability events are standard PostHog events. The whole platform — product
                                analytics, error tracking, session replay — works with your LLM data out of the box.
                            </p>

                            <h3>
                                <IconGraph className="text-blue w-6 -mt-1 inline-block" /> Product analytics
                            </h3>
                            <ProductScreenshot
                                imageLight="https://res.cloudinary.com/dmukukwp6/image/upload/llma_insights_da40edc407.png"
                                imageDark="https://res.cloudinary.com/dmukukwp6/image/upload/llma_insights_dark_558f8f2cd8.png"
                                alt="AI Observability analytics"
                                classes="rounded"
                                padding={false}
                                zoom={undefined}
                            />

                            <h3>
                                <IconWarning className="text-orange w-6 -mt-1 inline-block" /> Error tracking
                            </h3>
                            <ProductScreenshot
                                imageLight="https://res.cloudinary.com/dmukukwp6/image/upload/llma_error_4edcb7d7a1.png"
                                imageDark="https://res.cloudinary.com/dmukukwp6/image/upload/llma_error_dark_a298d3f2b7.png"
                                alt="AI Observability error tracking"
                                classes="rounded"
                                padding={false}
                                zoom={undefined}
                            />

                            <h3>
                                <IconRewindPlay className="text-yellow w-6 -mt-1 inline-block" /> Session replay
                            </h3>
                            <ProductScreenshot
                                imageLight="https://res.cloudinary.com/dmukukwp6/image/upload/llma_session_replay_95b9268668.png"
                                imageDark="https://res.cloudinary.com/dmukukwp6/image/upload/llma_session_replay_dark_767332d926.png"
                                alt="AI Observability session replay"
                                classes="rounded"
                                padding={false}
                                zoom={undefined}
                            />

                            <div className="mt-4">
                                <CallToAction type="primary" size="md" to="https://app.posthog.com/signup">
                                    Get started free
                                </CallToAction>
                            </div>
                        </QuestLogItem>

                        <QuestLogItem
                            title="Query AI traces from your editor"
                            subtitle="MCP tools so your agent can investigate without leaving the IDE"
                            icon="IconSparkles"
                        >
                            <p>
                                Install the PostHog MCP and your coding agent can check costs, monitor errors, compare
                                models, and drill into traces — without opening a browser.
                            </p>

                            <SingleCodeBlock language="bash" showAskAI={false}>
                                npx @posthog/wizard mcp add
                            </SingleCodeBlock>

                            <ul>
                                <li>
                                    <em>"What are my total LLM costs this week, broken down by model?"</em>
                                </li>
                                <li>
                                    <em>"Are there any LLM errors in the last hour?"</em>
                                </li>
                                <li>
                                    <em>"Compare latency between GPT-4 and Claude for the search feature."</em>
                                </li>
                                <li>
                                    <em>"Show me traces where a single call cost more than $0.50."</em>
                                </li>
                            </ul>

                            <div className="flex flex-wrap gap-2 mt-4">
                                <CallToAction type="primary" size="md" onClick={handleCopyMCP}>
                                    {installMCPCopied ? 'Copied! 🚀' : 'Copy install command'}
                                </CallToAction>
                                <CallToAction
                                    type="secondary"
                                    size="md"
                                    to="/docs/ai-observability/query-traces-mcp"
                                    state={{ newWindow: true }}
                                >
                                    MCP docs
                                </CallToAction>
                            </div>
                        </QuestLogItem>

                        <QuestLogItem
                            title="Questions engineers ask us"
                            subtitle="Real questions, honest answers"
                            icon="IconThoughtBubble"
                        >
                            <div className="not-prose divide-y divide-border">
                                {[
                                    {
                                        question: 'How is this different from LangSmith, Langfuse, or Helicone?',
                                        answer: 'Those are LLM-only tools. PostHog is LLM observability plus your product data — analytics, error tracking, session replay — in one place. No correlation across three dashboards.',
                                        url: '',
                                    },
                                    {
                                        question: 'Do I need to rewrite my LLM calls to use the wrappers?',
                                        answer: "Mostly no. Initialize the PostHog client, swap the import, and you're capturing. For LangChain or LlamaIndex it's a callback — you don't touch the core logic.",
                                        url: '/docs/ai-observability/installation',
                                    },
                                    {
                                        question: "What if I don't want PostHog to see my LLM inputs and outputs?",
                                        answer: "Privacy mode captures metadata (tokens, cost, latency, model) without sending conversation content to PostHog. Your users' prompts stay yours.",
                                        url: '/docs/ai-observability/privacy-mode',
                                    },
                                    {
                                        question: 'What happens when I hit the free tier limit?',
                                        answer: 'Usage-based pricing at $0.00006/event. Set billing limits to cap your spend. More than 90% of companies use PostHog completely free.',
                                        url: '/pricing',
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="py-3">
                                        <button
                                            onClick={() => setOpenQuestion(openQuestion === i ? null : i)}
                                            className="w-full text-left flex items-center justify-between gap-4 font-semibold text-sm cursor-pointer hover:text-primary transition-colors"
                                        >
                                            <span>{item.question}</span>
                                            <IconChevronDown
                                                className={`shrink-0 size-4 transition-transform duration-200 ${
                                                    openQuestion === i ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                        {openQuestion === i && (
                                            <div className="mt-2 text-sm">
                                                <p className="text-secondary !mb-2">{item.answer}</p>
                                                {item.url && (
                                                    <Link
                                                        to={item.url}
                                                        state={{ newWindow: true }}
                                                        className="text-red dark:text-yellow font-semibold text-xs hover:underline"
                                                    >
                                                        Read the docs →
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6">
                                <CallToAction type="primary" size="md" to="https://app.posthog.com/signup">
                                    Get started free
                                </CallToAction>
                            </div>
                        </QuestLogItem>

                        <QuestLogItem
                            title="Use for free"
                            subtitle="100k events per month, no credit card"
                            icon="IconPiggyBank"
                            idleGlow
                        >
                            <h3>TL;DR 💸</h3>

                            <ul>
                                <li>No credit card required to start</li>
                                <li>
                                    <strong>First 100k LLM events/mo are free</strong> with 30-day retention
                                </li>
                                <li>
                                    Above 100k: <strong>$0.00006/event</strong> with volume discounts
                                </li>
                                <li>Set billing limits to avoid surprise charges</li>
                                <li>
                                    See{' '}
                                    <Link to="/pricing" state={{ newWindow: true }}>
                                        pricing page
                                    </Link>{' '}
                                    for full details
                                </li>
                            </ul>

                            <hr className="my-6" />

                            <div className="flex flex-wrap gap-2 mt-4">
                                <CallToAction type="primary" size="md" to="https://app.posthog.com/signup">
                                    Get started free
                                </CallToAction>
                                <CallToAction
                                    type="secondary"
                                    size="md"
                                    to="/talk-to-a-human"
                                    state={{ newWindow: true }}
                                >
                                    Talk to a human
                                </CallToAction>
                            </div>
                        </QuestLogItem>
                    </QuestLog>
                </div>

                <div className="text-center py-16 mt-4 opacity-60 hover:opacity-100 transition-opacity duration-500">
                    <p className="text-sm text-secondary italic !mb-4">
                        Your LLMs are burning tokens and you're reading landing pages. Respect. Now go fix that.
                    </p>
                    <CloudinaryImage
                        src="https://res.cloudinary.com/dmukukwp6/image/upload/q_auto,f_auto/Frame_10138_5169832152.png"
                        alt="PostHog hedgehog"
                        className="mx-auto mb-4"
                        imgClassName="w-28 h-auto"
                    />
                    <p className="text-sm text-secondary italic !mb-0">
                        Install the SDK, capture your first generation. Takes about{' '}
                        <Link to="/docs/ai-observability/installation" className="underline">
                            five minutes
                        </Link>
                        .
                    </p>
                </div>
            </ReaderView>
        </>
    )
}
