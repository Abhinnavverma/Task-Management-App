import type { Response } from 'express';
import { prisma } from '../shared/prisma.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';
import { createProjectSchema } from '../shared/schemas.js';

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const data = createProjectSchema.parse(req.body);
        const user = req.user;
        const userId = user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: Missing user ID' });
            return;
        }
        const project = await prisma.project.create({
            data: { ...data, ownerId: userId, description: data.description ?? null },
        });
        res.status(201).json(project);
    } catch (error: any) {
        res.status(400).json({ error: error.errors || 'Failed to create project' });
    }
};

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
    const { userId, role } = req.user!;
    try {
        const projects = await prisma.project.findMany({
            where: role === 'ADMIN' ? {} : { tasks: { some: { assigneeId: userId } } },
            include: { _count: { select: { tasks: true } } },
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};
