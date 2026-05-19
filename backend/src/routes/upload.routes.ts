// backend/src/routes/upload.routes.ts
import { Router } from 'express'
import { uploadSingle, uploadMultiple, removeImage } from '../controllers/upload.controller'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'
import { upload } from '../middleware/upload.middleware'

const router = Router()

// All upload routes require admin
router.post('/single', authenticate, requireAdmin, upload.single('file'), uploadSingle)
router.post('/multiple', authenticate, requireAdmin, upload.array('files', 10), uploadMultiple)
router.delete('/', authenticate, requireAdmin, removeImage)

export default router
