import type { Request, Response } from 'express';
import { prisma } from '../shared/prisma.js';
import { logger } from '../utils/logger.js';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
            orderBy: { name: 'asc' },
        });

        res.json(users);
    } catch (error: any) {
        logger.error({ err: error }, 'Failed to fetch users');
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
