import type { CSSProperties } from 'react'
import defaultJson from '../data/cms-default.json'
import { sanitizeDeep } from './text-sanitize'
import { resolveFontStack } from './fonts'

export type LogoItem = {
  id: string
  name: string
  src: string
  order: number
  visible: boolean
}

export type NavItem = { href: string; label: string }

export type TextStyleOverride = {
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  fontStyle?: string
}

export type SectionLayoutItem = {
  id: 'hero' | 'services' | 'clients' | 'spotlight' | 'process' | 'about' | 'contact'
  visible: boolean
  order: number
  background?: string
}

export type CustomPage = {
  id: string
  slug: string
  title: string
  body: string
  published: boolean
  showInNav: boolean
}

export type ChannelItem = {
  id: 'whatsapp' | 'email' | 'call' | 'sms'
  label: string
  visible: boolean
}

export type ThemeColors = {
  ink: string
  inkSoft: string
  paper: string
  paperDeep: string
  brand: string
  brandDeep: string
  brass: string
  muted: string
  fontDisplay: string
  fontBody: string
  fontSerif: string
  fontDisplayCustom: string
  fontBodyCustom: string
  fontSerifCustom: string
  fontDisplayUrl: string
  fontBodyUrl: string
  fontSerifUrl: string
  showColorRail: boolean
  pageBackground: string
}

