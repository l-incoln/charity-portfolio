'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Linkedin, GitBranch, MapPin, Send, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Profile } from '@/lib/types'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})
type FormData = z.infer<typeof schema>

interface ContactProps {
  profile: Profile | null
}

export default function Contact({ profile }: ContactProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSent(true)
        reset()
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={ref} className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-slate-900/60 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-cyan-400 text-sm uppercase tracking-widest font-semibold mb-3">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
            Let&apos;s Work <span className="gradient-text">Together</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            I&apos;m open to data science roles, freelance projects, and collaborations. Let&apos;s turn your data into decisions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            {[
              { icon: Mail, label: 'Email', value: profile?.email || 'charityagutu@gmail.com', href: `mailto:${profile?.email}` },
              { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/charityagutu', href: profile?.linkedin_url || '#' },
              { icon: GitBranch, label: 'GitHub', value: 'github.com/charityagutu', href: profile?.github_url || '#' },
              { icon: MapPin, label: 'Location', value: profile?.location || 'Nairobi, Kenya', href: '' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 glass rounded-xl p-5 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <item.icon size={18} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                      className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-slate-200 font-medium">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {sent ? (
              <div className="glass rounded-2xl p-10 border border-green-500/30 text-center">
                <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>Message Sent!</h3>
                <p className="text-slate-400">Thank you for reaching out. I&apos;ll get back to you soon.</p>
                <button onClick={() => setSent(false)} className="mt-6 text-cyan-400 text-sm hover:underline">Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-8 border border-slate-700/50 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Name *</label>
                    <input
                      {...register('name')}
                      placeholder="Charity"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Email *</label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="you@company.com"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Subject</label>
                  <input
                    {...register('subject')}
                    placeholder="Job opportunity / Collaboration..."
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">Message *</label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    placeholder="Tell me about your project or opportunity..."
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-900 font-semibold py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
                >
                  {submitting ? 'Sending...' : <>Send Message <Send size={16} /></>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
