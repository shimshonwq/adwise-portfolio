import { motion } from 'framer-motion'
import {
  FaBullhorn,
  FaCamera,
  FaLaptop,
  FaPaintBrush,
  FaPenNib,
  FaVideo,
} from 'react-icons/fa'

const crafts = [
  { icon: FaPaintBrush, label: 'Graphics', hint: 'Visual systems' },
  { icon: FaPenNib, label: 'Branding', hint: 'Marks & identity' },
  { icon: FaVideo, label: 'Video', hint: 'Motion & reels' },
  { icon: FaCamera, label: 'Media', hint: 'Photo & content' },
  { icon: FaBullhorn, label: 'Marketing', hint: 'Campaigns' },
  { icon: FaLaptop, label: 'Digital', hint: 'Online presence' },
]

/** Mid-page craft icon strip — signals marketing, graphics, and media */
export default function CraftIcons() {
  return (
    <section className="relative overflow-hidden section-aurora py-16 md:py-20" aria-label="What we create">
      <div className="site-shell relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Studio craft</p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
            Marketing, graphics & media — under one roof
          </h2>
        </div>

        <div className="tilt-3d-wrap mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
          {crafts.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.label}
                initial={{ y: 18, rotateX: 8 }}
                whileInView={{ y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="tilt-3d panel-3d flex flex-col items-center gap-3 border border-ink/8 bg-white/85 px-3 py-5 text-center"
              >
                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-brand shadow-[0_12px_24px_-14px_rgba(14,14,14,0.45)]">
                  <Icon className="text-lg" aria-hidden />
                </span>
                <span className="relative z-10">
                  <span className="block font-display text-sm font-bold tracking-tight text-ink">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-[0.7rem] font-medium text-ink/45">
                    {item.hint}
                  </span>
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
