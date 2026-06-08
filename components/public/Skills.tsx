'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Brain, BarChart2, Database, LineChart, Cpu, Code2 } from 'lucide-react'
import type { Skill } from '@/lib/types'

interface SkillsProps {
  skills: Skill[]
}

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  programming: { label: 'Programming', icon: Code2, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  data_science: { label: 'Data Science', icon: Database, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  machine_learning: { label: 'Machine Learning', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  visualization: { label: 'Visualization', icon: BarChart2, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  business_intelligence: { label: 'Business Intelligence', icon: LineChart, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  other: { label: 'Other', icon: Cpu, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
}

// Fallback skills if none in DB yet
const fallbackSkills: Skill[] = [
  { id: '1', name: 'Python', category: 'programming', display_order: 1, created_at: '' },
  { id: '2', name: 'SQL', category: 'programming', display_order: 2, created_at: '' },
  { id: '3', name: 'Pandas', category: 'data_science', display_order: 1, created_at: '' },
  { id: '4', name: 'NumPy', category: 'data_science', display_order: 2, created_at: '' },
  { id: '5', name: 'Scikit-Learn', category: 'machine_learning', display_order: 1, created_at: '' },
  { id: '6', name: 'Classification', category: 'machine_learning', display_order: 2, created_at: '' },
  { id: '7', name: 'Regression', category: 'machine_learning', display_order: 3, created_at: '' },
  { id: '8', name: 'Forecasting', category: 'machine_learning', display_order: 4, created_at: '' },
  { id: '9', name: 'Tableau', category: 'visualization', display_order: 1, created_at: '' },
  { id: '10', name: 'Matplotlib', category: 'visualization', display_order: 2, created_at: '' },
  { id: '11', name: 'Seaborn', category: 'visualization', display_order: 3, created_at: '' },
  { id: '12', name: 'Dashboard Development', category: 'business_intelligence', display_order: 1, created_at: '' },
  { id: '13', name: 'ETL', category: 'business_intelligence', display_order: 2, created_at: '' },
]

export default function Skills({ skills }: SkillsProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const displaySkills = skills.length > 0 ? skills : fallbackSkills

  // Group by category
  const grouped = displaySkills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  const categories = Object.keys(categoryConfig).filter((cat) => grouped[cat])

  return (
    <section id="skills" ref={ref} className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-cyan-400 text-sm uppercase tracking-widest font-semibold mb-3">What I Do</p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
            My <span className="gradient-text">Expertise</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {categories.map((cat, i) => {
            const config = categoryConfig[cat]
            const Icon = config.icon
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="glass rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl ${config.bg} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} className={config.color} />
                </div>
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {config.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {grouped[cat].sort((a, b) => a.display_order - b.display_order).map((skill) => (
                    <span
                      key={skill.id}
                      className={`text-xs px-3 py-1.5 rounded-full ${config.bg} border ${config.color} font-medium`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Tech stack wall */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p className="text-center text-slate-400 text-sm uppercase tracking-widest mb-6">Tech Stack</p>
          <div className="flex flex-wrap justify-center gap-3">
            {displaySkills.map((skill, i) => (
              <motion.span
                key={skill.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.04 }}
                whileHover={{ scale: 1.1, y: -3 }}
                className="glass px-4 py-2 rounded-full text-sm font-medium text-slate-300 border border-slate-700 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-200 cursor-default"
              >
                {skill.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
