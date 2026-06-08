import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ExperienceForm from '@/components/admin/ExperienceForm'
import type { Experience } from '@/lib/types'

interface Props { params: Promise<{ id: string }> }

export default async function EditExperiencePage({ params }: Props) {
  const { id } = await params
  let item: Experience | null = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('experience').select('*').eq('id', id).single()
    item = data as Experience
  } catch {}
  if (!item) notFound()

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin/experience" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Edit Experience</h1>
      </div>
      <ExperienceForm experience={item} />
    </div>
  )
}
