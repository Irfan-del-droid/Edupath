import { Router } from 'express';
import { getEvaluationById, runEvaluation } from '../controllers/evaluationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.get('/:id', getEvaluationById);
router.post('/evaluate', runEvaluation);

export default router;
