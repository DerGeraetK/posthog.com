import React, { useEffect } from 'react'
import SEO from 'components/seo'
import ReaderView from 'components/ReaderView'
import Link from 'components/Link'
import { useApp } from '../context/App'
import { useWindow } from '../context/Window'
import { CallToAction } from 'components/CallToAction'

export default function PostHog101(): JSX.Element {
    const { appWindow } = useWindow()
    const { setWindowTitle } = useApp()

    useEffect(() => {
        if (appWindow) {
            setWindowTitle(appWindow, 'PostHog-101.md')
        }
    }, [])

    return (
        <>
            <SEO
                title="PostHog 101"
                updateWindowTitle={false}
                description="PostHog ingests all of your customer data – plus product usage activity – and uses it to improve your product automatically. Here's how it works."
                image="https://res.cloudinary.com/dmukukwp6/image/upload/opengraph_3_cf73189604.png"
                imageType="absolute"
            />
            <ReaderView hideLeftSidebar={true} title="PostHog-101.md" hideTitle>
                <h1>There are a million data companies. What makes PostHog different?</h1>
                <p>
                    PostHog ingests <em>all</em> of your customer data – all the usual stuff like CRM records, support
                    tickets, payment info – <em>plus</em> product usage activity (this is our special sauce) – and uses
                    it all to improve your product or website.
                </p>
                <p>
                    This is useful because the more data we can feed into our AI models, the better product intelligence
                    we can offer you. Not just insights and dashboards, but also automated bug fixes and experiments to
                    improve things like conversion rate – without you having to get involved.
                </p>

                <CallToAction to="https://app.posthog.com/signup" size="sm">
                    Get started - free
                </CallToAction>

                <h2>What is product usage activity?</h2>
                <p>
                    It's not just pageviews and conversion events like you'd track to Google Analytics. It's{' '}
                    <em>everything</em> that happens inside your product or website.
                </p>
                <p>This includes user actions like:</p>
                <ul>
                    <li>which features they've used</li>
                    <li>how far someone scrolled on a page</li>
                    <li>mouse movement</li>
                    <li>clicks on photos, links, text selection, etc</li>
                    <li>what they type into a form</li>
                    <li>if someone rapidly clicks on something like they're frustrated (known as rage clicks)</li>
                </ul>
                <p>
                    (Note: you can limit what kind of data gets collected depending on your specific needs or privacy
                    concerns.)
                </p>
                <p>
                    But product usage activity goes beyond what people see. It also includes what's happening{' '}
                    <em>behind</em> the scenes like:
                </p>
                <ul>
                    <li>browser or network errors</li>
                    <li>page speed and performance logging</li>
                </ul>
                <p>It also extends into things you're testing or building:</p>
                <ul>
                    <li>who saw which version of an experiment or A/B test and if it affected their usage</li>
                    <li>survey responses and user feedback</li>
                    <li>AI features and interactions users had with them</li>
                </ul>

                <h2>Operating from the full lot of data</h2>
                <p>
                    Normally teams operate from siloed data, even after doing loads of transformations to normalize it.
                    But you can get better results when you have the <em>full set of data</em>.
                </p>
                <p>
                    Product teams can cross reference adoption and stickiness with experiments or product launches.
                    Marketing teams can understand which channels led to the best retention based on feature usage. App
                    developers and designers can understand the impact of bug fixes or UI changes. Revenue ops can
                    factor in how feature usage impacts the bottom line.
                </p>
                <p>
                    AI makes it possible to analyze loads more data than humans were ever able to – even with the most
                    talented of data teams and analysts.
                </p>
                <p>
                    Usage data is generated in so many different places, and finally there's a place to put it all to
                    work.
                </p>

                <h2>How PostHog is different from Claude Code and AI code editors</h2>
                <p>
                    It's not just about insights and dashboards. PostHog automatically analyzes usage activity and ships
                    code fixes and product improvements on your behalf. This frees you up to work on more high leverage
                    projects.
                </p>
                <p>
                    Gone are the days of having to triage bugs. For example, when a user hits an error, PostHog is
                    capable of watching the session recording, understanding intent, checking for other instances of the
                    same issue or related issues, and creating a pull request to solve it – all without you needing to
                    tell AI to do it.
                </p>
                <p>
                    That's the biggest difference. See, Claude Code, Codex, and other AI code editors have access to
                    your code – and using MCPs they may have access to analytics, error tracking, and a CRM, but they
                    mostly just write code and <em>ignore</em> all the context that you're likely thinking about as a
                    human. And they don't just run themselves.
                </p>
                <p>
                    And that's where PostHog comes in. PostHog helps you run a{' '}
                    <Link to="/data-stack/self-driving">self-driving product</Link> so you can focus on what matters,
                    not all the busywork that usually gets in the way.
                </p>
            </ReaderView>
        </>
    )
}
