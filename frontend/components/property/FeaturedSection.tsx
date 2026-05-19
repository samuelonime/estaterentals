'use client'

import { useEffect, useState } from 'react'
import { propertyApi } from '@/lib/api'
import { PropertyCard } from './PropertyCard'
import { PropertyCardSkeleton } from './PropertyCardSkeleton'

export function FeaturedSection() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    propertyApi.getAll({ featured: true, limit: 6 })
      .then((res) => setProperties(res.data.data.properties))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container-max section-padding">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-orange-500 font-medium text-sm uppercase tracking-widest mb-2">Handpicked for You</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Featured Properties</h2>
          </div>
          <a href="/properties" className="hidden md:flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors">
            View all →
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}

        <div className="text-center mt-10 md:hidden">
          <a href="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
          >
            View All Properties →
          </a>
        </div>
      </div>
    </section>
  )
}
