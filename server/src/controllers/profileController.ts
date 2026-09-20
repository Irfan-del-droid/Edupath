import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { profileService } from '../services/profile/profileService.js';
import { updateProfileSchema } from '@edupath/shared';

export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const profile = await profileService.getProfileByUserId(userId);
    res.json({ success: true, data: profile });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'PROFILE_ERROR', message: err.message } });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const parseResult = updateProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parseResult.error.errors[0].message },
      });
      return;
    }

    const updated = await profileService.updateProfile(userId, parseResult.data);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'PROFILE_UPDATE_ERROR', message: err.message } });
  }
}

export async function uploadResumeText(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { resumeText, resumeUrl } = req.body;
    if (!resumeText) {
      res.status(400).json({ success: false, error: { code: 'MISSING_TEXT', message: 'resumeText is required' } });
      return;
    }

    const result = await profileService.processResumeText(userId, resumeText, resumeUrl);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'RESUME_PROCESS_ERROR', message: err.message } });
  }
}
