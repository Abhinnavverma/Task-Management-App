import { Router } from 'express';
import { getAllUsers } from '../controllers/userController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', getAllUsers);

export default router;
