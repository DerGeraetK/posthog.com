import React from 'react'
import Editor from 'components/Editor'
import OSTabs from 'components/OSTabs'
import SEO from 'components/seo'
import EarlyAccessFeaturesSection from 'components/Roadmap/EarlyAccessFeaturesSection'
import { useCompanyNavigation } from 'hooks/useCompanyNavigation'

const RoadmapPage = () => {
    const { tabs, handleTabChange, tabContainerClassName, className } = useCompanyNavigation({
        value: '/roadmap',
        content: (
            <div className="p-4 @xl:p-8">
                <h1>Roadmap</h1>
                <p className="text-secondary max-w-2xl">
                    See what's new in beta and what's coming next. Try betas now, or join a waitlist and we'll email you
                    the moment it ships.
                </p>
                <EarlyAccessFeaturesSection />
            </div>
        ),
    })

    return (
        <>
            <SEO
                title="Roadmap – PostHog"
                description="See what we're building next"
                image={`/images/og/roadmap.jpg`}
            />
            <Editor
                hasTabs
                type="roadmap"
                proseSize="base"
                maxWidth="100%"
                bookmark={{
                    title: 'Roadmap',
                    description: "See what we're building next",
                }}
            >
                <OSTabs
                    tabs={tabs}
                    defaultValue="/roadmap"
                    onValueChange={handleTabChange}
                    padding
                    contentPadding={false}
                    tabContainerClassName={tabContainerClassName}
                    className={className}
                    triggerDataScheme="primary"
                    centerTabs
                />
            </Editor>
        </>
    )
}

export default RoadmapPage
