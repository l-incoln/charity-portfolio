'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Calendar, CheckCircle2 } from 'lucide-react'
import type { Experience } from '@/lib/types'

interface ExperienceProps {
  experience: Experience[]
}

const fallback: Experience[] = [
  {
    id: '1',
    organization: 'Moringa School',
    position: 'Data Science Bootcamp',
    start_date: '2025-01-01',
    end_date: '2025-11-30',
    is_current: false,
    description: 'Intensive full-stack Data Science program covering the complete data science workflow from data collection to deployment.',
    achievements: ['Data cleaning & preprocessing', 'Machine learning model development', 'Dashboard development with Tableau', 'Predictive analytics & forecasting', 'End-to-end project delivery'],
    display_order: 1,
    created_at: '',
  },
]

function formatPeriod(start: string, end?: string, isCurrent?: boolean): string {
  const opts: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' }
  const s = new Date(start).toLocaleDateString('en-US', opts)
  const e = isCurrent ? 'Present' : end ? new Date(end).toLocaleDateString('en-US', opts) : 'Present'
  return `${s} – ${e}`
}

export default function ExperienceSection({ experience }: ExperienceProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const items = experience.length > 0 ? experience : fallback

  return (
    <section id="experience" ref={ref} className="section-padding relative">
      {/* Dark background */}
      <div className="absolute inset-0 bg-slate-900/50" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-cyan-400 text-sm uppercase tracking-widest font-semibold mb-3">My Journey</p>
          <h2 className="text-5xl md:text-6xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
            Experience &amp; <span className="gradient-text">Education</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent" />

          <div className="space-y-12">
            {items.sort((a, b) => a.display_order - b.display_order).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className={`relative flex gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
              >
                {/* Year bubble */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-cyan-500 border-4 border-navy flex items-center justify-center z-10 flex-shrink-0">
                  <span className="text-xs font-bold text-slate-900">
                    {new Date(item.start_date).getFullYear()}
                  </span>
                </div>

                {/* Card */}
                <div className={`ml-20 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                  <div className="glass rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                          {item.organization}
                        </h3>
                        <p className="text-cyan-400 font-medium text-sm mt-0.5">{item.position}</p>
                      </div>
                      {item.is_current && (
                        <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full font-medium">
                          Current
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-4">
                      <Calendar size={12} />
                      <span>{formatPeriod(item.start_date, item.end_date, item.is_current)}</span>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{item.description}</p>

                    <ul className="space-y-2">
                      {item.achievements.map((ach, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                          <CheckCircle2 size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                          {ach}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
