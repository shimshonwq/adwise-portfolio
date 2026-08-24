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
  try {
    const res = await fetch('/api/content/', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (data?.content) return normalizeContent(data.content)
      if (data?.site) return normalizeContent(data)
    }
  } catch {
    /* fall through */
  }
  try {
    const res = await fetch('/data/content.json', { cache: 'no-store' })
    if (res.ok) return normalizeContent(await res.json())
  } catch {
    /* fall through */
  }
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
    const u = String(url || '').trim()
    if (u && u.startsWith('http')) {
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

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<CmsContent>(DEFAULT_CONTENT)
  const [ready, setReady] = useState(false)

  const refresh = useCallback(async () => {
    const next = await fetchContent()
    setContent(next)
    applyTheme(next)
    setReady(true)
  }, [])

  useEffect(() => {
    refresh()
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
