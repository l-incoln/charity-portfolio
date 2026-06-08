import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Trash2 } from 'lucide-react'
import { createSkill, deleteSkill } from '@/lib/actions'
import type { Skill, SkillCategory } from '@/lib/types'

async function getSkills() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('skills').select('*').order('category').order('display_order')
    return (data as Skill[]) || []
  } catch { return [] }
}

const categories: { value: SkillCategory; label: string }[] = [
  { value: 'programming', label: 'Programming' },
  { value: 'data_science', label: 'Data Science' },
  { value: 'machine_learning', label: 'Machine Learning' },
  { value: 'visualization', label: 'Visualization' },
  { value: 'business_intelligence', label: 'Business Intelligence' },
  { value: 'other', label: 'Other' },
]

async function handleCreateSkill(formData: FormData): Promise<void> {
  'use server'
  await createSkill(formData)
}

export default async function SkillsPage() {
  const skills = await getSkills()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Skills</h1>
        <p className="text-slate-400 mt-1">Manage your technical skillset.</p>
      </div>

      {/* Add form */}
      <div className="glass rounded-2xl p-6 border border-slate-700/50 mb-8">
        <h2 className="text-base font-bold text-white mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>Add Skill</h2>
        <form action={handleCreateSkill} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-36">
            <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Skill Name *</label>
            <input name="name" required placeholder="Python" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>
          <div className="flex-1 min-w-44">
            <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Category *</label>
            <select name="category" required className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors">
              {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="w-28">
            <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Order</label>
            <input name="display_order" type="number" defaultValue={0} min={0} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>
          <button type="submit" className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-300">
            <Plus size={14} /> Add
          </button>
        </form>
      </div>

      {/* Skills list grouped by category */}
      <div className="space-y-6">
        {categories.map(({ value, label }) => {
          const catSkills = skills.filter((s) => s.category === value)
          if (catSkills.length === 0) return null
          return (
            <div key={value} className="glass rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">{label}</h3>
              <div className="flex flex-wrap gap-2">
                {catSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full pl-4 pr-2 py-1.5">
                    <span className="text-sm text-slate-200">{skill.name}</span>
                    <form action={async () => { 'use server'; await deleteSkill(skill.id) }}>
                      <button type="submit" className="text-slate-500 hover:text-red-400 transition-colors p-0.5 rounded-full">
                        <Trash2 size={12} />
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        {skills.length === 0 && (
          <div className="glass rounded-2xl p-12 border border-slate-700/50 text-center text-slate-400">
            No skills yet. Add your first skill above.
          </div>
        )}
      </div>
    </div>
  )
}
