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

// Secure cookie options — httpOnly must be set server-side, but we add
// secure + sameSite here for the js-cookie layer.
// For true httpOnly, tokens should be set via Set-Cookie on the server.
// This is the best we can do from client-side js-cookie.
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
}

const ACCESS_OPTS: Cookies.CookieAttributes  = { ...COOKIE_OPTIONS, expires: 7 }
const REFRESH_OPTS: Cookies.CookieAttributes = { ...COOKIE_OPTIONS, expires: 30 }

function setTokens(accessToken: string, refreshToken: string) {
  Cookies.set('accessToken', accessToken, ACCESS_OPTS)
  Cookies.set('refreshToken', refreshToken, REFRESH_OPTS)
}

function clearTokens() {
  Cookies.remove('accessToken')
  Cookies.remove('refreshToken')
}

// ─── Admin Login ───────────────────────────────────────
export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await authApi.login(email, password)
  const { accessToken, refreshToken, user } = res.data.data
  setTokens(accessToken, refreshToken)
  return user
}

// ─── Visitor Login ─────────────────────────────────────
export async function visitorLogin(email: string, password: string): Promise<AuthUser> {
  const res = await authApi.visitorLogin(email, password)
  const { accessToken, refreshToken, user } = res.data.data
  setTokens(accessToken, refreshToken)
  return user
}

// ─── Visitor Register ──────────────────────────────────
export async function visitorRegister(name: string, email: string, password: string): Promise<AuthUser> {
  const res = await authApi.visitorRegister(name, email, password)
  const { accessToken, refreshToken, user } = res.data.data
  setTokens(accessToken, refreshToken)
  return user
}

// ─── Google Sign-In ────────────────────────────────────
export async function googleSignIn(idToken: string): Promise<AuthUser> {
  const res = await authApi.googleAuth(idToken)
  const { accessToken, refreshToken, user } = res.data.data
  setTokens(accessToken, refreshToken)
  return user
}

// ─── Logout ────────────────────────────────────────────
export function logout() {
  clearTokens()
  window.location.href = '/'
}

export function adminLogout() {
  clearTokens()
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