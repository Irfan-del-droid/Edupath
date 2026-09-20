import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getDb } from '../db/index.js';
import * as schema from '../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { agentService } from '../services/agent/agentService.js';
import { skillsService } from '../services/skills/skillsService.js';
import { roadmapService } from '../services/roadmap/roadmapService.js';
import { proofService } from '../services/proof/proofService.js';
import { DashboardData } from '@edupath/shared';

export async function getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const db = await getDb();

    // Fetch user record
    const userRows = await db.select().from(schema.users).where(eq(schema.users.id, userId));
    const user = userRows[0];

    // Fetch profile
    const profileRows = await db.select().from(schema.profiles).where(eq(schema.profiles.userId, userId));
    const profile = profileRows[0] || {
      id: 'prof-default',
      userId,
      headline: 'Candidate',
      bio: '',
      currentRole: 'Student',
      experienceYears: 0,
      education: '',
      weeklyHoursAvailable: 15,
      completeness: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Fetch career goal
    const goalRows = await db.select().from(schema.careerGoals).where(eq(schema.careerGoals.userId, userId));
    const careerGoal = goalRows[0] || {
      id: 'goal-default',
      userId,
      targetRole: 'AI Product Manager',
      targetLevel: 'Mid-Level',
      timelineWeeks: 12,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Compute readiness, skills, gaps, next action, roadmap, recent proof
    const readiness = await agentService.calculateCareerReadiness(userId);
    const userSkills = await skillsService.getUserSkills(userId);
    const topGaps = await skillsService.calculateAndStoreSkillGaps(userId);
    const nextBestAction = await agentService.calculateNextBestAction(userId);
    const activeRoadmap = (await roadmapService.getActiveRoadmap(userId)) || {
      id: 'rdm-empty',
      userId,
      careerGoalId: careerGoal.id,
      title: '30-Day Plan',
      version: 1,
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [],
    };
    const recentProof = await proofService.getUserProofs(userId);

    const dashboardData: DashboardData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as any,
        createdAt: new Date(user.createdAt).toISOString(),
        updatedAt: new Date(user.updatedAt).toISOString(),
      },
      profile: {
        id: profile.id,
        userId: profile.userId,
        headline: profile.headline || '',
        bio: profile.bio || '',
        currentRole: profile.currentRole || '',
        experienceYears: profile.experienceYears || 0,
        education: profile.education || '',
        resumeUrl: profile.resumeUrl,
        weeklyHoursAvailable: profile.weeklyHoursAvailable || 15,
        completeness: profile.completeness || 50,
        createdAt: new Date(profile.createdAt).toISOString(),
        updatedAt: new Date(profile.updatedAt).toISOString(),
      },
      careerGoal: {
        id: careerGoal.id,
        userId: careerGoal.userId,
        targetRole: careerGoal.targetRole,
        targetLevel: careerGoal.targetLevel,
        timelineWeeks: careerGoal.timelineWeeks,
        status: careerGoal.status as any,
        createdAt: new Date(careerGoal.createdAt).toISOString(),
        updatedAt: new Date(careerGoal.updatedAt).toISOString(),
      },
      readiness,
      userSkills,
      topGaps,
      nextBestAction,
      activeRoadmap,
      recentProof,
    };

    res.json({ success: true, data: dashboardData });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'DASHBOARD_ERROR', message: err.message } });
  }
}
