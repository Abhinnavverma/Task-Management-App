import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/stats', getDashboardStats);

export default router;
