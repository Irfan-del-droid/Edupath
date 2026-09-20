import { Router } from 'express';
import { getCareerGoals, setCareerGoal, getCareerReadiness } from '../controllers/careerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.get('/', getCareerGoals);
router.post('/', setCareerGoal);
router.get('/readiness', getCareerReadiness);

export default router;
