import { Router } from 'express';
import { getSkills, getSkillGraph, getSkillGaps } from '../controllers/skillsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.get('/', getSkills);
router.get('/graph', getSkillGraph);
router.get('/gaps', getSkillGaps);

export default router;
