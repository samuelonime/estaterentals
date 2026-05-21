// backend/src/routes/message.routes.ts
import { Router } from 'express'
import {
  getMessages,
  createMessage,
  patchMessage,
  deleteMessage,
} from '../controllers/message.controller'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'
import rateLimit from 'express-rate-limit'

// Strict rate limit for the public contact form:
// max 5 messages per 10 minutes per IP — stops spam bots
const contactFormLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: { success: false, error: 'Too many messages sent. Please wait 10 minutes before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const router = Router()

// Public — rate-limited contact form
router.post('/', contactFormLimiter, createMessage)

// Admin only
router.get('/', authenticate, requireAdmin, getMessages)
router.patch('/:id', authenticate, requireAdmin, patchMessage)
router.delete('/:id', authenticate, requireAdmin, deleteMessage)

export default router