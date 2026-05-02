import type { Response } from 'express';
import { prisma } from '../shared/prisma.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
    const { userId, role } = req.user!;

    const whereClause = role === 'ADMIN' ? {} : { assigneeId: userId };

    try {
        const [total, todo, inProgress, done, overdue] = await Promise.all([
            prisma.task.count({ where: whereClause }),
            prisma.task.count({ where: { ...whereClause, status: 'TODO' } }),
            prisma.task.count({ where: { ...whereClause, status: 'IN_PROGRESS' } }),
            prisma.task.count({ where: { ...whereClause, status: 'DONE' } }),
            prisma.task.count({
                where: {
                    ...whereClause,
                    status: { not: 'DONE' },
                    dueDate: { lt: new Date() },
                },
            }),
        ]);

        res.json({ total, todo, inProgress, done, overdue });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};
