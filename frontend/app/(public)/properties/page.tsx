// frontend/app/(public)/properties/page.tsx
import { Suspense } from 'react'
import PropertiesContent from './PropertiesContent'

export const dynamic = 'force-dynamic'

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading properties...</p>
        </div>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  )
}