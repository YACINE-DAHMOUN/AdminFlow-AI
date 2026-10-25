import {Router} from 'express';
import { deadlinesController } from '../controllers/deadlines.controller';
import { authMiddleware } from '../../../core/middlewares/auth.middleware';


const router = Router()


router .get('/', authMiddleware, deadlinesController.getAll)
router .get('/:id', authMiddleware, deadlinesController.getById)
router .post('/', authMiddleware, deadlinesController.create)
router .patch('/:id', authMiddleware, deadlinesController.update)
router .patch('/:id/done', authMiddleware, deadlinesController.markAsDone)
router .delete('/:id', authMiddleware, deadlinesController.delete)

export default router