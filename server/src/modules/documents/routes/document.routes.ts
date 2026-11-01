import { Router } from 'express'
import { documentController } from '../controllers/document.controller'
import { authMiddleware } from '../../../core/middlewares/auth.middleware'
import { upload } from '../validators/document.validators'
import { uploadLimiter } from '../../../core/middlewares/rateLimit.middleware'

const router = Router()

// Toutes les routes documents nécessitent une authentification
router.use(authMiddleware)

router.post('/upload',uploadLimiter, upload.single('file'), (req, res, next) =>
  documentController.upload(req as any, res, next)
)
router.get('/', (req, res, next) =>
  documentController.getAll(req as any, res, next)
)
router.get('/:id', (req, res, next) =>
  documentController.getById(req as any, res, next)
)
router.delete('/:id', (req, res, next) =>
  documentController.delete(req as any, res, next)
)

export default router