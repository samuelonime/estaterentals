// backend/src/routes/property.routes.ts
import { Router } from 'express'
import {
  getProperties,
  getAdminProperties,
  getPropertyBySlug,
  getPropertyById,
  createProperty,
  updateProperty,
  patchProperty,
  deleteProperty,
} from '../controllers/property.controller'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'

const router = Router()

// --- Public Routes ---
router.get('/', getProperties)
router.get('/slug/:slug', getPropertyBySlug)

// --- Admin Routes ---
router.get('/admin', authenticate, requireAdmin, getAdminProperties)
router.get('/:id', authenticate, requireAdmin, getPropertyById)
router.post('/', authenticate, requireAdmin, createProperty)
router.put('/:id', authenticate, requireAdmin, updateProperty)
router.patch('/:id', authenticate, requireAdmin, patchProperty)
router.delete('/:id', authenticate, requireAdmin, deleteProperty)

export default router
