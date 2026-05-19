'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContactSchema, type ContactFormData } from '@/lib/validations'
import { messageApi } from '@/lib/api'
import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

const inputCls = "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition"

export function ContactPropertyForm({ propertyId }: { propertyId?: string }) {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { propertyId },
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      await messageApi.create(data)
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      console.error(err)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <CheckCircle className="w-10 h-10 text-green-500 mb-3" />
        <p className="font-semibold text-slate-900 dark:text-white">Message Sent!</p>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">We'll get back to you shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input type="hidden" {...register('propertyId')} />

      <div>
        <input {...register('name')} placeholder="Your name" className={inputCls} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <input {...register('email')} type="email" placeholder="Email address" className={inputCls} />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <input {...register('phone')} placeholder="Phone (optional)" className={inputCls} />
      </div>
      <div>
        <input {...register('subject')} placeholder="Subject" defaultValue={propertyId ? 'Property Enquiry' : ''} className={inputCls} />
        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
      </div>
      <div>
        <textarea {...register('body')} rows={4} placeholder="Your message..." className={`${inputCls} resize-none`} />
        {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5 shadow-lg shadow-orange-500/25"
      >
        <Send className="w-4 h-4" />
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
