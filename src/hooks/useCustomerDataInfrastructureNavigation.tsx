import { navigate } from 'gatsby'

export const customerDataInfrastructureNav = {
    name: 'Context Warehouse',
    url: '/data-stack',
    children: [
        {
            name: 'Context Warehouse',
            url: '/data-stack',
        },
        {
            name: 'Get data in',
            url: '/data-stack/sources',
        },
        {
            name: 'Data modeling',
            url: '/data-stack/data-modeling',
        },
        {
            name: 'Data warehouse',
            url: '/data-stack/warehouse',
        },
        {
            name: 'Querying data',
            url: '/data-stack/ask-posthog-anything',
        },
        {
            name: 'Data viz & analytics',
            url: '/data-stack/business-intelligence',
        },
        {
            name: 'Self-healing software',
            url: '/data-stack/self-driving',
        },
        {
            name: 'Send data out',
            url: '/data-stack/reverse-etl-export',
        },
    ],
}

export function useCustomerDataInfrastructureNavigation() {
    return {
        navigation: customerDataInfrastructureNav,
        handleNavigate: (url: string) => {
            navigate(url)
        },
    }
}
