'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Award, ExternalLink, Calendar } from 'lucide-react'
import type { Certification } from '@/lib/types'

interface CertificationsProps {
  certifications: Certification[]
}

const fallback: Certification[] = [
  { id: '1', name: 'Data Science Bootcamp Certificate', institution: 'Moringa School', date_earned: '2025-11-01', credential_url: '', created_at: '' },
]

export default function Certifications({ certifications }: CertificationsProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const items = certifications.length > 0 ? certifications : fallback

  return (
    <section id="certifications" ref={ref} className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-cyan-400 text-sm uppercase tracking-widest font-semibold mb-3">Credentials</p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="glass rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 group"
            >
              {/* Badge image or icon */}
              <div className="mb-4 relative">
                {cert.image_url ? (
                  <img
                    src={cert.image_url}
                    alt={cert.name}
                    className="w-16 h-16 object-contain rounded-xl border border-slate-700"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Award size={28} className="text-cyan-400" />
                  </div>
                )}
              </div>

              <h3 className="text-base font-bold text-white mb-1 leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
                {cert.name}
              </h3>
              <p className="text-cyan-400 text-sm font-medium mb-3">{cert.institution}</p>

              <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-4">
                <Calendar size={12} />
                <span>{new Date(cert.date_earned).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>

              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  <ExternalLink size={12} />
                  Verify Credential
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
