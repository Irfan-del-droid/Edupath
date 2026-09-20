import { Router } from 'express';
import { getChallenges, getChallengeById } from '../controllers/challengeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.get('/', getChallenges);
router.get('/:id', getChallengeById);

export default router;
