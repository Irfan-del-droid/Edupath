import { Router } from 'express';
import { chatCopilot, getConversationHistory } from '../controllers/copilotController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.post('/chat', chatCopilot);
router.get('/history', getConversationHistory);

export default router;
