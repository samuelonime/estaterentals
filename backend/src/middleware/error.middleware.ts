// backend/src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('[ERROR]', err)

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    })
  }

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, error: 'Resource already exists' })
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, error: 'Resource not found' })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, error: 'Token expired' })
  }

  const statusCode = err.statusCode ?? err.status ?? 500
  const message = err.message ?? 'Internal server error'

  return res.status(statusCode).json({ success: false, error: message })
}

export function notFound(req: Request, res: Response) {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.url} not found` })
}
