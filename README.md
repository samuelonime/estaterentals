# 🏡 EstatePro — Separated Full-Stack Real Estate Platform

A production-ready real estate rental platform with a **fully separated backend and frontend**, designed for web now and mobile later.

```
estatepro/
├── backend/    ← Node.js + Express + Prisma + PostgreSQL + JWT
└── frontend/   ← Next.js 14 + TypeScript + Tailwind (consumes backend API)
```

---

## ✨ Features

### Public Site
- **Landing Page** — Animated hero with property search, stats bar, featured listings, CTA
- **Listings Page** — Filtered, paginated property grid (type, price, bedrooms, location)
- **Property Detail** — Image gallery with lightbox, amenities, Google Maps, WhatsApp/Call CTAs
- **Contact Page** — Validated form stored to database

### Admin Dashboard (`/dashboard`)
- **JWT Login** — Secure auth with access + refresh tokens
- **Dashboard** — Live stats + recent properties & messages feed
- **Property CRUD** — Create, edit, delete, toggle active/inactive
- **Image Upload** — Per-image Cloudinary links with copy + open buttons
- **Listing Link** — After publishing a property, get the shareable public URL instantly
- **Messages** — Expandable inbox, read/unread, direct email + WhatsApp reply

### Architecture Benefit
- **Same backend API → web + mobile** — React Native / Flutter just points to the same Express API
- No tight Next.js coupling — frontend is purely a client
- JWT tokens work universally across web, iOS, Android

---

## 🛠 Tech Stack

| Layer | Backend | Frontend |
|-------|---------|----------|
| Runtime | Node.js + Express | Next.js 14 (App Router) |
| Language | TypeScript (strict) | TypeScript (strict) |
| Database | PostgreSQL + Prisma | — |
| Auth | JWT (access + refresh) | JWT stored in cookies |
| Validation | Zod | Zod + React Hook Form |
| Images | Cloudinary | Cloudinary (display) |
| Styling | — | Tailwind CSS |
| Deployment | Railway / Render | Vercel |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url> estatepro
cd estatepro

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

### 2. Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
# PostgreSQL (Railway, Supabase, Neon, or local)
DATABASE_URL="postgresql://postgres:password@localhost:5432/estatepro?schema=public"

# JWT secrets — generate with:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="your_64_char_hex_string"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="your_other_64_char_hex_string"
JWT_REFRESH_EXPIRES_IN="30d"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Server
PORT=5000
NODE_ENV="development"
ALLOWED_ORIGINS="http://localhost:3000"

# Admin seed credentials — change before production!
SEED_ADMIN_EMAIL="admin@estatepro.com"
SEED_ADMIN_PASSWORD="Admin@123456"
SEED_ADMIN_NAME="EstatePro Admin"
```

### 3. Database Setup

```bash
cd backend

# Push schema to PostgreSQL
npx prisma db push

# Seed with sample data + admin user
npm run db:seed
```

### 4. Frontend Environment

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="2348012345678"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
```

### 5. Run Both Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# → API running at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# → Site running at http://localhost:3000
```

**Admin login:**
- URL: `http://localhost:3000/login`
- Email: as set in `SEED_ADMIN_EMAIL`
- Password: as set in `SEED_ADMIN_PASSWORD`

---

## 📁 Project Structure

