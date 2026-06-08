import AdminSidebar from '@/components/admin/AdminSidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin CMS – Charity Portfolio',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64 min-h-screen">
        {children}
      </div>
    </div>
  )
}
