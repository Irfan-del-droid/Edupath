import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { getDb } from '../db/index.js';
import * as schema from '../db/schema/index.js';
import { eq } from 'drizzle-orm';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication token missing or invalid' },
    });
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as { id: string; email: string };
    const db = await getDb();
    const userRecords = await db.select().from(schema.users).where(eq(schema.users.id, payload.id));

    if (!userRecords || userRecords.length === 0) {
      res.status(401).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User associated with token no longer exists' },
      });
      return;
    }

    const user = userRecords[0];
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    next();
  } catch (err: any) {
    res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Token expired or invalid' },
    });
  }
}
