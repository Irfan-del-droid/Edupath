import { getDb } from '../../db/index.js';
import * as schema from '../../db/schema/index.js';
import { eq, and } from 'drizzle-orm';
import { Skill, SkillGap, UserSkill } from '@edupath/shared';

export class SkillsService {
  async getAllSkills() {
    const db = await getDb();
    return db.select().from(schema.skills);
  }

  async getUserSkills(userId: string): Promise<UserSkill[]> {
    const db = await getDb();
    const rows = await db
      .select({
        id: schema.userSkills.id,
        userId: schema.userSkills.userId,
        skillId: schema.userSkills.skillId,
        skillName: schema.skills.name,
        category: schema.skills.category,
        currentLevel: schema.userSkills.currentLevel,
        confidenceScore: schema.userSkills.confidenceScore,
        verifiedEvidenceCount: schema.userSkills.verifiedEvidenceCount,
        status: schema.userSkills.status,
        lastAssessedAt: schema.userSkills.lastAssessedAt,
      })
      .from(schema.userSkills)
      .innerJoin(schema.skills, eq(schema.userSkills.skillId, schema.skills.id))
      .where(eq(schema.userSkills.userId, userId));

    return rows.map((r: any) => ({
      ...r,
      lastAssessedAt: r.lastAssessedAt ? new Date(r.lastAssessedAt).toISOString() : null,
    }));
  }

  async getSkillGraph(userId: string) {
    const db = await getDb();
    const allSkills = await db.select().from(schema.skills);
    const userSkillsList = await this.getUserSkills(userId);
    const dependencies = await db.select().from(schema.skillDependencies);

    const userSkillMap = new Map(userSkillsList.map((us) => [us.skillId, us]));

    // Layout coordinates in editorial flow
    const positions: Record<string, { x: number; y: number }> = {
      'skill-prod-discovery': { x: 50, y: 50 },
      'skill-user-research': { x: 50, y: 190 },
      'skill-prd-writing': { x: 380, y: 120 },
      'skill-product-strategy': { x: 720, y: 120 },
      'skill-analytics': { x: 50, y: 340 },
      'skill-ai-fundamentals': { x: 380, y: 340 },
      'skill-llm-concepts': { x: 720, y: 340 },
      'skill-ai-evaluation': { x: 1060, y: 230 },
      'skill-agent-design': { x: 1400, y: 230 },
    };

    const nodes = allSkills.map((s: any) => {
      const us = userSkillMap.get(s.id);
      const confidence = us ? us.confidenceScore : 10;
      const verifiedCount = us ? us.verifiedEvidenceCount : 0;
      const status = us ? us.status : 'unassessed';
      const pos = positions[s.id] || { x: 200, y: 200 };

      return {
        id: s.id,
        type: 'editorialSkillNode',
        position: pos,
        data: {
          id: s.id,
          name: s.name,
          category: s.category,
          description: s.description,
          targetLevel: s.targetLevel,
          confidenceScore: confidence,
          verifiedEvidenceCount: verifiedCount,
          status,
        },
      };
    });

    const edges = dependencies.map((dep: any) => ({
      id: `edge-${dep.skillId}-${dep.prerequisiteSkillId}`,
      source: dep.prerequisiteSkillId,
      target: dep.skillId,
      animated: dep.dependencyType === 'strict',
      style: { stroke: '#111111', strokeWidth: 1.5 },
    }));

    return { nodes, edges };
  }

  async calculateAndStoreSkillGaps(userId: string): Promise<SkillGap[]> {
    const db = await getDb();
    const allSkills = await db.select().from(schema.skills);
    const userSkillsList = await this.getUserSkills(userId);
    const dependencies = await db.select().from(schema.skillDependencies);

    const userSkillMap = new Map(userSkillsList.map((us) => [us.skillId, us]));

    // Check which skills have prerequisites met
    const gaps: SkillGap[] = [];

    for (const skill of allSkills) {
      const us = userSkillMap.get(skill.id);
      const currentLevel = us ? us.currentLevel : 1;
      const confidence = us ? us.confidenceScore : 15;
      const gapSize = Math.max(0, skill.targetLevel - currentLevel);

      // Check prerequisites
      const prereqDeps = dependencies.filter((d: any) => d.skillId === skill.id);
      let prerequisitesMet = true;
      for (const pd of prereqDeps) {
        const prereqUs = userSkillMap.get(pd.prerequisiteSkillId);
        if (!prereqUs || prereqUs.confidenceScore < 60) {
          prerequisitesMet = false;
          break;
        }
      }

      // Prioritization logic:
      // If gapSize >= 2 and confidence < 50% -> Critical or High
      let priority: 'Critical' | 'High' | 'Medium' | 'Low' = 'Low';
      let rationale = '';

      if (skill.id === 'skill-ai-evaluation') {
        priority = 'Critical';
        rationale = 'AI Evaluation is your largest verified skill gap for the AI Product Manager role.';
      } else if (skill.id === 'skill-agent-design') {
        priority = confidence < 35 ? 'Critical' : 'High';
        rationale = 'Autonomous agent workflows require strong foundations in AI evaluation and safety guardrails.';
      } else if (gapSize >= 2) {
        priority = 'High';
        rationale = `Requires proof artifacts to lift verified confidence from ${confidence}% to ${skill.targetLevel * 20}%.`;
      } else if (gapSize === 1) {
        priority = 'Medium';
        rationale = 'Incremental domain polish needed to achieve full rubric mastery.';
      } else {
        priority = 'Low';
        rationale = 'Target capability demonstrated with robust evidence.';
      }

      if (gapSize > 0 || confidence < 75) {
        gaps.push({
          id: `gap-${skill.id}`,
          userId,
          skillId: skill.id,
          skillName: skill.name,
          category: skill.category as any,
          currentLevel,
          targetLevel: skill.targetLevel,
          confidenceScore: confidence,
          gapSize,
          priority,
          rationale,
          prerequisitesMet,
          estimatedHoursToClose: gapSize * 4,
        });
      }
    }

    // Sort: Critical first, then High, then Medium
    const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    gaps.sort((a, b) => order[a.priority] - order[b.priority] || a.confidenceScore - b.confidenceScore);

    return gaps;
  }
}

export const skillsService = new SkillsService();
