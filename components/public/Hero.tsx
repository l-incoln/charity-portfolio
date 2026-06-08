'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, ArrowRight, GitBranch, Link2, Mail } from 'lucide-react'
import type { Profile } from '@/lib/types'

interface HeroProps {
  profile: Profile | null
}

const floatingLeft = ['Python', 'SQL', 'Tableau']
const floatingRight = ['Machine Learning', 'Forecasting', 'Business Intelligence']

export default function Hero({ profile }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Animated neural network canvas background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrameId: number
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const nodes: { x: number; y: number; vx: number; vy: number }[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1
      })

      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.25
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        })
        ctx.beginPath()
        ctx.arc(a.x, a.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(6, 182, 212, 0.5)'
        ctx.fill()
      })

      animFrameId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animFrameId)
    }
  }, [])

  const resumeUrl = profile?.resume_url || '#'

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(6,182,212,0.08),transparent)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-24 flex flex-col items-center text-center">
        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 glass px-5 py-2.5 rounded-full text-xs font-medium text-cyan-400 mb-12 border border-cyan-500/20"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Available for opportunities
        </motion.div>

        {/* Main grid: floating pills + photo + pills */}
        <div className="w-full flex items-center justify-between gap-8 mb-14">
          {/* Left floating cards */}
          <div className="hidden lg:flex flex-col gap-3 items-end flex-1">
            {floatingLeft.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15 }}
                className="glass px-5 py-2.5 rounded-xl text-sm font-semibold text-cyan-300 border border-cyan-500/20 glow"
              >
                {item}
              </motion.div>
            ))}
          </div>

          {/* Center: photo + name */}
          <div className="flex flex-col items-center gap-8 flex-shrink-0">
            {/* Name & title */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-6xl md:text-8xl font-bold leading-tight mb-6"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <span className="text-white">Charity</span>{' '}
                <span className="gradient-text">Agutu</span>
                <br />
                <span className="text-white">Martha</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-2xl md:text-3xl text-slate-300 font-medium mt-2"
              >
                Data Scientist &amp;{' '}
                <span className="text-cyan-400">Machine Learning Practitioner</span>
              </motion.p>
            </div>

            {/* Profile photo circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative w-56 h-56 md:w-72 md:h-72"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-cyan-300 opacity-30 blur-xl animate-pulse" />
              <div className="relative w-full h-full rounded-full border-2 border-cyan-500/40 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center glow">
                {profile?.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt="Charity Agutu Martha"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-6xl font-bold gradient-text" style={{ fontFamily: 'Sora, sans-serif' }}>
                    CA
                  </div>
                )}
              </div>
              {/* Orbital ring */}
              <div className="absolute inset-[-12px] rounded-full border border-cyan-500/20 animate-spin" style={{ animationDuration: '20s' }} />
            </motion.div>
          </div>

          {/* Right floating cards */}
          <div className="hidden lg:flex flex-col gap-3 items-start flex-1">
            {floatingRight.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15 }}
                className="glass px-5 py-2.5 rounded-xl text-sm font-semibold text-cyan-300 border border-cyan-500/20 glow"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="max-w-2xl text-slate-400 text-lg leading-relaxed mb-12"
        >
          {profile?.tagline || 'Transforming complex datasets into actionable insights through machine learning, predictive analytics, and business intelligence.'}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap gap-5 justify-center"
        >
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105"
          >
            <Download size={16} />
            Download CV
          </a>
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 glass border border-cyan-500/30 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-300 hover:border-cyan-400 hover:text-cyan-400 hover:scale-105"
          >
            View Projects
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 glass border border-slate-600 text-slate-300 font-semibold px-7 py-3.5 rounded-full transition-all duration-300 hover:border-white hover:text-white hover:scale-105"
          >
            <Mail size={16} />
            Contact Me
          </button>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex gap-5 mt-10"
        >
          {profile?.github_url && (
            <a href={profile.github_url} target="_blank" rel="noreferrer"
              className="glass p-3 rounded-full text-slate-400 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:scale-110">
              <GitBranch size={18} />
            </a>
          )}
          {profile?.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noreferrer"
              className="glass p-3 rounded-full text-slate-400 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:scale-110">
              <Link2 size={18} />
            </a>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`}
              className="glass p-3 rounded-full text-slate-400 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:scale-110">
              <Mail size={18} />
            </a>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-500 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-0.5 h-8 bg-gradient-to-b from-cyan-500 to-transparent rounded-full"
        />
      </motion.div>
    </section>
  )
}
