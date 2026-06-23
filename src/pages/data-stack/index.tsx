import React, { useEffect } from 'react'
import SEO from 'components/seo'
import ReaderView from 'components/ReaderView'
import { IconCheck, IconX } from '@posthog/icons'
import { customerDataInfrastructureNav } from '../../hooks/useCustomerDataInfrastructureNavigation'
import { TreeMenu } from 'components/TreeMenu'
import { useApp } from '../../context/App'
import { useWindow } from '../../context/Window'
import OSTable from 'components/OSTable'

const LeftSidebarContent = () => {
    return <TreeMenu items={customerDataInfrastructureNav.children} />
}

type CellStatus = 'yes' | 'no' | 'limited'

type ComparisonRow = {
    feature: string
    description: string
    dataWarehouse: CellStatus
    contextWarehouse: CellStatus
}

const comparisonData: ComparisonRow[] = [
    {
        feature: 'Customer data',
        description: 'CRM, billing/revenue, ad spend, ERP',
        dataWarehouse: 'yes',
        contextWarehouse: 'yes',
    },
    {
        feature: 'Business context',
        description:
            'AI skills, code repositories, discussions (Slack), strategy (Notion, Google Docs), roadmap (Linear, GitHub issues)',
        dataWarehouse: 'no',
        contextWarehouse: 'yes',
    },
    {
        feature: 'Modeled context',
        description: 'Shared metrics and definitions around activation, churn, power users, etc',
        dataWarehouse: 'yes',
        contextWarehouse: 'yes',
    },
    {
        feature: 'Product usage data',
        description: 'Auto capture, custom events, AI interactions, errors, logs, experiments, surveys',
        dataWarehouse: 'limited',
        contextWarehouse: 'yes',
    },
    {
        feature: 'Qualitative signals',
        description: 'Support tickets, surveys, feedback, online brand mentions',
        dataWarehouse: 'no',
        contextWarehouse: 'yes',
    },
]

const StatusCell = ({ status }: { status: CellStatus }) => {
    if (status === 'yes') return <IconCheck className="size-6 text-green" />
    if (status === 'no') return <IconX className="size-6 text-red" />
    return <span className="text-sm text-secondary">Limited</span>
}

export default function ContextWarehouse(): JSX.Element {
    const { appWindow } = useWindow()
    const { setWindowTitle } = useApp()

    useEffect(() => {
        if (appWindow) {
            setWindowTitle(appWindow, 'context-warehouse.md')
        }
    }, [])

    const columns = [
        { name: '', width: 'minmax(200px, 3fr)', align: 'left' as const },
        { name: 'Data warehouse', width: 'minmax(130px, 1fr)', align: 'center' as const },
        { name: 'Context warehouse', width: 'minmax(150px, 1fr)', align: 'center' as const },
    ]

    const rows = comparisonData.map((row) => ({
        cells: [
            {
                content: (
                    <>
                        <span className="font-bold">{row.feature}</span>
                        <p className="text-sm !my-0">{row.description}</p>
                    </>
                ),
            },
            { content: <StatusCell status={row.dataWarehouse} />, className: '!justify-center' },
            { content: <StatusCell status={row.contextWarehouse} />, className: '!justify-center' },
        ],
    }))

    return (
        <>
            <SEO
                title="Context Warehouse"
                updateWindowTitle={false}
                description="A context warehouse is a more complete system than a data warehouse, built for agents, giving them the context they need to analyze data and take action on it."
                image="https://res.cloudinary.com/dmukukwp6/image/upload/opengraph_3_cf73189604.png"
                imageType="absolute"
            />
            <ReaderView leftSidebar={<LeftSidebarContent />} title="Introducing the Context Warehouse">
                <h2>Agents need more than a data warehouse</h2>
                <p>
                    Data warehouses were built for reporting. They typically ingest CRM records, Stripe charges,
                    database records, and ad spend data. While they can contain vast amounts of customer data, they
                    aren't natively built to handle first-party data generated inside your product.
                </p>
                <p>
                    <strong>
                        A context warehouse is a more complete system, built for agents, to give them context they need
                        to analyze data and take action on it.
                    </strong>{' '}
                    It covers the gamut of pipelines, first-party activity, transformation, and data exports.
                </p>

                <h2>The missing context layers</h2>
                <p>The richest signals don't come from Salesforce or Stripe – they come from:</p>
                <ul>
                    <li>
                        <strong>Behavioral data</strong> – What your users are doing (or not doing) inside your product
                        (Things like sessions, clicks, form interactions, errors, and rage clicks are examples of
                        behavioral data that no third-party tool generates)
                    </li>
                    <li>
                        <strong>Business context</strong> – Internal planning and communication with your team
                    </li>
                </ul>
                <p>
                    These are the gaps a context warehouse fills. It's not a different kind of data warehouse – it's a
                    more complete one. One where usage signals and business context are supplied to agents so they're
                    not coding in context silos.
                </p>

                <OSTable columns={columns} rows={rows} rowAlignment="top" editable={false} />
            </ReaderView>
        </>
    )
}
