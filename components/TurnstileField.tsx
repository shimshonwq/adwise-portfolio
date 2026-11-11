'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

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
      getResponse?: (widgetId?: string) => string
    }
    onTurnstileApiLoad?: () => void
  }
}

export type TurnstileHandle = {
  getToken: () => string | null
  reset: () => void
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
      if (window.turnstile) {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Failed to load Turnstile')))
      return
    }
    window.onTurnstileApiLoad = () => resolve()
    const script = document.createElement('script')
    script.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileApiLoad'
    script.async = true
    script.defer = true
    script.dataset.turnstile = '1'
    script.onerror = () => reject(new Error('Failed to load Turnstile'))
    document.head.appendChild(script)
  })

  return turnstileScriptPromise
}

/** Real Cloudflare Turnstile checkbox — the only human verification on the form. */
const TurnstileField = forwardRef<TurnstileHandle, Props>(function TurnstileField(
  { siteKey, onToken, theme = 'light', className = '' },
  ref,
) {
  const hostRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const tokenRef = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)
  onTokenRef.current = onToken

  useImperativeHandle(ref, () => ({
    getToken: () => {
      if (tokenRef.current) return tokenRef.current
      const id = widgetIdRef.current || undefined
      try {
        const fromWidget = window.turnstile?.getResponse?.(id)
        if (fromWidget) {
          tokenRef.current = fromWidget
          return fromWidget
        }
      } catch {
        /* ignore */
      }
      return null
    },
    reset: () => {
      tokenRef.current = null
      onTokenRef.current(null)
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.reset(widgetIdRef.current)
        } catch {
          /* ignore */
        }
      }
    },
  }))

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
          callback: (token) => {
            tokenRef.current = token
            onTokenRef.current(token)
          },
          'expired-callback': () => {
            tokenRef.current = null
            onTokenRef.current(null)
          },
          'error-callback': () => {
            tokenRef.current = null
            onTokenRef.current(null)
          },
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
})

export default TurnstileField
