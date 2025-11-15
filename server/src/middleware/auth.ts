import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/auth.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export async function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies.auth_token;

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = { id: payload.userId };
    }
  }

  next();
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = { id: payload.userId };
  next();
}
