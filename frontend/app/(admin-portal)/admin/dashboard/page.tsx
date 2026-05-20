'use client'

import { useEffect, useState } from 'react'
import { dashboardApi } from '@/lib/api'
import { formatPrice, timeAgo } from '@/lib/utils'
import { Home, MessageSquare, CheckCircle2, Eye, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.getStats()
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-7xl">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    )
  }

  const { stats, recentProperties, recentMessages } = data

  const statCards = [
    { label: 'Total Properties', value: stats.totalProperties, icon: Home, color: 'blue' },
    { label: 'Active Listings', value: stats.activeListings, icon: CheckCircle2, color: 'green', sub: `${stats.rentedProperties} rented` },
    { label: 'Messages', value: stats.totalMessages, icon: MessageSquare, color: 'purple', sub: `${stats.unreadMessages} unread` },
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'orange', sub: 'All time' },
  ]

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400',
  }

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/dashboard/properties/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" /> Add Property
        </Link>
        <Link
          href="/admin/dashboard/messages"
          className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:border-slate-300 transition-all"
        >
          <MessageSquare className="w-4 h-4" /> Messages
          {stats.unreadMessages > 0 && (
            <span className="px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded-full">{stats.unreadMessages}</span>
          )}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-slate-300 dark:text-slate-700" />
            </div>
            <p className="font-display font-bold text-3xl text-slate-900 dark:text-white mb-1">{value}</p>
            <p className="text-slate-500 text-sm">{label}</p>
            {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-display font-semibold text-slate-900 dark:text-white">Recent Properties</h2>
            <Link href="/admin/dashboard/properties" className="text-orange-500 text-sm hover:text-orange-600">View all →</Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentProperties.map((p: any) => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                  {p.images[0] && <Image src={p.images[0].url} alt={p.title} fill className="object-cover" sizes="48px" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 dark:text-white text-sm font-medium truncate">{p.title}</p>
                  <p className="text-slate-500 text-xs">{formatPrice(p.price, p.priceUnit)} · {p.city}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-lg shrink-0 ${p.status === 'ACTIVE' ? 'bg-green-50 dark:bg-green-950 text-green-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-display font-semibold text-slate-900 dark:text-white">Recent Messages</h2>
            <Link href="/admin/dashboard/messages" className="text-orange-500 text-sm hover:text-orange-600">View all →</Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentMessages.length === 0 ? (
              <p className="px-6 py-8 text-center text-slate-400 text-sm">No messages yet.</p>
            ) : recentMessages.map((msg: any) => (
              <div key={msg.id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <span className="text-slate-600 dark:text-slate-400 text-sm font-bold">{msg.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-slate-900 dark:text-white text-sm font-medium">
                      {msg.name}
                      {msg.status === 'UNREAD' && <span className="ml-2 inline-block w-2 h-2 bg-orange-500 rounded-full" />}
                    </p>
                    <span className="text-slate-400 text-xs shrink-0">{timeAgo(msg.createdAt)}</span>
                  </div>
                  <p className="text-slate-500 text-xs truncate">{msg.subject}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
