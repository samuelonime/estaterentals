'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopbar } from '@/components/admin/AdminTopbar'

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Don't protect the login page itself
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!loading && !isLoginPage) {
      if (!user) {
        router.replace('/admin/login')
      } else if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        // Visitors cannot access admin
        router.replace('/')
      }
    }
  }, [user, loading, router, isLoginPage])

  // Login page: render without shell
  if (isLoginPage) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return null

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <AdminSidebar user={user} basePath="/admin/dashboard" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar user={user} basePath="/admin" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
