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

function isWriteMethod(method: string): boolean {
  return !['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())
}

function adminUrls(path: string, method: string): string[] {
  const local = normalizePath(path)
  const remote = `${WORKERS_API}${local}`
  if (isCustomDomain() && isWriteMethod(method)) {
    return [remote, local]
  }
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

/** Fetch admin API; retries on workers.dev when the zone returns a CF challenge page. */
export async function adminFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const method = (init.method || 'GET').toUpperCase()
  const urls = adminUrls(path, method)
  let last: Response | null = null

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const crossOrigin = !url.startsWith('/')
    const res = await fetch(url, {
      ...init,
      cache: 'no-store',
      credentials: 'include',
      mode: crossOrigin ? 'cors' : 'same-origin',
      headers: authHeaders(init.headers),
    })
    last = res
    const raw = await res.clone().text()
    if (looksLikeChallenge(raw)) continue
    if (!res.ok && crossOrigin && res.status === 401 && i === 0) continue
    return res
  }

  return last || new Response(JSON.stringify({ error: 'Admin API unavailable' }), { status: 503 })
}

/** Mirror login to workers.dev and persist Bearer token for cross-origin admin calls. */
export async function establishAdminSession(password: string): Promise<Response> {
  const body = JSON.stringify({ password })
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' }
  const [primary, mirror] = await Promise.all([
    fetch(normalizePath('/api/admin/login'), {
      method: 'POST',
      credentials: 'include',
      headers,
      body,
    }),
    fetch(`${WORKERS_API}/api/admin/login`, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: { ...headers, Origin: window.location.origin },
      body,
    }).catch(() => null),
  ])

  if (primary.ok) {
    try {
      const data = await primary.clone().json()
      if (data?.token) setAdminApiToken(String(data.token))
    } catch {
      /* ignore */
    }
  }

  if (!primary.ok && mirror?.ok) {
    try {
      const data = await mirror.json()
      if (data?.token) setAdminApiToken(String(data.token))
    } catch {
      /* ignore */
    }
    return mirror
  }

  return primary
}

/** Load Bearer token for workers.dev fallback when user already has a cookie session. */
export async function refreshAdminApiToken(): Promise<void> {
  if (getAdminApiToken()) return
  try {
    const res = await fetch(normalizePath('/api/admin/session-token'), {
      credentials: 'include',
      cache: 'no-store',
    })
    if (!res.ok) return
    const data = await res.json()
    if (data?.token) setAdminApiToken(String(data.token))
  } catch {
    /* ignore */
  }
}