```
estatepro/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # PostgreSQL schema
│   │   └── seed.ts                # Seed (reads from .env)
│   └── src/
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   ├── property.controller.ts
│       │   ├── message.controller.ts
│       │   ├── upload.controller.ts
│       │   └── dashboard.controller.ts
│       ├── middleware/
│       │   ├── auth.middleware.ts  # JWT verify + role guard
│       │   ├── error.middleware.ts # Global error handler
│       │   └── upload.middleware.ts# Multer config
│       ├── routes/
│       │   ├── auth.routes.ts
│       │   ├── property.routes.ts
│       │   ├── message.routes.ts
│       │   ├── upload.routes.ts
│       │   └── dashboard.routes.ts
│       ├── lib/
│       │   ├── prisma.ts           # Prisma singleton
│       │   └── cloudinary.ts       # Upload helpers
│       ├── utils/
│       │   ├── jwt.ts              # Token sign/verify
│       │   ├── helpers.ts          # Slug, paginate, response
│       │   └── validations.ts      # Zod schemas
│       └── index.ts                # Express app entry
│
└── frontend/
    ├── app/
    │   ├── (public)/
    │   │   ├── page.tsx            # Landing page
    │   │   ├── properties/
    │   │   │   ├── page.tsx        # Listings
    │   │   │   └── [id]/page.tsx   # Property detail
    │   │   └── contact/page.tsx
    │   ├── (admin)/
    │   │   ├── layout.tsx          # JWT auth guard
    │   │   └── dashboard/
    │   │       ├── page.tsx        # Overview
    │   │       ├── properties/
    │   │       │   ├── page.tsx    # Property list
    │   │       │   ├── new/page.tsx
    │   │       │   └── [id]/edit/page.tsx
    │   │       └── messages/page.tsx
    │   ├── login/page.tsx
    │   └── layout.tsx
    ├── components/
    │   ├── layout/   Navbar, Footer, Providers
    │   ├── property/ HeroSection, PropertyCard, Gallery, Filters, ContactForm
    │   └── admin/    Sidebar, Topbar, PropertyForm (with image links)
    ├── lib/
    │   ├── api.ts          # Axios client + all API calls
    │   ├── auth.ts         # Cookie-based JWT helpers
    │   ├── utils.ts        # Formatters, slugify, etc.
    │   └── validations.ts  # Zod schemas
    └── hooks/
        └── useAuth.ts      # Auth context + provider
```

---

## 🌐 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Login → returns access + refresh tokens |
| POST | `/api/auth/refresh` | No | Get new access token |
| GET | `/api/auth/me` | Admin | Get current user |

### Properties
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/properties` | No | List active properties (public) |
| GET | `/api/properties/slug/:slug` | No | Get property by slug |
| GET | `/api/properties/admin` | Admin | List all properties (admin) |
| GET | `/api/properties/:id` | Admin | Get single property |
| POST | `/api/properties` | Admin | Create property |
| PUT | `/api/properties/:id` | Admin | Full update |
| PATCH | `/api/properties/:id` | Admin | Partial update (status/featured) |
| DELETE | `/api/properties/:id` | Admin | Soft delete |

### Messages
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/messages` | No | Submit contact message |
| GET | `/api/messages` | Admin | List messages |
| PATCH | `/api/messages/:id` | Admin | Mark read/unread |
| DELETE | `/api/messages/:id` | Admin | Soft delete |

### Upload
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload/single` | Admin | Upload one image → returns `{url, publicId}` |
| POST | `/api/upload/multiple` | Admin | Upload up to 10 images |
| DELETE | `/api/upload` | Admin | Delete image from Cloudinary |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/stats` | Admin | Stats + recent activity |

---

## 🌐 Deployment

### Backend → Railway

1. Create new Railway project → **Deploy from GitHub**
2. Add a **PostgreSQL** service
3. Set all environment variables from `.env.example`
4. After first deploy, run migrations:
   ```bash
   railway run npx prisma migrate deploy
   railway run npm run db:seed
   ```

### Frontend → Vercel

1. Push `frontend/` to a separate GitHub repo (or monorepo with `/frontend` root)
2. Import to Vercel
3. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NEXT_PUBLIC_WHATSAPP_NUMBER=2348012345678
   ```

---

## 📱 Adding Mobile Later (React Native / Flutter)

Because the backend is a pure REST API:

1. Point your mobile app to the same `BACKEND_URL`
2. Use the same `/api/auth/login` → store JWT in secure storage
3. Call `/api/properties`, `/api/messages` etc. identically
4. Upload images via `/api/upload/single` with `multipart/form-data`

Zero backend changes needed.

---

## 🔐 Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT access tokens expire in 7 days, refresh in 30 days
- All admin routes protected by `authenticate` + `requireAdmin` middleware
- CORS restricted to configured allowed origins
- Rate limiting on all routes (stricter on `/api/auth/login`)
- Zod validation on every request body
- Admin seed credentials loaded from `.env` — never hardcoded
- Soft deletes — no permanent data loss
#   e s t a t e r e n t a l s  
 #   e s t a t e r e n t a l s  
 