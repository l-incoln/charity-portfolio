import { createClient } from '@/lib/supabase/server'
import ResumeUploader from '@/components/admin/ResumeUploader'
import type { Profile } from '@/lib/types'

async function getProfile() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('profiles').select('resume_url').single()
    return data as Pick<Profile, 'resume_url'> | null
  } catch { return null }
}

export default async function ResumePage() {
  const profile = await getProfile()

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Resume</h1>
        <p className="text-slate-400 mt-1">Upload or replace your CV. Recruiters can download it from your portfolio.</p>
      </div>
      <ResumeUploader currentUrl={profile?.resume_url} />
    </div>
  )
}
