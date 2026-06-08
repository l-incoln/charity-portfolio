'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Mail, GitBranch, Linkedin, Target, Zap } from 'lucide-react'
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
          className="text-center mb-16"
        >
          <p className="text-cyan-400 text-sm uppercase tracking-widest font-semibold mb-3">Who I Am</p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
            About <span className="gradient-text">Me</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Bio */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-slate-300 text-lg leading-relaxed">
              {profile?.bio || 'I am a passionate Data Scientist and Machine Learning Practitioner with expertise in transforming raw data into strategic business value. Currently completing my Data Science Bootcamp at Moringa School, I specialize in predictive analytics, healthcare data, and business intelligence dashboards.'}
            </p>
            <p className="text-slate-400 leading-relaxed">
              I am driven by the belief that data-driven decisions lead to meaningful impact. Every dataset tells a story — my job is to find it, understand it, and communicate it effectively to stakeholders.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {specializations.map((spec) => (
                <div key={spec.label} className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-slate-700 text-sm">
                  <spec.icon size={14} className={spec.color} />
                  <span className="text-slate-300">{spec.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Quick Facts */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="glass rounded-2xl p-8 border border-cyan-500/15 space-y-5"
          >
            <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
              Quick Facts
            </h3>

            {[
              { icon: MapPin, label: 'Location', value: profile?.location || 'Nairobi, Kenya' },
              { icon: Mail, label: 'Email', value: profile?.email || 'charityagutu@gmail.com', href: `mailto:${profile?.email}` },
              { icon: GitBranch, label: 'GitHub', value: 'charityagutu', href: profile?.github_url || '#' },
              { icon: Linkedin, label: 'LinkedIn', value: 'charityagutu', href: profile?.linkedin_url || '#' },
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
