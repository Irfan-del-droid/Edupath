import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { submitProofSchema } from '@edupath/shared';
import { proofService } from '../services/proof/proofService.js';
import { evaluationService } from '../services/evaluation/evaluationService.js';

export async function submitProof(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const parseResult = submitProofSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parseResult.error.errors[0].message },
      });
      return;
    }

    const proof = await proofService.submitProof(userId, parseResult.data);

    // Automatically trigger AI evaluation on submission as specified in the proof-of-work loop
    const evaluation = await evaluationService.evaluateSubmission(proof.id);

    res.status(201).json({
      success: true,
      data: {
        proof: {
          ...proof,
          status: 'evaluated',
          evaluation,
        },
        evaluation,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'PROOF_ERROR', message: err.message } });
  }
}

export async function getProofs(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const proofs = await proofService.getUserProofs(userId);
    res.json({ success: true, data: proofs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'PROOFS_ERROR', message: err.message } });
  }
}

export async function getProofById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const proof = await proofService.getProofById(id);
    if (!proof) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Proof not found' } });
      return;
    }

    res.json({ success: true, data: proof });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'PROOF_ERROR', message: err.message } });
  }
}
