export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Profile {
  id: string
  name: string
  professional_title: string
  tagline: string
  bio: string
  email: string
  phone?: string
  linkedin_url?: string
  github_url?: string
  location?: string
  profile_image_url?: string
  resume_url?: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: 'programming' | 'data_science' | 'machine_learning' | 'visualization' | 'business_intelligence' | 'other'
  display_order: number
  created_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  problem_statement?: string
  methodology?: string
  results?: string
  technologies: string[]
  github_url?: string
  live_url?: string
  image_url?: string
  is_featured: boolean
  is_archived: boolean
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  organization: string
  position: string
  start_date: string
  end_date?: string
  is_current: boolean
  description: string
  achievements: string[]
  display_order: number
  created_at: string
}

export interface Certification {
  id: string
  name: string
  institution: string
  date_earned: string
  credential_url?: string
  pdf_url?: string
  image_url?: string
  created_at: string
}

export interface Message {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  is_read: boolean
  is_archived: boolean
  created_at: string
}

export interface MediaFile {
  id: string
  file_name: string
  file_url: string
  file_type: string
  file_size: number
  category: 'profile_images' | 'project_images' | 'certificates' | 'documents' | 'gallery'
  created_at: string
}

export type SkillCategory = Skill['category']
export type MediaCategory = MediaFile['category']
