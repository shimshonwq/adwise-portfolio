import { motion, type Variants } from 'framer-motion'

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

const wordVariant: Variants = {
  hidden: { opacity: 0, y: 22, rotate: -2 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

type Props = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  delay?: number
}

export default function AnimatedText({ text, as = 'h2', className = '', delay = 0 }: Props) {
  const words = text.split(' ')
  const shared = {
    className,
    variants: container,
    initial: 'hidden' as const,
    whileInView: 'show' as const,
    viewport: { once: true, margin: '-40px' },
    transition: { delayChildren: delay },
    'aria-label': text,
  }

  const children = words.map((w, i) => (
    <motion.span
      key={`${w}-${i}`}
      variants={wordVariant}
      className="mr-[0.28em] inline-block last:mr-0"
    >
      {w}
    </motion.span>
  ))

  if (as === 'h1') return <motion.h1 {...shared}>{children}</motion.h1>
  if (as === 'h3') return <motion.h3 {...shared}>{children}</motion.h3>
  if (as === 'p') return <motion.p {...shared}>{children}</motion.p>
  if (as === 'span') return <motion.span {...shared}>{children}</motion.span>
  return <motion.h2 {...shared}>{children}</motion.h2>
}
