import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  FolderOpen, Star, Briefcase, Award, MessageSquare,
  User, FileText, ImageIcon, ArrowRight, Plus
} from 'lucide-react'

async function getStats() {
  try {
    const supabase = await createClient()
    const [projects, skills, certs, messages] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('skills').select('id', { count: 'exact', head: true }),
      supabase.from('certifications').select('id', { count: 'exact', head: true }),
      supabase.from('messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
    ])
    return {
      projects: projects.count ?? 0,
      skills: skills.count ?? 0,
      certifications: certs.count ?? 0,
      unreadMessages: messages.count ?? 0,
    }
  } catch {
    return { projects: 0, skills: 0, certifications: 0, unreadMessages: 0 }
  }
}

const statCards = (stats: Awaited<ReturnType<typeof getStats>>) => [
  { label: 'Projects', value: stats.projects, icon: FolderOpen, href: '/admin/projects', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { label: 'Skills', value: stats.skills, icon: Star, href: '/admin/skills', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { label: 'Certifications', value: stats.certifications, icon: Award, href: '/admin/certifications', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  { label: 'Unread Messages', value: stats.unreadMessages, icon: MessageSquare, href: '/admin/messages', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
]

const quickActions = [
  { label: 'Add Project', href: '/admin/projects/new', icon: Plus, color: 'text-blue-400' },
  { label: 'Update Profile', href: '/admin/profile', icon: User, color: 'text-cyan-400' },
  { label: 'Upload Resume', href: '/admin/resume', icon: FileText, color: 'text-green-400' },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon, color: 'text-purple-400' },
  { label: 'Read Messages', href: '/admin/messages', icon: MessageSquare, color: 'text-orange-400' },
  { label: 'Add Experience', href: '/admin/experience/new', icon: Briefcase, color: 'text-pink-400' },
]

export default async function AdminDashboard() {
  const stats = await getStats()
  const cards = statCards(stats)

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
          Dashboard
        </h1>
        <p className="text-slate-400 mt-1">Welcome back, Charity. Here&apos;s your portfolio overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="glass rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105 group"
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${card.bg} group-hover:scale-110 transition-transform duration-300`}>
              <card.icon size={18} className={card.color} />
            </div>
            <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>{card.value}</p>
            <p className="text-slate-400 text-sm mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6 border border-slate-700/50 mb-8">
        <h2 className="text-lg font-bold text-white mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-cyan-500/30 hover:bg-slate-800 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <action.icon size={16} className={action.color} />
                <span className="text-sm text-slate-300 group-hover:text-white font-medium">{action.label}</span>
              </div>
              <ArrowRight size={14} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Help */}
      <div className="glass rounded-2xl p-6 border border-cyan-500/15">
        <h2 className="text-base font-bold text-white mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>Getting Started</h2>
        <ol className="space-y-2 text-sm text-slate-400">
          <li>1. <Link href="/admin/profile" className="text-cyan-400 hover:underline">Update your profile</Link> with your bio, contact info, and photo.</li>
          <li>2. <Link href="/admin/projects/new" className="text-cyan-400 hover:underline">Add your projects</Link> with descriptions, results, and GitHub links.</li>
          <li>3. <Link href="/admin/resume" className="text-cyan-400 hover:underline">Upload your CV</Link> so recruiters can download it directly.</li>
          <li>4. <Link href="/admin/certifications" className="text-cyan-400 hover:underline">Add certifications</Link> to build credibility.</li>
        </ol>
      </div>
    </div>
  )
}
