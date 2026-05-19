// backend/src/controllers/dashboard.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { buildResponse } from '../utils/helpers'

export async function getDashboardStats(req: Request, res: Response) {
  const [
    totalProperties,
    activeListings,
    rentedProperties,
    totalMessages,
    unreadMessages,
    totalViews,
    recentProperties,
    recentMessages,
  ] = await Promise.all([
    prisma.property.count({ where: { deletedAt: null } }),
    prisma.property.count({ where: { status: 'ACTIVE', deletedAt: null } }),
    prisma.property.count({ where: { status: 'RENTED', deletedAt: null } }),
    prisma.message.count({ where: { deletedAt: null } }),
    prisma.message.count({ where: { status: 'UNREAD', deletedAt: null } }),
    prisma.property.aggregate({ where: { deletedAt: null }, _sum: { viewCount: true } }),
    prisma.property.findMany({
      where: { deletedAt: null },
      include: { images: { orderBy: { order: 'asc' }, take: 1 } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.message.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  return res.status(200).json(
    buildResponse({
      stats: {
        totalProperties,
        activeListings,
        rentedProperties,
        totalMessages,
        unreadMessages,
        totalViews: totalViews._sum.viewCount ?? 0,
      },
      recentProperties,
      recentMessages,
    })
  )
}
