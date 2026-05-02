import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../shared/schemas.js';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            res.status(400).json({ error: 'Email already in use' });
            return;
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const userCount = await prisma.user.count();
        const role = userCount === 0 ? 'ADMIN' : 'MEMBER';

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
                role,
            },
        });

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(201).json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error: any) {
        res.status(400).json({ error: error.errors || 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isValid = await bcrypt.compare(data.password, user.passwordHash);
        if (!isValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: '1d',
        });

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error: any) {
        logger.error({ err: error, email: req.body.email }, 'Login failed');
        res.status(400).json({ error: error.errors || 'Login failed' });
    }
};
