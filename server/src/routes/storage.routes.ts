import { Router } from 'express';
import multer from 'multer';
import { uploadFileHandler, serveLocalFile } from '../controllers/storageController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.post('/upload', authenticateToken, upload.single('file'), uploadFileHandler);
router.get('/files/:folder/:filename', serveLocalFile);

export default router;
