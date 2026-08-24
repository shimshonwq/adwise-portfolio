import { FaWhatsapp, FaEnvelope, FaPhoneAlt, FaSms } from 'react-icons/fa'
import { useSiteContent } from '../lib/SiteContentContext'

const channelMeta = [
  { key: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp },
  { key: 'email', label: 'Email', icon: FaEnvelope },
  { key: 'call', label: 'Call', icon: FaPhoneAlt },
  { key: 'sms', label: 'SMS', icon: FaSms },
] as const

interface ContactChannelsProps {
  /** dark = icons on light bg; light = icons on gold bg; onDark = icons on black bg */
  variant?: 'dark' | 'light' | 'onDark'
  className?: string
}

export default function ContactChannels({
  variant = 'dark',
  className = '',
}: ContactChannelsProps) {
  const { channels } = useSiteContent()
  const shell =
    variant === 'onDark'
      ? 'border-white text-white hover:border-brand hover:bg-brand hover:text-ink'
      : variant === 'light'
        ? 'border-ink text-ink hover:border-ink hover:bg-ink hover:text-white'
        : 'border-ink text-ink hover:border-ink hover:bg-ink hover:text-white'

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {channelMeta.map((channel) => {
        const Icon = channel.icon
        const href = channels[channel.key]
        return (
          <a
            key={channel.key}
            href={href}
            target={channel.key === 'whatsapp' ? '_blank' : undefined}
            rel={channel.key === 'whatsapp' ? 'noopener noreferrer' : undefined}
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
