import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { roadmapService } from '../services/roadmap/roadmapService.js';

export async function getRoadmap(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const roadmap = await roadmapService.getActiveRoadmap(userId);
    res.json({ success: true, data: roadmap });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'ROADMAP_ERROR', message: err.message } });
  }
}

export async function replanRoadmap(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { reason } = req.body || { reason: 'User requested manual replan' };
    const roadmap = await roadmapService.replanRoadmap(userId, reason || 'User requested manual replan');
    res.json({ success: true, data: roadmap });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'ROADMAP_REPLAN_ERROR', message: err.message } });
  }
}
