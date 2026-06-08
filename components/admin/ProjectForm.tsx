'use client'

import { useState, useTransition } from 'react'
import { createProject, updateProject } from '@/lib/actions'
import { Save, Plus, X } from 'lucide-react'
import { slugify } from '@/lib/utils'
import type { Project } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface ProjectFormProps {
  project?: Project
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [title, setTitle] = useState(project?.title || '')
  const [slug, setSlug] = useState(project?.slug || '')
  const [techs, setTechs] = useState<string[]>(project?.technologies || [])
  const [techInput, setTechInput] = useState('')
  const [isFeatured, setIsFeatured] = useState(project?.is_featured || false)
  const [isArchived, setIsArchived] = useState(project?.is_archived || false)

  const handleTitleChange = (v: string) => {
    setTitle(v)
    if (!project) setSlug(slugify(v))
  }

  const addTech = () => {
    const t = techInput.trim()
    if (t && !techs.includes(t)) setTechs([...techs, t])
    setTechInput('')
  }

  const removeTech = (t: string) => setTechs(techs.filter((x) => x !== t))

  const action = async (formData: FormData) => {
    formData.set('title', title)
    formData.set('slug', slug)
    formData.set('technologies', JSON.stringify(techs))
    formData.set('is_featured', String(isFeatured))
    formData.set('is_archived', String(isArchived))

    startTransition(async () => {
      const res = project
        ? await updateProject(project.id, formData)
        : await createProject(formData)
      if (res.success) {
        setMsg({ type: 'success', text: 'Project saved!' })
        if (!project) router.push('/admin/projects')
      } else {
        setMsg({ type: 'error', text: res.error || 'Error' })
      }
    })
  }

  return (
    <form action={action} className="space-y-6">
      {msg && (
        <div className={`px-4 py-3 rounded-xl text-sm ${msg.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {msg.text}
        </div>
      )}

      <div className="glass rounded-2xl p-6 border border-slate-700/50 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Title *</label>
            <input value={title} onChange={(e) => handleTitleChange(e.target.value)}
              required className="input-field" placeholder="H1N1 Vaccination Prediction" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Slug *</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)}
              required className="input-field" placeholder="h1n1-vaccination-prediction" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Description *</label>
          <textarea name="description" rows={3} required defaultValue={project?.description}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
        </div>

        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Problem Statement</label>
          <textarea name="problem_statement" rows={3} defaultValue={project?.problem_statement}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
        </div>

        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Methodology</label>
          <textarea name="methodology" rows={3} defaultValue={project?.methodology}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
        </div>

        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Results</label>
          <textarea name="results" rows={3} defaultValue={project?.results}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">GitHub URL</label>
            <input type="url" name="github_url" defaultValue={project?.github_url}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Live URL</label>
            <input type="url" name="live_url" defaultValue={project?.live_url}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Technologies</label>
          <div className="flex gap-2 mb-3">
            <input value={techInput} onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech() } }}
              placeholder="Add technology..." className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
            <button type="button" onClick={addTech}
              className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 px-4 py-2.5 rounded-xl text-sm hover:bg-cyan-500/30 transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {techs.map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                {t}
                <button type="button" onClick={() => removeTech(t)} className="hover:text-red-400 transition-colors"><X size={10} /></button>
              </span>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-cyan-500" />
            <span className="text-sm text-slate-300">Featured Project</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={isArchived} onChange={(e) => setIsArchived(e.target.checked)} className="w-4 h-4 accent-cyan-500" />
            <span className="text-sm text-slate-300">Archived</span>
          </label>
        </div>
      </div>

      <button type="submit" disabled={pending}
        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-900 font-semibold px-6 py-3 rounded-xl transition-all duration-300 text-sm">
        <Save size={16} />
        {pending ? 'Saving...' : 'Save Project'}
      </button>
    </form>
  )
}
