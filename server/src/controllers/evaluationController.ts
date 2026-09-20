import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { evaluationService } from '../services/evaluation/evaluationService.js';

export async function getEvaluationById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const evaluation = await evaluationService.getEvaluation(id);
    if (!evaluation) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Evaluation not found' } });
      return;
    }
    res.json({ success: true, data: evaluation });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'EVALUATION_ERROR', message: err.message } });
  }
}

export async function runEvaluation(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { proofId } = req.body;
    if (!proofId) {
      res.status(400).json({ success: false, error: { code: 'MISSING_PROOF_ID', message: 'proofId is required' } });
      return;
    }

    const evaluation = await evaluationService.evaluateSubmission(proofId);
    res.json({ success: true, data: evaluation });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'EVALUATION_ERROR', message: err.message } });
  }
}
