'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, User, FolderOpen, Star, Briefcase,
  Award, ImageIcon, FileText, MessageSquare, LogOut,
  ChevronLeft, Menu, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/profile', label: 'Profile', icon: User },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/skills', label: 'Skills', icon: Star },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/certifications', label: 'Certifications', icon: Award },
  { href: '/admin/media', label: 'Media', icon: ImageIcon },
  { href: '/admin/resume', label: 'Resume', icon: FileText },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className={cn('flex items-center gap-3 p-6 border-b border-slate-700/50', collapsed && 'justify-center px-4')}>
        <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold gradient-text" style={{ fontFamily: 'Sora, sans-serif' }}>CA</span>
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Charity Agutu</p>
            <p className="text-xs text-slate-500">Portfolio CMS</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                collapsed && 'justify-center px-2',
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-slate-700/50 space-y-2">
        <Link
          href="/"
          target="_blank"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-slate-500 hover:text-slate-300 transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <span className="w-4 h-4 flex-shrink-0">↗</span>
          {!collapsed && 'View Portfolio'}
        </Link>
        <button
          onClick={handleSignOut}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200',
            collapsed && 'justify-center'
          )}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className={cn(
        'hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-slate-900 border-r border-slate-700/50 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={12} className={cn('transition-transform duration-300', collapsed && 'rotate-180')} />
        </button>
      </div>

      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 glass p-2.5 rounded-xl border border-slate-700"
      >
        <Menu size={18} className="text-cyan-400" />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50"
          >
            <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-700/50"
            >
              <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
