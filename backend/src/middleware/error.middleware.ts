// backend/src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Always log full error server-side for debugging
  console.error('[ERROR]', err)

  const isProd = process.env.NODE_ENV === 'production'

  // Zod validation errors — safe to return field details
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    })
  }

  // Prisma known errors — return safe generic messages only
  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, error: 'Resource already exists' })
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, error: 'Resource not found' })
  }
  // Catch all other Prisma errors — never expose DB internals
  if (err.code?.startsWith('P')) {
    return res.status(500).json({ success: false, error: 'A database error occurred' })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, error: 'Token expired' })
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, error: 'File too large. Maximum size is 10MB.' })
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ success: false, error: 'Too many files. Maximum is 10.' })
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ success: false, error: 'Unexpected file field.' })
  }

  const statusCode = err.statusCode ?? err.status ?? 500

  // In production: never leak internal error messages to the client
  // In development: show the real message for easier debugging
  const message = isProd
    ? statusCode < 500
      ? err.message ?? 'Request error'   // 4xx: safe to show (thrown intentionally)
      : 'An unexpected error occurred'   // 5xx: hide internals
    : err.message ?? 'Internal server error'

  return res.status(statusCode).json({ success: false, error: message })
}

export function notFound(req: Request, res: Response) {
  // Don't expose the full URL path in production (can leak route structure)
  const message = process.env.NODE_ENV === 'production'
    ? 'Route not found'
    : `Route ${req.method} ${req.url} not found`

  res.status(404).json({ success: false, error: message })
}