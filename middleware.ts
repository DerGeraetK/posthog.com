import { next, rewrite } from '@vercel/edge'

// Vercel Edge Middleware runs *before* the filesystem layer, which is exactly
// why this lives here instead of in `vercel.json`. Config rewrites only run as a
// filesystem fallback — and Gatsby emits a static `index.html` for every docs and
// handbook page, so an Accept-based rewrite in `vercel.json` never fires. Running
// here lets us intercept the request and serve the pre-generated `.md` instead.
//
// The raw Markdown files are produced at build time by `gatsby/rawMarkdownUtils.ts`
// (`generateRawMarkdownPages`) and live alongside the HTML at `<path>.md`.

export const config = {
    // Only docs and handbook pages have generated `.md` counterparts.
    // Keep this in sync with MARKDOWN_CONTENT_PATHS in src/constants/index.ts.
    matcher: ['/docs/:path*', '/handbook/:path*'],
}

// Known AI assistant and crawler user-agents that should receive raw Markdown even
// when they don't send an `Accept: text/markdown` header. Most agents (including
// plain `fetch`-based tools) won't negotiate, so user-agent matching is what makes
// this work in practice.
const AI_USER_AGENTS =
    /(GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-User|Claude-SearchBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|Google-Extended|Applebot-Extended|Bytespider|CCBot|cohere-ai|DuckAssistBot|meta-externalagent|Amazonbot|YouBot|AI2Bot|Diffbot|Timpibot|omgili)/i

export default function middleware(request: Request): Response {
    const url = new URL(request.url)
    const { pathname } = url

    // Never touch requests that already target a concrete file (e.g. the raw `.md`
    // itself, sitemaps, images). Doc/handbook slugs never contain a dot.
    if (/\.[a-z0-9]+$/i.test(pathname)) {
        return next()
    }

    const accept = request.headers.get('accept') || ''
    const userAgent = request.headers.get('user-agent') || ''
    const wantsMarkdown = accept.includes('text/markdown') || AI_USER_AGENTS.test(userAgent)

    // Markdown files are written without a trailing slash: `/docs/foo.md`.
    const markdownPath = `${pathname.replace(/\/$/, '')}.md`

    if (wantsMarkdown) {
        url.pathname = markdownPath
        return rewrite(url)
    }

    // For browsers/humans, advertise the Markdown alternate via a Link header. This
    // mirrors the in-page `<link rel="alternate" type="text/markdown">` from seo.tsx
    // but is machine-readable without parsing HTML.
    return next({
        headers: {
            Link: `<${markdownPath}>; rel="alternate"; type="text/markdown"`,
        },
    })
}
