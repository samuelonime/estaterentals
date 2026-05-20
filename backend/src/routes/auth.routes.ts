// backend/src/routes/auth.routes.ts
import { Router } from 'express'
import { login, refresh, me, googleAuth, visitorRegister, visitorLogin } from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

// Admin routes
router.post('/login', login)
router.post('/refresh', refresh)
router.get('/me', authenticate, me)

// Visitor / Google OAuth routes
router.post('/google', googleAuth)
router.post('/visitor/register', visitorRegister)
router.post('/visitor/login', visitorLogin)

export default router
