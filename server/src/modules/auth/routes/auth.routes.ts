import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { authMiddleware } from '../../../core/middlewares/auth.middleware'
import { loginLimiter, registerLimiter, emailVerificationLimiter } from '../../../core/middlewares/rateLimit.middleware'

const router = Router()

// Routes publiques
router.post('/register',registerLimiter, (req, res, next) => authController.register(req, res, next))
router.post('/verify-email',emailVerificationLimiter, (req, res, next) => authController.verifyEmail(req, res, next))
router.post('/login',loginLimiter, (req, res, next) => authController.login(req, res, next))
router.post('/logout', (req, res) => authController.logout(req, res))
router.post('/logout-all', authMiddleware, (req, res, next) => authController.logoutAll(req, res, next))

// Routes protégées — nécessite un token JWT valide
router.get('/me', authMiddleware, (req, res, next) => authController.me(req, res, next))

export default router