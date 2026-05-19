// backend/src/routes/message.routes.ts
import { Router } from 'express'
import {
  getMessages,
  createMessage,
  patchMessage,
  deleteMessage,
} from '../controllers/message.controller'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'

const router = Router()

// Public — anyone can submit a contact message
router.post('/', createMessage)

// Admin only
router.get('/', authenticate, requireAdmin, getMessages)
router.patch('/:id', authenticate, requireAdmin, patchMessage)
router.delete('/:id', authenticate, requireAdmin, deleteMessage)

export default router
