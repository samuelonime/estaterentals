'use client'

import { useEffect, useState } from 'react'
import { propertyApi } from '@/lib/api'
import { Building2, CheckCircle2, MapPin, Star } from 'lucide-react'

export function StatsSection() {
  const [stats, setStats] = useState({ total: 0, active: 0, cities: 0 })

  useEffect(() => {
    propertyApi.getAll({ limit: 1 })
      .then((res) => {
        const total = res.data.data.pagination.total
        setStats({ total, active: total, cities: 8 })
      })
      .catch(() => {})
  }, [])

  const items = [
    { icon: Building2, label: 'Total Properties', value: `${stats.total}+` },
    { icon: CheckCircle2, label: 'Active Listings', value: `${stats.active}+` },
    { icon: MapPin, label: 'Locations', value: `${stats.cities}+` },
    { icon: Star, label: 'Happy Tenants', value: '200+' },
  ]

  return (
    <section className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900">
      <div className="container-max section-padding py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
          {items.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 lg:px-8 first:pl-0 last:pr-0">
              <div className="w-11 h-11 bg-orange-50 dark:bg-orange-950 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="font-display font-bold text-2xl text-slate-900 dark:text-white leading-none">{value}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
