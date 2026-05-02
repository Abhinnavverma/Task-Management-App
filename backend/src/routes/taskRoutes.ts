import { Router } from 'express';
import { createTask, getTasks, updateTaskStatus } from '../controllers/taskController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.post('/', requireAdmin, createTask);
router.get('/', getTasks);
router.patch('/:id/status', updateTaskStatus);

export default router;
