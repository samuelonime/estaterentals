// frontend/lib/validations.ts
import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[+\d\s()-]{7,20}$/, 'Invalid phone number').optional().or(z.literal('')),
  subject: z.string().min(3, 'Subject is required').max(200),
  body: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  propertyId: z.string().optional(),
})

export const PropertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  priceUnit: z.enum(['MONTH', 'YEAR', 'WEEK', 'DAY']).default('MONTH'),
  location: z.string().min(2, 'Location is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  address: z.string().min(5, 'Address is required'),
  type: z.enum(['APARTMENT', 'HOUSE', 'STUDIO', 'DUPLEX', 'PENTHOUSE', 'COMMERCIAL', 'LAND']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'RENTED']).default('ACTIVE'),
  bedrooms: z.coerce.number().min(0).max(20),
  bathrooms: z.coerce.number().min(0).max(20),
  area: z.coerce.number().positive().optional(),
  featured: z.boolean().default(false),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  listingType: z.enum(['RENT', 'SALE']).default('RENT'),
})

export type LoginFormData = z.infer<typeof LoginSchema>
export type ContactFormData = z.infer<typeof ContactSchema>
export type PropertyFormData = z.infer<typeof PropertySchema>
