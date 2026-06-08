'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      const sections = navLinks.map((l) => l.href.slice(1))
      for (const section of sections.reverse()) {
        const el = document.getElementById(section)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(section)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (href: string) => {
    const id = href.slice(1)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <>
      {/* Desktop nav */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={cn(
          'fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 px-4 py-2.5 rounded-full transition-all duration-300 border',
          scrolled
            ? 'glass border-slate-700/60 shadow-xl shadow-black/20'
            : 'glass border-slate-700/30'
        )}
      >
        {navLinks.map((link) => (
          <button
            key={link.href}
            onClick={() => scrollTo(link.href)}
            className={cn(
              'relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 whitespace-nowrap',
              activeSection === link.href.slice(1)
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            {activeSection === link.href.slice(1) && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 rounded-full bg-cyan-500/20 border border-cyan-500/40"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{link.label}</span>
          </button>
        ))}
      </motion.nav>

      {/* Mobile nav trigger */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setMobileOpen(true)}
        className="fixed top-5 right-5 z-50 md:hidden glass p-2.5 rounded-full"
      >
        <Menu size={20} className="text-cyan-400" />
      </motion.button>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-72 glass flex flex-col pt-20 pb-10 px-8 gap-3"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
              <p className="text-xs uppercase tracking-widest text-cyan-400 mb-4 font-semibold">Navigation</p>
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={cn(
                    'text-left py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200',
                    activeSection === link.href.slice(1)
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
