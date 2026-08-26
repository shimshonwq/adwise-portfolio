import Link from 'next/link'
import type { Project } from '../data/projects'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}/`}
      className="group soft-panel block overflow-hidden border border-white/10 bg-ink transition hover:border-brand/40"
    >
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{ background: project.gradient }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.coverImage}
          alt={project.title}
          width={640}
          height={480}
          loading="lazy"
          className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="space-y-2 p-5 md:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">{project.category}</p>
        <h2 className="font-display text-xl font-bold tracking-tight text-white md:text-2xl">
          {project.title}
        </h2>
        <p className="font-serif text-sm italic text-white/65">{project.description}</p>
        <p className="text-xs text-white/45">
          {project.client} · {project.year}
        </p>
      </div>
    </Link>
  )
}
