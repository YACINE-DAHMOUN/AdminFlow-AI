import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { authMiddleware } from '../../../core/middlewares/auth.middleware'
import { loginLimiter } from '../../../core/middlewares/rateLimit.middleware'
import { registerLimiter } from '../../../core/middlewares/rateLimit.middleware'

const router = Router()

// Routes publiques
router.post('/register',registerLimiter, (req, res, next) => authController.register(req, res, next))
router.post('/login',loginLimiter, (req, res, next) => authController.login(req, res, next))
router.post('/logout', (req, res) => authController.logout(req, res))

// Routes protégées — nécessite un token JWT valide
router.get('/me', authMiddleware, (req, res, next) => authController.me(req, res, next))

export default router