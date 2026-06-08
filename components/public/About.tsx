'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Mail, GitBranch, Link2, Target, Zap } from 'lucide-react'
import type { Profile } from '@/lib/types'

interface AboutProps {
  profile: Profile | null
}

const specializations = [
  { icon: Zap, label: 'Machine Learning', color: 'text-cyan-400' },
  { icon: Target, label: 'Predictive Analytics', color: 'text-blue-400' },
  { icon: Zap, label: 'Data Visualization', color: 'text-cyan-400' },
  { icon: Target, label: 'Business Intelligence', color: 'text-blue-400' },
]

export default function About({ profile }: AboutProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={ref} className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-label">Who I Am</span>
          <h2 className="text-4xl md:text-5xl">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-lg mx-auto text-base">Passionate about transforming data into strategic business value.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          {/* Left: Bio */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              {profile?.bio || 'I am a passionate Data Scientist and Machine Learning Practitioner with expertise in transforming raw data into strategic business value. Currently completing my Data Science Bootcamp at Moringa School, I specialize in predictive analytics, healthcare data, and business intelligence dashboards.'}
            </p>
            <p className="text-slate-400 text-base leading-relaxed">
              I am driven by the belief that data-driven decisions lead to meaningful impact. Every dataset tells a story — my job is to find it, understand it, and communicate it effectively to stakeholders.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {specializations.map((spec) => (
                <div key={spec.label} className="flex items-center gap-2 bg-slate-800/70 border border-slate-700/60 px-4 py-2 rounded-xl text-sm hover:border-cyan-500/40 transition-colors">
                  <spec.icon size={13} className={spec.color} />
                  <span className="text-slate-300 font-medium">{spec.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Quick Facts */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="rounded-2xl p-6 md:p-8 border border-slate-700/50 bg-slate-900/60 space-y-5"
          >
              <h3 className="text-xl font-bold text-white mb-4">
              Quick Facts
            </h3>

            {[
              { icon: MapPin, label: 'Location', value: profile?.location || 'Nairobi, Kenya' },
              { icon: Mail, label: 'Email', value: profile?.email || 'charityagutu@gmail.com', href: `mailto:${profile?.email}` },
              { icon: GitBranch, label: 'GitHub', value: 'charityagutu', href: profile?.github_url || '#' },
              { icon: Link2, label: 'LinkedIn', value: 'charityagutu', href: profile?.linkedin_url || '#' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 pb-4 border-b border-slate-700/50 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <item.icon size={16} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noreferrer" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-slate-200 font-medium">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400">Data Science Bootcamp Progress</span>
                <span className="text-sm font-semibold text-cyan-400">90%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: '90%' } : {}}
                  transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
