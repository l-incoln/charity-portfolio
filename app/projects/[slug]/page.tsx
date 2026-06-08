import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Github, ExternalLink, Tag } from 'lucide-react'
import type { Project } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params

  let project: Project | null = null

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single()
    project = data as Project
  } catch {
    // Supabase not configured
  }

  if (!project) notFound()

  return (
    <main className="min-h-screen bg-navy">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-sm mb-10 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        {/* Hero */}
        <div className="glass rounded-2xl overflow-hidden border border-slate-700/50 mb-10">
          {project.image_url ? (
            <img src={project.image_url} alt={project.title} className="w-full h-72 object-cover" />
          ) : (
            <div className="w-full h-56 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <span className="text-8xl font-bold gradient-text opacity-30" style={{ fontFamily: 'Sora, sans-serif' }}>
                {project.title.charAt(0)}
              </span>
            </div>
          )}
          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.is_featured && (
                <span className="bg-cyan-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">Featured</span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
              {project.title}
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">{project.description}</p>

            <div className="flex gap-3 mt-6">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 glass border border-slate-600 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 px-5 py-2.5 rounded-full text-sm transition-all duration-300">
                  <Github size={14} /> View Code
                </a>
              )}
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-5 py-2.5 rounded-full text-sm transition-all duration-300">
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {project.problem_statement && (
              <Section title="Problem Statement" content={project.problem_statement} />
            )}
            {project.methodology && (
              <Section title="Methodology" content={project.methodology} />
            )}
            {project.results && (
              <div className="glass rounded-2xl p-6 border border-green-500/20">
                <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>Results</h2>
                <p className="text-slate-300 leading-relaxed">{project.results}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Tag size={14} /> Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="text-xs px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-slate-700/50 text-sm text-slate-400 space-y-2">
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-green-400 font-medium">Completed</span>
              </div>
              <div className="flex justify-between">
                <span>Year</span>
                <span className="text-slate-200">{new Date(project.created_at).getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div className="glass rounded-2xl p-6 border border-slate-700/50">
      <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>{title}</h2>
      <p className="text-slate-300 leading-relaxed">{content}</p>
    </div>
  )
}
