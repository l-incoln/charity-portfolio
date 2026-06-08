'use client'

import { useState } from 'react'
import { Upload, Trash2, FileText, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ResumeUploaderProps {
  currentUrl?: string | null
}

export default function ResumeUploader({ currentUrl }: ResumeUploaderProps) {
  const [url, setUrl] = useState(currentUrl || '')
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') { setMsg({ type: 'error', text: 'Only PDF files are accepted.' }); return }
    if (file.size > 10 * 1024 * 1024) { setMsg({ type: 'error', text: 'File must be under 10MB.' }); return }

    setUploading(true)
    const supabase = createClient()
    const path = `resume-${Date.now()}.pdf`
    const { data, error } = await supabase.storage.from('resumes').upload(path, file, { upsert: true, contentType: 'application/pdf' })
    if (error) { setMsg({ type: 'error', text: error.message }); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(data.path)
    setUrl(publicUrl)

    // Update profile resume_url
    await supabase.from('profiles').update({ resume_url: publicUrl }).neq('id', '00000000-0000-0000-0000-000000000000')

    setMsg({ type: 'success', text: 'Resume uploaded and saved!' })
    setUploading(false)
  }

  const handleDelete = async () => {
    if (!url) return
    const supabase = createClient()
    await supabase.from('profiles').update({ resume_url: null }).neq('id', '00000000-0000-0000-0000-000000000000')
    setUrl('')
    setMsg({ type: 'success', text: 'Resume removed.' })
  }

  return (
    <div className="space-y-6">
      {msg && (
        <div className={`px-4 py-3 rounded-xl text-sm ${msg.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {msg.text}
        </div>
      )}

      {url ? (
        <div className="glass rounded-2xl p-6 border border-green-500/25">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/25 flex items-center justify-center">
              <FileText size={24} className="text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">Resume (PDF)</p>
              <p className="text-slate-400 text-sm mt-0.5 truncate">{url}</p>
            </div>
            <div className="flex gap-2">
              <a href={url} target="_blank" rel="noreferrer"
                className="p-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-colors">
                <Eye size={16} />
              </a>
              <button onClick={handleDelete}
                className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 border border-dashed border-slate-600 text-center">
          <FileText size={40} className="text-slate-500 mx-auto mb-4" />
          <p className="text-slate-300 font-medium mb-1">No resume uploaded yet</p>
          <p className="text-slate-500 text-sm">Upload a PDF to make it downloadable from your portfolio</p>
        </div>
      )}

      <label className="cursor-pointer inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-900 font-semibold px-6 py-3 rounded-xl transition-all duration-300 text-sm">
        <Upload size={16} />
        {uploading ? 'Uploading...' : url ? 'Replace Resume' : 'Upload Resume (PDF)'}
        <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>

      <p className="text-slate-500 text-xs">Only PDF files · Max 10MB · File will be publicly accessible via your portfolio.</p>
    </div>
  )
}
