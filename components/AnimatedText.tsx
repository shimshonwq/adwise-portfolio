import { motion, type Variants } from 'framer-motion'

/**
 * Animate with motion only — never hide text with opacity:0.
 * Optional shimmer: soft readable shine (dark on light, gold on dark).
 * Words rise with light 3D depth.
 */
const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
}

const wordVariant: Variants = {
  hidden: { y: 26, rotateX: 28, z: -36 },
  show: {
    y: 0,
    rotateX: 0,
    z: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

type Props = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  delay?: number
  immediate?: boolean
  /** Yellow ↔ black animated headline style */
  shimmer?: boolean
}

export default function AnimatedText({
  text,
  as = 'h2',
  className = '',
  delay = 0,
  immediate = false,
  shimmer = false,
}: Props) {
  const words = text.split(' ')
  const shared = {
    className: `hero-perspective ${className}`,
    variants: container,
    initial: 'hidden' as const,
    ...(immediate ? { animate: 'show' as const } : { whileInView: 'show' as const }),
    viewport: immediate ? undefined : { once: true, amount: 0.35 },
    transition: { delayChildren: delay },
    'aria-label': text,
    style: { transformStyle: 'preserve-3d' as const },
  }

  const children = words.map((w, i) => (
    <motion.span
      key={`${w}-${i}`}
      variants={wordVariant}
      className={`letter-3d mr-[0.28em] inline-block last:mr-0 ${shimmer ? 'brand-shimmer' : ''}`}
      style={{ transformStyle: 'preserve-3d' }}
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
