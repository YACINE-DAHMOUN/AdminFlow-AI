import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { authMiddleware } from '../../../core/middlewares/auth.middleware'
import { loginLimiter } from '../../../core/middlewares/rateLimit.middleware'

const router = Router()

// Routes publiques
router.post('/register',loginLimiter, (req, res) => authController.register(req, res))
router.post('/login',loginLimiter, (req, res) => authController.login(req, res))
router.post('/logout', (req, res) => authController.logout(req, res))

// Routes protégées — nécessite un token JWT valide
router.get('/me', authMiddleware, (req, res) => authController.me(req, res))

export default router