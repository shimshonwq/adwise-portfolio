/**
 * Local CMS API — full site content + logos. Used by `npm run dev`.
 * Persists to `.data/content.json`. Uploads go to `public/uploads/logos/`.
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const i = trimmed.indexOf('=')
    if (i === -1) continue
    const key = trimmed.slice(0, i).trim()
    let val = trimmed.slice(i + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = val
  }
}

loadEnvFile(path.join(ROOT, '.env.local'))
loadEnvFile(path.join(ROOT, '.env'))

const DATA_DIR = path.join(ROOT, '.data')
const STORE_PATH = path.join(DATA_DIR, 'content.json')
const DEFAULT_PATH = path.join(ROOT, 'data', 'cms-default.json')
const UPLOAD_DIR = path.join(ROOT, 'public', 'uploads', 'logos')
const PORT = Number(process.env.ADMIN_API_PORT || 8787)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adwise-admin'
const ADMIN_COOKIE = 'adwise_admin'
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 14
const MAX_BYTES = 2.5 * 1024 * 1024

function ensureDirs() {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

function defaultContent() {
  return JSON.parse(fs.readFileSync(DEFAULT_PATH, 'utf8'))
}

function readContent() {
  ensureDirs()
  if (!fs.existsSync(STORE_PATH)) {
    const seed = defaultContent()
    // Migrate legacy logos-only store if present
    const legacy = path.join(DATA_DIR, 'logos.json')
    if (fs.existsSync(legacy)) {
      try {
        const logos = JSON.parse(fs.readFileSync(legacy, 'utf8'))
        if (Array.isArray(logos) && logos.length) {
          seed.logos = logos.map((l, i) => ({
            id: l.id || `logo-${i}`,
            name: l.name || 'Logo',
            src: l.src,
            order: typeof l.order === 'number' ? l.order : i,
            visible: l.visible !== false,
          }))
        }
      } catch {
        /* ignore */
      }
    }
    writeContent(seed)
    return seed
  }
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'))
  } catch {
    return defaultContent()
  }
}

function writeContent(content) {
  ensureDirs()
  content.version = 1
  content.updatedAt = new Date().toISOString()
  fs.writeFileSync(STORE_PATH, JSON.stringify(content, null, 2))
}

function visibleLogos(content) {
  return [...(content.logos || [])]
    .filter((l) => l.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

function b64url(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function sign(payload) {
  return b64url(crypto.createHmac('sha256', ADMIN_PASSWORD).update(payload).digest())
}

function makeSession() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC
  const payload = `v1.${exp}`
  return `${payload}.${sign(payload)}`
}

function verifySession(token) {
  if (!token || typeof token !== 'string') return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const payload = `${parts[0]}.${parts[1]}`
  if (parts[2] !== sign(payload)) return false
  const exp = Number(parts[1])
  return Number.isFinite(exp) && exp > Math.floor(Date.now() / 1000)
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
  const data = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  })
  res.end(data)
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

function requireAuth(req) {
  return verifySession(parseCookies(req.headers.cookie)[ADMIN_COOKIE])
}

function reindexOrders(logos) {
  return logos.map((l, i) => ({ ...l, order: i }))
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://127.0.0.1:${PORT}`)
  const pathname = url.pathname.replace(/\/+$/, '') || '/'

  if (req.method === 'OPTIONS') {
    return json(res, 204, {})
  }

  try {
    if (req.method === 'GET' && pathname === '/api/content') {
      return json(res, 200, { content: readContent() })
    }

    if (req.method === 'GET' && pathname === '/api/logos') {
      return json(res, 200, { logos: visibleLogos(readContent()) })
    }

    if (req.method === 'POST' && pathname === '/api/admin/login') {
      const body = JSON.parse((await readBody(req)).toString('utf8') || '{}')
      if (body.password !== ADMIN_PASSWORD) {
        return json(res, 401, { error: 'Wrong password' })
      }
      return json(res, 200, { ok: true }, { 'Set-Cookie': setCookie(makeSession()) })
    }

    if (req.method === 'POST' && pathname === '/api/admin/logout') {
      return json(res, 200, { ok: true }, { 'Set-Cookie': clearCookie() })
    }

    if (req.method === 'GET' && pathname === '/api/admin/session') {
      return json(res, 200, { ok: requireAuth(req) })
    }

    if (!requireAuth(req) && pathname.startsWith('/api/admin')) {
      return json(res, 401, { error: 'Please log in' })
    }

    if (req.method === 'GET' && pathname === '/api/admin/content') {
      return json(res, 200, { content: readContent() })
    }

    if (req.method === 'PUT' && pathname === '/api/admin/content') {
      const body = JSON.parse((await readBody(req)).toString('utf8') || '{}')
      const next = body.content || body
      if (!next?.site || !Array.isArray(next.logos)) {
        return json(res, 400, { error: 'Invalid content payload' })
      }
      writeContent(next)
      return json(res, 200, { ok: true, content: readContent() })
    }

    if (req.method === 'GET' && pathname === '/api/admin/logos') {
      const content = readContent()
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
      fs.writeFileSync(path.join(UPLOAD_DIR, file), buf)
      const content = readContent()
      const maxOrder = content.logos.reduce((m, l) => Math.max(m, l.order ?? 0), -1)
      content.logos.push({
        id,
        name,
        src: `/uploads/logos/${file}`,
        order: maxOrder + 1,
        visible: true,
      })
      writeContent(content)
      return json(res, 200, { ok: true, logos: content.logos, content })
    }

    if (req.method === 'PATCH' && pathname.startsWith('/api/admin/logos/')) {
      const id = decodeURIComponent(pathname.slice('/api/admin/logos/'.length))
      const body = JSON.parse((await readBody(req)).toString('utf8') || '{}')
      const content = readContent()
      const idx = content.logos.findIndex((l) => l.id === id)
      if (idx === -1) return json(res, 404, { error: 'Logo not found' })
      if (body.name !== undefined) content.logos[idx].name = String(body.name).trim() || content.logos[idx].name
      if (body.visible !== undefined) content.logos[idx].visible = Boolean(body.visible)
      writeContent(content)
      return json(res, 200, { ok: true, logos: content.logos, content })
    }

    if (req.method === 'PUT' && pathname === '/api/admin/logos/reorder') {
      const body = JSON.parse((await readBody(req)).toString('utf8') || '{}')
      const ids = body.ids
      if (!Array.isArray(ids)) return json(res, 400, { error: 'ids array required' })
      const content = readContent()
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
      writeContent(content)
      return json(res, 200, { ok: true, logos: content.logos, content })
    }

    if (req.method === 'DELETE' && pathname.startsWith('/api/admin/logos/')) {
      const id = decodeURIComponent(pathname.slice('/api/admin/logos/'.length))
      const content = readContent()
      content.logos = reindexOrders(content.logos.filter((l) => l.id !== id))
      writeContent(content)
      return json(res, 200, { ok: true, logos: content.logos, content })
    }

    return json(res, 404, { error: 'Not found' })
  } catch (err) {
    return json(res, 500, { error: err?.message || 'Server error' })
  }
})

ensureDirs()
server.listen(PORT, '127.0.0.1', () => {
  console.log(`[cms-api] http://127.0.0.1:${PORT}`)
})
