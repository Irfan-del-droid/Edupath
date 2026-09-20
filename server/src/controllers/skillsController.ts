import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { skillsService } from '../services/skills/skillsService.js';

export async function getSkills(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const userSkills = await skillsService.getUserSkills(userId);
    res.json({ success: true, data: userSkills });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SKILLS_ERROR', message: err.message } });
  }
}

export async function getSkillGraph(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const graph = await skillsService.getSkillGraph(userId);
    res.json({ success: true, data: graph });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'GRAPH_ERROR', message: err.message } });
  }
}

export async function getSkillGaps(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const gaps = await skillsService.calculateAndStoreSkillGaps(userId);
    res.json({ success: true, data: gaps });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'GAPS_ERROR', message: err.message } });
  }
}
