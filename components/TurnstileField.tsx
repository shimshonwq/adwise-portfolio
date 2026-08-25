'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string
          theme?: 'light' | 'dark' | 'auto'
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
        },
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
    onTurnstileApiLoad?: () => void
  }
}

type Props = {
  siteKey: string
  onToken: (token: string | null) => void
  theme?: 'light' | 'dark' | 'auto'
  className?: string
}

let turnstileScriptPromise: Promise<void> | null = null

function loadTurnstileScript() {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.turnstile) return Promise.resolve()
  if (turnstileScriptPromise) return turnstileScriptPromise

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile]')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Failed to load Turnstile')))
      return
    }
    window.onTurnstileApiLoad = () => resolve()
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileApiLoad'
    script.async = true
    script.defer = true
    script.dataset.turnstile = '1'
    script.onerror = () => reject(new Error('Failed to load Turnstile'))
    document.head.appendChild(script)
  })

  return turnstileScriptPromise
}

/** Real Cloudflare Turnstile checkbox — the only human verification on the form. */
export default function TurnstileField({ siteKey, onToken, theme = 'light', className = '' }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)
  onTokenRef.current = onToken

  useEffect(() => {
    let cancelled = false

    const mount = async () => {
      if (!siteKey || !hostRef.current) return
      try {
        await loadTurnstileScript()
        if (cancelled || !hostRef.current || !window.turnstile) return
        if (widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current)
          } catch {
            /* ignore */
          }
          widgetIdRef.current = null
          hostRef.current.innerHTML = ''
        }
        widgetIdRef.current = window.turnstile.render(hostRef.current, {
          sitekey: siteKey,
          theme,
          callback: (token) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => onTokenRef.current(null),
        })
      } catch {
        onTokenRef.current(null)
      }
    }

    void mount()

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null
      }
    }
  }, [siteKey, theme])

  return <div ref={hostRef} className={className} />
}

export function resetTurnstile(host?: HTMLElement | null) {
  if (typeof window === 'undefined' || !window.turnstile) return
  try {
    window.turnstile.reset()
  } catch {
    /* ignore */
  }
  void host
}
