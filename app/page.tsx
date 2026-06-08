import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/public/Navigation'
import Hero from '@/components/public/Hero'
import Stats from '@/components/public/Stats'
import About from '@/components/public/About'
import Skills from '@/components/public/Skills'
import Projects from '@/components/public/Projects'
import ExperienceSection from '@/components/public/Experience'
import Certifications from '@/components/public/Certifications'
import Contact from '@/components/public/Contact'
import Footer from '@/components/public/Footer'
import type { Profile, Skill, Project, Experience, Certification } from '@/lib/types'

async function getData() {
  try {
    const supabase = await createClient()
    const [profile, skills, projects, experience, certifications] = await Promise.all([
      supabase.from('profiles').select('*').single(),
      supabase.from('skills').select('*').order('category').order('display_order'),
      supabase.from('projects').select('*').eq('is_archived', false).order('created_at', { ascending: false }),
      supabase.from('experience').select('*').order('display_order'),
      supabase.from('certifications').select('*').order('date_earned', { ascending: false }),
    ])
    return {
      profile: profile.data as Profile | null,
      skills: (skills.data as Skill[]) || [],
      projects: (projects.data as Project[]) || [],
      experience: (experience.data as Experience[]) || [],
      certifications: (certifications.data as Certification[]) || [],
    }
  } catch {
    return { profile: null, skills: [], projects: [], experience: [], certifications: [] }
  }
}

export default async function Home() {
  const { profile, skills, projects, experience, certifications } = await getData()

  return (
    <main className="bg-[#0F172A] min-h-screen text-white">
      <Navigation />
      <Hero profile={profile} />
      <Stats />
      <About profile={profile} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <ExperienceSection experience={experience} />
      <Certifications certifications={certifications} />
      <Contact profile={profile} />
      <Footer profile={profile} />
    </main>
  )
}
