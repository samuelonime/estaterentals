// Redirect legacy /dashboard URL to new /admin/dashboard portal
import { redirect } from 'next/navigation'

export default function LegacyDashboardRedirect() {
  redirect('/admin/dashboard')
}
