import { Router } from 'express';
import { createProject, getProjects } from '../controllers/projectController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.post('/', requireAdmin, createProject);
router.get('/', getProjects);

export default router;
