import React from 'react'
import usePostHog from '../../hooks/usePostHog'
import useProduct from '../../hooks/useProduct'
import SurveySignup from 'components/SurveySignup'

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

    // Keep the product-updates analytics event alongside the survey response.
    const handleSuccess = (email: string) => {
        posthog?.capture('subscribe_to_product_updates', { email, selectedProduct })
    }

    return (
        <SurveySignup
            surveyId={surveyId}
            productName={productName}
            title={showTitle ? 'Join the waitlist' : undefined}
            buttonLabel={buttonLabel}
            autoFocus={autoFocus}
            confetti={confetti}
            showDiscord={showDiscord}
            successMessage={
                <>
                    We&apos;ll let you know when <span className="inline-block">{productName}</span> is ready.
                </>
            }
            onSuccess={handleSuccess}
        />
    )
}
