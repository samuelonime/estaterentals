// backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { LoginSchema } from '../utils/validations'
import { buildResponse } from '../utils/helpers'

export async function login(req: Request, res: Response) {
  const data = LoginSchema.parse(req.body)

  const user = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  })

  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' })
  }

  const isValid = await bcrypt.compare(data.password, user.password)
  if (!isValid) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' })
  }

  const payload = { id: user.id, email: user.email, role: user.role }
  const accessToken = generateAccessToken(payload)
  const refreshToken = generateRefreshToken(payload)

  return res.status(200).json(
    buildResponse(
      {
        accessToken,
        refreshToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
      'Login successful'
    )
  )
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.status(400).json({ success: false, error: 'Refresh token required' })
  }

  try {
    const payload = verifyRefreshToken(refreshToken)
    const user = await prisma.user.findUnique({ where: { id: payload.id } })

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' })
    }

    const newPayload = { id: user.id, email: user.email, role: user.role }
    const accessToken = generateAccessToken(newPayload)

    return res.status(200).json(buildResponse({ accessToken }, 'Token refreshed'))
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid refresh token' })
  }
}

export async function me(req: any, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  if (!user) return res.status(404).json({ success: false, error: 'User not found' })

  return res.status(200).json(buildResponse(user))
}
