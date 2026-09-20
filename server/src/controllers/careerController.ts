import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getDb } from '../db/index.js';
import * as schema from '../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { agentService } from '../services/agent/agentService.js';
import { createCareerGoalSchema } from '@edupath/shared';

export async function getCareerGoals(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const db = await getDb();
    const rows = await db.select().from(schema.careerGoals).where(eq(schema.careerGoals.userId, userId));
    res.json({ success: true, data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'CAREER_ERROR', message: err.message } });
  }
}

export async function setCareerGoal(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const parseResult = createCareerGoalSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parseResult.error.errors[0].message },
      });
      return;
    }

    const db = await getDb();
    const { targetRole, targetLevel, timelineWeeks } = parseResult.data;

    const existing = await db.select().from(schema.careerGoals).where(eq(schema.careerGoals.userId, userId));
    if (existing.length > 0) {
      await db
        .update(schema.careerGoals)
        .set({ targetRole, targetLevel, timelineWeeks, updatedAt: new Date() })
        .where(eq(schema.careerGoals.userId, userId));
    } else {
      await db.insert(schema.careerGoals).values({
        id: `goal-${Date.now()}`,
        userId,
        targetRole,
        targetLevel,
        timelineWeeks,
        status: 'active',
      });
    }

    const updated = await db.select().from(schema.careerGoals).where(eq(schema.careerGoals.userId, userId));
    res.json({ success: true, data: updated[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'CAREER_UPDATE_ERROR', message: err.message } });
  }
}

export async function getCareerReadiness(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const readiness = await agentService.calculateCareerReadiness(userId);
    res.json({ success: true, data: readiness });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'READINESS_ERROR', message: err.message } });
  }
}
