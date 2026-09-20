import { getDb } from '../../db/index.js';
import * as schema from '../../db/schema/index.js';
import { eq, desc, asc } from 'drizzle-orm';
import { Roadmap, RoadmapItem } from '@edupath/shared';

export class RoadmapService {
  async getActiveRoadmap(userId: string): Promise<Roadmap | null> {
    const db = await getDb();
    const roadmapsList = await db
      .select()
      .from(schema.roadmaps)
      .where(eq(schema.roadmaps.userId, userId))
      .orderBy(desc(schema.roadmaps.version))
      .limit(1);

    if (roadmapsList.length === 0) {
      return null;
    }

    const activeRoadmap = roadmapsList[0];
    const rawItems = await db
      .select({
        id: schema.roadmapItems.id,
        roadmapId: schema.roadmapItems.roadmapId,
        weekNumber: schema.roadmapItems.weekNumber,
        orderIndex: schema.roadmapItems.orderIndex,
        skillId: schema.roadmapItems.skillId,
        skillName: schema.skills.name,
        title: schema.roadmapItems.title,
        objective: schema.roadmapItems.objective,
        estimatedMinutes: schema.roadmapItems.estimatedMinutes,
        status: schema.roadmapItems.status,
        isNextBestAction: schema.roadmapItems.isNextBestAction,
        evidenceRequired: schema.roadmapItems.evidenceRequired,
      })
      .from(schema.roadmapItems)
      .innerJoin(schema.skills, eq(schema.roadmapItems.skillId, schema.skills.id))
      .where(eq(schema.roadmapItems.roadmapId, activeRoadmap.id))
      .orderBy(asc(schema.roadmapItems.weekNumber), asc(schema.roadmapItems.orderIndex));

    return {
      id: activeRoadmap.id,
      userId: activeRoadmap.userId,
      careerGoalId: activeRoadmap.careerGoalId,
      title: activeRoadmap.title,
      version: activeRoadmap.version,
      generatedAt: new Date(activeRoadmap.generatedAt).toISOString(),
      updatedAt: new Date(activeRoadmap.updatedAt).toISOString(),
      items: rawItems.map((item: any) => ({
        ...item,
        status: item.status as any,
      })),
    };
  }

  async replanRoadmap(userId: string, reason: string): Promise<Roadmap> {
    const db = await getDb();
    const currentRoadmap = await this.getActiveRoadmap(userId);

    // Get current user skills to inspect what is now verified
    const userSkills = await db.select().from(schema.userSkills).where(eq(schema.userSkills.userId, userId));
    const evalSkill = userSkills.find((us: any) => us.skillId === 'skill-ai-evaluation');
    const isAiEvalVerified = evalSkill && evalSkill.confidenceScore >= 70;

    let updatedVersion = (currentRoadmap?.version || 1) + 1;
    let roadmapId = currentRoadmap?.id || 'rdm-arjun-active';

    // Update existing roadmap version timestamp
    await db
      .update(schema.roadmaps)
      .set({ version: updatedVersion, updatedAt: new Date() })
      .where(eq(schema.roadmaps.id, roadmapId));

    if (isAiEvalVerified) {
      // Mark Week 1 Item 1 as COMPLETED
      await db
        .update(schema.roadmapItems)
        .set({ status: 'completed', isNextBestAction: false })
        .where(eq(schema.roadmapItems.id, 'rdm-item-1'));

      // Promote Autonomous Agent Architecture (Week 2 Item 1) to Next Best Action
      await db
        .update(schema.roadmapItems)
        .set({ isNextBestAction: true, status: 'in_progress' })
        .where(eq(schema.roadmapItems.id, 'rdm-item-3'));
    }

    // Log the agent action
    await db.insert(schema.agentActions).values({
      id: `act-${Date.now()}`,
      userId,
      actionType: 'ROADMAP_REPLAN',
      payloadJson: JSON.stringify({ reason, updatedVersion, timestamp: new Date() }),
    });

    const refreshed = await this.getActiveRoadmap(userId);
    return refreshed!;
  }
}

export const roadmapService = new RoadmapService();
