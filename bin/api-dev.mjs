// Local dev server for /api/* serverless functions.
// Mounts api/hogwatch-performance.js on http://localhost:3002 so `gatsby develop`
// (port 8001) can proxy /api/* to it. See gatsby-config.js for the proxy hookup.
//
// Usage in two terminals:
//   pnpm dev:api       (this script)
//   pnpm start         (gatsby develop)
//
// Requires POSTHOG_APP_API_KEY in env (.env.development.local or shell export).
// Optional: YOUTUBE_API_KEY_HW3000 for live YouTube view refresh.

import http from 'node:http'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

function loadDotenv(filename) {
    const p = path.join(repoRoot, filename)
    if (!fs.existsSync(p)) return
    const text = fs.readFileSync(p, 'utf-8')
    for (const line of text.split('\n')) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
        if (!m) continue
        const [, k, raw] = m
        if (process.env[k] !== undefined) continue
        let v = raw
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1)
        }
        process.env[k] = v
    }
}
loadDotenv('.env.development')
loadDotenv('.env.development.local')

if (!process.env.POSTHOG_APP_API_KEY) {
    console.error('\n  Missing POSTHOG_APP_API_KEY in env.')
    console.error('  Create a personal API key at https://us.posthog.com/settings/user-api-keys')
    console.error('  with scopes: query:read AND warehouse:read.')
    console.error('  Then add to .env.development.local:')
    console.error('    POSTHOG_APP_API_KEY=phx_...')
    console.error('  (Optional) for live YouTube views:')
    console.error('    YOUTUBE_API_KEY_HW3000=...\n')
}

const ROUTES = {
    '/api/hogwatch-performance': () => import('../api/hogwatch-performance.js'),
    '/api/hogwatch-evaluate': () => import('../api/hogwatch-evaluate.js'),
    '/api/hogwatch-sync-sheet': () => import('../api/hogwatch-sync-sheet.js'),
}

async function readBody(req) {
    return new Promise((resolve) => {
        let data = ''
        req.on('data', (chunk) => (data += chunk))
        req.on('end', () => resolve(data))
    })
}

function parseQuery(url) {
    const i = url.indexOf('?')
    if (i < 0) return {}
    const out = {}
    for (const pair of url.slice(i + 1).split('&')) {
        if (!pair) continue
        const [k, v = ''] = pair.split('=')
        out[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, ' '))
    }
    return out
}

const server = http.createServer(async (req, res) => {
    res.setHeader('access-control-allow-origin', '*')
    res.setHeader('access-control-allow-headers', 'content-type')
    if (req.method === 'OPTIONS') {
        res.statusCode = 204
        return res.end()
    }

    const urlPath = (req.url || '').split('?')[0]
    const loader = ROUTES[urlPath]
    if (!loader) {
        res.statusCode = 404
        return res.end(JSON.stringify({ error: `No route for ${urlPath}` }))
    }

    try {
        const module = await loader()
        const handler = module.default
        const bodyText = req.method !== 'GET' && req.method !== 'HEAD' ? await readBody(req) : ''
        const fakeReq = {
            method: req.method,
            query: parseQuery(req.url || ''),
            body: bodyText ? bodyText : undefined,
            headers: req.headers,
        }
        const fakeRes = {
            statusCode: 200,
            _headers: {},
            setHeader(k, v) {
                this._headers[k.toLowerCase()] = v
            },
            status(code) {
                this.statusCode = code
                return this
            },
            json(obj) {
                this.setHeader('content-type', 'application/json')
                res.writeHead(this.statusCode, this._headers)
                res.end(JSON.stringify(obj))
                return this
            },
            send(text) {
                res.writeHead(this.statusCode, this._headers)
                res.end(typeof text === 'string' ? text : JSON.stringify(text))
                return this
            },
            end(text) {
                res.writeHead(this.statusCode, this._headers)
                res.end(text ?? '')
                return this
            },
        }
        const startedAt = Date.now()
        await handler(fakeReq, fakeRes)
        const ms = Date.now() - startedAt
        console.log(`${req.method} ${urlPath} ${fakeRes.statusCode} ${ms}ms`)
    } catch (err) {
        console.error(`${req.method} ${urlPath} 500`, err)
        res.statusCode = 500
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Handler error' }))
    }
})

const PORT = Number(process.env.API_DEV_PORT) || 3002
server.listen(PORT, () => {
    console.log(`\n  api-dev listening on http://localhost:${PORT}`)
    console.log(`  routes: ${Object.keys(ROUTES).join(', ')}`)
    console.log(`  posthog key: ${process.env.POSTHOG_APP_API_KEY ? 'set' : 'MISSING'}`)
    console.log(`  youtube key: ${process.env.YOUTUBE_API_KEY_HW3000 ? 'set' : 'missing (optional)'}\n`)
})
