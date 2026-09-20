import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/index.js';
import * as schema from '../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { config } from '../config/index.js';
import { registerSchema, loginSchema } from '@edupath/shared';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parseResult.error.errors[0].message },
      });
      return;
    }

    const { email, password, name, role } = parseResult.data;
    const db = await getDb();

    const existing = await db.select().from(schema.users).where(eq(schema.users.email, email));
    if (existing.length > 0) {
      res.status(409).json({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: 'An account with this email already exists' },
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `usr-${uuidv4()}`;

    await db.insert(schema.users).values({
      id: userId,
      email,
      passwordHash,
      name,
      role,
    });

    await db.insert(schema.profiles).values({
      id: `prof-${uuidv4()}`,
      userId,
      headline: '',
      bio: '',
      currentRole: role === 'student' ? 'Student' : 'Associate',
      experienceYears: 0,
      education: '',
      completeness: 30,
    });

    await db.insert(schema.careerGoals).values({
      id: `goal-${uuidv4()}`,
      userId,
      targetRole: 'AI Product Manager',
      targetLevel: 'Mid-Level',
      timelineWeeks: 12,
      status: 'active',
    });

    const token = jwt.sign({ id: userId, email }, config.jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: userId, email, name, role },
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parseResult.error.errors[0].message },
      });
      return;
    }

    const { email, password } = parseResult.data;
    const db = await getDb();

    const users = await db.select().from(schema.users).where(eq(schema.users.email, email));
    if (users.length === 0) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
      return;
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '7d' });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } });
    return;
  }

  res.json({
    success: true,
    data: { user: req.user },
  });
}
