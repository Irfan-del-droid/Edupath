import { Router } from 'express';
import { getProfile, updateProfile, uploadResumeText } from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/resume', uploadResumeText);

export default router;
