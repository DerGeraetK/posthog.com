import React, { useState } from 'react'
import { IconRocket, IconClock } from '@posthog/icons'
import Input from 'components/OSForm/input'
import OSButton from 'components/OSButton'
import SurveySignup from 'components/SurveySignup'
import useEarlyAccessFeatures, { EarlyAccessFeature } from 'hooks/useEarlyAccessFeatures'

// Where in-app betas are toggled on. Betas don't collect an email — we point people here.
const FEATURE_PREVIEWS_URL = 'https://app.posthog.com/settings/feature-previews'
// Only surface the search + filter controls once the list is long enough to need them.
const CONTROLS_THRESHOLD = 8

type StageFilter = 'all' | 'beta' | 'coming-soon'

const Grid = ({ children }: { children: React.ReactNode }): JSX.Element => (
    <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-3">{children}</div>
)

const SectionHeader = ({
    icon,
    title,
    count,
    description,
}: {
    icon: React.ReactNode
    title: string
    count: number
    description: string
}): JSX.Element => (
    <>
        <div className="flex items-center gap-2">
            {icon}
            <h2 className="m-0">{title}</h2>
            <span className="text-sm text-muted font-normal">{count}</span>
        </div>
        <p className="text-secondary mt-1 mb-4 text-sm">{description}</p>
    </>
)

const FeatureCard = ({
    feature,
    children,
}: {
    feature: EarlyAccessFeature
    children?: React.ReactNode
}): JSX.Element => (
    <div
        data-scheme="secondary"
        className="@container bg-primary border border-primary rounded-md p-4 flex flex-col gap-2 h-full"
    >
        <h3 className="text-base @md:text-lg m-0 leading-tight">{feature.name}</h3>
        {feature.description && <p className="text-sm text-secondary m-0 line-clamp-3">{feature.description}</p>}
        {feature.documentationUrl && (
            <div>
                <OSButton asLink to={feature.documentationUrl} external size="sm" variant="underlineOnHover">
                    Read the docs
                </OSButton>
            </div>
        )}
        {children && <div className="mt-auto pt-1">{children}</div>}
    </div>
)

// Coming soon — collect an email via the feature's linked waitlist survey. Reveal the
// field only on intent so the grid stays compact.
const ComingSoonCard = ({ feature }: { feature: EarlyAccessFeature }): JSX.Element => {
    const [showForm, setShowForm] = useState(false)
    const surveyId = feature.payload?.survey_id as string | undefined
    const surveyQuestionId = feature.payload?.survey_question_id as string | undefined

    // Without a linked survey there's nowhere to record the sign-up, so show info only.
    if (!surveyId) {
        return <FeatureCard feature={feature} />
    }

    return (
        <FeatureCard feature={feature}>
            {showForm ? (
                <SurveySignup
                    surveyId={surveyId}
                    surveyQuestionId={surveyQuestionId}
                    productName={feature.name}
                    autoFocus
                    confetti={false}
                    buttonLabel="Notify me at launch"
                />
            ) : (
                <OSButton variant="secondary" size="md" width="full" onClick={() => setShowForm(true)}>
                    Get notified at launch
                </OSButton>
            )}
        </FeatureCard>
    )
}

/**
 * The roadmap's Early Access Feature sections, fetched live from posthog-js so newly
 * added in-app features appear without a rebuild:
 *  - Betas — live now; one CTA points to feature previews to enable them (no email).
 *  - Coming soon — collect an email via each feature's linked waitlist survey.
 * Search + a stage filter keep a long list scannable. Renders nothing when empty.
 */
export default function EarlyAccessFeaturesSection(): JSX.Element | null {
    const { grouped, loading } = useEarlyAccessFeatures()
    const [query, setQuery] = useState('')
    const [stageFilter, setStageFilter] = useState<StageFilter>('all')

    const totalBeta = grouped.beta.length
    const totalComing = grouped.comingSoon.length
    const total = totalBeta + totalComing

    if (loading && total === 0) {
        return <p className="text-muted text-sm">Loading what's new…</p>
    }
    if (total === 0) {
        return null
    }

    const q = query.trim().toLowerCase()
    const matches = (f: EarlyAccessFeature) =>
        !q || f.name.toLowerCase().includes(q) || (f.description || '').toLowerCase().includes(q)
    const beta = grouped.beta.filter(matches)
    const comingSoon = grouped.comingSoon.filter(matches)

    const showBeta = (stageFilter === 'all' || stageFilter === 'beta') && beta.length > 0
    const showComing = (stageFilter === 'all' || stageFilter === 'coming-soon') && comingSoon.length > 0
    const showControls = total > CONTROLS_THRESHOLD

    return (
        <div className="@container">
            {showControls && (
                <div className="flex flex-col @md:flex-row @md:items-center gap-2 @md:gap-4 mb-6">
                    <Input
                        label="Search features"
                        showLabel={false}
                        size="md"
                        type="text"
                        placeholder="Search features…"
                        value={query}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                        showClearButton
                        onClear={() => setQuery('')}
                        containerClassName="w-full @md:max-w-xs"
                    />
                    <div className="flex items-center gap-1">
                        <OSButton
                            size="md"
                            active={stageFilter === 'all'}
                            onClick={() => setStageFilter('all')}
                            label={String(total)}
                        >
                            All
                        </OSButton>
                        <OSButton
                            size="md"
                            active={stageFilter === 'beta'}
                            onClick={() => setStageFilter('beta')}
                            label={String(totalBeta)}
                        >
                            In beta
                        </OSButton>
                        <OSButton
                            size="md"
                            active={stageFilter === 'coming-soon'}
                            onClick={() => setStageFilter('coming-soon')}
                            label={String(totalComing)}
                        >
                            Coming soon
                        </OSButton>
                    </div>
                </div>
            )}

            {showBeta && (
                <section className="mb-10">
                    <SectionHeader
                        icon={<IconRocket className="size-6 text-red dark:text-yellow" />}
                        title="In beta – try it now"
                        count={beta.length}
                        description="These are live. Turn any of them on in your PostHog account."
                    />
                    <div
                        data-scheme="secondary"
                        className="bg-accent border border-primary rounded-md p-3 mb-4 flex flex-col @md:flex-row @md:items-center @md:justify-between gap-2"
                    >
                        <p className="m-0 text-sm text-secondary">Enable betas under Settings → Feature previews.</p>
                        <OSButton
                            asLink
                            to={FEATURE_PREVIEWS_URL}
                            external
                            variant="secondary"
                            size="md"
                            className="@md:shrink-0"
                        >
                            Open feature previews
                        </OSButton>
                    </div>
                    <Grid>
                        {beta.map((feature) => (
                            <FeatureCard key={feature.flagKey} feature={feature} />
                        ))}
                    </Grid>
                </section>
            )}

            {showComing && (
                <section className="mb-10">
                    <SectionHeader
                        icon={<IconClock className="size-6 text-red dark:text-yellow" />}
                        title="Coming soon"
                        count={comingSoon.length}
                        description="Join a waitlist and we'll email you the moment it launches."
                    />
                    <Grid>
                        {comingSoon.map((feature) => (
                            <ComingSoonCard key={feature.flagKey} feature={feature} />
                        ))}
                    </Grid>
                </section>
            )}

            {q && !showBeta && !showComing && <p className="text-muted text-sm">No features match “{query}”.</p>}
        </div>
    )
}
