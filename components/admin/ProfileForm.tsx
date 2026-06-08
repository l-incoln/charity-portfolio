'use client'

import { useState, useTransition } from 'react'
import { updateProfile } from '@/lib/actions'
import { Save, Upload } from 'lucide-react'
import type { Profile } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

interface ProfileFormProps {
  profile: Profile | null
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(profile?.profile_image_url || '')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setMsg({ type: 'error', text: 'Image must be under 5MB' }); return }
    if (!file.type.startsWith('image/')) { setMsg({ type: 'error', text: 'File must be an image' }); return }

    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `profile-${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('profile-images').upload(path, file, { upsert: true })
    if (error) { setMsg({ type: 'error', text: error.message }); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('profile-images').getPublicUrl(data.path)
    setImageUrl(publicUrl)
    setUploading(false)
    setMsg({ type: 'success', text: 'Image uploaded!' })
  }

  const action = async (formData: FormData) => {
    formData.set('profile_image_url', imageUrl)
    startTransition(async () => {
      const res = await updateProfile(formData)
      setMsg(res.success ? { type: 'success', text: 'Profile updated!' } : { type: 'error', text: res.error || 'Error' })
    })
  }

  return (
    <form action={action} className="space-y-8">
      {msg && (
        <div className={`px-4 py-3 rounded-xl text-sm ${msg.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {msg.text}
        </div>
      )}

      {/* Photo */}
      <div className="glass rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-base font-bold text-white mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>Profile Photo</h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
            {imageUrl ? (
              <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold gradient-text">CA</span>
            )}
          </div>
          <div>
            <label className="cursor-pointer flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-sm px-4 py-2.5 rounded-xl transition-colors">
              <Upload size={14} />
              {uploading ? 'Uploading...' : 'Upload Photo'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
            <p className="text-slate-500 text-xs mt-2">PNG, JPG, WebP up to 5MB</p>
          </div>
        </div>
        <input type="hidden" name="profile_image_url" value={imageUrl} />
      </div>

      {/* Personal Info */}
      <div className="glass rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-base font-bold text-white mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>Personal Information</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Full Name *" name="name" defaultValue={profile?.name} required />
          <Field label="Professional Title *" name="professional_title" defaultValue={profile?.professional_title} required />
          <div className="sm:col-span-2">
            <Field label="Tagline" name="tagline" defaultValue={profile?.tagline} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Bio</label>
            <textarea
              name="bio"
              rows={5}
              defaultValue={profile?.bio}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="glass rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-base font-bold text-white mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>Contact & Social</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Email *" name="email" type="email" defaultValue={profile?.email} required />
          <Field label="Phone" name="phone" defaultValue={profile?.phone} />
          <Field label="LinkedIn URL" name="linkedin_url" type="url" defaultValue={profile?.linkedin_url} />
          <Field label="GitHub URL" name="github_url" type="url" defaultValue={profile?.github_url} />
          <Field label="Location" name="location" defaultValue={profile?.location} />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-900 font-semibold px-6 py-3 rounded-xl transition-all duration-300 text-sm"
      >
        <Save size={16} />
        {pending ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
}

function Field({ label, name, type = 'text', defaultValue, required }: {
  label: string; name: string; type?: string; defaultValue?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue || ''}
        required={required}
        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
      />
    </div>
  )
}
