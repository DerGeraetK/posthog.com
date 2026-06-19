import React from 'react'
import usePostHog from '../../hooks/usePostHog'
import useProduct from '../../hooks/useProduct'
import EarlyAccessSignup from 'components/EarlyAccessSignup'
import { getFlagKeyForProduct } from 'components/EarlyAccessSignup/flagKeys'

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
    const flagKey = getFlagKeyForProduct(productHandle)

    // Preserve the existing survey response capture (used e.g. by Replay Vision) on top
    // of the unified Early Access Feature enrollment.
    const handleSuccess = (email: string) => {
        if (surveyId) {
            posthog?.capture('survey sent', {
                $survey_id: surveyId,
                $survey_response: email,
            })
        }
    }

    return (
        <EarlyAccessSignup
            flagKey={flagKey}
            stage="concept"
            mode="waitlist"
            productName={productName}
            title={showTitle ? 'Join the waitlist' : undefined}
            buttonLabel={buttonLabel}
            autoFocus={autoFocus}
            confetti={confetti}
            showDiscord={showDiscord}
            eventName="subscribe_to_product_updates"
            extraProps={{ selectedProduct }}
            onSuccess={handleSuccess}
        />
    )
}
