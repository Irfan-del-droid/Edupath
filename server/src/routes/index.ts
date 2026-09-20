import { Router } from 'express';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import careerRoutes from './career.routes.js';
import skillsRoutes from './skills.routes.js';
import roadmapRoutes from './roadmap.routes.js';
import challengeRoutes from './challenge.routes.js';
import proofRoutes from './proof.routes.js';
import evaluationRoutes from './evaluation.routes.js';
import copilotRoutes from './copilot.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import storageRoutes from './storage.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/career-goals', careerRoutes);
router.use('/skills', skillsRoutes);
router.use('/roadmap', roadmapRoutes);
router.use('/challenges', challengeRoutes);
router.use('/proof', proofRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/copilot', copilotRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/storage', storageRoutes);

export default router;
