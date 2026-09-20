import { Router } from 'express';
import { getRoadmap, replanRoadmap } from '../controllers/roadmapController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.get('/', getRoadmap);
router.post('/replan', replanRoadmap);

export default router;
