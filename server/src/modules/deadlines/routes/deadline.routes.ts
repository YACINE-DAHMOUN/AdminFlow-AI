import {Router} from 'express';
import { deadlinesController } from '../controllers/deadlines.controller';
import { authMiddleware } from '../../../core/middlewares/auth.middleware';
import { validate } from '../../../core/middlewares/validate.middleware';
import { createDeadlineSchema, updateDeadlineSchema } from '../validators/deadline.validators';


const router = Router()


router .get('/', authMiddleware, deadlinesController.getAll)
router .get('/:id', authMiddleware, deadlinesController.getById)
router .patch('/:id/done', authMiddleware, deadlinesController.markAsDone)
router .delete('/:id', authMiddleware, deadlinesController.delete)
router .post('/', authMiddleware, validate(createDeadlineSchema), deadlinesController.create)
router .patch('/:id', authMiddleware, validate(updateDeadlineSchema), deadlinesController.update)

export default router