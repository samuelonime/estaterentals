import { redirect } from 'next/navigation'

// The old /dashboard/* routes now redirect to /admin/dashboard/*
export default function LegacyAdminLayout({ children }: { children: React.ReactNode }) {
  redirect('/admin/dashboard')
}
