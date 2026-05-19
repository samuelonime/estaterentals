// frontend/lib/api.ts
import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = Cookies.get('refreshToken')

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken })
          const { accessToken } = res.data.data
          Cookies.set('accessToken', accessToken, { expires: 7, sameSite: 'strict' })
          original.headers.Authorization = `Bearer ${accessToken}`
          return api(original)
        } catch {
          Cookies.remove('accessToken')
          Cookies.remove('refreshToken')
          if (typeof window !== 'undefined') window.location.href = '/login'
        }
      } else {
        if (typeof window !== 'undefined') window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// ─── Auth ─────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
}

// ─── Properties ───────────────────────────────────────
export const propertyApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/properties', { params }),
  getAdminAll: (params?: Record<string, any>) =>
    api.get('/properties/admin', { params }),
  getBySlug: (slug: string) =>
    api.get(`/properties/slug/${slug}`),
  getById: (id: string) =>
    api.get(`/properties/${id}`),
  create: (data: any) =>
    api.post('/properties', data),
  update: (id: string, data: any) =>
    api.put(`/properties/${id}`, data),
  patch: (id: string, data: any) =>
    api.patch(`/properties/${id}`, data),
  delete: (id: string) =>
    api.delete(`/properties/${id}`),
}

// ─── Messages ─────────────────────────────────────────
export const messageApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/messages', { params }),
  create: (data: any) =>
    api.post('/messages', data),
  patch: (id: string, data: any) =>
    api.patch(`/messages/${id}`, data),
  delete: (id: string) =>
    api.delete(`/messages/${id}`),
}

// ─── Upload ───────────────────────────────────────────
export const uploadApi = {
  single: (formData: FormData) =>
    api.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  multiple: (formData: FormData) =>
    api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (publicId: string) =>
    api.delete('/upload', { data: { publicId } }),
}

// ─── Dashboard ────────────────────────────────────────
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
}
