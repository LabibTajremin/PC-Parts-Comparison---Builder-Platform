import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  adminId?: string;
  adminEmail?: string;
}

export interface JwtPayload {
  adminId: string;
  email: string;
  iat?: number;
  exp?: number;
}
