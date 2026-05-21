'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, type LoginFormData } from '@/lib/validations'
import { login } from '@/lib/auth'
import { useAuth } from '@/hooks/useAuth'
import { Lock, Mail, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const { refetch } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setError('')
    try {
      const user = await login(data.email, data.password)
      await refetch()
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        router.push('/admin/dashboard')
        router.refresh()
      } else {
        setError('Access denied. This portal is for administrators only.')
      }
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Invalid credentials. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Admin-only badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-orange-400 text-xs font-medium tracking-wide uppercase">Admin Portal</span>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex flex-col items-center gap-1 mb-6">
              <img
                src="/logo.svg"
                alt="JerryHomes"
                className="h-16 w-auto"
              />
              <span className="font-bold text-xl text-white tracking-tight">
                Jerry<span className="text-orange-500">Homes</span>
              </span>
            </Link>
            <h1 className="font-display text-2xl font-bold text-white mb-2">Admin Sign In</h1>
            <p className="text-slate-400 text-sm">Restricted to administrators only</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="admin@jerryhomes.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition text-sm"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium rounded-xl transition-all shadow-lg hover:-translate-y-0.5 mt-2"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In to Admin'}
            </button>
          </form>

          <p className="text-center mt-6">
            <Link href="/" className="text-orange-400 hover:text-orange-300 text-sm transition-colors">
              ← Back to website
            </Link>
          </p>
        </div>

        <div className="mt-4 p-4 bg-slate-900/50 border border-slate-800/30 rounded-2xl text-center">
          <p className="text-slate-500 text-xs">
            
          </p>
        </div>
      </div>
    </div>
  )
}