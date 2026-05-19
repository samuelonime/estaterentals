'use client'

import { usePathname } from 'next/navigation'
import { LogOut, Moon, Sun, Menu } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/properties': 'Properties',
  '/dashboard/properties/new': 'Add Property',
  '/dashboard/messages': 'Messages',
}

interface AdminTopbarProps {
  user: { name?: string | null; email?: string | null }
}

export function AdminTopbar({ user }: AdminTopbarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const title = pageTitles[pathname] ?? (pathname.includes('/edit') ? 'Edit Property' : 'Admin Panel')

  return (
    <header className="h-16 flex items-center justify-between px-6 lg:px-8 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/50 shrink-0">
      <div className="flex items-center gap-3">
        <button className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-none">{title}</h1>
          <p className="text-slate-400 text-xs mt-0.5 hidden sm:block">Welcome back, {user.name ?? 'Admin'}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-sm font-medium transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  )
}
