// frontend/lib/auth.ts
import Cookies from 'js-cookie'
import { authApi } from './api'

export interface AuthUser {
  id: string
  name?: string | null
  email: string
  role: string
  image?: string | null
}

// ─── Admin Login ───────────────────────────────────────
export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await authApi.login(email, password)
  const { accessToken, refreshToken, user } = res.data.data

  Cookies.set('accessToken', accessToken, { expires: 7, sameSite: 'strict' })
  Cookies.set('refreshToken', refreshToken, { expires: 30, sameSite: 'strict' })

  return user
}

// ─── Visitor Login ─────────────────────────────────────
export async function visitorLogin(email: string, password: string): Promise<AuthUser> {
  const res = await authApi.visitorLogin(email, password)
  const { accessToken, refreshToken, user } = res.data.data

  Cookies.set('accessToken', accessToken, { expires: 7, sameSite: 'strict' })
  Cookies.set('refreshToken', refreshToken, { expires: 30, sameSite: 'strict' })

  return user
}

// ─── Visitor Register ──────────────────────────────────
export async function visitorRegister(name: string, email: string, password: string): Promise<AuthUser> {
  const res = await authApi.visitorRegister(name, email, password)
  const { accessToken, refreshToken, user } = res.data.data

  Cookies.set('accessToken', accessToken, { expires: 7, sameSite: 'strict' })
  Cookies.set('refreshToken', refreshToken, { expires: 30, sameSite: 'strict' })

  return user
}

// ─── Google Sign-In ────────────────────────────────────
export async function googleSignIn(idToken: string): Promise<AuthUser> {
  const res = await authApi.googleAuth(idToken)
  const { accessToken, refreshToken, user } = res.data.data

  Cookies.set('accessToken', accessToken, { expires: 7, sameSite: 'strict' })
  Cookies.set('refreshToken', refreshToken, { expires: 30, sameSite: 'strict' })

  return user
}

// ─── Logout ────────────────────────────────────────────
export function logout() {
  Cookies.remove('accessToken')
  Cookies.remove('refreshToken')
  window.location.href = '/'
}

export function adminLogout() {
  Cookies.remove('accessToken')
  Cookies.remove('refreshToken')
  window.location.href = '/admin/login'
}

export function getAccessToken(): string | undefined {
  return Cookies.get('accessToken')
}

export function isLoggedIn(): boolean {
  return !!Cookies.get('accessToken')
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await authApi.me()
    return res.data.data
  } catch {
    return null
  }
}
