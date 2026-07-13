import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import { projects } from '../../data/projects'

export default function ProjectPage() {
  const router = useRouter()
  const { slug } = router.query

  const project = projects.find(p => p.slug === slug)

  if (!project) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-3xl font-bold">Project not found</h1>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{project.title} - Adwise Media</title>
        <meta name="description" content={project.description} />
      </Head>

      <Navigation />
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={() => router.back()}
            className="mb-8 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-80 transition"
          >
            ← Back
          </button>

          <h1 className="text-4xl font-bold mb-4 font-heading">{project.title}</h1>
          <p className="text-lg text-gray-600 mb-8">{project.description}</p>

          {project.image && (
            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mt-8 mb-4">Project Overview</h2>
            <p>{project.fullDescription || project.description}</p>

            {project.tags && (
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Skills & Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-accent text-white rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}