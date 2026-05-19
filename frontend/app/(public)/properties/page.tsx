// frontend/app/(public)/properties/page.tsx
export const dynamic = 'force-dynamic' 

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { propertyApi } from '@/lib/api'
import { PropertyCard } from '@/components/property/PropertyCard'
import { PropertyCardSkeleton } from '@/components/property/PropertyCardSkeleton'
import { PropertyFilters } from '@/components/property/PropertyFilters'

export default function PropertiesPage() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<any[]>([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 9, totalPages: 1 })
  const [loading, setLoading] = useState(true)

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params: Record<string, any> = {}
      searchParams.forEach((val, key) => { params[key] = val })
      const res = await propertyApi.getAll(params)
      setProperties(res.data.data.properties)
      setPagination(res.data.data.pagination)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProperties() }, [searchParams.toString()])

  const buildPage = (p: number) => {
    const params = new URLSearchParams()
    searchParams.forEach((val, key) => params.set(key, val))
    params.set('page', String(p))
    return `?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="bg-slate-900 dark:bg-slate-950 pt-24 pb-12">
        <div className="container-max section-padding">
          <p className="text-orange-400 text-sm font-medium uppercase tracking-widest mb-2">Browse Listings</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">Available Properties</h1>
          <p className="text-slate-400">{loading ? '...' : `${pagination.total} propert${pagination.total !== 1 ? 'ies' : 'y'} found`}</p>
        </div>
      </div>

      <div className="container-max section-padding py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 shrink-0">
            <PropertyFilters />
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
              </div>
            ) : properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <a
                        key={p}
                        href={buildPage(p)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                          p === pagination.page
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-orange-300'
                        }`}
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏠</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white mb-2">No properties found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
