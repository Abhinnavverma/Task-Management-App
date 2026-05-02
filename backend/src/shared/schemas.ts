import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const createProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
});

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    projectId: z.string().uuid('Invalid Project ID'),
    assigneeId: z.string().uuid('Invalid Assignee ID').optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(), // ISO string from frontend
});

export const updateTaskStatusSchema = z.object({
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
