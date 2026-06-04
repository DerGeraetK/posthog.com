import React from 'react'
import { IconGraph } from '@posthog/icons'
import Link from 'components/Link'
import { useFlowToolResolver } from 'hooks/skills'

/**
 * Renders a skill's `flow` (an ordered chain of PostHog MCP tool handles) as a
 * sequence of chips. Each chip shows the tool name in monospace next to the
 * icon of the product it belongs to, linked to that product's page when known.
 * Tools we can't map to a product render as a neutral chip.
 */
export default function FlowChips({ flow }: { flow: string[] }): JSX.Element {
    const resolveTool = useFlowToolResolver()

    return (
        <ol className="list-none flex flex-wrap items-center gap-1.5 m-0 p-0">
            {flow.map((tool, i) => {
                const { product } = resolveTool(tool)
                const Icon = product?.Icon ?? IconGraph
                const iconColor = product?.color ? `text-${product.color}` : 'text-secondary'

                const inner = (
                    <>
                        <Icon className={`size-3.5 flex-shrink-0 ${iconColor}`} />
                        <span className="font-mono text-xs truncate">{tool}</span>
                    </>
                )

                const chipClasses =
                    'inline-flex items-center gap-1 rounded-sm border border-primary px-1.5 py-1 bg-accent/30 dark:bg-accent-dark/30'

                return (
                    <li key={`${tool}-${i}`} className="inline-flex items-center gap-1.5">
                        {product?.href ? (
                            <Link
                                to={product.href}
                                state={{ newWindow: true }}
                                title={product.name}
                                className={`${chipClasses} hover:bg-accent dark:hover:bg-accent-dark`}
                            >
                                {inner}
                            </Link>
                        ) : (
                            <span className={`${chipClasses} text-secondary`} title={product?.name ?? tool}>
                                {inner}
                            </span>
                        )}
                        {i < flow.length - 1 && (
                            <span aria-hidden className="text-secondary text-xs select-none">
                                →
                            </span>
                        )}
                    </li>
                )
            })}
        </ol>
    )
}
