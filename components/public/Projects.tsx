'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink, GitBranch, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Project } from '@/lib/types'

interface ProjectsProps {
  projects: Project[]
}

const fallbackProjects: Project[] = [
  {
    id: '1',
    title: 'Predicting H1N1 Vaccination Uptake',
    slug: 'h1n1-vaccination-prediction',
    description: 'A machine learning model to predict the likelihood of individuals receiving the H1N1 flu vaccine based on behavioral, demographic, and health-related features.',
    problem_statement: 'Identify key drivers of vaccination uptake to enable targeted health communication campaigns.',
    results: 'Achieved 85% accuracy and 0.87 ROC-AUC. Improved forecast accuracy by 15%.',
    technologies: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib'],
    github_url: 'https://github.com/charityagutu',
    is_featured: true,
    is_archived: false,
    image_url: '',
    created_at: '',
    updated_at: '',
  },
]

export default function Projects({ projects }: ProjectsProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const displayProjects = projects.length > 0 ? projects : fallbackProjects
  const featured = displayProjects.filter((p) => p.is_featured)

  return (
    <section id="projects" ref={ref} className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-cyan-400 text-sm uppercase tracking-widest font-semibold mb-3">My Work</p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            Real-world data science projects delivering measurable business impact.
          </p>
        </motion.div>

        <div className="space-y-10">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className={`glass rounded-2xl border border-slate-700/50 hover:border-cyan-500/30 overflow-hidden transition-all duration-300 group flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Image */}
              <div className="md:w-2/5 relative overflow-hidden min-h-[240px] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                {project.image_url ? (
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <span className="text-2xl font-bold text-cyan-400" style={{ fontFamily: 'Sora, sans-serif' }}>
                        {project.title.charAt(0)}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm">Project Visual</p>
                  </div>
                )}
                {/* Featured badge */}
                <div className="absolute top-4 left-4 bg-cyan-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">
                  Featured
                </div>
              </div>

              {/* Content */}
              <div className="md:w-3/5 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {project.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-4">{project.description}</p>

                  {project.results && (
                    <div className="glass rounded-xl p-4 border border-green-500/20 mb-5">
                      <p className="text-xs text-green-400 uppercase tracking-wide font-semibold mb-1">Results</p>
                      <p className="text-slate-300 text-sm">{project.results}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="text-xs px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-5 py-2.5 rounded-full text-sm transition-all duration-300 hover:scale-105"
                  >
                    View Case Study
                    <ArrowRight size={14} />
                  </Link>
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 glass border border-slate-600 text-slate-300 hover:text-white px-5 py-2.5 rounded-full text-sm transition-all duration-300 hover:border-white"
                    >
                      <Github size={14} />
                      Code
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 glass border border-slate-600 text-slate-300 hover:text-white px-5 py-2.5 rounded-full text-sm transition-all duration-300 hover:border-white"
                    >
                      <ExternalLink size={14} />
                      Live
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {displayProjects.length > featured.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <button className="glass border border-slate-600 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 font-semibold px-8 py-3 rounded-full transition-all duration-300">
              View All Projects
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
