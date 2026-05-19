// frontend/app/layout.tsx
import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Providers } from '@/components/layout/Providers'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'], variable: '--font-playfair', display: 'swap',
})
const dmSans = DM_Sans({
  subsets: ['latin'], variable: '--font-dm-sans', display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: { default: 'JerryHomes — Premium Rentals in Abuja', template: '%s | JerryHomes' },
  description: 'Discover premium rental properties in Abuja. Luxury apartments, houses, duplexes and penthouses.',
  keywords: ['Abuja rentals', 'luxury apartments Abuja', 'houses for rent Abuja', 'JerryHomes'],
  authors: [{ name: 'JerryHomes' }],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'JerryHomes',
    title: 'JerryHomes — Premium Rentals in Abuja',
    description: 'Discover premium rental properties in Abuja. Luxury apartments, houses, duplexes and penthouses.',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JerryHomes — Premium Rentals in Abuja',
    description: 'Discover premium rental properties in Abuja.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${dmSans.variable} font-body antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
