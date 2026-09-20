import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getDb } from '../db/index.js';
import * as schema from '../db/schema/index.js';
import { eq } from 'drizzle-orm';

export async function getChallenges(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const db = await getDb();
    const rows = await db
      .select({
        id: schema.challenges.id,
        skillId: schema.challenges.skillId,
        skillName: schema.skills.name,
        title: schema.challenges.title,
        slug: schema.challenges.slug,
        description: schema.challenges.description,
        scenario: schema.challenges.scenario,
        prompt: schema.challenges.prompt,
        expectedDeliverablesJson: schema.challenges.expectedDeliverablesJson,
        starterTemplate: schema.challenges.starterTemplate,
        rubricJson: schema.challenges.rubricJson,
        difficulty: schema.challenges.difficulty,
        estimatedMinutes: schema.challenges.estimatedMinutes,
      })
      .from(schema.challenges)
      .innerJoin(schema.skills, eq(schema.challenges.skillId, schema.skills.id));

    const formatted = rows.map((r: any) => ({
      ...r,
      expectedDeliverables: JSON.parse(r.expectedDeliverablesJson),
      rubric: JSON.parse(r.rubricJson),
    }));

    res.json({ success: true, data: formatted });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'CHALLENGES_ERROR', message: err.message } });
  }
}

export async function getChallengeById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const db = await getDb();
    const rows = await db
      .select({
        id: schema.challenges.id,
        skillId: schema.challenges.skillId,
        skillName: schema.skills.name,
        title: schema.challenges.title,
        slug: schema.challenges.slug,
        description: schema.challenges.description,
        scenario: schema.challenges.scenario,
        prompt: schema.challenges.prompt,
        expectedDeliverablesJson: schema.challenges.expectedDeliverablesJson,
        starterTemplate: schema.challenges.starterTemplate,
        rubricJson: schema.challenges.rubricJson,
        difficulty: schema.challenges.difficulty,
        estimatedMinutes: schema.challenges.estimatedMinutes,
      })
      .from(schema.challenges)
      .innerJoin(schema.skills, eq(schema.challenges.skillId, schema.skills.id))
      .where(eq(schema.challenges.id, id));

    if (rows.length === 0) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Challenge not found' } });
      return;
    }

    const r = rows[0];
    res.json({
      success: true,
      data: {
        ...r,
        expectedDeliverables: JSON.parse(r.expectedDeliverablesJson),
        rubric: JSON.parse(r.rubricJson),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'CHALLENGE_ERROR', message: err.message } });
  }
}
