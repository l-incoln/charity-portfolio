'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: '3+', label: 'Featured Projects' },
  { value: '15%', label: 'Forecast Accuracy Gain' },
  { value: '5+', label: 'Core Technologies' },
  { value: '1+', label: 'Years Learning' },
]

function AnimatedNumber({ value }: { value: string }) {
  return (
    <span className="text-4xl md:text-5xl font-bold gradient-text">
      {value}
    </span>
  )
}

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-10 md:py-14 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="rounded-2xl p-5 md:p-7 text-center border border-slate-700/50 bg-slate-900/50 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105"
          >
            <AnimatedNumber value={stat.value} />
            <p className="text-slate-400 text-sm mt-2 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
