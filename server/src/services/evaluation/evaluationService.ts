import { getDb } from '../../db/index.js';
import * as schema from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { aiProvider } from '../ai/aiProvider.js';
import { roadmapService } from '../roadmap/roadmapService.js';
import { AIEvaluation } from '@edupath/shared';

export class EvaluationService {
  async evaluateSubmission(proofId: string): Promise<AIEvaluation> {
    const db = await getDb();

    // 1. Fetch proof
    const proofRows = await db.select().from(schema.proofOfWork).where(eq(schema.proofOfWork.id, proofId));
    if (proofRows.length === 0) {
      throw new Error(`Proof with ID ${proofId} not found`);
    }
    const proof = proofRows[0];

    // 2. Fetch challenge
    const chalRows = await db.select().from(schema.challenges).where(eq(schema.challenges.id, proof.challengeId));
    if (chalRows.length === 0) {
      throw new Error(`Challenge with ID ${proof.challengeId} not found`);
    }
    const challenge = chalRows[0];

    // 3. Fetch skill
    const skillRows = await db.select().from(schema.skills).where(eq(schema.skills.id, proof.skillId));
    const skill = skillRows[0];

    // 4. Run AI Evaluation
    const evalResult = await aiProvider.evaluateProof({
      challengeTitle: challenge.title,
      skillName: skill ? skill.name : 'AI Evaluation',
      scenario: challenge.scenario,
      prompt: challenge.prompt,
      rubric: JSON.parse(challenge.rubricJson),
      submissionContent: proof.content,
    });

    const evalId = `eval-${uuidv4()}`;

    // 5. Store evaluation record
    await db.insert(schema.evaluations).values({
      id: evalId,
      proofId: proof.id,
      overallScore: evalResult.overallScore,
      structureScore: evalResult.structureScore,
      depthScore: evalResult.depthScore,
      practicalityScore: evalResult.practicalityScore,
      strengthsJson: JSON.stringify(evalResult.strengths),
      weaknessesJson: JSON.stringify(evalResult.weaknesses),
      missingElementsJson: JSON.stringify(evalResult.missingElements),
      recommendationsJson: JSON.stringify(evalResult.recommendations),
      skillConfidenceDelta: evalResult.skillConfidenceDelta,
      nextActionTitle: evalResult.nextActionTitle,
      nextActionReason: evalResult.nextActionReason,
      evaluatedAt: new Date(),
    });

    // 6. Update proof status
    await db
      .update(schema.proofOfWork)
      .set({ status: 'evaluated' })
      .where(eq(schema.proofOfWork.id, proof.id));

    // 7. Update User Skill state (lifts AI Evaluation from 38% -> 75%)
    const userSkillRows = await db
      .select()
      .from(schema.userSkills)
      .where(eq(schema.userSkills.skillId, proof.skillId));

    if (userSkillRows.length > 0) {
      const currentUs = userSkillRows[0];
      const newConfidence = Math.min(100, currentUs.confidenceScore + evalResult.skillConfidenceDelta);
      const newLevel = Math.max(currentUs.currentLevel, 4);

      await db
        .update(schema.userSkills)
        .set({
          confidenceScore: newConfidence,
          currentLevel: newLevel,
          verifiedEvidenceCount: currentUs.verifiedEvidenceCount + 1,
          status: newConfidence >= 70 ? 'verified' : 'in_progress',
          lastAssessedAt: new Date(),
        })
        .where(eq(schema.userSkills.id, currentUs.id));
    }

    // 8. Replan Roadmap
    await roadmapService.replanRoadmap(
      proof.userId,
      `Proof evaluated with score ${evalResult.overallScore}%. Skill confidence increased by +${evalResult.skillConfidenceDelta}%.`
    );

    return {
      id: evalId,
      proofId: proof.id,
      overallScore: evalResult.overallScore,
      structureScore: evalResult.structureScore,
      depthScore: evalResult.depthScore,
      practicalityScore: evalResult.practicalityScore,
      strengths: evalResult.strengths,
      weaknesses: evalResult.weaknesses,
      missingElements: evalResult.missingElements,
      recommendations: evalResult.recommendations,
      skillConfidenceDelta: evalResult.skillConfidenceDelta,
      nextActionTitle: evalResult.nextActionTitle,
      nextActionReason: evalResult.nextActionReason,
      evaluatedAt: new Date().toISOString(),
    };
  }

  async getEvaluation(evaluationId: string): Promise<AIEvaluation | null> {
    const db = await getDb();
    const rows = await db.select().from(schema.evaluations).where(eq(schema.evaluations.id, evaluationId));
    if (rows.length === 0) return null;

    const e = rows[0];
    return {
      id: e.id,
      proofId: e.proofId,
      overallScore: e.overallScore,
      structureScore: e.structureScore,
      depthScore: e.depthScore,
      practicalityScore: e.practicalityScore,
      strengths: JSON.parse(e.strengthsJson),
      weaknesses: JSON.parse(e.weaknessesJson),
      missingElements: JSON.parse(e.missingElementsJson),
      recommendations: JSON.parse(e.recommendationsJson),
      skillConfidenceDelta: e.skillConfidenceDelta,
      nextActionTitle: e.nextActionTitle,
      nextActionReason: e.nextActionReason,
      evaluatedAt: new Date(e.evaluatedAt).toISOString(),
    };
  }

  async getEvaluationByProof(proofId: string): Promise<AIEvaluation | null> {
    const db = await getDb();
    const rows = await db.select().from(schema.evaluations).where(eq(schema.evaluations.proofId, proofId));
    if (rows.length === 0) return null;
    return this.getEvaluation(rows[0].id);
  }
}

export const evaluationService = new EvaluationService();
