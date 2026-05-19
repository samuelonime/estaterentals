'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PropertySchema, type PropertyFormData } from '@/lib/validations'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { propertyApi, uploadApi } from '@/lib/api'
import {
  Upload, X, Plus, CheckCircle, AlertCircle,
  Loader2, ImagePlus, Copy, ExternalLink, Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PROPERTY_TYPES = ['APARTMENT','HOUSE','STUDIO','DUPLEX','PENTHOUSE','COMMERCIAL','LAND']
const PRICE_UNITS = ['MONTH','YEAR','WEEK','DAY']
const STATUS_OPTIONS = ['ACTIVE','INACTIVE','RENTED']
const AMENITY_PRESETS = [
  'Swimming Pool','24/7 Security','CCTV','Generator','Parking','Gym & Fitness',
  'WiFi/Internet','Air Conditioning','Borehole Water','Boys Quarters',
  'Smart Home System','Private Garden','Concierge Service','Elevator',
  'Rooftop Access','Solar Power',
]

const inputCls =
  'w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm placeholder-slate-400 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition'

interface UploadedImage {
  url: string
  publicId: string
  alt?: string
}

function ImageLinkRow({ img, index, onRemove }: { img: UploadedImage; index: number; onRemove: () => void }) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    await navigator.clipboard.writeText(img.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
      {/* Thumbnail */}
      <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-700">
        <Image src={img.url} alt={img.alt ?? `Image ${index + 1}`} fill className="object-cover" sizes="56px" />
        {index === 0 && (
          <span className="absolute bottom-0 left-0 right-0 text-center text-white text-[9px] font-semibold bg-orange-500 py-0.5">
            COVER
          </span>
        )}
      </div>

      {/* URL */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
          Image {index + 1} {index === 0 ? '(Cover)' : ''}
        </p>
        <p className="text-xs text-slate-400 truncate font-mono">{img.url}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={copyLink}
          title="Copy link"
          className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
        <a
          href={img.url}
          target="_blank"
          rel="noopener noreferrer"
          title="Open link"
          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
        <button
          type="button"
          onClick={onRemove}
          title="Remove image"
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export function PropertyForm({ property }: { property?: any }) {
  const router = useRouter()
  const isEditing = !!property
  const fileRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<UploadedImage[]>(property?.images ?? [])
  const [amenitiesList, setAmenitiesList] = useState<string[]>(
    property?.amenities?.map((a: any) => a.name) ?? []
  )
  const [newAmenity, setNewAmenity] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string[]>([])
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [savedSlug, setSavedSlug] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PropertyFormData>({
    resolver: zodResolver(PropertySchema),
    defaultValues: property
      ? {
          title: property.title,
          description: property.description,
          price: Number(property.price),
          priceUnit: property.priceUnit,
          location: property.location,
          city: property.city,
          state: property.state,
          address: property.address,
          type: property.type,
          status: property.status,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area ?? undefined,
          featured: property.featured,
        }
      : { priceUnit: 'MONTH', status: 'ACTIVE', bedrooms: 1, bathrooms: 1, featured: false },
  })

  const uploadImages = async (files: FileList) => {
    setUploading(true)
    const names = Array.from(files).map((f) => f.name)
    setUploadProgress(names)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fd = new FormData()
      fd.append('file', file)
      try {
        const res = await uploadApi.single(fd)
        setImages((prev) => [
          ...prev,
          { url: res.data.data.url, publicId: res.data.data.publicId, alt: file.name.split('.')[0] },
        ])
      } catch (e) {
        console.error('Upload failed for', file.name, e)
      }
      setUploadProgress((prev) => prev.filter((_, idx) => idx !== 0))
    }

    setUploading(false)
    setUploadProgress([])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addAmenity = (name: string) => {
    const trimmed = name.trim()
    if (trimmed && !amenitiesList.includes(trimmed)) {
      setAmenitiesList((prev) => [...prev, trimmed])
    }
    setNewAmenity('')
  }

  const onSubmit = async (data: PropertyFormData) => {
    setSubmitError('')
    const payload = { ...data, images, amenities: amenitiesList }
    try {
      let res
      if (isEditing) {
        res = await propertyApi.update(property.id, payload)
      } else {
        res = await propertyApi.create(payload)
      }
      setSavedSlug(res.data.data.slug)
      setSubmitted(true)
    } catch (err: any) {
      setSubmitError(err?.response?.data?.error ?? 'Something went wrong. Please try again.')
    }
  }

  // ─── Success Screen ──────────────────────────────────
  if (submitted && savedSlug) {
    const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/properties/${savedSlug}`
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center">
        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {isEditing ? 'Property Updated!' : 'Property Added!'}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Your listing is live and accessible at the link below.
        </p>

        {/* Public Listing Link */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 mb-6 text-left">
          <ExternalLink className="w-4 h-4 text-orange-500 shrink-0" />
          <span className="flex-1 text-sm font-mono text-slate-600 dark:text-slate-400 truncate">
            {publicUrl}
          </span>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(publicUrl)
            }}
            className="p-1.5 text-slate-400 hover:text-orange-500 rounded-lg transition-colors shrink-0"
            title="Copy link"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-500/25 hover:-translate-y-0.5"
          >
            <ExternalLink className="w-4 h-4" />
            View Listing
          </a>
          <button
            onClick={() => router.push('/dashboard/properties')}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    )
  }

  // ─── Form ────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {submitError}
        </div>
      )}

      {/* ── Images ──────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6">
        <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-orange-500" />
          Property Images
        </h2>
        <p className="text-slate-400 text-xs mb-5">
          Each uploaded image gets a shareable Cloudinary link you can copy or open directly.
        </p>

        {/* Upload Drop Zone */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className={cn(
            'w-full border-2 border-dashed rounded-2xl py-8 flex flex-col items-center gap-3 transition-all mb-5',
            uploading
              ? 'opacity-50 cursor-not-allowed border-slate-300 dark:border-slate-700'
              : 'cursor-pointer border-slate-200 dark:border-slate-700 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/10 hover:text-orange-500 text-slate-400'
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <span className="text-sm font-medium text-orange-500">
                Uploading {uploadProgress[0] ?? '...'}
              </span>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8" />
              <div className="text-center">
                <p className="text-sm font-medium">Click to upload images</p>
                <p className="text-xs mt-1">JPG, PNG, WebP — max 10MB each — up to 10 files</p>
              </div>
            </>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadImages(e.target.files)}
        />

        {/* Uploaded Images with Links */}
        {images.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Uploaded Images ({images.length})
            </p>
            {images.map((img, i) => (
              <ImageLinkRow
                key={img.publicId}
                img={img}
                index={i}
                onRemove={() => removeImage(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Basic Info ──────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6">
        <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-5">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input {...register('title')} placeholder="e.g. Luxury 3-Bedroom Apartment in Maitama" className={inputCls} />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Type <span className="text-red-400">*</span></label>
            <select {...register('type')} className={inputCls + ' cursor-pointer'}>
              <option value="">Select type...</option>
              {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.type && <p className="text-red-400 text-xs mt-1">{errors.type.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
            <select {...register('status')} className={inputCls + ' cursor-pointer'}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Price (₦) <span className="text-red-400">*</span></label>
            <input {...register('price')} type="number" placeholder="e.g. 250000" className={inputCls} />
            {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Price Per</label>
            <select {...register('priceUnit')} className={inputCls + ' cursor-pointer'}>
              {PRICE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Bedrooms</label>
            <input {...register('bedrooms')} type="number" min={0} className={inputCls} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Bathrooms</label>
            <input {...register('bathrooms')} type="number" min={0} className={inputCls} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Area (m²)</label>
            <input {...register('area')} type="number" placeholder="e.g. 150" className={inputCls} />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input {...register('featured')} type="checkbox" id="featured" className="w-4 h-4 accent-orange-500 cursor-pointer" />
            <label htmlFor="featured" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              Feature on homepage
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              {...register('description')}
              rows={5}
              placeholder="Describe the property in detail..."
              className={inputCls + ' resize-none'}
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>
        </div>
      </div>

      {/* ── Location ────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6">
        <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-5">Location Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { name: 'address', label: 'Full Address', placeholder: '123 Example Street, Abuja', span: true },
            { name: 'location', label: 'Neighbourhood / Area', placeholder: 'e.g. Maitama District' },
            { name: 'city', label: 'City', placeholder: 'e.g. Abuja' },
            { name: 'state', label: 'State', placeholder: 'e.g. FCT' },
          ].map(({ name, label, placeholder, span }) => (
            <div key={name} className={span ? 'md:col-span-2' : ''}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {label} <span className="text-red-400">*</span>
              </label>
              <input {...register(name as any)} placeholder={placeholder} className={inputCls} />
              {(errors as any)[name] && (
                <p className="text-red-400 text-xs mt-1">{(errors as any)[name]?.message}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Amenities ───────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6">
        <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Amenities & Features</h2>

        {amenitiesList.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {amenitiesList.map((a) => (
              <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-900 text-orange-700 dark:text-orange-400 text-sm rounded-lg">
                {a}
                <button
                  type="button"
                  onClick={() => setAmenitiesList((p) => p.filter((x) => x !== a))}
                  className="text-orange-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {AMENITY_PRESETS.filter((a) => !amenitiesList.includes(a)).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => addAmenity(a)}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-lg hover:border-orange-300 hover:text-orange-600 transition-all"
            >
              <Plus className="w-3 h-3" />
              {a}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAmenity(newAmenity) } }}
            placeholder="Add custom amenity..."
            className={inputCls + ' flex-1'}
          />
          <button
            type="button"
            onClick={() => addAmenity(newAmenity)}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Submit ──────────────────────────────────────── */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 active:translate-y-0"
        >
          {isSubmitting
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            : <><CheckCircle className="w-4 h-4" /> {isEditing ? 'Update Property' : 'Add Property'}</>
          }
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard/properties')}
          className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
