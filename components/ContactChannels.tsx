import { FaWhatsapp, FaEnvelope, FaPhoneAlt, FaSms } from 'react-icons/fa'
import { useSiteContent } from '../lib/SiteContentContext'
import { DEFAULT_CHANNELS } from '../lib/content'

const ICONS = {
  whatsapp: FaWhatsapp,
  email: FaEnvelope,
  call: FaPhoneAlt,
  sms: FaSms,
} as const

interface ContactChannelsProps {
  variant?: 'dark' | 'light' | 'onDark'
  className?: string
}

export default function ContactChannels({
  variant = 'dark',
  className = '',
}: ContactChannelsProps) {
  const { content, channels } = useSiteContent()
  const list = (content.channels?.length ? content.channels : DEFAULT_CHANNELS).filter(
    (c) => c.visible !== false,
  )
  const shell =
    variant === 'onDark'
      ? 'border-white text-white hover:border-brand hover:bg-brand hover:text-ink'
      : variant === 'light'
        ? 'border-ink text-ink hover:border-ink hover:bg-ink hover:text-white'
        : 'border-ink text-ink hover:border-ink hover:bg-ink hover:text-white'

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {list.map((channel) => {
        const Icon = ICONS[channel.id]
        if (!Icon) return null
        const href = channels[channel.id]
        return (
          <a
            key={channel.id}
            href={href}
            target={channel.id === 'whatsapp' ? '_blank' : undefined}
            rel={channel.id === 'whatsapp' ? 'noopener noreferrer' : undefined}
            aria-label={channel.label}
            title={channel.label}
            className={`inline-flex h-12 w-12 items-center justify-center rounded-lg border text-lg transition-all hover:-translate-y-0.5 ${shell}`}
          >
            <Icon />
          </a>
        )
      })}
    </div>
  )
}
