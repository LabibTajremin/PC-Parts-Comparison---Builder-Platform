import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JwtPayload } from '../types';
import { AppError } from './error.middleware';

export function authMiddleware(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(401, 'Authentication required');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.ADMIN_JWT_SECRET || 'secret') as JwtPayload;
    req.adminId = payload.adminId;
    req.adminEmail = payload.email;
    next();
  } catch {
    throw new AppError(401, 'Invalid or expired token');
  }
}
