// backend/src/routes/dashboard.routes.ts
import { Router } from 'express'
import { getDashboardStats } from '../controllers/dashboard.controller'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'

const router = Router()

router.get('/stats', authenticate, requireAdmin, getDashboardStats)

export default router
