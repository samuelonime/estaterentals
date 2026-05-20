'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { propertyApi } from '@/lib/api'
import { PropertyForm } from '@/components/admin/PropertyForm'

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    propertyApi.getById(id)
      .then((res) => setProperty(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-5" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="text-center py-24">
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">
          Property Not Found
        </h3>
        <p className="text-slate-400 mb-4">This property does not exist or has been deleted.</p>
        <a href="/admin/dashboard/properties" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
          ← Back to Properties
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Update the details for this property listing.
        </p>
      </div>
      <PropertyForm property={property} />
    </div>
  )
}
