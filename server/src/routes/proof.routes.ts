import { Router } from 'express';
import { submitProof, getProofs, getProofById } from '../controllers/proofController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.post('/', submitProof);
router.get('/', getProofs);
router.get('/:id', getProofById);

export default router;
