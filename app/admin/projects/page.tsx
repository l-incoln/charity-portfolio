import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import { deleteProject } from '@/lib/actions'
import type { Project } from '@/lib/types'

async function getProjects() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    return (data as Project[]) || []
  } catch { return [] }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Projects</h1>
          <p className="text-slate-400 mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/projects/new"
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-300">
          <Plus size={16} /> Add Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <EmptyState href="/admin/projects/new" label="Add your first project" />
      ) : (
        <div className="glass rounded-2xl border border-slate-700/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-6 py-4 text-xs text-slate-500 uppercase tracking-widest">Project</th>
                <th className="text-left px-6 py-4 text-xs text-slate-500 uppercase tracking-widest hidden md:table-cell">Technologies</th>
                <th className="text-left px-6 py-4 text-xs text-slate-500 uppercase tracking-widest hidden sm:table-cell">Status</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {project.is_featured && <Star size={14} className="text-yellow-400 flex-shrink-0" />}
                      <div>
                        <p className="text-sm font-medium text-white">{project.title}</p>
                        <p className="text-xs text-slate-500">/{project.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{t}</span>
                      ))}
                      {project.technologies.length > 3 && <span className="text-xs text-slate-500">+{project.technologies.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${project.is_archived ? 'bg-slate-700 text-slate-400' : 'bg-green-500/15 text-green-400 border border-green-500/25'}`}>
                      {project.is_archived ? 'Archived' : 'Published'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/projects/${project.id}`}
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-200">
                        <Pencil size={14} />
                      </Link>
                      <DeleteBtn id={project.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function DeleteBtn({ id }: { id: string }) {
  return (
    <form action={async () => { 'use server'; await deleteProject(id) }}>
      <button type="submit"
        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
        onClick={(e) => { if (!confirm('Delete this project?')) e.preventDefault() }}>
        <Trash2 size={14} />
      </button>
    </form>
  )
}

function EmptyState({ href, label }: { href: string; label: string }) {
  return (
    <div className="glass rounded-2xl p-16 border border-slate-700/50 text-center">
      <p className="text-slate-400 mb-4">No items yet.</p>
      <Link href={href} className="text-cyan-400 hover:underline text-sm">{label}</Link>
    </div>
  )
}
