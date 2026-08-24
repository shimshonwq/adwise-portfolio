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
  visibleLogos,
  type CmsContent,
  type LogoItem,
} from './content'

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

async function fetchContent(): Promise<CmsContent> {
  try {
    const res = await fetch('/api/content/', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (data?.content) return data.content as CmsContent
      if (data?.site) return data as CmsContent
    }
  } catch {
    /* fall through */
  }
  try {
    const res = await fetch('/data/content.json', { cache: 'no-store' })
    if (res.ok) return (await res.json()) as CmsContent
  } catch {
    /* fall through */
  }
  return DEFAULT_CONTENT
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<CmsContent>(DEFAULT_CONTENT)
  const [ready, setReady] = useState(false)

  const refresh = useCallback(async () => {
    const next = await fetchContent()
    setContent(next)
    setReady(true)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

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
