import { Router } from 'express'
import { documentController } from '../controllers/document.controller'
import { authMiddleware } from '../../../core/middlewares/auth.middleware'
import { upload } from '../validators/document.validators'

const router = Router()

// Toutes les routes documents nécessitent une authentification
router.use(authMiddleware)

router.post('/upload', upload.single('file'), (req, res) =>
  documentController.upload(req as any, res)
)
router.get('/', (req, res) =>
  documentController.getAll(req as any, res)
)
router.get('/:id', (req, res) =>
  documentController.getById(req as any, res)
)
router.delete('/:id', (req, res) =>
  documentController.delete(req as any, res)
)

export default router