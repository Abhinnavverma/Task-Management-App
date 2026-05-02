// backend/src/controllers/taskController.ts
import type { Response } from 'express';
import { prisma } from '../shared/prisma.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';
import { createTaskSchema, updateTaskStatusSchema } from '../shared/schemas.js';

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const data = createTaskSchema.parse(req.body);
        const task = await prisma.task.create({
            data: {
                title: data.title,
                projectId: data.projectId,
                description: data.description ?? null,
                assigneeId: data.assigneeId ?? null,
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
            },
        });
        res.status(201).json(task);
    } catch (error: any) {
        res.status(400).json({ error: error.errors || 'Failed to create task' });
    }
};

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const { userId, role } = user;
    const { projectId } = req.query;

    try {
        const tasks = await prisma.task.findMany({
            where: {
                ...(projectId ? { projectId: String(projectId) } : {}),
                ...(role === 'ADMIN' ? {} : { assigneeId: userId }),
            },
            include: { assignee: { select: { id: true, name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const { userId, role } = user;

    try {
        const data = updateTaskStatusSchema.parse(req.body);

        if (role === 'MEMBER') {
            const task = await prisma.task.findUnique({ where: { id: String(id) } });
            if (!task || task.assigneeId !== userId) {
                res.status(403).json({ error: 'Forbidden: You can only update your own tasks' });
                return;
            }
        }

        const updatedTask = await prisma.task.update({
            where: { id: String(id) },
            data: { status: data.status },
        });
        res.json(updatedTask);
    } catch (error: any) {
        res.status(400).json({ error: error.errors || 'Failed to update task' });
    }
};
