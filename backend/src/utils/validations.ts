// backend/src/utils/validations.ts
import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const PropertySchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20),
  price: z.coerce.number().positive(),
  priceUnit: z.enum(['MONTH', 'YEAR', 'WEEK', 'DAY']).default('MONTH'),
  location: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  address: z.string().min(5),
  type: z.enum(['APARTMENT', 'HOUSE', 'STUDIO', 'DUPLEX', 'PENTHOUSE', 'COMMERCIAL', 'LAND']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'RENTED']).default('ACTIVE'),
  bedrooms: z.coerce.number().min(0).max(20),
  bathrooms: z.coerce.number().min(0).max(20),
  area: z.coerce.number().positive().optional(),
  featured: z.boolean().default(false),
  amenities: z.array(z.string()).optional(),
  images: z.array(
    z.object({
      url: z.string().url(),
      publicId: z.string(),
      alt: z.string().optional(),
      order: z.number().optional(),
    })
  ).optional(),
})

export const PropertyPatchSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'RENTED']).optional(),
  featured: z.boolean().optional(),
})

export const MessageSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[+\d\s()-]{7,20}$/).optional().or(z.literal('')),
  subject: z.string().min(3).max(200),
  body: z.string().min(10).max(2000),
  propertyId: z.string().optional(),
})

export const MessagePatchSchema = z.object({
  status: z.enum(['READ', 'UNREAD']).optional(),
})

export const PropertyFilterSchema = z.object({
  // Limit search string to 100 chars to prevent full-table-scan DoS
  search: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  type: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  bedrooms: z.coerce.number().min(0).max(20).optional(),
  featured: z.coerce.boolean().optional(),
  status: z.string().optional(),
  page: z.coerce.number().min(1).max(1000).default(1),
  limit: z.coerce.number().min(1).max(50).default(9),
})