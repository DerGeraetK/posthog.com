import React, { useState } from 'react'
import usePostHog from '../../hooks/usePostHog'
import OSButton from 'components/OSButton'
import EarlyAccessSignup from 'components/EarlyAccessSignup'
import { getFlagKeyForProduct } from 'components/EarlyAccessSignup/flagKeys'

const SURVEY_ID = '019b05b2-973f-0000-8f68-f8326c077146'

export default function DuckDBWaitlistSurvey(): JSX.Element {
    const [showForm, setShowForm] = useState(false)
    const posthog = usePostHog()
    const flagKey = getFlagKeyForProduct('managed_warehouse')

    // Preserve the existing survey response + person property alongside EAF enrollment.
    const handleSuccess = (email: string) => {
        posthog?.capture('survey sent', {
            $survey_id: SURVEY_ID,
            $survey_response: email,
        })
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
            <EarlyAccessSignup
                flagKey={flagKey}
                stage="concept"
                mode="waitlist"
                productName="Managed warehouse"
                buttonLabel="Submit"
                autoFocus
                confetti={false}
                showDiscord={false}
                successMessage="Thanks! You're on the waitlist. We'll be in touch soon."
                eventName="subscribe_to_product_updates"
                extraProps={{ productHandle: 'managed_warehouse' }}
                onSuccess={handleSuccess}
            />
        </div>
    )
}
