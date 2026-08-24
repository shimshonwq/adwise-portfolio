/**
 * Local CMS API — publishes to GitHub when configured (recommended), else `.data/`.
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE_SEC,
  makeSessionToken,
  rotatePassword,
  verifyPassword,
  verifySessionToken,
  validatePasswordStrength,
} from './admin-auth.mjs'
import {
  ensureAuthRecord,
  persistAuthRecord,
  readAuthRecord,
} from './admin-auth-store.mjs'
import { ensureGithubEnv } from './github-env.mjs'
import {
  githubConfigured,
  logoRepoPath,
  publishSiteContent,
  readSiteContentFromGitHub,
  writeBinaryFile,
  deleteRepoFile,
} from './github-store.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

ensureGithubEnv(ROOT)

const DATA_DIR = path.join(ROOT, '.data')
const DEFAULT_PATH = path.join(ROOT, 'data', 'cms-default.json')
const PUBLIC_CONTENT = path.join(ROOT, 'public', 'data', 'content.json')
const UPLOAD_DIR = path.join(ROOT, 'public', 'uploads', 'logos')
const PORT = Number(process.env.ADMIN_API_PORT || 8787)
const MAX_BYTES = 2.5 * 1024 * 1024
const LOGIN_MAX_ATTEMPTS = 5
const LOGIN_WINDOW_MS = 15 * 60 * 1000

const PUBLISH_MSG =
  'Saved to GitHub — Cloudflare will rebuild the site in about 1–3 minutes.'

/** @type {{ record: import('./admin-auth.mjs').hashPassword extends (...args: any) => infer R ? R : never } | null} */
let authRecord = null
const loginAttempts = new Map()

function ensureDirs() {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

async function getAuthRecord() {
  if (authRecord?.hash) return authRecord
  authRecord = await readAuthRecord(ROOT)
  if (!authRecord) {
    const boot = await ensureAuthRecord(ROOT)
    authRecord = boot.record
    if (boot.created) {
      console.log(`[cms-auth] Default password written to ${boot.hintPath}`)
    }
  }
  return authRecord
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string' && fwd.trim()) return fwd.split(',')[0].trim()
  return req.socket.remoteAddress || 'local'
}

function loginRateLimited(ip) {
  const now = Date.now()
  let entry = loginAttempts.get(ip)
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + LOGIN_WINDOW_MS }
    loginAttempts.set(ip, entry)
  }
  return entry.count >= LOGIN_MAX_ATTEMPTS
}

function recordLoginFailure(ip) {
  const now = Date.now()
  let entry = loginAttempts.get(ip)
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + LOGIN_WINDOW_MS }
  }
  entry.count += 1
  loginAttempts.set(ip, entry)
}

function clearLoginFailures(ip) {
  loginAttempts.delete(ip)
}

function defaultContent() {
  return JSON.parse(fs.readFileSync(DEFAULT_PATH, 'utf8'))
}

function writeLocalContent(content) {
  ensureDirs()
  content.version = 1
  content.updatedAt = new Date().toISOString()
  const text = JSON.stringify(content, null, 2)
  fs.writeFileSync(path.join(DATA_DIR, 'content.json'), text)
  fs.writeFileSync(PUBLIC_CONTENT, text)
}

async function readContent() {
  if (githubConfigured()) {
    try {
      const fromGh = await readSiteContentFromGitHub()
      if (fromGh?.site) {
        writeLocalContent(fromGh)
        return fromGh
      }
    } catch (err) {
      console.warn('[cms-api] GitHub read failed, using local cache:', err.message)
    }
  }
  ensureDirs()
  const storePath = path.join(DATA_DIR, 'content.json')
  if (fs.existsSync(storePath)) {
    try {
      return JSON.parse(fs.readFileSync(storePath, 'utf8'))
    } catch {
      /* fall through */
    }
  }
  if (fs.existsSync(PUBLIC_CONTENT)) {
    try {
      return JSON.parse(fs.readFileSync(PUBLIC_CONTENT, 'utf8'))
    } catch {
      /* fall through */
    }
  }
  const seed = defaultContent()
  writeLocalContent(seed)
  return seed
}

async function persistContent(content, message = 'CMS: update site content') {
  writeLocalContent(content)
  if (githubConfigured()) {
    const result = await publishSiteContent(content, message)
    return { content, publishMessage: result.message || PUBLISH_MSG, published: true }
  }
  return {
    content,
    publishMessage: 'Saved locally (set GITHUB_TOKEN to publish to GitHub).',
    published: false,
  }
}

