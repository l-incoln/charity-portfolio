import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { deleteExperience } from '@/lib/actions'
import type { Experience } from '@/lib/types'

async function getExperience() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('experience').select('*').order('display_order')
    return (data as Experience[]) || []
  } catch { return [] }
}

export default async function ExperiencePage() {
  const items = await getExperience()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Experience</h1>
          <p className="text-slate-400 mt-1">Manage your career history.</p>
        </div>
        <Link href="/admin/experience/new"
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-300">
          <Plus size={16} /> Add Experience
        </Link>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="glass rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>{item.organization}</h3>
                <p className="text-cyan-400 text-sm font-medium">{item.position}</p>
                <p className="text-slate-500 text-xs mt-1">
                  {new Date(item.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} –{' '}
                  {item.is_current ? 'Present' : item.end_date ? new Date(item.end_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/admin/experience/${item.id}`}
                  className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-200">
                  <Pencil size={14} />
                </Link>
                <form action={async () => { 'use server'; await deleteExperience(item.id) }}>
                  <button type="submit" className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200">
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="glass rounded-2xl p-16 border border-slate-700/50 text-center">
            <p className="text-slate-400 mb-4">No experience entries yet.</p>
            <Link href="/admin/experience/new" className="text-cyan-400 hover:underline text-sm">Add your first entry</Link>
          </div>
        )}
      </div>
    </div>
  )
}
