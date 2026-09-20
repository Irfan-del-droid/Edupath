import { getDb } from '../../db/index.js';
import * as schema from '../../db/schema/index.js';
import { eq, desc } from 'drizzle-orm';
import { NextBestAction, CareerReadiness } from '@edupath/shared';
import { skillsService } from '../skills/skillsService.js';

export class AgentService {
  /**
   * OBSERVE & REASON:
   * Selects the single highest-impact Next Best Action tailored to the user's verified state.
   */
  async calculateNextBestAction(userId: string): Promise<NextBestAction> {
    const db = await getDb();
    const userSkills = await skillsService.getUserSkills(userId);

    const evalSkill = userSkills.find((s) => s.skillId === 'skill-ai-evaluation');
    const isAiEvalVerified = evalSkill && evalSkill.confidenceScore >= 70;

    if (!isAiEvalVerified) {
      return {
        id: 'nba-eval-framework',
        title: 'Design an AI Evaluation Framework for a Customer-Support Agent',
        rationale: 'AI Evaluation & Benchmarking is currently your largest verified skill gap (38% confidence) for the AI Product Manager role.',
        targetSkillId: 'skill-ai-evaluation',
        targetSkillName: 'AI Evaluation & Benchmarking',
        challengeId: 'chal-ai-eval-framework',
        estimatedMinutes: 45,
        impactLevel: 'Critical',
        actionType: 'challenge',
        status: 'pending',
      };
    }

    // If AI evaluation is completed/verified, advance to Agent Design!
    return {
      id: 'nba-agent-architecture',
      title: 'Architect an Autonomous Refund Processing Agent',
      rationale: 'With AI Evaluation verified (75%), your next critical bottleneck is Autonomous Agent Architecture & Human-in-the-Loop Safeguards.',
      targetSkillId: 'skill-agent-design',
      targetSkillName: 'AI Agent Architecture',
      challengeId: 'chal-agent-architecture',
      estimatedMinutes: 60,
      impactLevel: 'Critical',
      actionType: 'challenge',
      status: 'pending',
    };
  }

  /**
   * Computes measurable career readiness based on verified evidence count,
   * confidence scores, and domain depth.
   */
  async calculateCareerReadiness(userId: string): Promise<CareerReadiness> {
    const userSkills = await skillsService.getUserSkills(userId);
    const db = await getDb();

    const proofs = await db
      .select()
      .from(schema.proofOfWork)
      .where(eq(schema.proofOfWork.userId, userId));

    const evaluatedProofs = proofs.filter((p: any) => p.status === 'evaluated');
    const verifiedSkills = userSkills.filter((s) => s.confidenceScore >= 70);

    const evalSkill = userSkills.find((s) => s.skillId === 'skill-ai-evaluation');
    const agentSkill = userSkills.find((s) => s.skillId === 'skill-agent-design');

    // Aggregate overall readiness
    let scoreSum = 0;
    for (const us of userSkills) {
      scoreSum += us.confidenceScore;
    }
    const averageScore = userSkills.length > 0 ? Math.round(scoreSum / userSkills.length) : 50;

    // Weight technical pillars
    const discoveryScore = Math.round(((userSkills.find(s => s.skillId === 'skill-prod-discovery')?.confidenceScore || 80) +
      (userSkills.find(s => s.skillId === 'skill-prd-writing')?.confidenceScore || 80)) / 2);

    const aiTechnicalScore = evalSkill?.confidenceScore || 38;
    const analyticsScore = userSkills.find(s => s.skillId === 'skill-analytics')?.confidenceScore || 61;
    const agentArchScore = agentSkill?.confidenceScore || 22;

    const criticalGapsCount = userSkills.filter(s => s.confidenceScore < 60).length;

    return {
      userId,
      overallScore: averageScore, // Typically 72% before evaluation, jumps to ~78-82% after evaluation
      skillsVerifiedCount: verifiedSkills.length,
      totalRequiredSkills: userSkills.length,
      proofArtifactsCount: evaluatedProofs.length,
      projectsCount: 2,
      interviewReadinessScore: Math.round(averageScore * 0.95),
      criticalGapsCount,
      breakdown: {
        productDiscovery: discoveryScore,
        aiTechnicalDepth: aiTechnicalScore,
        analyticsAndMetrics: analyticsScore,
        agentArchitecture: agentArchScore,
      },
    };
  }
}

export const agentService = new AgentService();
