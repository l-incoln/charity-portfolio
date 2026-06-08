'use client'

import { useState, useEffect } from 'react'
import { Upload, Trash2, Eye, Image as ImageIcon, FileText, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { MediaCategory } from '@/lib/types'

const buckets: { value: MediaCategory; label: string; accept: string }[] = [
  { value: 'profile_images', label: 'Profile Images', accept: 'image/*' },
  { value: 'project_images', label: 'Project Images', accept: 'image/*' },
  { value: 'certificates', label: 'Certificates', accept: 'image/*,application/pdf' },
  { value: 'documents', label: 'Documents', accept: 'application/pdf,.doc,.docx' },
  { value: 'gallery', label: 'Gallery', accept: 'image/*' },
]

const bucketMap: Record<MediaCategory, string> = {
  profile_images: 'profile-images',
  project_images: 'project-images',
  certificates: 'certificates',
  documents: 'resumes',
  gallery: 'gallery',
}

interface MediaItem {
  name: string
  url: string
  bucket: string
  isImage: boolean
}

export default function MediaPage() {
  const [category, setCategory] = useState<MediaCategory>('project_images')
  const [files, setFiles] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const loadFiles = async (cat: MediaCategory) => {
    setLoading(true)
    const supabase = createClient()
    const bucket = bucketMap[cat]
    const { data } = await supabase.storage.from(bucket).list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
    if (data) {
      const items: MediaItem[] = data.filter((f) => f.name !== '.emptyFolderPlaceholder').map((f) => {
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(f.name)
        const isImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f.name)
        return { name: f.name, url: publicUrl, bucket, isImage }
      })
      setFiles(items)
    }
    setLoading(false)
  }

  useEffect(() => { loadFiles(category) }, [category])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 20 * 1024 * 1024) { alert('File must be under 20MB'); return }
    setUploading(true)
    const supabase = createClient()
    const bucket = bucketMap[category]
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    await supabase.storage.from(bucket).upload(path, file, { upsert: false })
    await loadFiles(category)
    setUploading(false)
  }

  const handleDelete = async (item: MediaItem) => {
    if (!confirm('Delete this file?')) return
    const supabase = createClient()
    await supabase.storage.from(item.bucket).remove([item.name])
    setFiles((prev) => prev.filter((f) => f.name !== item.name))
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Media Library</h1>
        <p className="text-slate-400 mt-1">Upload and manage all your portfolio assets.</p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {buckets.map((b) => (
          <button key={b.value} onClick={() => setCategory(b.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${category === b.value ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400' : 'glass border border-slate-700 text-slate-400 hover:text-white'}`}>
            {b.label}
          </button>
        ))}
      </div>

      {/* Upload */}
      <label className="cursor-pointer mb-6 inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-300">
        <Upload size={14} />
        {uploading ? 'Uploading...' : 'Upload File'}
        <input type="file" accept={buckets.find((b) => b.value === category)?.accept} className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>

      {/* Grid */}
      {loading ? (
        <div className="text-slate-400 text-sm">Loading...</div>
      ) : files.length === 0 ? (
        <div className="glass rounded-2xl p-16 border border-dashed border-slate-600 text-center text-slate-400">
          No files in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file) => (
            <div key={file.name} className="glass rounded-xl border border-slate-700/50 overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
              <div className="aspect-square bg-slate-800 flex items-center justify-center relative overflow-hidden">
                {file.isImage ? (
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                  <FileText size={32} className="text-slate-500" />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button onClick={() => setPreview(file.url)}
                    className="p-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors">
                    <Eye size={14} />
                  </button>
                  <button onClick={() => handleDelete(file)}
                    className="p-2 bg-red-500/20 border border-red-500/40 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-slate-400 truncate">{file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-6" onClick={() => setPreview(null)}>
          <button className="absolute top-4 right-4 text-slate-400 hover:text-white">
            <X size={24} />
          </button>
          <img src={preview} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}
