import React, { useState } from 'react'
import usePostHog from '../../hooks/usePostHog'
import OSButton from 'components/OSButton'
import SurveySignup from 'components/SurveySignup'

const SURVEY_ID = '019b05b2-973f-0000-8f68-f8326c077146'

export default function DuckDBWaitlistSurvey(): JSX.Element {
    const [showForm, setShowForm] = useState(false)
    const posthog = usePostHog()

    // Preserve the existing person-property flag used by downstream follow-up.
    const handleSuccess = () => {
        posthog?.setPersonProperties({ duckdb_waitlist: true })
    }

    if (!showForm) {
        return (
            <OSButton onClick={() => setShowForm(true)} variant="primary" size="md">
                Join the waitlist
            </OSButton>
        )
    }

    return (
        <div
            data-scheme="secondary"
            className="@container bg-primary dark:bg-dark border border-primary rounded-md p-4"
        >
            <SurveySignup
                surveyId={SURVEY_ID}
                productName="Managed warehouse"
                buttonLabel="Submit"
                autoFocus
                confetti={false}
                successMessage="Thanks! You're on the waitlist. We'll be in touch soon."
                onSuccess={handleSuccess}
            />
        </div>
    )
}
