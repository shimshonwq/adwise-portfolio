import type { CSSProperties, ElementType, ReactNode } from 'react'
import { textStyleToCss, type TextStyleOverride } from './content'
import { useSiteContent } from './SiteContentContext'

type CmsTextProps = {
  path: string
  as?: ElementType
  className?: string
  children: ReactNode
  style?: CSSProperties
}

/** Renders text with optional per-field style overrides from CMS textStyles. */
export function CmsText({ path, as: Tag = 'span', className = '', children, style }: CmsTextProps) {
  const { content } = useSiteContent()
  const override = (content.textStyles || {})[path] as TextStyleOverride | undefined
  const merged = { ...textStyleToCss(override), ...style }
  return (
    <Tag className={className} style={Object.keys(merged).length ? merged : undefined}>
      {children}
    </Tag>
  )
}
