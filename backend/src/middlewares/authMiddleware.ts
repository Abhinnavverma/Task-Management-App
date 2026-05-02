import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export interface AuthRequest extends Request {
    user?: { userId: string; role: 'ADMIN' | 'MEMBER' };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthRequest['user'];
        if (!decoded) {
            throw new Error();
        }
        req.user = decoded;
        next();
    } catch (error) {
        logger.error({ err: error }, 'Token verification failed');
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== 'ADMIN') {
        logger.warn({ user: req.user?.userId }, 'Failed admin access attempt');
        res.status(403).json({ error: 'Forbidden: Admin access required' });
        return;
    }
    next();
};
