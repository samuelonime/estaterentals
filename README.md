# JerryHomes — Premium Rental Platform

A full-stack real estate rental application for Abuja, Nigeria.

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, next-themes
- **Backend**: Express.js, TypeScript, Prisma ORM, PostgreSQL
- **Storage**: Cloudinary (images)
- **Auth**: JWT (access + refresh tokens)

## Quick Start

### Prerequisites
- Node.js ≥ 18
- PostgreSQL running locally
- Cloudinary account

### Backend Setup
```bash
cd backend
cp .env.example .env          # Fill in your values
npm install
npx prisma migrate dev        # Run migrations
npx prisma db seed            # Seed admin user
npm run dev
```

### Frontend Setup
```bash
cd frontend
cp .env.example .env.local    # Fill in your values
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
Admin dashboard at [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

## Production Deployment
1. Set `NODE_ENV=production` in backend
2. Use strong random values for `JWT_SECRET` and `JWT_REFRESH_SECRET`
3. Set `ALLOWED_ORIGINS` to your production domain
4. Set `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_API_URL` for production
5. Run `npm run build` in the frontend before deploying

## Security Notes
- Never commit `.env` or `.env.local` files
- Generate JWT secrets with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- Change default seed admin credentials before seeding production
