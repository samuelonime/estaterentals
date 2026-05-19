// backend/src/controllers/message.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { MessageSchema, MessagePatchSchema, PropertyFilterSchema } from '../utils/validations'
import { paginate, buildResponse } from '../utils/helpers'
import { z } from 'zod'

const MessageFilterSchema = z.object({
  status: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(15),
})

export async function getMessages(req: Request, res: Response) {
  const filters = MessageFilterSchema.parse(req.query)
  const { skip, take, page, limit } = paginate(filters.page, filters.limit)

  const where: any = { deletedAt: null }
  if (filters.status) where.status = filters.status

  const [messages, total, unreadCount] = await Promise.all([
    prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.message.count({ where }),
    prisma.message.count({ where: { status: 'UNREAD', deletedAt: null } }),
  ])

  return res.status(200).json(
    buildResponse({
      messages,
      unreadCount,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    })
  )
}

export async function createMessage(req: Request, res: Response) {
  const data = MessageSchema.parse(req.body)
  const message = await prisma.message.create({ data })
  return res.status(201).json(buildResponse(message, 'Message sent successfully'))
}

export async function patchMessage(req: Request, res: Response) {
  const { id } = req.params
  const data = MessagePatchSchema.parse(req.body)

  const message = await prisma.message.update({ where: { id }, data })
  return res.status(200).json(buildResponse(message, 'Message updated'))
}

export async function deleteMessage(req: Request, res: Response) {
  const { id } = req.params
  await prisma.message.update({ where: { id }, data: { deletedAt: new Date() } })
  return res.status(200).json(buildResponse(null, 'Message deleted'))
}
