import { getDb } from '../../db/index.js';
import * as schema from '../../db/schema/index.js';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { ProofOfWork, SubmitProofInput } from '@edupath/shared';
import { evaluationService } from '../evaluation/evaluationService.js';

export class ProofService {
  async submitProof(userId: string, input: SubmitProofInput): Promise<ProofOfWork> {
    const db = await getDb();
    const proofId = `proof-${uuidv4()}`;

    await db.insert(schema.proofOfWork).values({
      id: proofId,
      userId,
      challengeId: input.challengeId,
      skillId: input.skillId,
      title: input.title,
      submissionType: input.submissionType,
      content: input.content,
      fileUrl: input.fileUrl || null,
      fileName: input.fileName || null,
      status: 'submitted',
      submittedAt: new Date(),
    });

    const created = await this.getProofById(proofId);
    return created!;
  }

  async getProofById(proofId: string): Promise<ProofOfWork | null> {
    const db = await getDb();
    const rows = await db.select().from(schema.proofOfWork).where(eq(schema.proofOfWork.id, proofId));
    if (rows.length === 0) return null;

    const p = rows[0];
    const evaluation = await evaluationService.getEvaluationByProof(p.id);

    return {
      id: p.id,
      userId: p.userId,
      challengeId: p.challengeId,
      skillId: p.skillId,
      title: p.title,
      submissionType: p.submissionType as any,
      content: p.content,
      fileUrl: p.fileUrl,
      fileName: p.fileName,
      status: p.status as any,
      submittedAt: new Date(p.submittedAt).toISOString(),
      evaluation,
    };
  }

  async getUserProofs(userId: string): Promise<ProofOfWork[]> {
    const db = await getDb();
    const rows = await db
      .select()
      .from(schema.proofOfWork)
      .where(eq(schema.proofOfWork.userId, userId))
      .orderBy(desc(schema.proofOfWork.submittedAt));

    const results: ProofOfWork[] = [];
    for (const p of rows) {
      const evaluation = await evaluationService.getEvaluationByProof(p.id);
      results.push({
        id: p.id,
        userId: p.userId,
        challengeId: p.challengeId,
        skillId: p.skillId,
        title: p.title,
        submissionType: p.submissionType as any,
        content: p.content,
        fileUrl: p.fileUrl,
        fileName: p.fileName,
        status: p.status as any,
        submittedAt: new Date(p.submittedAt).toISOString(),
        evaluation,
      });
    }

    return results;
  }
}

export const proofService = new ProofService();
