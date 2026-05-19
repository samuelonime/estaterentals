'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, LayoutDashboard, Home, MessageSquare, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn, getInitials } from '@/lib/utils'

interface AdminSidebarProps {
  user: { name?: string | null; email?: string | null; role: string }
}

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/properties', icon: Home, label: 'Properties' },
  { href: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      'hidden lg:flex flex-col bg-slate-950 text-white transition-all duration-300 border-r border-slate-800/50 shrink-0',
      collapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800/50 shrink-0">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-lg text-white">
            Estate<span className="text-orange-500">Pro</span>
          </span>
        )}
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {!collapsed && <p className="text-slate-600 text-xs font-medium uppercase tracking-wider px-3 mb-3">Main Menu</p>}
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={cn('admin-sidebar-link', isActive && 'active')}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}

        <div className="pt-4 mt-4 border-t border-slate-800/50">
          {!collapsed && <p className="text-slate-600 text-xs font-medium uppercase tracking-wider px-3 mb-3">External</p>}
          <Link href="/" target="_blank" className="admin-sidebar-link" title={collapsed ? 'View Site' : undefined}>
            <ExternalLink className="w-4 h-4 shrink-0" />
            {!collapsed && <span>View Site</span>}
          </Link>
        </div>
      </nav>

      <div className="p-3 border-t border-slate-800/50">
        <div className={cn('flex items-center gap-3 px-2 py-2 rounded-xl', !collapsed && 'bg-slate-900/50')}>
          <div className="w-8 h-8 bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-orange-400 text-xs font-bold">{getInitials(user.name ?? user.email ?? 'A')}</span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-medium truncate">{user.name ?? 'Admin'}</p>
              <p className="text-slate-500 text-xs truncate">{user.role}</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-slate-800/50 text-slate-600 hover:text-slate-400 hover:bg-slate-900/50 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  )
}
