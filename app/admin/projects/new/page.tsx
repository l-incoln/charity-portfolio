import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProjectForm from '@/components/admin/ProjectForm'

export default function NewProjectPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin/projects" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Projects
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>New Project</h1>
      </div>
      <ProjectForm />
    </div>
  )
}
