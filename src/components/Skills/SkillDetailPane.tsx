import React from 'react'
import { IconCopy, IconExternal, IconArrowUpRight } from '@posthog/icons'
import ScrollArea from 'components/RadixUI/ScrollArea'
import Link from 'components/Link'
import Tooltip from 'components/RadixUI/Tooltip'
import { useToast } from '../../context/Toast'
import { Skill, getRelatedSkills, useResolveSkillResources } from 'hooks/skills'
import FlowChips from './FlowChips'

const POSTHOG_APP_URL = 'https://app.posthog.com'

/** Opens PostHog and pre-fills the prompt into Max (the AI) via the side-panel hash. */
function openInPostHogUrl(prompt: string): string {
    return `${POSTHOG_APP_URL}/#panel=max:${encodeURIComponent(prompt)}`
}

function PromptActions({ prompt }: { prompt: string }) {
    const { addToast } = useToast()

    const copy = () => {
        navigator.clipboard?.writeText(prompt)
        addToast({ description: 'Prompt copied to clipboard' })
    }

    const actionClasses = 'inline-flex p-1 rounded-sm text-secondary hover:text-primary hover:bg-accent'

    return (
        <div className="flex items-center gap-0.5 flex-shrink-0">
            <Tooltip
                delay={200}
                trigger={
                    <button type="button" aria-label="Copy prompt" onClick={copy} className={actionClasses}>
                        <IconCopy className="size-4" />
                    </button>
                }
            >
                Copy prompt
            </Tooltip>
            <Tooltip
                delay={200}
                trigger={
                    <a
                        href={openInPostHogUrl(prompt)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open in PostHog"
                        className={actionClasses}
                    >
                        <IconExternal className="size-4" />
                    </a>
                }
            >
                Open in PostHog
            </Tooltip>
        </div>
    )
}

function TagChip({ tag, onClick }: { tag: string; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="text-xs rounded-sm border border-primary px-1.5 py-0.5 text-secondary hover:text-primary hover:border-secondary"
        >
            {tag}
        </button>
    )
}

export default function SkillDetailPane({
    skill,
    allSkills,
    onSelectSkill,
    onNavigateToDepartment,
    onNavigateToProduct,
}: {
    skill: Skill | null
    allSkills: Skill[]
    onSelectSkill: (skill: Skill) => void
    onNavigateToDepartment: (tag: string) => void
    onNavigateToProduct: (handle: string) => void
}) {
    const resources = useResolveSkillResources(skill?.resources ?? [])
    const related = skill ? getRelatedSkills(skill, allSkills) : []

    if (!skill) {
        return (
            <div
                data-scheme="primary"
                className="flex flex-1 min-h-0 self-stretch items-center justify-center p-8 text-secondary text-sm"
            >
                Select a skill to see the workflow and products involved.
            </div>
        )
    }

    return (
        <ScrollArea
            dataScheme="primary"
            className="flex flex-1 min-h-0 min-w-0 self-stretch h-full"
            viewportClasses="p-4 @md:p-6"
        >
            <div className="@container max-w-2xl space-y-5">
                <div>
                    <h2 className="text-xl font-bold m-0 mb-2">{skill.name}</h2>
                    <p className="text-sm m-0 leading-relaxed">{skill.description}</p>
                    {skill.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {skill.tags.map((tag) => (
                                <TagChip key={tag} tag={tag} onClick={() => onNavigateToDepartment(tag)} />
                            ))}
                        </div>
                    )}
                </div>

                {skill.example_prompts && skill.example_prompts.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold m-0 mb-2">Input</h3>
                        <ul className="list-none m-0 p-0 space-y-1.5">
                            {skill.example_prompts.map((prompt, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-2 bg-accent/40 border border-primary rounded-md px-2.5 py-2"
                                >
                                    <span className="flex-1 min-w-0 text-sm leading-relaxed">{prompt}</span>
                                    <PromptActions prompt={prompt} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-x-8 gap-y-5 @md:grid-cols-2">
                    {skill.flow.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold m-0 mb-2">Recipe</h3>
                            <FlowChips flow={skill.flow} />
                        </div>
                    )}

                    {resources.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold m-0 mb-2">Tools used</h3>
                            <ul className="list-none m-0 p-0 space-y-1.5">
                                {resources.map((resource) => (
                                    <li
                                        key={`${resource.handle}-${resource.name}`}
                                        className="flex items-center flex-wrap gap-x-2 gap-y-0.5"
                                    >
                                        <resource.Icon className={`size-4 flex-shrink-0 text-${resource.color}`} />
                                        {resource.href ? (
                                            <Link
                                                to={resource.href}
                                                state={{ newWindow: true }}
                                                className="text-sm font-semibold hover:underline"
                                            >
                                                {resource.name}
                                            </Link>
                                        ) : (
                                            <span className="text-sm font-semibold">{resource.name}</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => onNavigateToProduct(resource.handle)}
                                            className="inline-flex items-center gap-0.5 text-xs text-secondary hover:text-primary"
                                        >
                                            skills
                                            <IconArrowUpRight className="size-3" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {related.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold m-0 mb-2">Related skills</h3>
                        <ul className="list-none m-0 p-0 space-y-2">
                            {related.map((relatedSkill) => (
                                <li key={relatedSkill.id} className="text-sm leading-relaxed">
                                    <button
                                        type="button"
                                        onClick={() => onSelectSkill(relatedSkill)}
                                        className="align-middle text-red dark:text-yellow font-semibold hover:underline"
                                    >
                                        {relatedSkill.name}
                                    </button>{' '}
                                    {relatedSkill.tags.length > 0 && (
                                        <span className="inline-block align-middle whitespace-nowrap">
                                            {relatedSkill.tags.map((tag) => (
                                                <span key={tag} className="ml-1">
                                                    <TagChip tag={tag} onClick={() => onNavigateToDepartment(tag)} />
                                                </span>
                                            ))}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </ScrollArea>
    )
}
