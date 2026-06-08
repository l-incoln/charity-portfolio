'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// ─── Profile ───────────────────────────────────────────────────────────────
const profileSchema = z.object({
  name: z.string().min(1).max(100),
  professional_title: z.string().min(1).max(200),
  tagline: z.string().max(500),
  bio: z.string().max(5000),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional(),
  linkedin_url: z.string().url().max(300).optional().or(z.literal('')),
  github_url: z.string().url().max(300).optional().or(z.literal('')),
  location: z.string().max(100).optional(),
})

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const raw = Object.fromEntries(formData)
  const parsed = profileSchema.safeParse(raw)
  if (!parsed.success) return { error: 'Invalid data' }

  const { data: existing } = await supabase.from('profiles').select('id').single()
  let error
  if (existing) {
    ({ error } = await supabase.from('profiles').update(parsed.data).eq('id', existing.id))
  } else {
    ({ error } = await supabase.from('profiles').insert(parsed.data))
  }

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/profile')
  return { success: true }
}

// ─── Skills ────────────────────────────────────────────────────────────────
const skillSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(['programming', 'data_science', 'machine_learning', 'visualization', 'business_intelligence', 'other']),
  display_order: z.coerce.number().int().min(0),
})

export async function createSkill(formData: FormData) {
  const supabase = await createClient()
  const parsed = skillSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Invalid data' }
  const { error } = await supabase.from('skills').insert(parsed.data)
  if (error) return { error: error.message }
  revalidatePath('/'); revalidatePath('/admin/skills')
  return { success: true }
}

export async function updateSkill(id: string, formData: FormData) {
  const supabase = await createClient()
  const parsed = skillSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Invalid data' }
  const { error } = await supabase.from('skills').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/'); revalidatePath('/admin/skills')
  return { success: true }
}

export async function deleteSkill(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('skills').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/'); revalidatePath('/admin/skills')
  return { success: true }
}

// ─── Projects ──────────────────────────────────────────────────────────────
const projectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().min(1).max(5000),
  problem_statement: z.string().max(5000).optional(),
  methodology: z.string().max(5000).optional(),
  results: z.string().max(5000).optional(),
  technologies: z.string(), // JSON array string
  github_url: z.string().url().max(300).optional().or(z.literal('')),
  live_url: z.string().url().max(300).optional().or(z.literal('')),
  image_url: z.string().optional(),
  is_featured: z.coerce.boolean().default(false),
  is_archived: z.coerce.boolean().default(false),
})

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const raw = Object.fromEntries(formData)
  const parsed = projectSchema.safeParse(raw)
  if (!parsed.success) return { error: 'Invalid data: ' + JSON.stringify(parsed.error.flatten()) }

  let technologies: string[] = []
  try { technologies = JSON.parse(parsed.data.technologies as string) } catch { technologies = [] }

  const { error } = await supabase.from('projects').insert({ ...parsed.data, technologies })
  if (error) return { error: error.message }
  revalidatePath('/'); revalidatePath('/admin/projects')
  return { success: true }
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient()
  const raw = Object.fromEntries(formData)
  const parsed = projectSchema.safeParse(raw)
  if (!parsed.success) return { error: 'Invalid data' }

  let technologies: string[] = []
  try { technologies = JSON.parse(parsed.data.technologies as string) } catch { technologies = [] }

  const { error } = await supabase.from('projects').update({ ...parsed.data, technologies }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/'); revalidatePath('/admin/projects')
  return { success: true }
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/'); revalidatePath('/admin/projects')
  return { success: true }
}

// ─── Experience ────────────────────────────────────────────────────────────
const expSchema = z.object({
  organization: z.string().min(1).max(200),
  position: z.string().min(1).max(200),
  start_date: z.string(),
  end_date: z.string().optional(),
  is_current: z.coerce.boolean().default(false),
  description: z.string().max(5000),
  achievements: z.string(), // JSON
  display_order: z.coerce.number().int().min(0),
})

export async function createExperience(formData: FormData) {
  const supabase = await createClient()
  const parsed = expSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Invalid data' }
  let achievements: string[] = []
  try { achievements = JSON.parse(parsed.data.achievements) } catch { achievements = [] }
  const { error } = await supabase.from('experience').insert({ ...parsed.data, achievements })
  if (error) return { error: error.message }
  revalidatePath('/'); revalidatePath('/admin/experience')
  return { success: true }
}

export async function updateExperience(id: string, formData: FormData) {
  const supabase = await createClient()
  const parsed = expSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Invalid data' }
  let achievements: string[] = []
  try { achievements = JSON.parse(parsed.data.achievements) } catch { achievements = [] }
  const { error } = await supabase.from('experience').update({ ...parsed.data, achievements }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/'); revalidatePath('/admin/experience')
  return { success: true }
}

export async function deleteExperience(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('experience').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/'); revalidatePath('/admin/experience')
  return { success: true }
}

// ─── Certifications ────────────────────────────────────────────────────────
const certSchema = z.object({
  name: z.string().min(1).max(200),
  institution: z.string().min(1).max(200),
  date_earned: z.string(),
  credential_url: z.string().url().max(300).optional().or(z.literal('')),
  pdf_url: z.string().optional(),
  image_url: z.string().optional(),
})

export async function createCertification(formData: FormData) {
  const supabase = await createClient()
  const parsed = certSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Invalid data' }
  const { error } = await supabase.from('certifications').insert(parsed.data)
  if (error) return { error: error.message }
  revalidatePath('/'); revalidatePath('/admin/certifications')
  return { success: true }
}

export async function updateCertification(id: string, formData: FormData) {
  const supabase = await createClient()
  const parsed = certSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Invalid data' }
  const { error } = await supabase.from('certifications').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/'); revalidatePath('/admin/certifications')
  return { success: true }
}

export async function deleteCertification(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('certifications').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/'); revalidatePath('/admin/certifications')
  return { success: true }
}

// ─── Messages ──────────────────────────────────────────────────────────────
export async function markMessageRead(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('messages').update({ is_read: true }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/messages')
  return { success: true }
}

export async function deleteMessage(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('messages').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/messages')
  return { success: true }
}