function visibleLogos(content) {
  return [...(content.logos || [])]
    .filter((l) => l.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

function parseCookies(header) {
  const out = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const i = part.indexOf('=')
    if (i === -1) continue
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim())
  }
  return out
}

function json(res, status, body, extraHeaders = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  })
  res.end(JSON.stringify(body))
}

function setCookie(token) {
  return `${ADMIN_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SEC}`
}

function clearCookie() {
  return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}

function slugify(name) {
  return (
    String(name || 'logo')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || 'logo'
  )
}

function extFor(mime) {
  if (mime === 'image/png') return 'png'
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/svg+xml') return 'svg'
  return 'png'
}

async function readBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BYTES * 1.5) throw new Error('Payload too large')
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

async function requireAuth(req) {
  const record = await getAuthRecord()
  const token = parseCookies(req.headers.cookie)[ADMIN_COOKIE]
  return verifySessionToken(record.sessionKey, token)
}

function reindexOrders(logos) {
  return logos.map((l, i) => ({ ...l, order: i }))
}

function okPayload(result) {
  return {
    ok: true,
    content: result.content,
    logos: result.content.logos,
    publishMessage: result.publishMessage,
    published: result.published,
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://127.0.0.1:${PORT}`)
  const pathname = url.pathname.replace(/\/+$/, '') || '/'

  if (req.method === 'OPTIONS') return json(res, 204, {})

  try {
    if (req.method === 'GET' && pathname === '/api/content') {
      return json(res, 200, { content: await readContent() })
    }

    if (req.method === 'GET' && pathname === '/api/logos') {
      return json(res, 200, { logos: visibleLogos(await readContent()) })
    }

    if (req.method === 'GET' && pathname === '/api/admin/status') {
      const record = await getAuthRecord()
      return json(res, 200, {
        storage: githubConfigured() ? 'github' : 'local',
        repo: process.env.GITHUB_REPO || 'shimshonwq/adwise-portfolio',
        branch: process.env.GITHUB_BRANCH || 'main',
        authUpdatedAt: record.updatedAt || null,
      })
    }

    if (req.method === 'POST' && pathname === '/api/admin/login') {
      const ip = clientIp(req)
      if (loginRateLimited(ip)) {
        return json(res, 429, {
          error: 'Too many login attempts. Wait about 15 minutes and try again.',
        })
      }

      const body = JSON.parse((await readBody(req)).toString('utf8') || '{}')
      const record = await getAuthRecord()
      if (!verifyPassword(String(body.password || ''), record)) {
        recordLoginFailure(ip)
        return json(res, 401, { error: 'Wrong password' })
      }
      clearLoginFailures(ip)
      const token = makeSessionToken(record.sessionKey)
      return json(res, 200, { ok: true }, { 'Set-Cookie': setCookie(token) })
    }

    if (req.method === 'POST' && pathname === '/api/admin/logout') {
      return json(res, 200, { ok: true }, { 'Set-Cookie': clearCookie() })
    }

    if (req.method === 'GET' && pathname === '/api/admin/session') {
      return json(res, 200, { ok: await requireAuth(req) })
    }

    if (!(await requireAuth(req)) && pathname.startsWith('/api/admin')) {
      return json(res, 401, { error: 'Please log in' })
    }

    if (req.method === 'POST' && pathname === '/api/admin/password') {
      const body = JSON.parse((await readBody(req)).toString('utf8') || '{}')
      const current = String(body.currentPassword || '')
      const next = String(body.newPassword || '')
      const confirm = String(body.confirmPassword || '')

      const record = await getAuthRecord()
      if (!verifyPassword(current, record)) {
        return json(res, 401, { error: 'Current password is incorrect' })
      }
      if (next !== confirm) {
        return json(res, 400, { error: 'New passwords do not match' })
      }
      const strengthErr = validatePasswordStrength(next)
      if (strengthErr) return json(res, 400, { error: strengthErr })
      if (verifyPassword(next, record)) {
        return json(res, 400, { error: 'Choose a different password than your current one' })
      }

      authRecord = rotatePassword(record, next)
      await persistAuthRecord(ROOT, authRecord, 'CMS: change admin password')
      const token = makeSessionToken(authRecord.sessionKey)
      return json(
        res,
        200,
        {
          ok: true,
          message: 'Password updated. All other sessions were signed out.',
          authUpdatedAt: authRecord.updatedAt,
        },
        { 'Set-Cookie': setCookie(token) },
      )
    }

    if (req.method === 'GET' && pathname === '/api/admin/content') {
      return json(res, 200, { content: await readContent() })
    }

    if (req.method === 'PUT' && pathname === '/api/admin/content') {
      const body = JSON.parse((await readBody(req)).toString('utf8') || '{}')
      const next = body.content || body
      if (!next?.site || !Array.isArray(next.logos)) {
        return json(res, 400, { error: 'Invalid content payload' })
      }
      const result = await persistContent(next, 'CMS: update site content')
      return json(res, 200, okPayload(result))
    }

    if (req.method === 'GET' && pathname === '/api/admin/logos') {
      const content = await readContent()
      return json(res, 200, {
        logos: [...content.logos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      })
    }

    if (req.method === 'POST' && pathname === '/api/admin/logos') {
      const body = JSON.parse((await readBody(req)).toString('utf8') || '{}')
      const name = String(body.name || '').trim()
      const dataUrl = String(body.dataUrl || '')
      if (!name) return json(res, 400, { error: 'Name is required' })
      const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
      if (!match) return json(res, 400, { error: 'Upload a PNG, JPG, WebP, or SVG' })
      const buf = Buffer.from(match[2], 'base64')
      if (buf.length > MAX_BYTES) return json(res, 400, { error: 'File too large (max 2.5MB)' })
      const id = `${slugify(name)}-${Date.now().toString(36)}`
      const file = `${id}.${extFor(match[1])}`
      const src = `/uploads/logos/${file}`
      ensureDirs()
      fs.writeFileSync(path.join(UPLOAD_DIR, file), buf)
      if (githubConfigured()) {
        await writeBinaryFile(`public${src}`, buf, `CMS: add logo ${name}`)
      }
      const content = await readContent()
      const maxOrder = content.logos.reduce((m, l) => Math.max(m, l.order ?? 0), -1)
      content.logos.push({ id, name, src, order: maxOrder + 1, visible: true })
      const result = await persistContent(content, `CMS: add logo ${name}`)
      return json(res, 200, okPayload(result))
    }

    if (req.method === 'PATCH' && pathname.startsWith('/api/admin/logos/')) {
      const id = decodeURIComponent(pathname.slice('/api/admin/logos/'.length))
      const body = JSON.parse((await readBody(req)).toString('utf8') || '{}')
      const content = await readContent()
      const idx = content.logos.findIndex((l) => l.id === id)
      if (idx === -1) return json(res, 404, { error: 'Logo not found' })
      if (body.name !== undefined) {
        content.logos[idx].name = String(body.name).trim() || content.logos[idx].name
      }
      if (body.visible !== undefined) content.logos[idx].visible = Boolean(body.visible)
      const result = await persistContent(content, `CMS: update logo ${id}`)
      return json(res, 200, okPayload(result))
    }

    if (req.method === 'PUT' && pathname === '/api/admin/logos/reorder') {
      const body = JSON.parse((await readBody(req)).toString('utf8') || '{}')
      const ids = body.ids
      if (!Array.isArray(ids)) return json(res, 400, { error: 'ids array required' })
      const content = await readContent()
      const map = new Map(content.logos.map((l) => [l.id, l]))
      const next = []
      for (const id of ids) {
        if (map.has(id)) {
          next.push(map.get(id))
          map.delete(id)
        }
      }
      for (const left of map.values()) next.push(left)
      content.logos = reindexOrders(next)
      const result = await persistContent(content, 'CMS: reorder logos')
      return json(res, 200, okPayload(result))
    }

    if (req.method === 'DELETE' && pathname.startsWith('/api/admin/logos/')) {
      const id = decodeURIComponent(pathname.slice('/api/admin/logos/'.length))
      const content = await readContent()
      const removed = content.logos.find((l) => l.id === id)
      content.logos = reindexOrders(content.logos.filter((l) => l.id !== id))
      if (githubConfigured() && removed) {
        const repoPath = logoRepoPath(removed.src)
        if (repoPath) {
          try {
            await deleteRepoFile(repoPath, `CMS: remove logo file ${id}`)
          } catch {
            /* file may not be in repo */
          }
        }
      }
      const result = await persistContent(content, `CMS: remove logo ${id}`)
      return json(res, 200, okPayload(result))
    }

    return json(res, 404, { error: 'Not found' })
  } catch (err) {
    return json(res, 500, { error: err?.message || 'Server error' })
  }
})

ensureDirs()
server.listen(PORT, '127.0.0.1', async () => {
  await getAuthRecord()
  const mode = githubConfigured() ? 'GitHub publish' : 'local only'
  console.log(`[cms-api] http://127.0.0.1:${PORT} (${mode})`)
})
