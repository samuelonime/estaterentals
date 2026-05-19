// frontend/lib/auth.ts
import Cookies from 'js-cookie'
import { authApi } from './api'

export interface AuthUser {
  id: string
  name?: string | null
  email: string
  role: string
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await authApi.login(email, password)
  const { accessToken, refreshToken, user } = res.data.data

  Cookies.set('accessToken', accessToken, { expires: 7, sameSite: 'strict' })
  Cookies.set('refreshToken', refreshToken, { expires: 30, sameSite: 'strict' })

  return user
}

export function logout() {
  Cookies.remove('accessToken')
  Cookies.remove('refreshToken')
  window.location.href = '/login'
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