export type BrandAssets = {
  logoSrc: string
  faviconSrc: string
  ogImageSrc: string
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
  brand: BrandAssets
  theme: ThemeColors
  layout: { sections: SectionLayoutItem[] }
  textStyles: Record<string, TextStyleOverride>
  channels: ChannelItem[]
  customPages: CustomPage[]
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
    showOpening: boolean
    showOrbit: boolean
    background: string
  }
  clients: {
    eyebrow: string
    title: string
    subtitle: string
    emptyMessage: string
    background: string
    marqueeSpeed: number
  }
  services: {
    eyebrow: string
    title: string
    subtitle: string
    background: string
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
    background: string
  }
  process: {
    eyebrow: string
    title: string
    subtitle: string
    background: string
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
    background: string
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
    background: string
    captchaLabel: string
    captchaIdle: string
    captchaChecking: string
    captchaVerified: string
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

export const DEFAULT_LAYOUT_SECTIONS: SectionLayoutItem[] = [
  { id: 'hero', visible: true, order: 0, background: 'aurora' },
  { id: 'services', visible: true, order: 1, background: 'brand' },
  { id: 'clients', visible: true, order: 2, background: 'white' },
  { id: 'spotlight', visible: true, order: 3, background: 'ink' },
  { id: 'process', visible: true, order: 4, background: 'aurora' },
  { id: 'about', visible: true, order: 5, background: 'inkGold' },
  { id: 'contact', visible: true, order: 6, background: 'brand' },
]

export const DEFAULT_CHANNELS: ChannelItem[] = [
  { id: 'whatsapp', label: 'WhatsApp', visible: true },
  { id: 'email', label: 'Email', visible: true },
  { id: 'call', label: 'Call', visible: true },
  { id: 'sms', label: 'SMS', visible: true },
]

export const DEFAULT_BRAND: BrandAssets = {
  logoSrc: '/logo.png',
  faviconSrc: '/favicon.png',
  ogImageSrc: '/logo.png',
}

export const DEFAULT_THEME: ThemeColors = {
  ink: '#14130f',
  inkSoft: '#1f1c16',
  paper: '#e8dfd0',
  paperDeep: '#d9cdb8',
  brand: '#fdc621',
  brandDeep: '#c49200',
  brass: '#8f7343',
  muted: '#5c5548',
  fontDisplay: 'bricolage',
  fontBody: 'sora',
  fontSerif: 'eb-garamond',
  fontDisplayCustom: '',
  fontBodyCustom: '',
  fontSerifCustom: '',
  fontDisplayUrl: '',
  fontBodyUrl: '',
  fontSerifUrl: '',
  showColorRail: true,
  pageBackground: '',
}

export const BG_PRESETS = [
  { id: 'default', label: 'Section default' },
  { id: 'aurora', label: 'Soft paper aurora' },
  { id: 'brand', label: 'Gold field' },
  { id: 'ink', label: 'Dark ink' },
  { id: 'inkGold', label: 'Ink + gold' },
  { id: 'white', label: 'White' },
  { id: 'paper', label: 'Paper' },
] as const

export const FONT_SIZE_OPTIONS = [
  { id: '', label: 'Default size' },
  { id: '0.75rem', label: 'XS' },
  { id: '0.875rem', label: 'SM' },
  { id: '1rem', label: 'Base' },
  { id: '1.125rem', label: 'MD' },
  { id: '1.25rem', label: 'LG' },
  { id: '1.5rem', label: 'XL' },
  { id: '1.875rem', label: '2XL' },
  { id: '2.25rem', label: '3XL' },
  { id: '3rem', label: '4XL' },
  { id: 'clamp(1.5rem,5vw,3.5rem)', label: 'Fluid hero' },
]

/** Visible logos in display order */
export function visibleLogos(content: CmsContent): LogoItem[] {
  return [...(content.logos || [])]
    .filter((l) => l.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export function orderedSections(content: CmsContent): SectionLayoutItem[] {
  const sections = content.layout?.sections?.length
    ? content.layout.sections
    : DEFAULT_LAYOUT_SECTIONS
  return [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
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
  const vars: Record<string, string> = {
    '--color-ink': t.ink,
    '--color-ink-soft': t.inkSoft,
    '--color-paper': t.paper,
    '--color-paper-deep': t.paperDeep,
    '--color-brand': t.brand,
    '--color-brand-deep': t.brandDeep,
    '--color-brass': t.brass,
    '--color-muted': t.muted,
    '--font-display-stack': resolveFontStack('display', t.fontDisplay, t.fontDisplayCustom),
    '--font-body-stack': resolveFontStack('body', t.fontBody, t.fontBodyCustom),
    '--font-serif-stack': resolveFontStack('serif', t.fontSerif, t.fontSerifCustom),
  }
  if (t.pageBackground) vars['--page-background'] = t.pageBackground
  return vars
}

export function textStyleToCss(style?: TextStyleOverride): CSSProperties {
  if (!style) return {}
  const css: CSSProperties = {}
  if (style.fontFamily) css.fontFamily = style.fontFamily
  if (style.fontSize) css.fontSize = style.fontSize
  if (style.fontWeight) css.fontWeight = style.fontWeight as CSSProperties['fontWeight']
  if (style.color) css.color = style.color
  if (style.fontStyle) css.fontStyle = style.fontStyle as CSSProperties['fontStyle']
  return css
}

export function backgroundClass(preset?: string): string {
  switch (preset) {
    case 'aurora':
      return 'section-aurora'
    case 'brand':
      return 'brand-field'
    case 'ink':
      return 'bg-ink text-white'
    case 'inkGold':
      return 'section-ink-gold'
    case 'white':
      return 'bg-white text-ink'
    case 'paper':
      return 'bg-paper text-ink'
    default:
      return ''
  }
}

/** Resolve section background from layout tab, then per-section field, then fallback class. */
export function sectionBackground(
  content: CmsContent,
  id: SectionLayoutItem['id'],
  fallbackClass: string,
): string {
  const layoutPreset = content.layout?.sections?.find((s) => s.id === id)?.background
  const sectionKey = id as keyof CmsContent
  const sectionBlock = content[sectionKey] as { background?: string } | undefined
  const preset =
    layoutPreset && layoutPreset !== 'default'
      ? layoutPreset
      : sectionBlock?.background && sectionBlock.background !== 'default'
        ? sectionBlock.background
        : undefined
  return backgroundClass(preset) || fallbackClass
}

export function brandAssetRepoPath(src: string | undefined | null): string | null {
  if (!src || typeof src !== 'string') return null
  if (src.startsWith('/uploads/brand/') || src.startsWith('/uploads/logos/')) return `public${src}`
  return null
}

export function normalizeContent(raw: unknown): CmsContent {
  const base = structuredClone(DEFAULT_CONTENT)
  if (!raw || typeof raw !== 'object') return sanitizeDeep(base)
  const incoming = raw as Partial<CmsContent>
  const merged: CmsContent = {
    ...base,
    ...incoming,
    version: 1,
    site: { ...base.site, ...(incoming.site || {}) },
    brand: { ...base.brand, ...(incoming.brand || {}) },
    theme: { ...base.theme, ...(incoming.theme || {}) },
    layout: {
      sections:
        Array.isArray(incoming.layout?.sections) && incoming.layout.sections.length > 0
          ? incoming.layout.sections
          : base.layout?.sections || DEFAULT_LAYOUT_SECTIONS,
    },
    textStyles: { ...(base.textStyles || {}), ...(incoming.textStyles || {}) },
    channels: incoming.channels?.length ? incoming.channels : base.channels || DEFAULT_CHANNELS,
    customPages: Array.isArray(incoming.customPages)
      ? incoming.customPages
      : base.customPages || [],
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
  return sanitizeDeep(merged)
}
