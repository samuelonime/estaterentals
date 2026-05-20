// Redirect old /login to the new admin portal login
import { redirect } from 'next/navigation'

export default function LegacyLoginRedirect() {
  redirect('/admin/login')
}
