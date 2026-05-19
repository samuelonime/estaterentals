'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

const propertyTypes = [
  { value: '', label: 'All Types' }, { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'House' }, { value: 'STUDIO', label: 'Studio' },
  { value: 'DUPLEX', label: 'Duplex' }, { value: 'PENTHOUSE', label: 'Penthouse' },
  { value: 'COMMERCIAL', label: 'Commercial' },
]

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState(searchParams.get('type') ?? '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') ?? '')
  const [search, setSearch] = useState(searchParams.get('search') ?? '')

  const apply = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (type) params.set('type', type)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (bedrooms) params.set('bedrooms', bedrooms)
    router.push(`/properties?${params.toString()}`)
    setOpen(false)
  }

  const reset = () => {
    setType(''); setMinPrice(''); setMaxPrice(''); setBedrooms(''); setSearch('')
    router.push('/properties')
  }

  const hasFilters = !!(type || minPrice || maxPrice || bedrooms || search)

  const inputCls = "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition"

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Search</label>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Location, title..." className={inputCls} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Property Type</label>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((t) => (
            <button key={t.value} onClick={() => setType(t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                type === t.value ? 'bg-orange-500 text-white border-orange-500' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-orange-300'
              }`}
            >{t.label}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price Range (₦/month)</label>
        <div className="flex gap-2">
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className={inputCls} />
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className={inputCls} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Min. Bedrooms</label>
        <div className="flex gap-2">
          {['', '1', '2', '3', '4', '5'].map((b) => (
            <button key={b} onClick={() => setBedrooms(b)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                bedrooms === b ? 'bg-orange-500 text-white border-orange-500' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-orange-300'
              }`}
            >{b === '' ? 'Any' : `${b}+`}</button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={apply} className="flex-1 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">
          Apply Filters
        </button>
        {hasFilters && (
          <button onClick={reset} className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden lg:block sticky top-24">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-orange-500" /> Filters
            </h3>
            {hasFilters && <button onClick={reset} className="text-xs text-orange-500 hover:text-orange-600">Clear all</button>}
          </div>
          <FilterContent />
        </div>
      </div>

      <div className="lg:hidden">
        <button onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-orange-300 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
          {hasFilters && <span className="w-2 h-2 rounded-full bg-orange-500" />}
        </button>
        {open && (
          <div className="mt-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <FilterContent />
          </div>
        )}
      </div>
    </>
  )
}
