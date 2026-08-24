import defaultJson from '../data/cms-default.json'

export type LogoItem = {
  id: string
  name: string
  src: string
  order: number
  visible: boolean
}

export type NavItem = { href: string; label: string }

export type ThemeColors = {
  ink: string
  inkSoft: string
  paper: string
  paperDeep: string
  brand: string
  brandDeep: string
  brass: string
  muted: string
}

export type CmsContent = {
  version: number
  updatedAt: string | null
  site: {
    name: string
    shortName: string
    tagline: string
    description: string
    url: string
    email: string
    phone: string
    phoneDisplay: string
    location: string
    navCta: string
    navCtaHref: string
    nav: NavItem[]
    footerBlurb: string
    footerMeta: string
    footerExploreHeading: string
    footerContactHeading: string
    seoTitleSuffix: string
    seoKeywords: string
  }
  theme: ThemeColors
  hero: {
    openName: string
    eyebrow: string
    headline: string
    body: string
    bodyAccent: string
    ctaPrimaryLabel: string
    ctaPrimaryHref: string
    ctaSecondaryLabel: string
    ctaSecondaryHref: string
    orbitCaption: string
  }
  clients: {
    eyebrow: string
    title: string
    subtitle: string
    emptyMessage: string
  }
  services: {
    eyebrow: string
    title: string
    subtitle: string
    items: Array<{
      id: string
      num: string
      title: string
      description: string
      points: string[]
      tone: 'white' | 'ink' | 'gold'
    }>
  }
  spotlight: {
    eyebrow: string
    titleLines: string[]
    body: string
    accent: string
    ctaPrimaryLabel: string
    ctaPrimaryHref: string
    ctaSecondaryLabel: string
    ctaSecondaryHref: string
  }
  process: {
    eyebrow: string
    title: string
    subtitle: string
    steps: Array<{
      id: string
      num: string
      title: string
      body: string
      tone: 'white' | 'gold' | 'ink'
    }>
  }
  about: {
    eyebrow: string
    title: string
    body: string
    accent: string
    principles: Array<{
      id: string
      title: string
      body: string
      tone: 'ink' | 'gold' | 'paper'
    }>
  }
  contact: {
    eyebrow: string
    title: string
    intro: string
    formEyebrow: string
    formNote: string
    successMessage: string
    errorMessage: string
    nameLabel: string
    emailLabel: string
    phoneLabel: string
    messageLabel: string
    submitLabel: string
    sendingLabel: string
    namePlaceholder: string
    emailPlaceholder: string
    phonePlaceholder: string
    messagePlaceholder: string
  }
  projectsPage: {
    eyebrow: string
    title: string
    body: string
  }
  notFoundPage: {
    title: string
    body: string
    ctaLabel: string
  }
  logos: LogoItem[]
}

export const DEFAULT_CONTENT = defaultJson as CmsContent

export const CONTENT_KV_KEY = 'content:v1'
export const ADMIN_COOKIE = 'adwise_admin'
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 14

export const DEFAULT_THEME: ThemeColors = {
  ink: '#14130f',
  inkSoft: '#1f1c16',
  paper: '#e8dfd0',
  paperDeep: '#d9cdb8',
  brand: '#fdc621',
  brandDeep: '#c49200',
  brass: '#8f7343',
  muted: '#5c5548',
}

/** Visible logos in display order */
export function visibleLogos(content: CmsContent): LogoItem[] {
  return [...(content.logos || [])]
    .filter((l) => l.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export function contactChannelsFromSite(site: CmsContent['site']) {
  const digits = String(site.phone || '').replace(/\D/g, '')
  const e164 = digits.startsWith('1') && digits.length >= 11 ? digits : digits ? `1${digits}` : ''
  return {
    whatsapp: e164 ? `https://wa.me/${e164}` : site.email ? `mailto:${site.email}` : '#',
    email: site.email ? `mailto:${site.email}` : '#',
    call: e164 ? `tel:+${e164}` : '#',
    sms: e164 ? `sms:+${e164}` : '#',
  }
}

export function themeToCssVars(theme: ThemeColors): Record<string, string> {
  const t = { ...DEFAULT_THEME, ...theme }
  return {
    '--color-ink': t.ink,
    '--color-ink-soft': t.inkSoft,
    '--color-paper': t.paper,
    '--color-paper-deep': t.paperDeep,
    '--color-brand': t.brand,
    '--color-brand-deep': t.brandDeep,
    '--color-brass': t.brass,
    '--color-muted': t.muted,
  }
}

export function normalizeContent(raw: unknown): CmsContent {
  const base = structuredClone(DEFAULT_CONTENT)
  if (!raw || typeof raw !== 'object') return base
  const incoming = raw as Partial<CmsContent>
  return {
    ...base,
    ...incoming,
    version: 1,
    site: { ...base.site, ...(incoming.site || {}) },
    theme: { ...base.theme, ...(incoming.theme || {}) },
    hero: { ...base.hero, ...(incoming.hero || {}) },
    clients: { ...base.clients, ...(incoming.clients || {}) },
    services: {
      ...base.services,
      ...(incoming.services || {}),
      items: incoming.services?.items?.length ? incoming.services.items : base.services.items,
    },
    spotlight: {
      ...base.spotlight,
      ...(incoming.spotlight || {}),
      titleLines: incoming.spotlight?.titleLines?.length
        ? incoming.spotlight.titleLines
        : base.spotlight.titleLines,
    },
    process: {
      ...base.process,
      ...(incoming.process || {}),
      steps: incoming.process?.steps?.length ? incoming.process.steps : base.process.steps,
    },
    about: {
      ...base.about,
      ...(incoming.about || {}),
      principles: incoming.about?.principles?.length
        ? incoming.about.principles
        : base.about.principles,
    },
    contact: { ...base.contact, ...(incoming.contact || {}) },
    projectsPage: { ...base.projectsPage, ...(incoming.projectsPage || {}) },
    notFoundPage: { ...base.notFoundPage, ...(incoming.notFoundPage || {}) },
    logos: Array.isArray(incoming.logos) ? incoming.logos : base.logos,
  }
}
