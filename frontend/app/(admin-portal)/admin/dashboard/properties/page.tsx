'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { propertyApi } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, getPropertyTypeLabel, timeAgo } from '@/lib/utils'
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, ExternalLink, AlertTriangle } from 'lucide-react'

export default function AdminPropertiesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<any[]>([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [status, setStatus] = useState(searchParams.get('status') ?? '')

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params: Record<string, any> = { limit: 10 }
      searchParams.forEach((val, key) => { params[key] = val })
      const res = await propertyApi.getAdminAll(params)
      setProperties(res.data.data.properties)
      setPagination(res.data.data.pagination)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProperties() }, [searchParams.toString()])

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    router.push(`/admin/dashboard/properties?${params.toString()}`)
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    setLoadingId(id)
    await propertyApi.patch(id, { status: currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })
    setLoadingId(null)
    fetchProperties()
  }

  const deleteProperty = async (id: string) => {
    setLoadingId(id)
    await propertyApi.delete(id)
    setLoadingId(null)
    setDeleteId(null)
    fetchProperties()
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-950 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-display font-bold text-center text-slate-900 dark:text-white mb-2">Delete Property?</h3>
            <p className="text-slate-500 text-sm text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={() => deleteProperty(deleteId)} disabled={loadingId === deleteId}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium"
              >{loadingId === deleteId ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-slate-500 dark:text-slate-400 text-sm">{pagination.total} properties total</p>
        <Link href="/admin/dashboard/properties/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Property
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search properties..."
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition"
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/30 transition cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="RENTED">Rented</option>
          </select>
          <button onClick={applyFilters} className="px-5 py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-8">
          <div className="space-y-4 animate-pulse">
            {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />)}
          </div>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-16 text-center">
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏠</span>
          </div>
          <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">No properties found</h3>
          <p className="text-slate-400 text-sm mb-5">Get started by adding your first property.</p>
          <Link href="/admin/dashboard/properties/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
          >Add Property</Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  {['Property', 'Type', 'Price', 'Status', 'Added', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3 first:px-6 last:text-right">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                          {p.images[0] && <Image src={p.images[0].url} alt={p.title} fill className="object-cover" sizes="48px" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-slate-900 dark:text-white text-sm font-medium truncate max-w-[200px]">{p.title}</p>
                          <p className="text-slate-400 text-xs truncate">{p.location}, {p.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-lg">
                        {getPropertyTypeLabel(p.type)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-slate-900 dark:text-white text-sm font-semibold">{formatPrice(p.price, p.priceUnit)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                        p.status === 'ACTIVE' ? 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400'
                        : p.status === 'RENTED' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>{p.status}</span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-slate-400 text-xs">{timeAgo(p.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toggleStatus(p.id, p.status)} disabled={loadingId === p.id}
                          className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-all disabled:opacity-50"
                        >
                          {p.status === 'ACTIVE' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <Link href={`/properties/${p.slug}`} target="_blank"
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all"
                        ><ExternalLink className="w-4 h-4" /></Link>
                        <Link href={`/admin/dashboard/properties/${p.id}/edit`}
                          className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-all"
                        ><Edit2 className="w-4 h-4" /></Link>
                        <button onClick={() => setDeleteId(p.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                        ><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-800">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => { const params = new URLSearchParams(); params.set('page', String(p)); router.push(`/admin/dashboard/properties?${params}`) }}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                    p === pagination.page ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >{p}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
