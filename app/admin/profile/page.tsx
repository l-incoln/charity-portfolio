import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/admin/ProfileForm'
import type { Profile } from '@/lib/types'

async function getProfile() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('profiles').select('*').single()
    return data as Profile | null
  } catch { return null }
}

export default async function ProfilePage() {
  const profile = await getProfile()
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Profile</h1>
        <p className="text-slate-400 mt-1">Manage your personal information and public presence.</p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  )
}
