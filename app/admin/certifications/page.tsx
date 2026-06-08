import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Trash2, ExternalLink } from 'lucide-react'
import { createCertification, deleteCertification } from '@/lib/actions'
import type { Certification } from '@/lib/types'

async function getCerts() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('certifications').select('*').order('date_earned', { ascending: false })
    return (data as Certification[]) || []
  } catch { return [] }
}

async function handleCreateCertification(formData: FormData): Promise<void> {
  'use server'
  await createCertification(formData)
}

export default async function CertificationsPage() {
  const certs = await getCerts()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Certifications</h1>
        <p className="text-slate-400 mt-1">Manage your professional credentials.</p>
      </div>

      {/* Add form */}
      <div className="glass rounded-2xl p-6 border border-slate-700/50 mb-8">
        <h2 className="text-base font-bold text-white mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>Add Certification</h2>
        <form action={handleCreateCertification} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Name *</label>
              <input name="name" required className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Institution *</label>
              <input name="institution" required className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Date Earned *</label>
              <input type="date" name="date_earned" required className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Credential URL</label>
              <input type="url" name="credential_url" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-300">
            <Plus size={14} /> Add Certification
          </button>
        </form>
      </div>

      {/* List */}
      <div className="grid sm:grid-cols-2 gap-4">
        {certs.map((cert) => (
          <div key={cert.id} className="glass rounded-2xl p-5 border border-slate-700/50 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">{cert.name}</h3>
              <p className="text-cyan-400 text-xs mt-0.5">{cert.institution}</p>
              <p className="text-slate-500 text-xs mt-1">{new Date(cert.date_earned).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              {cert.credential_url && (
                <a href={cert.credential_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-cyan-400 hover:underline mt-2">
                  <ExternalLink size={11} /> Verify
                </a>
              )}
            </div>
            <form action={async () => { 'use server'; await deleteCertification(cert.id) }}>
              <button type="submit" className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 flex-shrink-0">
                <Trash2 size={14} />
              </button>
            </form>
          </div>
        ))}
        {certs.length === 0 && (
          <div className="sm:col-span-2 glass rounded-2xl p-12 border border-slate-700/50 text-center text-slate-400">
            No certifications yet. Add your first above.
          </div>
        )}
      </div>
    </div>
  )
}
