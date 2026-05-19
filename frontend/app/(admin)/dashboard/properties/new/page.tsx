// frontend/app/(admin)/dashboard/properties/new/page.tsx
import { PropertyForm } from '@/components/admin/PropertyForm'

export default function NewPropertyPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Fill in the details below to add a new property listing.
        </p>
      </div>
      <PropertyForm />
    </div>
  )
}
