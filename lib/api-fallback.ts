/** Shared helpers for public API origin + challenge detection. */

export const WORKERS_API = 'https://adwise-portfolio.adwisecreativity.workers.dev'

export function looksLikeChallenge(text: string): boolean {
  const t = String(text || '').toLowerCase()
  return (
    t.includes('just a moment') ||
    t.includes('cf-mitigated') ||
    t.includes('challenge-platform') ||
    t.includes('<!doctype html')
  )
}

/** Only fall back to workers.dev on the real custom domain (CF may challenge /api/*). */
export function shouldUseWorkersFallback(hostname?: string): boolean {
  const host =
    hostname ||
    (typeof window !== 'undefined' ? window.location.hostname : '')
  if (!host) return false
  return (
    host === 'adwisemedia.co' ||
    host === 'www.adwisemedia.co' ||
    host.endsWith('.adwisemedia.co')
  )
}

/**
 * Fetch JSON from same-origin first, then workers.dev if CF challenges the zone.
 * Preview tunnels / localhost stay same-origin only so production CMS copy cannot
 * overwrite a redesign being reviewed off-domain.
 */
export async function fetchJsonWithFallback<T>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  const urls = shouldUseWorkersFallback() ? [path, `${WORKERS_API}${path}`] : [path]
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        ...init,
        cache: 'no-store',
        credentials: url.startsWith('/') ? 'same-origin' : 'omit',
        mode: 'cors',
      })
      const raw = await res.text()
      if (looksLikeChallenge(raw)) continue
      if (!res.ok) continue
      return JSON.parse(raw) as T
    } catch {
      /* try next */
    }
  }
  return null
}
