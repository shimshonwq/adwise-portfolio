import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  contactChannelsFromSite,
  DEFAULT_CONTENT,
  normalizeContent,
  themeToCssVars,
  visibleLogos,
  type CmsContent,
  type LogoItem,
} from './content'
import { googleFontsHref } from './fonts'
import { safeStylesheetUrl } from './safe-stylesheet-url'
import { fetchJsonWithFallback } from './api-fallback'

type SiteContentValue = {
  content: CmsContent
  logos: LogoItem[]
  channels: ReturnType<typeof contactChannelsFromSite>
  refresh: () => Promise<void>
  ready: boolean
}

const SiteContentContext = createContext<SiteContentValue>({
  content: DEFAULT_CONTENT,
  logos: visibleLogos(DEFAULT_CONTENT),
  channels: contactChannelsFromSite(DEFAULT_CONTENT.site),
  refresh: async () => {},
  ready: false,
})

const FONT_LINK_ID = 'adwise-cms-fonts'

async function fetchContent(): Promise<CmsContent> {
  const live = await fetchJsonWithFallback<{ content?: CmsContent } & Partial<CmsContent>>(
    '/api/content/',
  )
  if (live?.content) return normalizeContent(live.content)
  if (live?.site) return normalizeContent(live)

  // Last resort: static file (also served live by Worker when configured)
  const staticJson = await fetchJsonWithFallback<CmsContent>('/data/content.json')
  if (staticJson?.site) return normalizeContent(staticJson)

  return DEFAULT_CONTENT
}

function applyTheme(content: CmsContent) {
  if (typeof document === 'undefined') return
  const theme = content.theme || DEFAULT_CONTENT.theme
  const vars = themeToCssVars(theme)
  const root = document.documentElement
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value)
  }
  const brand = theme.brand || DEFAULT_CONTENT.theme.brand
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', brand)

  const href = googleFontsHref(theme)
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null
  if (href) {
    if (!link) {
      link = document.createElement('link')
      link.id = FONT_LINK_ID
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    if (link.href !== href) link.href = href
  } else if (link) {
    link.remove()
  }

  for (const [key, url] of [
    ['adwise-font-display-custom', theme.fontDisplayUrl],
    ['adwise-font-body-custom', theme.fontBodyUrl],
    ['adwise-font-serif-custom', theme.fontSerifUrl],
  ] as const) {
    let el = document.getElementById(key) as HTMLLinkElement | null
    const u = safeStylesheetUrl(String(url || ''))
    if (u) {
      if (!el) {
        el = document.createElement('link')
        el.id = key
        el.rel = 'stylesheet'
        document.head.appendChild(el)
      }
      if (el.href !== u) el.href = u
    } else if (el) {
      el.remove()
    }
  }
}

export function SiteContentProvider({
  children,
  initialContent,
}: {
  children: ReactNode
  initialContent?: CmsContent | null
}) {
  const seeded = initialContent ? normalizeContent(initialContent) : DEFAULT_CONTENT
  const [content, setContent] = useState<CmsContent>(seeded)
  const [ready, setReady] = useState(Boolean(initialContent))

  const refresh = useCallback(async () => {
    const next = await fetchContent()
    setContent(next)
    applyTheme(next)
    setReady(true)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Keep open tabs in sync after admin saves (or another device edits).
  useEffect(() => {
    const onFocus = () => {
      void refresh()
    }
    const onVis = () => {
      if (document.visibilityState === 'visible') void refresh()
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVis)
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh()
    }, 60_000)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVis)
      window.clearInterval(timer)
    }
  }, [refresh])

  useEffect(() => {
    applyTheme(content)
  }, [content])

  const value = useMemo<SiteContentValue>(
    () => ({
      content,
      logos: visibleLogos(content),
      channels: contactChannelsFromSite(content.site),
      refresh,
      ready,
    }),
    [content, refresh, ready],
  )

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

export function useSiteContent() {
  return useContext(SiteContentContext)
}
