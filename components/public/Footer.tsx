import { GitBranch, Link2, Mail, Download, Heart } from 'lucide-react'
import type { Profile } from '@/lib/types'

interface FooterProps {
  profile: Profile | null
}

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer({ profile }: FooterProps) {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-12">
        <div className="grid md:grid-cols-3 gap-8 md:gap-10 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">
              Charity <span className="gradient-text">Agutu</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Data Scientist &amp; Machine Learning Practitioner transforming data into actionable insights.
            </p>
            {profile?.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm px-4 py-2 rounded-full hover:bg-cyan-500/20 transition-colors"
              >
                <Download size={14} />
                Download CV
              </a>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-5">Connect</h4>
            <div className="flex gap-3 mb-6">
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noreferrer"
                  className="w-10 h-10 glass rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-300">
                  <GitBranch size={16} />
                </a>
              )}
              {profile?.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer"
                  className="w-10 h-10 glass rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-300">
                  <Link2 size={16} />
                </a>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`}
                  className="w-10 h-10 glass rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-300">
                  <Mail size={16} />
                </a>
              )}
            </div>
            <p className="text-slate-500 text-xs">{profile?.location || 'Nairobi, Kenya'}</p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Charity Agutu Martha. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs flex items-center gap-1">
            Built with <Heart size={12} className="text-cyan-400" /> using Next.js & Supabase
          </p>
        </div>
      </div>
    </footer>
  )
}
