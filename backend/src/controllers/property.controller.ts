// backend/src/controllers/property.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { deleteImage } from '../lib/cloudinary'
import { PropertySchema, PropertyPatchSchema, PropertyFilterSchema } from '../utils/validations'
import { slugify, paginate, buildResponse } from '../utils/helpers'

export async function getProperties(req: Request, res: Response) {
  const filters = PropertyFilterSchema.parse(req.query)
  const { skip, take, page, limit } = paginate(filters.page, filters.limit)

  const where: any = { deletedAt: null }

  if (filters.status) where.status = filters.status
  else where.status = 'ACTIVE' // Public default
  
  if (filters.listingType) where.listingType = filters.listingType
  if (filters.type) where.type = filters.type
  if (filters.city) where.city = { contains: filters.city }
  if (filters.featured !== undefined) where.featured = filters.featured
  if (filters.bedrooms) where.bedrooms = { gte: filters.bedrooms }
  if (filters.minPrice || filters.maxPrice) {
    where.price = {}
    if (filters.minPrice) where.price.gte = filters.minPrice
    if (filters.maxPrice) where.price.lte = filters.maxPrice
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { location: { contains: filters.search } },
      { city: { contains: filters.search } },
      { description: { contains: filters.search } },
    ]
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        images: { orderBy: { order: 'asc' } },
        amenities: true,
      },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      skip,
      take,
    }),
    prisma.property.count({ where }),
  ])

  return res.status(200).json(
    buildResponse({ properties, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } })
  )
}

export async function getAdminProperties(req: Request, res: Response) {
  const filters = PropertyFilterSchema.parse(req.query)
  const { skip, take, page, limit } = paginate(filters.page, filters.limit)

  const where: any = { deletedAt: null }

  if (filters.status) where.status = filters.status
  if (filters.type) where.type = filters.type
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } }
      { city: { contains: filters.search } },
      { location: { contains: filters.search } },
    ]
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: { images: { orderBy: { order: 'asc' }, take: 1 } },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.property.count({ where }),
  ])

  return res.status(200).json(
    buildResponse({ properties, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } })
  )
}

export async function getPropertyBySlug(req: Request, res: Response) {
  const { slug } = req.params

  const property = await prisma.property.findFirst({
    where: { OR: [{ slug }, { id: slug }], deletedAt: null, status: 'ACTIVE' },
    include: { images: { orderBy: { order: 'asc' } }, amenities: true },
  })

  if (!property) {
    return res.status(404).json({ success: false, error: 'Property not found' })
  }

  // ── Deduplicated view count ───────────────────────────
  // Only increment once per property per browser session using a cookie.
  // Prevents bots inflating counts with rapid repeated requests.
  const viewedCookieName = `viewed_${property.id}`
  const alreadyViewed = req.cookies?.[viewedCookieName]

  if (!alreadyViewed) {
    // Fire and forget — don't slow the response for a view count
    prisma.property.update({
      where: { id: property.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {})

    res.cookie(viewedCookieName, '1', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      // No maxAge = session cookie, cleared when browser closes
    })
  }

  return res.status(200).json(buildResponse(property))
}

export async function getPropertyById(req: Request, res: Response) {
  const { id } = req.params

  const property = await prisma.property.findUnique({
    where: { id, deletedAt: null },
    include: { images: { orderBy: { order: 'asc' } }, amenities: true },
  })

  if (!property) {
    return res.status(404).json({ success: false, error: 'Property not found' })
  }

  return res.status(200).json(buildResponse(property))
}

export async function createProperty(req: Request, res: Response) {
  const data = PropertySchema.parse(req.body)
  const { amenities, images, ...propertyData } = data

  let slug = slugify(propertyData.title)
  const existing = await prisma.property.findUnique({ where: { slug } })
  if (existing) slug = `${slug}-${Date.now()}`

  const property = await prisma.property.create({
    data: {
      ...propertyData,
      slug,
      amenities: amenities?.length
        ? { create: amenities.map((name) => ({ name })) }
        : undefined,
      images: images?.length
        ? { create: images.map((img, i) => ({ ...img, order: img.order ?? i })) }
        : undefined,
    },
    include: { images: true, amenities: true },
  })

  return res.status(201).json(buildResponse(property, 'Property created successfully'))
}

export async function updateProperty(req: Request, res: Response) {
  const { id } = req.params
  const data = PropertySchema.parse(req.body)
  const { amenities, images, ...propertyData } = data

  const existing = await prisma.property.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ success: false, error: 'Property not found' })

  let slug = existing.slug
  if (existing.title !== propertyData.title) {
    const newSlug = slugify(propertyData.title)
    const conflict = await prisma.property.findFirst({
      where: { slug: newSlug, id: { not: id } },
    })
    slug = conflict ? `${newSlug}-${Date.now()}` : newSlug
  }

  const property = await prisma.$transaction(async (tx) => {
    await tx.amenity.deleteMany({ where: { propertyId: id } })
    await tx.propertyImage.deleteMany({ where: { propertyId: id } })

    return tx.property.update({
      where: { id },
      data: {
        ...propertyData,
        slug,
        amenities: amenities?.length
          ? { create: amenities.map((name) => ({ name })) }
          : undefined,
        images: images?.length
          ? { create: images.map((img, i) => ({ ...img, order: img.order ?? i })) }
          : undefined,
      },
      include: { images: true, amenities: true },
    })
  })

  return res.status(200).json(buildResponse(property, 'Property updated successfully'))
}

export async function patchProperty(req: Request, res: Response) {
  const { id } = req.params
  const data = PropertyPatchSchema.parse(req.body)

  const property = await prisma.property.update({ where: { id }, data })
  return res.status(200).json(buildResponse(property, 'Property updated'))
}

export async function deleteProperty(req: Request, res: Response) {
  const { id } = req.params

  const property = await prisma.property.update({
    where: { id },
    data: { deletedAt: new Date() },
    include: { images: true },
  })

  // Clean up Cloudinary images in background
  Promise.all(property.images.map((img) => deleteImage(img.publicId).catch(() => {}))).catch(() => {})

  return res.status(200).json(buildResponse(null, 'Property deleted successfully'))
}