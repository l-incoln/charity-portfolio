'use client'

import { useState, useTransition } from 'react'
import { createExperience, updateExperience } from '@/lib/actions'
import { Save, Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Experience } from '@/lib/types'

interface Props { experience?: Experience }

export default function ExperienceForm({ experience }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [achievements, setAchievements] = useState<string[]>(experience?.achievements || [])
  const [achInput, setAchInput] = useState('')
  const [isCurrent, setIsCurrent] = useState(experience?.is_current || false)

  const addAch = () => {
    const t = achInput.trim()
    if (t) setAchievements([...achievements, t])
    setAchInput('')
  }

  const action = async (formData: FormData) => {
    formData.set('achievements', JSON.stringify(achievements))
    formData.set('is_current', String(isCurrent))
    startTransition(async () => {
      const res = experience ? await updateExperience(experience.id, formData) : await createExperience(formData)
      if (res.success) { setMsg({ type: 'success', text: 'Saved!' }); if (!experience) router.push('/admin/experience') }
      else setMsg({ type: 'error', text: res.error || 'Error' })
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
          {[
            { label: 'Organization *', name: 'organization', defaultValue: experience?.organization, required: true },
            { label: 'Position / Role *', name: 'position', defaultValue: experience?.position, required: true },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">{f.label}</label>
              <input name={f.name} required={f.required} defaultValue={f.defaultValue}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
          ))}
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Start Date *</label>
            <input type="date" name="start_date" required defaultValue={experience?.start_date?.slice(0, 10)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">End Date</label>
            <input type="date" name="end_date" defaultValue={experience?.end_date?.slice(0, 10)} disabled={isCurrent}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-40" />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={isCurrent} onChange={(e) => setIsCurrent(e.target.checked)} className="w-4 h-4 accent-cyan-500" />
          <span className="text-sm text-slate-300">Currently working here</span>
        </label>

        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Description</label>
          <textarea name="description" rows={3} defaultValue={experience?.description}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
        </div>

        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Achievements</label>
          <div className="flex gap-2 mb-3">
            <input value={achInput} onChange={(e) => setAchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAch() } }}
              placeholder="Add achievement..." className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
            <button type="button" onClick={addAch} className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 px-4 py-2.5 rounded-xl text-sm hover:bg-cyan-500/30 transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <ul className="space-y-2">
            {achievements.map((a, i) => (
              <li key={i} className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200">
                <span className="flex-1">{a}</span>
                <button type="button" onClick={() => setAchievements(achievements.filter((_, j) => j !== i))} className="text-slate-500 hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-28">
          <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Display Order</label>
          <input type="number" name="display_order" defaultValue={experience?.display_order ?? 0} min={0}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
        </div>
      </div>

      <button type="submit" disabled={pending}
        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-900 font-semibold px-6 py-3 rounded-xl transition-all duration-300 text-sm">
        <Save size={16} />
        {pending ? 'Saving...' : 'Save Experience'}
      </button>
    </form>
  )
}
