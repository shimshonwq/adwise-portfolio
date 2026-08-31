/** Admin API fetch — same-origin with workers.dev fallback when CF challenges POST. */

import { WORKERS_API, looksLikeChallenge } from './api-fallback'

const SESSION_TOKEN_KEY = 'adwise_admin_api_token'

export function getAdminApiToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return sessionStorage.getItem(SESSION_TOKEN_KEY)
  } catch {
    return null
  }
}

export function setAdminApiToken(token: string | null) {
  if (typeof window === 'undefined') return
  try {
    if (token) sessionStorage.setItem(SESSION_TOKEN_KEY, token)
    else sessionStorage.removeItem(SESSION_TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

function normalizePath(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return p.endsWith('/') ? p : `${p}/`
}

function isCustomDomain(): boolean {
  if (typeof window === 'undefined') return false
  return /(^|\.)adwisemedia\.co$/i.test(window.location.hostname)
}

function adminUrls(path: string, _method: string): string[] {
  const local = normalizePath(path)
  const remote = `${WORKERS_API}${local}`
  // Custom domain /api/* is CF-challenged — always prefer workers.dev there.
  if (isCustomDomain()) return [remote, local]
  return [local, remote]
}

function authHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers(extra)
  if (!headers.has('Accept')) headers.set('Accept', 'application/json')
  const token = getAdminApiToken()
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return headers
}

export type AdminApiPayload = {
  ok?: boolean
  token?: string
  error?: string
  content?: unknown
  publishMessage?: string
  storage?: string
  [key: string]: unknown
}

export type AdminLoginResult = {
  ok: boolean
  status: number
  data: AdminApiPayload
}

/**
 * Parse JSON from a Response without consuming the original body.
 * Callers can safely read the same Response more than once.
 */
export async function readAdminJson<T = AdminApiPayload>(res: Response): Promise<T> {
  let raw = ''
  try {
    raw = await res.clone().text()
  } catch {
    try {
      raw = await res.text()
    } catch {
      throw new Error('Could not read the server response. Refresh the page and try again.')
    }
  }
  if (looksLikeChallenge(raw)) {
    throw new Error('Security check blocked the request. Refresh the page and try again.')
  }
  if (!raw.trim()) return {} as T
  try {
    return JSON.parse(raw) as T
  } catch {
    throw new Error('Unexpected response from the server.')
  }
}

async function parseLoginResponse(res: Response | null): Promise<AdminLoginResult> {
  if (!res) {
    return { ok: false, status: 503, data: { error: 'Admin API unavailable' } }
  }
  try {
    const data = await readAdminJson(res)
    if (typeof data?.token === 'string' && data.token) {
      setAdminApiToken(String(data.token))
    }
    return { ok: res.ok, status: res.status, data }
  } catch (err) {
    return {
      ok: false,
      status: res.status || 503,
      data: { error: err instanceof Error ? err.message : 'Login failed' },
    }
  }
}

/** Fetch admin API; retries on workers.dev when the zone returns a CF challenge page. */
export async function adminFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const method = (init.method || 'GET').toUpperCase()
  const urls = adminUrls(path, method)
  let last: Response | null = null

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const crossOrigin = !url.startsWith('/')
    try {
      const res = await fetch(url, {
        ...init,
        cache: 'no-store',
        // Cross-origin uses Bearer token — cookies + credentials break CORS on workers.dev.
        credentials: crossOrigin ? 'omit' : 'include',
        mode: crossOrigin ? 'cors' : 'same-origin',
        headers: authHeaders(init.headers),
      })
      last = res
      const raw = await res.clone().text()
      if (looksLikeChallenge(raw)) continue
      if (!res.ok && crossOrigin && res.status === 401 && i === 0) continue
      return res
    } catch {
      /* network/CORS — try fallback URL */
    }
  }

  return last || new Response(JSON.stringify({ error: 'Admin API unavailable' }), { status: 503 })
}

/** Mirror login to workers.dev and persist Bearer token for cross-origin admin calls. */
export async function establishAdminSession(password: string): Promise<AdminLoginResult> {
  const body = JSON.stringify({ password })
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' }

  const mirrorLogin = () =>
    fetch(`${WORKERS_API}/api/admin/login`, {
      method: 'POST',
      credentials: 'omit',
      mode: 'cors',
      headers,
      body,
    }).catch(() => null)

  if (isCustomDomain()) {
    return parseLoginResponse(await mirrorLogin())
  }

  const [primary, mirror] = await Promise.all([
    fetch(normalizePath('/api/admin/login'), {
      method: 'POST',
      credentials: 'include',
      headers,
      body,
    }),
    mirrorLogin(),
  ])

  if (primary.ok) return parseLoginResponse(primary)
  if (mirror?.ok) return parseLoginResponse(mirror)
  return parseLoginResponse(primary)
}

/** Load Bearer token for workers.dev fallback when user already has a cookie session. */
export async function refreshAdminApiToken(): Promise<void> {
  if (getAdminApiToken()) return
  try {
    const res = await adminFetch('/api/admin/session-token')
    if (!res.ok) return
    const data = await readAdminJson(res)
    if (data?.token) setAdminApiToken(String(data.token))
  } catch {
    /* ignore */
  }
}
