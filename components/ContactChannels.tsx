import { FaWhatsapp, FaEnvelope, FaPhoneAlt, FaSms } from 'react-icons/fa'
import { siteConfig } from '../config/site.config'

const channels = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    href: siteConfig.contactChannels.whatsapp,
    icon: FaWhatsapp,
  },
  {
    key: 'email',
    label: 'Email',
    href: siteConfig.contactChannels.email,
    icon: FaEnvelope,
  },
  {
    key: 'call',
    label: 'Call',
    href: siteConfig.contactChannels.call,
    icon: FaPhoneAlt,
  },
  {
    key: 'sms',
    label: 'SMS',
    href: siteConfig.contactChannels.sms,
    icon: FaSms,
  },
] as const

interface ContactChannelsProps {
  /** dark = icons on light bg; light = icons on dark/gold bg */
  variant?: 'dark' | 'light'
  className?: string
}

export default function ContactChannels({
  variant = 'dark',
  className = '',
}: ContactChannelsProps) {
  const shell =
    variant === 'light'
      ? 'border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-white'
      : 'border-line text-ink hover:border-ink hover:bg-ink hover:text-white'

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {channels.map((channel) => {
        const Icon = channel.icon
        return (
          <a
            key={channel.key}
            href={channel.href}
            target={channel.key === 'whatsapp' ? '_blank' : undefined}
            rel={channel.key === 'whatsapp' ? 'noopener noreferrer' : undefined}
            aria-label={channel.label}
            title={channel.label}
            className={`inline-flex h-12 w-12 items-center justify-center rounded-full border text-lg transition-all hover:-translate-y-0.5 ${shell}`}
          >
            <Icon />
          </a>
        )
      })}
    </div>
  )
}
