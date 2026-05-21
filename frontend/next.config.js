/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'

// ─── Content Security Policy ──────────────────────────
// Allowlist exactly what your site needs, block everything else.
const cspDirectives = {
  'default-src':  ["'self'"],
  'script-src':   [
    "'self'",
    // Google Sign-In GSI script
    'https://accounts.google.com',
    // Next.js inline scripts need unsafe-inline in dev; in prod use nonces ideally
    // For now allowing unsafe-inline only in dev to keep things working
    isProd ? '' : "'unsafe-inline'",
  ].filter(Boolean),
  'style-src':    ["'self'", "'unsafe-inline'"], // Tailwind needs inline styles
  'img-src':      [
    "'self'",
    'data:',
    'blob:',
    'https://res.cloudinary.com',   // property images
    'https://images.unsplash.com',  // seed images
    'https://lh3.googleusercontent.com', // Google profile pictures
  ],
  'font-src':     ["'self'", 'data:'],
  'connect-src':  [
    "'self'",
    process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000',
    'https://accounts.google.com',
    'https://oauth2.googleapis.com',
  ],
  'frame-src':    ["'none'"],
  'object-src':   ["'none'"],
  'base-uri':     ["'self'"],
  'form-action':  ["'self'"],
  'upgrade-insecure-requests': isProd ? [''] : [],
}

const cspHeader = Object.entries(cspDirectives)
  .filter(([, values]) => values.length > 0 && values.some(v => v !== ''))
  .map(([directive, values]) => {
    const val = values.filter(Boolean).join(' ')
    return val ? `${directive} ${val}` : directive
  })
  .join('; ')

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // ── CSP (most important) ───────────────────────
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          // ── Standard security headers ──────────────────
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-Frame-Options',          value: 'DENY' },
          { key: 'X-XSS-Protection',         value: '1; mode=block' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
          // ── HSTS: force HTTPS for 1 year in production ─
          ...(isProd ? [{
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          }] : []),
        ],
      },
    ]
  },
}

module.exports = nextConfig